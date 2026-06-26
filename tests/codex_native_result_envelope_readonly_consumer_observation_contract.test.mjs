// BUILD_ID: RESULT_ENVELOPE_READONLY_CONSUMER_OBSERVATION_CONTRACTS_20260614
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "RESULT_ENVELOPE_READONLY_CONSUMER_OBSERVATION_CONTRACTS_20260614";
const TARGET = "result_envelope_readonly_consumer_observation_contracts";
const BASELINE = "d2a9dd7e3ab07fb3d177cab36a70130e0f11deec";
const PHRASE = "APPROVE_RESULT_ENVELOPE_READONLY_CONSUMER_OBSERVATION_CONTRACTS_DOCS_SCHEMA_TESTS_FIXTURES_ONLY";
const OBSERVED_SAFE_NO_ACTION = "OBSERVED_SAFE_NO_ACTION";
const OBSERVED_BLOCKED = "OBSERVED_BLOCKED";
const OBSERVED_REJECTED = "OBSERVED_REJECTED";
const STOP = "STOP_OWNER_REVIEW_REQUIRED";

const allowedFiles = [
  "docs/orchestration/codex_native_result_envelope_readonly_consumer_observation_contract.md",
  "schema/orchestration/codex_native_result_envelope_readonly_consumer_observation.schema.json",
  "tests/codex_native_result_envelope_readonly_consumer_observation_contract.test.mjs",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/valid/consumer_observation_ready_no_action.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/valid/consumer_observation_blocked_missing_artifact.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/valid/consumer_observation_rejected_forbidden_intent.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/valid/consumer_observation_stop_ambiguous_parent.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_runtime_executor_true.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_queue_mutation_true.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_ready_auto_go.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_missing_human_review_one_point.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_stale_baseline.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_artifact_sha_mismatch.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_api_cloud_billing_trading_true.json"
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
const validFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/valid/consumer_observation_ready_no_action.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/valid/consumer_observation_blocked_missing_artifact.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/valid/consumer_observation_rejected_forbidden_intent.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/valid/consumer_observation_stop_ambiguous_parent.json"
];

const invalidFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_runtime_executor_true.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_queue_mutation_true.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_ready_auto_go.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_missing_human_review_one_point.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_stale_baseline.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_artifact_sha_mismatch.json",
  "tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/invalid/consumer_observation_api_cloud_billing_trading_true.json"
];

const schema = readJson("schema/orchestration/codex_native_result_envelope_readonly_consumer_observation.schema.json");
const validFixtures = validFixturePaths.map((path) => [path, readJson(path)]);
const invalidFixtures = invalidFixturePaths.map((path) => [path, readJson(path)]);
const observationStates = schema.properties.observation_state.enum;
const safeNextActions = schema.properties.recommended_next_action.enum;
const rootRequired = schema.required;
const rootAllowed = new Set(Object.keys(schema.properties));
const blockerRequired = schema.$defs.blocker.required;
const artifactRequired = schema.$defs.artifact_evidence.required;
const forbiddenFlags = Object.keys(schema.$defs.forbidden_actions.properties);
const consumerBoundaryFlags = Object.keys(schema.$defs.consumer_boundaries.properties);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function sha256(value) {
  return typeof value === "string" && /^[A-Fa-f0-9]{64}$/u.test(value);
}

function setPath(target, dottedPath, mutation) {
  const parts = dottedPath.split(".");
  let cursor = target;
  for (const part of parts.slice(0, -1)) cursor = cursor[part];
  const last = parts.at(-1);
  if (mutation.delete === true) delete cursor[last];
  else cursor[last] = mutation.value;
}

function baseObservationFor(file) {
  const fixture = readJson(`tests/fixtures/codex-native-supervised-dry-run/result-envelope-consumer/valid/${file}`);
  return clone(fixture.observation);
}

function missingRequired(required, value) {
  return required.filter((field) => !Object.hasOwn(value, field));
}

function unexpectedProperties(allowed, value) {
  return Object.keys(value).filter((field) => !allowed.has(field));
}

function validateObservation(record) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) return ["missing observation"];

  for (const field of missingRequired(rootRequired, record)) errors.push(`missing ${field}`);
  for (const field of unexpectedProperties(rootAllowed, record)) errors.push(`unexpected ${field}`);
  if (errors.length) return errors;

  if (record.schema !== schema.properties.schema.const) errors.push("bad schema");
  if (record.build_id !== BUILD_ID) errors.push("bad build_id");
  if (!nonEmptyString(record.observation_id)) errors.push("bad observation_id");
  if (record.target !== TARGET) errors.push("bad target");
  if (record.stable_baseline !== BASELINE) errors.push("bad stable_baseline");
  if (record.expected_branch !== "master") errors.push("bad expected_branch");
  if (record.expected_head !== BASELINE) errors.push("bad expected_head");
  if (record.expected_origin_master !== BASELINE) errors.push("bad expected_origin_master");
  if (record.expected_ahead_behind !== "0 / 0") errors.push("bad expected_ahead_behind");
  if (!observationStates.includes(record.observation_state)) errors.push("bad observation_state");

  const observed = record.observed_result_envelope;
  if (!observed || typeof observed !== "object" || Array.isArray(observed)) {
    errors.push("missing observed_result_envelope");
  } else {
    if (observed.envelope_schema !== schema.$defs.observed_result_envelope.properties.envelope_schema.const) errors.push("bad envelope_schema");
    if (observed.envelope_target !== schema.$defs.observed_result_envelope.properties.envelope_target.const) errors.push("bad envelope_target");
    if (!schema.$defs.observed_result_envelope.properties.envelope_result_state.enum.includes(observed.envelope_result_state)) {
      errors.push("bad envelope_result_state");
    }
    if (!nonEmptyString(observed.envelope_artifact_path)) errors.push("bad envelope_artifact_path");
    if (!sha256(observed.envelope_artifact_sha256)) errors.push("bad envelope_artifact_sha256");
    if (observed.parent_artifact_sha256_matches !== true) errors.push("artifact sha mismatch");
    if (observed.stable_baseline !== BASELINE) errors.push("bad observed baseline");
    if (observed.ready_interpreted_as_go !== false) errors.push("ready interpreted as go");
    if (observed.automatic_next_action_created !== false) errors.push("automatic next action");
  }

  if (!Array.isArray(record.blockers)) errors.push("missing blockers");
  if (!Array.isArray(record.reasons) || record.reasons.length === 0 || record.reasons.some((reason) => !nonEmptyString(reason))) {
    errors.push("missing reasons");
  }
  if (!Array.isArray(record.artifact_evidence)) errors.push("missing artifact_evidence");

  if (Array.isArray(record.blockers)) {
    if (record.observation_state === OBSERVED_SAFE_NO_ACTION && record.blockers.length !== 0) errors.push("safe observation has blockers");
    if ([OBSERVED_BLOCKED, OBSERVED_REJECTED, STOP].includes(record.observation_state) && record.blockers.length === 0) {
      errors.push("non-safe observation missing blocker");
    }
    for (const blocker of record.blockers) {
      for (const field of blockerRequired) if (!Object.hasOwn(blocker, field)) errors.push(`bad blocker missing ${field}`);
      if (!["BLOCKER", "HIGH"].includes(blocker.severity)) errors.push("bad blocker severity");
      if (blocker.fail_closed_action !== STOP) errors.push("bad blocker fail_closed_action");
      if (blocker.owner_review_required !== true) errors.push("bad blocker owner_review_required");
      if (blocker.allows_progression !== false) errors.push("bad blocker allows_progression");
    }
  }

  if (Array.isArray(record.artifact_evidence)) {
    if (record.observation_state !== OBSERVED_BLOCKED && record.artifact_evidence.length === 0) errors.push("missing artifact evidence");
    for (const artifact of record.artifact_evidence) {
      for (const field of artifactRequired) if (!Object.hasOwn(artifact, field)) errors.push(`bad artifact missing ${field}`);
      if (!nonEmptyString(artifact.artifact_role)) errors.push("missing artifact role");
      if (!nonEmptyString(artifact.artifact_path)) errors.push("missing artifact path");
      if (!sha256(artifact.artifact_sha256)) errors.push("bad artifact sha256");
      if (artifact.sha256_matches_expected !== true) errors.push("artifact sha mismatch");
    }
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
    if (approval.exact_file_allowlist_count !== 14) errors.push("bad allowlist count");
    if (approval.allowed_scope !== "docs_schema_tests_fixtures_only") errors.push("bad allowed scope");
    if (approval.reuse_for_runtime_prohibited !== true) errors.push("runtime reuse not prohibited");
  }

  for (const flag of consumerBoundaryFlags) {
    if (record.consumer_boundaries?.[flag] !== true) errors.push(`bad consumer boundary ${flag}`);
  }
  for (const flag of forbiddenFlags) {
    if (record.forbidden_actions?.[flag] !== false) errors.push(`forbidden ${flag}`);
  }
  if (!nonEmptyString(record.human_review_one_point)) errors.push("missing human_review_one_point");
  if (!nonEmptyString(record.owner_facing_summary)) errors.push("missing owner_facing_summary");
  if (typeof record.owner_facing_summary === "string" && /[^\x20-\x7E]/u.test(record.owner_facing_summary)) {
    errors.push("non-ascii owner_facing_summary");
  }
  if (!safeNextActions.includes(record.recommended_next_action)) errors.push("unsafe recommended_next_action");
  return errors;
}

test("docs, schema, and allowlist carry the exact BUILD_ID and static shape", () => {
  const doc = readText("docs/orchestration/codex_native_result_envelope_readonly_consumer_observation_contract.md");
  assert.ok(doc.startsWith(`# BUILD_ID: ${BUILD_ID}`));
  assert.match(doc, /READY does not mean GO/i);
  assert.match(doc, /Observation reads evidence/i);
  assert.match(doc, /Queue handoff, ledger audit, approval freshness/i);
  assert.match(doc, /STOP_OWNER_REVIEW_REQUIRED/i);

  assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema.const, "lonewolf.codex_native.result_envelope_readonly_consumer_observation.v1");
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.stable_baseline.const, BASELINE);
  assert.deepEqual(observationStates, [OBSERVED_SAFE_NO_ACTION, OBSERVED_BLOCKED, OBSERVED_REJECTED, STOP]);
  assert.equal(schema.$defs.approval_binding.properties.owner_approval_phrase.const, PHRASE);
  assert.equal(schema.$defs.approval_binding.properties.exact_file_allowlist_count.const, 14);
  for (const flag of forbiddenFlags) assert.equal(schema.$defs.forbidden_actions.properties[flag].const, false);

  assert.equal(allowedFiles.length, 14);
  assert.equal(allowedFiles.filter((path) => path.startsWith("docs/")).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("schema/")).length, 1);
  assert.equal(allowedFiles.filter((path) => /^tests\/[^/]+\.test\.mjs$/u.test(path)).length, 1);
  assert.equal(allowedFiles.filter((path) => path.startsWith("tests/fixtures/")).length, 11);
  for (const file of allowedFiles) {
    assert.doesNotThrow(() => readText(file), `${file} must exist`);
    assert.match(file, /^(docs|schema|tests|tests\/fixtures)\//u);
    assert.doesNotMatch(file, /^(src|tools|scripts|runtime|worker|cloud|deploy|billing|trading|\.git|node_modules)\//u);
  }
});

test("valid read-only consumer observation fixtures are accepted", () => {
  const expectedStates = new Set([OBSERVED_SAFE_NO_ACTION, OBSERVED_BLOCKED, OBSERVED_REJECTED, STOP]);
  for (const [fixturePath, fixture] of validFixtures) {
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    assert.deepEqual(validateObservation(fixture.observation), [], fixturePath);
    assert.ok(expectedStates.has(fixture.observation.observation_state), fixturePath);
    for (const flag of forbiddenFlags) assert.equal(fixture.observation.forbidden_actions[flag], false, `${fixturePath} ${flag}`);
  }
});

test("invalid fixture matrix fails closed", () => {
  for (const [fixturePath, fixture] of invalidFixtures) {
    assert.equal(fixture.build_id, BUILD_ID, fixturePath);
    const observation = baseObservationFor(fixture.base_fixture);
    for (const mutationKey of ["mutation", "secondary_mutation", "tertiary_mutation", "quaternary_mutation"]) {
      if (fixture[mutationKey]) setPath(observation, fixture[mutationKey].path, fixture[mutationKey]);
    }
    const errors = validateObservation(observation);
    assert.ok(
      errors.some((error) => error.includes(fixture.expected_error)),
      `${fixturePath} expected ${fixture.expected_error}, got ${errors.join(", ")}`
    );
  }
});

test("unknown, lowercase, missing, and ambiguous observation states fail closed", () => {
  const safe = baseObservationFor("consumer_observation_ready_no_action.json");
  const unknown = clone(safe);
  unknown.observation_state = "OBSERVED_UNKNOWN";
  assert.ok(validateObservation(unknown).includes("bad observation_state"));

  const lowercase = clone(safe);
  lowercase.observation_state = "observed_safe_no_action";
  assert.ok(validateObservation(lowercase).includes("bad observation_state"));

  const missing = clone(safe);
  delete missing.observation_state;
  assert.ok(validateObservation(missing).includes("missing observation_state"));

  const ambiguous = clone(safe);
  ambiguous.observation_state = "READY";
  assert.ok(validateObservation(ambiguous).includes("bad observation_state"));
});

test("unsafe recommended next actions are rejected", () => {
  for (const action of [
    "COMMIT_NOW",
    "git push origin HEAD:master",
    "DEPLOY_PRODUCTION",
    "RUN_RUNTIME_WORKFLOW",
    "MUTATE_CLOUDFLARE_QUEUE",
    "START_TRADING_ORDER"
  ]) {
    const observation = baseObservationFor("consumer_observation_ready_no_action.json");
    observation.recommended_next_action = action;
    assert.ok(validateObservation(observation).includes("unsafe recommended_next_action"), action);
  }
});

test("fixtures avoid secret-like or raw-auth placeholders", () => {
  const badPattern = /api[_-]?key|secret|credential|password|raw[_-]?auth|bearer|private[_-]?key|production[_-]?db/iu;
  for (const fixturePath of [...validFixturePaths, ...invalidFixturePaths]) {
    assert.doesNotMatch(readText(fixturePath), badPattern, fixturePath);
  }
});

test("working tree changes stay inside the exact 14-file allowlist", () => {
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
    ...lwfNoteNetworkLocalOrchestratorImplementationLaneFiles,
    ...lwfNoteNetworkOutputsLitePromptOperationsImplementationLaneFiles,
    ...noteCoreArtifactContractImplementationLaneFiles,
    ...noteCoreArtifactAdoptionLedgerImplementationLaneFiles
  ]);

  const outside = changedPaths.filter((path) => !currentWorkingTreeGuardAllowedFiles.has(path));
  assert.deepEqual(outside, []);
});

console.log("codex_native_result_envelope_readonly_consumer_observation_contract_static: ok");
