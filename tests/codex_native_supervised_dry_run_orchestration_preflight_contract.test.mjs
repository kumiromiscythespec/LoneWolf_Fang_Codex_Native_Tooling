// BUILD_ID: SUPERVISED_DRY_RUN_ORCHESTRATION_PREFLIGHT_CONTRACTS_20260615
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const BUILD_ID = "SUPERVISED_DRY_RUN_ORCHESTRATION_PREFLIGHT_CONTRACTS_20260615";
const SCHEMA_ID = "lonewolf.codex_native.supervised_dry_run_orchestration_preflight.v1";
const TARGET = "supervised_dry_run_orchestration_preflight_contracts";
const BASELINE = "790576ef031a42e4828e9bf38a81912396d03329";
const NEXT_REVIEW = "START_SUPERVISED_DRY_RUN_ORCHESTRATION_PREFLIGHT_IMPLEMENTATION_REVIEW_PACKET";
const STOP_OWNER_REVIEW_REQUIRED = "STOP_OWNER_REVIEW_REQUIRED";

const schemaPath = "schema/orchestration/codex_native_supervised_dry_run_orchestration_preflight.schema.json";
const docPath = "docs/orchestration/codex_native_supervised_dry_run_orchestration_preflight_contract.md";
const fixtureRoot = "tests/fixtures/codex-native-supervised-dry-run/orchestration-preflight";

const validFixtures = [
  `${fixtureRoot}/valid/preflight_ready_owner_review_required.json`,
  `${fixtureRoot}/valid/preflight_blocked_missing_artifact.json`,
  `${fixtureRoot}/valid/preflight_rejected_forbidden_intent.json`,
  `${fixtureRoot}/valid/preflight_stop_local_metadata_ambiguous.json`
];

const invalidFixtures = [
  `${fixtureRoot}/invalid/preflight_runtime_execution_true.json`,
  `${fixtureRoot}/invalid/preflight_worker_launch_true.json`,
  `${fixtureRoot}/invalid/preflight_queue_mutation_true.json`,
  `${fixtureRoot}/invalid/preflight_missing_human_review_one_point.json`,
  `${fixtureRoot}/invalid/preflight_local_metadata_overclaim.json`,
  `${fixtureRoot}/invalid/preflight_auto_go_from_ready.json`
];

const allowlistedFiles = [
  docPath,
  schemaPath,
  "tests/codex_native_supervised_dry_run_orchestration_preflight_contract.test.mjs",
  ...validFixtures,
  ...invalidFixtures
];

function readText(path) {
  return readFileSync(resolve(repoRoot, path), "utf8");
}

function readJson(path) {
  return JSON.parse(readText(path));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getByPath(value, path) {
  return path.split(".").reduce((cursor, part) => cursor?.[part], value);
}

function setByPath(value, path, newValue) {
  const parts = path.split(".");
  let cursor = value;
  for (const part of parts.slice(0, -1)) {
    cursor = cursor[part];
  }
  cursor[parts.at(-1)] = newValue;
}

function requireBooleanFalseSet(record, key, requiredKeys, errors) {
  const group = record[key];
  if (!group || typeof group !== "object" || Array.isArray(group)) {
    errors.push(`${key} must be an object`);
    return;
  }

  const unexpected = Object.keys(group).filter((field) => !requiredKeys.includes(field));
  if (unexpected.length > 0) {
    errors.push(`${key} unexpected fields: ${unexpected.join(", ")}`);
  }

  for (const field of requiredKeys) {
    if (group[field] !== false) {
      errors.push(`${key}.${field} must be false`);
    }
  }
}

function validateArtifactEvidence(record, key, errors, allowedExtraFields = []) {
  const evidence = record[key];
  const required = [
    "artifact_role",
    "artifact_path",
    "artifact_sha256",
    "artifact_available",
    "sha256_matches_expected",
    "evidence_only",
    "authoritative"
  ];

  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
    errors.push(`${key} must be an artifact evidence object`);
    return false;
  }

  const unexpected = Object.keys(evidence).filter((field) => !required.includes(field) && !allowedExtraFields.includes(field));
  if (unexpected.length > 0) {
    errors.push(`${key} unexpected fields: ${unexpected.join(", ")}`);
  }

  for (const field of required) {
    if (!(field in evidence)) {
      errors.push(`${key}.${field} is required`);
    }
  }

  if (typeof evidence.artifact_role !== "string" || evidence.artifact_role.length === 0) {
    errors.push(`${key}.artifact_role must be non-empty`);
  }
  if (typeof evidence.artifact_path !== "string" || evidence.artifact_path.length === 0) {
    errors.push(`${key}.artifact_path must be non-empty`);
  }
  if (!/^[A-F0-9]{64}$/.test(evidence.artifact_sha256 ?? "")) {
    errors.push(`${key}.artifact_sha256 must be uppercase SHA256`);
  }
  if (typeof evidence.artifact_available !== "boolean") {
    errors.push(`${key}.artifact_available must be boolean`);
  }
  if (typeof evidence.sha256_matches_expected !== "boolean") {
    errors.push(`${key}.sha256_matches_expected must be boolean`);
  }
  if (evidence.evidence_only !== true) {
    errors.push(`${key}.evidence_only must be true`);
  }
  if (typeof evidence.authoritative !== "boolean") {
    errors.push(`${key}.authoritative must be boolean`);
  }

  return evidence.artifact_available === true && evidence.sha256_matches_expected === true;
}

function validatePreflight(record) {
  const errors = [];
  const requiredRoot = [
    "schema",
    "build_id",
    "target",
    "status",
    "current_stable_baseline",
    "preflight_state",
    "stable_closeout_evidence",
    "request_intake_evidence",
    "result_envelope_evidence",
    "readonly_consumer_observation",
    "queue_handoff_review_only_state",
    "no_runtime_proof_bundle",
    "owner_approval_freshness",
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

  for (const field of requiredRoot) {
    if (!(field in record)) {
      errors.push(`${field} is required`);
    }
  }

  const unexpectedRoot = Object.keys(record).filter((field) => !requiredRoot.includes(field));
  if (unexpectedRoot.length > 0) {
    errors.push(`unexpected root fields: ${unexpectedRoot.join(", ")}`);
  }

  if (record.schema !== SCHEMA_ID) errors.push("schema id must match preflight contract");
  if (record.build_id !== BUILD_ID) errors.push("BUILD_ID must match supervised dry-run preflight build");
  if (record.target !== TARGET) errors.push("target must match supervised preflight contracts");
  if (record.current_stable_baseline !== BASELINE) errors.push("current stable baseline must match expected baseline");

  const validStatuses = new Set([
    "OWNER_REVIEW_REQUIRED",
    "BLOCKED_OWNER_REVIEW_REQUIRED",
    "REJECTED_FORBIDDEN_INTENT",
    STOP_OWNER_REVIEW_REQUIRED
  ]);
  const validStates = new Set([
    "READY",
    "BLOCKED_MISSING_ARTIFACT",
    "REJECTED_FORBIDDEN_INTENT",
    STOP_OWNER_REVIEW_REQUIRED
  ]);
  if (!validStatuses.has(record.status)) errors.push("status is not a recognized preflight status");
  if (!validStates.has(record.preflight_state)) errors.push("preflight_state is not recognized");

  const artifactKeys = [
    "stable_closeout_evidence",
    "request_intake_evidence",
    "result_envelope_evidence",
    "readonly_consumer_observation",
    "queue_handoff_review_only_state",
    "no_runtime_proof_bundle"
  ];
  const allArtifactsAvailable = artifactKeys.every((key) => validateArtifactEvidence(
    record,
    key,
    errors,
    key === "request_intake_evidence" ? ["approval_binding_present", "forbidden_intent_detected"] : []
  ));

  if (record.request_intake_evidence?.approval_binding_present !== true) {
    errors.push("request_intake_evidence.approval_binding_present must be true");
  }
  if (typeof record.request_intake_evidence?.forbidden_intent_detected !== "boolean") {
    errors.push("request_intake_evidence.forbidden_intent_detected must be boolean");
  }

  const ownerFreshness = record.owner_approval_freshness ?? {};
  const freshnessKeys = [
    "approval_phrase_present",
    "approval_scope",
    "approval_stale",
    "requires_fresh_owner_gate_before_runtime"
  ];
  for (const field of freshnessKeys) {
    if (!(field in ownerFreshness)) errors.push(`owner_approval_freshness.${field} is required`);
  }
  if (ownerFreshness.requires_fresh_owner_gate_before_runtime !== true) {
    errors.push("owner_approval_freshness.requires_fresh_owner_gate_before_runtime must be true");
  }
  if (!["docs_schema_tests_fixtures_only", "owner_review_required", "forbidden_intent_rejected"].includes(ownerFreshness.approval_scope)) {
    errors.push("owner_approval_freshness.approval_scope is invalid");
  }

  const refs = record.local_refs_referenced ?? {};
  if (!/^[0-9a-f]{40}$/.test(refs.head ?? "")) errors.push("local_refs_referenced.head must be a commit SHA");
  if (!/^[0-9a-f]{40}$/.test(refs.origin_master ?? "")) errors.push("local_refs_referenced.origin_master must be a commit SHA");
  if (!/^[0-9]+ \/ [0-9]+$/.test(refs.ahead_behind ?? "")) errors.push("local_refs_referenced.ahead_behind must be N / N");
  if (refs.source !== "local_metadata_only_no_fetch_no_pull") {
    errors.push("local_refs_referenced.source must disclose local metadata only");
  }

  const localMetadata = record.local_metadata_only_disclosure ?? {};
  if (localMetadata.fetch_performed !== false || localMetadata.pull_performed !== false) {
    errors.push("local metadata disclosure must keep fetch and pull false");
  }
  if (localMetadata.claims_live_remote_truth !== false || localMetadata.independently_fetched_live_remote_truth !== false) {
    errors.push("local metadata overclaim detected");
  }
  if (localMetadata.local_metadata_ambiguous === true && record.preflight_state !== STOP_OWNER_REVIEW_REQUIRED) {
    errors.push("ambiguous local metadata must stop for owner review");
  }
  if (localMetadata.local_metadata_ambiguous === true && localMetadata.ambiguity_requires_stop !== true) {
    errors.push("local metadata ambiguity requires stop flag");
  }

  const progression = record.six_window_progression_safety ?? {};
  if (progression.single_window_owner_gate_required !== true) {
    errors.push("six_window_progression_safety.single_window_owner_gate_required must be true");
  }
  if (progression.implementation_allowed_by_this_packet !== false) {
    errors.push("six_window_progression_safety.implementation_allowed_by_this_packet must be false");
  }
  if (progression.runtime_allowed_by_this_packet !== false) {
    errors.push("six_window_progression_safety.runtime_allowed_by_this_packet must be false");
  }
  if (progression.automatic_go_allowed !== false) {
    errors.push("automatic GO must remain false");
  }

  requireBooleanFalseSet(record, "action_results", [
    "runtime_execution_performed",
    "worker_launch_performed",
    "queue_mutation_performed",
    "cloud_mutation_performed",
    "private_api_performed",
    "openai_api_performed",
    "billing_or_auth_mutation_performed",
    "trading_or_order_action_performed",
    "daemon_or_watcher_started",
    "ui_automation_performed",
    "automatic_continuation_performed"
  ], errors);

  requireBooleanFalseSet(record, "forbidden_action_flags", [
    "deploy_intent_present",
    "runtime_intent_present",
    "worker_launch_intent_present",
    "queue_mutation_intent_present",
    "private_api_intent_present",
    "openai_api_intent_present",
    "cloud_mutation_intent_present",
    "billing_or_auth_intent_present",
    "trading_or_order_intent_present",
    "automatic_go_intent_present"
  ], errors);

  if (!Array.isArray(record.blocker_matrix) || record.blocker_matrix.length === 0) {
    errors.push("blocker_matrix must contain at least one row");
  } else {
    for (const [index, row] of record.blocker_matrix.entries()) {
      if (!row || typeof row !== "object" || Array.isArray(row)) {
        errors.push(`blocker_matrix[${index}] must be object`);
        continue;
      }
      for (const field of ["blocker", "status", "resolution"]) {
        if (typeof row[field] !== "string" || row[field].length === 0) {
          errors.push(`blocker_matrix[${index}].${field} must be non-empty`);
        }
      }
      if (!["PASS", "BLOCKED", "OWNER_REVIEW_REQUIRED"].includes(row.status)) {
        errors.push(`blocker_matrix[${index}].status is invalid`);
      }
    }
  }

  const blockedRows = Array.isArray(record.blocker_matrix)
    ? record.blocker_matrix.filter((row) => row.status === "BLOCKED")
    : [];

  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length < 20) {
    errors.push("human_review_one_point must be present and specific");
  }

  const next = record.next_prompt_readiness ?? {};
  if (![NEXT_REVIEW, "WAIT_FOR_OWNER_REVIEW", STOP_OWNER_REVIEW_REQUIRED].includes(next.recommended_next_action)) {
    errors.push("next_prompt_readiness.recommended_next_action is invalid");
  }
  for (const flag of ["ready_is_go", "matched_is_go", "observed_safe_no_action_is_go", "auto_continue", "execution_allowed"]) {
    if (next[flag] !== false) {
      errors.push(`next_prompt_readiness.${flag} must be false`);
    }
  }

  if (!Array.isArray(record.safety_invariants) || record.safety_invariants.length < 8) {
    errors.push("safety_invariants must list the preserved safety boundary");
  }

  if (record.preflight_state === "READY") {
    if (record.status !== "OWNER_REVIEW_REQUIRED") errors.push("READY preflight must remain owner review required");
    if (!allArtifactsAvailable) errors.push("READY preflight requires every artifact to be available and checksum matched");
    if (record.request_intake_evidence?.forbidden_intent_detected !== false) {
      errors.push("READY preflight cannot contain forbidden request intent");
    }
    if (blockedRows.length > 0) errors.push("READY preflight cannot carry BLOCKED rows");
    if (next.recommended_next_action !== NEXT_REVIEW) errors.push("READY preflight next action must be implementation review packet");
  }

  if (record.preflight_state === "BLOCKED_MISSING_ARTIFACT") {
    if (record.status !== "BLOCKED_OWNER_REVIEW_REQUIRED") errors.push("missing artifact state must be blocked owner review required");
    if (allArtifactsAvailable) errors.push("missing artifact state must identify unavailable or unmatched evidence");
    if (blockedRows.length === 0) errors.push("missing artifact state requires a BLOCKED row");
  }

  if (record.preflight_state === "REJECTED_FORBIDDEN_INTENT") {
    if (record.status !== "REJECTED_FORBIDDEN_INTENT") errors.push("forbidden request intent status mismatch");
    if (record.request_intake_evidence?.forbidden_intent_detected !== true) {
      errors.push("forbidden request intent state requires forbidden intent evidence");
    }
    if (next.recommended_next_action !== STOP_OWNER_REVIEW_REQUIRED) {
      errors.push("forbidden request intent must stop for owner review");
    }
  }

  if (record.preflight_state === STOP_OWNER_REVIEW_REQUIRED) {
    if (record.status !== STOP_OWNER_REVIEW_REQUIRED) errors.push("stop state status mismatch");
    if (next.recommended_next_action !== STOP_OWNER_REVIEW_REQUIRED) {
      errors.push("stop state must recommend owner review stop");
    }
  }

  return errors;
}

test("allowlist contains exactly the supervised dry-run preflight contract files", () => {
  assert.equal(allowlistedFiles.length, 13);
  assert.equal(validFixtures.length, 4);
  assert.equal(invalidFixtures.length, 6);
  assert.equal(allowlistedFiles.filter((path) => path.endsWith(".md")).length, 1);
  assert.equal(allowlistedFiles.filter((path) => path.endsWith(".schema.json")).length, 1);
  assert.equal(allowlistedFiles.filter((path) => path.endsWith(".test.mjs")).length, 1);
  assert.equal(allowlistedFiles.filter((path) => path.includes("/fixtures/")).length, 10);

  for (const path of allowlistedFiles) {
    assert.doesNotThrow(() => readText(path), `${path} should exist`);
  }
});

test("schema pins build, baseline, states, false-only action flags, and no automatic GO", () => {
  const schema = readJson(schemaPath);

  assert.equal(schema.$id, SCHEMA_ID);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.current_stable_baseline.const, BASELINE);
  assert.deepEqual(schema.properties.preflight_state.enum, [
    "READY",
    "BLOCKED_MISSING_ARTIFACT",
    "REJECTED_FORBIDDEN_INTENT",
    STOP_OWNER_REVIEW_REQUIRED
  ]);
  assert.equal(schema.properties.next_prompt_readiness.properties.ready_is_go.const, false);
  assert.equal(schema.properties.next_prompt_readiness.properties.matched_is_go.const, false);
  assert.equal(schema.properties.next_prompt_readiness.properties.observed_safe_no_action_is_go.const, false);
  assert.equal(schema.properties.next_prompt_readiness.properties.auto_continue.const, false);
  assert.equal(schema.properties.next_prompt_readiness.properties.execution_allowed.const, false);

  for (const [field, definition] of Object.entries(schema.$defs.action_results.properties)) {
    assert.equal(definition.const, false, `action_results.${field} must be const false`);
  }
  for (const [field, definition] of Object.entries(schema.$defs.forbidden_action_flags.properties)) {
    assert.equal(definition.const, false, `forbidden_action_flags.${field} must be const false`);
  }
});

test("documentation states the static owner-review boundary", () => {
  const doc = readText(docPath);

  assert.match(doc, new RegExp(`BUILD_ID: ${BUILD_ID}`));
  assert.match(doc, /docs\/schema\/tests\/fixtures-only contract/);
  assert.match(doc, /does not execute a dry run, launch a worker, mutate a queue/);
  assert.match(doc, /`READY` means ready for owner review only/);
  assert.match(doc, /not a GO signal/);
  assert.match(doc, /must not claim live remote truth/);
  assert.match(doc, new RegExp(NEXT_REVIEW));
});

test("valid fixtures satisfy supervised dry-run orchestration preflight semantics", () => {
  for (const path of validFixtures) {
    const record = readJson(path);
    assert.equal(record.build_id, BUILD_ID, `${path} should carry BUILD_ID`);

    const errors = validatePreflight(record);
    assert.deepEqual(errors, [], `${path} should be valid:\n${errors.join("\n")}`);
  }
});

test("invalid mutation fixtures fail for their expected safety reason", () => {
  for (const path of invalidFixtures) {
    const mutationFixture = readJson(path);
    assert.equal(mutationFixture.build_id, BUILD_ID, `${path} should carry BUILD_ID`);
    assert.equal(mutationFixture.expected_valid, false);
    assert.equal(typeof mutationFixture.expected_error, "string");

    const record = readJson(`${fixtureRoot}/valid/${mutationFixture.base_fixture}`);
    const mutated = clone(record);
    setByPath(mutated, mutationFixture.mutation.path, mutationFixture.mutation.value);

    if (mutationFixture.secondary_mutation) {
      setByPath(mutated, mutationFixture.secondary_mutation.path, mutationFixture.secondary_mutation.value);
    }

    assert.equal(getByPath(mutated, mutationFixture.mutation.path), mutationFixture.mutation.value);
    const errors = validatePreflight(mutated);

    assert.notEqual(errors.length, 0, `${path} must be invalid`);
    assert.match(errors.join("\n"), new RegExp(mutationFixture.expected_error), `${path} should fail for expected reason`);
  }
});
