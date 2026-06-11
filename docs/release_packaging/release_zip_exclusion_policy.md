# Release ZIP Exclusion Policy

The future release ZIP must be safe for public template reuse.

## Required Exclusions

Exclude:

- `.git/`;
- `node_modules/`;
- AppData artifacts;
- external handoff ZIPs;
- nested ZIPs;
- build caches;
- production DB dumps;
- raw private logs;
- raw ChatGPT/Codex conversation dumps;
- private project profiles;
- local-only profiles;
- `.env` files;
- API keys;
- tokens;
- provider credentials;
- notification tokens;
- exchange credentials;
- private API payloads;
- billing/order/account identifiers;
- screenshots with private info;
- owner-local required default paths;
- LoneWolf Fang private runtime/profile details.

## Public-template Boundary

The release ZIP should be generated from a reviewed clean public template state,
not from private working artifacts. The bundle is for the public Codex Native
Closed Loop template only.

This policy does not create a release ZIP, tag, GitHub Release, or release
asset upload.
