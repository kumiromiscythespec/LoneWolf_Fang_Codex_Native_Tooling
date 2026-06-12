// BUILD_ID: 20260612_execution_interpreter_contract_tests_v1
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const sha256File = (path) => createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();

const requestSchema = readJson("schema/orchestration/file_queue_execution_request.schema.json");
const resultSchema = readJson("schema/orchestration/file_queue_execution_result.schema.json");
const validRequestFixture = readJson("tests/fixtures/file-queue/execution/valid/request_appdata_review_packet_only.json");
const unknownTaskTypeFixture = readJson("tests/fixtures/file-queue/execution/invalid/request_unknown_task_type.json");
const missingValidatorShaFixture = readJson("tests/fixtures/file-queue/execution/invalid/request_missing_validator_report_sha.json");
const validResultFixture = readJson("tests/fixtures/file-queue/execution/valid/execution_result_appdata_review_packet.json");

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

function missingRequired(schema, data) {
  return schema.required.filter((field) => !Object.hasOwn(data, field));
}

function assertNoExtraProperties(schema, data, name) {
  const allowed = new Set(Object.keys(schema.properties ?? {}));
  for (const key of Object.keys(data)) {
    assert.ok(allowed.has(key), `${name} has unexpected property ${key}`);
  }
}

function requestErrors(request) {
  const errors = [];
  for (const field of missingRequired(requestSchema, request)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  if (request.schema !== "lonewolf.file_queue.execution_request.v1") errors.push("bad schema");
  if (!isNonEmptyString(request.request_id)) errors.push("request_id must be non-empty");
  if (!isNonEmptyString(request.task_id)) errors.push("task_id must be non-empty");
  if (!requestSchema.properties.task_type.enum.includes(request.task_type)) errors.push("unsafe or unknown task_type");
  if (!requestSchema.properties.operation_class.enum.includes(request.operation_class)) errors.push("unsafe or unknown operation_class");
  if (!isNonEmptyString(request.task_json_path)) errors.push("task_json_path must be non-empty");
  if (!/^[A-Fa-f0-9]{64}$/.test(request.task_json_sha256 ?? "")) errors.push("task_json_sha256 must be sha256");
  if (!isNonEmptyString(request.validator_report_path)) errors.push("validator_report_path must be non-empty");
  if (!/^[A-Fa-f0-9]{64}$/.test(request.validator_report_sha256 ?? "")) {
    errors.push("validator_report_sha256 must be sha256");
  }
  if (request.expected_validator_status !== "VALID_DRY_RUN") errors.push("expected_validator_status must be VALID_DRY_RUN");
  if (request.expected_validator_accepted !== true) errors.push("expected_validator_accepted must be true");
  if (!isNonEmptyString(request.owner_approval_phrase)) errors.push("owner_approval_phrase must be non-empty");
  if (!requestSchema.properties.output_root_policy.enum.includes(request.output_root_policy)) errors.push("bad output_root_policy");
  if (!isNonEmptyStringArray(request.success_criteria)) errors.push("success_criteria must be non-empty string array");
  if (!isNonEmptyStringArray(request.stop_conditions)) errors.push("stop_conditions must be non-empty string array");
  if (!isNonEmptyStringArray(request.expected_final_report_labels)) {
    errors.push("expected_final_report_labels must be non-empty string array");
  }
  return errors;
}

function resultErrors(result) {
  const errors = [];
  for (const field of missingRequired(resultSchema, result)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  if (result.schema !== "lonewolf.file_queue.execution_result.v1") errors.push("bad schema");
  if (!isNonEmptyString(result.interpreter_build_id)) errors.push("interpreter_build_id must be non-empty");
  if (!isNonEmptyString(result.request_id)) errors.push("request_id must be non-empty");
  if (!isNonEmptyString(result.task_id)) errors.push("task_id must be non-empty");
  if (!resultSchema.properties.status.enum.includes(result.status)) errors.push("bad status");
  if (typeof result.accepted !== "boolean") errors.push("accepted must be boolean");
  if (!isNonEmptyStringArray(result.reasons)) errors.push("reasons must be non-empty string array");
  if (!isNonEmptyString(result.operation_class)) errors.push("operation_class must be non-empty");
  if (!/^[A-Fa-f0-9]{64}$|^$/.test(result.task_json_sha256 ?? "")) errors.push("task_json_sha256 must be sha256 or empty");
  if (!/^[A-Fa-f0-9]{64}$|^$/.test(result.validator_report_sha256 ?? "")) {
    errors.push("validator_report_sha256 must be sha256 or empty");
  }
  if (typeof result.output_packet_path !== "string") errors.push("output_packet_path must be string");
  if (!isNonEmptyString(result.checked_at)) errors.push("checked_at must be non-empty");
  if (result.safety_summary?.local_cli_only !== true) errors.push("safety_summary.local_cli_only must be true");
  if (result.safety_summary?.no_daemon !== true) errors.push("safety_summary.no_daemon must be true");
  if (result.safety_summary?.no_watcher !== true) errors.push("safety_summary.no_watcher must be true");
  if (result.safety_summary?.no_queue_loop !== true) errors.push("safety_summary.no_queue_loop must be true");
  if (result.safety_summary?.no_codex_cli !== true) errors.push("safety_summary.no_codex_cli must be true");
  if (result.safety_summary?.no_openai_api !== true) errors.push("safety_summary.no_openai_api must be true");
  if (result.safety_summary?.no_ui_bridge !== true) errors.push("safety_summary.no_ui_bridge must be true");
  if (result.safety_summary?.appdata_or_test_temp_output_only !== true) {
    errors.push("safety_summary.appdata_or_test_temp_output_only must be true");
  }
  if (result.safety_summary?.no_repo_mutation !== true) errors.push("safety_summary.no_repo_mutation must be true");
  if (!isNonEmptyStringArray(result.safety_summary?.forbidden_actions)) {
    errors.push("safety_summary.forbidden_actions must be non-empty string array");
  }
  if (result.forbidden_actions_confirmation?.forbidden_actions_performed !== false) {
    errors.push("forbidden_actions_performed must be false");
  }
  if (!isNonEmptyStringArray(result.forbidden_actions_confirmation?.confirmed_absent)) {
    errors.push("confirmed_absent must be non-empty string array");
  }
  if (!resultSchema.properties.next_recommended_action.enum.includes(result.next_recommended_action)) {
    errors.push("bad next_recommended_action");
  }
  return errors;
}

function gitStatusShort() {
  const result = spawnSync("git", ["status", "--short"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

function runInterpreter(requestPath, outRoot) {
  return spawnSync(
    process.execPath,
    [
      resolve(root, "tools/file_queue_execution_interpreter.mjs"),
      "--request",
      requestPath,
      "--out-root",
      outRoot
    ],
    {
      cwd: root,
      encoding: "utf8"
    }
  );
}

assert.equal(requestSchema.additionalProperties, false, "execution request schema must reject extra fields");
assert.ok(requestSchema.$comment?.includes("BUILD_ID:"), "execution request schema must carry BUILD_ID");
assert.deepEqual(requestSchema.properties.task_type.enum, ["APPDATA_REVIEW_PACKET_ONLY"]);
assert.deepEqual(requestSchema.properties.operation_class.enum, ["APPDATA_PACKET_CREATION"]);
assertNoExtraProperties(requestSchema, validRequestFixture, "request_appdata_review_packet_only.json");
assert.deepEqual(requestErrors(validRequestFixture), [], "valid execution request fixture must pass");
assert.ok(requestErrors(unknownTaskTypeFixture).includes("unsafe or unknown task_type"), "unknown task type fixture must fail");
assert.ok(
  requestErrors(missingValidatorShaFixture).includes("missing validator_report_sha256"),
  "missing validator report SHA fixture must fail"
);

assert.equal(resultSchema.additionalProperties, false, "execution result schema must reject extra fields");
assert.ok(resultSchema.$comment?.includes("BUILD_ID:"), "execution result schema must carry BUILD_ID");
assertNoExtraProperties(resultSchema, validResultFixture, "execution_result_appdata_review_packet.json");
assert.deepEqual(resultErrors(validResultFixture), [], "valid execution result fixture must pass");

const interpreterPath = resolve(root, "tools/file_queue_execution_interpreter.mjs");
assert.ok(existsSync(interpreterPath), "interpreter script must exist");
const interpreterSource = readFileSync(interpreterPath, "utf8");
assert.ok(interpreterSource.includes("NO_RUNNER_NO_DAEMON_NO_WATCHER_BOUNDARY"), "interpreter must expose no-runner boundary");
assert.ok(interpreterSource.includes("NO_SHELL_NO_CODEX_NO_OPENAI_BOUNDARY"), "interpreter must expose no-shell/no-Codex/no-OpenAI boundary");
assert.doesNotMatch(
  interpreterSource,
  /from\s+["'](?:node:)?(?:http|https|net|tls|dgram|child_process|worker_threads|cluster)["']/,
  "interpreter must not import network, process-launch, worker, or cluster modules"
);
assert.doesNotMatch(
  interpreterSource,
  /from\s+["'](?:openai|@openai\/[^"']+|playwright|puppeteer|selenium-webdriver|stripe|cloudflare|@octokit\/[^"']+|undici|node-fetch|axios)["']/i,
  "interpreter must not import provider, OpenAI, browser automation, payment, GitHub, or HTTP client SDK modules"
);
assert.doesNotMatch(
  interpreterSource,
  /\b(?:spawn|exec|execFile|fork|Worker|watch|watchFile|setInterval)\s*\(/,
  "interpreter must not expose shell, worker, daemon, watcher, or timer paths"
);
assert.doesNotMatch(interpreterSource, /file_queue_task_authoring_helper/i, "interpreter must not reference the task authoring helper");
assert.doesNotMatch(interpreterSource, /file_queue_dry_run_validator/i, "interpreter must not reference the dry-run validator");

const statusBefore = gitStatusShort();
const tempRoot = mkdtempSync(join(tmpdir(), "file-queue-execution-interpreter-"));
    const inputRoot = join(tempRoot, "inputs");
    const outRoot = join(tempRoot, "out");
    mkdirSync(inputRoot, { recursive: true });
const taskPath = join(inputRoot, "task.json");
const validatorPath = join(inputRoot, "validator_report.json");
const requestPath = join(inputRoot, "execution_request.json");

const task = {
  ...readJson("tests/fixtures/file-queue/valid/task_docs_only.json"),
  task_id: "exec_task_appdata_review_packet_only",
  owner_approval_phrase: "APPROVE_EXECUTION_INTERPRETER_STATIC_MVP"
};
const validatorReport = {
  ...readJson("tests/fixtures/file-queue/valid/validation_report_pass.json"),
  task_id: task.task_id,
  input_task_path: taskPath,
  status: "VALID_DRY_RUN",
  accepted: true
};
writeFileSync(taskPath, `${JSON.stringify(task, null, 2)}\n`, "utf8");
writeFileSync(validatorPath, `${JSON.stringify(validatorReport, null, 2)}\n`, "utf8");

const request = {
  ...validRequestFixture,
  request_id: "exec_request_temp_appdata_review_packet_only",
  task_id: task.task_id,
  task_json_path: taskPath,
  task_json_sha256: sha256File(taskPath),
  validator_report_path: validatorPath,
  validator_report_sha256: sha256File(validatorPath),
  output_root_policy: "TEST_TEMP_ONLY",
  owner_approval_phrase: task.owner_approval_phrase
};
writeFileSync(requestPath, `${JSON.stringify(request, null, 2)}\n`, "utf8");

const validRun = runInterpreter(requestPath, outRoot);
assert.equal(validRun.status, 0, validRun.stderr || validRun.stdout);
const outputNames = readdirSync(outRoot).sort();
const outputDirs = outputNames.filter((name) => statSync(join(outRoot, name)).isDirectory());
const outputReports = outputNames.filter((name) => name.endsWith(".json"));
assert.equal(outputDirs.length, 1, "interpreter must write one review packet directory");
assert.equal(outputReports.length, 1, "interpreter must write one execution result report");
const packetPath = resolve(outRoot, outputDirs[0]);
const resultPath = resolve(outRoot, outputReports[0]);
assert.ok(packetPath.startsWith(resolve(outRoot)), "review packet must stay under temp output root");
assert.ok(resultPath.startsWith(resolve(outRoot)), "result report must stay under temp output root");
const generatedResult = JSON.parse(readFileSync(resultPath, "utf8"));
assert.equal(generatedResult.status, "EXECUTION_COMPLETED");
assert.equal(generatedResult.accepted, true);
assert.deepEqual(resultErrors(generatedResult), [], "generated execution result must validate");

const unknownRequestPath = resolve(root, "tests/fixtures/file-queue/execution/invalid/request_unknown_task_type.json");
const unknownRun = runInterpreter(unknownRequestPath, join(tempRoot, "unknown-out"));
assert.notEqual(unknownRun.status, 0, "unknown task type must fail");

const missingShaRequestPath = resolve(root, "tests/fixtures/file-queue/execution/invalid/request_missing_validator_report_sha.json");
const missingShaRun = runInterpreter(missingShaRequestPath, join(tempRoot, "missing-sha-out"));
assert.notEqual(missingShaRun.status, 0, "missing validator report SHA must fail");

for (const repoQueueFolder of [
  "queue",
  "queues",
  "file_queue_runtime",
  "file_queue_outbox",
  ".file_queue"
]) {
  assert.equal(existsSync(resolve(root, repoQueueFolder)), false, `${repoQueueFolder} must not be created in repo`);
}

assert.equal(gitStatusShort(), statusBefore, "interpreter tests must not mutate the repository");

console.log("file_queue_execution_interpreter_contract_static: ok");
