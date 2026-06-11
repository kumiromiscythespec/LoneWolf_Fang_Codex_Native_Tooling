# Contributing

This repository uses owner-gated, docs-first contribution rules. It is a private
OSS candidate until a future owner decision changes visibility.

## Before Work

Read the rule files before making changes:

- `CLAUDE.md`
- `CODEX_RULES.md`
- `LONEWOLF_FANG_SAFETY_BOUNDARY.md`

Then state assumptions, unclear points, success criteria, planned touched files,
must-not-touch files, and safety boundaries. If scope, approval, or artifact
identity is unclear, stop with: `Stop and Wait - Owner Review Required.`

## Roles

- Implementer: performs the approved bounded work only.
- Reviewer: checks the work, artifacts, checksums, and next prompt.
- Owner: makes GO / revise / stop decisions.

The owner should see one clear decision point. Commit approval and push approval
are separate from implementation approval.

## Change Rules

- Keep changes surgical and directly tied to the approved scope.
- Do not refactor unrelated files.
- Do not add runtime, deploy, private API, trading, backtest, notification, or
  local status writer behavior without explicit separate approval.
- Do not send notifications.
- Do not publicize the repository.
- Do not include secrets, raw private logs, raw conversation dumps, credentials,
  or contact details.

## Artifact Handoff

Handoff artifacts live outside the repo under:

`<ARTIFACT_ROOT>`

Each contributor chooses their own local artifact root. The public template
does not require a private downstream project path or personal user directory.

Expected handoff shape:

- `manifest.json`
- `safe_summary.md`
- validation summary
- `human_review_one_point.md`
- `NEXT_CODEX_PROMPT.md`
- `checksums_sha256.txt`
- ZIP file with `.zip.sha256` and `.zip.sha256.json`

Final reports should include a Japanese owner summary when requested by the
workflow.
