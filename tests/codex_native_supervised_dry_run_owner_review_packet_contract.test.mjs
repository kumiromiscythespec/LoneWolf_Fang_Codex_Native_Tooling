// BUILD_ID: SUPERVISED_DRY_RUN_OWNER_REVIEW_PACKET_CONTRACTS_20260615
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "SUPERVISED_DRY_RUN_OWNER_REVIEW_PACKET_CONTRACTS_20260615";
const SCHEMA_ID = "lonewolf.codex_native.supervised_dry_run_owner_review_packet.v1";
const TARGET = "supervised_dry_run_owner_review_packet_contracts";
const BASELINE = "bdbef6345a7cb43f97ab267c01da71aa3acd970a";
const NEXT_REVIEW = "START_SUPERVISED_DRY_RUN_OWNER_REVIEW_PACKET_CONTRACTS_IMPLEMENTATION_REVIEW_PACKET";
const SOURCE_EVIDENCE_SHA = "A70B1BF2D6B520E0A15058E451F278B703EA25166891B978063E4CEDEC36DFB0";
const AUDIT_BUNDLE_REFERENCE_SHA = "B1B2C3D4E5F60718293A4B5C6D7E8F90123456789ABCDEF0A1B2C3D4E5F60719";
const SOURCE_EVIDENCE_PATH =
  "C:/Users/yu_ki/AppData/Local/LoneWolfFang/data/codex_native_supervised_dry_run_audit_bundle_reference_contracts_post_push_closeout_packet_20260615_203424.zip";
const AUDIT_BUNDLE_REFERENCE_PATH =
  "C:/Users/yu_ki/AppData/Local/LoneWolfFang/data/future_static_supervised_dry_run_audit_bundle_reference_packet.zip";

const docPath = "docs/orchestration/codex_native_supervised_dry_run_owner_review_packet_contract.md";
const schemaPath = "schema/orchestration/codex_native_supervised_dry_run_owner_review_packet.schema.json";
const testPath = "tests/codex_native_supervised_dry_run_owner_review_packet_contract.test.mjs";
const fixtureRoot = "tests/fixtures/codex-native-supervised-dry-run/owner-review-packet";

const validFixtures = [
  fixtureRoot + "/valid/not-started.json",
  fixtureRoot + "/valid/blocked-owner-review-required.json",
  fixtureRoot + "/valid/blocked-missing-audit-bundle-reference.json",
  fixtureRoot + "/valid/blocked-unsafe-audit-bundle-reference.json",
  fixtureRoot + "/valid/draft-ready.json",
  fixtureRoot + "/valid/evidence-only-assembled.json",
  fixtureRoot + "/valid/ready-for-human-review.json",
  fixtureRoot + "/valid/failed-closed.json",
  fixtureRoot + "/valid/stop-owner-review-required.json"
];

const invalidFixtures = [
  fixtureRoot + "/invalid/auto-approval-true.json",
  fixtureRoot + "/invalid/runtime-execution-true.json",
  fixtureRoot + "/invalid/live-observation-true.json",
  fixtureRoot + "/invalid/audit-bundle-creation-true.json",
  fixtureRoot + "/invalid/worker-launch-true.json",
  fixtureRoot + "/invalid/queue-mutation-true.json",
  fixtureRoot + "/invalid/cloud-api-billing-auth-trading-mutation-true.json",
  fixtureRoot + "/invalid/private-openai-api-true.json",
  fixtureRoot + "/invalid/missing-human-review-one-point.json",
  fixtureRoot + "/invalid/stale-baseline-accepted.json",
  fixtureRoot + "/invalid/ready-treated-as-go.json",
  fixtureRoot + "/invalid/missing-fail-closed-reason.json"
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
const statuses = schema.properties.owner_review_status.enum;
const dangerousFlags = Object.keys(schema.definitions.dangerous_action_flags.properties);
const forbiddenConfirmations = Object.keys(schema.definitions.forbidden_actions_confirmation.properties);
const notGoFlags = Object.keys(schema.definitions.not_go_assertions.properties);
const safeNextActions = schema.properties.recommended_next_action.enum;

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

function defaultFalseObject(keys) {
  return Object.fromEntries(keys.map((key) => [key, false]));
}

function defaultTrueObject(keys) {
  return Object.fromEntries(keys.map((key) => [key, true]));
}

function buildRecord(fixture) {
  const referencePresent = fixture.audit_bundle_reference_present === true;
  return {
    schema: SCHEMA_ID,
    build_id: BUILD_ID,
    owner_review_packet_id: fixture.case_id,
    owner_review_packet_created_at_utc: "2026-06-15T00:00:00Z",
    target: TARGET,
    target_repo: "C:/LoneWolf_Fang_Project/repos/core/LoneWolf_Fang_Codex_Native_Tooling",
    branch: "master",
    stable_baseline: fixture.stable_baseline || BASELINE,
    local_origin_master: BASELINE,
    ahead_behind: "0 / 0",
    source_evidence_references: [
      {
        evidence_role: "supervised_dry_run_audit_bundle_reference_closeout",
        artifact_path: SOURCE_EVIDENCE_PATH,
        artifact_sha256: SOURCE_EVIDENCE_SHA,
        sha256_matches_expected: true,
        evidence_only: true,
        static_reference_only: true,
        authoritative: true
      }
    ],
    audit_bundle_reference_summary: {
      reference_present: referencePresent,
      reference_status: fixture.audit_bundle_reference_status,
      reference_artifact_path: referencePresent ? AUDIT_BUNDLE_REFERENCE_PATH : null,
      reference_artifact_sha256: referencePresent ? AUDIT_BUNDLE_REFERENCE_SHA : null,
      reference_sha256_matches_expected: referencePresent,
      reference_safe_for_owner_review: fixture.audit_bundle_reference_safe,
      static_reference_only: true,
      audit_bundle_created: false,
      presence_is_not_go: true
    },
    safety_boundary_summary: {
      evidence_only: true,
      owner_gated: true,
      fail_closed: true,
      non_runtime: true,
      non_executor: true,
      non_observer: true,
      non_mutating: true,
      human_review_required: true
    },
    owner_review_status: fixture.owner_review_status,
    blocked_reason: fixture.blocked_reason,
    human_review_one_point: fixture.human_review_one_point,
    recommended_next_action: fixture.recommended_next_action,
    stop_owner_review_required: fixture.stop_owner_review_required,
    forbidden_actions_confirmation: defaultFalseObject(forbiddenConfirmations),
    dangerous_action_flags: defaultFalseObject(dangerousFlags),
    not_go_assertions: defaultTrueObject(notGoFlags),
    blocker_matrix: [
      {
        blocker: fixture.blocker,
        status: fixture.blocker_status,
        resolution: fixture.resolution,
        allows_progression: fixture.blocker_status === "PASS"
      }
    ],
    fail_closed_result: "STOP_OWNER_REVIEW_REQUIRED",
    safety_invariants: notGoFlags
  };
}

function validateSourceEvidence(items, errors) {
  if (!Array.isArray(items) || items.length === 0) {
    errors.push("source_evidence_references");
    return;
  }
  for (const item of items) {
    if (!object(item)) {
      errors.push("source_evidence_references.item");
      continue;
    }
    if (typeof item.evidence_role !== "string" || item.evidence_role.length === 0) {
      errors.push("source_evidence_references.evidence_role");
    }
    if (typeof item.artifact_path !== "string" || item.artifact_path.length === 0) {
      errors.push("source_evidence_references.artifact_path");
    }
    if (!sha256(item.artifact_sha256)) errors.push("source_evidence_references.artifact_sha256");
    if (item.sha256_matches_expected !== true) errors.push("source_evidence_references.sha256_matches_expected");
    if (item.evidence_only !== true) errors.push("source_evidence_references.evidence_only");
    if (item.static_reference_only !== true) errors.push("source_evidence_references.static_reference_only");
    if (typeof item.authoritative !== "boolean") errors.push("source_evidence_references.authoritative");
  }
}

function validateOwnerReviewPacket(record) {
  const errors = [];
  const allowed = new Set(Object.keys(schema.properties));

  for (const field of schema.required) if (!Object.hasOwn(record, field)) errors.push("missing " + field);
  for (const field of Object.keys(record)) if (!allowed.has(field)) errors.push("unexpected " + field);
  if (errors.length > 0) return errors;

  if (record.schema !== SCHEMA_ID) errors.push("schema");
  if (record.build_id !== BUILD_ID) errors.push("build_id");
  if (record.target !== TARGET) errors.push("target");
  if (record.branch !== "master") errors.push("branch");
  if (record.stable_baseline !== BASELINE) errors.push("stable_baseline");
  if (record.local_origin_master !== BASELINE) errors.push("local_origin_master");
  if (record.ahead_behind !== "0 / 0") errors.push("ahead_behind");
  if (!statuses.includes(record.owner_review_status)) errors.push("owner_review_status");
  if (typeof record.blocked_reason !== "string" || record.blocked_reason.length === 0) errors.push("blocked_reason");
  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length === 0) {
    errors.push("human_review_one_point");
  }
  if (!safeNextActions.includes(record.recommended_next_action)) errors.push("recommended_next_action");
  if (/GO|EXECUTE|QUEUE|DEPLOY|PUSH|COMMIT|RUNTIME|LIVE|CREATE|SUBMIT|AUTO_APPROVE/iu.test(record.recommended_next_action)) {
    errors.push("recommended_next_action.unsafe");
  }
  if (typeof record.stop_owner_review_required !== "boolean") errors.push("stop_owner_review_required");
  if (record.fail_closed_result !== "STOP_OWNER_REVIEW_REQUIRED") errors.push("fail_closed_result");
  if (!Array.isArray(record.safety_invariants) || record.safety_invariants.length < 20) errors.push("safety_invariants");

  validateSourceEvidence(record.source_evidence_references, errors);

  const audit = record.audit_bundle_reference_summary;
  if (!object(audit)) {
    errors.push("audit_bundle_reference_summary");
  } else {
    if (typeof audit.reference_present !== "boolean") errors.push("audit_bundle_reference_summary.reference_present");
    if (typeof audit.reference_status !== "string" || audit.reference_status.length === 0) {
      errors.push("audit_bundle_reference_summary.reference_status");
    }
    if (audit.reference_present === true) {
      if (typeof audit.reference_artifact_path !== "string" || audit.reference_artifact_path.length === 0) {
        errors.push("audit_bundle_reference_summary.reference_artifact_path");
      }
      if (!sha256(audit.reference_artifact_sha256)) errors.push("audit_bundle_reference_summary.reference_artifact_sha256");
      if (audit.reference_sha256_matches_expected !== true) {
        errors.push("audit_bundle_reference_summary.reference_sha256_matches_expected");
      }
    }
    if (audit.reference_present === false && audit.reference_artifact_sha256 !== null) {
      errors.push("audit_bundle_reference_summary.reference_artifact_sha256");
    }
    if (typeof audit.reference_safe_for_owner_review !== "boolean") {
      errors.push("audit_bundle_reference_summary.reference_safe_for_owner_review");
    }
    if (audit.static_reference_only !== true) errors.push("audit_bundle_reference_summary.static_reference_only");
    if (audit.audit_bundle_created !== false) errors.push("audit_bundle_reference_summary.audit_bundle_created");
    if (audit.presence_is_not_go !== true) errors.push("audit_bundle_reference_summary.presence_is_not_go");
    if (record.owner_review_status === "OWNER_REVIEW_PACKET_BLOCKED_MISSING_AUDIT_BUNDLE_REFERENCE" &&
      audit.reference_present !== false) {
      errors.push("audit_bundle_reference_summary.reference_present");
    }
    if (record.owner_review_status === "OWNER_REVIEW_PACKET_BLOCKED_UNSAFE_AUDIT_BUNDLE_REFERENCE" &&
      audit.reference_safe_for_owner_review !== false) {
      errors.push("audit_bundle_reference_summary.reference_safe_for_owner_review");
    }
  }

  const safety = record.safety_boundary_summary;
  if (!object(safety)) errors.push("safety_boundary_summary");
  else for (const field of Object.keys(schema.definitions.safety_boundary_summary.properties)) {
    if (safety[field] !== true) errors.push("safety_boundary_summary." + field);
  }

  for (const field of forbiddenConfirmations) {
    if (record.forbidden_actions_confirmation?.[field] !== false) {
      errors.push("forbidden_actions_confirmation." + field);
    }
  }
  for (const field of dangerousFlags) {
    if (record.dangerous_action_flags?.[field] !== false) errors.push("dangerous_action_flags." + field);
  }
  for (const field of notGoFlags) {
    if (record.not_go_assertions?.[field] !== true) errors.push("not_go_assertions." + field);
  }

  if (!Array.isArray(record.blocker_matrix) || record.blocker_matrix.length === 0) {
    errors.push("blocker_matrix");
  } else {
    const activeRows = record.blocker_matrix.filter((row) => row.status !== "PASS");
    const blocked = record.owner_review_status.includes("BLOCKED") ||
      record.owner_review_status.includes("FAILED_CLOSED") ||
      record.owner_review_status === "STOP_OWNER_REVIEW_REQUIRED";
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

test("allowlist contains exactly the 24 approved owner review packet files", () => {
  assert.equal(allowedFiles.length, 24);
  assert.equal(validFixtures.length, 9);
  assert.equal(invalidFixtures.length, 12);
  assert.equal(allowedFiles.filter((file) => file.startsWith("docs/")).length, 1);
  assert.equal(allowedFiles.filter((file) => file.startsWith("schema/")).length, 1);
  assert.equal(allowedFiles.filter((file) => /^tests\/[^/]+\.test\.mjs$/u.test(file)).length, 1);
  assert.equal(allowedFiles.filter((file) => file.startsWith("tests/fixtures/")).length, 21);
  for (const file of allowedFiles) {
    assert.doesNotThrow(() => readText(file), file + " should exist");
    assert.doesNotMatch(file, /\*/u);
    assert.doesNotMatch(file, /^(src|tools|scripts|runtime|worker|cloud|deploy|billing|trading|\.git|node_modules)\//u);
  }
});

test("schema pins build, baseline, statuses, required owner fields, and false-only safety flags", () => {
  assert.equal(schema.schema_id, SCHEMA_ID);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additional_properties_allowed, false);
  assert.equal(schema.properties.schema.const, SCHEMA_ID);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.stable_baseline.const, BASELINE);
  assert.equal(schema.properties.local_origin_master.const, BASELINE);
  assert.deepEqual(statuses, [
    "OWNER_REVIEW_PACKET_NOT_STARTED",
    "OWNER_REVIEW_PACKET_BLOCKED_OWNER_REVIEW_REQUIRED",
    "OWNER_REVIEW_PACKET_BLOCKED_MISSING_AUDIT_BUNDLE_REFERENCE",
    "OWNER_REVIEW_PACKET_BLOCKED_UNSAFE_AUDIT_BUNDLE_REFERENCE",
    "OWNER_REVIEW_PACKET_DRAFT_READY",
    "OWNER_REVIEW_PACKET_EVIDENCE_ONLY_ASSEMBLED",
    "OWNER_REVIEW_PACKET_READY_FOR_HUMAN_REVIEW",
    "OWNER_REVIEW_PACKET_FAILED_CLOSED",
    "STOP_OWNER_REVIEW_REQUIRED"
  ]);
  for (const field of [
    "owner_review_status",
    "stable_baseline",
    "source_evidence_references",
    "audit_bundle_reference_summary",
    "safety_boundary_summary",
    "blocked_reason",
    "human_review_one_point",
    "recommended_next_action",
    "stop_owner_review_required",
    "forbidden_actions_confirmation"
  ]) {
    assert.ok(schema.required.includes(field), field);
  }
  for (const field of dangerousFlags) assert.equal(schema.definitions.dangerous_action_flags.properties[field].const, false, field);
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

test("documentation states required owner-review and not-GO boundaries", () => {
  const doc = readText(docPath);
  for (const phrase of [
    "evidence-only",
    "not runtime GO",
    "not auto approval",
    "not an executor",
    "not an observer",
    "not an audit bundle creator",
    "READY` is not GO",
    "MATCHED` is not GO",
    "OBSERVED_SAFE_NO_ACTION` is not GO",
    "Audit bundle reference presence is not enough",
    "Human review remains mandatory",
    "STOP_OWNER_REVIEW_REQUIRED",
    "Stop and Wait - Owner Review Required"
  ]) {
    assert.match(doc, new RegExp(phrase.replace(/[.*+?^{}()|[\]\\]/gu, "\\$&"), "iu"));
  }
});

test("valid owner review packet fixtures are accepted and preserve no-runtime assertions", () => {
  const observedStatuses = new Set();
  for (const fixturePath of validFixtures) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, true, fixturePath);
    const record = buildRecord(fixture);
    const errors = validateOwnerReviewPacket(record);
    assert.deepEqual(errors, [], fixturePath + ": " + errors.join(", "));
    observedStatuses.add(record.owner_review_status);
    for (const field of dangerousFlags) assert.equal(record.dangerous_action_flags[field], false, field);
    for (const field of forbiddenConfirmations) assert.equal(record.forbidden_actions_confirmation[field], false, field);
    for (const field of notGoFlags) assert.equal(record.not_go_assertions[field], true, field);
    assert.equal(record.human_review_one_point.length > 0, true);
  }
  assert.deepEqual(observedStatuses, new Set(statuses));
});

test("invalid owner review packet fixtures fail closed for expected reasons", () => {
  for (const fixturePath of invalidFixtures) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, false, fixturePath);
    const base = buildRecord(readJson(fixtureRoot + "/valid/" + fixture.base_fixture));
    for (const mutation of fixture.mutations || [fixture.mutation]) setPath(base, mutation.path, mutation);
    const errors = validateOwnerReviewPacket(base);
    assert.notEqual(errors.length, 0, fixturePath + " should be invalid");
    assert.ok(
      errors.some((error) => error.includes(fixture.expected_error)),
      fixturePath + " expected " + fixture.expected_error + ", got " + errors.join(", ")
    );
  }
});

test("malformed evidence references and unsafe next actions fail closed", () => {
  const record = buildRecord(readJson(fixtureRoot + "/valid/evidence-only-assembled.json"));
  record.source_evidence_references[0].artifact_sha256 = "NOT_A_SHA";
  record.recommended_next_action = "GO_EXECUTE_RUNTIME";
  const errors = validateOwnerReviewPacket(record);
  assert.ok(errors.includes("source_evidence_references.artifact_sha256"));
  assert.ok(errors.includes("recommended_next_action"));
  assert.ok(errors.includes("recommended_next_action.unsafe"));
});

test("fixtures avoid secret-like or raw-auth tokens", () => {
  const badPattern = /api[_-]?key|secret|credential|password|raw[_-]?auth|bearer|private[_-]?key|production[_-]?db/iu;
  for (const fixturePath of [...validFixtures, ...invalidFixtures]) {
    assert.doesNotMatch(readText(fixturePath), badPattern, fixturePath);
  }
});

test("working tree changes stay inside the exact 24-file allowlist", () => {
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

console.log("codex_native_supervised_dry_run_owner_review_packet_contract_static: ok");
