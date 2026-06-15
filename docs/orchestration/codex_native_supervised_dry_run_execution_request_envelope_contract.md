BUILD_ID: SUPERVISED_DRY_RUN_EXECUTION_REQUEST_ENVELOPE_CONTRACTS_20260615

# Codex Native Supervised Dry Run Execution Request Envelope Contract

## Purpose

This contract defines the static request envelope for a future supervised dry-run execution request. It is a docs/schema/tests/fixtures-only contract. It does not execute a supervised dry run, launch a worker, mutate a Queue, deploy, call private APIs, call OpenAI APIs, mutate cloud services, mutate billing or auth systems, trade, place orders, cancel orders, fetch balances, or continue automatically.

The envelope answers one controller question: is a future supervised dry-run execution request specific enough to prepare for owner review while preserving every runtime boundary?

This is a bridge toward an actual operation, but the operation remains strategic and future-gated. The envelope is review evidence only, never an executor.

## Non-Runtime Boundary

The request envelope must keep every operational action false:

- runtime execution
- worker launch
- Queue mutation
- cloud mutation
- deploy
- private API call
- OpenAI API call
- billing or auth mutation
- trading, PAPER, LIVE, order, cancel, or fetch_balance action
- daemon or watcher execution
- UI automation
- automatic continuation

`READY`, `MATCHED`, `BOUND`, `REQUEST_DRAFT_READY`, and `OBSERVED_SAFE_NO_ACTION` are not GO signals. They mean a static condition is reviewable. They do not authorize execution, worker launch, queue handoff, or automatic continuation.

Explicit boundary phrase: request draft ready is not GO. It is only evidence that the envelope can be reviewed by the owner before any later single-window approval, execution request, queue handoff, worker launch, runtime action, commit, push, deploy, API call, cloud mutation, billing or auth mutation, trading action, or automatic continuation.

## Six-Window Progression Gate

The LoneWolf Fang six-window standard progression is only an operating pattern for parallel read-only, AppData-only preparation and review. It is not permission to bypass safety gates, owner approval gates, `STOP_OWNER_REVIEW_REQUIRED`, or `Stop and Wait - Owner Review Required` states.

The six-window standard progression does not authorize implementation, staging, commit, push, fetch, pull, deploy, runtime execution, worker launch, Queue mutation, cloud mutation, API calls, billing or auth mutation, trading actions, cleanup, history rewrite, or automatic continuation. Only the currently approved lane may perform its explicitly approved scope.

Repo-writing, exact commit, exact push, runtime, worker, and Queue-related lanes remain one-lane and owner-gated. `READY`, `REQUEST_DRAFT_READY`, `MATCHED`, and `OBSERVED_SAFE_NO_ACTION` remain not GO.

## Required Evidence Inputs

The envelope binds:

- the current stable baseline `75fb341776b417f432162fb85693e58c189899e8`
- the implementation approval phrase for this contract
- `stable_closeout_evidence` for the current accepted stable closeout artifact
- `request_identity` for the exact baseline, branch, head, origin/master, and ahead/behind expectation
- `owner_approval_freshness` showing whether the approval is current, stale, superseded, single-use, and baseline-bound
- `approval_phrase_scope` showing the approval phrase is limited to docs/schema/tests/fixtures and does not authorize runtime reuse
- the recently completed supervised dry-run orchestration preflight evidence
- local metadata-only branch and ref observations
- exact owner-gated request intent
- fail-closed blocker handling

Every envelope must include `human_review_one_point`. That field names the single owner decision needed before any later implementation review, commit approval, push approval, or runtime-gated step.

Every envelope must include a `blocker_matrix`. Passing envelopes use `PASS` rows; blocked or rejected envelopes use `BLOCKED`, `REJECTED`, or `OWNER_REVIEW_REQUIRED` rows and fail closed.

## Envelope States

The request envelope state must be one of:

- `OWNER_REVIEW_REQUIRED`
- `REQUEST_DRAFT_READY`
- `PREFLIGHT_BOUND_READY`
- `BLOCKED_MISSING_PREFLIGHT_ARTIFACT`
- `REJECTED_STALE_APPROVAL`
- `STOP_LOCAL_METADATA_AMBIGUOUS`

`OWNER_REVIEW_REQUIRED` is the default safe state. It means the request is static and reviewable, but no execution is authorized.

`REQUEST_DRAFT_READY` means the request draft has enough static identity, stable closeout evidence, approval freshness evidence, scope evidence, preflight evidence, and local metadata evidence to be reviewed. It is not GO and it does not authorize execution or queue handoff.

`PREFLIGHT_BOUND_READY` is valid only when the preflight artifact is present, its SHA256 matches the expected value, the baseline matches, local metadata is explicitly local-only, and every operation flag is false.

`BLOCKED_MISSING_PREFLIGHT_ARTIFACT` is valid when the preflight artifact is missing or its checksum cannot be trusted.

`REJECTED_STALE_APPROVAL` is valid when the owner approval phrase is missing, stale, superseded, or bound to the wrong scope or baseline.

`STOP_LOCAL_METADATA_AMBIGUOUS` is valid when local git metadata cannot safely support the request envelope. It must not be converted into a guessed success.

## Local Metadata Disclosure

The envelope may reference `origin/master` and ahead/behind values only as local Git metadata inspected without fetch or pull. It must not claim live remote truth. If the local metadata is ambiguous, the envelope must stop for owner review.

## Fixture Coverage

The fixture set covers five valid records and five invalid mutation records.

Valid fixtures:

- `request_envelope_owner_review_required.json`
- `request_envelope_preflight_bound_ready.json`
- `request_envelope_blocked_missing_preflight_artifact.json`
- `request_envelope_rejected_stale_approval.json`
- `request_envelope_stop_local_metadata_ambiguous.json`

Invalid fixtures:

- `request_envelope_runtime_execution_true.json`
- `request_envelope_worker_launch_true.json`
- `request_envelope_queue_mutation_true.json`
- `request_envelope_baseline_mismatch.json`
- `request_envelope_auto_go_from_ready.json`

The invalid fixtures prove rejection of runtime execution, worker launch, Queue mutation, baseline mismatch, and automatic GO from a ready or bound state.

## Owner Gate

The only successful next action is:

`START_SUPERVISED_DRY_RUN_EXECUTION_REQUEST_ENVELOPE_IMPLEMENTATION_REVIEW_PACKET`

That next action creates a review packet. It is not commit approval, push approval, runtime execution, worker launch, Queue mutation, deploy, API use, cloud mutation, billing/auth mutation, or trading.

## Human Review Point

The single review question is:

Should the owner accept this static execution request envelope format as sufficient evidence for a future supervised dry-run request review while keeping all execution, worker, Queue, API, cloud, billing/auth, trading, and automatic continuation paths blocked?
