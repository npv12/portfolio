---
title: "Prompt-Cache Affinity and Per-Session LLM Cost"
date: "2026-09-08"
description: "Getting the provider's prompt cache to actually hit, then attributing the bill to the session that caused it. Two adjacent gateway problems, one bug in between, and what I learned measuring both."
author: "Pranav Nedungadi"
tags: ["LLM", "Caching", "Cost", "Observability", "Architecture"]
---

# Prompt-Cache Affinity and Per-Session LLM Cost

Building an LLM gateway surfaces two adjacent problems. First, getting the provider's prompt cache to actually hit. Second, knowing which session spent the money. They look unrelated, but they live in the same request path and share a failure mode: neither is visible until you measure the raw traffic.

## Why prompt caching depends on affinity

Providers cache the prefix of a request, meaning the system prompt plus the prior messages in the conversation. That cache lives on a specific replica. If the same conversation lands on the same replica again, most of the prompt is a cache read, which is far cheaper. If it lands on a different replica every time, the cache misses and you pay full price for the whole prefix.

The routing key is the session id. The gateway maps a stable session id to an affinity header so requests for one conversation stick to one replica. Without that mapping, each request picks a random replica and the hit rate collapses to single digits.

Affinity is necessary but not sufficient. A growing conversation must also keep the system prompt byte-identical and append only new messages. If the prefix changes, nothing can hit regardless of which replica you land on.

## The bug worth writing down

We measured a cache hit rate of zero to eight percent and traced it to the client library. On the proxy route, it stripped the top-level metadata field from the outgoing request body, so only `max_tokens`, `messages`, and `model` were actually sent. The session id never reached the proxy, the affinity header was random, and the cache was effectively dead.

The fix was to carry the session id inside the `extra_body` metadata instead, which the library forwards verbatim.

```python
response = await litellm.acompletion(
    model=model,
    messages=messages,
    max_tokens=max_tokens,
    extra_body={
        "metadata": {
            "session_id": session.id,
            "prompt_name": "agent_run",
            "object_id": session.object_id,
        }
    },
)
```

## Verification matters more than the fix

The fix was trivial. Proving it worked was not. I ran a local listener that captured the raw outgoing body so I could see exactly what the proxy received. Without that, I was debugging from dashboard numbers I did not trust.

Replica hopping has a signature. Cache hits land one or two requests back at roughly one over the replica count. That is a useful smell: if you clear cache averages and see hits clustered a few requests in the past, you are bouncing between replicas, not rebuilding the prompt. I plotted the cached-token fraction per request rather than the average, because an average hides the pattern. The clusters showed up immediately.

The verification was a loop, not a one-off. I captured the raw body, picked the usage detail out of the response, computed cached tokens, and compared them against the control. Iterate until the raw body and the usage numbers tell the same story, because they will not agree until the session id is actually in the forwarded payload.

After the fix, a full agent run hit 91 percent cached tokens and cost $0.09. A control session on the old code sat at 5 percent. A three-request growing conversation cached 154 of 174 tokens, then 173 of 193. The prefix stayed stable and the cache paid off.

## Watch the proxy cache

Distinguish the proxy's own response cache from the provider's prefix cache. The proxy cache can serve a frozen response and report zero cached tokens, which looks identical to a cache miss if you are not careful. Claims of low hit rates can be the analytics measuring a response cache that returns no usage detail at all. When you are measuring prefix caching, bypass the proxy cache deliberately so the request actually reaches the provider and you get real usage numbers back.

## Attributing cost to the work that caused it

Cost attribution needs one row per LLM call with cost, prompt tokens, response tokens, cache read tokens, cache creation tokens, a prompt name, the model, the host, a feature, and an object id that ties the call to the work it served. Then roll it up daily per account, user, feature, and model, and maintain a cumulative per-account total under a row lock. Cache the daily total with a short TTL so dashboards do not hammer the database.

Cost itself is tokens times price per million, and on the proxy route it can come from a response cost header. Capture it at one central point after every call so there is a single definition of cost across the codebase. Two places that calculate cost two ways will disagree, and you will spend a sprint reconciling them.

## Why per-object attribution

A model-level dashboard tells you which model is expensive, not which feature or which session. Grouping by prompt name and object id finds the work that is actually burning money. That query is what turns "LLMs are expensive" into "this one prompt is expensive". The difference matters because the second version tells you what to fix.

## Tradeoffs, stated explicitly

Affinity fights load balancing. Pinning a conversation to a replica concentrates load and makes failure recovery harder, since a cold replica starts unprimed. Per-call rows are high volume, and rollups plus short TTL caches introduce staleness. I accept all three because the alternative is paying full price on every prompt and having no idea which session caused the bill. Make the tradeoff explicit instead of hoping it does not matter.

The real lesson is that both problems were invisible until I measured the raw request and the usage detail side by side. Cache affinity and cost attribution are only hard because nothing on the happy path tells you they are broken.
