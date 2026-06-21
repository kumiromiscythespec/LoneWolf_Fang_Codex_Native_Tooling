import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(repoRoot, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const schemaPath = "schema/orchestration/lwf_note_network_local_orchestrator.schema.json";
const fixtureRoot = "tests/fixtures/lwf-note-network-local-orchestrator";

const validFixtures = [
  `${fixtureRoot}/valid/scout-packet.json`,
  `${fixtureRoot}/valid/review-packet.json`,
  `${fixtureRoot}/valid/full-loop-ready-for-codex.json`
];

const invalidFixtures = [
  `${fixtureRoot}/invalid/missing-note-node.json`,
  `${fixtureRoot}/invalid/unsafe-go.json`,
  `${fixtureRoot}/invalid/push-approval-confusion.json`,
  `${fixtureRoot}/invalid/public-version-priority.json`,
  `${fixtureRoot}/invalid/codex-direct-execution-without-scout.json`,
  `${fixtureRoot}/invalid/review-skipped.json`,
  `${fixtureRoot}/invalid/note-output-used-as-proof-without-verification.json`
];

const requiredTopLevel = [
  "schema_version",
  "lane",
  "project_priority",
  "public_version_deferred",
  "local_orchestrator_priority",
  "scout_phase",
  "note_nodes",
  "node_roles",
  "merged_packet",
  "compact_packet",
  "codex_phase",
  "codex_usage_reduction",
  "review_phase",
  "chatgpt_final_review",
  "owner_decision",
  "safety_boundary",
  "forbidden_actions",
  "evidence_requirements",
  "terminal_state"
];

const requiredNoteNodes = ["NOTE-01", "NOTE-02", "NOTE-03", "NOTE-04", "NOTE-05"];
const terminalStates = new Set([
  "READY_FOR_CHATGPT_SCOUT_REVIEW",
  "READY_FOR_CODEX_BOUNDED_PROMPT",
  "READY_FOR_CHATGPT_FINAL_REVIEW",
  "READY_FOR_NEXT_BOUNDED_PROMPT",
  "STOP_OWNER_REVIEW_REQUIRED"
]);

const falseForbiddenActions = [
  "runtime_automation",
  "openai_api_call",
  "private_api_call",
  "local_note_node_call",
  "ollama_call",
  "queue_mutation",
  "cloud_mutation",
  "billing_mutation",
  "auth_mutation",
  "trading_mutation",
  "push",
  "pr",
  "merge",
  "deploy",
  "public_submission"
];

function requireObject(value, label, errors) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(`${label} must be an object`);
    return undefined;
  }
  return value;
}

function expectConst(value, expected, label, errors) {
  if (value !== expected) errors.push(`${label} must be ${JSON.stringify(expected)}`);
}

function validateLocalOrchestrator(record) {
  const errors = [];
  if (!requireObject(record, "record", errors)) return errors;

  for (const key of requiredTopLevel) {
    if (!(key in record)) errors.push(`${key} is required`);
  }

  expectConst(record.schema_version, "1.0.0", "schema_version", errors);
  expectConst(record.lane, "LWF_NOTE_NETWORK_LOCAL_ORCHESTRATOR", "lane", errors);
  expectConst(record.project_priority, "LOCAL_LWF_NOTE_NETWORK_FIRST", "project_priority", errors);
  expectConst(record.public_version_deferred, true, "public_version_deferred", errors);
  expectConst(record.local_orchestrator_priority, true, "local_orchestrator_priority", errors);
  if (!terminalStates.has(record.terminal_state)) errors.push("terminal_state is invalid");

  if (!Array.isArray(record.note_nodes)) {
    errors.push("note_nodes must be an array");
  } else {
    assertNoDuplicates(record.note_nodes, errors);
    if (record.note_nodes.length !== requiredNoteNodes.length) errors.push("all five NOTE nodes are required");
    for (const node of requiredNoteNodes) {
      if (!record.note_nodes.includes(node)) errors.push(`${node} is required`);
    }
  }

  const roles = requireObject(record.node_roles, "node_roles", errors);
  if (roles) {
    for (const node of requiredNoteNodes) {
      if (typeof roles[node] !== "string" || roles[node].length === 0) errors.push(`node_roles.${node} is required`);
    }
  }

  const scout = requireObject(record.scout_phase, "scout_phase", errors);
  if (scout) {
    expectConst(scout.chatgpt_writes_plan, true, "scout_phase.chatgpt_writes_plan", errors);
    expectConst(scout.owner_writes_plan_to_input, "C:\\LWF_NoteNetwork\\inputs\\scout_plan.txt", "scout_phase.owner_writes_plan_to_input", errors);
    expectConst(scout.local_runner, "run-scout.ps1", "scout_phase.local_runner", errors);
    expectConst(scout.all_note_nodes_required, true, "scout_phase.all_note_nodes_required", errors);
    expectConst(scout.chatgpt_review_required, true, "scout_phase.chatgpt_review_required", errors);
    expectConst(scout.codex_execution_approved_by_scout, false, "scout_phase.codex_execution_approved_by_scout", errors);
  }

  const merged = requireObject(record.merged_packet, "merged_packet", errors);
  if (merged) {
    expectConst(merged.includes_all_note_nodes, true, "merged_packet.includes_all_note_nodes", errors);
    expectConst(merged.treated_as_proof, false, "merged_packet.treated_as_proof", errors);
  }

  const compact = requireObject(record.compact_packet, "compact_packet", errors);
  if (compact) {
    expectConst(compact.requires_independent_verification, true, "compact_packet.requires_independent_verification", errors);
  }

  const codex = requireObject(record.codex_phase, "codex_phase", errors);
  if (codex) {
    expectConst(codex.bounded_prompt_required, true, "codex_phase.bounded_prompt_required", errors);
    expectConst(codex.artifact_zip_required, true, "codex_phase.artifact_zip_required", errors);
    expectConst(codex.sha_sidecars_required, true, "codex_phase.sha_sidecars_required", errors);
    expectConst(codex.cloud_unpushed_worktree_assumed_readable, false, "codex_phase.cloud_unpushed_worktree_assumed_readable", errors);
    if (codex.execution_allowed === true && (codex.scout_completed !== true || codex.chatgpt_scout_review_completed !== true)) {
      errors.push("Codex execution requires SCOUT completion and ChatGPT SCOUT review");
    }
  }

  const reduction = requireObject(record.codex_usage_reduction, "codex_usage_reduction", errors);
  if (reduction) {
    expectConst(reduction.note_preprocessing_enabled, true, "codex_usage_reduction.note_preprocessing_enabled", errors);
    expectConst(reduction.codex_scope_reduced_by_scout, true, "codex_usage_reduction.codex_scope_reduced_by_scout", errors);
    expectConst(reduction.codex_final_authority, false, "codex_usage_reduction.codex_final_authority", errors);
  }

  const review = requireObject(record.review_phase, "review_phase", errors);
  if (review) {
    expectConst(review.required_after_codex_execution, true, "review_phase.required_after_codex_execution", errors);
    expectConst(review.all_note_nodes_required, true, "review_phase.all_note_nodes_required", errors);
    expectConst(review.push_approved_by_review, false, "review_phase.push_approved_by_review", errors);
    if (record.codex_phase?.execution_allowed === true && record.terminal_state === "READY_FOR_NEXT_BOUNDED_PROMPT" && review.completed !== true) {
      errors.push("REVIEW cannot be skipped after Codex execution");
    }
  }

  const finalReview = requireObject(record.chatgpt_final_review, "chatgpt_final_review", errors);
  if (finalReview) {
    expectConst(finalReview.required, true, "chatgpt_final_review.required", errors);
    expectConst(finalReview.uses_artifacts, true, "chatgpt_final_review.uses_artifacts", errors);
    expectConst(finalReview.uses_diffs, true, "chatgpt_final_review.uses_diffs", errors);
    expectConst(finalReview.uses_tests, true, "chatgpt_final_review.uses_tests", errors);
    expectConst(finalReview.uses_manifests, true, "chatgpt_final_review.uses_manifests", errors);
    expectConst(finalReview.uses_repo_evidence, true, "chatgpt_final_review.uses_repo_evidence", errors);
    expectConst(finalReview.note_output_is_proof, false, "chatgpt_final_review.note_output_is_proof", errors);
  }

  const owner = requireObject(record.owner_decision, "owner_decision", errors);
  if (owner) {
    expectConst(owner.required, true, "owner_decision.required", errors);
    expectConst(owner.one_point_only, true, "owner_decision.one_point_only", errors);
    expectConst(owner.ready_is_go, false, "owner_decision.ready_is_go", errors);
    expectConst(owner.matched_is_go, false, "owner_decision.matched_is_go", errors);
  }

  const safety = requireObject(record.safety_boundary, "safety_boundary", errors);
  if (safety) {
    expectConst(safety.runtime_go, false, "safety_boundary.runtime_go", errors);
    expectConst(safety.push_go, false, "safety_boundary.push_go", errors);
    expectConst(safety.deploy_go, false, "safety_boundary.deploy_go", errors);
    expectConst(safety.public_submission_go, false, "safety_boundary.public_submission_go", errors);
    expectConst(safety.note_output_is_local_preprocessing, true, "safety_boundary.note_output_is_local_preprocessing", errors);
    expectConst(safety.owner_review_mandatory, true, "safety_boundary.owner_review_mandatory", errors);
  }

  const forbidden = requireObject(record.forbidden_actions, "forbidden_actions", errors);
  if (forbidden) {
    for (const action of falseForbiddenActions) {
      expectConst(forbidden[action], false, `forbidden_actions.${action}`, errors);
    }
  }

  const evidence = requireObject(record.evidence_requirements, "evidence_requirements", errors);
  if (evidence) {
    for (const key of ["artifact_zip", "sha_sidecars", "diffs", "test_summary", "manifest", "repo_evidence"]) {
      expectConst(evidence[key], true, `evidence_requirements.${key}`, errors);
    }
    expectConst(evidence.note_output_alone_sufficient, false, "evidence_requirements.note_output_alone_sufficient", errors);
  }

  return errors;
}

function assertNoDuplicates(values, errors) {
  if (new Set(values).size !== values.length) errors.push("note_nodes must not contain duplicates");
}

test("schema declares the required local orchestrator safety fields", () => {
  const schema = readJson(schemaPath);
  for (const key of requiredTopLevel) {
    assert.ok(schema.required.includes(key), `${key} must be schema-required`);
    assert.ok(schema.properties[key], `${key} must be modeled in schema properties`);
  }

  assert.equal(schema.properties.public_version_deferred.const, true);
  assert.equal(schema.properties.local_orchestrator_priority.const, true);
  assert.equal(schema.properties.chatgpt_final_review.properties.note_output_is_proof.const, false);
  assert.equal(schema.properties.codex_phase.properties.cloud_unpushed_worktree_assumed_readable.const, false);
  assert.equal(schema.properties.review_phase.properties.push_approved_by_review.const, false);
  assert.equal(schema.properties.scout_phase.properties.codex_execution_approved_by_scout.const, false);
});

test("valid fixtures pass the local orchestrator contract", () => {
  for (const path of validFixtures) {
    const errors = validateLocalOrchestrator(readJson(path));
    assert.deepEqual(errors, [], `${path} should be valid`);
  }
});

test("invalid fixtures fail the local orchestrator contract", () => {
  for (const path of invalidFixtures) {
    const errors = validateLocalOrchestrator(readJson(path));
    assert.notDeepEqual(errors, [], `${path} should be invalid`);
  }
});

test("fixtures preserve the requested safety semantics", () => {
  const fullLoop = readJson(`${fixtureRoot}/valid/full-loop-ready-for-codex.json`);

  assert.equal(fullLoop.public_version_deferred, true);
  assert.equal(fullLoop.local_orchestrator_priority, true);
  assert.equal(fullLoop.scout_phase.codex_execution_approved_by_scout, false);
  assert.equal(fullLoop.review_phase.push_approved_by_review, false);
  assert.equal(fullLoop.chatgpt_final_review.note_output_is_proof, false);
  assert.equal(fullLoop.codex_phase.cloud_unpushed_worktree_assumed_readable, false);
  assert.equal(fullLoop.evidence_requirements.note_output_alone_sufficient, false);
  assert.equal(fullLoop.safety_boundary.runtime_go, false);
  assert.equal(fullLoop.safety_boundary.push_go, false);
});

test("the exact fixture matrix is covered", () => {
  assert.equal(validFixtures.length, 3);
  assert.equal(invalidFixtures.length, 7);
  assert.equal([...validFixtures, ...invalidFixtures].length, 10);
});
