// BUILD_ID: 2026-07-01_approval_packet_evidence_consistency_contract_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const BUILD_ID = "2026-07-01_approval_packet_evidence_consistency_contract_v1";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));
const base = "tests/fixtures/approval-packet-evidence-consistency-contract";
const paths = {
  doc: "docs/orchestration/approval_packet_evidence_consistency_contract.md",
  schema: "schema/orchestration/approval_packet_evidence_consistency_contract.schema.json",
  valid: `${base}/valid/consistent-commit-approval-packet.json`,
  untrackedMismatch: `${base}/invalid/untracked-list-contradicts-manifest.json`,
  changedCountMismatch: `${base}/invalid/changed-files-count-contradicts-manifest.json`,
  statusSplitMismatch: `${base}/invalid/status-split-contradicts-lists.json`,
  readyWithFailure: `${base}/invalid/ready-classification-with-failed-check.json`,
};

const sorted = (items) => [...items].sort();
const statusPaths = (record, marker) => record.git_status_short_untracked_all
  .filter((line) => line.slice(0, 2) === marker)
  .map((line) => line.slice(3));

const stagedStatusPaths = (record) => record.git_status_short_untracked_all
  .filter((line) => line[0] !== " " && line[0] !== "?")
  .map((line) => {
    const path = line.slice(3);
    return ["R", "C"].includes(line[0]) ? path.split(" -> ").at(-1) : path;
  });

function validate(record) {
  const errors = [];
  const counts = record.manifest_counts ?? {};
  const checks = record.consistency_checks ?? {};
  const requiredEvidence = Object.values(record.evidence_files_present ?? {}).every(Boolean);
  const relationships = [
    ["changed count", counts.changed_file_count, record.changed_files_exact?.length, checks.changed_count_matches],
    ["tracked count", counts.tracked_modified_file_count, record.tracked_modified_files?.length, checks.tracked_modified_count_matches],
    ["untracked count", counts.untracked_new_file_count, record.untracked_new_files?.length, checks.untracked_new_count_matches],
    ["staged count", counts.staged_file_count, record.staged_files?.length, checks.staged_count_matches],
  ];
  for (const [name, count, length, claimed] of relationships) {
    if (count !== length || claimed !== (count === length)) errors.push(name);
  }
  const untrackedMatches = JSON.stringify(sorted(record.untracked_new_files ?? [])) === JSON.stringify(sorted(statusPaths(record, "??")));
  const trackedMatches = JSON.stringify(sorted(record.tracked_modified_files ?? [])) === JSON.stringify(sorted(statusPaths(record, " M")));
  const stagedFromStatus = stagedStatusPaths(record);
  const stagedMatches = JSON.stringify(sorted(record.staged_files ?? [])) === JSON.stringify(sorted(stagedFromStatus));
  if (!untrackedMatches || checks.untracked_paths_match_status !== untrackedMatches) errors.push("untracked status");
  if (!trackedMatches || checks.tracked_paths_match_status !== trackedMatches) errors.push("tracked status");
  if (!stagedMatches || checks.staged_paths_match_status !== stagedMatches) errors.push("staged status");
  if (counts.staged_file_count !== stagedFromStatus.length) errors.push("staged status count");
  const unionMatches = JSON.stringify(sorted(record.changed_files_exact ?? [])) === JSON.stringify(sorted([...(record.tracked_modified_files ?? []), ...(record.untracked_new_files ?? [])]));
  if (counts.staged_file_count === 0 && (!unionMatches || checks.changed_set_matches_union !== unionMatches)) errors.push("changed union");
  if (!requiredEvidence) errors.push("missing evidence");
  const allChecksPass = Object.values(checks).every(Boolean);
  if (/READY$/.test(record.readiness_classification) && (!allChecksPass || errors.length > 0)) errors.push("ready with failed consistency check");
  if (errors.length > 0 && (record.blocker_classification?.length ?? 0) === 0) errors.push("missing blocker classification");
  return errors;
}

test("schema and contract identity are pinned", () => {
  const schema = readJson(paths.schema);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.contract_name.const, "approval_packet_evidence_consistency_contract");
});

test("consistent 19/13/6/0 packet passes", () => {
  const record = readJson(paths.valid);
  assert.deepEqual(validate(record), []);
  assert.deepEqual(record.manifest_counts, { changed_file_count: 19, tracked_modified_file_count: 13, untracked_new_file_count: 6, staged_file_count: 0 });
});

test("PR 9 style untracked list contradiction is blocked", () => {
  const record = readJson(paths.untrackedMismatch);
  const errors = validate(record);
  assert.ok(errors.includes("untracked count"));
  assert.ok(errors.includes("untracked status"));
  assert.ok(record.blocker_classification.includes("UNTRACKED_LIST_STATUS_MISMATCH"));
});

test("changed files count mismatch is blocked", () => {
  assert.ok(validate(readJson(paths.changedCountMismatch)).includes("changed count"));
});

test("status and list split mismatch is blocked", () => {
  const errors = validate(readJson(paths.statusSplitMismatch));
  assert.ok(errors.includes("untracked status"));
  assert.ok(errors.includes("tracked status"));
});

test("contradictory staged status self-report cannot make READY valid", () => {
  const errors = validate(readJson(paths.readyWithFailure));
  assert.ok(errors.includes("staged status"));
  assert.ok(errors.includes("ready with failed consistency check"));
});

test("staged paths are derived from porcelain index states", () => {
  const record = {
    git_status_short_untracked_all: [
      "A  added", "M  modified", "D  deleted", "R  old -> renamed",
      "C  source -> copied", "AM added-modified", "MM modified-twice",
      " M worktree-only", " D worktree-delete", "?? untracked",
    ],
  };
  assert.deepEqual(stagedStatusPaths(record), [
    "added", "modified", "deleted", "renamed", "copied",
    "added-modified", "modified-twice",
  ]);
});

test("staged count must also match the derived status count", () => {
  const record = structuredClone(readJson(paths.valid));
  record.readiness_classification = "COMMIT_APPROVAL_PACKET_READY";
  record.manifest_counts.staged_file_count = 2;
  record.staged_files = ["docs/a.md", "tests/b.test.mjs"];
  record.git_status_short_untracked_all.push("A  docs/a.md");
  record.consistency_checks.staged_count_matches = true;
  record.consistency_checks.staged_paths_match_status = true;
  const errors = validate(record);
  assert.ok(errors.includes("staged status"));
  assert.ok(errors.includes("staged status count"));
  assert.ok(errors.includes("ready with failed consistency check"));
});

test("schema exposes every required evidence relationship", () => {
  const schemaText = readText(paths.schema);
  for (const field of ["changed_file_count", "tracked_modified_file_count", "untracked_new_file_count", "staged_file_count", "changed_set_matches_union", "no_ready_classification_when_contradicted"]) assert.match(schemaText, new RegExp(field));
});

test("documentation defines blockers and AppData-only repair", () => {
  const doc = readText(paths.doc);
  assert.match(doc, /must not be classified as READY/);
  assert.match(doc, /AppData-only/);
  assert.match(doc, /cannot be downgraded to a warning/);
  assert.match(doc, /READY is not GO/);
});

test("fixtures and schema preserve valid JSON and BUILD_ID", () => {
  for (const path of Object.values(paths).filter((path) => path.endsWith(".json"))) assert.equal(readJson(path).build_id ?? JSON.parse(readText(path)).properties.build_id.const, BUILD_ID);
});
