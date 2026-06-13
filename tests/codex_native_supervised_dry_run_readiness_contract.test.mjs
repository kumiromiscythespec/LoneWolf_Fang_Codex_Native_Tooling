// BUILD_ID: 20260613_single_shot_supervised_dry_run_readiness_map_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const BUILD_ID = "20260613_single_shot_supervised_dry_run_readiness_map_v1";
const PHRASE = "APPROVE_SINGLE_SHOT_SUPERVISED_DRY_RUN_READINESS_MAP_DOCS_SCHEMA_TESTS_FIXTURES_ONLY";
const BASELINE = "16ab1da1fa40e575de90d91d155231338fcb33de";
const TARGET_REPO = "C:\\LoneWolf_Fang_Project\\repos\\core\\LoneWolf_Fang_Codex_Native_Tooling";
const EXPECTED_BRANCH = "master";
const EXPECTED_AHEAD_BEHIND = "0 / 0";
const ALLOWLIST_COUNT = 35;

const schema = readJson("schema/orchestration/codex_native_supervised_dry_run_readiness_record.schema.json");
const ready = readJson("tests/fixtures/codex-native-next-wave/valid/single_shot_supervised_dry_run_readiness_ready.json").readiness_record;
const runtime = readJson("tests/fixtures/codex-native-next-wave/invalid/single_shot_supervised_dry_run_readiness_runtime_attempt_blocked.json").readiness_record;
const deploy = readJson("tests/fixtures/codex-native-next-wave/invalid/single_shot_supervised_dry_run_readiness_deploy_attempt_blocked.json").readiness_record;
const external = readJson("tests/fixtures/codex-native-next-safe-parallel-wave/invalid/api_cloud_billing_trading_attempt_blocked.json");

const required = schema.required;
const allowedTop = new Set(Object.keys(schema.properties));
const forbiddenFlags = Object.keys(schema.$defs.forbidden_actions.properties);
const blockerFields = schema.$defs.blocker.required;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha(value, length) {
  return typeof value === "string" && new RegExp(`^[A-Fa-f0-9]{${length}}$`).test(value);
}

function readinessErrors(record) {
  const errors = [];
  for (const field of required) if (!Object.hasOwn(record, field)) errors.push(`missing ${field}`);
  for (const field of Object.keys(record)) if (!allowedTop.has(field)) errors.push(`unexpected ${field}`);
  if (errors.length) return errors;
  if (record.schema !== schema.properties.schema.const) errors.push("bad schema");
  if (record.build_id !== BUILD_ID) errors.push("bad build_id");
  if (record.objective !== "single_shot_supervised_dry_run_readiness_map") errors.push("bad objective");
  if (record.target_repo !== TARGET_REPO) errors.push("bad target repo");
  if (record.baseline_commit !== BASELINE || !sha(record.baseline_commit, 40)) errors.push("bad baseline");
  if (record.expected_branch !== EXPECTED_BRANCH) errors.push("bad branch");
  if (record.expected_ahead_behind !== EXPECTED_AHEAD_BEHIND) errors.push("bad ahead behind");
  if (!record.owner_approval || typeof record.owner_approval !== "object") {
    errors.push("missing_owner_approval");
  } else {
    if (record.owner_approval.approval_phrase !== PHRASE) errors.push("bad owner approval phrase");
    if (record.owner_approval.target_scope !== "single_shot_supervised_dry_run_readiness_map") errors.push("bad owner approval scope");
    if (record.owner_approval.exact_file_allowlist_count !== ALLOWLIST_COUNT) errors.push("bad owner approval allowlist");
    if (record.owner_approval.approval_fresh !== true) errors.push("bad owner approval freshness");
    if (record.owner_approval.approval_superseded !== false) errors.push("superseded owner approval");
    for (const field of ["wildcard_scope_used", "unbounded_fixture_scope", "broader_than_allowlist", "runtime_source_cloud_billing_trading_paths_in_scope", "ambiguous_or_incomplete_scope"]) {
      if (record.owner_approval[field] !== false) errors.push(`broad_scope ${field}`);
    }
  }
  if (record.owner_approval_phrase !== PHRASE) errors.push("bad owner phrase");
  if (record.owner_approval_fresh !== true) errors.push("bad owner approval freshness");
  if (record.dry_run_mode !== "SINGLE_SHOT_SUPERVISED_STATIC_READINESS_ONLY") errors.push("bad dry-run mode");
  if (!["READY_FOR_OWNER_REVIEW", "STOP_OWNER_REVIEW_REQUIRED"].includes(record.readiness_decision)) errors.push("bad decision");
  if (record.artifact_chain?.artifact_chain_role !== "readiness_map_evidence_chain") errors.push("unknown artifact chain role");
  for (const field of ["approval_packet_path", "stable_closeout_packet_path"]) {
    if (typeof record.artifact_chain?.[field] !== "string" || record.artifact_chain[field].length === 0) errors.push(`missing artifact_chain.${field}`);
  }
  for (const field of ["approval_packet_sha256", "stable_closeout_packet_sha256", "implementation_artifact_sha256", "implementation_review_packet_sha256"]) {
    if (!sha(record.artifact_chain?.[field], 64)) errors.push(`bad artifact_chain.${field}`);
  }
  if (record.artifact_chain?.implementation_evidence_required !== true) errors.push("missing implementation evidence requirement");
  if (!Array.isArray(record.blocker_matrix)) {
    errors.push("missing blocker_matrix");
  } else {
    if (record.readiness_decision === "READY_FOR_OWNER_REVIEW" && record.blocker_matrix.length !== 0) errors.push("inconsistent blocker_matrix ready state");
    if (record.readiness_decision === "STOP_OWNER_REVIEW_REQUIRED" && record.blocker_matrix.length === 0) errors.push("missing blocker_matrix stop blocker");
    for (const blocker of record.blocker_matrix) {
      for (const field of blockerFields) if (!Object.hasOwn(blocker, field)) errors.push(`bad blocker_matrix missing ${field}`);
      if (!["BLOCKER", "HIGH"].includes(blocker.severity)) errors.push("bad blocker_matrix severity");
      if (blocker.fail_closed_action !== "STOP_OWNER_REVIEW_REQUIRED") errors.push("bad blocker_matrix fail_closed_action");
      if (blocker.owner_review_required !== true) errors.push("bad blocker_matrix owner_review_required");
      if (blocker.allows_progression !== false) errors.push("bad blocker_matrix allows_progression");
    }
  }
  for (const flag of forbiddenFlags) {
    if (record.forbidden_actions?.[flag] !== false) errors.push(`forbidden ${flag}`);
  }
  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length === 0) {
    errors.push("missing human review");
  }
  return errors;
}

assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
assert.ok(required.includes("owner_approval"), "owner approval must be required");
assert.ok(required.includes("blocker_matrix"), "blocker matrix must be required");
assert.equal(schema.properties.target_repo.const, TARGET_REPO);
assert.equal(schema.properties.baseline_commit.const, BASELINE);
assert.equal(schema.properties.expected_branch.const, EXPECTED_BRANCH);
assert.equal(schema.properties.expected_ahead_behind.const, EXPECTED_AHEAD_BEHIND);
assert.equal(schema.properties.owner_approval_phrase.const, PHRASE);
assert.equal(schema.$defs.owner_approval.properties.approval_phrase.const, PHRASE);
assert.equal(schema.$defs.owner_approval.properties.exact_file_allowlist_count.const, ALLOWLIST_COUNT);
for (const field of ["approval_fresh", "approval_superseded", "wildcard_scope_used", "unbounded_fixture_scope", "broader_than_allowlist", "runtime_source_cloud_billing_trading_paths_in_scope", "ambiguous_or_incomplete_scope"]) {
  assert.ok(schema.$defs.owner_approval.required.includes(field), `${field} must be required in owner approval`);
}
assert.equal(schema.properties.dry_run_mode.const, "SINGLE_SHOT_SUPERVISED_STATIC_READINESS_ONLY");
assert.equal(schema.properties.forbidden_actions.$ref, "#/$defs/forbidden_actions");
assert.equal(schema.properties.blocker_matrix.$ref, "#/$defs/blocker_matrix");
assert.ok(schema.$defs.artifact_chain.required.includes("approval_packet_path"), "approval packet reference must be required");
assert.ok(schema.$defs.artifact_chain.required.includes("stable_closeout_packet_path"), "stable closeout reference must be required");
assert.ok(schema.$defs.artifact_chain.required.includes("implementation_artifact_sha256"), "implementation artifact SHA must be required");
assert.ok(schema.$defs.artifact_chain.required.includes("implementation_review_packet_sha256"), "review artifact SHA must be required");
for (const flag of forbiddenFlags) {
  assert.equal(schema.$defs.forbidden_actions.properties[flag].const, false, `${flag} must be const false`);
}

assert.deepEqual(readinessErrors(ready), [], "ready fixture must pass");
assert.ok(readinessErrors(runtime).includes("forbidden runtime_execution_allowed"), "runtime flag must fail closed");
assert.ok(readinessErrors(runtime).some((error) => error.startsWith("broad_scope")), "runtime/source scope must fail closed");
assert.ok(readinessErrors(deploy).includes("forbidden api_calls_allowed"), "API flag must fail closed");
assert.ok(readinessErrors(deploy).includes("forbidden cloud_mutation_allowed"), "cloud mutation flag must fail closed");
assert.ok(readinessErrors(deploy).some((error) => error.startsWith("broad_scope")), "wildcard or broad scope must fail closed");
assert.ok(readinessErrors(external).includes("forbidden api_calls_allowed"), "external API flag must fail closed");
assert.ok(readinessErrors(external).includes("forbidden billing_mutation_allowed"), "billing flag must fail closed");
assert.ok(readinessErrors(external).includes("forbidden trading_order_allowed"), "trading flag must fail closed");
assert.ok(readinessErrors(external).some((error) => error.startsWith("broad_scope")), "cloud/API/billing/trading scope must fail closed");

const missingOwnerApproval = clone(ready);
delete missingOwnerApproval.owner_approval;
assert.ok(readinessErrors(missingOwnerApproval).includes("missing owner_approval"), "missing_owner_approval must fail closed");

const emptyOwnerApprovalPhrase = clone(ready);
emptyOwnerApprovalPhrase.owner_approval.approval_phrase = "";
assert.ok(readinessErrors(emptyOwnerApprovalPhrase).includes("bad owner approval phrase"), "empty owner approval phrase must fail closed");

const wrongOwnerApprovalPhrase = clone(ready);
wrongOwnerApprovalPhrase.owner_approval.approval_phrase = "APPROVE_BROAD_RUNTIME_SCOPE";
assert.ok(readinessErrors(wrongOwnerApprovalPhrase).includes("bad owner approval phrase"), "wrong owner approval phrase must fail closed");

const staleOwnerApproval = clone(ready);
staleOwnerApproval.owner_approval.approval_fresh = false;
staleOwnerApproval.owner_approval_fresh = false;
assert.ok(readinessErrors(staleOwnerApproval).includes("bad owner approval freshness"), "stale owner approval must fail closed");

const supersededOwnerApproval = clone(ready);
supersededOwnerApproval.owner_approval.approval_superseded = true;
assert.ok(readinessErrors(supersededOwnerApproval).includes("superseded owner approval"), "superseded owner approval must fail closed");

const broadScope = clone(ready);
broadScope.owner_approval.wildcard_scope_used = true;
broadScope.owner_approval.broader_than_allowlist = true;
assert.ok(readinessErrors(broadScope).some((error) => error.startsWith("broad_scope")), "broad_scope must fail closed");

const missingArtifactChain = clone(ready);
delete missingArtifactChain.artifact_chain.approval_packet_sha256;
assert.ok(readinessErrors(missingArtifactChain).includes("bad artifact_chain.approval_packet_sha256"), "missing artifact chain SHA must fail closed");

const missingArtifactReference = clone(ready);
delete missingArtifactReference.artifact_chain.stable_closeout_packet_path;
assert.ok(readinessErrors(missingArtifactReference).includes("missing artifact_chain.stable_closeout_packet_path"), "missing artifact chain reference must fail closed");

const unknownArtifactRole = clone(ready);
unknownArtifactRole.artifact_chain.artifact_chain_role = "unknown_role";
assert.ok(readinessErrors(unknownArtifactRole).includes("unknown artifact chain role"), "unknown artifact chain role must fail closed");

const unknownReadinessDecision = clone(ready);
unknownReadinessDecision.readiness_decision = "READY_TO_EXECUTE_NOW";
assert.ok(readinessErrors(unknownReadinessDecision).includes("bad decision"), "unknown_readiness_decision must fail closed");

const missingBlockerMatrix = clone(ready);
delete missingBlockerMatrix.blocker_matrix;
assert.ok(readinessErrors(missingBlockerMatrix).includes("missing blocker_matrix"), "missing blocker_matrix must fail closed");

const malformedBlockerMatrix = clone(deploy);
delete malformedBlockerMatrix.blocker_matrix[0].fail_closed_action;
assert.ok(readinessErrors(malformedBlockerMatrix).includes("bad blocker_matrix missing fail_closed_action"), "malformed blocker_matrix must fail closed");

const inconsistentReadyBlockerMatrix = clone(ready);
inconsistentReadyBlockerMatrix.blocker_matrix = [clone(deploy.blocker_matrix[0])];
assert.ok(readinessErrors(inconsistentReadyBlockerMatrix).includes("inconsistent blocker_matrix ready state"), "ready state with blockers must fail closed");

const mismatchedBaseline = clone(ready);
mismatchedBaseline.baseline_commit = "25a4ec7277e2f18bcf4dec4cbfc93f7bdc36284b";
assert.ok(readinessErrors(mismatchedBaseline).includes("bad baseline"), "mismatched stable baseline must fail closed");

const mismatchedBranch = clone(ready);
mismatchedBranch.expected_branch = "feature/runtime";
assert.ok(readinessErrors(mismatchedBranch).includes("bad branch"), "mismatched branch must fail closed");

const mismatchedAheadBehind = clone(ready);
mismatchedAheadBehind.expected_ahead_behind = "1 / 0";
assert.ok(readinessErrors(mismatchedAheadBehind).includes("bad ahead behind"), "mismatched ahead/behind must fail closed");

console.log("codex_native_supervised_dry_run_readiness_contract_static: ok");
