<!-- BUILD_ID: 20260612_fasttrack_window2_linkage_ledger_writer_v0 -->
<!-- BUILD_ID: 20260613_ledger_consumer_static_hardening_v1 -->
# File Queue Linkage Ledger Writer

## Purpose

The linkage ledger writer records proof that a file queue linkage chain produced
reviewable AppData evidence. It appends one JSONL record per proof ID to a local
ledger file under the owner-local AppData artifact root.

The ledger is evidence storage only. It is not a queue, not an execution engine,
task source, permission token, runner input, or automatic continuation signal.

## Local-Only Boundary

The writer is limited to:

- reading one synthetic ledger entry JSON object supplied by the caller
- validating required fields
- checking that the target ledger path is under the configured AppData root
- checking that the target ledger path is outside the repository
- checking for an existing `proof_id`
- appending one JSONL record when not in dry-run mode

The writer must not:

- read or write secrets
- call network APIs
- execute tasks
- consume queue items
- launch a daemon, watcher, runner, worker, timer, or background process
- call Codex CLI, OpenAI API, browser automation, providers, private APIs,
  trading APIs, billing APIs, deploy tools, or shell commands
- infer owner approval from a ledger entry

## Entry Contract

Each input entry conforms to
`schema/orchestration/file_queue_linkage_ledger_entry.schema.json`.

The core identity fields are:

- `proof_id`
- `chain_id`
- `task_id`
- `current_state`
- `ledger_path`
- `overwrite_existing`

`overwrite_existing` must be `false` in this v0 writer. The ledger is
append-only, so an existing `proof_id` causes safe refusal instead of rewriting
history.

## Evidence By Reference

The entry preserves evidence by reference. Each `evidence_references` item stores
only:

- evidence kind
- local evidence path
- SHA256 for the referenced artifact

The writer does not embed source artifact contents in the ledger record. The
ledger line adds checksum metadata for the input proof payload and the generated
ledger record.

## AppData Path Rule

The target ledger path must be explicit and must resolve under the configured
AppData artifact root. On Windows this is the local AppData `LoneWolfFang\data`
folder. The writer refuses repo-local paths and any path outside AppData.

The safe failure status for path violations is `OUTPUT_BOUNDARY_VIOLATION`.

## Dry-Run Plan

Dry-run mode performs validation, AppData path checks, duplicate proof checks,
and checksum planning without writing the ledger file. The planned record and
checksums are returned to the caller for static review.

Dry-run mode must still fail closed for invalid fields, non-AppData paths,
duplicate proof IDs, or suspicious secret-like field names or values.

## Duplicate Proof Rule

Before writing, the writer scans existing JSONL lines in the target ledger. If a
line already contains the same `proof_id`, the write is refused with
`DUPLICATE_PROOF_ID`.

This rule prevents silent replay and preserves append-only review history.

## Static Supersession Hardening Contract

Future ledger hardening must keep the ledger append-only. A stale or corrected
proof is represented by a new supersession evidence record, never by editing,
deleting, truncating, reordering, or rewriting an older ledger line.

The static supersession contract uses these review terms:

- active proof: the single accepted terminal proof that remains after valid
  supersession evidence is applied;
- superseded proof: an older proof preserved in the ledger and referenced by a
  valid supersession record;
- stale proof: a proof that is older than the active terminal proof or whose
  next action is no longer authoritative;
- duplicate proof: two records with the same `proof_id`, which must fail closed;
- ambiguous proof: evidence that does not identify exactly one terminal proof;
- invalid proof: evidence with bad schema, missing identity, unsafe fields,
  unsafe recommendation, or malformed checksum data;
- checksum-mismatched proof: evidence whose recorded SHA256 does not match the
  referenced parent or artifact.

A future supersession record must use a new `supersession_id` and must point to
existing proof identifiers by reference. It must include SHA256 values for the
superseded proof and superseding proof. It must keep
`owner_approval_required=true`, `execution_allowed=false`, and
`runtime_allowed=false` either directly or through the consuming observation.

The writer boundary remains unchanged: it may record approved AppData evidence,
but it must not infer approval, consume a queue, run a worker, or repair ledger
history. If duplicate handling requires update or replacement behavior, the
safe result is `STOP_OWNER_REVIEW_REQUIRED`.

## STOP_OWNER_REVIEW_REQUIRED Conditions

Stop with owner review before any future expansion if:

- a writer needs repo output instead of AppData output
- duplicate handling requires update or replacement behavior
- ledger records need embedded private payloads
- a consumer, watcher, daemon, runner, worker, queue loop, UI bridge, Codex CLI,
  OpenAI API, provider, private API, deploy, trading, billing, cleanup, fetch,
  pull, push, or shell execution path becomes necessary

## Integration Notes

This writer is the first local-only append-only proof ledger boundary. A future
consumer or runner remains out of scope and requires a separate owner-approved
design, implementation, and review phase.
