---
title: "Keeping a Long-Running Agent Inside Its Context Window"
date: "2026-09-10"
description: "How to keep a long-running agent inside its context window without destroying the plan and state it needs. Six steps that cap, compact, summarize, and recover, with the load-bearing persistence nobody thinks about."
author: "Pranav Nedungadi"
tags: ["Agents", "LLM", "Context Window", "Architecture", "Reliability"]
---

# Keeping a Long-Running Agent Inside Its Context Window

Every long-running agent has the same problem. It calls tools, and tools return huge results: entire files, query outputs, log tails. You cannot just send all of that to the model, because the context window fills and the model starts dropping information or degrading into nonsense. But you also cannot naively summarize everything, because the agent loses two things it cannot afford to lose: the plan it was following, and the exact state it had been working with.

The fix I ended up with is a single pipeline module with six steps. It lives in one file because the steps are tightly coupled. They share constants, placeholder markers, and the compaction boundary. Scattering them across hooks makes them impossible to reason about as one system. If you borrow nothing else from this post, borrow that: this is one stateful pipeline, not a grab bag of context tricks.

## 1. Cap each tool result

The first rule is that no single result gets to flood the window. When a tool result exceeds a token threshold, I replace its content in context with a short preview and spill the raw text to a sidecar file.

The cap works by characters first, then by lines. The two-stage order matters: a single fat JSONL line will blow right past a pure line cap, so you count characters and slice the oversized line before you ever think about lines. Character cap first, then line cap on what survives.

Some tools are exempt. A skill-loading tool that returns a skill's body has to be read end to end, because the agent's next decision depends on the whole thing. Exemption is a small allowlist, and it is deliberate: exceptions to context capping are decisions, not accidents.

## 2. Micro-compaction before every model call

Between calls, ordinary tool results sit untouched in the live text until that live text passes roughly one third of the context window. Only then does the cheap path kick in.

At that point, replace the OLDEST tool results with a short placeholder that cites the sidecar reference. Always preserve the most recent results. This is a zero-cost string operation: no model call, no summarization, nothing clever. It buys you room so that the expensive compaction in step 4 happens only when it actually has to.

The trick is the placeholder marker. It is a fixed token that survives both the copy of the message list and the tool-call log, so a later step can find the original text and hydrate it back if needed.

## 3. Detect pressure before it becomes damage

A cheap token estimate keeps the pipeline honest. `len(text) // 4` is good enough for pressure detection; you do not need a tokenizer for this.

The estimate is logged against thresholds at roughly 70, 85, and 97 percent of the window, tagged as warning, compact, and blocking. Detection only. This step does not mutate anything. It exists so you can watch an agent run in production and see the pressure climb, and so steps 4 and 5 know when to fire without recomputing.

## 4. Compact the old portion

When pressure crosses the compact threshold, walk the old part of the conversation and find every tool call. Hydrate any placeholdered results back from the trace log, so the summarizer sees the actual content and not a marker. Then summarize the old turns with a single model call, and rebuild the message list as:

```
[summary, reconstructed operational state, tool-call log, last N live turns]
```

The reconstruction step is where the agent's working set survives compaction. It preserves the loaded deferred-tool names, the bodies of any invoked skills, and the recent file reads. The agent that comes out of compaction still knows which tools it had loaded and what it last read. Declared tool schemas stay as static overhead; they are never copied into history, so they do not grow the budget on every compaction.

An emergency branch runs at the blocking threshold with tighter budgets and a coarser summary. It is the last defense before the agent cannot call tools at all.

## 5. Persist the compaction boundary

This is the step that costs real money when it is missing, and it is the easiest one to skip.

The compaction boundary has to be persisted. If you do not store it, the transcript loader re-seeds the next turn from the full pre-compaction history. Every turn past the threshold re-summarizes the same unsummarized messages, over and over. The result is a re-compaction on every single turn, each one a paid model call repeating the same work and slowly bloating the transcript back up. That bug is not subtle and it does not announce itself; it just quietly burns tokens forever.

Persist the boundary once, at compaction time, and load it with the transcript. It is a few bytes and it turns the whole pipeline from a live demo into something you can charge money for.

## 6. Recover after max output

Sometimes the model stops not because the input is too big but because it hit the maximum output tokens mid-thought. When that happens, append a short "resume mid-thought" user message and let the next call continue from where it stopped. The model picks up cleanly instead of restarting the whole reply.

Cap the number of recoveries per session. Without the cap, a model that cannot finish in the budget will loop forever, each recovery spending another call. Three or four attempts is enough; past that, something is wrong with the task and looping will not fix it.

## One pipeline, shared by every agent

Parent and sub-agents run the same compaction classes. Only the trace paths differ, so each agent ends up with its own tool-call ledger and its own sidecar directory. That single choice keeps the code doable: there is one implementation to tune and debug, and each agent's history stays private to it.

## The tradeoffs, stated plainly

The recent-results preservation means ordinary results stay full until the window is a third full; agent sessions with many small tool calls carry that overhead. When compaction does run, summarization is lossy and can drop a detail the agent needed three turns later. The placeholders force extra reads back into the sidecar when a result is hydrated. And a short-lived sub-agent should not pay the compaction cost at all: it finishes before it ever crosses a threshold, so you gate the expensive path on window pressure and let small agents run untouched.

Tune the thresholds and the preserved-recent count to your workload. But do not remove the boundary persistence. That one is not a tuning knob, it is the load-bearing wall holding the whole pipeline up.

The general shape here is portable: cap the inputs, compress cheaply, summarize only when pressured, preserve the working set, persist the boundary, and recover from truncation. Specifics will differ, but those six responsibilities are the floor for any agent you plan to run for a long time.
