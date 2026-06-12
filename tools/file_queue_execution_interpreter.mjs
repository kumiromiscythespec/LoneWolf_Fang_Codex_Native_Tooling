// BUILD_ID: 20260612_execution_interpreter_static_mvp_v1
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const INTERPRETER_BUILD_ID = "20260612_file_queue_execution_interpreter_static_mvp_v1";
const EXECUTION_REQUEST_SCHEMA_ID = "lonewolf.file_queue.execution_request.v1";
const EXECUTION_RESULT_SCHEMA_ID = "lonewolf.file_queue.execution_result.v1";
const NO_RUNNER_NO_DAEMON_NO_WATCHER_BOUNDARY =
  "local-only execution interpreter; no runner, daemon, watcher, consumer, queue loop, worker, or background process";
const NO_SHELL_NO_CODEX_NO_OPENAI_BOUNDARY =
  "no shell command from task text, no Codex CLI, no OpenAI API, no browser or UI bridge";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const safeTaskTypes = ["APPDATA_REVIEW_PACKET_ONLY"];
const safeOperationClasses = ["APPDATA_PACKET_CREATION"];
const outputRootPolicies = [
  "APPDATA_OR_TEST_TEMP_ONLY",
  "APPDATA_ONLY",
  "TEST_TEMP_ONLY"
];
const requiredRequestFields = [
  "schema",
  "request_id",
  "task_id",
  "task_type",
  "operation_class",
  "task_json_path",
  "task_json_sha256",
  "validator_report_path",
  "validator_report_sha256",
  "expected_validator_status",
  "expected_validator_accepted",
  "owner_approval_phrase",
  "output_root_policy",
  "success_criteria",
  "stop_conditions",
  "expected_final_report_labels"
];
const optionalRequestFields = ["build_id"];
const sha256Pattern = /^[A-Fa-f0-9]{64}$/;
const forbiddenActions = [
  "runner",
  "daemon",
  "watcher",
  "queue_loop",
  "codex_cli",
  "openai_api",
  "ui_bridge",
  "repo_mutation",
  "provider_mutation",
  "private_api",
  "deploy",
  "paper_live_order",
  "secrets_output"
];

function parseArgs(argv) {
  const args = { request: null, outRoot: null, help: false, unknown: null };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--request") {
      args.request = argv[++index] ?? null;
    } else if (item === "--out-root") {
      args.outRoot = argv[++index] ?? null;
    } else if (item === "--help" || item === "-h") {
      args.help = true;
    } else {
      args.unknown = item;
    }
  }
  return args;
}

function usage() {
  return [
    "Usage: node tools/file_queue_execution_interpreter.mjs --request <execution_request_json_path> --out-root <output_root>",
    NO_RUNNER_NO_DAEMON_NO_WATCHER_BOUNDARY,
    NO_SHELL_NO_CODEX_NO_OPENAI_BOUNDARY
  ].join("\n");
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

function safeName(value, fallback) {
  return String(value || fallback).replace(/[^A-Za-z0-9_.-]/g, "_");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();
}

function isPathInsideOrEqual(child, parent) {
  const relativePath = relative(resolve(parent), resolve(child));
  return relativePath === "" || (!relativePath.startsWith("..") && !relativePath.startsWith(sep) && relativePath !== "..");
}

function appDataRoot() {
  if (process.platform === "win32") {
    return process.env.LOCALAPPDATA
      ? join(process.env.LOCALAPPDATA, "LoneWolfFang", "data")
      : "C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data";
  }
  if (process.env.LOCALAPPDATA) return join(process.env.LOCALAPPDATA, "LoneWolfFang", "data");
  return "";
}

function tempRoots() {
  return [process.env.TMPDIR, process.env.TEMP, process.env.TMP, tmpdir(), "/tmp", "C:\\Windows\\Temp"].filter(Boolean);
}

function validateOutputRoot(outRoot, policy) {
  const resolvedOutRoot = resolve(outRoot);
  const errors = [];
  if (isPathInsideOrEqual(resolvedOutRoot, repoRoot)) {
    errors.push("out-root must be outside the repository");
  }

  const appRoot = appDataRoot();
  const underAppData = appRoot ? isPathInsideOrEqual(resolvedOutRoot, appRoot) : false;
  const underTemp = tempRoots().some((root) => isPathInsideOrEqual(resolvedOutRoot, root));

  if (policy === "APPDATA_ONLY" && !underAppData) {
    errors.push("out-root must be under the configured AppData artifact root");
  } else if (policy === "TEST_TEMP_ONLY" && !underTemp) {
    errors.push("out-root must be under a temp directory");
  } else if (policy === "APPDATA_OR_TEST_TEMP_ONLY" && !underAppData && !underTemp) {
    errors.push("out-root must be under the configured AppData artifact root or a temp directory");
  } else if (!outputRootPolicies.includes(policy)) {
    errors.push("output_root_policy is not supported");
  }

  return errors;
}

function missingRequired(data) {
  return requiredRequestFields.filter((field) => !Object.hasOwn(data, field));
}

function validateRequest(request) {
  const errors = [];
  const taskTypeErrors = [];
  const operationErrors = [];

  if (!request || typeof request !== "object" || Array.isArray(request)) {
    return { status: "INVALID_REQUEST", reasons: ["request must be an object"] };
  }

  const allowedKeys = new Set([...requiredRequestFields, ...optionalRequestFields]);
  for (const key of Object.keys(request)) {
    if (!allowedKeys.has(key)) errors.push(`unexpected property ${key}`);
  }
  for (const field of missingRequired(request)) errors.push(`missing ${field}`);
  if (errors.length > 0) return { status: "INVALID_REQUEST", reasons: errors };

  if (request.schema !== EXECUTION_REQUEST_SCHEMA_ID) errors.push("bad schema");
  if (!isNonEmptyString(request.request_id)) errors.push("request_id must be non-empty");
  if (!isNonEmptyString(request.task_id)) errors.push("task_id must be non-empty");
  if (!safeTaskTypes.includes(request.task_type)) taskTypeErrors.push("unsafe or unknown task_type");
  if (!safeOperationClasses.includes(request.operation_class)) operationErrors.push("unsafe or unknown operation_class");
  if (!isNonEmptyString(request.task_json_path)) errors.push("task_json_path must be non-empty");
  if (!sha256Pattern.test(request.task_json_sha256 ?? "")) errors.push("task_json_sha256 must be a SHA256 string");
  if (!isNonEmptyString(request.validator_report_path)) errors.push("validator_report_path must be non-empty");
  if (!sha256Pattern.test(request.validator_report_sha256 ?? "")) {
    errors.push("validator_report_sha256 must be a SHA256 string");
  }
  if (request.expected_validator_status !== "VALID_DRY_RUN") errors.push("expected_validator_status must be VALID_DRY_RUN");
  if (request.expected_validator_accepted !== true) errors.push("expected_validator_accepted must be true");
  if (!isNonEmptyString(request.owner_approval_phrase)) errors.push("owner_approval_phrase must be non-empty");
  if (!outputRootPolicies.includes(request.output_root_policy)) errors.push("output_root_policy is not supported");
  if (!isNonEmptyStringArray(request.success_criteria)) errors.push("success_criteria must be non-empty string array");
  if (!isNonEmptyStringArray(request.stop_conditions)) errors.push("stop_conditions must be non-empty string array");
  if (!isNonEmptyStringArray(request.expected_final_report_labels)) {
    errors.push("expected_final_report_labels must be non-empty string array");
  }

  if (taskTypeErrors.length > 0) return { status: "UNSAFE_TASK_TYPE", reasons: taskTypeErrors };
  if (operationErrors.length > 0) return { status: "UNSAFE_OPERATION_CLASS", reasons: operationErrors };
  if (errors.length > 0) return { status: "INVALID_REQUEST", reasons: errors };
  return { status: "EXECUTION_COMPLETED", reasons: ["Execution request passed static safety checks."] };
}

function nextActionFor(status) {
  if (status === "EXECUTION_COMPLETED") return "OWNER_REVIEW_REQUIRED";
  if (status === "FAILED_SAFE") return "FAILED_SAFE";
  if (status === "STOP_OWNER_REVIEW_REQUIRED") return "STOP_OWNER_REVIEW_REQUIRED";
  return "REPAIR_EXECUTION_REQUEST";
}

function buildResult({ request, status, reasons, outputPacketPath = "" }) {
  return {
    schema: EXECUTION_RESULT_SCHEMA_ID,
    interpreter_build_id: INTERPRETER_BUILD_ID,
    request_id: request?.request_id || "UNKNOWN_REQUEST",
    task_id: request?.task_id || "UNKNOWN_TASK",
    status,
    accepted: status === "EXECUTION_COMPLETED",
    reasons: reasons.length > 0 ? reasons : [status],
    operation_class: request?.operation_class || "UNKNOWN_OPERATION_CLASS",
    task_json_sha256: request?.task_json_sha256 || "",
    validator_report_sha256: request?.validator_report_sha256 || "",
    output_packet_path: outputPacketPath,
    checked_at: new Date().toISOString(),
    safety_summary: {
      local_cli_only: true,
      no_daemon: true,
      no_watcher: true,
      no_queue_loop: true,
      no_codex_cli: true,
      no_openai_api: true,
      no_ui_bridge: true,
      appdata_or_test_temp_output_only: true,
      no_repo_mutation: true,
      forbidden_actions: forbiddenActions
    },
    forbidden_actions_confirmation: {
      forbidden_actions_performed: false,
      confirmed_absent: forbiddenActions
    },
    next_recommended_action: nextActionFor(status)
  };
}

function resultFileName(request, status) {
  return `execution_result_${safeName(request?.request_id, "unknown_request")}_${status.toLowerCase()}.json`;
}

function writeResult(outRoot, result) {
  mkdirSync(outRoot, { recursive: true });
  const resultPath = join(outRoot, resultFileName(result, result.status));
  writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  return resultPath;
}

function canWriteFailure(outRoot) {
  return Boolean(outRoot) && !isPathInsideOrEqual(resolve(outRoot), repoRoot);
}

function writeReviewPacket(outRoot, request, task, validatorReport) {
  const packetDir = join(outRoot, `execution_review_${safeName(request.request_id, "request")}`);
  mkdirSync(packetDir, { recursive: true });
  const manifest = {
    packet: `execution_review_${request.request_id}`,
    interpreter_build_id: INTERPRETER_BUILD_ID,
    request_id: request.request_id,
    task_id: request.task_id,
    task_type: request.task_type,
    operation_class: request.operation_class,
    task_json_sha256: request.task_json_sha256,
    validator_report_sha256: request.validator_report_sha256,
    validator_status: validatorReport.status,
    validator_accepted: validatorReport.accepted,
    forbidden_actions_performed: false
  };
  writeFileSync(join(packetDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  writeFileSync(
    join(packetDir, "safe_summary.md"),
    [
      "# Execution Review Packet",
      "",
      `Request ID: ${request.request_id}`,
      `Task ID: ${request.task_id}`,
      `Task title: ${task.title || "UNKNOWN_TASK_TITLE"}`,
      "",
      "Result: APPDATA_PACKET_CREATION only.",
      "",
      NO_RUNNER_NO_DAEMON_NO_WATCHER_BOUNDARY,
      NO_SHELL_NO_CODEX_NO_OPENAI_BOUNDARY,
      ""
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    join(packetDir, "input_evidence.md"),
    [
      "# Input Evidence",
      "",
      `Task JSON path: ${request.task_json_path}`,
      `Task JSON SHA256: ${request.task_json_sha256}`,
      `Validator report path: ${request.validator_report_path}`,
      `Validator report SHA256: ${request.validator_report_sha256}`,
      `Validator status: ${validatorReport.status}`,
      `Validator accepted: ${validatorReport.accepted}`,
      ""
    ].join("\n"),
    "utf8"
  );
  writeFileSync(
    join(packetDir, "validation_summary.md"),
    [
      "# Validation Summary",
      "",
      "The interpreter verified request shape, task SHA, validator report SHA, validator accepted status, owner approval phrase, task type, operation class, and output boundary.",
      "",
      "No helper, validator, runner, daemon, watcher, queue loop, Codex CLI, OpenAI API, UI bridge, provider, deploy, private API, trading, billing, repo mutation, or secret output occurred.",
      ""
    ].join("\n"),
    "utf8"
  );
  return packetDir;
}

function safeFailure({ outRoot, request, status, reasons }) {
  const result = buildResult({ request, status, reasons });
  if (canWriteFailure(outRoot)) writeResult(resolve(outRoot), result);
  return { result, outputPacketPath: "" };
}

export function executeRequest(requestPath, outRoot) {
  let request;
  try {
    request = readJson(resolve(requestPath));
  } catch (error) {
    return safeFailure({
      outRoot,
      request: null,
      status: "INVALID_REQUEST",
      reasons: [`invalid JSON: ${error.message}`]
    });
  }

  const requestValidation = validateRequest(request);
  if (requestValidation.status !== "EXECUTION_COMPLETED") {
    return safeFailure({
      outRoot,
      request,
      status: requestValidation.status,
      reasons: requestValidation.reasons
    });
  }

  const outputRootErrors = validateOutputRoot(outRoot, request.output_root_policy);
  if (outputRootErrors.length > 0) {
    return safeFailure({
      outRoot,
      request,
      status: "OUTPUT_BOUNDARY_VIOLATION",
      reasons: outputRootErrors
    });
  }

  if (!existsSync(request.task_json_path)) {
    return safeFailure({ outRoot, request, status: "INVALID_REQUEST", reasons: ["task_json_path does not exist"] });
  }
  if (!existsSync(request.validator_report_path)) {
    return safeFailure({ outRoot, request, status: "INVALID_REQUEST", reasons: ["validator_report_path does not exist"] });
  }

  const actualTaskSha = sha256File(request.task_json_path);
  if (actualTaskSha !== request.task_json_sha256.toUpperCase()) {
    return safeFailure({ outRoot, request, status: "SHA_MISMATCH", reasons: ["task_json_sha256 mismatch"] });
  }

  const actualValidatorSha = sha256File(request.validator_report_path);
  if (actualValidatorSha !== request.validator_report_sha256.toUpperCase()) {
    return safeFailure({ outRoot, request, status: "SHA_MISMATCH", reasons: ["validator_report_sha256 mismatch"] });
  }

  let task;
  let validatorReport;
  try {
    task = readJson(resolve(request.task_json_path));
    validatorReport = readJson(resolve(request.validator_report_path));
  } catch (error) {
    return safeFailure({ outRoot, request, status: "INVALID_REQUEST", reasons: [`input JSON parse failed: ${error.message}`] });
  }

  const validatorRejected = [];
  if (task.task_id !== request.task_id) validatorRejected.push("task_id mismatch between request and task JSON");
  if (task.owner_approval_phrase !== request.owner_approval_phrase) {
    validatorRejected.push("owner approval phrase mismatch between request and task JSON");
  }
  if (validatorReport.task_id !== request.task_id) validatorRejected.push("task_id mismatch between request and validator report");
  if (validatorReport.status !== request.expected_validator_status) validatorRejected.push("validator status mismatch");
  if (validatorReport.accepted !== request.expected_validator_accepted) validatorRejected.push("validator accepted flag mismatch");
  if (validatorReport.status !== "VALID_DRY_RUN" || validatorReport.accepted !== true) {
    validatorRejected.push("validator report is not accepted VALID_DRY_RUN evidence");
  }
  if (validatorRejected.length > 0) {
    return safeFailure({ outRoot, request, status: "VALIDATOR_REPORT_REJECTED", reasons: validatorRejected });
  }

  const resolvedOutRoot = resolve(outRoot);
  mkdirSync(resolvedOutRoot, { recursive: true });
  const outputPacketPath = writeReviewPacket(resolvedOutRoot, request, task, validatorReport);
  const result = buildResult({
    request,
    status: "EXECUTION_COMPLETED",
    reasons: ["Execution request completed as AppData/test-temp packet creation only."],
    outputPacketPath
  });
  const resultPath = writeResult(resolvedOutRoot, result);
  return { result, resultPath, outputPacketPath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return 0;
  }
  if (args.unknown) {
    console.error(`SAFE_ERROR: unknown argument ${args.unknown}`);
    console.error(usage());
    return 2;
  }
  if (!args.request) {
    console.error("SAFE_ERROR: --request is required.");
    console.error(usage());
    return 2;
  }
  if (!args.outRoot) {
    console.error("SAFE_ERROR: --out-root is required for this MVP.");
    console.error(usage());
    return 2;
  }

  const run = executeRequest(args.request, args.outRoot);
  console.log(
    `file_queue_execution_interpreter: status=${run.result.status} accepted=${run.result.accepted} task_id=${run.result.task_id} output_packet=${run.outputPacketPath}`
  );
  return run.result.accepted ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const code = await main();
  process.exitCode = code;
}
