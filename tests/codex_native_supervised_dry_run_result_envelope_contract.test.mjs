// BUILD_ID: RESULT_ENVELOPE_DRY_RUN_OUTCOME_CONTRACTS_20260614
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

const BUILD_ID = "RESULT_ENVELOPE_DRY_RUN_OUTCOME_CONTRACTS_20260614";
const TARGET = "result_envelope_dry_run_outcome_contracts";
const BASELINE = "85f1d5c94698071abce1b03d41cef6788417a48b";
const PHRASE = "APPROVE_RESULT_ENVELOPE_DRY_RUN_OUTCOME_CONTRACTS_DOCS_SCHEMA_TESTS_FIXTURES_ONLY";
const READY = "READY";
const BLOCKED = "BLOCKED";
const REJECTED = "REJECTED";
const STOP = "STOP_OWNER_REVIEW_REQUIRED";

const allowedFiles = [
  "docs/orchestration/codex_native_supervised_dry_run_result_envelope_contract.md",
  "schema/orchestration/codex_native_supervised_dry_run_result_envelope.schema.json",
  "tests/codex_native_supervised_dry_run_result_envelope_contract.test.mjs",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/valid/result_envelope_ready.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/valid/result_envelope_blocked_missing_artifact.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/valid/result_envelope_rejected_runtime_permission.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/valid/result_envelope_stop_ambiguous_state.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_unknown_state.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_ready_with_blockers.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_blocked_without_blocker.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_rejected_without_evidence_reference.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_missing_human_review_one_point.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_artifact_sha_mismatch.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_runtime_transition_allowed.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_worker_daemon_watcher_allowed.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_api_cloud_queue_billing_trading_allowed.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_next_action_commit_push_deploy.json"
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
const validFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/valid/result_envelope_ready.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/valid/result_envelope_blocked_missing_artifact.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/valid/result_envelope_rejected_runtime_permission.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/valid/result_envelope_stop_ambiguous_state.json"
];

const invalidFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_unknown_state.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_ready_with_blockers.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_blocked_without_blocker.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_rejected_without_evidence_reference.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_missing_human_review_one_point.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_artifact_sha_mismatch.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_runtime_transition_allowed.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_worker_daemon_watcher_allowed.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_api_cloud_queue_billing_trading_allowed.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope/invalid/result_envelope_next_action_commit_push_deploy.json"
];

const schema = readJson("schema/orchestration/codex_native_supervised_dry_run_result_envelope.schema.json");
const readyEnvelope = readJson(validFixturePaths[0]).result_envelopes[0];
const blockedEnvelope = readJson(validFixturePaths[1]).result_envelopes[0];
const rejectedEnvelope = readJson(validFixturePaths[2]).result_envelopes[0];
const stopEnvelope = readJson(validFixturePaths[3]).result_envelopes[0];

const resultKinds = schema.properties.result_kind.enum;
const resultStates = schema.properties.result_state.enum;
const safeNextActions = schema.properties.recommended_next_action.enum;
const forbiddenFlags = Object.keys(schema.$defs.forbidden_actions.properties);
const envelopeRequired = schema.required;
const envelopeAllowed = new Set(Object.keys(schema.properties));
const blockerRequired = schema.$defs.blocker.required;

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
  return typeof value === "string" && /^[A-Fa-f0-9]{64}$/.test(value);
}

function missingRequired(required, value) {
  return required.filter((field) => !Object.hasOwn(value, field));
}

function unexpectedProperties(allowed, value) {
  return Object.keys(value).filter((field) => !allowed.has(field));
}

function nonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function baseEnvelopeFor(kind) {
  const byName = {
    ready: readyEnvelope,
    blocked: blockedEnvelope,
    rejected: rejectedEnvelope,
    stop: stopEnvelope
  };
  return clone(byName[kind]);
}

function resultEnvelopeErrors(record) {
  const errors = [];
  for (const field of missingRequired(envelopeRequired, record)) errors.push(`missing ${field}`);
  for (const field of unexpectedProperties(envelopeAllowed, record)) errors.push(`unexpected ${field}`);
  if (errors.length) return errors;

  if (record.schema !== schema.properties.schema.const) errors.push("bad schema");
  if (record.build_id !== BUILD_ID) errors.push("bad build_id");
  if (!nonEmptyString(record.envelope_id)) errors.push("bad envelope_id");
  if (record.target !== TARGET) errors.push("bad target");
  if (record.stable_baseline !== BASELINE) errors.push("bad stable_baseline");
  if (record.expected_branch !== "master") errors.push("bad expected_branch");
  if (record.expected_head !== BASELINE) errors.push("bad expected_head");
  if (record.expected_origin_master !== BASELINE) errors.push("bad expected_origin_master");
  if (record.expected_ahead_behind !== "0 / 0") errors.push("bad expected_ahead_behind");
  if (!resultKinds.includes(record.result_kind)) errors.push("bad result_kind");
  if (!resultStates.includes(record.result_state)) errors.push("bad result_state");
  if (record.result_kind === "execution_result_placeholder" && record.result_state === READY) errors.push("execution placeholder cannot be ready");

  if (!Array.isArray(record.blockers)) errors.push("missing blockers");
  if (!Array.isArray(record.reasons) || record.reasons.length === 0 || record.reasons.some((reason) => !nonEmptyString(reason))) errors.push("missing reasons");
  if (!Array.isArray(record.artifact_evidence) || record.artifact_evidence.length === 0) errors.push("missing artifact_evidence");

  if (Array.isArray(record.blockers)) {
    if (record.result_state === READY && record.blockers.length !== 0) errors.push("ready has blockers");
    if (record.result_state === BLOCKED && record.blockers.length === 0) errors.push("blocked missing blocker");
    if (record.result_state === STOP && record.blockers.length === 0) errors.push("stop missing blocker");
    for (const blocker of record.blockers) {
      for (const field of blockerRequired) if (!Object.hasOwn(blocker, field)) errors.push(`bad blocker missing ${field}`);
      if (!["BLOCKER", "HIGH"].includes(blocker.severity)) errors.push("bad blocker severity");
      if (blocker.fail_closed_action !== STOP) errors.push("bad blocker fail_closed_action");
      if (blocker.owner_review_required !== true) errors.push("bad blocker owner_review_required");
      if (blocker.allows_progression !== false) errors.push("bad blocker allows_progression");
    }
  }

  if (Array.isArray(record.artifact_evidence)) {
    for (const artifact of record.artifact_evidence) {
      if (!nonEmptyString(artifact.artifact_role)) errors.push("missing artifact role");
      if (!nonEmptyString(artifact.artifact_path)) errors.push("missing artifact path");
      if (!sha256(artifact.artifact_sha256)) errors.push("bad artifact sha256");
      if (artifact.sha256_matches_expected !== true) errors.push("artifact sha mismatch");
    }
  }

  if (record.result_state === REJECTED && (!Array.isArray(record.artifact_evidence) || record.artifact_evidence.length === 0)) {
    errors.push("rejected missing evidence");
  }

  const approval = record.approval_binding;
  if (!approval || typeof approval !== "object") {
    errors.push("missing approval_binding");
  } else {
    if (approval.owner_approval_phrase !== PHRASE) errors.push("bad owner approval phrase");
    if (approval.approval_target !== TARGET) errors.push("bad approval target");
    if (approval.approval_current !== true) errors.push("stale approval");
    if (approval.approval_stale !== false) errors.push("stale approval");
    if (approval.approval_superseded !== false) errors.push("superseded approval");
    if (approval.bound_stable_baseline !== BASELINE) errors.push("bad bound baseline");
    if (approval.exact_file_allowlist_count !== 17) errors.push("bad allowlist count");
    if (approval.allowed_scope !== "docs_schema_tests_fixtures_only") errors.push("bad allowed scope");
    if (approval.reuse_for_runtime_prohibited !== true) errors.push("runtime reuse not prohibited");
  }

  for (const flag of forbiddenFlags) {
    if (record.forbidden_actions?.[flag] !== false) errors.push(`forbidden ${flag}`);
  }
  if (!nonEmptyString(record.human_review_one_point)) errors.push("missing human_review_one_point");
  if (!safeNextActions.includes(record.recommended_next_action)) errors.push("unsafe recommended_next_action");
  return errors;
}

test("result-envelope docs, schema, and allowlist carry the exact BUILD_ID and shape", () => {
  const doc = readText("docs/orchestration/codex_native_supervised_dry_run_result_envelope_contract.md");
  assert.ok(doc.startsWith(`# BUILD_ID: ${BUILD_ID}`));
  assert.match(doc, /READY means evidence readiness only/i);
  assert.match(doc, /not an action trigger/i);
  assert.match(doc, /Queue mutation/i);
  assert.match(doc, /STOP_OWNER_REVIEW_REQUIRED/i);

  assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema.const, "lonewolf.codex_native.supervised_dry_run_result_envelope.v1");
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.stable_baseline.const, BASELINE);
  assert.deepEqual(resultStates, [READY, BLOCKED, REJECTED, STOP]);
  assert.equal(schema.$defs.approval_binding.properties.owner_approval_phrase.const, PHRASE);
  assert.equal(schema.$defs.approval_binding.properties.exact_file_allowlist_count.const, 17);
  for (const flag of forbiddenFlags) assert.equal(schema.$defs.forbidden_actions.properties[flag].const, false);

  assert.equal(allowedFiles.length, 17);
  assert.equal(allowedFiles.filter((path) => path.startsWith("docs/")).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("schema/")).length, 1);
  assert.equal(allowedFiles.filter((path) => /^tests\/[^/]+\.test\.mjs$/.test(path)).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("tests/fixtures/")).length, 14);
  for (const file of allowedFiles) {
    assert.doesNotThrow(() => readText(file), `${file} must exist`);
    assert.match(file, /^(docs|schema|tests|tests\/fixtures)\//);
    assert.doesNotMatch(file, /^(src|tools|scripts|runtime|worker|cloud|deploy|billing|trading|\.git|node_modules)\//);
  }
});

test("valid result-envelope fixtures are accepted", () => {
  for (const fixturePath of validFixturePaths) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID);
    for (const envelope of fixture.result_envelopes) {
      assert.deepEqual(resultEnvelopeErrors(envelope), [], fixturePath);
      for (const flag of forbiddenFlags) assert.equal(envelope.forbidden_actions[flag], false, `${fixturePath} ${flag}`);
    }
  }
  assert.equal(readyEnvelope.result_state, READY);
  assert.equal(blockedEnvelope.result_state, BLOCKED);
  assert.equal(rejectedEnvelope.result_state, REJECTED);
  assert.equal(stopEnvelope.result_state, STOP);
});

test("invalid result-envelope fixture matrix fails closed", () => {
  for (const fixturePath of invalidFixturePaths) {
    const fixture = readJson(fixturePath);
    assert.equal(fixture.build_id, BUILD_ID);
    for (const invalidCase of fixture.invalid_cases) {
      const envelope = baseEnvelopeFor(invalidCase.base_fixture);
      setPath(envelope, invalidCase.mutation.path, invalidCase.mutation);
      const errors = resultEnvelopeErrors(envelope);
      assert.ok(
        errors.some((error) => error.includes(invalidCase.expected_error)),
        `${fixturePath} ${invalidCase.case_id} expected ${invalidCase.expected_error}, got ${errors.join(", ")}`
      );
    }
  }
});

test("fixtures avoid secret-like or raw-auth placeholders", () => {
  const badPattern = /api[_-]?key|secret|credential|password|raw[_-]?auth|bearer|private[_-]?key|production[_-]?db/i;
  for (const fixturePath of [...validFixturePaths, ...invalidFixturePaths]) {
    assert.doesNotMatch(readText(fixturePath), badPattern, fixturePath);
  }
});

test("working tree changes stay inside the exact 17-file allowlist", () => {
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

console.log("codex_native_supervised_dry_run_result_envelope_contract_static: ok");
