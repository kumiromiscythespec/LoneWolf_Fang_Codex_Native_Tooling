// BUILD_ID: 20260612_file_queue_dry_run_validator_contract_tests_v1
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

const reportSchema = readJson("schema/orchestration/file_queue_validation_report.schema.json");
const validReport = readJson("tests/fixtures/file-queue/valid/validation_report_pass.json");
const invalidMissingReason = readJson("tests/fixtures/file-queue/invalid/validation_report_missing_reason.json");

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function validateSection(section, name) {
  const errors = [];
  if (!section || typeof section !== "object" || Array.isArray(section)) {
    return [`${name} must be object`];
  }
  const keys = Object.keys(section);
  for (const key of keys) {
    if (!["passed", "messages"].includes(key)) errors.push(`${name} unexpected ${key}`);
  }
  if (typeof section.passed !== "boolean") errors.push(`${name}.passed must be boolean`);
  if (!Array.isArray(section.messages) || section.messages.length === 0 || !section.messages.every(isNonEmptyString)) {
    errors.push(`${name}.messages must be non-empty string array`);
  }
  return errors;
}

function validationReportErrors(report) {
  const errors = [];
  for (const field of reportSchema.required) {
    if (!Object.hasOwn(report, field)) errors.push(`missing ${field}`);
  }
  if (errors.length > 0) return errors;
  const allowed = new Set(Object.keys(reportSchema.properties));
  for (const key of Object.keys(report)) {
    if (!allowed.has(key)) errors.push(`unexpected ${key}`);
  }
  if (report.schema !== "lonewolf.file_queue.validation_report.v1") errors.push("bad schema");
  if (!isNonEmptyString(report.validator_build_id)) errors.push("validator_build_id must be non-empty");
  if (!isNonEmptyString(report.task_id)) errors.push("task_id must be non-empty");
  if (!reportSchema.properties.status.enum.includes(report.status)) errors.push("bad status");
  if (typeof report.accepted !== "boolean") errors.push("accepted must be boolean");
  if (!Array.isArray(report.reasons) || report.reasons.length === 0 || !report.reasons.every(isNonEmptyString)) {
    errors.push("reasons must be non-empty string array");
  }
  if (!isNonEmptyString(report.checked_at)) errors.push("checked_at must be non-empty");
  if (!isNonEmptyString(report.input_task_path)) errors.push("input_task_path must be non-empty");
  if (!isNonEmptyString(report.output_packet_path)) errors.push("output_packet_path must be non-empty");
  for (const name of [
    "schema_validation",
    "forbidden_action_validation",
    "stop_condition_validation",
    "artifact_requirement_validation",
    "owner_review_validation",
    "safety_gate_validation"
  ]) {
    errors.push(...validateSection(report[name], name));
  }
  if (!reportSchema.properties.next_recommended_action.enum.includes(report.next_recommended_action)) {
    errors.push("bad next_recommended_action");
  }
  return errors;
}

function runValidator(taskPath) {
  const outRoot = mkdtempSync(join(tmpdir(), "file-queue-dry-run-validator-"));
  const result = spawnSync(
    process.execPath,
    [
      resolve(root, "tools/file_queue_dry_run_validator.mjs"),
      "--task",
      resolve(root, taskPath),
      "--out-root",
      outRoot
    ],
    {
      cwd: root,
      encoding: "utf8"
    }
  );
  const outputFiles = readdirSync(outRoot).filter((name) => name.endsWith(".json"));
  return { outRoot, result, outputFiles };
}

function assertOneReportUnderTemp(run) {
  assert.equal(run.outputFiles.length, 1, "validator must write exactly one JSON report");
  const reportPath = resolve(run.outRoot, run.outputFiles[0]);
  assert.ok(reportPath.startsWith(resolve(run.outRoot)), "report must stay under temp output root");
  assert.equal(statSync(reportPath).isFile(), true, "report output must be a file");
  return readJson(reportPath);
}

assert.equal(reportSchema.additionalProperties, false, "validation report schema must reject extra fields");
assert.ok(reportSchema.$comment?.includes("BUILD_ID:"), "validation report schema must carry BUILD_ID");
assert.deepEqual(
  reportSchema.properties.status.enum,
  [
    "VALID_DRY_RUN",
    "INVALID_SCHEMA",
    "UNSAFE_FORBIDDEN_ACTIONS",
    "MISSING_STOP_CONDITIONS",
    "MISSING_ARTIFACT_REQUIREMENTS",
    "OWNER_REVIEW_REQUIRED",
    "FAILED_SAFE"
  ],
  "validation report statuses must match the approved contract"
);

assert.deepEqual(validationReportErrors(validReport), [], "valid validation_report_pass.json must pass");
assert.ok(
  validationReportErrors(invalidMissingReason).includes("missing reasons"),
  "validation_report_missing_reason.json must fail missing reasons"
);

const validatorPath = resolve(root, "tools/file_queue_dry_run_validator.mjs");
assert.ok(existsSync(validatorPath), "validator script must exist");
const validatorSource = readFileSync(validatorPath, "utf8");
assert.ok(validatorSource.includes("DRY_RUN_ONLY_BOUNDARY"), "validator must expose dry-run-only boundary text");
assert.doesNotMatch(
  validatorSource,
  /from\s+["'](?:node:)?(?:http|https|net|tls|dgram|child_process|worker_threads|cluster)["']/,
  "validator must not import network or process-launch modules"
);
assert.doesNotMatch(
  validatorSource,
  /from\s+["'](?:openai|@openai\/[^"']+|playwright|puppeteer|selenium-webdriver|stripe|cloudflare|@octokit\/[^"']+)["']/i,
  "validator must not import provider, OpenAI, browser automation, payment, or GitHub SDK modules"
);
assert.doesNotMatch(validatorSource, /\b(?:spawn|exec|execFile|fork|Worker|watch|watchFile|setInterval)\s*\(/, "validator must not expose worker, daemon, watcher, or shell execution paths");

const validRun = runValidator("tests/fixtures/file-queue/valid/task_docs_only.json");
assert.equal(validRun.result.status, 0, validRun.stderr || validRun.stdout);
const validGeneratedReport = assertOneReportUnderTemp(validRun);
assert.equal(validGeneratedReport.status, "VALID_DRY_RUN");
assert.equal(validGeneratedReport.accepted, true);
assert.deepEqual(validationReportErrors(validGeneratedReport), [], "generated valid report must pass schema checks");

const unsafeRun = runValidator("tests/fixtures/file-queue/invalid/task_allows_live_order.json");
assert.notEqual(unsafeRun.result.status, 0, "unsafe task must fail dry-run validation");
const unsafeGeneratedReport = assertOneReportUnderTemp(unsafeRun);
assert.equal(unsafeGeneratedReport.status, "UNSAFE_FORBIDDEN_ACTIONS");
assert.equal(unsafeGeneratedReport.accepted, false);

const missingStopRun = runValidator("tests/fixtures/file-queue/invalid/task_missing_stop_conditions.json");
assert.notEqual(missingStopRun.result.status, 0, "task missing stop_conditions must fail dry-run validation");
const missingStopReport = assertOneReportUnderTemp(missingStopRun);
assert.equal(missingStopReport.status, "MISSING_STOP_CONDITIONS");
assert.equal(missingStopReport.accepted, false);

for (const repoQueueFolder of [
  "queue",
  "queues",
  "file_queue_runtime",
  "file_queue_outbox",
  ".file_queue"
]) {
  assert.equal(existsSync(resolve(root, repoQueueFolder)), false, `${repoQueueFolder} must not be created in repo`);
}

console.log("file_queue_dry_run_validator_contract_static: ok");
