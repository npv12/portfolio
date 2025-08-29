---
title: "How We Built Our Outreach Sequences Engine (and What Hurt)"
date: "2024-03-15"
author: "Pranav Nedungadi"
tags: ["Outreach", "Sequences", "Architecture", "Data Model", "Cron Jobs", "Event-Driven"]
---

# How We Built Our Outreach Sequences Engine (and What Hurt)

## TL;DR
We built an outreach engine on top of an identity graph linking **Twitter IDs**, **emails**, and **crypto addresses**. Users defined **Sequences** (follow → DM → branch on reply), and a **6-hour cron** advanced every lead through the steps. It worked at scale, but we hit latency, rate-limit pain, and limited observability. This post documents the v1 architecture, the data model, and the cracks we found—groundwork for the next post on the event-driven rebuild.

---

## Context & Goals
- **Audience graph:** ~100M Twitter profiles scraped, plus separate tables for email and crypto; mapping tables linked identities.
- **Static segments:** audiences were snapshots (not dynamic filters).
- **Sequences:** actions and triggers modeled in SQL; templates supported variables and A/B variants.
- **Execution:** a cron ran every 6 hours, locking leads row-by-row and firing the next action, with exponential backoff.
- **Signals:** reply/follow-back detection via **polling** (Twitter inbox/relationships).
- **Limits:** per-account/day/hour, tuned per provider (lowest for Twitter, higher for email).
- **Metrics:** replies, positive replies, reads (basic counts).
- **Gaps:** no DND/consent list, no cross-channel dedup.

---

## HLD — v1 Component Diagram

```mermaid
flowchart LR
  A[Audience Builder] --> B[Sequences Service]
  B -->|Every 6h| C[Cron Orchestrator]
  C --> D[(Postgres)]
  C --> E[Twitter API]
  C --> F[LinkedIn API]
  C --> G[XMTP/Email Provider]
  H[Polling Workers] -->|Inbox/Relations| E
  H -->|Normalized Results| C
  C --> I[Sequence Actions History]
  C --> J[Basic Metrics]
```

---

## Data Model (Core Tables)

We modeled sequences as **nodes (actions)** and **edges (triggers)**, with per-lead progress.

```mermaid
classDiagram
  class Sequences {
    uuid PK
    user_id
    name
    twitter_oauth_id
    linkedin_oauth_id
    xmtp_oauth_id
    provider JSON
    segment_id
    segment_id_list JSON
    first_action_id
    status (ACTIVE|COMPLETED|PAUSED|PROCESSING)
    exclude_already_dmed bool
    created_at, updated_at, deleted_at
  }
  class SequenceActions {
    uuid PK
    sequence_id FK
    action_type (FOLLOW_ON_TWITTER, SEND_TWITTER_DM, ...)
    provider (TWITTER|LINKEDIN|XMTP)
    message
    fallback_message
    frontend_action_id
    lambda_arn
    created_at, updated_at, deleted_at
  }
  class SequenceTriggers {
    uuid PK
    sequence_id FK
    trigger_type (REPLIED, NOT_REPLIED, FOLLOWED_BACK, ...)
    provider
    previous_action_id
    next_action_id
    delay
    created_at, updated_at, deleted_at
  }
  class SequenceLeads {
    uuid PK
    sequence_id FK
    name
    twitter_username
    twitter_id
    linkedin_id
    linkedin_id_type
    xmtp_address
    last_action_id
    next_action_id
    status (NOT_STARTED, ...)
    additional_data JSON
    created_at, updated_at, deleted_at
  }
  class SequenceTriggersResponses {
    uuid PK
    sequence_id FK
    oauth_id
    provider
    trigger_type
    lead_id FK
    timestamp
    additional_data JSON
    created_at, updated_at, deleted_at
  }
  class SequenceActionsHistory {
    uuid PK
    lead_id FK
    sequence_id FK
    status (SENT|FAILED|...)
    action_id FK
    action_type
    trigger_id FK
    trigger_type
    additional_data JSON
    created_at, updated_at, deleted_at
  }

  Sequences "1" --> "*" SequenceActions
  Sequences "1" --> "*" SequenceTriggers
  Sequences "1" --> "*" SequenceLeads
  SequenceActions "1" --> "*" SequenceActionsHistory
  SequenceTriggers "1" --> "*" SequenceActionsHistory
  SequenceLeads "1" --> "*" SequenceActionsHistory
  Sequences "1" --> "*" SequenceTriggersResponses
```

### Enums (Actions & Triggers)
- **Actions:** `SEND_CONNECTION_REQUEST`, `SEND_TWITTER_DM`, `SEND_LINKEDIN_DM`, `SEND_XMTP_DM`, `FOLLOW_ON_TWITTER`, `UNFOLLOW_ON_TWITTER`, `CHECK_FOR_REPLY`
- **Triggers:** `REPLIED`, `NOT_REPLIED`, `CONNECTION_ACCEPTED`, `CONNECTION_NOT_ACCEPTED`, `FOLLOWED_BACK`, `NOT_FOLLOWED_BACK`, `END`, `NORMAL_EDGE`, `REPLIED_TO_NOTE`

---

## LLD — v1 Execution Flow (Follow → DM → Branch)

```mermaid
sequenceDiagram
  autonumber
  participant Cron
  participant DB as Postgres
  participant Tw as Twitter API
  participant Poll as Pollers

  Cron->>DB: SELECT leads WHERE next_action_id=FOLLOW FOR UPDATE
  Cron->>Tw: POST /friendships/create (follow)
  Tw-->>Cron: 200 OK
  Cron->>DB: INSERT SequenceActionsHistory (SENT), update last/next_action_id

  Poll->>Tw: GET /inbox + /friendships/lookup
  Tw-->>Poll: messages, follow state
  Poll->>Cron: normalized event (FOLLOWED_BACK or DM reply)
  Cron->>DB: INSERT SequenceTriggersResponses

  Cron->>DB: Decide next_action_id (e.g., SEND_TWITTER_DM)
  Cron->>Tw: POST /dm/new
  Tw-->>Cron: 200 OK
  Cron->>DB: INSERT history + update lead pointers

  Note over Cron: Every 6 hours, repeat for remaining leads
```

---

## What Hurt (and Why)
- **High latency:** 6-hour ticks meant slow reactions to replies → missed windows.
- **Polling overhead:** reading inboxes for every account is noisy and rate-limit heavy.
- **Coarse rate limiting:** per-day/hour caps help, but without **per-send token buckets** you get bursts or unnecessary throttling.
- **Idempotency risk:** retries + crashes can double-send unless strictly guarded per (lead, action).
- **Limited observability:** no immutable, normalized event log → harder to build funnels and audit trails.
- **Compliance gaps:** no DND/consent enforcement; limited auto-unsubscribe handling.
- **No cross-channel dedup:** the same human could be approached across multiple channels unintentionally.
- **Versioning friction:** editing a sequence in place makes in-flight state tricky.

That’s our honest snapshot of v1—the foundation for the next evolution.
