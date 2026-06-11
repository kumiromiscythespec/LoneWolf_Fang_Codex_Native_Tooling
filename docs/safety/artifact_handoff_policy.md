# Artifact Handoff Policy

This workflow uses external artifacts to preserve evidence between bounded
Codex phases without placing generated handoff payloads inside the repo.

## Artifact Location

Artifacts should be stored under:

```text
<ARTIFACT_ROOT>
```

Each user chooses `<ARTIFACT_ROOT>` for their own environment. Public docs must
not require a personal user directory or private project path.

Recommended public examples:

```text
%LOCALAPPDATA%\CodexNativeClosedLoop\data
```

```powershell
$env:CNCL_ARTIFACT_ROOT = "$env:LOCALAPPDATA\CodexNativeClosedLoop\data"
```

```sh
export CNCL_ARTIFACT_ROOT="$HOME/.local/share/codex-native-closed-loop/data"
```

Use a timestamped artifact folder and ZIP name so each handoff is immutable and
easy to verify.

## Expected Contents

An artifact should include, when relevant:

- `manifest.json`
- `safe_summary.md`
- `changed_files.txt` or an inventory report
- `test_summary.md` or `validation_summary.md`
- `human_review_one_point.md`
- `NEXT_CODEX_PROMPT.md`
- `checksums_sha256.txt`

The artifact should also have:

- a ZIP file;
- `.zip.sha256`;
- `.zip.sha256.json`.

## Manifest Expectations

The manifest should record:

- schema;
- artifact name;
- creation time;
- scope;
- status;
- target repo path;
- head before and after when relevant;
- changed files;
- validation results;
- safety flags;
- list of included files.

Safety flags should explicitly show whether high-risk actions occurred.

## Checksums

`checksums_sha256.txt` should include the SHA256 of each file inside the
artifact folder, except itself when the checksum file is generated last.

The ZIP sidecars should match the ZIP hash exactly:

- `.zip.sha256`
- `.zip.sha256.json`

The next prompt should reference both:

- artifact ZIP path;
- artifact ZIP SHA256.

## What Not To Include

Do not include:

- secrets;
- API keys;
- tokens;
- raw auth payloads;
- private API payloads;
- production DB dumps;
- `node_modules`;
- `.git`;
- nested ZIP files;
- build cache;
- large exports;
- raw private logs;
- private ChatGPT/Codex conversation dumps;
- screenshots with private information;
- provider credentials;
- contact details for notification systems.

## Owner Review

Each artifact should contain one clear human decision point. The owner should be
able to answer one question, such as:

- approve the next docs-only phase;
- request more review;
- pause;
- approve a separate commit packet;
- approve a separate push packet.

Do not treat artifact creation as execution approval.

If artifact identity or checksum verification fails, stop with:

```text
Stop and Wait - Owner Review Required.
```
