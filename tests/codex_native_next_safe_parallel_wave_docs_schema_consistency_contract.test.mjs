// BUILD_ID: 20260613_single_shot_supervised_dry_run_readiness_map_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));
const BUILD_ID = "20260613_single_shot_supervised_dry_run_readiness_map_v1";
const PHRASE = "APPROVE_SINGLE_SHOT_SUPERVISED_DRY_RUN_READINESS_MAP_DOCS_SCHEMA_TESTS_FIXTURES_ONLY";

for (const path of [
  "docs/orchestration/codex_native_single_shot_supervised_dry_run_readiness_map.md",
  "docs/orchestration/codex_native_single_shot_evidence_lane_plan.md",
  "docs/orchestration/codex_native_next_safe_parallel_wave_packet_integrity.md",
  "docs/orchestration/codex_native_next_safe_parallel_wave_coverage_matrix.md",
  "docs/orchestration/file_queue_supervised_dry_run_path_boundary_matrix.md",
  "docs/orchestration/file_queue_supervised_dry_run_before_runtime_definition.md"
]) {
  const text = readText(path);
  assert.ok(text.startsWith(`<!-- BUILD_ID: ${BUILD_ID} -->`), `${path} missing BUILD_ID`);
  assert.match(text, /STOP_OWNER_REVIEW_REQUIRED|fail-closed|fail closed/i, `${path} must mention fail closed or stop`);
  assert.match(text, /owner/i, `${path} must mention owner review`);
  assert.match(text, /runtime/i, `${path} must mention runtime boundary`);
}

const readinessSchema = readJson("schema/orchestration/codex_native_supervised_dry_run_readiness_record.schema.json");
const ownerSchema = readJson("schema/orchestration/file_queue_supervised_dry_run_owner_freshness_link.schema.json");
assert.equal(readinessSchema.properties.owner_approval_phrase.const, PHRASE);
assert.equal(ownerSchema.properties.approval_phrase.const, PHRASE);
assert.ok(readinessSchema.properties.readiness_decision.enum.includes("STOP_OWNER_REVIEW_REQUIRED"));
assert.ok(ownerSchema.properties.expected_result.enum.includes("STOP_OWNER_REVIEW_REQUIRED"));

for (const [field, property] of Object.entries(readinessSchema.$defs.forbidden_actions.properties)) {
  assert.equal(property.const, false, `${field} must be false-only in readiness schema`);
}

console.log("codex_native_next_safe_parallel_wave_docs_schema_consistency_contract_static: ok");
