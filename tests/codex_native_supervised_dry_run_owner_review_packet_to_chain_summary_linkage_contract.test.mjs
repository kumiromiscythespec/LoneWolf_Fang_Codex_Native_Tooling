// BUILD_ID: SUPERVISED_DRY_RUN_OWNER_REVIEW_PACKET_TO_CHAIN_SUMMARY_LINKAGE_CONTRACTS_20260615

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = join(__dirname, '..');

const BUILD_ID = 'SUPERVISED_DRY_RUN_OWNER_REVIEW_PACKET_TO_CHAIN_SUMMARY_LINKAGE_CONTRACTS_20260615';
const SCHEMA_ID =
  'lonewolf.codex_native.supervised_dry_run_owner_review_packet_to_chain_summary_linkage.v1';
const TARGET = 'supervised_dry_run_owner_review_packet_to_chain_summary_linkage_contracts';
const STABLE_BASELINE = '1c62c1c0bc3ff69c463945becc2c2872a0bd38a2';
const TARGET_REPO = 'C:\\LoneWolf_Fang_Project\\repos\\core\\LoneWolf_Fang_Codex_Native_Tooling';
const NEXT_REVIEW =
  'START_SUPERVISED_DRY_RUN_OWNER_REVIEW_PACKET_TO_CHAIN_SUMMARY_LINKAGE_CONTRACTS_IMPLEMENTATION_REVIEW_PACKET';
const STOP_OWNER_REVIEW_REQUIRED = 'STOP_OWNER_REVIEW_REQUIRED';
const APPROVAL_PACKET_PATH =
  'C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data\\codex_native_supervised_dry_run_owner_review_packet_to_chain_summary_linkage_contracts_implementation_approval_packet_20260616_000443.zip';
const APPROVAL_PACKET_SHA256 =
  'DDD4D9D9212707A7963A40B26DA2E56825065BFF1DF28850E5C2513F9711DBC1';
const PLANNING_PACKET_PATH =
  'C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data\\codex_native_next_safe_parallel_wave_after_supervised_dry_run_audit_bundle_to_owner_review_packet_linkage_contracts_planning_packet_text_repair_20260615_235456.zip';
const PLANNING_PACKET_SHA256 =
  '59E6BDD94504C8865535E80EA6AA94BC64A3D081DA601C40A24E4DF9184CCBCE';
const OWNER_REVIEW_PACKET_PATH =
  'C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data\\future_static_supervised_dry_run_owner_review_packet.zip';
const CHAIN_SUMMARY_CONTEXT_PATH =
  'C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data\\future_static_supervised_dry_run_chain_summary_context_packet.zip';
const OWNER_REVIEW_PACKET_SHA256 = 'C'.repeat(64);
const CHAIN_SUMMARY_CONTEXT_SHA256 = 'D'.repeat(64);

const docPath = join(
  repoRoot,
  'docs',
  'orchestration',
  'codex_native_supervised_dry_run_owner_review_packet_to_chain_summary_linkage_contract.md',
);
const schemaPath = join(
  repoRoot,
  'schema',
  'orchestration',
  'codex_native_supervised_dry_run_owner_review_packet_to_chain_summary_linkage.schema.json',
);
const fixtureRoot = join(
  repoRoot,
  'tests',
  'fixtures',
  'codex-native-supervised-dry-run',
  'owner-review-packet-to-chain-summary-linkage',
);

const allowedRepoFiles = [
  'docs/orchestration/codex_native_supervised_dry_run_owner_review_packet_to_chain_summary_linkage_contract.md',
  'schema/orchestration/codex_native_supervised_dry_run_owner_review_packet_to_chain_summary_linkage.schema.json',
  'tests/codex_native_supervised_dry_run_owner_review_packet_to_chain_summary_linkage_contract.test.mjs',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/valid/linkage-not-started.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/valid/linkage-blocked-owner-review-required.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/valid/linkage-blocked-missing-owner-review-packet.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/valid/linkage-blocked-unsafe-owner-review-packet.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/valid/linkage-blocked-missing-chain-summary-context.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/valid/linkage-draft-ready.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/valid/linkage-hash-bound-evidence-assembled.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/valid/linkage-ready-for-human-review.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/valid/linkage-failed-closed.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/valid/linkage-stop-owner-review-required.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/forbidden-execution-actions-true.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/chain-summary-creation-true.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/owner-review-submission-true.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/worker-queue-cloud-mutation-true.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/private-openai-api-true.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/auto-approval-true.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/missing-owner-review-packet-reference.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/missing-chain-summary-context.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/mismatched-reference-hash.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/stale-baseline-accepted.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/ready-treated-as-go.json',
  'tests/fixtures/codex-native-supervised-dry-run/owner-review-packet-to-chain-summary-linkage/invalid/missing-human-review-or-fail-closed-reason.json',
];

const allowedStatuses = [
  'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_NOT_STARTED',
  'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_BLOCKED_OWNER_REVIEW_REQUIRED',
  'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_BLOCKED_MISSING_OWNER_REVIEW_PACKET',
  'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_BLOCKED_OWNER_REVIEW_PACKET_UNSAFE',
  'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_BLOCKED_MISSING_CHAIN_SUMMARY_CONTEXT',
  'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_DRAFT_READY',
  'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_HASH_BOUND_EVIDENCE_ASSEMBLED',
  'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_READY_FOR_HUMAN_REVIEW',
  'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_FAILED_CLOSED',
  STOP_OWNER_REVIEW_REQUIRED,
];

const forbiddenFlags = [
  'runtime_execution_requested',
  'runtime_execution_performed',
  'live_observation_requested',
  'live_observation_performed',
  'audit_bundle_creation_requested',
  'audit_bundle_creation_performed',
  'owner_review_submission_requested',
  'owner_review_submission_performed',
  'chain_summary_creation_requested',
  'chain_summary_creation_performed',
  'worker_launch_requested',
  'queue_mutation_requested',
  'cloud_api_billing_auth_trading_mutation_requested',
  'private_api_requested',
  'openai_api_requested',
  'auto_approval_requested',
  'auto_go_signal',
];

const notGoFlags = [
  'owner_review_to_chain_summary_linkage_not_runtime_go',
  'linkage_not_auto_approval',
  'linkage_not_executor',
  'linkage_not_live_observer',
  'linkage_does_not_create_audit_bundles',
  'linkage_does_not_submit_owner_review_packets',
  'linkage_does_not_create_chain_summaries',
  'linkage_does_not_launch_workers',
  'linkage_does_not_mutate_queues_cloud_api_billing_auth_trading',
  'linkage_does_not_call_private_or_openai_apis',
  'linkage_cannot_bypass_safety_gates',
  'linkage_cannot_bypass_owner_gates',
  'linkage_cannot_bypass_stop_owner_review_required',
  'ready_not_go',
  'matched_not_go',
  'observed_safe_no_action_not_go',
  'owner_review_packet_presence_not_enough_to_execute_observe_create_bundles_submit_create_summaries_continue',
  'chain_summary_context_presence_not_enough_to_execute_observe_create_bundles_submit_create_summaries_continue',
  'hash_binding_not_execution_approval',
  'human_review_mandatory_before_later_gated_action',
];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function fixturePath(kind, filename) {
  return join(fixtureRoot, kind, filename);
}

function allFalse(keys) {
  return Object.fromEntries(keys.map((key) => [key, false]));
}

function allTrue(keys) {
  return Object.fromEntries(keys.map((key) => [key, true]));
}

function sourceSummary({
  present = true,
  safe = true,
  expectedSha256,
  observedSha256 = expectedSha256,
  status = 'SAFE_STATIC_EVIDENCE_REFERENCE',
}) {
  return {
    reference_present: present,
    reference_safe_for_linkage: safe,
    expected_sha256: expectedSha256,
    observed_sha256: present ? observedSha256 : null,
    sha256_matches_expected: present && observedSha256 === expectedSha256,
    status,
    evidence_only: true,
    static_reference_only: true,
    presence_is_not_go: true,
  };
}

function sourceReference({ path, sha256, present = true, safe = true }) {
  return {
    path: present ? path : null,
    sha256: present ? sha256 : null,
    present,
    safe_for_linkage: safe,
    static_reference_only: true,
    presence_is_not_go: true,
  };
}

function buildLinkageRecord(config = {}) {
  const ownerPresent =
    config.owner_review_packet_present === undefined ? true : config.owner_review_packet_present;
  const ownerSafe =
    config.owner_review_packet_safe === undefined ? true : config.owner_review_packet_safe;
  const ownerObservedSha = config.owner_review_packet_sha256_observed || OWNER_REVIEW_PACKET_SHA256;
  const chainPresent =
    config.chain_summary_context_present === undefined ? true : config.chain_summary_context_present;
  const chainSafe =
    config.chain_summary_context_safe === undefined ? true : config.chain_summary_context_safe;
  const chainObservedSha =
    config.chain_summary_context_sha256_observed || CHAIN_SUMMARY_CONTEXT_SHA256;
  const hashesMatchExpected =
    ownerPresent &&
    ownerSafe &&
    ownerObservedSha === OWNER_REVIEW_PACKET_SHA256 &&
    chainPresent &&
    chainSafe &&
    chainObservedSha === CHAIN_SUMMARY_CONTEXT_SHA256;
  const hashBindingComplete = config.hash_binding_complete ?? hashesMatchExpected;
  const linkageStatus =
    config.linkage_status || 'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_DRAFT_READY';
  const blockedReason = config.blocked_reason || 'none';
  const failedClosed =
    config.stop_owner_review_required === true ||
    linkageStatus.includes('BLOCKED') ||
    linkageStatus === 'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_FAILED_CLOSED' ||
    linkageStatus === STOP_OWNER_REVIEW_REQUIRED;

  return {
    schema: SCHEMA_ID,
    build_id: BUILD_ID,
    linkage_id: 'owner-review-to-chain-summary-linkage-' + (config.case_id || 'synthetic'),
    linkage_created_at_utc: '2026-06-15T00:00:00Z',
    target: TARGET,
    target_repo: TARGET_REPO,
    branch: 'master',
    stable_baseline: config.stable_baseline || STABLE_BASELINE,
    local_origin_master: config.local_origin_master || STABLE_BASELINE,
    ahead_behind: '0 0',
    source_owner_review_packet_commit: STABLE_BASELINE,
    source_chain_summary_context_commit: STABLE_BASELINE,
    implementation_approval_packet: {
      path: APPROVAL_PACKET_PATH,
      sha256_expected: APPROVAL_PACKET_SHA256,
      sha256_observed: APPROVAL_PACKET_SHA256,
      sha256_matches_expected: true,
      evidence_only: true,
      contains_no_runtime_artifact: true,
    },
    planning_packet: {
      path: PLANNING_PACKET_PATH,
      sha256_expected: PLANNING_PACKET_SHA256,
      sha256_observed: PLANNING_PACKET_SHA256,
      sha256_matches_expected: true,
      evidence_only: true,
      contains_no_runtime_artifact: true,
    },
    owner_review_packet_contract_summary: {
      contract_name: 'supervised_dry_run_owner_review_packet_contracts',
      source_commit: STABLE_BASELINE,
      reference_present: ownerPresent,
      artifact_path: ownerPresent ? OWNER_REVIEW_PACKET_PATH : null,
      artifact_sha256: ownerPresent ? ownerObservedSha : null,
      sha256_matches_expected: ownerPresent && ownerObservedSha === OWNER_REVIEW_PACKET_SHA256,
      safe_for_linkage: ownerSafe,
      evidence_only: true,
      static_reference_only: true,
      presence_is_not_go: true,
    },
    chain_summary_context_summary: {
      contract_name: 'supervised_dry_run_chain_summary_context_contracts',
      source_commit: STABLE_BASELINE,
      reference_present: chainPresent,
      artifact_path: chainPresent ? CHAIN_SUMMARY_CONTEXT_PATH : null,
      artifact_sha256: chainPresent ? chainObservedSha : null,
      sha256_matches_expected: chainPresent && chainObservedSha === CHAIN_SUMMARY_CONTEXT_SHA256,
      safe_for_linkage: chainSafe,
      evidence_only: true,
      static_reference_only: true,
      presence_is_not_go: true,
    },
    source_evidence_references: {
      owner_review_packet: {
        present: ownerPresent,
        artifact_path: ownerPresent ? OWNER_REVIEW_PACKET_PATH : null,
        artifact_sha256: ownerPresent ? ownerObservedSha : null,
        sha256_matches_expected: ownerPresent && ownerObservedSha === OWNER_REVIEW_PACKET_SHA256,
        safe_for_linkage: ownerSafe,
        static_reference_only: true,
      },
      chain_summary_context: {
        present: chainPresent,
        artifact_path: chainPresent ? CHAIN_SUMMARY_CONTEXT_PATH : null,
        artifact_sha256: chainPresent ? chainObservedSha : null,
        sha256_matches_expected: chainPresent && chainObservedSha === CHAIN_SUMMARY_CONTEXT_SHA256,
        safe_for_linkage: chainSafe,
        static_reference_only: true,
      },
    },
    hash_binding_summary: {
      owner_review_packet_sha256: ownerPresent ? ownerObservedSha : null,
      chain_summary_context_sha256: chainPresent ? chainObservedSha : null,
      hashes_match_expected: config.hashes_match_expected ?? hashesMatchExpected,
      hash_binding_complete: hashBindingComplete,
      execution_approval: false,
      owner_review_submission_approval: false,
      chain_summary_creation_approval: false,
      queue_mutation_approval: false,
    },
    safety_boundary_summary: {
      static_metadata_only: true,
      human_review_required: true,
      runtime_go_allowed: false,
      queue_mutation_allowed: false,
      worker_launch_allowed: false,
      owner_review_submission_allowed: false,
      audit_bundle_creation_allowed: false,
      chain_summary_creation_allowed: false,
      private_or_openai_api_allowed: false,
    },
    linkage_status: linkageStatus,
    blocked_reason: blockedReason,
    human_review_one_point:
      config.human_review_one_point ||
      'Confirm that this static linkage contract is sufficient before any later owner-gated chain summary creation lane.',
    recommended_next_action: config.recommended_next_action || NEXT_REVIEW,
    stop_owner_review_required: config.stop_owner_review_required ?? false,
    forbidden_actions_confirmation: allFalse(forbiddenFlags),
    blocker_matrix: [
      {
        blocker: config.blocker || 'none',
        status: config.blocker_status || 'PASS',
        resolution: 'static contract only; no runtime action',
      },
    ],
    fail_closed_result: {
      failed_closed: failedClosed,
      reason: failedClosed ? blockedReason : 'none',
      owner_review_required: failedClosed || linkageStatus === 'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_READY_FOR_HUMAN_REVIEW',
    },
    safety_invariants: [
      'no runtime execution',
      'no live observation',
      'no audit bundle creation',
      'no owner review packet submission',
      'no chain summary creation',
      'no worker launch',
      'no queue mutation',
      'no cloud mutation',
      'no private api',
      'no openai api',
      'no billing mutation',
      'no trading mutation',
      'ready is not go',
      'human review required',
    ],
    not_go_assertions: allTrue(notGoFlags),
  };
}

function setPath(object, dottedPath, value) {
  const parts = dottedPath.split('.');
  let cursor = object;
  while (parts.length > 1) {
    const part = parts.shift();
    if (!(part in cursor) || cursor[part] === null || typeof cursor[part] !== 'object') {
      cursor[part] = {};
    }
    cursor = cursor[part];
  }
  const last = parts[0];
  if (value === '__DELETE__') {
    delete cursor[last];
  } else {
    cursor[last] = value;
  }
}

function validateArtifactEvidence(record, errors) {
  if (record.implementation_approval_packet.path !== APPROVAL_PACKET_PATH) {
    errors.push('implementation_approval_packet.path');
  }
  if (record.implementation_approval_packet.sha256_observed !== APPROVAL_PACKET_SHA256) {
    errors.push('implementation_approval_packet.sha256');
  }
  if (record.implementation_approval_packet.evidence_only !== true) {
    errors.push('implementation_approval_packet.evidence_only');
  }
  if (record.planning_packet.path !== PLANNING_PACKET_PATH) {
    errors.push('planning_packet.path');
  }
  if (record.planning_packet.sha256_observed !== PLANNING_PACKET_SHA256) {
    errors.push('planning_packet.sha256');
  }
  if (record.planning_packet.evidence_only !== true) {
    errors.push('planning_packet.evidence_only');
  }
}

function validateSourceSummary(label, summary, errors) {
  if (summary.evidence_only !== true) {
    errors.push(label + '.evidence_only');
  }
  if (summary.static_reference_only !== true) {
    errors.push(label + '.static_reference_only');
  }
  if (summary.presence_is_not_go !== true) {
    errors.push(label + '.presence_is_not_go');
  }
  if (summary.reference_present === true && !summary.artifact_sha256) {
    errors.push(label + '.artifact_sha256');
  }
  if (summary.reference_present === true && summary.sha256_matches_expected !== true) {
    errors.push(label + '.sha256_matches_expected');
  }
}

function validateRecord(record, schema) {
  const errors = [];
  const required = schema.required || [];
  const topLevel = new Set(Object.keys(schema.properties));

  for (const key of required) {
    if (!(key in record)) {
      errors.push('missing.' + key);
    }
  }

  for (const key of Object.keys(record)) {
    if (!topLevel.has(key)) {
      errors.push('unknown.' + key);
    }
  }

  if (record.schema !== SCHEMA_ID) errors.push('schema');
  if (record.build_id !== BUILD_ID) errors.push('build_id');
  if (record.target !== TARGET) errors.push('target');
  if (record.target_repo !== TARGET_REPO) errors.push('target_repo');
  if (record.stable_baseline !== STABLE_BASELINE) errors.push('stable_baseline');
  if (record.branch !== 'master') errors.push('branch');
  if (record.local_origin_master !== STABLE_BASELINE) errors.push('local_origin_master');
  if (record.ahead_behind !== '0 0') errors.push('ahead_behind');
  if (record.source_owner_review_packet_commit !== STABLE_BASELINE) {
    errors.push('source_owner_review_packet_commit');
  }
  if (record.source_chain_summary_context_commit !== STABLE_BASELINE) {
    errors.push('source_chain_summary_context_commit');
  }
  if (!allowedStatuses.includes(record.linkage_status)) errors.push('linkage_status');

  validateArtifactEvidence(record, errors);

  validateSourceSummary('owner_review_packet_contract_summary', record.owner_review_packet_contract_summary, errors);
  validateSourceSummary('chain_summary_context_summary', record.chain_summary_context_summary, errors);

  for (const [label, reference] of Object.entries(record.source_evidence_references)) {
    if (reference.static_reference_only !== true) {
      errors.push('source_evidence_references.' + label + '.static_reference_only');
    }
    if (reference.present === true && (!reference.artifact_path || !reference.artifact_sha256)) {
      errors.push('source_evidence_references.' + label + '.path_or_sha256');
    }
  }

  if (
    record.source_evidence_references.owner_review_packet.present !==
    record.owner_review_packet_contract_summary.reference_present
  ) {
    errors.push('owner_review_packet.present alignment');
  }
  if (
    record.source_evidence_references.chain_summary_context.present !==
    record.chain_summary_context_summary.reference_present
  ) {
    errors.push('chain_summary_context.present alignment');
  }

  const ownerSummary = record.owner_review_packet_contract_summary;
  const chainSummary = record.chain_summary_context_summary;
  const ownerReady =
    ownerSummary.reference_present &&
    ownerSummary.safe_for_linkage &&
    ownerSummary.sha256_matches_expected;
  const chainReady =
    chainSummary.reference_present &&
    chainSummary.safe_for_linkage &&
    chainSummary.sha256_matches_expected;

  if (
    record.linkage_status === 'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_BLOCKED_MISSING_OWNER_REVIEW_PACKET' &&
    ownerSummary.reference_present
  ) {
    errors.push('linkage_status.owner_review_packet_missing_but_present');
  }
  if (
    record.linkage_status === 'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_BLOCKED_OWNER_REVIEW_PACKET_UNSAFE' &&
    ownerSummary.safe_for_linkage
  ) {
    errors.push('linkage_status.owner_review_packet_unsafe_but_safe');
  }
  if (
    record.linkage_status === 'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_BLOCKED_MISSING_CHAIN_SUMMARY_CONTEXT' &&
    chainSummary.reference_present
  ) {
    errors.push('linkage_status.chain_summary_context_missing_but_present');
  }
  if (
    record.linkage_status === 'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_DRAFT_READY' &&
    (!ownerReady || !chainReady)
  ) {
    errors.push('linkage_status.draft_ready_requires_safe_references');
  }
  if (
    [
      'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_HASH_BOUND_EVIDENCE_ASSEMBLED',
      'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_READY_FOR_HUMAN_REVIEW',
    ].includes(record.linkage_status) &&
    record.hash_binding_summary.hash_binding_complete !== true
  ) {
    errors.push('hash_binding_summary.hash_binding_complete');
  }
  if (record.linkage_status === 'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_READY_FOR_HUMAN_REVIEW') {
    if (!ownerSummary.reference_present) {
      errors.push('ready without owner review packet');
    }
    if (!chainSummary.reference_present) {
      errors.push('ready without chain summary context');
    }
    if (
      ownerSummary.sha256_matches_expected !== true ||
      chainSummary.sha256_matches_expected !== true ||
      record.hash_binding_summary.hashes_match_expected !== true
    ) {
      errors.push('ready without hash match');
    }
  }

  for (const flag of forbiddenFlags) {
    if (record.forbidden_actions_confirmation[flag] !== false) {
      errors.push('forbidden_actions_confirmation.' + flag);
    }
  }
  for (const flag of notGoFlags) {
    if (record.not_go_assertions[flag] !== true) {
      errors.push('not_go_assertions.' + flag);
    }
  }

  if (record.safety_boundary_summary.static_metadata_only !== true) {
    errors.push('safety_boundary_summary.static_metadata_only');
  }
  if (record.safety_boundary_summary.human_review_required !== true) {
    errors.push('safety_boundary_summary.human_review_required');
  }
  for (const key of [
    'runtime_go_allowed',
    'queue_mutation_allowed',
    'worker_launch_allowed',
    'owner_review_submission_allowed',
    'audit_bundle_creation_allowed',
    'chain_summary_creation_allowed',
    'private_or_openai_api_allowed',
  ]) {
    if (record.safety_boundary_summary[key] !== false) {
      errors.push('safety_boundary_summary.' + key);
    }
  }

  for (const key of [
    'execution_approval',
    'owner_review_submission_approval',
    'chain_summary_creation_approval',
    'queue_mutation_approval',
  ]) {
    if (record.hash_binding_summary[key] !== false) {
      errors.push('hash_binding_summary.' + key);
    }
  }

  if (
    typeof record.human_review_one_point !== 'string' ||
    record.human_review_one_point.length < 20
  ) {
    errors.push('human_review_one_point');
  }
  if (
    record.linkage_status === 'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_FAILED_CLOSED' &&
    record.blocked_reason === 'none'
  ) {
    errors.push('blocked_reason');
  }
  if (
    record.fail_closed_result.failed_closed === true &&
    (!record.fail_closed_result.reason || record.fail_closed_result.reason === 'none')
  ) {
    errors.push('fail_closed_result.reason');
  }
  if (![NEXT_REVIEW, STOP_OWNER_REVIEW_REQUIRED].includes(record.recommended_next_action)) {
    errors.push('recommended_next_action');
  }

  return errors;
}

test('contract files pin the build, static scope, and next review action', () => {
  const docText = readFileSync(docPath, 'utf8');
  const schemaText = readFileSync(schemaPath, 'utf8');
  const testText = readFileSync(fileURLToPath(import.meta.url), 'utf8');

  for (const text of [docText, schemaText, testText]) {
    assert.match(text, new RegExp(BUILD_ID));
    assert.match(text, new RegExp(NEXT_REVIEW));
  }

  assert.match(docText, /docs\/schema\/tests\/fixtures-only/i);
  assert.match(docText, /not runtime GO/i);
  assert.match(docText, /does not create a chain summary|create chain summaries/i);
  assert.match(docText, /submit review output|submit owner review packets/i);
});

test('allowlist remains exactly the approved twenty-five files', () => {
  assert.equal(allowedRepoFiles.length, 25);
  assert.deepEqual([...new Set(allowedRepoFiles)].sort(), [...allowedRepoFiles].sort());
  for (const repoFile of allowedRepoFiles) {
    assert(!repoFile.includes('\\'), 'allowlist path must be repository relative: ' + repoFile);
  }
  assert(allowedRepoFiles.every((repoFile) => repoFile.endsWith('.md') || repoFile.endsWith('.json') || repoFile.endsWith('.mjs')));
});

test('schema rejects unknown top-level fields and pins fail-closed controls', () => {
  const schema = readJson(schemaPath);
  assert.equal(schema.schema_id, SCHEMA_ID);
  assert.equal(schema.build_id, BUILD_ID);
  assert.equal(schema.additional_properties_allowed, false);
  assert.equal(schema.properties.build_id.const, BUILD_ID);
  assert.equal(schema.properties.target.const, TARGET);
  assert.equal(schema.properties.stable_baseline.const, STABLE_BASELINE);
  assert.deepEqual(schema.properties.linkage_status.enum, allowedStatuses);

  for (const flag of forbiddenFlags) {
    assert.equal(schema.definitions.forbidden_actions_confirmation.properties[flag].const, false);
  }
  for (const flag of notGoFlags) {
    assert.equal(schema.definitions.not_go_assertions.properties[flag].const, true);
  }

  const record = buildLinkageRecord({
    linkage_status: 'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_DRAFT_READY',
  });
  record.unexpected = true;
  assert(validateRecord(record, schema).includes('unknown.unexpected'));
});

test('valid fixtures produce safe static linkage records', () => {
  const schema = readJson(schemaPath);
  const validFixtures = [
    'linkage-not-started.json',
    'linkage-blocked-owner-review-required.json',
    'linkage-blocked-missing-owner-review-packet.json',
    'linkage-blocked-unsafe-owner-review-packet.json',
    'linkage-blocked-missing-chain-summary-context.json',
    'linkage-draft-ready.json',
    'linkage-hash-bound-evidence-assembled.json',
    'linkage-ready-for-human-review.json',
    'linkage-failed-closed.json',
    'linkage-stop-owner-review-required.json',
  ];

  for (const filename of validFixtures) {
    const config = readJson(fixturePath('valid', filename));
    const record = buildLinkageRecord(config);
    const errors = validateRecord(record, schema);
    assert.deepEqual(errors, [], filename);
  }
});

test('invalid fixtures fail closed for the intended reason', () => {
  const schema = readJson(schemaPath);
  const invalidFixtures = [
    'forbidden-execution-actions-true.json',
    'chain-summary-creation-true.json',
    'owner-review-submission-true.json',
    'worker-queue-cloud-mutation-true.json',
    'private-openai-api-true.json',
    'auto-approval-true.json',
    'missing-owner-review-packet-reference.json',
    'missing-chain-summary-context.json',
    'mismatched-reference-hash.json',
    'stale-baseline-accepted.json',
    'ready-treated-as-go.json',
    'missing-human-review-or-fail-closed-reason.json',
  ];

  for (const filename of invalidFixtures) {
    const fixture = readJson(fixturePath('invalid', filename));
    const baseConfig = readJson(fixturePath('valid', fixture.base_fixture));
    const record = buildLinkageRecord(baseConfig);
    for (const mutation of fixture.mutations || []) {
      setPath(record, mutation.path, mutation.value);
    }
    const errors = validateRecord(record, schema);
    assert(errors.length > 0, filename);
    for (const expectedError of fixture.expected_errors) {
      assert(
        errors.some((error) => error.includes(expectedError)),
        filename + ' expected ' + expectedError + ' in ' + JSON.stringify(errors),
      );
    }
  }
});

test('contract text and fixtures do not authorize runtime, queue, or automatic continuation', () => {
  const files = allowedRepoFiles.map((repoFile) => join(repoRoot, ...repoFile.split('/')));
  const forbiddenPatterns = [
    /\bPAPER\b/,
    /\bLIVE\b/,
    /\border\b/i,
    /\bcancel\b/i,
    /\bfetch_balance\b/i,
    /\bwrangler\b/i,
    /\bopenai\b\s*\./i,
    /\bAUTO[-_ ]?APPROVE\b/i,
    /\bAUTO[-_ ]?GO\b/i,
  ];

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const pattern of forbiddenPatterns) {
      assert.equal(pattern.test(text), false, relative(repoRoot, file) + ' matched ' + pattern);
    }
  }
});

test('ready-like linkage states remain evidence only and cannot become GO', () => {
  const schema = readJson(schemaPath);
  for (const status of [
    'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_DRAFT_READY',
    'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_HASH_BOUND_EVIDENCE_ASSEMBLED',
    'OWNER_REVIEW_TO_CHAIN_SUMMARY_LINKAGE_READY_FOR_HUMAN_REVIEW',
  ]) {
    const record = buildLinkageRecord({ linkage_status: status, hash_binding_complete: true });
    assert.equal(record.forbidden_actions_confirmation.auto_go_signal, false);
    assert.equal(record.not_go_assertions.ready_not_go, true);
    assert.equal(record.not_go_assertions.matched_not_go, true);
    assert.equal(record.not_go_assertions.observed_safe_no_action_not_go, true);
    assert.equal(record.recommended_next_action, NEXT_REVIEW);
    assert.deepEqual(validateRecord(record, schema), []);
  }
});
