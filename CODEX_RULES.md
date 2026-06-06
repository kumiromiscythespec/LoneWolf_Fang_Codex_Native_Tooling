# CODEX_RULES.md

Codex operating rules for LoneWolf Fang development.

These rules are intended to be used together with `CLAUDE.md` and project-specific instructions.

Start with `AGENTS.md` for the required read order and rule priority. Use
`LONEWOLF_FANG_PROJECT_CONTEXT.md` for project-specific repo, naming, and plan
context. Use `LONEWOLF_FANG_PROMPT_STYLE.md` when writing or reviewing future
ChatGPT/Codex prompts. Use `LONEWOLF_FANG_AUTOMATION_RULES.md` when automation,
closed-loop, worker handoff, or Local Paste Bridge behavior is involved.

## Core Principle

Before writing or changing code, convert the request into a small, verifiable, safety-bounded task.

Bias toward:

- clear assumptions
- minimum necessary changes
- surgical diffs
- explicit verification
- safe stopping when approval is unclear

Do not optimize for speed by guessing.

---

## 1. Think Before Editing

Before editing any file, state briefly:

- requested goal
- assumptions
- unclear points
- success criteria
- files likely to be touched
- files that must not be touched
- safety boundaries

If anything is ambiguous, do not silently choose a path.

When multiple interpretations exist, list the options and stop unless the request itself clearly selects one.

If a simpler approach exists, prefer it and say why.

---

## 2. Permission Defaults

Never assume permission for high-risk operations.

Unless the current prompt explicitly approves them, treat the following as not approved:

- production deploy
- Cloudflare production mutation
- D1 production migration apply
- Queue send / enqueue
- R2 / KV mutation
- Stripe or billing production action
- runtime import
- dispatch
- promotion
- full generation
- PAPER
- LIVE
- order
- cancel
- fetch_balance
- private API access
- backtest / sweep / replay / Monte Carlo execution where not explicitly approved
- secrets output
- raw private payload output
- commit
- push

When approval is unclear, continue only with review-only / docs-only / schema-tests-only work.

---

## 3. Simplicity First

Implement the smallest change that satisfies the requested goal.

Do not add:

- speculative abstractions
- generic frameworks
- broad configurability
- unrelated cleanup
- new execution paths
- new runtime paths
- new deploy paths
- new billing paths
- new trading/order/private API paths

If the solution becomes larger than necessary, simplify before continuing.

A good result is easy to review and easy to revert.

---

## 4. Surgical Changes

Touch only files directly required by the request.

Do not:

- refactor unrelated code
- reformat unrelated files
- improve adjacent code unless required
- delete pre-existing dead code unless explicitly asked
- change behavior outside the requested scope

Match the existing project style.

If your changes create unused imports, variables, functions, or files, clean up only those new orphans.

If you notice unrelated issues, mention them in the final report instead of changing them.

Every changed line must trace back to the requested goal.

---

## 5. Goal-Driven Execution

Before editing, define verifiable success criteria.

For each step, identify:

- step
- expected output
- verification command or check

Example:

- Add schema field -> verify with focused schema test
- Fix broken page text -> verify with build and route check
- Update docs packet -> verify required files, manifest, checksum, and git status

Do not use weak criteria such as "make it work" without converting them into checks.

Loop until the task is verified, blocked, or a safety/time boundary requires stopping.

---

## 6. Testing and Verification

Prefer the narrowest meaningful verification first, then broader checks when appropriate.

Common checks may include:

- typecheck
- focused tests
- full tests when practical
- build
- lint or static checks
- `git diff --check`
- `git diff --cached --check`
- artifact manifest validation
- checksum verification
- route smoke checks for site/UI work when explicitly in scope

If a check is not run, report why.

Do not claim a check passed unless it was actually run.

---

## 7. Artifact Requirements

When creating a handoff or Codex result artifact, save it under:

`C:\Users\yu_ki\AppData\Local\LoneWolfFang\data`

The artifact ZIP should include, when relevant:

- manifest
- safe summary
- test summary
- checksum
- changed file list
- NEXT_CODEX_PROMPT.md
- human review point when useful

The artifact ZIP must not include:

- secrets
- API keys
- raw private payloads
- node_modules
- `.git`
- large unrelated exports
- nested ZIP files
- build cache
- production DB dumps

Report the ZIP path, size, entries count, and SHA256.

---

## 8. Final Report Format

At the end of work, report:

1. What changed
2. Changed files and why each was necessary
3. Success criteria result
4. Tests/checks run
5. Tests/checks not run and why
6. Safety boundary confirmation
7. Git status
8. Artifact ZIP path
9. ZIP SHA256
10. Blocked items or next safe step

Keep the report factual.

Do not hide uncertainty.

Do not imply high-risk work was approved or performed unless it was explicitly approved and actually performed.

---

## 9. Stop Conditions

Stop safely and report if:

- approval is unclear for a high-risk action
- the worktree is unexpectedly dirty
- required input is missing
- tests fail in a way that needs owner judgment
- the requested task would require forbidden behavior
- the requested task expands beyond the stated scope
- the time boundary or safe-stop phase is reached

When stopping, create the best possible handoff summary and next prompt without performing forbidden work.
