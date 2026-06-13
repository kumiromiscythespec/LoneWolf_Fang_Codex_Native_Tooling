<!-- BUILD_ID: 20260613_single_shot_supervised_dry_run_readiness_map_v1 -->
# Single-Shot Evidence Lane Plan

The evidence lane links the approval packet, future implementation files, static tests, and AppData evidence packet into one reviewable chain.

## Evidence Order

1. Confirm the baseline commit and local origin/master without fetch or pull.
2. Confirm the exact owner approval phrase for docs/schema/tests/fixtures-only implementation.
3. Confirm the owner approval is fresh, not superseded, and bound to the readiness-map target scope.
4. Confirm every changed path is in the exact 35-file allowlist, with no wildcard, broad, unbounded, ambiguous, or runtime/source/cloud/billing/trading scope.
5. Confirm the approval packet, stable closeout packet, implementation artifact, and implementation review artifact SHA256 chain is present.
6. Confirm every changed file carries the required BUILD_ID or readiness BUILD_ID marker.
7. Confirm the readiness record has a blocker matrix that matches the readiness decision.
8. Run static tests only.
9. Create AppData evidence ZIP and sidecars.
10. Stop for owner review.

## Exclusions

This lane never starts runtime workflows, workers, daemon/watchers, schedulers, queue execution, UI automation, deploys, APIs, cloud mutation, billing, trading, or order actions.

## Rejection Outputs

The lane returns `STOP_OWNER_REVIEW_REQUIRED` when approval is missing, empty, wrong, stale, superseded, or bound to the wrong scope; when the allowlist broadens; when BUILD_ID markers drift; when artifact references or hashes are missing; when a blocker matrix is missing or inconsistent; when duplicate active artifacts appear; or when unsafe operations appear in any future prompt or record.
