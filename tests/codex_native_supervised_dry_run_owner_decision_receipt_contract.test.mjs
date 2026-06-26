// BUILD_ID: SUPERVISED_DRY_RUN_OWNER_DECISION_RECEIPT_CONTRACTS_20260615
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (file) => readFileSync(resolve(root, file), "utf8");
const readJson = (file) => JSON.parse(readText(file));

const BUILD_ID = "SUPERVISED_DRY_RUN_OWNER_DECISION_RECEIPT_CONTRACTS_20260615";
const SCHEMA_ID = "lonewolf.codex_native.supervised_dry_run_owner_decision_receipt.v1";
const TARGET = "supervised_dry_run_owner_decision_receipt_contracts";
const BASELINE = "5d77e8568f0a6708cae730aa66fa3f3f953fc6db";
const PHRASE = "APPROVE_SUPERVISED_DRY_RUN_OWNER_DECISION_RECEIPT_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION";

const docPath = "docs/orchestration/codex_native_supervised_dry_run_owner_decision_receipt_contract.md";
const schemaPath = "schema/orchestration/codex_native_supervised_dry_run_owner_decision_receipt.schema.json";
const testPath = "tests/codex_native_supervised_dry_run_owner_decision_receipt_contract.test.mjs";
const fixtureRoot = "tests/fixtures/codex-native-supervised-dry-run/owner-decision-receipt";

const noteCoreArtifactContractImplementationLaneFiles = [
  "docs/orchestration/note_core_artifact_contract.md",
  "schema/orchestration/note_core_artifact_contract.schema.json",
  "tests/note_core_artifact_contract.test.mjs",
  "tests/fixtures/note-core-artifact-contract/valid/scout-review-artifact.json",
  "tests/fixtures/note-core-artifact-contract/invalid/runtime-approved.json"
];

const noteCoreArtifactAdoptionLedgerImplementationLaneFiles = [
  "docs/orchestration/note_core_artifact_adoption_ledger_contract.md",
  "schema/orchestration/note_core_artifact_adoption_ledger_contract.schema.json",
  "tests/note_core_artifact_adoption_ledger_contract.test.mjs",
  "tests/fixtures/note-core-artifact-adoption-ledger-contract/valid/accepted-closeout-ledger.json",
  "tests/fixtures/note-core-artifact-adoption-ledger-contract/invalid/runtime-touched.json",
  "tests/fixtures/note-core-artifact-adoption-ledger-contract/invalid/missing-owner-acceptance.json"
];
const validFixtures = [
  `${fixtureRoot}/valid/owner_decision_receipt_approved_for_next_approval_packet.json`,
  `${fixtureRoot}/valid/owner_decision_receipt_rejected.json`,
  `${fixtureRoot}/valid/owner_decision_receipt_requested_bounded_repair.json`,
  `${fixtureRoot}/valid/owner_decision_receipt_requested_stop.json`,
  `${fixtureRoot}/valid/owner_decision_receipt_review_required.json`
];

const invalidFixtures = [
  `${fixtureRoot}/invalid/owner_decision_receipt_runtime_execution_true.json`,
  `${fixtureRoot}/invalid/owner_decision_receipt_worker_launch_true.json`,
  `${fixtureRoot}/invalid/owner_decision_receipt_queue_mutation_true.json`,
  `${fixtureRoot}/invalid/owner_decision_receipt_auto_go_true.json`,
  `${fixtureRoot}/invalid/owner_decision_receipt_artifact_sha_mismatch.json`,
  `${fixtureRoot}/invalid/owner_decision_receipt_stale_baseline.json`,
  `${fixtureRoot}/invalid/owner_decision_receipt_missing_human_review_one_point.json`
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
  "docs/orchestration/lwf_note_network_local_orchestrator_usage.md",
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
const lwfNoteNetworkOutputsLitePromptOperationsImplementationLaneFiles = [
  "docs/lwf-note-network/outputs_and_lite_prompt_operations.md",
  "schema/lwf-note-network/note_network_operations.schema.json",
  "tests/lwf_note_network_outputs_and_lite_prompt_operations_contract.test.mjs",
  "tests/fixtures/lwf-note-network/operations/valid/current-lite-scout-operations.json",
  "tests/fixtures/lwf-note-network/operations/invalid/full-scout-plan-as-default.json",
  "tests/fixtures/lwf-note-network/operations/invalid/appdata-output-root.json",
  "tests/fixtures/lwf-note-network/operations/invalid/runtime-action-approved.json"
];


const schema = readJson(schemaPath);
const forbiddenFlags = Object.keys(schema.$defs.forbidden_actions.properties);
const notGoFlags = [
  "receipt_presence_is_execution_approval",
  "ready_is_go",
  "matched_is_go",
  "observed_safe_no_action_is_go",
  "request_draft_ready_is_go",
  "preflight_bound_ready_is_go",
  "automatic_go_allowed",
  "implementation_allowed",
  "commit_allowed",
  "push_allowed",
  "runtime_execution_allowed",
  "worker_launch_allowed",
  "queue_mutation_allowed",
  "safety_gate_bypass_allowed",
  "stop_owner_review_bypass_allowed"
];
const safeNextActions = schema.$defs.next_action_constraints.properties.recommended_next_action.enum;

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

function getPath(target, dottedPath) {
  return dottedPath.split(".").reduce((cursor, part) => cursor?.[part], target);
}

function sha256(value) {
  return typeof value === "string" && /^[A-F0-9]{64}$/.test(value);
}

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function validateReceipt(receipt) {
  const errors = [];
  const required = schema.required;
  const allowed = new Set(Object.keys(schema.properties));

  for (const field of required) if (!Object.hasOwn(receipt, field)) errors.push(`missing ${field}`);
  for (const field of Object.keys(receipt)) if (!allowed.has(field)) errors.push(`unexpected ${field}`);
  if (errors.length > 0) return errors;

  if (receipt.schema !== SCHEMA_ID) errors.push("schema");
  if (receipt.build_id !== BUILD_ID) errors.push("build_id");
  if (receipt.selected_target !== TARGET) errors.push("selected_target");
  for (const field of ["baseline", "head", "local_origin_master"]) {
    if (receipt[field] !== BASELINE) errors.push(field);
  }
  if (receipt.branch !== "master") errors.push("branch");
  if (receipt.ahead_behind !== "0 / 0") errors.push("ahead_behind");
  if (receipt.fail_closed_result !== "STOP_OWNER_REVIEW_REQUIRED") errors.push("fail_closed_result");
  if (typeof receipt.human_review_one_point !== "string" || receipt.human_review_one_point.length < 20) {
    errors.push("human_review_one_point");
  }
  if (!Array.isArray(receipt.safety_invariants) || receipt.safety_invariants.length < 10) {
    errors.push("safety_invariants");
  }

  for (const field of ["parent_planning_artifact", "execution_request_envelope_artifact"]) {
    const artifact = receipt[field];
    if (!object(artifact)) {
      errors.push(field);
      continue;
    }
    if (typeof artifact.artifact_path !== "string" || artifact.artifact_path.length === 0) errors.push(`${field}.artifact_path`);
    if (!sha256(artifact.artifact_sha256)) errors.push(`${field}.artifact_sha256`);
    if (artifact.sha256_matches_expected !== true) errors.push(`${field}.sha256_matches_expected`);
    if (artifact.evidence_only !== true) errors.push(`${field}.evidence_only`);
    if (typeof artifact.authoritative !== "boolean") errors.push(`${field}.authoritative`);
  }

  const decision = receipt.owner_decision;
  if (!object(decision)) {
    errors.push("owner_decision");
  } else {
    const statuses = schema.$defs.owner_decision.properties.decision_status.enum;
    if (!statuses.includes(decision.decision_status)) errors.push("owner_decision.decision_status");
    if (decision.decision_receipt_only !== true) errors.push("owner_decision.decision_receipt_only");
    for (const field of [
      "owner_approved_for_next_approval_packet_is_runtime_go",
      "owner_approved_for_next_approval_packet_is_push_approval",
      "owner_approved_for_next_approval_packet_is_implementation_approval_without_matching_phrase"
    ]) {
      if (decision[field] !== false) errors.push(`owner_decision.${field}`);
    }
  }

  const approval = receipt.owner_approval_evidence;
  if (!object(approval)) {
    errors.push("owner_approval_evidence");
  } else {
    if (approval.approval_phrase !== PHRASE) errors.push("owner_approval_evidence.approval_phrase");
    if (approval.phrase_present !== true) errors.push("owner_approval_evidence.phrase_present");
    if (approval.phrase_current !== true) errors.push("owner_approval_evidence.phrase_current");
    if (approval.phrase_stale !== false) errors.push("owner_approval_evidence.phrase_stale");
    if (approval.phrase_superseded !== false) errors.push("owner_approval_evidence.phrase_superseded");
    if (approval.bound_baseline !== BASELINE) errors.push("owner_approval_evidence.bound_baseline");
    if (approval.allowed_scope !== "docs_schema_tests_fixtures_only") errors.push("owner_approval_evidence.allowed_scope");
    if (approval.exact_file_allowlist_count !== 15) errors.push("owner_approval_evidence.exact_file_allowlist_count");
    if (approval.future_implementation_requires_exact_phrase !== true) {
      errors.push("owner_approval_evidence.future_implementation_requires_exact_phrase");
    }
  }

  const next = receipt.next_action_constraints;
  if (!object(next)) {
    errors.push("next_action_constraints");
  } else {
    if (!safeNextActions.includes(next.recommended_next_action)) errors.push("next_action_constraints.recommended_next_action");
    if (/GO|EXECUTE|QUEUE|DEPLOY|PUSH|COMMIT/.test(next.recommended_next_action)) {
      errors.push("next_action_constraints.unsafe_recommended_next_action");
    }
    for (const field of notGoFlags) {
      if (next[field] !== false) errors.push(`next_action_constraints.${field}`);
    }
    if (next.owner_gate_required !== true) errors.push("next_action_constraints.owner_gate_required");
  }

  const forbidden = receipt.forbidden_actions;
  if (!object(forbidden)) {
    errors.push("forbidden_actions");
  } else {
    for (const field of forbiddenFlags) if (forbidden[field] !== false) errors.push(`forbidden_actions.${field}`);
  }

  if (!Array.isArray(receipt.blocker_matrix) || receipt.blocker_matrix.length === 0) {
    errors.push("blocker_matrix");
  } else {
    const nonPassRows = receipt.blocker_matrix.filter((row) => row.status !== "PASS");
    if (decision?.decision_status === "OWNER_APPROVED_FOR_NEXT_APPROVAL_PACKET" && nonPassRows.length > 0) {
      errors.push("approved_with_blockers");
    }
    if (decision?.decision_status !== "OWNER_APPROVED_FOR_NEXT_APPROVAL_PACKET" && nonPassRows.length === 0) {
      errors.push("fail_closed_missing_blocker");
    }
    for (const row of receipt.blocker_matrix) {
      if (typeof row.blocker !== "string" || row.blocker.length === 0) errors.push("blocker_matrix.blocker");
      if (!["PASS", "BLOCKED", "REJECTED", "OWNER_REVIEW_REQUIRED"].includes(row.status)) {
        errors.push("blocker_matrix.status");
      }
      if (typeof row.resolution !== "string" || row.resolution.length === 0) errors.push("blocker_matrix.resolution");
    }
  }

  return errors;
}

test("allowlist contains exactly the owner decision receipt contract files", () => {
  assert.equal(allowedFiles.length, 15);
  assert.equal(validFixtures.length, 5);
  assert.equal(invalidFixtures.length, 7);
  assert.equal(allowedFiles.filter((file) => file.startsWith("docs/")).length, 1);
  assert.equal(allowedFiles.filter((file) => file.startsWith("schema/")).length, 1);
  assert.equal(allowedFiles.filter((file) => /^tests\/[^/]+\.test\.mjs$/.test(file)).length, 1);
  assert.equal(allowedFiles.filter((file) => file.startsWith("tests/fixtures/")).length, 12);
  for (const file of allowedFiles) {
    assert.doesNotThrow(() => readText(file), `${file} should exist`);
    assert.doesNotMatch(file, /\*/);
    assert.doesNotMatch(file, /^(src|tools|scripts|runtime|worker|cloud|deploy|billing|trading|\.git|node_modules)\//);
  }
});

test("schema pins build, baseline, owner phrase, statuses, and false-only flags", () => {
  assert.equal(schema.$id, SCHEMA_ID);
  assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema.const, SCHEMA_ID);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.selected_target.const, TARGET);
  assert.equal(schema.properties.baseline.const, BASELINE);
  assert.equal(schema.properties.head.const, BASELINE);
  assert.equal(schema.properties.local_origin_master.const, BASELINE);
  assert.equal(schema.$defs.owner_approval_evidence.properties.approval_phrase.const, PHRASE);
  assert.equal(schema.$defs.owner_approval_evidence.properties.exact_file_allowlist_count.const, 15);
  assert.ok(schema.$defs.owner_decision.properties.decision_status.enum.includes("OWNER_APPROVED_FOR_NEXT_APPROVAL_PACKET"));
  assert.ok(schema.$defs.owner_decision.properties.decision_status.enum.includes("STOP_OWNER_REVIEW_REQUIRED"));
  for (const field of forbiddenFlags) {
    assert.equal(schema.$defs.forbidden_actions.properties[field].const, false, field);
  }
  for (const field of notGoFlags) {
    assert.equal(schema.$defs.next_action_constraints.properties[field].const, false, field);
  }
});

test("documentation states required receipt safety boundaries", () => {
  const doc = readText(docPath);
  assert.ok(doc.startsWith(`# BUILD_ID: ${BUILD_ID}`));
  assert.match(doc, /evidence-only audit metadata/i);
  assert.match(doc, /never an executor/i);
  assert.match(doc, /not runtime GO/i);
  assert.match(doc, /not push approval/i);
  assert.match(doc, /not implementation approval unless the matching explicit owner approval phrase/i);
  assert.match(doc, /Receipt presence alone is not enough to execute anything/i);
  assert.match(doc, /`READY`/);
  assert.match(doc, /`MATCHED`/);
  assert.match(doc, /`OBSERVED_SAFE_NO_ACTION`/);
  assert.match(doc, /`REQUEST_DRAFT_READY`/);
  assert.match(doc, /`PREFLIGHT_BOUND_READY`/);
  assert.match(doc, /cannot bypass safety gates/i);
  assert.match(doc, /cannot bypass safety gates, owner gates/);
  assert.match(doc, /Stop and Wait - Owner Review Required/);
});

test("valid owner decision receipt fixtures pass", () => {
  const statuses = new Set();
  for (const fixturePath of validFixtures) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID);
    const errors = validateReceipt(fixture.receipt);
    assert.deepEqual(errors, [], `${fixturePath}: ${errors.join(", ")}`);
    statuses.add(fixture.receipt.owner_decision.decision_status);
    for (const field of forbiddenFlags) assert.equal(fixture.receipt.forbidden_actions[field], false, field);
  }
  assert.ok(statuses.has("OWNER_APPROVED_FOR_NEXT_APPROVAL_PACKET"));
  assert.ok(statuses.has("OWNER_REJECTED"));
  assert.ok(statuses.has("OWNER_REQUESTED_BOUNDED_REPAIR"));
  assert.ok(statuses.has("OWNER_REQUESTED_STOP"));
  assert.ok(statuses.has("STOP_OWNER_REVIEW_REQUIRED"));
});

test("invalid owner decision receipt fixtures fail closed for expected reasons", () => {
  for (const fixturePath of invalidFixtures) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID);
    assert.equal(fixture.expected_valid, false);
    const base = clone(readJson(`${fixtureRoot}/valid/${fixture.base_fixture}`).receipt);
    for (const key of ["mutation", "secondary_mutation", "tertiary_mutation"]) {
      if (fixture[key]) setPath(base, fixture[key].path, fixture[key]);
    }
    if (fixture.mutation.delete !== true) assert.equal(getPath(base, fixture.mutation.path), fixture.mutation.value);
    const errors = validateReceipt(base);
    assert.notEqual(errors.length, 0, `${fixturePath} should be invalid`);
    assert.ok(
      errors.some((error) => error.includes(fixture.expected_error)),
      `${fixturePath} expected ${fixture.expected_error}, got ${errors.join(", ")}`
    );
  }
});

test("approved receipt never implies implementation, runtime, commit, or push", () => {
  const approved = readJson(validFixtures[0]).receipt;
  assert.equal(approved.owner_decision.decision_status, "OWNER_APPROVED_FOR_NEXT_APPROVAL_PACKET");
  assert.equal(approved.owner_decision.owner_approved_for_next_approval_packet_is_runtime_go, false);
  assert.equal(approved.owner_decision.owner_approved_for_next_approval_packet_is_push_approval, false);
  assert.equal(approved.owner_decision.owner_approved_for_next_approval_packet_is_implementation_approval_without_matching_phrase, false);
  assert.equal(approved.next_action_constraints.implementation_allowed, false);
  assert.equal(approved.next_action_constraints.runtime_execution_allowed, false);
  assert.equal(approved.next_action_constraints.commit_allowed, false);
  assert.equal(approved.next_action_constraints.push_allowed, false);
  assert.equal(approved.next_action_constraints.automatic_go_allowed, false);
});

test("unsafe next actions and GO semantics fail closed", () => {
  const approved = clone(readJson(validFixtures[0]).receipt);
  approved.next_action_constraints.recommended_next_action = "GO_EXECUTE_PUSH_DEPLOY";
  approved.next_action_constraints.automatic_go_allowed = true;
  const errors = validateReceipt(approved);
  assert.ok(errors.includes("next_action_constraints.recommended_next_action"));
  assert.ok(errors.includes("next_action_constraints.unsafe_recommended_next_action"));
  assert.ok(errors.includes("next_action_constraints.automatic_go_allowed"));
});

test("fixtures avoid raw-auth and credential-like placeholders", () => {
  const badPattern = /api[_-]?key|secret|credential|password|raw[_-]?auth|bearer|production[_-]?db/i;
  for (const fixturePath of [...validFixtures, ...invalidFixtures]) {
    assert.doesNotMatch(readText(fixturePath), badPattern, fixturePath);
  }
});

test("working tree changes stay inside the exact 15-file allowlist", () => {
  const result = spawnSync("git", ["status", "--short", "--untracked-files=all"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const changedPaths = result.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.slice(3).replace(/\\/g, "/"));
  const currentWorkingTreeGuardAllowedFiles = new Set([
    ...allowedFiles,
    ...boundedAllowlistGuardCompatibilityRepairFiles,
    ...chainSummaryReferenceImplementationLaneFiles,
    ...submissionReadinessStaticGapImplementationLaneFiles,
    ...branchLocalDryRunOrchestrationMvpPlanningImplementationLaneFiles,
    ...branchLocalDryRunOrchestrationMvpStaticExecutionImplementationLaneFiles,
    ...lwfNoteNetworkLocalOrchestratorImplementationLaneFiles,
    ...lwfNoteNetworkOutputsLitePromptOperationsImplementationLaneFiles,
    ...noteCoreArtifactContractImplementationLaneFiles,
    ...noteCoreArtifactAdoptionLedgerImplementationLaneFiles
  ]);

  const outside = changedPaths.filter((file) => !currentWorkingTreeGuardAllowedFiles.has(file));
  assert.deepEqual(outside, []);
});

console.log("codex_native_supervised_dry_run_owner_decision_receipt_contract_static: ok");
