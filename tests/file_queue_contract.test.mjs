// BUILD_ID: 20260612_file_queue_contract_tests_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

const requiredForbiddenActions = [
  "worker_launch",
  "real_orchestration",
  "browser_ui_automation",
  "chatgpt_ui_automation",
  "codex_ui_automation",
  "runtime_execution",
  "deploy",
  "paper_live_order",
  "cancel_order",
  "fetch_balance",
  "private_api",
  "provider_mutation",
  "billing_mutation",
  "secrets_output",
  "reset_restore_clean",
  "force_push"
];

const safeModes = [
  "docs_only",
  "schema_tests_only",
  "static_validation_only",
  "artifact_handoff_only"
];

const allowedStateTransitions = new Set([
  "READY->CLAIMED",
  "CLAIMED->RUNNING",
  "RUNNING->DONE",
  "RUNNING->BLOCKED",
  "RUNNING->FAILED_SAFE",
  "RUNNING->NEEDS_OWNER_APPROVAL",
  "NEEDS_OWNER_APPROVAL->READY",
  "NEEDS_OWNER_APPROVAL->ARCHIVED",
  "BLOCKED->NEEDS_OWNER_APPROVAL",
  "FAILED_SAFE->NEEDS_OWNER_APPROVAL",
  "DONE->ARCHIVED"
]);

const unsafeModePattern = /\b(live|paper|order|cancel|fetch_balance|private_api|runtime|deploy|worker|orchestration)\b/i;

const taskSchema = readJson("schema/orchestration/file_queue_task.schema.json");
const resultSchema = readJson("schema/orchestration/file_queue_result.schema.json");
const stateSchema = readJson("schema/orchestration/file_queue_state.schema.json");

function requiredFields(schema) {
  assert.ok(Array.isArray(schema.required), `${schema.title} must define required fields`);
  return schema.required;
}

function assertBuildId(schema, name) {
  assert.match(schema.$comment ?? "", /^BUILD_ID: /, `${name} must carry BUILD_ID in $comment`);
}

function assertNoExtraProperties(schema, data, name) {
  const allowed = new Set(Object.keys(schema.properties ?? {}));
  for (const key of Object.keys(data)) {
    assert.ok(allowed.has(key), `${name} has unexpected property ${key}`);
  }
}

function missingRequired(schema, data) {
  return requiredFields(schema).filter((field) => !Object.hasOwn(data, field));
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function hasAllForbiddenActions(actions) {
  return requiredForbiddenActions.every((action) => actions.includes(action));
}

function taskErrors(task) {
  const errors = [];
  for (const field of missingRequired(taskSchema, task)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  if (task.schema !== "lonewolf.file_queue.task.v1") errors.push("bad schema");
  if (!safeModes.includes(task.mode)) errors.push("unsafe or unknown mode");
  if (unsafeModePattern.test(task.mode)) errors.push("mode contains unsafe token");
  if (!isStringArray(task.allowed_files)) errors.push("allowed_files must be non-empty string array");
  if (!isStringArray(task.forbidden_actions)) errors.push("forbidden_actions must be string array");
  if (!hasAllForbiddenActions(task.forbidden_actions)) errors.push("forbidden action coverage incomplete");
  if (!isStringArray(task.success_criteria)) errors.push("success_criteria must be non-empty string array");
  if (!isStringArray(task.stop_conditions)) errors.push("stop_conditions must be non-empty string array");
  if (!isStringArray(task.artifact_requirements)) errors.push("artifact_requirements must be non-empty string array");
  if (!isStringArray(task.expected_final_report_labels)) errors.push("expected_final_report_labels must be non-empty string array");
  if (!isNonEmptyString(task.owner_approval_phrase)) errors.push("owner_approval_phrase must be non-empty");
  return errors;
}

function resultErrors(result) {
  const errors = [];
  for (const field of missingRequired(resultSchema, result)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  if (result.schema !== "lonewolf.file_queue.result.v1") errors.push("bad schema");
  if (!["DONE", "BLOCKED", "STOP_OWNER_REVIEW_REQUIRED", "FAILED_SAFE"].includes(result.status)) errors.push("bad status");
  if (!isNonEmptyString(result.changed_summary)) errors.push("changed_summary must be non-empty");
  if (!Array.isArray(result.changed_files)) errors.push("changed_files must be an array");
  if (!Array.isArray(result.tests) || result.tests.length === 0) errors.push("tests must be non-empty");
  if (!Array.isArray(result.blocker_matrix)) errors.push("blocker_matrix must be an array");
  if (!isNonEmptyString(result.artifact_zip_path)) errors.push("artifact_zip_path must be non-empty");
  if (!/^[A-Fa-f0-9]{64}$/.test(result.sha256 ?? "")) errors.push("sha256 must be 64 hex chars");
  if (result.forbidden_actions_confirmation?.forbidden_actions_performed !== false) errors.push("forbidden actions must be confirmed absent");
  if (!hasAllForbiddenActions(result.forbidden_actions_confirmation?.confirmed_absent ?? [])) errors.push("result forbidden action coverage incomplete");
  if (!isNonEmptyString(result.human_review_one_point)) errors.push("human_review_one_point must be non-empty");
  if (!isNonEmptyString(result.next_recommended_task)) errors.push("next_recommended_task must be non-empty");
  return errors;
}

function stateErrors(state) {
  const errors = [];
  for (const field of missingRequired(stateSchema, state)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  const allowedStates = stateSchema.$defs.state_name.enum;
  if (state.schema !== "lonewolf.file_queue.state.v1") errors.push("bad schema");
  if (!allowedStates.includes(state.state)) errors.push("bad state");
  if (!allowedStates.includes(state.previous_state)) errors.push("bad previous_state");
  if (!Array.isArray(state.allowed_next_states)) errors.push("allowed_next_states must be an array");
  if (!state.allowed_next_states.every((item) => allowedStates.includes(item))) errors.push("bad allowed_next_states");
  if (typeof state.owner_review_required !== "boolean") errors.push("owner_review_required must be boolean");
  if (!isNonEmptyString(state.timestamp)) errors.push("timestamp must be non-empty");
  if (!isNonEmptyString(state.event?.type)) errors.push("event.type must be non-empty");
  if (!isNonEmptyString(state.event?.source)) errors.push("event.source must be non-empty");
  if (typeof state.event?.owner_action_marker !== "boolean") errors.push("event.owner_action_marker must be boolean");
  if (!allowedStateTransitions.has(`${state.previous_state}->${state.state}`)) errors.push("illegal state transition");
  return errors;
}

for (const [schema, name, expectedRequired] of [
  [taskSchema, "task schema", [
    "schema",
    "task_id",
    "title",
    "target_repo",
    "mode",
    "allowed_files",
    "forbidden_actions",
    "success_criteria",
    "stop_conditions",
    "owner_approval_phrase",
    "artifact_requirements",
    "expected_final_report_labels"
  ]],
  [resultSchema, "result schema", [
    "schema",
    "task_id",
    "status",
    "changed_summary",
    "changed_files",
    "tests",
    "blocker_matrix",
    "forbidden_actions_confirmation",
    "artifact_zip_path",
    "sha256",
    "human_review_one_point",
    "next_recommended_task"
  ]],
  [stateSchema, "state schema", [
    "schema",
    "task_id",
    "state",
    "previous_state",
    "allowed_next_states",
    "event",
    "timestamp",
    "owner_review_required",
    "stop_reason"
  ]]
]) {
  assertBuildId(schema, name);
  assert.equal(schema.additionalProperties, false, `${name} must reject extra fields`);
  for (const field of expectedRequired) {
    assert.ok(requiredFields(schema).includes(field), `${name} missing required field ${field}`);
  }
}

assert.deepEqual(taskSchema.properties.mode.enum, safeModes, "task schema must expose only safe modes");
assert.ok(taskSchema.properties.mode.enum.every((mode) => !unsafeModePattern.test(mode)), "task schema mode enum must not include unsafe modes");
for (const action of requiredForbiddenActions) {
  assert.ok(taskSchema.$defs.forbidden_action.enum.includes(action), `task schema missing forbidden action ${action}`);
  assert.ok(resultSchema.$defs.forbidden_action.enum.includes(action), `result schema missing forbidden action ${action}`);
  assert.ok(
    taskSchema.properties.forbidden_actions.allOf.some((item) => item.contains?.const === action),
    `task schema does not require forbidden action ${action}`
  );
}

for (const file of [
  "tests/fixtures/file-queue/valid/task_minimal.json",
  "tests/fixtures/file-queue/valid/task_docs_only.json"
]) {
  const task = readJson(file);
  assertNoExtraProperties(taskSchema, task, file);
  assert.deepEqual(taskErrors(task), [], `${file} must be valid`);
}

const resultDone = readJson("tests/fixtures/file-queue/valid/result_done.json");
assertNoExtraProperties(resultSchema, resultDone, "result_done.json");
assert.deepEqual(resultErrors(resultDone), [], "result_done.json must be valid");

const stateReady = readJson("tests/fixtures/file-queue/valid/state_ready.json");
assertNoExtraProperties(stateSchema, stateReady, "state_ready.json");
assert.deepEqual(stateErrors(stateReady), [], "state_ready.json must be valid");

const unsafeTask = readJson("tests/fixtures/file-queue/invalid/task_allows_live_order.json");
assert.ok(taskErrors(unsafeTask).includes("unsafe or unknown mode"), "task_allows_live_order.json must fail unsafe mode validation");

const missingStopConditions = readJson("tests/fixtures/file-queue/invalid/task_missing_stop_conditions.json");
assert.ok(taskErrors(missingStopConditions).includes("missing stop_conditions"), "task_missing_stop_conditions.json must fail missing stop_conditions validation");

const missingArtifactSha = readJson("tests/fixtures/file-queue/invalid/result_missing_artifact_sha.json");
assert.ok(resultErrors(missingArtifactSha).includes("missing sha256"), "result_missing_artifact_sha.json must fail missing sha256 validation");

const illegalState = readJson("tests/fixtures/file-queue/invalid/state_illegal_transition.json");
assert.ok(stateErrors(illegalState).includes("illegal state transition"), "state_illegal_transition.json must fail transition validation");

console.log("file_queue_contract_static: ok");
