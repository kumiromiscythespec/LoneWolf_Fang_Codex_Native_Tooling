// BUILD_ID: 20260612_fasttrack_window4_closed_loop_state_machine_tests_v0
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  EVENTS,
  STATES,
  classifyClosedLoopState
} from "../tools/orchestration/codex_native_closed_loop_state_machine.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const schema = readJson("schema/orchestration/codex_native_closed_loop_state.schema.json");
const validValidatorAccepted = readJson("tests/fixtures/state-machine/valid/transition_validator_accepted.json");
const validLinkageProof = readJson("tests/fixtures/state-machine/valid/transition_linkage_proof_ready.json");
const invalidAutoExecute = readJson("tests/fixtures/state-machine/invalid/transition_auto_execute_true.json");
const invalidSkipOwner = readJson("tests/fixtures/state-machine/invalid/transition_illegal_skip_owner_decision.json");

const requiredStates = [
  "NO_TASK",
  "TASK_AUTHORED",
  "VALIDATOR_ACCEPTED",
  "VALIDATOR_REJECTED",
  "INTERPRETER_COMPLETED",
  "REVIEW_PACKET_CREATED",
  "OWNER_DECISION_REQUIRED",
  "LINKAGE_PROOF_CREATED",
  "CLOSED_OUT",
  "STOP_OWNER_REVIEW_REQUIRED"
];

const requiredEvents = [
  "task_found",
  "validation_passed",
  "validation_failed",
  "interpreter_completed",
  "review_packet_ready",
  "owner_go",
  "owner_repair",
  "linkage_proof_ready",
  "closeout_ready",
  "unsafe_condition"
];

const allowedPhases = schema.$defs.phase.enum;
const allowedTransitions = new Set([
  "NO_TASK:task_found:TASK_AUTHORED",
  "TASK_AUTHORED:validation_passed:VALIDATOR_ACCEPTED",
  "TASK_AUTHORED:validation_failed:VALIDATOR_REJECTED",
  "VALIDATOR_REJECTED:owner_repair:TASK_AUTHORED",
  "VALIDATOR_ACCEPTED:interpreter_completed:INTERPRETER_COMPLETED",
  "INTERPRETER_COMPLETED:review_packet_ready:REVIEW_PACKET_CREATED",
  "REVIEW_PACKET_CREATED:owner_go:OWNER_DECISION_REQUIRED",
  "REVIEW_PACKET_CREATED:owner_repair:TASK_AUTHORED",
  "OWNER_DECISION_REQUIRED:owner_repair:TASK_AUTHORED",
  "OWNER_DECISION_REQUIRED:linkage_proof_ready:LINKAGE_PROOF_CREATED",
  "LINKAGE_PROOF_CREATED:closeout_ready:CLOSED_OUT"
]);

function schemaErrors(plan) {
  const errors = [];
  for (const field of schema.required) {
    if (!Object.hasOwn(plan, field)) errors.push(`missing ${field}`);
  }
  const allowedKeys = new Set(Object.keys(schema.properties));
  for (const key of Object.keys(plan)) {
    if (!allowedKeys.has(key)) errors.push(`unexpected ${key}`);
  }
  if (plan.schema !== schema.properties.schema.const) errors.push("bad schema");
  if (plan.build_id !== schema.properties.build_id.const) errors.push("bad build_id");
  if (!schema.$defs.state.enum.includes(plan.current_state)) errors.push("bad current_state");
  if (!schema.$defs.event.enum.includes(plan.event)) errors.push("bad event");
  if (!schema.$defs.state.enum.includes(plan.next_state)) errors.push("bad next_state");
  if (!allowedPhases.includes(plan.allowed_next_phase)) errors.push("bad allowed_next_phase");
  if (plan.execution_allowed !== false) errors.push("execution_allowed must be false");
  if (typeof plan.owner_approval_required !== "boolean") errors.push("owner_approval_required must be boolean");
  if (typeof plan.reason !== "string" || plan.reason.length === 0) errors.push("reason must be non-empty");
  return errors;
}

function semanticPlanErrors(plan) {
  const errors = [];
  if (plan.execution_allowed !== false) errors.push("execution must never be allowed");
  if (plan.next_state === "LINKAGE_PROOF_CREATED") {
    if (plan.current_state !== "OWNER_DECISION_REQUIRED") errors.push("linkage proof must not skip owner decision state");
    if (plan.event !== "linkage_proof_ready") errors.push("linkage proof must use linkage_proof_ready event");
    if (plan.owner_approval_required !== true) errors.push("linkage proof still requires owner review");
  }
  if (plan.next_state === "STOP_OWNER_REVIEW_REQUIRED") {
    if (plan.allowed_next_phase !== "stop_owner_review_required") errors.push("stop state must use stop phase");
    if (plan.owner_approval_required !== true) errors.push("stop state must require owner approval");
  } else if (!allowedTransitions.has(`${plan.current_state}:${plan.event}:${plan.next_state}`)) {
    errors.push("illegal transition");
  }
  return errors;
}

test("schema defines the required build id, states, events, and plan fields", () => {
  assert.equal(schema.$comment, "BUILD_ID: 20260612_fasttrack_window4_closed_loop_state_machine_schema_v0");
  assert.equal(schema.additionalProperties, false);
  for (const field of [
    "current_state",
    "event",
    "next_state",
    "allowed_next_phase",
    "execution_allowed",
    "owner_approval_required",
    "reason"
  ]) {
    assert.ok(schema.required.includes(field), `schema must require ${field}`);
  }
  assert.deepEqual(schema.$defs.state.enum, requiredStates);
  assert.deepEqual(schema.$defs.event.enum, requiredEvents);
  assert.deepEqual(STATES, requiredStates);
  assert.deepEqual(EVENTS, requiredEvents);
  assert.equal(schema.properties.execution_allowed.const, false);
});

test("valid fixtures satisfy schema and semantic transition checks", () => {
  for (const fixture of [validValidatorAccepted, validLinkageProof]) {
    assert.deepEqual(schemaErrors(fixture), []);
    assert.deepEqual(semanticPlanErrors(fixture), []);
  }
});

test("invalid fixtures fail closed-loop contract checks", () => {
  assert.ok(schemaErrors(invalidAutoExecute).includes("execution_allowed must be false"));
  assert.ok(semanticPlanErrors(invalidAutoExecute).includes("execution must never be allowed"));
  assert.deepEqual(schemaErrors(invalidSkipOwner), []);
  assert.ok(semanticPlanErrors(invalidSkipOwner).includes("linkage proof must not skip owner decision state"));
});

test("classifier maps validator acceptance and linkage proof evidence", () => {
  const validatorAccepted = classifyClosedLoopState({
    current_state: "TASK_AUTHORED",
    event: "validation_passed"
  });
  assert.equal(validatorAccepted.next_state, validValidatorAccepted.next_state);
  assert.equal(validatorAccepted.allowed_next_phase, validValidatorAccepted.allowed_next_phase);
  assert.equal(validatorAccepted.execution_allowed, false);

  const linkageProof = classifyClosedLoopState({
    current_state: "OWNER_DECISION_REQUIRED",
    event: "linkage_proof_ready",
    evidence: { owner_decision_recorded: true }
  });
  assert.equal(linkageProof.next_state, validLinkageProof.next_state);
  assert.equal(linkageProof.allowed_next_phase, validLinkageProof.allowed_next_phase);
  assert.equal(linkageProof.execution_allowed, false);
});

test("classifier defaults unsafe or ambiguous input to owner review stop", () => {
  for (const input of [
    { current_state: "TASK_AUTHORED", event: "interpreter_completed" },
    { current_state: "REVIEW_PACKET_CREATED", event: "linkage_proof_ready" },
    { current_state: "TASK_AUTHORED", event: "validation_passed", execution_allowed: true },
    { current_state: "TASK_AUTHORED", event: "validation_passed", evidence: { auto_execute_enabled: true } },
    { current_state: "UNKNOWN", event: "task_found" },
    { current_state: "NO_TASK", event: "unknown_event" },
    { current_state: "NO_TASK", event: "unsafe_condition" }
  ]) {
    const result = classifyClosedLoopState(input);
    assert.equal(result.next_state, "STOP_OWNER_REVIEW_REQUIRED");
    assert.equal(result.execution_allowed, false);
    assert.equal(result.owner_approval_required, true);
    assert.equal(result.allowed_next_phase, "stop_owner_review_required");
  }
});

test("source stays local-only and does not call execution helpers", () => {
  const source = readText("tools/orchestration/codex_native_closed_loop_state_machine.mjs");
  for (const token of [
    "writeFile",
    "appendFile",
    "mkdir",
    "spawn",
    "execFile",
    "setInterval",
    "watchFile",
    ["fetch", "("].join(""),
    "file_queue_dry_run_validator",
    "file_queue_execution_interpreter",
    "file_queue_task_authoring_helper"
  ]) {
    assert.equal(source.includes(token), false, `state machine source must not include ${token}`);
  }
});

test("documentation records non-execution and fail-closed boundaries", () => {
  const docs = readText("docs/orchestration/codex_native_closed_loop_state_machine.md");
  assert.match(docs, /not a runner, daemon, watcher/i);
  assert.match(docs, /must never execute the allowed next phase/i);
  assert.match(docs, /STOP_OWNER_REVIEW_REQUIRED/);
  assert.match(docs, /execution_allowed` must always be `false`/);
});
