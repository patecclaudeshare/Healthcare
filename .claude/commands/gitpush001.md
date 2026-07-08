---
description: Security-scan, then push to GitHub, deploy Pages via Actions, refresh README, and update repo About with the live link
---

Run the following steps in order for this repository. Do not skip step 1, and do not proceed past it if it finds anything sensitive.

## 1. Security scan (BEFORE staging or committing anything)

- Check `git status` for all changed/untracked files that would be added.
- Scan those files (and the working tree generally) for secrets and sensitive data: API keys, access tokens, passwords, private keys (`BEGIN...PRIVATE KEY`), connection strings, cloud credentials (AWS/GCP/Azure), `.env` files, personal data, internal-only URLs or hostnames.
- Verify `.gitignore` exists and excludes typical sensitive paths (`.env*`, credentials, key files, `node_modules`, etc.). Create or update it if missing or incomplete.
- If anything sensitive is found: STOP. Report exactly what and where to the user. Do not commit or push until it's removed, rotated, or gitignored and the user confirms it's safe to proceed.
- If clean, briefly confirm to the user that the scan passed before continuing.

## 2. Push code to GitHub

- Run `git status` / `git diff` to see what changed.
- Stage the legitimate changes and commit with a clear, descriptive message (not "update" or "fix").
- Push to `origin` on the current branch (or `main` if that's the repo's default). If there's no remote configured, ask the user for the GitHub repo URL before proceeding — don't guess or invent one.

## 3. Create/update GitHub Pages via GitHub Actions

- Ensure `.github/workflows/*.yml` has a workflow that deploys the static site to GitHub Pages using `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`, triggered on push to the main branch (plus `workflow_dispatch`). Create it if missing; update it if the project layout changed.
- Use the `gh` CLI to confirm Pages is enabled with `build_type: workflow` (`gh api repos/{owner}/{repo}/pages`). If it's not enabled or misconfigured, enable it (`gh api -X POST repos/{owner}/{repo}/pages -f build_type=workflow`).
- After pushing, verify the workflow actually ran and succeeded (`gh run list`, `gh run view`), and fetch the live Pages URL to confirm it renders the expected content (not a 404).

## 4. Create/edit a professional README

- Read the actual current project files (don't rely on assumptions or stale context) and write/update `README.md` at the repo root to cover: what the project is, the live site link, tech stack, how to run/preview it locally, project structure, and how deployment works.
- Keep it accurate and concise — no filler, no placeholder sections.

## 5. Update the GitHub repo "About" section

- Use `gh repo edit <owner>/<repo> --description "<concise one-line description>" --homepage "<live GitHub Pages URL>"` to set the repo description and homepage link.
- Confirm the change with `gh repo view <owner>/<repo> --json description,homepageUrl`.

## General notes

- If `git` or `gh` aren't installed/authenticated, install via winget and walk the user through any interactive login (e.g. `gh auth login --web`) — this requires the user to approve in their browser, it can't be done silently.
- Confirm with the user before any destructive or hard-to-reverse action (force-push, history rewrite, deleting branches).
- End with a short summary of what changed at each step and links to the commit, workflow run, and live site.
