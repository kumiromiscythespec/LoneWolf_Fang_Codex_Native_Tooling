<!-- BUILD_ID: LOCAL_METADATA_ONLY_REMOTE_FRESHNESS_DISCLOSURE_CONTRACTS_20260615 -->
# Local Metadata Only Remote Freshness Disclosure Contract

`local_metadata_only_remote_freshness_disclosure_contracts` is a static
docs/schema/tests/fixtures contract for review evidence. It records what local
git metadata says about `HEAD`, local `origin/master`, and ahead/behind counts.
It does not fetch, pull, contact a remote, run a worker, start a daemon, enqueue
work, deploy, or execute any runtime path.

## Purpose

The contract makes one boundary explicit: local `origin/master` and
ahead/behind evidence are local metadata only. They are useful review evidence,
but they are not guaranteed live remote truth unless a later owner-gated prompt
explicitly approves a fetch and records that fetch as evidence.

This means a record may say:

- local `HEAD` was observed;
- local `origin/master` was observed;
- local ahead/behind was observed;
- the observation was local metadata only;
- the result is ready for owner review or blocked owner review.

It must not say that the live remote was fresh unless a separate future phase
explicitly approves that action. This implementation does not approve that
future phase.

## Required Evidence

A valid record includes:

- `build_id` equal to
  `LOCAL_METADATA_ONLY_REMOTE_FRESHNESS_DISCLOSURE_CONTRACTS_20260615`;
- `target` equal to
  `local_metadata_only_remote_freshness_disclosure_contracts`;
- `current_stable_baseline`;
- `local_metadata_only` equal to `true`;
- local `HEAD` evidence;
- local `origin/master` evidence;
- ahead/behind evidence;
- explicit disclosure that the evidence is local metadata only;
- `fetch_performed` equal to `false`;
- `pull_performed` equal to `false`;
- no live remote freshness claim;
- owner review evidence;
- `NEXT_CODEX_PROMPT` readiness evidence;
- false-only forbidden action flags;
- a human review point.

## Valid Local Metadata Evidence

When local `HEAD` and local `origin/master` match and ahead/behind is `0 / 0`,
the record may be ready for owner review. `READY_FOR_OWNER_REVIEW` means exactly
that: review evidence is complete enough for a human to inspect. READY is not
GO.

When local metadata is diverged, missing, ambiguous, or offline-only, the
record may still be valid review evidence if the ambiguity is disclosed and the
record requires owner review. It must not hide the mismatch, and it must not
recommend fetch or pull as an automatic repair.

## Fail-Closed Behavior

The record fails closed when:

- local `origin/master` evidence is missing;
- ahead/behind evidence is missing, hidden, or contradicted;
- local metadata is stale, diverged, or ambiguous without disclosure;
- a live remote freshness claim appears without separately approved fetch
  evidence;
- `fetch_performed` is `true`;
- pull, push, deploy, runtime, worker launch, Queue mutation, API/cloud
  mutation, billing/auth mutation, trading/order action, cleanup, or history
  rewrite is recommended or allowed.

The safe failed state is `STOP_OWNER_REVIEW_REQUIRED` or explicit owner review.
The contract never repairs the repo and never starts a continuation loop.

## NEXT_CODEX_PROMPT Boundary

`NEXT_CODEX_PROMPT` evidence may recommend only an owner-gated packet step, such
as an implementation review packet. It must not recommend fetch, pull, stage,
commit, push, deploy, runtime execution, worker launch, Queue mutation, API
calls, cloud mutation, billing/auth mutation, trading actions, cleanup, or
history rewrite.

`OBSERVED_SAFE_NO_ACTION` is also not GO. It means no action was triggered.

## Forbidden Action Boundary

This contract explicitly forbids fetch, pull, push, deploy, runtime workflows,
worker launch, daemon/watchers, UI automation, private API, OpenAI API,
Cloudflare/D1/R2/KV/Queue mutation, Stripe/Clerk/billing/auth mutation, trading,
PAPER, LIVE, order, cancel, fetch_balance, cleanup, reset, restore, stash,
rebase, and history rewrite.

This contract performs no fetch/pull/deploy/runtime/Queue/cloud/API/billing/auth/trading mutation.

Artifacts are evidence only, never executors.

## Fixture Coverage

The valid fixtures cover:

- matching local refs disclosed as local metadata only;
- diverged local refs that require owner review;
- offline local metadata snapshots that remain review-only.

The invalid fixtures cover:

- unapproved fetch evidence;
- pull recommendation;
- live remote freshness claim without fetch approval;
- missing local `origin/master` evidence;
- hidden ahead/behind mismatch;
- runtime or Queue action permission.

These fixtures are synthetic and safe. They do not require network, API, cloud,
deploy, runtime, fetch, pull, billing/auth, or trading access.
