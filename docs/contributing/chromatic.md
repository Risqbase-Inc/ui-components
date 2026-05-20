# Chromatic — visual regression for `@risqbase-inc/ui-components`

This doc covers how Chromatic is wired into this repo, how to operate it day-to-day, and how to rotate the project token. The user-facing review flow lives in the package [`README.md`](../../README.md#visual-regression).

## Status

- Chromatic project: `risqbase-ui-components` (org account).
- Project token: stored as `CHROMATIC_PROJECT_TOKEN` in GitHub repo secrets.
- Workflow: [`.github/workflows/chromatic.yml`](../../.github/workflows/chromatic.yml).
- Triggered on `push` to `main` and on every `pull_request` against `main`.
- Branch protection: `Chromatic` is a required status check on `main` (see "Branch protection" below).

## Wiring (one-time)

These items can't be set from inside a PR — a maintainer with repo admin needs to land them once via the GitHub / Chromatic UIs.

1. **Create the Chromatic project.** From [chromatic.com](https://chromatic.com), sign in with the org GitHub account, "Add project", point at `Risqbase-Inc/ui-components`. Project name: `risqbase-ui-components`.
2. **Copy the project token.** Chromatic shows it on the "Manage" tab of the new project. It's a long hex string. Treat it like a password.
3. **Add the token to repo secrets.** `Settings → Secrets and variables → Actions → New repository secret`. Name: `CHROMATIC_PROJECT_TOKEN`. Value: the token from step 2.
4. **Enable branch protection.** `Settings → Branches → Add branch ruleset` for `main`. Required status checks: add `Chromatic`. Require PRs to be up-to-date before merging.
5. **Push to `main` once.** The first merge to `main` after the workflow lands locks the canonical baseline. Spot-check the run: snapshot count should land near 25 components × ~3 stories × 3 themes ≈ 200 snapshots (Chromatic counts each theme/mode permutation separately). If significantly lower, a story is being skipped — investigate before the baseline locks.

## Token rotation

Chromatic project tokens are scoped to a single project; rotating them is cheap. Rotate any time someone with access to the secret leaves the team, or if the token is ever pasted somewhere it shouldn't be (a public log, a screenshot).

1. In Chromatic: `Manage → Configure → Regenerate project token`. Chromatic shows the new token once.
2. In GitHub repo settings: `Settings → Secrets and variables → Actions → CHROMATIC_PROJECT_TOKEN → Update`. Paste the new token.
3. Re-run the latest workflow on `main` to confirm the new token works. The next push will use the new value automatically.

Old tokens stop working the moment the new one is generated — there's no grace period. If a PR is mid-run when the token rotates, it'll fail; re-running the job picks up the new secret.

## Day-to-day operation

### Adding a new component

1. Land the component with `index.tsx`, `types.ts`, `tokens.md`, `accessibility.md`.
2. Add a `<Name>.stories.tsx` with at least: a `Default` story, a `Variants` story (or equivalent), and a `Gallery` story for the print snapshot. Use `parameters: { chromatic: { modes: { print: { media: 'print' } } } }` for the print variant.
3. Open the PR. Chromatic posts a comment with the visual-diff URL. The first PR run for a new component will register *all* new snapshots — those are not "diffs"; they're new baselines waiting for first approval.

### Reviewing a Chromatic comment

Every PR gets a Chromatic comment that links to a review URL. Click through. The UI shows:
- **Changed snapshots** — side-by-side, before vs after. Approve if intended, deny if not.
- **New snapshots** — first time we've seen this story/mode. Approve to register as the new baseline.
- **Errors** — story failed to render. Fix locally, push again.

Approve sparingly. Every approved change becomes the new "before" picture for the next PR; if you approve a regression, the next PR will think the regression is correct.

### Disabling capture for a story

Some stories are interactive demos with no stable visual (a Modal that opens on click; a `Trigger` that owns its own state). Mark them with:

```ts
parameters: { chromatic: { disableSnapshot: true } }
```

Use sparingly — the goal is to capture as much as we can.

### Pausing animation

Continuous animations (Skeleton shimmer, IrisThinking rotation, StreamingText cursor) need to be deterministic for Chromatic. Set:

```ts
parameters: { chromatic: { pauseAnimationAtEnd: true } }
```

For stream-style animations that need a mid-frame snapshot, use `chromatic: { delay: 500 }` instead — give the animation 500 ms before capture.

## What NOT to do

- **Don't approve baseline changes from a branch.** Approvals on a PR are scoped to that PR. Approvals on `main` lock the canonical baseline. Approving from a branch means the same diff gets re-flagged on every other open PR.
- **Don't tune the default diff threshold (0.063) lower.** It catches what matters and ignores subpixel noise. Lower thresholds produce false positives that train reviewers to approve blindly.
- **Don't bypass the gate** by disabling the `Chromatic` required check. If a diff is wrong, fix the code; if a diff is intended, approve it in Chromatic.
- **Don't add cross-browser snapshots in v4.3.** Chrome-only is the starting point. Firefox / Safari come in v4.4 if real cross-browser diffs surface.
- **Don't include Layer-3 showcase / case-study pages in Chromatic.** Those are deliberately outside the package's regression surface — see DS v4.3 §2.

## Cost note

Chromatic's free tier (5,000 snapshots / month) is generous but finite. With three theme modes (light / dark / hc) on every story plus the per-story `print` mode in galleries, snapshot count grows non-linearly with story count. If we approach the free-tier cap, the first lever is to drop `dark` and `hc` from the `parameters.chromatic.modes` block in `.storybook/preview.ts` for components where theme variation has been baselined and is unlikely to drift.
