# Notification Privacy Policy

Status: Phase 2A docs-only design

Notifications must never be used as a channel for sensitive data.

## Opt-In Boundary

All future notification channels require owner opt-in. This Phase 2A task does
not approve implementation, sending, contact detail handling, provider
integration, or credential creation.

For this phase:

- notification_implementation_performed = false for this phase
- notification_sent = false for this phase
- notification_contact_details_collected = false for this phase
- notification_provider_integrated = false for this phase
- notification_credentials_created = false for this phase

## Data That Must Not Be Collected By Default

The repo must not collect or store these by default:

- contact details
- email addresses
- phone numbers
- device tokens
- provider credentials
- webhook URLs
- notification tokens

Future contact detail handling requires separate approval.

## Payload Privacy

Notification payloads must not include:

- raw secrets
- API keys
- tokens
- raw auth payloads
- private API payloads
- raw private logs
- raw ChatGPT conversations
- raw Codex outputs
- billing data
- order data
- account identifiers
- Cloudflare / Stripe / Clerk / D1 / R2 / KV / Queue secrets
- exchange credentials
- provider credentials

Redaction is required before any future payload is considered safe.

## Rate Limits And Anti-Spam

Every future notification channel must have:

- explicit opt-in
- rate limiting
- cooldown
- duplicate suppression
- owner ability to disable notifications
- artifact-only fallback

Notification failure does not authorize unsafe continuation. Retry storms are
forbidden. Infinite notification loops are forbidden.

## Artifact-Only Fallback

If a future notification cannot be sent, the workflow must write or preserve
safe local artifact/status evidence and stop with:

```text
Stop and Wait - Owner Review Required.
```

## Public OSS Safety

This repo may be used as an OSS-readable documentation baseline. It must avoid
shipping assumptions that require private contact details, provider secrets, or
private notification infrastructure. Defaults must be safe for a user who only
has local files and artifact ZIP handoff.
