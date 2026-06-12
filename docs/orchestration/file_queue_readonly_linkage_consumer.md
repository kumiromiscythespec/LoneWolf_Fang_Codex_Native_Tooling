<!-- BUILD_ID: 20260612_fasttrack_window3_readonly_linkage_consumer_v0 -->
<!-- BUILD_ID: 20260613_ledger_consumer_static_hardening_v1 -->
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

## Wrong-State Static Hardening Contract

Future wrong-state hardening must keep the consumer read-only. The consumer may
derive an observation from existing evidence, but it must not mutate a ledger,
repair a record, write queue state, execute a task, or continue automatically.

The authoritative proof selection rule is intentionally narrow:

1. parse JSON or JSONL evidence without mutation;
2. reject malformed records and unexpected top-level fields;
3. consider only accepted review statuses such as `ACCEPTED` and
   `EXECUTED_APPDATA_ONLY`;
4. validate identity fields, timestamp fields, SHA256 fields, parent references,
   safety flags, and forbidden-action confirmations;
5. apply valid supersession records as a read-only overlay;
6. select exactly one active terminal proof;
7. emit `STOP_OWNER_REVIEW_REQUIRED` when proof authority is missing,
   duplicated, tied, stale without a valid supersession relation,
   checksum-mismatched, or ambiguous.

Fail-closed observations should include a human-readable reason and a
`human_review_one_point` value that names the single owner decision needed to
repair or pause. For all static/manual paths, `owner_approval_required` remains
`true`, `execution_allowed` remains `false`, and `runtime_allowed` remains
`false`.

The consumer must never infer owner approval from artifact presence, file order,
matching `chain_id`, an old `GO` decision, or a missing checksum. Ambiguity is a
stop condition, not a tie-breaker.
