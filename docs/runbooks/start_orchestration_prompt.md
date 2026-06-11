# Start Orchestration Prompt

This guide provides a safe starter prompt for Codex Native Closed Loop work.

The prompt is intentionally conservative. It starts with read-only or docs-only
work, requires a pre-work safety statement, creates external artifacts under
`<ARTIFACT_ROOT>` when needed, and stops when owner approval is required.

## How To Choose The Target Repo

Name exactly one target repo path. Do not let a prompt inspect or edit multiple
repos unless the current owner approval explicitly allows that.

Include:

- target repo path as `<REPO_ROOT>` or another explicit repo path chosen by the
  user;
- project root as `<PROJECT_ROOT>` when the target project is different from
  the template repo;
- artifact root as `<ARTIFACT_ROOT>`;
- project profile as `<PROJECT_PROFILE>`;
- allowed scope;
- forbidden actions;
- expected artifact path when relevant;
- exact files allowed to be touched, if any.

## Required Pre-work Output

Ask Codex to print, before edits:

- assumptions;
- unclear points;
- success criteria;
- target repo path;
- touched files plan;
- must-not-touch files;
- safety boundary confirmation.

If an unclear point affects repo identity, file placement, publicization,
notification, runtime, private API, or approval scope, Codex should stop with:

```text
Stop and Wait - Owner Review Required.
```

## Safe Starter Prompt Template

```text
Before doing any work, read and follow the rule files in <RULE_FILES>. If any
required rule file is missing, report the missing list and stop with:
Stop and Wait - Owner Review Required.

Environment placeholders:
- <REPO_ROOT>: [absolute path to this template repo or the target repo]
- <PROJECT_ROOT>: [absolute path to the user's project root]
- <ARTIFACT_ROOT>: [external artifact folder outside the repo]
- <PROJECT_PROFILE>: [user-owned private profile, kept outside the public repo]
- <RULE_FILES>: [ordered list of rule files for this task]

Task:
[Describe the small read-only or docs-only task.]

Target repo:
<REPO_ROOT>

Allowed scope:
- read-only inspection and/or docs-only edits to these exact paths:
  [list paths]
- artifact creation under:
  <ARTIFACT_ROOT>

Forbidden:
- source code implementation
- Local Orchestrator source placement
- worker launch
- prompt sending automation
- GUI/window close automation
- real worker retirement
- next worker auto-start
- notification implementation or sending
- contact detail collection
- public visibility change
- OpenAI application submission
- deploy
- runtime execution
- PAPER/LIVE/order/cancel/fetch_balance/private API
- backtest/replay/sweep/Monte Carlo
- secrets output
- raw private log dump
- private ChatGPT/Codex conversation dump
- git add
- git commit
- git push
- PR creation or merge

Do not assume private downstream project details such as trading APIs,
Cloudflare, Stripe, D1/R2/KV/Queue, Public Radar, MEXC, or any other
project-specific service unless the user explicitly adds them in
<PROJECT_PROFILE>.

Before editing, print:
- assumptions
- unclear points
- success criteria
- target repo path
- touched files plan
- must-not-touch files
- safety boundary confirmation

Verification:
- git diff --check
- required file existence checks
- required phrase scan
- forbidden dangerous default phrase scan
- secret-like value scan
- artifact manifest/checksum/ZIP validation if an artifact is required
- no owner-local path defaults remain in public setup docs
- no private project profile is copied into the public repo

Final report:
- Japanese owner-facing summary
- changed files and purpose
- validation results
- safety boundary confirmation
- artifact ZIP path and SHA256, if created
```

## Artifact Requirement

When a task creates a handoff artifact, require:

- timestamped artifact folder;
- `manifest.json`;
- `safe_summary.md`;
- changed-files or inventory report;
- validation summary;
- `human_review_one_point.md`;
- `NEXT_CODEX_PROMPT.md`;
- `checksums_sha256.txt`;
- ZIP archive;
- `.zip.sha256`;
- `.zip.sha256.json`.

The next prompt must reference both artifact path and SHA256.

## Final Japanese Owner Summary

For owner-facing handoffs, ask for a concise Japanese report covering:

- what changed;
- changed files or artifacts;
- validation results;
- unresolved questions;
- dangerous changes absent;
- next human decision;
- ZIP path and SHA256 when relevant.

## Safety Wording To Preserve

Starter prompts should preserve:

- would_continue=true is not equivalent to real auto-start permission.
- owner_review_required=false does not mean owner execution approval.
- next_prompt_ready=true only means a text draft exists.
- next_implementer_start_allowed remains false unless separately approved.
- worker_launch_allowed remains false unless separately approved.
- prompt_sending_allowed remains false unless separately approved.
- real_orchestration_allowed remains false unless separately approved.

Closed-loop invariants:

- `worker_session_close_required_after_review_handoff = true`
- `no_next_worker_until_previous_worker_closed = true`
- `previous_worker_retired must be true before START_NEXT_IMPLEMENTER`
- `max_open_implementer_sessions_per_lane = 1`
- `max_open_reviewer_sessions_per_lane = 1`
- `max_total_open_worker_sessions_initial = 2`
- `v0.1 is one-lane-only`
- if close/retire confirmation is missing, stop with:
  `Stop and Wait - Owner Review Required.`
