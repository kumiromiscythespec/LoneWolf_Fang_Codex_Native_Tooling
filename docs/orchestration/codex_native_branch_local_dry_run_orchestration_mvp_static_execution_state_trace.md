<!-- BUILD_ID: BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_STATIC_EXECUTION_CONTRACTS_20260616 -->
# Branch-Local Dry-Run Orchestration MVP Static Execution State Trace

This state trace is a static documentation contract. It describes how a record
can move through static validation states without executing a runtime workflow.

No runtime execution
No OpenAI API call
No private API call
No Queue mutation
No cloud mutation
No billing mutation
No auth mutation
No trading mutation
No auto approval

## States

- `REQUEST_RECEIVED`: a static request record exists as local evidence.
- `HASH_BOUND`: the source approval packet path and SHA256 are present.
- `TRACE_MATCHED`: the requested transition matches the static schema.
- `SAFETY_REVIEW_REQUIRED`: safety flags remain false and owner review is
  required.
- `CLOSEOUT_RECORDED`: a static closeout record was described.
- `READY_FOR_OWNER_REVIEW`: the record is ready for human review only.
- `STOP_OWNER_REVIEW_REQUIRED`: the record stops because evidence is missing,
  stale, ambiguous, or out of scope.
- `Stop and Wait - Owner Review Required`: the human-readable stop terminal
  state.

## Events

- `load_static_execution_request`
- `bind_source_approval_hash`
- `match_static_transition_trace`
- `classify_safety_decision`
- `record_closeout`
- `missing_or_ambiguous_evidence`
- `unsafe_action_flag_true`
- `owner_review_required`

## Guards

Every transition must check:

- lane equals `BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_STATIC_EXECUTION_CONTRACTS`
- source approval packet SHA256 equals the owner-approved value
- expected branch is `post-submission/codex-native-safe-development`
- submitted baseline remains `45d20a704c297d0668ff9b3d2a2ab031a7832d4b`
- all unsafe action flags are explicitly false
- `owner_review_required` is true
- terminal state is one of the allowed review or stop states

## Transition Table

| Current state | Event | Guard result | Next state | Meaning |
|---|---|---|---|---|
| `REQUEST_RECEIVED` | `bind_source_approval_hash` | pass | `HASH_BOUND` | Static evidence is bound to the approval packet hash. |
| `HASH_BOUND` | `match_static_transition_trace` | pass | `TRACE_MATCHED` | The file-contract trace matches the schema. |
| `TRACE_MATCHED` | `classify_safety_decision` | pass | `SAFETY_REVIEW_REQUIRED` | The decision is safe only because it requires owner review. |
| `SAFETY_REVIEW_REQUIRED` | `record_closeout` | pass | `CLOSEOUT_RECORDED` | A review-only closeout is recorded. |
| `CLOSEOUT_RECORDED` | `owner_review_required` | pass | `READY_FOR_OWNER_REVIEW` | The record is ready for owner review only. |
| any | `missing_or_ambiguous_evidence` | fail | `STOP_OWNER_REVIEW_REQUIRED` | The lane stops for owner review. |
| any | `unsafe_action_flag_true` | fail | `Stop and Wait - Owner Review Required` | Unsafe intent requires human review before any continuation. |

## Trace Actions

Allowed actions are static:

- read a local schema, fixture, or documentation file
- compare field values to constants
- collect validation errors
- write a review-only summary in a later artifact packet

Forbidden actions remain forbidden:

- launch a worker, daemon, watcher, runtime workflow, or queue consumer
- call OpenAI or private APIs
- mutate Queue, cloud, billing, auth, trading, deploy, release, PR, merge,
  visibility, public submission, Sponsors, or FUNDING.yml state
- continue automatically because a record says ready or matched

## Stop Semantics

READY is not GO.
MATCHED is not GO.
OBSERVED_SAFE_NO_ACTION is not GO.
Hash binding is not execution approval.
Static execution contract validation is not runtime execution.
Owner review remains mandatory.

The trace may end in `READY_FOR_OWNER_REVIEW`, but that status means only that
a human can review the record. It does not approve branch mutation, runtime GO,
network calls, or any external action.
