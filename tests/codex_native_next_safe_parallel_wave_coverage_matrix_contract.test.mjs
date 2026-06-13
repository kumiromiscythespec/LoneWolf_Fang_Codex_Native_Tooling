// BUILD_ID: 20260613_single_shot_supervised_dry_run_readiness_map_v1
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));
const BUILD_ID = "20260613_single_shot_supervised_dry_run_readiness_map_v1";

const allowlist = [
  "docs/orchestration/codex_native_single_shot_supervised_dry_run_readiness_map.md",
  "docs/orchestration/codex_native_single_shot_evidence_lane_plan.md",
  "docs/orchestration/codex_native_next_safe_parallel_wave_packet_integrity.md",
  "docs/orchestration/codex_native_next_safe_parallel_wave_coverage_matrix.md",
  "docs/orchestration/file_queue_supervised_dry_run_path_boundary_matrix.md",
  "docs/orchestration/file_queue_supervised_dry_run_before_runtime_definition.md",
  "schema/orchestration/codex_native_supervised_dry_run_readiness_record.schema.json",
  "schema/orchestration/file_queue_supervised_dry_run_owner_freshness_link.schema.json",
  "schema/orchestration/codex_native_next_safe_parallel_wave_packet_manifest.schema.json",
  "schema/orchestration/codex_native_next_safe_parallel_wave_checksum_sidecar.schema.json",
  "schema/orchestration/codex_native_next_safe_parallel_wave_coverage_matrix.schema.json",
  "schema/orchestration/codex_native_next_safe_parallel_wave_parallel_collision.schema.json",
  "tests/codex_native_supervised_dry_run_readiness_contract.test.mjs",
  "tests/file_queue_supervised_dry_run_path_boundary_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_packet_sidecar_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_coverage_matrix_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_build_id_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_docs_schema_consistency_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_parallel_collision_contract.test.mjs",
  "tests/codex_native_next_safe_parallel_wave_owner_review_contract.test.mjs",
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

const schema = readJson("schema/orchestration/codex_native_next_safe_parallel_wave_coverage_matrix.schema.json");
assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
assert.deepEqual(schema.$defs.row.properties.category.enum, ["docs", "schema", "tests", "fixtures"]);
assert.equal(new Set(allowlist).size, 35);
assert.equal(allowlist.filter((path) => path.startsWith("docs/")).length, 6);
assert.equal(allowlist.filter((path) => path.startsWith("schema/")).length, 6);
assert.equal(allowlist.filter((path) => path.startsWith("tests/") && !path.startsWith("tests/fixtures/")).length, 8);
assert.equal(allowlist.filter((path) => path.startsWith("tests/fixtures/")).length, 15);
for (const path of allowlist) assert.ok(existsSync(resolve(root, path)), `${path} must exist`);

const doc = readText("docs/orchestration/codex_native_next_safe_parallel_wave_coverage_matrix.md");
for (const word of ["Docs", "Schema", "Tests", "Fixtures", "STOP_OWNER_REVIEW_REQUIRED"]) {
  assert.match(doc, new RegExp(word), `coverage doc missing ${word}`);
}

console.log("codex_native_next_safe_parallel_wave_coverage_matrix_contract_static: ok");
