<!-- BUILD_ID: 20260614_request_intake_approval_binding_contracts_v1 -->
# Supervised Dry-Run Request Blocker Matrix

This document defines the blocker matrix for request-intake owner approval binding. It preserves the exact scope, stable baseline, artifact chain, and no runtime execution boundary for this static slice.

A blocker matrix is required for every request-intake and approval-binding record. Empty blocker matrices are allowed only when the decision is ready for the next static review packet. Non-empty blocker matrices must force `STOP_OWNER_REVIEW_REQUIRED`.

## Required Blocker Fields

Each blocker must include:

- `blocker_id`;
- `severity` of `BLOCKER` or `HIGH`;
- `reason`;
- `evidence_reference`;
- `fail_closed_action` equal to `STOP_OWNER_REVIEW_REQUIRED`;
- `owner_review_required` equal to true;
- `allows_progression` equal to false.

Missing or malformed blocker fields are blockers themselves.

## Blocker Types

The matrix must represent these blockers when present:

- `missing_owner_approval`;
- `empty_owner_approval_phrase`;
- `wrong_owner_approval_phrase`;
- `stale_owner_approval`;
- `superseded_owner_approval`;
- `approval_target_mismatch`;
- `broad_wildcard_scope`;
- `missing_stable_baseline`;
- `mismatched_stable_baseline`;
- `missing_artifact_chain`;
- `missing_blocker_matrix`;
- `malformed_blocker_matrix`;
- `unknown_request_intake_decision`;
- `runtime_permission_present`;
- `worker_daemon_permission_present`;
- `api_cloud_billing_trading_permission_present`;
- `queue_mutation_permission_present`.

## Fail-Closed Rule

If any blocker appears, request intake must not proceed. The only allowed next recommendation is `STOP_OWNER_REVIEW_REQUIRED`.

Blockers must not start runtime workflows, launch workers, start daemon/watchers, use UI automation, call private APIs, call OpenAI APIs, mutate Cloudflare/D1/R2/KV/Queue, mutate billing, perform trading/PAPER/LIVE/order/cancel/fetch_balance, deploy, stage, commit, push, fetch, pull, cleanup, or rewrite history.

## Valid Blocked Record

A blocked record can be syntactically valid only when all blockers are explicit and all forbidden action flags remain false. A blocked record that sets an unsafe permission true is invalid fixture evidence and must be rejected by static tests.
