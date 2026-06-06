# First-time Setup

This runbook helps a first-time user start with the Codex Native Closed Loop
tooling repo safely.

It is conceptual setup guidance. It does not require network operations,
runtime execution, worker launch, prompt sending automation, deploy, private API
access, or notification sending.

## Prerequisites

- A local copy of the repository.
- A human owner who can approve or reject gated actions.
- A clear target repo or documentation task.
- A safe place for external artifacts:
  `C:\Users\yu_ki\AppData\Local\LoneWolfFang\data`
- A habit of stopping when scope, approval, or identity is unclear.

## Read The Rules First

Before editing or asking Codex to act, read:

- `CLAUDE.md`
- `CODEX_RULES.md`
- `LONEWOLF_FANG_SAFETY_BOUNDARY.md`
- `README.md`
- `docs/safety/file_placement_policy.md`
- `docs/safety/artifact_handoff_policy.md`
- `docs/owner/owner_approval_gate.md`

If a required rule file is missing, stop with:

```text
Stop and Wait - Owner Review Required.
```

## Confirm The Work Mode

Start in one of these safe modes:

- read-only inventory;
- docs-only planning;
- docs-only implementation after explicit approval;
- review-only packet generation;
- approval packet generation.

Do not start with runtime orchestration, worker launch, prompt sending
automation, GUI/window close automation, deploy, private API access, trading,
backtest, replay, sweep, Monte Carlo, notification sending, commit, or push.

## Place Files Deliberately

Use [../safety/file_placement_policy.md](../safety/file_placement_policy.md)
before creating files.

General placement:

- docs go under `docs/`;
- owner gates go under `docs/owner/`;
- safety policies go under `docs/safety/`;
- runbooks go under `docs/runbooks/`;
- evidence-chain notes go under `docs/evidence_chain/`;
- schemas go under `schema/`;
- synthetic fixtures go under `fixtures/`;
- source code goes under `src/` only after explicit source placement approval;
- tests go under `tests/`;
- metadata-only artifact indexes may go under `artifacts_index/`.

Artifacts themselves stay outside the repo in AppData.

## Create AppData Artifacts

When a handoff artifact is required, create a timestamped folder under:

```text
C:\Users\yu_ki\AppData\Local\LoneWolfFang\data
```

Typical contents:

- `manifest.json`
- `safe_summary.md`
- a changed-files or inventory report
- a validation summary
- `human_review_one_point.md`
- `NEXT_CODEX_PROMPT.md`
- `checksums_sha256.txt`
- a ZIP archive
- `.zip.sha256`
- `.zip.sha256.json`

The next phase should verify the ZIP SHA256 before using the artifact.

## Start With A Safe Inventory Packet

A good first task asks Codex to:

- read the rule files;
- state assumptions and unclear points;
- define success criteria;
- list touched files and must-not-touch files;
- confirm safety boundaries;
- inspect only the approved paths;
- create an AppData artifact;
- stop for owner review.

Use [start_orchestration_prompt.md](start_orchestration_prompt.md) for a safe
starter prompt template.

## Adapt This Repo Without Copying Private Data

When adapting the template to another project:

- replace local paths with project-appropriate placeholders;
- use synthetic examples;
- do not copy private logs;
- do not copy raw ChatGPT or Codex conversations;
- do not copy secrets, tokens, account data, order IDs, or private API payloads;
- do not include screenshots with private information;
- keep owner approval gates explicit.

## Safe Stop

Stop with:

```text
Stop and Wait - Owner Review Required.
```

when:

- a required rule file is missing;
- repo identity is unclear;
- worktree state is unexpected;
- an approval phrase is missing or ambiguous;
- a command would cross the approved scope;
- a secret or private payload would need to be printed;
- worker closure or retirement cannot be verified;
- the next action would be commit, push, deploy, runtime, private API, trading,
  notification sending, or publicization without explicit approval.

## What Not To Automate

Do not automate by default:

- worker launch;
- prompt sending;
- GUI/window close;
- real worker retirement;
- next worker auto-start;
- deploy;
- notification sending;
- email/SMS/app notification integration;
- contact detail collection;
- PAPER/LIVE/order/private API;
- backtest/replay/sweep/Monte Carlo;
- commit or push.
