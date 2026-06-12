<!-- BUILD_ID: 20260612_task_result_linkage_contracts_v1 -->
# File Queue Task Result Linkage

## Purpose

Task result linkage records connect the safe artifacts produced by the file queue
workflow into one reviewable chain. The linkage contract exists so a reviewer
can see which authoring request produced a task, which dry-run validation report
accepted it, which execution request was approved, which interpreter result was
created, which AppData output packet was produced, and which owner decision came
afterward.

This phase is a contract baseline only. The linkage files are documentation,
schemas, fixtures, and static tests. They are not an execution path.

## Non-Goals

This phase does not implement:

- a queue consumer
- a runner
- a daemon
- a watcher
- automatic continuation
- a ledger writer
- task execution
- Codex CLI calls
- OpenAI API calls
- browser or UI automation
- provider, private API, trading, billing, deploy, or secrets behavior

## Core Identity Model

Every linkage chain is keyed by `chain_id` and `task_id`.

The chain keeps stable IDs for each handoff:

- `authoring_request_id`
- `generated_task_id`
- `validation_id`
- `execution_request_id`
- `interpreter_result_id`
- `output_packet_id`
- `owner_decision_id`

The IDs are data references. They do not authorize a later step. The owner
approval phrase and the current prompt still define the active permission
boundary.

## Artifact Linkage Chain

The first safe chain is:

1. Owner-approved task authoring request.
2. Generated task JSON.
3. Dry-run validator report.
4. Owner-approved execution request.
5. Execution interpreter result.
6. AppData output packet.
7. Owner decision record.

Each handoff records both a path and a SHA256 value. A later reviewer can verify
whether the artifact being discussed is the same artifact that was approved or
produced earlier.

## Hash Policy

All handoff boundaries require SHA256 evidence:

- authoring request SHA256
- generated task SHA256
- validator report SHA256
- execution request SHA256
- interpreter result SHA256
- output packet SHA256
- owner decision artifact SHA256 when an owner decision artifact is linked

Missing hashes are incomplete evidence. Mismatched hashes are unsafe evidence.
Static tests must reject both cases.

## Owner Decision Model

Owner decisions are explicit records, not inferred states. A decision must carry
a decision ID, `chain_id`, `task_id`, decision value, decision phrase, timestamp,
artifact path, artifact hash, one human review point, and next recommended
action.

Allowed decisions are:

- `GO`
- `REPAIR`
- `STOP`
- `SPLIT_TASK`
- `OWNER_MANUAL_ACTION`

A `GO` decision means the owner accepted the next bounded action named by that
decision record. It does not approve push, deploy, runtime execution, provider
access, private API access, UI automation, or another phase unless the current
prompt also says so.

## Task State Model

Allowed linkage states are:

- `AUTHORED`
- `VALIDATED_DRY_RUN`
- `EXECUTION_APPROVED`
- `EXECUTED_APPDATA_ONLY`
- `BLOCKED`
- `FAILED_SAFE`
- `STOP_OWNER_REVIEW_REQUIRED`
- `SUPERSEDED`
- `ARCHIVED`

The expected safe path is authored data, dry-run validation, execution approval,
AppData-only execution output, and owner review. Blocked and failed states
require owner review before any continuation.

## Duplicate And Replay Safety

A linkage record is duplicate-safe only when the IDs, paths, and hashes agree
across the chain. Replaying an older artifact with a newer ID, or reusing a path
with a different hash, is treated as unsafe.

Static tests must reject:

- missing parent references
- missing SHA256 values
- generated task SHA mismatch
- stale artifact references
- illegal state transitions
- owner decision records without a human review point

## Failure And Abuse Model

The linkage contract is designed to fail closed. The safe result for ambiguous
evidence is `STOP_OWNER_REVIEW_REQUIRED`.

Abuse cases include trying to encode a command in task text, using linkage data
as a permission token, swapping artifact paths after review, skipping owner
decision evidence, or using a result ledger as an execution queue. The contract
does not permit those behaviors.

## Why This Comes Before Consumer Or Runner

A consumer or runner can only be safe after the project has a stable way to
prove what one task was, how it was validated, how it was approved, what output
was produced, and what owner decision followed. This contract defines that proof
surface first.

Without this linkage layer, a consumer would have to infer state from loose
files. That would make duplicate execution, stale artifact use, and hidden
continuation harder to detect.

## What A Future Consumer May Read

A future consumer, if separately approved, may read:

- `chain_id`
- `task_id`
- handoff IDs
- artifact paths
- artifact hashes
- current state
- allowed next states
- owner decision value
- one human review point
- stop conditions

The reader must treat the record as evidence, not as permission to execute.

## What A Future Consumer Must Not Infer

A future consumer must not infer:

- owner approval from the existence of a linkage record
- permission to execute from `GO` without a current approval phrase
- permission to launch workers, runners, daemons, or watchers
- permission to call Codex CLI, OpenAI APIs, browser automation, providers, or
  private APIs
- permission to deploy, trade, mutate billing, or output secrets
- permission to push, fetch, pull, reset, restore, clean, or delete files

## STOP_OWNER_REVIEW_REQUIRED Conditions

Stop with `STOP_OWNER_REVIEW_REQUIRED` when:

- a required artifact path is missing
- a required SHA256 value is missing
- a hash does not match the referenced artifact
- a parent reference is missing or inconsistent
- the state transition is illegal
- an owner decision is missing or lacks one human review point
- a linkage record implies automatic continuation
- any future implementation needs a path outside the approved allowlist
- any runtime, deploy, provider, private API, trading, billing, browser, Codex,
  OpenAI, cleanup, push, fetch, or pull behavior appears necessary

## First Implementation Boundary

The first implementation is limited to:

- this documentation
- the result ledger policy documentation
- three JSON schemas
- seven synthetic fixtures
- one static Node test file

It does not create a runtime tool, queue folder, ledger writer, consumer,
runner, daemon, watcher, or task execution path.
