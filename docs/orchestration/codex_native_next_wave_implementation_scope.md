<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Codex Native Next Wave Implementation Scope

This document defines the shared scope for the next docs/schema/tests/fixtures-only
automation gate contract wave. It is a scope document only. It does not approve
runtime automation, deployment, API access, cloud mutation, billing mutation,
trading/order behavior, daemon/watchers, UI automation, commit, or push.

## Authority

Future implementation prompts in this wave must require the exact owner approval
phrase:

```text
APPROVE_NEXT_WAVE_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION_SIX_WINDOW
```

The phrase authorizes only the exact docs, schema, test, and fixture paths
listed in each future window prompt. If the phrase is missing, stale, ambiguous,
or tied to changed repo evidence, the window must stop with
`STOP_OWNER_REVIEW_REQUIRED`.

## Baseline Requirements

Every future implementation window must verify these conditions before editing:

- target repo is `C:\LoneWolf_Fang_Project\repos\core\LoneWolf_Fang_Codex_Native_Tooling`
- branch is `master`
- local `HEAD` is `25a4ec7277e2f18bcf4dec4cbfc93f7bdc36284b`
- local `origin/master` equals `HEAD` without fetch or pull
- ahead/behind is `0 / 0`
- worktree is clean before edits
- staged file count is `0` before edits

Any mismatch is a stop condition. The window must not repair the repo, fetch,
pull, clean, reset, restore, stash, delete, rebase, amend, or rewrite history.

## Allowed Future Work

The future wave may add or modify only owner-approved files in these categories:

- Markdown docs under the exact window allowlist
- JSON Schema files under the exact window allowlist
- static Node test files under the exact window allowlist
- synthetic JSON fixtures under the exact window allowlist

All future changes must stay surgical. If a needed file is outside the current
window allowlist, the window must stop with `STOP_OWNER_REVIEW_REQUIRED`.

## Always Out Of Scope

The future wave must not add or modify:

- `src/**`
- executable runner or interpreter paths
- runtime workflow dispatch
- daemon or watcher behavior
- shell command runner behavior
- UI automation
- private API or OpenAI API integration
- Cloudflare, D1, R2, KV, or Queue mutation behavior
- Stripe, Clerk, or billing mutation behavior
- PAPER, LIVE, order, cancel, or fetch_balance behavior
- package dependency files unless a later owner prompt explicitly expands scope
- production secrets, raw auth, raw private payloads, billing data, order data,
  credentials, production DB dumps, build caches, nested ZIPs, `.git`, or
  `node_modules`

## BUILD_ID Policy

Every future window must apply the shared marker family:

```text
20260613_codex_native_automation_gate_contracts_v1
```

Required markers:

- Markdown first line: `<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->`
- JSON top-level: `"build_id": "20260613_codex_native_automation_gate_contracts_v1"`
- JSON Schema top-level `$comment` includes `BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1`
- MJS first line: `// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1`

## Window Responsibilities

Window 1 defines controller docs, integration docs, and shared approval scope.
It must not add schema, test, fixture, runtime, or tool files.

Window 2 may define canonical state, event, guard, and next_action
docs/schema/tests/fixtures. Unknown names must fail closed and require owner
review.

Window 3 may define owner approval freshness, stale approval, and supersession
docs/schema/tests/fixtures. Ambiguity must become `STOP_OWNER_REVIEW_REQUIRED`.

Window 4 may define dry-run request/result docs/schema/tests/fixtures. It must
not create an executor, task runner, shell runner, daemon, watcher, or runtime
path.

Window 5 may define forbidden action, blocker matrix, human review one point,
and owner approval phrase governance docs/schema/tests/fixtures. It must not
create executable enforcement code.

Window 6 may define static coverage matrix, fixture index, and cross-schema
static tests. It must not run runtime, network, deploy, API, cloud, billing, or
trading tests.

## Future Window Artifacts

Each future implementation window must create an AppData evidence ZIP containing
at least:

- `manifest.json`
- `safe_summary.md`
- `changed_files.md`
- `file_allowlist_verification.md`
- `test_summary.md`
- `validation_summary.md`
- `checksum_summary.md`
- `forbidden_actions_confirmation.md`
- `rollback_and_reversibility.md`
- `human_review_one_point.md`
- `NEXT_CODEX_PROMPT.md`

The `NEXT_CODEX_PROMPT.md` file must recommend implementation output
integration/review only. It must not make commit, push, deploy, runtime, API,
cloud, billing, trading, daemon/watcher, UI automation, cleanup, deletion,
reset, restore, stash, amend, rebase, or history rewrite an allowed next action.
