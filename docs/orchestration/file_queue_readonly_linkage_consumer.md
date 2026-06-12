<!-- BUILD_ID: 20260612_fasttrack_window3_readonly_linkage_consumer_v0 -->
# File Queue Read-only Linkage Consumer

## Purpose

The read-only linkage consumer observes linkage ledger or proof records and
produces a next-action observation for owner review. It treats linkage data as
evidence only. It does not execute a task, start a worker, mutate a queue, or
continue to the next phase.

## Input Boundary

The consumer reads JSON or JSONL linkage evidence. A record is accepted only
when it has the required identity, checksum, and status evidence:

- `chain_id`
- `task_id`
- `owner_decision_id`
- `output_packet_id`
- `validator_report_sha256`
- `execution_request_sha256`
- `interpreter_result_sha256`
- `output_packet_sha256`
- `owner_decision_sha256`
- `proof_status`, `status`, or `current_state`

Accepted proof statuses are:

- `ACCEPTED`
- `EXECUTED_APPDATA_ONLY`

Any missing identity, missing checksum, checksum format error, parent reference
mismatch, unsafe next recommendation, missing timestamp, unreadable ledger, or
ambiguous latest proof produces `STOP_OWNER_REVIEW_REQUIRED`.

## Output Observation

The output is a JSON observation matching
`schema/orchestration/file_queue_linkage_consumer_observation.schema.json`.
It always records:

- `observed_at_utc`
- `source_ledger_path`
- `latest_proof_id`
- `latest_proof_status`
- `next_action_recommendation`
- `owner_approval_required`
- `execution_allowed`
- `runtime_allowed`
- `reason`

`owner_approval_required` is always `true`. `execution_allowed` and
`runtime_allowed` are always `false`.

## Path Policy

Normal input and output paths must stay under the local AppData artifact root.
Fixture tests may use repository fixtures and temporary output directories only
when the test explicitly enables fixture paths.

The consumer must not write inside the repository, mutate linkage ledgers, or
write queue state.

## Non-Goals

This implementation does not provide:

- a runner
- a daemon
- a watcher
- a queue loop
- automatic continuation
- task execution
- helper execution
- validator execution
- interpreter execution
- Codex CLI calls
- OpenAI API calls
- browser or UI automation
- private API calls
- trading, billing, provider, deploy, or external service mutation

## Safety Rule

The consumer may recommend a next owner-review action. It must never execute
that action. If evidence is incomplete or ambiguous, the only safe
recommendation is `STOP_OWNER_REVIEW_REQUIRED`.
