// BUILD_ID: 20260613_single_shot_supervised_dry_run_readiness_map_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const BUILD_ID = "20260613_single_shot_supervised_dry_run_readiness_map_v1";

const manifestSchema = readJson("schema/orchestration/codex_native_next_safe_parallel_wave_packet_manifest.schema.json");
const sidecarSchema = readJson("schema/orchestration/codex_native_next_safe_parallel_wave_checksum_sidecar.schema.json");
const valid = readJson("tests/fixtures/codex-native-next-safe-parallel-wave/valid/approval_packet_manifest_valid.json");
const nested = readJson("tests/fixtures/codex-native-next-safe-parallel-wave/invalid/nested_zip_forbidden.json");
const missingReview = readJson("tests/fixtures/codex-native-next-safe-parallel-wave/invalid/missing_human_review_one_point.json");

function packetErrors(packet) {
  const errors = [];
  for (const field of manifestSchema.required) if (!Object.hasOwn(packet, field)) errors.push(`missing ${field}`);
  if (packet.schema !== manifestSchema.properties.schema.const) errors.push("bad schema");
  if (packet.build_id !== BUILD_ID) errors.push("bad build_id");
  if (packet.nested_zip_count !== 0) errors.push("nested zip present");
  if (packet.forbidden_entry_count !== 0) errors.push("forbidden entry present");
  if (packet.runtime_execution_performed !== false) errors.push("runtime performed");
  if (packet.deploy_performed !== false) errors.push("deploy performed");
  if (packet.api_calls_performed !== false) errors.push("api performed");
  if (packet.cloud_billing_trading_performed !== false) errors.push("external mutation performed");
  return errors;
}

assert.equal(manifestSchema.$comment, `BUILD_ID: ${BUILD_ID}`);
assert.equal(sidecarSchema.$comment, `BUILD_ID: ${BUILD_ID}`);
assert.equal(sidecarSchema.properties.algorithm.const, "SHA256");
assert.equal(manifestSchema.properties.runtime_execution_performed.const, false);
assert.equal(manifestSchema.properties.deploy_performed.const, false);
assert.equal(manifestSchema.properties.api_calls_performed.const, false);
assert.equal(manifestSchema.properties.cloud_billing_trading_performed.const, false);

assert.deepEqual(packetErrors(valid), [], "valid packet manifest fixture must pass");
assert.ok(packetErrors(nested).includes("nested zip present"), "nested ZIP fixture must fail");
assert.ok(packetErrors(missingReview).includes("missing human_review_one_point"), "missing review point must fail");

console.log("codex_native_next_safe_parallel_wave_packet_sidecar_contract_static: ok");
