# Architecture Overview

Codex Native Closed Loop v0.1 is a safe AI coding workflow. It is designed to
keep implementation, review, and owner approval separate.

## Core Ideas

- Work starts from a bounded prompt.
- The implementer performs only the approved task.
- The reviewer checks evidence, artifacts, checksums, and safety boundaries.
- The owner makes the next decision.
- Handoff evidence is packaged under AppData with SHA256 sidecars.

## Defaults

The default is no runtime orchestration, no worker launch, no prompt sending
automation, no GUI/window close automation, no notification sending, no
publicization, no OpenAI application submission, no deploy, and no private API
or trading action.

Phase 3 is documentation only:

- public_visibility_changed = false
- openai_application_submitted = false
- notification_implementation_performed = false
- notification_sent = false
- notification_contact_details_collected = false
- notification_provider_integrated = false
- notification_credentials_created = false
- local_status_file_writer_implemented = false
- source_code_implemented = false
- local_orchestrator_files_placed = false
- runtime_execution_occurred = false
