// BUILD_ID: NEXT_PROMPT_READINESS_CHAIN_CONTRACTS_20260615
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const BUILD_ID = "NEXT_PROMPT_READINESS_CHAIN_CONTRACTS_20260615";
const TARGET = "next_prompt_readiness_chain_contracts";
const BASELINE = "546301451af87141e29a07bedf155914f4e9c4be";
const SCHEMA_ID = "lonewolf.codex_native.next_prompt_readiness_chain.v1";
const OWNER_PHRASE =
  "APPROVE_NEXT_PROMPT_READINESS_CHAIN_CONTRACTS_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION";

const schemaPath = "schema/orchestration/codex_native_next_prompt_readiness_chain.schema.json";
const docPath = "docs/orchestration/codex_native_next_prompt_readiness_chain_contract.md";
const fixtureRoot =
  "tests/fixtures/codex-native-supervised-dry-run/next-prompt-readiness-chain";

const validFixtures = [
  "valid/stable_closeout_to_planning_only.json",
  "valid/planning_to_implementation_approval_packet_only.json",
  "valid/blocked_owner_review_required.json"
];

const invalidFixtures = new Map([
  ["invalid/direct_implementation_recommended.json", "direct implementation"],
  ["invalid/auto_continue_true.json", "auto_continue"],
  ["invalid/runtime_or_queue_next_action.json", "runtime or queue"],
  ["invalid/fetch_pull_without_owner_gate.json", "fetch pull"],
  ["invalid/missing_local_metadata_disclosure.json", "missing local metadata disclosure"],
  ["invalid/missing_human_review_one_point.json", "missing human_review_one_point"]
]);

const allowlistedFiles = [
  docPath,
  schemaPath,
  "tests/codex_native_next_prompt_readiness_chain_contract.test.mjs",
  ...validFixtures.map((fixture) => path.posix.join(fixtureRoot, fixture)),
  ...Array.from(invalidFixtures.keys()).map((fixture) => path.posix.join(fixtureRoot, fixture))
];

function readText(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

const schema = readJson(schemaPath);

const safeNextActions = new Set(
  schema.properties.allowed_next_actions.items.enum
);
const requiredRootFields = new Set(schema.required);
const allowedRootFields = new Set(Object.keys(schema.properties));
const nextPromptRequired = schema.$defs.next_prompt.required;
const forbiddenFlagNames = schema.$defs.forbidden_action_flags.required;
const safetyInvariantNames = schema.$defs.safety_invariants.required;

function expectFalse(value, name, errors) {
  if (value !== false) {
    errors.push(`${name} must be false`);
  }
}

function expectTrue(value, name, errors) {
  if (value !== true) {
    errors.push(`${name} must be true`);
  }
}

function validateReadinessRecord(record) {
  const errors = [];

  for (const field of requiredRootFields) {
    if (!(field in record)) {
      errors.push(`missing ${field}`);
    }
  }

  for (const field of Object.keys(record)) {
    if (!allowedRootFields.has(field)) {
      errors.push(`unexpected field ${field}`);
    }
  }

  if (record.schema !== SCHEMA_ID) {
    errors.push("wrong schema");
  }
  if (record.build_id !== BUILD_ID) {
    errors.push("wrong build_id");
  }
  if (record.target !== TARGET) {
    errors.push("wrong target");
  }
  if (record.current_stable_baseline !== BASELINE) {
    errors.push("wrong baseline");
  }
  if (!schema.properties.status.enum.includes(record.status)) {
    errors.push("bad status");
  }
  if (!schema.properties.transition_state.enum.includes(record.transition_state)) {
    errors.push("bad transition_state");
  }
  if (!schema.properties.next_action_class.enum.includes(record.next_action_class)) {
    errors.push("bad next_action_class");
  }

  if (!record.current_packet || record.current_packet.artifact_is_evidence_only !== true) {
    errors.push("current packet must be evidence only");
  }

  const nextPrompt = record.next_prompt ?? {};
  for (const field of nextPromptRequired) {
    if (!(field in nextPrompt)) {
      errors.push(`missing next_prompt.${field}`);
    }
  }

  if (!safeNextActions.has(nextPrompt.recommended_next_action)) {
    errors.push("bad recommended next action");
  }
  if (record.allowed_next_actions?.includes(nextPrompt.recommended_next_action) !== true) {
    errors.push("recommended action must be allowlisted");
  }
  if (nextPrompt.instruction_artifact_only !== true) {
    errors.push("next prompt must be instruction artifact only");
  }
  expectFalse(nextPrompt.executor, "next_prompt.executor", errors);
  if (nextPrompt.recommends_direct_implementation !== false) {
    errors.push("direct implementation is forbidden");
  }
  if (
    nextPrompt.recommends_runtime_workflow !== false ||
    nextPrompt.recommends_worker_launch !== false ||
    nextPrompt.recommends_queue_mutation !== false
  ) {
    errors.push("runtime or queue next action is forbidden");
  }
  if (nextPrompt.recommends_fetch !== false || nextPrompt.recommends_pull !== false) {
    errors.push("fetch pull next action is forbidden");
  }

  for (const field of [
    "recommends_stage",
    "recommends_commit",
    "recommends_push",
    "recommends_deploy",
    "recommends_cloud_mutation",
    "recommends_private_api",
    "recommends_openai_api",
    "recommends_billing_auth_mutation",
    "recommends_trading_order_action",
    "recommends_cleanup",
    "recommends_history_rewrite",
    "ready_is_go",
    "matched_is_go",
    "observed_safe_no_action_is_go"
  ]) {
    expectFalse(nextPrompt[field], `next_prompt.${field}`, errors);
  }

  const ownerGate = record.owner_gate ?? {};
  expectTrue(
    ownerGate.exact_owner_approval_required_for_implementation,
    "owner_gate.exact_owner_approval_required_for_implementation",
    errors
  );
  if (ownerGate.owner_approval_phrase_required !== OWNER_PHRASE) {
    errors.push("wrong owner approval phrase");
  }
  expectTrue(
    ownerGate.implementation_approval_packet_required,
    "owner_gate.implementation_approval_packet_required",
    errors
  );
  expectTrue(ownerGate.commit_approval_separate, "owner_gate.commit_approval_separate", errors);
  expectTrue(ownerGate.push_approval_separate, "owner_gate.push_approval_separate", errors);
  expectFalse(ownerGate.fetch_pull_owner_gate_present, "owner_gate.fetch_pull_owner_gate_present", errors);
  if (ownerGate.ambiguity_result !== "STOP_OWNER_REVIEW_REQUIRED") {
    errors.push("wrong ambiguity result");
  }

  expectFalse(record.auto_continue, "auto_continue", errors);

  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length < 12) {
    errors.push("missing human_review_one_point");
  }

  if (!Array.isArray(record.blocker_matrix)) {
    errors.push("blocker_matrix must be an array");
  }
  if (
    record.transition_state === "BLOCKED_OWNER_REVIEW_REQUIRED" &&
    (!Array.isArray(record.blocker_matrix) || record.blocker_matrix.length === 0)
  ) {
    errors.push("blocked records require blocker_matrix detail");
  }

  if (record.local_refs_referenced === true && !record.local_metadata_only_disclosure) {
    errors.push("missing local metadata disclosure");
  }

  if (record.local_metadata_only_disclosure) {
    const disclosure = record.local_metadata_only_disclosure;
    expectTrue(
      disclosure.origin_master_local_metadata_only,
      "local_metadata_only_disclosure.origin_master_local_metadata_only",
      errors
    );
    expectTrue(
      disclosure.ahead_behind_local_metadata_only,
      "local_metadata_only_disclosure.ahead_behind_local_metadata_only",
      errors
    );
    expectFalse(
      disclosure.independently_fetched_live_remote_truth,
      "local_metadata_only_disclosure.independently_fetched_live_remote_truth",
      errors
    );
    expectFalse(disclosure.fetch_performed, "local_metadata_only_disclosure.fetch_performed", errors);
    expectFalse(disclosure.pull_performed, "local_metadata_only_disclosure.pull_performed", errors);
    expectTrue(
      disclosure.fetch_pull_requires_future_owner_gate,
      "local_metadata_only_disclosure.fetch_pull_requires_future_owner_gate",
      errors
    );
  }

  for (const action of record.allowed_next_actions ?? []) {
    if (!safeNextActions.has(action)) {
      errors.push("unsafe allowed next action");
    }
  }

  for (const field of forbiddenFlagNames) {
    expectFalse(record.forbidden_action_flags?.[field], `forbidden_action_flags.${field}`, errors);
  }
  if (
    record.forbidden_action_flags?.runtime_workflow_recommended !== false ||
    record.forbidden_action_flags?.queue_mutation_recommended !== false
  ) {
    errors.push("runtime or queue forbidden flag must remain false");
  }

  for (const field of safetyInvariantNames) {
    expectTrue(record.safety_invariants?.[field], `safety_invariants.${field}`, errors);
  }

  return errors;
}

test("schema pins the next prompt readiness chain build and safety boundary", () => {
  assert.equal(schema.$id, SCHEMA_ID);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.current_stable_baseline.const, BASELINE);
  assert.equal(schema.properties.auto_continue.const, false);
  assert.deepEqual(schema.allOf[0].then.required, ["local_metadata_only_disclosure"]);
  assert.equal(
    schema.$defs.owner_gate.properties.owner_approval_phrase_required.const,
    OWNER_PHRASE
  );
});

test("valid fixtures preserve bounded next-prompt transitions", () => {
  for (const fixture of validFixtures) {
    const record = readJson(path.posix.join(fixtureRoot, fixture));
    assert.deepEqual(validateReadinessRecord(record), [], fixture);
  }

  const stable = readJson(path.posix.join(fixtureRoot, validFixtures[0]));
  assert.equal(stable.next_action_class, "PLANNING_PACKET_ONLY");
  assert.equal(
    stable.next_prompt.recommended_next_action,
    "START_NEXT_SAFE_PARALLEL_WAVE_PLANNING_PACKET"
  );

  const approval = readJson(path.posix.join(fixtureRoot, validFixtures[1]));
  assert.equal(approval.next_action_class, "IMPLEMENTATION_APPROVAL_PACKET_ONLY");
  assert.equal(
    approval.next_prompt.recommended_next_action,
    "START_SELECTED_NEXT_TARGET_IMPLEMENTATION_APPROVAL_PACKET"
  );

  const blocked = readJson(path.posix.join(fixtureRoot, validFixtures[2]));
  assert.equal(blocked.status, "STOP_OWNER_REVIEW_REQUIRED");
  assert.ok(blocked.blocker_matrix.length > 0);
});

test("invalid fixtures are rejected for the expected safety reason", () => {
  for (const [fixture, expected] of invalidFixtures) {
    const record = readJson(path.posix.join(fixtureRoot, fixture));
    const errors = validateReadinessRecord(record).join("\n");
    assert.match(errors, new RegExp(expected, "i"), fixture);
  }
});

test("docs describe instruction-artifact-only next-prompt readiness", () => {
  const docs = readText(docPath);
  assert.ok(docs.startsWith(`<!-- BUILD_ID: ${BUILD_ID} -->`));
  assert.match(docs, /instruction-artifact-only/i);
  assert.match(docs, /STABLE_CLOSEOUT_TO_PLANNING_ONLY/);
  assert.match(docs, /PLANNING_TO_IMPLEMENTATION_APPROVAL_PACKET_ONLY/);
  assert.match(docs, /READY[\s\S]*MATCHED[\s\S]*OBSERVED_SAFE_NO_ACTION[\s\S]*GO/i);
  assert.match(docs, /fetch and pull require a future explicit owner gate/i);
  assert.match(docs, /does not implement[\s\S]*runner[\s\S]*queue/i);
});

test("the implementation remains inside the exact docs schema tests fixtures allowlist", () => {
  for (const relativePath of allowlistedFiles) {
    assert.match(readText(relativePath), new RegExp(BUILD_ID), relativePath);
  }
  assert.equal(allowlistedFiles.length, 12);
  assert.equal(validFixtures.length, 3);
  assert.equal(invalidFixtures.size, 6);
});
