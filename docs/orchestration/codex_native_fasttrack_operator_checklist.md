<!-- BUILD_ID: 20260612_fasttrack_window6_user_runbook_docs_v0 -->
# Codex Native Fast-Track Operator Checklist

## Purpose

This checklist is for a human operator or reviewer accepting a completed Codex
Native fast-track lane. It keeps the review focused on local evidence, static
checks, AppData artifacts, and the owner decision point.

## Preflight

- Confirm the lane prompt names the target repo, worktree, branch, base commit,
  allowed files, forbidden actions, checks, artifact output directory, and final
  report labels.
- Confirm required project rule files were read from `C:\LoneWolf_Fang_Project`
  when working in this owner environment.
- Confirm the lane is isolated in its own worktree.
- Confirm the lane has no approval for push, deploy, runtime automatic
  execution, private API access, trading, billing, daemon, watcher, cleanup,
  reset, restore, git clean, stash, or deletion.
- Confirm the worktree was clean before edits or that any pre-existing changes
  were explicitly accepted by the owner.

## Completed MVP Evidence

- Task authoring helper is documented as a local drafting surface only.
- Generated task contract is documented as reviewable evidence, not permission.
- Dry-run validator is documented as static validation only.
- Execution interpreter is documented as AppData packet creation only for the
  approved operation class.
- AppData-only review packet expectations are documented.
- Task-result linkage contracts require paths and SHA256 values for every
  handoff.
- First linkage proof is represented by synthetic fixtures and static tests.
- Post-linkage review requires one explicit owner decision.

## Fast-Track Additions

- AppData linkage ledger writer is described as append-only owner-local evidence.
- Read-only linkage consumer is described as a non-mutating inspector.
- Manual state machine coordinator is described as explicit human state review.
- Safety guards are described as stop conditions, not bypass mechanisms.

## Required Static Checks

Run only checks approved for the lane. For docs acceptance, the minimum focused
check is:

```powershell
node tests/codex_native_fasttrack_docs_contract.test.mjs
```

When broader static validation is approved, also run:

```powershell
node tests/file_queue_contract.test.mjs
node tests/file_queue_task_result_linkage_contract.test.mjs
node tests/codex_native_closed_loop/no_worker_launch_guard_static.test.mjs
node tests/codex_native_closed_loop/state_machine_static_contract.test.mjs
node tests/codex_native_closed_loop/transition_table_static_contract.test.mjs
git diff --check
```

Do not run helper, validator, or interpreter execution tests in a docs-only
lane. If those are required, split the work into a separately approved
tool-validation lane.

## AppData Packet Review

- ZIP path is under the approved artifact root and outside the repo.
- ZIP sidecars are present when required.
- SHA256 in the final report matches the ZIP bytes.
- ZIP entry count is reported.
- `manifest.json` identifies the build, branch, commit, changed files, checks,
  forbidden-action confirmation, and source evidence.
- `safe_summary.md` states what changed and what did not happen.
- `human_review_one_point.md` contains one clear human decision point.
- No secrets, raw auth, raw private payloads, billing payloads, order-sensitive
  data, `.git`, `node_modules`, nested ZIPs, build cache, or unrelated exports
  are included.

## GO / REPAIR / STOP

Choose `GO` only when:

- all required docs, fixtures, and tests are present;
- static checks passed or skipped checks are explicitly justified;
- checksums and artifact metadata match;
- forbidden actions are confirmed absent;
- the next bounded action is named; and
- the owner agrees that no broader approval is being implied.

Choose `REPAIR` when:

- a doc is missing a required topic;
- a fixture or test does not cover the acceptance model;
- a checksum, entry count, changed-file list, or human review point is missing;
- wording implies an unsafe permission; or
- a safe static check fails.

Choose `STOP` when:

- any forbidden action appears necessary;
- source of truth is ambiguous;
- artifact integrity cannot be verified;
- a lane tries to use AppData ledger evidence as execution permission; or
- the next action would require owner judgment beyond the current prompt.

## Final Acceptance Fields

The lane final report should include:

- `CHANGED_SUMMARY`
- `WORKTREE_PATH`
- `BRANCH`
- `BASE_COMMIT`
- `RULE_FILE_RESULT`
- `DOCS_RESULT`
- `CHANGED_FILES`
- `TEST_RESULT`
- `LOCAL_COMMIT_RESULT`
- `COMMIT_HASH`
- `PUSH_PERFORMED`
- `RUNTIME_PERFORMED`
- `FORBIDDEN_ACTIONS_CONFIRMATION`
- `ZIP_PATH`
- `SHA256`
- `ZIP_ENTRY_COUNT`
- `INTEGRATION_NOTES`
- `UNCONFIRMED_ASSUMPTIONS`
- `DANGEROUS_CHANGES`
- `HUMAN_REVIEW_ONE_POINT`
- `CONFIDENCE_LEVEL`
