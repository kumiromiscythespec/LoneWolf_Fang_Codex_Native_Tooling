<!-- BUILD_ID: NEXT_PROMPT_READINESS_CHAIN_CONTRACTS_20260615 -->

# Codex Native Next Prompt Readiness Chain Contract

Selected target: next_prompt_readiness_chain_contracts

Current stable baseline: 546301451af87141e29a07bedf155914f4e9c4be

Schema id: lonewolf.codex_native.next_prompt_readiness_chain.v1

## Purpose

This contract describes how a repo-local evidence packet may point to the next
Codex prompt without turning that pointer into automatic execution.

The readiness chain is an instruction-artifact-only bridge. It can preserve a
safe next prompt, explain why that prompt is the next bounded step, and disclose
which local metadata was used. It cannot run the prompt, skip owner review, or
convert READY, MATCHED, or OBSERVED_SAFE_NO_ACTION into GO.

## Allowed Transition Classes

The only allowed transition classes are:

- STABLE_CLOSEOUT_TO_PLANNING_ONLY
- PLANNING_TO_IMPLEMENTATION_APPROVAL_PACKET_ONLY
- BLOCKED_OWNER_REVIEW_REQUIRED

Stable closeout evidence may recommend only a planning packet. Planning evidence
may recommend only an implementation approval packet. Blocked evidence must
recommend owner review only.

## Required Safety Gates

Every readiness record must preserve these gates:

- exact owner approval is required before implementation
- implementation approval remains separate from implementation
- commit approval remains separate from commit
- push approval remains separate from push
- fetch and pull require a future explicit owner gate
- ambiguity stops with STOP_OWNER_REVIEW_REQUIRED

The next prompt must be instruction artifact only. It must not be an executor
path, runtime workflow, worker launch, Queue mutation, deploy step, API call,
cloud mutation, billing or auth mutation, trading/order action, cleanup action,
or history rewrite.

## Local Metadata Disclosure

When a readiness record references local refs such as HEAD or local
origin/master, it must disclose that the remote truth was not freshly fetched.

The required disclosure fields are:

- origin_master_local_metadata_only
- ahead_behind_local_metadata_only
- independently_fetched_live_remote_truth
- fetch_performed
- pull_performed
- fetch_pull_requires_future_owner_gate

Valid records set the first, second, and sixth fields to true, and the third,
fourth, and fifth fields to false.

## Human Review Requirement

Every valid record must include exactly one human_review_one_point. The point
must identify the single decision an owner should make before any later packet
or implementation lane proceeds.

## Blocker Matrix Requirement

Every NEXT_CODEX_PROMPT readiness chain record must include blocker_matrix.
The blocker_matrix must be present even when there are zero active blockers.
It must list checked risk categories or equivalent review rows so a reviewer can
see which stop conditions were considered.

The blocker_matrix is review evidence only, not execution permission. It does
not override owner approval requirements, does not allow automatic continuation,
and does not convert READY, MATCHED, or OBSERVED_SAFE_NO_ACTION into GO.

Missing blocker_matrix fails closed with STOP_OWNER_REVIEW_REQUIRED. A present
blocker_matrix still cannot authorize stage, commit, push, fetch, pull, deploy,
runtime, Queue/cloud/API/billing/auth/trading, cleanup, or history rewrite. It
also cannot authorize no fetch/pull/deploy/runtime/Queue/cloud/API/billing/auth/trading mutation.

For transition clarity, stable closeout may recommend planning packet only, and
planning may recommend implementation approval packet only. Both remain packet
recommendations, not execution approvals.

## Forbidden Automatic GO

The following observations are not GO signals:

- READY
- MATCHED
- OBSERVED_SAFE_NO_ACTION

They may support a future owner decision, but they do not authorize automatic
continuation, runtime execution, Queue mutation, fetch, pull, stage, commit,
push, deploy, cleanup, or history rewrite.

## Fixture Matrix

Valid fixtures cover:

- stable closeout to planning only
- planning to implementation approval packet only
- blocked owner review required

Invalid fixtures cover:

- direct implementation recommendation
- auto_continue true
- runtime or Queue next action
- fetch or pull without owner gate
- missing local metadata disclosure
- missing human_review_one_point

## Boundary

This contract is docs, schema, tests, and fixtures only. It does not implement
a runner, daemon, worker, queue producer, queue consumer, UI automation path,
private API path, OpenAI API path, billing/auth path, or trading/order path.
