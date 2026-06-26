// BUILD_ID: 2026-06-26_note_core_artifact_adoption_ledger_contract_v1

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const BUILD_ID = "2026-06-26_note_core_artifact_adoption_ledger_contract_v1";
const SCHEMA_VERSION = "note_core_artifact_adoption_ledger.v1";
const RECORD_TYPE = "note_core_artifact_adoption_ledger";
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(repoRoot, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const paths = {
  doc: "docs/orchestration/note_core_artifact_adoption_ledger_contract.md",
  schema: "schema/orchestration/note_core_artifact_adoption_ledger_contract.schema.json",
  test: "tests/note_core_artifact_adoption_ledger_contract.test.mjs",
  valid: "tests/fixtures/note-core-artifact-adoption-ledger-contract/valid/accepted-closeout-ledger.json",
  runtimeTouched: "tests/fixtures/note-core-artifact-adoption-ledger-contract/invalid/runtime-touched.json",
  missingOwnerAcceptance: "tests/fixtures/note-core-artifact-adoption-ledger-contract/invalid/missing-owner-acceptance.json",
};

const allowlist = Object.values(paths);

const requiredTopLevel = [
  "schema_version",
  "build_id",
  "record_type",
  "lane_name",
  "lane_status",
  "closeout_classification",
  "owner_acceptance_phrase",
  "source_artifact",
  "previous_contract",
  "recommended_next_action",
  "safety_boundary",
  "human_decision_point",
  "created_at",
];

const safetyBoundaryFields = [
  "runtime_touched",
  "deploy_touched",
  "api_touched",
  "auth_touched",
  "billing_touched",
  "trading_touched",
  "private_repo_read",
  "contracts_repo_read",
];

function validateRecord(record) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) return ["record must be an object"];

  for (const field of requiredTopLevel) {
    if (!(field in record)) errors.push(`${field} is required`);
  }

  if (record.schema_version !== SCHEMA_VERSION) errors.push("schema_version must be stable");
  if (record.build_id !== BUILD_ID) errors.push("build_id must match");
  if (record.record_type !== RECORD_TYPE) errors.push("record_type must match");
  for (const field of ["lane_name", "lane_status", "closeout_classification", "owner_acceptance_phrase", "recommended_next_action", "human_decision_point", "created_at"]) {
    if (typeof record[field] !== "string" || record[field].length === 0) errors.push(`${field} must be non-empty`);
  }

  if (typeof record.source_artifact?.filename !== "string" || record.source_artifact.filename.length === 0) {
    errors.push("source_artifact.filename must be non-empty");
  }
  if (!/^[A-Fa-f0-9]{64}$/.test(record.source_artifact?.sha256 ?? "")) {
    errors.push("source_artifact.sha256 must be SHA256");
  }
  if (!["note_scout", "note_review", "codex_packet", "closeout_packet"].includes(record.source_artifact?.artifact_type)) {
    errors.push("source_artifact.artifact_type is invalid");
  }

  for (const field of ["name", "lane", "status"]) {
    if (typeof record.previous_contract?.[field] !== "string" || record.previous_contract[field].length === 0) {
      errors.push(`previous_contract.${field} must be non-empty`);
    }
  }

  for (const field of safetyBoundaryFields) {
    if (record.safety_boundary?.[field] !== false) errors.push(`safety_boundary.${field} must be false`);
  }

  return errors;
}

test("schema pins the adoption ledger identity", () => {
  const schema = readJson(paths.schema);
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$id, "lonewolf.note_core.artifact_adoption_ledger_contract.v1");
  assert.equal(schema.title, "NOTE-Core Artifact Adoption Ledger Contract");
  assert.equal(schema.type, "object");
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema_version.const, SCHEMA_VERSION);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.record_type.const, RECORD_TYPE);
  for (const field of requiredTopLevel) assert.ok(schema.required.includes(field), `${field} is required`);
});

test("required safety boundary fields exist and are false-only", () => {
  const safety = readJson(paths.schema).properties.safety_boundary;
  for (const field of safetyBoundaryFields) {
    assert.ok(safety.required.includes(field), `${field} must be required`);
    assert.equal(safety.properties[field].const, false, `${field} must be const false`);
  }
});

test("valid accepted closeout ledger fixture passes", () => {
  const record = readJson(paths.valid);
  assert.deepEqual(validateRecord(record), []);
  assert.equal(record.lane_name, "NOTE_CORE_ARTIFACT_CONTRACT_SCHEMA_TESTS_LANE");
  assert.equal(record.lane_status, "LANE_CLOSED_MERGED_NO_RUNTIME_ACTION");
  assert.equal(record.owner_acceptance_phrase, "OWNER_ACCEPT_LANE_CLOSED_MERGED_NO_RUNTIME_ACTION");
});

test("runtime-touched fixture fails closed", () => {
  const errors = validateRecord(readJson(paths.runtimeTouched));
  assert.ok(errors.some((error) => error.includes("safety_boundary.runtime_touched")), errors.join("\n"));
});

test("missing owner acceptance fixture fails closed", () => {
  const errors = validateRecord(readJson(paths.missingOwnerAcceptance));
  assert.ok(errors.some((error) => error.includes("owner_acceptance_phrase")), errors.join("\n"));
});

test("source artifact checksum shape is required", () => {
  const source = readJson(paths.schema).properties.source_artifact;
  assert.ok(source.required.includes("sha256"));
  assert.equal(source.properties.sha256.pattern, "^[A-Fa-f0-9]{64}$");
});

test("documentation preserves adoption ledger boundaries", () => {
  const doc = readText(paths.doc);
  assert.match(doc, /owner-accepted/i);
  assert.match(doc, /does not execute runtime actions/i);
  assert.match(doc, /does not.*deploy/i);
  assert.match(doc, /owner remains the gate/i);
  assert.match(doc, /LANE_CLOSED_MERGED_NO_RUNTIME_ACTION/);
});

test("contract files remain inside the exact docs schema tests fixtures allowlist", () => {
  assert.deepEqual(allowlist, [
    "docs/orchestration/note_core_artifact_adoption_ledger_contract.md",
    "schema/orchestration/note_core_artifact_adoption_ledger_contract.schema.json",
    "tests/note_core_artifact_adoption_ledger_contract.test.mjs",
    "tests/fixtures/note-core-artifact-adoption-ledger-contract/valid/accepted-closeout-ledger.json",
    "tests/fixtures/note-core-artifact-adoption-ledger-contract/invalid/runtime-touched.json",
    "tests/fixtures/note-core-artifact-adoption-ledger-contract/invalid/missing-owner-acceptance.json",
  ]);
});
