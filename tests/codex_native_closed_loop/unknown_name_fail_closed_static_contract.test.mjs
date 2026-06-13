// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readJson = (filePath) => JSON.parse(readFileSync(resolve(root, filePath), "utf8"));

const invalidFixtures = [
  ["unknown_state_fails_closed.json", "state", "UNKNOWN_STATE", "OWNER_REVIEW_REQUIRED", "REQUIRE_OWNER_REVIEW"],
  ["unknown_event_fails_closed.json", "event", "UNKNOWN_EVENT", "OWNER_REVIEW_REQUIRED", "REQUIRE_OWNER_REVIEW"],
  ["unknown_guard_fails_closed.json", "guard", "UNKNOWN_GUARD", "FAIL_CLOSED", "STOP_FAIL_CLOSED"],
  ["unknown_next_action_fails_closed.json", "next_action", "UNKNOWN_NEXT_ACTION", "OWNER_REVIEW_REQUIRED", "REQUIRE_OWNER_REVIEW"],
  ["noncanonical_case_fails_closed.json", "case", "NON_CANONICAL_CASE", "OWNER_REVIEW_REQUIRED", "REQUIRE_OWNER_REVIEW"]
];

for (const [fileName, family, reason, state, action] of invalidFixtures) {
  const fixture = readJson(`tests/fixtures/codex_native_closed_loop/state_gate_naming/invalid/${fileName}`);
  assert.equal(fixture.unknown_family, family, `${fileName} family mismatch`);
  assert.equal(fixture.expected_reason, reason, `${fileName} reason mismatch`);
  assert.equal(fixture.next_state, state, `${fileName} state mismatch`);
  assert.equal(fixture.next_action, action, `${fileName} action mismatch`);
  assert.equal(fixture.owner_review_required, true, `${fileName} must require owner review`);
  assert.equal(fixture.execution_allowed, false, `${fileName} must not allow execution`);
  assert.equal(fixture.runtime_allowed, false, `${fileName} must not allow runtime`);
  assert.equal(fixture.automatic_continuation_allowed, false, `${fileName} must not allow continuation`);
}

const forbiddenReport = readJson(
  "tests/fixtures/codex_native_closed_loop/state_gate_naming/valid/forbidden_action_report_valid.json"
);
assert.equal(forbiddenReport.owner_review_required, true);
assert.equal(forbiddenReport.execution_allowed, false);
assert.equal(forbiddenReport.runtime_allowed, false);
assert.equal(forbiddenReport.automatic_continuation_allowed, false);
assert.equal(forbiddenReport.next_state, "RUNTIME_PROHIBITED");
assert.equal(forbiddenReport.next_action, "STOP_RUNTIME_PROHIBITED");

console.log("unknown_name_fail_closed_static_contract: ok");
