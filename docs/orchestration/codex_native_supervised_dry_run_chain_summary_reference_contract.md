<!-- BUILD_ID: 20260616_supervised_dry_run_chain_summary_reference_contracts_v1 -->
# Codex Native Supervised Dry Run Chain Summary Reference Contract

## Purpose

This contract defines static, evidence-only chain summary reference metadata for
the target `supervised_dry_run_chain_summary_reference_contracts`.

The chain summary reference is not a chain summary creator, not an owner review
packet submitter, not an audit bundle creator, not a runtime executor, not a
worker launch request, not a Queue mutation request, not an automatic GO signal,
and not a bypass for owner gates.

The reference may point at a future static chain summary context, but it does
not create that summary, submit owner review material, read live systems, mutate
any queue, or approve later work.

## Scope

The implementation scope is docs/schema/tests/fixtures only.

The stable baseline for this contract is:

`0b021093b08b22e1d3f695655d2ffbbacd257ddc`

The implementation approval packet SHA256 is:

`F1F065787757617F2C7A3E934739CCFA84531669929B57FED8983E917B63FBDF`

The source planning packet SHA256 is:

`3B3BDB1517734E047BFBD197F1BBA0A1A0E9976F2EF6EA1F1EB06BF77DE72104`

The owner approval phrase for this implementation is:

`APPROVE_SUPERVISED_DRY_RUN_CHAIN_SUMMARY_REFERENCE_CONTRACTS_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION`

The phrase authorizes only the exact 25-file allowlist for this contract. It
does not authorize stage, commit, push, fetch, pull, deploy, runtime execution,
worker launch, live observation, audit bundle creation, owner review packet
submission, chain summary creation, Queue mutation, cloud/API/billing/auth
mutation, trading/order behavior, private API, OpenAI API, cleanup, history
rewrite, daemon/watcher/UI automation, or edits outside the allowlist.

## Reference Statuses

A chain summary reference record has one status:

- `CHAIN_SUMMARY_REFERENCE_NOT_STARTED`
- `CHAIN_SUMMARY_REFERENCE_BLOCKED_OWNER_REVIEW_REQUIRED`
- `CHAIN_SUMMARY_REFERENCE_BLOCKED_MISSING_OWNER_REVIEW_PACKET`
- `CHAIN_SUMMARY_REFERENCE_BLOCKED_MISSING_CHAIN_SUMMARY_CONTEXT`
- `CHAIN_SUMMARY_REFERENCE_DRAFT_CONTEXT_READY`
- `CHAIN_SUMMARY_REFERENCE_HASH_BOUND_EVIDENCE_READY`
- `CHAIN_SUMMARY_REFERENCE_READY_FOR_HUMAN_REVIEW`
- `CHAIN_SUMMARY_REFERENCE_FAILED_CLOSED`
- `STOP_OWNER_REVIEW_REQUIRED`

`CHAIN_SUMMARY_REFERENCE_DRAFT_CONTEXT_READY` is not runtime GO.

`CHAIN_SUMMARY_REFERENCE_HASH_BOUND_EVIDENCE_READY` is not runtime GO.

`CHAIN_SUMMARY_REFERENCE_READY_FOR_HUMAN_REVIEW` is not runtime GO and does not
create a chain summary.

## Not Runtime And Not GO Semantics

The contract preserves these meanings:

- evidence-only reference metadata;
- static reference metadata only;
- never executor;
- never runtime observer;
- never live observation;
- never chain summary creator;
- never owner review packet submitter;
- never audit bundle creator;
- never worker launch request;
- never Queue mutation request;
- never cloud/API/billing/auth/trading action;
- never private API call;
- never OpenAI API call;
- never deploy approval;
- never automatic GO;
- never runtime GO;
- hash binding is not execution approval;
- owner review is mandatory before later gated actions;
- human review is mandatory before later gated actions.

These states and records are not GO:

- `READY`
- `MATCHED`
- `OBSERVED_SAFE_NO_ACTION`
- `CHAIN_SUMMARY_REFERENCE_DRAFT_CONTEXT_READY`
- `CHAIN_SUMMARY_REFERENCE_HASH_BOUND_EVIDENCE_READY`
- `CHAIN_SUMMARY_REFERENCE_READY_FOR_HUMAN_REVIEW`

The chain summary reference cannot bypass safety gates.

The chain summary reference cannot bypass owner gates.

The chain summary reference cannot bypass `STOP_OWNER_REVIEW_REQUIRED`.

The chain summary reference cannot bypass `Stop and Wait - Owner Review
Required`.

## Required Evidence

Each chain summary reference record statically records:

- schema identifier and BUILD_ID;
- reference identity and timestamp;
- target repo, branch, baseline, local origin/master, and ahead/behind;
- source owner-review-to-chain-summary linkage baseline commit;
- source planning artifact SHA256;
- implementation approval packet SHA256;
- bounded owner review packet reference;
- bounded chain summary context reference;
- hash binding summary that binds both references;
- baseline check evidence;
- chain summary reference status;
- not-GO assertions;
- false-only forbidden action flags;
- bounded safe next-action constraints;
- blocker matrix;
- non-empty human review one point;
- fail-closed result for ambiguity, stale baseline, SHA mismatch, missing
  evidence, unsafe next action, missing human review, or any forbidden action
  flag set true.

## Forbidden Actions

All forbidden action flags must remain false:

- runtime execution requested or performed;
- live observation requested or performed;
- audit bundle creation requested or performed;
- owner review packet submission requested or performed;
- chain summary creation requested or performed;
- worker launch requested;
- Queue mutation requested;
- cloud/API/billing/auth/trading mutation requested;
- private API requested;
- OpenAI API requested;
- deploy requested;
- automatic approval requested;
- automatic GO signal.

If any forbidden action flag is true, the chain summary reference record is
invalid and must fail closed.

## Safe Next Action

The only successful next action after this implementation is an implementation
review packet:

`START_SUPERVISED_DRY_RUN_CHAIN_SUMMARY_REFERENCE_CONTRACTS_IMPLEMENTATION_REVIEW_PACKET`

This next action is not stage, commit, push, fetch, pull, deploy, runtime
execution, worker launch, live observation, audit bundle creation, owner review
packet submission, chain summary creation, Queue mutation, API use, cloud
mutation, billing/auth mutation, trading/order behavior, cleanup, or automatic
continuation.
