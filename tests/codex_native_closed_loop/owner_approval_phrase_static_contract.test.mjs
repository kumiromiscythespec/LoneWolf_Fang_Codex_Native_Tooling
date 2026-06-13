// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readJson = (filePath) => JSON.parse(readFileSync(resolve(root, filePath), "utf8"));
const exactPhrase = "APPROVE_NEXT_WAVE_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION_SIX_WINDOW";

const schema = readJson("schema/codex_native_closed_loop/owner_approval_record.schema.json");
const valid = readJson("tests/fixtures/codex_native_closed_loop/state_gate_naming/valid/owner_approval_record_valid.json");
const stale = readJson("tests/fixtures/codex_native_closed_loop/state_gate_naming/invalid/stale_owner_approval_fails_closed.json");

assert.equal(schema.$comment, "BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1");
assert.equal(schema.properties.approval_phrase.const, exactPhrase);
assert.equal(schema.properties.approval_scope.const, "docs_schema_tests_fixtures_only");
assert.equal(schema.properties.execution_allowed.const, false);
assert.equal(schema.properties.runtime_allowed.const, false);
assert.equal(schema.properties.automatic_continuation_allowed.const, false);

assert.equal(valid.approval_phrase, exactPhrase);
assert.equal(valid.approval_scope, "docs_schema_tests_fixtures_only");
assert.equal(valid.owner_review_required, true);
assert.equal(valid.execution_allowed, false);
assert.equal(valid.runtime_allowed, false);
assert.equal(valid.automatic_continuation_allowed, false);

assert.notEqual(stale.approval_phrase, exactPhrase);
assert.equal(stale.expected_reason, "STALE_OWNER_APPROVAL");
assert.equal(stale.next_state, "OWNER_REVIEW_REQUIRED");
assert.equal(stale.next_action, "REQUIRE_OWNER_REVIEW");
assert.equal(stale.owner_review_required, true);
assert.equal(stale.execution_allowed, false);
assert.equal(stale.runtime_allowed, false);
assert.equal(stale.automatic_continuation_allowed, false);

console.log("owner_approval_phrase_static_contract: ok");
