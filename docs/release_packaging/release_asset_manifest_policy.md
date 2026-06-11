# Release Asset Manifest Policy

This document defines the manifest concept for a future GitHub Releases ZIP
asset. It does not create a real manifest and does not create a release asset.

## Future Manifest Fields

A future release asset manifest should include at least:

- release version;
- asset name;
- created timestamp;
- source commit;
- file list;
- exclusions applied;
- SHA256;
- validation result;
- no secrets confirmation;
- no private profiles confirmation;
- no AppData artifacts confirmation;
- owner approval reference.

## Scope

The manifest should describe the public template ZIP only. It must not describe
private project artifacts, local AppData handoff packets, raw logs, raw
ChatGPT/Codex conversation dumps, private profiles, credentials, or private API
payloads.

## Approval Boundary

Creating a manifest policy does not approve release ZIP creation, tag creation,
GitHub Release creation, release asset upload, publicization, OpenAI
application submission, commit, or push.
