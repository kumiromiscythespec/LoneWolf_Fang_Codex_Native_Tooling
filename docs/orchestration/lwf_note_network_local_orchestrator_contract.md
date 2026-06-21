# LWF NOTE-NETWORK Local Orchestrator Contract

## Purpose

This contract defines the LWF-specific local orchestrator loop for reducing Codex usage while preserving owner review, artifact evidence, and strict safety boundaries.

The loop is documentation, schema, fixtures, and tests only. It does not implement runtime automation, call NOTE nodes, run Ollama, call OpenAI APIs, mutate cloud resources, or modify `C:\LWF_NoteNetwork`.

## Owner Goal

- Complete the LWF-specific local orchestrator first.
- Defer public-version orchestrator development.
- Make the five-notebook LWF-NOTE-NETWORK loop the primary orchestrator direction for Codex usage reduction.

## Priority

`public_version_deferred` must remain `true`.

`local_orchestrator_priority` must remain `true`.

Any record that makes the public version the active priority while this lane is active is invalid.

## Five-Node Role Map

All five NOTE nodes are required before a SCOUT or REVIEW packet can be treated as complete:

- `NOTE-01`: scope reader and task-boundary checker
- `NOTE-02`: contradiction and missing-evidence detector
- `NOTE-03`: fixture and schema coverage scout
- `NOTE-04`: safety-boundary reminder
- `NOTE-05`: compact packet reviewer and owner-decision reducer

NOTE output is local preprocessing only. NOTE output is not proof by itself.

## SCOUT Phase

1. ChatGPT writes a SCOUT plan.
2. The user writes it to `C:\LWF_NoteNetwork\inputs\scout_plan.txt`.
3. `run-scout.ps1` sends it to `NOTE-01` through `NOTE-05`.
4. NOTE outputs are merged and compacted.
5. The user gives the merged and compact SCOUT result to ChatGPT.
6. ChatGPT reviews the SCOUT packet and creates a bounded Codex prompt only when evidence and owner gates are clear.

SCOUT complete is not Codex execution approval.

## Codex Bounded Execution Phase

Codex may run only the bounded task approved by the current prompt. Codex must:

- preserve the exact file allowlist in the prompt
- self-audit scope
- create an artifact ZIP
- create SHA256 sidecars
- record changed files
- record test results
- record blocker status
- reduce continuation to one owner decision point

Codex cloud unpushed working trees are not assumed readable by ChatGPT.

## REVIEW Phase

1. ChatGPT writes a REVIEW plan.
2. The user writes it to `C:\LWF_NoteNetwork\inputs\scout_plan.txt`.
3. `run-scout.ps1` sends the REVIEW plan to `NOTE-01` through `NOTE-05`.
4. NOTE outputs are merged and compacted.
5. The user gives merged REVIEW output to ChatGPT.

REVIEW complete is not push approval.

## ChatGPT Final Decision Phase

ChatGPT final review must use evidence such as:

- Codex artifact ZIPs
- SHA sidecars
- diffs
- test summaries
- manifest files
- repo evidence available through a connector or owner-provided files

ChatGPT may decide `PASS`, `repair`, `stop`, or `next bounded Codex prompt`. A NOTE `PASS` is not proof.

## Local Filesystem Contract

This repo records the contract only. The current implementation does not modify `C:\LWF_NoteNetwork`.

The local NOTE-NETWORK handoff path is treated as owner-managed:

- input path: `C:\LWF_NoteNetwork\inputs\scout_plan.txt`
- scout/review runner: `run-scout.ps1`
- NOTE nodes: `NOTE-01` through `NOTE-05`

## Evidence Requirements

Valid packets must require:

- all five NOTE nodes
- merged and compact packet metadata
- ChatGPT review
- Codex artifact ZIP and SHA sidecars after any Codex execution
- independent repo, artifact, and test gate verification
- one owner decision point

## Codex Artifact Requirements

Every bounded Codex lane must produce:

- manifest
- safe summary
- changed file list
- test summary
- broad test summary when broad tests are run
- blocker matrix
- human review one point
- `NEXT_CODEX_PROMPT.md`
- artifact ZIP
- SHA256 sidecars

## Safety Boundary

READY is not GO.

MATCHED is not GO.

OBSERVED_SAFE_NO_ACTION is not GO.

Hash binding is not execution approval.

SCOUT complete is not Codex execution approval.

REVIEW complete is not push approval.

Owner review remains mandatory.

## Forbidden Actions

This contract does not approve:

- runtime automation
- NOTE node calls
- Ollama calls
- OpenAI API calls
- private API calls
- `C:\LWF_NoteNetwork` modification
- Queue mutation
- cloud mutation
- API mutation
- billing mutation
- auth mutation
- trading mutation
- stage
- commit
- push
- PR creation
- merge
- deploy
- release
- public submission
- GitHub visibility change

## Terminal States

- `STOP_OWNER_REVIEW_REQUIRED`
- `READY_FOR_CHATGPT_SCOUT_REVIEW`
- `READY_FOR_CODEX_BOUNDED_PROMPT`
- `READY_FOR_CHATGPT_FINAL_REVIEW`
- `READY_FOR_NEXT_BOUNDED_PROMPT`

No terminal state is automatic approval for runtime, push, deploy, public submission, or external review.

## Owner One-Point Decision Rule

Each packet must reduce the next action to one explicit owner decision. If approval is needed, the exact approval phrase must be sent separately and must not imply staging, commit, push, deploy, runtime execution, NOTE execution, or public submission unless that exact action is named.
