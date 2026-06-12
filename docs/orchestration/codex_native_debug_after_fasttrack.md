<!-- BUILD_ID: 20260612_fasttrack_window6_user_runbook_docs_v0 -->
# Codex Native Debugging After Fast-Track

## Purpose

After fast-track completion, bugs should be handled through narrow repair lanes.
The goal is to preserve the evidence chain while fixing one bounded issue at a
time.

Do not debug by enabling runtime automatic execution, daemon behavior, watcher
behavior, private API calls, trading actions, billing actions, deploy actions,
or cleanup operations.

## Debug Triage

Classify the issue before editing.

| Symptom | First evidence to inspect | Safe repair shape |
| --- | --- | --- |
| Runbook is unclear or incomplete | Markdown docs and acceptance fixture | Docs-only repair plus docs contract test |
| Static contract fails | Failing `.mjs` test and fixture | Fixture or schema repair with focused static test |
| Artifact ZIP metadata mismatch | ZIP, sidecar, manifest, SHA256 checksum file | Recreate packet in approved artifact lane |
| Linkage hash mismatch | Linkage record and referenced artifact SHA256 values | Stop, identify source artifact, repair record only with approval |
| Ledger duplicate or stale entry | AppData ledger file and chain id | Append supersession record, do not rewrite history unless approved |
| Read-only consumer reports wrong state | Consumer output and source ledger record | Repair consumer read logic in separate implementation lane |
| Manual state transition blocked | Coordinator state file and transition reason | Add explicit owner decision or repair transition fixture |
| Safety guard triggers | Guard output and triggering token or claim | Keep stopped until owner reviews the risk |

## Repair Lane Pattern

Use this pattern for future bug fixing:

1. Name the exact bug and evidence file.
2. Create an isolated branch or worktree for the repair.
3. State assumptions, unclear points, success criteria, touched files, must-not
   touch files, and safety boundary.
4. Add or update a synthetic fixture when the bug is contract-related.
5. Add or update a focused static test when safe.
6. Make the smallest docs, schema, fixture, or implementation repair permitted
   by the lane.
7. Run only approved checks.
8. Create a new AppData handoff packet.
9. End with one human review point.

## Do Not Use These Debug Shortcuts

- Do not delete ledger files to make a duplicate disappear.
- Do not rewrite prior owner decisions without an explicit supersession record.
- Do not reset, restore, clean, stash, or delete to force a clean state.
- Do not fetch, pull, push, or force push unless the owner explicitly approves
  that exact git action.
- Do not run helper, validator, or interpreter commands from a docs-only lane.
- Do not start a daemon, watcher, queue loop, scheduler, or next worker.
- Do not call OpenAI APIs, browser automation, provider APIs, private APIs,
  billing services, deploy services, or trading services.
- Do not treat `GO` in an old artifact as permission for a new action.

## Common Debug Outcomes

Choose `GO` when the bug is repaired, checks pass, artifact evidence is complete,
and the next bounded action is explicit.

Choose `REPAIR` when the evidence points to a fixable docs, fixture, schema,
static test, or implementation issue that remains within the approved lane.

Choose `STOP` when the evidence is ambiguous, a checksum mismatch cannot be
explained, a safety guard reports forbidden behavior, or the repair requires a
new approval boundary.

## Escalation Triggers

Stop for owner review when:

- the source artifact cannot be verified;
- the repo state is unexpectedly dirty;
- a requested repair crosses repo boundaries;
- a test failure appears to require helper, validator, interpreter, runtime, or
  external service execution not approved by the current prompt;
- private payloads, secrets, billing data, provider data, or trading data are
  needed;
- an operator asks to deploy, push, run, trade, bill, or start a daemon; or
- a state transition would skip the owner decision point.
