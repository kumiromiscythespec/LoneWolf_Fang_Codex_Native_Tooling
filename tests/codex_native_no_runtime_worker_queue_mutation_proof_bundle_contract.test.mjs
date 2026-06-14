// BUILD_ID: NO_RUNTIME_WORKER_QUEUE_MUTATION_PROOF_BUNDLE_CONTRACTS_20260615
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const BUILD_ID = "NO_RUNTIME_WORKER_QUEUE_MUTATION_PROOF_BUNDLE_CONTRACTS_20260615";
const TARGET = "no_runtime_worker_queue_mutation_proof_bundle_contracts";
const BASELINE = "01c0217a89ae67f9cf9d6775f5586500d575b396";
const SCHEMA_ID =
  "lonewolf.codex_native.no_runtime_worker_queue_mutation_proof_bundle.v1";

const schemaPath =
  "schema/orchestration/codex_native_no_runtime_worker_queue_mutation_proof_bundle.schema.json";
const docPath =
  "docs/orchestration/codex_native_no_runtime_worker_queue_mutation_proof_bundle_contract.md";
const fixtureRoot =
  "tests/fixtures/codex-native-supervised-dry-run/no-runtime-worker-queue-mutation-proof-bundle";

const validFixtures = [
  "valid/proof_bundle_all_clear.json",
  "valid/proof_bundle_owner_review_required.json",
  "valid/proof_bundle_blocked_ambiguous_evidence.json"
];

const invalidFixtures = new Map([
  ["invalid/runtime_performed_true.json", "runtime"],
  ["invalid/worker_launch_true.json", "worker"],
  ["invalid/queue_mutation_true.json", "queue"],
  ["invalid/cloud_api_billing_trading_true.json", "cloud|api|billing|trading"],
  ["invalid/missing_human_review_one_point.json", "human_review_one_point"],
  ["invalid/local_metadata_overclaim.json", "local metadata overclaim"]
]);

const allowlistedFiles = [
  docPath,
  schemaPath,
  "tests/codex_native_no_runtime_worker_queue_mutation_proof_bundle_contract.test.mjs",
  ...validFixtures.map((fixture) => path.posix.join(fixtureRoot, fixture)),
  ...Array.from(invalidFixtures.keys()).map((fixture) =>
    path.posix.join(fixtureRoot, fixture)
  )
];

function readText(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

const schema = readJson(schemaPath);

const requiredRootFields = new Set(schema.required);
const allowedRootFields = new Set(Object.keys(schema.properties));
const noEvidenceFields = [
  "no_runtime_execution",
  "no_worker_launch",
  "no_daemon_watcher",
  "no_ui_automation",
  "no_queue_mutation",
  "no_cloud_mutation",
  "no_private_api",
  "no_openai_api",
  "no_billing_auth_mutation",
  "no_trading_or_order_action"
];
const actionResultFields = schema.$defs.action_results.required;
const forbiddenFlagFields = schema.$defs.forbidden_action_flags.required;
const safetyInvariantFields = schema.$defs.safety_invariants.required;
const safeNextActions = new Set(
  schema.$defs.next_prompt_readiness.properties.recommended_next_action.enum
);

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

function validateProofBundle(record) {
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
  if (!schema.properties.proof_bundle_state.enum.includes(record.proof_bundle_state)) {
    errors.push("bad proof_bundle_state");
  }

  for (const field of noEvidenceFields) {
    expectTrue(record[field], field, errors);
  }

  for (const field of actionResultFields) {
    expectFalse(record.action_results?.[field], `action_results.${field}`, errors);
  }

  for (const field of forbiddenFlagFields) {
    expectFalse(
      record.forbidden_action_flags?.[field],
      `forbidden_action_flags.${field}`,
      errors
    );
  }

  if (!Array.isArray(record.packet_chain) || record.packet_chain.length === 0) {
    errors.push("packet_chain must be present");
  }
  for (const [index, packet] of (record.packet_chain ?? []).entries()) {
    if (packet.artifact_is_evidence_only !== true) {
      errors.push(`packet_chain.${index} artifact must be evidence only`);
    }
    if (!/^[A-Fa-f0-9]{64}$/.test(packet.artifact_sha256 ?? "")) {
      errors.push(`packet_chain.${index} artifact sha must be sha256`);
    }
  }

  const evidenceScope = record.evidence_scope ?? {};
  expectTrue(
    evidenceScope.static_evidence_bundle_only,
    "evidence_scope.static_evidence_bundle_only",
    errors
  );
  expectTrue(evidenceScope.synthetic_fixtures_only, "evidence_scope.synthetic_fixtures_only", errors);
  for (const field of [
    "runtime_executor",
    "worker_launcher",
    "queue_producer",
    "queue_consumer",
    "network_required",
    "secret_required"
  ]) {
    expectFalse(evidenceScope[field], `evidence_scope.${field}`, errors);
  }

  const localDisclosure = record.local_metadata_only_disclosure ?? {};
  if (record.local_refs_referenced !== true) {
    errors.push("local_refs_referenced must be true for local metadata disclosure");
  }
  expectTrue(
    localDisclosure.origin_master_local_metadata_only,
    "local_metadata_only_disclosure.origin_master_local_metadata_only",
    errors
  );
  expectTrue(
    localDisclosure.ahead_behind_local_metadata_only,
    "local_metadata_only_disclosure.ahead_behind_local_metadata_only",
    errors
  );
  if (localDisclosure.independently_fetched_live_remote_truth !== false) {
    errors.push("local metadata overclaim");
  }
  expectFalse(localDisclosure.fetch_performed, "local_metadata_only_disclosure.fetch_performed", errors);
  expectFalse(localDisclosure.pull_performed, "local_metadata_only_disclosure.pull_performed", errors);
  expectTrue(
    localDisclosure.fetch_pull_requires_future_owner_gate,
    "local_metadata_only_disclosure.fetch_pull_requires_future_owner_gate",
    errors
  );

  const progression = record.six_window_progression_safety ?? {};
  expectTrue(progression.operating_pattern_only, "six_window.operating_pattern_only", errors);
  expectFalse(progression.gate_bypass_allowed, "six_window.gate_bypass_allowed", errors);
  expectTrue(progression.owner_gate_required, "six_window.owner_gate_required", errors);
  expectFalse(
    progression.automatic_continuation_allowed,
    "six_window.automatic_continuation_allowed",
    errors
  );

  const nextPrompt = record.next_prompt_readiness ?? {};
  expectFalse(nextPrompt.ready_is_go, "next_prompt_readiness.ready_is_go", errors);
  expectFalse(nextPrompt.matched_is_go, "next_prompt_readiness.matched_is_go", errors);
  expectFalse(
    nextPrompt.observed_safe_no_action_is_go,
    "next_prompt_readiness.observed_safe_no_action_is_go",
    errors
  );
  if (!safeNextActions.has(nextPrompt.recommended_next_action)) {
    errors.push("bad recommended next action");
  }
  expectTrue(
    nextPrompt.instruction_artifact_only,
    "next_prompt_readiness.instruction_artifact_only",
    errors
  );
  expectFalse(nextPrompt.executor, "next_prompt_readiness.executor", errors);

  if (
    typeof record.human_review_one_point !== "string" ||
    record.human_review_one_point.length < 12
  ) {
    errors.push("missing human_review_one_point");
  }

  if (!Array.isArray(record.blocker_matrix)) {
    errors.push("blocker_matrix must be an array");
  }
  if (Array.isArray(record.blocker_matrix) && record.blocker_matrix.length === 0) {
    errors.push("blocker_matrix is required");
  }
  if (
    record.proof_bundle_state === "BLOCKED_AMBIGUOUS_EVIDENCE" &&
    record.status !== "STOP_OWNER_REVIEW_REQUIRED"
  ) {
    errors.push("ambiguous evidence must stop owner review");
  }

  for (const field of safetyInvariantFields) {
    const expected = field === "automatic_go_allowed" ? false : true;
    if (record.safety_invariants?.[field] !== expected) {
      errors.push(`safety_invariants.${field} must be ${expected}`);
    }
  }

  return errors;
}

test("schema pins the proof bundle build and false-only safety boundary", () => {
  assert.equal(schema.$id, SCHEMA_ID);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.current_stable_baseline.const, BASELINE);
  assert.equal(schema.properties.no_runtime_execution.const, true);
  assert.equal(schema.$defs.action_results.properties.runtime_performed.const, false);
  assert.equal(schema.$defs.action_results.properties.worker_launch_performed.const, false);
  assert.equal(schema.$defs.action_results.properties.queue_mutation_performed.const, false);
  assert.equal(schema.$defs.forbidden_action_flags.properties.automatic_continuation_allowed.const, false);
});

test("valid proof bundle fixtures are evidence only and never executors", () => {
  for (const fixture of validFixtures) {
    const record = readJson(path.posix.join(fixtureRoot, fixture));
    assert.deepEqual(validateProofBundle(record), [], fixture);
  }

  const allClear = readJson(path.posix.join(fixtureRoot, validFixtures[0]));
  assert.equal(allClear.proof_bundle_state, "ALL_CLEAR");
  assert.equal(
    allClear.next_prompt_readiness.recommended_next_action,
    "START_IMPLEMENTATION_REVIEW_PACKET"
  );

  const ownerReview = readJson(path.posix.join(fixtureRoot, validFixtures[1]));
  assert.equal(ownerReview.status, "OWNER_REVIEW_REQUIRED");
  assert.equal(ownerReview.next_prompt_readiness.recommended_next_action, "WAIT_FOR_OWNER_REVIEW");

  const blocked = readJson(path.posix.join(fixtureRoot, validFixtures[2]));
  assert.equal(blocked.status, "STOP_OWNER_REVIEW_REQUIRED");
  assert.equal(blocked.proof_bundle_state, "BLOCKED_AMBIGUOUS_EVIDENCE");
});

test("invalid proof bundle fixtures fail closed for the expected reason", () => {
  for (const [fixture, expected] of invalidFixtures) {
    const record = readJson(path.posix.join(fixtureRoot, fixture));
    const errors = validateProofBundle(record).join("\n");
    assert.match(errors, new RegExp(expected, "i"), fixture);
  }
});

test("docs explain no-runtime, local metadata, and READY-is-not-GO boundaries", () => {
  const docs = readText(docPath);
  assert.ok(docs.startsWith(`<!-- BUILD_ID: ${BUILD_ID} -->`));
  assert.match(docs, /review evidence only/i);
  assert.match(docs, /never an executor/i);
  assert.match(docs, /Queue mutation/i);
  assert.match(docs, /independently fetched live remote truth/i);
  assert.match(docs, /READY is not GO/i);
  assert.match(docs, /MATCHED is not GO/i);
  assert.match(docs, /OBSERVED_SAFE_NO_ACTION is not GO/i);
  assert.match(docs, /STOP_OWNER_REVIEW_REQUIRED/i);
  assert.match(docs, /no fetch\/pull\/deploy\/runtime\/Queue\/cloud\/API\/billing\/auth\/trading mutation/i);
});

test("the implementation remains inside the exact docs schema tests fixtures allowlist", () => {
  for (const relativePath of allowlistedFiles) {
    assert.match(readText(relativePath), new RegExp(BUILD_ID), relativePath);
  }
  assert.equal(allowlistedFiles.length, 12);
  assert.equal(validFixtures.length, 3);
  assert.equal(invalidFixtures.size, 6);
});
