# Secret Handling Policy

Secrets never belong in this repository.

Forbidden content includes:

- API keys, tokens, passwords, auth payloads, private keys, and provider
  credentials;
- notification tokens, webhook URLs, and notification-provider secrets;
- exchange credentials and private trading API payloads;
- Cloudflare, Stripe, Clerk, D1, R2, KV, Queue, billing, order, or account
  secrets;
- raw private logs, raw ChatGPT/Codex conversation dumps, and screenshots with
  private information;
- contact details unless a future owner-approved public reporting channel
  explicitly permits them.

If a task would require sensitive content, stop with:
`Stop and Wait - Owner Review Required.`

## Artifact Handling

AppData artifacts must be redacted before packaging. They should include safe
metadata, summaries, manifests, checksums, and next prompts. They must not
include `.git`, `node_modules`, nested ZIPs, production database dumps, raw
private logs, raw conversations, secrets, provider credentials, notification
tokens, contact details, or private API payloads.
