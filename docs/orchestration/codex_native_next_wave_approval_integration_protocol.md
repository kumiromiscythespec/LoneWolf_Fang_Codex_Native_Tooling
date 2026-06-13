<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Codex Native Next Wave Approval Integration Protocol

This protocol describes how future docs/schema/tests/fixtures-only
implementation outputs from the six-window wave should be reviewed and
integrated. It is not an execution protocol. It does not approve commit, push,
deploy, runtime workflows, private APIs, OpenAI APIs, cloud mutation, billing
mutation, trading/order behavior, daemon/watchers, UI automation, cleanup,
deletion, reset, restore, stash, amend, rebase, or history rewrite.

## Integration Inputs

Each future window should return an AppData evidence ZIP and a short final
report. The ZIP should include:

- manifest with target repo, baseline, observed branch, observed head, staged
  count, changed files, tests, and forbidden-action booleans
- safe summary
- changed file list
- file allowlist verification
- test summary
- validation summary
- checksum summary
- forbidden actions confirmation
- rollback and reversibility notes
- human review one point
- `NEXT_CODEX_PROMPT.md`

The integration reviewer should verify every ZIP checksum before inspecting
contents. If a required artifact is missing, corrupt, stale, or ambiguous, the
review must stop with `STOP_OWNER_REVIEW_REQUIRED`.

## Review Order

Review Window 1 first because it defines the shared scope and protocol. Then
review Windows 2 through 6 in numerical order:

1. Window 1 controller docs and shared scope
2. Window 2 state/gate naming contracts
3. Window 3 owner approval freshness contracts
4. Window 4 dry-run request/result contracts
5. Window 5 forbidden action and governance contracts
6. Window 6 static coverage matrix and fixture index

The reviewer may compare paths and concepts across windows, but must not merge,
stage, commit, push, or edit files unless a later owner prompt explicitly
approves a separate integration implementation phase.

## Required Checks

For each window output, confirm:

- the owner approval phrase was present in the future implementation prompt
- the window verified the stable baseline before editing
- changed files are only from that window allowlist
- every new or modified file has the required BUILD_ID/build_id marker
- tests were run exactly as permitted, or absences were recorded
- `git diff --check` passed for the implementation output
- no forbidden action was performed
- `NEXT_CODEX_PROMPT.md` recommends integration/review only

If any check fails, classify the result as repair-required or
owner-review-required. Do not auto-promote.

## Conflict Policy

Conflicts are possible because several windows define related governance
concepts. Resolve them conservatively:

- prefer exact file allowlists over broad path patterns
- prefer fail-closed behavior over permissive behavior
- prefer synthetic fixtures over copied private or production data
- prefer static contract tests over runtime tests
- prefer one canonical schema path per concept
- stop if two windows define incompatible schema identities or BUILD_ID markers

Ambiguous conflicts require `STOP_OWNER_REVIEW_REQUIRED`.

## Integration Packet Output

After reviewing all six outputs, the integration reviewer should create an
AppData-only integration packet with:

- manifest
- input artifact verification
- window status map
- changed file inventory
- static test summary
- conflict and blocker matrix
- safety boundary summary
- rollback and reversibility summary
- human review one point
- `NEXT_CODEX_PROMPT.md`

The integration packet should recommend exactly one of:

- repair one or more future window outputs
- request owner review
- prepare a later owner-gated commit/push approval packet

The integration packet must not directly recommend commit or push. Any later
commit or push must have its own exact owner approval, exact branch, exact
commit set, and fresh repo verification.

## Human Review One Point

The integration packet should reduce the next decision to one question:

```text
Should the owner repair the six-window outputs, stop, or approve a separate
future integration/commit planning packet?
```

That decision is not approval for deployment, runtime execution, private APIs,
OpenAI APIs, cloud mutation, billing mutation, trading/order behavior,
daemon/watchers, UI automation, cleanup, deletion, reset, restore, stash,
amend, rebase, or history rewrite.
