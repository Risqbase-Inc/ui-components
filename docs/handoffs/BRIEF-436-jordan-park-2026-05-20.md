# BRIEF-436 — handoff (Jordan Park, 2026-05-20)

**Branch:** `feat/brief-436-docs-site-generator` (off `origin/main` HEAD `542fe7b`)
**Worktree:** `/tmp/brief-436-impl`
**Files changed:** 12 new, 2 modified (package.json, .github/workflows/ci.yml); all 6 `public/*.html` regenerated

## Empirical verification performed

- `node tools/docs-build/index.mjs build` succeeds; emits 6 files; counts agree with sources (`pkg v2.0.0`, `spec v4.3`, `23 components`, `359 tokens`, `3 chart types`, `3 themes`).
- `node tools/docs-build/index.mjs check` passes immediately after a build (idempotence).
- Changelog HTML contains v2.0.0 article + 4 unreleased v4.3 articles + v1.4.0 + v1.3.0 + v1.2.0 + v1.1.1 + v1.0.0 (11 total).
- Version pill `v2.0.0` present on all 6 pages; no `v1.4.0` strings remain (grep confirmed).
- Markdown rendering: backticked `<TelemetryBeacon>` renders as `<code>&lt;TelemetryBeacon&gt;</code>` (single-escape, fixed mid-implementation).

## Decisions

1. **Templates = current `public/*.html` with surgical `{{}}` placeholders**, not a from-scratch rewrite. Preserves the hand-crafted design (token swatches, chart taxonomy SVGs, recipe schemas) — only volatile bits become placeholders. Visual parity is preserved by construction.

2. **`### Sub-headings under released versions are body content**, not entries. Release-please writes `### Features`, `### Bug Fixes`, etc. under `## [x.y.z](url) (date)` lines. The parser only treats `### ` as entry-creating when `inUnreleased = true`. Caught a bug mid-implementation where my version-line regex didn't match the release-please URL-bracketed format → all sub-headings became entries. Fixed by splitting version detection from date detection.

3. **`TelemetryBeacon` counted as a component** (was initially excluded). It's a public Layer-1 primitive per DS v4.3 §7.3 even though it's a no-op stub today.

4. **`theme/` excluded** from component scan. It's runtime helpers (`setTheme`, `themeInitScript`), not a UI component.

5. **Print is NOT a theme** in the generator's view. `Theme` union = `'light' | 'dark' | 'hc'`. Print is a `@media print` stylesheet in `dist/tokens.css`. The old hero stat "4 themes (light · dark · HC · print)" was a category error inherited from the hand-maintained HTML.

6. **No external dependencies.** Generator + extractors + renderer are pure Node stdlib. The whole pipeline is auditable in ~600 lines. No templating engine, no markdown library — our changelog uses a narrow markdown subset and a 100-line renderer suffices.

7. **CI runs twice on the same source change** by design:
   - PR phase: `npm run docs:check` blocks merge if author forgot to run `docs:build` locally.
   - Post-merge phase: `docs-publish.yml` regenerates again from sources and commits if needed. Defends against direct-to-main commits (release-please bot) and any path bypassing the PR gate.
   - The `[skip ci]` in the bot commit prevents recursive triggers.

## Rejected alternatives

- **Run `docs:build` in a pre-commit hook** — rejected because would slow every commit even for unrelated files; CI gate + post-merge safety net is enough.
- **Markdown library (markdown-it, marked)** — rejected because adds 50+ deps for 8 inline patterns we actually use. The local renderer is ~100 lines and stable.
- **Push templates into MDX/Storybook** — rejected because templates are 90% pixel-perfect handcraft (chart SVGs, swatch grids, recipe layouts); MDX rewrite for zero capability gain.

## Open questions for the next agent

- **Hero stat `chart types` reads 3 (line/bar/sparkline)** because that's what `ChartType` union exports on `main`. The 28-type taxonomy on charts.html is documentation, not implementation. The hero `{{CHART_TYPE_COUNT}}` is "shipped chart-component types"; the charts.html still says "28 active types" — that's the taxonomy count, intentionally hand-authored copy. If we want a placeholder there too, expose `{{CHART_TAXONOMY_COUNT}}`. Tabled for v4.4 when 4 more land.
- **Spec version banner** — brief mentioned this. Implementation uses spec dir name (e.g. `v4.3` → "4.3") on the hero eyebrow + footer. There's no separate banner; if a hard banner-style callout is needed, add `{{SPEC_BANNER_HTML}}` and an extractor.
- **Backfill audit** — brief §6 mentioned `git log --all --grep='no-verify'`. Skipped per "informational; do NOT retroactively fix" — should live in a separate audit doc, not in BRIEF-436 scope.

## How to verify

```bash
cd ~/Code/ui-components
git checkout feat/brief-436-docs-site-generator
npm ci --legacy-peer-deps
npm run build:tokens
npm run docs:build       # should succeed + change nothing on this branch
npm run docs:check       # should pass

# Open public/index.html locally — verify hero stats + version pill.
# Open public/changelog.html — verify v2.0.0 + v4.3 entries present.
```

To prove generator-driven update works:
```bash
# Mutate package.json#version → 2.1.0
sed -i '' 's/"version": "2.0.0"/"version": "2.1.0"/' package.json
npm run docs:build
# Expect: all 6 public/*.html now reference v2.1.0 in version pill + footer.
git checkout -- .
```

## Confidence calibration

- **High confidence:** generator works correctly on the inputs available on `origin/main`. Idempotence empirically verified.
- **Medium confidence:** Vercel preview will match production visually. I preserved every byte of the hand-crafted layout — only stale strings changed. But I have not run a Vercel build (no local Vercel CLI exec in this session).
- **Low confidence:** the docs-publish workflow's commit-back loop. The `[skip ci]` should prevent infinite loops, and the author-email check is a belt-and-suspenders. But if a future contributor adds another path-filtered workflow that doesn't honour `[skip ci]`, we may need to revisit.
