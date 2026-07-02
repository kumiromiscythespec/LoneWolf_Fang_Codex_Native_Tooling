// BUILD_ID: STABLE_CLOSEOUT_ARTIFACT_CHAIN_READINESS_CONTRACTS_20260614
// BUILD_ID: 2026-06-26_post_merge_closeout_ledger_guard_allowlist_repair_v1
// BUILD_ID: 2026-06-27_squash_merge_retained_branch_realignment_contract_v1
// BUILD_ID: 2026-06-28_untracked_new_file_diff_check_coverage_contract_v1
// BUILD_ID: 2026-07-01_approval_packet_evidence_consistency_contract_v1
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "STABLE_CLOSEOUT_ARTIFACT_CHAIN_READINESS_CONTRACTS_20260614";
const TARGET = "stable_closeout_artifact_chain_readiness_contracts";
const OLD_BASELINE = "c7d1d2dc7ff350bb3ea9d0485d6a1de9441dbc82";
const NEW_BASELINE = "902975798805d96d363a672d1958e658a09fdb41";
const STABLE_CLOSEOUT_SHA = "0F158390EAEE5BCE426B8544886B67CA7AED1EC628D11676F54301CC394F3890";
const SAFE_CLOSEOUT_STATUS = "SAFE_QUEUE_HANDOFF_DRY_RUN_HANDOFF_STABLE_POST_PUSH_CLOSEOUT_PACKET_CREATED";
const SAFE_CLOSEOUT_NEXT = "START_NEXT_SAFE_PARALLEL_WAVE_PLANNING_AFTER_QUEUE_HANDOFF_DRY_RUN_HANDOFF";
const READY = "READY";
const OBSERVED_SAFE_NO_ACTION = "OBSERVED_SAFE_NO_ACTION";
const OWNER_REVIEW = "OWNER_REVIEW_REQUIRED";
const NEXT_APPROVAL = "START_SELECTED_NEXT_TARGET_IMPLEMENTATION_APPROVAL_PACKET";

const allowedFiles = [
  "docs/orchestration/codex_native_stable_closeout_artifact_chain_readiness_contract.md",
  "schema/orchestration/codex_native_stable_closeout_artifact_chain_readiness.schema.json",
  "tests/codex_native_stable_closeout_artifact_chain_readiness_contract.test.mjs",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/valid/accepted-closeout-chain.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/valid/owner-review-required.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/valid/next-prompt-readiness.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/missing-stable-closeout-sha.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/wrong-parent-baseline.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/recommended-runtime-action.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/queue-mutation-flag-true.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/missing-human-review-one-point.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/outside-allowlist-artifact.json"
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

const postMergeCloseoutLedgerContractImplementationLaneFiles = [
  "docs/orchestration/post_merge_closeout_ledger_contract.md",
  "schema/orchestration/post_merge_closeout_ledger_contract.schema.json",
  "tests/post_merge_closeout_ledger_contract.test.mjs",
  "tests/fixtures/post-merge-closeout-ledger-contract/valid/pr6-merged-no-runtime-action.json",
  "tests/fixtures/post-merge-closeout-ledger-contract/invalid/runtime-action-requested.json",
  "tests/fixtures/post-merge-closeout-ledger-contract/invalid/missing-owner-acceptance.json"
];
const squashMergeRetainedBranchRealignmentContractImplementationLaneFiles = [
  "docs/orchestration/squash_merge_retained_branch_realignment_contract.md",
  "schema/orchestration/squash_merge_retained_branch_realignment_contract.schema.json",
  "tests/squash_merge_retained_branch_realignment_contract.test.mjs",
  "tests/fixtures/squash-merge-retained-branch-realignment-contract/valid/clean-branch-realignment-ready.json",
  "tests/fixtures/squash-merge-retained-branch-realignment-contract/invalid/unexpected-carryover-files.json",
  "tests/fixtures/squash-merge-retained-branch-realignment-contract/invalid/force-push-or-branch-delete-requested.json"
];
const untrackedNewFileDiffCheckCoverageContractImplementationLaneFiles = [
  "docs/orchestration/untracked_new_file_diff_check_coverage_contract.md",
  "schema/orchestration/untracked_new_file_diff_check_coverage_contract.schema.json",
  "tests/untracked_new_file_diff_check_coverage_contract.test.mjs",
  "tests/fixtures/untracked-new-file-diff-check-coverage-contract/valid/complete-intended-file-set-covered.json",
  "tests/fixtures/untracked-new-file-diff-check-coverage-contract/invalid/untracked-new-file-not-covered.json",
  "tests/fixtures/untracked-new-file-diff-check-coverage-contract/invalid/push-approved-after-committed-diff-check-failure.json",
  "docs/orchestration/approval_packet_evidence_consistency_contract.md",
  "schema/orchestration/approval_packet_evidence_consistency_contract.schema.json",
  "tests/approval_packet_evidence_consistency_contract.test.mjs",
  "tests/fixtures/approval-packet-evidence-consistency-contract/valid/consistent-commit-approval-packet.json",
  "tests/fixtures/approval-packet-evidence-consistency-contract/invalid/untracked-list-contradicts-manifest.json",
  "tests/fixtures/approval-packet-evidence-consistency-contract/invalid/changed-files-count-contradicts-manifest.json",
  "tests/fixtures/approval-packet-evidence-consistency-contract/invalid/status-split-contradicts-lists.json",
  "tests/fixtures/approval-packet-evidence-consistency-contract/invalid/ready-classification-with-failed-check.json"
];
const validFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/valid/accepted-closeout-chain.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/valid/owner-review-required.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/valid/next-prompt-readiness.json"
];

const invalidFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/missing-stable-closeout-sha.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/wrong-parent-baseline.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/recommended-runtime-action.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/queue-mutation-flag-true.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/missing-human-review-one-point.json",
  "tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/outside-allowlist-artifact.json"
];

const schema = readJson("schema/orchestration/codex_native_stable_closeout_artifact_chain_readiness.schema.json");
const validFixtures = validFixturePaths.map((path) => [path, readJson(path)]);
const invalidFixtures = invalidFixturePaths.map((path) => [path, readJson(path)]);
const rootRequired = schema.required;
const rootAllowed = new Set(Object.keys(schema.properties));
const readinessStates = schema.properties.closeout_readiness_state.enum;
const statusValues = schema.properties.status.enum;
const safeNextActions = schema.properties.recommended_next_action.enum;
const forbiddenFlags = Object.keys(schema.$defs.forbidden_action_flags.properties);
const invariantFlags = Object.keys(schema.$defs.safety_invariants.properties);

function nonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function sha256(value) {
  return typeof value === "string" && /^[A-Fa-f0-9]{64}$/u.test(value);
}

function missingRequired(required, value) {
  return required.filter((field) => !Object.hasOwn(value, field));
}

function unexpectedProperties(allowed, value) {
  return Object.keys(value).filter((field) => !allowed.has(field));
}

function safeArtifactPath(value) {
  return typeof value === "string" && value.startsWith("C:/Users/yu_ki/AppData/Local/LoneWolfFang/data/");
}

function unsafeNextAction(value) {
  return /GO|RUN|RUNTIME|EXECUTE|EXECUTOR|WORKFLOW|QUEUE|ENQUEUE|WORKER|DAEMON|WATCHER|DEPLOY|PUSH|COMMIT|CLOUD|API|BILLING|AUTH|TRADING|ORDER|LIVE|PAPER|FETCH_BALANCE/u.test(value);
}

function validateReadiness(record) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) return ["missing readiness"];

  for (const field of missingRequired(rootRequired, record)) errors.push(`missing ${field}`);
  for (const field of unexpectedProperties(rootAllowed, record)) errors.push(`unexpected ${field}`);
  if (errors.length) return errors;

  if (record.schema !== schema.properties.schema.const) errors.push("schema");
  if (record.build_id !== BUILD_ID) errors.push("build_id");
  if (record.target !== TARGET) errors.push("target");
  if (!statusValues.includes(record.status)) errors.push("status");
  if (!readinessStates.includes(record.closeout_readiness_state)) errors.push("closeout_readiness_state");

  const chain = record.artifact_chain;
  if (!chain || typeof chain !== "object" || Array.isArray(chain)) {
    errors.push("artifact_chain");
  } else {
    if (!safeArtifactPath(chain.stable_closeout_packet_path)) errors.push("artifact path outside allowlist");
    if (!sha256(chain.stable_closeout_sha256)) errors.push("stable_closeout_sha256");
    if (chain.stable_closeout_sha256 !== STABLE_CLOSEOUT_SHA) errors.push("stable_closeout_sha256");
    if (chain.stable_closeout_sha256_matches !== true) errors.push("stable_closeout_sha256_matches");
    if (!sha256(chain.parent_artifact_sha256)) errors.push("parent_artifact_sha256");
    if (chain.parent_artifact_sha256_matches !== true) errors.push("parent_artifact_sha256_matches");
    if (chain.artifact_chain_authoritative !== true) errors.push("artifact_chain_authoritative");
    if (chain.outside_allowlist_artifact_reference !== false) errors.push("outside_allowlist_artifact_reference");
  }

  const transition = record.baseline_transition;
  if (!transition || typeof transition !== "object" || Array.isArray(transition)) {
    errors.push("baseline_transition");
  } else {
    if (transition.old_stable_baseline !== OLD_BASELINE) errors.push("old_stable_baseline");
    if (transition.new_stable_baseline !== NEW_BASELINE) errors.push("new_stable_baseline");
    if (transition.parent_baseline !== OLD_BASELINE) errors.push("parent_baseline");
    if (transition.parent_matches_old_stable !== true) errors.push("parent_baseline");
    if (transition.expected_branch !== "master") errors.push("expected_branch");
    if (transition.expected_ahead_behind !== "0 / 0") errors.push("expected_ahead_behind");
    if (transition.stale_baseline_detected !== false) errors.push("stale_baseline_detected");
  }

  const closeout = record.closeout_packet;
  if (!closeout || typeof closeout !== "object" || Array.isArray(closeout)) {
    errors.push("closeout_packet");
  } else {
    if (closeout.packet_role !== "stable_post_push_closeout_packet") errors.push("packet_role");
    if (!safeArtifactPath(closeout.packet_path)) errors.push("artifact path outside allowlist");
    if (!sha256(closeout.stable_closeout_sha256)) errors.push("stable_closeout_sha256");
    if (closeout.stable_closeout_sha256 !== STABLE_CLOSEOUT_SHA) errors.push("stable_closeout_sha256");
    if (closeout.final_status !== SAFE_CLOSEOUT_STATUS) errors.push("final_status");
    if (closeout.recommended_next_action !== SAFE_CLOSEOUT_NEXT) errors.push("closeout recommended_next_action");
  }

  if (!safeNextActions.includes(record.recommended_next_action)) errors.push("recommended_next_action");
  if (unsafeNextAction(record.recommended_next_action)) errors.push("runtime recommendation");
  if (!Array.isArray(record.allowed_next_actions) || record.allowed_next_actions.length === 0) errors.push("allowed_next_actions");
  if (Array.isArray(record.allowed_next_actions)) {
    for (const action of record.allowed_next_actions) {
      if (!safeNextActions.includes(action)) errors.push("allowed_next_actions");
      if (unsafeNextAction(action)) errors.push("runtime recommendation");
    }
  }

  if (!nonEmptyString(record.human_review_one_point)) errors.push("human_review_one_point");

  for (const flag of forbiddenFlags) {
    if (record.forbidden_action_flags?.[flag] !== false) errors.push(flag);
  }
  for (const flag of invariantFlags) {
    if (record.safety_invariants?.[flag] !== false) errors.push(flag);
  }
  if (record.artifact_allowlist?.allowed_artifact_root !== "C:/Users/yu_ki/AppData/Local/LoneWolfFang/data") {
    errors.push("artifact_allowlist");
  }
  if (record.artifact_allowlist?.outside_repo_artifact_only !== true) errors.push("artifact_allowlist");

  return errors;
}

test("docs, schema, and allowlist carry BUILD_ID and static-only boundaries", () => {
  const doc = readText("docs/orchestration/codex_native_stable_closeout_artifact_chain_readiness_contract.md");
  assert.ok(doc.startsWith(`# BUILD_ID: ${BUILD_ID}`));
  assert.match(doc, /READY is not GO/);
  assert.match(doc, /OBSERVED_SAFE_NO_ACTION is not GO/);
  assert.match(doc, /Stable closeout evidence is not an executor/);
  assert.match(doc, /review evidence only/i);
  assert.match(doc, /Queue mutation/i);
  assert.match(doc, /Expected Next Workflow/);

  assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema.const, "lonewolf.codex_native.stable_closeout_artifact_chain_readiness.v1");
  assert.equal(schema.properties.target.const, TARGET);
  assert.deepEqual(readinessStates, [READY, OBSERVED_SAFE_NO_ACTION, OWNER_REVIEW, "STOP_OWNER_REVIEW_REQUIRED"]);
  assert.deepEqual(safeNextActions, [OWNER_REVIEW, NEXT_APPROVAL]);
  assert.equal(schema.$defs.baseline_transition.properties.old_stable_baseline.const, OLD_BASELINE);
  assert.equal(schema.$defs.baseline_transition.properties.new_stable_baseline.const, NEW_BASELINE);
  assert.equal(schema.$defs.baseline_transition.properties.parent_baseline.const, OLD_BASELINE);
  assert.equal(schema.$defs.closeout_packet.properties.final_status.const, SAFE_CLOSEOUT_STATUS);
  assert.equal(schema.$defs.closeout_packet.properties.recommended_next_action.const, SAFE_CLOSEOUT_NEXT);
  for (const flag of forbiddenFlags) assert.equal(schema.$defs.forbidden_action_flags.properties[flag].const, false);
  for (const flag of invariantFlags) assert.equal(schema.$defs.safety_invariants.properties[flag].const, false);

  assert.equal(allowedFiles.length, 12);
  assert.equal(allowedFiles.filter((path) => path.startsWith("docs/")).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("schema/")).length, 1);
  assert.equal(allowedFiles.filter((path) => /^tests\/[^/]+\.test\.mjs$/u.test(path)).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("tests/fixtures/")).length, 9);
  for (const file of allowedFiles) {
    assert.doesNotThrow(() => readText(file), `${file} must exist`);
    assert.match(file, /^(docs|schema|tests|tests\/fixtures)\//u);
    assert.doesNotMatch(file, /^(src|tools|scripts|runtime|worker|cloud|deploy|billing|trading|\.git|node_modules)\//u);
    assert.ok(readText(file).includes(BUILD_ID), `${file} must include BUILD_ID`);
  }
});

test("valid stable closeout readiness fixtures pass", () => {
  assert.equal(validFixtures.length, 3);
  for (const [fixturePath, fixture] of validFixtures) {
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, true, fixturePath);
    assert.deepEqual(validateReadiness(fixture.readiness), [], fixturePath);
    assert.equal(fixture.readiness.safety_invariants.ready_is_go, false, fixturePath);
    assert.equal(fixture.readiness.safety_invariants.observed_safe_no_action_is_go, false, fixturePath);
    assert.equal(fixture.readiness.safety_invariants.automatic_go_allowed, false, fixturePath);
    for (const flag of forbiddenFlags) assert.equal(fixture.readiness.forbidden_action_flags[flag], false, `${fixturePath} ${flag}`);
  }
});

test("invalid fixture matrix fails closed", () => {
  assert.equal(invalidFixtures.length, 6);
  for (const [fixturePath, fixture] of invalidFixtures) {
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, false, fixturePath);
    const errors = validateReadiness(fixture.readiness);
    assert.ok(
      errors.some((error) => error.includes(fixture.expected_error)),
      `${fixturePath} expected ${fixture.expected_error}, got ${errors.join(", ")}`
    );
  }
});

test("specific safety semantics fail closed", () => {
  const accepted = validFixtures[0][1].readiness;
  assert.equal(accepted.closeout_readiness_state, READY);
  assert.equal(accepted.safety_invariants.ready_is_go, false);
  assert.equal(accepted.safety_invariants.observed_safe_no_action_is_go, false);
  assert.notEqual(accepted.recommended_next_action, "GO");

  const runtime = readJson("tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/recommended-runtime-action.json");
  assert.ok(validateReadiness(runtime.readiness).some((error) => error.includes("runtime recommendation")));

  const queue = readJson("tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/queue-mutation-flag-true.json");
  assert.ok(validateReadiness(queue.readiness).some((error) => error.includes("queue_mutation_performed")));

  const missingHumanReview = readJson("tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/missing-human-review-one-point.json");
  assert.ok(validateReadiness(missingHumanReview.readiness).some((error) => error.includes("human_review_one_point")));

  const missingSha = readJson("tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/missing-stable-closeout-sha.json");
  assert.ok(validateReadiness(missingSha.readiness).some((error) => error.includes("stable_closeout_sha256")));

  const wrongParent = readJson("tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/wrong-parent-baseline.json");
  assert.ok(validateReadiness(wrongParent.readiness).some((error) => error.includes("parent_baseline")));

  const outsideArtifact = readJson("tests/fixtures/codex-native-supervised-dry-run/stable-closeout-artifact-chain-readiness/invalid/outside-allowlist-artifact.json");
  assert.ok(validateReadiness(outsideArtifact.readiness).some((error) => error.includes("outside_allowlist_artifact_reference")));
});

test("fixtures avoid secret-like or raw-auth placeholders", () => {
  const badPattern = /api[_-]?key|secret|credential|password|raw[_-]?auth|bearer|private[_-]?key|production[_-]?db/iu;
  for (const fixturePath of [...validFixturePaths, ...invalidFixturePaths]) {
    assert.doesNotMatch(readText(fixturePath), badPattern, fixturePath);
  }
});

test("working tree changes stay inside the exact 12-file allowlist", () => {
  const result = spawnSync("git", ["status", "--short", "--untracked-files=all"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const changedPaths = result.stdout
    .split(/\r?\n/u)
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
    ...noteCoreArtifactAdoptionLedgerImplementationLaneFiles,
    ...postMergeCloseoutLedgerContractImplementationLaneFiles,
    ...squashMergeRetainedBranchRealignmentContractImplementationLaneFiles,
    ...untrackedNewFileDiffCheckCoverageContractImplementationLaneFiles,
    "docs/orchestration/post_merge_closeout_evidence_consistency_contract.md",
    "schema/orchestration/post_merge_closeout_evidence_consistency_contract.schema.json",
    "tests/post_merge_closeout_evidence_consistency_contract.test.mjs",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/valid/consistent-post-merge-closeout-ready.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/ready-classification-but-pr-not-merged.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/closed-lane-but-open-pr-remains.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/remote-master-mismatch.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/source-diff-not-empty.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/branch-retention-mismatch.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/safety-boundary-contradiction.json"
  ]);

  const outside = changedPaths.filter((path) => !currentWorkingTreeGuardAllowedFiles.has(path));
  assert.deepEqual(outside, []);
});

console.log("codex_native_stable_closeout_artifact_chain_readiness_contract_static: ok");
