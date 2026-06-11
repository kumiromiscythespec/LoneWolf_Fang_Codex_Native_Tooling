# Owner Resume Menu v0.2

## Purpose

この menu は、Codex Native Closed Loop の次の作業を安全に再開するための owner 向け確認表である。Codex や ChatGPT が自動で次の task を選んだり、実行したりするための menu ではない。

## Safe Resume Options

| Option | Resume State | Use When | Next Gate |
|---|---|---|---|
| A | READY_FOR_TRIAGE | accepted baseline があり、次の micro task を選ぶ | owner selects one task |
| B | MICRO_SPEC_READY | task は選択済みで、spec review が必要 | owner confirms allowed files |
| C | CODEX_PROMPT_READY | prompt draft がある | owner manually pastes |
| D | RESULT_REVIEW_REQUIRED | Codex result がある | reviewer checks result |
| E | STOP_OWNER_REVIEW_REQUIRED | evidence 不足または boundary risk がある | owner decision |
| F | PAUSED_OWNER_DECISION_REQUIRED | safe next task がない | owner chooses direction |

## Owner Approval Boundaries

Owner が明示承認しない限り、次は行わない。

- commit/push
- worker launch
- real orchestration
- auto-start
- GUI close
- background process
- browser bridge
- ChatGPT prompt sending
- deploy
- runtime/trading/billing/cloud mutation
- PAPER/LIVE/order/cancel/private API/fetch_balance
- GitHub Release/tag/asset upload
- publicization

## Output Encoding Reminder

Final report heading labels must be ASCII-only. Japanese explanations should be placed in UTF-8 artifact files such as `owner_summary_ja.md`, `implementation_summary_ja.md`, and `safe_summary.md`.

`encoding_check.txt` must be generated from Unicode escapes or code points, read back as UTF-8, and compared exactly to the intended Unicode string.

If console Japanese appears corrupted, rely on the UTF-8 artifact files as authoritative.

## Restart Invariants

- worker_session_close_required_after_review_handoff = true
- no_next_worker_until_previous_worker_closed = true
- previous_worker_retired must be true before START_NEXT_IMPLEMENTER
- max_open_implementer_sessions_per_lane = 1
- max_open_reviewer_sessions_per_lane = 1
- max_total_open_worker_sessions_initial = 2
- v0.1 is one-lane-only
- if close/retire confirmation is missing, transition to STOP_OWNER_REVIEW_REQUIRED
