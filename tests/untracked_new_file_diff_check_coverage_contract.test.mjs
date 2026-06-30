// BUILD_ID: 2026-06-28_untracked_new_file_diff_check_coverage_contract_v1

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const BUILD_ID = "2026-06-28_untracked_new_file_diff_check_coverage_contract_v1";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));
const paths = {
  doc: "docs/orchestration/untracked_new_file_diff_check_coverage_contract.md",
  schema: "schema/orchestration/untracked_new_file_diff_check_coverage_contract.schema.json",
  test: "tests/untracked_new_file_diff_check_coverage_contract.test.mjs",
  valid: "tests/fixtures/untracked-new-file-diff-check-coverage-contract/valid/complete-intended-file-set-covered.json",
  uncovered: "tests/fixtures/untracked-new-file-diff-check-coverage-contract/invalid/untracked-new-file-not-covered.json",
  failedPush: "tests/fixtures/untracked-new-file-diff-check-coverage-contract/invalid/push-approved-after-committed-diff-check-failure.json",
};

function validate(record) {
  const errors = [];
  const set = record.intended_change_set ?? {};
  const coverage = record.diff_check_coverage ?? {};
  const commit = record.commit_approval_gate ?? {};
  const push = record.push_approval_gate ?? {};
  const repair = record.repair_policy ?? {};
  const safety = record.safety_boundary ?? {};
  if (record.record_type !== "untracked_new_file_diff_check_coverage_contract") errors.push("record type");
  if (set.expected_file_count !== set.expected_files?.length) errors.push("expected file count");
  if ((set.untracked_new_files?.length ?? 0) > 0 && coverage.untracked_new_files_checked !== true) errors.push("untracked new files must be checked");
  if ((!coverage.coverage_complete || coverage.coverage_gap_detected) && (commit.approval_allowed || !commit.blocker_triggered)) errors.push("incomplete coverage must block commit approval");
  if (push.committed_diff_check_failure && (push.approval_allowed || !push.blocker_triggered)) errors.push("committed diff failure must block push approval");
  if (repair.repair_required && !repair.approval_packet_regenerated) errors.push("repair requires regenerated approval packet");
  for (const field of ["amend_allowed", "force_push_allowed", "branch_deletion_allowed"]) if (repair[field] !== false) errors.push(`${field} must be false`);
  for (const field of ["no_deploy", "no_runtime", "no_api_auth_billing_trading", "no_private_or_contracts_access", "no_pull_fetch_without_approval", "no_checkout_switch_without_approval", "no_force_push", "no_branch_deletion"]) if (safety[field] !== true) errors.push(`${field} must be true`);
  const allowed = new Set(readJson(paths.schema).required);
  for (const field of Object.keys(record)) if (!allowed.has(field)) errors.push(`${field} is not allowed`);
  return errors;
}

test("schema and exact six-file contract identity are pinned", () => {
  const schema = readJson(paths.schema);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.record_type.const, "untracked_new_file_diff_check_coverage_contract");
  assert.equal(Object.keys(paths).length, 6);
});

test("complete intended file set coverage passes", () => {
  const record = readJson(paths.valid);
  assert.deepEqual(validate(record), []);
  assert.equal(record.intended_change_set.expected_file_count, 2);
  assert.equal(record.intended_change_set.untracked_new_files.length, 1);
});

test("untracked new file without coverage fails closed", () => {
  const errors = validate(readJson(paths.uncovered));
  assert.ok(errors.some((error) => error.includes("untracked new files")));
  assert.ok(errors.some((error) => error.includes("block commit")));
});

test("committed diff failure blocks push and requires regenerated packet", () => {
  const errors = validate(readJson(paths.failedPush));
  assert.ok(errors.some((error) => error.includes("block push")));
  assert.ok(errors.some((error) => error.includes("regenerated")));
});

test("amend force push and branch deletion are forbidden", () => {
  const record = structuredClone(readJson(paths.valid));
  for (const field of ["amend_allowed", "force_push_allowed", "branch_deletion_allowed"]) {
    record.repair_policy[field] = true;
    assert.ok(validate(record).some((error) => error.includes(field)));
    record.repair_policy[field] = false;
  }
});

test("runtime deploy API private and repository mutation boundaries fail closed", () => {
  const record = structuredClone(readJson(paths.valid));
  for (const field of Object.keys(record.safety_boundary)) {
    record.safety_boundary[field] = false;
    assert.ok(validate(record).some((error) => error.includes(field)));
    record.safety_boundary[field] = true;
  }
});

test("schema conditionals encode the approval blockers", () => {
  const schemaText = readText(paths.schema);
  assert.match(schemaText, /untracked_new_files_checked/);
  assert.match(schemaText, /committed_diff_check_failure/);
  assert.match(schemaText, /approval_packet_regenerated/);
  assert.ok(readJson(paths.schema).allOf.length >= 4);
});

test("unknown top-level fields are rejected", () => {
  const record = structuredClone(readJson(paths.valid));
  record.auto_push = true;
  assert.ok(validate(record).some((error) => error.includes("auto_push is not allowed")));
});

test("documentation names the untracked-file gap and bounded evidence", () => {
  const doc = readText(paths.doc);
  assert.match(doc, /git diff --check.*miss untracked/s);
  assert.match(doc, /git status --short --untracked-files=all/);
  assert.match(doc, /approval packet must be regenerated/i);
  assert.match(doc, /no force push/i);
});
