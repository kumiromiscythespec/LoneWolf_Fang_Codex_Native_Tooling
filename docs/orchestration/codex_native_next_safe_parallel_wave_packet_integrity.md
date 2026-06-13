<!-- BUILD_ID: 20260613_single_shot_supervised_dry_run_readiness_map_v1 -->
# Next Safe Parallel Wave Packet Integrity

Future evidence packets for this readiness map must be AppData-only and safe to share.

## Required Packet Contents

- `manifest.json`
- safe summary
- changed files summary
- allowlist conformance
- BUILD_ID verification
- static test summary
- schema and fixture validation summary
- git status summary
- forbidden actions confirmation
- no-runtime boundary verification
- blocker matrix
- human review one point
- `NEXT_CODEX_PROMPT.md`
- checksum summary

## Integrity Rules

Each packet must have a ZIP, `.zip.sha256`, and `.zip.sha256.json` sidecar. A missing sidecar, mismatched SHA256, nested ZIP, `.git`, node_modules, build cache, secrets, raw auth, API key, billing data, credential, production DB dump, or large unrelated export is a blocker.

Duplicate active artifacts and superseded artifact reuse must stop at `STOP_OWNER_REVIEW_REQUIRED`.
