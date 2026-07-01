<!-- BUILD_ID: 2026-07-01_approval_packet_evidence_consistency_contract_v1 -->
# Approval Packet Evidence Consistency Contract

## Purpose

An approval packet must not be classified as READY when its manifest, Git
status evidence, file lists, consistency checks, or checksums contradict one
another. This contract is static evidence guidance; it does not add a runtime
validator or authorize repository mutation.

## Required Evidence

For packet types that require working-tree evidence, the packet records:

- manifest counts for changed, tracked modified, untracked new, and staged files
- `git status --short --untracked-files=all`
- exact changed, tracked modified, untracked new, and staged file lists
- consistency check results and a readiness or blocker classification

Evidence may be absent only when the packet type explicitly marks it as not
required. Otherwise `MISSING_REQUIRED_EVIDENCE` blocks readiness.

## Consistency Rules

Each manifest count equals the length of its corresponding list. Untracked
paths are exactly paths marked `??` in status evidence; tracked modified paths
are exactly tracked `M` paths; staged paths match staged evidence. For a
pre-commit packet with zero staged files, the exact changed set equals the
union of tracked modified and untracked new paths.

Any contradiction blocks READY with one or more of:

- `APPROVAL_PACKET_EVIDENCE_COUNT_MISMATCH`
- `UNTRACKED_LIST_STATUS_MISMATCH`
- `TRACKED_LIST_STATUS_MISMATCH`
- `CHANGED_FILES_UNION_MISMATCH`
- `STAGED_EVIDENCE_MISMATCH`
- `READY_CLASSIFICATION_WITH_FAILED_CONSISTENCY_CHECK`
- `MISSING_REQUIRED_EVIDENCE`

## Repair

Repair is AppData-only unless repo source changes receive separate approval.
The repair regenerates contradictory evidence, updates manifest values and
checksums together, and records replacement evidence. A contradiction in a
commit, push, PR, or merge approval packet cannot be downgraded to a warning.

The PR #9-style case, where the manifest and status report six untracked files
but `untracked_new_files.txt` lists all nineteen changed files, is blocked by
the same general rules as every other packet.

## Safety Boundary

This contract does not authorize commit, push, PR, merge, deploy, runtime,
API, auth, billing, trading, private/contracts access, fetch, pull, checkout,
switch, force push, branch deletion, or branch cleanup. READY is not GO.
