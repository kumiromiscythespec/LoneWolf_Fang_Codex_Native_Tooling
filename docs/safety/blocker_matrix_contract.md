<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Blocker Matrix Contract

The blocker matrix is a static review artifact that explains why a task cannot
continue automatically. It is documentation and schema/test guidance only; it is
not executable enforcement code.

## Purpose

The matrix gathers blockers into one owner-readable decision surface. It should
make the next safe action obvious without hiding background work or implying
that a forbidden action is approved.

## Matrix Rules

- `recommended_decision` is exactly one of `GO`, `REPAIR`, or `STOP`.
- `next_allowed_decisions` contains only `GO`, `REPAIR`, and `STOP`.
- every blocker row carries a severity and a safe alternative.
- every forbidden-action blocker requires owner review.
- every blocker row has `execution_allowed` set to `false`.
- every blocker row has `mutation_performed` set to `false`.

## Severity

Use `BLOCKER` for requests that mention deploy, runtime, daemon/watchers, UI
automation, private APIs, OpenAI APIs, cloud mutation, billing mutation,
trading/order activity, force push, destructive git/file actions, process kill,
or security bypass without exact current approval.

## Owner Decision

The matrix should point to one human review point. The owner can choose:

- `GO` for the exact low-risk scope named in the packet.
- `REPAIR` for bounded correction.
- `STOP` when continuation is unsafe or unclear.

`GO` in a blocker matrix is not permission for any high-risk action unless the
current owner prompt separately gives exact approval for that action.
