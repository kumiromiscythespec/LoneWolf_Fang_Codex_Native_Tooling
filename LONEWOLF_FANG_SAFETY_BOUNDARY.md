# LONEWOLF_FANG_SAFETY_BOUNDARY.md

Safety boundary for Codex Native Closed Loop template work.

This document defines default forbidden actions, allowed safe defaults, and reporting expectations for Codex-assisted work.

Use this together with `CLAUDE.md`, `CODEX_RULES.md`, and repo-specific instructions.

---

## 1. Default Mode

Default to the safest useful mode:

- review-only
- docs-only
- schema-tests-only
- static validation only
- artifact/handoff generation only

If the current prompt does not explicitly approve a higher-risk action, do not perform it.

Silence is not approval.

Ambiguous approval is not approval.

Prior approval in another thread is not approval unless the current prompt explicitly carries it forward.

---

## 2. Always Forbidden Without Explicit Current Approval

The following must not be performed unless the current prompt clearly and explicitly approves the exact action.

### Production / Cloud Operations

- production deploy
- Cloudflare production mutation
- Worker deploy
- D1 production migration apply
- D1 production write
- Queue send / enqueue
- R2 mutation
- KV mutation
- production route mutation
- rollback execution
- external production smoke that mutates state

### Trading / Runtime Operations

- runtime import
- runtime dispatch
- strategy promotion
- candidate config activation
- PAPER trading
- LIVE trading
- order placement
- order cancel
- fetch_balance
- private API access
- exchange API mutation
- runner execution connected to trading
- execution-path wiring between Signal Worker and Standard/Aggressive

### Research Execution Operations

Unless explicitly approved for the specific phase, do not run:

- backtest
- sweep
- replay
- Monte Carlo
- full generation
- private dataset fetch
- large unbounded generation
- automatic adoption of generated results

### Billing / Account Operations

- Stripe production mutation
- billing production action
- subscription creation/modification
- customer balance mutation
- coupon/promotion production changes

### Repository Operations

- commit
- push
- rebase
- reset
- force push
- branch deletion
- large unrelated refactor
- mass formatting outside requested scope

### Sensitive Information

- secrets output
- API keys
- raw auth payloads
- raw private payloads
- production DB dumps
- billing secrets
- order IDs when not safe to disclose
- credentials or token values

---

## 3. Allowed Safe Work By Default

The following are generally allowed when they match the requested task and do not cross forbidden boundaries:

- read-only inspection
- docs updates
- schema updates
- test fixtures using synthetic/safe data
- pure helper functions
- static tests
- prompt/handoff generation
- safe summaries
- manifest generation
- checksum generation
- ZIP artifact creation
- non-mutating local validation
- focused test runs that do not access private APIs or production services

Even allowed work must remain within the requested repo and scope.

---

## 4. Repo Scope Rule

Do not cross repo boundaries unless explicitly requested.

For public-template use, define your own project root:

- `<PROJECT_ROOT>`
- optional environment variable: `CNCL_PROJECT_ROOT=<PROJECT_ROOT>`

Define your own target repo root separately:

- `<REPO_ROOT>`
- optional environment variable: `CNCL_REPO_ROOT=<REPO_ROOT>`

When a task is scoped to project-root rule files or documentation, do not edit
anything under another repo unless the current prompt explicitly authorizes
that repo and scope.

Examples of generic repo boundaries:

- `<PROJECT_ROOT>/repos/<repo-a>`
- `<PROJECT_ROOT>/repos/<repo-b>`
- `<PROJECT_ROOT>/private/<downstream-profile-repo>`

Private downstream project layouts are not public template requirements. Keep
private product rules and owner-local paths in `<PROJECT_PROFILE>` outside the
public repo unless an ignored local profile pattern is separately approved.

If a task mentions one repo, do not modify another repo.

If shared behavior is needed across repos, create a review-only plan first.

---

## 5. Surgical Change Rule

Every changed line must trace back to the requested task.

Do not touch:

- unrelated files
- unrelated formatting
- adjacent cleanup
- old dead code
- unrelated dependency files
- production config
- secrets/config files

If unrelated issues are discovered, record them as follow-up notes.

---

## 6. Approval Language

High-risk actions require clear approval in the current prompt.

Acceptable approval examples:

- "Run production deploy for repo X now."
- "Apply this specific D1 production migration now."
- "Push commit HASH to branch Y."
- "Run this local backtest command only."
- "Start PAPER canary with these exact limits."

Not sufficient:

- "looks good"
- "continue"
- "proceed"
- "same as before"
- "do the next step"
- approval from an earlier thread without restatement
- vague references to deployment or runtime readiness

When approval is insufficient, stop and ask or continue only with review-only preparation.

---

## 7. Artifact Safety

Artifacts must be safe to share.

External artifact ZIPs should be saved under:

`<ARTIFACT_ROOT>`

Users should choose `<ARTIFACT_ROOT>` for their own environment. Public docs
may show generic examples such as
`%LOCALAPPDATA%\CodexNativeClosedLoop\data` or
`$HOME/.local/share/codex-native-closed-loop/data`, but must not require a
personal user directory or private downstream artifact path.

Include:

- manifest
- safe summary
- test summary
- checksum
- changed file list
- NEXT_CODEX_PROMPT.md when useful
- human review point when useful

Exclude:

- secrets
- API keys
- raw private payloads
- node_modules
- `.git`
- build cache
- nested ZIPs
- large unrelated exports
- production DB dump
- raw billing/auth/order data

---

## 8. Final Safety Confirmation

Every final report must explicitly state whether the following were performed or not:

- deploy
- Cloudflare mutation
- D1 apply/write
- Queue/R2/KV mutation
- runtime import/dispatch/promotion
- PAPER/LIVE/order/cancel/fetch_balance/private API
- backtest/sweep/replay/Monte Carlo/full generation
- billing production action
- commit/push
- secrets output

If any item was performed, include the exact approval source and evidence.

If not performed, say so clearly.

---

## 9. Stop And Wait

Use `Stop and Wait - Owner Review Required` when:

- human judgment is required
- approval is needed for a forbidden action
- an unexpected dirty worktree is found
- verification fails
- source of truth is ambiguous
- production/runtime/billing/trading risk appears
- continuing would require guessing

A good stop state includes:

- what was completed
- what was not completed
- why it stopped
- current git status
- artifact path and SHA256 if created
- one clear next human decision
- safe resume prompt
