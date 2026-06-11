# Public Template Vs Private Project

## Public Template Layer

The public template layer is for visitors and external users. It explains:

- how to choose `<REPO_ROOT>`;
- how to choose `<PROJECT_ROOT>`;
- how to choose `<ARTIFACT_ROOT>`;
- how to write `<PROJECT_PROFILE>`;
- how to adapt starter prompts;
- how to keep generated artifacts outside the repo;
- how to avoid committing private profiles, secrets, raw logs, raw
  conversations, and personal local paths.

## Private Project Profile Layer

A private downstream project may define:

- project-specific rule files;
- product-specific naming rules;
- approval phrases;
- local artifact paths;
- operational boundaries;
- private repo layouts.

Those details are not public template requirements. Keep them outside the
public repo or in ignored local files only after that pattern is separately
approved.

This public repo is not a runtime, trading bot, deploy tool, notification
sender, or private workflow executor.
