# Environment Variables

This public template uses placeholders instead of owner-local paths.

## Required Placeholders

- `<REPO_ROOT>`: local checkout of this template or the target repo.
- `<PROJECT_ROOT>`: local root for the user's downstream project.
- `<ARTIFACT_ROOT>`: external folder for handoff packets and ZIPs.
- `<PROJECT_PROFILE>`: user-owned project profile for private rules.
- `<OWNER_REVIEW_PACKET_ROOT>`: optional folder for owner review packets.

## Recommended Variables

- `CNCL_REPO_ROOT=<REPO_ROOT>`
- `CNCL_PROJECT_ROOT=<PROJECT_ROOT>`
- `CNCL_ARTIFACT_ROOT=<ARTIFACT_ROOT>`
- `CNCL_PROJECT_PROFILE=<PROJECT_PROFILE>`

## Windows PowerShell Example

```powershell
$env:CNCL_ARTIFACT_ROOT = "$env:LOCALAPPDATA\CodexNativeClosedLoop\data"
```

## macOS/Linux Example

```sh
export CNCL_ARTIFACT_ROOT="$HOME/.local/share/codex-native-closed-loop/data"
```

Do not commit machine-local profile files, secrets, raw logs, raw
ChatGPT/Codex conversations, generated artifact ZIPs, or personal user paths.
