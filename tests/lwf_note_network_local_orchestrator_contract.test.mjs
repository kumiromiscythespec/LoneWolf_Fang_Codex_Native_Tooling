// BUILD_ID: 20260622_lwf_note_network_closeout_linkage_narrow_correction_v1

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
  `${fixtureRoot}/valid/artifact-manifest-safe-options.json`,
  `${fixtureRoot}/valid/source-packet-verification-linkage.json`,
  `${fixtureRoot}/valid/scout-review-handoff-shape.json`
];

const invalidFixtures = [
  `${fixtureRoot}/invalid/unsafe-next-codex-prompt.json`,
  `${fixtureRoot}/invalid/missing-source-packet-verification.json`,
  `${fixtureRoot}/invalid/missing-owner-facing-ja-summary.json`
];

const requiredTopLevel = [
  "schema_version",
  "lane",
  "packet_kind",
  "packet_type",
  "classification",
  "final_status",
  "blocker_count",
  "project_priority",
  "public_version_deferred",
  "local_orchestrator_priority",
  "artifact_packet",
  "source_packet_verification",
  "approval_packet_verification",
  "closeout_packet_verification",
  "next_codex_prompt",
  "handoff",
  "owner_facing_summary",
  "human_decision_point",
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

const falseForbiddenAdvancement = [
  "commit",
  "push",
  "pr",
  "merge",
  "deploy",
  "runtime",
  "note_ollama",
  "api_cloud_auth_billing_trading"
];

const shaPattern = /^[A-Fa-f0-9]{64}$/;
const safePromptOptions = new Set([
  "START_LWF_NOTE_NETWORK_LOCAL_ORCHESTRATOR_IMPLEMENTATION_REVIEW_PACKET",
  "START_LWF_NOTE_NETWORK_LOCAL_ORCHESTRATOR_COMMIT_APPROVAL_PACKET",
  "STOP_AND_WAIT_OWNER_REVIEW"
]);

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
  if (!["SCOUT_HANDOFF", "IMPLEMENTATION_RESULT", "REVIEW_HANDOFF", "CLOSEOUT"].includes(record.packet_kind)) errors.push("packet_kind is invalid");
  if (!["approval", "implementation", "review", "closeout", "handoff"].includes(record.packet_type)) errors.push("packet_type is invalid");
  if (typeof record.classification !== "string" || !record.classification.startsWith("LWF_NOTE_NETWORK_LOCAL_ORCHESTRATOR_")) errors.push("classification is invalid");
  if (typeof record.final_status !== "string" || !/^(SAFE_|READY_|STOP_)/.test(record.final_status)) errors.push("final_status is invalid");
  if (!Number.isInteger(record.blocker_count) || record.blocker_count < 0) errors.push("blocker_count must be a non-negative integer");
  expectConst(record.project_priority, "LOCAL_LWF_NOTE_NETWORK_FIRST", "project_priority", errors);
  expectConst(record.public_version_deferred, true, "public_version_deferred", errors);
  expectConst(record.local_orchestrator_priority, true, "local_orchestrator_priority", errors);
  if (!terminalStates.has(record.terminal_state)) errors.push("terminal_state is invalid");

  const artifact = requireObject(record.artifact_packet, "artifact_packet", errors);
  if (artifact) {
    for (const key of ["manifest_path", "artifact_zip_path", "sha256_sidecar_path", "sha256_json_sidecar_path"]) {
      if (typeof artifact[key] !== "string" || artifact[key].length === 0) errors.push(`artifact_packet.${key} is required`);
    }
    if (typeof artifact.zip_sha256 !== "string" || !shaPattern.test(artifact.zip_sha256)) errors.push("artifact_packet.zip_sha256 must be SHA256");
    expectConst(artifact.manifest_references_artifact, true, "artifact_packet.manifest_references_artifact", errors);
    expectConst(artifact.sidecars_verified, true, "artifact_packet.sidecars_verified", errors);
  }

  validatePacketVerification(record.source_packet_verification, "source_packet_verification", errors);
  validatePacketVerification(record.approval_packet_verification, "approval_packet_verification", errors);

  const closeout = requireObject(record.closeout_packet_verification, "closeout_packet_verification", errors);
  if (closeout) {
    if (typeof closeout.required !== "boolean") errors.push("closeout_packet_verification.required must be boolean");
    if (closeout.required === true && closeout.matched !== true) errors.push("closeout_packet_verification.matched must be true when required");
    if (closeout.required === true) {
      for (const key of ["packet_zip_path", "expected_sha256", "observed_sha256", "final_status"]) {
        if (!(key in closeout)) errors.push(`closeout_packet_verification.${key} is required when closeout verification is required`);
      }
      if ("packet_zip_path" in closeout && (typeof closeout.packet_zip_path !== "string" || closeout.packet_zip_path.length === 0)) {
        errors.push("closeout_packet_verification.packet_zip_path must be non-empty when required");
      }
      for (const key of ["expected_sha256", "observed_sha256"]) {
        if (key in closeout && (typeof closeout[key] !== "string" || !shaPattern.test(closeout[key]))) {
          errors.push(`closeout_packet_verification.${key} must be SHA256 when required`);
        }
      }
      if ("final_status" in closeout && (typeof closeout.final_status !== "string" || closeout.final_status.length === 0)) {
        errors.push("closeout_packet_verification.final_status must be non-empty when required");
      }
    }
    for (const key of ["pr_go", "merge_go", "deploy_go", "runtime_go"]) {
      expectConst(closeout[key], false, `closeout_packet_verification.${key}`, errors);
    }
  }

  const nextPrompt = requireObject(record.next_codex_prompt, "next_codex_prompt", errors);
  if (nextPrompt) {
    if (!safePromptOptions.has(nextPrompt.safe_option)) errors.push("next_codex_prompt.safe_option is unsafe");
    expectConst(nextPrompt.one_action_only, true, "next_codex_prompt.one_action_only", errors);
    const forbiddenAdvancement = requireObject(nextPrompt.forbidden_advancement, "next_codex_prompt.forbidden_advancement", errors);
    if (forbiddenAdvancement) {
      for (const action of falseForbiddenAdvancement) {
        expectConst(forbiddenAdvancement[action], false, `next_codex_prompt.forbidden_advancement.${action}`, errors);
      }
    }
  }

  const handoff = requireObject(record.handoff, "handoff", errors);
  if (handoff) {
    if (!["SCOUT", "IMPLEMENTATION", "REVIEW", "CLOSEOUT"].includes(handoff.phase)) errors.push("handoff.phase is invalid");
    if (!["read-only context", "editable target", "validation-related", "likely file scope"].includes(handoff.scope_label)) errors.push("handoff.scope_label is invalid");
    if (!Array.isArray(handoff.missing_context)) errors.push("handoff.missing_context must be an array");
    const bundle = requireObject(handoff.evidence_bundle, "handoff.evidence_bundle", errors);
    if (bundle) {
      for (const key of ["artifacts", "diffs", "tests", "checksums", "manifests"]) {
        expectConst(bundle[key], true, `handoff.evidence_bundle.${key}`, errors);
      }
    }
    if (!["PASS", "REPAIR", "STOP", "NEXT_BOUNDED_PROMPT"].includes(handoff.reviewer_result)) errors.push("handoff.reviewer_result is invalid");
  }

  const summary = requireObject(record.owner_facing_summary, "owner_facing_summary", errors);
  if (summary) {
    expectConst(summary.language, "ja", "owner_facing_summary.language", errors);
    for (const key of ["changed_files", "purpose_mapping", "test_results", "unknowns", "dangerous_change_status", "one_human_decision_point"]) {
      expectConst(summary[key], true, `owner_facing_summary.${key}`, errors);
    }
  }

  const humanDecision = requireObject(record.human_decision_point, "human_decision_point", errors);
  if (humanDecision) {
    expectConst(humanDecision.required, true, "human_decision_point.required", errors);
    expectConst(humanDecision.one_point_only, true, "human_decision_point.one_point_only", errors);
    if (typeof humanDecision.decision !== "string" || humanDecision.decision.length === 0) errors.push("human_decision_point.decision is required");
  }

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

function validatePacketVerification(value, label, errors) {
  const verification = requireObject(value, label, errors);
  if (!verification) return;
  if (typeof verification.packet_zip_path !== "string" || verification.packet_zip_path.length === 0) errors.push(`${label}.packet_zip_path is required`);
  if (typeof verification.expected_sha256 !== "string" || !shaPattern.test(verification.expected_sha256)) errors.push(`${label}.expected_sha256 must be SHA256`);
  if (typeof verification.observed_sha256 !== "string" || !shaPattern.test(verification.observed_sha256)) errors.push(`${label}.observed_sha256 must be SHA256`);
  expectConst(verification.matched, true, `${label}.matched`, errors);
  if (typeof verification.classification !== "string" || verification.classification.length === 0) errors.push(`${label}.classification is required`);
  if (!Number.isInteger(verification.blocker_count) || verification.blocker_count < 0) errors.push(`${label}.blocker_count must be a non-negative integer`);
}

test("schema declares the required local orchestrator safety fields", () => {
  const schema = readJson(schemaPath);
  for (const key of requiredTopLevel) {
    assert.ok(schema.required.includes(key), `${key} must be schema-required`);
    assert.ok(schema.properties[key], `${key} must be modeled in schema properties`);
  }

  assert.equal(schema.properties.public_version_deferred.const, true);
  assert.equal(schema.properties.local_orchestrator_priority.const, true);
  assert.ok(schema.properties.packet_kind);
  assert.ok(schema.properties.artifact_packet);
  assert.ok(schema.properties.source_packet_verification);
  assert.ok(schema.properties.approval_packet_verification);
  assert.ok(schema.properties.closeout_packet_verification);
  assert.ok(schema.properties.next_codex_prompt);
  assert.ok(schema.properties.handoff);
  assert.ok(schema.properties.owner_facing_summary);
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
  const fullLoop = readJson(`${fixtureRoot}/valid/artifact-manifest-safe-options.json`);

  assert.equal(fullLoop.public_version_deferred, true);
  assert.equal(fullLoop.local_orchestrator_priority, true);
  assert.equal(fullLoop.source_packet_verification.matched, true);
  assert.equal(fullLoop.approval_packet_verification.matched, true);
  assert.equal(fullLoop.owner_facing_summary.language, "ja");
  assert.equal(fullLoop.next_codex_prompt.one_action_only, true);
  assert.equal(fullLoop.next_codex_prompt.forbidden_advancement.commit, false);
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
  assert.equal(invalidFixtures.length, 3);
  assert.equal([...validFixtures, ...invalidFixtures].length, 6);
});

test("unsafe NEXT_CODEX_PROMPT is rejected", () => {
  const errors = validateLocalOrchestrator(readJson(`${fixtureRoot}/invalid/unsafe-next-codex-prompt.json`));
  assert.ok(errors.some((error) => error.includes("next_codex_prompt.safe_option") || error.includes("forbidden_advancement.commit")), errors.join("\n"));
});

test("missing source packet verification is rejected", () => {
  const errors = validateLocalOrchestrator(readJson(`${fixtureRoot}/invalid/missing-source-packet-verification.json`));
  assert.ok(errors.some((error) => error.includes("source_packet_verification")), errors.join("\n"));
});

test("missing owner-facing Japanese summary is rejected", () => {
  const errors = validateLocalOrchestrator(readJson(`${fixtureRoot}/invalid/missing-owner-facing-ja-summary.json`));
  assert.ok(errors.some((error) => error.includes("owner_facing_summary")), errors.join("\n"));
});

test("required closeout verification rejects missing linkage fields", () => {
  for (const key of ["packet_zip_path", "expected_sha256", "observed_sha256", "final_status"]) {
    const record = readJson(`${fixtureRoot}/valid/source-packet-verification-linkage.json`);
    delete record.closeout_packet_verification[key];

    const errors = validateLocalOrchestrator(record);
    assert.ok(
      errors.some((error) => error.includes(`closeout_packet_verification.${key}`)),
      `${key} should be required when closeout verification is required:\n${errors.join("\n")}`
    );
  }
});
