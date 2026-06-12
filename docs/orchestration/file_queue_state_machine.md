<!-- BUILD_ID: 20260612_file_queue_state_machine_v1 -->
# File Queue State Machine

## State List

The file queue state machine uses these states:

- `READY`
- `CLAIMED`
- `RUNNING`
- `NEEDS_OWNER_APPROVAL`
- `BLOCKED`
- `DONE`
- `FAILED_SAFE`
- `ARCHIVED`

The states describe reviewable file status only. They do not start workers, run queue logic, execute Codex, automate ChatGPT or Codex UI, or perform runtime work.

## Allowed Transitions

The baseline transition model is intentionally small:

| From | To |
| --- | --- |
| `READY` | `CLAIMED` |
| `CLAIMED` | `RUNNING` |
| `RUNNING` | `DONE` |
| `RUNNING` | `BLOCKED` |
| `RUNNING` | `FAILED_SAFE` |
| `RUNNING` | `NEEDS_OWNER_APPROVAL` |
| `NEEDS_OWNER_APPROVAL` | `READY` |
| `NEEDS_OWNER_APPROVAL` | `ARCHIVED` |
| `BLOCKED` | `NEEDS_OWNER_APPROVAL` |
| `FAILED_SAFE` | `NEEDS_OWNER_APPROVAL` |
| `DONE` | `ARCHIVED` |

Each state file must record `previous_state`, `state`, `allowed_next_states`, `event`, `timestamp`, `owner_review_required`, and `stop_reason`.

## Illegal Transition Examples

These transitions are illegal in the static contract:

- `READY` directly to `RUNNING`
- `READY` directly to `DONE`
- `CLAIMED` directly to `DONE`
- `DONE` back to `RUNNING`
- `ARCHIVED` to any active state

The invalid fixture `state_illegal_transition.json` covers the direct `READY` to `RUNNING` case.

## STOP_OWNER_REVIEW_REQUIRED Behavior

The file queue result status `STOP_OWNER_REVIEW_REQUIRED` is required when the task boundary is unclear, a required artifact or checksum is missing, an unsafe transition appears, a forbidden action is requested, or a file outside the owner-approved allowlist is needed.

Owner review is also required when a queue state would imply hidden runtime execution, worker launch, Codex CLI automation, browser automation, ChatGPT or Codex UI automation, provider access, deploy, PAPER or LIVE trading, order placement, cancel, fetch_balance, private API access, billing mutation, cleanup, reset, restore, git clean, or force push.
