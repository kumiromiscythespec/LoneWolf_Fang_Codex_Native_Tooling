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
const READY = "READY_FOR_REQUEST_INTAKE_REVIEW";
const STOP = "STOP_OWNER_REVIEW_REQUIRED";
const NEXT = "START_REQUEST_INTAKE_APPROVAL_BINDING_IMPLEMENTATION_REVIEW_PACKET";

const requestSchema = readJson("schema/orchestration/codex_native_supervised_dry_run_request_intake.schema.json");
const bindingSchema = readJson("schema/orchestration/codex_native_supervised_dry_run_approval_binding.schema.json");
const fixture = readJson("tests/fixtures/codex-native-supervised-dry-run/request-intake/valid/request_intake_owner_bound_valid.json");
const readyBinding = fixture.approval_binding_records[0];
const blockedBinding = fixture.approval_binding_records[1];

const allowedFiles = fixture.request_intake_records[0].approval_scope.allowed_files;
const invalidFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_stale_approval.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_superseded_approval.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_baseline_mismatch.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_runtime_permission_present.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_queue_mutation_present.json",
  "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_api_cloud_billing_trading_present.json"
];

const forbiddenFlags = Object.keys(bindingSchema.$defs.forbidden_actions.properties);
const blockerRequired = bindingSchema.$defs.blocker.required;

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

function approvalBindingErrors(record) {
  const errors = [];
  for (const field of missingRequired(bindingSchema, record)) errors.push(`missing ${field}`);
  for (const field of unexpectedProperties(bindingSchema, record)) errors.push(`unexpected ${field}`);
  if (errors.length) return errors;

  if (record.schema !== bindingSchema.properties.schema.const) errors.push("bad schema");
  if (record.build_id !== BUILD_ID) errors.push("bad build_id");
  if (typeof record.approval_binding_id !== "string" || record.approval_binding_id.length === 0) errors.push("bad approval_binding_id");
  if (typeof record.request_id !== "string" || record.request_id.length === 0) errors.push("bad request_id");
  if (record.requested_target !== TARGET) errors.push("bad requested target");
  if (record.exact_owner_approval_phrase !== PHRASE) errors.push("bad exact owner approval phrase");
  if (record.stable_baseline !== BASELINE) errors.push("bad stable baseline");
  if (record.expected_branch !== "master") errors.push("bad branch");
  if (record.expected_head !== BASELINE) errors.push("bad expected head");
  if (record.expected_origin_master !== BASELINE) errors.push("bad expected origin");
  if (record.expected_ahead_behind !== "0 / 0") errors.push("bad ahead behind");

  const owner = record.owner_approval;
  if (!owner || typeof owner !== "object") {
    errors.push("missing owner_approval");
  } else {
    if (owner.approval_phrase !== PHRASE) errors.push("bad approval phrase");
    if (owner.approval_target !== TARGET) errors.push("bad approval target");
    if (owner.freshness_status !== "CURRENT") errors.push("stale approval");
    if (owner.supersession_status !== "ACTIVE") errors.push("superseded approval");
    if (owner.approval_current !== true) errors.push("stale approval");
    if (owner.approval_stale !== false) errors.push("stale approval");
    if (owner.approval_superseded !== false) errors.push("superseded approval");
    if (owner.single_use_mutation_approval !== true) errors.push("approval must be single use");
    if (owner.reuse_for_runtime_prohibited !== true) errors.push("runtime reuse not prohibited");
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

  const intake = record.request_intake_reference;
  if (!intake || typeof intake !== "object") {
    errors.push("missing request_intake_reference");
  } else {
    if (intake.request_intake_schema !== requestSchema.properties.schema.const) errors.push("bad request intake schema");
    if (![READY, STOP].includes(intake.request_intake_decision)) errors.push("bad request intake decision");
    if (intake.request_intake_build_id !== BUILD_ID) errors.push("bad request intake build_id");
    if (intake.request_intake_artifact_required !== true) errors.push("missing request intake artifact");
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

function baseBindingFor(kind) {
  return kind === "approval_binding_blocked" ? clone(blockedBinding) : clone(readyBinding);
}

test("approval-binding schema requires exact phrase, freshness, scope, and forbidden false flags", () => {
  assert.equal(bindingSchema.$comment, `BUILD_ID: ${BUILD_ID}`);
  assert.equal(bindingSchema.build_id, BUILD_ID);
  assert.equal(bindingSchema.additionalProperties, false);
  assert.equal(bindingSchema.properties.schema.const, "lonewolf.codex_native.supervised_dry_run_approval_binding.v1");
  assert.equal(bindingSchema.properties.requested_target.const, TARGET);
  assert.equal(bindingSchema.properties.exact_owner_approval_phrase.const, PHRASE);
  assert.equal(bindingSchema.properties.stable_baseline.const, BASELINE);
  assert.equal(bindingSchema.properties.expected_head.const, BASELINE);
  assert.equal(bindingSchema.properties.expected_origin_master.const, BASELINE);
  assert.equal(bindingSchema.properties.expected_ahead_behind.const, "0 / 0");
  assert.equal(bindingSchema.$defs.owner_approval.properties.approval_phrase.const, PHRASE);
  assert.equal(bindingSchema.$defs.owner_approval.properties.approval_target.const, TARGET);
  assert.equal(bindingSchema.$defs.owner_approval.properties.freshness_status.const, "CURRENT");
  assert.equal(bindingSchema.$defs.owner_approval.properties.supersession_status.const, "ACTIVE");
  assert.equal(bindingSchema.$defs.approval_scope.properties.exact_file_allowlist_count.const, 14);
  assert.equal(bindingSchema.$defs.approval_scope.properties.allowed_files.minItems, 14);
  assert.equal(bindingSchema.$defs.approval_scope.properties.allowed_files.maxItems, 14);
  for (const flag of forbiddenFlags) {
    assert.equal(bindingSchema.$defs.forbidden_actions.properties[flag].const, false, `${flag} must be const false`);
  }
});

test("valid approval-binding fixtures include ready and explicit fail-closed records", () => {
  assert.equal(fixture.build_id, BUILD_ID);
  assert.equal(fixture.approval_binding_records.length, 2);
  assert.deepEqual(approvalBindingErrors(readyBinding), []);
  assert.deepEqual(approvalBindingErrors(blockedBinding), []);
  assert.equal(readyBinding.fail_closed_decision, READY);
  assert.equal(blockedBinding.fail_closed_decision, STOP);
});

test("invalid approval-binding fixture matrix fails closed", () => {
  for (const fixturePath of invalidFixturePaths) {
    const invalidFixture = readJson(fixturePath);
    assert.equal(invalidFixture.build_id, BUILD_ID);
    for (const invalidCase of invalidFixture.invalid_cases) {
      if (invalidCase.record_kind !== "approval_binding" && invalidCase.record_kind !== "approval_binding_blocked") continue;
      const record = baseBindingFor(invalidCase.record_kind);
      setPath(record, invalidCase.mutation.path, invalidCase.mutation);
      const errors = approvalBindingErrors(record);
      assert.ok(errors.some((error) => error.includes(invalidCase.expected_error)), `${invalidCase.case_id} expected ${invalidCase.expected_error}, got ${errors.join(", ")}`);
    }
  }
});

test("unsafe true flags appear only in invalid fixtures and are rejected", () => {
  const validText = readText("tests/fixtures/codex-native-supervised-dry-run/request-intake/valid/request_intake_owner_bound_valid.json");
  assert.doesNotMatch(validText, /\"runtime_execution_allowed\"\\s*:\\s*true/);
  assert.doesNotMatch(validText, /\"queue_mutation_allowed\"\\s*:\\s*true/);
  assert.doesNotMatch(validText, /\"billing_mutation_allowed\"\\s*:\\s*true/);
  for (const fixturePath of [
    "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_runtime_permission_present.json",
    "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_queue_mutation_present.json",
    "tests/fixtures/codex-native-supervised-dry-run/request-intake/invalid/request_intake_api_cloud_billing_trading_present.json"
  ]) {
    const invalidText = readText(fixturePath);
    assert.match(invalidText, /"value"\s*:\s*true/, `${fixturePath} should contain unsafe true mutation evidence`);
  }
});

test("approval binding docs do not grant runtime or external mutation permission", () => {
  for (const docPath of [
    "docs/orchestration/codex_native_supervised_dry_run_request_intake_contract.md",
    "docs/orchestration/codex_native_supervised_dry_run_approval_binding_contract.md",
    "docs/orchestration/codex_native_supervised_dry_run_request_blocker_matrix.md"
  ]) {
    const text = readText(docPath);
    assert.ok(text.startsWith(`<!-- BUILD_ID: ${BUILD_ID} -->`), `${docPath} missing BUILD_ID`);
    assert.match(text, /owner approval/i);
    assert.match(text, /superseded|supersession/i);
    assert.match(text, /Queue/i);
    assert.match(text, /STOP_OWNER_REVIEW_REQUIRED|fail closed|fail-closed/i);
    assert.doesNotMatch(text, /runtime_execution_allowed`?\\s+equal to true/i);
    assert.doesNotMatch(text, /queue_mutation_allowed`?\\s+equal to true/i);
  }
});

console.log("codex_native_supervised_dry_run_approval_binding_contract_static: ok");
