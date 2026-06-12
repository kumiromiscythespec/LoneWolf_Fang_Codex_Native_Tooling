<!-- BUILD_ID: 20260612_fasttrack_window6_user_runbook_docs_v0 -->
# Codex Native Known Boundaries After Fast-Track

## Purpose

This boundary note defines what the Codex Native Closed Loop v0.1+ fast-track
MVP still does not do after documentation, ledger, consumer, coordinator, and
safety guard lanes complete.

The safe default remains docs-only, schema-tests-only, static validation only,
artifact handoff only, and owner-reviewed AppData evidence.

## Boundary Matrix

| Surface | Allowed after fast-track | Still not allowed |
| --- | --- | --- |
| Task authoring | Draft one safe task for review | Runtime execution or hidden continuation |
| Dry-run validation | Static validation of one task | Running the task or granting approval |
| Execution interpreter | Owner-approved AppData packet creation for the supported operation class | Arbitrary command execution, helper or validator chaining, provider calls |
| Linkage contracts | Record paths, hashes, states, and owner decision evidence | Treating linkage as a permission token |
| AppData ledger writer | Append owner-local evidence when approved | Repo mutation, queue trigger, automatic execution |
| Read-only consumer | Inspect and summarize existing evidence | Mutating state, fixing files, launching workers |
| Manual coordinator | Record explicit manual state transitions | Scheduler, daemon, watcher, automatic next worker |
| Safety guards | Stop on missing evidence or forbidden action risk | Override owner gates or auto-repair unsafe requests |
| AppData artifacts | Reviewable ZIPs and checksum sidecars outside the repo | Secrets, private payloads, nested ZIPs, build cache, `.git` |
| Static tests | Read docs, schemas, and synthetic fixtures | Private API, deploy, trading, billing, runtime worker behavior |

## Permanent Non-Approvals

Fast-track completion does not approve:

- deploy or production mutation
- Cloudflare, D1, Queue, R2, or KV mutation
- runtime automatic execution
- Codex worker auto-start
- prompt sending automation
- browser or UI automation
- OpenAI API calls
- private API access
- provider mutation
- trading, including PAPER, LIVE, order, cancel, or fetch_balance
- billing or external service mutation
- daemon, watcher, queue loop, scheduler, or background consumer
- secrets output or raw private payload output
- fetch, pull, push, force push, reset, restore, clean, stash, or deletion

These actions need separate explicit owner approval for the exact action.

## AppData Evidence Boundary

AppData evidence is local review material. A record under `<ARTIFACT_ROOT>` may
prove that a packet, ledger entry, or decision existed with a specific hash. It
does not prove that a future action is approved.

Future prompts should cite:

- artifact path
- artifact SHA256
- relevant chain id or task id
- one human review point
- exact next bounded action

If any of those are missing, the next state is `REPAIR` or `STOP`, not `GO`.

## Ledger And Consumer Boundary

A ledger writer may only write the approved local evidence format under the
approved artifact root. It must not write to the repo by default, start workers,
watch folders, poll queues, call APIs, or infer approval.

A read-only consumer may only read existing evidence and report review state. It
must not mutate files, repair records, update coordinator state, run commands,
or perform the next task.

## State Machine Boundary

The manual coordinator may record state when a human decision exists. It must
not invent a decision from the presence of files.

Unsafe or ambiguous transitions must stop at `STOP_OWNER_REVIEW_REQUIRED`.

## Future Expansion Gate

Before adding any new runtime, writer, consumer, bridge, daemon, watcher,
provider integration, private API path, deploy path, trading path, billing path,
or push path, create a review-only design or repair packet first.

The packet must name:

- exact scope
- exact files
- forbidden actions
- test plan
- artifact output
- owner approval phrase
- stop conditions
- one human decision point

Without that packet and approval, the known boundary stays closed.
