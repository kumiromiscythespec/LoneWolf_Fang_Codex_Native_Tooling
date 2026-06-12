<!-- BUILD_ID: 20260612_file_queue_dry_run_validator_v1 -->
# File Queue Dry-Run Validator

## Purpose

The file queue dry-run validator is a local static validation tool for one file
queue task JSON file. It checks whether the task shape, safety fields, stop
conditions, artifact requirements, and owner review fields are present before a
human decides whether any later work should proceed.

This validator is not a queue runner, daemon, watcher, worker, browser bridge,
Codex automation layer, OpenAI API client, provider client, deploy hook, or
task executor.

## Non-Runtime Nature

The validator reads inert data from disk and writes one validation report JSON
file under an explicit output root or the configured local artifact root. It
does not execute task instructions, run shell commands from task files, start
background processes, watch folders, mutate repository files, stage, commit,
push, fetch, pull, deploy, trade, access private APIs, access browser sessions,
or touch secrets.

## CLI Usage

```text
node tools/file_queue_dry_run_validator.mjs --task <task_json_path> --out-root <output_root>
```

The `--task` argument is required. The `--out-root` argument is optional. When
omitted on Windows, the validator uses `%LOCALAPPDATA%\LoneWolfFang\data` when
`LOCALAPPDATA` is available, otherwise the owner-local AppData path. On
non-Windows environments, it uses `LOCALAPPDATA` when available and otherwise a
safe temporary fallback.

Tests must always pass a temporary output root.

## Input Task Contract

The input task must conform to `schema/orchestration/file_queue_task.schema.json`
and must include:

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

The task mode must be one of the safe static modes from the existing task
schema. The forbidden action list must include the full file queue safety
baseline.

## Output Validation Report Packet

The validator writes exactly one validation report JSON file under the selected
output root. The report conforms to
`schema/orchestration/file_queue_validation_report.schema.json` and records:

- task identity
- accepted or rejected status
- reasons
- schema validation result
- forbidden action validation result
- stop condition validation result
- artifact requirement validation result
- owner review validation result
- safety gate validation result
- next recommended action

## Exit Codes

- `0`: the task is valid for dry-run owner review.
- `1`: the task is invalid or unsafe, and a report was written when possible.
- `2`: CLI usage failed before a task could be inspected.

## Safety Boundaries

The validator refuses work that omits required safety fields, requests unsafe
modes, lacks complete forbidden action coverage, omits stop conditions, omits
artifact requirements, or omits owner review evidence.

It also refuses tasks that try to point allowed files at runtime, deployment,
provider, browser, secret, billing, order, live, paper, worker, daemon, watcher,
or private API surfaces.

## Deliberately Not Implemented

The validator deliberately does not implement:

- queue watching
- daemon behavior
- worker launch
- real orchestration
- Codex CLI execution
- OpenAI API calls
- ChatGPT, Codex, or browser UI automation
- provider access
- deploy hooks
- repo mutation
- git operations
- PAPER or LIVE trading
- order placement, cancel, fetch_balance, or private API behavior
- secrets, raw auth, billing, or private API payload output

## Owner Review Expectation

A passing report means only that the task file is structurally safe enough for
owner review. It is not approval to execute the task. Any future implementation,
commit, push, deployment, runtime behavior, private API access, billing action,
or trading action requires a separate explicit owner approval.

## Future Expansion Boundaries

Future expansion must remain owner-gated. If validation needs queue polling,
folder watching, background scheduling, Codex execution, browser automation,
provider calls, deployment, repo mutation outside an approved allowlist, or any
new runtime surface, the validator must stop for owner review instead of growing
silently.
