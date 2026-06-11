# Migration From Private Project Paths

Use this checklist when a private project path appears in public-facing docs.

## Replace Required Defaults

- Replace personal user directories with `<ARTIFACT_ROOT>` or `<PROJECT_ROOT>`.
- Replace private repo roots with `<PROJECT_ROOT>` or `<REPO_ROOT>`.
- Replace downstream product profile names with `<PROJECT_PROFILE>`.
- Replace owner review packet folders with `<OWNER_REVIEW_PACKET_ROOT>`.

## Keep Only Safe Boundary Mentions

Some private names may remain only as clearly labeled boundary examples, such
as "do not mutate another product repo" or "private downstream profiles are not
included." Prefer placeholders whenever possible.

## Validate

Before treating the repo as public-template ready, scan for:

- owner-local path defaults;
- personal username paths;
- private project roots used as required setup;
- hardcoded artifact roots;
- publicization claims that bypass owner manual review;
- OpenAI application submission claims;
- runtime, notification, deploy, or private API claims.

If any item is uncertain, stop with:

```text
Stop and Wait - Owner Review Required.
```
