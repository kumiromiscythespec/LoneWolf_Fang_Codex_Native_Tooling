# Approval Gate Model

Approval phrases approve only the exact scope named in the phrase.

Separate approvals are required for:

- docs-only implementation;
- commit;
- push;
- public visibility review;
- OpenAI Codex for OSS application draft;
- OpenAI Codex for OSS application submission;
- notification implementation or sending;
- contact handling or provider integration;
- local status writer implementation;
- Local Orchestrator placement;
- runtime, deploy, private API, trading, backtest, replay, sweep, or Monte
  Carlo work.

Danger words in a forbidden-action list are warnings for review, not automatic
execution approval. If an approval is unclear, stop with:
`Stop and Wait - Owner Review Required.`
