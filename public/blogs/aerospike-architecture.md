---
title: "What Aerospike Does Differently"
date: "2026-09-07"
description: "Aerospike keeps a tiny in-memory index and huge values on SSD, and it refuses to trust the operating system to manage either. Here is how that bargain actually works."
author: "Pranav Nedungadi"
tags: ["Aerospike", "Databases", "Storage", "Deep Dive"]
---

# What Aerospike Does Differently

Most key-value stores pick a side. Redis keeps everything in RAM and hopes the dataset stays small. A general-purpose database keeps a buffer pool and bets the hot working set fits. Aerospike makes a harder split: the primary index lives in DRAM, the data lives on SSD, and the storage engine does as little as possible through the operating system. The specializations are the whole point.

## The index is the memory, not the data

Aerospike's default configuration is Hybrid Memory Architecture (HMA): the primary index is in memory, record values on SSD. Two other modes exist. In-Memory puts index and data in DRAM, optionally backed to disk. All Flash puts both on NVMe (Enterprise Edition only). HMA is the one that made the company's name.

The numbers make it concrete. Every record costs 64 bytes of primary-index metadata. A namespace with 100 million records at the default replication factor of 2 consumes roughly 100,000,000 x 64 x 2 = 12.8 GiB of index memory across the cluster, while the values sit on disk. Aerospike's 2025 engineering write-up notes that typical local-NVMe cloud instances give you at least one byte of memory per 30 bytes of disk, so the index fits as long as the average record is bigger than about 3 KiB.

```
        DRAM (per node)                        NVMe SSD (per node)
  +---------------------------+        +--------------------------------+
  | primary index             |        | write blocks (append only)     |
  |  digest -> { loc, gen,    |  1 IO  |  [live][stale][live][free]...  |
  |             ttl, lut }    | -----> |                                |
  |  ~64 bytes per record     |        |  new writes land in fresh      |
  +---------------------------+        |  blocks; defrag copies live    |
                                       |  records into new blocks       |
                                       +--------------------------------+
```

## What is actually inside those 64 bytes

Each entry holds a 20-byte record digest, a generation counter, void-time (expiration), last update time, replication state for strong-consistency namespaces, and the record's exact location on storage. That last field is what buys the single-read path: one index lookup gives the storage address, and one I/O fetches the record.

The digest keeps the index compact. The client hashes the record's key with RIPEMD-160 into a fixed 20-byte value, so a 200-byte key and an 8-byte key cost the same index space. Twelve bits of that digest become the partition ID, splitting the keyspace into 4096 logical partitions across the cluster.

The in-memory structure is not one giant hash table. Each partition index is a set of smaller red-black trees called sprigs. The point is contention, not raw lookup speed: each sprig or group can be locked independently, so a structural change in one part of a partition does not block transactions in another. Sprigs also cut tree traversal depth once a single partition grows past a million records. You size them with `partition-tree-sprigs`; on current releases each sprig costs about 10 bytes of RAM.

## Why it does not use the OS page cache

On devices, Aerospike opens files with `O_DIRECT` and `O_DSYNC` by default, bypassing the Linux page cache and the hardware cache. The argument is that a general-purpose page cache is a poor match for a predictable key-value workload. It works on 4 KiB pages with generic LRU eviction, can double-buffer data the database already caches, and is tuned for many workloads rather than this one.

Instead the database runs its own caching and batching. Writes collect in a streaming write buffer and are coalesced before hitting the device. Recently written blocks are retained in a `post-write-cache` (256 MiB default per device), on the theory that records are often read soon after being written. Reads that miss go straight to the device without polluting a cache the database does not control.

The tradeoff is honest: you own the caching complexity. Aerospike exposes `read-page-cache` to let transaction reads populate the kernel page cache, and `direct-files` to bring filesystem-backed storage in line with devices. But under Kubernetes page cache counts against the container's cgroup limit, so opting in means accounting for it. The default is not to depend on the kernel.

## Append, never overwrite

Aerospike's storage engine writes records sequentially into fixed-size write blocks and never updates in place. An update is copy-on-write: the new version goes into the current write block in RAM, and the index entry is repointed at the new location. The old bytes are stale and get reclaimed later.

In Database 7.1 and later the write block is fixed at 8 MiB, and `write-block-size` was replaced by `flush-size`, which controls the I/O unit. A flush happens when the streaming write buffer fills or when `flush-max-ms` expires; the buffered data is appended in `flush-size` chunks. Coalescing many small record writes into larger device writes is what keeps write IOPS low. The price is that every overwrite consumes fresh space and leaves garbage behind, which is why update-heavy workloads stress this engine.

```ruby
namespace ads {
    replication-factor 2

    storage-engine device {
        device /dev/nvme0n1p1     # raw device, no filesystem
        flush-size 128K           # 1M default, 128K is common on NVMe
        defrag-lwm-pct 50         # reclaim blocks at 50% live data
    }
}
```

## Defragmentation pays the bill

When a write block's live-record ratio drops below `defrag-lwm-pct` (default 50%), it is queued for defragmentation. Defrag copies the live records into a fresh block, updates the index, and returns the drained block to the free pool. Tuning `defrag-sleep`, `defrag-lwm-pct`, and `defrag-queue-min` is a straight trade between space utilization and write amplification: raise the threshold and you reclaim more space but rewrite more live data.

One subtlety: blocks in the `post-write-cache` are not defrag candidates even if they fall below the threshold, so that cache should stay small relative to the device. Another: `defrag-startup-minimum` defaults to 10%, and if less than that fraction of storage is writable, the server refuses to join the cluster. It would rather stay down than start in a state it cannot clean up.

## The consistency model, stated correctly

A common claim is that Aerospike is strongly consistent by default. The current documentation says otherwise. A namespace's default mode is AP (high availability), which favors availability over consistency during a partition. What AP does give you is a single master per partition: writes go to the master, which writes locally and synchronously replicates before acknowledging. Reads go to the master by default and only fall back to a replica after a timeout, the documented case where a stale read is possible.

Strong consistency (SC) is opt-in per namespace, Enterprise Edition only. Read consistency is chosen per read: session consistency is the default SC read mode and gives a client read-your-own-writes, while linearizable reads add a partition health check on every read and cost latency. Ordering is tracked per record with a 40-bit last-update time, a 6-bit partition regime, and a 10-bit generation counter. The unit of atomicity is one record, not a multi-record transaction.

For geography, rack awareness keeps master and replica copies in different racks or availability zones, and Database 7.2 added an `active-rack` mode that pins all master copies to one rack. Across clusters, XDR replicates asynchronously by comparing each record's last update time against the partition's last ship time. In an active-active mesh, bin convergence resolves conflicts by keeping the bin with the later timestamp. Read the docs carefully: that gives final-state convergence, not eventual consistency, and intermediate updates can be lost.

## Secondary indexes and queries

Secondary indexes are also in memory by default, built on every node, and co-located with the primary index. Each entry points only at records local to that node. If you declare an index on a bin, every node pays for the index entries of the records it holds, and every value you index adds to the memory bill on top of the 64 bytes per record. There is an `indexes-memory-budget` setting for a reason. Newer expression indexes let you index a computed value rather than a raw bin, which can cut the number of entries, but the cost model is the same.

Queries are scatter-gather: the client sends the query to every node, each node reads its local index and data, and the client aggregates. There are no joins and no query planner; aggregation runs through stream UDFs. Calling Aerospike a general SQL database would be a category error.

## Where this design hurts

The primary index memory scales with record count and replication factor, not data size. That is the inverse of how most people reason about capacity. A namespace full of tiny records can spend more RAM on index metadata than on the data; the docs suggest 1 to 128 KiB records as the sweet spot and warn against the 50-byte case. You also inherit operational work: sizing index memory, tuning defrag, sizing the write cache, choosing a record size. The data model is narrower than SQL, and the query engine will not save a bad access pattern.

None of that is a defect. It is the bill for predictable single-digit-millisecond latency at high throughput, and for lots of data on cheap flash with only the index in DRAM. Aerospike is excellent at that, and a poor choice for anyone who wants a general-purpose database without thinking about record sizing or defragmentation.
