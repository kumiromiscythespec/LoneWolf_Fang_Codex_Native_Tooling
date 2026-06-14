// BUILD_ID: LOCAL_METADATA_ONLY_REMOTE_FRESHNESS_DISCLOSURE_CONTRACTS_20260615
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readText = (filePath) => readFileSync(resolve(root, filePath), "utf8");
const readJson = (filePath) => JSON.parse(readText(filePath));

const BUILD_ID = "LOCAL_METADATA_ONLY_REMOTE_FRESHNESS_DISCLOSURE_CONTRACTS_20260615";
const TARGET = "local_metadata_only_remote_freshness_disclosure_contracts";
const BASELINE = "51a9986d45c153fdcd469c40b6c095a307978c9c";
const SCHEMA_ID = "lonewolf.codex_native.local_metadata_only_remote_freshness_disclosure.v1";
const REVIEW_NEXT = "START_LOCAL_METADATA_ONLY_REMOTE_FRESHNESS_DISCLOSURE_IMPLEMENTATION_REVIEW_PACKET";
const WAIT_OWNER = "WAIT_FOR_OWNER_REVIEW";
const STOP = "STOP_OWNER_REVIEW_REQUIRED";

const schema = readJson("schema/orchestration/codex_native_local_metadata_only_remote_freshness_disclosure.schema.json");
const validFixturePaths = [
  "tests/fixtures/codex-native-supervised-dry-run/local-metadata-only-remote-freshness-disclosure/valid/local_refs_match_head_disclosed.json",
  "tests/fixtures/codex-native-supervised-dry-run/local-metadata-only-remote-freshness-disclosure/valid/local_refs_diverged_owner_review_required.json",
  "tests/fixtures/codex-native-supervised-dry-run/local-metadata-only-remote-freshness-disclosure/valid/offline_metadata_snapshot_review_only.json"
];
const invalidFixtureExpectations = new Map([
  ["tests/fixtures/codex-native-supervised-dry-run/local-metadata-only-remote-freshness-disclosure/invalid/fetch_performed_true.json", "fetch performed"],
  ["tests/fixtures/codex-native-supervised-dry-run/local-metadata-only-remote-freshness-disclosure/invalid/pull_recommended.json", "pull recommended"],
  ["tests/fixtures/codex-native-supervised-dry-run/local-metadata-only-remote-freshness-disclosure/invalid/remote_claimed_fresh_without_fetch_approval.json", "live remote freshness"],
  ["tests/fixtures/codex-native-supervised-dry-run/local-metadata-only-remote-freshness-disclosure/invalid/missing_origin_master_ref.json", "missing origin master"],
  ["tests/fixtures/codex-native-supervised-dry-run/local-metadata-only-remote-freshness-disclosure/invalid/ahead_behind_mismatch_hidden.json", "ahead behind hidden"],
  ["tests/fixtures/codex-native-supervised-dry-run/local-metadata-only-remote-freshness-disclosure/invalid/runtime_or_queue_action_allowed.json", "forbidden runtime_execution_allowed"]
]);

const allowedNextActions = new Set(schema.properties.allowed_next_actions.items.enum);
const recommendedNextActions = new Set(schema.properties.recommended_next_action.enum);
const forbiddenFlagNames = schema.$defs.forbidden_action_flags.required;

function missingRequired(schemaNode, record) {
  return (schemaNode.required ?? []).filter((field) => !Object.hasOwn(record, field));
}

function unexpectedProperties(schemaNode, record) {
  const allowed = new Set(Object.keys(schemaNode.properties ?? {}));
  return Object.keys(record).filter((field) => !allowed.has(field));
}

function isSha1(value) {
  return typeof value === "string" && /^[A-Fa-f0-9]{40}$/.test(value);
}

function validateRecord(record) {
  const errors = [];
  for (const field of missingRequired(schema, record)) errors.push(`missing ${field}`);
  for (const field of unexpectedProperties(schema, record)) errors.push(`unexpected ${field}`);
  if (errors.length) return errors;

  if (record.schema !== SCHEMA_ID) errors.push("bad schema");
  if (record.build_id !== BUILD_ID) errors.push("bad build_id");
  if (record.target !== TARGET) errors.push("bad target");
  if (!["READY_FOR_OWNER_REVIEW", "OWNER_REVIEW_REQUIRED", STOP].includes(record.status)) errors.push("bad status");
  if (!["LOCAL_REFS_MATCH_HEAD", "LOCAL_REFS_DIVERGED", "OFFLINE_METADATA_SNAPSHOT"].includes(record.freshness_state)) errors.push("bad freshness state");
  if (record.current_stable_baseline !== BASELINE) errors.push("bad baseline");
  if (record.local_metadata_only !== true) errors.push("not local metadata only");

  const refs = record.local_refs;
  if (!refs || typeof refs !== "object") {
    errors.push("missing local refs");
  } else {
    for (const field of missingRequired(schema.$defs.local_refs, refs)) errors.push(`missing local refs ${field}`);
    if (!isSha1(refs.head)) errors.push("bad head");
    if (!isSha1(refs.origin_master)) errors.push("missing origin master");
    if (refs.origin_master_present !== true) errors.push("missing origin master");
    if (refs.origin_master_is_local_ref_only !== true) errors.push("origin master not local only");
    if (typeof refs.refs_match !== "boolean") errors.push("bad refs_match");
    if (!["local_git_metadata", "offline_local_snapshot"].includes(refs.snapshot_mode)) errors.push("bad snapshot mode");
  }

  const aheadBehind = record.ahead_behind;
  if (!aheadBehind || typeof aheadBehind !== "object") {
    errors.push("missing ahead behind");
  } else {
    for (const field of missingRequired(schema.$defs.ahead_behind, aheadBehind)) errors.push(`missing ahead behind ${field}`);
    if (!/^[0-9]+ \/ [0-9]+$/.test(aheadBehind.raw ?? "")) errors.push("bad ahead behind raw");
    if (!Number.isInteger(aheadBehind.ahead) || aheadBehind.ahead < 0) errors.push("bad ahead");
    if (!Number.isInteger(aheadBehind.behind) || aheadBehind.behind < 0) errors.push("bad behind");
    if (aheadBehind.raw !== `${aheadBehind.ahead} / ${aheadBehind.behind}`) errors.push("ahead behind raw mismatch");
    if (aheadBehind.disclosed !== true) errors.push("ahead behind hidden");
    if (aheadBehind.divergence_disclosed !== true) errors.push("ahead behind hidden");
    if (aheadBehind.mismatch_hidden !== false) errors.push("ahead behind hidden");
    const refsMatch = record.local_refs?.refs_match;
    const diverged = aheadBehind.ahead !== 0 || aheadBehind.behind !== 0 || refsMatch === false;
    if (diverged && record.status === "READY_FOR_OWNER_REVIEW" && record.freshness_state !== "OFFLINE_METADATA_SNAPSHOT") {
      errors.push("divergence ready without owner review");
    }
  }

  if (record.fetch_state?.fetch_performed !== false) errors.push("fetch performed");
  if (record.fetch_state?.fetch_explicitly_approved !== false) errors.push("fetch approved");
  if (record.fetch_state?.fetch_approval_reference !== null) errors.push("fetch approval reference present");
  if (record.pull_state?.pull_performed !== false) errors.push("pull performed");
  if (record.pull_state?.pull_recommended !== false) errors.push("pull recommended");

  const remote = record.remote_freshness_claim;
  if (remote?.claims_live_remote_freshness !== false) errors.push("live remote freshness");
  if (remote?.remote_truth_guaranteed !== false) errors.push("live remote freshness");
  if (remote?.local_origin_master_treated_as_live_remote_truth !== false) errors.push("live remote freshness");

  const disclosure = record.disclosure;
  for (const field of schema.$defs.disclosure.required) {
    if (disclosure?.[field] !== true) errors.push(`missing disclosure ${field}`);
  }

  if (record.owner_review?.owner_review_required !== true) errors.push("owner review not required");
  if (record.owner_review?.automatic_go_allowed !== false) errors.push("automatic go allowed");
  if (typeof record.owner_review?.owner_review_reason !== "string" || record.owner_review.owner_review_reason.length === 0) {
    errors.push("missing owner review reason");
  }

  const next = record.next_prompt_readiness;
  if (!["implementation_review_packet_only", "owner_review_only"].includes(next?.next_prompt_kind)) errors.push("bad next prompt kind");
  if (next?.next_prompt_recommends_owner_gated_packet_only !== true) errors.push("next prompt not owner gated");
  if (next?.automatic_continuation_allowed !== false) errors.push("automatic continuation allowed");
  if (next?.ready_is_go !== false) errors.push("READY is GO");
  if (next?.observed_safe_no_action_is_go !== false) errors.push("OBSERVED_SAFE_NO_ACTION is GO");

  if (!Array.isArray(record.allowed_next_actions) || record.allowed_next_actions.length === 0) {
    errors.push("missing allowed next actions");
  } else {
    for (const action of record.allowed_next_actions) {
      if (!allowedNextActions.has(action)) errors.push(`bad next action ${action}`);
      if (/fetch|pull|push|deploy|runtime|queue|worker|cloud|api|billing|trading|cleanup|reset|restore|stash|rebase/i.test(action)) {
        errors.push(`forbidden next action ${action}`);
      }
    }
  }
  if (!recommendedNextActions.has(record.recommended_next_action)) errors.push("bad recommended next action");

  const flags = record.forbidden_action_flags;
  for (const flag of forbiddenFlagNames) {
    if (flags?.[flag] !== false) errors.push(`forbidden ${flag}`);
  }

  const invariants = record.safety_invariants;
  for (const field of schema.$defs.safety_invariants.required) {
    if (invariants?.[field] !== true) errors.push(`missing invariant ${field}`);
  }
  if (typeof record.human_review_one_point !== "string" || record.human_review_one_point.length === 0) {
    errors.push("missing human_review_one_point");
  }

  return errors;
}

test("schema pins build id, target, local metadata fields, and false-only forbidden flags", () => {
  assert.equal(schema.$comment, `BUILD_ID: ${BUILD_ID}`);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.schema.const, SCHEMA_ID);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.current_stable_baseline.const, BASELINE);
  assert.equal(schema.properties.local_metadata_only.const, true);
  assert.equal(schema.$defs.local_refs.properties.origin_master_is_local_ref_only.const, true);
  assert.equal(schema.$defs.fetch_state.properties.fetch_performed.const, false);
  assert.equal(schema.$defs.pull_state.properties.pull_recommended.const, false);
  assert.equal(schema.$defs.remote_freshness_claim.properties.claims_live_remote_freshness.const, false);
  assert.equal(schema.$defs.next_prompt_readiness.properties.ready_is_go.const, false);
  assert.equal(schema.$defs.next_prompt_readiness.properties.observed_safe_no_action_is_go.const, false);
  for (const flag of forbiddenFlagNames) {
    assert.equal(schema.$defs.forbidden_action_flags.properties[flag].const, false, `${flag} must be const false`);
  }
});

test("valid local metadata disclosure fixtures pass", () => {
  for (const fixturePath of validFixturePaths) {
    const record = readJson(fixturePath);
    assert.equal(record.build_id, BUILD_ID, `${fixturePath} build_id`);
    assert.deepEqual(validateRecord(record), [], fixturePath);
    assert.equal(record.local_metadata_only, true, `${fixturePath} must disclose local metadata only`);
    assert.equal(record.local_refs.origin_master_is_local_ref_only, true, `${fixturePath} must disclose origin/master as local`);
    assert.equal(record.remote_freshness_claim.claims_live_remote_freshness, false, `${fixturePath} must not claim live remote freshness`);
    assert.equal(record.fetch_state.fetch_performed, false, `${fixturePath} must not fetch`);
    assert.equal(record.pull_state.pull_performed, false, `${fixturePath} must not pull`);
    assert.equal(record.next_prompt_readiness.ready_is_go, false, `${fixturePath} READY is not GO`);
    assert.equal(record.next_prompt_readiness.observed_safe_no_action_is_go, false, `${fixturePath} OBSERVED_SAFE_NO_ACTION is not GO`);
  }
});

test("invalid fixture matrix fails closed for required safety reasons", () => {
  for (const [fixturePath, expectedError] of invalidFixtureExpectations) {
    const record = readJson(fixturePath);
    assert.equal(record.build_id, BUILD_ID, `${fixturePath} build_id`);
    const errors = validateRecord(record);
    assert.ok(errors.length > 0, `${fixturePath} must fail`);
    assert.ok(errors.some((error) => error.includes(expectedError)), `${fixturePath} expected ${expectedError}, got ${errors.join(", ")}`);
  }
});

test("docs and fixtures keep remote freshness owner-gated and static only", () => {
  const doc = readText("docs/orchestration/codex_native_local_metadata_only_remote_freshness_disclosure_contract.md");
  assert.ok(doc.startsWith(`<!-- BUILD_ID: ${BUILD_ID} -->`));
  assert.match(doc, /local metadata only/i);
  assert.match(doc, /not guaranteed live remote truth/i);
  assert.match(doc, /READY is not\s+GO/i);
  assert.match(doc, /OBSERVED_SAFE_NO_ACTION.*not GO/i);
  assert.match(doc, /no fetch\/pull\/deploy\/runtime\/Queue\/cloud\/API\/billing\/auth\/trading mutation/i);
  assert.doesNotMatch(doc, /fetch_performed`?\s+equal to true/i);
  assert.doesNotMatch(doc, /queue_mutation_allowed`?\s+equal to true/i);

  for (const fixturePath of validFixturePaths) {
    const text = readText(fixturePath);
    assert.doesNotMatch(text, /"fetch_performed"\s*:\s*true/);
    assert.doesNotMatch(text, /"pull_recommended"\s*:\s*true/);
    assert.doesNotMatch(text, /"claims_live_remote_freshness"\s*:\s*true/);
    assert.doesNotMatch(text, /"runtime_execution_allowed"\s*:\s*true/);
    assert.doesNotMatch(text, /"queue_mutation_allowed"\s*:\s*true/);
  }
});

console.log("codex_native_local_metadata_only_remote_freshness_disclosure_contract: ok");
