<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# File Queue Supervised Dry-run Owner Gates

## Purpose

This document records the owner gates that must surround any future supervised
dry-run evidence step. The gates are review controls. They do not execute the
next phase.

## Gate 1 - Before Dry-run

Before a future supervised dry-run review packet action, the owner must verify:

- the current prompt contains the exact owner approval phrase for that phase
- the task JSON path and SHA256 match reviewed evidence
- the validator report path and SHA256 match reviewed evidence
- the validator report status is `VALID_DRY_RUN`
- the validator report accepted flag is `true`
- the operation class is `APPDATA_PACKET_CREATION_REVIEW_ONLY`
- the output root policy is AppData-only or test-temp-only
- the file allowlist is exact
- prohibited actions are confirmed absent
- no executor code or task execution is approved by implication

## Gate 2 - After Dry-run

After a future dry-run evidence step, the owner or reviewer must inspect:

- result status and accepted flag
- review packet path and SHA256
- safety summary
- forbidden-action confirmation
- changed-file list
- human review one point
- next prompt

The next decision is `GO`, `REPAIR`, or `STOP` for one bounded follow-up only.

## Gate 3 - Before Next Task Generation

No next task may be generated until the previous packet is reviewed and the
previous lane is closed or retired. Linkage evidence must identify one active
terminal proof. Stale, ambiguous, or mismatched evidence requires owner review.

## Gate 4 - Before Repetition

No repeated loop is approved by these contracts. Repetition requires a separate
planning packet, static proof that the previous worker is closed, explicit
owner approval, and a new human review point.

## Gate 5 - Before Runtime Or Persistent Watcher Consideration

No runtime executor, daemon, watcher, queue loop, scheduler, worker launcher,
Codex CLI bridge, OpenAI API client, UI automation bridge, provider client,
cloud mutator, billing mutator, trading client, cleanup routine, or persistent
state mutator is approved. Any such need must stop with
`STOP_OWNER_REVIEW_REQUIRED`.
