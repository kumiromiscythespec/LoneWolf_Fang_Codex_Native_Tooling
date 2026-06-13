// BUILD_ID: 20260614_request_intake_approval_binding_contracts_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "20260614_request_intake_approval_binding_contracts_v1";
const PHRASE = "APPROVE_REQUEST_INTAKE_APPROVAL_BINDING_CONTRACTS_DOCS_SCHEMA_TESTS_FIXTURES_ONLY";
const BASELINE = "990649259423bba0968169d96fc1b9d84077e074";
const TARGET = "request_intake_approval_binding_contracts";
const TARGET_REPO = "C:\\LoneWolf_Fang_Project\\repos\\core\\LoneWolf_Fang_Codex_Native_Tooling";
const READY = "READY_FOR_REQUEST_INTAKE_REVIEW";
const STOP = "STOP_OWNER_REVIEW_REQUIRED";
const NEXT = "START_REQUEST_INTAKE_APPROVAL_BINDING_IMPLEMENTATION_REVIEW_PACKET";

const allowedFiles = [
  "docs/orchestration/codex_native_supervised_dry_run_request_intake_contract.md",
  "docs/orchestration/codex_native_supervised_dry_run_approval_binding_contract.md",
  "docs/orchestration/codex_native_supervised_dry_run_request_blocker_matrix.md",
  "schema/orchestration/codex_native_supervised_dry_run_request_intake.schema.json",
  "schema/orchestration/codex_native_supervised_dry_run_approval_binding.schema.json",
  "tests/codex_native_supervised_dry_run_request_intake_contract.test.mjs",
  "tests/codex_native_supervised_dry_run_approval_binding_contract.test.mjs",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/valid/request_intake_owner_bound_valid.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_stale_approval.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_superseded_approval.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_baseline_mismatch.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_runtime_permission_present.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_queue_mutation_present.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_api_cloud_billing_trading_present.json"
];

const schema = readJson("schema/orchestration/codex_native_supervised_dry_run_request_intake.schema.json");
const fixture = readJson("tests/fixtures/codex-native-supervised-dry-run/request-intake/valid/request_intake_owner_bound_valid.json");
const readyRecord = fixture.request_intake_records[0];
const blockedRecord = fixture.request_intake_records[1];

const invalidFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_stale_approval.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_superseded_approval.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_baseline_mismatch.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_runtime_permission_present.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_queue_mutation_present.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_api_cloud_billing_trading_present.json"
];

const forbiddenFlags = Object.keys(schema.$defs.forbidden_actions.properties);
const blockerRequired = schema.$defs.blocker.required;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function setPath(target, dottedPath, mutation) {
  const parts = dottedPath.split(".");
  let cursor = target;
  for (const part of parts.slice(0, -1)) cursor = cursor[part];
  const last = parts.at(-1);
  if (mutation.delete === true) delete cursor[last];
  else cursor[last] = mutation.value;
}

function sha256(value) {
  return typeof value === "string" && /^[A-Fa-f0-9]{64}$/.test(value);
}

function missingRequired(schemaNode, data) {
  return schemaNode.required.filter((field) => !Object.hasOwn(data, field));
}

function unexpectedProperties(schemaNode, data) {
  const allowed = new Set(Object.keys(schemaNode.properties ?? {}));
  return Object.keys(data).filter((field) => !allowed.has(field));
}

function equalFileList(value) {
  return JSON.stringify(value) === JSON.stringify(allowedFiles);
}

function requestIntakeErrors(record) {
  const errors = [];
  for (const field of missingRequired(schema, record)) errors.push(`missing ${field}`);
  for (const field of unexpectedProperties(schema, record)) errors.push(`unexpected ${field}`);
  if (errors.length) return errors;

  if (record.schema !== schema.properties.schema.const) errors.push("bad schema");
  if (record.build_id !== BUILD_ID) errors.push("bad build_id");
  if (typeof record.request_id !== "string" || record.request_id.length === 0) errors.push("bad request_id");
  if (record.requested_target !== TARGET) errors.push("bad requested target");
  if (record.stable_baseline !== BASELINE) errors.push("bad stable baseline");
  if (record.expected_repo !== TARGET_REPO) errors.push("bad target repo");
  if (record.expected_branch !== "master") errors.push("bad branch");
  if (record.expected_head !== BASELINE) errors.push("bad expected head");
  if (record.expected_origin_master !== BASELINE) errors.push("bad expected origin");
  if (record.expected_ahead_behind !== "0 / 0") errors.push("bad ahead behind");
  if (record.owner_approval_phrase !== PHRASE) errors.push("bad owner approval phrase");

  const approval = record.owner_approval_freshness;
  if (!approval || typeof approval !== "object") {
    errors.push("missing owner_approval_freshness");
  } else {
    if (approval.approval_phrase !== PHRASE) errors.push("bad approval phrase");
    if (approval.target_scope !== TARGET) errors.push("bad approval target");
    if (approval.approval_current !== true) errors.push("stale approval");
    if (approval.approval_stale !== false) errors.push("stale approval");
    if (approval.approval_superseded !== false) errors.push("superseded approval");
    if (approval.single_use_mutation_approval !== true) errors.push("approval must be single use");
    if (approval.reuse_for_runtime_prohibited !== true) errors.push("runtime reuse not prohibited");
  }

  const scope = record.approval_scope;
  if (!scope || typeof scope !== "object") {
    errors.push("missing approval_scope");
  } else {
    if (scope.exact_file_allowlist_count !== 14) errors.push("bad allowlist count");
    if (!equalFileList(scope.allowed_files)) errors.push("bad allowed files");
    for (const field of ["wildcard_scope_used", "directory_only_scope_used", "broad_fixture_directory_used", "outside_docs_schema_tests_fixtures", "runtime_source_cloud_billing_trading_paths_in_scope"]) {
      if (scope[field] !== false) errors.push(`broad scope ${field}`);
    }
  }

  const artifact = record.artifact_chain;
  if (!artifact || typeof artifact !== "object") {
    errors.push("missing artifact_chain");
  } else {
    if (artifact.artifact_chain_role !== "request_intake_approval_binding_evidence_chain") errors.push("bad artifact role");
    for (const field of ["implementation_approval_packet_path", "planning_integration_packet_path", "stable_closeout_packet_path"]) {
      if (typeof artifact[field] !== "string" || artifact[field].length === 0) errors.push(`missing artifact ${field}`);
    }
    for (const field of ["implementation_approval_packet_sha256", "planning_integration_packet_sha256", "stable_closeout_packet_sha256"]) {
      if (!sha256(artifact[field])) errors.push(`bad artifact ${field}`);
    }
    if (artifact.implementation_evidence_required !== true) errors.push("missing implementation evidence requirement");
  }

  if (!Array.isArray(record.blocker_matrix)) {
    errors.push("missing blocker_matrix");
  } else {
    if (record.fail_closed_decision === READY && record.blocker_matrix.length !== 0) errors.push("ready record has blockers");
    if (record.fail_closed_decision === STOP && record.blocker_matrix.length === 0) errors.push("stop record missing blocker");
    for (const blocker of record.blocker_matrix) {
      for (const field of blockerRequired) if (!Object.hasOwn(blocker, field)) errors.push(`bad blocker missing ${field}`);
      if (!["BLOCKER", "HIGH"].includes(blocker.severity)) errors.push("bad blocker severity");
      if (blocker.fail_closed_action !== STOP) errors.push("bad blocker fail_closed_action");
      if (blocker.owner_review_required !== true) errors.push("bad blocker owner_review_required");
      if (blocker.allows_progression !== false) errors.push("bad blocker allows_progression");
    }
  }

  if (![READY, STOP].includes(record.fail_closed_decision)) errors.push("bad decision");
  for (const flag of forbiddenFlags) {
    if (record.forbidden_actions?.[flag] !== false) errors.push(`forbidden ${flag}`);
  }
  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length === 0) errors.push("missing human_review_one_point");
  if (![NEXT, STOP].includes(record.recommended_next_action)) errors.push("bad recommended_next_action");
  return errors;
}

function baseRecordFor(kind) {
  return kind === "request_intake_blocked" ? clone(blockedRecord) : clone(readyRecord);
}

test("request-intake schema carries exact static binding requirements", () => {
  assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema.const, "lonewolf.codex_native.supervised_dry_run_request_intake.v1");
  assert.equal(schema.properties.requested_target.const, TARGET);
  assert.equal(schema.properties.stable_baseline.const, BASELINE);
  assert.equal(schema.properties.expected_repo.const, TARGET_REPO);
  assert.equal(schema.properties.expected_branch.const, "master");
  assert.equal(schema.properties.expected_head.const, BASELINE);
  assert.equal(schema.properties.expected_origin_master.const, BASELINE);
  assert.equal(schema.properties.expected_ahead_behind.const, "0 / 0");
  assert.equal(schema.properties.owner_approval_phrase.const, PHRASE);
  assert.deepEqual(schema.properties.fail_closed_decision.enum, [READY, STOP]);
  assert.ok(schema.required.includes("owner_approval_freshness"));
  assert.ok(schema.required.includes("artifact_chain"));
  assert.ok(schema.required.includes("blocker_matrix"));
  assert.ok(schema.required.includes("human_review_one_point"));
  assert.equal(schema.$defs.approval_scope.properties.exact_file_allowlist_count.const, 14);
  assert.equal(schema.$defs.approval_scope.properties.allowed_files.minItems, 14);
  assert.equal(schema.$defs.approval_scope.properties.allowed_files.maxItems, 14);
  for (const flag of forbiddenFlags) {
    assert.equal(schema.$defs.forbidden_actions.properties[flag].const, false, `${flag} must be const false`);
  }
});

test("valid request-intake fixtures include ready and explicit fail-closed records", () => {
  assert.equal(fixture.build_id, BUILD_ID);
  assert.equal(fixture.request_intake_records.length, 2);
  assert.deepEqual(requestIntakeErrors(readyRecord), []);
  assert.deepEqual(requestIntakeErrors(blockedRecord), []);
  assert.equal(readyRecord.fail_closed_decision, READY);
  assert.equal(blockedRecord.fail_closed_decision, STOP);
  assert.equal(blockedRecord.blocker_matrix[0].fail_closed_action, STOP);
});

test("invalid request-intake fixture matrix fails closed", () => {
  for (const fixturePath of invalidFixturePaths) {
    const invalidFixture = readJson(fixturePath);
    assert.equal(invalidFixture.build_id, BUILD_ID);
    for (const invalidCase of invalidFixture.invalid_cases) {
      if (!invalidCase.record_kind.startsWith("request_intake")) continue;
      const record = baseRecordFor(invalidCase.record_kind);
      setPath(record, invalidCase.mutation.path, invalidCase.mutation);
      const errors = requestIntakeErrors(record);
      assert.ok(errors.some((error) => error.includes(invalidCase.expected_error)), `${invalidCase.case_id} expected ${invalidCase.expected_error}, got ${errors.join(", ")}`);
    }
  }
});

test("request-intake docs preserve static safety boundary", () => {
  for (const docPath of [
    "docs/orchestration/codex_native_supervised_dry_run_request_intake_contract.md",
    "docs/orchestration/codex_native_supervised_dry_run_approval_binding_contract.md",
    "docs/orchestration/codex_native_supervised_dry_run_request_blocker_matrix.md"
  ]) {
    const text = readText(docPath);
    assert.ok(text.startsWith(`<!-- BUILD_ID: ${BUILD_ID} -->`), `${docPath} missing BUILD_ID`);
    assert.match(text, /owner approval/i);
    assert.match(text, /fresh|stale|superseded/i);
    assert.match(text, /exact/i);
    assert.match(text, /stable baseline/i);
    assert.match(text, /artifact[- ]chain|artifact chain/i);
    assert.match(text, /blocker matrix/i);
    assert.match(text, /fail closed|fail-closed|STOP_OWNER_REVIEW_REQUIRED/i);
    assert.match(text, /no runtime|not a runtime|does not execute/i);
    assert.match(text, /worker/i);
    assert.match(text, /daemon|watcher/i);
    assert.match(text, /API|OpenAI/i);
    assert.match(text, /cloud/i);
    assert.match(text, /Queue/i);
    assert.match(text, /billing/i);
    assert.match(text, /trading|PAPER|LIVE|order/i);
  }
});

test("allowlist is exact and does not use wildcard fixture scope", () => {
  assert.equal(allowedFiles.length, 14);
  assert.equal(allowedFiles.filter((path) => path.startsWith("docs/")).length, 3);
  assert.equal(allowedFiles.filter((path) => path.startsWith("schema/")).length, 2);
  assert.equal(allowedFiles.filter((path) => /^tests\/[^/]+\.test\.mjs$/.test(path)).length, 2);
  assert.equal(allowedFiles.filter((path) => path.startsWith("tests/fixtures/")).length, 7);
  for (const path of allowedFiles) {
    assert.doesNotMatch(path, /\*/);
    assert.doesNotMatch(path, /\/$/);
    assert.match(path, /^(docs|schema|tests|tests\/fixtures)\//);
    assert.doesNotMatch(path, /^(src|tools|scripts|runtime|worker|cloud|deploy|billing|trading|\.git|node_modules)\//);
  }
});

console.log("codex_native_supervised_dry_run_request_intake_contract_static: ok");
