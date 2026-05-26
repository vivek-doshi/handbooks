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

### `handbook-review-check.yml`
- Trigger: weekly schedule, `pull_request`, `push`, and manual dispatch.
- Purpose: keep handbook review tracking current and flag overdue reviews.
- Checks to include: registry sync (`scripts/handbook_review_audit.py --sync`), committed-registry enforcement, and overdue audit (`--audit`).

### `handbook-overdue-issue.yml`
- Trigger: weekly schedule (Monday) and manual dispatch.
- Purpose: open or update a GitHub issue when handbook reviews are overdue.
- Behavior: creates/updates a single rolling issue with the overdue table; auto-closes it when no overdue entries remain.

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