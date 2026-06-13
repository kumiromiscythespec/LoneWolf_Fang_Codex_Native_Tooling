<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Owner Approval Record Contract

## Purpose

The owner approval record is static evidence that a specific owner gate was
reviewed. It is not an execution token. Reading the record must not launch work,
start a worker, click UI, call APIs, deploy, trade, mutate billing, mutate cloud
state, stage, commit, push, fetch, pull, clean, delete, reset, restore, stash,
amend, rebase, or rewrite history.

## Record Identity

Each record must carry:

- `schema`;
- `build_id`;
- `approval_id`;
- `approval_created_at_utc`;
- optional `approval_expires_at_utc`;
- `task_id`;
- `target_repo`;
- `branch`;
- `head`;
- `local_origin_master`;
- `stable_baseline`;
- `artifact_chain_id`;
- `artifact_sha256`;
- `approval_phrase`;
- `action_class`;
- `approved_file_allowlist`;
- `approved_command_allowlist`;
- `safety_boundary_version`;
- `owner_approval_required`;
- `execution_allowed`;
- `runtime_allowed`;
- `automatic_continuation_allowed`;
- `mutation_approval_single_use`;
- `stale_if_any_bound_field_differs`;
- `ambiguity_result`;
- `reuse_prohibitions`;
- `supersession_status`;
- `expected_result`;
- `human_review_one_point`.

The `build_id` value for this contract is
`20260613_codex_native_automation_gate_contracts_v1`.

## Exact-Scope Binding

The approval is valid only for the exact values in the record. The approval
does not float across repositories, branches, commits, artifact chains, file
sets, command sets, safety boundaries, or task scopes.

The approved file allowlist must be explicit. The approved command allowlist
must be explicit when any command is allowed. Empty or broad allowlists require
owner review.

## Fail-Closed Booleans

For this contract:

- `owner_approval_required` must be `true`;
- `execution_allowed` must be `false`;
- `runtime_allowed` must be `false`;
- `automatic_continuation_allowed` must be `false`;
- `stale_if_any_bound_field_differs` must be `true`;
- `ambiguity_result` must be `STOP_OWNER_REVIEW_REQUIRED`.

These booleans prevent an approval record from becoming an implicit runtime,
commit, push, deploy, cloud, billing, trading, or automatic continuation gate.

## Supersession Contract

A supersession record is append-only. It records that one approval no longer
controls the chain and that a newer owner decision or repair packet should be
reviewed instead.

A supersession record must preserve:

- the superseded approval ID;
- the superseding approval ID;
- both artifact hashes;
- the reason;
- the owner gate;
- the rollback path;
- confirmation that deletion and history rewrite did not occur.

If a supersession record is missing any of those fields, or if it creates a
cycle or conflicts with another record, the chain must stop with
`STOP_OWNER_REVIEW_REQUIRED`.

## Future Implementation Boundary

This contract supports docs/schema/tests/fixtures-only implementation. It does
not approve a future commit or push. Commit and push require later single-use
owner approvals after implementation review.
