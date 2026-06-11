import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

const table = readJson("tests/fixtures/codex_native_closed_loop/valid_transition_table_minimal.json");
assert.ok(Array.isArray(table.valid_transitions), "valid transition table must list transitions");

const requiredEdges = [
  ["PAUSED_NO_CREDITS", "credits_reset", "READY_FOR_TRIAGE"],
  ["READY_FOR_TRIAGE", "chatgpt_reviews_context", "TASK_SELECTED"],
  ["TASK_SELECTED", "micro_task_defined", "MICRO_SPEC_READY"],
  ["MICRO_SPEC_READY", "prompt_generated", "CODEX_PROMPT_READY"],
  ["CODEX_PROMPT_READY", "owner_pastes_to_codex_or_bridge_dry_run_prepared", "CODEX_RUNNING"],
  ["CODEX_RUNNING", "codex_finished", "RESULT_REVIEW_REQUIRED"],
  ["RESULT_REVIEW_REQUIRED", "tests_pass_and_scope_ok", "BASELINE_ACCEPTED"],
  ["BASELINE_ACCEPTED", "next_task_exists", "READY_FOR_TRIAGE"],
  ["CODEX_RUNNING", "tests_failed", "REPAIR_REQUIRED"],
  ["CODEX_RUNNING", "forbidden_file_touched", "REJECTED_FOR_SAFETY"],
  ["RESULT_REVIEW_REQUIRED", "unclear_result", "STOP_OWNER_REVIEW_REQUIRED"],
  ["READY_FOR_TRIAGE", "no_safe_task", "PAUSED_OWNER_DECISION_REQUIRED"]
];

for (const [from, event, to] of requiredEdges) {
  assert.ok(
    table.valid_transitions.some((transition) => transition.from === from && transition.event.type === event && transition.to === to),
    `missing transition ${from} --${event}--> ${to}`
  );
}

for (const transition of table.valid_transitions) {
  for (const field of ["from", "event", "guard", "action", "to", "allowed", "owner_review_required", "forbidden_if", "evidence_required"]) {
    assert.ok(Object.hasOwn(transition, field), `transition missing ${field}`);
  }
  assert.ok(Object.hasOwn(transition.guard, "name"));
  assert.ok(Object.hasOwn(transition.guard, "conditions"));
  assert.ok(Object.hasOwn(transition.guard, "result"));
  assert.ok(Object.hasOwn(transition.action, "name"));
  assert.ok(Object.hasOwn(transition.action, "writes"));
  assert.equal(transition.safety_flags.worker_launch_enabled, false);
  assert.equal(transition.safety_flags.real_orchestration_allowed, false);
  assert.equal(transition.safety_flags.prompt_sending_allowed, false);
  assert.equal(transition.safety_flags.runtime_execution_allowed, false);
}

function transitionIsAllowed(transition) {
  if (transition.safety_flags?.worker_launch_enabled) return false;
  if (transition.safety_flags?.real_orchestration_allowed) return false;
  if (transition.safety_flags?.prompt_sending_allowed) return false;
  if (transition.safety_flags?.runtime_execution_allowed) return false;
  if (transition.to === "CODEX_RUNNING") {
    return transition.from === "CODEX_PROMPT_READY" &&
      transition.event?.type === "owner_pastes_to_codex_or_bridge_dry_run_prepared" &&
      transition.event?.owner_action_marker === true;
  }
  return transition.allowed === true && transition.guard?.result === true;
}

const directInvalid = readJson("tests/fixtures/codex_native_closed_loop/invalid_transition_direct_codex_running_without_prompt.json");
assert.equal(transitionIsAllowed(directInvalid.transition), false, "direct READY_FOR_TRIAGE -> CODEX_RUNNING must be rejected");

const workerInvalid = readJson("tests/fixtures/codex_native_closed_loop/invalid_transition_worker_launch_enabled.json");
assert.equal(transitionIsAllowed(workerInvalid.transition), false, "worker_launch_enabled true must be rejected");

assert.ok(
  table.invalid_transition_examples.some((item) => item.from === "READY_FOR_TRIAGE" && item.to === "CODEX_RUNNING" && item.allowed === false),
  "invalid direct transition example missing"
);

console.log("transition_table_static_contract: ok");
