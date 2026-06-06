# Owner Approval Gate

Owner approval gates exist to keep Codex Native Closed Loop work bounded,
reviewable, and reversible.

## Core Rule

An owner approval phrase authorizes only the exact scope named in that phrase.
It does not authorize adjacent actions.

For example, docs-only implementation approval does not authorize:

- commit;
- push;
- PR creation;
- publicization;
- OpenAI application submission;
- notification implementation;
- runtime execution;
- deploy;
- trading or private API access.

## Stop Phrase

Use:

```text
Stop and Wait - Owner Review Required.
```

when approval is unclear, a required rule file is missing, a worktree state is
unexpected, or the next action would cross the approved scope.

## GO / Revise / Stop Pattern

Every review handoff should make it easy for the owner to choose:

- GO: approve one exact next phase.
- Revise: request a narrow change to the packet or docs.
- Stop: keep the current state and do not continue.

## Keep Approvals Separate

Separate these approvals:

- docs-only implementation approval;
- commit approval;
- push approval;
- public visibility review approval;
- OpenAI application draft approval;
- OpenAI application submission approval;
- notification design approval;
- notification implementation approval;
- notification sending approval;
- runtime/deploy/private API/trading approval.

Do not combine them in one phrase.

## Safe Approval Phrase Examples

Examples:

- `APPROVE_DOCS_ONLY_OSS_READINESS_GAP_CLOSURE_PHASE1_README_USAGE_AND_START_GUIDE`
- `APPROVE_COMMIT_DOCS_ONLY_OSS_READINESS_GAP_CLOSURE`
- `APPROVE_PUSH_DOCS_ONLY_OSS_READINESS_GAP_CLOSURE`
- `APPROVE_OWNER_MANUAL_PUBLIC_VISIBILITY_REVIEW`
- `APPROVE_OPENAI_CODEX_FOR_OSS_APPLICATION_DRAFT_ONLY`
- `KEEP_CODEX_NATIVE_TOOLING_REPO_PRIVATE_AND_PAUSE`

Each phrase should be accepted only for its named scope.

## Unsafe Bundling Examples

Do not use or accept bundled approvals such as:

- approve docs, commit, and push;
- approve publicization and application submission;
- approve notification design and sending;
- approve worker launch and prompt sending;
- approve runtime and trading;
- approve deploy and private API access.

If a phrase bundles multiple high-risk actions, stop and request a narrower
owner decision.

## Ambiguous Approval

The following are not enough for high-risk actions:

- looks good;
- continue;
- proceed;
- same as before;
- do the next step.

When approval is ambiguous, continue only with safe review-only preparation or
stop with:

```text
Stop and Wait - Owner Review Required.
```

## Safety Meanings

The following statements must keep their narrow meanings:

- would_continue=true is not equivalent to real auto-start permission.
- owner_review_required=false does not mean owner execution approval.
- next_prompt_ready=true only means a text draft exists.
- next_implementer_start_allowed remains false unless separately approved.
- worker_launch_allowed remains false unless separately approved.
- prompt_sending_allowed remains false unless separately approved.
- real_orchestration_allowed remains false unless separately approved.

Closed-loop invariants:

- `worker_session_close_required_after_review_handoff = true`
- `no_next_worker_until_previous_worker_closed = true`
- `previous_worker_retired must be true before START_NEXT_IMPLEMENTER`
- `max_open_implementer_sessions_per_lane = 1`
- `max_open_reviewer_sessions_per_lane = 1`
- `max_total_open_worker_sessions_initial = 2`
- `v0.1 is one-lane-only`
- if close/retire confirmation is missing, stop with:
  `Stop and Wait - Owner Review Required.`
