<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Unknown Name Fail Closed Policy

Unknown names must never be accepted, guessed, fuzzy-matched, case-normalized,
or treated as aliases without an owner-approved contract update.

## Required Behavior

| Unknown item | Required state | Required reason | Required next action |
| --- | --- | --- | --- |
| state | `OWNER_REVIEW_REQUIRED` | `UNKNOWN_STATE` | `REQUIRE_OWNER_REVIEW` |
| event | `OWNER_REVIEW_REQUIRED` | `UNKNOWN_EVENT` | `REQUIRE_OWNER_REVIEW` |
| guard | `FAIL_CLOSED` | `UNKNOWN_GUARD` | `STOP_FAIL_CLOSED` |
| next_action | `OWNER_REVIEW_REQUIRED` | `UNKNOWN_NEXT_ACTION` | `REQUIRE_OWNER_REVIEW` |
| ambiguous alias | `OWNER_REVIEW_REQUIRED` | `AMBIGUOUS_ALIAS` | `REQUIRE_OWNER_REVIEW` |
| non-canonical case | `OWNER_REVIEW_REQUIRED` | `NON_CANONICAL_CASE` | `REQUIRE_OWNER_REVIEW` |

If the unknown name implies runtime execution, deploy, API access, cloud
mutation, billing mutation, trading, worker launch, daemon/watchers, UI
automation, cleanup, deletion, or history rewrite, route to the matching typed
prohibition state and stop.

## Evidence Requirements

Fail-closed evidence must include:

- `owner_review_required=true`
- `execution_allowed=false`
- `runtime_allowed=false`
- `automatic_continuation_allowed=false`
- the observed unknown value
- the expected canonical family
- a single safe `next_action`

The evidence may describe forbidden behavior only as rejected evidence. It must
not perform or enable that behavior.
