import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

const requiredStates = [
  "PAUSED_NO_CREDITS",
  "READY_FOR_TRIAGE",
  "TASK_SELECTED",
  "MICRO_SPEC_READY",
  "CODEX_PROMPT_READY",
  "CODEX_RUNNING",
  "RESULT_REVIEW_REQUIRED",
  "BASELINE_ACCEPTED",
  "REPAIR_REQUIRED",
  "REJECTED_FOR_SAFETY",
  "STOP_OWNER_REVIEW_REQUIRED",
  "PAUSED_OWNER_DECISION_REQUIRED"
];

for (const fixture of [
  "tests/fixtures/codex_native_closed_loop/valid_state_ready_for_triage.json",
  "tests/fixtures/codex_native_closed_loop/valid_state_result_review_required.json",
  "codex_native_closed_loop/state.example.json"
]) {
  const state = readJson(fixture);
  assert.equal(state.worker_launch_allowed, false, `${fixture} must not allow worker launch`);
  assert.equal(state.real_orchestration_allowed, false, `${fixture} must not allow real orchestration`);
  assert.equal(state.prompt_sending_allowed, false, `${fixture} must not allow prompt sending`);
  assert.equal(state.runtime_execution_allowed, false, `${fixture} must not allow runtime execution`);
  assert.ok(Array.isArray(state.allowed_next_states), `${fixture} must define allowed_next_states`);
  assert.ok(Array.isArray(state.evidence_refs), `${fixture} must define evidence_refs`);
}

const stateExample = readJson("codex_native_closed_loop/state.example.json");
const definedStates = new Set(stateExample.state_definitions.map((item) => item.state));
for (const state of requiredStates) {
  assert.ok(definedStates.has(state), `state.example.json is missing ${state}`);
}

for (const definition of stateExample.state_definitions) {
  for (const field of [
    "purpose",
    "allowed_events",
    "forbidden_events",
    "required_evidence",
    "owner_review_required",
    "next_possible_states",
    "safety_notes"
  ]) {
    assert.ok(Object.hasOwn(definition, field), `${definition.state} missing ${field}`);
  }
}

assert.equal(stateExample.safety_invariants.worker_session_close_required_after_review_handoff, true);
assert.equal(stateExample.safety_invariants.no_next_worker_until_previous_worker_closed, true);
assert.equal(stateExample.safety_invariants.previous_worker_retired_must_be_true_before_START_NEXT_IMPLEMENTER, true);
assert.equal(stateExample.safety_invariants.max_open_implementer_sessions_per_lane, 1);
assert.equal(stateExample.safety_invariants.max_open_reviewer_sessions_per_lane, 1);
assert.equal(stateExample.safety_invariants.max_total_open_worker_sessions_initial, 2);
assert.equal(stateExample.safety_invariants.v0_1_is_one_lane_only, true);
assert.equal(stateExample.safety_invariants.missing_close_or_retire_confirmation_next_state, "STOP_OWNER_REVIEW_REQUIRED");

console.log("state_machine_static_contract: ok");
