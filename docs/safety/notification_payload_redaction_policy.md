# Notification Payload Redaction Policy

Status: Phase 2A docs-only design

This policy defines what a future notification may include after separate
approval. It does not implement sending.

## Allowed Fields

Allowed fields are minimal and redacted:

- event type
- repo name
- artifact name
- artifact SHA256
- high-level reason
- timestamp
- safe next action label
- owner review required marker
- no raw content

## Forbidden Fields

Forbidden fields include:

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

## Safe Examples

```json
{
  "event_type": "OWNER_APPROVAL_REQUIRED",
  "repo_name": "LoneWolf_Fang_Codex_Native_Tooling",
  "artifact_name": "codex_native_closed_loop_docs_only_phase2a_owner_notification_escalation_design",
  "artifact_sha256": "[SHA256]",
  "high_level_reason": "Owner review required before the next phase.",
  "timestamp": "[ISO_TIMESTAMP]",
  "safe_next_action_label": "STOP_AND_WAIT_OWNER_REVIEW_REQUIRED",
  "owner_review_required": true,
  "raw_content_included": false
}
```

```json
{
  "event_type": "CHECKSUM_MISMATCH",
  "repo_name": "LoneWolf_Fang_Codex_Native_Tooling",
  "artifact_name": "[ARTIFACT_NAME]",
  "artifact_sha256": "[EXPECTED_SHA256]",
  "high_level_reason": "Artifact identity could not be verified.",
  "timestamp": "[ISO_TIMESTAMP]",
  "safe_next_action_label": "STOP_AND_WAIT_OWNER_REVIEW_REQUIRED",
  "owner_review_required": true,
  "raw_content_included": false
}
```

## Unsafe Examples

These are examples of what not to send. They use placeholders only and contain
no real secrets.

```json
{
  "event_type": "SECRET_LIKE_CONTENT_DETECTED",
  "raw_token": "[TOKEN_VALUE]",
  "raw_auth_payload": "[AUTH_PAYLOAD]",
  "raw_log_excerpt": "[PRIVATE_LOG_TEXT]"
}
```

```json
{
  "event_type": "COMMAND_REQUIRES_EXPLICIT_APPROVAL",
  "contact": "[EMAIL_ADDRESS]",
  "phone": "[PHONE_NUMBER]",
  "provider_credential": "[PROVIDER_CREDENTIAL]",
  "webhook_url": "[WEBHOOK_URL]"
}
```

## Phase 2A Boundary

- notification_implementation_performed = false for this phase
- notification_sent = false for this phase
- notification_contact_details_collected = false for this phase
- notification_provider_integrated = false for this phase
- notification_credentials_created = false for this phase
- future implementation requires separate approval
- future sending requires separate approval
- future contact detail handling requires separate approval
- no sensitive content in notifications
