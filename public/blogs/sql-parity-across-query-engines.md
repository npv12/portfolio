---
title: "One API, Two SQL Engines, Several Ways to Disagree"
date: "2026-11-07"
description: "Keeping PostgreSQL and a columnar query path aligned on nulls, tenancy, deduplication, filtering, and count semantics."
author: "Pranav Nedungadi"
tags: ["SQL", "PostgreSQL", "Apache Doris", "Multi-tenancy"]
---

# One API, Two SQL Engines, Several Ways to Disagree

A second query engine can make an endpoint faster while making its behavior harder to trust. The HTTP response shape stays the same, so the two implementations look interchangeable. Small differences in null handling, deduplication, and tenant filtering can make them return different answers.

I worked on listing paths backed by PostgreSQL and a columnar store. The useful abstraction was not a universal SQL string. It was a shared behavioral contract with engine-specific implementations that had to prove the same semantics.

## Start with truth tables

Suppose a flag is nullable and the product wants everything except explicit true. The desired behavior is:

| Stored value | Include? |
| --- | --- |
| true | No |
| false | Yes |
| null | Yes |

SQL's three-valued logic makes `flag != true` insufficient because the null comparison is unknown, not true. Even a predicate that looks standard can behave differently in the deployed engine version.

I verify the truth table with raw queries on the actual version. A deliberately explicit predicate such as `flag = false OR flag IS NULL` may be more useful than a shorter form whose runtime behavior has not been checked.

## The rendered row is the semantic object

An investigation list might collapse several runs into one visible row. A later run can replace an earlier one as the rendered result.

If search matches the earlier run's JSON while the UI displays the later run, the endpoint is technically finding data but misleading the user. Search, filtering, and counts must agree about which execution is represented by that row.

Grouped results add another layer: a matching child may cause its parent to appear, but the expanded child list should be narrowed according to the same search rules. Reimplementing the predicate independently for page, count, group membership, and ancestor visibility is a reliable way to drift.

## Tenant correctness and tenant pruning are different

A correlated subquery can be logically tenant-safe while still scanning data for every tenant in a shared analytical table.

In one engine, a correlated tenant equality was planned as a join without pushing the tenant restriction into the expensive scan. Adding an explicit tenant literal to the subquery gave the optimizer a predicate it could apply earlier.

The lesson is not to sprinkle literals everywhere. It is to check the scan predicates in `EXPLAIN`, especially when JSON conversion is involved. Logical isolation protects the result; physical pruning protects the server. A multi-tenant query needs both.

## Replication is part of the feature

If the new query path needs a field or table, adding it to the transactional model is not enough. The CDC allowlist, transformation, destination schema, and backfill must agree before reads are enabled.

Native JSON on one side may arrive as a string on another. A search index may require a separate normalized text projection. The deployed data representation, not the ORM declaration, determines what the analytical query can do efficiently.

## Compare more than the happy page

I use the same small dataset to check both engines: missing values, explicit false values, multiple runs per entity, grouped children, cross-tenant lookalikes, and exact page/count agreement.

Then I inspect plans separately. Semantic parity does not imply performance parity, and a fast count does not prove a fast page query. The endpoint owns one contract, but each engine still needs its own evidence.
