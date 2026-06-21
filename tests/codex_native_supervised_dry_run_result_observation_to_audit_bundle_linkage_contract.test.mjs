// BUILD_ID: SUPERVISED_DRY_RUN_RESULT_OBSERVATION_TO_AUDIT_BUNDLE_LINKAGE_CONTRACTS_20260615
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "SUPERVISED_DRY_RUN_RESULT_OBSERVATION_TO_AUDIT_BUNDLE_LINKAGE_CONTRACTS_20260615";
const SCHEMA_ID = "lonewolf.codex_native.supervised_dry_run_result_observation_to_audit_bundle_linkage.v1";
const TARGET = "supervised_dry_run_result_observation_to_audit_bundle_linkage_contracts";
const BASELINE = "9673bb3ec53e6d243e7ccbf34d0908fef4f97df1";
const SOURCE_CLOSEOUT_SHA = "1FDD7846FFE5A137B38FFF1FDDA7389071383660E9F4B44B2496E4864B020435";
const PLANNING_SHA = "10155DD6F375F49891D524ECB5BBEABAA737995499C359A7DA4D5DD85B26CC2A";

const docPath = "docs/orchestration/codex_native_supervised_dry_run_result_observation_to_audit_bundle_linkage_contract.md";
const schemaPath = "schema/orchestration/codex_native_supervised_dry_run_result_observation_to_audit_bundle_linkage.schema.json";
const testPath = "tests/codex_native_supervised_dry_run_result_observation_to_audit_bundle_linkage_contract.test.mjs";
const fixtureRoot = "tests/fixtures/codex-native-supervised-dry-run/result-observation-to-audit-bundle-linkage";

const validFixtures = [
  fixtureRoot + "/valid/linkage_not_started.json",
  fixtureRoot + "/valid/linkage_blocked_owner_review_required.json",
  fixtureRoot + "/valid/linkage_blocked_missing_result_observation.json",
  fixtureRoot + "/valid/linkage_blocked_result_observation_unsafe.json",
  fixtureRoot + "/valid/linkage_blocked_baseline_mismatch.json",
  fixtureRoot + "/valid/linkage_draft_ready.json",
  fixtureRoot + "/valid/linkage_matched_evidence_only.json",
  fixtureRoot + "/valid/linkage_audit_bundle_reference_ready.json",
  fixtureRoot + "/valid/linkage_failed_closed.json",
  fixtureRoot + "/valid/linkage_stop_owner_review_required.json"
];

const invalidFixtures = [
  fixtureRoot + "/invalid/linkage_runtime_audit_bundle_creation_true.json",
  fixtureRoot + "/invalid/linkage_live_observation_true.json",
  fixtureRoot + "/invalid/linkage_worker_launch_true.json",
  fixtureRoot + "/invalid/linkage_queue_mutation_true.json",
  fixtureRoot + "/invalid/linkage_cloud_api_billing_auth_trading_true.json",
  fixtureRoot + "/invalid/linkage_auto_go_true.json",
  fixtureRoot + "/invalid/linkage_stale_baseline.json",
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
const lwfNoteNetworkLocalOrchestratorImplementationLaneFiles = [
  "docs/orchestration/lwf_note_network_local_orchestrator_contract.md",
  "docs/orchestration/lwf_note_network_local_orchestrator_state_machine.md",
  "schema/orchestration/lwf_note_network_local_orchestrator.schema.json",
  "tests/lwf_note_network_local_orchestrator_contract.test.mjs",
  "tests/fixtures/lwf-note-network-local-orchestrator/valid/scout-packet.json",
  "tests/fixtures/lwf-note-network-local-orchestrator/valid/review-packet.json",
  "tests/fixtures/lwf-note-network-local-orchestrator/valid/full-loop-ready-for-codex.json",
  "tests/fixtures/lwf-note-network-local-orchestrator/invalid/missing-note-node.json",
  "tests/fixtures/lwf-note-network-local-orchestrator/invalid/unsafe-go.json",
  "tests/fixtures/lwf-note-network-local-orchestrator/invalid/push-approval-confusion.json",
  "tests/fixtures/lwf-note-network-local-orchestrator/invalid/public-version-priority.json",
  "tests/fixtures/lwf-note-network-local-orchestrator/invalid/codex-direct-execution-without-scout.json",
  "tests/fixtures/lwf-note-network-local-orchestrator/invalid/review-skipped.json",
  "tests/fixtures/lwf-note-network-local-orchestrator/invalid/note-output-used-as-proof-without-verification.json"
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
  if (linkage.source_result_observation_commit !== BASELINE) errors.push("source_result_observation_commit");
  if (!statuses.includes(linkage.linkage_status)) errors.push("linkage_status");
  if (typeof linkage.human_review_one_point !== "string" || linkage.human_review_one_point.length === 0) {
    errors.push("human_review_one_point");
  }
  if (linkage.fail_closed_result !== "STOP_OWNER_REVIEW_REQUIRED") errors.push("fail_closed_result");
  if (!Array.isArray(linkage.safety_invariants) || linkage.safety_invariants.length < 25) errors.push("safety_invariants");

  validateArtifact(linkage.source_planning_artifact, "source_planning_artifact", errors);
  if (object(linkage.source_planning_artifact) && linkage.source_planning_artifact.artifact_sha256 !== PLANNING_SHA) {
    errors.push("source_planning_artifact.artifact_sha256");
  }

  const observation = linkage.source_result_observation;
  if (!object(observation)) {
    errors.push("source_result_observation");
  } else {
    if (typeof observation.observation_present !== "boolean") errors.push("source_result_observation.observation_present");
    if (typeof observation.observation_status !== "string" || observation.observation_status.length === 0) {
      errors.push("source_result_observation.observation_status");
    }
    if (observation.observation_present === true) {
      if (typeof observation.observation_artifact_path !== "string" || observation.observation_artifact_path.length === 0) {
        errors.push("source_result_observation.observation_artifact_path");
      }
      if (observation.observation_artifact_sha256 !== SOURCE_CLOSEOUT_SHA) {
        errors.push("source_result_observation.observation_artifact_sha256");
      }
      if (observation.observation_artifact_sha256_matches_expected !== true) {
        errors.push("source_result_observation.observation_artifact_sha256_matches_expected");
      }
    }
    if (observation.observation_present === false && observation.observation_artifact_sha256 !== null) {
      errors.push("source_result_observation.observation_artifact_sha256");
    }
    if (observation.source_result_observation_post_push_closeout_sha256 !== SOURCE_CLOSEOUT_SHA) {
      errors.push("source_result_observation.source_result_observation_post_push_closeout_sha256");
    }
    if (typeof observation.safe_for_linkage !== "boolean") errors.push("source_result_observation.safe_for_linkage");
    if (observation.evidence_only !== true) errors.push("source_result_observation.evidence_only");
    if (linkage.linkage_status === "LINKAGE_BLOCKED_MISSING_RESULT_OBSERVATION" && observation.observation_present !== false) {
      errors.push("source_result_observation.observation_present");
    }
    if (linkage.linkage_status === "LINKAGE_BLOCKED_RESULT_OBSERVATION_UNSAFE" && observation.safe_for_linkage !== false) {
      errors.push("source_result_observation.safe_for_linkage");
    }
  }

  const auditRef = linkage.audit_bundle_reference;
  if (!object(auditRef)) {
    errors.push("audit_bundle_reference");
  } else {
    const kinds = schema.definitions.audit_bundle_reference.properties.reference_kind.enum;
    if (!kinds.includes(auditRef.reference_kind)) errors.push("audit_bundle_reference.reference_kind");
    if (auditRef.reference_kind === "AUDIT_BUNDLE_REFERENCE_READY" && typeof auditRef.audit_bundle_artifact_path !== "string") {
      errors.push("audit_bundle_reference.audit_bundle_artifact_path");
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

  for (const field of notGoFlags) if (linkage.not_go_assertions?.[field] !== true) errors.push("not_go_assertions." + field);

  const next = linkage.next_action;
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

test("allowlist contains exactly the 21 approved audit bundle linkage files", () => {
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
  assert.equal(schema.properties.source_result_observation_commit.const, BASELINE);
  assert.deepEqual(statuses, [
    "LINKAGE_NOT_STARTED",
    "LINKAGE_BLOCKED_OWNER_REVIEW_REQUIRED",
    "LINKAGE_BLOCKED_MISSING_RESULT_OBSERVATION",
    "LINKAGE_BLOCKED_RESULT_OBSERVATION_UNSAFE",
    "LINKAGE_BLOCKED_BASELINE_MISMATCH",
    "LINKAGE_DRAFT_READY",
    "LINKAGE_MATCHED_EVIDENCE_ONLY",
    "LINKAGE_AUDIT_BUNDLE_REFERENCE_READY",
    "LINKAGE_FAILED_CLOSED",
    "STOP_OWNER_REVIEW_REQUIRED"
  ]);
  assert.equal(
    schema.definitions.source_result_observation.properties.source_result_observation_post_push_closeout_sha256.const,
    SOURCE_CLOSEOUT_SHA
  );
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
    setPath(base, fixture.mutation.path, fixture.mutation);
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
  linkage.next_action.recommended_next_action = "GO_EXECUTE_CREATE_AUDIT_BUNDLE";
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
    ...branchLocalDryRunOrchestrationMvpStaticExecutionImplementationLaneFiles,
    ...lwfNoteNetworkLocalOrchestratorImplementationLaneFiles
  ]);

  const outside = changedPaths.filter((file) => !currentWorkingTreeGuardAllowedFiles.has(file));
  assert.deepEqual(outside, []);
});

console.log("codex_native_supervised_dry_run_result_observation_to_audit_bundle_linkage_contract_static: ok");
