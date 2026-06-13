<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Forbidden Action Report Contract

This contract describes a static, fail-closed report for requests that mention
or attempt forbidden actions. It is documentation and schema/test guidance only;
it is not executable enforcement code and does not authorize runtime behavior.

## Purpose

A forbidden action report records that a requested action is outside the safe
default boundary and must be blocked or escalated before any execution. The
report is intended for evidence packets, reviewer handoff, and owner review.

## Required Outcome

Every forbidden action report must preserve these invariants:

- `execution_allowed` is `false`.
- `mutation_performed` is `false`.
- `owner_review_required` is `true`.
- unknown categories fail closed.
- missing identity or BUILD_ID fields fail closed.
- ambiguous approval text is not treated as permission.

## Forbidden Categories

The contract covers these categories:

- `deploy`
- `runtime`
- `daemon_watcher`
- `ui_automation`
- `private_api`
- `openai_api`
- `cloud_mutation`
- `billing_mutation`
- `trading_order`
- `force_push`
- `destructive_git_or_file`
- `process_kill_security_bypass`

## Safe Alternatives

Reports may suggest safe alternatives such as read-only review, dry-run,
preview packet creation, repair, or stop. Those alternatives remain preparation
only and do not approve deploy, runtime, API, cloud, billing, trading, process
control, or destructive repository actions.

## Not Approval

Creating or validating this report does not approve stage, commit, push, fetch,
pull, deploy, runtime workflows, daemon/watchers, UI automation, private APIs,
OpenAI APIs, Cloudflare/D1/R2/KV/Queue mutation, Stripe/Clerk/billing mutation,
trading/PAPER/LIVE/order/cancel/fetch_balance, reset, restore, clean, delete,
stash, amend, rebase, process kill, or security bypass.
