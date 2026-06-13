// BUILD_ID: 20260613_single_shot_supervised_dry_run_readiness_map_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));
const BUILD_ID = "20260613_single_shot_supervised_dry_run_readiness_map_v1";
const LEGACY_SCANNED_FIXTURE_BUILD_ID = "20260613_codex_native_automation_gate_contracts_v1";

const markdown = [
  "docs/orchestration/codex_native_single_shot_supervised_dry_run_readiness_map.md",
  "docs/orchestration/codex_native_single_shot_evidence_lane_plan.md",
  "docs/orchestration/codex_native_next_safe_parallel_wave_packet_integrity.md",
  "docs/orchestration/codex_native_next_safe_parallel_wave_coverage_matrix.md",
  "docs/orchestration/file_queue_supervised_dry_run_path_boundary_matrix.md",
  "docs/orchestration/file_queue_supervised_dry_run_before_runtime_definition.md"
];
const schemas = [
  "schema/orchestration/codex_native_supervised_dry_run_readiness_record.schema.json",
  "schema/orchestration/file_queue_supervised_dry_run_owner_freshness_link.schema.json",
  "schema/orchestration/codex_native_next_safe_parallel_wave_packet_manifest.schema.json",
  "schema/orchestration/codex_native_next_safe_parallel_wave_checksum_sidecar.schema.json",
  "schema/orchestration/codex_native_next_safe_parallel_wave_coverage_matrix.schema.json",
  "schema/orchestration/codex_native_next_safe_parallel_wave_parallel_collision.schema.json"
];
const tests = [
  "tests/codex_native_supervised_dry_run_readiness_contract.test.mjs",
  "tests/file_queue_supervised_dry_run_path_boundary_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_packet_sidecar_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_coverage_matrix_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_build_id_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_docs_schema_consistency_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_parallel_collision_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_owner_review_contract.test.mjs"
];
const fixtures = [
  "tests/fixtures/codex-native-next-wave/valid/single_shot_supervised_dry_run_readiness_ready.json",
  "tests/fixtures/codex-native-next-wave/invalid/single_shot_supervised_dry_run_readiness_runtime_attempt_blocked.json",
  "tests/fixtures/codex-native-next-wave/invalid/single_shot_supervised_dry_run_readiness_deploy_attempt_blocked.json",
  "tests/fixtures/file-queue/supervised-dry-run/owner-freshness/valid/current_exact_owner_approval.json",
  "tests/fixtures/file-queue/supervised-dry-run/owner-freshness/invalid/stale_owner_approval.json",
  "tests/fixtures/file-queue/supervised-dry-run/hash-boundary/valid/readiness_hash_chain_valid.json",
  "tests/fixtures/file-queue/supervised-dry-run/hash-boundary/invalid/build_id_mismatch.json",
  "tests/fixtures/file-queue/supervised-dry-run/hash-boundary/invalid/artifact_sha_mismatch.json",
  "tests/fixtures/file-queue/supervised-dry-run/repetition-guards/invalid/duplicate_active_readiness_attempt.json",
  "tests/fixtures/file-queue/supervised-dry-run/repetition-guards/invalid/superseded_artifact_reused.json",
  "tests/fixtures/codex-native-next-safe-parallel-wave/valid/approval_packet_manifest_valid.json",
  "tests/fixtures/codex-native-next-safe-parallel-wave/invalid/nested_zip_forbidden.json",
  "tests/fixtures/codex-native-next-safe-parallel-wave/invalid/missing_human_review_one_point.json",
  "tests/fixtures/codex-native-next-safe-parallel-wave/invalid/parallel_collision_duplicate_artifact.json",
  "tests/fixtures/codex-native-next-safe-parallel-wave/invalid/api_cloud_billing_trading_attempt_blocked.json"
];

for (const path of markdown) assert.equal(readText(path).split(/\r?\n/, 1)[0], `<!-- BUILD_ID: ${BUILD_ID} -->`, `${path} missing markdown BUILD_ID`);
for (const path of tests) assert.equal(readText(path).split(/\r?\n/, 1)[0], `// BUILD_ID: ${BUILD_ID}`, `${path} missing MJS BUILD_ID`);
for (const path of schemas) {
  const schema = readJson(path);
  assert.equal(schema.build_id, BUILD_ID, `${path} bad top-level build_id`);
  assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`, `${path} bad $comment`);
  assert.equal(schema.properties.build_id.const, BUILD_ID, `${path} bad properties.build_id.const`);
}
for (const path of fixtures) {
  const fixture = readJson(path);
  if (path.includes("tests/fixtures/codex-native-next-wave/")) {
    assert.equal(fixture.build_id, LEGACY_SCANNED_FIXTURE_BUILD_ID, `${path} must remain compatible with existing directory-scanned fixture suite`);
    assert.equal(fixture.readiness_build_id, BUILD_ID, `${path} missing readiness_build_id`);
  } else if (path.endsWith("build_id_mismatch.json")) {
    assert.notEqual(fixture.build_id, BUILD_ID, `${path} must intentionally mismatch build_id`);
  } else {
    assert.equal(fixture.build_id, BUILD_ID, `${path} bad build_id`);
  }
}

console.log("codex_native_next_safe_parallel_wave_build_id_contract_static: ok");
