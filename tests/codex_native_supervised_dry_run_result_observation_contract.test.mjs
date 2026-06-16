// BUILD_ID: SUPERVISED_DRY_RUN_RESULT_OBSERVATION_CONTRACTS_20260615
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "SUPERVISED_DRY_RUN_RESULT_OBSERVATION_CONTRACTS_20260615";
const SCHEMA_ID = "lonewolf.codex_native.supervised_dry_run_result_observation.v1";
const TARGET = "supervised_dry_run_result_observation_contracts";
const BASELINE = "0704b5c4a8102a983d668df9829ad6e3e2da2962";
const SOURCE_LINKAGE_SHA = "68C7FD8FCC722364BA08E8C00865F8DE791A738EE8F55C98CE88BBF9E862915D";
const PLANNING_SHA = "477B64DB87B8C8247AA986275CEC9514B62EF531312ECD101DC841B4790E8C68";
const NEXT_REVIEW = "START_SUPERVISED_DRY_RUN_RESULT_OBSERVATION_CONTRACTS_IMPLEMENTATION_REVIEW_PACKET";

const docPath = "docs/orchestration/codex_native_supervised_dry_run_result_observation_contract.md";
const schemaPath = "schema/orchestration/codex_native_supervised_dry_run_result_observation.schema.json";
const testPath = "tests/codex_native_supervised_dry_run_result_observation_contract.test.mjs";
const fixtureRoot = "tests/fixtures/codex-native-supervised-dry-run/result-observation";

const validFixtures = [
  fixtureRoot + "/valid/result_observation_not_started.json",
  fixtureRoot + "/valid/result_observation_blocked_missing_linkage.json",
  fixtureRoot + "/valid/result_observation_draft_ready.json",
  fixtureRoot + "/valid/result_observation_matched_evidence_only.json",
  fixtureRoot + "/valid/result_observation_observed_safe_no_action.json",
  fixtureRoot + "/valid/result_observation_failed_closed.json",
  fixtureRoot + "/valid/result_observation_stop_owner_review_required.json"
];

const invalidFixtures = [
  fixtureRoot + "/invalid/result_observation_runtime_observer_true.json",
  fixtureRoot + "/invalid/result_observation_live_observation_true.json",
  fixtureRoot + "/invalid/result_observation_worker_launch_true.json",
  fixtureRoot + "/invalid/result_observation_queue_mutation_true.json",
  fixtureRoot + "/invalid/result_observation_cloud_api_billing_auth_trading_true.json",
  fixtureRoot + "/invalid/result_observation_auto_go_true.json",
  fixtureRoot + "/invalid/result_observation_stale_baseline.json",
  fixtureRoot + "/invalid/result_observation_artifact_sha_mismatch.json",
  fixtureRoot + "/invalid/result_observation_missing_human_review_one_point.json"
];

const allowedFiles = [
  docPath,
  schemaPath,
  testPath,
  ...validFixtures,
  ...invalidFixtures
];

const boundedAllowlistGuardCompatibilityRepairFiles = [
  "tests/codex_native_handoff_packet_chain_of_custody_contract.test.mjs",
  "tests/codex_native_queue_handoff_dry_run_handoff_contract.test.mjs",
  "tests/codex_native_result_envelope_readonly_consumer_observation_contract.test.mjs",
  "tests/codex_native_stable_closeout_artifact_chain_readiness_contract.test.mjs",
  "tests/codex_native_supervised_dry_run_audit_bundle_reference_contract.test.mjs",
  "tests/codex_native_supervised_dry_run_execution_receipt_contract.test.mjs",
  "tests/codex_native_supervised_dry_run_execution_receipt_to_result_observation_linkage_contract.test.mjs",
  "tests/codex_native_supervised_dry_run_execution_request_envelope_contract.test.mjs",
  "tests/codex_native_supervised_dry_run_owner_decision_receipt_contract.test.mjs",
  "tests/codex_native_supervised_dry_run_owner_review_packet_contract.test.mjs",
  "tests/codex_native_supervised_dry_run_result_envelope_contract.test.mjs",
  "tests/codex_native_supervised_dry_run_result_observation_contract.test.mjs",
  "tests/codex_native_supervised_dry_run_result_observation_to_audit_bundle_linkage_contract.test.mjs"
];

const chainSummaryReferenceImplementationLaneFiles = [
  "docs/orchestration/codex_native_supervised_dry_run_chain_summary_reference_contract.md",
  "schema/orchestration/codex_native_supervised_dry_run_chain_summary_reference.schema.json",
  "tests/codex_native_supervised_dry_run_chain_summary_reference_contract.test.mjs",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/valid/reference-not-started.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/valid/reference-blocked-owner-review-required.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/valid/reference-blocked-missing-owner-review-packet.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/valid/reference-blocked-missing-chain-summary-context.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/valid/reference-draft-context-ready.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/valid/reference-hash-bound-evidence-ready.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/valid/reference-ready-for-human-review.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/valid/reference-failed-closed.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/valid/reference-stop-owner-review-required.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/forbidden-execution-actions-true.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/chain-summary-creation-true.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/owner-review-submission-true.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/audit-bundle-creation-true.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/worker-queue-cloud-mutation-true.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/private-openai-api-true.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/auto-approval-true.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/missing-chain-summary-context.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/missing-owner-review-packet-reference.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/missing-human-review-point.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/mismatched-reference-hash.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/stale-baseline-accepted.json",
  "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference/invalid/ready-treated-as-go.json"
];

const submissionReadinessStaticGapImplementationLaneFiles = [
  "NEXT_CODEX_PROMPT.md",
  "README.md",
  "docs/oss_review/license_readiness.md",
  "docs/oss_review/final_owner_submission_review_guide.md",
  "docs/orchestration/codex_native_submission_readiness_completed_chain_inventory.md",
  "tests/codex_native_submission_readiness_static_gap_contract.test.mjs"
];

const branchLocalDryRunOrchestrationMvpPlanningImplementationLaneFiles = [
  "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_plan.md",
  "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_state_machine.md",
  "schema/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_plan.schema.json",
  "tests/codex_native_branch_local_dry_run_orchestration_mvp_plan_contract.test.mjs",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/valid/mvp-plan-ready.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/valid/mvp-plan-stop-owner-review-required.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/invalid/runtime-go-true.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/invalid/openai-api-call-true.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/invalid/private-api-call-true.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/invalid/auto-approval-true.json"
];


const schema = readJson(schemaPath);
const statuses = schema.properties.result_observation_status.enum;
const evidenceStates = schema.definitions.result_evidence.properties.evidence_state.enum;
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

function validateArtifact(artifact, field, expectedSha, allowMissing, errors) {
  if (!object(artifact)) {
    errors.push(field);
    return;
  }
  if (typeof artifact.artifact_role !== "string" || artifact.artifact_role.length === 0) errors.push(field + ".artifact_role");
  if (allowMissing === false && (typeof artifact.artifact_path !== "string" || artifact.artifact_path.length === 0)) {
    errors.push(field + ".artifact_path");
  }
  if (allowMissing === true && artifact.artifact_path !== null && typeof artifact.artifact_path !== "string") {
    errors.push(field + ".artifact_path");
  }
  if (allowMissing === false && !sha256(artifact.artifact_sha256)) errors.push(field + ".artifact_sha256");
  if (allowMissing === true && artifact.artifact_sha256 !== null && !sha256(artifact.artifact_sha256)) {
    errors.push(field + ".artifact_sha256");
  }
  if (artifact.artifact_sha256 !== null && artifact.artifact_sha256 !== expectedSha) errors.push(field + ".artifact_sha256");
  if (artifact.sha256_matches_expected !== (artifact.artifact_sha256 === expectedSha)) {
    errors.push(field + ".sha256_matches_expected");
  }
  if (artifact.evidence_only !== true) errors.push(field + ".evidence_only");
  if (typeof artifact.authoritative !== "boolean") errors.push(field + ".authoritative");
}

function validateObservation(record) {
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
  if (record.source_linkage_commit !== BASELINE) errors.push("source_linkage_commit");
  if (!statuses.includes(record.result_observation_status)) errors.push("result_observation_status");
  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length === 0) {
    errors.push("human_review_one_point");
  }
  if (record.fail_closed_result !== "STOP_OWNER_REVIEW_REQUIRED") errors.push("fail_closed_result");
  if (!Array.isArray(record.safety_invariants) || record.safety_invariants.length < 20) errors.push("safety_invariants");

  validateArtifact(
    record.source_linkage_artifact,
    "source_linkage_artifact",
    SOURCE_LINKAGE_SHA,
    record.result_observation_status === "RESULT_OBSERVATION_BLOCKED_MISSING_LINKAGE",
    errors
  );
  validateArtifact(record.source_planning_artifact, "source_planning_artifact", PLANNING_SHA, false, errors);

  const evidence = record.result_evidence;
  if (!object(evidence)) {
    errors.push("result_evidence");
  } else {
    if (!evidenceStates.includes(evidence.evidence_state)) errors.push("result_evidence.evidence_state");
    if (evidence.evidence_artifact_sha256 !== null && !sha256(evidence.evidence_artifact_sha256)) {
      errors.push("result_evidence.evidence_artifact_sha256");
    }
    if (evidence.static_bounded_evidence_only !== true) errors.push("result_evidence.static_bounded_evidence_only");
    if (evidence.future_or_static_reference_only !== true) errors.push("result_evidence.future_or_static_reference_only");
    if (evidence.live_observation_performed !== false) errors.push("result_evidence.live_observation_performed");
    if (evidence.runtime_observer_enabled !== false) errors.push("result_evidence.runtime_observer_enabled");
    if (evidence.proof_of_runtime_observation !== false) errors.push("result_evidence.proof_of_runtime_observation");
  }

  for (const field of notGoFlags) if (record.not_go_assertions?.[field] !== true) errors.push("not_go_assertions." + field);

  const next = record.next_action;
  if (!object(next)) {
    errors.push("next_action");
  } else {
    if (!safeNextActions.includes(next.recommended_next_action)) errors.push("next_action.recommended_next_action");
    if (/GO|EXECUTE|QUEUE|DEPLOY|PUSH|COMMIT|RUNTIME|LIVE/iu.test(next.recommended_next_action)) {
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
    const blocked = record.result_observation_status.includes("BLOCKED") ||
      record.result_observation_status.includes("FAILED_CLOSED") ||
      record.result_observation_status === "STOP_OWNER_REVIEW_REQUIRED";
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

test("allowlist contains exactly the 19 approved result observation files", () => {
  assert.equal(allowedFiles.length, 19);
  assert.equal(validFixtures.length, 7);
  assert.equal(invalidFixtures.length, 9);
  assert.equal(allowedFiles.filter((file) => file.startsWith("docs/")).length, 1);
  assert.equal(allowedFiles.filter((file) => file.startsWith("schema/")).length, 1);
  assert.equal(allowedFiles.filter((file) => /^tests\/[^/]+\.test\.mjs$/u.test(file)).length, 1);
  assert.equal(allowedFiles.filter((file) => file.startsWith("tests/fixtures/")).length, 16);
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
  assert.equal(schema.properties.source_linkage_commit.const, BASELINE);
  assert.deepEqual(statuses, [
    "RESULT_OBSERVATION_NOT_STARTED",
    "RESULT_OBSERVATION_BLOCKED_MISSING_LINKAGE",
    "RESULT_OBSERVATION_DRAFT_READY",
    "RESULT_OBSERVATION_MATCHED_EVIDENCE_ONLY",
    "RESULT_OBSERVATION_OBSERVED_SAFE_NO_ACTION",
    "RESULT_OBSERVATION_FAILED_CLOSED",
    "STOP_OWNER_REVIEW_REQUIRED"
  ]);
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

test("documentation states required evidence-only and not-runtime boundaries", () => {
  const doc = readText(docPath);
  for (const phrase of [
    "evidence-only",
    "never executor",
    "never runtime observer",
    "never live observation",
    "not runtime GO",
    "cannot bypass safety gates",
    "cannot bypass owner gates",
    "STOP_OWNER_REVIEW_REQUIRED",
    "Stop and Wait - Owner Review Required"
  ]) {
    assert.match(doc, new RegExp(phrase.replace(/[.*+?^{}()|[\]\\]/gu, "\\$&"), "iu"));
  }
});

test("valid result observation fixtures are accepted and preserve no-runtime assertions", () => {
  const observedStatuses = new Set();
  for (const fixturePath of validFixtures) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, true, fixturePath);
    const errors = validateObservation(fixture.result_observation);
    assert.deepEqual(errors, [], fixturePath + ": " + errors.join(", "));
    observedStatuses.add(fixture.result_observation.result_observation_status);
    for (const field of forbiddenFlags) assert.equal(fixture.result_observation.forbidden_actions[field], false, field);
    for (const field of notGoFlags) assert.equal(fixture.result_observation.not_go_assertions[field], true, field);
    assert.equal(fixture.result_observation.human_review_one_point.length > 0, true);
  }
  assert.deepEqual(observedStatuses, new Set(statuses));
});

test("invalid result observation fixtures fail closed for expected reasons", () => {
  for (const fixturePath of invalidFixtures) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, false, fixturePath);
    const base = clone(readJson(fixtureRoot + "/valid/" + fixture.base_fixture).result_observation);
    setPath(base, fixture.mutation.path, fixture.mutation);
    const errors = validateObservation(base);
    assert.notEqual(errors.length, 0, fixturePath + " should be invalid");
    assert.ok(
      errors.some((error) => error.includes(fixture.expected_error)),
      fixturePath + " expected " + fixture.expected_error + ", got " + errors.join(", ")
    );
  }
});

test("unsafe next actions fail closed", () => {
  const observation = clone(readJson(fixtureRoot + "/valid/result_observation_matched_evidence_only.json").result_observation);
  observation.next_action.recommended_next_action = "GO_EXECUTE_PUSH_DEPLOY";
  observation.next_action.unsafe_next_action_allowed = true;
  const errors = validateObservation(observation);
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

test("working tree changes stay inside the exact 19-file allowlist", () => {
  const result = spawnSync("git", ["status", "--short", "--untracked-files=all"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const changedPaths = result.stdout
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => line.slice(3).replace(/\\/gu, "/"));
  const currentWorkingTreeGuardAllowedFiles = new Set([
    ...allowedFiles,
    ...boundedAllowlistGuardCompatibilityRepairFiles,
    ...chainSummaryReferenceImplementationLaneFiles,
    ...submissionReadinessStaticGapImplementationLaneFiles,
    ...branchLocalDryRunOrchestrationMvpPlanningImplementationLaneFiles
  ]);

  const outside = changedPaths.filter((file) => !currentWorkingTreeGuardAllowedFiles.has(file));
  assert.deepEqual(outside, []);
});

console.log("codex_native_supervised_dry_run_result_observation_contract_static: ok");
