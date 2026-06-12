<!-- BUILD_ID: 20260612_fasttrack_window6_user_runbook_docs_v0 -->
# Codex Native v0.1+ Fast-Track User Runbook

## Purpose

This runbook explains the completed Codex Native Closed Loop v0.1+ fast-track
MVP in user-facing terms. It is for owners, reviewers, and operators who need
to understand what the local file queue workflow can safely prove, what
fast-track windows add around that proof, and where the system must still stop.

The MVP is a local, evidence-first workflow. It creates reviewable files,
checks static contracts, writes owner-local artifacts, and preserves human
decision gates. It is not a deploy system, runtime automation system, private
API client, trading client, billing client, daemon, watcher, or queue runner.

## Completed MVP Surface

The baseline MVP already contains these reviewable pieces:

1. Task authoring helper
   - Turns an owner-approved authoring request into one generated task draft.
   - Captures target repo, safe mode, allowlist, forbidden actions, success
     criteria, stop conditions, artifact requirements, and final report labels.
   - Does not run the validator, execute the task, launch workers, or call
     external services.

2. Generated task
   - Stores the exact bounded task that a later lane may validate or review.
   - Must include safe mode, allowed files, forbidden actions, stop conditions,
     owner approval phrase, and expected artifact requirements.
   - Is evidence only. The existence of a task is not approval to run it.

3. Dry-run validator
   - Checks one generated task for static shape, forbidden action coverage,
     stop conditions, artifact requirements, and owner review evidence.
   - Writes a validation report for human review.
   - A passing report means the task is structurally safe enough to review. It
     does not authorize runtime execution or any later high-risk action.

4. Execution interpreter
   - Handles only the approved AppData review-packet operation class for one
     validated task and one matching validator report.
   - Verifies declared hashes before writing a packet.
   - Does not interpret prose as commands, run helper tools, run the validator,
     launch workers, call Codex CLI, call OpenAI APIs, deploy, trade, bill, or
     use private APIs.

5. AppData-only review packet
   - Produces owner-local evidence under `<ARTIFACT_ROOT>`.
   - Expected contents include manifest, safe summary, test summary when
     relevant, changed file list, human review point, next prompt when useful,
     checksums, ZIP, and checksum sidecars.
   - Must not contain secrets, API keys, raw auth, private payloads, billing
     payloads, order-sensitive data, `.git`, `node_modules`, nested ZIPs, build
     cache, or unrelated exports.

6. Task-result linkage contracts
   - Connect authoring request, generated task, validator report, execution
     request, interpreter result, output packet, and owner decision into one
     chain.
   - Require SHA256 evidence at each handoff boundary.
   - Treat missing hashes, mismatched hashes, missing parent references, or
     missing human review points as unsafe evidence.

7. First linkage proof
   - Uses synthetic fixtures and static contract tests to show one complete
     linkage chain can be reviewed end to end.
   - Proves contract shape and safety semantics only. It is not a consumer,
     runner, daemon, watcher, or automatic continuation path.

8. Post-linkage review
   - Requires the owner or reviewer to inspect packet metadata, checksums,
     changed files, safety summary, test summary, and one human review point.
   - Ends in one explicit decision: `GO`, `REPAIR`, or `STOP`.

## Fast-Track Windows Being Added

The fast-track completion work adds the following surfaces around the completed
MVP. These additions are still bounded by the same safety model.

| Fast-track surface | Safe purpose | Must not become |
| --- | --- | --- |
| AppData linkage ledger writer | Append owner-local linkage evidence for completed chains | Repo writer, queue trigger, runtime runner, hidden approval token |
| Read-only linkage consumer | Inspect existing linkage evidence and summarize safe next review state | Executor, fixer, worker launcher, state mutator |
| Manual state machine coordinator | Record explicit manual state transitions and stop reasons | Automatic scheduler, daemon, watcher, next-worker starter |
| Safety guards | Detect forbidden actions, unsafe claims, and missing review evidence | Bypass, auto-repair engine, deploy gate opener |

The fast-track model remains manual and evidence-first. AppData records help the
owner review state; they do not grant permission to execute work.

## What Is Still Not Allowed

The following remain outside the MVP and outside fast-track docs acceptance:

- deploy or production mutation
- runtime automatic execution
- helper, validator, or interpreter execution from docs-only lanes
- private API access
- trading, including PAPER, LIVE, order, cancel, or fetch_balance
- billing or external service mutation
- daemon, watcher, queue loop, scheduler, or background consumer
- Codex worker auto-start or UI automation
- OpenAI API calls
- fetch, pull, push, force push, reset, restore, clean, stash, or deletion
- secrets output, raw auth output, raw private payload output, or production DB
  dumps

Any future work that needs one of these actions requires a separate owner
approval that names the exact action, repo, files, checks, artifact output, and
stop conditions.

## How To Run Static Tests

Use static tests when the lane is docs-only, schema-tests-only, or static
validation only.

```powershell
node tests/codex_native_fasttrack_docs_contract.test.mjs
node tests/file_queue_contract.test.mjs
node tests/file_queue_task_result_linkage_contract.test.mjs
node tests/codex_native_closed_loop/no_worker_launch_guard_static.test.mjs
node tests/codex_native_closed_loop/state_machine_static_contract.test.mjs
node tests/codex_native_closed_loop/transition_table_static_contract.test.mjs
git diff --check
```

Do not run tests that execute the task authoring helper, dry-run validator, or
execution interpreter in a docs-only lane. Those checks belong to a separate
tool-validation lane with explicit owner approval.

## How To Create AppData Packets

Create AppData review packets only in a lane where the owner explicitly
approved packet creation or interpreter use. A docs-only lane may document this
flow, but must not run it.

1. Choose an artifact root outside the repository.

```powershell
$env:CNCL_ARTIFACT_ROOT = "$env:LOCALAPPDATA\CodexNativeClosedLoop\data"
```

2. Confirm the generated task and validator report match the approved request.
   Record their paths and SHA256 values.

3. Prepare an execution request that names:
   - task id
   - task JSON path and SHA256
   - validator report path and SHA256
   - expected validator status
   - owner approval phrase
   - output root policy
   - expected final report labels

4. In an owner-approved AppData packet lane only, run the interpreter command
   documented by the execution interpreter page.

5. Stop after packet creation. The next action is owner review, not automatic
   continuation.

## How To Inspect Artifacts

Inspect the ZIP and its sidecars before trusting a packet.

1. Confirm the ZIP is under `<ARTIFACT_ROOT>` and outside the repository.
2. Verify the ZIP SHA256 against `.zip.sha256` or `.zip.sha256.json`.
3. Open `manifest.json` and confirm build id, task id, branch, changed files,
   test summary, forbidden-action confirmation, and source artifact hashes.
4. Read `safe_summary.md` for what changed and what did not happen.
5. Read `human_review_one_point.md` before choosing a decision.
6. Confirm no forbidden payloads are present.
7. Preserve the ZIP path and SHA256 in the next prompt or ledger record.

If any checksum, manifest field, or human review point is missing, choose
`REPAIR` or `STOP` instead of `GO`.

## Owner Decision Model

Use exactly one top-level decision for the reviewed packet.

| Decision | Use when | Next safe action |
| --- | --- | --- |
| `GO` | Evidence is complete, hashes match, safety boundary is clear, and the next bounded action is explicitly named | Start only that next bounded action in a new prompt |
| `REPAIR` | Evidence is useful but incomplete, stale, mismatched, unclear, or missing a required doc/check/artifact | Create a repair lane with exact files and checks |
| `STOP` | The packet requests or implies forbidden behavior, source of truth is ambiguous, or human judgment is required | Stop and wait for owner review |

`GO` is never global approval. It does not approve push, deploy, runtime
execution, provider access, private API access, trading, billing, daemon,
watcher, cleanup, or another phase unless the current owner prompt explicitly
approves that exact action.

## Future Bug Fixing After Fast-Track Completion

Handle future bugs as bounded repair lanes.

1. Identify the evidence source: doc, schema, fixture, test, AppData packet,
   linkage record, ledger entry, consumer output, coordinator state, or safety
   guard result.
2. Decide whether the bug is docs-only, schema/static-test, AppData artifact,
   or implementation behavior.
3. Create a new isolated worktree or branch for the repair.
4. Add or update a synthetic fixture or static test that captures the bug when
   safe.
5. Make the smallest repair.
6. Run only the narrow checks that match the approved lane.
7. Create a new AppData packet with changed files, test result, one human review
   point, ZIP SHA256, and clear next owner decision.

Stop instead of fixing when the repair would require private APIs, deployment,
runtime execution, trading, billing, daemon or watcher behavior, hidden
continuation, cleanup, reset, restore, git clean, deletion, or a broader
allowlist than the owner approved.
