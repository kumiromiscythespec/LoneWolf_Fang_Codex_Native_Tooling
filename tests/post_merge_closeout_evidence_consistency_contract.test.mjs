// BUILD_ID: 2026-07-02_post_merge_closeout_evidence_consistency_contract_v1

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const BUILD_ID = "2026-07-02_post_merge_closeout_evidence_consistency_contract_v1";
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(repoRoot, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));
const fixtureRoot = "tests/fixtures/post-merge-closeout-evidence-consistency-contract";

const paths = {
  doc: "docs/orchestration/post_merge_closeout_evidence_consistency_contract.md",
  schema: "schema/orchestration/post_merge_closeout_evidence_consistency_contract.schema.json",
  test: "tests/post_merge_closeout_evidence_consistency_contract.test.mjs",
  valid: `${fixtureRoot}/valid/consistent-post-merge-closeout-ready.json`,
  prNotMerged: `${fixtureRoot}/invalid/ready-classification-but-pr-not-merged.json`,
  openPr: `${fixtureRoot}/invalid/closed-lane-but-open-pr-remains.json`,
  remoteMaster: `${fixtureRoot}/invalid/remote-master-mismatch.json`,
  sourceDiff: `${fixtureRoot}/invalid/source-diff-not-empty.json`,
  retainedBranch: `${fixtureRoot}/invalid/branch-retention-mismatch.json`,
  safety: `${fixtureRoot}/invalid/safety-boundary-contradiction.json`,
};

const exactFiles = Object.values(paths);
const sha = /^[a-f0-9]{40}$/;
const sha256 = /^[A-Fa-f0-9]{64}$/;
const safetyFlags = [
  "fetch_performed", "pull_performed", "checkout_or_switch_performed",
  "push_performed", "branch_deleted", "cleanup_performed", "deploy_performed",
  "runtime_performed", "api_auth_billing_trading_performed",
];

function validateCloseout(record) {
  const errors = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) return ["record must be an object"];
  if (record.build_id !== BUILD_ID) errors.push("build_id must match");
  if (record.contract_name !== "post_merge_closeout_evidence_consistency_contract") errors.push("contract_name must match");
  if (!/POST_MERGE_CLOSEOUT_READY$/.test(record.final_classification ?? "")) errors.push("final_classification must be post-merge READY");
  if (record.final_lane_status !== "LANE_CLOSED_MERGED_NO_RUNTIME_ACTION") errors.push("final_lane_status must be closed merged no-runtime");
  if (record.pr?.final_state !== "MERGED") errors.push("pr_final_state must be MERGED");
  if (!Number.isInteger(record.pr?.number) || record.pr.number < 1) errors.push("pr number must be positive");
  for (const field of ["old_remote_master", "new_remote_master", "merge_commit_oid", "squash_merge_commit"]) {
    if (!sha.test(record.merge?.[field] ?? "")) errors.push(`merge.${field} must be SHA`);
  }
  if (record.merge?.new_remote_master !== record.merge?.merge_commit_oid || record.merge?.new_remote_master !== record.merge?.squash_merge_commit) {
    errors.push("remote master must equal merge commit evidence");
  }
  if (record.open_pr_after_merge?.count !== 0 || record.open_pr_after_merge?.prs?.length !== 0) errors.push("open PR after merge must be absent");
  if (record.retained_branch?.branch_retained !== true) errors.push("branch_retained must be true");
  if (!sha.test(record.retained_branch?.retained_branch_sha ?? "") || record.retained_branch?.retained_branch_sha !== record.retained_branch?.remote_evidence_sha) {
    errors.push("retained branch SHA must match remote evidence");
  }
  const tree = record.working_tree;
  if (tree?.clean !== true || tree?.source_diff_empty !== true || tree?.staged_file_count !== 0 || tree?.source_diff_file_count !== 0 || tree?.cached_diff_file_count !== 0) {
    errors.push("source and index diff evidence must be empty");
  }
  const safety = record.safety_boundary;
  if (safety?.no_runtime_action_required !== true) errors.push("no_runtime_action_required must be true");
  if (!Array.isArray(safety?.forbidden_actions_after_merge) || safety.forbidden_actions_after_merge.length !== 0) errors.push("forbidden post-merge actions must be absent");
  for (const field of safetyFlags) if (safety?.[field] !== false) errors.push(`safety_boundary.${field} must be false`);
  if (!sha256.test(record.merge_result_packet_sha256 ?? "")) errors.push("merge result packet SHA256 must be valid");
  if (record.human_review_required !== true) errors.push("human_review_required must be true");
  for (const [name, value] of Object.entries(record.checks ?? {})) if (value !== "PASS") errors.push(`checks.${name} must be PASS`);
  return errors;
}

test("schema pins the focused post-merge closeout identity and false-only boundaries", () => {
  const schema = readJson(paths.schema);
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$id, "lonewolf.codex_native.post_merge_closeout_evidence_consistency_contract.v1");
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.final_lane_status.const, "LANE_CLOSED_MERGED_NO_RUNTIME_ACTION");
  assert.equal(schema.properties.pr.properties.final_state.const, "MERGED");
  for (const field of safetyFlags) assert.equal(schema.properties.safety_boundary.properties[field].const, false);
});

test("consistent PR10-style closeout evidence passes", () => {
  const record = readJson(paths.valid);
  assert.deepEqual(validateCloseout(record), []);
  assert.equal(record.pr.number, 10);
  assert.equal(record.merge.new_remote_master, record.merge.squash_merge_commit);
  assert.equal(record.open_pr_after_merge.count, 0);
});

const invalidCases = [
  ["READY classification with non-merged PR", paths.prNotMerged, "pr_final_state"],
  ["closed lane with an open PR", paths.openPr, "open PR"],
  ["remote master mismatch", paths.remoteMaster, "remote master"],
  ["nonempty source or index diff", paths.sourceDiff, "source and index"],
  ["retained branch mismatch", paths.retainedBranch, "retained branch"],
  ["safety boundary contradiction", paths.safety, "forbidden post-merge"],
];

for (const [name, path, expected] of invalidCases) {
  test(`${name} fails closed`, () => {
    const errors = validateCloseout(readJson(path));
    assert.ok(errors.some((error) => error.includes(expected)), errors.join("\n"));
  });
}

test("closed lane cannot pass without merged PR evidence", () => {
  const record = structuredClone(readJson(paths.valid));
  delete record.pr.final_state;
  assert.ok(validateCloseout(record).some((error) => error.includes("pr_final_state")));
});

test("merge-result packet linkage is required and well formed", () => {
  const record = structuredClone(readJson(paths.valid));
  record.merge_result_packet_sha256 = "missing";
  assert.ok(validateCloseout(record).some((error) => error.includes("merge result packet SHA256")));
});

test("documentation states fail-closed and no-runtime boundaries", () => {
  const doc = readText(paths.doc);
  assert.match(doc, /contradicts a closed, merged, no-runtime-action lane/i);
  assert.match(doc, /Any contradiction blocks READY/);
  assert.match(doc, /READY is not GO/);
  assert.match(doc, /does not authorize commit, push, PR creation, merge, fetch, pull/i);
});

test("new contract files contain no unresolved placeholders", () => {
  const placeholder = new RegExp("\\$[A-Za-z_][A-Za-z0-9_]*|<PLACE" + "HOLDER>|\\bTO" + "DO\\b|\\bT" + "BD\\b");
  const schemaKeywords = /\$(?:schema|id|comment|ref|defs)\b/g;
  for (const path of exactFiles) {
    const scannable = readText(path).replace(schemaKeywords, "JSON_SCHEMA_KEYWORD");
    assert.doesNotMatch(scannable, placeholder, path);
  }
});

test("contract scope is exactly the ten approved docs schema tests fixtures files", () => {
  assert.equal(exactFiles.length, 10);
  assert.deepEqual(exactFiles.slice(0, 3), [paths.doc, paths.schema, paths.test]);
});
