// BUILD_ID: 20260616_submission_readiness_static_gap_contract_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");

const nextPrompt = readText("NEXT_CODEX_PROMPT.md");
const readme = readText("README.md");
const licenseReadiness = readText("docs/oss_review/license_readiness.md");
const ownerGuide = readText("docs/oss_review/final_owner_submission_review_guide.md");
const chainInventory = readText("docs/orchestration/codex_native_submission_readiness_completed_chain_inventory.md");
const topLevelLicense = readText("LICENSE");

const forbiddenApprovalClaims = [
  /public submission is approved/i,
  /deploy(?:ment)? is approved/i,
  /runtime(?: workflow)? is approved/i,
  /worker launch is approved/i,
  /OpenAI API(?: call| use)? is approved/i,
  /private API(?: call| use)? is approved/i
];

function assertDoesNotApproveForbiddenActions(text, name) {
  for (const pattern of forbiddenApprovalClaims) {
    assert.doesNotMatch(text, pattern, `${name} must not contain ${pattern}`);
  }
}

test("NEXT_CODEX_PROMPT points to implementation review and preserves gates", () => {
  assert.match(nextPrompt, /START_CODEX_NATIVE_SUBMISSION_READINESS_BOUNDED_STATIC_GAP_IMPLEMENTATION_REVIEW_PACKET/);
  assert.match(nextPrompt, /START_CODEX_NATIVE_FINAL_SUBMISSION_REVIEW_PACKET/);
  assert.match(nextPrompt, /not approval to stage, commit, push/i);
  assert.match(nextPrompt, /not approval to .*deploy/i);
  assert.match(nextPrompt, /not approval to .*runtime/i);
  assert.match(nextPrompt, /not approval to .*public review/i);
  assertDoesNotApproveForbiddenActions(nextPrompt, "NEXT_CODEX_PROMPT.md");
});

test("README links current submission-readiness references and safe validation", () => {
  assert.match(readme, /Codex Native Submission Readiness/);
  assert.match(readme, /docs\/oss_review\/final_owner_submission_review_guide\.md/);
  assert.match(readme, /docs\/oss_review\/license_readiness\.md/);
  assert.match(readme, /docs\/orchestration\/codex_native_submission_readiness_completed_chain_inventory\.md/);
  assert.match(readme, /static supervised dry-run orchestration contracts/i);
  assert.match(readme, /not demonstrate real autonomous runtime execution/i);
  assert.match(readme, /node --test/);
  assert.match(readme, /owner\/external\s+gated actions/i);
  assertDoesNotApproveForbiddenActions(readme, "README.md");
});

test("license readiness reconciles the current MIT LICENSE evidence", () => {
  assert.match(topLevelLicense, /^MIT License/m);
  assert.match(licenseReadiness, /top-level `LICENSE` file using the MIT\s+License/i);
  assert.match(licenseReadiness, /Copyright \(c\) 2026 kumiromiscythespec/);
  assert.match(licenseReadiness, /not legal advice/i);
  assert.match(licenseReadiness, /does not confirm official external approval/i);
  assert.match(licenseReadiness, /owner should confirm/i);
  assert.doesNotMatch(licenseReadiness, /does not create `LICENSE`/i);
});

test("final owner guide contains review checklist and forbidden action reminders", () => {
  for (const marker of [
    "Project Purpose",
    "Current Pushed Baseline",
    "What Is Implemented",
    "What Is Intentionally Not Implemented",
    "Safety Boundaries",
    "Test Commands",
    "Artifact And Evidence Chain Overview",
    "Owner Checklist Before Any External Submission",
    "This guide does not approve public submission"
  ]) {
    assert.match(ownerGuide, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(ownerGuide, /0dda223e87bb00f2662ea686e2719c4ce45f0d2d/);
  assert.match(ownerGuide, /node --test/);
  assert.match(ownerGuide, /deploy\/runtime\/live\/worker/i);
  assert.match(ownerGuide, /Queue\/cloud\/API\/billing\/auth\/trading/i);
  assertDoesNotApproveForbiddenActions(ownerGuide, "final_owner_submission_review_guide.md");
});

test("completed chain inventory names the latest baseline and key chains", () => {
  assert.match(chainInventory, /0dda223e87bb00f2662ea686e2719c4ce45f0d2d/);
  for (const chain of [
    "supervised_dry_run_execution_request_envelope_contracts",
    "supervised_dry_run_owner_decision_receipt_contracts",
    "supervised_dry_run_execution_receipt_contracts",
    "supervised_dry_run_execution_receipt_to_result_observation_linkage_contracts",
    "supervised_dry_run_result_observation_contracts",
    "supervised_dry_run_result_observation_to_audit_bundle_linkage_contracts",
    "supervised_dry_run_audit_bundle_reference_contracts",
    "supervised_dry_run_owner_review_packet_contracts",
    "supervised_dry_run_audit_bundle_to_owner_review_packet_linkage_contracts",
    "supervised_dry_run_owner_review_packet_to_chain_summary_linkage_contracts",
    "supervised_dry_run_chain_summary_reference_contracts"
  ]) {
    assert.match(chainInventory, new RegExp(chain));
  }
  assert.match(chainInventory, /file_queue_linkage_supersession/);
  assert.match(chainInventory, /file_queue_readonly_linkage_consumer/);
  assert.match(chainInventory, /naming-needs-context/);
  assertDoesNotApproveForbiddenActions(chainInventory, "completed chain inventory");
});

test("all updated docs preserve not-GO safety semantics", () => {
  for (const [name, text] of [
    ["NEXT_CODEX_PROMPT.md", nextPrompt],
    ["final_owner_submission_review_guide.md", ownerGuide],
    ["completed_chain_inventory.md", chainInventory]
  ]) {
    assert.match(text, /READY is not GO/);
    assert.match(text, /MATCHED is not GO/);
    assert.match(text, /OBSERVED_SAFE_NO_ACTION is not GO/);
    assert.match(text, /Hash binding is not execution approval/);
    assert.match(text, /Owner review remains mandatory/);
    assertDoesNotApproveForbiddenActions(text, name);
  }
});

test("static gap contract remains local-only and read-only", () => {
  const source = readText("tests/codex_native_submission_readiness_static_gap_contract.test.mjs");
  assert.doesNotMatch(
    source,
    /from\s+["'](?:node:)?(?:http|https|net|tls|dgram|child_process|worker_threads|cluster)["']/,
    "test must not import network, process-launch, worker, or cluster modules"
  );
  assert.doesNotMatch(
    source,
    /from\s+["'](?:openai|@openai\/[^"']+|stripe|cloudflare|@octokit\/[^"']+|undici|node-fetch|axios)["']/i,
    "test must not import provider, OpenAI, payment, GitHub, or HTTP client SDK modules"
  );
  assert.doesNotMatch(source, /\b(?:fetch|spawn|exec|execFile|fork|Worker|writeFile|appendFile|rm|unlink)\s*\(/);
});
