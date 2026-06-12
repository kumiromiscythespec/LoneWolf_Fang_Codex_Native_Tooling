// BUILD_ID: 20260612_fasttrack_window6_user_runbook_docs_v0
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const buildId = "20260612_fasttrack_window6_user_runbook_docs_v0";
const fixtureBuildId = "20260612_fasttrack_window6_user_runbook_docs_fixture_v0";
const fixture = readJson("tests/fixtures/docs/fasttrack_acceptance_checklist.json");

const docs = [
  "docs/orchestration/codex_native_v0_1_fasttrack_user_runbook.md",
  "docs/orchestration/codex_native_fasttrack_operator_checklist.md",
  "docs/orchestration/codex_native_debug_after_fasttrack.md",
  "docs/orchestration/codex_native_known_boundaries_after_fasttrack.md"
];

const completedItems = [
  "task authoring helper",
  "generated task",
  "dry-run validator",
  "execution interpreter",
  "AppData-only review packet",
  "task-result linkage contracts",
  "first linkage proof",
  "post-linkage review"
];

const fasttrackAdditions = [
  "AppData linkage ledger writer",
  "read-only linkage consumer",
  "manual state machine coordinator",
  "safety guards"
];

const forbiddenBoundaryTerms = [
  "deploy",
  "runtime automatic execution",
  "private API",
  "trading",
  "billing",
  "daemon",
  "watcher"
];

function assertIncludes(text, term, file) {
  assert.ok(text.toLowerCase().includes(term.toLowerCase()), `${file} must mention ${term}`);
}

assert.equal(fixture.build_id, fixtureBuildId, "fixture build_id must match requested docs fixture build");
assert.equal(fixture.schema, "lonewolf.codex_native.fasttrack_acceptance_checklist.v1");
assert.deepEqual(fixture.required_docs, docs, "fixture must list all Window 6 docs");
assert.deepEqual(fixture.completed_mvp_items, completedItems);
assert.deepEqual(fixture.fasttrack_additions, fasttrackAdditions);
assert.deepEqual(fixture.owner_decisions, ["GO", "REPAIR", "STOP"]);
assert.ok(fixture.human_review_one_point.length > 0, "fixture must include one human review point");

for (const path of docs) {
  assert.equal(existsSync(resolve(root, path)), true, `${path} must exist`);
  const text = readText(path);
  assert.ok(text.startsWith(`<!-- BUILD_ID: ${buildId} -->`), `${path} must start with BUILD_ID`);
  assertIncludes(text, "GO", path);
  assertIncludes(text, "REPAIR", path);
  assertIncludes(text, "STOP", path);
  assertIncludes(text, "AppData", path);
  assertIncludes(text, "SHA256", path);
  assertIncludes(text, "owner", path);
}

const runbook = readText("docs/orchestration/codex_native_v0_1_fasttrack_user_runbook.md");
for (const term of completedItems) assertIncludes(runbook, term, "user runbook");
for (const term of fasttrackAdditions) assertIncludes(runbook, term, "user runbook");
for (const term of forbiddenBoundaryTerms) assertIncludes(runbook, term, "user runbook");
for (const term of [
  "How To Run Static Tests",
  "How To Create AppData Packets",
  "How To Inspect Artifacts",
  "Future Bug Fixing After Fast-Track"
]) {
  assertIncludes(runbook, term, "user runbook");
}

const operatorChecklist = readText("docs/orchestration/codex_native_fasttrack_operator_checklist.md");
for (const label of [
  "CHANGED_SUMMARY",
  "WORKTREE_PATH",
  "BRANCH",
  "BASE_COMMIT",
  "RULE_FILE_RESULT",
  "DOCS_RESULT",
  "CHANGED_FILES",
  "TEST_RESULT",
  "LOCAL_COMMIT_RESULT",
  "COMMIT_HASH",
  "PUSH_PERFORMED",
  "RUNTIME_PERFORMED",
  "FORBIDDEN_ACTIONS_CONFIRMATION",
  "ZIP_PATH",
  "SHA256",
  "ZIP_ENTRY_COUNT",
  "INTEGRATION_NOTES",
  "UNCONFIRMED_ASSUMPTIONS",
  "DANGEROUS_CHANGES",
  "HUMAN_REVIEW_ONE_POINT",
  "CONFIDENCE_LEVEL"
]) {
  assertIncludes(operatorChecklist, label, "operator checklist");
}

const debugDocs = readText("docs/orchestration/codex_native_debug_after_fasttrack.md");
for (const term of [
  "Repair Lane Pattern",
  "Do Not Use These Debug Shortcuts",
  "Escalation Triggers",
  "helper, validator, or interpreter commands"
]) {
  assertIncludes(debugDocs, term, "debug docs");
}

const boundaryDocs = readText("docs/orchestration/codex_native_known_boundaries_after_fasttrack.md");
for (const term of [
  "Permanent Non-Approvals",
  "AppData Evidence Boundary",
  "Ledger And Consumer Boundary",
  "State Machine Boundary",
  "Future Expansion Gate"
]) {
  assertIncludes(boundaryDocs, term, "known boundaries docs");
}

const combinedDocs = docs.map(readText).join("\n");
for (const unsafeClaim of [
  "deploy performed",
  "runtime automatic execution is allowed",
  "private API access is allowed",
  "trading is allowed",
  "billing mutation is allowed",
  "daemon is enabled",
  "watcher is enabled",
  "push performed"
]) {
  assert.ok(!combinedDocs.toLowerCase().includes(unsafeClaim), `docs must not claim ${unsafeClaim}`);
}

const thisSource = readText("tests/codex_native_fasttrack_docs_contract.test.mjs");
for (const token of [
  ["node:", "child_process"].join(""),
  ["spawn", "Sync("].join(""),
  ["exec", "File("].join(""),
  ["file_queue_task_authoring", "_helper"].join(""),
  ["file_queue_dry_run", "_validator"].join(""),
  ["file_queue_execution", "_interpreter"].join(""),
  ["open", "ai"].join(""),
  ["play", "wright"].join(""),
  ["pupp", "eteer"].join(""),
  ["stri", "pe"].join(""),
  ["cloud", "flare"].join("")
]) {
  assert.equal(thisSource.includes(token), false, `docs contract test must not include ${token}`);
}

console.log("codex_native_fasttrack_docs_contract_static: ok");
