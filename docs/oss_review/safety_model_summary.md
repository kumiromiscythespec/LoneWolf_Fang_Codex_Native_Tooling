# Safety Model Summary

The safety model uses explicit boundaries instead of implicit trust.

## Controls

- phrase-based owner approvals;
- implementer / reviewer / owner separation;
- AppData artifact chain;
- SHA256 sidecars;
- one-lane v0.1;
- stop state for unclear approvals;
- no automatic next worker;
- no prompt sending by default;
- no runtime orchestration by default.

## Forbidden By Default

- publicization;
- OpenAI application submission;
- notification implementation or sending;
- contact detail collection;
- provider integration and credentials;
- local status writer implementation;
- source/runtime implementation;
- Local Orchestrator placement;
- deploy, trading, private API, backtest, replay, sweep, or Monte Carlo.

Publicization requires a future owner decision. OpenAI application submission
requires a future owner decision.
