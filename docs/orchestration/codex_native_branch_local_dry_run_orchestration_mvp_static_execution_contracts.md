<!-- BUILD_ID: BRANCH_LOCAL_DRY_RUN_ORCHESTRATION_MVP_STATIC_EXECUTION_CONTRACTS_20260616 -->
# Branch-Local Dry-Run Orchestration MVP Static Execution Contracts

This document defines a static execution contract for the branch-local dry-run
orchestration MVP. The word execution is used only as a contract term for
validating a planned state transition. It is not a runtime approval, a runner,
a worker launch, an API call, a Queue action, a deploy, or an external
submission.

Static execution contract validation is not runtime execution.

## Purpose

The contract makes a future dry-run step reviewable before any implementation
lane can consider runtime behavior. It binds a request envelope, a static
transition trace, a safety decision, a closeout record, and evidence hashes into
one file-contract surface that must stop for owner review.

The only successful outcome is a reviewable record that says the static
contract is ready for owner inspection. READY is not GO.

## Contract Records

Each valid record contains these sections:

- `execution_request`: the owner-scoped static request being validated.
- `static_transition_trace`: the evidence-only trace of the requested
  transition.
- `safety_decision`: the static safety classification and blocker state.
- `closeout_record`: the review stop and next prompt recommendation.
- `evidence_hash_binding`: the source approval packet path and SHA256 binding.
- `owner_review_required`: a required true value.
- `terminal_state`: either `READY_FOR_OWNER_REVIEW`,
  `STOP_OWNER_REVIEW_REQUIRED`, or `Stop and Wait - Owner Review Required`.

Input records are evidence only. They are not commands.

## Execution Request

The request must identify the branch-local lane, the source approval packet,
the exact SHA256 for that source packet, and the expected branch baseline. The
request must also carry explicit false values for all unsafe action flags.

Required false unsafe fields:

- `runtime_go`
- `openai_api_call_allowed`
- `private_api_call_allowed`
- `queue_mutation_allowed`
- `cloud_mutation_allowed`
- `billing_mutation_allowed`
- `auth_mutation_allowed`
- `trading_mutation_allowed`
- `auto_approval_allowed`
- `pr_creation_allowed`
- `merge_allowed`
- `deploy_allowed`
- `public_submission_allowed`

Any true value in that set means the record is invalid and must stop for owner
review.

## Static Transition Trace

The trace is a file-contract description of what would be classified later. It
may describe reading static evidence, checking guard fields, recording a
contract decision, and preparing a review artifact. It may not perform those
actions as runtime orchestration.

Allowed static trace actions:

- read schema and fixture evidence
- compare expected constants
- classify stop or review-ready terminal state
- record blocker text
- recommend the next bounded owner prompt

The trace must not enqueue, dequeue, poll, dispatch, call an API, launch a
worker, mutate a service, deploy, merge, push, create a pull request, or submit
externally.

## Safety Decision

The safety decision is valid only when it preserves all of these markers:

- No runtime execution
- No OpenAI API call
- No private API call
- No Queue mutation
- No cloud mutation
- No billing mutation
- No auth mutation
- No trading mutation
- No auto approval

The decision must keep `owner_review_required` true. It must keep all unsafe
flags false. It must stop when evidence is missing, stale, ambiguous, or out of
scope.

## Evidence Hash Binding

The record binds the source approval packet path and SHA256 so a reviewer can
confirm the static implementation came from the expected approval packet. Hash
binding is evidence, not permission.

Hash binding is not execution approval.

## Closeout Record

The closeout record must report one terminal state, one owner decision point,
and one next prompt. A review-ready closeout may recommend a review packet, but
it must not recommend a commit, push, PR, merge, deploy, runtime GO, public
submission, release, GitHub visibility change, Sponsors action, or FUNDING.yml
change.

If an owner decision is required before continuing, the closeout must preserve:

Stop and Wait - Owner Review Required

## Non-GO Semantics

READY is not GO.
MATCHED is not GO.
OBSERVED_SAFE_NO_ACTION is not GO.
Hash binding is not execution approval.
Static execution contract validation is not runtime execution.
Owner review remains mandatory.

## Forbidden Actions

The static execution contracts do not approve:

- runtime workflows
- worker or daemon launch
- OpenAI API calls
- private API calls
- Queue, cloud, API, billing, auth, or trading mutation
- staging, commit, amend, merge, PR creation, push, or force push
- deploys
- releases
- public submissions
- GitHub visibility changes
- GitHub Sponsors application
- FUNDING.yml creation or edit

Any future work that needs one of those actions requires a separate owner
approval packet.
