<!-- BUILD_ID: 2026-06-26_post_merge_closeout_ledger_contract_v1 -->

# Post-Merge Closeout Ledger Contract

## Purpose

The post-merge closeout ledger contract records the final evidence for a
merged, owner-accepted lane. It is meant for PR #5 / PR #6 style closeout
packets where Codex has already verified the PR state, merge commit, remote
branch heads, exact file scope, validation results, and no-runtime boundary.

The record makes future closeout packets easier to validate without replaying
the whole handoff chain manually.

## When It Is Created

Create this record after a pull request has been merged and the owner is ready
to accept the lane as closed. The record should be written from observed
closeout evidence, not from runtime execution or private systems.

## Required Evidence

A valid ledger record includes:

- PR number, URL, title, state, base branch, head branch, and pre-merge head
  commit.
- Merge method, merge command, merge commit SHA, merge timestamp, and a false
  branch deletion flag when the head branch is intentionally kept.
- Remote master HEAD after merge and kept head-branch HEAD after merge.
- Closeout classification, final lane status, recommended owner action, and
  explicit `no_runtime_action`.
- Expected and actual file lists, matching file counts, and empty unexpected
  and missing file arrays.
- Focused test, full test, diff check, GitHub checks summary, and dangerous
  area review.
- Owner acceptance phrase and the one human decision point.

## Safety Boundary

The contract is docs, schema, tests, and fixtures only. It must not authorize or
record any of these as performed:

- deploy
- runtime execution
- API/auth/billing/trading action
- private repo read
- contracts repo read
- fetch/pull/checkout
- branch deletion
- force push
- automatic commit/push/PR/merge

All dangerous touch flags are false-only. If any dangerous flag is true, the
record is invalid and owner review is required.

## Validation Expectations

The schema pins `schema_version`, `record_type`, and the build id. Static tests
also check semantic invariants that JSON Schema alone cannot express simply:

- PR state is `MERGED`.
- `remote_heads.master_head_after_merge` equals `merge.merge_commit_sha`.
- `remote_heads.head_branch_after_merge` equals
  `pr.head_commit_before_merge`.
- `scope.expected_file_count` equals `scope.expected_files.length`.
- `scope.actual_file_count` equals `scope.actual_files.length`.
- unexpected and missing file arrays are empty for a closed no-runtime lane.
- owner acceptance phrase is present.

## Owner Acceptance

The owner acceptance phrase is required and must be non-empty. It records the
human acceptance of the merged closeout lane, but it does not approve future
repository mutation, runtime work, deployment, or automation.

## No-Runtime Lane Closure

A no-runtime closeout uses:

- `closeout.final_lane_status`:
  `LANE_CLOSED_MERGED_NO_RUNTIME_ACTION`
- `closeout.no_runtime_action`: `true`

That status means the lane is closed as merged evidence only. READY is not GO.

## Out Of Scope

This contract does not deploy, execute runtime code, call APIs, handle auth,
change billing, trade, read private repos, read contracts repos, fetch, pull,
checkout, delete branches, force push, commit, push, create pull requests, or
merge branches.
