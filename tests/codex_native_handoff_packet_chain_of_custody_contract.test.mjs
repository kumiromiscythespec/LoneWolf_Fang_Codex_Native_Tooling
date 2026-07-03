// BUILD_ID: HANDOFF_PACKET_CHAIN_OF_CUSTODY_CONTRACTS_20260614
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

const BUILD_ID = "HANDOFF_PACKET_CHAIN_OF_CUSTODY_CONTRACTS_20260614";
const TARGET = "handoff_packet_chain_of_custody_contracts";
const BASELINE = "4078e57ef6d638de1e1a38620d6eaf6776adaab6";
const READY = "READY";
const OBSERVED_SAFE_NO_ACTION = "OBSERVED_SAFE_NO_ACTION";
const OWNER_REVIEW = "OWNER_REVIEW_REQUIRED";
const STOP = "STOP_OWNER_REVIEW_REQUIRED";
const NEXT_REVIEW = "START_HANDOFF_PACKET_CHAIN_OF_CUSTODY_IMPLEMENTATION_REVIEW_PACKET";

const allowedFiles = [
  "docs/orchestration/codex_native_handoff_packet_chain_of_custody_contract.md",
  "schema/orchestration/codex_native_handoff_packet_chain_of_custody.schema.json",
  "tests/codex_native_handoff_packet_chain_of_custody_contract.test.mjs",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/valid/accepted-chain-index.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/valid/owner-review-required.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/missing-packet-sha256.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/manifest-status-mismatch.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/runtime-next-action.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/queue-mutation-flag-true.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/draft-artifact-used-as-authoritative.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/missing-human-review-one-point.json"
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
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/valid/accepted-chain-index.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/valid/owner-review-required.json"
];

const invalidFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/missing-packet-sha256.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/manifest-status-mismatch.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/runtime-next-action.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/queue-mutation-flag-true.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/draft-artifact-used-as-authoritative.json",
  "tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/invalid/missing-human-review-one-point.json"
];

const schema = readJson("schema/orchestration/codex_native_handoff_packet_chain_of_custody.schema.json");
const rootRequired = schema.required;
const rootAllowed = new Set(Object.keys(schema.properties));
const statusValues = schema.properties.status.enum;
const custodyStates = schema.properties.custody_state.enum;
const safeNextActions = schema.properties.allowed_next_actions.items.enum;
const forbiddenFlags = Object.keys(schema.$defs.forbidden_action_flags.properties);
const invariantFlags = Object.keys(schema.$defs.safety_invariants.properties);
const validFixtures = validFixturePaths.map((path) => [path, readJson(path)]);
const invalidFixtures = invalidFixturePaths.map((path) => [path, readJson(path)]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

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
  return /GO|RUN|RUNTIME|EXECUTE|EXECUTOR|WORKFLOW|QUEUE|ENQUEUE|WORKER|DAEMON|WATCHER|DEPLOY|PUSH|COMMIT|CLOUD|API|BILLING|AUTH|TRADING|ORDER|LIVE|PAPER|FETCH_BALANCE|AUTO_CONTINUE/u.test(value);
}

function setPath(target, dottedPath, mutation) {
  const parts = dottedPath.split(".");
  let cursor = target;
  for (const part of parts.slice(0, -1)) cursor = cursor[part];
  const last = parts.at(-1);
  if (mutation.delete === true) delete cursor[last];
  else cursor[last] = mutation.value;
}

function baseCustodyFor(file) {
  return clone(readJson(`tests/fixtures/codex-native-supervised-dry-run/handoff-packet-chain-of-custody/valid/${file}`).custody);
}

function validateCustody(record) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) return ["missing custody"];

  for (const field of missingRequired(rootRequired, record)) errors.push(`missing ${field}`);
  for (const field of unexpectedProperties(rootAllowed, record)) errors.push(`unexpected ${field}`);
  if (errors.length) return errors;

  if (record.schema !== schema.properties.schema.const) errors.push("schema");
  if (record.build_id !== BUILD_ID) errors.push("build_id");
  if (record.target !== TARGET) errors.push("target");
  if (!statusValues.includes(record.status)) errors.push("status");
  if (!custodyStates.includes(record.custody_state)) errors.push("custody_state");
  if (record.current_stable_baseline !== BASELINE) errors.push("current_stable_baseline");
  if (!nonEmptyString(record.human_review_one_point)) errors.push("human_review_one_point");

  if (!Array.isArray(record.packet_chain) || record.packet_chain.length === 0) {
    errors.push("packet_chain");
  } else {
    const packetIds = new Set();
    for (const entry of record.packet_chain) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        errors.push("packet_entry");
        continue;
      }
      for (const field of schema.$defs.packet_entry.required) {
        if (!Object.hasOwn(entry, field)) errors.push(`missing ${field}`);
      }
      if (!nonEmptyString(entry.packet_id)) errors.push("packet_id");
      if (!nonEmptyString(entry.packet_role)) errors.push("packet_role");
      if (!safeArtifactPath(entry.packet_path)) errors.push("packet_path");
      if (!sha256(entry.packet_sha256)) errors.push("packet_sha256");
      if (!nonEmptyString(entry.expected_manifest_status)) errors.push("expected_manifest_status");
      if (!nonEmptyString(entry.observed_manifest_status)) errors.push("observed_manifest_status");
      if (entry.expected_manifest_status !== entry.observed_manifest_status) errors.push("manifest status mismatch");
      if (entry.manifest_status_matches_expected !== true) errors.push("manifest status mismatch");
      if (entry.selected_target_matches_expected !== true) errors.push("selected target mismatch");
      if (entry.baseline_matches_current_stable !== true) errors.push("baseline mismatch");
      if (entry.is_authoritative !== true) errors.push("authoritative packet");
      if (entry.is_draft_or_partial !== false) errors.push("draft artifact authoritative");
      packetIds.add(entry.packet_id);
    }
    if (Array.isArray(record.authoritative_packets)) {
      for (const packetId of record.authoritative_packets) {
        if (!packetIds.has(packetId)) errors.push("authoritative packet");
      }
    }
  }

  if (!Array.isArray(record.authoritative_packets) || record.authoritative_packets.length === 0) {
    errors.push("authoritative_packets");
  }

  const draftIds = new Set();
  if (!Array.isArray(record.draft_or_partial_artifacts)) {
    errors.push("draft_or_partial_artifacts");
  } else {
    for (const artifact of record.draft_or_partial_artifacts) {
      if (!artifact || typeof artifact !== "object" || Array.isArray(artifact)) {
        errors.push("draft_or_partial_artifact");
        continue;
      }
      if (!nonEmptyString(artifact.artifact_id)) errors.push("draft artifact id");
      if (!safeArtifactPath(artifact.artifact_path)) errors.push("draft artifact path");
      if (!nonEmptyString(artifact.artifact_role)) errors.push("draft artifact role");
      if (artifact.authoritative_usage_allowed !== false) errors.push("draft artifact authoritative");
      draftIds.add(artifact.artifact_id);
    }
  }
  if (Array.isArray(record.authoritative_packets)) {
    for (const packetId of record.authoritative_packets) {
      if (draftIds.has(packetId)) errors.push("draft artifact authoritative");
    }
  }

  const manifest = record.manifest_consistency;
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    errors.push("manifest_consistency");
  } else {
    if (manifest.all_manifest_statuses_match_expected !== true) errors.push("manifest status mismatch");
    if (manifest.all_selected_targets_match_expected !== true) errors.push("selected target mismatch");
    if (manifest.all_sha256_values_match_expected !== true) errors.push("packet_sha256");
    if (manifest.missing_or_mismatched_manifest_fails_closed !== true) errors.push("manifest status mismatch");
  }

  const relationship = record.next_packet_relationship;
  if (!relationship || typeof relationship !== "object" || Array.isArray(relationship)) {
    errors.push("next_packet_relationship");
  } else {
    if (!safeNextActions.includes(relationship.recommended_next_action)) errors.push("recommended_next_action");
    if (unsafeNextAction(relationship.recommended_next_action)) errors.push("runtime next action");
    if (relationship.next_action_owner_gated_packet_step_only !== true) errors.push("owner gated next action");
    if (relationship.automatic_continuation_allowed !== false) errors.push("automatic_continuation_allowed");
    if (relationship.runtime_or_queue_transition_allowed !== false) errors.push("runtime next action");
  }

  const prompt = record.next_prompt_readiness;
  if (!prompt || typeof prompt !== "object" || Array.isArray(prompt)) {
    errors.push("next_prompt_readiness");
  } else {
    if (prompt.next_codex_prompt_present !== true) errors.push("next_codex_prompt_present");
    if (prompt.next_prompt_owner_gated_only !== true) errors.push("next_prompt_owner_gated_only");
    for (const field of [
      "next_prompt_runtime_allowed",
      "next_prompt_queue_mutation_allowed",
      "next_prompt_worker_launch_allowed",
      "next_prompt_deploy_allowed",
      "next_prompt_commit_or_push_allowed"
    ]) {
      if (prompt[field] !== false) errors.push(field);
    }
  }

  if (!Array.isArray(record.allowed_next_actions) || record.allowed_next_actions.length === 0) {
    errors.push("allowed_next_actions");
  } else {
    for (const action of record.allowed_next_actions) {
      if (!safeNextActions.includes(action)) errors.push("allowed_next_actions");
      if (unsafeNextAction(action)) errors.push("runtime next action");
    }
  }

  for (const flag of forbiddenFlags) {
    if (record.forbidden_action_flags?.[flag] !== false) errors.push(flag);
  }
  for (const flag of invariantFlags) {
    if (record.safety_invariants?.[flag] !== true) errors.push(flag);
  }

  return errors;
}

test("docs, schema, and allowlist carry BUILD_ID and review-only semantics", () => {
  const doc = readText("docs/orchestration/codex_native_handoff_packet_chain_of_custody_contract.md");
  assert.ok(doc.startsWith(`# BUILD_ID: ${BUILD_ID}`));
  assert.match(doc, /Handoff packet chain evidence is not an executor/);
  assert.match(doc, /READY is not GO/);
  assert.match(doc, /OBSERVED_SAFE_NO_ACTION is not GO/);
  assert.match(doc, /review evidence only/i);
  assert.match(doc, /Queue mutation/i);
  assert.match(doc, /Draft artifact usage as authoritative fails closed/);

  assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema.const, "lonewolf.codex_native.handoff_packet_chain_of_custody.v1");
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.current_stable_baseline.const, BASELINE);
  assert.deepEqual(custodyStates, [READY, OBSERVED_SAFE_NO_ACTION, OWNER_REVIEW, STOP]);
  assert.deepEqual(safeNextActions, [NEXT_REVIEW, OWNER_REVIEW, STOP]);
  assert.equal(schema.$defs.next_packet_relationship.properties.automatic_continuation_allowed.const, false);
  assert.equal(schema.$defs.next_packet_relationship.properties.runtime_or_queue_transition_allowed.const, false);
  for (const flag of forbiddenFlags) assert.equal(schema.$defs.forbidden_action_flags.properties[flag].const, false);
  for (const flag of invariantFlags) assert.equal(schema.$defs.safety_invariants.properties[flag].const, true);

  assert.equal(allowedFiles.length, 11);
  assert.equal(allowedFiles.filter((path) => path.startsWith("docs/")).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("schema/")).length, 1);
  assert.equal(allowedFiles.filter((path) => /^tests\/[^/]+\.test\.mjs$/u.test(path)).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("tests/fixtures/")).length, 8);
  for (const file of allowedFiles) {
    assert.doesNotThrow(() => readText(file), `${file} must exist`);
    assert.match(file, /^(docs|schema|tests|tests\/fixtures)\//u);
    assert.doesNotMatch(file, /^(src|tools|scripts|runtime|worker|cloud|deploy|billing|trading|\.git|node_modules)\//u);
    assert.ok(readText(file).includes(BUILD_ID), `${file} must include BUILD_ID`);
  }
});

test("valid handoff packet chain custody fixtures pass", () => {
  assert.equal(validFixtures.length, 2);
  for (const [fixturePath, fixture] of validFixtures) {
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, true, fixturePath);
    assert.deepEqual(validateCustody(fixture.custody), [], fixturePath);
    assert.equal(fixture.custody.safety_invariants.artifacts_are_evidence_only, true, fixturePath);
    assert.equal(fixture.custody.safety_invariants.ready_is_not_go, true, fixturePath);
    assert.equal(fixture.custody.safety_invariants.observed_safe_no_action_is_not_go, true, fixturePath);
    for (const flag of forbiddenFlags) assert.equal(fixture.custody.forbidden_action_flags[flag], false, `${fixturePath} ${flag}`);
  }
  assert.equal(validFixtures[0][1].custody.custody_state, READY);
  assert.equal(validFixtures[1][1].custody.custody_state, OWNER_REVIEW);
});

test("invalid handoff packet chain custody fixtures fail closed", () => {
  assert.equal(invalidFixtures.length, 6);
  for (const [fixturePath, fixture] of invalidFixtures) {
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, false, fixturePath);
    const custody = baseCustodyFor(fixture.base_fixture);
    for (const mutationKey of ["mutation", "secondary_mutation", "tertiary_mutation"]) {
      if (fixture[mutationKey]) setPath(custody, fixture[mutationKey].path, fixture[mutationKey]);
    }
    const errors = validateCustody(custody);
    assert.ok(
      errors.some((error) => error.includes(fixture.expected_error)),
      `${fixturePath} expected ${fixture.expected_error}, got ${errors.join(", ")}`
    );
  }
});

test("READY and OBSERVED_SAFE_NO_ACTION never authorize execution", () => {
  const accepted = baseCustodyFor("accepted-chain-index.json");
  assert.equal(accepted.custody_state, READY);
  assert.equal(accepted.safety_invariants.ready_is_not_go, true);
  assert.equal(accepted.safety_invariants.observed_safe_no_action_is_not_go, true);
  assert.equal(accepted.next_packet_relationship.automatic_continuation_allowed, false);
  assert.equal(accepted.next_packet_relationship.runtime_or_queue_transition_allowed, false);
  assert.notEqual(accepted.next_packet_relationship.recommended_next_action, "GO");

  const observed = clone(accepted);
  observed.custody_state = OBSERVED_SAFE_NO_ACTION;
  assert.deepEqual(validateCustody(observed), []);
  assert.equal(observed.next_packet_relationship.automatic_continuation_allowed, false);
  assert.equal(observed.next_packet_relationship.runtime_or_queue_transition_allowed, false);
});

test("specific custody hazards fail closed", () => {
  const missingSha = baseCustodyFor("accepted-chain-index.json");
  delete missingSha.packet_chain[0].packet_sha256;
  assert.ok(validateCustody(missingSha).some((error) => error.includes("packet_sha256")));

  const mismatch = baseCustodyFor("accepted-chain-index.json");
  mismatch.packet_chain[0].observed_manifest_status = "OWNER_REVIEW_REQUIRED";
  mismatch.packet_chain[0].manifest_status_matches_expected = false;
  assert.ok(validateCustody(mismatch).some((error) => error.includes("manifest status mismatch")));

  const runtime = baseCustodyFor("accepted-chain-index.json");
  runtime.next_packet_relationship.recommended_next_action = "RUN_RUNTIME_WORKFLOW";
  runtime.allowed_next_actions = ["RUN_RUNTIME_WORKFLOW"];
  assert.ok(validateCustody(runtime).some((error) => error.includes("runtime next action")));

  const queue = baseCustodyFor("accepted-chain-index.json");
  queue.forbidden_action_flags.queue_mutation_performed = true;
  assert.ok(validateCustody(queue).some((error) => error.includes("queue_mutation_performed")));

  const draft = baseCustodyFor("accepted-chain-index.json");
  draft.authoritative_packets.push("partial-review-draft");
  assert.ok(validateCustody(draft).some((error) => error.includes("draft artifact authoritative")));

  const missingHumanReview = baseCustodyFor("accepted-chain-index.json");
  missingHumanReview.human_review_one_point = "";
  assert.ok(validateCustody(missingHumanReview).some((error) => error.includes("human_review_one_point")));
});

test("fixtures avoid secret-like or raw-auth placeholders", () => {
  const badPattern = /api[_-]?key|secret|credential|password|raw[_-]?auth|bearer|private[_-]?key|production[_-]?db/iu;
  for (const fixturePath of [...validFixturePaths, ...invalidFixturePaths]) {
    assert.doesNotMatch(readText(fixturePath), badPattern, fixturePath);
  }
});

test("current repo edits remain inside the exact handoff custody allowlist", () => {
  const status = spawnSync("git", ["status", "--short", "--untracked-files=all"], {
    cwd: root,
    encoding: "utf8"
  });
  assert.equal(status.status, 0, status.stderr);

  const changed = status.stdout
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => line.replace(/^..\s+/, "").replace(/^R\s+.* -> /, ""))
    .map((path) => path.replace(/\\/gu, "/"));

  const allowed = new Set([
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
    "docs/orchestration/post_merge_closeout_acceptance_reference_consistency_contract.md",
    "schema/orchestration/post_merge_closeout_acceptance_reference_consistency_contract.schema.json",
    "tests/post_merge_closeout_acceptance_reference_consistency_contract.test.mjs",
    "tests/fixtures/post-merge-closeout-acceptance-reference-consistency-contract/valid/consistent-owner-accepted-closeout-reference.json",
    "tests/fixtures/post-merge-closeout-acceptance-reference-consistency-contract/invalid/accepted-status-without-owner-phrase.json",
    "tests/fixtures/post-merge-closeout-acceptance-reference-consistency-contract/invalid/closeout-packet-sha-mismatch.json",
    "tests/fixtures/post-merge-closeout-acceptance-reference-consistency-contract/invalid/final-lane-status-mismatch.json",
    "tests/fixtures/post-merge-closeout-acceptance-reference-consistency-contract/invalid/next-scout-source-mismatch.json",
    "tests/fixtures/post-merge-closeout-acceptance-reference-consistency-contract/invalid/runtime-action-present-after-acceptance.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/valid/consistent-post-merge-closeout-ready.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/ready-classification-but-pr-not-merged.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/closed-lane-but-open-pr-remains.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/remote-master-mismatch.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/source-diff-not-empty.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/branch-retention-mismatch.json",
    "tests/fixtures/post-merge-closeout-evidence-consistency-contract/invalid/safety-boundary-contradiction.json"
  ]);
  for (const file of changed) {
    assert.ok(allowed.has(file), `unexpected changed file: ${file}`);
  }
});
