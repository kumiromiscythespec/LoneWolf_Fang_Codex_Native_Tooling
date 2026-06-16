// BUILD_ID: SUPERVISED_DRY_RUN_EXECUTION_RECEIPT_TO_RESULT_OBSERVATION_LINKAGE_CONTRACTS_20260615
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "SUPERVISED_DRY_RUN_EXECUTION_RECEIPT_TO_RESULT_OBSERVATION_LINKAGE_CONTRACTS_20260615";
const SCHEMA_ID = "lonewolf.codex_native.supervised_dry_run_execution_receipt_to_result_observation_linkage.v1";
const TARGET = "supervised_dry_run_execution_receipt_to_result_observation_linkage_contracts";
const BASELINE = "ba83087934a2a7c713f1dc1cf3682390daedec5a";
const SOURCE_CLOSEOUT_SHA = "73D591B549B9424363BBE8598A2172E43164B4C5804EFD041D447FF27CE540EC";
const PLANNING_SHA = "74506243F335FFF6D7E3627839911161C9E8B02D746E14171400E1D7FAC70E63";
const NEXT_REVIEW = "START_SUPERVISED_DRY_RUN_EXECUTION_RECEIPT_TO_RESULT_OBSERVATION_LINKAGE_IMPLEMENTATION_REVIEW_PACKET";

const docPath = "docs/orchestration/codex_native_supervised_dry_run_execution_receipt_to_result_observation_linkage_contract.md";
const schemaPath = "schema/orchestration/codex_native_supervised_dry_run_execution_receipt_to_result_observation_linkage.schema.json";
const testPath = "tests/codex_native_supervised_dry_run_execution_receipt_to_result_observation_linkage_contract.test.mjs";
const fixtureRoot = "tests/fixtures/codex-native-supervised-dry-run/execution-receipt-to-result-observation-linkage";

const validFixtures = [
  fixtureRoot + "/valid/linkage_not_started.json",
  fixtureRoot + "/valid/linkage_blocked_owner_review_required.json",
  fixtureRoot + "/valid/linkage_blocked_missing_execution_receipt.json",
  fixtureRoot + "/valid/linkage_blocked_execution_receipt_unsafe.json",
  fixtureRoot + "/valid/linkage_blocked_baseline_mismatch.json",
  fixtureRoot + "/valid/linkage_draft_ready.json",
  fixtureRoot + "/valid/linkage_matched_evidence_only.json",
  fixtureRoot + "/valid/linkage_observed_safe_no_action.json",
  fixtureRoot + "/valid/linkage_failed_closed.json",
  fixtureRoot + "/valid/linkage_stop_owner_review_required.json"
];

const invalidFixtures = [
  fixtureRoot + "/invalid/linkage_runtime_observation_true.json",
  fixtureRoot + "/invalid/linkage_worker_launch_true.json",
  fixtureRoot + "/invalid/linkage_queue_mutation_true.json",
  fixtureRoot + "/invalid/linkage_cloud_api_billing_auth_trading_true.json",
  fixtureRoot + "/invalid/linkage_auto_go_true.json",
  fixtureRoot + "/invalid/linkage_stale_baseline.json",
  fixtureRoot + "/invalid/linkage_artifact_sha_mismatch.json",
  fixtureRoot + "/invalid/linkage_missing_human_review_one_point.json"
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

const branchLocalDryRunOrchestrationMvpStaticExecutionImplementationLaneFiles = [
  "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_static_execution_contracts.md",
  "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_static_execution_state_trace.md",
  "schema/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_static_execution.schema.json",
  "tests/codex_native_branch_local_dry_run_orchestration_mvp_static_execution_contract.test.mjs",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/valid/static-execution-ready.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/valid/static-execution-stop-owner-review-required.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/runtime-go-true.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/openai-api-call-true.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/private-api-call-true.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/queue-mutation-true.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/cloud-mutation-true.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/trading-mutation-true.json",
  "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/auto-approval-true.json"
];


const schema = readJson(schemaPath);
const statuses = schema.properties.linkage_status.enum;
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

function validateArtifact(artifact, field, errors) {
  if (!object(artifact)) {
    errors.push(field);
    return;
  }
  if (typeof artifact.artifact_role !== "string" || artifact.artifact_role.length === 0) errors.push(field + ".artifact_role");
  if (typeof artifact.artifact_path !== "string" || artifact.artifact_path.length === 0) errors.push(field + ".artifact_path");
  if (!sha256(artifact.artifact_sha256)) errors.push(field + ".artifact_sha256");
  if (artifact.sha256_matches_expected !== true) errors.push(field + ".sha256_matches_expected");
  if (artifact.evidence_only !== true) errors.push(field + ".evidence_only");
  if (typeof artifact.authoritative !== "boolean") errors.push(field + ".authoritative");
}

function validateLinkage(linkage) {
  const errors = [];
  const allowed = new Set(Object.keys(schema.properties));

  for (const field of schema.required) if (!Object.hasOwn(linkage, field)) errors.push("missing " + field);
  for (const field of Object.keys(linkage)) if (!allowed.has(field)) errors.push("unexpected " + field);
  if (errors.length > 0) return errors;

  if (linkage.schema !== SCHEMA_ID) errors.push("schema");
  if (linkage.build_id !== BUILD_ID) errors.push("build_id");
  if (linkage.target !== TARGET) errors.push("target");
  if (linkage.branch !== "master") errors.push("branch");
  if (linkage.baseline_commit !== BASELINE) errors.push("baseline_commit");
  if (linkage.local_origin_master !== BASELINE) errors.push("local_origin_master");
  if (linkage.ahead_behind !== "0 / 0") errors.push("ahead_behind");
  if (linkage.source_execution_receipt_commit !== BASELINE) errors.push("source_execution_receipt_commit");
  if (!statuses.includes(linkage.linkage_status)) errors.push("linkage_status");
  if (typeof linkage.human_review_one_point !== "string" || linkage.human_review_one_point.length === 0) {
    errors.push("human_review_one_point");
  }
  if (linkage.fail_closed_result !== "STOP_OWNER_REVIEW_REQUIRED") errors.push("fail_closed_result");
  if (!Array.isArray(linkage.safety_invariants) || linkage.safety_invariants.length < 20) errors.push("safety_invariants");

  validateArtifact(linkage.planning_artifact, "planning_artifact", errors);
  if (object(linkage.planning_artifact) && linkage.planning_artifact.artifact_sha256 !== PLANNING_SHA) {
    errors.push("planning_artifact.artifact_sha256");
  }

  const receipt = linkage.source_execution_receipt;
  if (!object(receipt)) {
    errors.push("source_execution_receipt");
  } else {
    if (typeof receipt.receipt_present !== "boolean") errors.push("source_execution_receipt.receipt_present");
    if (typeof receipt.receipt_status !== "string" || receipt.receipt_status.length === 0) errors.push("source_execution_receipt.receipt_status");
    if (receipt.receipt_present === true) {
      if (typeof receipt.receipt_artifact_path !== "string" || receipt.receipt_artifact_path.length === 0) {
        errors.push("source_execution_receipt.receipt_artifact_path");
      }
      if (!sha256(receipt.receipt_artifact_sha256)) errors.push("source_execution_receipt.receipt_artifact_sha256");
      if (receipt.receipt_artifact_sha256_matches_expected !== true) {
        errors.push("source_execution_receipt.receipt_artifact_sha256_matches_expected");
      }
    }
    if (receipt.source_execution_receipt_post_push_closeout_sha256 !== SOURCE_CLOSEOUT_SHA) {
      errors.push("source_execution_receipt.source_execution_receipt_post_push_closeout_sha256");
    }
    if (typeof receipt.safe_for_linkage !== "boolean") errors.push("source_execution_receipt.safe_for_linkage");
    if (receipt.evidence_only !== true) errors.push("source_execution_receipt.evidence_only");
    if (linkage.linkage_status === "LINKAGE_BLOCKED_MISSING_EXECUTION_RECEIPT" && receipt.receipt_present !== false) {
      errors.push("source_execution_receipt.receipt_present");
    }
    if (linkage.linkage_status === "LINKAGE_BLOCKED_EXECUTION_RECEIPT_UNSAFE" && receipt.safe_for_linkage !== false) {
      errors.push("source_execution_receipt.safe_for_linkage");
    }
  }

  const resultRef = linkage.result_observation_reference;
  if (!object(resultRef)) {
    errors.push("result_observation_reference");
  } else {
    if (!schema.definitions.result_observation_reference.properties.reference_kind.enum.includes(resultRef.reference_kind)) {
      errors.push("result_observation_reference.reference_kind");
    }
    if (resultRef.static_reference_only !== true) errors.push("result_observation_reference.static_reference_only");
    if (resultRef.future_reference_only !== true) errors.push("result_observation_reference.future_reference_only");
    if (resultRef.live_observation_performed !== false) errors.push("result_observation_reference.live_observation_performed");
    if (resultRef.runtime_observer_enabled !== false) errors.push("result_observation_reference.runtime_observer_enabled");
    if (resultRef.proof_of_runtime_observation !== false) errors.push("result_observation_reference.proof_of_runtime_observation");
  }

  for (const field of notGoFlags) if (linkage.not_go_assertions?.[field] !== true) errors.push("not_go_assertions." + field);

  const next = linkage.next_action;
  if (!object(next)) {
    errors.push("next_action");
  } else {
    if (!safeNextActions.includes(next.recommended_next_action)) errors.push("next_action.recommended_next_action");
    if (/GO|EXECUTE|QUEUE|DEPLOY|PUSH|COMMIT/iu.test(next.recommended_next_action)) {
      errors.push("next_action.unsafe_recommended_next_action");
    }
    if (next.bounded_and_safe !== true) errors.push("next_action.bounded_and_safe");
    if (next.owner_gate_required !== true) errors.push("next_action.owner_gate_required");
    if (next.unsafe_next_action_allowed !== false) errors.push("next_action.unsafe_next_action_allowed");
  }

  for (const field of forbiddenFlags) if (linkage.forbidden_actions?.[field] !== false) errors.push("forbidden_actions." + field);

  if (!Array.isArray(linkage.blocker_matrix) || linkage.blocker_matrix.length === 0) {
    errors.push("blocker_matrix");
  } else {
    const activeRows = linkage.blocker_matrix.filter((row) => row.status !== "PASS");
    const blocked = linkage.linkage_status.startsWith("LINKAGE_BLOCKED") ||
      linkage.linkage_status === "LINKAGE_FAILED_CLOSED" ||
      linkage.linkage_status === "STOP_OWNER_REVIEW_REQUIRED";
    if (blocked && activeRows.length === 0) errors.push("blocker_matrix.missing_active_blocker");
    if (!blocked && activeRows.length !== 0) errors.push("blocker_matrix.unexpected_active_blocker");
    for (const row of linkage.blocker_matrix) {
      if (typeof row.blocker !== "string" || row.blocker.length === 0) errors.push("blocker_matrix.blocker");
      if (!["PASS", "BLOCKED", "REJECTED", "OWNER_REVIEW_REQUIRED"].includes(row.status)) errors.push("blocker_matrix.status");
      if (typeof row.resolution !== "string" || row.resolution.length === 0) errors.push("blocker_matrix.resolution");
      if (typeof row.allows_progression !== "boolean") errors.push("blocker_matrix.allows_progression");
      if (row.status !== "PASS" && row.allows_progression !== false) errors.push("blocker_matrix.allows_progression");
    }
  }

  return errors;
}

test("allowlist contains exactly the 21 approved linkage contract files", () => {
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

test("schema pins build, baseline, statuses, and false-only safety flags", () => {
  assert.equal(schema.schema_id, SCHEMA_ID);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additional_properties_allowed, false);
  assert.equal(schema.properties.schema.const, SCHEMA_ID);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.baseline_commit.const, BASELINE);
  assert.equal(schema.properties.local_origin_master.const, BASELINE);
  assert.equal(schema.properties.source_execution_receipt_commit.const, BASELINE);
  assert.deepEqual(statuses, [
    "LINKAGE_NOT_STARTED",
    "LINKAGE_BLOCKED_OWNER_REVIEW_REQUIRED",
    "LINKAGE_BLOCKED_MISSING_EXECUTION_RECEIPT",
    "LINKAGE_BLOCKED_EXECUTION_RECEIPT_UNSAFE",
    "LINKAGE_BLOCKED_BASELINE_MISMATCH",
    "LINKAGE_DRAFT_READY",
    "LINKAGE_MATCHED_EVIDENCE_ONLY",
    "LINKAGE_OBSERVED_SAFE_NO_ACTION",
    "LINKAGE_FAILED_CLOSED",
    "STOP_OWNER_REVIEW_REQUIRED"
  ]);
  assert.equal(
    schema.definitions.source_execution_receipt.properties.source_execution_receipt_post_push_closeout_sha256.const,
    SOURCE_CLOSEOUT_SHA
  );
  for (const field of forbiddenFlags) assert.equal(schema.definitions.forbidden_actions.properties[field].const, false, field);
  for (const field of notGoFlags) assert.equal(schema.definitions.not_go_assertions.properties[field].const, true, field);
});

test("documentation states required evidence-only and not-runtime boundaries", () => {
  const doc = readText(docPath);
  assert.ok(doc.startsWith("# BUILD_ID: " + BUILD_ID));
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

test("valid linkage fixtures are accepted and preserve no-runtime assertions", () => {
  const observedStatuses = new Set();
  for (const fixturePath of validFixtures) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, true, fixturePath);
    const errors = validateLinkage(fixture.linkage);
    assert.deepEqual(errors, [], fixturePath + ": " + errors.join(", "));
    observedStatuses.add(fixture.linkage.linkage_status);
    for (const field of forbiddenFlags) assert.equal(fixture.linkage.forbidden_actions[field], false, field);
    for (const field of notGoFlags) assert.equal(fixture.linkage.not_go_assertions[field], true, field);
    assert.equal(fixture.linkage.human_review_one_point.length > 0, true);
  }
  assert.deepEqual(observedStatuses, new Set(statuses));
});

test("invalid linkage fixtures fail closed for expected reasons", () => {
  for (const fixturePath of invalidFixtures) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, false, fixturePath);
    const base = clone(readJson(fixtureRoot + "/valid/" + fixture.base_fixture).linkage);
    for (const key of ["mutation", "secondary_mutation", "tertiary_mutation", "quaternary_mutation"]) {
      if (fixture[key]) setPath(base, fixture[key].path, fixture[key]);
    }
    const errors = validateLinkage(base);
    assert.notEqual(errors.length, 0, fixturePath + " should be invalid");
    assert.ok(
      errors.some((error) => error.includes(fixture.expected_error)),
      fixturePath + " expected " + fixture.expected_error + ", got " + errors.join(", ")
    );
  }
});

test("unsafe next actions fail closed", () => {
  const linkage = clone(readJson(fixtureRoot + "/valid/linkage_matched_evidence_only.json").linkage);
  linkage.next_action.recommended_next_action = "GO_EXECUTE_PUSH_DEPLOY";
  linkage.next_action.unsafe_next_action_allowed = true;
  const errors = validateLinkage(linkage);
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
  const currentWorkingTreeGuardAllowedFiles = new Set([
    ...allowedFiles,
    ...boundedAllowlistGuardCompatibilityRepairFiles,
    ...chainSummaryReferenceImplementationLaneFiles,
    ...submissionReadinessStaticGapImplementationLaneFiles,
    ...branchLocalDryRunOrchestrationMvpPlanningImplementationLaneFiles,
    ...branchLocalDryRunOrchestrationMvpStaticExecutionImplementationLaneFiles
  ]);

  const outside = changedPaths.filter((file) => !currentWorkingTreeGuardAllowedFiles.has(file));
  assert.deepEqual(outside, []);
});

console.log("codex_native_supervised_dry_run_execution_receipt_to_result_observation_linkage_contract_static: ok");
