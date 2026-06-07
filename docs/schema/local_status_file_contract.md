# Local Status File Contract

## Purpose

`schema/local_status_file.schema.json` defines a contract for a future local status file concept:

`status/owner_attention_required.json`

This task does not create that status file. The schema describes artifact-only / local status file first evidence for manual owner review or a future separately approved watcher.

## What It Permits

- Recording the current status.
- Referencing the latest owner attention event.
- Linking a safe artifact name and SHA256.
- Naming a safe next action label.
- Carrying the stop message `Stop and Wait - Owner Review Required.`
- Confirming the status file is read-only evidence, not a runtime trigger, not a notification sender, and not auto-continue permission.

## What It Forbids

The contract forbids secrets, contact details, provider credentials, raw logs, raw conversations, private payloads, and runtime instructions. It uses `additionalProperties: false` to avoid accidental payload expansion.

## What Must Not Be Inferred

- schema existence does not authorize notification sending
- schema existence does not authorize local status writer implementation
- schema existence does not authorize runtime orchestration
- schema existence does not authorize worker launch
- schema existence does not authorize prompt sending automation
- schema existence does not authorize publicization or OpenAI application submission

## Phase 2B Safety Flags

- notification_implementation_performed = false for this phase
- notification_sent = false for this phase
- notification_contact_details_collected = false for this phase
- notification_provider_integrated = false for this phase
- notification_credentials_created = false for this phase
- local_status_file_writer_implemented = false for this phase
- source_code_implemented = false for this phase

## Future Approval Gate

A future local status file writer requires separate owner approval. A future watcher or notification adapter requires separate owner approval. Until then, the contract is documentation and schema evidence only.
