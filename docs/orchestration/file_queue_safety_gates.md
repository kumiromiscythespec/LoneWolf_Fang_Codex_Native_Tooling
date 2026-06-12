<!-- BUILD_ID: 20260612_file_queue_safety_gates_v1 -->
# File Queue Safety Gates

## Forbidden Actions

Every task file must explicitly forbid:

- `worker_launch`
- `real_orchestration`
- `browser_ui_automation`
- `chatgpt_ui_automation`
- `codex_ui_automation`
- `runtime_execution`
- `deploy`
- `paper_live_order`
- `cancel_order`
- `fetch_balance`
- `private_api`
- `provider_mutation`
- `billing_mutation`
- `secrets_output`
- `reset_restore_clean`
- `force_push`

The list is a gate. It is not a runtime feature list and not an approval to perform those actions.

## No Hidden Automation

The file queue contract must remain static. A schema, fixture, or test may describe a forbidden action only to reject it or keep it out of scope.

The contract must not hide automation behind ambiguous names such as `auto`, `execute`, `run`, `dispatch`, `sync`, `worker`, or `orchestrate` when those names imply actual runtime behavior.

## No Browser, ChatGPT, or Codex UI Automation

The contract must not click, type, paste, submit, approve, or send anything in a browser, ChatGPT UI, or Codex UI. Any future bridge behavior remains separate, owner-gated, and paste-only unless a later prompt explicitly approves a narrower action.

## No Runtime, Private API, Deploy, or Trading

The contract must not perform or enable:

- runtime execution
- queue runner execution
- Codex CLI automation execution
- OpenAI API calls
- provider API calls
- deploy hooks
- Cloudflare, D1, R2, KV, or Queue mutation
- Stripe, Clerk, or billing mutation
- PAPER or LIVE trading
- order placement
- order cancellation
- fetch_balance
- private API access

## No Secrets or Raw Private Payload Output

Files must not contain secrets, API keys, raw auth payloads, raw private API payloads, billing payloads, provider credentials, production database dumps, or token values.

Static fixtures must use synthetic placeholder values only.

## No Reset, Restore, Git Clean, or Force Push

The file queue contract must not request or normalize destructive git operations. If reset, restore, cleanup, git clean, stash, delete, branch deletion, rebase, force push, or unrelated cleanup becomes necessary, stop for owner review.

## Owner Approval Gates

Owner approval gates are explicit. A current prompt may approve docs/schema/fixture/static-test work and a local commit without approving push, release, deployment, runtime execution, provider access, or UI automation.

The safe default next state for unclear or unsafe work is `STOP_OWNER_REVIEW_REQUIRED`.
