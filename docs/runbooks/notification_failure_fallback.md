# Notification Failure Fallback

Status: Phase 2A docs-only design

Future notification may fail or may be unavailable. Failure must not authorize
unsafe continuation.

## Known Failure Cases

- ChatGPT app notification may not be officially accessible.
- Email providers may be unavailable or disabled.
- SMS providers may be unavailable or disabled.
- Contact details may not be configured.
- Provider credentials may be absent.
- Rate limits or cooldowns may suppress repeated alerts.

## Required Fallback

The fallback is artifact-only:

1. Write or preserve a safe local artifact/status summary.
2. Include only redacted metadata.
3. Create an artifact ZIP under `<ARTIFACT_ROOT>` when a handoff is needed.
4. Record one human review point.
5. Stop with:

```text
Stop and Wait - Owner Review Required.
```

## No Retry Storm

Future notification adapters must prevent retry storms. They need rate limits,
cooldowns, and duplicate suppression. Infinite notification loops are
forbidden.

## Manual Inspection

The owner can inspect artifacts manually under the project-specific artifact
root:

```text
<ARTIFACT_ROOT>
```

Artifact identity should be checked by ZIP path, entry count, and SHA256
sidecar.

## Boundary

For this phase:

- notification_implementation_performed = false for this phase
- notification_sent = false for this phase
- notification_contact_details_collected = false for this phase
- notification_provider_integrated = false for this phase
- notification_credentials_created = false for this phase
- future implementation requires separate approval
- future sending requires separate approval
- future contact detail handling requires separate approval
- no sensitive content in notifications
