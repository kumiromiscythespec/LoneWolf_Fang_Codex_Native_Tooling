# Project Profile Template

This public repo does not include a private downstream project profile.

Create a project profile outside the public repo, or use an ignored local file
only after that pattern is explicitly approved for your project.

## Template

```text
project_name: <PROJECT_NAME>
repo_root: <REPO_ROOT>
project_root: <PROJECT_ROOT>
artifact_root: <ARTIFACT_ROOT>
owner_review_packet_root: <OWNER_REVIEW_PACKET_ROOT>

rule_files:
  - <RULE_FILE_1>
  - <RULE_FILE_2>

default_allowed_scope:
  - read-only inspection
  - docs-only edits
  - schema/docs/fixtures-only edits
  - artifact handoff generation

default_forbidden_scope:
  - commit or push without explicit approval
  - public visibility change without explicit owner action
  - notification implementation or sending
  - runtime, deploy, private API, trading, or backtest execution
  - secrets, raw logs, raw conversations, or provider credentials output

approval_phrases:
  docs_only: <APPROVAL_PHRASE_FOR_DOCS_ONLY>
  commit: <APPROVAL_PHRASE_FOR_COMMIT_ONLY>
  push: <APPROVAL_PHRASE_FOR_PUSH_ONLY>
```

Replace every placeholder with your own local environment. Do not copy private
product rules or owner-local paths into this public repository.
