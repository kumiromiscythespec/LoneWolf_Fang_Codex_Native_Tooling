import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const readText = (relativePath) => readFileSync(resolve(root, relativePath), "utf8");

const requiredLabels = [
  "CHANGED_SUMMARY",
  "CHANGED_FILES",
  "PURPOSE_ALIGNMENT",
  "VALIDATION_RESULT",
  "ENCODING_REPAIR_SUMMARY",
  "ENCODING_CHECK_RESULT",
  "MOJIBAKE_GUARD_RESULT",
  "STATIC_TEST_RESULT",
  "SAFETY_BOUNDARY_CONFIRMATION",
  "UNCONFIRMED_ASSUMPTIONS",
  "DANGEROUS_CHANGES",
  "HUMAN_REVIEW_ONE_POINT",
  "ZIP_PATH",
  "SHA256",
  "ZIP_ENTRY_COUNT",
  "MANIFEST_VALIDATION",
  "CHECKSUM_VALIDATION",
  "CONFIDENCE_LEVEL"
];

const activeFiles = [
  "codex_native_closed_loop/NEXT_CODEX_PROMPT.md",
  "docs/codex_native_closed_loop/output_encoding_policy_ja.md",
  "docs/codex_native_closed_loop/owner_resume_menu_ja.md"
];

function fromCodes(codes) {
  return String.fromCodePoint(...codes);
}

const mojibakeFragments = [
  [0x965e, 0x30fb],
  [0x8b41, 0x30fb],
  [0x7e3a],
  [0x95d6, 0xff74],
  [0x96b6, 0x0080],
  [0x96b4, 0x30fb],
  [0x9677, 0x30fb],
  [0x96b9, 0xff7a],
  [0x90e2, 0x30fb],
  [0x90b5, 0xff7a],
  [0x9a4d, 0xff68],
  [0x9a3e, 0xff76]
].map(fromCodes);

function listFiles(relativeDir) {
  const absoluteDir = resolve(root, relativeDir);
  const files = [];
  for (const entry of readdirSync(absoluteDir)) {
    const absolute = join(absoluteDir, entry);
    const relative = join(relativeDir, entry).replaceAll("\\", "/");
    if (statSync(absolute).isDirectory()) {
      files.push(...listFiles(relative));
    } else {
      files.push(relative);
    }
  }
  return files;
}

assert.ok(
  existsSync(resolve(root, "docs/codex_native_closed_loop/output_encoding_policy_ja.md")),
  "output encoding policy doc must exist"
);

const policy = readText("docs/codex_native_closed_loop/output_encoding_policy_ja.md");
assert.match(policy, /UTF-8 artifact files/);
assert.match(policy, /generated from Unicode escapes or code points/);
assert.match(policy, /Read `encoding_check\.txt` back as UTF-8/);
assert.match(policy, /must not claim `encoding_check_exact_match=true` unless the actual UTF-8 read-back equals the expected Unicode string/);
assert.match(policy, /ENCODING_CHECK_FAILED/);
assert.match(policy, /Final report.*ASCII-only/s);

const nextPrompt = readText("codex_native_closed_loop/NEXT_CODEX_PROMPT.md");
for (const label of requiredLabels) {
  assert.match(nextPrompt, new RegExp(`^- ${label}$`, "m"), `NEXT_CODEX_PROMPT missing label ${label}`);
  assert.match(label, /^[A-Z0-9_]+$/, `${label} must be ASCII-only`);
}
assert.doesNotMatch(nextPrompt, /^- [A-Z0-9_]+\s*\/\s*\S+/m, "mixed final report label headings are forbidden");
assert.match(nextPrompt, /Generate `encoding_check\.txt` from Unicode escapes or code points/);
assert.match(nextPrompt, /Do not set `encoding_check_exact_match=true` unless the actual UTF-8 read-back equals the expected Unicode string/);
assert.match(nextPrompt, /ENCODING_CHECK_FAILED/);

for (const file of activeFiles) {
  const text = readText(file);
  assert.doesNotMatch(text, /^#+\s+.*[^\x00-\x7F]/m, `${file} contains a non-ASCII markdown heading`);
}

for (const file of activeFiles) {
  const text = readText(file);
  for (const fragment of mojibakeFragments) {
    assert.ok(!text.includes(fragment), `${file} contains mojibake fragment`);
  }
}

for (const file of [
  ...listFiles("tests/fixtures/codex_native_closed_loop").filter((file) => file.split("/").at(-1).startsWith("valid_")),
  "codex_native_closed_loop/state.example.json",
  "codex_native_closed_loop/transition_table.example.json",
  "codex_native_closed_loop/task_queue.example.json"
]) {
  const text = readText(file);
  assert.doesNotMatch(text, /"worker_launch_allowed"\s*:\s*true/, `${file} enables worker launch`);
  assert.doesNotMatch(text, /"worker_launch_enabled"\s*:\s*true/, `${file} enables worker launch`);
  assert.doesNotMatch(text, /"real_orchestration_allowed"\s*:\s*true/, `${file} enables real orchestration`);
}

console.log("mojibake_output_guard_static: ok");
