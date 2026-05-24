# Security Rules

Security guidance for the handbook repository and its support files.

## Non-Negotiable Rules

- Do not add secrets, tokens, or credentials to handbook pages, templates, or docs.
- Keep external links explicit and intentional.
- Avoid adding unnecessary remote scripts or tracking snippets.
- Preserve user trust by keeping docs and support files current.

## Repository-Specific Guidance

- Keep the handbook pages focused on content, not executable behavior.
- If a handbook page uses a remote source link, describe it clearly near the top.
- Treat shared UI assets as part of the stable site surface; do not introduce ad hoc theme logic.
- Prefer static, inspectable content over dynamic page behavior.

## Review Checks

- Are there any secrets or private URLs in the new content?
- Do external links point to the intended public source?
- Did the change preserve the shared back button and theme toggle behavior?
- If a workflow doc was added, does it stay recommendation-only unless the repo actually implements it?
