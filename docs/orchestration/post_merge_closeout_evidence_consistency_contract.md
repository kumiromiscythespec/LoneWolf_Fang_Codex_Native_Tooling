<!-- BUILD_ID: 2026-07-02_post_merge_closeout_evidence_consistency_contract_v1 -->

# Post-Merge Closeout Evidence Consistency Contract

## Purpose

This contract prevents a post-merge closeout packet from being classified
READY when its evidence contradicts a closed, merged, no-runtime-action lane.
It is a static docs, schema, tests, and fixtures contract. It does not perform
GitHub, Git, runtime, deploy, or API operations.

## READY Requirements

A READY post-merge closeout record must prove all of the following:

- the final lane status is `LANE_CLOSED_MERGED_NO_RUNTIME_ACTION`;
- the pull request final state is `MERGED`;
- the observed new remote master equals both merge commit fields;
- no open pull request remains after merge;
- a claimed retained branch has matching local and remote SHA evidence;
- the working tree and index are clean with zero source and cached diff files;
- no forbidden post-merge action appears in safety flags or command evidence;
- a valid merge-result packet SHA256 links the closeout to its merge evidence.

Any contradiction blocks READY. A self-reported PASS value does not override
the underlying evidence.

## Fail-Closed Conditions

The contract rejects OPEN, CLOSED, UNKNOWN, or missing PR state; a nonzero open
PR count; remote-master or retained-branch SHA mismatch; nonempty source or
index evidence; and any fetch, pull, checkout, switch, push, branch deletion,
cleanup, deploy, runtime, API, auth, billing, or trading action after merge.

Merge-result packet content validation is an adjacent contract. This contract
requires a well-formed SHA256 linkage value but does not become a universal
artifact validator.

## Safety Boundary

This contract does not authorize commit, push, PR creation, merge, fetch, pull,
checkout, switch, branch deletion, cleanup, deploy, runtime, API, auth,
billing, trading, private repository access, or contracts repository access.
READY is not GO. Owner review remains mandatory.
