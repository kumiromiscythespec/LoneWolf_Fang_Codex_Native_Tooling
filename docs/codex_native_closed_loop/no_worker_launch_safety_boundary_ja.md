# No Worker Launch Safety Boundary v0.1

## Scope

この文書は Local Orchestrator Skeleton v0.1 の safety boundary を定義する。これは docs/schema/static tests/examples の設計資料であり、executable orchestrator ではない。

## Not Approved

次の action は current prompt では承認されていない。

- worker launch
- real orchestration
- auto-start
- GUI close
- real worker retirement
- background agent
- browser bridge execution
- ChatGPT automation
- prompt sending
- file upload to ChatGPT
- notification provider integration
- local status writer runtime
- deploy
- runtime/trading/billing/cloud mutation
- PAPER/LIVE/order/cancel/private API/fetch_balance
- GitHub Release/tag/asset upload
- publicization
- commit/push

## Required Static Defaults

Valid examples and fixtures must keep these values false.

- worker_launch_allowed = false
- real_orchestration_allowed = false
- prompt_sending_allowed = false
- runtime_execution_allowed = false

If any transition requires one of those values to be true, transition must be rejected or moved to STOP_OWNER_REVIEW_REQUIRED.

## Mandatory Invariants

- worker_session_close_required_after_review_handoff = true
- no_next_worker_until_previous_worker_closed = true
- previous_worker_retired must be true before START_NEXT_IMPLEMENTER
- max_open_implementer_sessions_per_lane = 1
- max_open_reviewer_sessions_per_lane = 1
- max_total_open_worker_sessions_initial = 2
- v0.1 is one-lane-only
- if close/retire confirmation is missing, transition to STOP_OWNER_REVIEW_REQUIRED

## Failure Routing

Failure must not cause vague retry.

- tests_failed -> REPAIR_REQUIRED
- forbidden_file_touched -> REJECTED_FOR_SAFETY
- unclear_result -> STOP_OWNER_REVIEW_REQUIRED
- no_safe_task -> PAUSED_OWNER_DECISION_REQUIRED

This makes every failure reviewable and prevents uncontrolled retry loops.
