# Security Policy

## Status

This repository keeps public-ready security guidance while preserving conservative
owner gates for sensitive actions. This document does not itself approve
publicization, releases, deployment, or external program submission.

## Reporting

Prefer GitHub Security Advisories when they are enabled for this repository. If
advisories are not available, open a minimal public issue that describes the
affected area and risk category without exploit details, secrets, raw auth data,
private API payloads, or sensitive logs.

Do not include sensitive material in a report. Keep reports limited to safe
metadata, reproduction notes that do not touch production systems, and a clear
description of the risk. If the correct reporting path is unclear, stop with:
`Stop and Wait - Owner Review Required.`

## Do Not Include

Reports and artifacts must not include:

- secrets, API keys, tokens, auth payloads, or provider credentials;
- raw private logs;
- raw ChatGPT or Codex conversation dumps;
- notification tokens or notification-provider secrets;
- exchange credentials or private trading API payloads;
- Cloudflare, Stripe, Clerk, D1, R2, KV, or Queue secrets;
- billing, order, account, or private API identifiers;
- screenshots or files containing private information.

## Disclosure Boundary

Security review must be owner-gated. Do not provide production exploit
guidance, do not run exploit steps against production systems, and do not use
private APIs. Public disclosure, repository publicization, and application
submission require future owner approval.

## Safety Non-Implementation Flags

For this docs-only public-readiness guidance:

- public_visibility_changed = false
- openai_application_submitted = false
- notification_implementation_performed = false
- notification_sent = false
- notification_contact_details_collected = false
- notification_provider_integrated = false
- notification_credentials_created = false
- local_status_file_writer_implemented = false
- source_code_implemented = false
- local_orchestrator_files_placed = false
- runtime_execution_occurred = false
