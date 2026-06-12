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

const schema = readJson("schema/orchestration/file_queue_linkage_supersession_record.schema.json");
const validTerminal = readJson("tests/fixtures/file-queue/supersession/valid/supersession_chain_single_terminal.json");
const duplicateSupersession = readJson("tests/fixtures/file-queue/supersession/invalid/supersession_duplicate_id.json");
const cycle = readJson("tests/fixtures/file-queue/supersession/invalid/supersession_cycle.json");
const unknownProof = readJson("tests/fixtures/file-queue/supersession/invalid/supersession_unknown_proof.json");
const checksumMismatch = readJson("tests/fixtures/file-queue/supersession/invalid/supersession_checksum_mismatch.json");

const sha256Pattern = /^[A-Fa-f0-9]{64}$/;

function supersessionRecords(fixture) {
  return fixture.records.filter((record) => record.schema === "lonewolf.file_queue.linkage_supersession_record.v1");
}

function proofRecords(fixture) {
  return fixture.records.filter((record) => record.schema === "lonewolf.file_queue.linkage_proof.v1");
}

function assertBuildId(value, name) {
  assert.equal(value.build_id, buildId, `${name} must carry implementation build_id`);
}

function assertFailClosedExpected(fixture) {
  assert.equal(fixture.expected_result.next_action_recommendation, "STOP_OWNER_REVIEW_REQUIRED");
  assert.equal(fixture.expected_result.owner_review_required, true);
  assert.equal(fixture.expected_result.execution_allowed, false);
  assert.equal(fixture.expected_result.runtime_allowed, false);
}

test("supersession schema is append-only, static, and owner-gated", () => {
  assert.equal(schema.$comment, `BUILD_ID: ${buildId}`);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema.const, "lonewolf.file_queue.linkage_supersession_record.v1");
  assert.equal(schema.properties.build_id.const, buildId);
  assert.equal(schema.properties.owner_approval_required.const, true);
  assert.equal(schema.properties.execution_allowed.const, false);
  assert.equal(schema.properties.runtime_allowed.const, false);
  assert.equal(schema.properties.checksum_algorithm.const, "SHA256");
  assert.ok(schema.required.includes("human_review_one_point"));
  for (const field of [
    "append_only",
    "evidence_by_reference",
    "no_ledger_rewrite",
    "no_deletion",
    "no_task_execution",
    "no_queue_mutation",
    "no_daemon_watcher"
  ]) {
    assert.equal(schema.properties.safety_summary.properties[field].const, true);
  }
});

test("valid fixture preserves old proof and selects one terminal proof", () => {
  assertBuildId(validTerminal, "valid terminal fixture");
  assert.equal(validTerminal.expected_result.latest_authoritative_proof_id, "proof_static_terminal_002");
  assert.equal(validTerminal.expected_result.owner_review_required, true);
  assert.equal(validTerminal.expected_result.execution_allowed, false);
  assert.equal(validTerminal.expected_result.runtime_allowed, false);

  const proofs = proofRecords(validTerminal);
  const supersessions = supersessionRecords(validTerminal);
  assert.equal(proofs.length, 2);
  assert.equal(supersessions.length, 1);

  const supersession = supersessions[0];
  assertBuildId(supersession, "valid supersession record");
  assert.equal(supersession.supersedes_proof_id, "proof_static_superseded_001");
  assert.equal(supersession.superseding_proof_id, "proof_static_terminal_002");
  assert.equal(supersession.owner_approval_required, true);
  assert.equal(supersession.execution_allowed, false);
  assert.equal(supersession.runtime_allowed, false);
  assert.match(supersession.parent_proof_sha256, sha256Pattern);
  assert.match(supersession.superseding_proof_sha256, sha256Pattern);
  assert.match(supersession.supersession_record_sha256, sha256Pattern);
  assert.equal(supersession.safety_summary.no_ledger_rewrite, true);
  assert.equal(supersession.safety_summary.no_deletion, true);
});

test("invalid fixtures encode fail-closed supersession risks", () => {
  for (const fixture of [duplicateSupersession, cycle, unknownProof, checksumMismatch]) {
    assertBuildId(fixture, fixture.fixture_id);
    assertFailClosedExpected(fixture);
  }

  const duplicateIds = supersessionRecords(duplicateSupersession).map((record) => record.supersession_id);
  assert.notEqual(new Set(duplicateIds).size, duplicateIds.length, "duplicate supersession fixture must duplicate id");

  const cyclePairs = supersessionRecords(cycle).map((record) => `${record.supersedes_proof_id}->${record.superseding_proof_id}`);
  assert.deepEqual(cyclePairs.sort(), ["proof_cycle_a->proof_cycle_b", "proof_cycle_b->proof_cycle_a"]);

  const knownProofIds = new Set(proofRecords(unknownProof).map((record) => record.proof_id));
  const unknownReference = supersessionRecords(unknownProof)[0].supersedes_proof_id;
  assert.equal(knownProofIds.has(unknownReference), false, "unknown proof fixture must point to missing proof");

  const checksumProof = proofRecords(checksumMismatch).find((record) => record.proof_id === "proof_checksum_old");
  const checksumSupersession = supersessionRecords(checksumMismatch)[0];
  assert.notEqual(checksumSupersession.parent_proof_sha256, checksumProof.proof_record_sha256);
});

test("docs describe supersession without runtime expansion", () => {
  const docs = readText("docs/orchestration/file_queue_linkage_ledger_writer.md");
  for (const term of [
    "Static Supersession Hardening Contract",
    "append-only",
    "superseded proof",
    "duplicate proof",
    "checksum-mismatched proof",
    "STOP_OWNER_REVIEW_REQUIRED"
  ]) {
    assert.match(docs, new RegExp(term, "i"));
  }
});
