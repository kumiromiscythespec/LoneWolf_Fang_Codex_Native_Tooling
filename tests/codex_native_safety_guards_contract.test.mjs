// BUILD_ID: 20260612_fasttrack_window5_safety_guards_minimal_v1
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  isAppDataPath,
  isSha256Hex,
  isWrongRootPath,
  validatePacketSafetyReport
} from "../tools/orchestration/codex_native_safety_guards.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const schema = readJson("schema/orchestration/codex_native_packet_safety_report.schema.json");
const validReport = readJson("tests/fixtures/safety-guards/valid/packet_safety_report_valid.json");
const wrongRootReport = readJson("tests/fixtures/safety-guards/invalid/packet_wrong_root_output.json");
const runtimeReport = readJson("tests/fixtures/safety-guards/invalid/packet_runtime_performed_true.json");
const nestedZipReport = readJson("tests/fixtures/safety-guards/invalid/packet_nested_zip_present.json");

const requiredFields = [
  "schema",
  "build_id",
  "output_path",
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

test("schema and fixtures carry the minimal safety contract", () => {
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(
    schema.$comment,
    "BUILD_ID: 20260612_fasttrack_window5_safety_guards_schema_minimal_v1"
  );
  assert.equal(schema.additionalProperties, false);
  for (const field of requiredFields) {
    assert.ok(schema.required.includes(field), `schema must require ${field}`);
  }
  assert.equal(schema.properties.artifact_sha256.$ref, "#/$defs/sha256");
  assert.equal(schema.properties.sidecar_sha256.$ref, "#/$defs/sha256");
  assert.equal(
    validReport.build_id,
    "20260612_fasttrack_window5_safety_guards_fixture_minimal_v1"
  );
});

test("path and SHA helpers are strict", () => {
  assert.equal(isSha256Hex("a".repeat(64)), true);
  assert.equal(isSha256Hex("A".repeat(64)), true);
  assert.equal(isSha256Hex("g".repeat(64)), false);
  assert.equal(isSha256Hex("a".repeat(63)), false);

  assert.equal(
    isAppDataPath("C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data\\packet.zip"),
    true
  );
  assert.equal(isAppDataPath("..\\packet.zip"), false);
  assert.equal(isAppDataPath("C:\\LoneWolf_Fang_Project\\packet.zip"), false);
  assert.equal(isWrongRootPath("C:\\LoneWolf_Fang_Project\\packet.zip"), true);
  assert.equal(isWrongRootPath("C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data\\packet.zip"), false);
});

test("valid report passes and invalid fixtures stop owner review", () => {
  assert.deepEqual(validatePacketSafetyReport(validReport), {
    ok: true,
    status: "PASS",
    reasons: []
  });

  const wrongRootResult = validatePacketSafetyReport(wrongRootReport);
  assert.equal(wrongRootResult.ok, false);
  assert.equal(wrongRootResult.status, "STOP_OWNER_REVIEW_REQUIRED");
  assert.ok(wrongRootResult.reasons.includes("output_path is under forbidden wrong root"));

  const runtimeResult = validatePacketSafetyReport(runtimeReport);
  assert.equal(runtimeResult.status, "STOP_OWNER_REVIEW_REQUIRED");
  assert.ok(runtimeResult.reasons.includes("runtime_performed must be false"));

  const nestedZipResult = validatePacketSafetyReport(nestedZipReport);
  assert.equal(nestedZipResult.status, "STOP_OWNER_REVIEW_REQUIRED");
  assert.ok(nestedZipResult.reasons.includes("contains_nested_zip must be false"));
});

test("ambiguous, missing, and unsafe fields fail closed", () => {
  const missingOutput = { ...validReport };
  delete missingOutput.output_path;
  assert.ok(validatePacketSafetyReport(missingOutput).reasons.includes("missing output_path"));

  const relativeOutput = { ...validReport, output_path: "packet.zip" };
  assert.ok(
    validatePacketSafetyReport(relativeOutput).reasons.includes("output_path must be an absolute Windows path")
  );

  const missingBoolean = { ...validReport };
  delete missingBoolean.deploy_performed;
  assert.ok(validatePacketSafetyReport(missingBoolean).reasons.includes("deploy_performed must be boolean"));

  const unsafePush = {
    ...validReport,
    push_fetch_pull_performed: true,
    push_fetch_pull_explicitly_allowed: false
  };
  assert.ok(
    validatePacketSafetyReport(unsafePush).reasons.includes(
      "push_fetch_pull_performed requires explicit report approval"
    )
  );

  const badSha = { ...validReport, artifact_sha256: "not-a-sha" };
  assert.ok(
    validatePacketSafetyReport(badSha).reasons.includes(
      "artifact_sha256 must be a 64-character SHA256 hex string"
    )
  );
});

test("minimal helper remains local-only and non-operational", () => {
  const source = readText("tools/orchestration/codex_native_safety_guards.mjs");
  assert.doesNotMatch(
    source,
    /from\s+["'](?:node:)?(?:fs|http|https|net|tls|dgram|child_process|worker_threads|cluster)["']/,
    "helper must not import filesystem, network, worker, or process-launch modules"
  );
  assert.doesNotMatch(
    source,
    /\b(?:spawn|exec|execFile|fork|Worker|watch|watchFile|setInterval|fetch)\s*\(/,
    "helper must not expose execution, network, worker, daemon, or watcher behavior"
  );
  assert.equal(existsSync(resolve(root, "package.json")), false, "package.json must not be added");

  const docs = readText("docs/orchestration/codex_native_safety_guards.md");
  assert.match(docs, /metadata-style packet safety report objects/i);
  assert.match(docs, /does not inspect real ZIP files/i);
  assert.match(docs, /STOP_OWNER_REVIEW_REQUIRED/);
});
