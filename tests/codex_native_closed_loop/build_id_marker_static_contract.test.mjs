// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BUILD_ID = "20260613_codex_native_automation_gate_contracts_v1";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const markdownFiles = [
  "docs/codex_native_closed_loop/state_gate_naming_canonical.md",
  "docs/codex_native_closed_loop/unknown_name_fail_closed_policy.md",
  "docs/codex_native_closed_loop/owner_gate_naming_policy.md"
];

const schemaFiles = [
  "schema/codex_native_closed_loop/state_gate_names.schema.json",
  "schema/codex_native_closed_loop/automation_state_transition_record.schema.json",
  "schema/codex_native_closed_loop/owner_approval_record.schema.json",
  "schema/codex_native_closed_loop/forbidden_action_report.schema.json"
];

const testFiles = [
  "tests/codex_native_closed_loop/state_gate_naming_static_contract.test.mjs",
  "tests/codex_native_closed_loop/unknown_name_fail_closed_static_contract.test.mjs",
  "tests/codex_native_closed_loop/owner_approval_phrase_static_contract.test.mjs",
  "tests/codex_native_closed_loop/build_id_marker_static_contract.test.mjs"
];

const jsonFixtureFiles = [
  "tests/fixtures/codex_native_closed_loop/state_gate_naming/valid/canonical_state_gate_names.json",
  "tests/fixtures/codex_native_closed_loop/state_gate_naming/valid/automation_state_transition_record_valid.json",
  "tests/fixtures/codex_native_closed_loop/state_gate_naming/valid/owner_approval_record_valid.json",
  "tests/fixtures/codex_native_closed_loop/state_gate_naming/valid/forbidden_action_report_valid.json",
  "tests/fixtures/codex_native_closed_loop/state_gate_naming/invalid/unknown_state_fails_closed.json",
  "tests/fixtures/codex_native_closed_loop/state_gate_naming/invalid/unknown_event_fails_closed.json",
  "tests/fixtures/codex_native_closed_loop/state_gate_naming/invalid/unknown_guard_fails_closed.json",
  "tests/fixtures/codex_native_closed_loop/state_gate_naming/invalid/unknown_next_action_fails_closed.json",
  "tests/fixtures/codex_native_closed_loop/state_gate_naming/invalid/noncanonical_case_fails_closed.json",
  "tests/fixtures/codex_native_closed_loop/state_gate_naming/invalid/stale_owner_approval_fails_closed.json"
];

function firstLine(filePath) {
  return readFileSync(resolve(root, filePath), "utf8").split(/\r?\n/u)[0];
}

for (const file of markdownFiles) {
  assert.equal(firstLine(file), `<!-- BUILD_ID: ${BUILD_ID} -->`, `${file} missing markdown BUILD_ID`);
}

for (const file of testFiles) {
  assert.equal(firstLine(file), `// BUILD_ID: ${BUILD_ID}`, `${file} missing MJS BUILD_ID`);
}

for (const file of schemaFiles) {
  const schema = JSON.parse(readFileSync(resolve(root, file), "utf8"));
  assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`, `${file} missing schema BUILD_ID comment`);
}

for (const file of jsonFixtureFiles) {
  const fixture = JSON.parse(readFileSync(resolve(root, file), "utf8"));
  assert.equal(fixture.build_id, BUILD_ID, `${file} missing JSON build_id`);
}

console.log("build_id_marker_static_contract: ok");
