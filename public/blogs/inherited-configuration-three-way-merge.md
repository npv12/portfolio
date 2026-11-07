---
title: "Inherited Configuration Is a Three-Way Merge"
date: "2026-11-07"
description: "How I think about parent-to-child configuration: ownership, local overrides, baseline tracking, and revocation without overwriting tenant intent."
author: "Pranav Nedungadi"
tags: ["Backend", "Multi-tenancy", "Configuration", "PostgreSQL"]
---

# Inherited Configuration Is a Three-Way Merge

Pushing a configuration from a parent tenant into child tenants sounds like a copy operation. It stops being one as soon as a child is allowed to customize anything.

I worked on workflow distribution where a parent owned the reusable definition, while each child needed some independent settings. The difficult question was not how to serialize the configuration. It was what an update should mean after the destination had changed.

## Separate ownership from location

A resource stored in a child's database is not necessarily owned by that child. It may be an inherited copy of a parent-owned definition.

That distinction has to survive every write path. Locking an editor in the frontend does not stop a generic API, an agent tool, or an import operation from mutating the same underlying object. The edit rule belongs at the shared backend boundary, where the system can resolve ownership.

I separate fields into two groups: source-controlled content and child-controlled state. A child might be allowed to enable a workflow without being allowed to rewrite its prompt or execution definition. Treating both groups as one opaque JSON document makes that policy unnecessarily hard to express.

## Keep the last applied baseline

For overridable configuration, there are three relevant values:

| Value | Meaning |
| --- | --- |
| Baseline | What the parent last pushed |
| Local | What the child currently stores |
| Incoming | What the parent wants to push now |

If local equals baseline, the child has not customized that value. It can follow incoming. If local differs from baseline, preserve the local override unless the product explicitly says otherwise.

For example, a parent previously pushed a 30-minute interval. One child still has 30 minutes; another changed it to 60. A new parent default of 45 should update the first child, not the second.

Missing values need an explicit meaning. A deleted key, an empty string, and a null value are not interchangeable. The merge contract must say whether deletion resets an override, removes a setting, or requests inheritance again.

## A successful push is more than a copied row

A workflow may refer to executable packages, presentations, skills, or other versioned resources. Copying only its top-level row creates a definition that looks present but cannot execute.

The distribution operation needs to resolve dependencies from the actual references in the definition. Deriving a dependency name from the workflow's name is tempting, but breaks when a resource comes from a separately named family.

Conflicts also deserve a real result. If a child already owns a resource under the requested key, preserve it and report the conflict. Silent replacement turns distribution into accidental data loss.

## Revocation follows references

Deleting the source is not the inverse of copying it. An inherited dependency may still be used by another definition. Removing one inheritance origin should not remove an independently owned resource or another origin's grant.

I find it useful to model distribution as ownership plus references, rather than a pile of duplicated objects. Updates change the inherited content; revocation removes the relevant origin; garbage collection only removes resources that no longer have a reason to exist.

The tradeoff is extra bookkeeping: baselines, provenance, dependency references, and partial-failure reporting. That is still cheaper than a support workflow for recovering overwritten tenant configuration. Once local overrides exist, a blind copy is not a simpler implementation of the same feature. It is a different feature with a data-loss policy.
