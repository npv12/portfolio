---
title: "Use an Agent for Judgment, a Program for the Contract"
date: "2026-11-07"
description: "Where deterministic execution fits inside an agent workflow, and why moving work out of the model does not remove the runtime's responsibilities."
author: "Pranav Nedungadi"
tags: ["Python", "Agents", "Architecture", "Backend"]
---

# Use an Agent for Judgment, a Program for the Contract

Not every step in an AI workflow needs another model call. Mapping a known severity, extracting a hostname, assembling a payload, and calling a documented API are usually program-shaped tasks.

I worked on moving a predictable integration workflow into executable code inside an agent runtime. The gain was not just cost. It made field precedence, validation, and failure behavior inspectable instead of relying on the model to remember the same rules on every run.

## Find the boundary of judgment

An agent may need to interpret evidence and produce an investigation. Once that result has a defined shape, downstream delivery can consume it as data.

The deterministic layer should prefer the investigation's accepted summary and severity, then use explicitly documented source fallbacks when those fields are absent. “Ask the model to choose again” risks changing a conclusion during delivery.

The same applies to identifiers. Extracting the hostname from a URL should use a URL parser. Choosing the right source URL needs a known precedence rule. Those are different decisions and deserve separate code.

## A program still runs inside a policy

Moving execution into Python does not grant it unrestricted access. It should call external tools through the runtime's broker, using the same permission model and execution identity as other workflow actions.

That keeps audit attribution and tool authorization at a shared boundary. Otherwise “deterministic execution” becomes a side door around controls that the agent path correctly enforces.

Version the executable reference with the workflow. A later code promotion must not silently alter a historical run's definition. Inputs and relevant resource references need to be pinned or snapshotted according to the execution contract.

## Admission is separate from preparation

A definition can look valid while referring to a deleted executable. Readiness needs to distinguish configuration completeness from resolvable execution dependencies.

Even after admission, materializing the program's files can fail. If the application has already persisted an accepted run, swallowing that failure can leave it permanently pending with no task queued.

The runtime needs an observable setup failure or a recoverable pending state. A program that never started should not look like an agent that is still thinking.

## Verify zero-model execution as a claim

Source code without an explicit model call is not sufficient evidence that a workflow used none. Admission, planning, verification, or finalization can introduce calls elsewhere in the runtime.

I check the execution definition, session trace, and usage ledger together. Even the ledger needs scrutiny: some auxiliary calls may bypass the normal accounting hook. “No recorded model calls” is a narrower claim than “no model work occurred.”

For the program itself, preparation checks should cover malformed input, missing analysis, supported source variants, opt-in secondary effects, and partial failures. A successful HTTP exchange with a test receiver is not proof of the real external business outcome.

## Keep a small interface

The useful split is not agents versus code. It is uncertain interpretation versus repeatable execution. Let the model reason where the input requires judgment; give the result a typed boundary; execute known contracts with a small program.

The runtime still owns scheduling, identity, permissions, dependencies, and durable outcomes. Deterministic code reduces one source of uncertainty. It does not eliminate the backend around it.
