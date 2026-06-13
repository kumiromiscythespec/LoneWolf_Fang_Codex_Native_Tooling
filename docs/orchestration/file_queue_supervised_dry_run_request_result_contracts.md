<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# File Queue Supervised Dry-run Request Result Contracts

## Purpose

The supervised dry-run request and result contracts define evidence shapes for
a future owner-gated dry-run review packet lane. They are docs, schema, tests,
and fixtures only. They do not implement an executor, run tasks, launch workers,
call APIs, mutate repositories, deploy, trade, bill, or create a runtime path.

## Request Contract

The request schema candidate is:

```text
schema/orchestration/file_queue_supervised_dry_run_request.schema.json
```

A request is valid only when it identifies one reviewed task, one accepted
dry-run validator report, one safe operation class, one approved output root
policy, an owner approval phrase, success criteria, stop conditions, and a
complete prohibited-action baseline.

The only supported operation class is:

```text
APPDATA_PACKET_CREATION_REVIEW_ONLY
```

This operation class means review-packet evidence only. It is not shell command
execution, task execution, helper execution, validator execution, interpreter
execution, runtime workflow, daemon behavior, watcher behavior, API access,
cloud mutation, billing mutation, trading behavior, deployment, or repository
mutation.

## Result Contract

The result schema candidate is:

```text
schema/orchestration/file_queue_supervised_dry_run_result.schema.json
```

A result may record that a review packet was created or that the request failed
closed. In every status, it must preserve these semantics:

- `no_executor_approval=true`
- `no_task_execution=true`
- owner review is required after the dry-run evidence step
- no repetition or next task generation has started
- no runtime or persistent watcher exists

## Failure Model

The contracts are fail-closed. Missing required fields, wrong `schema`, wrong
`build_id`, unexpected fields, unsafe operation classes, missing hashes, bad
hash formats, rejected validator evidence, output paths inside the repository,
and prohibited action claims must all resolve to owner review instead of
execution permission.

## Non-Approval Boundary

These contracts do not approve:

- executor code
- no task execution
- shell command runners
- daemon or watcher behavior
- runtime workflows
- network, private API, or OpenAI API calls
- cloud, billing, or provider mutation
- PAPER, LIVE, order, cancel, or fetch_balance actions
- staging, committing, pushing, fetching, pulling, cleanup, deletion, reset,
  restore, stash, amend, rebase, or history rewrite
