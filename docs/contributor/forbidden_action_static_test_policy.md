<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Forbidden Action Static Test Policy

Forbidden-action governance tests must remain local, static, and non-operational.
They do not approve, permit, or authorize any forbidden action.

## Allowed

Tests may:

- read local docs, schemas, and synthetic fixtures.
- assert required fields and BUILD_ID markers.
- assert fail-closed constants such as `execution_allowed: false`.
- assert fixture classifications for forbidden categories.

## Not Allowed

Tests must not:

- call private APIs or OpenAI APIs.
- mutate Cloudflare, D1, R2, KV, Queue, Stripe, Clerk, or billing systems.
- perform PAPER/LIVE/order/cancel/fetch_balance actions.
- run deploys, runtime workflows, daemon/watchers, or UI automation.
- run process kill, security bypass, reset, clean, delete, stash, amend, rebase,
  force push, fetch, pull, commit, or push behavior.

## Review Rule

When a fixture contains dangerous words, treat the words as synthetic evidence
for a blocked classification, not as an instruction or approval.
