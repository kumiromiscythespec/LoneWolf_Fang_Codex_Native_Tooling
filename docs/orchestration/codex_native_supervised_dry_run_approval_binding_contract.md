<!-- BUILD_ID: 20260614_request_intake_approval_binding_contracts_v1 -->
# Supervised Dry-Run Approval Binding Contract

This document defines how a future supervised dry-run request binds to a single owner approval.

Approval binding is static evidence. It decides whether a request may proceed to an owner-reviewed implementation review packet. It does not execute and does not authorize no runtime execution, runtime continuation, worker startup, daemon/watchers, Queue mutation, API calls, cloud mutation, billing mutation, trading, PAPER, LIVE, order, cancel, or fetch_balance.

## Required Binding Fields

An approval binding record must include:

- `approval_binding_id`;
- `request_id`;
- `requested_target` equal to `request_intake_approval_binding_contracts`;
- exact owner approval phrase `APPROVE_REQUEST_INTAKE_APPROVAL_BINDING_CONTRACTS_DOCS_SCHEMA_TESTS_FIXTURES_ONLY`;
- `stable_baseline`, `expected_head`, and `expected_origin_master` equal to `990649259423bba0968169d96fc1b9d84077e074`;
- expected branch `master`;
- expected ahead/behind `0 / 0`;
- owner approval freshness and supersession status;
- exact 14-file approval scope;
- request-intake reference;
- artifact-chain evidence;
- blocker matrix;
- fail-closed decision;
- forbidden action booleans fixed to false;
- `human_review_one_point`.

## Freshness and Supersession

The approval is current only when it is active, not stale, not superseded, bound to the exact request target, bound to the current stable baseline, and bound to the same artifact chain.

The binding must reject:

- missing owner approval;
- empty approval phrase;
- wrong owner approval phrase;
- stale approval;
- superseded approval;
- approval target mismatch;
- changed file allowlist;
- broad wildcard scope;
- missing baseline;
- mismatched baseline;
- missing artifact evidence.

Supersession is append-only evidence. A superseded approval must be preserved and must not be deleted, rewritten, truncated, reordered, or cleaned.

## Forbidden Permission Model

Approval binding is not a permission grant for runtime. These fields must remain false:

- `runtime_execution_allowed`;
- `worker_launch_allowed`;
- `daemon_watcher_allowed`;
- `private_api_allowed`;
- `openai_api_allowed`;
- `cloud_mutation_allowed`;
- `queue_mutation_allowed`;
- `billing_mutation_allowed`;
- `trading_order_allowed`;
- `ui_automation_allowed`;
- `automatic_continuation_allowed`.

If any of these flags is true, the record must fail closed with `STOP_OWNER_REVIEW_REQUIRED`.

## Human Review Point

The owner decides one point only: whether the static request-intake approval binding evidence is ready for implementation review. Commit, push, deploy, runtime, API/cloud/billing/trading, Queue mutation, and automatic continuation all require later explicit owner approval.
