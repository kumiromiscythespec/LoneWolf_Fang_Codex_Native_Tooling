// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const buildId = "20260613_codex_native_automation_gate_contracts_v1";
const stopOwnerReview = "STOP_OWNER_REVIEW_REQUIRED";
const approvalPhrase = "APPROVE_NEXT_WAVE_DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION_SIX_WINDOW";
const targetRepo = "C:\\LoneWolf_Fang_Project\\repos\\core\\LoneWolf_Fang_Codex_Native_Tooling";
const baseline = "25a4ec7277e2f18bcf4dec4cbfc93f7bdc36284b";
const artifactChainId = "codex_native_next_wave_docs_schema_tests_fixtures_implementation_prompts_repaired_20260613_161547";
const artifactSha = "37FEDBF54203D4F089DD118C44F99252F2D489760A817C94214FFCAF7C2DBEB7";
const taskId = "NEXT_WAVE_IMPLEMENTATION_W3_OWNER_APPROVAL_FRESHNESS";
const safetyBoundaryVersion = "lonewolf_fang_safety_boundary_20260613";

const allowedFiles = [
  "docs/orchestration/codex_native_owner_approval_freshness_policy.md",
  "docs/orchestration/codex_native_owner_approval_record_contract.md",
  "schema/orchestration/codex_native_owner_approval_record.schema.json",
  "schema/orchestration/codex_native_owner_approval_supersession.schema.json",
  "tests/owner_approval_freshness_contract.test.mjs",
  "tests/fixtures/owner-approval/**/*.json"
];

const allowedCommands = [
  "node --test tests/owner_approval_freshness_contract.test.mjs",
  "git diff --check"
];

const approvalSchema = readJson("schema/orchestration/codex_native_owner_approval_record.schema.json");
const supersessionSchema = readJson("schema/orchestration/codex_native_owner_approval_supersession.schema.json");
const validExact = readJson("tests/fixtures/owner-approval/valid/exact_scope_single_use_approval.json");
const validReusable = readJson("tests/fixtures/owner-approval/valid/reusable_docs_policy_approval_same_chain.json");

const invalidFixturePaths = [
  "tests/fixtures/owner-approval/invalid/head_changed.json",
  "tests/fixtures/owner-approval/invalid/worktree_changed.json",
  "tests/fixtures/owner-approval/invalid/artifact_sha_mismatch.json",
  "tests/fixtures/owner-approval/invalid/superseded_by_newer_owner_decision.json",
  "tests/fixtures/owner-approval/invalid/task_scope_changed.json",
  "tests/fixtures/owner-approval/invalid/command_changed.json",
  "tests/fixtures/owner-approval/invalid/file_set_changed.json",
  "tests/fixtures/owner-approval/invalid/safety_boundary_changed.json",
  "tests/fixtures/owner-approval/invalid/ttl_expired.json",
  "tests/fixtures/owner-approval/invalid/missing_ttl_cross_baseline_reuse.json",
  "tests/fixtures/owner-approval/invalid/vague_phrase.json",
  "tests/fixtures/owner-approval/invalid/runtime_reuse_attempt.json"
];

const sha256Pattern = /^[A-Fa-f0-9]{64}$/;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function setPath(target, dottedPath, value) {
  const parts = dottedPath.split(".");
  let current = target;
  for (const part of parts.slice(0, -1)) {
    current = current[part];
  }
  current[parts.at(-1)] = value;
}

function applyMutationFixture(mutationFixture) {
  const base = readJson(mutationFixture.base_fixture);
  const working = clone(base);
  for (const mutation of mutationFixture.mutations ?? [mutationFixture.mutation]) {
    setPath(working, mutation.path, mutation.value);
  }
  if (mutationFixture.supersession_record) {
    working.supersession_record = mutationFixture.supersession_record;
  }
  working.fixture_id = mutationFixture.fixture_id;
  working.expected_result = mutationFixture.expected_result;
  return working;
}

function assertBuildId(value, name) {
  assert.equal(value.build_id, buildId, `${name} must carry build_id`);
}

function missingRequired(schema, data) {
  return schema.required.filter((field) => !Object.hasOwn(data, field));
}

function assertNoExtraProperties(schema, data, name) {
  const allowed = new Set(Object.keys(schema.properties ?? {}));
  for (const key of Object.keys(data)) {
    assert.ok(allowed.has(key), `${name} has unexpected property ${key}`);
  }
}

function pushIf(errors, condition, message) {
  if (condition) errors.push(message);
}

function evaluateApprovalFixture(fixture) {
  const record = fixture.approval_record;
  const context = fixture.current_context ?? {};
  const errors = [];

  assertBuildId(fixture, fixture.fixture_id);
  assertBuildId(record, `${fixture.fixture_id}.approval_record`);
  for (const field of missingRequired(approvalSchema, record)) errors.push(`missing ${field}`);
  assertNoExtraProperties(approvalSchema, record, `${fixture.fixture_id}.approval_record`);

  pushIf(errors, record.action_class !== "POLICY_INPUT" && record.action_class !== "DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION", "action class not allowed");
  pushIf(errors, record.approval_phrase !== approvalPhrase, "approval phrase mismatch");
  pushIf(errors, context.worktree_status !== "clean", "worktree changed");
  pushIf(errors, context.staged_file_count !== 0, "staged files changed");
  pushIf(errors, record.approval_expires_at_utc === null && (record.stable_baseline !== baseline || record.artifact_chain_id !== artifactChainId), "missing ttl cannot cross artifact chain or stable baseline");
  pushIf(errors, record.head !== baseline, "head mismatch");
  pushIf(errors, record.local_origin_master !== baseline, "local origin master mismatch");
  pushIf(errors, record.stable_baseline !== baseline, "stable baseline mismatch");
  pushIf(errors, record.artifact_chain_id !== artifactChainId, "artifact chain mismatch");
  pushIf(errors, record.artifact_sha256 !== artifactSha, "artifact sha mismatch");
  pushIf(errors, record.task_id !== taskId, "task scope changed");
  pushIf(errors, record.target_repo !== targetRepo, "target repo mismatch");
  pushIf(errors, record.branch !== "master", "branch mismatch");
  pushIf(errors, record.safety_boundary_version !== safetyBoundaryVersion, "safety boundary changed");
  pushIf(errors, JSON.stringify(record.approved_file_allowlist) !== JSON.stringify(allowedFiles), "file allowlist changed");
  pushIf(errors, JSON.stringify(record.approved_command_allowlist) !== JSON.stringify(allowedCommands), "command allowlist changed");
  pushIf(errors, record.supersession_status !== "ACTIVE", "superseded approval");

  if (record.approval_expires_at_utc !== null && context.now_utc) {
    pushIf(errors, Date.parse(record.approval_expires_at_utc) <= Date.parse(context.now_utc), "ttl expired");
  }

  pushIf(errors, record.owner_approval_required !== true, "owner approval must remain required");
  pushIf(errors, record.execution_allowed !== false, "execution must remain disallowed");
  pushIf(errors, record.runtime_allowed !== false, "runtime must remain disallowed");
  pushIf(errors, record.automatic_continuation_allowed !== false, "automatic continuation must remain disallowed");
  pushIf(errors, record.mutation_approval_single_use !== true, "mutation approvals must be single-use");
  pushIf(errors, record.stale_if_any_bound_field_differs !== true, "mismatch must fail closed");
  pushIf(errors, record.ambiguity_result !== stopOwnerReview, "ambiguity must require owner review");
  pushIf(errors, !sha256Pattern.test(record.artifact_sha256), "artifact sha must be sha256");

  for (const [key, value] of Object.entries(record.reuse_prohibitions)) {
    pushIf(errors, value !== true, `reuse_prohibitions.${key} must be true`);
  }

  const stale = errors.length > 0;
  return {
    valid: !stale,
    stale,
    reasons: errors,
    next_action_recommendation: stale ? stopOwnerReview : record.expected_result.next_action_recommendation,
    owner_review_required: true,
    execution_allowed: false,
    runtime_allowed: false,
    automatic_continuation_allowed: false
  };
}

function assertFailClosed(result, expected) {
  assert.equal(result.valid, expected.valid);
  assert.equal(result.stale, expected.stale);
  assert.equal(result.next_action_recommendation, expected.next_action_recommendation);
  assert.equal(result.owner_review_required, true);
  assert.equal(result.execution_allowed, false);
  assert.equal(result.runtime_allowed, false);
  assert.equal(result.automatic_continuation_allowed, false);
}

function assertSupersessionRecord(record) {
  assertBuildId(record, "supersession record");
  assertNoExtraProperties(supersessionSchema, record, "supersession record");
  assert.equal(record.schema, supersessionSchema.properties.schema.const);
  assert.equal(record.owner_approval_required, true);
  assert.equal(record.execution_allowed, false);
  assert.equal(record.runtime_allowed, false);
  assert.equal(record.automatic_continuation_allowed, false);
  assert.equal(record.old_record_preserved, true);
  assert.equal(record.no_deletion, true);
  assert.equal(record.no_history_rewrite, true);
  assert.match(record.superseded_artifact_sha256, sha256Pattern);
  assert.match(record.superseding_artifact_sha256, sha256Pattern);
}

test("schemas and docs carry the Window 3 build marker and fail-closed defaults", () => {
  assert.equal(approvalSchema.$comment, `BUILD_ID: ${buildId}`);
  assert.equal(approvalSchema.build_id, buildId);
  assert.equal(approvalSchema.additionalProperties, false);
  assert.equal(approvalSchema.properties.build_id.const, buildId);
  assert.equal(approvalSchema.properties.owner_approval_required.const, true);
  assert.equal(approvalSchema.properties.execution_allowed.const, false);
  assert.equal(approvalSchema.properties.runtime_allowed.const, false);
  assert.equal(approvalSchema.properties.automatic_continuation_allowed.const, false);
  assert.deepEqual(approvalSchema.properties.action_class.enum, [
    "POLICY_INPUT",
    "DOCS_SCHEMA_TESTS_FIXTURES_IMPLEMENTATION"
  ]);

  assert.equal(supersessionSchema.$comment, `BUILD_ID: ${buildId}`);
  assert.equal(supersessionSchema.build_id, buildId);
  assert.equal(supersessionSchema.additionalProperties, false);
  assert.equal(supersessionSchema.properties.old_record_preserved.const, true);
  assert.equal(supersessionSchema.properties.no_deletion.const, true);
  assert.equal(supersessionSchema.properties.no_history_rewrite.const, true);

  for (const docPath of [
    "docs/orchestration/codex_native_owner_approval_freshness_policy.md",
    "docs/orchestration/codex_native_owner_approval_record_contract.md"
  ]) {
    const text = readText(docPath);
    assert.ok(text.startsWith(`<!-- BUILD_ID: ${buildId} -->`), `${docPath} must start with build marker`);
    assert.match(text, /STOP_OWNER_REVIEW_REQUIRED/);
    assert.match(text, /single-use/i);
    assert.match(text, /artifact chain/i);
  }
});

test("valid approval fixtures remain exact-scope and non-runtime", () => {
  for (const fixture of [validExact, validReusable]) {
    assertBuildId(fixture, fixture.fixture_id);
    assert.equal(fixture.approval_record.schema, approvalSchema.properties.schema.const);
    assert.deepEqual(fixture.approval_record.approved_file_allowlist, allowedFiles);
    assert.deepEqual(fixture.approval_record.approved_command_allowlist, allowedCommands);
    const result = evaluateApprovalFixture(fixture);
    assertFailClosed(result, fixture.expected_result);
  }
});

test("stale owner approval fixtures fail closed for every bound-field drift", () => {
  for (const fixturePath of invalidFixturePaths) {
    const mutationFixture = readJson(fixturePath);
    assertBuildId(mutationFixture, mutationFixture.fixture_id);
    const fixture = applyMutationFixture(mutationFixture);
    const result = evaluateApprovalFixture(fixture);
    assertFailClosed(result, mutationFixture.expected_result);
    assert.ok(
      result.reasons.some((reason) => reason.includes(mutationFixture.expected_result.reason_contains)),
      `${mutationFixture.fixture_id} reasons did not include ${mutationFixture.expected_result.reason_contains}: ${result.reasons.join(", ")}`
    );
    if (fixture.supersession_record) {
      assertSupersessionRecord(fixture.supersession_record);
    }
  }
});

test("policy forbids approval reuse for runtime, commit, push, deploy, cloud, billing, and trading", () => {
  const record = validExact.approval_record;
  for (const field of [
    "commit",
    "push",
    "runtime",
    "deploy",
    "api",
    "cloud",
    "billing",
    "trading",
    "daemon_watcher",
    "ui_automation",
    "automatic_continuation",
    "cleanup_or_history_rewrite"
  ]) {
    assert.equal(record.reuse_prohibitions[field], true, `${field} reuse must be prohibited`);
  }

  const docs = readText("docs/orchestration/codex_native_owner_approval_freshness_policy.md");
  assert.match(docs, /No approval freshness record may authorize reuse for runtime workflows/i);
  assert.match(docs, /Commit and push require later single-use owner approvals/i);
});
