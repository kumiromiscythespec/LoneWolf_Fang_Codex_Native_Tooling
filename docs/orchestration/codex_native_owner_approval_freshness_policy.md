<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Owner Approval Freshness Policy

## Purpose

This policy defines how Codex Native treats owner approvals for future
docs/schema/tests/fixtures-only automation gate contracts. It is a static
contract. It does not create a runner, daemon, watcher, UI bridge, cloud
integration, billing integration, trading integration, API client, deploy path,
commit path, or push path.

The safe default is fail closed. An approval is usable only while it remains
exactly bound to the same task, repository, branch, commit, artifact chain,
artifact hash, file allowlist, command allowlist, and safety boundary that the
owner approved.

## Fresh Approval Requirements

A fresh approval record must include:

- an exact owner approval phrase;
- the target repository;
- the branch;
- the expected HEAD commit;
- the local origin reference when the approval depends on it;
- the stable baseline;
- the artifact chain identifier;
- the artifact SHA256 that carried the approval request;
- the task identifier;
- the approved file allowlist;
- the approved command allowlist when commands are allowed;
- the safety boundary version;
- a clear action class.

The Window 3 implementation approval phrase is:

`APPROVE_NEXT_WAVE_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION_SIX_WINDOW`

That phrase authorizes only the docs/schema/tests/fixtures allowlist named by
the repaired Window 3 prompt. It does not authorize stage, commit, push, fetch,
pull, deploy, runtime workflows, daemon or watcher startup, UI automation,
private APIs, OpenAI APIs, Cloudflare/D1/R2/KV/Queue mutation, Stripe/Clerk or
billing mutation, trading actions, cleanup, deletion, reset, restore, stash,
amend, rebase, or history rewrite.

## Stale Approval Conditions

An approval is stale when any bound field differs from the current context:

- HEAD changed unexpectedly;
- branch changed;
- local origin reference changed;
- worktree changed outside the approved file allowlist;
- artifact SHA256 changed;
- a newer owner decision superseded the approval;
- task scope changed;
- approved command changed;
- approved file set changed;
- safety boundary changed;
- approval phrase changed or became vague;
- an approval TTL exists and has expired;
- no TTL exists and the approval is reused across another stable baseline or
  artifact chain.

The required stale result is `STOP_OWNER_REVIEW_REQUIRED` with
`owner_approval_required=true`, `execution_allowed=false`,
`runtime_allowed=false`, and `automatic_continuation_allowed=false`.

## Single-Use Mutation Rule

Mutation approvals are single-use. This includes repo edits, stage, commit,
push, deploy, cloud mutation, billing mutation, trading or order actions,
runtime execution, private API access, daemon or watcher startup, UI automation,
cleanup, deletion, reset, restore, stash, amend, rebase, or history rewrite.

A consumed mutation approval cannot be replayed. If a later worker needs another
mutation, it needs a new exact owner approval bound to the current artifact
chain.

## Reusable Policy Rule

Non-mutating policy approval may be reused only within the same stable baseline
and artifact chain, and only while all exact-scope fields match. Reuse cannot
broaden into commit, push, deploy, runtime, API, cloud, billing, trading,
daemon, watcher, UI automation, automatic continuation, or cleanup behavior.

If the approval has no TTL, it may not cross a different artifact chain or
stable baseline. If the approval has a TTL and the TTL is expired, it fails
closed even when all other fields match.

## Supersession

Supersession is append-only evidence. A newer owner decision may supersede an
older approval by reference, but the older approval must remain preserved. A
supersession record must name the old approval, the replacement approval, the
reason, the artifact hashes, and the rollback path.

Supersession must not delete, rewrite, truncate, reorder, or clean old evidence.
If supersession is ambiguous, cyclic, missing a hash, missing an owner gate, or
conflicts with another decision, the result is `STOP_OWNER_REVIEW_REQUIRED`.

## Runtime Reuse Prohibition

No approval freshness record may authorize reuse for runtime workflows, deploy,
API calls, cloud mutation, billing mutation, trading/order actions, daemon or
watcher startup, UI automation, automatic continuation, or repository history
operations.

Commit and push require later single-use owner approvals after implementation
output review.
