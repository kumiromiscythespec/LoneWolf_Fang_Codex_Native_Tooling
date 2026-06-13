<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Codex Native Supervised Automation Static Preconditions

This document records static preconditions for a future supervised automation
review lane. It is not an implementation approval and it does not authorize
runtime execution, deployment, API access, cloud mutation, billing mutation,
trading, daemon/watchers, UI automation, commit, or push.

## Required Baseline Evidence

Before any future supervised lane is considered, the handoff evidence must
record:

- target repo path;
- current branch;
- current `HEAD`;
- local `origin/master` without fetching;
- ahead/behind count;
- clean tracked worktree state;
- staged file count;
- input artifact paths and SHA256 values;
- exact owner approval phrase for the specific static phase.

If any baseline value is missing, stale, ambiguous, or mismatched, the expected
result is `STOP_OWNER_REVIEW_REQUIRED`.

## Static Coverage Preconditions

The static coverage matrix must include synthetic fixtures for:

- missing artifact;
- corrupt artifact;
- stale artifact;
- duplicate task ID;
- duplicate artifact ID;
- unknown state, gate, or action;
- owner-gate skip;
- automatic continuation attempt;
- runtime attempt;
- deploy attempt;
- private API or OpenAI API attempt;
- Cloudflare, D1, R2, KV, or Queue mutation attempt;
- Stripe, Clerk, or billing mutation attempt;
- PAPER, LIVE, order, cancel, or fetch_balance attempt.

All negative fixtures must require owner review and must set
`execution_allowed`, `runtime_allowed`, and
`automatic_continuation_allowed` to `false`.

## Owner Approval Boundary

Owner approval must be exact, current, scoped, and auditable. Vague phrases such
as continue, proceed, looks good, do it, same as before, or approved earlier are
not sufficient. Approval expires when branch, commit, artifact checksum, action
scope, target environment, risk category, owner correction, validation result,
or owner-defined review window changes.

## Non-Goals

This static precondition contract does not create:

- a runner;
- an executor;
- a queue consumer;
- a daemon or watcher;
- UI automation;
- a shell bridge;
- an OpenAI client;
- a private API client;
- a cloud, billing, or trading adapter.

Those actions require a separate exact owner approval phrase in a future prompt.
