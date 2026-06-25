<!-- BUILD_ID: 20260623_public_private_contracts_boundary_docs_only_v1 -->

# Public, Private, And Contracts Boundary

## Purpose

This document defines the public/private/contracts boundary for LoneWolf Fang
Codex Native Tooling work.

It is a public-safe guide for repo separation, lane boundaries, artifact
expectations, and owner approval gates. It does not expose private local
orchestrator implementation details, local NOTE configuration, raw logs,
secrets, API credentials, billing details, or trading/order details.

## Repository Roles

The three repo roles are:

- PUBLIC repo: `LoneWolf_Fang_Codex_Native_Tooling`
- PRIVATE local orchestrator repo:
  `LoneWolf_Fang_local_orchestrator_private`
- Shared contracts repo: `LoneWolf_Fang_orchestrator_contracts`

These names may appear in public docs as boundary examples. Public work must
not read from or copy private implementation details from the private repo or
the contracts repo unless a separate owner approval explicitly allows that
specific action.

## PUBLIC Repo Responsibilities

The PUBLIC repo contains sanitized, reviewable material that is safe for public
or OSS review. It may contain:

- public documentation;
- public-safe schemas;
- public-safe tests;
- synthetic fixtures;
- safety-boundary examples;
- generic lane and artifact rules.

The PUBLIC repo must not contain private local execution details, real local
network mappings, raw operational logs, credentials, personal environment
values, billing records, or trading/order details.

## PRIVATE Local Orchestrator Repo Responsibilities

The PRIVATE local orchestrator repo is for owner-local orchestration behavior,
private local machine details, local NOTE wiring, local runner scripts, and
environment-specific operating notes.

Private operational detail belongs there, not in the PUBLIC repo. Public docs
may refer to the private repo as a boundary example, but public docs must not
copy its implementation, logs, local configuration, or operational secrets.

## Shared Contracts Repo Responsibilities

The shared contracts repo is for stable, sanitized contracts that are intended
to be reused across lanes or repos.

Only contracts that have been reviewed, made public-safe or share-safe, and
promoted through an explicit owner-approved process should move into the shared
contracts repo. Draft private behavior should not be copied there directly.

## Lane Definition

A lane is a goal-bounded work stream. It is not merely a Git branch.

A lane may use a branch, PR, artifact ZIP, tests, and closeout packet, but those
items are lane evidence and workflow mechanics. The lane itself is defined by:

- scope;
- exact allowlist;
- must-not-touch list;
- success criteria;
- tests or checks;
- artifact ZIP;
- human decision point;
- closeout status.

## PUBLIC Lane Rules

A PUBLIC lane may edit only public-safe files explicitly allowed by the current
owner prompt.

PUBLIC lane work should be sanitized, reviewable, and easy to inspect. It may
describe boundaries and safe examples, but it must not reveal private local
implementation detail or operational secrets.

PUBLIC lane output should use synthetic examples, generic placeholders, and
owner-gated language. READY is not GO.

## PRIVATE Lane Rules

A PRIVATE lane may handle owner-local operational detail only when the current
owner prompt explicitly approves that private scope.

PRIVATE lane material must not be copied into public docs unless it has been
sanitized, reviewed, and separately approved for public use.

Private local details include local runner behavior, local NOTE configuration,
raw local logs, local PowerShell operational details, real machine paths beyond
approved boundary examples, and personal environment information.

## CONTRACTS Lane Rules

A CONTRACTS lane is for stable shared contracts, not for exploratory private
implementation.

Before material is promoted into contracts, it should be:

- stable enough to share;
- sanitized;
- free of private logs and secrets;
- covered by relevant docs, schema, tests, or fixtures where appropriate;
- approved by the owner for contracts-lane work.

## BRIDGE Lane Rules

A BRIDGE lane coordinates between public, private, and contracts boundaries.

Bridge work should create plans, reviews, mapping documents, or promotion
packets. It should not silently copy content across repos. Any cross-repo
movement must have an explicit source, destination, allowlist, checks, and
owner approval.

## What May Be Included In Public Docs, Schema, Tests, And Fixtures

Public material may include:

- sanitized architecture summaries;
- boundary rules;
- generic repo role descriptions;
- safe state names;
- safe lane examples;
- synthetic JSON fixtures;
- public-safe validation rules;
- non-operational examples;
- artifact checklist templates.

Public material should be understandable without private repo access.

## What Must Stay Private

The following must stay out of public docs, schema, tests, and fixtures:

- real local IP mappings;
- real NOTE node configurations;
- raw local logs;
- API keys, tokens, credentials, or auth payloads;
- billing details;
- trading/order/PAPER/LIVE details;
- AppData artifact contents;
- private repo implementation details;
- local PowerShell operational secrets;
- personal environment secrets;
- production DB dumps;
- private cloud or queue mutation details.

## Promotion Rules From Private/Public Into Contracts

Promotion into shared contracts requires a separate owner-approved lane.

Promotion should:

- name the exact source files;
- name the exact destination files;
- explain why the contract is stable enough to share;
- remove private operational detail;
- replace real examples with synthetic examples;
- run relevant checks;
- create an artifact ZIP;
- include one human decision point.

No private-to-contracts or public-to-contracts promotion is implied by a docs
lane.

## Codex Touch Boundaries

Codex must follow the current owner prompt. Each task should state:

- target repo;
- exact file allowlist;
- forbidden repos and files;
- allowed commands;
- forbidden commands;
- tests or checks;
- artifact requirements;
- one human decision point.

Codex must not read or edit private or contracts repos unless the current owner
prompt explicitly approves that exact action. Codex must not infer permission
from a previous lane.

## Artifact ZIP Rules

Artifact ZIPs should be created outside the repo under the owner-approved
artifact root. They should include public-safe summaries and verification
evidence, such as:

- `manifest.json`;
- `safe_summary.md`;
- changed-file list;
- test results;
- blocker matrix;
- safety-boundary review;
- `human_review_one_point.md`;
- `NEXT_CODEX_PROMPT.md`;
- checksum summary;
- SHA256 sidecars.

Artifact ZIPs must not include secrets, raw auth, API keys, node_modules,
`.git`, build cache, nested ZIPs, large exports, raw private logs, billing data,
or production DB dumps.

## Safe Public Wording Examples

Safe public wording:

- "The private local orchestrator repo owns local operational behavior."
- "The public repo records sanitized docs, schemas, tests, and fixtures."
- "The contracts repo receives only stable, sanitized shared contracts."
- "A lane is a goal-bounded work stream with scope, checks, artifacts, and one
  human decision point."
- "READY is not GO; owner approval remains mandatory."

## Forbidden Public Content Examples

Do not publish wording that includes:

- real local network addresses or machine maps;
- raw NOTE logs;
- local runner secrets;
- private implementation excerpts;
- API tokens or auth payloads;
- billing account data;
- trading/order instructions;
- production mutation instructions;
- AppData artifact contents.

## Owner Approval Gates

Owner approval is required before:

- reading a private repo;
- reading a contracts repo;
- moving material between repos;
- committing;
- pushing;
- opening or merging a PR;
- changing visibility;
- deploying;
- running runtime workflows;
- calling private APIs;
- mutating cloud, auth, billing, or trading state.

Approval must be current, exact, and scoped to the task. Broad continuation
phrases do not authorize high-risk work.

## Closeout Expectations

Each lane should close with:

- final changed-file scope;
- tests and checks run;
- artifact ZIP path;
- ZIP SHA256;
- forbidden-action confirmation;
- blocker count;
- final status;
- one human decision point.

For public/private/contracts boundary work, closeout should also state whether
the private repo was read, whether the contracts repo was read, and whether any
source files outside the allowlist were edited.
