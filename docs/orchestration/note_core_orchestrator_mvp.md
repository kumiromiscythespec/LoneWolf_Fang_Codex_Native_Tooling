# NOTE-Core AI Orchestrator MVP

## Purpose

The NOTE-core AI Orchestrator MVP uses the NOTE group as the core
investigation and review layer. ChatGPT remains the command tower and
integrator, while Codex is used only for minimal, bounded execution after the
scope has already been narrowed.

The MVP is designed to reduce exploratory, unfocused, or repeated Codex usage.
The NOTE group performs scout, review, and risk-sorting work first; ChatGPT
integrates that output into an exact prompt; Codex executes only the approved
public-safe slice; the NOTE group then reviews the Codex result before the
owner decides GO, revise, or stop.

## Non-Goals

This MVP does not approve or implement:

- fully autonomous runtime behavior;
- daemonization;
- deploy automation;
- cloud, API, auth, or billing mutation;
- trading, order, PAPER, or LIVE mutation;
- private repo publication;
- secrets or raw local operational logs in public artifacts.

## Actor Roles

ChatGPT is the command tower. It writes plans, integrates NOTE output, and
prepares the final GO, revise, or stop decision for the owner.

The NOTE group performs SCOUT, PLAN_FREEZE, REVIEW, safety audit, artifact review,
prompt draft review, and slop or risk checking.

Codex performs minimal exact-scope execution only. Codex should receive an
exact target repo, exact file allowlist, explicit forbidden actions, required
checks, and artifact requirements.

The owner provides approval phrases, final branching decisions, and manual
review when required.

## Recommended NOTE Role Map

- NOTE worker slot 01: Diff / scope scout
- NOTE worker slot 02: Plan freeze reviewer
- NOTE worker slot 03: Safety boundary auditor
- NOTE worker slot 04: Artifact / docs reviewer
- NOTE worker slot 05: Slop checker / owner-risk reviewer

These are public-safe role names only. Public docs must not include real local
IPs, NOTE node URLs, device names, credentials, or local configuration.
These slot labels describe review responsibilities only and are not local
hostnames, IP addresses, URLs, or device inventory.

## Standard Workflow

The standard NOTE-first flow is:

1. NOTE_SCOUT
2. CHATGPT_INTEGRATION
3. PLAN_FREEZE
4. CODEX_MINIMAL_EXECUTION
5. NOTE_REVIEW
6. OWNER_DECISION
7. COMMIT_APPROVAL
8. PUSH_APPROVAL
9. PR_APPROVAL
10. MERGE_APPROVAL
11. POST_MERGE_CLOSEOUT
12. LANE_CLOSED

Each approval-gated step must remain separate. A ready plan is not commit
approval. A commit approval is not push approval. A push approval is not PR or
merge approval. A merged PR is not runtime approval.

## Codex Usage Minimization Policy

Codex should not be used for broad investigation. The NOTE group and ChatGPT should
reduce the work into an exact execution packet before Codex is invoked.

Codex should receive a narrow execution packet that lists the exact files it
may edit, the read-only checks it may run, the validations it must record, and
the actions it must not perform. Codex should produce AppData artifacts that
document scope, verification, blockers, unknowns, and one human review point.

Codex must not continue automatically into commit, push, PR, or merge work
without explicit current owner approval for that exact step. The NOTE group should
review Codex results before risky transitions.

## Public/Private/Contracts Boundaries

The boundary reference is:

`docs/orchestration/public_private_contracts_boundary.md`

The public repo stores public-safe docs, schema, tests, fixtures, and lane
evidence. It must not contain private local execution details, raw logs,
credentials, billing records, real local network mappings, or trading/order
details.

The private local orchestrator repo stores local operational scripts,
environment-specific configs, and owner-local behavior. That material must not
be copied into public docs unless it is separately sanitized and approved.

The contracts repo can later store stable shared schemas and contracts after a
separate owner-approved promotion lane. Draft private behavior is not promoted
there automatically.

## NOTE SCOUT / REVIEW Artifact ZIP Contract

A public-safe NOTE SCOUT or REVIEW artifact should include:

- `input_plan.txt`
- per-node result files
- per-node error files when present
- per-node metadata JSON
- `manifest.json`
- `summary.md`
- outer ZIP
- `.sha256` sidecar
- `.sha256.json` sidecar

Private values must be redacted or excluded from public artifacts. Public
artifacts must not include real local IP mappings, NOTE node URLs, credentials,
raw auth, raw local operational logs, API keys, tokens, billing details,
trading/order details, private repo content, production data, or AppData
private artifact contents.

## Codex AppData Packet Contract

A minimal Codex AppData packet should include:

- `manifest.json`
- `safe_summary.md`
- `changed_files.md` or a scope review file
- `test_results.md`
- `blocker_matrix.md`
- `unknowns.md`
- `human_review_one_point.md`
- `NEXT_CODEX_PROMPT.md`
- `checksum_summary.md`
- `CURRENT_PACKET.txt`
- ZIP SHA256 sidecars where practical

The packet should state the target repo, branch, local HEAD, changed-file
scope, tests run, public-safety result, blocker count, final status, and the
single recommended next safe action. It must not include secrets, raw auth,
private payloads, node_modules, `.git`, build cache, nested ZIPs, production DB
dumps, or large unrelated exports.

## STOP_AND_WAIT Triggers

Stop and wait for owner review when any of the following occurs:

- missing rule files;
- unexpected changed files;
- private or contracts repo access is not approved;
- tests fail for an unknown reason;
- artifact integrity mismatch;
- secrets or private data risk;
- runtime, deploy, auth, billing, trading, or order boundary violation;
- GitHub or remote state mismatch before push, PR, or merge;
- owner decision required.

The stop state should preserve evidence, name the blocker, avoid cleanup or
mutation, and provide one safe human decision point.

## First Implementation Status

This document is docs-only. It defines the public-safe NOTE-core AI
Orchestrator MVP boundary and does not implement runtime orchestration,
daemonization, scripts, schemas, tests, private repo behavior, contracts repo
behavior, deploy automation, or API mutation.

## Future Lanes

Future safe lanes may include:

- public schema for NOTE result summary;
- public tests for schema examples;
- private read-only inventory packet;
- private sender script hardening;
- contracts proposal lane;
- runtime or daemon lane only after owner approval and safety review.
