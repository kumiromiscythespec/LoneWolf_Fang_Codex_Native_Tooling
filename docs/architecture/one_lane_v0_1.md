# One-Lane v0.1

v0.1 is one-lane-only.

Required invariants:

- worker_session_close_required_after_review_handoff = true
- no_next_worker_until_previous_worker_closed = true
- previous_worker_retired must be true before START_NEXT_IMPLEMENTER
- max_open_implementer_sessions_per_lane = 1
- max_open_reviewer_sessions_per_lane = 1
- max_total_open_worker_sessions_initial = 2
- v0.1 is one-lane-only
- if close/retire confirmation is missing, stop with:
  Stop and Wait - Owner Review Required.

Additional meanings:

- would_continue=true is not equivalent to real auto-start permission
- owner_review_required=false does not mean owner execution approval
- next_prompt_ready=true only means a text draft exists
- next_implementer_start_allowed remains false unless separately approved
- worker_launch_allowed remains false unless separately approved
- prompt_sending_allowed remains false unless separately approved
- real_orchestration_allowed remains false unless separately approved

No next worker starts automatically in this documentation baseline.
