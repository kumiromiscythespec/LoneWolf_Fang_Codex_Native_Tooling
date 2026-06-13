// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const BUILD_ID = "20260613_codex_native_automation_gate_contracts_v1";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const forbiddenActionReport = readJson("schema/operator_governance/forbidden_action_report.schema.json");
const blockerMatrix = readJson("schema/operator_governance/blocker_matrix.schema.json");
const humanReviewOnePoint = readJson("schema/operator_governance/human_review_one_point.schema.json");

const forbiddenCategories = [
  "deploy",
  "runtime",
  "daemon_watcher",
  "ui_automation",
  "private_api",
  "openai_api",
  "cloud_mutation",
  "billing_mutation",
  "trading_order",
  "force_push",
  "destructive_git_or_file",
  "process_kill_security_bypass"
];

function assertBuildId(schema, name) {
  assert.equal(schema.build_id, BUILD_ID, `${name} must carry top-level build_id`);
  assert.match(schema.$comment, new RegExp(`BUILD_ID: ${BUILD_ID}`), `${name} must carry BUILD_ID comment`);
}

function assertRequires(schema, name, fields) {
  for (const field of fields) {
    assert.ok(schema.required.includes(field), `${name} must require ${field}`);
  }
}

test("schemas carry BUILD_ID and fail closed on extra fields", () => {
  for (const [schema, name] of [
    [forbiddenActionReport, "forbidden action report"],
    [blockerMatrix, "blocker matrix"],
    [humanReviewOnePoint, "human review one point"]
  ]) {
    assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema", name);
    assertBuildId(schema, name);
    assert.equal(schema.additionalProperties, false, `${name} must reject extra top-level fields`);
  }
});

test("forbidden action report schema requires fail-closed fields", () => {
  assertRequires(forbiddenActionReport, "forbidden action report", [
    "schema",
    "build_id",
    "report_id",
    "action_category",
    "matched_forbidden_terms",
    "exact_approval_present",
    "classification",
    "execution_allowed",
    "mutation_performed",
    "owner_review_required",
    "safe_alternatives",
    "human_review_one_point",
    "stop_reason"
  ]);
  assert.equal(forbiddenActionReport.properties.schema.const, "lonewolf.codex_native.forbidden_action_report.v1");
  assert.deepEqual(forbiddenActionReport.$defs.forbidden_action_category.enum, forbiddenCategories);
  assert.equal(forbiddenActionReport.properties.exact_approval_present.const, false);
  assert.equal(forbiddenActionReport.properties.execution_allowed.const, false);
  assert.equal(forbiddenActionReport.properties.mutation_performed.const, false);
  assert.equal(forbiddenActionReport.properties.owner_review_required.const, true);
});

test("blocker matrix schema requires owner review and non-execution rows", () => {
  assertRequires(blockerMatrix, "blocker matrix", [
    "schema",
    "build_id",
    "matrix_id",
    "blockers",
    "overall_status",
    "next_allowed_decisions",
    "recommended_decision",
    "human_review_one_point"
  ]);
  assert.equal(blockerMatrix.properties.schema.const, "lonewolf.codex_native.blocker_matrix.v1");
  assert.deepEqual(blockerMatrix.$defs.forbidden_action_category.enum, forbiddenCategories);
  assert.deepEqual(blockerMatrix.properties.next_allowed_decisions.prefixItems.map((item) => item.const), [
    "GO",
    "REPAIR",
    "STOP"
  ]);
  const row = blockerMatrix.$defs.blocker.properties;
  assert.equal(row.owner_approval_required.const, true);
  assert.equal(row.exact_approval_phrase_required.const, true);
  assert.equal(row.execution_allowed.const, false);
  assert.equal(row.mutation_performed.const, false);
});

test("human review one point schema keeps exactly one GO/REPAIR/STOP decision", () => {
  assertRequires(humanReviewOnePoint, "human review one point", [
    "schema",
    "build_id",
    "review_id",
    "question",
    "recommendation",
    "options",
    "exact_go_phrase",
    "exact_repair_phrase",
    "exact_stop_phrase",
    "scope_limit",
    "not_approval_for",
    "expires_on_change",
    "continuation_decision_count",
    "execution_allowed"
  ]);
  assert.equal(humanReviewOnePoint.properties.schema.const, "lonewolf.codex_native.human_review_one_point.v1");
  assert.deepEqual(humanReviewOnePoint.properties.options.prefixItems.map((item) => item.const), [
    "GO",
    "REPAIR",
    "STOP"
  ]);
  assert.equal(humanReviewOnePoint.properties.continuation_decision_count.const, 1);
  assert.equal(humanReviewOnePoint.properties.execution_allowed.const, false);
});

test("markdown and static tests carry first-line BUILD_ID markers", () => {
  const markdownFiles = [
    "docs/safety/forbidden_action_report_contract.md",
    "docs/safety/blocker_matrix_contract.md",
    "docs/safety/operator_governance_fixture_policy.md",
    "docs/owner/human_review_one_point_contract.md",
    "docs/owner/owner_approval_phrase_policy.md",
    "docs/contributor/forbidden_action_static_test_policy.md"
  ];
  for (const path of markdownFiles) {
    assert.equal(readText(path).split(/\r?\n/u)[0], `<!-- BUILD_ID: ${BUILD_ID} -->`, path);
  }
  for (const path of [
    "tests/operator_governance_forbidden_actions_static_contract.test.mjs",
    "tests/operator_governance_contract_schema_static.test.mjs"
  ]) {
    assert.equal(readText(path).split(/\r?\n/u)[0], `// BUILD_ID: ${BUILD_ID}`, path);
  }
});

test("schema docs stay non-operational", () => {
  for (const path of [
    "docs/safety/forbidden_action_report_contract.md",
    "docs/safety/blocker_matrix_contract.md",
    "docs/contributor/forbidden_action_static_test_policy.md"
  ]) {
    const text = readText(path);
    assert.match(text, /not executable enforcement code|non-operational|not an instruction/i, path);
    assert.match(text, /not approve|not permission|not authorize/i, path);
  }
});
