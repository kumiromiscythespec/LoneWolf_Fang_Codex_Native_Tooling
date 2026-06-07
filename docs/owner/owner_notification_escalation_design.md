# Owner Notification / Escalation Design

Status: Phase 2A docs-only design

This document is design-only and does not implement or send notifications.

## Purpose

Owner notification and escalation exist to make safe stops visible when Codex
or a future local workflow reaches a point that needs human judgment. The goal
is not to bypass owner approval. The goal is to record a clear owner attention
event, preserve the safe evidence, and stop until the owner decides what to do.

This phase only documents the design. For this phase:

- notification_implementation_performed = false for this phase
- notification_sent = false for this phase
- notification_contact_details_collected = false for this phase
- notification_provider_integrated = false for this phase
- notification_credentials_created = false for this phase

Future implementation requires separate approval. Future sending requires
separate approval. Future contact detail handling requires separate approval.

## Default Recommendation

The conservative default is artifact-only / local status file first. A future
workflow may write redacted local status such as an owner-attention artifact,
then stop with the normal owner gate. This keeps the first design local,
inspectable, and compatible with OSS users who do not have notification
providers configured.

Examples of future status files are design examples only:

- `status/owner_attention_required.json`
- `status/latest_stop_reason.md`
- `status/pending_owner_decision.md`

No status file writer, watcher, or notification adapter is implemented by this
document.

## Channel Stance

### Artifact-only / local status file

This is the recommended first channel. It has the lowest privacy risk because
it can stay local and can point to AppData artifacts by name and SHA256. It is
also suitable for OSS users because it does not require provider accounts,
contact details, or credentials.

### ChatGPT app notification

This may be the best future user experience only if an official safe mechanism
exists. Do not assume access to internal or unsupported notification APIs. Any
future use requires official capability confirmation, owner opt-in, redacted
payloads, and separate approval.

### Email notification

Email is an optional future adapter only. It requires opt-in, rate limiting,
redaction, and separate secrets handling. This repo must not request email
addresses, keep notification-provider secrets, or include setup steps that
require contact details by default.

### SMS / mobile short message

SMS is a high-risk future adapter only. It requires opt-in, strict payload
minimization, cost and spam controls, and separate provider review. Phone
numbers and provider credentials must not be collected or stored by default.

### Local desktop notification

Desktop notification is a possible local-only future adapter. It may be useful
on the owner machine, but it is OS-dependent and weak when the owner is away
from the PC. It still requires separate implementation approval.

## Payload Boundary

Notifications must never contain sensitive content. A notification should point
to safe artifact identity, not raw evidence. Allowed fields are limited to a
redacted event type, repo name, artifact name, artifact SHA256, high-level
reason, timestamp, owner review marker, and safe next action label.

Forbidden content includes secrets, API keys, tokens, raw auth payloads,
private API payloads, order IDs, billing data, account identifiers, contact
details, raw logs, raw ChatGPT conversations, raw Codex outputs, source snippets
containing secrets, screenshots with private information, secret-bearing stack
traces, provider credentials, device tokens, webhook URLs, Cloudflare secrets,
Stripe secrets, Clerk secrets, D1 secrets, R2 secrets, KV secrets, Queue
secrets, and exchange credentials.

## Approval Boundary

No external notification API may be called without later explicit approval. No
automatic escalation may bypass owner approval. A future notification may only
tell the owner that review is required and where to find the safe artifact.

If notification cannot be sent, the workflow must fall back to artifact-only
status and stop with:

```text
Stop and Wait - Owner Review Required.
```

## Orchestration Invariants

- worker_session_close_required_after_review_handoff = true
- no_next_worker_until_previous_worker_closed = true
- previous_worker_retired must be true before START_NEXT_IMPLEMENTER
- max_open_implementer_sessions_per_lane = 1
- max_open_reviewer_sessions_per_lane = 1
- max_total_open_worker_sessions_initial = 2
- v0.1 is one-lane-only
- if close/retire confirmation is missing, stop with:
  Stop and Wait - Owner Review Required.
- would_continue=true is not equivalent to real auto-start permission
- owner_review_required=false does not mean owner execution approval
- next_prompt_ready=true only means a text draft exists
- next_implementer_start_allowed remains false unless separately approved
- worker_launch_allowed remains false unless separately approved
- prompt_sending_allowed remains false unless separately approved
- real_orchestration_allowed remains false unless separately approved
