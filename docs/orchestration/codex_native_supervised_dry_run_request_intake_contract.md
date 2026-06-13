<!-- BUILD_ID: 20260614_request_intake_approval_binding_contracts_v1 -->
# Supervised Dry-Run Request Intake Contract

This document defines the static request-intake contract for a future single-shot supervised dry-run path.

The request-intake record is a pre-runtime gate. It binds one request to one owner approval phrase, one stable baseline, one branch, one exact docs/schema/tests/fixtures scope, one artifact chain, and one blocker matrix. It does not execute tasks.

## Bound Request Identity

Every request-intake record must include:

- `request_id`;
- `requested_target` equal to `request_intake_approval_binding_contracts`;
- target repo `C:\LoneWolf_Fang_Project\repos\core\LoneWolf_Fang_Codex_Native_Tooling`;
- expected branch `master`;
- stable baseline, expected head, and expected origin/master all equal to `990649259423bba0968169d96fc1b9d84077e074`;
- expected ahead/behind `0 / 0`;
- owner approval phrase `APPROVE_REQUEST_INTAKE_APPROVAL_BINDING_CONTRACTS_DOCS_SCHEMA_TESTS_FIXTURES_ONLY`;
- artifact-chain evidence with packet paths and SHA256 values;
- `human_review_one_point`.

If any identity field is missing, empty, stale, mismatched, or ambiguous, the request intake must produce `STOP_OWNER_REVIEW_REQUIRED`.

## Owner Approval Binding

The intake approval must be exact, current, and bound to this target only.

The following conditions fail closed:

- missing owner approval;
- empty approval phrase;
- wrong approval phrase;
- approval phrase for another target;
- stale approval;
- superseded approval;
- mismatched owner approval record;
- reused approval across another baseline or artifact chain.

The intake record must not treat approval as reusable for runtime execution, worker launch, daemon/watchers, API calls, cloud mutation, Queue mutation, billing mutation, trading, PAPER, LIVE, order, cancel, fetch_balance, UI automation, automatic continuation, stage, commit, push, cleanup, or history rewrite.

## Exact Scope Binding

The approval scope is the exact 14-file docs/schema/tests/fixtures allowlist for this implementation slice.

The request intake fails closed when the scope contains:

- wildcard paths;
- directory-only scopes;
- broad fixture directories;
- paths under `src`, `tools`, `scripts`, `runtime`, `worker`, `cloud`, `deploy`, `billing`, `trading`, `.git`, or `node_modules`;
- any path outside docs/schema/tests/fixtures;
- a count other than 14.

## Artifact Chain

Artifact chain evidence must name the implementation approval packet, planning integration packet, stable closeout packet, expected hashes, and artifact role `request_intake_approval_binding_evidence_chain`.

Missing artifact evidence, malformed SHA256 values, unknown artifact roles, or broken continuity must stop with `STOP_OWNER_REVIEW_REQUIRED`.

## Stop Conditions

Request intake must stop when any blocker is present, any forbidden action is allowed, any approval binding field differs, or any artifact proof is missing.

The request-intake contract is static documentation, schema, tests, and fixtures only. It is not a runtime executor, worker launcher, daemon, watcher, scheduler, queue runner, UI automation path, private API client, OpenAI API client, Cloudflare/D1/R2/KV/Queue mutator, billing mutator, or trading/order path.
