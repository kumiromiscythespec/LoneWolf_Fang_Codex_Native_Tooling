// BUILD_ID: 20260612_fasttrack_window2_linkage_ledger_writer_v0
import { createHash } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const WRITER_BUILD_ID = "20260612_fasttrack_window2_linkage_ledger_writer_v0";
const ENTRY_SCHEMA_ID = "lonewolf.file_queue.linkage_ledger_entry.v1";
const ENTRY_BUILD_ID = "20260612_fasttrack_window2_linkage_ledger_writer_fixture_v0";
const CHECKSUM_ALGORITHM = "SHA256";
const APPDATA_LEDGER_WRITER_BOUNDARY =
  "local-only AppData linkage ledger writer; no network, no task execution, no queue consumption, no daemon, no watcher";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

const requiredEntryFields = [
  "schema",
  "build_id",
  "proof_id",
  "chain_id",
  "task_id",
  "current_state",
  "ledger_path",
  "overwrite_existing",
  "created_at",
  "proof_summary",
  "evidence_references",
  "safety_summary",
  "forbidden_actions_confirmation"
];

const allowedEntryFields = new Set([
  ...requiredEntryFields,
  "writer_build_id",
  "ledger_recorded_at",
  "proof_payload_sha256",
  "ledger_record_sha256",
  "checksum_algorithm"
]);

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

const requiredSafetyFlags = [
  "local_only",
  "appdata_only",
  "evidence_by_reference",
  "no_secrets",
  "no_network",
  "no_task_execution",
  "no_queue_consumption",
  "no_daemon_watcher"
];

const allowedEvidenceKinds = [
  "task_result_linkage",
  "linkage_state",
  "owner_decision",
  "execution_result",
  "output_packet",
  "test_summary",
  "artifact_manifest"
];

const secretKeyPattern = /(?:secret|api[_-]?key|token|password|passwd|cookie|session|credential|private[_-]?key|authorization|bearer)/i;
const secretValuePattern = /(?:sk-[A-Za-z0-9_-]{20,}|BEGIN (?:RSA |OPENSSH |EC |)PRIVATE KEY|xox[baprs]-[A-Za-z0-9-]+)/i;
const sha256Pattern = /^[A-Fa-f0-9]{64}$/;
const safeProofIdPattern = /^[A-Za-z0-9_.:-]+$/;

function parseArgs(argv) {
  const args = { entry: null, ledger: null, dryRun: false, help: false, unknown: null };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--entry") {
      args.entry = argv[++index] ?? null;
    } else if (item === "--ledger") {
      args.ledger = argv[++index] ?? null;
    } else if (item === "--dry-run") {
      args.dryRun = true;
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
    "Usage: node tools/orchestration/file_queue_linkage_ledger_writer.mjs --entry <entry_json_path> --ledger <appdata_ledger_jsonl_path> [--dry-run]",
    APPDATA_LEDGER_WRITER_BOUNDARY
  ].join("\n");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function isNonEmptyStringArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

function normalizeForHash(value) {
  if (Array.isArray(value)) return value.map(normalizeForHash);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalizeForHash(value[key])]));
}

function canonicalJson(value) {
  return JSON.stringify(normalizeForHash(value));
}

function sha256Text(text) {
  return createHash("sha256").update(text, "utf8").digest("hex").toUpperCase();
}

function isPathInsideOrEqual(child, parent) {
  const relativePath = relative(resolve(parent), resolve(child));
  return relativePath === "" || (!relativePath.startsWith("..") && !relativePath.startsWith(sep) && relativePath !== "..");
}

function defaultAppDataRoot(env = process.env, platform = process.platform) {
  if (platform === "win32") {
    return env.LOCALAPPDATA
      ? join(env.LOCALAPPDATA, "LoneWolfFang", "data")
      : "C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data";
  }
  return env.LOCALAPPDATA ? join(env.LOCALAPPDATA, "LoneWolfFang", "data") : "";
}

function scanForSecretLikeData(value, path = "$") {
  const findings = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => findings.push(...scanForSecretLikeData(item, `${path}[${index}]`)));
    return findings;
  }
  if (isPlainObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      if (key !== "no_secrets" && secretKeyPattern.test(key)) findings.push(`secret-like key ${path}.${key}`);
      findings.push(...scanForSecretLikeData(child, `${path}.${key}`));
    }
    return findings;
  }
  if (typeof value === "string" && secretValuePattern.test(value)) findings.push(`secret-like value ${path}`);
  return findings;
}

function missingRequired(entry) {
  return requiredEntryFields.filter((field) => !Object.hasOwn(entry, field));
}

function validateEvidenceReference(reference, index) {
  const errors = [];
  if (!isPlainObject(reference)) return [`evidence_references[${index}] must be object`];
  const allowed = new Set(["kind", "path", "sha256", "notes"]);
  for (const key of Object.keys(reference)) {
    if (!allowed.has(key)) errors.push(`evidence_references[${index}] unexpected ${key}`);
  }
  if (!allowedEvidenceKinds.includes(reference.kind)) errors.push(`evidence_references[${index}].kind is unsupported`);
  if (!isNonEmptyString(reference.path)) errors.push(`evidence_references[${index}].path must be non-empty`);
  if (!sha256Pattern.test(reference.sha256 ?? "")) errors.push(`evidence_references[${index}].sha256 must be sha256`);
  if (Object.hasOwn(reference, "notes") && !isNonEmptyString(reference.notes)) {
    errors.push(`evidence_references[${index}].notes must be non-empty when present`);
  }
  return errors;
}

export function validateLedgerEntry(entry) {
  const errors = [];
  if (!isPlainObject(entry)) return ["entry must be object"];

  for (const key of Object.keys(entry)) {
    if (!allowedEntryFields.has(key)) errors.push(`unexpected property ${key}`);
  }
  for (const field of missingRequired(entry)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;

  if (entry.schema !== ENTRY_SCHEMA_ID) errors.push("bad schema");
  if (entry.build_id !== ENTRY_BUILD_ID) errors.push("bad build_id");
  if (!safeProofIdPattern.test(entry.proof_id ?? "")) errors.push("proof_id must be safe non-empty identifier");
  if (!isNonEmptyString(entry.chain_id)) errors.push("chain_id must be non-empty");
  if (!isNonEmptyString(entry.task_id)) errors.push("task_id must be non-empty");
  if (!allowedStates.includes(entry.current_state)) errors.push("bad current_state");
  if (!isNonEmptyString(entry.ledger_path)) errors.push("ledger_path must be non-empty");
  if (entry.overwrite_existing !== false) errors.push("overwrite_existing must be false for append-only v0");
  if (!isNonEmptyString(entry.created_at)) errors.push("created_at must be non-empty");
  if (!isNonEmptyString(entry.proof_summary)) errors.push("proof_summary must be non-empty");

  if (!Array.isArray(entry.evidence_references) || entry.evidence_references.length === 0) {
    errors.push("evidence_references must be non-empty array");
  } else {
    entry.evidence_references.forEach((reference, index) => {
      errors.push(...validateEvidenceReference(reference, index));
    });
  }

  if (!isPlainObject(entry.safety_summary)) {
    errors.push("safety_summary must be object");
  } else {
    for (const flag of requiredSafetyFlags) {
      if (entry.safety_summary[flag] !== true) errors.push(`safety_summary.${flag} must be true`);
    }
  }

  if (!isPlainObject(entry.forbidden_actions_confirmation)) {
    errors.push("forbidden_actions_confirmation must be object");
  } else {
    if (entry.forbidden_actions_confirmation.forbidden_actions_performed !== false) {
      errors.push("forbidden_actions_performed must be false");
    }
    if (!isNonEmptyStringArray(entry.forbidden_actions_confirmation.confirmed_absent)) {
      errors.push("confirmed_absent must be non-empty string array");
    }
  }

  errors.push(...scanForSecretLikeData(entry));
  return errors;
}

export function validateLedgerPath(ledgerPath, appDataRoot = defaultAppDataRoot()) {
  const errors = [];
  if (!isNonEmptyString(ledgerPath)) return { errors: ["ledger path is required"], resolvedLedgerPath: "", resolvedAppDataRoot: "" };
  if (!isNonEmptyString(appDataRoot)) {
    return { errors: ["AppData root is not configured"], resolvedLedgerPath: resolve(ledgerPath), resolvedAppDataRoot: "" };
  }

  const resolvedLedgerPath = resolve(ledgerPath);
  const resolvedAppDataRoot = resolve(appDataRoot);
  if (!resolvedLedgerPath.toLowerCase().endsWith(".jsonl")) errors.push("ledger path must end with .jsonl");
  if (!isPathInsideOrEqual(resolvedLedgerPath, resolvedAppDataRoot)) {
    errors.push("ledger path must be under the configured AppData artifact root");
  }
  if (isPathInsideOrEqual(resolvedLedgerPath, repoRoot)) errors.push("ledger path must be outside the repository");
  return { errors, resolvedLedgerPath, resolvedAppDataRoot };
}

function readExistingLedgerRecords(ledgerPath) {
  if (!existsSync(ledgerPath)) return { records: [], errors: [] };
  const text = readFileSync(ledgerPath, "utf8");
  const records = [];
  const errors = [];
  text.split(/\r?\n/).forEach((line, index) => {
    if (!line.trim()) return;
    try {
      records.push(JSON.parse(line));
    } catch (error) {
      errors.push(`ledger line ${index + 1} is not valid JSON: ${error.message}`);
    }
  });
  return { records, errors };
}

function buildLedgerRecord(entry, ledgerPath, recordedAt) {
  const proofPayloadSha256 = sha256Text(canonicalJson(entry));
  const recordWithoutRecordHash = {
    ...entry,
    ledger_path: ledgerPath,
    writer_build_id: WRITER_BUILD_ID,
    ledger_recorded_at: recordedAt,
    proof_payload_sha256: proofPayloadSha256,
    checksum_algorithm: CHECKSUM_ALGORITHM
  };
  const ledgerRecordSha256 = sha256Text(canonicalJson(recordWithoutRecordHash));
  return {
    ...recordWithoutRecordHash,
    ledger_record_sha256: ledgerRecordSha256
  };
}

export function planLedgerWrite({ entry, ledgerPath, appDataRoot = defaultAppDataRoot(), now = new Date().toISOString() }) {
  const entryErrors = validateLedgerEntry(entry);
  const pathCheck = validateLedgerPath(ledgerPath, appDataRoot);
  const errors = [...entryErrors, ...pathCheck.errors];
  if (entry?.ledger_path && pathCheck.resolvedLedgerPath && resolve(entry.ledger_path) !== pathCheck.resolvedLedgerPath) {
    errors.push("entry ledger_path must match requested ledger path");
  }
  if (errors.length > 0) {
    const status = pathCheck.errors.length > 0 ? "OUTPUT_BOUNDARY_VIOLATION" : "INVALID_ENTRY";
    return { status, accepted: false, wrote: false, reasons: errors };
  }

  const existing = readExistingLedgerRecords(pathCheck.resolvedLedgerPath);
  if (existing.errors.length > 0) {
    return { status: "LEDGER_PARSE_ERROR", accepted: false, wrote: false, reasons: existing.errors };
  }
  if (existing.records.some((record) => record?.proof_id === entry.proof_id)) {
    return {
      status: "DUPLICATE_PROOF_ID",
      accepted: false,
      wrote: false,
      reasons: [`proof_id already exists: ${entry.proof_id}`]
    };
  }

  const record = buildLedgerRecord(entry, pathCheck.resolvedLedgerPath, now);
  return {
    status: "PLANNED",
    accepted: true,
    wrote: false,
    dry_run_available: true,
    reasons: ["Ledger entry passed local AppData-only checks."],
    ledgerPath: pathCheck.resolvedLedgerPath,
    appDataRoot: pathCheck.resolvedAppDataRoot,
    record,
    proofPayloadSha256: record.proof_payload_sha256,
    ledgerRecordSha256: record.ledger_record_sha256
  };
}

export function writeLedgerEntry(options) {
  const dryRun = options?.dryRun === true;
  const plan = planLedgerWrite(options);
  if (!plan.accepted) return plan;
  if (dryRun) return { ...plan, status: "DRY_RUN_PLANNED", accepted: true, wrote: false };

  mkdirSync(dirname(plan.ledgerPath), { recursive: true });
  appendFileSync(plan.ledgerPath, `${JSON.stringify(plan.record)}\n`, "utf8");
  return {
    ...plan,
    status: "LEDGER_ENTRY_WRITTEN",
    accepted: true,
    wrote: true,
    reasons: ["Ledger entry appended under AppData."]
  };
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
  if (!args.entry) {
    console.error("SAFE_ERROR: --entry is required.");
    console.error(usage());
    return 2;
  }
  if (!args.ledger) {
    console.error("SAFE_ERROR: --ledger is required.");
    console.error(usage());
    return 2;
  }
  if (!existsSync(args.entry)) {
    console.error(`SAFE_ERROR: entry file not found: ${args.entry}`);
    return 2;
  }

  let entry;
  try {
    entry = readJson(args.entry);
  } catch (error) {
    console.error(`SAFE_ERROR: invalid entry JSON: ${error.message}`);
    return 2;
  }

  const result = writeLedgerEntry({ entry, ledgerPath: args.ledger, dryRun: args.dryRun });
  console.log(
    `file_queue_linkage_ledger_writer: status=${result.status} accepted=${result.accepted} wrote=${result.wrote} ledger=${result.ledgerPath ?? ""}`
  );
  return result.accepted ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const code = await main();
  process.exitCode = code;
}
