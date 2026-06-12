// BUILD_ID: 20260612_fasttrack_window5_safety_guards_minimal_v1
import { win32 as pathWin32 } from "node:path";

const APPDATA_ARTIFACT_ROOT = "C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data";
const WRONG_PROJECT_ROOT = "C:\\LoneWolf_Fang_Project";
const STOP_OWNER_REVIEW_REQUIRED = "STOP_OWNER_REVIEW_REQUIRED";

const REQUIRED_BOOLEAN_FIELDS = [
  "runtime_performed",
  "deploy_performed",
  "private_api_performed",
  "trading_performed",
  "billing_performed",
  "push_fetch_pull_performed",
  "push_fetch_pull_explicitly_allowed",
  "repo_changes_performed",
  "contains_git_dir",
  "contains_node_modules",
  "contains_nested_zip",
  "contains_build_cache"
];

const MUST_BE_FALSE_FIELDS = [
  "runtime_performed",
  "deploy_performed",
  "private_api_performed",
  "trading_performed",
  "billing_performed",
  "contains_git_dir",
  "contains_node_modules",
  "contains_nested_zip",
  "contains_build_cache"
];

function normalizeWindowsPath(value) {
  if (typeof value !== "string" || value.trim() === "" || value.includes("\0")) {
    return null;
  }
  if (!pathWin32.isAbsolute(value)) {
    return null;
  }
  return pathWin32.normalize(value);
}

function isSameOrInside(candidate, root) {
  const normalizedCandidate = normalizeWindowsPath(candidate);
  const normalizedRoot = normalizeWindowsPath(root);
  if (!normalizedCandidate || !normalizedRoot) return false;

  const left = normalizedCandidate.toLowerCase();
  const right = normalizedRoot.toLowerCase();
  return left === right || left.startsWith(`${right}\\`);
}

export function isSha256Hex(value) {
  return typeof value === "string" && /^[A-Fa-f0-9]{64}$/.test(value);
}

export function isAppDataPath(pathString) {
  return isSameOrInside(pathString, APPDATA_ARTIFACT_ROOT);
}

export function isWrongRootPath(pathString) {
  return isSameOrInside(pathString, WRONG_PROJECT_ROOT);
}

function collectSha256FieldErrors(value, path = []) {
  const errors = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) return errors;

  for (const [key, child] of Object.entries(value)) {
    const childPath = [...path, key];
    if (key.toLowerCase().includes("sha256") && !isSha256Hex(child)) {
      errors.push(`${childPath.join(".")} must be a 64-character SHA256 hex string`);
      continue;
    }
    if (child && typeof child === "object" && !Array.isArray(child)) {
      errors.push(...collectSha256FieldErrors(child, childPath));
    }
  }
  return errors;
}

export function validatePacketSafetyReport(report) {
  const reasons = [];

  if (!report || typeof report !== "object" || Array.isArray(report)) {
    return {
      ok: false,
      status: STOP_OWNER_REVIEW_REQUIRED,
      reasons: ["report must be an object"]
    };
  }

  if (typeof report.output_path !== "string" || report.output_path.trim() === "") {
    reasons.push("missing output_path");
  } else if (!normalizeWindowsPath(report.output_path)) {
    reasons.push("output_path must be an absolute Windows path");
  } else {
    if (isWrongRootPath(report.output_path)) {
      reasons.push("output_path is under forbidden wrong root");
    }
    if (!isAppDataPath(report.output_path)) {
      reasons.push("output_path must be under AppData artifact root");
    }
  }

  for (const field of REQUIRED_BOOLEAN_FIELDS) {
    if (typeof report[field] !== "boolean") {
      reasons.push(`${field} must be boolean`);
    }
  }

  for (const field of MUST_BE_FALSE_FIELDS) {
    if (report[field] === true) {
      reasons.push(`${field} must be false`);
    }
  }

  if (report.push_fetch_pull_performed === true && report.push_fetch_pull_explicitly_allowed !== true) {
    reasons.push("push_fetch_pull_performed requires explicit report approval");
  }

  reasons.push(...collectSha256FieldErrors(report));

  if (reasons.length > 0) {
    return { ok: false, status: STOP_OWNER_REVIEW_REQUIRED, reasons };
  }
  return { ok: true, status: "PASS", reasons: [] };
}
