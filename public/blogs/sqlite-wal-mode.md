---
title: "How SQLite's WAL Mode Works"
date: "2026-09-05"
description: "A look inside SQLite's write-ahead log: frames, checksums, the shared-memory index, checkpoints, and what a crash actually costs you at each synchronous setting."
author: "Pranav Nedungadi"
tags: ["SQLite", "Databases", "Storage", "Deep Dive"]
---

# How SQLite's WAL Mode Works

I once watched a small service fall over because one slow `SELECT` held a read transaction open for 40 seconds while writers queued behind a lock. Switching to WAL mode fixed it in a single pragma. But "just turn on WAL" is advice that works until it doesn't, so I read the docs to understand the mode. Most of it comes down to one inversion: instead of copying old data out of the way and overwriting the database, SQLite appends new data to a side file and leaves the database untouched until later.

## The default: a rollback journal and a lock

Without WAL, SQLite uses a rollback journal. Before changing a page, it writes the page's original content to a `-journal` file, then modifies the database file in place. If the process dies, it copies the original pages back. The `COMMIT` is the act of deleting the journal. This works, but the writer touches the same bytes readers are trying to read. During the part of the commit where the database is modified, readers cannot safely proceed, so the writer holds an exclusive lock on the database file and they block.

WAL inverts that. The original content stays in the database file, and page changes are appended to a `-wal` file. `COMMIT` is just appending a special commit record to the log. The database file is never modified during a write transaction, so a reader can read the old, consistent database while the writer appends new pages to a completely different file. That is why readers and the writer do not block each other.

## The WAL is a sequence of frames

The WAL file is dead simple. It starts with a 32-byte header and then holds a sequence of frames. Every frame is a 24-byte frame header followed by exactly one page of database content (the default page size is 4096 bytes):

```
WAL header (32 bytes)
  magic | format | page-size | checkpoint-seq | salt-1 | salt-2 | cksum

frame 1: [page 5][db-size 0 ][salt-1][salt-2][cksum]  + 4096 bytes of page 5
frame 2: [page 9][db-size 0 ][salt-1][salt-2][cksum]  + 4096 bytes of page 9
frame 3: [page 5][db-size 42][salt-1][salt-2][cksum]  + 4096 bytes of page 5  <- commit
```

The frame header stores the page number it replaces, the salt values copied from the WAL header, and a cumulative checksum over every frame so far. The "db-size" field is zero for ordinary frames. A frame with a non-zero db-size is a commit frame: it means the transaction ends here and the database is now that many pages long. A frame is only considered valid if its salts match the header and its checksums match the cumulative computation.

That cumulative checksum is the recovery story. After a crash, the first connection to open the database scans the WAL from the start, verifying checksums, and stops at the first invalid frame. Whatever it read up to the last valid commit frame is the recovered state. It does not need the `-shm` file; that file is disposable. This is also why an old pre-3.7.0 SQLite refuses to open a WAL database: bytes 18 and 19 of the database header are bumped from 1 to 2.

## The wal-index: a shared-memory hash over the frames

Recovery is a linear scan, but you cannot do a linear scan on every read. A page can appear in many frames, and a reader needs the latest copy before its snapshot point; scanning megabytes of WAL per page would make reads crawl.

So SQLite keeps a wal-index in the `-shm` file: a memory-mapped file in the same directory, usually exactly 32768 bytes, with a 136-byte header followed by a `aPgno` array and an 8192-entry `aHash` table. A lookup is `h = (P * 383) % 8192`; the open-addressed probe walks forward until a zero slot, yielding a tiny candidate set (expected size under 2), which is then checked for the page number and the frame-index bound. That is the O(1)-ish lookup: not a scan of the WAL, and rarely more than a couple of array reads.

The wal-index is transient and never fsynced. It is rebuilt from the WAL on first open. It must live in shared memory because separate processes need to coordinate and see the same read marks. You cannot share memory between machines, which is why WAL does not work on a network filesystem when clients are on different hosts. If only one process will ever touch the file, `PRAGMA locking_mode=EXCLUSIVE` before the first WAL access skips the `-shm` file and uses heap memory instead.

## Checkpointing

Eventually the appended frames have to go back into the database. Copying them over is a checkpoint: sync the WAL, write each page from the WAL into the database in ascending order, then sync the database. After that the WAL can be rewound ("reset"), with the salt values changed so stale frames are ignored.

By default, a checkpoint runs when a `COMMIT` pushes the WAL past 1000 pages (about 4MB at the default page size), and the last connection does one final checkpoint when it closes. You can control it:

```sql
PRAGMA journal_mode = WAL;         -- persistent; stored in the database header
PRAGMA synchronous = NORMAL;       -- the recommended WAL setting
PRAGMA wal_autocheckpoint = 1000;  -- the default page threshold
PRAGMA wal_checkpoint(TRUNCATE);   -- block, drain the WAL, then zero the file
```

There are four checkpoint modes. `PASSIVE` does as much as it can without waiting, and can stop early. `FULL` waits for writers and for readers to be on the newest snapshot, then drains everything. `RESTART` also waits until every reader is reading from the database file only, so the next writer rewinds the log. `TRUNCATE` is `RESTART` plus zeroing the WAL file. All automatic checkpoints are `PASSIVE`.

The stalling problem is worth understanding. The wal-index has five read marks, each a frame index. A reader holding a shared lock on `WAL_READ_LOCK(N)` promises to read the first read-mark[N] frames from the database file. A checkpointer may not copy a frame past the lowest read mark held by anyone. So a long-lived read transaction pins the checkpoint to its mark, and overlapping readers can let the WAL grow without bound. The fix is a reader gap, shorter read transactions, or a blocking `RESTART`/`TRUNCATE` checkpoint that pushes readers forward.

## Concurrency, honestly

WAL gives you many concurrent readers and exactly one writer. The exclusive `WAL_WRITE_LOCK` means only one connection can append to the log at a time. It does not turn SQLite into a multi-writer database. It also does not eliminate `SQLITE_BUSY`: a connection in exclusive locking mode blocks everyone, the closing connection briefly takes an exclusive lock to clean up, and recovery holds exclusive locks while it runs.

## Durability and synchronous

The synchronous setting is where WAL gets misunderstood:

- `synchronous=FULL` is ACID. Each commit syncs the WAL, so a power loss cannot lose a committed transaction.
- `synchronous=NORMAL` syncs the WAL before checkpoints, the database after checkpoints, and the WAL header on reset, but not on most commits. It is still atomic, consistent, and isolated, and it cannot corrupt the database. It is not durable: one or more recently committed transactions can roll back after a power loss. Transactions survive an application crash either way.
- `synchronous=OFF` does not sync at all; an OS crash or power loss can corrupt the database.

The library default is `FULL`, but the SQLite docs explicitly recommend `NORMAL` for WAL mode, and the compile option `SQLITE_DEFAULT_WAL_SYNCHRONOUS=1` makes it the default. `EXTRA` behaves like `FULL` in WAL mode.

## What WAL does not fix

It does not remove the single-writer limit, it does not work across machines over a network filesystem, and you cannot change the page size while in WAL mode. But for the read-heavy, embedded workloads SQLite was built for, it is genuinely fast: commits avoid writing pages twice, writes are sequential, and with `NORMAL` the hot path skips the per-commit fsync. The 2026 WAL-reset bug, fixed in 3.51.3, shows how subtle the concurrency is; that it took fifteen years to find one is the more interesting fact.
