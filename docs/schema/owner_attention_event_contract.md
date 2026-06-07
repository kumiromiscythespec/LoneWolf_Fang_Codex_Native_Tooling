# Owner Attention Event Contract

## Purpose

`schema/owner_attention_event.schema.json` defines a safe, redacted event that can tell an owner that attention is needed. It supports the Codex Native Closed Loop v0.1 principle of artifact-only / local status file first.

The schema is a contract only. It does not implement notification sending, a local status writer, runtime orchestration, worker launch, prompt sending automation, publicization, or OpenAI application submission.

## What It Permits

- Recording a high-level reason for owner attention.
- Linking a safe artifact name and SHA256.
- Marking whether owner review is required.
- Naming a safe next action label.
- Carrying the stop message `Stop and Wait - Owner Review Required.`
- Confirming redaction, artifact-only fallback, and absence of secret payloads.

## What It Forbids

The schema uses `additionalProperties: false` and does not define fields for secrets, API keys, tokens, raw auth payloads, private API payloads, order IDs, billing data, account identifiers, contact details, device tokens, webhook URLs, provider credentials, raw logs, raw ChatGPT or Codex conversations, source snippets with secrets, private screenshots, or stack traces with secrets.

## Owner Review Behavior

When `owner_review_required` is true, the event is evidence for a human decision. It is not permission to continue automatically. `owner_review_required=false` does not mean owner execution approval.

## Phase 2B Safety Flags

- notification_implementation_performed = false for this phase
- notification_sent = false for this phase
- notification_contact_details_collected = false for this phase
- notification_provider_integrated = false for this phase
- notification_credentials_created = false for this phase
- local_status_file_writer_implemented = false for this phase
- source_code_implemented = false for this phase

## Approval Gates

Future runtime writer approval, notification adapter approval, contact detail handling approval, provider integration approval, commit approval, and push approval are separate owner decisions. Schema existence does not authorize runtime behavior.

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

Additional interpretation rules:

- would_continue=true is not equivalent to real auto-start permission
- owner_review_required=false does not mean owner execution approval
- next_prompt_ready=true only means a text draft exists
- next_implementer_start_allowed remains false unless separately approved
- worker_launch_allowed remains false unless separately approved
- prompt_sending_allowed remains false unless separately approved
- real_orchestration_allowed remains false unless separately approved

## Future Validation

A later approved validation phase should parse the schema, parse safe fixtures, verify required fields, enforce `event_type` and `severity` enums, reject forbidden fields, scan fixtures for sensitive content, and run `git diff --check`.
