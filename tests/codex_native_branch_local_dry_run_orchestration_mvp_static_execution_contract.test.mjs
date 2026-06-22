// BUILD_ID: BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_STATIC_EXECUTION_CONTRACTS_20260616
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(repoRoot, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));
const clone = (value) => JSON.parse(JSON.stringify(value));

const BUILD_ID = "BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_STATIC_EXECUTION_CONTRACTS_20260616";
const SCHEMA_ID = "lonewolf.codex_native.branch_local_dry_run_orchestration_mvp_static_execution.v1";
const LANE = "BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_STATIC_EXECUTION_CONTRACTS";
const BASELINE = "45d20a704c297d0668ff9b3d2a2ab031a7832d4b";
const LOCAL_BRANCH_HEAD = "00e06a73484c5072d652a9ef8d11828687d330e9";
const SOURCE_SHA = "E620315735D0DB38D87FE96E99406852F4E5EE84B9547D0C3F5D7932EC430A51";
const NEXT_REVIEW = "START_CODEX_NATIVE_BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_STATIC_EXECUTION_CONTRACTS_IMPLEMENTATION_REVIEW_PACKET";

const docPath = "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_static_execution_contracts.md";
const traceDocPath = "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_static_execution_state_trace.md";
const schemaPath = "schema/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_static_execution.schema.json";
const testPath = "tests/codex_native_branch_local_dry_run_orchestration_mvp_static_execution_contract.test.mjs";
const fixtureRoot = "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution";

const validFixtures = [
  `${fixtureRoot}/valid/static-execution-ready.json`,
  `${fixtureRoot}/valid/static-execution-stop-owner-review-required.json`
];

const invalidFixtures = [
  `${fixtureRoot}/invalid/runtime-go-true.json`,
  `${fixtureRoot}/invalid/openai-api-call-true.json`,
  `${fixtureRoot}/invalid/private-api-call-true.json`,
  `${fixtureRoot}/invalid/queue-mutation-true.json`,
  `${fixtureRoot}/invalid/cloud-mutation-true.json`,
  `${fixtureRoot}/invalid/trading-mutation-true.json`,
  `${fixtureRoot}/invalid/auto-approval-true.json`
];

const allowlist = [
  docPath,
  traceDocPath,
  schemaPath,
  testPath,
  ...validFixtures,
  ...invalidFixtures
];

const requiredTopLevel = [
  "schema_version",
  "schema",
  "build_id",
  "lane",
  "submitted_baseline",
  "branch_scope",
  "execution_request",
  "static_transition_trace",
  "safety_decision",
  "closeout_record",
  "evidence_hash_binding",
  "owner_review_required",
  "terminal_state",
  "forbidden_actions",
  "safety_flags",
  "human_review_one_point",
  "next_prompt_readiness"
];

const falseSafetyFields = [
  "runtime_go",
  "openai_api_call_allowed",
  "private_api_call_allowed",
  "queue_mutation_allowed",
  "cloud_mutation_allowed",
  "billing_mutation_allowed",
  "auth_mutation_allowed",
  "trading_mutation_allowed",
  "auto_approval_allowed",
  "pr_creation_allowed",
  "merge_allowed",
  "deploy_allowed",
  "public_submission_allowed"
];

const falseForbiddenActions = [
  "runtime_execution",
  "openai_api_call",
  "private_api_call",
  "queue_mutation",
  "cloud_mutation",
  "billing_mutation",
  "auth_mutation",
  "trading_mutation",
  "auto_approval",
  "pr_creation",
  "merge",
  "deploy",
  "public_submission",
  "release_creation",
  "github_visibility_change",
  "sponsors_or_funding_change"
];

const terminalStates = [
  "READY_FOR_OWNER_REVIEW",
  "STOP_OWNER_REVIEW_REQUIRED",
  "Stop and Wait - Owner Review Required"
];

function requireObject(record, name, errors) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    errors.push(`${name} must be an object`);
    return undefined;
  }
  return record;
}

function requireNonEmptyArray(record, name, errors) {
  if (!Array.isArray(record) || record.length === 0) {
    errors.push(`${name} must be a non-empty array`);
    return;
  }
  for (const [index, item] of record.entries()) {
    if (typeof item !== "string" || item.length === 0) errors.push(`${name}[${index}] must be non-empty`);
  }
}

function validateStaticExecution(record) {
  const errors = [];
  if (!requireObject(record, "record", errors)) return errors;

  for (const key of requiredTopLevel) {
    if (!(key in record)) errors.push(`${key} is required`);
  }

  if (record.schema_version !== "1.0.0") errors.push("schema_version mismatch");
  if (record.schema !== SCHEMA_ID) errors.push("schema id mismatch");
  if (record.build_id !== BUILD_ID) errors.push("build id mismatch");
  if (record.lane !== LANE) errors.push("lane mismatch");
  if (record.submitted_baseline !== BASELINE) errors.push("submitted baseline mismatch");
  if (!terminalStates.includes(record.terminal_state)) errors.push("invalid terminal_state");
  if (record.owner_review_required !== true) errors.push("owner_review_required must be true");

  const branchScope = requireObject(record.branch_scope, "branch_scope", errors);
  if (branchScope) {
    if (branchScope.expected_branch !== "post-submission/codex-native-safe-development") errors.push("expected_branch mismatch");
    if (branchScope.local_head_bound !== LOCAL_BRANCH_HEAD) errors.push("local_head_bound mismatch");
    if (branchScope.origin_master_bound !== BASELINE) errors.push("origin_master_bound mismatch");
    if (branchScope.remote_branch_bound !== LOCAL_BRANCH_HEAD) errors.push("remote_branch_bound mismatch");
    if (branchScope.branch_mutation_allowed !== false) errors.push("branch_mutation_allowed must be false");
  }

  const request = requireObject(record.execution_request, "execution_request", errors);
  if (request) {
    if (typeof request.request_id !== "string" || request.request_id.length === 0) errors.push("request_id required");
    if (request.request_kind !== "STATIC_EXECUTION_CONTRACT_VALIDATION") errors.push("request_kind mismatch");
    if (request.static_only !== true) errors.push("static_only must be true");
    if (request.owner_approval_scope !== "docs_schema_tests_fixtures_only") errors.push("owner_approval_scope mismatch");
    if (request.source_approval_packet_name !== "codex_native_branch_local_dry_run_orchestration_mvp_static_execution_contracts_approval_packet_20260616_141826.zip") {
      errors.push("source approval packet mismatch");
    }
    requireNonEmptyArray(request.requested_outputs, "execution_request.requested_outputs", errors);
  }

  const trace = requireObject(record.static_transition_trace, "static_transition_trace", errors);
  if (trace) {
    if (trace.initial_state !== "REQUEST_RECEIVED") errors.push("initial_state mismatch");
    if (!terminalStates.includes(trace.terminal_state)) errors.push("trace terminal_state mismatch");
    if (!Array.isArray(trace.executed_runtime_actions) || trace.executed_runtime_actions.length !== 0) {
      errors.push("executed_runtime_actions must be empty");
    }
    if (!Array.isArray(trace.transitions) || trace.transitions.length === 0) {
      errors.push("transitions must be non-empty");
    } else {
      for (const [index, transition] of trace.transitions.entries()) {
        if (!transition || typeof transition !== "object" || Array.isArray(transition)) {
          errors.push(`transition ${index} must be an object`);
          continue;
        }
        for (const key of ["from", "event", "guard", "to", "action_kind"]) {
          if (!(key in transition)) errors.push(`transition ${index}.${key} is required`);
        }
        if (!["pass", "stop"].includes(transition.guard)) errors.push(`transition ${index}.guard invalid`);
        if (!["STATIC_CONTRACT_VALIDATION", "STATIC_STOP_CLASSIFICATION"].includes(transition.action_kind)) {
          errors.push(`transition ${index}.action_kind invalid`);
        }
      }
    }
  }

  const decision = requireObject(record.safety_decision, "safety_decision", errors);
  if (decision) {
    if (!["STATIC_READY_FOR_OWNER_REVIEW", "STATIC_STOP_OWNER_REVIEW_REQUIRED"].includes(decision.decision)) {
      errors.push("safety decision mismatch");
    }
    if (decision.owner_review_required !== true) errors.push("safety decision owner review must be true");
    if (decision.unsafe_action_detected !== false) errors.push("unsafe_action_detected must be false");
    requireNonEmptyArray(decision.reasons, "safety_decision.reasons", errors);
  }

  const closeout = requireObject(record.closeout_record, "closeout_record", errors);
  if (closeout) {
    if (!["STATIC_EXECUTION_CONTRACTS_READY_FOR_OWNER_REVIEW", "STATIC_EXECUTION_CONTRACTS_STOP_OWNER_REVIEW_REQUIRED"].includes(closeout.classification)) {
      errors.push("closeout classification mismatch");
    }
    if (!terminalStates.includes(closeout.review_status)) errors.push("closeout review_status mismatch");
    if (closeout.ready_is_go !== false) errors.push("ready_is_go must be false");
    if (closeout.matched_is_go !== false) errors.push("matched_is_go must be false");
    if (closeout.observed_safe_no_action_is_go !== false) errors.push("observed_safe_no_action_is_go must be false");
    if (closeout.next_prompt !== NEXT_REVIEW) errors.push("next prompt mismatch");
  }

  const binding = requireObject(record.evidence_hash_binding, "evidence_hash_binding", errors);
  if (binding) {
    if (binding.hash_algorithm !== "SHA256") errors.push("hash algorithm mismatch");
    if (!String(binding.source_approval_packet_path ?? "").endsWith("codex_native_branch_local_dry_run_orchestration_mvp_static_execution_contracts_approval_packet_20260616_141826.zip")) {
      errors.push("source approval packet path mismatch");
    }
    if (binding.source_approval_packet_sha256 !== SOURCE_SHA) errors.push("source approval SHA mismatch");
    if (binding.hash_binding_is_execution_approval !== false) errors.push("hash binding must not be execution approval");
  }

  for (const key of falseForbiddenActions) {
    if (record.forbidden_actions?.[key] !== false) errors.push(`forbidden_actions.${key} must be false`);
  }
  for (const key of falseSafetyFields) {
    if (record.safety_flags?.[key] !== false) errors.push(`safety_flags.${key} must be false`);
  }

  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length === 0) {
    errors.push("human_review_one_point must be non-empty");
  }

  if (record.next_prompt_readiness?.recommended_next_action !== NEXT_REVIEW) errors.push("recommended next action mismatch");
  if (record.next_prompt_readiness?.review_only !== true) errors.push("next prompt must be review only");
  if (record.next_prompt_readiness?.commit_allowed !== false) errors.push("commit_allowed must be false");
  if (record.next_prompt_readiness?.push_allowed !== false) errors.push("push_allowed must be false");
  if (record.next_prompt_readiness?.runtime_go_allowed !== false) errors.push("runtime_go_allowed must be false");

  return errors;
}

test("schema pins the branch-local static execution contract", () => {
  const schema = readJson(schemaPath);
  assert.equal(schema.$id, SCHEMA_ID);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.lane.const, LANE);
  assert.equal(schema.properties.submitted_baseline.const, BASELINE);
  assert.deepEqual(schema.$defs.terminal_state.enum, terminalStates);
  assert.equal(schema.properties.owner_review_required.const, true);
  assert.equal(schema.properties.evidence_hash_binding.properties.source_approval_packet_sha256.const, SOURCE_SHA);
  assert.equal(schema.properties.evidence_hash_binding.properties.hash_binding_is_execution_approval.const, false);

  for (const field of falseSafetyFields) {
    assert.ok(schema.properties.safety_flags.required.includes(field), `${field} must be required`);
    assert.equal(schema.properties.safety_flags.properties[field].const, false, `${field} must be const false`);
  }
});

test("valid fixtures satisfy static execution semantics", () => {
  for (const fixture of validFixtures) {
    const record = readJson(fixture);
    assert.deepEqual(validateStaticExecution(record), [], fixture);
  }
});

test("invalid fixtures reject unsafe true fields", () => {
  for (const fixture of invalidFixtures) {
    const record = readJson(fixture);
    assert.notDeepEqual(validateStaticExecution(record), [], fixture);
  }
});

test("all unsafe action flags are rejected when mutated to true", () => {
  const base = readJson(validFixtures[0]);
  for (const field of falseSafetyFields) {
    const mutated = clone(base);
    mutated.safety_flags[field] = true;
    assert.notDeepEqual(validateStaticExecution(mutated), [], field);
  }
});

test("terminal stop states remain owner-review only", () => {
  const ready = readJson(validFixtures[0]);
  const stop = readJson(validFixtures[1]);
  assert.equal(ready.terminal_state, "READY_FOR_OWNER_REVIEW");
  assert.equal(stop.terminal_state, "Stop and Wait - Owner Review Required");
  assert.equal(stop.closeout_record.review_status, "Stop and Wait - Owner Review Required");
  assert.equal(stop.owner_review_required, true);
});

test("docs preserve exact static safety markers", () => {
  const combined = `${readText(docPath)}\n${readText(traceDocPath)}`;
  for (const marker of [
    "No runtime execution",
    "No OpenAI API call",
    "No private API call",
    "No Queue mutation",
    "No cloud mutation",
    "No billing mutation",
    "No auth mutation",
    "No trading mutation",
    "No auto approval",
    "READY is not GO.",
    "MATCHED is not GO.",
    "OBSERVED_SAFE_NO_ACTION is not GO.",
    "Hash binding is not execution approval.",
    "Static execution contract validation is not runtime execution.",
    "Owner review remains mandatory.",
    "Stop and Wait - Owner Review Required"
  ]) {
    assert.match(combined, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("docs do not introduce forbidden approval language", () => {
  const combined = `${readText(docPath)}\n${readText(traceDocPath)}`;
  const forbiddenApprovalClaims = [
    /runtime(?: execution| workflow)? is approved/i,
    /OpenAI API(?: call| use)? is approved/i,
    /private API(?: call| use)? is approved/i,
    /Queue mutation is approved/i,
    /cloud mutation is approved/i,
    /trading mutation is approved/i,
    /auto approval is allowed/i,
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

test("contract test remains static and local", () => {
  const self = readText(testPath);
  const importLines = self
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith("import "))
    .join("\n");
  for (const pattern of [
    /from "node:child_process"/,
    /from "node:http"/,
    /from "node:https"/,
    /from "node:net"/,
    /from "node:dns"/,
    /\bfetch\s*\(/,
    /\bspawn\s*\(/,
    /\bexec\s*\(/
  ]) {
    const target = pattern.source.startsWith("from") ? importLines : self;
    assert.doesNotMatch(target, pattern);
  }
});

test("contract file set stays inside the exact owner-approved allowlist", () => {
  assert.deepEqual(allowlist, [
    "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_static_execution_contracts.md",
    "docs/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_static_execution_state_trace.md",
    "schema/orchestration/codex_native_branch_local_dry_run_orchestration_mvp_static_execution.schema.json",
    "tests/codex_native_branch_local_dry_run_orchestration_mvp_static_execution_contract.test.mjs",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/valid/static-execution-ready.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/valid/static-execution-stop-owner-review-required.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/runtime-go-true.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/openai-api-call-true.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/private-api-call-true.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/queue-mutation-true.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/cloud-mutation-true.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/trading-mutation-true.json",
    "tests/fixtures/codex-native-branch-local-dry-run-orchestration-mvp-static-execution/invalid/auto-approval-true.json"
  ]);
  for (const path of allowlist) {
    assert.ok(readText(path).length > 0, `${path} should exist`);
  }
});
