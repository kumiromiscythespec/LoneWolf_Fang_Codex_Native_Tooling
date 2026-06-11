# Owner Escalation Events Runbook

Status: Phase 2A docs-only design

This runbook explains how Codex should record an owner attention event and stop
safely. It does not implement notifications.

## Record The Event

When owner attention is required:

1. Classify the event using `docs/owner/owner_attention_events.md`.
2. Record only redacted metadata: event type, repo name, artifact name, artifact
   SHA256, high-level reason, timestamp, and safe next action label.
3. Do not dump secrets, raw private logs, raw ChatGPT conversations, raw Codex
   outputs, contact details, provider credentials, or private payloads.
4. Create or preserve an artifact ZIP under `<ARTIFACT_ROOT>` when a handoff is
   needed.
5. Write `human_review_one_point.md` with one clear owner decision.
6. Stop safely with:

```text
Stop and Wait - Owner Review Required.
```

## Summarize The Issue

The summary should answer:

- what triggered the stop
- what was completed
- what was not completed
- which artifact path and SHA256 identify the evidence
- what exact owner decision is needed

The summary must not include sensitive data or raw private payloads.

## Owner Decision

The owner chooses one of:

- GO with an exact approval phrase
- revise the scope
- stop and keep the current state

No future notification may replace this owner decision.

## Future Notification Pointer

A future notification, if separately approved, should point only to artifact
identity. It should not carry raw evidence. A safe notification can say that
owner review is required and reference the artifact name and SHA256.

## Missing Rule Files

If a required rule file is missing:

- do not continue
- do not guess replacement rules
- record `MISSING_RULE_FILE`
- create a safe artifact if possible
- stop with Owner Review Required

## Checksum Mismatch

If an expected SHA256 does not match:

- treat the artifact as untrusted
- record `CHECKSUM_MISMATCH`
- do not reuse the artifact as a source of truth
- stop with Owner Review Required

## Dirty Worktree

If a clean worktree is required and `git status --short` is not empty:

- record `WORKTREE_DIRTY_STOP`
- do not clean, reset, delete, or stage files
- summarize the dirty state without raw private content
- stop with Owner Review Required

## Command Requiring Explicit Approval

If a command requires explicit approval:

- record `COMMAND_REQUIRES_EXPLICIT_APPROVAL`
- do not run the command
- request one exact command approval or a safer alternative
- stop with Owner Review Required

## Phase 2A Safety Flags

- notification_implementation_performed = false for this phase
- notification_sent = false for this phase
- notification_contact_details_collected = false for this phase
- notification_provider_integrated = false for this phase
- notification_credentials_created = false for this phase
