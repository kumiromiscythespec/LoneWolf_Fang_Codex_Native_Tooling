# Owner Attention Events

Status: Phase 2A docs-only design

Owner attention events are safe, redacted records that explain why Codex or a
future local workflow must stop for human review. They do not send
notifications by themselves.

Default behavior for every event:

- write artifact / status only
- stop with:
  Stop and Wait - Owner Review Required.

Allowed payload fields for every event:

- event_type
- repo_name
- artifact_name
- artifact_sha256
- high_level_reason
- timestamp
- safe_next_action_label
- owner_review_required
- no raw content

Forbidden payload fields for every event:

- secrets
- API keys
- tokens
- raw auth payload
- private API payload
- order IDs
- billing data
- account identifiers
- email addresses
- phone numbers
- full private logs
- raw ChatGPT conversations
- raw Codex outputs
- source snippets containing secrets
- screenshots with private info
- stack traces containing secrets
- Cloudflare / Stripe / Clerk / D1 / R2 / KV / Queue secrets
- exchange credentials
- provider credentials
- device tokens
- webhook URLs

## OWNER_APPROVAL_REQUIRED

- meaning: A human decision is required before the workflow can continue.
- severity: high
- example safe trigger: a next phase requires an exact owner approval phrase.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields only.
- forbidden payload fields: common forbidden fields.
- safe owner action: choose GO, revise, or stop.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## BLOCKER_DETECTED

- meaning: Codex cannot proceed because evidence, tooling, or context is insufficient.
- severity: medium
- example safe trigger: a required artifact is missing from the handoff packet.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields only.
- forbidden payload fields: common forbidden fields.
- safe owner action: supply the missing input, approve a revised path, or pause.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## SAFETY_BOUNDARY_HIT

- meaning: The workflow reached a forbidden or higher-risk boundary.
- severity: critical
- example safe trigger: a future prompt requests runtime, deploy, cleanup, or private API work without approval.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields only.
- forbidden payload fields: common forbidden fields.
- safe owner action: review the boundary and approve only an exact safe next scope.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## MISSING_RULE_FILE

- meaning: A required rule file is missing or unreadable.
- severity: critical
- example safe trigger: `CLAUDE.md`, `CODEX_RULES.md`, or `LONEWOLF_FANG_SAFETY_BOUNDARY.md` is absent.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields only plus the missing file name.
- forbidden payload fields: common forbidden fields.
- safe owner action: restore the rule file or approve a revised safe path.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## SECRET_LIKE_CONTENT_DETECTED

- meaning: Secret-like or credential-like content may be present.
- severity: critical
- example safe trigger: a scanner sees a token-shaped value in a proposed artifact.
- whether future notification may be allowed: yes, only with a redacted high-level marker.
- allowed payload fields: common allowed fields only.
- forbidden payload fields: the detected value, surrounding raw text, and common forbidden fields.
- safe owner action: inspect locally, rotate if needed, and approve a redacted repair path.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## COMMAND_REQUIRES_EXPLICIT_APPROVAL

- meaning: A command needs exact owner approval before execution.
- severity: high
- example safe trigger: a prompt proposes `git push`, deploy, or a runtime command.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields plus a redacted command category.
- forbidden payload fields: raw secrets, credential arguments, and common forbidden fields.
- safe owner action: approve one exact command, revise it, or decline.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## LONG_RUN_SAFE_STOP

- meaning: A long-running loop reached a budget, iteration, or safe-stop boundary.
- severity: medium
- example safe trigger: a docs-only loop reaches the approved iteration limit.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields only.
- forbidden payload fields: common forbidden fields.
- safe owner action: review progress and choose resume, revise, or stop.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## ARTIFACT_VALIDATION_FAILED

- meaning: A required artifact validation check failed.
- severity: high
- example safe trigger: manifest JSON does not parse.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields plus the failed check name.
- forbidden payload fields: raw artifact contents and common forbidden fields.
- safe owner action: approve a repair packet or reject the artifact.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## CHECKSUM_MISMATCH

- meaning: An expected SHA256 does not match the actual artifact hash.
- severity: critical
- example safe trigger: input ZIP hash differs from the prompt.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields plus expected/actual hash labels when safe.
- forbidden payload fields: raw artifact contents and common forbidden fields.
- safe owner action: treat the artifact as untrusted until the source of truth is resolved.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## WORKTREE_DIRTY_STOP

- meaning: The repo was dirty where a clean baseline was required.
- severity: high
- example safe trigger: `git status --short` returns entries before an approved clean-baseline task.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields plus a redacted dirty-state summary.
- forbidden payload fields: raw diffs, secret-bearing paths, and common forbidden fields.
- safe owner action: decide whether to inspect, preserve, isolate, or stop.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## GIT_PUSH_REQUIRED_BUT_NOT_APPROVED

- meaning: A push would be needed for progress, but push is not approved.
- severity: high
- example safe trigger: docs are complete but no push approval phrase exists.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields only.
- forbidden payload fields: raw diffs and common forbidden fields.
- safe owner action: approve an exact push packet, keep local only, or request review.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## PUBLICIZATION_REQUIRES_OWNER_UI_DECISION

- meaning: Public visibility or public release would require an owner UI decision.
- severity: critical
- example safe trigger: a future task proposes changing GitHub visibility.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields only.
- forbidden payload fields: private release payloads and common forbidden fields.
- safe owner action: decide manually in the relevant UI after readiness review.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## NOTIFICATION_PROVIDER_UNAVAILABLE

- meaning: A future notification provider is unavailable or not configured.
- severity: medium
- example safe trigger: future email adapter is disabled or missing opt-in.
- whether future notification may be allowed: yes, through fallback only unless separately approved.
- allowed payload fields: common allowed fields only.
- forbidden payload fields: contact details, provider credentials, and common forbidden fields.
- safe owner action: inspect the local artifact and choose a fallback or provider setup review.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## UNKNOWN_ESCALATION_REASON

- meaning: The workflow cannot classify why owner attention is needed.
- severity: medium
- example safe trigger: a future validator emits an unmapped stop reason.
- whether future notification may be allowed: yes, after separate approval and opt-in.
- allowed payload fields: common allowed fields plus `unknown_reason`.
- forbidden payload fields: raw logs and common forbidden fields.
- safe owner action: classify the reason before any continuation.
- default behavior if notification cannot be sent: write artifact / status only and stop with Owner Review Required.

## Phase 2A Safety Flags

- notification_implementation_performed = false for this phase
- notification_sent = false for this phase
- notification_contact_details_collected = false for this phase
- notification_provider_integrated = false for this phase
- notification_credentials_created = false for this phase
