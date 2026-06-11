import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readJson = (path) => JSON.parse(readText(path));

const validJsonFiles = [
  "tests/fixtures/codex_native_closed_loop/valid_state_ready_for_triage.json",
  "tests/fixtures/codex_native_closed_loop/valid_state_result_review_required.json",
  "tests/fixtures/codex_native_closed_loop/valid_transition_table_minimal.json",
  "codex_native_closed_loop/state.example.json",
  "codex_native_closed_loop/transition_table.example.json",
  "codex_native_closed_loop/task_queue.example.json"
];

for (const file of validJsonFiles) {
  const text = readText(file);
  assert.ok(!/"worker_launch_allowed"\s*:\s*true/.test(text), `${file} enables worker launch`);
  assert.ok(!/"worker_launch_enabled"\s*:\s*true/.test(text), `${file} enables worker launch`);
  assert.ok(!/"real_orchestration_allowed"\s*:\s*true/.test(text), `${file} enables real orchestration`);
  assert.ok(!/"prompt_sending_allowed"\s*:\s*true/.test(text), `${file} enables prompt sending`);
  assert.ok(!/"runtime_execution_allowed"\s*:\s*true/.test(text), `${file} enables runtime execution`);
}

const reasonLines = readText("codex_native_closed_loop/reason_log.example.jsonl")
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line));

assert.ok(reasonLines.length >= 1, "reason log example must contain JSONL lines");
for (const line of reasonLines) {
  assert.ok(line.state_before, "reason log line missing state_before");
  assert.ok(line.state_after, "reason log line missing state_after");
  assert.ok(line.reason, "reason log line missing reason");
}

function listFiles(dir) {
  const entries = [];
  for (const item of readdirSync(resolve(root, dir))) {
    const full = join(resolve(root, dir), item);
    if (statSync(full).isDirectory()) {
      for (const nested of listFiles(join(dir, item))) entries.push(nested);
    } else {
      entries.push(join(dir, item).replaceAll("\\", "/"));
    }
  }
  return entries;
}

const changedStaticFiles = [
  ...listFiles("docs/codex_native_closed_loop"),
  ...listFiles("schema/codex_native_closed_loop"),
  ...listFiles("tests/codex_native_closed_loop"),
  ...listFiles("tests/fixtures/codex_native_closed_loop"),
  ...listFiles("codex_native_closed_loop")
];

const forbiddenActionClaims = [
  ["worker launch", "occurred"],
  ["real orchestration", "occurred"],
  ["browser bridge", "executed"],
  ["ChatGPT prompt sent", "by bridge"],
  ["file uploaded", "to ChatGPT"],
  ["public visibility", "changed"],
  ["GitHub Release", "created"],
  ["release asset", "uploaded"],
  ["deploy", "performed"],
  ["PAPER/LIVE/order/private API", "occurred"],
  ["runtime import", "occurred"]
].map((parts) => parts.join(" "));

for (const file of changedStaticFiles) {
  const text = readText(file);
  for (const claim of forbiddenActionClaims) {
    assert.ok(!text.includes(claim), `${file} contains forbidden action claim: ${claim}`);
  }
}

const taskQueue = readJson("codex_native_closed_loop/task_queue.example.json");
for (const task of taskQueue.tasks) {
  assert.equal(task.next_implementer_start_allowed, false);
  assert.equal(task.worker_launch_allowed, false);
  assert.equal(task.prompt_sending_allowed, false);
}

console.log("no_worker_launch_guard_static: ok");
