<!-- BUILD_ID: BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_PLANNING_20260616 -->
# Branch-Local Dry-Run Orchestration MVP Plan

This document defines a static, branch-local planning contract for the minimum
useful local dry-run orchestrator. It is documentation, schema, tests, and
fixtures only. It does not implement runtime orchestration.

## Purpose

The MVP describes how a future local dry-run orchestrator could read an
owner-reviewed request envelope, classify the next safe simulated step, write
reviewable evidence, and stop for owner review. The purpose is to make the next
implementation boundary concrete without launching workers, calling APIs,
mutating queues, deploying, or continuing automatically.

## Minimum Useful Local Workflow

1. Load a static request envelope supplied by a human-reviewed artifact.
2. Check branch, baseline, artifact hash, owner phrase, and forbidden-action
   flags.
3. Classify the next simulated state using a static state table.
4. Record a simulated step summary as evidence only.
5. Produce an artifact manifest, blocker matrix, and one human review point.
6. Stop until the owner explicitly chooses the next bounded lane.

The MVP is useful only if it makes ambiguity visible. Missing evidence,
stale approval, mismatched hashes, unknown states, or unsafe flags must produce
`STOP_OWNER_REVIEW_REQUIRED` or `FAILED_CLOSED`.

## Input Envelopes

The future dry-run MVP may describe these input envelopes:

- branch-local request identity
- submitted-baseline binding
- source artifact path and SHA256
- owner approval phrase binding
- intended simulated state transition
- forbidden-action flags
- one human review point

Input envelopes are static evidence. They are not commands.

## Dry-Run Queue And Handoff Concept

The MVP may model a queue or handoff lane as a local evidence sequence:

- request envelope
- static validation report
- simulated step record
- artifact-ready report
- owner decision record

At this stage, the queue is conceptual and file-contract-only. The plan does
not enqueue, dequeue, watch, poll, mutate, or dispatch anything.

## Simulated Execution Only

The MVP may simulate:

- loading a plan
- matching an event to a state transition
- checking guards
- recording a simulated step
- deciding that owner review is required
- preparing a next prompt draft

The MVP must not actually execute:

- runtime workflows
- worker or daemon launch
- OpenAI API calls
- private API calls
- Queue, cloud, billing, auth, or trading mutation
- deploys
- public submission or release actions

## Owner Decision Gates

Every successful path stops at one owner decision. The owner decision may be
GO, REPAIR, or STOP for a later bounded lane, but the static plan must never
convert a decision label into automatic execution.

The only safe successful outcome of this planning contract is owner-review
readiness for a later docs/schema/tests/fixtures review.

## Artifact Outputs

The future MVP may describe these artifact outputs:

- manifest
- simulated step summary
- blocker matrix
- forbidden-action report
- branch and baseline evidence
- test summary
- checksum summary
- human review one point
- NEXT_CODEX_PROMPT.md

Artifacts are evidence only. Hash binding is not execution approval.

## Stop Conditions

The MVP must stop when:

- the current branch is unexpected
- local HEAD does not match the bound baseline
- source artifact SHA256 does not match
- owner approval evidence is missing, stale, ambiguous, or out of scope
- runtime, API, worker, Queue, cloud, billing, auth, trading, deploy, release,
  public submission, Sponsors, or FUNDING intent is present
- the state, event, guard, or next action is unknown
- any required artifact is missing

Stop state must be `STOP_OWNER_REVIEW_REQUIRED` or `FAILED_CLOSED`.

## Evidence Before Later Dry-Run Implementation

Before any later dry-run implementation, evidence must show:

- exact owner approval phrase for that later scope
- exact file allowlist for that later scope
- branch and baseline binding
- clean worktree and index before edits
- source artifact SHA256 match
- focused test pass
- focused syntax check pass
- broad `node --test` pass
- one human review point

## Intentionally Not Implemented

This planning contract intentionally does not implement:

- a real local orchestrator
- a runner
- a daemon or watcher
- worker launch
- prompt sending
- queue mutation
- API clients
- OpenAI API integration
- private API integration
- deploy tooling
- release packaging
- public submission automation
- GitHub visibility changes
- Sponsors or FUNDING.yml actions

## Forbidden Actions

The following remain forbidden without later explicit approval:

- runtime execution
- OpenAI API calls
- private API calls
- worker or daemon launch
- cloud or Queue mutation
- billing, auth, or trading mutation
- deploy
- public submission or resubmission
- GitHub visibility change
- release creation or upload
- GitHub Sponsors application
- FUNDING.yml creation or edit
- staging, commit, or push

## Non-GO Semantics

READY is not GO.
MATCHED is not GO.
OBSERVED_SAFE_NO_ACTION is not GO.
Hash binding is not execution approval.
Owner review remains mandatory.
