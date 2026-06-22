<!-- BUILD_ID: BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_PLANNING_20260616 -->
# Branch-Local Dry-Run Orchestration MVP State Machine

This state machine is a static planning contract. It describes a future local
dry-run orchestration MVP without implementing a runner, daemon, watcher,
worker, queue consumer, API client, deploy tool, or automatic continuation.

## States

- `NOT_STARTED`: no static plan has been loaded.
- `PLAN_LOADED`: a static plan envelope was read as evidence.
- `OWNER_DECISION_REQUIRED`: an owner decision is required before continuing.
- `DRY_RUN_READY`: static evidence is sufficient to prepare a simulated step.
- `SIMULATED_STEP_RECORDED`: a simulated step was described as evidence only.
- `ARTIFACT_READY`: review artifacts are ready for owner inspection.
- `STOP_OWNER_REVIEW_REQUIRED`: the lane stops because owner review is needed.
- `FAILED_CLOSED`: the lane stops because a required gate failed.

## Events

- `load_plan`
- `owner_review_required`
- `owner_approves_bounded_simulation`
- `record_simulated_step`
- `artifact_prepared`
- `missing_evidence`
- `forbidden_intent_detected`
- `unknown_state_or_event`

## Guards

Every transition must check:

- expected branch matches
- local HEAD matches the bound baseline
- source artifact SHA256 matches
- owner approval phrase is exact and in scope
- worktree and index state are acceptable for the lane
- all forbidden-action flags remain false
- `owner_review_required` is true
- `ready_is_go`, `matched_is_go`, and `observed_safe_no_action_is_go` are false
- `hash_binding_is_execution_approval` is false

## Actions

All actions are simulated or documentation-only at this stage:

- read static metadata
- classify a state transition
- write a planned artifact description
- write a simulated step description
- produce a blocker matrix
- produce a human review one point
- produce a next prompt draft

No runtime execution may occur. No action may launch a worker, run a runtime
workflow, call OpenAI, call a private API, mutate Queue/cloud/API/billing/auth
or trading systems, deploy, submit externally, create a release, change GitHub
visibility, apply for Sponsors, or edit FUNDING.yml.

## Transition Table

| Current state | Event | Guard result | Next state | Meaning |
|---|---|---|---|---|
| `NOT_STARTED` | `load_plan` | pass | `PLAN_LOADED` | Static plan evidence is available. |
| `PLAN_LOADED` | `owner_review_required` | pass | `OWNER_DECISION_REQUIRED` | Human owner review is required. |
| `OWNER_DECISION_REQUIRED` | `owner_approves_bounded_simulation` | pass | `DRY_RUN_READY` | Ready for a simulated step description only. |
| `DRY_RUN_READY` | `record_simulated_step` | pass | `SIMULATED_STEP_RECORDED` | A simulated step record may be described. |
| `SIMULATED_STEP_RECORDED` | `artifact_prepared` | pass | `ARTIFACT_READY` | Review artifacts are ready. |
| any | `missing_evidence` | fail | `STOP_OWNER_REVIEW_REQUIRED` | Evidence is missing or ambiguous. |
| any | `forbidden_intent_detected` | fail | `FAILED_CLOSED` | Forbidden action intent is present. |
| any | `unknown_state_or_event` | fail | `STOP_OWNER_REVIEW_REQUIRED` | Unknown input must fail closed. |

## Stop Transitions

The state machine must stop with `STOP_OWNER_REVIEW_REQUIRED` when evidence is
missing, ambiguous, stale, or out of scope. It must stop with `FAILED_CLOSED`
when forbidden action intent is detected.

READY is not GO.
MATCHED is not GO.
OBSERVED_SAFE_NO_ACTION is not GO.
Hash binding is not execution approval.
Owner review remains mandatory.
