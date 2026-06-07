# Problem Statement

AI coding workflows can move too quickly from prompt to implementation, and from
implementation to the next action. In high-risk contexts, that can blur owner
approval, review, artifact identity, and safety boundaries.

Codex Native Closed Loop v0.1 addresses this by making the workflow explicit:

- bounded task prompt;
- implementer result;
- reviewer check;
- AppData evidence packet;
- SHA256 verification;
- one owner decision point;
- separate approvals for commit, push, publicization, application submission,
  notification work, and runtime work.

The project is designed to make safe stopping easy.
