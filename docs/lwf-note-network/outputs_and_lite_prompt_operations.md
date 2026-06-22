# LWF Note Network Outputs and Lite Prompt Operations

## Purpose

This note records the stable LWF-NOTE-NETWORK output and prompt-operation contract observed in the owner workflow. It is a docs/schema/tests/fixtures contract for scout and review support only.

This is not runtime approval. This is not deploy approval. This is not approval for API, cloud, auth, billing, or trading mutation.

## Output Root Contract

The NOTE output root is:

```powershell
C:\LWF_NoteNetwork\outputs
```

AppData packet roots are for owner handoff artifacts only. They are not the NOTE runtime output root.

## Current Node Mapping

| Node | Host | URL |
| --- | --- | --- |
| LWF-NOTE-01 | 192.168.50.12 | http://192.168.50.13:11434 |
| LWF-NOTE-02 | 192.168.50.12 | http://192.168.50.14:11434 |
| LWF-NOTE-03 | 192.168.50.12 | http://192.168.50.15:11434 |
| LWF-NOTE-04 | 192.168.50.12 | http://192.168.50.16:11434 |
| LWF-NOTE-05 | 192.168.50.12 | http://192.168.50.17:11434 |

## Known Full-Prompt Failure

A full scout_plan around 15k chars, observed at about 15,763 chars, produced HTTP 400 Bad Request on all five nodes. A UTF-8 body retry still failed for the full scout_plan.

The NOTE group should not receive full Codex-sized prompts as the default operation mode.

## Lite-Prompt Success

A lite scout prompt around 4,364 chars passed on all five nodes. The stable model observed for this lane is:

```text
llama3.2:3b
```

## Recommended Prompt Size

Use lite or compressed plans for NOTE group prompts. The recommended prompt size is 4,000 to 6,000 chars.

## Stable Diagnostic Observations

All five nodes passed these diagnostics in the owner workflow:

- Ping
- /api/tags
- smoke generate
- lite scout generate

The observed success is diagnostic evidence for scout/review support. It is not proof of autonomous execution readiness.

## Safety Boundary

The NOTE group is scout/review support only. Autonomous execution is not allowed.

Forbidden actions remain forbidden unless the owner gives a separate explicit approval:

- runtime workflow
- deploy
- API mutation
- cloud mutation
- auth mutation
- billing mutation
- trading mutation
- OpenAI API call
- private API call
- queue mutation
- public submission

## Example PowerShell Node Map

```powershell
$NoteNodes = @(
  @{ Name = "LWF-NOTE-01"; Host = "192.168.50.12"; Url = "http://192.168.50.13:11434" },
  @{ Name = "LWF-NOTE-02"; Host = "192.168.50.12"; Url = "http://192.168.50.14:11434" },
  @{ Name = "LWF-NOTE-03"; Host = "192.168.50.12"; Url = "http://192.168.50.15:11434" },
  @{ Name = "LWF-NOTE-04"; Host = "192.168.50.12"; Url = "http://192.168.50.16:11434" },
  @{ Name = "LWF-NOTE-05"; Host = "192.168.50.12"; Url = "http://192.168.50.17:11434" }
)
```

## Artifact and Output Expectations

- NOTE outputs belong under `C:\LWF_NoteNetwork\outputs`.
- Owner handoff packets may be created under AppData, but AppData is not the NOTE output root.
- Contract fixtures should preserve the observed node mapping, prompt-size behavior, and safety boundary.
- Evidence artifacts should avoid secrets, raw auth data, billing data, API keys, node_modules, `.git`, build caches, production database dumps, nested ZIP files, or large exports.

## Must Not Do

- Do not treat a full scout_plan as the default NOTE prompt.
- Do not route NOTE outputs to AppData as the NOTE output root.
- Do not approve autonomous execution from scout diagnostics.
- Do not perform runtime, deploy, API, cloud, auth, billing, or trading mutation.
- Do not call OpenAI APIs or private APIs.
- Do not submit externally or change public visibility from this lane.

## Owner-Gated Next Actions

The owner must separately approve any move beyond docs/schema/tests/fixtures review. Commit, push, PR, deploy, runtime, cloud/API/auth/billing/trading mutation, and public submission remain owner-gated.
