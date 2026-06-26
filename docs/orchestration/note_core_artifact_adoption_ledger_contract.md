<!-- BUILD_ID: 2026-06-26_note_core_artifact_adoption_ledger_contract_v1 -->

# NOTE-Core Artifact Adoption Ledger Contract

## Purpose

The NOTE-Core artifact adoption ledger contract records how an owner-accepted
NOTE-Core artifact or closeout packet is adopted into the next lane record.
It gives Codex and the owner a small, reviewable ledger shape for connecting a
source artifact, its checksum, the accepted lane status, and the one human
decision point that remains.

## What It Is Not

This contract is documentation, schema, fixture, and test evidence only. It does
not execute runtime actions, deploy anything, call APIs, handle authentication,
change billing, perform trading behavior, read private repos, read contracts
repos, create pull requests, merge branches, or approve future commits.
This contract does not execute runtime actions.
This contract does not deploy anything.

## Ledger Record

An adoption ledger record names the source artifact, records its SHA256, binds
the prior contract and lane status, preserves the owner acceptance phrase, and
keeps all risky touch flags false. The record can recommend a bounded next
docs/schema/tests lane, but it cannot become GO for runtime or repository
mutation.

## Accepted NOTE-Core Example

For the accepted NOTE-Core artifact contract lane, a ledger record can capture:

- lane name: `NOTE_CORE_ARTIFACT_CONTRACT_SCHEMA_TESTS_LANE`;
- lane status: `LANE_CLOSED_MERGED_NO_RUNTIME_ACTION`;
- closeout classification:
  `NOTE_CORE_ARTIFACT_CONTRACT_POST_MERGE_CLOSEOUT_READY`;
- owner acceptance phrase:
  `OWNER_ACCEPT_LANE_CLOSED_MERGED_NO_RUNTIME_ACTION`;
- source artifact checksum and filename;
- recommended next action:
  `PREPARE_CODEX_PROMPT_FOR_RECOMMENDED_DOCS_SCHEMA_TESTS_LANE`;
- all runtime, deploy, API, auth, billing, trading, private repo, and contracts
  repo touch flags set to false.

The owner remains the gate for deciding whether this record is accepted and
whether a later commit-approval packet should be prepared.
