// BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const buildId = "20260613_codex_native_automation_gate_contracts_v1";

const docs = [
  "docs/orchestration/codex_native_supervised_automation_static_preconditions.md",
  "docs/orchestration/codex_native_forbidden_action_report_contract.md",
  "docs/orchestration/codex_native_blocker_matrix_contract.md"
];

for (const path of docs) {
  const text = readText(path);
  assert.ok(text.startsWith(`<!-- BUILD_ID: ${buildId} -->`), `${path} must start with BUILD_ID`);
  for (const term of [
    "STOP_OWNER_REVIEW_REQUIRED",
    "owner",
    "execution_allowed",
    "runtime_allowed",
    "automatic_continuation_allowed"
  ]) {
    assert.ok(text.includes(term), `${path} must mention ${term}`);
  }
}

const preconditions = readText("docs/orchestration/codex_native_supervised_automation_static_preconditions.md");
for (const term of [
  "missing artifact",
  "corrupt artifact",
  "stale artifact",
  "duplicate task ID",
  "duplicate artifact ID",
  "unknown state",
  "automatic continuation attempt",
  "OpenAI API",
  "Cloudflare",
  "billing",
  "fetch_balance"
]) {
  assert.match(preconditions, new RegExp(term, "i"), `preconditions docs missing ${term}`);
}

const forbiddenDocs = readText("docs/orchestration/codex_native_forbidden_action_report_contract.md");
for (const term of [
  "runtime_attempt",
  "deploy_attempt",
  "private_openai_api_attempt",
  "cloud_mutation_attempt",
  "billing_mutation_attempt",
  "trading_order_attempt",
  "redacted"
]) {
  assert.ok(forbiddenDocs.includes(term), `forbidden action docs missing ${term}`);
}

const blockerDocs = readText("docs/orchestration/codex_native_blocker_matrix_contract.md");
for (const term of [
  "missing_artifact",
  "corrupt_artifact",
  "stale_artifact",
  "duplicate_task_id",
  "unknown_owner_approval",
  "stale_owner_approval",
  "trading_order_attempt"
]) {
  assert.ok(blockerDocs.includes(term), `blocker docs missing ${term}`);
}

const combinedDocs = docs.map(readText).join("\n").toLowerCase();
for (const unsafeClaim of [
  "deploy performed",
  "runtime execution is approved",
  "private api access is approved",
  "openai api call is approved",
  "trading is approved",
  "billing mutation is approved",
  "commit is approved",
  "push is approved",
  "daemon is enabled",
  "watcher is enabled"
]) {
  assert.equal(combinedDocs.includes(unsafeClaim), false, `docs must not claim ${unsafeClaim}`);
}

console.log("codex_native_next_wave_docs_contract_static: ok");
