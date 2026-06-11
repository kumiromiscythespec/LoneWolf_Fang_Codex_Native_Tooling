# Private Content Risk Map

Private content risks must be removed or summarized before publicization.

## High-Risk Content

- secrets, tokens, keys, credentials, and auth payloads;
- raw private logs and raw conversation dumps;
- provider credentials and notification tokens;
- contact details;
- private API payloads;
- billing, order, account, and exchange identifiers;
- screenshots with private information;
- source strategy internals or product-private operational details;
- external artifact ZIP payloads.
- owner-local paths, personal username paths, and private project roots used as
  public setup defaults.

## Handling

Use safe summaries, redacted placeholders, and owner review. Do not convert a
private artifact or conversation into public documentation by copying it into
the repo.

Use public-template placeholders such as `<REPO_ROOT>`, `<PROJECT_ROOT>`,
`<ARTIFACT_ROOT>`, `<PROJECT_PROFILE>`, and `<OWNER_REVIEW_PACKET_ROOT>` when a
path or profile is needed in public docs.
