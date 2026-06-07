# Implementer / Reviewer / Owner Workflow

Codex Native Closed Loop v0.1 separates work into three human-readable roles.

## Implementer

The implementer performs only the currently approved bounded task. Before work,
the implementer states assumptions, unclear points, success criteria, planned
touched files, must-not-touch files, and safety boundaries.

## Reviewer

The reviewer inspects the result, changed file list, artifact metadata,
checksums, validation summary, safety boundary status, and `NEXT_CODEX_PROMPT.md`.
The reviewer should look for overreach, missing tests or checks, dangerous
defaults, and unclear owner decisions.

## Owner

The owner makes the final GO / revise / stop decision. The owner should see one
clear decision point. Implementation approval, commit approval, push approval,
publicization approval, OpenAI application approval, notification approval, and
runtime approval remain separate.

If closure or retirement is unclear, stop with:
`Stop and Wait - Owner Review Required.`
