---
title: "Retry the Failed Boundary, Not the Whole Workflow"
date: "2026-11-07"
description: "Designing external integrations around partial success, structured failures, bounded retries, and evidence of what actually completed."
author: "Pranav Nedungadi"
tags: ["Backend", "Integrations", "HTTP", "Reliability"]
---

# Retry the Failed Boundary, Not the Whole Workflow

A workflow creates an internal record and then sends a webhook to an external system. The record creation succeeds; the webhook times out. Should the client retry the operation?

If the answer is “retry everything,” the system may create a second internal record before discovering that the first webhook actually reached its destination.

I have worked on integrations where the central design problem was this partial-success boundary. HTTP status codes were useful, but the more important information was which effects had already happened.

## Name each effect

I separate preparation, primary mutation, and secondary delivery. Validate the external destination and required payload before the primary mutation when possible. That avoids creating durable state for a request that could never have been delivered.

After the primary mutation, retain its result even if the secondary call fails. Return or persist enough information to resume delivery without repeating the completed operation.

That is not a distributed transaction. It is an explicit account of the workflow's state, which is much better than a generic exception that erases the success that came before it.

## Retry classification is only the start

Rate limits and transient server errors are reasonable retry candidates. Invalid input and authentication failures usually need intervention rather than more attempts. Backoff must be bounded, and server retry hints should be respected when supported.

But a timeout is ambiguous: the remote system may have committed the action before the response disappeared. Retry safety depends on idempotency at the side-effect boundary, using a stable operation key or a remote lookup that can reconcile the result.

Without that contract, retries improve availability while increasing duplicate risk. It is important to say which tradeoff the integration currently makes.

## Transport success is not business success

Some tool wrappers return a successful transport envelope with an error object inside the text body. A caller that only checks the outer status will continue as if the action completed.

The integration boundary must parse the actual documented result and distinguish data from failure. Conversely, a proxy timeout is not proof that the remote business operation failed.

I prefer a narrow result contract over exception-message guessing: the primary record reference, delivery state, external reference when known, and a useful error category.

## Test the contract you claim

A local accept-anything webhook receiver proves the sender can construct a payload and complete an HTTP exchange. It does not prove the real ticketing system accepted the schema or created a ticket.

Schema checks, delivery checks, and business-outcome checks are different evidence. A complete test follows the external reference back to the destination system, or queries a supported lookup API using the operation key.

Likewise, an offline tunnel cannot be repaired by repeating the same business workflow. First verify destination reachability with a side-effect-free check, then decide whether the mutation needs reconciliation or retry.

## Keep the retry scope small

The best recovery unit is usually the smallest durable boundary that failed. Retry the unsent delivery; reconcile the uncertain remote mutation; do not replay already completed preparation and record creation unless they are demonstrably idempotent.

There are cases where a saga and compensating actions are justified. Many integrations can start much simpler: record completed effects, preserve their identifiers, classify failures accurately, and expose partial success instead of hiding it behind a single boolean.
