# LoneWolf Fang Codex Native Tooling

This repository is a dedicated tooling and documentation repository for the
Codex Native Closed Loop v0.1 workflow.

It is meant to help a human owner, an implementer, and a reviewer keep Codex or
AI-coding work inside explicit safety gates. The repo starts from documentation
and evidence handoff first: define the scope, create or review an artifact, stop
for owner review, and require a new explicit approval before moving to the next
phase.

## What This Repo Is

- A documentation-first safety workflow for Codex / AI coding work.
- A template for separating implementer, reviewer, and owner decision gates.
- A place to document safe file placement, artifact handoff, and owner approval
  rules.
- A future home for local orchestration tooling only after a separate owner
  placement approval.

## What This Repo Is Not

This repository is not:

- a trading bot;
- a runtime worker launcher;
- prompt-sending automation by default;
- GUI/window close automation;
- a deploy tool;
- a private API, account, or order execution tool;
- a notification sender;
- an OpenAI application submission package.

Initial repository setup and docs work do not authorize worker launch, prompt
sending, GUI/window automation, real orchestration, PAPER or LIVE trading,
orders, private API access, backtests, replay, sweep, Monte Carlo, deploys,
publicization, notification sending, commits, or pushes.

## Quick Start

1. Read the rule files first:
   - `CLAUDE.md`
   - `CODEX_RULES.md`
   - `LONEWOLF_FANG_SAFETY_BOUNDARY.md`
2. Read [docs/runbooks/first_time_setup.md](docs/runbooks/first_time_setup.md).
3. Read [docs/safety/file_placement_policy.md](docs/safety/file_placement_policy.md)
   before placing files.
4. Use [docs/runbooks/start_orchestration_prompt.md](docs/runbooks/start_orchestration_prompt.md)
   for a safe starter prompt.
5. Keep generated handoff artifacts outside the repo under:
   `C:\Users\yu_ki\AppData\Local\LoneWolfFang\data`
6. Verify artifact ZIPs with SHA256 sidecars before using them as input to a
   later phase.
7. Stop with `Stop and Wait - Owner Review Required.` whenever repo identity,
   scope, approval, safety boundary, or artifact identity is unclear.

## Repo Structure

Expected layout:

- `docs/`: documentation for the workflow.
- `docs/owner/`: owner approval gates and decision rules.
- `docs/safety/`: safety boundaries, file placement, artifact handoff, and
  secret-handling policy.
- `docs/runbooks/`: first-time setup and safe starter prompts.
- `docs/evidence_chain/`: future evidence-chain and SHA256 handoff notes.
- `schema/`: future schemas for safe synthetic artifacts or status files.
- `fixtures/`: future synthetic, non-secret fixtures.
- `src/`: future source code only after explicit placement approval.
- `src/local_orchestrator/`: future local orchestrator source only after
  explicit owner approval.
- `tests/`: future tests for approved source or documentation checks.
- `artifacts_index/`: metadata-only index of external AppData artifacts. Do not
  store artifact ZIP payloads here by default.

## Safety Defaults

By default, the workflow does not allow:

- worker launch;
- prompt sending;
- GUI/window close;
- real worker retirement;
- next worker auto-start;
- deploy;
- Cloudflare / D1 / R2 / KV / Queue / Stripe / Clerk mutation;
- PAPER / LIVE / order / cancel / fetch_balance / private API;
- MEXC private API;
- backtest / replay / sweep / Monte Carlo;
- publicization or GitHub visibility change;
- notification sending;
- contact detail collection;
- commit or push.

The following safety meanings must be preserved:

- would_continue=true is not equivalent to real auto-start permission.
- owner_review_required=false does not mean owner execution approval.
- next_prompt_ready=true only means a text draft exists.
- next_implementer_start_allowed remains false unless separately approved.
- worker_launch_allowed remains false unless separately approved.
- prompt_sending_allowed remains false unless separately approved.
- real_orchestration_allowed remains false unless separately approved.

Closed-loop invariants:

- `worker_session_close_required_after_review_handoff = true`
- `no_next_worker_until_previous_worker_closed = true`
- `previous_worker_retired must be true before START_NEXT_IMPLEMENTER`
- `max_open_implementer_sessions_per_lane = 1`
- `max_open_reviewer_sessions_per_lane = 1`
- `max_total_open_worker_sessions_initial = 2`
- `v0.1 is one-lane-only`
- if close/retire confirmation is missing, stop with:
  `Stop and Wait - Owner Review Required.`

## Owner Approval

Owner approvals are phrase-based. A phrase approves only the exact scope named
in that phrase.

Examples of separated approvals:

- docs-only implementation approval;
- commit approval;
- push approval;
- public visibility review approval;
- OpenAI application draft approval;
- notification design approval;
- runtime or deploy approval.

Do not bundle these approvals together. If an approval is unclear, stop with:
`Stop and Wait - Owner Review Required.`

See [docs/owner/owner_approval_gate.md](docs/owner/owner_approval_gate.md).

## Artifact Handoff

Handoff artifacts live outside the repo under:

`C:\Users\yu_ki\AppData\Local\LoneWolfFang\data`

Expected artifact shape:

- a timestamped folder;
- `manifest.json`;
- `safe_summary.md`;
- a validation or test summary when relevant;
- `human_review_one_point.md`;
- `NEXT_CODEX_PROMPT.md`;
- `checksums_sha256.txt`;
- a ZIP file;
- `.zip.sha256`;
- `.zip.sha256.json`.

The next phase should reference both the artifact path and SHA256. Do not place
secrets, raw auth payloads, production DB dumps, `.git`, `node_modules`, nested
ZIPs, raw private logs, or private ChatGPT/Codex conversation dumps in artifacts.

See [docs/safety/artifact_handoff_policy.md](docs/safety/artifact_handoff_policy.md).

## Future Notification Boundary

Owner notification and escalation are design-only until separately approved.
The conservative default is an artifact-only or local status file that a human
can inspect later.

ChatGPT app notifications may be the best future user experience only if an
official safe mechanism exists. Email and SMS are future opt-in adapters only
and require separate secrets handling. This repo must not send notifications,
collect contact details, or keep notification-provider secrets by default.

Phase 2A owner notification / escalation design:

- [docs/owner/owner_notification_escalation_design.md](docs/owner/owner_notification_escalation_design.md)
- [docs/owner/owner_attention_events.md](docs/owner/owner_attention_events.md)
- [docs/safety/notification_privacy_policy.md](docs/safety/notification_privacy_policy.md)
- [docs/safety/notification_payload_redaction_policy.md](docs/safety/notification_payload_redaction_policy.md)
- [docs/runbooks/owner_escalation_events.md](docs/runbooks/owner_escalation_events.md)
- [docs/runbooks/notification_failure_fallback.md](docs/runbooks/notification_failure_fallback.md)
- [docs/examples/safe_notification_payloads.md](docs/examples/safe_notification_payloads.md)

## Safe Starter Prompt

Use the safe template in
[docs/runbooks/start_orchestration_prompt.md](docs/runbooks/start_orchestration_prompt.md).

Start read-only or docs-only first. Require assumptions, unclear points, success
criteria, touched files plan, must-not-touch files, safety confirmation, AppData
artifacts, and a final owner-facing summary.
