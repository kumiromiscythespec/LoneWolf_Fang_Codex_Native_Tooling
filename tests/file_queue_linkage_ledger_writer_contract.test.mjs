// BUILD_ID: 20260612_fasttrack_window2_linkage_ledger_writer_v0
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  planLedgerWrite,
  validateLedgerEntry,
  validateLedgerPath,
  writeLedgerEntry
} from "../tools/orchestration/file_queue_linkage_ledger_writer.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const entrySchema = readJson("schema/orchestration/file_queue_linkage_ledger_entry.schema.json");
const validEntryFixture = readJson("tests/fixtures/file-queue/ledger/valid/ledger_entry_valid.json");
const missingProofIdFixture = readJson("tests/fixtures/file-queue/ledger/invalid/ledger_entry_missing_proof_id.json");
const nonAppDataPathFixture = readJson("tests/fixtures/file-queue/ledger/invalid/ledger_entry_non_appdata_path.json");

const requiredFields = [
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

function assertNoExtraProperties(schema, data, name) {
  const allowed = new Set(Object.keys(schema.properties ?? {}));
  for (const key of Object.keys(data)) {
    assert.ok(allowed.has(key), `${name} has unexpected property ${key}`);
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function isSha256(value) {
  return /^[A-Fa-f0-9]{64}$/.test(value ?? "");
}

function entryErrors(entry) {
  return validateLedgerEntry(entry);
}

assert.equal(entrySchema.additionalProperties, false, "ledger entry schema must reject extra fields");
assert.equal(
  entrySchema.$comment,
  "BUILD_ID: 20260612_fasttrack_window2_linkage_ledger_writer_schema_v0",
  "ledger entry schema must carry requested BUILD_ID"
);
for (const field of requiredFields) {
  assert.ok(entrySchema.required.includes(field), `ledger entry schema missing required field ${field}`);
}
assert.equal(entrySchema.properties.schema.const, "lonewolf.file_queue.linkage_ledger_entry.v1");
assert.equal(entrySchema.properties.build_id.const, "20260612_fasttrack_window2_linkage_ledger_writer_fixture_v0");
assert.equal(entrySchema.properties.overwrite_existing.const, false);
assert.equal(entrySchema.properties.proof_payload_sha256.$ref, "#/$defs/sha256");
assert.equal(entrySchema.properties.ledger_record_sha256.$ref, "#/$defs/sha256");

assertNoExtraProperties(entrySchema, validEntryFixture, "ledger_entry_valid.json");
assert.deepEqual(entryErrors(validEntryFixture), [], "valid ledger entry fixture must pass");
assert.ok(entryErrors(missingProofIdFixture).includes("missing proof_id"), "missing proof_id fixture must fail");
assert.deepEqual(entryErrors(nonAppDataPathFixture), [], "non-AppData fixture must pass raw schema-like field checks");

const tempRoot = mkdtempSync(join(tmpdir(), "file-queue-linkage-ledger-writer-"));
const appDataRoot = join(tempRoot, "AppData", "Local", "LoneWolfFang", "data");
const ledgerPath = join(appDataRoot, "ledger", "file_queue_linkage_ledger.jsonl");
mkdirSync(appDataRoot, { recursive: true });

const testEntry = {
  ...validEntryFixture,
  ledger_path: ledgerPath
};

const pathCheck = validateLedgerPath(ledgerPath, appDataRoot);
assert.deepEqual(pathCheck.errors, [], "ledger path under AppData root must pass");

const outsidePath = join(tempRoot, "outside", "file_queue_linkage_ledger.jsonl");
const outsideCheck = validateLedgerPath(outsidePath, appDataRoot);
assert.ok(
  outsideCheck.errors.includes("ledger path must be under the configured AppData artifact root"),
  "writer must refuse paths outside AppData"
);

const plan = planLedgerWrite({
  entry: testEntry,
  ledgerPath,
  appDataRoot,
  now: "2026-06-12T00:01:00.000Z"
});
assert.equal(plan.status, "PLANNED");
assert.equal(plan.accepted, true);
assert.equal(plan.wrote, false);
assert.equal(existsSync(ledgerPath), false, "plan-only behavior must not write the ledger");
assert.equal(plan.record.writer_build_id, "20260612_fasttrack_window2_linkage_ledger_writer_v0");
assert.equal(plan.record.checksum_algorithm, "SHA256");
assert.ok(isSha256(plan.record.proof_payload_sha256), "planned record must carry proof payload SHA256");
assert.ok(isSha256(plan.record.ledger_record_sha256), "planned record must carry ledger record SHA256");
assert.equal(plan.record.ledger_path, resolve(ledgerPath), "planned record must use resolved ledger path");

const dryRun = writeLedgerEntry({
  entry: testEntry,
  ledgerPath,
  appDataRoot,
  dryRun: true,
  now: "2026-06-12T00:02:00.000Z"
});
assert.equal(dryRun.status, "DRY_RUN_PLANNED");
assert.equal(dryRun.accepted, true);
assert.equal(dryRun.wrote, false);
assert.equal(existsSync(ledgerPath), false, "dry-run write must not create ledger file");

const writeResult = writeLedgerEntry({
  entry: testEntry,
  ledgerPath,
  appDataRoot,
  now: "2026-06-12T00:03:00.000Z"
});
assert.equal(writeResult.status, "LEDGER_ENTRY_WRITTEN");
assert.equal(writeResult.accepted, true);
assert.equal(writeResult.wrote, true);
assert.equal(statSync(ledgerPath).isFile(), true, "ledger writer must create JSONL file under AppData");

const ledgerLines = readFileSync(ledgerPath, "utf8").trim().split(/\r?\n/);
assert.equal(ledgerLines.length, 1, "writer must append exactly one JSONL line");
const writtenRecord = JSON.parse(ledgerLines[0]);
assert.equal(writtenRecord.proof_id, testEntry.proof_id);
assert.equal(writtenRecord.overwrite_existing, false);
assert.equal(writtenRecord.safety_summary.no_network, true);
assert.equal(writtenRecord.safety_summary.no_task_execution, true);
assert.equal(writtenRecord.safety_summary.no_queue_consumption, true);
assert.equal(writtenRecord.safety_summary.no_daemon_watcher, true);
assert.ok(isSha256(writtenRecord.proof_payload_sha256));
assert.ok(isSha256(writtenRecord.ledger_record_sha256));

const duplicate = writeLedgerEntry({
  entry: testEntry,
  ledgerPath,
  appDataRoot,
  now: "2026-06-12T00:04:00.000Z"
});
assert.equal(duplicate.status, "DUPLICATE_PROOF_ID");
assert.equal(duplicate.accepted, false);
assert.equal(duplicate.wrote, false);
assert.equal(readFileSync(ledgerPath, "utf8").trim().split(/\r?\n/).length, 1, "duplicate proof_id must not append");

const nonAppDataResult = writeLedgerEntry({
  entry: nonAppDataPathFixture,
  ledgerPath: nonAppDataPathFixture.ledger_path,
  appDataRoot,
  dryRun: true
});
assert.equal(nonAppDataResult.status, "OUTPUT_BOUNDARY_VIOLATION");
assert.equal(nonAppDataResult.accepted, false);

const secretLikeEntry = {
  ...testEntry,
  proof_id: "proof_secret_like_key",
  secret_token: "redacted"
};
assert.ok(
  entryErrors(secretLikeEntry).some((error) => error.includes("unexpected property secret_token")),
  "secret-like unexpected keys must fail closed"
);

const writerSource = readText("tools/orchestration/file_queue_linkage_ledger_writer.mjs");
assert.ok(writerSource.startsWith("// BUILD_ID: 20260612_fasttrack_window2_linkage_ledger_writer_v0"));
assert.ok(writerSource.includes("APPDATA_LEDGER_WRITER_BOUNDARY"), "writer must expose AppData boundary text");
assert.doesNotMatch(
  writerSource,
  /from\s+["'](?:node:)?(?:http|https|net|tls|dgram|child_process|worker_threads|cluster)["']/,
  "writer must not import network, process-launch, worker, or cluster modules"
);
assert.doesNotMatch(
  writerSource,
  /from\s+["'](?:openai|@openai\/[^"']+|playwright|puppeteer|selenium-webdriver|stripe|cloudflare|@octokit\/[^"']+|undici|node-fetch|axios)["']/i,
  "writer must not import provider, browser automation, payment, GitHub, or HTTP client SDK modules"
);
assert.doesNotMatch(
  writerSource,
  /\b(?:spawn|exec|execFile|fork|Worker|watch|watchFile|setInterval|setTimeout|fetch)\s*\(/,
  "writer must not expose shell, worker, daemon, watcher, timer, or fetch paths"
);

const docs = readText("docs/orchestration/file_queue_linkage_ledger_writer.md");
for (const phrase of [
  "local-only",
  "AppData",
  "evidence by reference",
  "DUPLICATE_PROOF_ID",
  "Dry-run",
  "not a queue",
  "not an execution"
]) {
  assert.match(docs, new RegExp(phrase, "i"), `ledger writer docs must mention ${phrase}`);
}

for (const forbiddenRepoFolder of [
  "queue",
  "queues",
  "file_queue_runtime",
  "file_queue_outbox",
  ".file_queue"
]) {
  assert.equal(existsSync(resolve(root, forbiddenRepoFolder)), false, `${forbiddenRepoFolder} must not be created in repo`);
}

assert.deepEqual(
  readdirSync(appDataRoot).sort(),
  ["ledger"],
  "test writes must stay within configured AppData root"
);

assert.ok(isNonEmptyString(writeResult.ledgerPath), "write result must report ledger path");
console.log("file_queue_linkage_ledger_writer_contract_static: ok");
