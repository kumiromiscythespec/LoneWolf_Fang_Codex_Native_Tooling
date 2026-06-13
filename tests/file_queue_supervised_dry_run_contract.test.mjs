// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BUILD_ID = "20260613_codex_native_automation_gate_contracts_v1";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const requestSchema = readJson("schema/orchestration/file_queue_supervised_dry_run_request.schema.json");
const resultSchema = readJson("schema/orchestration/file_queue_supervised_dry_run_result.schema.json");

const validRequest = readJson("tests/fixtures/file-queue/supervised-dry-run/valid/request_appdata_packet_creation_review_only.json");
const validResult = readJson("tests/fixtures/file-queue/supervised-dry-run/valid/result_appdata_packet_created_owner_review_required.json");
const validFailedResult = readJson("tests/fixtures/file-queue/supervised-dry-run/valid/result_failed_safe_before_output.json");
const invalidExtraFieldRequest = readJson("tests/fixtures/file-queue/supervised-dry-run/invalid/request_extra_field_auto_execute.json");
const invalidOperationRequest = readJson("tests/fixtures/file-queue/supervised-dry-run/invalid/request_unsafe_operation_class.json");
const invalidMissingValidatorSha = readJson("tests/fixtures/file-queue/supervised-dry-run/invalid/request_missing_validator_sha.json");
const invalidRepoOutputRequest = readJson("tests/fixtures/file-queue/supervised-dry-run/invalid/request_output_root_inside_repo.json");
const invalidForbiddenResult = readJson("tests/fixtures/file-queue/supervised-dry-run/invalid/result_forbidden_actions_performed_true.json");
const invalidWatcherResult = readJson("tests/fixtures/file-queue/supervised-dry-run/invalid/result_runtime_watcher_true.json");
const invalidMissingHumanReview = readJson("tests/fixtures/file-queue/supervised-dry-run/invalid/result_missing_human_review_one_point.json");

const prohibitedActions = [
  "live_execution",
  "paper_trading",
  "order_cancel_fetch_balance",
  "deploy",
  "runtime_workflow",
  "task_execution",
  "executor_code",
  "shell_escape",
  "network_private_openai_api",
  "cloud_mutation",
  "billing_mutation",
  "daemon_watcher",
  "ui_automation",
  "process_kill",
  "security_bypass",
  "repo_mutation",
  "secrets_output"
];

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

function missingRequired(schema, data) {
  return schema.required.filter((field) => !Object.hasOwn(data, field));
}

function extraProperties(schema, data) {
  const allowed = new Set(Object.keys(schema.properties ?? {}));
  return Object.keys(data).filter((key) => !allowed.has(key));
}

function hasRepoPath(value) {
  return typeof value === "string" && /^C:\\LoneWolf_Fang_Project[\\/]/i.test(value);
}

function requestErrors(request) {
  const errors = [];
  for (const field of missingRequired(requestSchema, request)) errors.push(`missing ${field}`);
  for (const field of extraProperties(requestSchema, request)) errors.push(`unexpected ${field}`);
  if (errors.length > 0) return errors;
  if (request.schema !== "lonewolf.file_queue.supervised_dry_run_request.v1") errors.push("bad schema");
  if (request.build_id !== BUILD_ID) errors.push("bad build_id");
  if (!isNonEmptyString(request.request_id)) errors.push("request_id must be non-empty");
  if (!isNonEmptyString(request.chain_id)) errors.push("chain_id must be non-empty");
  if (!isNonEmptyString(request.task_id)) errors.push("task_id must be non-empty");
  if (!isNonEmptyString(request.task_json_path)) errors.push("task_json_path must be non-empty");
  if (!/^[A-Fa-f0-9]{64}$/.test(request.task_json_sha256 ?? "")) errors.push("task_json_sha256 must be sha256");
  if (!isNonEmptyString(request.validator_report_path)) errors.push("validator_report_path must be non-empty");
  if (!/^[A-Fa-f0-9]{64}$/.test(request.validator_report_sha256 ?? "")) errors.push("validator_report_sha256 must be sha256");
  if (request.expected_validator_status !== "VALID_DRY_RUN") errors.push("expected_validator_status must be VALID_DRY_RUN");
  if (request.expected_validator_accepted !== true) errors.push("expected_validator_accepted must be true");
  if (!requestSchema.properties.operation_class.enum.includes(request.operation_class)) errors.push("unsafe or unknown operation_class");
  if (!requestSchema.properties.output_root_policy.enum.includes(request.output_root_policy)) errors.push("bad output_root_policy");
  if (request.output_root_policy === "APPDATA_ONLY" && hasRepoPath(request.output_root)) errors.push("output_root must not be inside repo");
  if (!isNonEmptyString(request.owner_approval_phrase)) errors.push("owner_approval_phrase must be non-empty");
  if (request.owner_gate_before_dry_run !== true) errors.push("owner_gate_before_dry_run must be true");
  if (!isNonEmptyStringArray(request.success_criteria)) errors.push("success_criteria must be non-empty string array");
  if (!isNonEmptyStringArray(request.stop_conditions)) errors.push("stop_conditions must be non-empty string array");
  if (!isNonEmptyStringArray(request.allowed_files)) errors.push("allowed_files must be non-empty string array");
  if (!Array.isArray(request.allowed_operations) || request.allowed_operations.some((item) => item !== "APPDATA_PACKET_CREATION_REVIEW_ONLY")) {
    errors.push("allowed_operations must only include safe dry-run review operation");
  }
  if (!Array.isArray(request.prohibited_actions)) errors.push("prohibited_actions must be array");
  for (const action of prohibitedActions) {
    if (!request.prohibited_actions?.includes(action)) errors.push(`missing prohibited action ${action}`);
  }
  if (!isNonEmptyStringArray(request.expected_final_report_labels)) errors.push("expected_final_report_labels must be non-empty string array");
  if (request.no_executor_approval !== true) errors.push("no_executor_approval must be true");
  if (request.no_task_execution !== true) errors.push("no_task_execution must be true");
  return errors;
}

function resultErrors(result) {
  const errors = [];
  for (const field of missingRequired(resultSchema, result)) errors.push(`missing ${field}`);
  for (const field of extraProperties(resultSchema, result)) errors.push(`unexpected ${field}`);
  if (errors.length > 0) return errors;
  if (result.schema !== "lonewolf.file_queue.supervised_dry_run_result.v1") errors.push("bad schema");
  if (result.build_id !== BUILD_ID) errors.push("bad build_id");
  if (!isNonEmptyString(result.request_id)) errors.push("request_id must be non-empty");
  if (!isNonEmptyString(result.chain_id)) errors.push("chain_id must be non-empty");
  if (!isNonEmptyString(result.task_id)) errors.push("task_id must be non-empty");
  if (!resultSchema.properties.status.enum.includes(result.status)) errors.push("bad status");
  if (typeof result.accepted !== "boolean") errors.push("accepted must be boolean");
  if (!isNonEmptyStringArray(result.reasons)) errors.push("reasons must be non-empty string array");
  if (!resultSchema.properties.operation_class.enum.includes(result.operation_class)) errors.push("unsafe or unknown operation_class");
  if (!/^[A-Fa-f0-9]{64}$|^$/.test(result.task_json_sha256 ?? "")) errors.push("task_json_sha256 must be sha256 or empty");
  if (!/^[A-Fa-f0-9]{64}$|^$/.test(result.validator_report_sha256 ?? "")) errors.push("validator_report_sha256 must be sha256 or empty");
  if (!/^[A-Fa-f0-9]{64}$|^$/.test(result.output_packet_sha256 ?? "")) errors.push("output_packet_sha256 must be sha256 or empty");
  if (!isNonEmptyString(result.checked_at)) errors.push("checked_at must be non-empty");
  if (result.owner_gate_after_dry_run !== true) errors.push("owner_gate_after_dry_run must be true");
  if (result.owner_gate_before_next_task_generation !== true) errors.push("owner_gate_before_next_task_generation must be true");
  if (result.no_repetition_started !== true) errors.push("no_repetition_started must be true");
  if (result.no_runtime_or_persistent_watcher !== true) errors.push("no_runtime_or_persistent_watcher must be true");
  if (result.no_executor_approval !== true) errors.push("no_executor_approval must be true");
  if (result.no_task_execution !== true) errors.push("no_task_execution must be true");
  for (const field of resultSchema.properties.safety_summary.required) {
    if (result.safety_summary?.[field] !== true) errors.push(`safety_summary.${field} must be true`);
  }
  if (result.forbidden_actions_confirmation?.forbidden_actions_performed !== false) {
    errors.push("forbidden_actions_performed must be false");
  }
  if (!isNonEmptyStringArray(result.forbidden_actions_confirmation?.confirmed_absent)) {
    errors.push("confirmed_absent must be non-empty string array");
  }
  if (!resultSchema.properties.next_recommended_action.enum.includes(result.next_recommended_action)) errors.push("bad next_recommended_action");
  if (!isNonEmptyString(result.human_review_one_point)) errors.push("human_review_one_point must be non-empty");
  return errors;
}

assert.equal(requestSchema.additionalProperties, false, "request schema must reject unexpected fields");
assert.equal(requestSchema.build_id, BUILD_ID, "request schema top-level build_id must match");
assert.ok(requestSchema.$comment.includes(`BUILD_ID: ${BUILD_ID}`), "request schema must carry BUILD_ID comment");
assert.equal(requestSchema.properties.schema.const, "lonewolf.file_queue.supervised_dry_run_request.v1");
assert.deepEqual(requestSchema.properties.operation_class.enum, ["APPDATA_PACKET_CREATION_REVIEW_ONLY"]);
assert.equal(requestSchema.properties.no_executor_approval.const, true);
assert.equal(requestSchema.properties.no_task_execution.const, true);
for (const action of prohibitedActions) {
  assert.ok(requestSchema.properties.prohibited_actions.allOf.some((rule) => rule.contains?.const === action), `request schema must require ${action}`);
}

assert.equal(resultSchema.additionalProperties, false, "result schema must reject unexpected fields");
assert.equal(resultSchema.build_id, BUILD_ID, "result schema top-level build_id must match");
assert.ok(resultSchema.$comment.includes(`BUILD_ID: ${BUILD_ID}`), "result schema must carry BUILD_ID comment");
assert.equal(resultSchema.properties.schema.const, "lonewolf.file_queue.supervised_dry_run_result.v1");
assert.deepEqual(resultSchema.properties.operation_class.enum, ["APPDATA_PACKET_CREATION_REVIEW_ONLY"]);
assert.equal(resultSchema.properties.no_executor_approval.const, true);
assert.equal(resultSchema.properties.no_task_execution.const, true);
for (const field of [
  "no_executor_code",
  "no_task_execution",
  "no_shell_command_runner",
  "no_network",
  "no_private_api",
  "no_openai_api",
  "no_deploy",
  "no_cloud_mutation",
  "no_billing_mutation",
  "no_trading",
  "no_daemon_watcher",
  "no_ui_automation",
  "no_process_kill",
  "no_security_bypass",
  "no_repo_mutation",
  "no_secrets_output"
]) {
  assert.equal(resultSchema.properties.safety_summary.properties[field].const, true, `${field} must be const true`);
}

assert.deepEqual(requestErrors(validRequest), [], "valid supervised dry-run request must pass");
assert.deepEqual(resultErrors(validResult), [], "valid supervised dry-run result must pass");
assert.deepEqual(resultErrors(validFailedResult), [], "valid failed-safe result shape must pass");
assert.ok(requestErrors(invalidExtraFieldRequest).includes("unexpected auto_execute_enabled"), "extra auto execution field must fail");
assert.ok(requestErrors(invalidOperationRequest).includes("unsafe or unknown operation_class"), "unsafe operation class must fail");
assert.ok(requestErrors(invalidMissingValidatorSha).includes("missing validator_report_sha256"), "missing validator SHA must fail");
assert.ok(requestErrors(invalidRepoOutputRequest).includes("output_root must not be inside repo"), "repo output root must fail");
assert.ok(resultErrors(invalidForbiddenResult).includes("forbidden_actions_performed must be false"), "performed forbidden action result must fail");
assert.ok(resultErrors(invalidWatcherResult).includes("no_runtime_or_persistent_watcher must be true"), "runtime watcher result must fail");
assert.ok(resultErrors(invalidWatcherResult).includes("safety_summary.no_daemon_watcher must be true"), "daemon watcher safety flag must fail");
assert.ok(resultErrors(invalidMissingHumanReview).includes("missing human_review_one_point"), "missing human review point must fail");

for (const [path, title] of [
  ["docs/orchestration/file_queue_supervised_dry_run_request_result_contracts.md", "request result contracts"],
  ["docs/orchestration/file_queue_supervised_dry_run_owner_gates.md", "owner gates"],
  ["docs/orchestration/file_queue_supervised_dry_run_prohibited_actions.md", "prohibited actions"]
]) {
  const text = readText(path);
  assert.ok(text.startsWith(`<!-- BUILD_ID: ${BUILD_ID} -->`), `${title} doc must start with BUILD_ID`);
  assert.match(text, /no executor|No executor|executor code/i, `${title} doc must state executor boundary`);
  assert.match(text, /no task execution|not execute|does not execute/i, `${title} doc must state task execution boundary`);
  assert.match(text, /STOP_OWNER_REVIEW_REQUIRED|owner review/i, `${title} doc must require owner review`);
}

const contractDoc = readText("docs/orchestration/file_queue_supervised_dry_run_request_result_contracts.md");
assert.doesNotMatch(
  contractDoc,
  /node tools\/|npm run|wrangler\s+(?:deploy|d1|kv|r2|queue)|stripe\s+(?:listen|trigger|customers)|order placement/i,
  "contract docs must not recommend runtime commands"
);

console.log("file_queue_supervised_dry_run_contract_static: ok");
