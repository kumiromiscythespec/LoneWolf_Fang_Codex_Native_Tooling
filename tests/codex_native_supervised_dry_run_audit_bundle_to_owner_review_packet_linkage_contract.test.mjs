// BUILD_ID: SUPERVISED_DRY_RUN_AUDIT_BUNDLE_TO_OWNER_REVIEW_PACKET_LINKAGE_CONTRACTS_20260615

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const repoRoot = path.resolve(currentDir, '..');

const BUILD_ID = 'SUPERVISED_DRY_RUN_AUDIT_BUNDLE_TO_OWNER_REVIEW_PACKET_LINKAGE_CONTRACTS_20260615';
const SCHEMA_ID = 'lonewolf.codex_native.supervised_dry_run_audit_bundle_to_owner_review_packet_linkage.v1';
const TARGET = 'supervised_dry_run_audit_bundle_to_owner_review_packet_linkage_contracts';
const STABLE_BASELINE = 'e520b817508a391a5c046cb80dbe009fea54d47e';
const TARGET_REPO = 'C:\\LoneWolf_Fang_Project\\repos\\core\\LoneWolf_Fang_Codex_Native_Tooling';
const NEXT_REVIEW = 'START_SUPERVISED_DRY_RUN_AUDIT_BUNDLE_TO_OWNER_REVIEW_PACKET_LINKAGE_CONTRACTS_IMPLEMENTATION_REVIEW_PACKET';
const STOP_OWNER_REVIEW_REQUIRED = 'STOP_OWNER_REVIEW_REQUIRED';
const APPROVAL_PACKET_PATH = 'C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data\\codex_native_supervised_dry_run_audit_bundle_to_owner_review_packet_linkage_contracts_implementation_approval_packet_20260615_222444.zip';
const APPROVAL_PACKET_SHA256 = 'DCC1BAFAD1819A9C7128D851EA4E44656CB08BEC958EC83E37E1340D7AC1AB47';
const PLANNING_PACKET_PATH = 'C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data\\codex_native_next_safe_parallel_wave_after_supervised_dry_run_owner_review_packet_contracts_planning_packet_20260615_221905.zip';
const PLANNING_PACKET_SHA256 = '4B38828B5196EC8908AB7352F865C13C78B206461778535D2F6F6013CEB90040';
const AUDIT_REFERENCE_PATH = 'C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data\\supervised_dry_run_audit_bundle_reference_static_evidence.zip';
const OWNER_REVIEW_PACKET_PATH = 'C:\\Users\\yu_ki\\AppData\\Local\\LoneWolfFang\\data\\supervised_dry_run_owner_review_packet_static_evidence.zip';
const AUDIT_REFERENCE_SHA256 = 'A'.repeat(64);
const OWNER_REVIEW_PACKET_SHA256 = 'B'.repeat(64);

const docPath = path.join(repoRoot, 'docs', 'orchestration', 'codex_native_supervised_dry_run_audit_bundle_to_owner_review_packet_linkage_contract.md');
const schemaPath = path.join(repoRoot, 'schema', 'orchestration', 'codex_native_supervised_dry_run_audit_bundle_to_owner_review_packet_linkage.schema.json');
const fixtureRoot = path.join(repoRoot, 'tests', 'fixtures', 'codex-native-supervised-dry-run', 'audit-bundle-to-owner-review-packet-linkage');

const allowedRepoFiles = [
  'docs/orchestration/codex_native_supervised_dry_run_audit_bundle_to_owner_review_packet_linkage_contract.md',
  'schema/orchestration/codex_native_supervised_dry_run_audit_bundle_to_owner_review_packet_linkage.schema.json',
  'tests/codex_native_supervised_dry_run_audit_bundle_to_owner_review_packet_linkage_contract.test.mjs',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/valid/linkage-not-started.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/valid/linkage-blocked-owner-review-required.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/valid/linkage-blocked-missing-audit-bundle-reference.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/valid/linkage-blocked-missing-owner-review-packet.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/valid/linkage-blocked-unsafe-audit-bundle-reference.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/valid/linkage-blocked-unsafe-owner-review-packet.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/valid/linkage-draft-ready.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/valid/linkage-hash-bound-evidence-assembled.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/valid/linkage-ready-for-human-review.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/valid/linkage-failed-closed.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/valid/linkage-stop-owner-review-required.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/invalid/forbidden-execution-actions-true.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/invalid/queue-mutation-true.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/invalid/cloud-api-billing-auth-trading-mutation-true.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/invalid/private-openai-api-true.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/invalid/auto-approval-true.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/invalid/missing-audit-bundle-reference.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/invalid/missing-owner-review-packet-reference.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/invalid/mismatched-reference-hash.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/invalid/stale-baseline-accepted.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/invalid/ready-treated-as-go.json',
  'tests/fixtures/codex-native-supervised-dry-run/audit-bundle-to-owner-review-packet-linkage/invalid/missing-human-review-or-fail-closed-reason.json',
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
  'worker_launch_requested',
  'queue_mutation_requested',
  'cloud_api_billing_auth_trading_mutation_requested',
  'private_api_requested',
  'openai_api_requested',
  'auto_approval_requested',
  'auto_go_signal',
];

const notGoFlags = [
  'evidence_only_linkage_metadata',
  'static_linkage_metadata_only',
  'never_runtime_go',
  'never_auto_approval',
  'never_executor',
  'never_live_observer',
  'never_audit_bundle_creator',
  'never_owner_review_submitter',
  'never_worker_launch_request',
  'never_queue_mutation_request',
  'never_cloud_api_billing_auth_trading_action',
  'never_private_or_openai_api_action',
  'never_substitute_for_owner_approval',
  'audit_to_owner_review_draft_ready_not_runtime_go',
  'audit_to_owner_review_hash_bound_evidence_assembled_not_runtime_go',
  'audit_to_owner_review_ready_for_human_review_not_runtime_go',
  'audit_bundle_reference_presence_not_enough_to_execute_observe_create_submit_continue',
  'owner_review_packet_presence_not_enough_to_execute_observe_create_submit_continue',
  'hash_binding_not_execution_approval',
  'ready_not_go',
  'matched_not_go',
  'observed_safe_no_action_not_go',
  'cannot_bypass_safety_gates',
  'cannot_bypass_owner_gates',
  'cannot_bypass_stop_owner_review_required',
  'cannot_bypass_stop_and_wait_owner_review_required',
];

const allowedStatuses = [
  'AUDIT_TO_OWNER_REVIEW_LINKAGE_NOT_STARTED',
  'AUDIT_TO_OWNER_REVIEW_LINKAGE_BLOCKED_OWNER_REVIEW_REQUIRED',
  'AUDIT_TO_OWNER_REVIEW_LINKAGE_BLOCKED_MISSING_AUDIT_BUNDLE_REFERENCE',
  'AUDIT_TO_OWNER_REVIEW_LINKAGE_BLOCKED_MISSING_OWNER_REVIEW_PACKET',
  'AUDIT_TO_OWNER_REVIEW_LINKAGE_BLOCKED_AUDIT_BUNDLE_REFERENCE_UNSAFE',
  'AUDIT_TO_OWNER_REVIEW_LINKAGE_BLOCKED_OWNER_REVIEW_PACKET_UNSAFE',
  'AUDIT_TO_OWNER_REVIEW_LINKAGE_DRAFT_READY',
  'AUDIT_TO_OWNER_REVIEW_LINKAGE_HASH_BOUND_EVIDENCE_ASSEMBLED',
  'AUDIT_TO_OWNER_REVIEW_LINKAGE_READY_FOR_HUMAN_REVIEW',
  'AUDIT_TO_OWNER_REVIEW_LINKAGE_FAILED_CLOSED',
  STOP_OWNER_REVIEW_REQUIRED,
];

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function setPath(target, dottedPath, value) {
  const parts = dottedPath.split('.');
  let cursor = target;
  for (const part of parts.slice(0, -1)) {
    cursor = cursor[part];
  }
  cursor[parts.at(-1)] = value;
}

function allFalse(keys) {
  return Object.fromEntries(keys.map((key) => [key, false]));
}

function allTrue(keys) {
  return Object.fromEntries(keys.map((key) => [key, true]));
}

function sourceSummary(contractName, present, safe, matchesExpected, artifactPath, artifactSha256) {
  return {
    contract_name: contractName,
    source_commit: STABLE_BASELINE,
    reference_present: present,
    artifact_path: present ? artifactPath : null,
    artifact_sha256: present ? artifactSha256 : null,
    sha256_matches_expected: Boolean(matchesExpected),
    safe_for_linkage: Boolean(safe),
    evidence_only: true,
  };
}

function sourceReference(present, safe, matchesExpected, artifactPath, artifactSha256) {
  return {
    present,
    artifact_path: present ? artifactPath : null,
    artifact_sha256: present ? artifactSha256 : null,
    sha256_matches_expected: Boolean(matchesExpected),
    safe_for_linkage: Boolean(safe),
    static_reference_only: true,
  };
}

function buildLinkageRecord(fixture) {
  const auditPresent = Boolean(fixture.audit_bundle_reference_present);
  const ownerPacketPresent = Boolean(fixture.owner_review_packet_present);
  const auditSafe = Boolean(fixture.audit_bundle_reference_safe);
  const ownerPacketSafe = Boolean(fixture.owner_review_packet_safe);
  const hashesMatch = Boolean(fixture.hashes_match_expected);
  const hashBindingComplete = Boolean(fixture.hash_binding_complete);
  const blocked = fixture.linkage_status.includes('BLOCKED')
    || fixture.linkage_status.includes('FAILED')
    || fixture.linkage_status === STOP_OWNER_REVIEW_REQUIRED;
  const blockedReason = fixture.blocked_reason ?? (blocked ? 'fail closed owner review required' : 'none');

  return {
    schema: SCHEMA_ID,
    build_id: fixture.build_id,
    linkage_id: 'linkage-' + fixture.case_id,
    linkage_created_at_utc: '2026-06-15T22:24:44Z',
    target: TARGET,
    target_repo: TARGET_REPO,
    branch: 'master',
    stable_baseline: STABLE_BASELINE,
    local_origin_master: STABLE_BASELINE,
    ahead_behind: '0 0',
    source_audit_bundle_reference_commit: STABLE_BASELINE,
    source_owner_review_packet_commit: STABLE_BASELINE,
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
    audit_bundle_reference_contract_summary: sourceSummary(
      'supervised_dry_run_audit_bundle_reference_contracts',
      auditPresent,
      auditSafe,
      hashesMatch,
      AUDIT_REFERENCE_PATH,
      AUDIT_REFERENCE_SHA256,
    ),
    owner_review_packet_contract_summary: sourceSummary(
      'supervised_dry_run_owner_review_packet_contracts',
      ownerPacketPresent,
      ownerPacketSafe,
      hashesMatch,
      OWNER_REVIEW_PACKET_PATH,
      OWNER_REVIEW_PACKET_SHA256,
    ),
    source_evidence_references: {
      audit_bundle_reference: sourceReference(
        auditPresent,
        auditSafe,
        hashesMatch,
        AUDIT_REFERENCE_PATH,
        AUDIT_REFERENCE_SHA256,
      ),
      owner_review_packet: sourceReference(
        ownerPacketPresent,
        ownerPacketSafe,
        hashesMatch,
        OWNER_REVIEW_PACKET_PATH,
        OWNER_REVIEW_PACKET_SHA256,
      ),
    },
    hash_binding_summary: {
      audit_bundle_reference_sha256: auditPresent ? AUDIT_REFERENCE_SHA256 : null,
      owner_review_packet_sha256: ownerPacketPresent ? OWNER_REVIEW_PACKET_SHA256 : null,
      hashes_match_expected: hashesMatch,
      hash_binding_complete: hashBindingComplete,
      execution_approval: false,
      submission_approval: false,
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
      private_or_openai_api_allowed: false,
    },
    linkage_status: fixture.linkage_status,
    blocked_reason: blockedReason,
    human_review_one_point: fixture.human_review_one_point,
    recommended_next_action: fixture.recommended_next_action ?? NEXT_REVIEW,
    stop_owner_review_required: Boolean(fixture.stop_owner_review_required),
    forbidden_actions_confirmation: allFalse(forbiddenFlags),
    blocker_matrix: [
      {
        blocker: fixture.blocker ?? 'none',
        status: fixture.blocker_status ?? (blocked ? 'OWNER_REVIEW_REQUIRED' : 'PASS'),
        resolution: blocked ? blockedReason : 'static linkage remains evidence only',
      },
    ],
    fail_closed_result: {
      failed_closed: blocked,
      reason: blocked ? blockedReason : 'none',
      owner_review_required: Boolean(fixture.stop_owner_review_required),
    },
    safety_invariants: [
      'no runtime execution requested or performed',
      'no live observation requested or performed',
      'no audit bundle creation requested or performed',
      'no owner review packet submission requested or performed',
      'no worker launch requested',
      'no queue mutation requested',
      'no cloud mutation requested',
      'no billing mutation requested',
      'no auth mutation requested',
      'no trading mutation requested',
      'no private API requested',
      'no OpenAI API requested',
      'no automatic GO signal',
    ],
    not_go_assertions: allTrue(notGoFlags),
  };
}

function validateArtifactEvidence(value, label, errors) {
  if (!value || typeof value !== 'object') {
    errors.push(label + ' must be an object');
    return;
  }
  if (!/^[A-F0-9]{64}$/.test(value.sha256_expected ?? '')) {
    errors.push(label + '.sha256_expected');
  }
  if (value.sha256_expected !== value.sha256_observed) {
    errors.push(label + '.sha256_observed mismatch');
  }
  for (const key of ['sha256_matches_expected', 'evidence_only', 'contains_no_runtime_artifact']) {
    if (value[key] !== true) {
      errors.push(label + '.' + key);
    }
  }
}

function validateSourceSummary(value, label, errors) {
  if (!value || typeof value !== 'object') {
    errors.push(label + ' must be an object');
    return;
  }
  if (value.source_commit !== STABLE_BASELINE) {
    errors.push(label + '.source_commit');
  }
  if (value.evidence_only !== true) {
    errors.push(label + '.evidence_only');
  }
  if (value.reference_present && !value.artifact_path) {
    errors.push(label + '.artifact_path');
  }
  if (value.reference_present && !/^[A-F0-9]{64}$/.test(value.artifact_sha256 ?? '')) {
    errors.push(label + '.artifact_sha256');
  }
}

function validateRecord(record) {
  const schema = readJson(schemaPath);
  const errors = [];
  const allowedTopLevelKeys = new Set(Object.keys(schema.properties));

  for (const key of schema.required) {
    if (!(key in record)) {
      errors.push('missing ' + key);
    }
  }
  for (const key of Object.keys(record)) {
    if (!allowedTopLevelKeys.has(key)) {
      errors.push('unexpected top-level ' + key);
    }
  }
  if (record.schema !== SCHEMA_ID) errors.push('schema');
  if (record.build_id !== BUILD_ID) errors.push('build_id');
  if (record.target !== TARGET) errors.push('target');
  if (record.target_repo !== TARGET_REPO) errors.push('target_repo');
  if (record.branch !== 'master') errors.push('branch');
  if (record.stable_baseline !== STABLE_BASELINE) errors.push('stable_baseline');
  if (record.local_origin_master !== STABLE_BASELINE) errors.push('local_origin_master');
  if (record.ahead_behind !== '0 0') errors.push('ahead_behind');
  if (!allowedStatuses.includes(record.linkage_status)) errors.push('linkage_status');

  validateArtifactEvidence(record.implementation_approval_packet, 'implementation_approval_packet', errors);
  validateArtifactEvidence(record.planning_packet, 'planning_packet', errors);
  validateSourceSummary(record.audit_bundle_reference_contract_summary, 'audit_bundle_reference_contract_summary', errors);
  validateSourceSummary(record.owner_review_packet_contract_summary, 'owner_review_packet_contract_summary', errors);

  if (!record.source_evidence_references?.audit_bundle_reference?.static_reference_only) {
    errors.push('source_evidence_references.audit_bundle_reference.static_reference_only');
  }
  if (!record.source_evidence_references?.owner_review_packet?.static_reference_only) {
    errors.push('source_evidence_references.owner_review_packet.static_reference_only');
  }

  if (record.linkage_status === 'AUDIT_TO_OWNER_REVIEW_LINKAGE_BLOCKED_MISSING_AUDIT_BUNDLE_REFERENCE'
    && record.audit_bundle_reference_contract_summary.reference_present) {
    errors.push('missing-audit-bundle-reference status with present reference');
  }
  if (record.linkage_status === 'AUDIT_TO_OWNER_REVIEW_LINKAGE_BLOCKED_MISSING_OWNER_REVIEW_PACKET'
    && record.owner_review_packet_contract_summary.reference_present) {
    errors.push('missing-owner-review-packet status with present packet');
  }
  if (record.linkage_status === 'AUDIT_TO_OWNER_REVIEW_LINKAGE_BLOCKED_AUDIT_BUNDLE_REFERENCE_UNSAFE'
    && record.audit_bundle_reference_contract_summary.safe_for_linkage) {
    errors.push('unsafe audit bundle reference marked safe');
  }
  if (record.linkage_status === 'AUDIT_TO_OWNER_REVIEW_LINKAGE_BLOCKED_OWNER_REVIEW_PACKET_UNSAFE'
    && record.owner_review_packet_contract_summary.safe_for_linkage) {
    errors.push('unsafe owner review packet marked safe');
  }

  const readyLikeStatus = [
    'AUDIT_TO_OWNER_REVIEW_LINKAGE_DRAFT_READY',
    'AUDIT_TO_OWNER_REVIEW_LINKAGE_HASH_BOUND_EVIDENCE_ASSEMBLED',
    'AUDIT_TO_OWNER_REVIEW_LINKAGE_READY_FOR_HUMAN_REVIEW',
  ].includes(record.linkage_status);
  if (readyLikeStatus) {
    if (!record.audit_bundle_reference_contract_summary.reference_present) errors.push('ready without audit bundle reference');
    if (!record.owner_review_packet_contract_summary.reference_present) errors.push('ready without owner review packet');
    if (!record.audit_bundle_reference_contract_summary.safe_for_linkage) errors.push('ready with unsafe audit reference');
    if (!record.owner_review_packet_contract_summary.safe_for_linkage) errors.push('ready with unsafe owner review packet');
    if (!record.hash_binding_summary.hashes_match_expected) errors.push('ready without hash match');
  }
  if (['AUDIT_TO_OWNER_REVIEW_LINKAGE_HASH_BOUND_EVIDENCE_ASSEMBLED', 'AUDIT_TO_OWNER_REVIEW_LINKAGE_READY_FOR_HUMAN_REVIEW'].includes(record.linkage_status)
    && !record.hash_binding_summary.hash_binding_complete) {
    errors.push('hash-bound status without complete hash binding');
  }

  if (!record.human_review_one_point || record.human_review_one_point.length < 16) {
    errors.push('human_review_one_point');
  }
  if (!record.blocked_reason || (record.fail_closed_result.failed_closed && record.blocked_reason === 'none')) {
    errors.push('blocked_reason');
  }
  if (record.fail_closed_result.failed_closed && !record.fail_closed_result.reason) {
    errors.push('fail_closed_result.reason');
  }

  const allowedNextActions = [NEXT_REVIEW, STOP_OWNER_REVIEW_REQUIRED];
  if (!allowedNextActions.includes(record.recommended_next_action)) {
    errors.push('recommended_next_action');
  }
  if (/(^|[^A-Z0-9])(GO|EXECUTE|RUNTIME|LIVE|QUEUE|WORKER|DEPLOY|PUSH|COMMIT|SUBMIT|MUTATE|TRADE|ORDER)([^A-Z0-9]|$)/i.test(record.recommended_next_action)) {
    errors.push('recommended_next_action unsafe phrase');
  }

  for (const key of forbiddenFlags) {
    if (record.forbidden_actions_confirmation?.[key] !== false) {
      errors.push('forbidden_actions_confirmation.' + key);
    }
  }
  for (const key of notGoFlags) {
    if (record.not_go_assertions?.[key] !== true) {
      errors.push('not_go_assertions.' + key);
    }
  }
  for (const [key, value] of Object.entries(record.safety_boundary_summary ?? {})) {
    if (key === 'static_metadata_only' || key === 'human_review_required') {
      if (value !== true) errors.push('safety_boundary_summary.' + key);
    } else if (value !== false) {
      errors.push('safety_boundary_summary.' + key);
    }
  }
  if (record.hash_binding_summary.execution_approval !== false) errors.push('hash_binding_summary.execution_approval');
  if (record.hash_binding_summary.submission_approval !== false) errors.push('hash_binding_summary.submission_approval');
  if (record.hash_binding_summary.queue_mutation_approval !== false) errors.push('hash_binding_summary.queue_mutation_approval');

  return errors;
}

test('contract files pin the build id and safe next action', () => {
  const docText = readFileSync(docPath, 'utf8');
  const schema = readJson(schemaPath);
  const testText = readFileSync(currentFile, 'utf8');

  assert.equal(schema.schema_id, SCHEMA_ID);
  assert.equal(schema.build_id, BUILD_ID);
  assert.match(docText, new RegExp(BUILD_ID));
  assert.match(testText, new RegExp(BUILD_ID));
  assert.match(docText, new RegExp(NEXT_REVIEW));
  assert.match(docText, /static review states only/i);
  assert.match(docText, /not runtime GO states/i);
});

test('allowlist contains exactly the approved 25 repo files', () => {
  assert.equal(allowedRepoFiles.length, 25);
  assert.equal(new Set(allowedRepoFiles).size, 25);
});

test('schema rejects unknown top-level fields and pins fail-closed controls', () => {
  const schema = readJson(schemaPath);
  assert.equal(schema.additional_properties_allowed, false);
  assert.equal(schema.properties.stable_baseline.const, STABLE_BASELINE);
  assert.equal(schema.properties.local_origin_master.const, STABLE_BASELINE);
  assert.deepEqual(schema.properties.recommended_next_action.enum, [NEXT_REVIEW, STOP_OWNER_REVIEW_REQUIRED]);
  for (const flag of forbiddenFlags) {
    assert.equal(schema.definitions.forbidden_actions_confirmation.properties[flag].const, false);
  }
  for (const flag of notGoFlags) {
    assert.equal(schema.definitions.not_go_assertions.properties[flag].const, true);
  }
});

test('valid fixtures produce valid linkage records', () => {
  const fixtureNames = readdirSync(path.join(fixtureRoot, 'valid')).filter((name) => name.endsWith('.json')).sort();
  assert.deepEqual(fixtureNames, [
    'linkage-blocked-missing-audit-bundle-reference.json',
    'linkage-blocked-missing-owner-review-packet.json',
    'linkage-blocked-owner-review-required.json',
    'linkage-blocked-unsafe-audit-bundle-reference.json',
    'linkage-blocked-unsafe-owner-review-packet.json',
    'linkage-draft-ready.json',
    'linkage-failed-closed.json',
    'linkage-hash-bound-evidence-assembled.json',
    'linkage-not-started.json',
    'linkage-ready-for-human-review.json',
    'linkage-stop-owner-review-required.json',
  ]);

  for (const name of fixtureNames) {
    const fixture = readJson(path.join(fixtureRoot, 'valid', name));
    assert.equal(fixture.build_id, BUILD_ID, name);
    assert.equal(fixture.expected_valid, true, name);
    const record = buildLinkageRecord(fixture);
    assert.deepEqual(validateRecord(record), [], name);
  }
});

test('invalid fixtures fail closed for forbidden actions and unsafe linkage evidence', () => {
  const fixtureNames = readdirSync(path.join(fixtureRoot, 'invalid')).filter((name) => name.endsWith('.json')).sort();
  assert.deepEqual(fixtureNames, [
    'auto-approval-true.json',
    'cloud-api-billing-auth-trading-mutation-true.json',
    'forbidden-execution-actions-true.json',
    'mismatched-reference-hash.json',
    'missing-audit-bundle-reference.json',
    'missing-human-review-or-fail-closed-reason.json',
    'missing-owner-review-packet-reference.json',
    'private-openai-api-true.json',
    'queue-mutation-true.json',
    'ready-treated-as-go.json',
    'stale-baseline-accepted.json',
  ]);

  for (const name of fixtureNames) {
    const fixture = readJson(path.join(fixtureRoot, 'invalid', name));
    assert.equal(fixture.build_id, BUILD_ID, name);
    assert.equal(fixture.expected_valid, false, name);
    const base = readJson(path.join(fixtureRoot, 'valid', fixture.base_fixture));
    const record = buildLinkageRecord(base);
    for (const mutation of fixture.mutations) {
      setPath(record, mutation.path, mutation.value);
    }
    const errors = validateRecord(record);
    assert.ok(errors.length > 0, name);
    for (const expectedError of fixture.expected_errors) {
      assert.ok(errors.some((error) => error.includes(expectedError)), name + ' missing ' + expectedError + '; saw ' + errors.join('; '));
    }
  }
});

test('contract text and fixtures contain no automatic GO or runtime authorization', () => {
  const files = [
    docPath,
    schemaPath,
    currentFile,
    ...allowedRepoFiles
      .filter((file) => file.startsWith('tests/fixtures/'))
      .map((file) => path.join(repoRoot, file)),
  ];
  const forbiddenAuthorizationPatterns = [
    /\bREADY\s*=\s*GO\b/i,
    /\bOBSERVED_SAFE_NO_ACTION\s*=\s*GO\b/i,
    /\bHASH_BOUND\s*=\s*EXECUTE\b/i,
    /\bAUTO[-_ ]?APPROVE\b/i,
    /\bMAY\s+LAUNCH\s+WORKER\b/i,
    /\bMAY\s+MUTATE\s+QUEUE\b/i,
  ];

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const pattern of forbiddenAuthorizationPatterns) {
      assert.doesNotMatch(text, pattern, file);
    }
  }
});
