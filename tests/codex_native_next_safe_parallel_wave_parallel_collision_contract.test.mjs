// BUILD_ID: 20260613_single_shot_supervised_dry_run_readiness_map_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const BUILD_ID = "20260613_single_shot_supervised_dry_run_readiness_map_v1";

const schema = readJson("schema/orchestration/codex_native_next_safe_parallel_wave_parallel_collision.schema.json");
const duplicate = readJson("tests/fixtures/file-queue/supervised-dry-run/repetition-guards/invalid/duplicate_active_readiness_attempt.json");
const superseded = readJson("tests/fixtures/file-queue/supervised-dry-run/repetition-guards/invalid/superseded_artifact_reused.json");
const parallel = readJson("tests/fixtures/codex-native-next-safe-parallel-wave/invalid/parallel_collision_duplicate_artifact.json");

function assertCollision(record) {
  assert.equal(record.schema, schema.properties.schema.const);
  assert.equal(record.build_id, BUILD_ID);
  assert.equal(record.automatic_continuation_allowed, false);
  assert.equal(record.expected_result, "STOP_OWNER_REVIEW_REQUIRED");
}

assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
assert.equal(schema.properties.automatic_continuation_allowed.const, false);
assert.ok(schema.properties.expected_result.enum.includes("STOP_OWNER_REVIEW_REQUIRED"));

assertCollision(duplicate);
assertCollision(superseded);
assertCollision(parallel);
assert.notEqual(new Set(duplicate.active_artifact_ids).size, duplicate.active_artifact_ids.length, "duplicate fixture must repeat artifact id");
assert.equal(superseded.superseded_artifact_reused, true);
assert.equal(parallel.duplicate_detected, true);

console.log("codex_native_next_safe_parallel_wave_parallel_collision_contract_static: ok");
