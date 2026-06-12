<!-- BUILD_ID: 20260612_file_queue_contract_v1 -->
# File Queue Contract

## Purpose

The file queue contract defines a static, reviewable handoff shape for Codex Native orchestration work. It describes what a queued task may request, what a completed result packet must report, and what artifact evidence must exist before a human or reviewer decides the next step.

This contract is not a queue runner, daemon, watcher, worker, browser bridge, or automation agent. It is a docs/schema/fixture/static-test baseline for local validation only.

## Non-Runtime Nature

The queue files are inert data. Reading or validating them must not launch a worker, execute Codex CLI, send prompts, drive ChatGPT or Codex UI, call OpenAI APIs, call provider APIs, deploy, trade, mutate billing, or touch private credentials.

Static tests may load schemas and fixture JSON from disk. They must not start background processes, run a queue runner, mutate files, or use network access.

## Task File Contract

A task file represents one bounded unit of owner-approved work. It must include:

- `schema`
- `task_id`
- `title`
- `target_repo`
- `mode`
- `allowed_files`
- `forbidden_actions`
- `success_criteria`
- `stop_conditions`
- `owner_approval_phrase`
- `artifact_requirements`
- `expected_final_report_labels`

The `mode` value must be one of the safe static modes defined by the schema. It must not represent LIVE, PAPER, order placement, private API access, runtime execution, deploy, worker launch, or real orchestration.

The `allowed_files` list is an allowlist, not a suggestion. Any future implementation that needs a path outside it must stop for owner review.

The `forbidden_actions` list must include the complete safety baseline:

- `worker_launch`
- `real_orchestration`
- `browser_ui_automation`
- `chatgpt_ui_automation`
- `codex_ui_automation`
- `runtime_execution`
- `deploy`
- `paper_live_order`
- `cancel_order`
- `fetch_balance`
- `private_api`
- `provider_mutation`
- `billing_mutation`
- `secrets_output`
- `reset_restore_clean`
- `force_push`

## Result Packet Contract

A result packet reports what happened after an approved static task. It must include:

- `schema`
- `task_id`
- `status`
- `changed_summary`
- `changed_files`
- `tests`
- `blocker_matrix`
- `forbidden_actions_confirmation`
- `artifact_zip_path`
- `sha256`
- `human_review_one_point`
- `next_recommended_task`

Allowed statuses are:

- `DONE`
- `BLOCKED`
- `STOP_OWNER_REVIEW_REQUIRED`
- `FAILED_SAFE`

The result packet must include an artifact ZIP path and a SHA256 value. A result without artifact hash evidence is incomplete.

## Artifact Expectations

Artifacts should be written outside the repo under the user-selected artifact root. A complete artifact should contain a manifest, safe summary, changed file list, test summary, validation summary, checksum summary, human review point, and next prompt when relevant.

Artifacts must not include secrets, API keys, raw auth payloads, raw private payloads, billing payloads, provider credentials, `.git`, `node_modules`, build cache, nested ZIP files, or production database dumps.

## Owner Review Expectations

The owner approval phrase is evidence that the current task is bounded. It does not authorize any other action unless the prompt says so explicitly.

If a future task needs runtime execution, real orchestration, deployment, browser or UI automation, provider access, private API access, billing mutation, cleanup, reset, restore, git clean, force push, or a path outside the allowlist, the correct result is `STOP_OWNER_REVIEW_REQUIRED`.

## Default Safety Posture

The default is:

- no UI automation
- no worker launch
- no real orchestration
- no hidden runtime execution
- no network or provider API calls
- no deploy
- no PAPER or LIVE trading
- no order, cancel, or fetch_balance action
- no secrets or raw private payload output
- no reset, restore, git clean, cleanup, or force push
