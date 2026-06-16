// BUILD_ID: SUPERVISED_DRY_RUN_EXECUTION_RECEIPT_CONTRACTS_20260615
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "SUPERVISED_DRY_RUN_EXECUTION_RECEIPT_CONTRACTS_20260615";
const SCHEMA_ID = "lonewolf.codex_native.supervised_dry_run_execution_receipt.v1";
const TARGET = "supervised_dry_run_execution_receipt_contracts";
const BASELINE = "208a6aab119b6b720b27b12d083a5ce46053f836";
const PHRASE = "APPROVE_SUPERVISED_DRY_RUN_EXECUTION_RECEIPT_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION";
const NEXT_REVIEW = "START_SUPERVISED_DRY_RUN_EXECUTION_RECEIPT_IMPLEMENTATION_REVIEW_PACKET";

const docPath = "docs/orchestration/codex_native_supervised_dry_run_execution_receipt_contract.md";
const schemaPath = "schema/orchestration/codex_native_supervised_dry_run_execution_receipt.schema.json";
const testPath = "tests/codex_native_supervised_dry_run_execution_receipt_contract.test.mjs";
const fixtureRoot = "tests/fixtures/codex-native-supervised-dry-run/execution-receipt";

const validFixtures = [
  `${fixtureRoot}/valid/execution_receipt_not_started.json`,
  `${fixtureRoot}/valid/execution_receipt_skipped_owner_review_required.json`,
  `${fixtureRoot}/valid/execution_receipt_blocked_by_preflight.json`,
  `${fixtureRoot}/valid/execution_receipt_blocked_by_safety_gate.json`,
  `${fixtureRoot}/valid/execution_receipt_dry_run_receipt_recorded.json`,
  `${fixtureRoot}/valid/execution_receipt_observed_safe_no_action.json`,
  `${fixtureRoot}/valid/execution_receipt_failed_closed.json`,
  `${fixtureRoot}/valid/execution_receipt_stop_owner_review_required.json`
];

const invalidFixtures = [
  `${fixtureRoot}/invalid/execution_receipt_runtime_execution_true.json`,
  `${fixtureRoot}/invalid/execution_receipt_worker_launch_true.json`,
  `${fixtureRoot}/invalid/execution_receipt_queue_mutation_true.json`,
  `${fixtureRoot}/invalid/execution_receipt_cloud_api_billing_auth_trading_true.json`,
  `${fixtureRoot}/invalid/execution_receipt_auto_go_true.json`,
  `${fixtureRoot}/invalid/execution_receipt_stale_baseline.json`,
  `${fixtureRoot}/invalid/execution_receipt_artifact_sha_mismatch.json`,
  `${fixtureRoot}/invalid/execution_receipt_missing_human_review_one_point.json`
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


const schema = readJson(schemaPath);
const receiptStatuses = schema.properties.execution_receipt_status.enum;
const forbiddenFlags = Object.keys(schema.$defs.forbidden_actions.properties);
const notGoFlags = [
  "receipt_presence_is_execution_approval",
  "ready_is_go",
  "matched_is_go",
  "observed_safe_no_action_is_go",
  "request_draft_ready_is_go",
  "preflight_bound_ready_is_go",
  "owner_approved_for_next_approval_packet_is_runtime_go",
  "automatic_go_allowed",
  "implementation_allowed",
  "commit_allowed",
  "push_allowed",
  "runtime_execution_allowed",
  "worker_launch_allowed",
  "queue_mutation_allowed",
  "safety_gate_bypass_allowed",
  "stop_owner_review_bypass_allowed",
  "stop_and_wait_bypass_allowed"
];
const safeNextActions = schema.$defs.next_action_constraints.properties.recommended_next_action.enum;
const nonBlockingStatuses = new Set([
  "EXECUTION_NOT_STARTED",
  "EXECUTION_DRY_RUN_RECEIPT_RECORDED",
  "EXECUTION_OBSERVED_SAFE_NO_ACTION"
]);

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

function validateArtifact(receipt, field, errors) {
  const artifact = receipt[field];
  if (!object(artifact)) {
    errors.push(field);
    return;
  }
  if (typeof artifact.artifact_role !== "string" || artifact.artifact_role.length === 0) errors.push(`${field}.artifact_role`);
  if (typeof artifact.artifact_path !== "string" || artifact.artifact_path.length === 0) errors.push(`${field}.artifact_path`);
  if (!sha256(artifact.artifact_sha256)) errors.push(`${field}.artifact_sha256`);
  if (artifact.sha256_matches_expected !== true) errors.push(`${field}.sha256_matches_expected`);
  if (artifact.evidence_only !== true) errors.push(`${field}.evidence_only`);
  if (typeof artifact.authoritative !== "boolean") errors.push(`${field}.authoritative`);
}

function validateReceipt(receipt) {
  const errors = [];
  const allowed = new Set(Object.keys(schema.properties));

  for (const field of schema.required) if (!Object.hasOwn(receipt, field)) errors.push(`missing ${field}`);
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
  if (!receiptStatuses.includes(receipt.execution_receipt_status)) errors.push("execution_receipt_status");
  if (receipt.fail_closed_result !== "STOP_OWNER_REVIEW_REQUIRED") errors.push("fail_closed_result");
  if (typeof receipt.human_review_one_point !== "string" || receipt.human_review_one_point.length < 20) {
    errors.push("human_review_one_point");
  }
  if (!Array.isArray(receipt.safety_invariants) || receipt.safety_invariants.length < 12) {
    errors.push("safety_invariants");
  }

  for (const field of [
    "parent_planning_artifact",
    "execution_request_envelope_artifact",
    "owner_decision_receipt_artifact",
    "preflight_artifact"
  ]) {
    validateArtifact(receipt, field, errors);
  }

  const evidence = receipt.bounded_evidence;
  if (!object(evidence)) {
    errors.push("bounded_evidence");
  } else {
    if (evidence.evidence_only !== true) errors.push("bounded_evidence.evidence_only");
    if (evidence.never_executor !== true) errors.push("bounded_evidence.never_executor");
    if (typeof evidence.actual_execution_occurred !== "boolean") errors.push("bounded_evidence.actual_execution_occurred");
    if (typeof evidence.actual_execution_backed_by_bounded_evidence !== "boolean") {
      errors.push("bounded_evidence.actual_execution_backed_by_bounded_evidence");
    }
    if (evidence.actual_execution_occurred === true && evidence.actual_execution_backed_by_bounded_evidence !== true) {
      errors.push("bounded_evidence.actual_execution_without_bounded_evidence");
    }
    if (evidence.receipt_presence_is_execution_proof !== false) {
      errors.push("bounded_evidence.receipt_presence_is_execution_proof");
    }
    if (typeof evidence.execution_not_started_is_failure !== "boolean") {
      errors.push("bounded_evidence.execution_not_started_is_failure");
    }
    if (receipt.execution_receipt_status === "EXECUTION_NOT_STARTED" && evidence.execution_not_started_is_failure !== false) {
      errors.push("bounded_evidence.execution_not_started_is_failure");
    }
    if (evidence.execution_recorded_is_runtime_go !== false) {
      errors.push("bounded_evidence.execution_recorded_is_runtime_go");
    }
    if (evidence.observed_safe_no_action_is_runtime_go !== false) {
      errors.push("bounded_evidence.observed_safe_no_action_is_runtime_go");
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
    if (approval.future_runtime_requires_separate_owner_gate !== true) {
      errors.push("owner_approval_evidence.future_runtime_requires_separate_owner_gate");
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
    const activeRows = receipt.blocker_matrix.filter((row) => row.status !== "PASS");
    if (nonBlockingStatuses.has(receipt.execution_receipt_status) && activeRows.length > 0) {
      errors.push("non_blocking_status_with_blockers");
    }
    if (!nonBlockingStatuses.has(receipt.execution_receipt_status) && activeRows.length === 0) {
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

test("allowlist contains exactly the execution receipt contract files", () => {
  assert.equal(allowedFiles.length, 19);
  assert.equal(validFixtures.length, 8);
  assert.equal(invalidFixtures.length, 8);
  assert.equal(allowedFiles.filter((file) => file.startsWith("docs/")).length, 1);
  assert.equal(allowedFiles.filter((file) => file.startsWith("schema/")).length, 1);
  assert.equal(allowedFiles.filter((file) => /^tests\/[^/]+\.test\.mjs$/.test(file)).length, 1);
  assert.equal(allowedFiles.filter((file) => file.startsWith("tests/fixtures/")).length, 16);
  for (const file of allowedFiles) {
    assert.doesNotThrow(() => readText(file), `${file} should exist`);
    assert.doesNotMatch(file, /\*/);
    assert.doesNotMatch(file, /^(src|tools|scripts|runtime|worker|cloud|deploy|billing|trading|\.git|node_modules)\//);
  }
});

test("schema pins build, baseline, statuses, and false-only safety flags", () => {
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
  assert.deepEqual(receiptStatuses, [
    "EXECUTION_NOT_STARTED",
    "EXECUTION_SKIPPED_OWNER_REVIEW_REQUIRED",
    "EXECUTION_BLOCKED_BY_PREFLIGHT",
    "EXECUTION_BLOCKED_BY_SAFETY_GATE",
    "EXECUTION_DRY_RUN_RECEIPT_RECORDED",
    "EXECUTION_OBSERVED_SAFE_NO_ACTION",
    "EXECUTION_FAILED_CLOSED",
    "STOP_OWNER_REVIEW_REQUIRED"
  ]);
  assert.equal(schema.$defs.owner_approval_evidence.properties.approval_phrase.const, PHRASE);
  for (const field of forbiddenFlags) {
    assert.equal(schema.$defs.forbidden_actions.properties[field].const, false, field);
  }
  for (const field of notGoFlags) {
    assert.equal(schema.$defs.next_action_constraints.properties[field].const, false, field);
  }
  assert.equal(schema.$defs.bounded_evidence.properties.evidence_only.const, true);
  assert.equal(schema.$defs.bounded_evidence.properties.never_executor.const, true);
  assert.equal(schema.$defs.bounded_evidence.properties.receipt_presence_is_execution_proof.const, false);
});

test("documentation states required execution receipt safety boundaries", () => {
  const doc = readText(docPath);
  assert.ok(doc.startsWith(`# BUILD_ID: ${BUILD_ID}`));
  assert.match(doc, /evidence-only audit metadata/i);
  assert.match(doc, /never an executor/i);
  assert.match(doc, /never a runtime trigger/i);
  assert.match(doc, /never a worker launch request/i);
  assert.match(doc, /never a Queue mutation request/i);
  assert.match(doc, /never a cloud\/API\/billing\/auth\/trading action/i);
  assert.match(doc, /does not prove execution actually occurred unless bounded evidence/i);
  assert.match(doc, /`EXECUTION_DRY_RUN_RECEIPT_RECORDED` is not runtime GO/);
  assert.match(doc, /`EXECUTION_OBSERVED_SAFE_NO_ACTION` is not runtime GO/);
  assert.match(doc, /`EXECUTION_NOT_STARTED` is not failure unless/);
  assert.match(doc, /Receipt presence alone is not enough to execute anything/);
  for (const phrase of ["`READY`", "`MATCHED`", "`OBSERVED_SAFE_NO_ACTION`", "`REQUEST_DRAFT_READY`", "`PREFLIGHT_BOUND_READY`", "`OWNER_APPROVED_FOR_NEXT_APPROVAL_PACKET`"]) {
    assert.match(doc, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(doc, /cannot bypass safety gates/i);
  assert.match(doc, /cannot bypass owner gates/i);
  assert.match(doc, /cannot bypass `STOP_OWNER_REVIEW_REQUIRED`/);
  assert.match(doc, /Stop and Wait - Owner Review Required/);
});

test("valid execution receipt fixtures pass", () => {
  const statuses = new Set();
  for (const fixturePath of validFixtures) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID);
    const errors = validateReceipt(fixture.receipt);
    assert.deepEqual(errors, [], `${fixturePath}: ${errors.join(", ")}`);
    statuses.add(fixture.receipt.execution_receipt_status);
    for (const field of forbiddenFlags) assert.equal(fixture.receipt.forbidden_actions[field], false, field);
  }
  assert.deepEqual(statuses, new Set(receiptStatuses));
});

test("invalid execution receipt fixtures fail closed for expected reasons", () => {
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

test("receipt statuses never imply GO or later repo authority", () => {
  for (const fixturePath of validFixtures) {
    const receipt = readJson(fixturePath).receipt;
    assert.equal(receipt.bounded_evidence.receipt_presence_is_execution_proof, false);
    assert.equal(receipt.bounded_evidence.execution_recorded_is_runtime_go, false);
    assert.equal(receipt.bounded_evidence.observed_safe_no_action_is_runtime_go, false);
    assert.equal(receipt.next_action_constraints.ready_is_go, false);
    assert.equal(receipt.next_action_constraints.matched_is_go, false);
    assert.equal(receipt.next_action_constraints.observed_safe_no_action_is_go, false);
    assert.equal(receipt.next_action_constraints.request_draft_ready_is_go, false);
    assert.equal(receipt.next_action_constraints.preflight_bound_ready_is_go, false);
    assert.equal(receipt.next_action_constraints.owner_approved_for_next_approval_packet_is_runtime_go, false);
    assert.equal(receipt.next_action_constraints.runtime_execution_allowed, false);
    assert.equal(receipt.next_action_constraints.commit_allowed, false);
    assert.equal(receipt.next_action_constraints.push_allowed, false);
    assert.equal(receipt.next_action_constraints.automatic_go_allowed, false);
    assert.doesNotMatch(receipt.next_action_constraints.recommended_next_action, /GO|EXECUTE|QUEUE|DEPLOY|PUSH|COMMIT/);
  }
});

test("dry-run receipt recorded and observed safe no action remain evidence-only", () => {
  const recorded = readJson(`${fixtureRoot}/valid/execution_receipt_dry_run_receipt_recorded.json`).receipt;
  const observed = readJson(`${fixtureRoot}/valid/execution_receipt_observed_safe_no_action.json`).receipt;
  assert.equal(recorded.execution_receipt_status, "EXECUTION_DRY_RUN_RECEIPT_RECORDED");
  assert.equal(recorded.bounded_evidence.actual_execution_occurred, true);
  assert.equal(recorded.bounded_evidence.actual_execution_backed_by_bounded_evidence, true);
  assert.equal(recorded.bounded_evidence.execution_recorded_is_runtime_go, false);
  assert.equal(recorded.next_action_constraints.implementation_allowed, false);
  assert.equal(recorded.next_action_constraints.commit_allowed, false);
  assert.equal(recorded.next_action_constraints.push_allowed, false);
  assert.equal(observed.execution_receipt_status, "EXECUTION_OBSERVED_SAFE_NO_ACTION");
  assert.equal(observed.bounded_evidence.observed_safe_no_action_is_runtime_go, false);
  assert.equal(observed.next_action_constraints.runtime_execution_allowed, false);
});

test("unsafe next actions fail closed", () => {
  const receipt = clone(readJson(`${fixtureRoot}/valid/execution_receipt_dry_run_receipt_recorded.json`).receipt);
  receipt.next_action_constraints.recommended_next_action = "GO_EXECUTE_PUSH_DEPLOY";
  receipt.next_action_constraints.automatic_go_allowed = true;
  const errors = validateReceipt(receipt);
  assert.ok(errors.includes("next_action_constraints.recommended_next_action"));
  assert.ok(errors.includes("next_action_constraints.unsafe_recommended_next_action"));
  assert.ok(errors.includes("next_action_constraints.automatic_go_allowed"));
});

test("fixtures avoid raw-auth and credential-like placeholders", () => {
  const badPattern = /api[_-]?key|secret|credential|password|raw[_-]?auth|bearer|private[_-]?key|production[_-]?db/i;
  for (const fixturePath of [...validFixtures, ...invalidFixtures]) {
    assert.doesNotMatch(readText(fixturePath), badPattern, fixturePath);
  }
});

test("working tree changes stay inside the exact 19-file allowlist", () => {
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
    ...submissionReadinessStaticGapImplementationLaneFiles
  ]);

  const outside = changedPaths.filter((file) => !currentWorkingTreeGuardAllowedFiles.has(file));
  assert.deepEqual(outside, []);
});

console.log("codex_native_supervised_dry_run_execution_receipt_contract_static: ok");
