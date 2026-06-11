# Output Encoding Policy v0.2

## Purpose

この policy は、Codex Native Closed Loop の final report と AppData artifact で文字化けを避けるための静的ルールを定義する。

## Final Report Labels

Final report の section label は ASCII-only とする。

Allowed labels:

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

Final report heading に日本語を混ぜない。日本語の説明が必要な場合は heading ではなく body text または UTF-8 artifact file に書く。

## Authoritative Japanese Artifacts

Console output で日本語が壊れて見える場合でも、UTF-8 artifact files を正とする。

Authoritative Japanese artifact files:

- owner_summary_ja.md
- implementation_summary_ja.md
- safe_summary.md

Final report body で日本語が読みにくい場合は `SEE_UTF8_ARTIFACT_OWNER_SUMMARY_JA` と書き、`owner_summary_ja.md` を参照させる。

## Encoding Check Source Of Truth

Every future packet should include `encoding_check.txt`.

`encoding_check.txt` must be generated from Unicode escapes or code points, not from terminal-rendered Japanese.

The source-of-truth escaped string is:

```text
\u6587\u5b57\u5316\u3051\u78ba\u8a8d: \u5909\u66f4\u3057\u305f\u3053\u3068 / \u691c\u8a3c\u7d50\u679c / \u6b21\u306b\u9032\u3080\u524d\u306b\u4eba\u9593\u304c\u5224\u65ad\u3059\u3079\u304d1\u70b9
```

Validation must:

1. Build the expected string from the Unicode escapes or code points.
2. Write `encoding_check.txt` as UTF-8.
3. Read `encoding_check.txt` back as UTF-8.
4. Compare the read-back string exactly to the expected string.
5. Calculate expected and actual SHA256 values from the UTF-8 bytes.
6. Set `encoding_check_exact_match=true` only when the actual read-back equals the expected string and the expected/actual SHA256 values match.

Do not validate against a corrupted display string.

## Manifest And Validation Summary Rule

`manifest.json` must not claim `encoding_check_exact_match=true` unless the actual UTF-8 read-back equals the expected Unicode string.

If the exact read-back comparison fails:

- set `encoding_check_exact_match=false`
- set the packet status to a non-complete status
- write `ENCODING_CHECK_FAILED` in `validation_summary.md`
- stop with `STOP_OWNER_REVIEW_REQUIRED`

## Mojibake Guard

Active final report templates, `NEXT_CODEX_PROMPT.md`, owner-facing summaries, and `encoding_check.txt` must not contain known bad mojibake fragments except when a test constructs them internally for scanning.

Historical bad examples may be represented in tests by code points or escaped construction only. Active headings must stay ASCII-only.

## Scope Boundary

This policy is docs/static-test only. It does not approve commit, push, worker launch, real orchestration, browser bridge automation, ChatGPT prompt sending, deploy, runtime, trading, private API, publicization, GitHub Release, tag, or asset upload.
