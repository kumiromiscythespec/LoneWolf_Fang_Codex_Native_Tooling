<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Codex Native Blocker Matrix Contract

The blocker matrix records why a future static or supervised lane must stop
before execution. It exists so reviewers can see the exact fail-closed reason
without inferring permission from artifact presence.

## Blocker Types

The static matrix must recognize these blocker types:

- `missing_artifact`;
- `corrupt_artifact`;
- `stale_artifact`;
- `duplicate_task_id`;
- `duplicate_artifact_id`;
- `unknown_state`;
- `unknown_gate`;
- `unknown_action`;
- `illegal_transition`;
- `owner_gate_skipped`;
- `unknown_owner_approval`;
- `stale_owner_approval`;
- `automatic_continuation_attempt`;
- `forbidden_action_attempt`;
- `runtime_attempt`;
- `deploy_attempt`;
- `private_openai_api_attempt`;
- `cloud_mutation_attempt`;
- `billing_mutation_attempt`;
- `trading_order_attempt`.

Every `HIGH` severity blocker requires `STOP_OWNER_REVIEW_REQUIRED`. It must
also require owner review and must keep `execution_allowed=false`,
`runtime_allowed=false`, and `automatic_continuation_allowed=false`.

## Review Rule

A blocker matrix row may recommend repair planning, but it must not recommend
commit, push, deploy, runtime execution, API use, cloud mutation, billing
mutation, trading, daemon/watchers, UI automation, cleanup, deletion, reset,
restore, stash, amend, rebase, or history rewrite.
