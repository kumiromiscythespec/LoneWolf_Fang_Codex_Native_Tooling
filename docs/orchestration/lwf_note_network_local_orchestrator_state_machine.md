# LWF NOTE-NETWORK Local Orchestrator State Machine

## States

| State | Meaning |
| --- | --- |
| `PLAN_SCOUT` | ChatGPT prepares a SCOUT plan for local NOTE preprocessing. |
| `WRITE_SCOUT_PLAN_TO_INPUT` | Owner writes the plan to `C:\LWF_NoteNetwork\inputs\scout_plan.txt`. |
| `RUN_NOTE_SCOUT` | Owner runs the local NOTE scout process outside this repo. |
| `MERGE_SCOUT_OUTPUTS` | NOTE outputs from `NOTE-01` through `NOTE-05` are merged and compacted. |
| `CHATGPT_SCOUT_REVIEW` | ChatGPT reviews SCOUT output as preprocessing, not proof. |
| `CODEX_BOUNDED_PROMPT_READY` | A bounded Codex prompt is ready for owner approval. |
| `CODEX_BOUNDED_EXECUTION` | Codex performs only the approved bounded work. |
| `CODEX_ARTIFACT_CREATED` | Codex creates manifest, summaries, changed file list, blocker matrix, artifact ZIP, and SHA sidecars. |
| `PLAN_REVIEW` | ChatGPT prepares a REVIEW plan for local NOTE preprocessing. |
| `WRITE_REVIEW_PLAN_TO_INPUT` | Owner writes the REVIEW plan to the local input file. |
| `RUN_NOTE_REVIEW` | Owner runs local NOTE review outside this repo. |
| `MERGE_REVIEW_OUTPUTS` | NOTE REVIEW outputs are merged and compacted. |
| `CHATGPT_FINAL_REVIEW` | ChatGPT reviews artifacts, diffs, tests, manifests, and repo evidence. |
| `OWNER_ONE_POINT_DECISION` | Owner receives one explicit decision point. |
| `STOP_OWNER_REVIEW_REQUIRED` | The lane stops because a gate failed or approval is ambiguous. |
| `READY_FOR_NEXT_BOUNDED_PROMPT` | A safe next bounded prompt can be prepared after owner review. |

## Allowed Transitions

1. `PLAN_SCOUT` -> `WRITE_SCOUT_PLAN_TO_INPUT`
2. `WRITE_SCOUT_PLAN_TO_INPUT` -> `RUN_NOTE_SCOUT`
3. `RUN_NOTE_SCOUT` -> `MERGE_SCOUT_OUTPUTS`
4. `MERGE_SCOUT_OUTPUTS` -> `CHATGPT_SCOUT_REVIEW`
5. `CHATGPT_SCOUT_REVIEW` -> `CODEX_BOUNDED_PROMPT_READY`
6. `CODEX_BOUNDED_PROMPT_READY` -> `CODEX_BOUNDED_EXECUTION`
7. `CODEX_BOUNDED_EXECUTION` -> `CODEX_ARTIFACT_CREATED`
8. `CODEX_ARTIFACT_CREATED` -> `PLAN_REVIEW`
9. `PLAN_REVIEW` -> `WRITE_REVIEW_PLAN_TO_INPUT`
10. `WRITE_REVIEW_PLAN_TO_INPUT` -> `RUN_NOTE_REVIEW`
11. `RUN_NOTE_REVIEW` -> `MERGE_REVIEW_OUTPUTS`
12. `MERGE_REVIEW_OUTPUTS` -> `CHATGPT_FINAL_REVIEW`
13. `CHATGPT_FINAL_REVIEW` -> `OWNER_ONE_POINT_DECISION`
14. `OWNER_ONE_POINT_DECISION` -> `READY_FOR_NEXT_BOUNDED_PROMPT`

Any state may transition to `STOP_OWNER_REVIEW_REQUIRED` when a safety gate fails, evidence is missing, scope is unclear, or approval is ambiguous.

## Required Guards

- All five NOTE nodes must be present for SCOUT and REVIEW completion.
- `public_version_deferred` must be `true`.
- `local_orchestrator_priority` must be `true`.
- NOTE output must be treated as preprocessing only.
- ChatGPT final review must require artifact, diff, test, manifest, and repo evidence.
- Codex must produce artifact ZIPs and SHA sidecars after bounded execution.
- Owner review remains mandatory.

## Forbidden Transitions

| Forbidden transition | Reason |
| --- | --- |
| SCOUT complete -> runtime GO | SCOUT complete is not Codex execution approval and never authorizes runtime. |
| REVIEW complete -> push GO | REVIEW complete is not push approval. |
| NOTE PASS -> proof | NOTE output is not proof by itself. |
| Codex local commit -> push approval | A local commit does not approve push. |
| artifact SHA match -> execution approval | Hash matching is evidence binding only. |
| public version priority while local priority is active | Public version development is deferred in this lane. |

## Stop Conditions

Stop with `STOP_OWNER_REVIEW_REQUIRED` when:

- a NOTE node is missing
- runtime, push, deploy, public submission, or private API approval is inferred
- REVIEW is skipped after Codex execution
- NOTE output is treated as proof without verification
- artifact, diff, test, manifest, or repo evidence is missing for final review
- owner decision is not reduced to one explicit point
