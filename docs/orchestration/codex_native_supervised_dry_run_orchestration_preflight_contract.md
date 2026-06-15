BUILD_ID: SUPERVISED_DRY_RUN_ORCHESTRATION_PREFLIGHT_CONTRACTS_20260615

# Codex Native Supervised Dry Run Orchestration Preflight Contract

## Purpose

This contract defines the static preflight evidence shape for a future supervised dry-run orchestration decision. It is a docs/schema/tests/fixtures-only contract. It does not execute a dry run, launch a worker, mutate a queue, call private APIs, call OpenAI APIs, deploy, trade, bill, or continue automatically.

The preflight exists to answer one controller question: is there enough local, reviewable evidence to prepare an owner review packet for a future supervised dry-run request?

This is a bridge toward actual supervised dry-run operation, but it does not run orchestration. Preflight artifacts are review evidence only, never executors.

## Non-Runtime Boundary

The preflight record is evidence only. The following actions must remain false in every conforming packet:

- runtime workflow execution
- worker launch
- queue mutation
- cloud mutation
- private API call
- OpenAI API call
- billing or auth mutation
- trading, PAPER, LIVE, order, cancel, or fetch_balance action
- daemon or watcher execution
- UI automation
- automatic continuation

Explicit boundary phrase: no fetch/pull/deploy/runtime/worker/Queue/cloud/API/private API/OpenAI API/billing/auth/trading mutation.

`READY` means ready for owner review only. It is not a GO signal and must never imply automatic execution.

`MATCHED` means evidence matched an expected static condition only. It is not GO.

`OBSERVED_SAFE_NO_ACTION` means an observation found no action to perform. It is not GO.

No automatic continuation is allowed from `READY`, `MATCHED`, `OBSERVED_SAFE_NO_ACTION`, or any other evidence state.

## Required Evidence Inputs

The controller preflight record binds together the existing local-only evidence chain:

- stable closeout evidence from the current pushed baseline
- request-intake approval-binding evidence
- result-envelope dry-run outcome evidence
- readonly consumer observation evidence
- queue-handoff review-only evidence
- no-runtime worker and queue mutation proof evidence
- owner approval freshness status
- local metadata-only disclosure

Each artifact reference must identify whether the artifact is available, whether its SHA256 matches the expected value, and whether it is authoritative for the preflight decision. Missing artifacts must produce a blocked owner-review state, not a synthetic success.

Every preflight record must include a `blocker_matrix`. The `blocker_matrix` is required even when there are zero active blockers; in that case it records `PASS` rows that explain which gates were checked and why they did not block.

Every preflight record must include `human_review_one_point`. The `human_review_one_point` field is required and non-empty. It names the single owner decision that remains after the static evidence has been checked.

The LoneWolf Fang 6-window standard progression is an operating pattern for planning, implementation, review, repair, commit approval, and push approval. It is not a gate bypass. No window may use the preflight contract to skip owner review, commit approval, push approval, or later runtime approval gates.

## Decision States

The preflight state must be one of:

- `READY`
- `BLOCKED_MISSING_ARTIFACT`
- `REJECTED_FORBIDDEN_INTENT`
- `STOP_OWNER_REVIEW_REQUIRED`

`READY` is valid only when all required evidence is available, no forbidden intent is present, local metadata is not overclaimed, all operation flags are false, and the next prompt remains review-only.

`BLOCKED_MISSING_ARTIFACT` is valid when required evidence is missing or has an unmatched checksum.

`REJECTED_FORBIDDEN_INTENT` is valid when request intake or later evidence contains a forbidden runtime, queue, API, cloud, billing, auth, or trading intent.

`STOP_OWNER_REVIEW_REQUIRED` is valid when local metadata is ambiguous or the preflight cannot prove its boundary.

Ambiguous evidence must fail closed into owner review. The preflight must not infer success from missing, stale, mismatched, or locally ambiguous evidence.

## Local Metadata Disclosure

The preflight may report only local git metadata that was inspected without fetch or pull. It must not claim live remote truth. If local metadata is ambiguous, stale, or unavailable, the state must stop for owner review.

Local metadata disclosure is mandatory when local refs are referenced. The disclosure must distinguish local Git metadata from independently fetched live remote truth.

## Fixture Coverage

The fixture set covers four valid records and six invalid mutation records.

Valid fixtures:

- `preflight_ready_owner_review_required.json`
- `preflight_blocked_missing_artifact.json`
- `preflight_rejected_forbidden_intent.json`
- `preflight_stop_local_metadata_ambiguous.json`

Invalid fixtures:

- `preflight_runtime_execution_true.json`
- `preflight_worker_launch_true.json`
- `preflight_queue_mutation_true.json`
- `preflight_missing_human_review_one_point.json`
- `preflight_local_metadata_overclaim.json`
- `preflight_auto_go_from_ready.json`

The valid fixtures prove owner-review readiness, missing artifact handling, forbidden request intent rejection, and fail-closed local metadata ambiguity. The invalid fixtures prove rejection of runtime execution, worker launch, Queue mutation, missing `human_review_one_point`, local metadata overclaim, and automatic GO from `READY`.

## Owner Gate

The only safe successful next action is:

`START_SUPERVISED_DRY_RUN_ORCHESTRATION_PREFLIGHT_IMPLEMENTATION_REVIEW_PACKET`

That next action is a review packet, not implementation, not runtime execution, not queue mutation, and not a worker launch.

## Human Review Point

The single review question is:

Should the owner accept this static preflight contract as sufficient evidence format for a future supervised dry-run request review, while keeping execution blocked behind a later explicit owner gate?
