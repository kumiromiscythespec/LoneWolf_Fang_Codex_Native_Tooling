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

const schema = readJson("schema/orchestration/file_queue_supervised_dry_run_owner_freshness_link.schema.json");
const current = readJson("tests/fixtures/file-queue/supervised-dry-run/owner-freshness/valid/current_exact_owner_approval.json");
const stale = readJson("tests/fixtures/file-queue/supervised-dry-run/owner-freshness/invalid/stale_owner_approval.json");

function ownerFreshnessErrors(record) {
  const errors = [];
  for (const field of schema.required) if (!Object.hasOwn(record, field)) errors.push(`missing ${field}`);
  if (record.schema !== schema.properties.schema.const) errors.push("bad schema");
  if (record.build_id !== BUILD_ID) errors.push("bad build_id");
  if (record.approval_phrase !== PHRASE) errors.push("bad approval phrase");
  if (record.implementation_type !== "docs/schema/tests/fixtures-only") errors.push("bad implementation type");
  if (record.approval_fresh === false && record.expected_result !== "STOP_OWNER_REVIEW_REQUIRED") errors.push("stale approval must stop");
  if (record.approval_fresh === false && record.implementation_allowed !== false) errors.push("stale approval must not allow implementation");
  if (record.approval_fresh === true && record.implementation_allowed !== true) errors.push("fresh approval should allow review implementation");
  return errors;
}

assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
assert.equal(schema.properties.approval_phrase.const, PHRASE);
assert.equal(schema.properties.implementation_type.const, "docs/schema/tests/fixtures-only");
assert.deepEqual(ownerFreshnessErrors(current), [], "current approval fixture must pass");
assert.deepEqual(ownerFreshnessErrors(stale), [], "stale fixture shape must be valid fail-closed evidence");
assert.equal(stale.expected_result, "STOP_OWNER_REVIEW_REQUIRED");
assert.ok(stale.stale_reasons.includes("baseline_changed"));

for (const path of [
  "docs/orchestration/file_queue_supervised_dry_run_path_boundary_matrix.md",
  "docs/orchestration/file_queue_supervised_dry_run_before_runtime_definition.md"
]) {
  const text = readText(path);
  assert.ok(text.startsWith(`<!-- BUILD_ID: ${BUILD_ID} -->`), `${path} missing BUILD_ID`);
  assert.match(text, /STOP_OWNER_REVIEW_REQUIRED/);
  assert.match(text, /runtime/i);
  assert.match(text, /daemon|watcher/i);
  assert.match(text, /API/i);
  assert.match(text, /cloud/i);
  assert.match(text, /billing/i);
  assert.match(text, /trading|order/i);
}

console.log("file_queue_supervised_dry_run_path_boundary_contract_static: ok");
