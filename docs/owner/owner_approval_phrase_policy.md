<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Owner Approval Phrase Policy

Owner approval must be exact, current, scoped, and auditable. Ambiguous approval
language is not permission for high-risk work.

## Current Window Approval

This window accepts only:

```text
APPROVE_NEXT_WAVE_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION_SIX_WINDOW
```

That phrase authorizes only the Window 5 docs/schema/tests/fixtures allowlist.
It does not authorize stage, commit, push, fetch, pull, deploy, runtime
workflows, daemon/watchers, UI automation, private APIs, OpenAI APIs,
Cloudflare/D1/R2/KV/Queue mutation, Stripe/Clerk/billing mutation,
trading/PAPER/LIVE/order/cancel/fetch_balance, cleanup, deletion, reset,
restore, stash, amend, rebase, process kill, or security bypass.

## Insufficient Phrases

These phrases are not enough for high-risk actions:

- continue
- proceed
- looks good
- okay
- do it
- do the next step
- same as before
- ship it
- approved earlier

## Expiration

Approval expires when branch, commit, artifact checksum, target environment,
risk category, validation result, or owner instruction changes.
