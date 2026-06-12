// BUILD_ID: 20260612_fasttrack_window3_readonly_linkage_consumer_v0
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const CONSUMER_BUILD_ID = "20260612_fasttrack_window3_readonly_linkage_consumer_v0";
export const OBSERVATION_SCHEMA_ID = "lonewolf.file_queue.linkage_consumer_observation.v1";
export const OBSERVATION_FIXTURE_BUILD_ID = "20260612_fasttrack_window3_readonly_linkage_consumer_fixture_v0";
export const STOP_OWNER_REVIEW_REQUIRED = "STOP_OWNER_REVIEW_REQUIRED";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const acceptedStatuses = new Set(["ACCEPTED", "EXECUTED_APPDATA_ONLY"]);
const requiredIdentityFields = ["chain_id", "task_id", "owner_decision_id", "output_packet_id"];
const requiredChecksumFields = [
  "validator_report_sha256",
  "execution_request_sha256",
  "interpreter_result_sha256",
  "output_packet_sha256",
  "owner_decision_sha256"
];
const forbiddenActions = [
  "helper_execution",
  "validator_execution",
  "interpreter_execution",
  "queue_mutation",
  "runner",
  "daemon",
  "watcher",
  "task_execution",
  "runtime_execution",
  "codex_cli",
  "openai_api",
  "browser_ui_automation",
  "private_api",
  "provider_mutation",
  "deploy",
  "paper_live_order",
  "billing_mutation",
  "secrets_output"
];
const unsafeRecommendationTokens = [
  "LIVE",
  "PAPER",
  "ORDER",
  "CANCEL",
  "FETCH_BALANCE",
  "PRIVATE_API",
  "DEPLOY",
  "RUNTIME",
  "WORKER",
  "DAEMON",
  "WATCHER",
  "QUEUE_LOOP",
  "QUEUE_CONSUMER",
  "CODEX_CLI",
  "OPENAI_API",
  "BILLING",
  "PROVIDER_MUTATION",
  "AUTO_CONTINUE",
  "AUTO_START",
  "AUTO_SEND",
  "DISPATCH",
  "PROMOTION",
  "MUTATE",
  "EXECUTE_TASK",
  "RUN_TASK"
];

function parseArgs(argv) {
  const args = { ledger: null, outRoot: null, help: false, unknown: null };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === "--ledger") {
      args.ledger = argv[++index] ?? null;
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
    "Usage: read-only linkage consumer with --ledger <json_or_jsonl_path> [--out-root <appdata_output_root>]",
    "Reads linkage evidence and writes an observation only; no task execution, helper, validator, interpreter, daemon, watcher, or queue mutation."
  ].join("\n");
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function isSha256(value) {
  return /^[A-Fa-f0-9]{64}$/.test(value ?? "");
}

function safeName(value, fallback) {
  return String(value || fallback).replace(/[^A-Za-z0-9_.-]/g, "_");
}

function uniqueResolved(paths) {
  return Array.from(new Set(paths.filter(Boolean).map((item) => resolve(item))));
}

function appDataRoots() {
  const roots = [];
  if (process.env.LOCALAPPDATA) {
    roots.push(join(process.env.LOCALAPPDATA, "LoneWolfFang", "data"));
    roots.push(join(process.env.LOCALAPPDATA, "CodexNativeClosedLoop", "data"));
  }
  roots.push("C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data");
  roots.push("C:\\Users\\yu_ki\\AppData\\Local\\CodexNativeClosedLoop\\data");
  return uniqueResolved(roots);
}

function defaultOutputRoot() {
  if (process.env.LOCALAPPDATA) return join(process.env.LOCALAPPDATA, "LoneWolfFang", "data");
  return "C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data";
}

function isPathInsideOrEqual(child, parent) {
  const relativePath = relative(resolve(parent), resolve(child));
  return relativePath === "" || (!relativePath.startsWith("..") && !relativePath.startsWith(sep) && !isAbsolute(relativePath));
}

function isAllowedAppDataPath(path) {
  const resolvedPath = resolve(path);
  return appDataRoots().some((root) => isPathInsideOrEqual(resolvedPath, root));
}

export function validateRuntimePaths({ ledgerPath, outRoot, allowFixturePaths = false }) {
  const errors = [];
  if (!ledgerPath) errors.push("ledger path is required");
  if (!outRoot) errors.push("out-root is required");

  if (outRoot && isPathInsideOrEqual(resolve(outRoot), repoRoot)) {
    errors.push("out-root must not be inside the repository");
  }

  if (!allowFixturePaths) {
    if (ledgerPath && !isAllowedAppDataPath(ledgerPath)) {
      errors.push("ledger path must be under the local AppData artifact root");
    }
    if (outRoot && !isAllowedAppDataPath(outRoot)) {
      errors.push("out-root must be under the local AppData artifact root");
    }
  }

  return errors;
}

function parseLedgerText(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.proofs)) return parsed.proofs;
    if (Array.isArray(parsed.records)) return parsed.records;
    return [parsed];
  } catch {
    const lines = trimmed.split(/\r?\n/).filter((line) => line.trim().length > 0);
    return lines.map((line) => JSON.parse(line));
  }
}

function proofStatus(record) {
  return record?.proof_status ?? record?.status ?? record?.current_state ?? "";
}

function proofTimestamp(record) {
  return record?.accepted_at_utc ?? record?.updated_at ?? record?.decision_timestamp ?? record?.created_at ?? record?.timestamp ?? "";
}

function proofId(record) {
  return record?.proof_id ?? record?.owner_decision_id ?? record?.output_packet_id ?? "";
}

function nextRecommendation(record) {
  return record?.next_recommended_action ?? record?.next_action_recommendation ?? "OWNER_REVIEW_REQUIRED";
}

function unsafeRecommendation(value) {
  const normalized = String(value || "").toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  return unsafeRecommendationTokens.some((token) => normalized.includes(token));
}

function parentReferenceErrors(record) {
  const errors = [];
  const parent = record?.parent_references;
  if (!parent || typeof parent !== "object" || Array.isArray(parent)) return errors;

  for (const field of requiredIdentityFields) {
    if (Object.hasOwn(parent, field) && record[field] !== parent[field]) errors.push(`${field} parent mismatch`);
  }
  for (const field of requiredChecksumFields) {
    if (Object.hasOwn(parent, field) && record[field] !== parent[field]) errors.push(`${field} parent mismatch`);
  }
  return errors;
}

function linkageCheckErrors(record) {
  const checks = record?.linkage_checks;
  if (!checks || typeof checks !== "object" || Array.isArray(checks)) return [];
  const errors = [];
  if (checks.parent_ids_match !== true) errors.push("parent_ids_match must be true");
  if (checks.parent_hashes_match !== true) errors.push("parent_hashes_match must be true");
  if (checks.no_consumer_inference !== true) errors.push("no_consumer_inference must be true");
  return errors;
}

function forbiddenConfirmationErrors(record) {
  const confirmation = record?.forbidden_actions_confirmation;
  if (!confirmation || typeof confirmation !== "object" || Array.isArray(confirmation)) return [];
  return confirmation.forbidden_actions_performed === false ? [] : ["forbidden actions must be confirmed absent"];
}

function validateAcceptedProof(record) {
  const errors = [];
  const status = proofStatus(record);
  if (!isNonEmptyString(status)) errors.push("missing proof status");
  if (!isNonEmptyString(proofId(record))) errors.push("missing proof identity");

  for (const field of requiredIdentityFields) {
    if (!isNonEmptyString(record?.[field])) errors.push(`missing ${field}`);
  }
  for (const field of requiredChecksumFields) {
    if (!isSha256(record?.[field])) errors.push(`${field} must be sha256`);
  }

  const timestamp = proofTimestamp(record);
  if (!isNonEmptyString(timestamp) || Number.isNaN(Date.parse(timestamp))) {
    errors.push("accepted proof timestamp must be a valid date-time");
  }

  const recommendation = nextRecommendation(record);
  if (!isNonEmptyString(recommendation)) errors.push("next recommendation must be non-empty");
  if (unsafeRecommendation(recommendation)) errors.push("next recommendation crosses the read-only boundary");

  errors.push(...parentReferenceErrors(record));
  errors.push(...linkageCheckErrors(record));
  errors.push(...forbiddenConfirmationErrors(record));
  return errors;
}

function safetySummary() {
  return {
    read_only: true,
    no_task_execution: true,
    no_daemon: true,
    no_watcher: true,
    no_queue_mutation: true,
    appdata_only_default: true,
    fixture_paths_only_in_tests: true
  };
}

function forbiddenConfirmation() {
  return {
    forbidden_actions_performed: false,
    confirmed_absent: forbiddenActions
  };
}

function buildObservation({ observedAtUtc, sourceLedgerPath, latestProof = null, nextAction, reason }) {
  return {
    schema: OBSERVATION_SCHEMA_ID,
    build_id: OBSERVATION_FIXTURE_BUILD_ID,
    consumer_build_id: CONSUMER_BUILD_ID,
    observed_at_utc: observedAtUtc,
    source_ledger_path: sourceLedgerPath,
    latest_proof_id: latestProof?.proofId ?? "",
    latest_proof_status: latestProof?.status ?? "UNKNOWN",
    next_action_recommendation: nextAction,
    owner_approval_required: true,
    execution_allowed: false,
    runtime_allowed: false,
    reason,
    safety_summary: safetySummary(),
    forbidden_actions_confirmation: forbiddenConfirmation()
  };
}

function stopObservation({ observedAtUtc, sourceLedgerPath, latestProof = null, reason }) {
  return buildObservation({
    observedAtUtc,
    sourceLedgerPath,
    latestProof,
    nextAction: STOP_OWNER_REVIEW_REQUIRED,
    reason
  });
}

export function observeLinkageRecords(records, { sourceLedgerPath = "", observedAtUtc = new Date().toISOString() } = {}) {
  if (!Array.isArray(records) || records.length === 0) {
    return stopObservation({
      observedAtUtc,
      sourceLedgerPath,
      reason: "No linkage proof records were found; owner review is required."
    });
  }

  const accepted = records
    .map((record, index) => {
      const status = proofStatus(record);
      const acceptedStatus = acceptedStatuses.has(status);
      const validationErrors = acceptedStatus ? validateAcceptedProof(record) : [];
      return {
        index,
        record,
        status,
        acceptedStatus,
        validationErrors,
        proofId: proofId(record),
        timestamp: proofTimestamp(record),
        nextAction: nextRecommendation(record)
      };
    })
    .filter((item) => item.acceptedStatus);

  if (accepted.length === 0) {
    return stopObservation({
      observedAtUtc,
      sourceLedgerPath,
      reason: "No accepted linkage proof was found; owner review is required."
    });
  }

  const invalidAccepted = accepted.filter((item) => item.validationErrors.length > 0);
  const validAccepted = accepted.filter((item) => item.validationErrors.length === 0);
  if (validAccepted.length === 0) {
    return stopObservation({
      observedAtUtc,
      sourceLedgerPath,
      latestProof: {
        proofId: invalidAccepted[0]?.proofId ?? "",
        status: invalidAccepted[0]?.status ?? "UNKNOWN"
      },
      reason: `Accepted linkage proof evidence is incomplete: ${invalidAccepted[0].validationErrors.join("; ")}.`
    });
  }

  validAccepted.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  const latest = validAccepted[0];
  const tiedLatest = validAccepted.filter((item) => Date.parse(item.timestamp) === Date.parse(latest.timestamp));
  if (tiedLatest.length > 1) {
    return stopObservation({
      observedAtUtc,
      sourceLedgerPath,
      reason: "Multiple accepted linkage proofs share the latest timestamp; owner review is required."
    });
  }

  const latestProof = {
    proofId: latest.proofId,
    status: latest.status
  };
  return buildObservation({
    observedAtUtc,
    sourceLedgerPath,
    latestProof,
    nextAction: latest.nextAction,
    reason: `Latest accepted linkage proof ${latest.proofId} was observed. Owner approval remains required and no execution was performed.`
  });
}

function observationFileName(observation) {
  const suffix = safeName(observation.latest_proof_id || observation.next_action_recommendation, "unknown");
  return `file_queue_linkage_consumer_observation_${suffix}.json`;
}

function writeObservation(outRoot, observation) {
  mkdirSync(outRoot, { recursive: true });
  const outputPath = join(outRoot, observationFileName(observation));
  writeFileSync(outputPath, `${JSON.stringify(observation, null, 2)}\n`, "utf8");
  return outputPath;
}

export function observeLinkageFile({
  ledgerPath,
  outRoot = defaultOutputRoot(),
  observedAtUtc = new Date().toISOString(),
  allowFixturePaths = false,
  writeOutput = true
} = {}) {
  const resolvedLedgerPath = ledgerPath ? resolve(ledgerPath) : "";
  const resolvedOutRoot = outRoot ? resolve(outRoot) : "";
  const pathErrors = validateRuntimePaths({ ledgerPath: resolvedLedgerPath, outRoot: resolvedOutRoot, allowFixturePaths });
  if (pathErrors.length > 0) {
    return {
      refused: true,
      pathErrors,
      outputPath: "",
      observation: stopObservation({
        observedAtUtc,
        sourceLedgerPath: resolvedLedgerPath,
        reason: `Path boundary refused: ${pathErrors.join("; ")}.`
      })
    };
  }

  if (!existsSync(resolvedLedgerPath)) {
    const observation = stopObservation({
      observedAtUtc,
      sourceLedgerPath: resolvedLedgerPath,
      reason: "Ledger path does not exist; owner review is required."
    });
    const outputPath = writeOutput ? writeObservation(resolvedOutRoot, observation) : "";
    return { refused: false, pathErrors: [], outputPath, observation };
  }

  let records;
  try {
    records = parseLedgerText(readFileSync(resolvedLedgerPath, "utf8"));
  } catch (error) {
    const observation = stopObservation({
      observedAtUtc,
      sourceLedgerPath: resolvedLedgerPath,
      reason: `Ledger parse failed: ${error.message}.`
    });
    const outputPath = writeOutput ? writeObservation(resolvedOutRoot, observation) : "";
    return { refused: false, pathErrors: [], outputPath, observation };
  }

  const observation = observeLinkageRecords(records, { sourceLedgerPath: resolvedLedgerPath, observedAtUtc });
  const outputPath = writeOutput ? writeObservation(resolvedOutRoot, observation) : "";
  return { refused: false, pathErrors: [], outputPath, observation };
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
  if (!args.ledger) {
    console.error("SAFE_ERROR: --ledger is required.");
    console.error(usage());
    return 2;
  }

  const run = observeLinkageFile({
    ledgerPath: args.ledger,
    outRoot: args.outRoot ?? defaultOutputRoot(),
    allowFixturePaths: false
  });
  if (run.refused) {
    console.error(`SAFE_ERROR: ${run.pathErrors.join("; ")}`);
    return 2;
  }

  console.log(
    `file_queue_readonly_linkage_consumer: recommendation=${run.observation.next_action_recommendation} execution_allowed=${run.observation.execution_allowed} runtime_allowed=${run.observation.runtime_allowed} observation=${run.outputPath}`
  );
  return run.observation.next_action_recommendation === STOP_OWNER_REVIEW_REQUIRED ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const code = await main();
  process.exitCode = code;
}
