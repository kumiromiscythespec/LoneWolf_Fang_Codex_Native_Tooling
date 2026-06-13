<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Owner Gate Naming Policy

Owner approval is exact, current, scoped, and auditable. A naming contract or
static fixture can record approval evidence, but it cannot execute the approved
phase.

## Current Implementation Approval Phrase

For this Window 2 implementation lane, the only sufficient implementation
approval phrase is:

`APPROVE_NEXT_WAVE_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION_SIX_WINDOW`

This phrase authorizes only docs/schema/tests/fixtures edits inside the Window 2
allowlist. It does not authorize staging, commit, push, fetch, pull, deploy,
runtime workflows, daemon/watchers, UI automation, APIs, cloud mutation, billing
mutation, trading, cleanup, deletion, reset, restore, stash, amend, rebase, or
history rewrite.

## Canonical Gate Names

| Gate label | Canonical state or action |
| --- | --- |
| accepted manual baseline | `PAUSED_BASELINE_ACCEPTED` |
| planning only | `PLANNING_ONLY` |
| approval packet ready | `APPROVAL_PACKET_READY` |
| static implementation ready | `STATIC_IMPLEMENTATION_READY` |
| local commit ready | `LOCAL_COMMIT_READY` |
| push ready | `PUSH_READY` |
| manual loop ready | `MANUAL_LOOP_READY` |
| supervised dry-run ready | `SUPERVISED_DRY_RUN_READY` |
| owner review required | `OWNER_REVIEW_REQUIRED` |
| fail closed | `FAIL_CLOSED` |

## Insufficient Language

The following phrases are not approval:

- continue
- proceed
- looks good
- okay
- do it
- do the next step
- same as before
- approved earlier
- ship it
- run the automation

If approval is stale, broad, mismatched, missing, or ambiguous, the next state is
`OWNER_REVIEW_REQUIRED` and the next action is `REQUIRE_OWNER_REVIEW`.
