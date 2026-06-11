# State Transition Reason Log v0.1

## Purpose

reason_log.jsonl は audit trail である。各行は 1 transition decision を記録し、なぜ state が変わったかを説明する。

## JSONL Line Contract

各 JSONL line は次を持つ。

- timestamp
- state_before
- event
- guard_result
- action
- state_after
- reason
- evidence_refs
- owner_review_required

## Review Rule

reason_log は runtime log ではない。v0.1 では static example としてのみ扱う。

Transition は State / Event / Guard / Action / Next State で説明できなければならない。説明できない場合は STOP_OWNER_REVIEW_REQUIRED に移る。

## Safe Stop Examples

- Codex result が unclear: RESULT_REVIEW_REQUIRED -> STOP_OWNER_REVIEW_REQUIRED
- forbidden file touched: CODEX_RUNNING -> REJECTED_FOR_SAFETY
- tests failed: CODEX_RUNNING -> REPAIR_REQUIRED
- no safe task: READY_FOR_TRIAGE -> PAUSED_OWNER_DECISION_REQUIRED

## Invariants Referenced By Logs

- worker_session_close_required_after_review_handoff = true
- no_next_worker_until_previous_worker_closed = true
- previous_worker_retired must be true before START_NEXT_IMPLEMENTER
- if close/retire confirmation is missing, transition to STOP_OWNER_REVIEW_REQUIRED

reason_log は owner approval の代替ではない。owner_review_required=false does not mean owner execution approval。
