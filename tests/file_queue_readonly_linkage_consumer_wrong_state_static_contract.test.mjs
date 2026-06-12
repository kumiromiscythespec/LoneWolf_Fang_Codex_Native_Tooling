// BUILD_ID: 20260613_ledger_consumer_static_hardening_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));
const buildId = "20260613_ledger_consumer_static_hardening_v1";

const observationSchema = readJson("schema/orchestration/file_queue_linkage_consumer_observation.schema.json");
const missingLedgerObservation = readJson(
  "tests/fixtures/file-queue/consumer/valid/consumer_observation_fail_closed_missing_ledger.json"
);

test("consumer observation schema allows static hardening fixture and human review point", () => {
  assert.equal(observationSchema.build_id, buildId);
  assert.ok(observationSchema.properties.build_id.enum.includes(buildId));
  assert.ok(observationSchema.properties.human_review_one_point);
  assert.equal(observationSchema.properties.owner_approval_required.const, true);
  assert.equal(observationSchema.properties.execution_allowed.const, false);
  assert.equal(observationSchema.properties.runtime_allowed.const, false);
});

test("missing ledger fail-closed fixture remains read-only and owner-gated", () => {
  assert.equal(missingLedgerObservation.build_id, buildId);
  assert.equal(missingLedgerObservation.next_action_recommendation, "STOP_OWNER_REVIEW_REQUIRED");
  assert.equal(missingLedgerObservation.owner_approval_required, true);
  assert.equal(missingLedgerObservation.execution_allowed, false);
  assert.equal(missingLedgerObservation.runtime_allowed, false);
  assert.match(missingLedgerObservation.reason, /Ledger path does not exist/i);
  assert.match(missingLedgerObservation.human_review_one_point, /repair or pause/i);
  assert.equal(missingLedgerObservation.safety_summary.read_only, true);
  assert.equal(missingLedgerObservation.safety_summary.no_task_execution, true);
  assert.equal(missingLedgerObservation.safety_summary.no_queue_mutation, true);
  assert.equal(
    missingLedgerObservation.forbidden_actions_confirmation.forbidden_actions_performed,
    false
  );
});

test("consumer docs require fail-closed wrong-state behavior", () => {
  const docs = readText("docs/orchestration/file_queue_readonly_linkage_consumer.md");
  for (const term of [
    "Wrong-State Static Hardening Contract",
    "read-only",
    "active terminal proof",
    "STOP_OWNER_REVIEW_REQUIRED",
    "human_review_one_point",
    "execution_allowed",
    "runtime_allowed"
  ]) {
    assert.match(docs, new RegExp(term, "i"));
  }
});

test("debug docs keep the static hardening lane behind owner gates", () => {
  const docs = readText("docs/orchestration/codex_native_debug_after_fasttrack.md");
  for (const term of [
    "Ledger And Consumer Static Hardening Lane",
    "docs/schema/tests/fixtures-only",
    "STOP",
    "REPAIR",
    "GO",
    "AppData",
    "SHA256"
  ]) {
    assert.match(docs, new RegExp(term, "i"));
  }
});
