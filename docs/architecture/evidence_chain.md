# Evidence Chain

The evidence chain is the review trail between phases.

## Typical Chain

1. Approved bounded prompt.
2. Implementer result.
3. Safe artifact packet under AppData.
4. SHA256 sidecars.
5. Reviewer packet.
6. Owner decision point.
7. Future prompt draft.

Each phase should verify the previous artifact path and SHA256 before using it
as input. Artifact contents should be safe summaries, manifests, checksum
records, changed file lists, validation summaries, and next prompts.

## Exclusions

Evidence packets must not contain secrets, raw private logs, raw conversations,
private API payloads, provider credentials, notification tokens, contact
details, `.git`, `node_modules`, nested ZIPs, or production database dumps.
