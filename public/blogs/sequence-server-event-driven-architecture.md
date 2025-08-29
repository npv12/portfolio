---
title: "From Crons to Real-Time: Our Event-Driven Outreach Architecture"
date: "2024-04-15"
author: "Pranav Nedungadi"
tags: ["Outreach", "Event-Driven", "Architecture", "Data Model", "Sequences", "Real-Time"]
---

# From Crons to Real-Time: Our Event-Driven Outreach Architecture

## TL;DR
We rebuilt the engine as **event-driven**: sequences compiled into a DAG; a **Trigger Engine** advances leads on inbound events/timeouts; an **Action Scheduler** enforces a **pre-send compliance gate** and **token-bucket rate limits**; **Provider Adapters** send via official APIs; **Inbound Ingestors** normalize replies/follow-backs. We added an **outbox** and an **append-only events log** for auditability. Migration was incremental—no big-bang.

---

## Goals
- React to replies in **seconds**, not hours.
- **Never** double-send (idempotency everywhere).
- Respect platform rate limits safely.
- Gain clear **funnels, analytics, and audit logs**.
- Add **DND/consent** checks up front.
- Keep the existing schema; add only what’s needed.

---

## HLD — Event-Driven Architecture

```mermaid
flowchart TD
  subgraph Data
    P[(Postgres)]
    EV[(events table)]
    OB[(outbox)]
    SG[(sequence_graphs)]
  end

  subgraph Bus
    Q1[[sequence.transitions]]
    Q2[[outbound.actions]]
    Q3[[inbound.events]]
    DLQ[[dead.letter]]
  end

  subgraph ControlPlane
    TE[Trigger Engine]
    AS[Action Scheduler]
    DELAY[Delay Service]
  end

  subgraph Providers
    TA[Twitter Adapter]
    LA[LinkedIn Adapter]
    XA[XMTP Adapter]
    EA[Email Adapter]
  end

  subgraph Inbound
    WH[Webhook Receivers]
    POL[Pollers]
  end

  SG --> TE
  WH --> Q3
  POL --> Q3
  Q3 --> TE
  TE --> Q1
  DELAY --> Q1
  Q1 --> AS
  AS -->|throttled->requeue| Q1
  AS --> Q2
  Q2 --> TA
  Q2 --> LA
  Q2 --> XA
  Q2 --> EA
  TA --> Q3
  LA --> Q3
  XA --> Q3
  EA --> Q3

  TE --> P
  AS --> P
  TA --> P
  LA --> P
  XA --> P
  EA --> P
  P --> OB
  OB --> Q3
  OB --> Q1
  Q2 --> DLQ
```

**Why this matters**
- **Sequence DAG (compiled):** Your `SequenceActions` + `SequenceTriggers` become a versioned graph in `sequence_graphs`. Runtime traversal is O(1).
- **Trigger Engine:** Consumes *inbound* events and *timeouts*, advances the node, emits `ActionScheduled`.
- **Action Scheduler:** Runs **pre-send gate** (DND/consent/caps) and **token-bucket** rate limiting per `(provider, oauth_id)` → queues provider jobs.
- **Provider Adapters:** Stateless workers; only official APIs; emit `ActionSent/Failed` with provider message IDs.
- **Inbound Ingestors:** Prefer webhooks; keep pollers where needed; normalize to domain events.
- **Outbox + events:** Atomic publishing and immutable history for analytics and audits.

---

## LLD — Core Flows

### 1) Reply-Driven Fast Path (Follow → Follow-Back → DM → Positive Reply)
```mermaid
sequenceDiagram
  autonumber
  participant IN as Webhook/Poller
  participant TE as Trigger Engine
  participant AS as Action Scheduler
  participant TW as Twitter Adapter
  participant DB as Postgres
  participant BUS as Bus

  IN->>BUS: FollowedBackDetected{lead_id, sequence_id, oauth_id}
  BUS->>TE: event
  TE->>DB: lock lead, load DAG, compute next
  TE->>BUS: ActionScheduled{action_id=SEND_TWITTER_DM, delay=0}
  BUS->>AS: ActionScheduled
  AS->>AS: pre-send gate (DND, caps)
  AS->>AS: token bucket TWITTER:oauth_id.try_consume()
  AS->>BUS: outbound.actions{...}
  BUS->>TW: job
  TW->>TW: send DM via official API
  TW->>DB: upsert action_executions (lead_id, action_id) UNIQUE
  TW->>BUS: ActionSent{provider_message_id}
  BUS->>TE: ActionSent
  Note over IN: later...
  IN->>BUS: DMReplyReceived{text, ...}
  BUS->>TE: event
  TE->>DB: advance edge(REPLIED) → next node
```

### 2) Timeout Path (No Reply → Apology/Stop)
```mermaid
sequenceDiagram
  autonumber
  participant TE as Trigger Engine
  participant DEL as Delay Service
  participant AS as Action Scheduler
  participant TW as Twitter Adapter
  participant DB as Postgres
  participant BUS as Bus

  TE->>DEL: schedule timeout (e.g., 48h)
  DEL->>BUS: ActionScheduled{CHECK_FOR_REPLY, delay elapsed}
  BUS->>AS: ActionScheduled
  AS->>TW: outbound.actions (if gate passes)
  TW->>DB: record check
  TW->>BUS: ActionSent
  BUS->>TE: ActionSent
  TE->>DB: no reply → NOT_REPLIED edge → apology branch or END
```

---

## Data Model Additions (Minimal, Powerful)

```mermaid
classDiagram
  class events {
    uuid PK
    occurred_at
    type
    sequence_id
    lead_id
    provider
    oauth_id
    idempotency_key UNIQUE
    payload JSONB
  }
  class outbox {
    uuid PK
    aggregate_type
    aggregate_id
    event_json JSONB
    status
    created_at
  }
  class action_executions {
    uuid PK
    lead_id
    action_id
    provider
    oauth_id
    provider_message_id
    status
    error
    created_at
    ++ UNIQUE(lead_id, action_id)
  }
  class dnc_list {
    id PK
    identifier
    channel
    reason
    created_at
    ++ UNIQUE(identifier, channel)
  }
  class sequence_graphs {
    id PK
    sequence_id
    version
    nodes JSONB
    edges JSONB
    created_at
    ++ UNIQUE(sequence_id, version)
  }
```

### Idempotency Keys
- **Sends:** `UNIQUE(lead_id, action_id)` in `action_executions` prevents duplicate sends across retries.
- **Events:** `idempotency_key = sha256(provider|oauth_id|kind|lead_id|action_id|ts_bucket)` dedupes noisy inbound signals.

### Rate Limiting
- **Token bucket** per `(provider, oauth_id)` in Redis.
- Strict refill rates per platform; no bursts beyond capacity.
- On `429`/`5xx`: exponential backoff + jitter; never drop idempotency guard.

### Pre-Send Gate (Compliance First)
- Check **DND** (`dnc_list`) and tenant-level caps.
- Map **“stop/unsubscribe”** replies to automatic DND enrollment.
- Enforce geo/channel rules if/when you store region/consent metadata.
- Log **ComplianceBlocked** events for audits.

---

## Migration Plan (No Big-Bang)
1. **Eventify the cron**  
   Keep cron/pollers but write `events` via the **outbox**; enforce `action_executions` idempotency now.
2. **Introduce Trigger Engine + Delays**  
   Compile DAGs (`sequence_graphs`), let TE drive next steps on inbound/timeouts; cron becomes a dumb poller.
3. **Move sends to Adapters + Scheduler**  
   Wire token buckets & pre-send gate; deprecate cron decisions; keep pollers until webhooks are ready.

---

## What You Get
- **Seconds-level reaction** to replies/follows instead of 6-hour batches.
- **Zero double-sends** under retries/crashes.
- Clear **funnels & A/B analytics** off a normalized event stream.
- A far better **compliance posture** (DND, audit trail, per-channel caps).

---

## Appendix — Practical Tips
- Include `template_id`/`variant_id` in `ActionScheduled.payload`; persist the chosen variant in `ActionSent`.
- Use FIFO queues with per-lead message-group IDs to guarantee ordering if you go with SQS.
- Build dashboards for queue lag, 429 rate, success/fail per provider, stuck leads, time-to-reply.
- Version sequences; let in-flight leads finish their current version.
