// BUILD_ID: 20260612_task_result_linkage_contracts_static_tests_v1
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const linkageSchema = readJson("schema/orchestration/file_queue_task_result_linkage.schema.json");
const ownerDecisionSchema = readJson("schema/orchestration/file_queue_owner_decision.schema.json");
const linkageStateSchema = readJson("schema/orchestration/file_queue_linkage_state.schema.json");

const completeLinkage = readJson("tests/fixtures/file-queue/linkage/valid/linkage_complete_chain.json");
const ownerDecisionGo = readJson("tests/fixtures/file-queue/linkage/valid/owner_decision_go.json");
const executedState = readJson("tests/fixtures/file-queue/linkage/valid/linkage_state_executed_appdata_only.json");
const missingValidatorSha = readJson("tests/fixtures/file-queue/linkage/invalid/linkage_missing_validator_sha.json");
const taskShaMismatch = readJson("tests/fixtures/file-queue/linkage/invalid/linkage_task_sha_mismatch.json");
const ownerMissingReview = readJson("tests/fixtures/file-queue/linkage/invalid/owner_decision_missing_human_review_point.json");
const illegalTransition = readJson("tests/fixtures/file-queue/linkage/invalid/linkage_state_illegal_transition.json");

const shaFields = [
  "authoring_request_sha256",
  "generated_task_sha256",
  "validator_report_sha256",
  "execution_request_sha256",
  "interpreter_result_sha256",
  "output_packet_sha256"
];

const idFields = [
  "authoring_request_id",
  "generated_task_id",
  "validation_id",
  "execution_request_id",
  "interpreter_result_id",
  "output_packet_id",
  "owner_decision_id"
];

const pathFields = [
  "authoring_request_path",
  "generated_task_path",
  "validator_report_path",
  "execution_request_path",
  "interpreter_result_path",
  "output_packet_path"
];

const requiredLinkageFields = [
  "schema",
  "chain_id",
  "task_id",
  ...idFields,
  ...pathFields,
  ...shaFields,
  "current_state",
  "allowed_next_states",
  "owner_approval_phrase",
  "created_at",
  "updated_at",
  "stop_conditions",
  "forbidden_actions_confirmation"
];

const allowedStates = [
  "AUTHORED",
  "VALIDATED_DRY_RUN",
  "EXECUTION_APPROVED",
  "EXECUTED_APPDATA_ONLY",
  "BLOCKED",
  "FAILED_SAFE",
  "STOP_OWNER_REVIEW_REQUIRED",
  "SUPERSEDED",
  "ARCHIVED"
];

const allowedDecisions = [
  "GO",
  "REPAIR",
  "STOP",
  "SPLIT_TASK",
  "OWNER_MANUAL_ACTION"
];

const allowedTransitions = new Set([
  "AUTHORED->VALIDATED_DRY_RUN",
  "AUTHORED->BLOCKED",
  "AUTHORED->FAILED_SAFE",
  "AUTHORED->STOP_OWNER_REVIEW_REQUIRED",
  "VALIDATED_DRY_RUN->EXECUTION_APPROVED",
  "VALIDATED_DRY_RUN->BLOCKED",
  "VALIDATED_DRY_RUN->FAILED_SAFE",
  "VALIDATED_DRY_RUN->STOP_OWNER_REVIEW_REQUIRED",
  "EXECUTION_APPROVED->EXECUTED_APPDATA_ONLY",
  "EXECUTION_APPROVED->BLOCKED",
  "EXECUTION_APPROVED->FAILED_SAFE",
  "EXECUTION_APPROVED->STOP_OWNER_REVIEW_REQUIRED",
  "EXECUTED_APPDATA_ONLY->STOP_OWNER_REVIEW_REQUIRED",
  "EXECUTED_APPDATA_ONLY->ARCHIVED",
  "EXECUTED_APPDATA_ONLY->SUPERSEDED",
  "BLOCKED->STOP_OWNER_REVIEW_REQUIRED",
  "FAILED_SAFE->STOP_OWNER_REVIEW_REQUIRED",
  "STOP_OWNER_REVIEW_REQUIRED->ARCHIVED",
  "SUPERSEDED->ARCHIVED"
]);

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

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

function isSha256(value) {
  return /^[A-Fa-f0-9]{64}$/.test(value ?? "");
}

function linkageErrors(linkage) {
  const errors = [];
  for (const field of missingRequired(linkageSchema, linkage)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  if (linkage.schema !== "lonewolf.file_queue.task_result_linkage.v1") errors.push("bad schema");
  for (const field of ["chain_id", "task_id", ...idFields, ...pathFields, "owner_approval_phrase"]) {
    if (!isNonEmptyString(linkage[field])) errors.push(`${field} must be non-empty`);
  }
  for (const field of shaFields) {
    if (!isSha256(linkage[field])) errors.push(`${field} must be sha256`);
  }
  if (!allowedStates.includes(linkage.current_state)) errors.push("bad current_state");
  if (!Array.isArray(linkage.allowed_next_states)) errors.push("allowed_next_states must be array");
  if (!linkage.allowed_next_states?.every((state) => allowedStates.includes(state))) errors.push("bad allowed_next_states");
  if (!isNonEmptyStringArray(linkage.stop_conditions)) errors.push("stop_conditions must be non-empty string array");
  if (linkage.forbidden_actions_confirmation?.forbidden_actions_performed !== false) {
    errors.push("forbidden actions must be confirmed absent");
  }
  if (!isNonEmptyStringArray(linkage.forbidden_actions_confirmation?.confirmed_absent)) {
    errors.push("confirmed_absent must be non-empty string array");
  }
  return errors;
}

function semanticLinkageErrors(linkage) {
  const errors = [];
  if (!linkage.parent_references) return ["missing parent_references"];
  for (const field of idFields) {
    if (linkage[field] !== linkage.parent_references[field]) errors.push(`${field} parent mismatch`);
  }
  for (const field of shaFields) {
    if (linkage[field] !== linkage.parent_references[field]) errors.push(`${field} parent mismatch`);
  }
  if (linkage.owner_decision_sha256 && linkage.owner_decision_sha256 !== linkage.parent_references.owner_decision_sha256) {
    errors.push("owner_decision_sha256 parent mismatch");
  }
  if (linkage.linkage_checks?.parent_ids_match !== true) errors.push("parent_ids_match must be true");
  if (linkage.linkage_checks?.parent_hashes_match !== true) errors.push("parent_hashes_match must be true");
  if (linkage.linkage_checks?.no_consumer_inference !== true) errors.push("no_consumer_inference must be true");
  return errors;
}

function ownerDecisionErrors(decision) {
  const errors = [];
  for (const field of missingRequired(ownerDecisionSchema, decision)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  if (decision.schema !== "lonewolf.file_queue.owner_decision.v1") errors.push("bad schema");
  if (!allowedDecisions.includes(decision.decision)) errors.push("bad decision");
  for (const field of [
    "owner_decision_id",
    "chain_id",
    "task_id",
    "decision_phrase",
    "decision_timestamp",
    "artifact_path",
    "human_review_one_point",
    "next_recommended_action"
  ]) {
    if (!isNonEmptyString(decision[field])) errors.push(`${field} must be non-empty`);
  }
  if (!isSha256(decision.artifact_sha256)) errors.push("artifact_sha256 must be sha256");
  return errors;
}

function linkageStateErrors(state) {
  const errors = [];
  for (const field of missingRequired(linkageStateSchema, state)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  if (state.schema !== "lonewolf.file_queue.linkage_state.v1") errors.push("bad schema");
  if (!allowedStates.includes(state.state)) errors.push("bad state");
  if (!allowedStates.includes(state.previous_state)) errors.push("bad previous_state");
  if (!Array.isArray(state.allowed_next_states)) errors.push("allowed_next_states must be array");
  if (!state.allowed_next_states?.every((item) => allowedStates.includes(item))) errors.push("bad allowed_next_states");
  if (!isNonEmptyString(state.event)) errors.push("event must be non-empty");
  if (!isNonEmptyString(state.timestamp)) errors.push("timestamp must be non-empty");
  if (!isNonEmptyString(state.reason)) errors.push("reason must be non-empty");
  if (typeof state.owner_review_required !== "boolean") errors.push("owner_review_required must be boolean");
  if (!allowedTransitions.has(`${state.previous_state}->${state.state}`)) errors.push("illegal state transition");
  return errors;
}

for (const [schema, name] of [
  [linkageSchema, "task result linkage schema"],
  [ownerDecisionSchema, "owner decision schema"],
  [linkageStateSchema, "linkage state schema"]
]) {
  assertBuildId(schema, name);
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.additionalProperties, false, `${name} must reject extra fields`);
}

for (const field of requiredLinkageFields) {
  assert.ok(requiredFields(linkageSchema).includes(field), `linkage schema missing required field ${field}`);
}

for (const field of shaFields) {
  assert.ok(requiredFields(linkageSchema).includes(field), `linkage schema must require ${field}`);
  assert.equal(linkageSchema.properties[field].$ref, "#/$defs/sha256", `${field} must use sha256 definition`);
}

for (const field of [
  "schema",
  "owner_decision_id",
  "chain_id",
  "task_id",
  "decision",
  "decision_phrase",
  "decision_timestamp",
  "artifact_path",
  "artifact_sha256",
  "human_review_one_point",
  "next_recommended_action"
]) {
  assert.ok(requiredFields(ownerDecisionSchema).includes(field), `owner decision schema missing required field ${field}`);
}

assert.equal(ownerDecisionSchema.properties.artifact_sha256.$ref, "#/$defs/sha256");
assert.deepEqual(ownerDecisionSchema.properties.decision.enum, allowedDecisions);

for (const field of [
  "schema",
  "chain_id",
  "task_id",
  "state",
  "previous_state",
  "allowed_next_states",
  "event",
  "timestamp",
  "reason",
  "owner_review_required"
]) {
  assert.ok(requiredFields(linkageStateSchema).includes(field), `linkage state schema missing required field ${field}`);
}

assert.deepEqual(linkageSchema.$defs.linkage_state.enum, allowedStates);
assert.deepEqual(linkageStateSchema.$defs.linkage_state.enum, allowedStates);

assertNoExtraProperties(linkageSchema, completeLinkage, "linkage_complete_chain.json");
assert.deepEqual(linkageErrors(completeLinkage), [], "complete linkage fixture must pass schema checks");
assert.deepEqual(semanticLinkageErrors(completeLinkage), [], "complete linkage fixture must pass semantic checks");

assertNoExtraProperties(ownerDecisionSchema, ownerDecisionGo, "owner_decision_go.json");
assert.deepEqual(ownerDecisionErrors(ownerDecisionGo), [], "GO owner decision fixture must pass");

assertNoExtraProperties(linkageStateSchema, executedState, "linkage_state_executed_appdata_only.json");
assert.deepEqual(linkageStateErrors(executedState), [], "EXECUTED_APPDATA_ONLY state fixture must pass");

assert.ok(
  linkageErrors(missingValidatorSha).includes("missing validator_report_sha256"),
  "missing validator SHA fixture must fail required schema check"
);

assert.deepEqual(linkageErrors(taskShaMismatch), [], "task SHA mismatch fixture must pass raw schema checks");
assert.ok(
  semanticLinkageErrors(taskShaMismatch).includes("generated_task_sha256 parent mismatch"),
  "task SHA mismatch fixture must fail semantic linkage checks"
);

assert.ok(
  ownerDecisionErrors(ownerMissingReview).includes("human_review_one_point must be non-empty"),
  "owner decision missing human review point fixture must fail"
);

assert.ok(
  linkageStateErrors(illegalTransition).includes("illegal state transition"),
  "illegal transition fixture must fail semantic state transition checks"
);

const linkageDocs = readText("docs/orchestration/file_queue_task_result_linkage.md");
const ledgerDocs = readText("docs/orchestration/file_queue_result_ledger_policy.md");

for (const term of ["consumer", "runner", "daemon", "watcher"]) {
  assert.match(linkageDocs, new RegExp(term, "i"), `linkage docs must mention ${term} non-goal`);
}

assert.match(linkageDocs, /STOP_OWNER_REVIEW_REQUIRED/);
assert.match(linkageDocs, /future consumer must not infer/i);
assert.match(ledgerDocs, /no writer in this phase/i);
assert.match(ledgerDocs, /no automatic execution from ledger/i);

for (const docs of [linkageDocs, ledgerDocs]) {
  assert.doesNotMatch(docs, /node\s+tools|npm\s+run|setInterval|watchFile|execFile|fetch\s*\(/i);
}

for (const path of [
  "tools/file_queue_task_result_linkage.mjs",
  "tools/file_queue_result_ledger_writer.mjs",
  "queue",
  "queues",
  "file_queue_runtime",
  "file_queue_outbox",
  ".file_queue"
]) {
  assert.equal(existsSync(resolve(root, path)), false, `${path} must not be created`);
}

const thisSource = readText("tests/file_queue_task_result_linkage_contract.test.mjs");
for (const token of [
  ["node:", "child_process"].join(""),
  ["spawn", "Sync("].join(""),
  ["exec", "File("].join(""),
  ["file_queue_task_authoring", "_helper"].join(""),
  ["file_queue_dry_run", "_validator"].join(""),
  ["file_queue_execution", "_interpreter"].join(""),
  ["open", "ai"].join(""),
  ["play", "wright"].join(""),
  ["pupp", "eteer"].join(""),
  ["stri", "pe"].join(""),
  ["cloud", "flare"].join("")
]) {
  assert.equal(thisSource.includes(token), false, `linkage static test must not include ${token}`);
}

console.log("file_queue_task_result_linkage_contract_static: ok");
