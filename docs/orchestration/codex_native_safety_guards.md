<!-- BUILD_ID: 20260612_fasttrack_window5_safety_guards_minimal_v1 -->
# Codex Native Safety Guards

## Purpose

This document defines the minimal Window 5 packet safety guard surface. The
first implementation validates metadata-style packet safety report objects. It
does not inspect real ZIP files, execute validators, launch workers, or mutate
the filesystem.

The guard is intended for future local tools that need a small reusable check
before a packet can be treated as safe evidence.

## Minimal Scope

The helper validates:

- `schema` and `build_id` match the accepted packet safety report contract.
- unexpected top-level fields fail closed.
- `output_path` is under the approved AppData artifact root.
- `output_path` is not under the wrong project root.
- runtime, deploy, private API, trading, and billing flags are false.
- push, fetch, or pull was not performed unless the report explicitly allows it.
- repo change status is declared as a boolean.
- packet metadata does not declare `.git`, `node_modules`, nested ZIPs, or build
  cache contents.
- any SHA256 field that appears is a 64-character hexadecimal string.
- missing or ambiguous safety fields fail closed with
  `STOP_OWNER_REVIEW_REQUIRED`.

## Approved Artifact Root

The approved local artifact root for this lane is:

```text
C:\Users\yu_ki\AppData\Local\LoneWolfFang\data
```

This owner-local root belongs in local metadata and fixtures for this fast-track
lane. Public template docs should continue to prefer generic artifact-root
placeholders unless a later owner gate explicitly approves owner-local examples.

## Wrong Root

The guard refuses packet output paths under:

```text
C:\LoneWolf_Fang_Project
```

That project root is not an artifact output root. A packet report that points
there requires owner review before continuation.

## Non-Goals

This phase does not implement:

- real ZIP scanning
- checksum sidecar file reads
- command execution
- worker, daemon, watcher, or automatic continuation behavior
- OpenAI, provider, private API, trading, billing, deploy, or browser behavior
- push, fetch, pull, cleanup, reset, restore, stash, or file deletion

## Result Contract

`validatePacketSafetyReport(report)` returns:

```json
{
  "ok": true,
  "status": "PASS",
  "reasons": []
}
```

or:

```json
{
  "ok": false,
  "status": "STOP_OWNER_REVIEW_REQUIRED",
  "reasons": ["human-readable reason"]
}
```

The helper intentionally fails closed. A missing required boolean, a relative
path, a non-AppData path, or a forbidden flag produces
`STOP_OWNER_REVIEW_REQUIRED`.
