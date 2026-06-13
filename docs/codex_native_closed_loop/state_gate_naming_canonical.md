<!-- BUILD_ID: 20260613_codex_native_automation_gate_contracts_v1 -->
# Canonical State Gate Naming

This document defines the canonical naming contract for the next-wave Codex
Native closed-loop state gate layer. It is a static docs/schema/tests/fixtures
contract only. It does not authorize runtime execution, worker launch, daemon or
watcher behavior, prompt sending, API access, deploy, cloud mutation, billing
mutation, trading actions, commit, or push.

## Naming Style

| Name family | Style | Reason |
| --- | --- | --- |
| state | `UPPER_SNAKE_CASE` | States are enum values and should be visibly terminal or review-gated. |
| event | `UPPER_SNAKE_CASE` | Events are enum values and should not be confused with free-form text. |
| guard | `lower_snake_case` | Guards are static predicates and match the prior Window 2 approval packet. |
| next_action | `UPPER_SNAKE_CASE` | Next actions are enum values for review routing, not executable commands. |

Unknown or non-canonical names must fail closed and require owner review.

## Canonical States

| State | Purpose |
| --- | --- |
| `PAUSED_BASELINE_ACCEPTED` | Stable pushed baseline and closeout evidence are accepted as the starting point. |
| `PLANNING_ONLY` | AppData-only planning or approval packet work is in progress. |
| `APPROVAL_PACKET_READY` | Approval packet exists and is ready for owner or integration review. |
| `STATIC_IMPLEMENTATION_READY` | Docs/schema/tests/fixtures implementation is prepared and static checks pass. |
| `LOCAL_COMMIT_READY` | A future local commit may be considered after exact owner approval. |
| `PUSH_READY` | A future push may be considered after separate exact owner approval. |
| `MANUAL_LOOP_READY` | Manual loop review is possible with human review and human send only. |
| `SUPERVISED_DRY_RUN_READY` | A bounded dry-run may be considered; start is not implied. |
| `SUPERVISED_DRY_RUN_RUNNING` | A future separately approved dry-run is running; not approved by this contract. |
| `OWNER_REVIEW_REQUIRED` | Human decision is required before any progression. |
| `FAIL_CLOSED` | Integrity, safety, or ambiguity blocks progression. |
| `RUNTIME_PROHIBITED` | Runtime execution, worker launch, daemon, watcher, or dispatch was requested or implied. |
| `DEPLOY_PROHIBITED` | Deploy or production/cloud mutation was requested or implied. |
| `API_PROHIBITED` | API, private payload, secrets, or billing behavior was requested or implied. |
| `TRADING_PROHIBITED` | Trading, order, cancel, balance, or private exchange behavior was requested or implied. |

## Canonical Events

| Event | Meaning |
| --- | --- |
| `OWNER_APPROVAL` | Exact current owner approval phrase for the named scope. |
| `PACKET_CREATED` | Required packet exists with manifest and checksum summary. |
| `TEST_PASS` | Approved static checks passed. |
| `TEST_FAIL` | Approved static checks failed. |
| `UNEXPECTED_DIRTY_WORKTREE` | Tracked repo state changed outside the approved scope. |
| `MISSING_ARTIFACT` | Required prior or current artifact is absent. |
| `CHECKSUM_MISMATCH` | Expected artifact checksum differs from observed hash. |
| `AMBIGUOUS_STATE` | State, event, branch, head, approval, or evidence is ambiguous. |
| `FORBIDDEN_ACTION_ATTEMPT` | A forbidden action was requested, implied, or found in evidence. |
| `AUTOMATION_PROMOTION_REQUEST` | A request attempts to promote manual/static work toward automation. |
| `STALE_OWNER_APPROVAL` | Approval is expired, superseded, broad, or tied to changed evidence. |
| `UNKNOWN_NAME` | A state, event, guard, or next_action name is unknown. |

## Canonical Guards

| Guard | Meaning |
| --- | --- |
| `exact_sha_match` | Observed HEAD equals the expected baseline or approved commit. |
| `local_origin_master_matches_head` | Local `origin/master` ref equals HEAD without fetch. |
| `ahead_behind_zero` | Local ahead/behind against `origin/master` is `0 / 0`. |
| `clean_worktree` | Tracked worktree status is empty. |
| `staged_file_count_zero` | No files are staged. |
| `known_branch_head` | Branch and HEAD are recorded and expected. |
| `input_artifact_checksum_match` | Required input artifact checksums match expected values. |
| `manifest_schema_exact` | Manifest schema const matches the required schema. |
| `required_packet_entries_present` | Required packet files are present on disk and in ZIP. |
| `no_forbidden_action` | Prompt, evidence, files, and next prompt avoid forbidden behavior. |
| `owner_approval_phrase_exact` | Owner phrase exactly names one action, target, and scope. |
| `all_static_tests_pass` | Approved static checks pass. |
| `rollback_available` | Prior commit or artifact evidence exists for review planning. |
| `no_runtime_mutation` | No runtime, daemon, watcher, API, cloud, billing, or trading mutation occurs. |
| `build_id_marker_present` | Future added or modified files carry the required BUILD_ID/build_id marker. |
| `allowlist_path_only` | Future edits are limited to the owner-approved allowlist. |

## Canonical Next Actions

| Next action | Meaning |
| --- | --- |
| `CREATE_APPROVAL_PACKET_ONLY` | Create an AppData approval packet and ZIP only. |
| `INCLUDE_IN_NEXT_WAVE_IMPLEMENTATION_APPROVAL_INTEGRATION_PACKET` | Include output for implementation integration/review. |
| `REQUIRE_OWNER_REVIEW` | Stop for owner review. |
| `PREPARE_STATIC_DOCS_SCHEMA_TESTS_FIXTURES_ONLY` | Prepare static docs/schema/tests/fixtures only. |
| `RUN_STATIC_TESTS_ONLY` | Run approved non-mutating local static checks. |
| `PREPARE_LOCAL_COMMIT_ONLY` | Future owner-gated local commit readiness only. |
| `PREPARE_PUSH_ONLY` | Future separate push readiness only. |
| `MANUAL_LOOP_REVIEW_ONLY` | Human-operated manual loop review only. |
| `CONSIDER_SUPERVISED_DRY_RUN_ONLY` | Consider dry-run readiness; do not start it. |
| `START_SUPERVISED_DRY_RUN_ONLY` | Future separately approved single-shot dry-run start only. |
| `STOP_FAIL_CLOSED` | Stop because integrity, safety, or ambiguity failed. |
| `STOP_RUNTIME_PROHIBITED` | Stop because runtime or automation execution was requested or implied. |
| `STOP_DEPLOY_PROHIBITED` | Stop because deploy or cloud mutation was requested or implied. |
| `STOP_API_PROHIBITED` | Stop because API, private payload, secrets, or billing behavior was requested or implied. |
| `STOP_TRADING_PROHIBITED` | Stop because trading/order/balance behavior was requested or implied. |
