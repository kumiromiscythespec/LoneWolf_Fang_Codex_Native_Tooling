<!-- BUILD_ID: 2026-07-03_post_merge_closeout_acceptance_reference_consistency_contract_v1 -->

# Post-Merge Closeout Acceptance Reference Consistency Contract

This static contract binds an owner-accepted closeout to its exact closeout artifact, merged PR, squash commit, retained branch, and authoritative next-lane scout. It complements closeout evidence consistency: the earlier contract proves that closeout evidence agrees; this contract proves that later work references the exact accepted result.

READY requires the exact owner phrase, closed/merged/no-runtime lane status, matching squash and remote-master commits, retained branch identity and HEAD, closeout packet SHA and classification, and next-scout SHA, classification, and primary recommendation.

Missing acceptance, mismatched hashes or status, an unrelated scout source, or any forbidden action fails closed. This contract does not authorize Git, GitHub, deploy, runtime, API, auth, billing, trading, private repository, or contracts repository operations. READY is not GO.
