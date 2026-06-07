# Private Payload Redaction Policy

Private payloads must be summarized, not copied.

## Redact

- secrets and credentials;
- auth headers and private API payloads;
- billing, order, account, and exchange identifiers;
- notification tokens and provider credentials;
- contact details;
- raw private logs;
- raw ChatGPT/Codex conversation dumps;
- screenshots with private information.

## Safe Replacement Pattern

Use short labels such as:

- `[redacted secret]`
- `[redacted private payload]`
- `[redacted contact detail]`
- `[redacted provider credential]`

Keep enough context to explain the safety decision without exposing the private
value. If redaction would remove the evidence needed for review, create a
safe summary and stop for owner review.
