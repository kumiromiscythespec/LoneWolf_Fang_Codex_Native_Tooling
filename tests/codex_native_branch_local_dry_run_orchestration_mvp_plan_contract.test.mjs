// BUILD_ID: BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_PLANNING_20260616
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(repoRoot, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));
const clone = (value) => JSON.parse(JSON.stringify(value));

const BUILD_ID = "BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_PLANNING_20260616";
const SCHEMA_ID = "lonewolf.codex_native.branch_local_dry_run_orchestration_mvp_plan.v1";
const TARGET = "branch_local_dry_run_orchestration_mvp_planning";
const BASELINE = "45d20a704c297d0668ff9b3d2a2ab031a7832d4b";
const NEXT_REVIEW = "START_CODEX_NATIVE_BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_PLANNING_IMPLEMENTATION_REVIEW_PACKET";

const docPath = "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_plan.md";
const stateDocPath = "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_state_machine.md";
const schemaPath = "schema/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_plan.schema.json";
const testPath = "tests/codex_native_branch_local_dry_run_orchestration_mvp_plan_contract.test.mjs";
const fixtureRoot = "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp";

const validFixtures = [
  `${fixtureRoot}/valid/mvp-plan-ready.json`,
  `${fixtureRoot}/valid/mvp-plan-stop-owner-review-required.json`
];

const invalidFixtures = [
  `${fixtureRoot}/invalid/runtime-go-true.json`,
  `${fixtureRoot}/invalid/openai-api-call-true.json`,
  `${fixtureRoot}/invalid/private-api-call-true.json`,
  `${fixtureRoot}/invalid/auto-approval-true.json`
];

const allowlist = [
  docPath,
  stateDocPath,
  schemaPath,
  testPath,
  ...validFixtures,
  ...invalidFixtures
];

const requiredStates = [
  "NOT_STARTED",
  "PLAN_LOADED",
  "OWNER_DECISION_REQUIRED",
  "DRY_RUN_READY",
  "SIMULATED_STEP_RECORDED",
  "ARTIFACT_READY",
  "STOP_OWNER_REVIEW_REQUIRED",
  "FAILED_CLOSED"
];

const falseSafetyFlags = [
  "runtime_go",
  "openai_api_call_allowed",
  "private_api_call_allowed",
  "auto_approval_allowed",
  "hash_binding_is_execution_approval",
  "ready_is_go",
  "matched_is_go",
  "observed_safe_no_action_is_go"
];

const falseForbiddenActions = [
  "runtime_execution",
  "openai_api_call",
  "private_api_call",
  "worker_or_daemon_launch",
  "queue_or_cloud_mutation",
  "billing_auth_trading_mutation",
  "deploy",
  "public_submission",
  "github_visibility_change",
  "release_creation_or_upload",
  "github_sponsors_application",
  "funding_yml_change",
  "stage_commit_push"
];

function validatePlan(record) {
  const errors = [];

  if (record.schema !== SCHEMA_ID) errors.push("schema id mismatch");
  if (record.build_id !== BUILD_ID) errors.push("build id mismatch");
  if (record.target !== TARGET) errors.push("target mismatch");
  if (!["MVP_PLAN_READY", "STOP_OWNER_REVIEW_REQUIRED"].includes(record.status)) errors.push("invalid status");
  if (record.submitted_baseline !== BASELINE) errors.push("baseline mismatch");

  if (record.branch_scope?.expected_branch !== "post-submission/codex-native-safe-development") errors.push("expected branch mismatch");
  if (record.branch_scope?.branch_local_only !== true) errors.push("branch_local_only must be true");
  if (record.branch_scope?.remote_branch_required !== false) errors.push("remote_branch_required must be false");
  if (record.branch_scope?.commit_allowed !== false) errors.push("commit_allowed must be false");
  if (record.branch_scope?.push_allowed !== false) errors.push("push_allowed must be false");

  for (const [groupName, requiredKeys] of [
    ["minimum_orchestrator", ["purpose", "input_envelopes", "dry_run_handoff_concept", "artifact_outputs"]],
    ["state_model", ["states", "events", "guards", "actions", "stop_states"]],
    ["simulation_boundary", ["simulated", "actually_executed", "execution_boundary"]],
    ["owner_decision_flow", ["owner_review_required", "allowed_decisions", "automatic_continuation_allowed"]]
  ]) {
    const group = record[groupName];
    if (!group || typeof group !== "object" || Array.isArray(group)) {
      errors.push(`${groupName} must be an object`);
      continue;
    }
    for (const key of requiredKeys) {
      if (!(key in group)) errors.push(`${groupName}.${key} is required`);
    }
  }

  for (const state of requiredStates) {
    if (!record.state_model?.states?.includes(state)) errors.push(`missing state ${state}`);
  }
  for (const state of ["STOP_OWNER_REVIEW_REQUIRED", "FAILED_CLOSED"]) {
    if (!record.state_model?.stop_states?.includes(state)) errors.push(`missing stop state ${state}`);
  }

  if (!Array.isArray(record.simulation_boundary?.actually_executed) || record.simulation_boundary.actually_executed.length !== 0) {
    errors.push("actually_executed must be empty");
  }
  if (!/No runtime execution/.test(record.simulation_boundary?.execution_boundary ?? "")) {
    errors.push("execution boundary must state no runtime execution");
  }

  if (record.owner_decision_flow?.owner_review_required !== true) errors.push("owner review must be required");
  if (record.owner_decision_flow?.automatic_continuation_allowed !== false) errors.push("automatic continuation must be false");
  for (const decision of ["GO", "REPAIR", "STOP"]) {
    if (!record.owner_decision_flow?.allowed_decisions?.includes(decision)) errors.push(`missing owner decision ${decision}`);
  }

  for (const key of falseForbiddenActions) {
    if (record.forbidden_actions?.[key] !== false) errors.push(`forbidden_actions.${key} must be false`);
  }
  for (const key of falseSafetyFlags) {
    if (record.safety_flags?.[key] !== false) errors.push(`safety_flags.${key} must be false`);
  }
  if (record.safety_flags?.owner_review_required !== true) errors.push("safety_flags.owner_review_required must be true");

  for (const key of [
    "artifact_outputs",
    "evidence_before_dry_run_implementation",
    "intentionally_not_implemented"
  ]) {
    if (!Array.isArray(record[key]) || record[key].length === 0) errors.push(`${key} must be a non-empty array`);
  }

  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length === 0) {
    errors.push("human_review_one_point must be non-empty");
  }

  if (record.next_prompt_readiness?.recommended_next_action !== NEXT_REVIEW) errors.push("next review prompt mismatch");
  if (record.next_prompt_readiness?.implementation_review_only !== true) errors.push("next prompt must be review only");
  if (record.next_prompt_readiness?.commit_allowed !== false) errors.push("next prompt commit_allowed must be false");
  if (record.next_prompt_readiness?.push_allowed !== false) errors.push("next prompt push_allowed must be false");

  return errors;
}

test("schema pins the branch-local MVP planning contract", () => {
  const schema = readJson(schemaPath);
  assert.equal(schema.$id, SCHEMA_ID);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.submitted_baseline.const, BASELINE);
  assert.equal(schema.properties.safety_flags.properties.runtime_go.const, false);
  assert.equal(schema.properties.safety_flags.properties.openai_api_call_allowed.const, false);
  assert.equal(schema.properties.safety_flags.properties.private_api_call_allowed.const, false);
  assert.equal(schema.properties.safety_flags.properties.auto_approval_allowed.const, false);
  assert.equal(schema.properties.safety_flags.properties.owner_review_required.const, true);
});
test("valid fixtures satisfy branch-local MVP planning semantics", () => {
  for (const fixture of validFixtures) {
    const record = readJson(fixture);
    assert.deepEqual(validatePlan(record), [], fixture);
  }
});

test("invalid fixtures fail closed for forbidden GO and API flags", () => {
  for (const fixture of invalidFixtures) {
    const record = readJson(fixture);
    assert.notDeepEqual(validatePlan(record), [], fixture);
  }
});

test("specific forbidden flags are rejected", () => {
  const base = readJson(validFixtures[0]);
  const cases = [
    ["safety_flags.runtime_go", true],
    ["safety_flags.openai_api_call_allowed", true],
    ["safety_flags.private_api_call_allowed", true],
    ["safety_flags.auto_approval_allowed", true]
  ];

  for (const [path, value] of cases) {
    const mutated = clone(base);
    const [group, key] = path.split(".");
    mutated[group][key] = value;
    assert.notDeepEqual(validatePlan(mutated), [], path);
  }
});

test("docs preserve dry-run MVP safety markers", () => {
  const combined = `${readText(docPath)}\n${readText(stateDocPath)}`;
  for (const marker of [
    "READY is not GO",
    "MATCHED is not GO",
    "OBSERVED_SAFE_NO_ACTION is not GO",
    "Hash binding is not execution approval",
    "Owner review remains mandatory",
    "STOP_OWNER_REVIEW_REQUIRED",
    "FAILED_CLOSED",
    "No runtime execution",
    "OpenAI API",
    "private API",
    "worker or daemon launch",
    "Queue",
    "public submission",
    "release"
  ]) {
    assert.match(combined, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("docs do not introduce forbidden approval language", () => {
  const combined = `${readText(docPath)}\n${readText(stateDocPath)}`;
  const forbiddenApprovalClaims = [
    /runtime(?: execution| workflow)? is approved/i,
    /OpenAI API(?: call| use)? is approved/i,
    /private API(?: call| use)? is approved/i,
    /deploy(?:ment)? is approved/i,
    /public submission is approved/i,
    /release creation is approved/i,
    /commit is approved/i,
    /push is approved/i
  ];
  for (const pattern of forbiddenApprovalClaims) {
    assert.doesNotMatch(combined, pattern);
  }
});

test("contract file set stays inside the exact owner-approved allowlist", () => {
  assert.deepEqual(allowlist, [
    "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_plan.md",
    "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_state_machine.md",
    "schema/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_plan.schema.json",
    "tests/codex_native_branch_local_dry_run_orchestration_mvp_plan_contract.test.mjs",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/valid/mvp-plan-ready.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/valid/mvp-plan-stop-owner-review-required.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/invalid/runtime-go-true.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/invalid/openai-api-call-true.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/invalid/private-api-call-true.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp/invalid/auto-approval-true.json"
  ]);
  for (const path of allowlist) {
    assert.ok(readText(path).length > 0, `${path} should exist`);
  }
});
