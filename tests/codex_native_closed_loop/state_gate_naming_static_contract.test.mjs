// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BUILD_ID = "20260613_codex_native_automation_gate_contracts_v1";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readJson = (filePath) => JSON.parse(readFileSync(resolve(root, filePath), "utf8"));

const namesSchema = readJson("schema/codex_native_closed_loop/state_gate_names.schema.json");
const namesFixture = readJson("tests/fixtures/codex_native_closed_loop/state_gate_naming/valid/canonical_state_gate_names.json");

const requiredStates = [
  "PAUSED_BASELINE_ACCEPTED",
  "PLANNING_ONLY",
  "APPROVAL_PACKET_READY",
  "STATIC_IMPLEMENTATION_READY",
  "LOCAL_COMMIT_READY",
  "PUSH_READY",
  "MANUAL_LOOP_READY",
  "SUPERVISED_DRY_RUN_READY",
  "SUPERVISED_DRY_RUN_RUNNING",
  "OWNER_REVIEW_REQUIRED",
  "FAIL_CLOSED",
  "RUNTIME_PROHIBITED",
  "DEPLOY_PROHIBITED",
  "API_PROHIBITED",
  "TRADING_PROHIBITED"
];

const requiredEvents = [
  "OWNER_APPROVAL",
  "PACKET_CREATED",
  "TEST_PASS",
  "TEST_FAIL",
  "UNEXPECTED_DIRTY_WORKTREE",
  "MISSING_ARTIFACT",
  "CHECKSUM_MISMATCH",
  "AMBIGUOUS_STATE",
  "FORBIDDEN_ACTION_ATTEMPT",
  "AUTOMATION_PROMOTION_REQUEST",
  "STALE_OWNER_APPROVAL",
  "UNKNOWN_NAME"
];

const requiredGuards = [
  "exact_sha_match",
  "local_origin_master_matches_head",
  "ahead_behind_zero",
  "clean_worktree",
  "staged_file_count_zero",
  "known_branch_head",
  "input_artifact_checksum_match",
  "manifest_schema_exact",
  "required_packet_entries_present",
  "no_forbidden_action",
  "owner_approval_phrase_exact",
  "all_static_tests_pass",
  "rollback_available",
  "no_runtime_mutation",
  "build_id_marker_present",
  "allowlist_path_only"
];

const requiredNextActions = [
  "CREATE_APPROVAL_PACKET_ONLY",
  "INCLUDE_IN_NEXT_WAVE_IMPLEMENTATION_APPROVAL_INTEGRATION_PACKET",
  "REQUIRE_OWNER_REVIEW",
  "PREPARE_STATIC_DOCS_SCHEMA_TESTS_FIXTURES_ONLY",
  "RUN_STATIC_TESTS_ONLY",
  "PREPARE_LOCAL_COMMIT_ONLY",
  "PREPARE_PUSH_ONLY",
  "MANUAL_LOOP_REVIEW_ONLY",
  "CONSIDER_SUPERVISED_DRY_RUN_ONLY",
  "START_SUPERVISED_DRY_RUN_ONLY",
  "STOP_FAIL_CLOSED",
  "STOP_RUNTIME_PROHIBITED",
  "STOP_DEPLOY_PROHIBITED",
  "STOP_API_PROHIBITED",
  "STOP_TRADING_PROHIBITED"
];

assert.equal(namesSchema.$comment, `BUILD_ID: ${BUILD_ID}`);
assert.equal(namesFixture.build_id, BUILD_ID);

for (const state of requiredStates) {
  assert.ok(namesFixture.states.includes(state), `canonical states missing ${state}`);
}

for (const event of requiredEvents) {
  assert.ok(namesFixture.events.includes(event), `canonical events missing ${event}`);
}

for (const guard of requiredGuards) {
  assert.ok(namesFixture.guards.includes(guard), `canonical guards missing ${guard}`);
  assert.match(guard, /^[a-z][a-z0-9_]*$/, `${guard} must be lower_snake_case`);
}

for (const action of requiredNextActions) {
  assert.ok(namesFixture.next_actions.includes(action), `canonical next_actions missing ${action}`);
}

for (const item of [...namesFixture.states, ...namesFixture.events, ...namesFixture.next_actions]) {
  assert.match(item, /^[A-Z][A-Z0-9_]*$/, `${item} must be UPPER_SNAKE_CASE`);
}

assert.equal(namesFixture.unknown_name_policy.owner_review_required, true);
assert.equal(namesFixture.unknown_name_policy.execution_allowed, false);
assert.equal(namesFixture.unknown_name_policy.runtime_allowed, false);
assert.equal(namesFixture.unknown_name_policy.automatic_continuation_allowed, false);
assert.equal(namesFixture.unknown_name_policy.default_next_action, "REQUIRE_OWNER_REVIEW");

console.log("state_gate_naming_static_contract: ok");
