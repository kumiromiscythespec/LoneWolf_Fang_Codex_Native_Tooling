// BUILD_ID: 2026-06-27_squash_merge_retained_branch_realignment_contract_v1

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const BUILD_ID = "2026-06-27_squash_merge_retained_branch_realignment_contract_v1";
const RECORD_TYPE = "squash_merge_retained_branch_realignment_contract";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const paths = {
  doc: "docs/orchestration/squash_merge_retained_branch_realignment_contract.md",
  schema: "schema/orchestration/squash_merge_retained_branch_realignment_contract.schema.json",
  test: "tests/squash_merge_retained_branch_realignment_contract.test.mjs",
  valid: "tests/fixtures/squash-merge-retained-branch-realignment-contract/valid/clean-branch-realignment-ready.json",
  carryover: "tests/fixtures/squash-merge-retained-branch-realignment-contract/invalid/unexpected-carryover-files.json",
  branchRewrite: "tests/fixtures/squash-merge-retained-branch-realignment-contract/invalid/force-push-or-branch-delete-requested.json",
};

const contractAllowlist = Object.values(paths);
const safetyFields = [
  "no_force_push",
  "no_branch_deletion",
  "no_branch_cleanup",
  "no_broad_fetch_or_pull",
  "no_deploy",
  "no_runtime",
  "no_api_auth_billing_trading",
  "no_private_or_contracts_access",
  "no_unrelated_refactor",
];

function resolveRef(schema, rootSchema) {
  if (!schema?.$ref) return schema;
  const name = schema.$ref.replace("#/$defs/", "");
  return rootSchema.$defs[name];
}

function validateShape(value, schema, rootSchema, path = "record") {
  schema = resolveRef(schema, rootSchema);
  const errors = [];
  if ("const" in schema && value !== schema.const) errors.push(`${path} must equal ${schema.const}`);
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path} must be an allowed enum value`);
  if (schema.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [`${path} must be an object`];
    for (const field of schema.required ?? []) if (!(field in value)) errors.push(`${path}.${field} is required`);
    if (schema.additionalProperties === false) {
      for (const field of Object.keys(value)) if (!(field in schema.properties)) errors.push(`${path}.${field} is not allowed`);
    }
    for (const [field, childSchema] of Object.entries(schema.properties ?? {})) {
      if (field in value) errors.push(...validateShape(value[field], childSchema, rootSchema, `${path}.${field}`));
    }
  } else if (schema.type === "array") {
    if (!Array.isArray(value)) return [`${path} must be an array`];
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${path} has too few items`);
    if (schema.uniqueItems && new Set(value).size !== value.length) errors.push(`${path} must contain unique items`);
    for (let i = 0; i < value.length; i += 1) errors.push(...validateShape(value[i], schema.items, rootSchema, `${path}[${i}]`));
  } else if (schema.type === "string" && typeof value !== "string") errors.push(`${path} must be a string`);
  else if (schema.type === "integer" && !Number.isInteger(value)) errors.push(`${path} must be an integer`);
  else if (schema.type === "boolean" && typeof value !== "boolean") errors.push(`${path} must be a boolean`);
  if (typeof value === "string" && schema.minLength && value.length < schema.minLength) errors.push(`${path} must be non-empty`);
  if (typeof value === "string" && schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path} pattern mismatch`);
  if (typeof value === "number" && schema.minimum !== undefined && value < schema.minimum) errors.push(`${path} is below minimum`);
  return errors;
}

function validateRecord(record) {
  const schema = readJson(paths.schema);
  const errors = validateShape(record, schema, schema);
  const candidate = record.current_candidate ?? {};
  const detection = record.detection ?? {};
  const plan = record.realignment_plan ?? {};
  const hasCarryover = (candidate.unexpected_files?.length ?? 0) > 0 || (candidate.carryover_files?.length ?? 0) > 0;

  if (candidate.expected_file_count !== candidate.expected_files?.length) errors.push("expected file count must match expected files");
  if (candidate.actual_compare_file_count !== candidate.compare_files?.length) errors.push("compare file count must match compare files");
  if (hasCarryover && detection.blocker_triggered !== true) errors.push("carryover must trigger blocker");
  if (hasCarryover && detection.blocker_reason !== "unexpected_carryover_files") errors.push("carryover blocker reason must match");
  if (hasCarryover && plan.required !== true) errors.push("carryover requires realignment");
  if (plan.required === true && plan.exact_file_transfer !== true) errors.push("required realignment must use exact file transfer");
  if (plan.clean_compare_file_count !== plan.expected_clean_compare_file_count) errors.push("clean compare must be exact");
  for (const field of safetyFields) if (record.safety_boundary?.[field] !== true) errors.push(`safety_boundary.${field} must be true`);
  return errors;
}

test("schema pins identity and strict object shapes", () => {
  const schema = readJson(paths.schema);
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$id, "lonewolf.codex_native.squash_merge_retained_branch_realignment_contract.v1");
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.record_type.const, RECORD_TYPE);
  for (const field of schema.required) assert.ok(field in schema.properties);
  for (const field of ["prior_squash_merge", "current_candidate", "detection", "realignment_plan", "safety_boundary", "validation"]) {
    assert.equal(schema.properties[field].additionalProperties, false, field);
  }
});

test("valid clean-branch realignment evidence passes", () => {
  const record = readJson(paths.valid);
  assert.deepEqual(validateRecord(record), []);
  assert.equal(record.current_candidate.expected_file_count, 19);
  assert.equal(record.current_candidate.actual_compare_file_count, 25);
  assert.equal(record.current_candidate.carryover_files.length, 6);
  assert.equal(record.realignment_plan.clean_compare_file_count, 19);
  assert.equal(record.realignment_plan.resulting_remote_master_commit, "fad49c2065bea4d07aa67516b2ddad705ae0b629");
});

test("unexpected carryover without a blocker fails closed", () => {
  const errors = validateRecord(readJson(paths.carryover));
  assert.ok(errors.some((error) => error.includes("carryover must trigger blocker")), errors.join("\n"));
  assert.ok(errors.some((error) => error.includes("carryover requires realignment")), errors.join("\n"));
});

test("force push and branch deletion permission fail closed", () => {
  const errors = validateRecord(readJson(paths.branchRewrite));
  assert.ok(errors.some((error) => error.includes("no_force_push")), errors.join("\n"));
  assert.ok(errors.some((error) => error.includes("no_branch_deletion")), errors.join("\n"));
});

test("clean branch compare must match the approved exact count", () => {
  const record = structuredClone(readJson(paths.valid));
  record.realignment_plan.clean_compare_file_count = 18;
  assert.ok(validateRecord(record).some((error) => error.includes("clean compare must be exact")));
});

test("runtime deploy API private and branch mutation boundaries are true-only", () => {
  const safety = readJson(paths.schema).properties.safety_boundary;
  for (const field of safetyFields) {
    assert.ok(safety.required.includes(field), field);
    assert.equal(safety.properties[field].const, true, field);
  }
});

test("unknown fields are rejected", () => {
  const record = structuredClone(readJson(paths.valid));
  record.automatic_pr_creation = true;
  assert.ok(validateRecord(record).some((error) => error.includes("automatic_pr_creation is not allowed")));
});

test("documentation preserves the bounded non-executing contract", () => {
  const doc = readText(paths.doc);
  assert.match(doc, /squash merge/i);
  assert.match(doc, /PR creation is blocked/i);
  assert.match(doc, /exact-file patch/i);
  assert.match(doc, /no force push/i);
  assert.match(doc, /no branch deletion/i);
  assert.match(doc, /READY is not GO/);
});

test("contract file allowlist is exactly six files", () => {
  assert.deepEqual(contractAllowlist, [
    "docs/orchestration/squash_merge_retained_branch_realignment_contract.md",
    "schema/orchestration/squash_merge_retained_branch_realignment_contract.schema.json",
    "tests/squash_merge_retained_branch_realignment_contract.test.mjs",
    "tests/fixtures/squash-merge-retained-branch-realignment-contract/valid/clean-branch-realignment-ready.json",
    "tests/fixtures/squash-merge-retained-branch-realignment-contract/invalid/unexpected-carryover-files.json",
    "tests/fixtures/squash-merge-retained-branch-realignment-contract/invalid/force-push-or-branch-delete-requested.json",
  ]);
});
