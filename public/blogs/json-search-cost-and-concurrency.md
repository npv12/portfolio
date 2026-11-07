---
title: "The Cost of Searching JSON Is Not Just Memory"
date: "2026-11-07"
description: "What a PostgreSQL JSON substring benchmark taught me about serialization, query plans, warm caches, and concurrency collapse."
author: "Pranav Nedungadi"
tags: ["PostgreSQL", "SQL", "Performance", "Benchmarking"]
---

# The Cost of Searching JSON Is Not Just Memory

Searching every field in a JSON document is an appealing product shortcut. Cast the document to text, lowercase it, and apply a substring predicate. No new search model, no field inventory, and newly added JSON keys become searchable automatically.

I investigated that approach using actual application-shaped documents in a local PostgreSQL benchmark. The result was not the simple story I expected. The single-query memory increase was modest in the measured workload. The CPU work and concurrent latency were much less forgiving.

## Serialization is part of the predicate

For a JSONB substring search, PostgreSQL has to turn evaluated values into text before matching the pattern. Large out-of-line values may need detoasting. Case-insensitive matching can add more text processing.

A primary-key lookup somewhere in the query does not prove only one document will be evaluated. The outer candidate set and the planner's chosen shape still matter. Likewise, writing a selective predicate first in an `OR` expression is not a guarantee that expensive predicates execute last.

The only useful answer comes from the actual SQL and its plan.

## A bounded local measurement

I first seeded 50,000 rows from a small set of application document shapes. Average serialized size was about 14 KB, with the largest around 30 KB. This was roughly 669 MiB of logical JSON text, not 50,000 uniformly large synthetic blobs.

In that warm-cache setup, no-match and all-match substring scans took roughly 5.6 to 5.8 seconds. Four concurrent no-match scans each took roughly 6 to 6.4 seconds. The container's observed anonymous-memory increase was in the tens of MiB, and no OOM occurred.

Those observations do not mean JSON search is cheap. They mean this particular scan was not retaining the entire serialized corpus in backend memory. File cache, shared buffers, backend RSS, and private anonymous memory measure different things. Adding backend RSS values can double-count shared pages.

## The list endpoint is not the isolated scan

The next workload used 500,000 rows and a list-like query with filtering, deduplication, sorting, and separate page/count work. Under 20 concurrent persistent connections, the completed requests in a partial run had a median around 304 seconds.

That run was stopped early: 120 requests completed, 20 active queries were intentionally canceled, and 860 queued requests never ran. It was not a completed 1,000-request benchmark, and those latency numbers describe only the successful subset.

It also was not directly comparable to the simpler 50,000-row scan. Both dataset size and query shape changed. The lesson is narrower: a predicate that survives a single-query memory check can still produce an unusable list endpoint under contention.

## Index the representation you query

A native JSONB GIN index is not automatically an index for arbitrary substring search over the document's serialized text. A trigram index on a matching text expression can help, but short or broad search terms and heap rechecks still matter.

Full-text search changes semantics too. Token search is not the same as matching an arbitrary fragment of an identifier. Decide which behavior the product needs before choosing an index.

A maintained search projection can avoid repeated JSON serialization. Its cost moves to writes and backfills, and every mutation path must refresh it. That tradeoff is often worthwhile, but it is not free.

## Benchmark the request contract

I now want four things before calling this kind of search safe: the actual page and count queries, realistic document sizes, representative search terms, and bounded concurrent load.

I also want cancellation scoped to the benchmark's own connections. A test runner exiting does not guarantee its database queries stopped. A useful benchmark includes an exit plan, not just a stopwatch.
