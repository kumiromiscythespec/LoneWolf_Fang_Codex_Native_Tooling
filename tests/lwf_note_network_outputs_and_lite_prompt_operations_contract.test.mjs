import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const paths = {
  docs: resolve(repoRoot, "docs/lwf-note-network/outputs_and_lite_prompt_operations.md"),
  schema: resolve(repoRoot, "schema/lwf-note-network/note_network_operations.schema.json"),
  valid: resolve(
    repoRoot,
    "tests/fixtures/lwf-note-network/operations/valid/current-lite-scout-operations.json",
  ),
  invalidFullPrompt: resolve(
    repoRoot,
    "tests/fixtures/lwf-note-network/operations/invalid/full-scout-plan-as-default.json",
  ),
  invalidAppData: resolve(
    repoRoot,
    "tests/fixtures/lwf-note-network/operations/invalid/appdata-output-root.json",
  ),
  invalidRuntime: resolve(
    repoRoot,
    "tests/fixtures/lwf-note-network/operations/invalid/runtime-action-approved.json",
  ),
};

const expectedNodes = [
  ["LWF-NOTE-01", "192.168.50.12", "http://192.168.50.13:11434"],
  ["LWF-NOTE-02", "192.168.50.12", "http://192.168.50.14:11434"],
  ["LWF-NOTE-03", "192.168.50.12", "http://192.168.50.15:11434"],
  ["LWF-NOTE-04", "192.168.50.12", "http://192.168.50.16:11434"],
  ["LWF-NOTE-05", "192.168.50.12", "http://192.168.50.17:11434"],
];

const forbiddenActionKeys = [
  "runtime_workflow",
  "deploy",
  "api_call",
  "cloud_mutation",
  "auth_mutation",
  "billing_mutation",
  "trading_mutation",
  "openai_api_call",
  "private_api_call",
  "queue_mutation",
  "autonomous_execution",
  "public_submission",
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function expectEqual(errors, actual, expected, label) {
  if (actual !== expected) {
    errors.push(`${label} expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`);
  }
}

function validateOperationsContract(record) {
  const errors = [];

  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return ["record must be an object"];
  }

  expectEqual(errors, record.schema_version, "1.0.0", "schema_version");
  expectEqual(
    errors,
    record.scope,
    "lwf_note_network_outputs_and_lite_prompt_operations",
    "scope",
  );
  expectEqual(errors, record.output_root, "C:\\LWF_NoteNetwork\\outputs", "output_root");
  expectEqual(
    errors,
    record.prompt_policy,
    "lite_compressed_plans_not_full_codex_sized_prompts",
    "prompt_policy",
  );
  expectEqual(errors, record.recommended_prompt_chars_min, 4000, "recommended_prompt_chars_min");
  expectEqual(errors, record.recommended_prompt_chars_max, 6000, "recommended_prompt_chars_max");

  if (!Number.isInteger(record.known_failure_prompt_chars) || record.known_failure_prompt_chars < 15000) {
    errors.push("known_failure_prompt_chars must be an integer at or above 15000");
  }

  expectEqual(errors, record.observed_success_prompt_chars, 4364, "observed_success_prompt_chars");
  expectEqual(errors, record.stable_model, "llama3.2:3b", "stable_model");
  expectEqual(errors, record.autonomous_execution_allowed, false, "autonomous_execution_allowed");

  if (!Array.isArray(record.nodes) || record.nodes.length !== expectedNodes.length) {
    errors.push("nodes must contain exactly the five current NOTE nodes");
  } else {
    expectedNodes.forEach(([name, host, url], index) => {
      const node = record.nodes[index];
      expectEqual(errors, node?.name, name, `nodes[${index}].name`);
      expectEqual(errors, node?.host, host, `nodes[${index}].host`);
      expectEqual(errors, node?.url, url, `nodes[${index}].url`);
      expectEqual(errors, node?.diagnostics?.ping, true, `nodes[${index}].diagnostics.ping`);
      expectEqual(errors, node?.diagnostics?.api_tags, true, `nodes[${index}].diagnostics.api_tags`);
      expectEqual(
        errors,
        node?.diagnostics?.smoke_generate,
        true,
        `nodes[${index}].diagnostics.smoke_generate`,
      );
      expectEqual(
        errors,
        node?.diagnostics?.lite_scout_generate,
        true,
        `nodes[${index}].diagnostics.lite_scout_generate`,
      );
    });
  }

  expectEqual(
    errors,
    record.safety_boundary?.scout_review_support_only,
    true,
    "safety_boundary.scout_review_support_only",
  );
  expectEqual(
    errors,
    record.safety_boundary?.owner_review_required,
    true,
    "safety_boundary.owner_review_required",
  );
  expectEqual(
    errors,
    record.safety_boundary?.note_output_is_execution_proof,
    false,
    "safety_boundary.note_output_is_execution_proof",
  );
  expectEqual(
    errors,
    record.safety_boundary?.lite_prompt_required,
    true,
    "safety_boundary.lite_prompt_required",
  );

  for (const action of forbiddenActionKeys) {
    expectEqual(errors, record.forbidden_actions?.[action], false, `forbidden_actions.${action}`);
  }

  return errors;
}

test("schema pins the NOTE operations contract", () => {
  const schema = readJson(paths.schema);

  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.properties.output_root.const, "C:\\LWF_NoteNetwork\\outputs");
  assert.equal(
    schema.properties.prompt_policy.const,
    "lite_compressed_plans_not_full_codex_sized_prompts",
  );
  assert.equal(schema.properties.recommended_prompt_chars_min.const, 4000);
  assert.equal(schema.properties.recommended_prompt_chars_max.const, 6000);
  assert.equal(schema.properties.autonomous_execution_allowed.const, false);

  for (const action of [
    "runtime_workflow",
    "deploy",
    "api_call",
    "cloud_mutation",
    "auth_mutation",
    "billing_mutation",
    "trading_mutation",
  ]) {
    assert.equal(schema.properties.forbidden_actions.properties[action].const, false);
  }
});

test("valid fixture passes schema-shaped semantic validation", () => {
  const valid = readJson(paths.valid);
  assert.deepEqual(validateOperationsContract(valid), []);
  assert.equal(valid.autonomous_execution_allowed, false);
  assert.equal(valid.stable_model, "llama3.2:3b");
});

test("invalid fixtures fail for their expected reasons", () => {
  const fullPromptErrors = validateOperationsContract(readJson(paths.invalidFullPrompt));
  assert(fullPromptErrors.some((error) => error.includes("prompt_policy")));
  assert(fullPromptErrors.some((error) => error.includes("recommended_prompt_chars_min")));

  const appDataErrors = validateOperationsContract(readJson(paths.invalidAppData));
  assert(appDataErrors.some((error) => error.includes("output_root")));

  const runtimeErrors = validateOperationsContract(readJson(paths.invalidRuntime));
  assert(runtimeErrors.some((error) => error.includes("autonomous_execution_allowed")));
  assert(runtimeErrors.some((error) => error.includes("forbidden_actions.runtime_workflow")));
  assert(runtimeErrors.some((error) => error.includes("forbidden_actions.deploy")));
});

test("documentation records the output root, prompt policy, node map, and forbidden mutations", () => {
  const docs = readFileSync(paths.docs, "utf8");

  assert.match(docs, /C:\\LWF_NoteNetwork\\outputs/);
  assert.match(docs, /4,000 to 6,000 chars/);
  assert.match(docs, /full scout_plan around 15k chars/i);

  for (const [, , url] of expectedNodes) {
    assert.match(docs, new RegExp(url.replaceAll(".", "\\.")));
  }

  assert.match(docs, /runtime, deploy, API, cloud, auth, billing, or trading mutation/);
});
