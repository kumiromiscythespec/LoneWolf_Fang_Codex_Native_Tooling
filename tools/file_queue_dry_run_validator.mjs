// BUILD_ID: 20260612_file_queue_dry_run_validator_mvp_v1
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const VALIDATOR_BUILD_ID = "20260612_file_queue_dry_run_validator_mvp_v1";
const REPORT_SCHEMA_ID = "lonewolf.file_queue.validation_report.v1";
const TASK_SCHEMA_ID = "lonewolf.file_queue.task.v1";
const DRY_RUN_ONLY_BOUNDARY =
  "local-only dry-run validator; no daemon, watcher, worker, task execution, network call, repo mutation, or git operation";

const requiredTaskFields = [
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
];

const safeModes = [
  "docs_only",
  "schema_tests_only",
  "static_validation_only",
  "artifact_handoff_only"
];

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

const unsafePathPattern =
  /(^|[\\/])(runtime|deploy|provider|browser|cookies?|sessions?|auth|secrets?|billing|orders?|live|paper|worker|daemon|watcher|private[-_]?api)([\\/]|$)|fetch_balance/i;

function parseArgs(argv) {
  const args = { task: null, outRoot: null };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--task") {
      args.task = argv[++index] ?? null;
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
    "Usage: node tools/file_queue_dry_run_validator.mjs --task <task_json_path> [--out-root <output_root>]",
    DRY_RUN_ONLY_BOUNDARY
  ].join("\n");
}

function defaultOutputRoot() {
  if (process.platform === "win32") {
    return process.env.LOCALAPPDATA
      ? join(process.env.LOCALAPPDATA, "LoneWolfFang", "data")
      : "C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data";
  }
  if (process.env.LOCALAPPDATA) return join(process.env.LOCALAPPDATA, "LoneWolfFang", "data");
  return join(tmpdir(), "lonewolf-fang-file-queue-dry-run");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

function section(passed, messages) {
  return {
    passed,
    messages: messages.length > 0 ? messages : [passed ? "PASS" : "FAILED_SAFE"]
  };
}

function missingRequired(data) {
  return requiredTaskFields.filter((field) => !Object.hasOwn(data, field));
}

function validateTask(task) {
  const schemaMessages = [];
  const forbiddenMessages = [];
  const stopMessages = [];
  const artifactMessages = [];
  const ownerMessages = [];
  const safetyMessages = [];

  for (const field of missingRequired(task)) {
    if (field === "forbidden_actions" || field === "mode") forbiddenMessages.push(`missing ${field}`);
    else if (field === "stop_conditions") stopMessages.push(`missing ${field}`);
    else if (field === "artifact_requirements") artifactMessages.push(`missing ${field}`);
    else if (field === "owner_approval_phrase" || field === "expected_final_report_labels") ownerMessages.push(`missing ${field}`);
    else schemaMessages.push(`missing ${field}`);
  }
  if (schemaMessages.length === 0) {
    if (task.schema !== TASK_SCHEMA_ID) schemaMessages.push("bad schema");
    if (!isNonEmptyString(task.task_id)) schemaMessages.push("task_id must be non-empty");
    if (!isNonEmptyString(task.title)) schemaMessages.push("title must be non-empty");
    if (!isNonEmptyString(task.target_repo)) schemaMessages.push("target_repo must be non-empty");
    if (!safeModes.includes(task.mode)) forbiddenMessages.push("unsafe or unknown mode");
    if (!isNonEmptyStringArray(task.allowed_files)) schemaMessages.push("allowed_files must be non-empty string array");
    if (!isNonEmptyStringArray(task.success_criteria)) schemaMessages.push("success_criteria must be non-empty string array");
    if (!isNonEmptyStringArray(task.expected_final_report_labels)) ownerMessages.push("expected_final_report_labels must be non-empty string array");
    if (!isNonEmptyString(task.owner_approval_phrase)) ownerMessages.push("owner_approval_phrase must be non-empty");
    if (!isNonEmptyStringArray(task.stop_conditions)) stopMessages.push("stop_conditions must be non-empty string array");
    if (!isNonEmptyStringArray(task.artifact_requirements)) artifactMessages.push("artifact_requirements must be non-empty string array");
    if (!Array.isArray(task.forbidden_actions)) {
      forbiddenMessages.push("forbidden_actions must be an array");
    } else {
      for (const action of requiredForbiddenActions) {
        if (!task.forbidden_actions.includes(action)) forbiddenMessages.push(`missing forbidden action ${action}`);
      }
    }
    if (Array.isArray(task.allowed_files)) {
      for (const file of task.allowed_files) {
        if (unsafePathPattern.test(file)) safetyMessages.push(`unsafe allowed file path ${file}`);
      }
    }
  }

  return {
    schema: section(schemaMessages.length === 0, schemaMessages),
    forbidden: section(forbiddenMessages.length === 0, forbiddenMessages),
    stop: section(stopMessages.length === 0, stopMessages),
    artifact: section(artifactMessages.length === 0, artifactMessages),
    owner: section(ownerMessages.length === 0, ownerMessages),
    safety: section(safetyMessages.length === 0, safetyMessages)
  };
}

function statusFor(checks) {
  if (!checks.schema.passed) return "INVALID_SCHEMA";
  if (!checks.forbidden.passed || !checks.safety.passed) return "UNSAFE_FORBIDDEN_ACTIONS";
  if (!checks.stop.passed) return "MISSING_STOP_CONDITIONS";
  if (!checks.artifact.passed) return "MISSING_ARTIFACT_REQUIREMENTS";
  if (!checks.owner.passed) return "OWNER_REVIEW_REQUIRED";
  return "VALID_DRY_RUN";
}

function reportName(taskId, status) {
  const safeTaskId = String(taskId || "unknown_task").replace(/[^A-Za-z0-9_.-]/g, "_");
  return `file_queue_validation_report_${safeTaskId}_${status.toLowerCase()}.json`;
}

function writeReport(outRoot, report) {
  mkdirSync(outRoot, { recursive: true });
  const outputPath = join(outRoot, reportName(report.task_id, report.status));
  report.output_packet_path = outputPath;
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return outputPath;
}

function buildReport({ task, taskPath, outputPath, checks, parseReason }) {
  const status = parseReason ? "INVALID_SCHEMA" : statusFor(checks);
  const accepted = status === "VALID_DRY_RUN";
  const failedMessages = parseReason
    ? [parseReason]
    : [
        ...checks.schema.messages.filter((message) => !checks.schema.passed || message !== "PASS"),
        ...checks.forbidden.messages.filter((message) => !checks.forbidden.passed || message !== "PASS"),
        ...checks.stop.messages.filter((message) => !checks.stop.passed || message !== "PASS"),
        ...checks.artifact.messages.filter((message) => !checks.artifact.passed || message !== "PASS"),
        ...checks.owner.messages.filter((message) => !checks.owner.passed || message !== "PASS"),
        ...checks.safety.messages.filter((message) => !checks.safety.passed || message !== "PASS")
      ];
  return {
    schema: REPORT_SCHEMA_ID,
    validator_build_id: VALIDATOR_BUILD_ID,
    task_id: task?.task_id || "UNKNOWN_TASK",
    status,
    accepted,
    reasons: accepted ? ["Task file passed local dry-run validation."] : failedMessages,
    checked_at: new Date().toISOString(),
    input_task_path: taskPath,
    output_packet_path: outputPath,
    schema_validation: parseReason ? section(false, [parseReason]) : checks.schema,
    forbidden_action_validation: parseReason ? section(false, ["Not run because task JSON could not be parsed."]) : checks.forbidden,
    stop_condition_validation: parseReason ? section(false, ["Not run because task JSON could not be parsed."]) : checks.stop,
    artifact_requirement_validation: parseReason ? section(false, ["Not run because task JSON could not be parsed."]) : checks.artifact,
    owner_review_validation: parseReason ? section(false, ["Not run because task JSON could not be parsed."]) : checks.owner,
    safety_gate_validation: parseReason ? section(false, ["Not run because task JSON could not be parsed."]) : checks.safety,
    next_recommended_action: accepted ? "PROCEED_TO_OWNER_REVIEW" : "REPAIR_TASK_FILE"
  };
}

export function validateTaskFile(taskPath, outRoot = defaultOutputRoot()) {
  const resolvedTaskPath = resolve(taskPath);
  let task;
  let parseReason = null;
  try {
    task = readJson(resolvedTaskPath);
  } catch (error) {
    parseReason = `invalid JSON: ${error.message}`;
  }

  const checks = parseReason
    ? {
        schema: section(false, [parseReason]),
        forbidden: section(false, ["Not run because task JSON could not be parsed."]),
        stop: section(false, ["Not run because task JSON could not be parsed."]),
        artifact: section(false, ["Not run because task JSON could not be parsed."]),
        owner: section(false, ["Not run because task JSON could not be parsed."]),
        safety: section(false, ["Not run because task JSON could not be parsed."])
      }
    : validateTask(task);

  const draftReport = buildReport({
    task,
    taskPath: resolvedTaskPath,
    outputPath: join(resolve(outRoot), reportName(task?.task_id, parseReason ? "INVALID_SCHEMA" : statusFor(checks))),
    checks,
    parseReason
  });
  const outputPath = writeReport(resolve(outRoot), draftReport);
  return { report: { ...draftReport, output_packet_path: outputPath }, outputPath };
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
  if (!args.task) {
    console.error("SAFE_ERROR: --task is required.");
    console.error(usage());
    return 2;
  }
  if (!existsSync(args.task)) {
    console.error(`SAFE_ERROR: task file not found: ${args.task}`);
    return 2;
  }

  const outRoot = args.outRoot ? resolve(args.outRoot) : defaultOutputRoot();
  const { report, outputPath } = validateTaskFile(args.task, outRoot);
  console.log(
    `file_queue_dry_run_validator: status=${report.status} accepted=${report.accepted} task_id=${report.task_id} report=${outputPath}`
  );
  return report.accepted ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const code = await main();
  process.exitCode = code;
}
