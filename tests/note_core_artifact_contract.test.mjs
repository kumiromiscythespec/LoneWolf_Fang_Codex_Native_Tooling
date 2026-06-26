// BUILD_ID: NOTE_CORE_ARTIFACT_CONTRACT_SCHEMA_TESTS_20260626

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const BUILD_ID = "NOTE_CORE_ARTIFACT_CONTRACT_SCHEMA_TESTS_20260626";
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(repoRoot, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const paths = {
  doc: "docs/orchestration/note_core_artifact_contract.md",
  schema: "schema/orchestration/note_core_artifact_contract.schema.json",
  test: "tests/note_core_artifact_contract.test.mjs",
  valid: "tests/fixtures/note-core-artifact-contract/valid/scout-review-artifact.json",
  invalid: "tests/fixtures/note-core-artifact-contract/invalid/runtime-approved.json",
};

const allowlist = Object.values(paths);

const coreRequired = [
  "build_id",
  "lane_name",
  "artifact_kind",
  "artifact_status",
  "verdict",
  "recommended_next_action",
  "result_count",
  "error_count",
  "blocker_count",
  "checksum",
  "forbidden_actions",
  "public_safety",
  "human_review_one_point",
];

const falseForbiddenActions = [
  "runtime_approved",
  "deploy_approved",
  "cloud_api_auth_billing_approved",
  "trading_order_paper_live_approved",
  "private_repo_read",
  "contracts_repo_read",
  "source_edit_approved",
  "commit_approved",
  "push_approved",
  "pr_create_approved",
  "merge_approved",
  "branch_delete_approved",
];

const trueSafetyFlags = ["synthetic_values_only", "redacted_for_public_repo"];
const falseSafetyFlags = [
  "contains_real_network_mapping",
  "contains_real_note_endpoint",
  "contains_credential_material",
  "contains_auth_detail",
  "contains_account_or_payment_detail",
  "contains_market_action_detail",
  "contains_raw_local_log",
  "contains_private_implementation_detail",
  "contains_contracts_repo_content",
  "contains_private_artifact_content",
  "contains_personal_data",
  "contains_production_data",
];

function expect(value, expected, label, errors) {
  if (value !== expected) errors.push(`${label} must be ${JSON.stringify(expected)}`);
}

function validateRecord(record) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return ["record must be an object"];
  }

  for (const field of coreRequired) {
    if (!(field in record)) errors.push(`${field} is required`);
  }

  expect(record.build_id, BUILD_ID, "build_id", errors);
  if (typeof record.lane_name !== "string" || record.lane_name.length === 0) errors.push("lane_name is required");
  if (!["note_scout", "note_review", "codex_packet", "approval_packet", "execution_packet", "closeout_packet"].includes(record.artifact_kind)) {
    errors.push("artifact_kind is invalid");
  }
  for (const field of ["artifact_status", "verdict", "recommended_next_action", "human_review_one_point"]) {
    if (typeof record[field] !== "string" || record[field].length === 0) errors.push(`${field} must be non-empty`);
  }
  for (const field of ["result_count", "error_count", "blocker_count"]) {
    if (!Number.isInteger(record[field]) || record[field] < 0) errors.push(`${field} must be a non-negative integer`);
  }

  if (!/^[A-Fa-f0-9]{64}$/.test(record.checksum?.artifact_zip_sha256 ?? "")) {
    errors.push("checksum.artifact_zip_sha256 must be SHA256");
  }
  expect(record.checksum?.sha256_sidecar_present, true, "checksum.sha256_sidecar_present", errors);
  expect(record.checksum?.sha256_json_sidecar_present, true, "checksum.sha256_json_sidecar_present", errors);

  for (const action of falseForbiddenActions) {
    expect(record.forbidden_actions?.[action], false, `forbidden_actions.${action}`, errors);
  }
  for (const flag of trueSafetyFlags) {
    expect(record.public_safety?.[flag], true, `public_safety.${flag}`, errors);
  }
  for (const flag of falseSafetyFlags) {
    expect(record.public_safety?.[flag], false, `public_safety.${flag}`, errors);
  }

  return errors;
}

test("schema pins the NOTE-Core artifact contract", () => {
  const schema = readJson(paths.schema);
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$id, "lonewolf.note_core.artifact_contract.v1");
  assert.equal(schema.title, "NOTE-Core Artifact Contract");
  assert.equal(schema.type, "object");
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  for (const field of coreRequired) assert.ok(schema.required.includes(field), `${field} is required`);
});

test("risky forbidden action fields are required and false", () => {
  const forbidden = readJson(paths.schema).properties.forbidden_actions;
  for (const action of falseForbiddenActions) {
    assert.ok(forbidden.required.includes(action), `${action} must be required`);
    assert.equal(forbidden.properties[action].const, false, `${action} must be const false`);
  }
});

test("valid fixture passes semantic validation", () => {
  assert.deepEqual(validateRecord(readJson(paths.valid)), []);
});

test("runtime-approved fixture fails closed", () => {
  const errors = validateRecord(readJson(paths.invalid));
  assert.ok(errors.some((error) => error.includes("forbidden_actions.runtime_approved")), errors.join("\n"));
});

test("documentation contains required safety boundary language", () => {
  const doc = readText(paths.doc);
  assert.match(doc, /evidence only/i);
  assert.match(doc, /do not authorize runtime behavior/i);
  assert.match(doc, /Codex\s+receives only narrow owner-approved tasks/i);
  assert.match(doc, /owner remains the gate/i);
  assert.match(doc, /real local network mappings/i);
  assert.match(doc, /real NOTE node endpoints/i);
});

test("exact file allowlist is limited to this lane", () => {
  assert.deepEqual(allowlist, [
    "docs/orchestration/note_core_artifact_contract.md",
    "schema/orchestration/note_core_artifact_contract.schema.json",
    "tests/note_core_artifact_contract.test.mjs",
    "tests/fixtures/note-core-artifact-contract/valid/scout-review-artifact.json",
    "tests/fixtures/note-core-artifact-contract/invalid/runtime-approved.json",
  ]);
});

test("created files avoid unsafe examples and mojibake", () => {
  const patternSources = [
    "192\\.168\\.",
    "localhost:\\d+",
    "API " + "key",
    "sec" + "ret",
    "raw " + "auth",
    "billing mutation " + "approved",
    "trading " + "approved",
    "PAPER " + "approved",
    "LIVE " + "approved",
    "NOTE" + "驗抵ｽ､",
    "NOTE" + "驗・",
    "・" + "ｽ",
  ];
  for (const path of allowlist) {
    const text = readText(path);
    for (const source of patternSources) {
      const pattern = new RegExp(source, "i");
      assert.doesNotMatch(text, pattern, `${path} should not match ${pattern}`);
    }
  }
});

test("created files avoid bidi and invisible control characters", () => {
  const forbiddenCodePoints = [
    0x061c, 0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0x202a, 0x202b, 0x202c,
    0x202d, 0x202e, 0x2066, 0x2067, 0x2068, 0x2069, 0xfeff,
  ];
  for (const path of allowlist) {
    const text = readText(path);
    for (const codePoint of forbiddenCodePoints) {
      assert.equal(text.includes(String.fromCodePoint(codePoint)), false, `${path} includes U+${codePoint.toString(16).toUpperCase()}`);
    }
  }
});
