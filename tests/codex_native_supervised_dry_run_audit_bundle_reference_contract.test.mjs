// BUILD_ID: SUPERVISED_DRY_RUN_AUDIT_BUNDLE_REFERENCE_CONTRACTS_20260615
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "SUPERVISED_DRY_RUN_AUDIT_BUNDLE_REFERENCE_CONTRACTS_20260615";
const SCHEMA_ID = "lonewolf.codex_native.supervised_dry_run_audit_bundle_reference.v1";
const TARGET = "supervised_dry_run_audit_bundle_reference_contracts";
const BASELINE = "6f0b35c890480428b0edc4d51f115adbefd0827e";
const LINKAGE_CLOSEOUT_SHA = "9162D998D94716B65B308FFC4D0B40D8E3F58891FB9954CEA8AF414E3DAAD948";
const PLANNING_SHA = "821FB5BD23374778E9083E45BBBFF5C92D12F53025A4ED64675419A86D0F3ABB";
const NEXT_REVIEW = "START_SUPERVISED_DRY_RUN_AUDIT_BUNDLE_REFERENCE_CONTRACTS_IMPLEMENTATION_REVIEW_PACKET";
const PLANNING_PATH =
  "C:/Users/yu_ki/AppData/Local/LoneWolfFang/data/codex_native_next_safe_parallel_wave_after_supervised_dry_run_result_observation_to_audit_bundle_linkage_planning_packet_20260615_191856.zip";
const LINKAGE_CLOSEOUT_PATH =
  "C:/Users/yu_ki/AppData/Local/LoneWolfFang/data/codex_native_supervised_dry_run_result_observation_to_audit_bundle_linkage_post_push_closeout_packet_20260615_190921.zip";
const FUTURE_AUDIT_BUNDLE_PATH =
  "C:/Users/yu_ki/AppData/Local/LoneWolfFang/data/future_static_supervised_dry_run_audit_bundle_packet.zip";
const FUTURE_AUDIT_BUNDLE_SHA = "A1B2C3D4E5F60718293A4B5C6D7E8F90123456789ABCDEF0A1B2C3D4E5F60718";

const docPath = "docs/orchestration/codex_native_supervised_dry_run_audit_bundle_reference_contract.md";
const schemaPath = "schema/orchestration/codex_native_supervised_dry_run_audit_bundle_reference.schema.json";
const testPath = "tests/codex_native_supervised_dry_run_audit_bundle_reference_contract.test.mjs";
const fixtureRoot = "tests/fixtures/codex-native-supervised-dry-run/audit-bundle-reference";

const validFixtures = [
  fixtureRoot + "/valid/audit_bundle_reference_not_started.json",
  fixtureRoot + "/valid/audit_bundle_reference_blocked_owner_review_required.json",
  fixtureRoot + "/valid/audit_bundle_reference_blocked_missing_linkage.json",
  fixtureRoot + "/valid/audit_bundle_reference_blocked_linkage_unsafe.json",
  fixtureRoot + "/valid/audit_bundle_reference_blocked_baseline_mismatch.json",
  fixtureRoot + "/valid/audit_bundle_reference_draft_ready.json",
  fixtureRoot + "/valid/audit_bundle_reference_matched_evidence_only.json",
  fixtureRoot + "/valid/audit_bundle_reference_ready.json",
  fixtureRoot + "/valid/audit_bundle_reference_failed_closed.json",
  fixtureRoot + "/valid/audit_bundle_reference_stop_owner_review_required.json"
];

const invalidFixtures = [
  fixtureRoot + "/invalid/audit_bundle_reference_runtime_creation_true.json",
  fixtureRoot + "/invalid/audit_bundle_reference_live_observation_true.json",
  fixtureRoot + "/invalid/audit_bundle_reference_worker_launch_true.json",
  fixtureRoot + "/invalid/audit_bundle_reference_queue_mutation_true.json",
  fixtureRoot + "/invalid/audit_bundle_reference_cloud_api_billing_auth_trading_true.json",
  fixtureRoot + "/invalid/audit_bundle_reference_auto_go_true.json",
  fixtureRoot + "/invalid/audit_bundle_reference_stale_baseline.json",
  fixtureRoot + "/invalid/audit_bundle_reference_missing_human_review_one_point.json"
];

const allowedFiles = [
  docPath,
  schemaPath,
  testPath,
  ...validFixtures,
  ...invalidFixtures
];

const schema = readJson(schemaPath);
const statuses = schema.properties.audit_bundle_reference_status.enum;
const referenceKinds = schema.definitions.audit_bundle_reference.properties.reference_kind.enum;
const forbiddenFlags = Object.keys(schema.definitions.forbidden_actions.properties);
const notGoFlags = Object.keys(schema.definitions.not_go_assertions.properties);
const safeNextActions = schema.definitions.next_action.properties.recommended_next_action.enum;

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
  return typeof value === "string" && /^[A-F0-9]{64}$/u.test(value);
}

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function buildRecord(fixture) {
  const linkagePresent = fixture.linkage_present === true;
  const artifactPath = fixture.audit_bundle_artifact_path === "FUTURE_AUDIT_BUNDLE_PATH"
    ? FUTURE_AUDIT_BUNDLE_PATH
    : fixture.audit_bundle_artifact_path;
  const artifactSha = fixture.audit_bundle_artifact_sha256 === "FUTURE_AUDIT_BUNDLE_SHA"
    ? FUTURE_AUDIT_BUNDLE_SHA
    : fixture.audit_bundle_artifact_sha256;
  const blockerStatus = fixture.blocker_status || "PASS";
  return {
    schema: SCHEMA_ID,
    build_id: BUILD_ID,
    reference_id: fixture.case_id,
    reference_created_at_utc: "2026-06-15T00:00:00Z",
    target: TARGET,
    target_repo: "C:/LoneWolf_Fang_Project/repos/core/LoneWolf_Fang_Codex_Native_Tooling",
    branch: "master",
    baseline_commit: BASELINE,
    local_origin_master: BASELINE,
    ahead_behind: "0 / 0",
    source_result_observation_to_audit_bundle_linkage_commit: BASELINE,
    source_planning_artifact: {
      artifact_role: "planning_evidence",
      artifact_path: PLANNING_PATH,
      artifact_sha256: PLANNING_SHA,
      sha256_matches_expected: true,
      evidence_only: true,
      authoritative: true
    },
    source_linkage_closeout: {
      artifact_role: "source_result_observation_to_audit_bundle_linkage_post_push_closeout",
      artifact_path: LINKAGE_CLOSEOUT_PATH,
      artifact_sha256: LINKAGE_CLOSEOUT_SHA,
      sha256_matches_expected: true,
      evidence_only: true,
      authoritative: true
    },
    linkage_reference: {
      linkage_present: linkagePresent,
      linkage_status: fixture.linkage_status,
      linkage_artifact_path: linkagePresent ? LINKAGE_CLOSEOUT_PATH : null,
      linkage_artifact_sha256: linkagePresent ? LINKAGE_CLOSEOUT_SHA : null,
      linkage_artifact_sha256_matches_expected: linkagePresent,
      safe_for_reference: fixture.linkage_safe_for_reference,
      evidence_only: true
    },
    audit_bundle_reference: {
      reference_kind: fixture.reference_kind,
      audit_bundle_artifact_path: artifactPath,
      audit_bundle_artifact_sha256: artifactSha,
      audit_bundle_artifact_sha256_matches_expected: fixture.audit_bundle_artifact_sha256_matches_expected,
      static_reference_only: true,
      future_reference_only: true,
      audit_bundle_created: false,
      runtime_audit_bundle_creation_performed: false,
      live_observation_performed: false,
      proof_of_live_audit_bundle: false
    },
    baseline_check: {
      expected_baseline_commit: BASELINE,
      observed_baseline_commit: fixture.observed_baseline_commit,
      baseline_matches_expected: fixture.baseline_matches_expected
    },
    audit_bundle_reference_status: fixture.status,
    not_go_assertions: fixture.not_go_assertions,
    next_action: {
      recommended_next_action: fixture.next_action,
      bounded_and_safe: true,
      owner_gate_required: true,
      unsafe_next_action_allowed: false
    },
    forbidden_actions: fixture.forbidden_actions,
    blocker_matrix: [
      {
        blocker: fixture.blocker,
        status: blockerStatus,
        resolution: fixture.resolution,
        allows_progression: blockerStatus === "PASS"
      }
    ],
    human_review_one_point: fixture.human_review_one_point,
    fail_closed_result: "STOP_OWNER_REVIEW_REQUIRED",
    safety_invariants: Object.keys(fixture.not_go_assertions)
  };
}

function validateArtifact(artifact, field, expectedSha, errors) {
  if (!object(artifact)) {
    errors.push(field);
    return;
  }
  if (typeof artifact.artifact_role !== "string" || artifact.artifact_role.length === 0) errors.push(field + ".artifact_role");
  if (typeof artifact.artifact_path !== "string" || artifact.artifact_path.length === 0) errors.push(field + ".artifact_path");
  if (!sha256(artifact.artifact_sha256)) errors.push(field + ".artifact_sha256");
  if (artifact.artifact_sha256 !== expectedSha) errors.push(field + ".artifact_sha256");
  if (artifact.sha256_matches_expected !== true) errors.push(field + ".sha256_matches_expected");
  if (artifact.evidence_only !== true) errors.push(field + ".evidence_only");
  if (typeof artifact.authoritative !== "boolean") errors.push(field + ".authoritative");
}

function validateReference(record) {
  const errors = [];
  const allowed = new Set(Object.keys(schema.properties));

  for (const field of schema.required) if (!Object.hasOwn(record, field)) errors.push("missing " + field);
  for (const field of Object.keys(record)) if (!allowed.has(field)) errors.push("unexpected " + field);
  if (errors.length > 0) return errors;

  if (record.schema !== SCHEMA_ID) errors.push("schema");
  if (record.build_id !== BUILD_ID) errors.push("build_id");
  if (record.target !== TARGET) errors.push("target");
  if (record.branch !== "master") errors.push("branch");
  if (record.baseline_commit !== BASELINE) errors.push("baseline_commit");
  if (record.local_origin_master !== BASELINE) errors.push("local_origin_master");
  if (record.ahead_behind !== "0 / 0") errors.push("ahead_behind");
  if (record.source_result_observation_to_audit_bundle_linkage_commit !== BASELINE) {
    errors.push("source_result_observation_to_audit_bundle_linkage_commit");
  }
  if (!statuses.includes(record.audit_bundle_reference_status)) errors.push("audit_bundle_reference_status");
  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length === 0) {
    errors.push("human_review_one_point");
  }
  if (record.fail_closed_result !== "STOP_OWNER_REVIEW_REQUIRED") errors.push("fail_closed_result");
  if (!Array.isArray(record.safety_invariants) || record.safety_invariants.length < 25) errors.push("safety_invariants");

  validateArtifact(record.source_planning_artifact, "source_planning_artifact", PLANNING_SHA, errors);
  validateArtifact(record.source_linkage_closeout, "source_linkage_closeout", LINKAGE_CLOSEOUT_SHA, errors);

  const linkage = record.linkage_reference;
  if (!object(linkage)) {
    errors.push("linkage_reference");
  } else {
    if (typeof linkage.linkage_present !== "boolean") errors.push("linkage_reference.linkage_present");
    if (typeof linkage.linkage_status !== "string" || linkage.linkage_status.length === 0) {
      errors.push("linkage_reference.linkage_status");
    }
    if (linkage.linkage_present === true) {
      if (typeof linkage.linkage_artifact_path !== "string" || linkage.linkage_artifact_path.length === 0) {
        errors.push("linkage_reference.linkage_artifact_path");
      }
      if (linkage.linkage_artifact_sha256 !== LINKAGE_CLOSEOUT_SHA) errors.push("linkage_reference.linkage_artifact_sha256");
      if (linkage.linkage_artifact_sha256_matches_expected !== true) {
        errors.push("linkage_reference.linkage_artifact_sha256_matches_expected");
      }
    }
    if (linkage.linkage_present === false && linkage.linkage_artifact_sha256 !== null) {
      errors.push("linkage_reference.linkage_artifact_sha256");
    }
    if (typeof linkage.safe_for_reference !== "boolean") errors.push("linkage_reference.safe_for_reference");
    if (linkage.evidence_only !== true) errors.push("linkage_reference.evidence_only");
    if (record.audit_bundle_reference_status === "AUDIT_BUNDLE_REFERENCE_BLOCKED_MISSING_LINKAGE" &&
      linkage.linkage_present !== false) {
      errors.push("linkage_reference.linkage_present");
    }
    if (record.audit_bundle_reference_status === "AUDIT_BUNDLE_REFERENCE_BLOCKED_LINKAGE_UNSAFE" &&
      linkage.safe_for_reference !== false) {
      errors.push("linkage_reference.safe_for_reference");
    }
  }

  const auditRef = record.audit_bundle_reference;
  if (!object(auditRef)) {
    errors.push("audit_bundle_reference");
  } else {
    if (!referenceKinds.includes(auditRef.reference_kind)) errors.push("audit_bundle_reference.reference_kind");
    if (record.audit_bundle_reference_status === "AUDIT_BUNDLE_REFERENCE_READY" &&
      typeof auditRef.audit_bundle_artifact_path !== "string") {
      errors.push("audit_bundle_reference.audit_bundle_artifact_path");
    }
    if (auditRef.audit_bundle_artifact_sha256 !== null && !sha256(auditRef.audit_bundle_artifact_sha256)) {
      errors.push("audit_bundle_reference.audit_bundle_artifact_sha256");
    }
    if (auditRef.static_reference_only !== true) errors.push("audit_bundle_reference.static_reference_only");
    if (auditRef.future_reference_only !== true) errors.push("audit_bundle_reference.future_reference_only");
    if (auditRef.audit_bundle_created !== false) errors.push("audit_bundle_reference.audit_bundle_created");
    if (auditRef.runtime_audit_bundle_creation_performed !== false) {
      errors.push("audit_bundle_reference.runtime_audit_bundle_creation_performed");
    }
    if (auditRef.live_observation_performed !== false) errors.push("audit_bundle_reference.live_observation_performed");
    if (auditRef.proof_of_live_audit_bundle !== false) errors.push("audit_bundle_reference.proof_of_live_audit_bundle");
  }

  const baselineCheck = record.baseline_check;
  if (!object(baselineCheck)) {
    errors.push("baseline_check");
  } else {
    if (baselineCheck.expected_baseline_commit !== BASELINE) errors.push("baseline_check.expected_baseline_commit");
    if (typeof baselineCheck.observed_baseline_commit !== "string" || baselineCheck.observed_baseline_commit.length === 0) {
      errors.push("baseline_check.observed_baseline_commit");
    }
    if (typeof baselineCheck.baseline_matches_expected !== "boolean") errors.push("baseline_check.baseline_matches_expected");
    if (record.audit_bundle_reference_status === "AUDIT_BUNDLE_REFERENCE_BLOCKED_BASELINE_MISMATCH") {
      if (baselineCheck.baseline_matches_expected !== false) errors.push("baseline_check.baseline_matches_expected");
    } else if (baselineCheck.baseline_matches_expected !== true) {
      errors.push("baseline_check.baseline_matches_expected");
    }
  }

  for (const field of notGoFlags) if (record.not_go_assertions?.[field] !== true) errors.push("not_go_assertions." + field);

  const next = record.next_action;
  if (!object(next)) {
    errors.push("next_action");
  } else {
    if (!safeNextActions.includes(next.recommended_next_action)) errors.push("next_action.recommended_next_action");
    if (/GO|EXECUTE|QUEUE|DEPLOY|PUSH|COMMIT|RUNTIME|LIVE|CREATE/iu.test(next.recommended_next_action)) {
      errors.push("next_action.unsafe_recommended_next_action");
    }
    if (next.bounded_and_safe !== true) errors.push("next_action.bounded_and_safe");
    if (next.owner_gate_required !== true) errors.push("next_action.owner_gate_required");
    if (next.unsafe_next_action_allowed !== false) errors.push("next_action.unsafe_next_action_allowed");
  }

  for (const field of forbiddenFlags) if (record.forbidden_actions?.[field] !== false) errors.push("forbidden_actions." + field);

  if (!Array.isArray(record.blocker_matrix) || record.blocker_matrix.length === 0) {
    errors.push("blocker_matrix");
  } else {
    const activeRows = record.blocker_matrix.filter((row) => row.status !== "PASS");
    const blocked = record.audit_bundle_reference_status.includes("BLOCKED") ||
      record.audit_bundle_reference_status.includes("FAILED_CLOSED") ||
      record.audit_bundle_reference_status === "STOP_OWNER_REVIEW_REQUIRED";
    if (blocked && activeRows.length === 0) errors.push("blocker_matrix.missing_active_blocker");
    if (!blocked && activeRows.length !== 0) errors.push("blocker_matrix.unexpected_active_blocker");
    for (const row of record.blocker_matrix) {
      if (typeof row.blocker !== "string" || row.blocker.length === 0) errors.push("blocker_matrix.blocker");
      if (!["PASS", "BLOCKED", "REJECTED", "OWNER_REVIEW_REQUIRED"].includes(row.status)) errors.push("blocker_matrix.status");
      if (typeof row.resolution !== "string" || row.resolution.length === 0) errors.push("blocker_matrix.resolution");
      if (typeof row.allows_progression !== "boolean") errors.push("blocker_matrix.allows_progression");
      if (row.status !== "PASS" && row.allows_progression !== false) errors.push("blocker_matrix.allows_progression");
    }
  }

  return errors;
}

test("allowlist contains exactly the 21 approved audit bundle reference files", () => {
  assert.equal(allowedFiles.length, 21);
  assert.equal(validFixtures.length, 10);
  assert.equal(invalidFixtures.length, 8);
  assert.equal(allowedFiles.filter((file) => file.startsWith("docs/")).length, 1);
  assert.equal(allowedFiles.filter((file) => file.startsWith("schema/")).length, 1);
  assert.equal(allowedFiles.filter((file) => /^tests\/[^/]+\.test\.mjs$/u.test(file)).length, 1);
  assert.equal(allowedFiles.filter((file) => file.startsWith("tests/fixtures/")).length, 18);
  for (const file of allowedFiles) {
    assert.doesNotThrow(() => readText(file), file + " should exist");
    assert.doesNotMatch(file, /\*/u);
    assert.doesNotMatch(file, /^(src|tools|scripts|runtime|worker|cloud|deploy|billing|trading|\.git|node_modules)\//u);
  }
});

test("schema pins build, baseline, statuses, source hashes, and false-only safety flags", () => {
  assert.equal(schema.schema_id, SCHEMA_ID);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additional_properties_allowed, false);
  assert.equal(schema.properties.schema.const, SCHEMA_ID);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.baseline_commit.const, BASELINE);
  assert.equal(schema.properties.local_origin_master.const, BASELINE);
  assert.equal(schema.properties.source_result_observation_to_audit_bundle_linkage_commit.const, BASELINE);
  assert.deepEqual(statuses, [
    "AUDIT_BUNDLE_REFERENCE_NOT_STARTED",
    "AUDIT_BUNDLE_REFERENCE_BLOCKED_OWNER_REVIEW_REQUIRED",
    "AUDIT_BUNDLE_REFERENCE_BLOCKED_MISSING_LINKAGE",
    "AUDIT_BUNDLE_REFERENCE_BLOCKED_LINKAGE_UNSAFE",
    "AUDIT_BUNDLE_REFERENCE_BLOCKED_BASELINE_MISMATCH",
    "AUDIT_BUNDLE_REFERENCE_DRAFT_READY",
    "AUDIT_BUNDLE_REFERENCE_MATCHED_EVIDENCE_ONLY",
    "AUDIT_BUNDLE_REFERENCE_READY",
    "AUDIT_BUNDLE_REFERENCE_FAILED_CLOSED",
    "STOP_OWNER_REVIEW_REQUIRED"
  ]);
  assert.equal(referenceKinds.includes("AUDIT_BUNDLE_REFERENCE_READY"), true);
  for (const field of forbiddenFlags) assert.equal(schema.definitions.forbidden_actions.properties[field].const, false, field);
  for (const field of notGoFlags) assert.equal(schema.definitions.not_go_assertions.properties[field].const, true, field);
});

test("BUILD_ID appears in schema, test, doc, and fixtures", () => {
  assert.equal(schema.build_id, BUILD_ID);
  assert.ok(readText(testPath).startsWith("// BUILD_ID: " + BUILD_ID));
  assert.ok(readText(docPath).startsWith("# BUILD_ID: " + BUILD_ID));
  for (const fixturePath of [...validFixtures, ...invalidFixtures]) {
    assert.equal(readJson(fixturePath).build_id, BUILD_ID, fixturePath);
  }
});

test("documentation states required evidence-only, not-runtime, and no-bundle boundaries", () => {
  const doc = readText(docPath);
  for (const phrase of [
    "evidence-only",
    "never executor",
    "never runtime observer",
    "never live observation",
    "never audit bundle creator",
    "not runtime GO",
    "does not create an audit bundle",
    "cannot bypass safety gates",
    "cannot bypass owner gates",
    "STOP_OWNER_REVIEW_REQUIRED",
    "Stop and Wait - Owner Review Required"
  ]) {
    assert.match(doc, new RegExp(phrase.replace(/[.*+?^{}()|[\]\\]/gu, "\\$&"), "iu"));
  }
});

test("valid audit bundle reference fixtures are accepted and preserve no-runtime assertions", () => {
  const observedStatuses = new Set();
  for (const fixturePath of validFixtures) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, true, fixturePath);
    const record = buildRecord(fixture);
    const errors = validateReference(record);
    assert.deepEqual(errors, [], fixturePath + ": " + errors.join(", "));
    observedStatuses.add(record.audit_bundle_reference_status);
    for (const field of forbiddenFlags) assert.equal(record.forbidden_actions[field], false, field);
    for (const field of notGoFlags) assert.equal(record.not_go_assertions[field], true, field);
    assert.equal(record.human_review_one_point.length > 0, true);
  }
  assert.deepEqual(observedStatuses, new Set(statuses));
});

test("invalid audit bundle reference fixtures fail closed for expected reasons", () => {
  for (const fixturePath of invalidFixtures) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, false, fixturePath);
    const base = clone(buildRecord(readJson(fixtureRoot + "/valid/" + fixture.base_fixture)));
    setPath(base, fixture.mutation.path, fixture.mutation);
    const errors = validateReference(base);
    assert.notEqual(errors.length, 0, fixturePath + " should be invalid");
    assert.ok(
      errors.some((error) => error.includes(fixture.expected_error)),
      fixturePath + " expected " + fixture.expected_error + ", got " + errors.join(", ")
    );
  }
});

test("unsafe next actions fail closed", () => {
  const record = clone(buildRecord(readJson(fixtureRoot + "/valid/audit_bundle_reference_matched_evidence_only.json")));
  record.next_action.recommended_next_action = "GO_EXECUTE_CREATE_AUDIT_BUNDLE";
  record.next_action.unsafe_next_action_allowed = true;
  const errors = validateReference(record);
  assert.ok(errors.includes("next_action.recommended_next_action"));
  assert.ok(errors.includes("next_action.unsafe_recommended_next_action"));
  assert.ok(errors.includes("next_action.unsafe_next_action_allowed"));
});

test("fixtures avoid secret-like or raw-auth placeholders", () => {
  const badPattern = /api[_-]?key|secret|credential|password|raw[_-]?auth|bearer|private[_-]?key|production[_-]?db/iu;
  for (const fixturePath of [...validFixtures, ...invalidFixtures]) {
    assert.doesNotMatch(readText(fixturePath), badPattern, fixturePath);
  }
});

test("working tree changes stay inside the exact 21-file allowlist", () => {
  const result = spawnSync("git", ["status", "--short", "--untracked-files=all"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const changedPaths = result.stdout
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => line.slice(3).replace(/\\/gu, "/"));
  const outside = changedPaths.filter((file) => !allowedFiles.includes(file));
  assert.deepEqual(outside, []);
});

console.log("codex_native_supervised_dry_run_audit_bundle_reference_contract_static: ok");
