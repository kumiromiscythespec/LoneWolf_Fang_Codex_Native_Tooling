# File Placement Policy

This policy explains where files belong in the Codex Native Closed Loop tooling
repo and what must remain outside the repo.

## General Rule

Place the smallest necessary file in the narrowest appropriate directory. Do not
place private data, raw logs, secrets, or generated handoff ZIPs in the repo.

## Approved Placement Areas

- `README.md`: repo-top orientation, quick start, safety defaults, and links.
- `docs/`: workflow documentation.
- `docs/owner/`: owner approval gates and decision rules.
- `docs/safety/`: safety policies, file placement, artifact handoff, and secret
  handling.
- `docs/runbooks/`: first-time setup and safe starter prompts.
- `docs/evidence_chain/`: future SHA256 handoff and evidence-chain notes.
- `schema/`: schemas for approved status files or synthetic artifacts.
- `fixtures/`: synthetic, non-secret test fixtures only.
- `src/`: source code only after explicit owner approval for source placement.
- `src/local_orchestrator/`: local orchestrator source only after explicit
  placement approval.
- `tests/`: tests for approved docs, schemas, fixtures, or source.
- `artifacts_index/`: metadata-only references to external artifacts.

## What Must Stay Outside The Repo

Store handoff artifacts under:

```text
C:\Users\yu_ki\AppData\Local\LoneWolfFang\data
```

Do not store these in the repo:

- artifact ZIP payloads;
- `.zip.sha256` sidecars for handoff ZIPs;
- generated packet folders;
- secrets;
- API keys;
- tokens;
- provider credentials;
- raw auth payloads;
- private API payloads;
- private exchange account data;
- order IDs or account identifiers that are not safe to disclose;
- raw private logs;
- private ChatGPT/Codex conversation dumps;
- production DB dumps;
- screenshots with private information;
- `node_modules`;
- `.git`;
- build cache;
- large exports;
- nested ZIP files.

## Source Code Boundary

This docs-only phase does not approve source code implementation.

Do not create:

- Local Orchestrator implementation files;
- worker launch code;
- prompt sending automation;
- GUI/window automation;
- notification integration code;
- deploy tooling;
- runtime/private API/trading code;
- backtest/replay/sweep/Monte Carlo code.

Source placement requires a later explicit owner approval phrase.

## Publicization Readiness

Before publicization or application drafting, check:

- no secrets or secret-like values;
- no raw private payloads;
- no private local logs;
- no private conversations;
- no repo-internal artifact ZIPs;
- no generated caches or large exports;
- no unsafe automation wording that implies default execution;
- no private Windows paths that should be generalized for public readers.

If any item is uncertain, stop with:

```text
Stop and Wait - Owner Review Required.
```
