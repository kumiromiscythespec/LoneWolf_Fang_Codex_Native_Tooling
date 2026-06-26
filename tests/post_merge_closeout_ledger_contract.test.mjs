// BUILD_ID: 2026-06-26_post_merge_closeout_ledger_contract_v1

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const BUILD_ID = "2026-06-26_post_merge_closeout_ledger_contract_v1";
const RECORD_TYPE = "post_merge_closeout_ledger_record";
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(repoRoot, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const paths = {
  doc: "docs/orchestration/post_merge_closeout_ledger_contract.md",
  schema: "schema/orchestration/post_merge_closeout_ledger_contract.schema.json",
  test: "tests/post_merge_closeout_ledger_contract.test.mjs",
  valid: "tests/fixtures/post-merge-closeout-ledger-contract/valid/pr6-merged-no-runtime-action.json",
  runtimeAction: "tests/fixtures/post-merge-closeout-ledger-contract/invalid/runtime-action-requested.json",
  missingOwnerAcceptance: "tests/fixtures/post-merge-closeout-ledger-contract/invalid/missing-owner-acceptance.json",
};

const allowlist = Object.values(paths);

const requiredTopLevel = [
  "schema_version",
  "build_id",
  "record_type",
  "lane_name",
  "pr",
  "merge",
  "remote_heads",
  "closeout",
  "scope",
  "validation",
  "safety_boundary",
  "owner_acceptance",
  "human_decision_point",
  "created_at",
];

const safetyBoundaryFields = [
  "deploy_touched",
  "runtime_touched",
  "api_auth_billing_trading_touched",
  "private_repo_read",
  "contracts_repo_read",
  "fetch_pull_checkout_performed",
  "branch_deleted",
  "force_push_performed",
];

function nonEmpty(value) {
  return typeof value === "string" && value.length > 0;
}

function validateRecord(record) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) return ["record must be an object"];

  for (const field of requiredTopLevel) {
    if (!(field in record)) errors.push(`${field} is required`);
  }

  if (record.schema_version !== "1.0.0") errors.push("schema_version must be 1.0.0");
  if (record.build_id !== BUILD_ID) errors.push("build_id must match");
  if (record.record_type !== RECORD_TYPE) errors.push("record_type must match");
  if (!nonEmpty(record.lane_name)) errors.push("lane_name must be non-empty");
  if (!nonEmpty(record.created_at)) errors.push("created_at must be non-empty");
  if (!nonEmpty(record.human_decision_point)) errors.push("human_decision_point must be non-empty");

  if (!Number.isInteger(record.pr?.number) || record.pr.number < 1) errors.push("pr.number must be positive");
  for (const field of ["url", "title", "base_branch", "head_branch", "head_commit_before_merge"]) {
    if (!nonEmpty(record.pr?.[field])) errors.push(`pr.${field} must be non-empty`);
  }
  if (record.pr?.state !== "MERGED") errors.push("pr.state must be MERGED");

  if (record.merge?.method !== "squash") errors.push("merge.method must be squash");
  if (!nonEmpty(record.merge?.command_used)) errors.push("merge.command_used must be non-empty");
  if (!/^[a-f0-9]{40}$/.test(record.merge?.merge_commit_sha ?? "")) errors.push("merge.merge_commit_sha must be SHA");
  if (record.merge?.branch_deleted !== false) errors.push("merge.branch_deleted must be false");

  if (record.remote_heads?.head_branch_kept !== true) errors.push("remote_heads.head_branch_kept must be true");
  if (record.remote_heads?.master_head_after_merge !== record.merge?.merge_commit_sha) {
    errors.push("remote_heads.master_head_after_merge must equal merge.merge_commit_sha");
  }
  if (record.remote_heads?.head_branch_after_merge !== record.pr?.head_commit_before_merge) {
    errors.push("remote_heads.head_branch_after_merge must equal pr.head_commit_before_merge");
  }

  if (!nonEmpty(record.closeout?.closeout_classification)) errors.push("closeout.closeout_classification must be non-empty");
  if (record.closeout?.final_lane_status !== "LANE_CLOSED_MERGED_NO_RUNTIME_ACTION") {
    errors.push("closeout.final_lane_status must be LANE_CLOSED_MERGED_NO_RUNTIME_ACTION");
  }
  if (!nonEmpty(record.closeout?.recommended_owner_action)) errors.push("closeout.recommended_owner_action must be non-empty");
  if (record.closeout?.no_runtime_action !== true) errors.push("closeout.no_runtime_action must be true");

  if (!Array.isArray(record.scope?.expected_files)) errors.push("scope.expected_files must be an array");
  if (!Array.isArray(record.scope?.actual_files)) errors.push("scope.actual_files must be an array");
  if (record.scope?.expected_file_count !== record.scope?.expected_files?.length) {
    errors.push("scope.expected_file_count must equal expected_files.length");
  }
  if (record.scope?.actual_file_count !== record.scope?.actual_files?.length) {
    errors.push("scope.actual_file_count must equal actual_files.length");
  }
  if (record.scope?.unexpected_files?.length !== 0) errors.push("scope.unexpected_files must be empty");
  if (record.scope?.missing_expected_files?.length !== 0) errors.push("scope.missing_expected_files must be empty");

  for (const field of ["focused_test", "full_test", "diff_check", "github_checks_summary", "dangerous_area_review"]) {
    if (!nonEmpty(record.validation?.[field])) errors.push(`validation.${field} must be non-empty`);
  }

  for (const field of safetyBoundaryFields) {
    if (record.safety_boundary?.[field] !== false) errors.push(`safety_boundary.${field} must be false`);
  }

  if (!nonEmpty(record.owner_acceptance?.phrase)) errors.push("owner_acceptance.phrase must be non-empty");

  return errors;
}

test("schema pins the post-merge closeout ledger identity", () => {
  const schema = readJson(paths.schema);
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$id, "lonewolf.codex_native.post_merge_closeout_ledger_contract.v1");
  assert.equal(schema.title, "Post-Merge Closeout Ledger Contract");
  assert.equal(schema.type, "object");
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema_version.const, "1.0.0");
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.record_type.const, RECORD_TYPE);
  for (const field of requiredTopLevel) assert.ok(schema.required.includes(field), `${field} is required`);
});

test("required safety boundary fields are false-only", () => {
  const safety = readJson(paths.schema).properties.safety_boundary;
  for (const field of safetyBoundaryFields) {
    assert.ok(safety.required.includes(field), `${field} must be required`);
    assert.equal(safety.properties[field].const, false, `${field} must be const false`);
  }
});

test("valid PR6 merged no-runtime fixture passes", () => {
  const record = readJson(paths.valid);
  assert.deepEqual(validateRecord(record), []);
  assert.equal(record.pr.number, 6);
  assert.equal(record.pr.state, "MERGED");
  assert.equal(record.closeout.final_lane_status, "LANE_CLOSED_MERGED_NO_RUNTIME_ACTION");
  assert.equal(record.closeout.no_runtime_action, true);
  assert.equal(record.scope.expected_file_count, 19);
  assert.equal(record.scope.actual_file_count, 19);
  assert.equal(record.validation.github_checks_summary, "NO_GITHUB_CHECKS_REPORTED");
});

test("runtime-action fixture fails closed", () => {
  const errors = validateRecord(readJson(paths.runtimeAction));
  assert.ok(errors.some((error) => error.includes("closeout.no_runtime_action")), errors.join("\n"));
  assert.ok(errors.some((error) => error.includes("safety_boundary.runtime_touched")), errors.join("\n"));
});

test("missing owner acceptance fixture fails closed", () => {
  const errors = validateRecord(readJson(paths.missingOwnerAcceptance));
  assert.ok(errors.some((error) => error.includes("owner_acceptance.phrase")), errors.join("\n"));
});

test("scope counts and mismatch guards are represented", () => {
  const schema = readJson(paths.schema);
  assert.equal(schema.properties.scope.properties.unexpected_files.maxItems, 0);
  assert.equal(schema.properties.scope.properties.missing_expected_files.maxItems, 0);
  const record = readJson(paths.valid);
  assert.equal(record.scope.expected_file_count, record.scope.expected_files.length);
  assert.equal(record.scope.actual_file_count, record.scope.actual_files.length);
  assert.deepEqual(record.scope.expected_files, record.scope.actual_files);
});

test("remote master and kept branch heads are tied to merge evidence", () => {
  const record = readJson(paths.valid);
  assert.equal(record.remote_heads.master_head_after_merge, record.merge.merge_commit_sha);
  assert.equal(record.remote_heads.head_branch_after_merge, record.pr.head_commit_before_merge);
  assert.equal(record.remote_heads.head_branch_kept, true);
  assert.equal(record.merge.branch_deleted, false);
});

test("documentation preserves no-runtime closeout boundaries", () => {
  const doc = readText(paths.doc);
  assert.match(doc, /post-merge closeout ledger/i);
  assert.match(doc, /LANE_CLOSED_MERGED_NO_RUNTIME_ACTION/);
  assert.match(doc, /READY is not GO/);
  assert.match(doc, /does not deploy/i);
  assert.match(doc, /runtime execution/i);
  assert.match(doc, /fetch\/pull\/checkout|fetch, pull,\s*checkout/i);
});

test("contract files remain inside the exact docs schema tests fixtures allowlist", () => {
  assert.deepEqual(allowlist, [
    "docs/orchestration/post_merge_closeout_ledger_contract.md",
    "schema/orchestration/post_merge_closeout_ledger_contract.schema.json",
    "tests/post_merge_closeout_ledger_contract.test.mjs",
    "tests/fixtures/post-merge-closeout-ledger-contract/valid/pr6-merged-no-runtime-action.json",
    "tests/fixtures/post-merge-closeout-ledger-contract/invalid/runtime-action-requested.json",
    "tests/fixtures/post-merge-closeout-ledger-contract/invalid/missing-owner-acceptance.json",
  ]);
});
