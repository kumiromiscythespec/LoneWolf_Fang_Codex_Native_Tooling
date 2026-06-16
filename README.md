# Codex Native Closed Loop Tooling

This repository is a generic tooling and documentation template for the Codex
Native Closed Loop v0.1 workflow.

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
- A reusable public template that visitors adapt by choosing their own
  `<REPO_ROOT>`, `<PROJECT_ROOT>`, `<ARTIFACT_ROOT>`, and `<PROJECT_PROFILE>`.
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
- an OpenAI application submission package;
- a repository that requires a specific private project, personal Windows user
  directory, or owner-local artifact path.

Initial repository setup and docs work do not authorize worker launch, prompt
sending, GUI/window automation, real orchestration, PAPER or LIVE trading,
orders, private API access, backtests, replay, sweep, Monte Carlo, deploys,
publicization, notification sending, commits, or pushes.

## Codex Native Submission Readiness

This repo demonstrates static supervised dry-run orchestration contracts and
safety boundaries. It does not demonstrate real autonomous runtime execution,
worker launch, live observation, or cloud/API mutation.

Current submission-readiness references:

- [Final owner submission review guide](docs/oss_review/final_owner_submission_review_guide.md)
- [License readiness](docs/oss_review/license_readiness.md)
- [Completed chain inventory](docs/orchestration/codex_native_submission_readiness_completed_chain_inventory.md)

Safe local validation:

```powershell
node --test
```

Deployment, runtime workflows, live observation, worker launch,
Queue/cloud/API mutation, billing/auth/trading behavior, private API calls,
OpenAI API calls, public submission, GitHub visibility changes, release
creation, release asset upload, commit, and push remain separate owner/external
gated actions.

## Quick Start

1. Read the rule files first:
   - `CLAUDE.md`
   - `CODEX_RULES.md`
   - `LONEWOLF_FANG_SAFETY_BOUNDARY.md`
2. Read [docs/runbooks/first_time_setup.md](docs/runbooks/first_time_setup.md).
3. Read [docs/safety/file_placement_policy.md](docs/safety/file_placement_policy.md)
   before placing files.
4. Read the OSS readiness and security pointers:
   - [SECURITY.md](SECURITY.md)
   - [CONTRIBUTING.md](CONTRIBUTING.md)
   - [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
   - [docs/architecture/overview.md](docs/architecture/overview.md)
   - [docs/oss_review/open_source_safety_review.md](docs/oss_review/open_source_safety_review.md)
   - [docs/oss_review/publicization_readiness_checklist.md](docs/oss_review/publicization_readiness_checklist.md)
5. Use [docs/runbooks/start_orchestration_prompt.md](docs/runbooks/start_orchestration_prompt.md)
   for a safe starter prompt.
6. Choose a local artifact root outside the repo and refer to it as
   `<ARTIFACT_ROOT>`.
7. Recommended public examples:
   - Windows path: `%LOCALAPPDATA%\CodexNativeClosedLoop\data`
   - PowerShell: `$env:CNCL_ARTIFACT_ROOT = "$env:LOCALAPPDATA\CodexNativeClosedLoop\data"`
   - macOS/Linux: `$HOME/.local/share/codex-native-closed-loop/data`
8. Verify artifact ZIPs with SHA256 sidecars before using them as input to a
   later phase.
9. Stop with `Stop and Wait - Owner Review Required.` whenever repo identity,
   scope, approval, safety boundary, or artifact identity is unclear.

## Repo Structure

Expected layout:

- `docs/`: documentation for the workflow.
- `docs/owner/`: owner approval gates and decision rules.
- `docs/safety/`: safety boundaries, file placement, artifact handoff, and
  secret-handling policy.
- `docs/security/`: secret handling, redaction, and vulnerability reporting.
- `docs/contributor/`: implementer, reviewer, owner, and handoff expectations.
- `docs/architecture/`: one-lane workflow, approval gates, and evidence chain.
- `docs/oss_review/`: publicization readiness and OSS application planning.
- `docs/release_packaging/`: future GitHub Releases ZIP plan, versioning,
  manifest, exclusion, and validation policies.
- `docs/release_notes/`: phase baseline summaries.
- `docs/runbooks/`: first-time setup and safe starter prompts.
- `docs/setup/`: environment variables, artifact root setup, and project
  profile templates for public template users.
- `docs/evidence_chain/`: future evidence-chain and SHA256 handoff notes.
- `schema/`: future schemas for safe synthetic artifacts or status files.
- `fixtures/`: future synthetic, non-secret fixtures.
- `src/`: future source code only after explicit placement approval.
- `src/local_orchestrator/`: future local orchestrator source only after
  explicit owner approval.
- `tests/`: future tests for approved source or documentation checks.
- `artifacts_index/`: metadata-only index of external artifacts. Do not
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

`<ARTIFACT_ROOT>`

Each user must choose their own artifact root. Do not commit private local
profiles, raw conversations, generated handoff ZIPs, or personal local paths.

Useful environment variables:

- `CNCL_REPO_ROOT=<REPO_ROOT>`
- `CNCL_PROJECT_ROOT=<PROJECT_ROOT>`
- `CNCL_ARTIFACT_ROOT=<ARTIFACT_ROOT>`
- `CNCL_PROJECT_PROFILE=<PROJECT_PROFILE>`

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

## Public Template And Private Project Profiles

This public repository is the template layer. It teaches the workflow, safety
gates, evidence handoff shape, and placeholder conventions.

Private downstream projects may keep their own project profile outside this
repo, or in ignored `.local` files if a later task explicitly approves that
pattern. A private profile can define project-specific product rules, local
paths, approval phrases, or operational boundaries, but those details are not
requirements for using the public template.

Start with:

- [docs/setup/environment_variables.md](docs/setup/environment_variables.md)
- [docs/setup/artifact_root_setup.md](docs/setup/artifact_root_setup.md)
- [docs/setup/project_profile_template.md](docs/setup/project_profile_template.md)
- [docs/setup/public_template_vs_private_project.md](docs/setup/public_template_vs_private_project.md)
- [docs/setup/migration_from_private_project_paths.md](docs/setup/migration_from_private_project_paths.md)

## Future Release Packaging

Release packaging is planned as a final-stage process. See
[docs/release_packaging/](docs/release_packaging/) for the future GitHub
Releases ZIP plan. No release asset is created by default.

The planned public ZIP is a public template bundle, not a private project
artifact. Future ZIP dry-runs, tag creation, GitHub Release creation, release
asset upload, public visibility changes, and OpenAI application submission each
require separate owner approval.

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

## OSS Readiness Boundary

Phase 3 adds OSS-readiness documentation only. It does not make this repository
public, submit an OpenAI Codex for OSS application, implement notifications,
collect contact details, integrate providers, create credentials, implement a
local status writer, place Local Orchestrator files, run runtime behavior, or
change Public Radar.

Start with:

- [docs/oss_review/license_readiness.md](docs/oss_review/license_readiness.md)
- [docs/oss_review/open_source_safety_review.md](docs/oss_review/open_source_safety_review.md)
- [docs/oss_review/openai_codex_for_oss_application_materials_plan.md](docs/oss_review/openai_codex_for_oss_application_materials_plan.md)
- [docs/oss_review/public_radar_supporting_evidence.md](docs/oss_review/public_radar_supporting_evidence.md)
- [docs/release_notes/phase1_phase2_baseline.md](docs/release_notes/phase1_phase2_baseline.md)

License selection remains an owner decision until the intended public license
and copyright holder are explicitly confirmed.

## Safe Starter Prompt

Use the safe template in
[docs/runbooks/start_orchestration_prompt.md](docs/runbooks/start_orchestration_prompt.md).

Start read-only or docs-only first. Require assumptions, unclear points, success
criteria, touched files plan, must-not-touch files, safety confirmation,
external artifacts under `<ARTIFACT_ROOT>`, and a final owner-facing summary.
