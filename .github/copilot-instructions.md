# Copilot Instructions

Read `.ai/README.md` first, then the files under `.ai/context/` and `.ai/instructions/` before making repo changes.

## Current Repo Shape

- This repo is a static handbook site published with GitHub Pages.
- `index.html` is the central catalog page.
- Topic handbooks live in domain folders such as `python/`, `devops/`, `cloud/`, and `ai-frameworks/`.
- Shared handbook UI lives in `styles/shared-ui.css` and `scripts/handbook-ui.js`.
- Most handbook pages should include the floating back button and theme toggle, and the icons must stay visible in both themes.

## Editing Rules

- Update `index.html` when a new handbook card is added or moved.
- Keep the handbook total in `index.html` aligned with the visible card count.
- Update `README.md` and `.ai/` guidance when repo structure or handbook conventions change.
- Keep filenames lowercase and kebab-cased unless an existing convention already exists.
- Prefer targeted edits over broad refactors.

## Content Rules

- Keep handbook content concise, practical, and easy to scan.
- Favor direct references, working examples, and explicit paths over long prose.
- When a handbook page links to external detail, add that link near the top so readers see the source immediately.
- Preserve the established visual style of each handbook family.

## Validation

- Check edited HTML for obvious structural errors.
- Confirm that shared floating controls still render and that theme switching works.
- Verify any new handbook card points to an existing page.