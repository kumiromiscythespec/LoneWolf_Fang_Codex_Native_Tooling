<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Human Review One Point Contract

A human review one point reduces continuation to one owner decision while
preserving safe alternatives. It is not an execution permission.

## Required Shape

The review point must include:

- one clear question.
- exactly one recommended decision.
- the options `GO`, `REPAIR`, and `STOP`.
- exact phrases for all three options.
- a scope limit.
- a list of actions that are not approved.
- evidence references.
- conditions that expire the decision.

## Decision Meanings

`GO` means continue only within the exact low-risk scope named in the packet.

`REPAIR` means revise docs/schema/tests/fixtures or the packet without crossing
the safety boundary.

`STOP` means stop and require owner review before any continuation.

## Fail-Closed Rule

If the question, options, recommendation, exact phrases, or scope limit are
missing, the review point fails closed and the next status is owner review
required.
