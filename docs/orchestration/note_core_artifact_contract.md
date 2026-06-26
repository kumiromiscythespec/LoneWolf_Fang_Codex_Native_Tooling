<!-- BUILD_ID: NOTE_CORE_ARTIFACT_CONTRACT_SCHEMA_TESTS_20260626 -->

# NOTE-Core Artifact Contract

## Purpose

The NOTE-Core artifact contract defines a public-safe summary shape for NOTE
SCOUT and NOTE REVIEW evidence artifacts. It reduces format drift before
ChatGPT integrates NOTE output into a narrow, owner-gated Codex task.

Artifact summaries are evidence only. They do not authorize runtime behavior.
They also do not authorize deployment, cloud or API mutation, account or payment
mutation, market action behavior, private repo access, contracts repo promotion,
source edits, commit, push, pull request creation, merge, or branch deletion.

## Roles

The NOTE group scouts and reviews. ChatGPT integrates the results. Codex
receives only narrow owner-approved tasks. The owner remains the gate for
commit, push, pull request, merge, and any risky action.

## Required Concepts

A NOTE-Core artifact summary records:

- lane name;
- artifact kind;
- artifact status;
- verdict;
- recommended next action;
- blocker count;
- result count;
- error count;
- checksum sidecar presence;
- forbidden action flags;
- one human review point.

## Public Safety

Public summaries must use synthetic or sanitized values. They must not include:

- real local network mappings;
- real NOTE node endpoints;
- credentials;
- key material;
- authentication details;
- account or payment details;
- market action behavior;
- raw local logs;
- private implementation details;
- copied contracts repo content;
- private artifact contents;
- personal data;
- production data.

## Boundary

The safe outcome of this contract is a reviewable evidence record. A safe
artifact summary can recommend owner review or preparation of a bounded Codex
prompt, but it cannot become GO for runtime, deploy, API use, private access,
contracts promotion, commit, push, pull request, merge, or any other risky
transition.
