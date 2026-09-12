---
title: "How Postgres MVCC and VACUUM Actually Work"
date: "2026-09-04"
description: "Postgres never updates a row in place. It writes a new tuple version, leaves the old one behind, and pays for that choice later through VACUUM, bloat, and a wraparound horizon that can stop writes entirely."
author: "Pranav Nedungadi"
tags: ["Postgres", "Databases", "MVCC", "Deep Dive"]
---

# How Postgres MVCC and VACUUM Actually Work

Someone asks me every few weeks why a Postgres table is three times the size of its data and why `VACUUM` did not shrink it. The answer is that Postgres is not pretending to update rows. It genuinely cannot. Once you internalize that, the rest stops looking like maintenance debt and starts looking like the bill for a deliberate design choice.

I describe PostgreSQL 17 and 18; defaults and errors are checked against the 18.6 and 19 beta docs, with 19 changes flagged.

## An UPDATE is a copy, not an edit

Postgres implements MVCC by copying rows. An `UPDATE` writes a brand new tuple version into a heap page and stamps the old version as dead. A `DELETE` removes nothing; it marks. The old bytes sit on disk until something cleans them up.

The payoff: readers do not block writers and writers do not block readers. A long analytical `SELECT` does not stop an `UPDATE` against the same row; it only pins the version the scan needs.

```sql
SELECT ctid, xmin, xmax FROM accounts WHERE id = 42;
-- ctid  | xmin | xmax
-- (0,1) | 1042 |    0

UPDATE accounts SET balance = balance + 1 WHERE id = 42;

SELECT ctid, xmin, xmax FROM accounts WHERE id = 42;
-- ctid  | xmin | xmax
-- (0,7) | 1088 |    0
```

The first version is still on the page, now with `xmax = 1088`.

## The hidden columns carry the whole system

Every heap tuple starts with a fixed-size header, 23 bytes on most machines, holding the stamps that make concurrent visibility decisions possible:

- `xmin`: the transaction that created this version.
- `xmax`: the transaction that deleted it, or 0 if not deleted. It can also hold a lock or a multixact id.
- `cmin` / `cmax`: command identifiers within the creating and deleting transactions, so a transaction can identify its own earlier statements.
- `ctid`: the physical address, a page number plus line pointer. The header's `t_ctid` points to the next version, forming a chain.

The page then looks like this:

```
page 0
  lp 1 -> [xmin=1042 xmax=1088 ctid=(0,7)]   dead version
  lp 7 -> [xmin=1088 xmax=0    ctid=(0,7)]   live version
```

The index entry still points at `(0,1)`. Postgres follows the chain until it finds a version its snapshot considers visible.

## A snapshot is a set of transaction ids

A snapshot is not a timestamp. It is three things: `xmin`, the lowest transaction id still active; `xmax`, one past the highest completed id; and `xip_list`, the ids in progress when the snapshot was taken. `pg_current_snapshot()` prints one as `xmin:xmax:xip_list`.

For each version, Postgres checks `xmin` against the snapshot. If the creating transaction had not committed as of the snapshot, the version is invisible. Then it checks `xmax`: if the deleting transaction committed as of the snapshot, the version is dead to this reader; if still in progress, the reader sees the old version.

The isolation level decides how often you get a snapshot:

- **Read Committed** is the default. Each statement takes a new snapshot, so two statements in one transaction can see different data. It permits nonrepeatable reads and phantoms. For a targeted `UPDATE`, Postgres re-checks the `WHERE` clause against the newly committed row version before writing.
- **Repeatable Read** takes one snapshot per transaction, so successive reads are stable. Postgres is stronger than the SQL standard requires: it also prevents phantom reads. A write to a row changed by another transaction after the snapshot aborts with `could not serialize access due to concurrent update` and must be retried.
- **Serializable** is Repeatable Read plus Serializable Snapshot Isolation. It uses predicate locks, visible in `pg_locks` with mode `SIReadLock`. These do not block and cannot cause deadlocks; they track read/write dependencies so the server can abort a transaction when no serial ordering exists. That is the serialization anomaly, write skew included. Failures surface as SQLSTATE `40001`.

## The cost: bloat and write amplification

Because updates copy, dead tuples accumulate. They consume heap pages, and until `VACUUM` clears them, index entries still point at them, so index scans visit corpses. Sequential scans read pages full of versions no snapshot can see. That is the write amplification Postgres accepts for never updating in place: one logical change writes heap bytes, WAL, and one new entry per index.

## VACUUM marks space reusable, it rarely returns it

Plain `VACUUM` removes dead versions and marks their space reusable. It does not normally return space to the operating system, except for trailing pages that become entirely free. `VACUUM FULL` and `CLUSTER` rewrite the table, requiring an `ACCESS EXCLUSIVE` lock and temporary disk equal to the table size.

Autovacuum acts on a threshold, not a schedule:

```
vacuum threshold = min(autovacuum_vacuum_max_threshold,
                       autovacuum_vacuum_threshold
                       + autovacuum_vacuum_scale_factor * reltuples)
```

The defaults are a base threshold of 50 tuples and a scale factor of `0.2`. On a 10 million row table that means roughly 2,000,050 dead tuples before a vacuum starts. On a billion row table the raw formula wants 200 million, which is why PostgreSQL 18 added `autovacuum_vacuum_max_threshold`, default 100,000,000 tuples. `autovacuum_naptime` is 1 minute and `autovacuum_max_workers` is 3. A long transaction, abandoned replication slot, or idle-in-transaction session raises the `xmin` horizon and blocks cleanup.

## HOT updates and the fillfactor trade

If an update changes no column referenced by an index, Postgres can apply a heap-only tuple (HOT) update. The new version goes on the same page, the index is untouched, and old versions in the chain can be pruned during normal operation instead of waiting for vacuum. This only works if the page has free space.

That is the fillfactor tradeoff. `fillfactor` defaults to 100 (range 10 to 100). Setting it to 70 fills each page only to 70 percent and reserves the rest for updated copies. You pay with a larger table and more pages to scan, often worth it on a heavily updated table.

## The visibility map and index-only scans

Indexes do not store visibility information, only heap tuples do, so an "index-only" scan must still confirm each candidate is visible. Postgres uses the visibility map, a separate fork holding two bits per heap page: all-visible and all-frozen. It is orders of magnitude smaller than the heap, so it stays cached.

On a candidate entry the scan checks the all-visible bit. If set, the page holds only versions visible to all transactions and the heap fetch is skipped. If not, Postgres reads the heap anyway and gains nothing. Index-only scans pay off only where most pages are unchanged, which is why `VACUUM` setting those bits is a performance feature, not housekeeping.

## Wraparound and freezing

Transaction ids are 32 bits and wrap every 4 billion transactions. Visibility is computed in a circle, so a version that survives roughly 2 billion transactions past creation suddenly looks like it belongs to the future: data loss from the server's point of view. Every table in every database must therefore be vacuumed at least once every 2 billion transactions.

Freezing is the escape hatch. A frozen version is treated as older than every normal transaction, so wraparound cannot touch it. Before PostgreSQL 9.4, freezing replaced the row's `xmin` with `FrozenTransactionId` (2); newer versions set a flag bit in the tuple header and keep the original `xmin`. The defaults, verified against 18.6: `vacuum_freeze_min_age` 50 million, `vacuum_freeze_table_age` 150 million, `autovacuum_freeze_max_age` 200 million, `vacuum_failsafe_age` 1.6 billion. The failsafe drops cost-based delay and skips non-essential work to get freezing done.

If vacuum falls behind, the server says so. In PostgreSQL 18 it warns at 40 million transactions from wraparound and refuses to assign new transaction ids when fewer than 3 million remain:

```
ERROR:  database is not accepting commands that assign new transaction IDs
        to avoid wraparound data loss in database "mydb"
HINT:  Execute a database-wide VACUUM in that database.
```

Reads continue. Writes fail. Clear the blockers, which are old prepared transactions, long sessions, and stale replication slots, then run `VACUUM`. Widening ids to 64 bits would remove the cliff entirely, but despite a target of PostgreSQL 17 and then 18, the 64-bit XIDs patch was returned with feedback and is in no released version. The 32-bit horizon is still real in the PostgreSQL 19 beta, which does move the warning threshold to 100 million transactions remaining.

## What I monitor

Disk usage is the last signal, not the first. I watch `n_dead_tup` and `n_mod_since_analyze` per table, `last_autovacuum`, `n_tup_hot_upd`, `pg_stat_activity` for transactions pinning the horizon, `pg_replication_slots` for old `xmin` values, and `age(relfrozenxid)`. Bloat and wraparound are not exotic failures; they are the scheduled cost of copying rows so readers never wait.
