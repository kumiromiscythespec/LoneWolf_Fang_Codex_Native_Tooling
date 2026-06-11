# ChatGPT / Codex Role Split v0.1

## ChatGPT の役割

ChatGPT は commander、reviewer、micro task designer として使う。

- context を読む
- owner intent を短い micro task に分解する
- State / Event / Guard / Action / Next State を明確にする
- Codex prompt draft を作る
- Codex result を review する
- unsafe next step を stop state に送る

ChatGPT は owner approval を代替しない。ChatGPT が would_continue=true と書いても、real auto-start permission ではない。

## Codex の役割

Codex は thin executor である。

- current prompt の allowed scope だけを処理する
- allowed_files だけを見る
- forbidden_files と safety boundary を守る
- success criteria に対応する static checks を行う
- result と artifact を作る

Codex must not infer next task。Codex must not inspect unrelated files。Codex must not expand scope。

## Owner Gate

Owner は high-risk action の唯一の承認者である。

- owner_review_required=false does not mean owner execution approval
- next_prompt_ready=true only means a text draft exists
- next_implementer_start_allowed remains false unless separately approved
- worker_launch_allowed remains false unless separately approved
- prompt_sending_allowed remains false unless separately approved
- real_orchestration_allowed remains false unless separately approved

## Worker Boundary

v0.1 は one-lane-only の static design である。

- worker_session_close_required_after_review_handoff = true
- no_next_worker_until_previous_worker_closed = true
- previous_worker_retired must be true before START_NEXT_IMPLEMENTER
- max_open_implementer_sessions_per_lane = 1
- max_open_reviewer_sessions_per_lane = 1
- max_total_open_worker_sessions_initial = 2
- if close/retire confirmation is missing, transition to STOP_OWNER_REVIEW_REQUIRED

この repository slice は worker を launch しない。browser bridge を実行しない。ChatGPT prompt を送信しない。file upload もしない。
