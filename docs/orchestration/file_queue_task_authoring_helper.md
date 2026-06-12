<!-- BUILD_ID: 20260612_file_queue_task_authoring_helper_docs_v1 -->
# File Queue Task Authoring Helper

## Purpose

The file queue task authoring helper is a local, static drafting tool for
turning an owner-approved authoring request into a reviewable file queue task
draft. It exists before any runner or consumer so a human can inspect the task
shape, allowlist, stop conditions, artifact expectations, and safety boundary
before any later validation or execution-like phase is considered.

This helper is not a daemon, watcher, queue runner, worker, browser bridge,
Codex UI automation tool, OpenAI API client, provider client, deploy tool, or
runtime execution path.

## CLI Usage

```text
node tools/file_queue_task_authoring_helper.mjs --request <author_request_json_path> --out-root <output_root>
```

The MVP requires both arguments. The output root must be outside the repository
and must match the request's AppData or test-temp output policy. Missing
arguments, invalid JSON, unsafe task types, missing owner approval, missing stop
conditions, or output-root policy failures return a non-zero exit code.

## Request Contract

Authoring requests must validate against:

```text
schema/orchestration/file_queue_task_author_request.schema.json
```

The request names the draft task, its safe task type, the static file queue
mode, the file allowlist, owner approval phrase, success criteria, stop
conditions, artifact requirements, final report labels, and output-root policy.

Supported safe task types are:

- `APPDATA_REVIEW_PACKET_ONLY`
- `APPROVAL_PACKET_ONLY`
- `DOCS_SCHEMA_STATIC_TESTS_ONLY`
- `READ_ONLY_INVENTORY_ONLY`
- `PUSH_APPROVAL_PACKET_ONLY`
- `PUSH_EXECUTION_ONLY`

Forbidden or unsupported task types include:

- `RUNTIME_EXECUTION`
- `LIVE_OR_PAPER_TRADING`
- `PRIVATE_API`
- `DEPLOY`
- `PROVIDER_MUTATION`
- `FILE_QUEUE_CONSUMER`
- `CODEX_CLI_BRIDGE`
- `UI_BRIDGE`
- `BACKGROUND_AUTOMATION`

## Output Contract

For a valid safe request, the helper writes exactly one generated task JSON, one
Markdown preview, and one author output report under the provided output root.

The author output report must validate against:

```text
schema/orchestration/file_queue_task_author_output.schema.json
```

For invalid requests, the helper writes a safe failure report only when an
output root is available and outside the repository. It does not write a task
draft or preview for rejected requests.

## Generated Task Contract

The generated task JSON must validate against:

```text
schema/orchestration/file_queue_task.schema.json
```

The generated task includes the full file queue forbidden-action baseline,
non-empty success criteria, non-empty stop conditions, an owner approval phrase,
artifact requirements, final report labels, and an allowlist. It does not grant
hidden continuation, runtime permission, worker launch permission, provider
permission, deploy permission, private API permission, or trading permission.

## Safety Boundaries

The helper deliberately does not:

- run the dry-run validator
- execute the generated task
- run shell commands from the request
- create queue runtime folders
- launch a worker, daemon, watcher, or queue consumer
- call browser, Codex UI, ChatGPT UI, OpenAI API, provider API, private API,
  billing API, deploy API, or GitHub settings APIs
- perform PAPER, LIVE, order, cancel, or fetch_balance behavior
- read or output secrets, credentials, raw auth, billing, or private payloads
- stage, commit, push, fetch, pull, reset, restore, clean, stash, or force push

## Validation Flow

A successful authoring run only creates a draft. The next safe validation step
is a separate later phase that may run the existing dry-run validator only after
owner approval. Human review remains the gate between authoring and validation.

## Future Expansion Boundaries

Future expansion may add more request fields, richer preview text, or additional
static checks. It must not add a runner, consumer, bridge, background process,
provider integration, private API path, browser automation path, deployment
path, or hidden execution path without a separate explicit owner approval.
