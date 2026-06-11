# NEXT_CODEX_PROMPT

Before doing any work, read and follow the rule files in `C:\LoneWolf_Fang_Project`, starting with `AGENTS.md`. If any required rule file is missing, report the missing list and stop with: `STOP_OWNER_REVIEW_REQUIRED`.

The previous task created the Local Orchestrator Skeleton v0.1 state-machine design slice as docs/schema/fixtures/static-tests/examples only.

Review the result without launching workers, running real orchestration, sending prompts, using browser bridge automation, deploying, mutating cloud/billing/GitHub settings, running runtime/trading/private API actions, or doing git add/commit/push/fetch/pull.

Output encoding rule for future final reports:

- Use ASCII-only section labels.
- Do not put Japanese in final report heading labels.
- Put Japanese explanation in `owner_summary_ja.md`, `implementation_summary_ja.md`, and `safe_summary.md`.
- If console Japanese looks corrupted, write `SEE_UTF8_ARTIFACT_OWNER_SUMMARY_JA` and rely on UTF-8 artifact files.
- Include `encoding_check.txt` in future packets.
- Generate `encoding_check.txt` from Unicode escapes or code points, not from terminal-rendered Japanese.
- Read `encoding_check.txt` back as UTF-8 and compare the actual read-back exactly to the intended Unicode string.
- Do not set `encoding_check_exact_match=true` unless the actual UTF-8 read-back equals the expected Unicode string.
- If the exact read-back comparison fails, write `ENCODING_CHECK_FAILED` in `validation_summary.md` and stop with `STOP_OWNER_REVIEW_REQUIRED`.

Required final report labels:

- CHANGED_SUMMARY
- CHANGED_FILES
- PURPOSE_ALIGNMENT
- VALIDATION_RESULT
- ENCODING_REPAIR_SUMMARY
- ENCODING_CHECK_RESULT
- MOJIBAKE_GUARD_RESULT
- STATIC_TEST_RESULT
- SAFETY_BOUNDARY_CONFIRMATION
- UNCONFIRMED_ASSUMPTIONS
- DANGEROUS_CHANGES
- HUMAN_REVIEW_ONE_POINT
- ZIP_PATH
- SHA256
- ZIP_ENTRY_COUNT
- MANIFEST_VALIDATION
- CHECKSUM_VALIDATION
- CONFIDENCE_LEVEL

Safe next action: inspect `docs/codex_native_closed_loop/*`, `schema/codex_native_closed_loop/*`, `tests/codex_native_closed_loop/*`, `tests/fixtures/codex_native_closed_loop/*`, and `codex_native_closed_loop/*`; then decide whether to accept the design slice, request a static repair, or stop for owner review.
