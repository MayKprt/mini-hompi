# Editing and publishing the full mini hompi

This repository is the editable React + TypeScript source for the **full mini hompi**. The separately hosted portfolio embed is independent; do not publish this repository to its Sites project or run `scripts/prepare-embed.mjs` as part of a full-site release.

## Local editing

Use Node.js 24 and pnpm 10.11.0. Clone the repository, run `pnpm install --frozen-lockfile`, then `pnpm dev`. Edit application code in `src/` and assets in `public/assets/`.

Before publishing, run `pnpm run typecheck`, `pnpm test`, `pnpm run build`, and `pnpm run test:sites`. The existing Sites packaging files are retained for portability; Vercel serves `dist/client`.

## Review before release

1. Create a branch for a change and push it to GitHub.
2. Open a pull request into `main`. Vercel creates a Preview Deployment, and GitHub Actions runs verification.
3. Review the preview on desktop and mobile, including room movement, sofa/lamp/window interactions, decorating, tabs, and music controls.
4. Merge the reviewed pull request into `main` to publish to the same production URL. Vercel also runs the checks as part of its build, so a failed check prevents a new release.

Keep `main` for approved releases. Branch previews do not replace production. A previous Vercel deployment can be restored from the Vercel dashboard if a rollback is needed.

## Prototype storage

Room settings, diary entries, visitor messages, and reactions are stored in each visitor's browser. Local prototype data does not transfer automatically to the production origin; there is no shared social backend.
