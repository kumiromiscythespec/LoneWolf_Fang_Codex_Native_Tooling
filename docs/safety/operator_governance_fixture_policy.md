<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Operator Governance Fixture Policy

Operator governance fixtures must be synthetic, redacted, and local. They exist
to exercise static docs/schema/test contracts only.

## Allowed Fixture Content

Fixtures may include:

- synthetic request text.
- synthetic artifact ids.
- synthetic SHA256-like evidence values.
- safe labels for forbidden-action categories.
- expected static classifications.
- GO/REPAIR/STOP review examples.

## Forbidden Fixture Content

Fixtures must not include:

- secrets or API keys.
- raw auth payloads.
- raw private API payloads.
- billing data.
- credentials.
- order ids.
- production records.
- private logs or private conversations.

## Static Boundary

Fixtures must not trigger runtime behavior. They must be read as local JSON by
static tests only. A fixture that contains a forbidden action example is still
not an instruction to perform that action; it is evidence that the contract
must classify the request as blocked.

## BUILD_ID

Every JSON fixture in this window carries:

```text
"build_id": "20260613_codex_native_automation_gate_contracts_v1"
```
