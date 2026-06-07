# Status File Manual Review Runbook

## Purpose

This runbook explains how an owner or reviewer should interpret a future local status file that conforms to `schema/local_status_file.schema.json`.

The status file concept is artifact-only / local status file first. It is not runtime execution, not notification sending, not worker launch, and not permission to continue automatically.

## Manual Review Steps

1. Confirm the status file was produced by a separately approved phase.
2. Read `current_status`, `latest_event_type`, `latest_severity`, and `safe_next_action_label`.
3. Confirm `latest_artifact_sha256` matches the referenced artifact.
4. Confirm `owner_review_required` and `stop_message`.
5. If the stop message is `Stop and Wait - Owner Review Required.`, make one human decision before any next phase.
6. Do not infer commit, push, deploy, publicization, runtime, or notification approval from the status file.

## Safety Interpretation

- notification_implementation_performed = false for this phase
- notification_sent = false for this phase
- notification_contact_details_collected = false for this phase
- notification_provider_integrated = false for this phase
- notification_credentials_created = false for this phase
- local_status_file_writer_implemented = false for this phase
- source_code_implemented = false for this phase

## Forbidden Inferences

The existence of a status file schema or future status file does not authorize:

- notification sending
- contact detail handling
- provider credential handling
- local status writer implementation
- runtime watcher implementation
- Local Orchestrator implementation placement
- worker launch
- prompt sending automation
- GUI/window close automation
- publicization
- OpenAI application submission
- deploy, PAPER, LIVE, order, cancel, fetch_balance, private API, backtest, replay, sweep, or Monte Carlo
- git add, commit, push, PR creation, or PR merge

## Required Invariants

- worker_session_close_required_after_review_handoff = true
- no_next_worker_until_previous_worker_closed = true
- previous_worker_retired must be true before START_NEXT_IMPLEMENTER
- max_open_implementer_sessions_per_lane = 1
- max_open_reviewer_sessions_per_lane = 1
- max_total_open_worker_sessions_initial = 2
- v0.1 is one-lane-only
- if close/retire confirmation is missing, stop with:
  Stop and Wait - Owner Review Required.

Also:

- would_continue=true is not equivalent to real auto-start permission
- owner_review_required=false does not mean owner execution approval
- next_prompt_ready=true only means a text draft exists
- next_implementer_start_allowed remains false unless separately approved
- worker_launch_allowed remains false unless separately approved
- prompt_sending_allowed remains false unless separately approved
- real_orchestration_allowed remains false unless separately approved
