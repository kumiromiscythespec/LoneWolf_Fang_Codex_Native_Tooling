<!-- BUILD_ID: 2026-06-27_squash_merge_retained_branch_realignment_contract_v1 -->

# Squash Merge Retained Branch Realignment Contract

## Purpose

This contract records the evidence used to decide whether a retained branch is
safe for a later pull request after an earlier pull request was squash-merged.
It is a static docs, schema, tests, and fixtures contract. It does not execute
branch operations.

## Problem And Trigger

A squash merge creates a new commit on the base branch while the retained head
branch keeps its original commits. Reusing that retained branch can therefore
make GitHub compare show files from an already-merged lane again.

The safety trigger is any mismatch between the approved current-lane scope and
the compare result, including a different file count, unexpected files, missing
files, or carryover files from an earlier lane.

## Required Response

When compare is not exact, PR creation is blocked and an owner-review packet is
required. A READY record is evidence for review; READY is not GO and does not
authorize branch creation, publication, or merge.

## Safe Realignment Plan

The record may recommend a clean branch based on the observed remote-master
squash merge commit. Only an exact-file patch transfer, or an equivalently
bounded transfer approved by the owner, may be planned. The retained source
branch remains unchanged.

Before PR creation, the clean branch compare must contain exactly the approved
file set and count, with no unexpected, missing, or carryover files.

## Guardrails

The contract requires all of these boundaries:

- no force push
- no branch deletion or branch cleanup
- no broad fetch or pull
- no deploy or runtime execution
- no API, auth, billing, or trading action
- no private-repository or contracts-repository access
- no unrelated refactor

The old retained branch must not be deleted, rewritten, or force-pushed. Any
such request invalidates the record and requires owner review.

## Owner Decision

The record carries exactly one human decision point. That decision may approve
the next bounded planning or implementation phase, but it does not approve a
commit, push, PR, merge, deploy, runtime action, or branch mutation by itself.

