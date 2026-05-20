# docs-build — design.risqbase.com generator

Implements [BRIEF-436](../../docs/briefs/BRIEF-436-DOCS-SITE-GENERATOR.md). Replaces hand-maintained `public/*.html` with release-driven generated output.

## Usage

```bash
# Local: regenerate public/*.html from sources
npm run docs:build

# CI: fail if working tree drifts from what the generator would emit
npm run docs:check
```

## Sources of truth

| Input | Drives | File(s) emitted |
|---|---|---|
| `package.json` | Version pill, footer copy | all pages |
| `CHANGELOG.md` | Release ladder | `public/changelog.html` |
| `src/{core,ai,data-viz,marketing}/*/` | Component cards + counts | `public/components.html`, `public/index.html` (hero stat) |
| `dist/tokens.css` (or `tokens/**/*.json` fallback) | Token count | `public/tokens.html`, `public/index.html` |
| `src/data-viz/ChartContainer/types.ts` | Chart-type count | `public/index.html` (hero stat) |
| `src/core/theme/index.ts` (`Theme` union) | Theme count + names | `public/index.html` (hero stat) |
| `docs/design-system/v*/RisqBase-DS-v*.md` (latest) | Spec version banner | all pages |

## Template syntax

Templates live in `tools/docs-build/templates/*.html`. Placeholders use Mustache-style:

```
{{PKG_VERSION}}        — string, e.g. "2.0.0"
{{SPEC_VERSION}}       — string, e.g. "4.3"
{{TOKEN_COUNT}}        — integer
{{COMPONENT_COUNT}}    — integer (shipped, excludes telemetry/theme primitives)
{{CHART_TYPE_COUNT}}   — integer
{{THEME_COUNT}}        — integer (always 3 today: light/dark/hc — print is NOT a theme)
{{THEME_LIST}}         — string, e.g. "light · dark · HC"
{{CHANGELOG_ENTRIES}}  — HTML fragment, rendered from CHANGELOG.md
{{CHANGELOG_NAV}}      — HTML fragment for sidenav
{{COMPONENT_GRID_CORE}}, {{COMPONENT_GRID_AI}}, {{COMPONENT_GRID_VIZ}}, {{COMPONENT_GRID_MARKETING}}
                       — HTML fragment, per-domain component cards
{{COMPONENT_LIST_CORE}}, {{COMPONENT_LIST_AI}}, {{COMPONENT_LIST_VIZ}}, {{COMPONENT_LIST_MARKETING}}
                       — HTML fragment, sidenav <li> entries
{{BUILD_TIMESTAMP}}    — ISO 8601 UTC string (for diagnostics; not in default templates)
```

Placeholder substitution is whole-string replace — no runtime templating engine.

## Idempotence

The generator produces byte-stable output. Running `docs:build` twice on a clean tree leaves no diff. CI relies on this for `docs:check`.

## When NOT to use this

- One-off prototypes go through Storybook + Chromatic, not `public/`.
- Marketing copy that crosses the design site / marketing site boundary lives in the marketing-site repo.

## Adding a new placeholder

1. Add the extractor to `lib/extractors.mjs`.
2. Reference the placeholder in `templates/<page>.html`.
3. Add to the `context` object in `index.mjs`.
4. Run `npm run docs:build` locally — verify the diff makes sense.
5. Push; CI's `docs:check` will validate idempotence on subsequent commits.
