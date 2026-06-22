# LWF NOTE-NETWORK Local Orchestrator Usage

## Purpose

This document explains the owner-facing LWF NOTE-NETWORK local orchestrator
lane. Its purpose is to reduce Codex token use and improve review quality by
using local NOTE notebooks as preprocessing workers before and after bounded
Codex tasks.

This is documentation for a static/local orchestration contract. It is not
runtime automation, not worker launch approval, and not permission to modify
`C:\LWF_NoteNetwork`.

## Current Status

The local orchestrator direction is documented as a bounded, owner-gated flow.
It relies on explicit owner handoffs, artifact ZIPs, SHA sidecars, test results,
and review evidence. READY is not GO, and owner review remains mandatory before
each next action.

## Public Version Deferred

The public-version orchestrator remains deferred. This lane focuses on the
owner-local LWF NOTE-NETWORK workflow first and does not approve public
submission, GitHub visibility changes, releases, release assets, GitHub
Sponsors, or `FUNDING.yml` changes.

## Local LWF NOTE-NETWORK Priority

The priority is the 5-notebook LWF NOTE-NETWORK loop:

- NOTE-01
- NOTE-02
- NOTE-03
- NOTE-04
- NOTE-05

These NOTE nodes are local preprocessing workers. They are not the final source
of truth, and their output is not proof by itself.

## High-Level Loop

The intended human-controlled loop is:

1. ChatGPT writes a SCOUT plan.
2. The owner writes it to `C:\LWF_NoteNetwork\inputs\scout_plan.txt`.
3. `run-scout.ps1` sends it to NOTE-01 through NOTE-05.
4. NOTE outputs are merged and compacted.
5. The owner gives the merged/compact SCOUT result to ChatGPT.
6. ChatGPT creates a bounded Codex prompt.
7. Codex performs limited execution, self-audit, artifact ZIP creation, and one
   owner decision point.
8. ChatGPT writes a REVIEW plan.
9. The owner writes the REVIEW plan to
   `C:\LWF_NoteNetwork\inputs\scout_plan.txt`.
10. `run-scout.ps1` sends REVIEW to NOTE-01 through NOTE-05.
11. NOTE outputs are merged and compacted.
12. ChatGPT decides PASS, repair, stop, or next Codex prompt.

SCOUT complete is not Codex execution approval. REVIEW complete is not push
approval.

## NOTE-01 Through NOTE-05 Roles

The NOTE notebooks may be used as parallel local preprocessing viewpoints:

- NOTE-01: first-pass task and scope reading.
- NOTE-02: safety boundary and forbidden-action review.
- NOTE-03: evidence, artifact, and test expectation review.
- NOTE-04: implementation-risk and missing-context review.
- NOTE-05: compact owner-facing synthesis and next-decision support.

These role labels describe usage expectations only. This repo lane does not
launch NOTE nodes, call Ollama, or execute `run-scout.ps1`.

## Responsibility Boundary: ChatGPT / NOTE / Codex / Owner

ChatGPT plans, reviews, summarizes, and creates bounded prompts. ChatGPT final
review must use artifacts, diffs, tests, manifests, or connector-readable repo
evidence where available.

NOTE nodes preprocess local context. NOTE output may help organize thinking,
but NOTE output alone is not proof.

Codex performs only the exact bounded task that the owner separately approves.
Codex must create artifact ZIPs and SHA sidecars for handoff evidence.

The owner makes the final one-point decision for GO, repair, stop, push, PR,
merge, deploy, runtime, public submission, or any other gated action.

## Evidence And Artifact Requirements

Every Codex handoff in this lane should include:

- a timestamped AppData artifact directory;
- an artifact ZIP;
- `.zip.sha256` and `.zip.sha256.json` sidecars;
- `manifest.json`;
- `safe_summary.md`;
- changed-file or scope confirmation;
- test summary;
- forbidden-action confirmation;
- `human_review_one_point.md`;
- `NEXT_CODEX_PROMPT.md`.

ChatGPT final review should prefer direct evidence: artifacts, diffs, tests,
manifests, and connector-readable repo files where available.

## Codex Cloud Unpushed Working Tree Limitation

Codex cloud unpushed working trees are not assumed readable by ChatGPT. If
ChatGPT needs to review Codex work, Codex must provide artifacts, diffs, tests,
manifests, or connector-readable repo evidence.

## Owner One-Point Decision Rule

Each lane should end with exactly one owner decision point. The next step must
be explicit and narrow. Approval for one action does not imply approval for any
other action.

Examples:

- implementation review approval is not commit approval;
- commit approval is not push approval;
- push is not PR;
- push is not deploy;
- REVIEW complete is not push approval;
- READY is not GO.

## Forbidden Actions

This README usage docs lane does not approve:

- runtime automation;
- direct NOTE/Ollama execution by this repo lane;
- `C:\LWF_NoteNetwork` mutation;
- OpenAI API calls;
- private API calls;
- Queue, cloud, API, billing, auth, or trading mutation;
- staging, commit, amend, push, or force push;
- branch creation, checkout, switch, fetch, or pull;
- PR creation, merge, deploy, public submission, or external review submission;
- GitHub visibility changes;
- release creation or release asset upload;
- GitHub Sponsors application;
- `FUNDING.yml` creation or edit;
- cleanup, delete, reset, restore, stash, rebase, or history rewrite;
- daemon, watcher, UI automation, package install, dependency mutation, or broad
  unrelated refactor.

## Not Implemented Yet

The following are not implemented or not approved by this documentation:

- runtime orchestration;
- automatic next worker start;
- NOTE/Ollama execution from this repo lane;
- direct `C:\LWF_NoteNetwork` modification;
- OpenAI/private API integration;
- cloud queue or billing/auth/trading integration;
- PR, merge, deploy, release, public submission, or public-version orchestrator
  flow.

## Safe Next Steps

Safe continuation should remain owner-gated and evidence-first:

1. Create an AppData-only implementation review packet.
2. Verify the exact changed-file scope.
3. Verify focused and broad static tests.
4. Confirm no forbidden actions occurred.
5. Ask the owner for exactly one next decision.

The recommended next lane after this implementation is an AppData-only
implementation review packet, not staging, commit, push, PR, merge, deploy,
runtime automation, NOTE/Ollama execution, or public submission.
