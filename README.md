# @risqbase-inc/ui-components

Shared UI components, design tokens, and theming primitives for RisqBase products
(`risqbase.com`, `ralia.io`, internal admin tooling). This package is the runtime expression
of the [RisqBase Design System v4.2](docs/design-system/v4.2/) (`GOV-DS-2026-02`).

**Latest published:** `1.2.0`. **Next release:** `1.3.0` (staged in `package.json`, pending
tag — ships S1 of the v4.2 implementation programme; see [CHANGELOG.md](CHANGELOG.md)).

## Install

The package is published to GitHub Packages, not the public npm registry. Add an `.npmrc`
at the consumer-app repo root with:

```
@risqbase-inc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

`NPM_TOKEN` must be a GitHub Personal Access Token with the `read:packages` scope (or an
Actions-scoped `GITHUB_TOKEN` in CI). Then:

```bash
npm install @risqbase-inc/ui-components
```

## Imports

### Root (back-compat — all v1.x consumers)

Every v1.x export remains available at the root barrel. No consumer change is required to
upgrade from a v1.2.x line to v1.3.x.

```ts
import { Button, Header, Footer, Badge, SectionEyebrow } from '@risqbase-inc/ui-components'
```

### Sub-path imports (v4.2, recommended for new code)

v4.2 ships per-domain entry points so consumers can tree-shake by domain:

```ts
import { Button } from '@risqbase-inc/ui-components/core'
import { tokens } from '@risqbase-inc/ui-components/tokens'

// Empty in S1 — reserved for later sprints, but the import path resolves cleanly today
// import { Chart } from '@risqbase-inc/ui-components/data-viz'  // S2
// import { CitationChip } from '@risqbase-inc/ui-components/ai' // S3
// import strings from '@risqbase-inc/ui-components/content'    // S4
```

`primitives/` is internal-only and is not exposed in `package.json#exports`.

## Theme API

The package ships a three-mode theming system (`light` | `dark` | `hc`) driven by a
`data-theme` attribute on `<html>`. CSS custom properties cascade off the attribute, so
swapping themes is synchronous and requires no React re-render.

```tsx
// app/layout.tsx
// Bundlers (Next.js / webpack / Vite) resolve the CSS asset by path even though
// `dist/tokens.css` is not in package.json#exports. A v4.2.1 patch will add an
// explicit `"./styles": "./dist/tokens.css"` export to remove the indirection.
import '@risqbase-inc/ui-components/dist/tokens.css'
import { themeInitScript } from '@risqbase-inc/ui-components'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        {/* The init script must be the FIRST <script> in <head> so the active mode
            is applied before first paint (no flash-of-wrong-theme). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

```tsx
'use client'
import { setTheme, getTheme, type Theme } from '@risqbase-inc/ui-components'

function ThemePicker() {
  return (
    <select defaultValue={getTheme()} onChange={(e) => setTheme(e.target.value as Theme)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="hc">High contrast</option>
    </select>
  )
}
```

| Export | Purpose |
|---|---|
| `setTheme(theme)` | Runtime mode setter; persists to `localStorage`. SSR-safe (no-op on server). |
| `getTheme()` | Active mode (`'light'` during SSR). |
| `themeInitScript` | ~280-byte SSR-safe init string; inline as the first `<script>` in `<head>`. |
| `THEME_STORAGE_KEY` | `localStorage` key (`'risqbase-ds-theme'`). |
| `Theme` | Type alias: `'light' \| 'dark' \| 'hc'`. |

> **Note:** `dist/tokens.css` ships dark and HC stub blocks today — calling
> `setTheme('dark')` currently renders light values. G4 fills dark/HC token values in
> S4; consumer code does not change.

Full integration guide: [`docs/theming.md`](docs/theming.md).

## Tokens

~150+ design tokens authored as W3C Design Tokens Format JSON across primitive, semantic,
and component tiers. Style Dictionary builds them into CSS custom properties, a Tailwind
plugin payload, a Figma Variables payload, and a typed TS export.

```ts
import { tokens } from '@risqbase-inc/ui-components/tokens'

tokens.color.brand.indigo[600]   // "#4F46E5"
```

```css
/* Or via CSS custom properties (after importing dist/tokens.css) */
.cta { background: var(--color-action-primary); }
```

Authoring guide and schema: [`tokens/README.md`](tokens/README.md).

## Tailwind preset

```js
// tailwind.config.js
const risqbasePreset = require('@risqbase-inc/ui-components/tailwind.preset')

module.exports = {
  presets: [risqbasePreset],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
}
```

The preset wires brand colours (indigo-600 as primary), Geist Sans typography, and the
spacing/sizing scale. Layered against the v4.2 token CSS, it gives consumers role-token
utilities without further configuration.

## Components

S1 ships five components in `core/`:

| Component | Variants | File |
|---|---|---|
| `Button` (+ `PrimaryButton`, `SecondaryButton`, `GhostButton`) | `primary` / `secondary` / `ghost` × `sm` / `md` / `lg` | `src/core/Button` |
| `Header` | `risqbase` / `ralia` (with optional `showLaunchDate`) | `src/core/Header` |
| `Footer` | `risqbase` / `ralia` | `src/core/Footer` |
| `Badge` (+ `MostPopularBadge`, `NewBadge`, `ComingSoonBadge`, `StandaloneProductBadge`) | `default` / `most-popular` / `new` / `coming-soon` | `src/core/Badge` |
| `SectionEyebrow` | — | `src/core/SectionEyebrow` |

Reserved for later sprints (paths resolve as empty barrels today):

- `data-viz/` — Chart, BarChart, LineChart, AreaChart, Sparkline, Heatmap, ChoroplethMap, Gauge, MetricCard (S2).
- `ai/` — CitationChip (six states), StreamingText, PromptChip, IRIS lettermark (S3).
- `content/` — `strings.en-GB.json`, `strings.en-US.json`, `glossary.json` (S4).

## Build & lint

```bash
npm run build         # Style Dictionary → tsup; emits dist/
npm run dev           # tsup --watch
npm run lint          # ESLint over src/**/*.{ts,tsx}
npm run lint:tokens   # W3C-schema lint over tokens/**/*.json
```

`npm run build` is the canonical full build: `build:tokens` runs first (emitting
`dist/tokens.css`, `dist/tailwind-tokens.js`, `dist/figma-tokens.json`, and
`src/tokens/generated.ts`), then tsup compiles every entry point in `tsup.config.ts`.

## Visual regression

Every component ships with a Storybook story (`*.stories.tsx`). Chromatic captures
those stories on every PR and on every push to `main` and posts a comment with
the diff URL. `Chromatic` is a required status check on `main` — PRs cannot merge
until either zero visual diffs or explicit approval in the Chromatic UI.

### How to review a Chromatic comment

Click the link in the PR comment. Three buckets appear:

- **Changed** — side-by-side, before vs after. If the change is intended, click
  "Accept". If it's an unintended regression, fix the code and push again.
- **New** — first time we've seen this story / mode. Approve to register the
  baseline; deny to keep the snapshot off-baseline.
- **Errors** — story failed to render. Fix locally and push.

### When a diff looks wrong

Don't approve. Revert the offending commit (or pin the regression) and
investigate. Every approval becomes the new "before" picture for the next PR; an
accidental approval bakes a regression into the baseline permanently.

### When a diff looks right but you're not sure

Get a second opinion. The Chromatic UI surfaces every snapshot URL — paste it
into the PR thread, tag a designer or a maintainer. Approvals are durable
(branch-scoped during PR, global once merged to `main`), so a moment's care is
cheap.

### Animations

Components with continuous animation (Skeleton, IrisThinking, StreamingText) use
`chromatic: { pauseAnimationAtEnd: true }` or `chromatic: { delay: <ms> }` in
their stories to keep snapshots deterministic. If you add a new animated
primitive, do the same — uncaptured animation = flaky baselines.

### Operations + token rotation

The full operator's guide — wiring the Chromatic project, rotating the project
token, cost considerations, what NOT to do — lives at
[`docs/contributing/chromatic.md`](docs/contributing/chromatic.md).

## Versioning

The package follows semver. v1.3.0 is the first v4.2-implementation release; further v4.2
sprints layer additional v1.3.x and v1.4.x releases on top.

| Bump | Trigger |
|---|---|
| Patch (`1.3.x`) | Bug fixes; no API change. |
| Minor (`1.x.0`) | Additive features; existing exports unchanged. |
| Major (`x.0.0`) | Breaking changes — requires CEO (G7) sign-off. |

Tag-on-publish via `.github/workflows/publish.yml` (currently gated by `if: false`
pending the `apps/docs` path and monorepo-tool decision; G1 unblocks).

## Design-system reference

The authoritative spec is `docs/design-system/v4.2/`:

- [`spec.md`](docs/design-system/v4.2/spec.md) — `GOV-DS-2026-02` consolidated v4.2 specification.
- [`plan.md`](docs/design-system/v4.2/plan.md) — `GOV-DS-2026-02-PLAN-4.2` execution plan and source canon.
- [`audit.md`](docs/design-system/v4.2/audit.md) — `GOV-DS-2026-02-AUDIT-4.2` honest assessment vs implementation.
- [`implementation-plan.md`](docs/design-system/v4.2/implementation-plan.md) — six-sprint programme.
- [`notes/`](docs/design-system/v4.2/notes/) — reconciliation notes (audit row counts, glossary scope, GOV-ID format).

For consumer-app integration: see [`docs/theming.md`](docs/theming.md).

## Licence

MIT for code (`src/`, `tools/`, `tokens/`, build outputs).
Documentation under `docs/` is governed by the design-system release process.

## Security

To report a security vulnerability, please follow the procedure documented in [`SECURITY.md`](SECURITY.md). Do not file public GitHub issues for security concerns.

---

Maintained by **RisqBase d.o.o.**, registered in Croatia. Registered office: Zaostroška 3, 10000 Zagreb, Croatia. Design system site: [design.risqbase.com](https://design.risqbase.com).
