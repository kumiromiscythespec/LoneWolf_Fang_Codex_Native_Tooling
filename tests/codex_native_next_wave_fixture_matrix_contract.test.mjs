// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const fixtureDir = (kind) => resolve(root, "tests/fixtures/codex-native-next-wave", kind);
const fixturePaths = (kind) => readdirSync(fixtureDir(kind)).filter((name) => name.endsWith(".json")).map((name) => `tests/fixtures/codex-native-next-wave/${kind}/${name}`);

const buildId = "20260613_codex_native_automation_gate_contracts_v1";

const requiredFixtureIds = [
  "fixture_transition_valid_owner_gate_v1",
  "fixture_owner_approval_valid_scoped_v1",
  "fixture_dry_run_request_valid_appdata_only_v1",
  "fixture_dry_run_result_valid_review_required_v1",
  "fixture_human_review_one_point_valid_include_v1",
  "fixture_missing_required_artifact_v1",
  "fixture_corrupt_artifact_sha_mismatch_v1",
  "fixture_stale_artifact_expired_v1",
  "fixture_duplicate_active_task_id_v1",
  "fixture_duplicate_artifact_id_v1",
  "fixture_unknown_state_fail_closed_v1",
  "fixture_unknown_gate_fail_closed_v1",
  "fixture_unknown_action_fail_closed_v1",
  "fixture_wrong_transition_owner_skip_v1",
  "fixture_auto_continuation_attempt_v1",
  "fixture_unknown_owner_approval_phrase_v1",
  "fixture_stale_owner_approval_v1",
  "fixture_runtime_attempt_blocked_v1",
  "fixture_deploy_attempt_blocked_v1",
  "fixture_private_openai_api_attempt_blocked_v1",
  "fixture_cloud_attempt_blocked_v1",
  "fixture_billing_attempt_blocked_v1",
  "fixture_trading_order_attempt_blocked_v1"
];

const invalidPaths = fixturePaths("invalid");
const validPaths = fixturePaths("valid");
const allFixtures = [...validPaths, ...invalidPaths].map((path) => [path, readJson(path)]);

function collectFixtureIds(fixture) {
  const ids = [fixture.fixture_id];
  for (const item of fixture.cases ?? []) ids.push(item.fixture_id);
  return ids.filter(Boolean);
}

function assertExpectedBoundary(fixture, path) {
  const expected = fixture.expected_result;
  assert.equal(expected.owner_review_required, true, `${path} must require owner review`);
  assert.equal(expected.execution_allowed, false, `${path} must block execution`);
  assert.equal(expected.runtime_allowed, false, `${path} must block runtime`);
  assert.equal(expected.automatic_continuation_allowed, false, `${path} must block continuation`);
  assert.match(fixture.human_review_one_point, /\S/, `${path} must include one human review point`);
}

for (const [path, fixture] of allFixtures) {
  assert.equal(fixture.schema, "lonewolf.codex_native.static_coverage_fixture.v1", `${path} bad fixture schema`);
  assert.equal(fixture.build_id, buildId, `${path} bad build_id`);
  assert.match(fixture.fixture_id, /^fixture_/, `${path} must carry fixture_id`);
  assert.match(fixture.purpose, /\S/, `${path} must describe purpose`);
  assertExpectedBoundary(fixture, path);
}

for (const [path, fixture] of invalidPaths.map((path) => [path, readJson(path)])) {
  assert.equal(fixture.severity, "HIGH", `${path} invalid fixture must be HIGH severity`);
  assert.equal(fixture.expected_result.status, "STOP_OWNER_REVIEW_REQUIRED", `${path} must stop owner review`);
}

const observedIds = new Set(allFixtures.flatMap(([, fixture]) => collectFixtureIds(fixture)));
for (const id of requiredFixtureIds) {
  assert.ok(observedIds.has(id), `fixture matrix missing ${id}`);
}

const corrupt = readJson("tests/fixtures/codex-native-next-wave/invalid/corrupt_artifact_sha_mismatch.json");
assert.notEqual(corrupt.expected_sha256, corrupt.observed_sha256, "corrupt artifact fixture must mismatch SHA values");

const duplicateTasks = readJson("tests/fixtures/codex-native-next-wave/invalid/duplicate_active_task_id.json").active_task_ids;
assert.notEqual(new Set(duplicateTasks).size, duplicateTasks.length, "duplicate task fixture must duplicate task_id");

const duplicateArtifacts = readJson("tests/fixtures/codex-native-next-wave/invalid/duplicate_artifact_id.json").artifacts;
assert.equal(duplicateArtifacts[0].artifact_id, duplicateArtifacts[1].artifact_id);
assert.notEqual(duplicateArtifacts[0].sha256, duplicateArtifacts[1].sha256);

const continuation = readJson("tests/fixtures/codex-native-next-wave/invalid/automatic_continuation_attempt_blocked.json");
assert.equal(continuation.evidence.next_worker_start_requested, true);
assert.equal(continuation.evidence.automatic_continuation_requested, true);

const privateApi = readJson("tests/fixtures/codex-native-next-wave/invalid/private_openai_api_attempt_blocked.json");
assert.equal(privateApi.redaction_status, "redacted_by_reference");
assert.equal(JSON.stringify(privateApi).includes("api_key"), false, "private API fixture must not include secret-like keys");

const grouped = readJson("tests/fixtures/codex-native-next-wave/invalid/cloud_billing_trading_attempt_blocked.json");
for (const attemptedAction of ["cloud_mutation_attempt", "billing_mutation_attempt", "trading_order_attempt"]) {
  assert.ok(grouped.cases.some((item) => item.attempted_action === attemptedAction), `grouped fixture missing ${attemptedAction}`);
}

console.log("codex_native_next_wave_fixture_matrix_contract_static: ok");
