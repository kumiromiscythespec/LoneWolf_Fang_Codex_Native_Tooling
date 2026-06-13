// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

const buildId = "20260613_codex_native_automation_gate_contracts_v1";

const schemaContracts = [
  {
    path: "schema/orchestration/codex_native_dry_run_execution_request.schema.json",
    schemaConst: "lonewolf.codex_native.dry_run_execution_request.v1",
    required: [
      "request_id",
      "task_id",
      "operation_class",
      "input_artifact_sha256",
      "validator_report_sha256",
      "owner_approval_record_sha256",
      "output_root_policy",
      "owner_review_required",
      "execution_allowed",
      "runtime_allowed",
      "automatic_continuation_allowed"
    ]
  },
  {
    path: "schema/orchestration/codex_native_dry_run_execution_result.schema.json",
    schemaConst: "lonewolf.codex_native.dry_run_execution_result.v1",
    required: [
      "result_id",
      "request_id",
      "task_id",
      "status",
      "accepted",
      "output_artifact_sha256",
      "owner_review_required",
      "execution_allowed",
      "runtime_allowed",
      "automatic_continuation_allowed",
      "blocker_matrix"
    ]
  },
  {
    path: "schema/orchestration/codex_native_forbidden_action_report.schema.json",
    schemaConst: "lonewolf.codex_native.forbidden_action_report.v1",
    required: [
      "report_id",
      "task_id",
      "attempted_action",
      "redaction_status",
      "stop_reason",
      "owner_review_required",
      "execution_allowed",
      "runtime_allowed",
      "automatic_continuation_allowed"
    ]
  },
  {
    path: "schema/orchestration/codex_native_blocker_matrix_record.schema.json",
    schemaConst: "lonewolf.codex_native.blocker_matrix_record.v1",
    required: [
      "blocker_id",
      "blocker_type",
      "severity",
      "evidence_reference",
      "expected_result",
      "owner_review_required",
      "execution_allowed",
      "runtime_allowed",
      "automatic_continuation_allowed"
    ]
  },
  {
    path: "schema/orchestration/codex_native_human_review_one_point.schema.json",
    schemaConst: "lonewolf.codex_native.human_review_one_point.v1",
    required: [
      "review_id",
      "artifact_path",
      "artifact_sha256",
      "question",
      "options",
      "recommended_option",
      "reason",
      "owner_review_required",
      "execution_allowed",
      "runtime_allowed",
      "automatic_continuation_allowed"
    ]
  }
];

const forbiddenActionTerms = [
  "runtime_attempt",
  "deploy_attempt",
  "private_openai_api_attempt",
  "cloud_mutation_attempt",
  "billing_mutation_attempt",
  "trading_order_attempt",
  "automatic_continuation_attempt",
  "unknown_state_gate_action",
  "forbidden_action_attempt"
];

const blockerTypes = [
  "missing_artifact",
  "corrupt_artifact",
  "stale_artifact",
  "duplicate_task_id",
  "duplicate_artifact_id",
  "unknown_state",
  "unknown_gate",
  "unknown_action",
  "owner_gate_skipped",
  "unknown_owner_approval",
  "stale_owner_approval",
  "automatic_continuation_attempt",
  "runtime_attempt",
  "deploy_attempt",
  "private_openai_api_attempt",
  "cloud_mutation_attempt",
  "billing_mutation_attempt",
  "trading_order_attempt"
];

function requiredFields(schema) {
  assert.ok(Array.isArray(schema.required), `${schema.title} must define required fields`);
  return schema.required;
}

for (const contract of schemaContracts) {
  const schema = readJson(contract.path);
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.match(schema.$comment, new RegExp(`BUILD_ID: ${buildId}`), `${contract.path} must carry BUILD_ID`);
  assert.equal(schema.additionalProperties, false, `${contract.path} must reject extra fields`);
  assert.equal(schema.properties.schema.const, contract.schemaConst);
  assert.equal(schema.properties.build_id.const, buildId);
  assert.equal(schema.properties.owner_review_required.const, true);
  assert.equal(schema.properties.execution_allowed.const, false);
  assert.equal(schema.properties.runtime_allowed.const, false);
  assert.equal(schema.properties.automatic_continuation_allowed.const, false);
  for (const field of ["schema", "build_id", ...contract.required]) {
    assert.ok(requiredFields(schema).includes(field), `${contract.path} missing required field ${field}`);
  }
}

const requestSchema = readJson("schema/orchestration/codex_native_dry_run_execution_request.schema.json");
assert.deepEqual(requestSchema.properties.operation_class.enum, [
  "STATIC_FIXTURE_REVIEW",
  "APPDATA_PACKET_REVIEW",
  "SCHEMA_CONTRACT_REVIEW"
]);
assert.deepEqual(requestSchema.properties.output_root_policy.enum, [
  "APPDATA_ONLY",
  "TEST_TEMP_ONLY",
  "APPDATA_OR_TEST_TEMP_ONLY"
]);

const resultSchema = readJson("schema/orchestration/codex_native_dry_run_execution_result.schema.json");
assert.ok(resultSchema.properties.status.enum.includes("STOP_OWNER_REVIEW_REQUIRED"));
assert.ok(resultSchema.properties.next_recommended_action.enum.includes("OWNER_REVIEW_REQUIRED"));

const forbiddenSchema = readJson("schema/orchestration/codex_native_forbidden_action_report.schema.json");
for (const action of forbiddenActionTerms) {
  assert.ok(forbiddenSchema.$defs.forbidden_action.enum.includes(action), `forbidden action enum missing ${action}`);
}
assert.equal(forbiddenSchema.properties.expected_result.const, "STOP_OWNER_REVIEW_REQUIRED");

const blockerSchema = readJson("schema/orchestration/codex_native_blocker_matrix_record.schema.json");
for (const blocker of blockerTypes) {
  assert.ok(blockerSchema.$defs.blocker_type.enum.includes(blocker), `blocker enum missing ${blocker}`);
}
assert.deepEqual(blockerSchema.properties.severity.enum, ["LOW", "MEDIUM", "HIGH"]);

const reviewSchema = readJson("schema/orchestration/codex_native_human_review_one_point.schema.json");
assert.equal(reviewSchema.properties.artifact_sha256.$ref, "#/$defs/sha256");
assert.equal(reviewSchema.properties.options.uniqueItems, true);

console.log("codex_native_next_wave_schema_contract_static: ok");
