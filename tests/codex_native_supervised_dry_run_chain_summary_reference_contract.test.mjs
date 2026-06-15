// BUILD_ID: 20260616_supervised_dry_run_chain_summary_reference_contracts_v1
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const BUILD_ID = "20260616_supervised_dry_run_chain_summary_reference_contracts_v1";
const SCHEMA_ID = "lonewolf.codex_native.supervised_dry_run_chain_summary_reference.v1";
const TARGET = "supervised_dry_run_chain_summary_reference_contracts";
const BASELINE = "0b021093b08b22e1d3f695655d2ffbbacd257ddc";
const IMPLEMENTATION_APPROVAL_SHA = "F1F065787757617F2C7A3E934739CCFA84531669929B57FED8983E917B63FBDF";
const PLANNING_SHA = "3B3BDB1517734E047BFBD197F1BBA0A1A0E9976F2EF6EA1F1EB06BF77DE72104";
const NEXT_REVIEW = "START_SUPERVISED_DRY_RUN_CHAIN_SUMMARY_REFERENCE_CONTRACTS_IMPLEMENTATION_REVIEW_PACKET";
const PLANNING_PATH =
  "C:/Users/yu_ki/AppData/Local/LoneWolfFang/data/codex_native_supervised_dry_run_next_chain_selection_planning_packet_20260616_013242.zip";
const IMPLEMENTATION_APPROVAL_PATH =
  "C:/Users/yu_ki/AppData/Local/LoneWolfFang/data/codex_native_supervised_dry_run_chain_summary_reference_contracts_implementation_approval_packet_20260616_013749.zip";
const FUTURE_OWNER_REVIEW_PACKET_PATH =
  "C:/Users/yu_ki/AppData/Local/LoneWolfFang/data/future_static_supervised_dry_run_owner_review_packet.zip";
const FUTURE_CHAIN_SUMMARY_CONTEXT_PATH =
  "C:/Users/yu_ki/AppData/Local/LoneWolfFang/data/future_static_supervised_dry_run_chain_summary_context_packet.zip";
const FUTURE_OWNER_REVIEW_PACKET_SHA = "ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789";
const FUTURE_CHAIN_SUMMARY_CONTEXT_SHA = "1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF";

const docPath = "docs/orchestration/codex_native_supervised_dry_run_chain_summary_reference_contract.md";
const schemaPath = "schema/orchestration/codex_native_supervised_dry_run_chain_summary_reference.schema.json";
const testPath = "tests/codex_native_supervised_dry_run_chain_summary_reference_contract.test.mjs";
const fixtureRoot = "tests/fixtures/codex-native-supervised-dry-run/chain-summary-reference";

const validFixtures = [
  fixtureRoot + "/valid/reference-not-started.json",
  fixtureRoot + "/valid/reference-blocked-owner-review-required.json",
  fixtureRoot + "/valid/reference-blocked-missing-owner-review-packet.json",
  fixtureRoot + "/valid/reference-blocked-missing-chain-summary-context.json",
  fixtureRoot + "/valid/reference-draft-context-ready.json",
  fixtureRoot + "/valid/reference-hash-bound-evidence-ready.json",
  fixtureRoot + "/valid/reference-ready-for-human-review.json",
  fixtureRoot + "/valid/reference-failed-closed.json",
  fixtureRoot + "/valid/reference-stop-owner-review-required.json"
];

const invalidFixtures = [
  fixtureRoot + "/invalid/forbidden-execution-actions-true.json",
  fixtureRoot + "/invalid/chain-summary-creation-true.json",
  fixtureRoot + "/invalid/owner-review-submission-true.json",
  fixtureRoot + "/invalid/audit-bundle-creation-true.json",
  fixtureRoot + "/invalid/worker-queue-cloud-mutation-true.json",
  fixtureRoot + "/invalid/private-openai-api-true.json",
  fixtureRoot + "/invalid/auto-approval-true.json",
  fixtureRoot + "/invalid/missing-chain-summary-context.json",
  fixtureRoot + "/invalid/missing-owner-review-packet-reference.json",
  fixtureRoot + "/invalid/missing-human-review-point.json",
  fixtureRoot + "/invalid/mismatched-reference-hash.json",
  fixtureRoot + "/invalid/stale-baseline-accepted.json",
  fixtureRoot + "/invalid/ready-treated-as-go.json"
];

const allowedFiles = [
  docPath,
  schemaPath,
  testPath,
  ...validFixtures,
  ...invalidFixtures
];

const schema = readJson(schemaPath);
const statuses = schema.properties.chain_summary_reference_status.enum;
const forbiddenFlags = Object.keys(schema.definitions.forbidden_actions.properties);
const notGoFlags = Object.keys(schema.definitions.not_go_assertions.properties);
const safeNextActions = schema.definitions.next_action.properties.recommended_next_action.enum;
const defaultForbiddenActions = Object.fromEntries(forbiddenFlags.map((flag) => [flag, false]));
const defaultNotGoAssertions = Object.fromEntries(notGoFlags.map((flag) => [flag, true]));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function listFixtureFiles(dir) {
  const abs = resolve(root, dir);
  return readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const rel = dir + "/" + entry.name;
    return entry.isDirectory() ? listFixtureFiles(rel) : [rel];
  }).sort();
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

function buildRecord(fixture) {
  const ownerPresent = fixture.owner_review_packet_present === true;
  const contextPresent = fixture.chain_summary_context_present === true;
  const hashComplete = fixture.hash_binding_complete === true;
  const blockerStatus = fixture.blocker_status || "PASS";
  const forbiddenActions = { ...defaultForbiddenActions, ...(fixture.forbidden_actions || {}) };
  const notGoAssertions = { ...defaultNotGoAssertions, ...(fixture.not_go_assertions || {}) };

  return {
    schema: SCHEMA_ID,
    build_id: BUILD_ID,
    reference_id: fixture.case_id,
    reference_created_at_utc: "2026-06-16T00:00:00Z",
    target: TARGET,
    target_repo: "C:/LoneWolf_Fang_Project/repos/core/LoneWolf_Fang_Codex_Native_Tooling",
    branch: "master",
    baseline_commit: BASELINE,
    local_origin_master: BASELINE,
    ahead_behind: "0 / 0",
    source_owner_review_packet_to_chain_summary_linkage_commit: BASELINE,
    source_planning_artifact: {
      artifact_role: "planning_evidence",
      artifact_path: PLANNING_PATH,
      artifact_sha256: PLANNING_SHA,
      sha256_matches_expected: true,
      evidence_only: true,
      authoritative: true
    },
    source_implementation_approval_packet: {
      artifact_role: "implementation_approval_evidence",
      artifact_path: IMPLEMENTATION_APPROVAL_PATH,
      artifact_sha256: IMPLEMENTATION_APPROVAL_SHA,
      sha256_matches_expected: true,
      evidence_only: true,
      authoritative: true
    },
    owner_review_packet_reference: {
      owner_review_packet_present: ownerPresent,
      owner_review_packet_status: fixture.owner_review_packet_status,
      owner_review_packet_artifact_path: ownerPresent ? FUTURE_OWNER_REVIEW_PACKET_PATH : null,
      owner_review_packet_artifact_sha256: ownerPresent ? FUTURE_OWNER_REVIEW_PACKET_SHA : null,
      owner_review_packet_artifact_sha256_matches_expected: ownerPresent,
      safe_for_reference: fixture.owner_review_packet_safe_for_reference,
      static_reference_only: true,
      owner_review_packet_submitted: false,
      owner_review_packet_submission_performed: false
    },
    chain_summary_context_reference: {
      context_present: contextPresent,
      context_status: fixture.chain_summary_context_status,
      context_artifact_path: contextPresent ? FUTURE_CHAIN_SUMMARY_CONTEXT_PATH : null,
      context_artifact_sha256: contextPresent ? FUTURE_CHAIN_SUMMARY_CONTEXT_SHA : null,
      context_artifact_sha256_matches_expected: contextPresent,
      safe_for_reference: fixture.chain_summary_context_safe_for_reference,
      static_reference_only: true,
      future_reference_only: true,
      chain_summary_created: false,
      chain_summary_creation_performed: false,
      proof_of_live_chain_summary: false
    },
    hash_binding_summary: {
      hash_binding_complete: hashComplete,
      owner_review_packet_sha256: ownerPresent ? FUTURE_OWNER_REVIEW_PACKET_SHA : null,
      chain_summary_context_sha256: contextPresent ? FUTURE_CHAIN_SUMMARY_CONTEXT_SHA : null,
      hashes_match_expected: hashComplete,
      execution_approval: false,
      chain_summary_creation_approval: false,
      owner_review_submission_approval: false,
      runtime_go_approval: false
    },
    baseline_check: {
      expected_baseline_commit: BASELINE,
      observed_baseline_commit: fixture.observed_baseline_commit,
      baseline_matches_expected: fixture.baseline_matches_expected
    },
    chain_summary_reference_status: fixture.status,
    not_go_assertions: notGoAssertions,
    next_action: {
      recommended_next_action: fixture.next_action,
      bounded_and_safe: true,
      owner_gate_required: true,
      unsafe_next_action_allowed: false
    },
    forbidden_actions: forbiddenActions,
    blocker_matrix: [
      {
        blocker: fixture.blocker,
        status: blockerStatus,
        resolution: fixture.resolution,
        allows_progression: blockerStatus === "PASS"
      }
    ],
    human_review_one_point: fixture.human_review_one_point,
    fail_closed_result: {
      status: "STOP_OWNER_REVIEW_REQUIRED",
      failed_closed: fixture.failed_closed === true,
      reason: fixture.fail_closed_reason,
      owner_review_required: true,
      allows_automatic_progression: false
    },
    safety_invariants: Object.keys(notGoAssertions)
  };
}

function buildInvalidRecord(fixture) {
  const base = readJson(fixtureRoot + "/valid/" + fixture.base_fixture);
  const record = buildRecord(base);
  for (const mutation of fixture.mutations) setPath(record, mutation.path, mutation);
  return record;
}

function validateArtifact(artifact, field, expectedSha, errors) {
  if (!object(artifact)) {
    errors.push(field);
    return;
  }
  if (typeof artifact.artifact_role !== "string" || artifact.artifact_role.length === 0) errors.push(field + ".artifact_role");
  if (typeof artifact.artifact_path !== "string" || artifact.artifact_path.length === 0) errors.push(field + ".artifact_path");
  if (!sha256(artifact.artifact_sha256)) errors.push(field + ".artifact_sha256");
  if (artifact.artifact_sha256 !== expectedSha) errors.push(field + ".artifact_sha256");
  if (artifact.sha256_matches_expected !== true) errors.push(field + ".sha256_matches_expected");
  if (artifact.evidence_only !== true) errors.push(field + ".evidence_only");
  if (typeof artifact.authoritative !== "boolean") errors.push(field + ".authoritative");
}

function validateReference(record) {
  const errors = [];
  const allowed = new Set(Object.keys(schema.properties));

  for (const field of schema.required) if (!Object.hasOwn(record, field)) errors.push("missing " + field);
  for (const field of Object.keys(record)) if (!allowed.has(field)) errors.push("unexpected " + field);
  if (errors.length > 0) return errors;

  if (record.schema !== SCHEMA_ID) errors.push("schema");
  if (record.build_id !== BUILD_ID) errors.push("build_id");
  if (record.target !== TARGET) errors.push("target");
  if (record.branch !== "master") errors.push("branch");
  if (record.baseline_commit !== BASELINE) errors.push("baseline_commit");
  if (record.local_origin_master !== BASELINE) errors.push("local_origin_master");
  if (record.ahead_behind !== "0 / 0") errors.push("ahead_behind");
  if (record.source_owner_review_packet_to_chain_summary_linkage_commit !== BASELINE) {
    errors.push("source_owner_review_packet_to_chain_summary_linkage_commit");
  }
  if (!statuses.includes(record.chain_summary_reference_status)) errors.push("chain_summary_reference_status");
  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length === 0) {
    errors.push("human_review_one_point");
  }

  validateArtifact(record.source_planning_artifact, "source_planning_artifact", PLANNING_SHA, errors);
  validateArtifact(
    record.source_implementation_approval_packet,
    "source_implementation_approval_packet",
    IMPLEMENTATION_APPROVAL_SHA,
    errors
  );

  validateOwnerReviewPacketReference(record.owner_review_packet_reference, errors);
  validateChainSummaryContextReference(record.chain_summary_context_reference, errors);
  validateHashBinding(record, errors);
  validateBaseline(record.baseline_check, errors);
  validateNotGo(record.not_go_assertions, errors);
  validateNextAction(record.next_action, errors);
  validateForbiddenActions(record.forbidden_actions, errors);
  validateBlockers(record.blocker_matrix, errors);
  validateFailClosed(record.fail_closed_result, record.chain_summary_reference_status, errors);
  validateStatusSemantics(record, errors);

  return errors;
}

function validateOwnerReviewPacketReference(ref, errors) {
  if (!object(ref)) {
    errors.push("owner_review_packet_reference");
    return;
  }
  if (typeof ref.owner_review_packet_present !== "boolean") errors.push("owner_review_packet_reference.owner_review_packet_present");
  if (typeof ref.owner_review_packet_status !== "string" || ref.owner_review_packet_status.length === 0) {
    errors.push("owner_review_packet_reference.owner_review_packet_status");
  }
  if (ref.owner_review_packet_present === true) {
    if (typeof ref.owner_review_packet_artifact_path !== "string" || ref.owner_review_packet_artifact_path.length === 0) {
      errors.push("owner_review_packet_reference.owner_review_packet_artifact_path");
    }
    if (ref.owner_review_packet_artifact_sha256 !== FUTURE_OWNER_REVIEW_PACKET_SHA) {
      errors.push("owner_review_packet_reference.owner_review_packet_artifact_sha256");
    }
    if (ref.owner_review_packet_artifact_sha256_matches_expected !== true) {
      errors.push("owner_review_packet_reference.owner_review_packet_artifact_sha256_matches_expected");
    }
  }
  if (ref.owner_review_packet_present === false && ref.owner_review_packet_artifact_sha256 !== null) {
    errors.push("owner_review_packet_reference.owner_review_packet_artifact_sha256");
  }
  if (typeof ref.safe_for_reference !== "boolean") errors.push("owner_review_packet_reference.safe_for_reference");
  if (ref.static_reference_only !== true) errors.push("owner_review_packet_reference.static_reference_only");
  if (ref.owner_review_packet_submitted !== false) errors.push("owner_review_packet_reference.owner_review_packet_submitted");
  if (ref.owner_review_packet_submission_performed !== false) {
    errors.push("owner_review_packet_reference.owner_review_packet_submission_performed");
  }
}

function validateChainSummaryContextReference(ref, errors) {
  if (!object(ref)) {
    errors.push("chain_summary_context_reference");
    return;
  }
  if (typeof ref.context_present !== "boolean") errors.push("chain_summary_context_reference.context_present");
  if (typeof ref.context_status !== "string" || ref.context_status.length === 0) {
    errors.push("chain_summary_context_reference.context_status");
  }
  if (ref.context_present === true) {
    if (typeof ref.context_artifact_path !== "string" || ref.context_artifact_path.length === 0) {
      errors.push("chain_summary_context_reference.context_artifact_path");
    }
    if (ref.context_artifact_sha256 !== FUTURE_CHAIN_SUMMARY_CONTEXT_SHA) {
      errors.push("chain_summary_context_reference.context_artifact_sha256");
    }
    if (ref.context_artifact_sha256_matches_expected !== true) {
      errors.push("chain_summary_context_reference.context_artifact_sha256_matches_expected");
    }
  }
  if (ref.context_present === false && ref.context_artifact_sha256 !== null) {
    errors.push("chain_summary_context_reference.context_artifact_sha256");
  }
  if (typeof ref.safe_for_reference !== "boolean") errors.push("chain_summary_context_reference.safe_for_reference");
  if (ref.static_reference_only !== true) errors.push("chain_summary_context_reference.static_reference_only");
  if (ref.future_reference_only !== true) errors.push("chain_summary_context_reference.future_reference_only");
  if (ref.chain_summary_created !== false) errors.push("chain_summary_context_reference.chain_summary_created");
  if (ref.chain_summary_creation_performed !== false) {
    errors.push("chain_summary_context_reference.chain_summary_creation_performed");
  }
  if (ref.proof_of_live_chain_summary !== false) errors.push("chain_summary_context_reference.proof_of_live_chain_summary");
}

function validateHashBinding(record, errors) {
  const binding = record.hash_binding_summary;
  if (!object(binding)) {
    errors.push("hash_binding_summary");
    return;
  }
  if (typeof binding.hash_binding_complete !== "boolean") errors.push("hash_binding_summary.hash_binding_complete");
  if (record.owner_review_packet_reference.owner_review_packet_present === true &&
    binding.owner_review_packet_sha256 !== record.owner_review_packet_reference.owner_review_packet_artifact_sha256) {
    errors.push("hash_binding_summary.owner_review_packet_sha256");
  }
  if (record.chain_summary_context_reference.context_present === true &&
    binding.chain_summary_context_sha256 !== record.chain_summary_context_reference.context_artifact_sha256) {
    errors.push("hash_binding_summary.chain_summary_context_sha256");
  }
  if (binding.hash_binding_complete === true && binding.hashes_match_expected !== true) {
    errors.push("hash_binding_summary.hashes_match_expected");
  }
  for (const field of [
    "execution_approval",
    "chain_summary_creation_approval",
    "owner_review_submission_approval",
    "runtime_go_approval"
  ]) {
    if (binding[field] !== false) errors.push("hash_binding_summary." + field);
  }
}

function validateBaseline(check, errors) {
  if (!object(check)) {
    errors.push("baseline_check");
    return;
  }
  if (check.expected_baseline_commit !== BASELINE) errors.push("baseline_check.expected_baseline_commit");
  if (check.observed_baseline_commit !== BASELINE) errors.push("baseline_check.observed_baseline_commit");
  if (check.baseline_matches_expected !== true) errors.push("baseline_check.baseline_matches_expected");
}

function validateNotGo(assertions, errors) {
  if (!object(assertions)) {
    errors.push("not_go_assertions");
    return;
  }
  for (const flag of notGoFlags) {
    if (assertions[flag] !== true) errors.push("not_go_assertions." + flag);
  }
  for (const flag of Object.keys(assertions)) {
    if (!notGoFlags.includes(flag)) errors.push("not_go_assertions.unexpected." + flag);
  }
}

function validateNextAction(nextAction, errors) {
  if (!object(nextAction)) {
    errors.push("next_action");
    return;
  }
  if (!safeNextActions.includes(nextAction.recommended_next_action)) errors.push("next_action.recommended_next_action");
  if (nextAction.bounded_and_safe !== true) errors.push("next_action.bounded_and_safe");
  if (nextAction.owner_gate_required !== true) errors.push("next_action.owner_gate_required");
  if (nextAction.unsafe_next_action_allowed !== false) errors.push("next_action.unsafe_next_action_allowed");
}

function validateForbiddenActions(actions, errors) {
  if (!object(actions)) {
    errors.push("forbidden_actions");
    return;
  }
  for (const flag of forbiddenFlags) {
    if (actions[flag] !== false) errors.push("forbidden_actions." + flag);
  }
  for (const flag of Object.keys(actions)) {
    if (!forbiddenFlags.includes(flag)) errors.push("forbidden_actions.unexpected." + flag);
  }
}

function validateBlockers(blockers, errors) {
  if (!Array.isArray(blockers) || blockers.length === 0) {
    errors.push("blocker_matrix");
    return;
  }
  for (const blocker of blockers) {
    if (typeof blocker.blocker !== "string" || blocker.blocker.length === 0) errors.push("blocker_matrix.blocker");
    if (!["PASS", "BLOCKED", "STOP_OWNER_REVIEW_REQUIRED"].includes(blocker.status)) errors.push("blocker_matrix.status");
    if (typeof blocker.resolution !== "string" || blocker.resolution.length === 0) errors.push("blocker_matrix.resolution");
    if (typeof blocker.allows_progression !== "boolean") errors.push("blocker_matrix.allows_progression");
    if (blocker.status !== "PASS" && blocker.allows_progression !== false) errors.push("blocker_matrix.allows_progression");
  }
}

function validateFailClosed(result, status, errors) {
  if (!object(result)) {
    errors.push("fail_closed_result");
    return;
  }
  if (result.status !== "STOP_OWNER_REVIEW_REQUIRED") errors.push("fail_closed_result.status");
  if (typeof result.failed_closed !== "boolean") errors.push("fail_closed_result.failed_closed");
  if (typeof result.reason !== "string") errors.push("fail_closed_result.reason");
  if (result.owner_review_required !== true) errors.push("fail_closed_result.owner_review_required");
  if (result.allows_automatic_progression !== false) errors.push("fail_closed_result.allows_automatic_progression");
  if ((status === "CHAIN_SUMMARY_REFERENCE_FAILED_CLOSED" || status === "STOP_OWNER_REVIEW_REQUIRED") &&
    (result.failed_closed !== true || result.reason.length === 0)) {
    errors.push("fail_closed_result.reason");
  }
}

function validateStatusSemantics(record, errors) {
  const status = record.chain_summary_reference_status;
  const owner = record.owner_review_packet_reference;
  const context = record.chain_summary_context_reference;
  const binding = record.hash_binding_summary;
  const readyStatuses = new Set([
    "CHAIN_SUMMARY_REFERENCE_DRAFT_CONTEXT_READY",
    "CHAIN_SUMMARY_REFERENCE_HASH_BOUND_EVIDENCE_READY",
    "CHAIN_SUMMARY_REFERENCE_READY_FOR_HUMAN_REVIEW"
  ]);

  if (status === "CHAIN_SUMMARY_REFERENCE_BLOCKED_MISSING_OWNER_REVIEW_PACKET" &&
    owner.owner_review_packet_present !== false) {
    errors.push("owner_review_packet_reference.owner_review_packet_present");
  }
  if (status === "CHAIN_SUMMARY_REFERENCE_BLOCKED_MISSING_CHAIN_SUMMARY_CONTEXT" &&
    context.context_present !== false) {
    errors.push("chain_summary_context_reference.context_present");
  }
  if (readyStatuses.has(status)) {
    if (owner.owner_review_packet_present !== true) errors.push("owner_review_packet_reference.owner_review_packet_present");
    if (owner.safe_for_reference !== true) errors.push("owner_review_packet_reference.safe_for_reference");
    if (context.context_present !== true) errors.push("chain_summary_context_reference.context_present");
    if (context.safe_for_reference !== true) errors.push("chain_summary_context_reference.safe_for_reference");
    if (binding.hash_binding_complete !== true) errors.push("hash_binding_summary.hash_binding_complete");
    if (binding.hashes_match_expected !== true) errors.push("hash_binding_summary.hashes_match_expected");
  }
}

test("contract file set is exact and BUILD_ID markers are present", () => {
  assert.equal(readText(docPath).split(/\r?\n/u)[0], "<!-- BUILD_ID: " + BUILD_ID + " -->");
  assert.equal(readText(testPath).split(/\r?\n/u)[0], "// BUILD_ID: " + BUILD_ID);
  assert.ok(schema.$comment.includes(BUILD_ID));

  for (const file of allowedFiles) assert.doesNotThrow(() => readText(file), file);
  assert.deepEqual(listFixtureFiles(fixtureRoot), [...validFixtures, ...invalidFixtures].sort());
});

test("schema declares the expected identity, status, and false-only flags", () => {
  assert.equal(schema.schema_id, SCHEMA_ID);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.baseline_commit.const, BASELINE);
  assert.ok(statuses.includes("CHAIN_SUMMARY_REFERENCE_READY_FOR_HUMAN_REVIEW"));
  assert.ok(safeNextActions.includes(NEXT_REVIEW));

  for (const flag of forbiddenFlags) {
    assert.deepEqual(schema.definitions.forbidden_actions.properties[flag], { const: false });
  }
  for (const flag of notGoFlags) {
    assert.deepEqual(schema.definitions.not_go_assertions.properties[flag], { const: true });
  }
});

test("valid fixtures build valid chain summary reference records", () => {
  for (const file of validFixtures) {
    const fixture = readJson(file);
    const errors = validateReference(buildRecord(fixture));
    assert.deepEqual(errors, [], file);
  }
});

test("invalid fixtures fail closed on the expected fields", () => {
  for (const file of invalidFixtures) {
    const fixture = readJson(file);
    const errors = validateReference(buildInvalidRecord(fixture));
    assert.notDeepEqual(errors, [], file);
    for (const expected of fixture.expected_errors) {
      assert.ok(errors.some((error) => error.includes(expected)), file + " expected " + expected + " in " + errors.join(", "));
    }
  }
});

test("READY-style values are evidence states only and not GO", () => {
  const ready = buildRecord(readJson(fixtureRoot + "/valid/reference-ready-for-human-review.json"));
  assert.equal(ready.chain_summary_reference_status, "CHAIN_SUMMARY_REFERENCE_READY_FOR_HUMAN_REVIEW");
  assert.equal(ready.not_go_assertions.ready_not_go, true);
  assert.equal(ready.not_go_assertions.matched_not_go, true);
  assert.equal(ready.not_go_assertions.observed_safe_no_action_not_go, true);
  assert.equal(ready.not_go_assertions.hash_binding_not_execution_approval, true);
  assert.equal(ready.hash_binding_summary.execution_approval, false);
  assert.equal(ready.hash_binding_summary.runtime_go_approval, false);
  assert.equal(ready.forbidden_actions.auto_go_signal, false);
  assert.deepEqual(validateReference(ready), []);
});

test("unknown top-level fields are rejected", () => {
  const record = buildRecord(readJson(fixtureRoot + "/valid/reference-ready-for-human-review.json"));
  record.unexpected_runtime_hint = "not allowed";
  assert.ok(validateReference(record).some((error) => error.includes("unexpected unexpected_runtime_hint")));
});
