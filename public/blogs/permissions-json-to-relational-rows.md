---
title: "Moving Permissions Out of JSON Without Changing Their Meaning"
date: "2026-11-07"
description: "A permission migration is a semantic migration: preserve wildcards, ordering, explicit denies, deployment compatibility, and a useful rollback."
author: "Pranav Nedungadi"
tags: ["PostgreSQL", "Django", "RBAC", "Migrations"]
---

# Moving Permissions Out of JSON Without Changing Their Meaning

JSON is a convenient starting point for an execution policy. A definition can carry its tool grants, filesystem paths, SQL access, and settings in one document. Eventually the product needs reusable roles, relational constraints, and policy management independent of the rest of that definition.

I worked through a migration from embedded permission documents to role-backed rows. Creating the tables was the straightforward part. Preserving the meaning of every existing permission was the real work.

## Inventory the semantics before the schema

An empty string may be a special resource name. Null may mean an unrestricted scope. An absent list may activate defaults, while an empty list means no access. A denied wildcard must not become an allowed wildcard during normalization.

These details are easy to lose in a model that looks cleaner than the original JSON. Before choosing columns, I want a mapping from every supported permission form to its relational representation, including legacy forms that still exist in stored data.

Ordering is another quiet requirement. If the API promises a stable list, store a position or define a canonical order. Database row order is not that contract.

## Use a round trip as the migration invariant

The strongest local check was not that a row count matched. It was that a normalized policy could survive both conversions:

```text
stored document
    -> normalized permission policy
    -> relational rows
    -> reconstructed permission policy
```

The two normalized policies must agree. This catches dropped denies, lost scope information, and grouping mistakes that a successful insert does not reveal.

Validation is still necessary before conversion. A round trip over two equally wrong converter functions can pass, so fixtures should include policies whose expected meaning is known independently: exact grants, wildcards, empty scopes, explicit denies, and duplicate entries.

## Expand, backfill, constrain

The deployment sequence matters because migrations may run before new application code reaches every worker.

I prefer adding a nullable relationship first, backfilling through historical models, and only then making the relationship required. During the transition, old code must still tolerate the new schema. If the old JSON remains for compatibility, designate one source of truth for each stage rather than letting both stores accept independent edits.

The backfill should not accidentally invoke today's model save hooks or versioning logic. Historical migrations need historical models, and any conversion helper they depend on must remain replayable. Importing live policy validators or a live tool catalog means a fresh installation could behave differently months later.

## Reads and writes must move together

Replacing the main editor is not enough. Archive export, inheritance, version snapshots, background scheduling, and tool-driven edits may all read the embedded document directly.

I search for those sibling paths before declaring the migration complete. They need to use a shared reconstruction boundary for reads and a transactional write boundary for updates. Otherwise a version snapshot can capture stale JSON while the executor uses the new rows.

## Rollback needs current data

If users edit the new permission rows after deployment, the old JSON becomes stale. A reverse migration that only clears the new foreign key restores the old schema but loses those edits.

A meaningful rollback reconstructs the current policy into the old representation before deleting the relational state. Even then, rollback may have limits if new policy concepts cannot be represented in the old format. State those limits before rollout.

The payoff of normalization is better ownership and constraints, not permission semantics that changed by accident. The migration succeeds when execution sees the same policy before and after the storage change.
