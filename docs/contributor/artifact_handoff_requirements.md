# Artifact Handoff Requirements

Handoff artifacts live outside the repository under the user-chosen artifact
root:

`<ARTIFACT_ROOT>`

Recommended public environment variable:

`CNCL_ARTIFACT_ROOT=<ARTIFACT_ROOT>`

Do not treat any private downstream project path as a public template default.

## Required Shape

Use a timestamped folder and ZIP with:

- `manifest.json`
- `safe_summary.md`
- validation summary
- changed file list when relevant
- `human_review_one_point.md`
- `NEXT_CODEX_PROMPT.md`
- `checksums_sha256.txt`
- `.zip.sha256`
- `.zip.sha256.json`

## Exclusions

Do not include secrets, raw auth payloads, private API payloads, raw private
logs, raw conversations, contact details, provider credentials, notification
tokens, `.git`, `node_modules`, nested ZIPs, build cache, large unrelated
exports, or production database dumps.

## Review

The next phase must verify the artifact path and SHA256 before treating the
artifact as a source of truth.
