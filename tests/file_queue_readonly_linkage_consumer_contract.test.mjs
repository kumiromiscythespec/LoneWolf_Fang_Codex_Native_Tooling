// BUILD_ID: 20260612_fasttrack_window3_readonly_linkage_consumer_contract_tests_v0
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  CONSUMER_BUILD_ID,
  OBSERVATION_FIXTURE_BUILD_ID,
  OBSERVATION_SCHEMA_ID,
  STOP_OWNER_REVIEW_REQUIRED,
  observeLinkageFile,
  observeLinkageRecords,
  validateRuntimePaths
} from "../tools/orchestration/file_queue_readonly_linkage_consumer.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const observationSchema = readJson("schema/orchestration/file_queue_linkage_consumer_observation.schema.json");
const validObservation = readJson("tests/fixtures/file-queue/consumer/valid/consumer_observation_valid.json");
const missingLatestProof = readJson("tests/fixtures/file-queue/consumer/invalid/consumer_missing_latest_proof.json");
const runtimeAllowedTrue = readJson("tests/fixtures/file-queue/consumer/invalid/consumer_runtime_allowed_true.json");

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
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

function observationErrors(observation) {
  const errors = [];
  for (const field of missingRequired(observationSchema, observation)) errors.push(`missing ${field}`);
  if (errors.length > 0) return errors;
  if (observation.schema !== OBSERVATION_SCHEMA_ID) errors.push("bad schema");
  if (observation.build_id !== OBSERVATION_FIXTURE_BUILD_ID) errors.push("bad build_id");
  if (observation.consumer_build_id !== CONSUMER_BUILD_ID) errors.push("bad consumer_build_id");
  if (!isNonEmptyString(observation.observed_at_utc)) errors.push("observed_at_utc must be non-empty");
  if (Number.isNaN(Date.parse(observation.observed_at_utc))) errors.push("observed_at_utc must be date-time");
  if (typeof observation.source_ledger_path !== "string") errors.push("source_ledger_path must be string");
  if (typeof observation.latest_proof_id !== "string") errors.push("latest_proof_id must be string");
  if (!isNonEmptyString(observation.latest_proof_status)) errors.push("latest_proof_status must be non-empty");
  if (!isNonEmptyString(observation.next_action_recommendation)) errors.push("next_action_recommendation must be non-empty");
  if (observation.owner_approval_required !== true) errors.push("owner_approval_required must be true");
  if (observation.execution_allowed !== false) errors.push("execution_allowed must be false");
  if (observation.runtime_allowed !== false) errors.push("runtime_allowed must be false");
  if (!isNonEmptyString(observation.reason)) errors.push("reason must be non-empty");
  if (observation.safety_summary) {
    for (const field of [
      "read_only",
      "no_task_execution",
      "no_daemon",
      "no_watcher",
      "no_queue_mutation",
      "appdata_only_default",
      "fixture_paths_only_in_tests"
    ]) {
      if (observation.safety_summary[field] !== true) errors.push(`safety_summary.${field} must be true`);
    }
  }
  if (observation.forbidden_actions_confirmation) {
    if (observation.forbidden_actions_confirmation.forbidden_actions_performed !== false) {
      errors.push("forbidden_actions_performed must be false");
    }
    if (
      !Array.isArray(observation.forbidden_actions_confirmation.confirmed_absent) ||
      observation.forbidden_actions_confirmation.confirmed_absent.length === 0
    ) {
      errors.push("confirmed_absent must be non-empty array");
    }
  }
  return errors;
}

function proofRecord({ id, acceptedAtUtc, status = "ACCEPTED", nextRecommendedAction = "OWNER_REVIEW_REQUIRED" }) {
  return {
    schema: "lonewolf.file_queue.linkage_proof.v1",
    proof_id: id,
    proof_status: status,
    accepted_at_utc: acceptedAtUtc,
    chain_id: `chain_${id}`,
    task_id: `task_${id}`,
    owner_decision_id: `owner_${id}`,
    output_packet_id: `packet_${id}`,
    validator_report_sha256: "A".repeat(64),
    execution_request_sha256: "B".repeat(64),
    interpreter_result_sha256: "C".repeat(64),
    output_packet_sha256: "D".repeat(64),
    owner_decision_sha256: "E".repeat(64),
    next_recommended_action: nextRecommendedAction,
    parent_references: {
      chain_id: `chain_${id}`,
      task_id: `task_${id}`,
      owner_decision_id: `owner_${id}`,
      output_packet_id: `packet_${id}`,
      validator_report_sha256: "A".repeat(64),
      execution_request_sha256: "B".repeat(64),
      interpreter_result_sha256: "C".repeat(64),
      output_packet_sha256: "D".repeat(64),
      owner_decision_sha256: "E".repeat(64)
    },
    linkage_checks: {
      parent_ids_match: true,
      parent_hashes_match: true,
      no_consumer_inference: true
    },
    forbidden_actions_confirmation: {
      forbidden_actions_performed: false,
      confirmed_absent: ["runner", "daemon", "watcher", "task_execution"]
    }
  };
}

test("observation schema and fixtures keep the no-runtime boundary", () => {
  assert.equal(observationSchema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(observationSchema.$comment, "BUILD_ID: 20260612_fasttrack_window3_readonly_linkage_consumer_schema_v0");
  assert.equal(observationSchema.additionalProperties, false, "observation schema must reject extra fields");
  for (const field of [
    "observed_at_utc",
    "source_ledger_path",
    "latest_proof_id",
    "latest_proof_status",
    "next_action_recommendation",
    "owner_approval_required",
    "execution_allowed",
    "runtime_allowed",
    "reason"
  ]) {
    assert.ok(observationSchema.required.includes(field), `observation schema missing ${field}`);
  }
  assertNoExtraProperties(observationSchema, validObservation, "consumer_observation_valid.json");
  assert.deepEqual(observationErrors(validObservation), [], "valid consumer observation fixture must pass");
  assertNoExtraProperties(observationSchema, missingLatestProof, "consumer_missing_latest_proof.json");
  assert.ok(observationErrors(missingLatestProof).includes("missing latest_proof_id"), "missing latest proof fixture must fail");
  assertNoExtraProperties(observationSchema, runtimeAllowedTrue, "consumer_runtime_allowed_true.json");
  assert.ok(observationErrors(runtimeAllowedTrue).includes("runtime_allowed must be false"), "runtime true fixture must fail");
});

test("consumer reads an existing JSON linkage proof and writes only an observation", () => {
  const outRoot = mkdtempSync(join(tmpdir(), "file-queue-linkage-consumer-json-"));
  const linkagePath = resolve(root, "tests/fixtures/file-queue/linkage/valid/linkage_complete_chain.json");
  const run = observeLinkageFile({
    ledgerPath: linkagePath,
    outRoot,
    observedAtUtc: "2026-06-12T09:00:00.000Z",
    allowFixturePaths: true
  });

  assert.equal(run.refused, false);
  assert.equal(run.observation.latest_proof_id, "owner_decision_phase44_001");
  assert.equal(run.observation.latest_proof_status, "EXECUTED_APPDATA_ONLY");
  assert.equal(run.observation.next_action_recommendation, "OWNER_REVIEW_REQUIRED");
  assert.equal(run.observation.execution_allowed, false);
  assert.equal(run.observation.runtime_allowed, false);
  assert.deepEqual(observationErrors(run.observation), [], "generated observation must validate");
  assert.ok(run.outputPath.startsWith(resolve(outRoot)), "observation output must stay under temp fixture root");
  assert.equal(statSync(run.outputPath).isFile(), true, "observation must be written as a file");
  assert.deepEqual(JSON.parse(readFileSync(run.outputPath, "utf8")), run.observation);
});

test("consumer detects the latest accepted JSONL proof without executing the recommendation", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "file-queue-linkage-consumer-jsonl-"));
  const ledgerPath = join(tempRoot, "linkage_ledger.jsonl");
  const outRoot = join(tempRoot, "out");
  const oldProof = proofRecord({
    id: "proof_window3_accepted_001",
    acceptedAtUtc: "2026-06-12T08:00:00.000Z",
    nextRecommendedAction: "OWNER_REVIEW_REQUIRED"
  });
  const latestProof = proofRecord({
    id: "proof_window3_accepted_002",
    acceptedAtUtc: "2026-06-12T08:10:00.000Z",
    nextRecommendedAction: "CREATE_PUSH_APPROVAL_PACKET_ONLY"
  });
  writeFileSync(ledgerPath, `${JSON.stringify(oldProof)}\n${JSON.stringify(latestProof)}\n`, "utf8");

  const run = observeLinkageFile({
    ledgerPath,
    outRoot,
    observedAtUtc: "2026-06-12T09:05:00.000Z",
    allowFixturePaths: true
  });

  assert.equal(run.refused, false);
  assert.equal(run.observation.latest_proof_id, "proof_window3_accepted_002");
  assert.equal(run.observation.latest_proof_status, "ACCEPTED");
  assert.equal(run.observation.next_action_recommendation, "CREATE_PUSH_APPROVAL_PACKET_ONLY");
  assert.equal(run.observation.owner_approval_required, true);
  assert.equal(run.observation.execution_allowed, false);
  assert.equal(run.observation.runtime_allowed, false);
  assert.match(run.observation.reason, /no execution was performed/i);
  assert.deepEqual(observationErrors(run.observation), [], "JSONL observation must validate");
  assert.ok(existsSync(run.outputPath), "JSONL observation output must exist");
});

test("consumer fails closed when accepted proof evidence is incomplete or ambiguous", () => {
  const incomplete = proofRecord({
    id: "proof_incomplete",
    acceptedAtUtc: "2026-06-12T08:00:00.000Z"
  });
  delete incomplete.output_packet_sha256;
  const incompleteObservation = observeLinkageRecords([incomplete], {
    sourceLedgerPath: "%LOCALAPPDATA%/LoneWolfFang/data/linkage_ledger.jsonl",
    observedAtUtc: "2026-06-12T09:10:00.000Z"
  });
  assert.equal(incompleteObservation.next_action_recommendation, STOP_OWNER_REVIEW_REQUIRED);
  assert.equal(incompleteObservation.owner_approval_required, true);
  assert.equal(incompleteObservation.execution_allowed, false);
  assert.equal(incompleteObservation.runtime_allowed, false);
  assert.match(incompleteObservation.reason, /incomplete/i);

  const first = proofRecord({ id: "proof_tie_001", acceptedAtUtc: "2026-06-12T08:00:00.000Z" });
  const second = proofRecord({ id: "proof_tie_002", acceptedAtUtc: "2026-06-12T08:00:00.000Z" });
  const tiedObservation = observeLinkageRecords([first, second], {
    sourceLedgerPath: "%LOCALAPPDATA%/LoneWolfFang/data/linkage_ledger.jsonl",
    observedAtUtc: "2026-06-12T09:15:00.000Z"
  });
  assert.equal(tiedObservation.next_action_recommendation, STOP_OWNER_REVIEW_REQUIRED);
  assert.match(tiedObservation.reason, /share the latest timestamp/i);
});

test("default path policy refuses non-AppData paths outside fixture tests", () => {
  const repoFixturePath = resolve(root, "tests/fixtures/file-queue/linkage/valid/linkage_complete_chain.json");
  const tempOut = mkdtempSync(join(tmpdir(), "file-queue-linkage-consumer-policy-"));
  const defaultErrors = validateRuntimePaths({
    ledgerPath: repoFixturePath,
    outRoot: tempOut,
    allowFixturePaths: false
  });
  assert.ok(defaultErrors.includes("ledger path must be under the local AppData artifact root"));
  assert.ok(defaultErrors.includes("out-root must be under the local AppData artifact root"));
  assert.deepEqual(
    validateRuntimePaths({
      ledgerPath: repoFixturePath,
      outRoot: tempOut,
      allowFixturePaths: true
    }),
    []
  );
});

test("consumer source has no process, network, watcher, or helper execution surface", () => {
  const source = readText("tools/orchestration/file_queue_readonly_linkage_consumer.mjs");
  assert.ok(source.includes("CONSUMER_BUILD_ID"), "consumer must expose build identity");
  assert.doesNotMatch(
    source,
    /from\s+["'](?:node:)?(?:http|https|net|tls|dgram|child_process|worker_threads|cluster)["']/,
    "consumer must not import network, process-launch, worker, or cluster modules"
  );
  assert.doesNotMatch(
    source,
    /from\s+["'](?:openai|@openai\/[^"']+|playwright|puppeteer|selenium-webdriver|stripe|cloudflare|@octokit\/[^"']+|undici|node-fetch|axios)["']/i,
    "consumer must not import provider, OpenAI, browser automation, payment, GitHub, or HTTP client SDK modules"
  );
  assert.doesNotMatch(
    source,
    /\b(?:spawn|exec|execFile|fork|Worker|watch|watchFile|setInterval|setTimeout|fetch)\s*\(/,
    "consumer must not expose shell, worker, daemon, watcher, timer, or fetch paths"
  );
  assert.doesNotMatch(source, /file_queue_task_authoring_helper/i, "consumer must not reference the task authoring helper");
  assert.doesNotMatch(source, /file_queue_dry_run_validator/i, "consumer must not reference the dry-run validator");
  assert.doesNotMatch(source, /file_queue_execution_interpreter/i, "consumer must not reference the execution interpreter");
});
