<!-- BUILD_ID: 2026-06-28_untracked_new_file_diff_check_coverage_contract_v1 -->

# Untracked New File Diff Check Coverage Contract

## Purpose And Trigger

Plain `git diff --check` can miss untracked newly created files when validation
only inspects tracked working-tree diffs. A commit-approval or push-approval
packet is therefore incomplete unless it proves that every file in the exact
intended change set, including every untracked new file, received explicit
whitespace and diff hygiene coverage.

## Commit-Approval Evidence

The packet must record the exact intended file set and count, output from
`git status --short --untracked-files=all`, tracked modified files, untracked
new files, and any missing or unexpected files. It must state that every
intended new file was checked. If staging occurred, it must also record the
exact staged file set. Missing, unexpected, or unchecked files block approval.

## Push-Approval Evidence

Push approval additionally requires a committed diff check over the final
branch diff. Any committed diff check failure blocks push approval. A repair
must be narrow, and the approval packet must be regenerated after the repair.

## Safe Repair Policy

Amend is forbidden by default. Force push and branch deletion are forbidden.
A separate repair commit requires owner approval, and the combined branch diff
must remain exact.

## Guardrails

- no deploy or runtime action
- no API, auth, billing, or trading action
- no private-repository or contracts-repository access
- no pull or fetch unless separately approved
- no checkout or switch unless separately approved
- no force push or branch deletion
- no unrelated refactor

## Owner Decision

Exactly one human decision point may approve progression after the packet
proves complete coverage. Evidence readiness does not authorize commit, push,
deploy, runtime, or any other owner-gated action.
