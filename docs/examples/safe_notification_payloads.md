# Safe Notification Payload Examples

Status: Phase 2A docs-only design

These examples are documentation only. They do not implement notifications and
do not send anything.

## Safe Examples

### OWNER_APPROVAL_REQUIRED

```json
{
  "event_type": "OWNER_APPROVAL_REQUIRED",
  "repo_name": "LoneWolf_Fang_Codex_Native_Tooling",
  "artifact_name": "[ARTIFACT_NAME]",
  "artifact_sha256": "[SHA256]",
  "high_level_reason": "Owner approval is required before continuing.",
  "timestamp": "[ISO_TIMESTAMP]",
  "safe_next_action_label": "STOP_AND_WAIT_OWNER_REVIEW_REQUIRED",
  "owner_review_required": true,
  "raw_content_included": false
}
```

### BLOCKER_DETECTED

```json
{
  "event_type": "BLOCKER_DETECTED",
  "repo_name": "LoneWolf_Fang_Codex_Native_Tooling",
  "artifact_name": "[ARTIFACT_NAME]",
  "artifact_sha256": "[SHA256]",
  "high_level_reason": "A required input is missing.",
  "timestamp": "[ISO_TIMESTAMP]",
  "safe_next_action_label": "STOP_AND_WAIT_OWNER_REVIEW_REQUIRED",
  "owner_review_required": true,
  "raw_content_included": false
}
```

### SAFETY_BOUNDARY_HIT

```json
{
  "event_type": "SAFETY_BOUNDARY_HIT",
  "repo_name": "LoneWolf_Fang_Codex_Native_Tooling",
  "artifact_name": "[ARTIFACT_NAME]",
  "artifact_sha256": "[SHA256]",
  "high_level_reason": "A forbidden or higher-risk boundary was reached.",
  "timestamp": "[ISO_TIMESTAMP]",
  "safe_next_action_label": "STOP_AND_WAIT_OWNER_REVIEW_REQUIRED",
  "owner_review_required": true,
  "raw_content_included": false
}
```

### CHECKSUM_MISMATCH

```json
{
  "event_type": "CHECKSUM_MISMATCH",
  "repo_name": "LoneWolf_Fang_Codex_Native_Tooling",
  "artifact_name": "[ARTIFACT_NAME]",
  "artifact_sha256": "[EXPECTED_SHA256]",
  "high_level_reason": "The artifact SHA256 did not match the expected value.",
  "timestamp": "[ISO_TIMESTAMP]",
  "safe_next_action_label": "STOP_AND_WAIT_OWNER_REVIEW_REQUIRED",
  "owner_review_required": true,
  "raw_content_included": false
}
```

### LONG_RUN_SAFE_STOP

```json
{
  "event_type": "LONG_RUN_SAFE_STOP",
  "repo_name": "LoneWolf_Fang_Codex_Native_Tooling",
  "artifact_name": "[ARTIFACT_NAME]",
  "artifact_sha256": "[SHA256]",
  "high_level_reason": "The approved loop reached a safe stop.",
  "timestamp": "[ISO_TIMESTAMP]",
  "safe_next_action_label": "STOP_AND_WAIT_OWNER_REVIEW_REQUIRED",
  "owner_review_required": true,
  "raw_content_included": false
}
```

## Unsafe Examples

These are unsafe examples of what not to send. They use placeholders only and
contain no real secrets, contact details, private payloads, or credentials.

```json
{
  "event_type": "SECRET_LIKE_CONTENT_DETECTED",
  "secret_value": "[SECRET_VALUE]",
  "api_key": "[API_KEY_VALUE]",
  "token": "[TOKEN_VALUE]",
  "raw_auth_payload": "[AUTH_PAYLOAD]"
}
```

```json
{
  "event_type": "COMMAND_REQUIRES_EXPLICIT_APPROVAL",
  "email_address": "[EMAIL_ADDRESS]",
  "phone_number": "[PHONE_NUMBER]",
  "device_token": "[DEVICE_TOKEN]",
  "webhook_url": "[WEBHOOK_URL]",
  "provider_credential": "[PROVIDER_CREDENTIAL]"
}
```

```json
{
  "event_type": "ARTIFACT_VALIDATION_FAILED",
  "raw_private_log": "[PRIVATE_LOG_TEXT]",
  "raw_chatgpt_conversation": "[RAW_CHATGPT_CONVERSATION]",
  "raw_codex_output": "[RAW_CODEX_OUTPUT]",
  "stack_trace_with_secret": "[STACK_TRACE_WITH_SECRET]"
}
```

## Phase 2A Boundary

- notification_implementation_performed = false for this phase
- notification_sent = false for this phase
- notification_contact_details_collected = false for this phase
- notification_provider_integrated = false for this phase
- notification_credentials_created = false for this phase
- no sensitive content in notifications
