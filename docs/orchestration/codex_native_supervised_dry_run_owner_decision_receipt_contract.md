# BUILD_ID: SUPERVISED_DRY_RUN_OWNER_DECISION_RECEIPT_CONTRACTS_20260615
# Codex Native Supervised Dry Run Owner Decision Receipt Contract

## Purpose

This contract defines static owner decision receipts for the supervised dry-run
flow. The receipt records what the owner decided after reviewing supervised
dry-run evidence or request-envelope material. It is evidence-only audit metadata.

The receipt is never an executor, runtime trigger, worker launch request, Queue
mutation request, cloud/API/billing/auth/trading action, deploy action, commit
approval, push approval, or automatic continuation signal.

## Scope

The implementation scope is docs/schema/tests/fixtures only for the target
`supervised_dry_run_owner_decision_receipt_contracts`.

The current baseline for this contract is:

`5d77e8568f0a6708cae730aa66fa3f3f953fc6db`

The owner approval phrase for this implementation is:

`APPROVE_SUPERVISED_DRY_RUN_OWNER_DECISION_RECEIPT_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION`

The phrase authorizes only the exact docs/schema/tests/fixtures allowlist for
this contract. It does not authorize stage, commit, push, fetch, pull, deploy,
runtime execution, worker launch, Queue mutation, cloud/API/billing/auth/trading
mutation, private API, OpenAI API, cleanup, history rewrite, daemon/watcher/UI
automation, or edits outside the allowlist.

## Receipt Statuses

An owner decision receipt has one status:

- `OWNER_APPROVED_FOR_NEXT_APPROVAL_PACKET`
- `OWNER_REJECTED`
- `OWNER_REQUESTED_BOUNDED_REPAIR`
- `OWNER_REQUESTED_STOP`
- `OWNER_REVIEW_REQUIRED`
- `STOP_OWNER_REVIEW_REQUIRED`

`OWNER_APPROVED_FOR_NEXT_APPROVAL_PACKET` means the owner approved preparing a
future approval packet only. It is not runtime GO. It is not push approval. It is
not implementation approval unless the matching explicit owner approval phrase
for that later implementation is present and fresh.

`OWNER_REJECTED`, `OWNER_REQUESTED_BOUNDED_REPAIR`, `OWNER_REQUESTED_STOP`,
`OWNER_REVIEW_REQUIRED`, and `STOP_OWNER_REVIEW_REQUIRED` are fail-closed
receipt states. They must preserve evidence and keep the next action bounded to
repair, review, or stop.

## Not GO Semantics

Receipt presence alone is not enough to execute anything.

The following states are not GO:

- `READY`
- `MATCHED`
- `OBSERVED_SAFE_NO_ACTION`
- `REQUEST_DRAFT_READY`
- `PREFLIGHT_BOUND_READY`
- `OWNER_APPROVED_FOR_NEXT_APPROVAL_PACKET`

The owner decision receipt cannot bypass safety gates, owner gates,
`STOP_OWNER_REVIEW_REQUIRED`, or `Stop and Wait - Owner Review Required`.

## Required Receipt Evidence

Each receipt records:

- schema identifier and BUILD_ID;
- receipt identity and timestamp;
- target repo, branch, baseline, HEAD, local origin/master, and ahead/behind;
- parent planning artifact path and SHA256;
- execution request envelope artifact path and SHA256 when applicable;
- owner decision status;
- owner approval phrase evidence and freshness fields;
- exact future next-action constraints;
- false-only forbidden action flags;
- blocker matrix;
- human review one point;
- fail-closed result for ambiguity, stale baseline, SHA mismatch, broad scope,
  missing human review point, or unsafe next action.

## Forbidden Actions

All forbidden action flags must remain false:

- runtime execution;
- worker launch;
- Queue mutation;
- cloud/API mutation;
- private/OpenAI API;
- billing/auth mutation;
- trading/order;
- deploy;
- commit;
- push;
- fetch/pull;
- cleanup;
- automatic continuation.

If any forbidden action flag is true, the receipt is invalid and must fail
closed.

## Recommended Next-Step Boundary

Safe next actions for receipt records are bounded to approval-packet preparation,
repair, owner review, or stop. A receipt must not recommend execution, worker
launch, Queue mutation, deploy, commit, push, private API, OpenAI API, cloud
mutation, billing/auth mutation, trading/order action, cleanup, or automatic
continuation.

Future implementation review, commit approval, push approval, and any runtime or
live orchestration consideration each require separate owner-gated lanes.
