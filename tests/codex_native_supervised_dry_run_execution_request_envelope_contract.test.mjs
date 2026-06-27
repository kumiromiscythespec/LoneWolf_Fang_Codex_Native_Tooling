// BUILD_ID: SUPERVISED_DRY_RUN_EXECUTION_REQUEST_ENVELOPE_CONTRACTS_20260615
// BUILD_ID: 2026-06-26_post_merge_closeout_ledger_guard_allowlist_repair_v1
// BUILD_ID: 2026-06-27_squash_merge_retained_branch_realignment_contract_v1
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "SUPERVISED_DRY_RUN_EXECUTION_REQUEST_ENVELOPE_CONTRACTS_20260615";
const SCHEMA_ID = "lonewolf.codex_native.supervised_dry_run_execution_request_envelope.v1";
const TARGET = "supervised_dry_run_execution_request_envelope_contracts";
const BASELINE = "75fb341776b417f432162fb85693e58c189899e8";
const PHRASE = "APPROVE_SUPERVISED_DRY_RUN_EXECUTION_REQUEST_ENVELOPE_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION";
const NEXT_REVIEW = "START_SUPERVISED_DRY_RUN_EXECUTION_REQUEST_ENVELOPE_IMPLEMENTATION_REVIEW_PACKET";
const STOP = "STOP_OWNER_REVIEW_REQUIRED";
const READY_STATES = new Set(["OWNER_REVIEW_REQUIRED", "REQUEST_DRAFT_READY", "PREFLIGHT_BOUND_READY"]);

const schemaPath = "schema/orchestration/codex_native_supervised_dry_run_execution_request_envelope.schema.json";
const docPath = "docs/orchestration/codex_native_supervised_dry_run_execution_request_envelope_contract.md";
const testPath = "tests/codex_native_supervised_dry_run_execution_request_envelope_contract.test.mjs";
const fixtureRoot = "tests/fixtures/codex-native-supervised-dry-run/execution-request-envelope";

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
const validFixtures = [
  `${fixtureRoot}/valid/request_envelope_owner_review_required.json`,
  `${fixtureRoot}/valid/request_envelope_preflight_bound_ready.json`,
  `${fixtureRoot}/valid/request_envelope_blocked_missing_preflight_artifact.json`,
  `${fixtureRoot}/valid/request_envelope_rejected_stale_approval.json`,
  `${fixtureRoot}/valid/request_envelope_stop_local_metadata_ambiguous.json`
];

const invalidFixtures = [
  `${fixtureRoot}/invalid/request_envelope_runtime_execution_true.json`,
  `${fixtureRoot}/invalid/request_envelope_worker_launch_true.json`,
  `${fixtureRoot}/invalid/request_envelope_queue_mutation_true.json`,
  `${fixtureRoot}/invalid/request_envelope_baseline_mismatch.json`,
  `${fixtureRoot}/invalid/request_envelope_auto_go_from_ready.json`
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


function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getPath(target, dottedPath) {
  return dottedPath.split(".").reduce((cursor, part) => cursor?.[part], target);
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
  return typeof value === "string" && /^[A-F0-9]{64}$/.test(value);
}

function requireObject(record, key, errors) {
  const value = record[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(`${key} object`);
    return undefined;
  }
  return value;
}

function validateFalseFlags(record, key, requiredFlags, errors) {
  const group = requireObject(record, key, errors);
  if (!group) return;

  for (const field of requiredFlags) {
    if (group[field] !== false) errors.push(`${key}.${field}`);
  }

  const unexpected = Object.keys(group).filter((field) => !requiredFlags.includes(field));
  for (const field of unexpected) errors.push(`${key}.${field}.unexpected`);
}

function validateEnvelope(record) {
  const errors = [];
  const requiredRoot = [
    "schema",
    "build_id",
    "target",
    "status",
    "current_stable_baseline",
    "request_envelope_state",
    "request_identity",
    "request_intent",
    "approval_phrase_scope",
    "owner_approval_freshness",
    "stable_closeout_evidence",
    "preflight_evidence",
    "local_refs_referenced",
    "local_metadata_only_disclosure",
    "six_window_progression_safety",
    "action_results",
    "forbidden_action_flags",
    "blocker_matrix",
    "human_review_one_point",
    "next_prompt_readiness",
    "safety_invariants"
  ];
  const allowedRoot = new Set(requiredRoot);

  for (const field of requiredRoot) {
    if (!Object.hasOwn(record, field)) errors.push(`missing ${field}`);
  }
  for (const field of Object.keys(record)) {
    if (!allowedRoot.has(field)) errors.push(`unexpected ${field}`);
  }
  if (errors.length > 0) return errors;

  if (record.schema !== SCHEMA_ID) errors.push("schema");
  if (record.build_id !== BUILD_ID) errors.push("build_id");
  if (record.target !== TARGET) errors.push("target");
  if (record.current_stable_baseline !== BASELINE) errors.push("baseline");
  if (record.status !== record.request_envelope_state) errors.push("status_state_match");
  if (![
    "OWNER_REVIEW_REQUIRED",
    "REQUEST_DRAFT_READY",
    "PREFLIGHT_BOUND_READY",
    "BLOCKED_MISSING_PREFLIGHT_ARTIFACT",
    "REJECTED_STALE_APPROVAL",
    "STOP_LOCAL_METADATA_AMBIGUOUS"
  ].includes(record.request_envelope_state)) errors.push("request_envelope_state");

  const identity = requireObject(record, "request_identity", errors);
  if (identity) {
    if (typeof identity.request_id !== "string" || identity.request_id.length === 0) errors.push("request_id");
    if (identity.request_kind !== "supervised_dry_run_execution_request_envelope") errors.push("request_kind");
    for (const field of ["stable_baseline", "expected_head", "expected_origin_master"]) {
      if (identity[field] !== BASELINE) errors.push(field);
    }
    if (identity.expected_branch !== "master") errors.push("expected_branch");
    if (identity.expected_ahead_behind !== "0 / 0") errors.push("expected_ahead_behind");
  }

  const intent = requireObject(record, "request_intent", errors);
  if (intent) {
    if (typeof intent.operation_goal !== "string" || intent.operation_goal.length < 20) errors.push("operation_goal");
    if (intent.actual_operation_goal_acknowledged !== true) errors.push("actual_operation_goal_acknowledged");
    if (intent.request_mode !== "static_review_envelope_only") errors.push("request_mode");
    for (const flag of [
      "execution_allowed",
      "runtime_execution_requested",
      "worker_launch_requested",
      "queue_mutation_requested",
      "auto_continue",
      "ready_is_go",
      "request_draft_ready_is_go",
      "preflight_bound_ready_is_go"
    ]) {
      if (intent[flag] !== false) errors.push(flag);
    }
  }

  const scope = requireObject(record, "approval_phrase_scope", errors);
  if (scope) {
    if (scope.owner_approval_phrase !== PHRASE) errors.push("owner_approval_phrase");
    if (scope.approval_target !== TARGET) errors.push("approval_target");
    if (scope.allowed_scope !== "docs_schema_tests_fixtures_only") errors.push("allowed_scope");
    if (scope.exact_file_allowlist_count !== 13) errors.push("exact_file_allowlist_count");
    if (scope.runtime_reuse_prohibited !== true) errors.push("runtime_reuse_prohibited");
    for (const flag of ["allows_runtime_execution", "allows_worker_launch", "allows_queue_mutation", "allows_commit", "allows_push"]) {
      if (scope[flag] !== false) errors.push(flag);
    }
  }

  const freshness = requireObject(record, "owner_approval_freshness", errors);
  if (freshness) {
    if (freshness.single_use !== true) errors.push("single_use");
    if (freshness.bound_stable_baseline !== BASELINE) errors.push("bound_stable_baseline");
    if (freshness.fresh_owner_gate_required_before_runtime !== true) errors.push("fresh_owner_gate_required_before_runtime");
    if (record.request_envelope_state === "REJECTED_STALE_APPROVAL") {
      if (freshness.approval_current !== false) errors.push("stale approval_current");
      if (freshness.approval_stale !== true && freshness.approval_superseded !== true) errors.push("approval_stale");
    } else {
      if (freshness.approval_current !== true) errors.push("approval_current");
      if (freshness.approval_stale !== false) errors.push("approval_stale");
      if (freshness.approval_superseded !== false) errors.push("approval_superseded");
    }
  }

  const stableCloseout = requireObject(record, "stable_closeout_evidence", errors);
  if (stableCloseout) {
    if (stableCloseout.artifact_role !== "stable_closeout_evidence") errors.push("stable_closeout_artifact_role");
    if (typeof stableCloseout.artifact_path !== "string" || stableCloseout.artifact_path.length === 0) errors.push("stable_closeout_artifact_path");
    if (!sha256(stableCloseout.artifact_sha256)) errors.push("stable_closeout_artifact_sha256");
    if (stableCloseout.artifact_available !== true) errors.push("stable_closeout_artifact_available");
    if (stableCloseout.sha256_matches_expected !== true) errors.push("stable_closeout_sha256_matches_expected");
    if (stableCloseout.stable_baseline !== BASELINE) errors.push("stable_closeout_stable_baseline");
    if (typeof stableCloseout.stable_status !== "string" || stableCloseout.stable_status.length === 0) errors.push("stable_closeout_stable_status");
    if (stableCloseout.evidence_only !== true) errors.push("stable_closeout_evidence_only");
    if (stableCloseout.authoritative !== true) errors.push("stable_closeout_authoritative");
  }

  const preflight = requireObject(record, "preflight_evidence", errors);
  if (preflight) {
    if (preflight.artifact_role !== "supervised_dry_run_orchestration_preflight_evidence") errors.push("artifact_role");
    if (typeof preflight.artifact_path !== "string" || preflight.artifact_path.length === 0) errors.push("artifact_path");
    if (!sha256(preflight.artifact_sha256)) errors.push("artifact_sha256");
    if (preflight.preflight_build_id !== "SUPERVISED_DRY_RUN_ORCHESTRATION_PREFLIGHT_CONTRACTS_20260615") errors.push("preflight_build_id");
    if (preflight.evidence_only !== true) errors.push("evidence_only");
    if (typeof preflight.authoritative !== "boolean") errors.push("authoritative");
    if (record.request_envelope_state === "BLOCKED_MISSING_PREFLIGHT_ARTIFACT") {
      if (preflight.artifact_available !== false) errors.push("missing_preflight_artifact_available");
      if (preflight.sha256_matches_expected !== false) errors.push("missing_preflight_sha256_matches_expected");
    } else {
      if (preflight.artifact_available !== true) errors.push("artifact_available");
      if (preflight.sha256_matches_expected !== true) errors.push("sha256_matches_expected");
    }
  }

  const refs = requireObject(record, "local_refs_referenced", errors);
  if (refs) {
    for (const field of ["head", "origin_master"]) {
      if (!/^[0-9a-f]{40}$/.test(refs[field] ?? "")) errors.push(field);
    }
    if (!/^[0-9]+ \/ [0-9]+$/.test(refs.ahead_behind ?? "")) errors.push("ahead_behind");
    if (refs.source !== "local_metadata_only_no_fetch_no_pull") errors.push("source");
  }

  const metadata = requireObject(record, "local_metadata_only_disclosure", errors);
  if (metadata) {
    if (metadata.fetch_performed !== false) errors.push("fetch_performed");
    if (metadata.pull_performed !== false) errors.push("pull_performed");
    if (metadata.claims_live_remote_truth !== false) errors.push("claims_live_remote_truth");
    if (metadata.independently_fetched_live_remote_truth !== false) errors.push("independently_fetched_live_remote_truth");
    if (metadata.local_metadata_ambiguous === true && record.request_envelope_state !== "STOP_LOCAL_METADATA_AMBIGUOUS") {
      errors.push("local_metadata_ambiguous");
    }
    if (metadata.local_metadata_ambiguous === true && metadata.ambiguity_requires_stop !== true) {
      errors.push("ambiguity_requires_stop");
    }
  }

  const progression = requireObject(record, "six_window_progression_safety", errors);
  if (progression) {
    for (const flag of [
      "six_window_standard_used",
      "single_window_owner_gate_required",
      "implementation_review_required_before_commit",
      "commit_approval_required_later",
      "push_approval_required_later"
    ]) {
      if (progression[flag] !== true) errors.push(flag);
    }
    if (progression.runtime_allowed_by_this_packet !== false) errors.push("runtime_allowed_by_this_packet");
    if (progression.automatic_go_allowed !== false) errors.push("automatic_go_allowed");
  }

  validateFalseFlags(record, "action_results", [
    "runtime_execution_performed",
    "worker_launch_performed",
    "queue_mutation_performed",
    "cloud_mutation_performed",
    "deploy_performed",
    "private_api_performed",
    "openai_api_performed",
    "billing_or_auth_mutation_performed",
    "trading_or_order_action_performed",
    "daemon_or_watcher_started",
    "ui_automation_performed",
    "automatic_continuation_performed"
  ], errors);

  validateFalseFlags(record, "forbidden_action_flags", [
    "runtime_intent_present",
    "worker_launch_intent_present",
    "queue_mutation_intent_present",
    "cloud_mutation_intent_present",
    "deploy_intent_present",
    "private_api_intent_present",
    "openai_api_intent_present",
    "billing_or_auth_intent_present",
    "trading_or_order_intent_present",
    "automatic_go_intent_present"
  ], errors);

  if (!Array.isArray(record.blocker_matrix) || record.blocker_matrix.length === 0) {
    errors.push("blocker_matrix");
  } else {
    const blockedRows = record.blocker_matrix.filter((row) => ["BLOCKED", "REJECTED", "OWNER_REVIEW_REQUIRED"].includes(row.status));
    if (READY_STATES.has(record.request_envelope_state) && blockedRows.length > 0) errors.push("ready_with_blockers");
    if (!READY_STATES.has(record.request_envelope_state) && blockedRows.length === 0) errors.push("fail_closed_missing_blocker");
    for (const [index, row] of record.blocker_matrix.entries()) {
      if (typeof row.blocker !== "string" || row.blocker.length === 0) errors.push(`blocker_${index}`);
      if (!["PASS", "BLOCKED", "REJECTED", "OWNER_REVIEW_REQUIRED"].includes(row.status)) errors.push(`blocker_status_${index}`);
      if (typeof row.resolution !== "string" || row.resolution.length === 0) errors.push(`blocker_resolution_${index}`);
    }
  }

  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length < 20) {
    errors.push("human_review_one_point");
  }

  const next = requireObject(record, "next_prompt_readiness", errors);
  if (next) {
    if (![NEXT_REVIEW, "WAIT_FOR_OWNER_REVIEW", STOP].includes(next.recommended_next_action)) errors.push("recommended_next_action");
    for (const flag of [
      "ready_is_go",
      "request_draft_ready_is_go",
      "matched_is_go",
      "observed_safe_no_action_is_go",
      "auto_continue",
      "execution_allowed",
      "runtime_next_action"
    ]) {
      if (next[flag] !== false) errors.push(flag);
    }
    if (next.owner_review_required !== true) errors.push("owner_review_required");
    if (/GO|EXECUTE|QUEUE|DEPLOY|PUSH|COMMIT/.test(next.recommended_next_action)) errors.push("recommended_next_action_go");
  }

  if (!Array.isArray(record.safety_invariants) || record.safety_invariants.length < 8) errors.push("safety_invariants");

  if (record.request_envelope_state === "PREFLIGHT_BOUND_READY") {
    if (record.status !== "PREFLIGHT_BOUND_READY") errors.push("preflight_bound_status");
    if (record.next_prompt_readiness?.recommended_next_action !== NEXT_REVIEW) errors.push("preflight_bound_next_review");
  }
  if (record.request_envelope_state === "OWNER_REVIEW_REQUIRED") {
    if (record.next_prompt_readiness?.recommended_next_action !== NEXT_REVIEW) errors.push("owner_review_next_review");
  }
  if (record.request_envelope_state === "REQUEST_DRAFT_READY") {
    if (record.status !== "REQUEST_DRAFT_READY") errors.push("request_draft_ready_status");
    if (record.next_prompt_readiness?.recommended_next_action !== NEXT_REVIEW) errors.push("request_draft_ready_next_review");
  }
  if (record.request_envelope_state === "BLOCKED_MISSING_PREFLIGHT_ARTIFACT") {
    if (record.next_prompt_readiness?.recommended_next_action !== STOP) errors.push("blocked_missing_next_stop");
  }
  if (record.request_envelope_state === "REJECTED_STALE_APPROVAL") {
    if (record.next_prompt_readiness?.recommended_next_action !== STOP) errors.push("rejected_stale_next_stop");
  }
  if (record.request_envelope_state === "STOP_LOCAL_METADATA_AMBIGUOUS") {
    if (record.next_prompt_readiness?.recommended_next_action !== STOP) errors.push("local_metadata_stop_next_stop");
  }

  return errors;
}

test("allowlist contains exactly the execution request envelope contract files", () => {
  assert.equal(allowedFiles.length, 13);
  assert.equal(validFixtures.length, 5);
  assert.equal(invalidFixtures.length, 5);
  assert.equal(allowedFiles.filter((path) => path.startsWith("docs/")).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("schema/")).length, 1);
  assert.equal(allowedFiles.filter((path) => /^tests\/[^/]+\.test\.mjs$/.test(path)).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("tests/fixtures/")).length, 10);

  for (const path of allowedFiles) {
    assert.doesNotThrow(() => readText(path), `${path} should exist`);
    assert.doesNotMatch(path, /\*/);
    assert.doesNotMatch(path, /\/$/);
    assert.doesNotMatch(path, /^(src|tools|scripts|runtime|worker|cloud|deploy|billing|trading|\.git|node_modules)\//);
  }
});

test("schema pins build, baseline, approval phrase, false-only flags, and no automatic GO", () => {
  const schema = readJson(schemaPath);
  assert.equal(schema.$id, SCHEMA_ID);
  assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.current_stable_baseline.const, BASELINE);
  assert.ok(schema.required.includes("stable_closeout_evidence"));
  assert.ok(schema.properties.stable_closeout_evidence);
  assert.ok(schema.properties.status.enum.includes("REQUEST_DRAFT_READY"));
  assert.ok(schema.properties.request_envelope_state.enum.includes("REQUEST_DRAFT_READY"));
  assert.equal(schema.$defs.request_identity.properties.stable_baseline.const, BASELINE);
  assert.equal(schema.$defs.approval_phrase_scope.properties.owner_approval_phrase.const, PHRASE);
  assert.equal(schema.$defs.approval_phrase_scope.properties.exact_file_allowlist_count.const, 13);
  assert.equal(schema.$defs.stable_closeout_evidence.properties.artifact_role.const, "stable_closeout_evidence");
  assert.equal(schema.$defs.stable_closeout_evidence.properties.stable_baseline.const, BASELINE);
  assert.equal(schema.$defs.request_intent.properties.request_draft_ready_is_go.const, false);
  assert.equal(schema.$defs.next_prompt_readiness.properties.ready_is_go.const, false);
  assert.equal(schema.$defs.next_prompt_readiness.properties.request_draft_ready_is_go.const, false);
  assert.equal(schema.$defs.next_prompt_readiness.properties.auto_continue.const, false);
  assert.equal(schema.$defs.next_prompt_readiness.properties.runtime_next_action.const, false);
  for (const [field, definition] of Object.entries(schema.$defs.action_results.properties)) {
    assert.equal(definition.const, false, `action_results.${field} must be const false`);
  }
  for (const [field, definition] of Object.entries(schema.$defs.forbidden_action_flags.properties)) {
    assert.equal(definition.const, false, `forbidden_action_flags.${field} must be const false`);
  }
});

test("documentation states the request envelope safety boundary", () => {
  const doc = readText(docPath);
  assert.match(doc, new RegExp(`BUILD_ID: ${BUILD_ID}`));
  assert.match(doc, /docs\/schema\/tests\/fixtures-only contract/);
  assert.match(doc, /does not execute a supervised dry run, launch a worker, mutate a Queue/);
  assert.match(doc, /`READY`, `MATCHED`, `BOUND`, `REQUEST_DRAFT_READY`, and `OBSERVED_SAFE_NO_ACTION` are not GO signals/);
  assert.match(doc, /stable_closeout_evidence/);
  assert.match(doc, /request_identity/);
  assert.match(doc, /owner_approval_freshness/);
  assert.match(doc, /approval_phrase_scope/);
  assert.match(doc, /request draft ready is not GO/i);
  assert.match(doc, /must not claim live remote truth/);
  assert.match(doc, /actual operation, but the operation remains strategic and future-gated/);
  assert.match(doc, new RegExp(NEXT_REVIEW));
});

test("valid fixtures satisfy execution request envelope semantics", () => {
  for (const path of validFixtures) {
    const record = readJson(path);
    assert.equal(record.build_id, BUILD_ID, path);
    assert.deepEqual(validateEnvelope(record), [], path);
  }
});

test("invalid mutation fixtures fail for their expected safety reason", () => {
  for (const path of invalidFixtures) {
    const fixture = readJson(path);
    assert.equal(fixture.build_id, BUILD_ID, path);
    assert.equal(fixture.expected_valid, false, path);
    assert.equal(typeof fixture.expected_error, "string", path);
    const record = clone(readJson(`${fixtureRoot}/valid/${fixture.base_fixture}`));
    for (const mutationKey of ["mutation", "secondary_mutation", "tertiary_mutation"]) {
      if (fixture[mutationKey]) setPath(record, fixture[mutationKey].path, fixture[mutationKey]);
    }
    assert.equal(getPath(record, fixture.mutation.path), fixture.mutation.value, path);
    const errors = validateEnvelope(record);
    assert.notEqual(errors.length, 0, `${path} must be invalid`);
    assert.ok(
      errors.some((error) => error.includes(fixture.expected_error)),
      `${path} expected ${fixture.expected_error}, got ${errors.join(", ")}`
    );
  }
});

test("READY, REQUEST_DRAFT_READY, and PREFLIGHT_BOUND_READY are never treated as GO", () => {
  for (const fixture of [
    "request_envelope_owner_review_required.json",
    "request_envelope_preflight_bound_ready.json"
  ]) {
    const record = readJson(`${fixtureRoot}/valid/${fixture}`);
    assert.equal(record.request_intent.ready_is_go, false);
    assert.equal(record.request_intent.request_draft_ready_is_go, false);
    assert.equal(record.request_intent.preflight_bound_ready_is_go, false);
    assert.equal(record.request_intent.auto_continue, false);
    assert.equal(record.next_prompt_readiness.ready_is_go, false);
    assert.equal(record.next_prompt_readiness.request_draft_ready_is_go, false);
    assert.equal(record.next_prompt_readiness.auto_continue, false);
    assert.equal(record.next_prompt_readiness.runtime_next_action, false);
    assert.doesNotMatch(record.next_prompt_readiness.recommended_next_action, /GO|EXECUTE|QUEUE|DEPLOY|PUSH|COMMIT/);
  }
});

test("fixtures avoid secret-like or raw-auth placeholders", () => {
  const badPattern = /api[_-]?key|secret|credential|password|raw[_-]?auth|bearer|private[_-]?key|production[_-]?db/i;
  for (const path of [...validFixtures, ...invalidFixtures]) {
    assert.doesNotMatch(readText(path), badPattern, path);
  }
});

test("working tree changes stay inside the exact 13-file allowlist", () => {
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
    ...noteCoreArtifactAdoptionLedgerImplementationLaneFiles,
    ...postMergeCloseoutLedgerContractImplementationLaneFiles,
    ...squashMergeRetainedBranchRealignmentContractImplementationLaneFiles
  ]);

  const outside = changedPaths.filter((path) => !currentWorkingTreeGuardAllowedFiles.has(path));
  assert.deepEqual(outside, []);
});

console.log("codex_native_supervised_dry_run_execution_request_envelope_contract_static: ok");
