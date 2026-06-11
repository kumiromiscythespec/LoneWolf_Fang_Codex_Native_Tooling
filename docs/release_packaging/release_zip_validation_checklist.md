# Release ZIP Validation Checklist

Before any real release asset is created, verify:

- clean git status or separately accepted release candidate state;
- public-safe file list;
- no private profiles;
- no AppData artifacts;
- no nested ZIPs;
- no `.git`;
- no `node_modules`;
- no secrets/tokens/credentials;
- no contact details;
- no raw private logs;
- no raw ChatGPT/Codex dumps;
- no owner-local required defaults;
- public template/private project separation preserved;
- archive opens cleanly;
- SHA256 sidecar created;
- release asset manifest created;
- release notes prepared;
- owner final approval before tag/release/upload.

## Separate Approval Boundary

Future ZIP dry-run is separate. Future tag creation is separate. Future GitHub
Release creation is separate. Future release asset upload is separate. Future
public visibility change is separate. Future OpenAI application submission is
separate.

No release ZIP exists yet. No tag exists from this phase. No GitHub Release
exists from this phase. No release asset is uploaded from this phase.
