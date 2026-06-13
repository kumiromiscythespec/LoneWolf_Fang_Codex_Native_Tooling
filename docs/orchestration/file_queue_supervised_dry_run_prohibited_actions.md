<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# File Queue Supervised Dry-run Prohibited Actions

## Purpose

The supervised dry-run contracts must reject requests or results that imply
runtime behavior. Dangerous words in fields, notes, reasons, operation names,
or evidence strings are review warnings, not approval.

## Prohibited Action Categories

The contracts and static tests cover these prohibited categories:

- live execution
- paper trading
- order, cancel, or fetch_balance
- deploy
- runtime workflow
- no task execution
- executor code
- shell escape or shell command runner
- network, private API, or OpenAI API
- cloud mutation
- billing mutation
- daemon or watcher
- UI automation
- process kill
- security bypass
- repository mutation
- secrets output

## Required Safe Response

When a prohibited field or action appears, the safe result is owner review:

```text
STOP_OWNER_REVIEW_REQUIRED
```

The contract must not attempt to auto-repair, execute a fallback, start another
worker, retry in a loop, mutate state, or infer approval from artifact presence.

## Artifact Boundary

Future artifacts must not include secrets, API keys, raw auth, raw private
payloads, node_modules, `.git`, build cache, nested ZIP files, production DB
dumps, billing data, credentials, or order data.
