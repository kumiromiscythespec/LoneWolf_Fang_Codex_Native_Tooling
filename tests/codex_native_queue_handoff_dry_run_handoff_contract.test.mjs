// BUILD_ID: QUEUE_HANDOFF_DRY_RUN_HANDOFF_CONTRACTS_20260614
// BUILD_ID: 2026-06-26_post_merge_closeout_ledger_guard_allowlist_repair_v1
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "QUEUE_HANDOFF_DRY_RUN_HANDOFF_CONTRACTS_20260614";
const TARGET = "queue_handoff_dry_run_handoff_contracts";
const BASELINE = "c7d1d2dc7ff350bb3ea9d0485d6a1de9441dbc82";
const PHRASE = "APPROVE_QUEUE_HANDOFF_DRY_RUN_HANDOFF_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION";
const OBSERVED_SAFE_NO_ACTION = "OBSERVED_SAFE_NO_ACTION";
const READY = "READY";
const BLOCKED = "BLOCKED";
const STOP = "STOP_OWNER_REVIEW_REQUIRED";

const allowedFiles = [
  "docs/orchestration/codex_native_queue_handoff_dry_run_handoff_contract.md",
  "schema/orchestration/codex_native_queue_handoff_dry_run_handoff.schema.json",
  "tests/codex_native_queue_handoff_dry_run_handoff_contract.test.mjs",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/valid/queue_handoff_observed_safe_no_action_review_only.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/valid/queue_handoff_ready_review_only.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/valid/queue_handoff_blocked_missing_artifact.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_queue_mutation_true.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_runtime_executor_true.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_worker_launch_true.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_auto_go_from_observed_safe_no_action.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_stale_approval.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_artifact_chain_mismatch.json"
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
const validFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/valid/queue_handoff_observed_safe_no_action_review_only.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/valid/queue_handoff_ready_review_only.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/valid/queue_handoff_blocked_missing_artifact.json"
];

const invalidFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_queue_mutation_true.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_runtime_executor_true.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_worker_launch_true.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_auto_go_from_observed_safe_no_action.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_stale_approval.json",
  "tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/queue_handoff_artifact_chain_mismatch.json"
];

const schema = readJson("schema/orchestration/codex_native_queue_handoff_dry_run_handoff.schema.json");
const rootRequired = schema.required;
const rootAllowed = new Set(Object.keys(schema.properties));
const handoffModes = [schema.properties.handoff_mode.const];
const observationStatuses = schema.properties.observation_status.enum;
const safeNextActions = schema.properties.recommended_next_action.enum;
const blockerRequired = schema.$defs.blocker.required;
const forbiddenFlags = Object.keys(schema.$defs.forbidden_actions.properties);
const validFixtures = validFixturePaths.map((path) => [path, readJson(path)]);
const invalidFixtures = invalidFixturePaths.map((path) => [path, readJson(path)]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
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

function setPath(target, dottedPath, mutation) {
  const parts = dottedPath.split(".");
  let cursor = target;
  for (const part of parts.slice(0, -1)) cursor = cursor[part];
  const last = parts.at(-1);
  if (mutation.delete === true) delete cursor[last];
  else cursor[last] = mutation.value;
}

function baseHandoffFor(file) {
  return clone(readJson(`tests/fixtures/codex-native-supervised-dry-run/queue-handoff/valid/${file}`).queue_handoff);
}

function validateHandoff(record) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) return ["missing handoff"];

  for (const field of missingRequired(rootRequired, record)) errors.push(`missing ${field}`);
  for (const field of unexpectedProperties(rootAllowed, record)) errors.push(`unexpected ${field}`);
  if (errors.length) return errors;

  if (record.schema !== schema.properties.schema.const) errors.push("schema");
  if (record.build_id !== BUILD_ID) errors.push("build_id");
  if (!nonEmptyString(record.handoff_id)) errors.push("handoff_id");
  if (record.contract_target !== TARGET) errors.push("contract_target");
  if (record.stable_baseline !== BASELINE) errors.push("stable_baseline");
  if (record.expected_branch !== "master") errors.push("expected_branch");
  if (record.expected_head !== BASELINE) errors.push("expected_head");
  if (record.expected_origin_master !== BASELINE) errors.push("expected_origin_master");
  if (record.expected_ahead_behind !== "0 / 0") errors.push("expected_ahead_behind");
  if (!handoffModes.includes(record.handoff_mode)) errors.push("handoff_mode");
  if (!observationStatuses.includes(record.observation_status)) errors.push("observation_status");

  if (!Array.isArray(record.blockers)) errors.push("blockers");
  if (!Array.isArray(record.reasons) || record.reasons.length === 0 || record.reasons.some((reason) => !nonEmptyString(reason))) {
    errors.push("reasons");
  }
  if (Array.isArray(record.blockers)) {
    if ([OBSERVED_SAFE_NO_ACTION, READY].includes(record.observation_status) && record.blockers.length !== 0) errors.push("review_state_has_blockers");
    if ([BLOCKED, STOP].includes(record.observation_status) && record.blockers.length === 0) errors.push("fail_closed_missing_blocker");
    for (const blocker of record.blockers) {
      for (const field of blockerRequired) if (!Object.hasOwn(blocker, field)) errors.push(`blocker_${field}`);
      if (!["BLOCKER", "HIGH"].includes(blocker.severity)) errors.push("blocker_severity");
      if (blocker.fail_closed_action !== STOP) errors.push("blocker_fail_closed_action");
      if (blocker.owner_review_required !== true) errors.push("blocker_owner_review_required");
      if (blocker.allows_progression !== false) errors.push("blocker_allows_progression");
    }
  }

  const artifact = record.artifact_evidence;
  if (!artifact || typeof artifact !== "object" || Array.isArray(artifact)) {
    errors.push("artifact_evidence");
  } else {
    if (typeof artifact.artifact_available !== "boolean") errors.push("artifact_available");
    if (!nonEmptyString(artifact.artifact_role)) errors.push("artifact_role");
    if (!nonEmptyString(artifact.artifact_path)) errors.push("artifact_path");
    if (!sha256(artifact.artifact_sha256)) errors.push("artifact_sha256");
    if (artifact.sha256_matches_expected !== true) errors.push("sha256_matches_expected");
    if (!sha256(artifact.parent_artifact_sha256)) errors.push("parent_artifact_sha256");
    if (artifact.parent_artifact_sha256_matches !== true) errors.push("parent_artifact_sha256_matches");
    if (typeof artifact.artifact_authoritative !== "boolean") errors.push("artifact_authoritative");
    if (artifact.non_authoritative_residue_treated_as_authoritative !== false) errors.push("non_authoritative_residue_treated_as_authoritative");
    if (record.observation_status !== BLOCKED && artifact.artifact_available !== true) errors.push("artifact_missing_without_blocked_review");
  }

  const approval = record.approval_freshness;
  if (!approval || typeof approval !== "object") {
    errors.push("approval_freshness");
  } else {
    if (approval.owner_approval_phrase !== PHRASE) errors.push("owner_approval_phrase");
    if (approval.approval_target !== TARGET) errors.push("approval_target");
    if (approval.approval_current !== true) errors.push("approval_current");
    if (approval.approval_stale !== false) errors.push("approval_stale");
    if (approval.approval_superseded !== false) errors.push("approval_superseded");
    if (approval.bound_stable_baseline !== BASELINE) errors.push("bound_stable_baseline");
    if (approval.exact_file_allowlist_count !== 12) errors.push("exact_file_allowlist_count");
    if (approval.allowed_scope !== "docs_schema_tests_fixtures_only") errors.push("allowed_scope");
    if (approval.reuse_for_runtime_prohibited !== true) errors.push("reuse_for_runtime_prohibited");
  }

  const semantics = record.action_decision_semantics;
  if (!semantics || typeof semantics !== "object") {
    errors.push("action_decision_semantics");
  } else {
    if (semantics.queue_handoff_evidence_only !== true) errors.push("queue_handoff_evidence_only");
    if (semantics.owner_review_required !== true) errors.push("owner_review_required");
    if (semantics.ready_is_go !== false) errors.push("ready_is_go");
    if (semantics.observed_safe_no_action_is_go !== false) errors.push("observed_safe_no_action_is_go");
    if (semantics.automatic_go_allowed !== false) errors.push("automatic_go_allowed");
    if (semantics.execution_allowed !== false) errors.push("execution_allowed");
    if (semantics.queue_mutation_allowed !== false) errors.push("queue_mutation_allowed");
    if (semantics.worker_launch_allowed !== false) errors.push("worker_launch_allowed");
  }

  for (const flag of forbiddenFlags) {
    if (record.forbidden_actions?.[flag] !== false) errors.push(flag);
  }
  if (!nonEmptyString(record.human_review_one_point)) errors.push("human_review_one_point");
  if (!nonEmptyString(record.owner_facing_summary)) errors.push("owner_facing_summary");
  if (!safeNextActions.includes(record.recommended_next_action)) errors.push("recommended_next_action");
  if (record.recommended_next_action?.includes("GO")) errors.push("recommended_next_action_go");
  return errors;
}

test("docs, schema, and allowlist carry BUILD_ID and static-only semantics", () => {
  const doc = readText("docs/orchestration/codex_native_queue_handoff_dry_run_handoff_contract.md");
  assert.ok(doc.startsWith(`# BUILD_ID: ${BUILD_ID}`));
  assert.match(doc, /OBSERVED_SAFE_NO_ACTION is not GO/);
  assert.match(doc, /READY is not GO/);
  assert.match(doc, /review evidence only/i);
  assert.match(doc, /Queue mutation/i);
  assert.match(doc, /worker launch/i);
  assert.match(doc, /daemon or watcher/i);

  assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema.const, "lonewolf.codex_native.queue_handoff_dry_run_handoff.v1");
  assert.equal(schema.properties.contract_target.const, TARGET);
  assert.equal(schema.properties.stable_baseline.const, BASELINE);
  assert.equal(schema.properties.handoff_mode.const, "dry_run_review_only");
  assert.deepEqual(observationStatuses, [OBSERVED_SAFE_NO_ACTION, READY, BLOCKED, STOP]);
  assert.equal(schema.$defs.approval_freshness.properties.owner_approval_phrase.const, PHRASE);
  assert.equal(schema.$defs.approval_freshness.properties.exact_file_allowlist_count.const, 12);
  for (const flag of forbiddenFlags) assert.equal(schema.$defs.forbidden_actions.properties[flag].const, false);

  assert.equal(allowedFiles.length, 12);
  assert.equal(allowedFiles.filter((path) => path.startsWith("docs/")).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("schema/")).length, 1);
  assert.equal(allowedFiles.filter((path) => /^tests\/[^/]+\.test\.mjs$/.test(path)).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("tests/fixtures/")).length, 9);
  for (const file of allowedFiles) {
    assert.doesNotThrow(() => readText(file), `${file} must exist`);
    assert.match(file, /^(docs|schema|tests|tests\/fixtures)\//);
    assert.doesNotMatch(file, /^(src|tools|scripts|runtime|worker|cloud|deploy|billing|trading|\.git|node_modules)\//);
  }
});

test("valid queue-handoff review-only fixtures pass", () => {
  assert.equal(validFixtures.length, 3);
  for (const [fixturePath, fixture] of validFixtures) {
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, true, fixturePath);
    assert.deepEqual(validateHandoff(fixture.queue_handoff), [], fixturePath);
    assert.equal(fixture.queue_handoff.action_decision_semantics.ready_is_go, false, fixturePath);
    assert.equal(fixture.queue_handoff.action_decision_semantics.observed_safe_no_action_is_go, false, fixturePath);
    assert.equal(fixture.queue_handoff.action_decision_semantics.automatic_go_allowed, false, fixturePath);
    for (const flag of forbiddenFlags) assert.equal(fixture.queue_handoff.forbidden_actions[flag], false, `${fixturePath} ${flag}`);
  }
  assert.equal(validFixtures[0][1].queue_handoff.observation_status, OBSERVED_SAFE_NO_ACTION);
  assert.equal(validFixtures[1][1].queue_handoff.observation_status, READY);
  assert.equal(validFixtures[2][1].queue_handoff.observation_status, BLOCKED);
});

test("invalid queue-handoff fixture matrix fails for the expected reasons", () => {
  assert.equal(invalidFixtures.length, 6);
  for (const [fixturePath, fixture] of invalidFixtures) {
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.equal(fixture.expected_valid, false, fixturePath);
    const handoff = baseHandoffFor(fixture.base_fixture);
    for (const mutationKey of ["mutation", "secondary_mutation", "tertiary_mutation"]) {
      if (fixture[mutationKey]) setPath(handoff, fixture[mutationKey].path, fixture[mutationKey]);
    }
    const errors = validateHandoff(handoff);
    assert.ok(
      errors.some((error) => error.includes(fixture.expected_error)),
      `${fixturePath} expected ${fixture.expected_error}, got ${errors.join(", ")}`
    );
  }
});

test("OBSERVED_SAFE_NO_ACTION and READY are never treated as GO", () => {
  for (const fixturePath of [
    "queue_handoff_observed_safe_no_action_review_only.json",
    "queue_handoff_ready_review_only.json"
  ]) {
    const handoff = baseHandoffFor(fixturePath);
    assert.equal(handoff.action_decision_semantics.ready_is_go, false);
    assert.equal(handoff.action_decision_semantics.observed_safe_no_action_is_go, false);
    assert.equal(handoff.action_decision_semantics.automatic_go_allowed, false);
    assert.equal(handoff.forbidden_actions.auto_go_performed, false);
    assert.notEqual(handoff.recommended_next_action, "GO");
    assert.doesNotMatch(handoff.recommended_next_action, /GO|EXECUTE|QUEUE|DEPLOY|PUSH|COMMIT/);
  }
});

test("specific forbidden examples fail closed", () => {
  const cases = [
    ["queue_handoff_queue_mutation_true.json", "queue_mutation_performed"],
    ["queue_handoff_runtime_executor_true.json", "runtime_execution_performed"],
    ["queue_handoff_worker_launch_true.json", "worker_launch_performed"],
    ["queue_handoff_auto_go_from_observed_safe_no_action.json", "observed_safe_no_action_is_go"],
    ["queue_handoff_stale_approval.json", "approval_stale"],
    ["queue_handoff_artifact_chain_mismatch.json", "parent_artifact_sha256_matches"]
  ];
  for (const [file, expected] of cases) {
    const fixture = readJson(`tests/fixtures/codex-native-supervised-dry-run/queue-handoff/invalid/${file}`);
    const handoff = baseHandoffFor(fixture.base_fixture);
    for (const mutationKey of ["mutation", "secondary_mutation"]) {
      if (fixture[mutationKey]) setPath(handoff, fixture[mutationKey].path, fixture[mutationKey]);
    }
    assert.ok(validateHandoff(handoff).some((error) => error.includes(expected)), file);
  }
});

test("fixtures avoid secret-like or raw-auth placeholders", () => {
  const badPattern = /api[_-]?key|secret|credential|password|raw[_-]?auth|bearer|private[_-]?key|production[_-]?db/i;
  for (const fixturePath of [...validFixturePaths, ...invalidFixturePaths]) {
    assert.doesNotMatch(readText(fixturePath), badPattern, fixturePath);
  }
});

test("working tree changes stay inside the exact 12-file allowlist", () => {
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
    ...postMergeCloseoutLedgerContractImplementationLaneFiles
  ]);

  const outside = changedPaths.filter((path) => !currentWorkingTreeGuardAllowedFiles.has(path));
  assert.deepEqual(outside, []);
});

console.log("codex_native_queue_handoff_dry_run_handoff_contract_static: ok");
