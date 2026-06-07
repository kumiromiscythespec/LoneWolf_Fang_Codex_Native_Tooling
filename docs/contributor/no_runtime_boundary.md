# No Runtime Boundary

This repository is documentation and safety workflow first. Runtime behavior is
not enabled by default.

Do not run or implement:

- runtime orchestration;
- worker launch;
- prompt sending automation;
- GUI/window close automation;
- local status file writer behavior;
- notification sending;
- deploy or production mutation;
- PAPER or LIVE trading;
- order, cancel, fetch_balance, or private API access;
- backtest, replay, sweep, or Monte Carlo.

These actions require explicit future owner approval for the exact action. A
schema, fixture, prompt draft, or docs page is not execution approval.
