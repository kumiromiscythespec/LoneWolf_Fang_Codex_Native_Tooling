// BUILD_ID: 20260612_file_queue_task_authoring_helper_static_mvp_v1
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const HELPER_BUILD_ID = "20260612_file_queue_task_authoring_helper_static_mvp_v1";
const TASK_FIXTURE_BUILD_ID = "20260612_file_queue_fixture_v1";
const AUTHOR_REQUEST_SCHEMA_ID = "lonewolf.file_queue.task_author_request.v1";
const TASK_SCHEMA_ID = "lonewolf.file_queue.task.v1";
const AUTHOR_OUTPUT_SCHEMA_ID = "lonewolf.file_queue.task_author_output.v1";
const AUTHOR_ONLY_BOUNDARY =
  "author-only static task drafting; no validator run, queue runner, worker, daemon, watcher, task execution, network call, repo mutation, or git operation";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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

const outputRootPolicies = [
  "APPDATA_OR_TEST_TEMP_ONLY",
  "APPDATA_ONLY",
  "TEST_TEMP_ONLY"
];

const FORBIDDEN_ACTION_BASELINE = [
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

const requiredRequestFields = [
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
];

const optionalRequestFields = ["build_id"];
const unsafePathPattern =
  /(^|[\\/])(runtime|deploy|provider|cookies?|sessions?|auth|secrets?|billing|orders?|live|paper|worker|daemon|watcher|private[-_]?api)([\\/]|$)|fetch_balance/i;

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
    "Usage: node tools/file_queue_task_authoring_helper.mjs --request <author_request_json_path> --out-root <output_root>",
    AUTHOR_ONLY_BOUNDARY
  ].join("\n");
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

function safeName(value, fallback) {
  return String(value || fallback).replace(/[^A-Za-z0-9_.-]/g, "_");
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
  return [process.env.TMPDIR, process.env.TEMP, process.env.TMP, "/tmp", "C:\\Windows\\Temp"].filter(Boolean);
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

function validateAuthorRequest(request) {
  const errors = [];
  const unsafe = [];
  const owner = [];
  const stops = [];

  if (!request || typeof request !== "object" || Array.isArray(request)) {
    return { status: "INVALID_REQUEST", reasons: ["request must be an object"] };
  }

  const allowedKeys = new Set([...requiredRequestFields, ...optionalRequestFields]);
  for (const key of Object.keys(request)) {
    if (!allowedKeys.has(key)) errors.push(`unexpected property ${key}`);
  }
  for (const field of missingRequired(request)) {
    if (field === "owner_approval_phrase") owner.push(`missing ${field}`);
    else if (field === "stop_conditions") stops.push(`missing ${field}`);
    else errors.push(`missing ${field}`);
  }

  if (errors.length === 0 && owner.length === 0 && stops.length === 0) {
    if (request.schema !== AUTHOR_REQUEST_SCHEMA_ID) errors.push("bad schema");
    if (!isNonEmptyString(request.request_id)) errors.push("request_id must be non-empty");
    if (!isNonEmptyString(request.task_id)) errors.push("task_id must be non-empty");
    if (!isNonEmptyString(request.title)) errors.push("title must be non-empty");
    if (!isNonEmptyString(request.target_repo)) errors.push("target_repo must be non-empty");
    if (!safeTaskTypes.includes(request.task_type)) unsafe.push("unsafe or unknown task_type");
    if (!safeModes.includes(request.mode)) unsafe.push("unsafe or unknown mode");
    if (!isNonEmptyStringArray(request.allowed_files)) {
      errors.push("allowed_files must be non-empty string array");
    } else {
      const seen = new Set();
      for (const file of request.allowed_files) {
        if (seen.has(file)) errors.push(`duplicate allowed file ${file}`);
        seen.add(file);
        if (unsafePathPattern.test(file)) unsafe.push(`unsafe allowed file path ${file}`);
      }
    }
    if (!isNonEmptyString(request.owner_approval_phrase)) owner.push("owner_approval_phrase must be non-empty");
    if (!isNonEmptyStringArray(request.success_criteria)) errors.push("success_criteria must be non-empty string array");
    if (!isNonEmptyStringArray(request.stop_conditions)) stops.push("stop_conditions must be non-empty string array");
    if (!isNonEmptyStringArray(request.artifact_requirements)) errors.push("artifact_requirements must be non-empty string array");
    if (!isNonEmptyStringArray(request.expected_final_report_labels)) {
      errors.push("expected_final_report_labels must be non-empty string array");
    }
    if (!outputRootPolicies.includes(request.output_root_policy)) errors.push("output_root_policy is not supported");
  }

  if (errors.length > 0) return { status: "INVALID_REQUEST", reasons: errors };
  if (unsafe.length > 0) return { status: "UNSAFE_TASK_TYPE", reasons: unsafe };
  if (owner.length > 0) return { status: "MISSING_OWNER_APPROVAL", reasons: owner };
  if (stops.length > 0) return { status: "MISSING_STOP_CONDITIONS", reasons: stops };
  return { status: "TASK_DRAFTED", reasons: ["Author request passed static safety checks."] };
}

function buildTask(request) {
  return {
    schema: TASK_SCHEMA_ID,
    build_id: TASK_FIXTURE_BUILD_ID,
    task_id: request.task_id,
    title: request.title,
    target_repo: request.target_repo,
    mode: request.mode,
    allowed_files: request.allowed_files,
    forbidden_actions: FORBIDDEN_ACTION_BASELINE,
    success_criteria: request.success_criteria,
    stop_conditions: request.stop_conditions,
    owner_approval_phrase: request.owner_approval_phrase,
    artifact_requirements: request.artifact_requirements,
    expected_final_report_labels: request.expected_final_report_labels
  };
}

function buildPreview(task, request) {
  return [
    `# ${task.title}`,
    "",
    `request_id: ${request.request_id}`,
    `task_id: ${task.task_id}`,
    `task_type: ${request.task_type}`,
    `mode: ${task.mode}`,
    `target_repo: ${task.target_repo}`,
    "",
    "## Safety Boundary",
    "",
    AUTHOR_ONLY_BOUNDARY,
    "",
    "## Allowed Files",
    "",
    ...task.allowed_files.map((file) => `- ${file}`),
    "",
    "## Success Criteria",
    "",
    ...task.success_criteria.map((item) => `- ${item}`),
    "",
    "## Stop Conditions",
    "",
    ...task.stop_conditions.map((item) => `- ${item}`),
    ""
  ].join("\n");
}

function nextActionFor(status) {
  if (status === "TASK_DRAFTED") return "VALIDATE_WITH_DRY_RUN_VALIDATOR";
  if (status === "UNSAFE_TASK_TYPE") return "STOP_OWNER_REVIEW_REQUIRED";
  if (status === "FAILED_SAFE") return "FAILED_SAFE";
  return "REPAIR_AUTHORING_REQUEST";
}

function buildReport({ request, status, reasons, outputTaskPath = "", previewPath = "" }) {
  return {
    schema: AUTHOR_OUTPUT_SCHEMA_ID,
    helper_build_id: HELPER_BUILD_ID,
    request_id: request?.request_id || "UNKNOWN_REQUEST",
    task_id: request?.task_id || "UNKNOWN_TASK",
    status,
    accepted: status === "TASK_DRAFTED",
    reasons: reasons.length > 0 ? reasons : [status === "TASK_DRAFTED" ? "Task draft written." : "FAILED_SAFE"],
    output_task_path: outputTaskPath,
    preview_path: previewPath,
    checked_at: new Date().toISOString(),
    safety_summary: {
      author_only: true,
      output_root_policy: request?.output_root_policy || "UNKNOWN",
      forbidden_actions: FORBIDDEN_ACTION_BASELINE
    },
    next_recommended_action: nextActionFor(status)
  };
}

function reportFileName(request, status) {
  return `author_output_${safeName(request?.task_id, "unknown_task")}_${status.toLowerCase()}.json`;
}

function writeReport(outRoot, report) {
  mkdirSync(outRoot, { recursive: true });
  const reportPath = join(outRoot, reportFileName(report, report.status));
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return reportPath;
}

export function authorTask(requestPath, outRoot) {
  const resolvedOutRoot = resolve(outRoot);
  let request;
  try {
    request = readJson(resolve(requestPath));
  } catch (error) {
    const report = buildReport({
      request: null,
      status: "INVALID_REQUEST",
      reasons: [`invalid JSON: ${error.message}`]
    });
    if (validateOutputRoot(resolvedOutRoot, "APPDATA_OR_TEST_TEMP_ONLY").length === 0) writeReport(resolvedOutRoot, report);
    return { report, outputRoot: resolvedOutRoot };
  }

  const validation = validateAuthorRequest(request);
  const outputRootErrors = validateOutputRoot(resolvedOutRoot, request.output_root_policy);
  if (validation.status !== "TASK_DRAFTED" || outputRootErrors.length > 0) {
    const status = outputRootErrors.length > 0 ? "FAILED_SAFE" : validation.status;
    const report = buildReport({
      request,
      status,
      reasons: [...validation.reasons, ...outputRootErrors]
    });
    if (!isPathInsideOrEqual(resolvedOutRoot, repoRoot)) writeReport(resolvedOutRoot, report);
    return { report, outputRoot: resolvedOutRoot };
  }

  mkdirSync(resolvedOutRoot, { recursive: true });
  const task = buildTask(request);
  const safeTaskId = safeName(task.task_id, "task");
  const outputTaskPath = join(resolvedOutRoot, `task_${safeTaskId}.json`);
  const previewPath = join(resolvedOutRoot, `preview_${safeTaskId}.md`);
  writeFileSync(outputTaskPath, `${JSON.stringify(task, null, 2)}\n`, "utf8");
  writeFileSync(previewPath, buildPreview(task, request), "utf8");

  const report = buildReport({
    request,
    status: "TASK_DRAFTED",
    reasons: ["Task draft, preview, and author output report were written without executing the task."],
    outputTaskPath,
    previewPath
  });
  const reportPath = writeReport(resolvedOutRoot, report);
  return { report, reportPath, outputTaskPath, previewPath, outputRoot: resolvedOutRoot };
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
  if (!existsSync(args.request)) {
    console.error(`SAFE_ERROR: request file not found: ${args.request}`);
    return 2;
  }

  const run = authorTask(args.request, args.outRoot);
  console.log(
    `file_queue_task_authoring_helper: status=${run.report.status} accepted=${run.report.accepted} task_id=${run.report.task_id} out_root=${run.outputRoot}`
  );
  return run.report.accepted ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const code = await main();
  process.exitCode = code;
}
