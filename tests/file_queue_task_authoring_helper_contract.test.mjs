// BUILD_ID: 20260612_file_queue_task_authoring_helper_contract_tests_v1
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

const authorRequestSchema = readJson("schema/orchestration/file_queue_task_author_request.schema.json");
const authorOutputSchema = readJson("schema/orchestration/file_queue_task_author_output.schema.json");
const taskSchema = readJson("schema/orchestration/file_queue_task.schema.json");
const validRequest = readJson("tests/fixtures/file-queue/authoring/valid/request_review_packet_only.json");
const invalidRuntimeRequest = readJson("tests/fixtures/file-queue/authoring/invalid/request_forbidden_runtime.json");
const authoredTaskFixture = readJson("tests/fixtures/file-queue/authoring/valid/authored_task_docs_only.json");

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

const safeTaskTypes = [
  "APPDATA_REVIEW_PACKET_ONLY",
  "APPROVAL_PACKET_ONLY",
  "DOCS_SCHEMA_STATIC_TESTS_ONLY",
  "READ_ONLY_INVENTORY_ONLY",
  "PUSH_APPROVAL_PACKET_ONLY",
  "PUSH_EXECUTION_ONLY"
];

const safeModes = [
  "docs_only",
  "schema_tests_only",
  "static_validation_only",
  "artifact_handoff_only"
];

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

function authorRequestErrors(request) {
  const errors = [];
  for (const field of missingRequired(authorRequestSchema, request)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  if (request.schema !== "lonewolf.file_queue.task_author_request.v1") errors.push("bad schema");
  if (!isNonEmptyString(request.request_id)) errors.push("request_id must be non-empty");
  if (!isNonEmptyString(request.task_id)) errors.push("task_id must be non-empty");
  if (!isNonEmptyString(request.title)) errors.push("title must be non-empty");
  if (!isNonEmptyString(request.target_repo)) errors.push("target_repo must be non-empty");
  if (!safeTaskTypes.includes(request.task_type)) errors.push("unsafe or unknown task_type");
  if (!safeModes.includes(request.mode)) errors.push("unsafe or unknown mode");
  if (!isStringArray(request.allowed_files) || request.allowed_files.length === 0) errors.push("allowed_files must be non-empty string array");
  if (new Set(request.allowed_files).size !== request.allowed_files.length) errors.push("allowed_files must be unique");
  if (!isNonEmptyString(request.owner_approval_phrase)) errors.push("owner_approval_phrase must be non-empty");
  if (!isStringArray(request.success_criteria) || request.success_criteria.length === 0) {
    errors.push("success_criteria must be non-empty string array");
  }
  if (!isStringArray(request.stop_conditions) || request.stop_conditions.length === 0) {
    errors.push("stop_conditions must be non-empty string array");
  }
  if (!isStringArray(request.artifact_requirements) || request.artifact_requirements.length === 0) {
    errors.push("artifact_requirements must be non-empty string array");
  }
  if (!isStringArray(request.expected_final_report_labels) || request.expected_final_report_labels.length === 0) {
    errors.push("expected_final_report_labels must be non-empty string array");
  }
  if (!authorRequestSchema.properties.output_root_policy.enum.includes(request.output_root_policy)) {
    errors.push("bad output_root_policy");
  }
  return errors;
}

function taskErrors(task) {
  const errors = [];
  for (const field of missingRequired(taskSchema, task)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  if (task.schema !== "lonewolf.file_queue.task.v1") errors.push("bad schema");
  if (!safeModes.includes(task.mode)) errors.push("unsafe or unknown mode");
  if (!isStringArray(task.allowed_files) || task.allowed_files.length === 0) errors.push("allowed_files must be non-empty string array");
  if (!isStringArray(task.forbidden_actions) || !hasAllForbiddenActions(task.forbidden_actions)) {
    errors.push("forbidden action coverage incomplete");
  }
  if (!isStringArray(task.success_criteria) || task.success_criteria.length === 0) {
    errors.push("success_criteria must be non-empty string array");
  }
  if (!isStringArray(task.stop_conditions) || task.stop_conditions.length === 0) {
    errors.push("stop_conditions must be non-empty string array");
  }
  if (!isNonEmptyString(task.owner_approval_phrase)) errors.push("owner_approval_phrase must be non-empty");
  if (!isStringArray(task.artifact_requirements) || task.artifact_requirements.length === 0) {
    errors.push("artifact_requirements must be non-empty string array");
  }
  if (!isStringArray(task.expected_final_report_labels) || task.expected_final_report_labels.length === 0) {
    errors.push("expected_final_report_labels must be non-empty string array");
  }
  return errors;
}

function authorOutputErrors(output, requireWrittenPaths = false) {
  const errors = [];
  for (const field of missingRequired(authorOutputSchema, output)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  if (output.schema !== "lonewolf.file_queue.task_author_output.v1") errors.push("bad schema");
  if (!isNonEmptyString(output.helper_build_id)) errors.push("helper_build_id must be non-empty");
  if (!isNonEmptyString(output.request_id)) errors.push("request_id must be non-empty");
  if (!isNonEmptyString(output.task_id)) errors.push("task_id must be non-empty");
  if (!authorOutputSchema.properties.status.enum.includes(output.status)) errors.push("bad status");
  if (typeof output.accepted !== "boolean") errors.push("accepted must be boolean");
  if (!isStringArray(output.reasons) || output.reasons.length === 0) errors.push("reasons must be non-empty string array");
  if (typeof output.output_task_path !== "string") errors.push("output_task_path must be string");
  if (typeof output.preview_path !== "string") errors.push("preview_path must be string");
  if (requireWrittenPaths && (!isNonEmptyString(output.output_task_path) || !isNonEmptyString(output.preview_path))) {
    errors.push("success output paths must be non-empty");
  }
  if (!isNonEmptyString(output.checked_at)) errors.push("checked_at must be non-empty");
  if (output.safety_summary?.author_only !== true) errors.push("safety_summary.author_only must be true");
  if (!isNonEmptyString(output.safety_summary?.output_root_policy)) errors.push("safety_summary.output_root_policy must be non-empty");
  if (!hasAllForbiddenActions(output.safety_summary?.forbidden_actions ?? [])) {
    errors.push("safety_summary forbidden action coverage incomplete");
  }
  if (!authorOutputSchema.properties.next_recommended_action.enum.includes(output.next_recommended_action)) {
    errors.push("bad next_recommended_action");
  }
  return errors;
}

function runHelper(requestPath) {
  const outRoot = mkdtempSync(join(tmpdir(), "file-queue-task-author-"));
  const result = spawnSync(
    process.execPath,
    [
      resolve(root, "tools/file_queue_task_authoring_helper.mjs"),
      "--request",
      resolve(root, requestPath),
      "--out-root",
      outRoot
    ],
    {
      cwd: root,
      encoding: "utf8"
    }
  );
  return { outRoot, result, outputFiles: readdirSync(outRoot) };
}

function gitStatusShort() {
  const result = spawnSync("git", ["status", "--short"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

for (const [schema, name] of [
  [authorRequestSchema, "author request schema"],
  [authorOutputSchema, "author output schema"]
]) {
  assertBuildId(schema, name);
  assert.equal(schema.additionalProperties, false, `${name} must reject extra fields`);
}

for (const field of [
  "schema",
  "request_id",
  "task_id",
  "title",
  "target_repo",
  "task_type",
  "mode",
  "allowed_files",
  "owner_approval_phrase",
  "success_criteria",
  "stop_conditions",
  "artifact_requirements",
  "expected_final_report_labels",
  "output_root_policy"
]) {
  assert.ok(requiredFields(authorRequestSchema).includes(field), `author request schema missing required field ${field}`);
}

assert.deepEqual(authorRequestSchema.properties.task_type.enum, safeTaskTypes, "author request schema safe task types changed");
for (const unsafeTaskType of [
  "RUNTIME_EXECUTION",
  "LIVE_OR_PAPER_TRADING",
  "PRIVATE_API",
  "DEPLOY",
  "PROVIDER_MUTATION",
  "FILE_QUEUE_CONSUMER",
  "CODEX_CLI_BRIDGE",
  "UI_BRIDGE",
  "BACKGROUND_AUTOMATION"
]) {
  assert.equal(authorRequestSchema.properties.task_type.enum.includes(unsafeTaskType), false, `${unsafeTaskType} must not be authorable`);
}
assert.deepEqual(authorRequestSchema.properties.mode.enum, safeModes, "author request schema safe modes changed");
assert.deepEqual(
  authorOutputSchema.properties.status.enum,
  [
    "TASK_DRAFTED",
    "INVALID_REQUEST",
    "UNSAFE_TASK_TYPE",
    "MISSING_OWNER_APPROVAL",
    "MISSING_STOP_CONDITIONS",
    "FAILED_SAFE"
  ],
  "author output statuses must match approved contract"
);

assertNoExtraProperties(authorRequestSchema, validRequest, "request_review_packet_only.json");
assert.deepEqual(authorRequestErrors(validRequest), [], "request_review_packet_only.json must pass author request checks");
assertNoExtraProperties(authorRequestSchema, invalidRuntimeRequest, "request_forbidden_runtime.json");
assert.ok(
  authorRequestErrors(invalidRuntimeRequest).includes("unsafe or unknown task_type"),
  "request_forbidden_runtime.json must fail task_type enum validation"
);

assertNoExtraProperties(taskSchema, authoredTaskFixture, "authored_task_docs_only.json");
assert.deepEqual(taskErrors(authoredTaskFixture), [], "authored_task_docs_only.json must validate as file queue task");

const helperPath = resolve(root, "tools/file_queue_task_authoring_helper.mjs");
assert.ok(existsSync(helperPath), "helper script must exist");
const helperSource = readFileSync(helperPath, "utf8");
assert.ok(helperSource.includes("AUTHOR_ONLY_BOUNDARY"), "helper must expose author-only boundary text");
assert.ok(helperSource.includes("FORBIDDEN_ACTION_BASELINE"), "helper must carry forbidden action baseline");
assert.doesNotMatch(
  helperSource,
  /from\s+["'](?:node:)?(?:http|https|net|tls|dgram|worker_threads|cluster)["']/,
  "helper must not import network or worker modules"
);
assert.doesNotMatch(
  helperSource,
  /from\s+["'](?:openai|@openai\/[^"']+|playwright|puppeteer|selenium-webdriver|stripe|cloudflare|@octokit\/[^"']+|undici|node-fetch|axios)["']/i,
  "helper must not import provider, browser automation, payment, GitHub, or HTTP client SDK modules"
);
assert.doesNotMatch(helperSource, /\b(?:spawn|exec|execFile|fork|Worker|watch|watchFile|setInterval)\s*\(/, "helper must not expose worker, daemon, watcher, or shell execution paths");
assert.doesNotMatch(helperSource, /file_queue_dry_run_validator/i, "helper must not reference or run the dry-run validator");

const statusBefore = gitStatusShort();
const validRun = runHelper("tests/fixtures/file-queue/authoring/valid/request_review_packet_only.json");
assert.equal(validRun.result.status, 0, validRun.result.stderr || validRun.result.stdout);
assert.deepEqual(
  validRun.outputFiles.sort(),
  [
    "author_output_authored_task_docs_only_task_drafted.json",
    "preview_authored_task_docs_only.md",
    "task_authored_task_docs_only.json"
  ],
  "valid helper run must write exactly one task JSON, one preview, and one author output report"
);

const generatedTaskPath = resolve(validRun.outRoot, "task_authored_task_docs_only.json");
const generatedPreviewPath = resolve(validRun.outRoot, "preview_authored_task_docs_only.md");
const generatedReportPath = resolve(validRun.outRoot, "author_output_authored_task_docs_only_task_drafted.json");
for (const outputPath of [generatedTaskPath, generatedPreviewPath, generatedReportPath]) {
  assert.ok(outputPath.startsWith(resolve(validRun.outRoot)), "helper output must stay under temp root");
  assert.equal(statSync(outputPath).isFile(), true, `${outputPath} must be a file`);
}

const generatedTask = JSON.parse(readFileSync(generatedTaskPath, "utf8"));
assert.deepEqual(generatedTask, authoredTaskFixture, "generated task must match authored task fixture");
assert.deepEqual(taskErrors(generatedTask), [], "generated task must validate against file_queue_task schema");
assert.ok(hasAllForbiddenActions(generatedTask.forbidden_actions), "generated task must contain full forbidden action baseline");
assert.ok(generatedTask.stop_conditions.length > 0, "generated task must contain stop conditions");
assert.ok(generatedTask.success_criteria.length > 0, "generated task must contain success criteria");

const generatedReport = JSON.parse(readFileSync(generatedReportPath, "utf8"));
assert.equal(generatedReport.status, "TASK_DRAFTED");
assert.equal(generatedReport.accepted, true);
assert.deepEqual(authorOutputErrors(generatedReport, true), [], "generated author output report must validate");

const invalidRun = runHelper("tests/fixtures/file-queue/authoring/invalid/request_forbidden_runtime.json");
assert.notEqual(invalidRun.result.status, 0, "forbidden runtime request must fail");
assert.deepEqual(
  invalidRun.outputFiles.sort(),
  ["author_output_forbidden_runtime_private_api_task_unsafe_task_type.json"],
  "invalid helper run must write only one safe failure report"
);
const invalidReport = JSON.parse(readFileSync(resolve(invalidRun.outRoot, invalidRun.outputFiles[0]), "utf8"));
assert.equal(invalidReport.status, "UNSAFE_TASK_TYPE");
assert.equal(invalidReport.accepted, false);
assert.deepEqual(authorOutputErrors(invalidReport), [], "invalid author output report must validate");

for (const repoQueueFolder of [
  "queue",
  "queues",
  "file_queue_runtime",
  "file_queue_outbox",
  ".file_queue"
]) {
  assert.equal(existsSync(resolve(root, repoQueueFolder)), false, `${repoQueueFolder} must not be created in repo`);
}

assert.equal(gitStatusShort(), statusBefore, "helper test runs must not mutate the repository");

console.log("file_queue_task_authoring_helper_contract_static: ok");
