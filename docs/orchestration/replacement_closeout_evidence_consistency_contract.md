<!-- BUILD_ID: 2026-07-08_replacement_closeout_evidence_consistency_contract_v1 -->

# Replacement Closeout Evidence Consistency Contract

This static contract binds a replacement-PR closeout chain to its exact evidence: the merged replacement PR, the superseded original PR close, the remote master commit, retained branch references, and the owner-approved transition to the next safe lane.

READY requires PR #13 to be merged at the exact merge commit, PR #12 to be closed but not merged, origin/master to match the replacement merge commit, both retained branch references to remain explicit evidence rather than default cleanup, and the next safe lane scout approval phrase to point back to this completed closeout.

Branch deletion is never a default closeout action. Any missing superseded PR close link, missing retained branch evidence, mismatched merge commit, or forbidden runtime/deploy/API/auth/billing/trading/private/contracts action fails closed. This contract is docs/schema/tests/fixtures only and does not authorize Git, GitHub, deploy, runtime, API, auth, billing, trading, private repository, or contracts repository operations. READY is not GO.
