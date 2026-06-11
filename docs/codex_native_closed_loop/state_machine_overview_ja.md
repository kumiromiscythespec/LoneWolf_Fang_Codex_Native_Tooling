# State Machine Overview v0.1

## 目的

Codex Native Closed Loop v0.1 は、あいまいな while loop や自律 agent ではなく、明示的な state machine として扱う。

各 step は次の 5 要素で記録する。

- State
- Event
- Guard
- Action
- Next State

この設計は静的 design slice であり、real orchestration、worker launch、auto-start、background process、runtime mutation を実行しない。

## 役割

ChatGPT は commander、reviewer、micro task designer として、context を読み、micro task と review point を作る。

Codex は thin executor として、許可された file set と success criteria の範囲だけを処理する。Codex は次 task を自由に推測しない。Codex は unrelated files を検査しない。Codex は scope を拡張しない。

Owner approval は別 gate であり、ChatGPT output や Codex output では代替できない。

## State Machine が loop を置き換える理由

Loop という表現は、失敗時 retry、次 worker の開始、window close、prompt send が自動化されるように見える危険がある。v0.1 では、failure は必ず明示状態に移る。

- REPAIR_REQUIRED
- REJECTED_FOR_SAFETY
- STOP_OWNER_REVIEW_REQUIRED
- PAUSED_OWNER_DECISION_REQUIRED

no ambiguous while loop。no uncontrolled retry loop。no worker auto-start。

## Core Static Files

| File | Role |
|---|---|
| state.json | current_state、allowed_next_states、safety flags、evidence refs を保持する |
| transition_table.json | State / Event / Guard / Action / Next State の許可表を保持する |
| task_queue.json | micro task goal、allowed_files、forbidden_files、next_action を保持する |
| reason_log.jsonl | transition decision の audit trail を JSONL で保持する |
| next_codex_prompt.md | owner が手動 review する Codex prompt draft を保持する |
| chatgpt_review.md | ChatGPT reviewer が result、scope、safety boundary、次 decision point を要約する |

これらは v0.1 では static contract files として扱う。executable orchestrator ではない。

## Required States

| State | Purpose | Owner Review |
|---|---|---|
| PAUSED_NO_CREDITS | ChatGPT credits 等の制約で manual work を待つ | yes |
| READY_FOR_TRIAGE | ChatGPT が context を review できる | yes |
| TASK_SELECTED | 1 つの micro task が選ばれた | yes |
| MICRO_SPEC_READY | allowed files、forbidden files、success criteria が固定された | yes |
| CODEX_PROMPT_READY | next_codex_prompt.md の draft がある | yes |
| CODEX_RUNNING | Owner が Codex に paste した後の実行中状態を表す記録上の状態 | yes |
| RESULT_REVIEW_REQUIRED | Codex result の review が必要 | yes |
| BASELINE_ACCEPTED | Owner または reviewer が scope と checks を受け入れた | yes |
| REPAIR_REQUIRED | tests failed 等により repair prompt が必要 | yes |
| REJECTED_FOR_SAFETY | forbidden file touched 等で reject | yes |
| STOP_OWNER_REVIEW_REQUIRED | 判断不能または gate 不足で停止 | yes |
| PAUSED_OWNER_DECISION_REQUIRED | safe next task がない、または owner 判断待ち | yes |

## Safety Invariants

- worker_session_close_required_after_review_handoff = true
- no_next_worker_until_previous_worker_closed = true
- previous_worker_retired must be true before START_NEXT_IMPLEMENTER
- max_open_implementer_sessions_per_lane = 1
- max_open_reviewer_sessions_per_lane = 1
- max_total_open_worker_sessions_initial = 2
- v0.1 is one-lane-only
- if close/retire confirmation is missing, transition to STOP_OWNER_REVIEW_REQUIRED
- would_continue=true is not equivalent to real auto-start permission
- owner_review_required=false does not mean owner execution approval
- next_prompt_ready=true only means a text draft exists
- next_implementer_start_allowed remains false unless separately approved
- worker_launch_allowed remains false unless separately approved
- prompt_sending_allowed remains false unless separately approved
- real_orchestration_allowed remains false unless separately approved

## Forbidden Boundary

この design slice では、worker launch、real orchestration、auto-start、GUI close、real retirement、background agent、deploy、runtime/trading/billing/cloud mutation、PAPER/LIVE/order/cancel/private API/fetch_balance、commit/push は実施しない。current prompt で明示承認されない限り、これらは forbidden action である。
