---
title: "Keep the Scheduler Boring, Put Admission in the Database"
date: "2026-11-07"
description: "Why periodic workflows need durable provenance and a transactional admission gate, rather than a scheduler that remembers what it last did."
author: "Pranav Nedungadi"
tags: ["Backend", "Scheduling", "PostgreSQL", "Concurrency"]
---

# Keep the Scheduler Boring, Put Admission in the Database

A periodic task is easy to implement when there is one process and nobody presses Run Now. Add retries, multiple replicas, manual runs, disabled schedules, and long-running executions, and the scheduler starts pretending to be a database.

I worked on periodic workflows where the cleaner direction was the opposite: make the periodic dispatcher nearly stateless, and put the decision to admit a run beside the durable execution records.

## A tick is a suggestion

The dispatcher can wake up every few minutes and ask each enabled schedule to run. It does not need to remember the last successful dispatch in a local dictionary or rewrite shared configuration after every tick.

The backend receiving the request checks whether the schedule is due. Under a row lock for that schedule, it reads the relevant execution history, applies the interval and concurrency policy, and creates the durable record that claims the run.

Two concurrent dispatchers can make the same suggestion. Only one should pass admission for the same due period.

```text
periodic tick
    -> request admission
        -> lock schedule
        -> evaluate due/concurrency rules
        -> create durable run intent
    -> enqueue admitted work
```

## Define the clock you are using

An interval measured from the previous run's start differs from one measured from its completion. A slow execution can make those policies diverge dramatically.

In one workflow, due time was based on the latest automatic session's creation time. That made the cadence explicit, but it did not itself prevent overlapping runs. Concurrency admission remained a separate rule.

Manual runs were excluded from that clock. Otherwise an analyst testing the workflow could postpone the next automatic execution without realizing it. Soft-deleting a historical run also should not reset the cadence and immediately queue another execution.

There is no universally correct policy. The important part is to encode it once and use the same definition for the API, the scheduler, and the UI.

## Persist why the run exists

One execution definition can have multiple schedules. Saving only the definition ID loses which trigger supplied the time window or input.

Keep durable trigger provenance on the run. It allows an operator to distinguish manual work from automatic work, explain the chosen inputs, and inspect schedule-specific history. Copy the execution-relevant input into the run so later schedule edits do not rewrite its meaning.

This is also why a scheduler's own mutable configuration is a poor execution ledger. A configuration update can fail even after work was queued, leaving the next tick convinced nothing happened.

## The queue boundary is still real

A database transaction cannot atomically commit to an unrelated broker by wishful thinking. Enqueuing before commit risks a worker observing missing data. Enqueuing after commit risks durable admission without delivery if the process dies between the two operations.

An on-commit callback avoids the first problem, not the second. If reliable delivery is required, an outbox or a recoverable pending-dispatch record closes that gap. I treat that as an explicit delivery requirement rather than claiming the row lock solved it.

## Separate disabled from deleted

Disabling a schedule should stop future admission without erasing history. A run that already passed admission may need to finish, cancel, or recheck policy depending on the product contract.

The resulting scheduler is deliberately uninteresting. It emits repeated requests; the database owns cadence and provenance; the admission boundary owns concurrency; the delivery path owns retries. Each responsibility has a durable place to live instead of depending on which process happened to wake up first.
