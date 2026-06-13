<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Codex Native Forbidden Action Report Contract

A forbidden action report is typed negative evidence. It records that a prompt,
fixture, or packet requested a prohibited action and that the only safe result
is owner review.

The report is not a permission token. It must not be interpreted as approval to
perform the action it describes.

## Report Categories

The report category must be one of:

- `runtime_attempt`;
- `deploy_attempt`;
- `private_openai_api_attempt`;
- `cloud_mutation_attempt`;
- `billing_mutation_attempt`;
- `trading_order_attempt`;
- `automatic_continuation_attempt`;
- `unknown_state_gate_action`;
- `forbidden_action_attempt`.

Each category requires `STOP_OWNER_REVIEW_REQUIRED`,
`owner_review_required=true`, `execution_allowed=false`,
`runtime_allowed=false`, and `automatic_continuation_allowed=false`.

## Redaction Rules

Forbidden action reports must use synthetic fixture data or redacted evidence by
reference. They must not include secrets, API keys, auth payloads, raw private
payloads, billing records, credentials, exchange order IDs, production database
dumps, or raw customer data.

## Static Test Boundary

Static tests may parse report fixtures and inspect schema fields. They must not
call APIs, run runtime workflows, launch helpers, start daemons/watchers, use UI
automation, deploy, mutate cloud or billing resources, or perform trading
actions.
