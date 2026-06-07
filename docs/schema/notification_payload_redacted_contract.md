# Redacted Notification Payload Contract

## Purpose

`schema/notification_payload_redacted.schema.json` defines the smallest safe payload shape that could be handed to a future separately approved notification adapter.

This schema does not implement notification sending. It also does not authorize contact detail collection, provider integration, notification credentials, worker launch, prompt sending automation, runtime orchestration, publicization, or OpenAI application submission.

## What It Permits

- A safe event type and severity.
- A repository name label.
- A safe artifact name and SHA256.
- A high-level reason.
- A safe next action label.
- Redaction status and explicit confirmations that sensitive content, contact details, and provider credentials are excluded.

## What It Forbids

The schema uses `additionalProperties: false`. It does not define fields for secrets, API keys, tokens, raw auth payloads, private logs, contact details, provider credentials, raw source snippets, screenshots, billing data, order IDs, private API payloads, raw ChatGPT conversations, raw Codex outputs, webhook URLs, or device tokens.

## Why Contact Details Are Excluded

Phase 2B is schema/docs/fixtures-only. It does not collect or store owner email addresses, phone numbers, device tokens, webhook URLs, provider tokens, or notification credentials. Any future contact detail handling requires separate approval.

## Why Providers Are Excluded

Provider selection, integration, and credentials are runtime and operational decisions. They are not approved by the existence of this schema.

## Phase 2B Safety Flags

- notification_implementation_performed = false for this phase
- notification_sent = false for this phase
- notification_contact_details_collected = false for this phase
- notification_provider_integrated = false for this phase
- notification_credentials_created = false for this phase
- local_status_file_writer_implemented = false for this phase
- source_code_implemented = false for this phase

## Future Validation

Future validation should parse fixtures, enforce required fields, confirm no sensitive content is present, and verify that dangerous fields remain rejected. Schema validation is evidence only; it is not a sender.
