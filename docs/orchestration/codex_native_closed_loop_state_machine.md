<!-- BUILD_ID: 20260612_fasttrack_window4_closed_loop_state_machine_v0 -->
# Manual Closed Loop Coordinator State Machine

## Purpose

This contract defines a manual, local-only coordinator state machine for the
Codex Native Closed Loop. It classifies evidence about the current manual
handoff state and returns the next safe plan or refusal state.

The coordinator is not a runner, daemon, watcher, queue consumer, ledger writer,
validator, interpreter, or task executor. It does not launch workers, call
OpenAI, send prompts, execute tasks, mutate ledger or queue files, deploy, trade,
bill, fetch private data, or continue automatically.

## Plan Object

Every classification returns a plan object with these fields:

- `current_state`
- `event`
- `next_state`
- `allowed_next_phase`
- `execution_allowed`
- `owner_approval_required`
- `reason`

`execution_allowed` must always be `false`. A true value is unsafe and must be
classified as `STOP_OWNER_REVIEW_REQUIRED`.

## States

- `NO_TASK`
- `TASK_AUTHORED`
- `VALIDATOR_ACCEPTED`
- `VALIDATOR_REJECTED`
- `INTERPRETER_COMPLETED`
- `REVIEW_PACKET_CREATED`
- `OWNER_DECISION_REQUIRED`
- `LINKAGE_PROOF_CREATED`
- `CLOSED_OUT`
- `STOP_OWNER_REVIEW_REQUIRED`

## Events

- `task_found`
- `validation_passed`
- `validation_failed`
- `interpreter_completed`
- `review_packet_ready`
- `owner_go`
- `owner_repair`
- `linkage_proof_ready`
- `closeout_ready`
- `unsafe_condition`

## Allowed Manual Transitions

| Current state | Event | Next state | Allowed next phase |
| --- | --- | --- | --- |
| `NO_TASK` | `task_found` | `TASK_AUTHORED` | `manual_validator_review` |
| `TASK_AUTHORED` | `validation_passed` | `VALIDATOR_ACCEPTED` | `owner_review_before_interpreter` |
| `TASK_AUTHORED` | `validation_failed` | `VALIDATOR_REJECTED` | `manual_repair_review` |
| `VALIDATOR_REJECTED` | `owner_repair` | `TASK_AUTHORED` | `manual_validator_review` |
| `VALIDATOR_ACCEPTED` | `interpreter_completed` | `INTERPRETER_COMPLETED` | `manual_review_packet_creation` |
| `INTERPRETER_COMPLETED` | `review_packet_ready` | `REVIEW_PACKET_CREATED` | `owner_decision_gate` |
| `REVIEW_PACKET_CREATED` | `owner_go` | `OWNER_DECISION_REQUIRED` | `manual_linkage_proof_creation` |
| `REVIEW_PACKET_CREATED` | `owner_repair` | `TASK_AUTHORED` | `manual_repair_review` |
| `OWNER_DECISION_REQUIRED` | `owner_repair` | `TASK_AUTHORED` | `manual_repair_review` |
| `OWNER_DECISION_REQUIRED` | `linkage_proof_ready` | `LINKAGE_PROOF_CREATED` | `manual_closeout_review` |
| `LINKAGE_PROOF_CREATED` | `closeout_ready` | `CLOSED_OUT` | `closed_loop_complete` |

The `linkage_proof_ready` transition requires explicit owner-decision evidence.
If the owner decision is missing, stale, or ambiguous, the next state is
`STOP_OWNER_REVIEW_REQUIRED`.

## Fail-Closed Rules

The coordinator must return `STOP_OWNER_REVIEW_REQUIRED` when:

- the current state or event is unknown
- the transition is not in the allowed table
- the event is `unsafe_condition`
- evidence is missing for an owner-gated transition
- input attempts to set `execution_allowed=true`
- evidence implies auto execution, automatic continuation, worker launch,
  daemon or watcher behavior, prompt sending, helper execution, validator
  execution, interpreter execution, ledger mutation, queue mutation, OpenAI API,
  private API, runtime execution, deploy, trading, billing mutation, cleanup,
  fetch, pull, push, reset, restore, delete, or secrets output

Ambiguous evidence is unsafe. The default next state is
`STOP_OWNER_REVIEW_REQUIRED`.

## Non-Execution Boundary

The state machine may read metadata supplied by a human or static test. It may
emit only a plan or refusal state. It must never execute the allowed next phase.

`owner_go` is evidence for planning only. It does not authorize the coordinator
to execute linkage proof creation, closeout, a next worker, or any runtime step.
