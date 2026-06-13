// BUILD_ID: 20260613_single_shot_supervised_dry_run_readiness_map_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));
const PHRASE = "APPROVE_SINGLE_SHOT_SUPERVISED_DRY_RUN_READINESS_MAP_DOCS_SCHEMA_TESTS_FIXTURES_ONLY";

const ready = readJson("tests/fixtures/codex-native-next-wave/valid/single_shot_supervised_dry_run_readiness_ready.json").readiness_record;
const stale = readJson("tests/fixtures/file-queue/supervised-dry-run/owner-freshness/invalid/stale_owner_approval.json");

assert.equal(ready.owner_approval_phrase, PHRASE);
assert.equal(stale.approval_phrase, PHRASE);
assert.equal(stale.approval_fresh, false);
assert.equal(stale.expected_result, "STOP_OWNER_REVIEW_REQUIRED");

for (const path of [
  "docs/orchestration/codex_native_single_shot_supervised_dry_run_readiness_map.md",
  "docs/orchestration/codex_native_single_shot_evidence_lane_plan.md",
  "docs/orchestration/file_queue_supervised_dry_run_path_boundary_matrix.md"
]) {
  const text = readText(path);
  assert.match(text, /human review|owner review/i, `${path} must preserve human review`);
  assert.doesNotMatch(text, /wrangler\s+(deploy|d1|kv|r2|queue)|stripe\s+(listen|trigger|customers)|npm\s+run\s+deploy|node\s+tools\/orchestration/i, `${path} must not recommend operational commands`);
}

console.log("codex_native_next_safe_parallel_wave_owner_review_contract_static: ok");
