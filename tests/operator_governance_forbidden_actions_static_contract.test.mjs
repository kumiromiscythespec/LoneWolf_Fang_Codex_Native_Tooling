// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const BUILD_ID = "20260613_codex_native_automation_gate_contracts_v1";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const forbiddenFixtures = new Map([
  ["deploy_attempt.json", "deploy"],
  ["runtime_attempt.json", "runtime"],
  ["daemon_watcher_attempt.json", "daemon_watcher"],
  ["ui_automation_attempt.json", "ui_automation"],
  ["private_api_attempt.json", "private_api"],
  ["openai_api_attempt.json", "openai_api"],
  ["cloud_mutation_attempt.json", "cloud_mutation"],
  ["billing_mutation_attempt.json", "billing_mutation"],
  ["trading_order_attempt.json", "trading_order"],
  ["force_push_attempt.json", "force_push"],
  ["destructive_git_file_attempt.json", "destructive_git_or_file"],
  ["process_kill_security_bypass_attempt.json", "process_kill_security_bypass"]
]);

function collectKeys(value, keys = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item, keys);
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      keys.push(key);
      collectKeys(item, keys);
    }
  }
  return keys;
}

test("all forbidden action fixtures are present", () => {
  const names = readdirSync(resolve(root, "tests/fixtures/operator-governance/invalid"))
    .filter((name) => name.endsWith(".json"))
    .sort();
  assert.deepEqual(names, [...forbiddenFixtures.keys()].sort());
});

test("forbidden action fixtures fail closed", () => {
  for (const [file, category] of forbiddenFixtures) {
    const fixture = readJson(`tests/fixtures/operator-governance/invalid/${file}`);
    assert.equal(fixture.schema, "lonewolf.codex_native.forbidden_action_report.v1", file);
    assert.equal(fixture.build_id, BUILD_ID, file);
    assert.equal(fixture.action_category, category, file);
    assert.equal(fixture.classification, "blocked", file);
    assert.equal(fixture.exact_approval_present, false, file);
    assert.equal(fixture.execution_allowed, false, file);
    assert.equal(fixture.mutation_performed, false, file);
    assert.equal(fixture.owner_review_required, true, file);
    assert.ok(fixture.safe_alternatives.includes("stop_owner_review_required"), file);
    assert.ok(fixture.matched_forbidden_terms.length > 0, file);
    assert.match(fixture.attempted_action_text, /^Synthetic request /, file);
    assert.match(fixture.stop_reason, /must stop for owner review/i, file);
  }
});

test("safe preparation fixtures remain non-mutating", () => {
  for (const file of [
    "read_only_review_request.json",
    "dry_run_only_request.json",
    "preview_packet_only_request.json"
  ]) {
    const fixture = readJson(`tests/fixtures/operator-governance/valid/${file}`);
    assert.equal(fixture.schema, "lonewolf.codex_native.safe_governance_fixture.v1", file);
    assert.equal(fixture.build_id, BUILD_ID, file);
    assert.equal(fixture.high_risk_action_requested, false, file);
    assert.equal(fixture.mutation_requested, false, file);
    assert.equal(fixture.execution_allowed, false, file);
    assert.equal(fixture.expected_classification, "allowed_safe_preparation", file);
  }
});

test("human review fixture keeps one GO/REPAIR/STOP decision", () => {
  const fixture = readJson("tests/fixtures/operator-governance/valid/human_review_one_point_go_repair_stop.json");
  assert.equal(fixture.schema, "lonewolf.codex_native.human_review_one_point.v1");
  assert.equal(fixture.build_id, BUILD_ID);
  assert.deepEqual(fixture.options, ["GO", "REPAIR", "STOP"]);
  assert.equal(fixture.recommendation, "GO");
  assert.equal(fixture.continuation_decision_count, 1);
  assert.equal(fixture.execution_allowed, false);
  assert.match(fixture.scope_limit, /no commit, push, deploy, runtime, API, cloud, billing, trading/i);
});

test("fixtures avoid secret-like raw payload keys", () => {
  const fixturePaths = [
    ...[...forbiddenFixtures.keys()].map((file) => `tests/fixtures/operator-governance/invalid/${file}`),
    "tests/fixtures/operator-governance/valid/read_only_review_request.json",
    "tests/fixtures/operator-governance/valid/dry_run_only_request.json",
    "tests/fixtures/operator-governance/valid/preview_packet_only_request.json",
    "tests/fixtures/operator-governance/valid/human_review_one_point_go_repair_stop.json"
  ];
  const forbiddenKeys = new Set([
    "api_key",
    "secret",
    "token",
    "credential",
    "raw_auth",
    "raw_private_payload",
    "billing_data",
    "order_id",
    "production_record"
  ]);
  for (const path of fixturePaths) {
    const keys = collectKeys(readJson(path)).map((key) => key.toLowerCase());
    for (const key of keys) {
      assert.equal(forbiddenKeys.has(key), false, `${path} must not contain forbidden key ${key}`);
    }
  }
});
