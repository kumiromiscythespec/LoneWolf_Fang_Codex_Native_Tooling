<!-- BUILD_ID: 20260613_single_shot_supervised_dry_run_readiness_map_v1 -->
# Next Safe Parallel Wave Coverage Matrix

The coverage matrix maps each allowlisted file to one static purpose.

## Coverage Categories

- Docs: describe readiness scope, owner gates, no-runtime boundary, packet integrity, and rollback.
- Schema: validate readiness records, owner freshness, packet manifests, sidecars, coverage rows, and collision records.
- Tests: load schemas, validate fixtures, check docs, verify BUILD_ID markers, and prove fail-closed blockers.
- Fixtures: provide synthetic valid and invalid evidence only, including missing owner approval, broad scope, missing artifact chain, unknown readiness decision, blocker matrix, and stable-baseline binding cases within the approved 15 fixture paths.

## Pass Condition

Coverage passes when every allowlisted path is represented, every fixture is synthetic, every invalid case reaches `STOP_OWNER_REVIEW_REQUIRED`, owner approval and artifact chain evidence are required, blocker matrix evidence is decision-consistent, stable baseline identity is fixed, and no file implies runtime, deploy, API, cloud, billing, trading, daemon, watcher, scheduler, queue execution, UI automation, or automatic continuation permission.
