# Artifact Root Setup

Choose an artifact root outside the repository and refer to it as
`<ARTIFACT_ROOT>`.

The artifact root is where bounded Codex phases place evidence handoff folders,
ZIPs, `.zip.sha256`, and `.zip.sha256.json` sidecars.

## Public Template Defaults

The public template does not require a specific operating system user name,
private project folder, or downstream product path.

Suggested examples:

```text
%LOCALAPPDATA%\CodexNativeClosedLoop\data
```

```powershell
$env:CNCL_ARTIFACT_ROOT = "$env:LOCALAPPDATA\CodexNativeClosedLoop\data"
```

```sh
export CNCL_ARTIFACT_ROOT="$HOME/.local/share/codex-native-closed-loop/data"
```

## Rules

- Keep artifact folders and ZIP payloads outside the repo.
- Keep checksums with the ZIP they verify.
- Do not store nested ZIPs inside handoff packets.
- Do not store secrets, raw auth payloads, raw private logs, raw conversations,
  contact details, provider credentials, or private API payloads.
- Reference artifacts by `<ARTIFACT_ROOT>/packet-name.zip` plus SHA256 in
  future prompts.
