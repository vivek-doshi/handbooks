# Suggested GitHub Workflows

This repository is a static handbook site, so the most useful workflows are lightweight and focused on content quality.

## Implemented Workflows

### `validate-handbooks.yml`
- Trigger: `pull_request` and `push`
- Purpose: confirm handbook HTML files exist, index links resolve, and the handbook count in `index.html` stays in sync.
- Checks to include: HTML parsing, file existence for new cards, and a simple consistency check for README / index updates.

### `content-lint.yml`
- Trigger: `pull_request`
- Purpose: guard handbook style and metadata quality.
- Checks to include: title/description presence, working internal links, and shared UI usage on new handbook pages.

### `deploy-pages.yml`
- Trigger: `push` to `main`
- Purpose: publish the static site to GitHub Pages.
- Checks to include: build or copy the current HTML/CSS/JS assets into the Pages output directory.

## Recommended Next Step

- Add `deploy-pages.yml` when you want the static site deployment automated in GitHub Actions.

## Notes

- Keep workflow jobs short and deterministic.
- Prefer validation over heavy build steps because the repo is static HTML.
- If a workflow is added later, keep it aligned with the handbook card/update flow in `index.html`.