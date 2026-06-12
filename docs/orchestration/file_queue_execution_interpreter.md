<!-- BUILD_ID: 20260612_execution_interpreter_docs_v1 -->
# File Queue Execution Interpreter

## Purpose

The file queue execution interpreter defines the first local-only boundary for
turning one already validated task into one safe, owner-approved result packet.
It exists before any runner, consumer, daemon, watcher, queue loop, bridge, or
background automation so the meaning of execution stays narrow and reviewable.

In this MVP, execution means:

- read one execution request JSON file;
- read one already validated task JSON file;
- read one accepted dry-run validator report JSON file;
- verify the declared SHA256 values and expected validator status;
- dispatch only the safe `APPDATA_REVIEW_PACKET_ONLY` task type to the
  `APPDATA_PACKET_CREATION` operation class;
- create one AppData or test-temp review packet and one interpreter result
  report; and
- stop for owner review.

## CLI Usage

```text
node tools/file_queue_execution_interpreter.mjs --request <execution_request_json_path> --out-root <output_root>
```

Both arguments are required in this MVP. Tests must use a temporary output
root. Owner-local runs may use the approved AppData artifact root.

## Execution Request Contract

Requests validate against:

```text
schema/orchestration/file_queue_execution_request.schema.json
```

The request must identify the task, safe task type, operation class, task JSON
path and SHA256, validator report path and SHA256, expected validator status,
expected accepted flag, owner approval phrase, output root policy, success
criteria, stop conditions, and expected final report labels.

The first implementation supports only:

- `task_type`: `APPDATA_REVIEW_PACKET_ONLY`
- `operation_class`: `APPDATA_PACKET_CREATION`

Every other task type or operation class is rejected.

## Execution Result Contract

Results validate against:

```text
schema/orchestration/file_queue_execution_result.schema.json
```

The result records the interpreter build, request id, task id, status, accepted
flag, reasons, operation class, task SHA, validator report SHA, output packet
path, timestamp, safety summary, forbidden actions confirmation, and next
recommended action.

## Dispatch Boundary

The interpreter does not execute arbitrary prose and does not convert task text
into shell commands. It dispatches from a closed task type and operation class
pair to one safe local action. Unknown or unsupported values return a failed
safe result.

## Input Evidence Requirements

A request may proceed only when:

- the task JSON file exists;
- the task JSON SHA256 matches the request;
- the validator report JSON file exists;
- the validator report SHA256 matches the request;
- the validator report status is `VALID_DRY_RUN`;
- the validator report has `accepted` set to `true`;
- the request owner approval phrase is non-empty and matches the task approval
  phrase; and
- the output root is outside the repository and under AppData or a test temp
  root according to policy.

## Output Boundary

The interpreter writes only under the requested output root. The output root
must be outside the repository. For this MVP, valid policies are:

- `APPDATA_OR_TEST_TEMP_ONLY`
- `APPDATA_ONLY`
- `TEST_TEMP_ONLY`

The interpreter must not write to the wrong root or create queue runtime
folders.

## Owner Approval Gate

The owner approval phrase is evidence for the exact requested phase. It does
not authorize commit, push, deployment, runtime execution, provider access,
private API access, UI automation, billing mutation, trading behavior, or any
other later step.

## Failure And Abuse Model

The interpreter exits non-zero and writes a safe failure report when possible
for invalid JSON, missing required fields, unsupported task types, unsupported
operation classes, SHA mismatch, rejected validator reports, output boundary
violations, or any failed safety check.

It deliberately rejects attempts to smuggle shell commands, queue loops,
workers, provider access, deployment, private APIs, billing, trading, UI
automation, or background continuation through task text.

## No Background Run Guarantee

This MVP has:

- no daemon;
- no watcher;
- no consumer;
- no queue loop;
- no polling;
- no scheduler;
- no automatic next task; and
- no background process.

One command handles one request and stops.

## Deliberately Not Implemented

The interpreter deliberately does not:

- run the task authoring helper;
- run the dry-run validator;
- launch workers;
- consume queue folders;
- run Codex CLI;
- call OpenAI APIs;
- drive ChatGPT, Codex, browser, or UI automation;
- access cookies, sessions, auth, providers, billing, or private APIs;
- deploy;
- perform PAPER, LIVE, order, cancel, or fetch_balance behavior;
- mutate repository files; or
- stage, commit, push, fetch, pull, reset, restore, clean, stash, or force push.

## Future Expansion Boundaries

Future task types, operation classes, queue consumers, result linkage, and
multi-task scheduling require separate design, approval, implementation, and
review phases. They must not be added silently to this MVP.
