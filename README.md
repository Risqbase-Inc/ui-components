# @risqbase-inc/ui-components

Shared UI components, design tokens, and theming primitives for RisqBase products
(`risqbase.com`, `ralia.io`, internal admin tooling). This package is the runtime expression
of the RisqBase Design System (`GOV-DS-2026-02`).

<!-- AUTOGEN:START status -->
> **Latest published:** `2.1.3` · **Design system:** `GOV-DS-2026-02 v4.4`
>
> **29 components** across `core` · `ai` · `data-viz` · `marketing` · `primitives` · **321 design tokens** (primitive · semantic · component tiers).
>
> Live component gallery, token reference + changelog: **[design.risqbase.com](https://design.risqbase.com)**.
<!-- AUTOGEN:END status -->

> **The factual sections below (status, imports, components, releases) are generated**
> from the package sources by [`tools/readme-build`](tools/readme-build/). Run
> `npm run readme:build` after any change that adds a component, bumps the version, or
> cuts a release; CI's `readme:check` fails if they drift. Don't hand-edit the
> `<!-- AUTOGEN -->` blocks.

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

Every export is available at the root barrel (back-compat for all consumers):

```ts
import { Button, Header, Footer, Badge, SectionEyebrow } from '@risqbase-inc/ui-components'
```

Per-domain subpaths let new code tree-shake by domain:

<!-- AUTOGEN:START imports -->
```ts
import { Badge, Button, Callout, Card, … } from '@risqbase-inc/ui-components/core'
import { CitationChip, ClientGrid, ClientScopeBanner, CompliancePostureStrip, … } from '@risqbase-inc/ui-components/ai'
import { ChartContainer, Gauge, ImpactGraph, RiskGauge } from '@risqbase-inc/ui-components/data-viz'
import { HeroVideo } from '@risqbase-inc/ui-components/marketing'
import { ArcDecoration } from '@risqbase-inc/ui-components/primitives'
import { tokens } from '@risqbase-inc/ui-components/tokens'
```
<!-- AUTOGEN:END imports -->

`tokens/` exposes the typed token export; `content/` is reserved for i18n string bundles.

## Theme API

The package ships a three-mode theming system (`light` | `dark` | `hc`) driven by a
`data-theme` attribute on `<html>`. CSS custom properties cascade off the attribute, so
swapping themes is synchronous and requires no React re-render.

```tsx
// app/layout.tsx
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

Full integration guide: [`docs/theming.md`](docs/theming.md).

## Tokens

Design tokens are authored as W3C Design Tokens Format JSON across primitive, semantic,
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

Authoring guide and schema: [`tokens/README.md`](tokens/README.md). Browse the full token
reference live at [design.risqbase.com](https://design.risqbase.com).

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
spacing/sizing scale. Layered against the token CSS, it gives consumers role-token
utilities without further configuration.

## Components

Browse them rendered, with props and live examples, at
[design.risqbase.com](https://design.risqbase.com). Current published inventory:

<!-- AUTOGEN:START components -->
| Domain | Purpose | Components |
|---|---|---|
| `core` | Foundational UI + layout | Badge, Button, Callout, Card, EmptyState, Footer, Header, IconButton, Modal, MotionProvider, SectionEyebrow, Skeleton, SkipLink, TelemetryBeacon, Toast, WizardProgress |
| `ai` | AI / IRIS surfaces | CitationChip, ClientGrid, ClientScopeBanner, CompliancePostureStrip, IrisThinking, PromptChip, StreamingText |
| `data-viz` | Charts, gauges + impact graphs | ChartContainer, Gauge, ImpactGraph, RiskGauge |
| `marketing` | Marketing-site surfaces | HeroVideo |
| `primitives` | Low-level building blocks | ArcDecoration |

`content/` is a reserved export for i18n string bundles (not yet populated). Subpaths above are tree-shakeable; the root barrel re-exports everything for back-compat.
<!-- AUTOGEN:END components -->

## Build & lint

```bash
npm run build         # Style Dictionary → tsup; emits dist/
npm run dev           # tsup --watch
npm run lint          # ESLint over src/**/*.{ts,tsx}
npm run lint:tokens   # W3C-schema lint over tokens/**/*.json
npm run docs:build    # regenerate the design.risqbase.com static site
npm run readme:build  # regenerate the AUTOGEN sections of this README
```

`npm run build` is the canonical full build: `build:tokens` runs first (emitting
`dist/tokens.css`, `dist/tailwind-tokens.js`, `dist/figma-tokens.json`, and
`src/tokens/generated.ts`), then tsup compiles every entry point in `tsup.config.ts`.

## Visual regression

Every component ships with a Storybook story (`*.stories.tsx`). Chromatic captures
those stories on every PR and on every push to `main` and posts a comment with
the diff URL. `Chromatic` is a required status check on `main` — PRs cannot merge
until either zero visual diffs or explicit approval in the Chromatic UI.

The full operator's guide — wiring the Chromatic project, rotating the project
token, cost considerations, what NOT to do — lives at
[`docs/contributing/chromatic.md`](docs/contributing/chromatic.md).

## Versioning

The package follows semver: patch = bug fixes; minor = additive features (existing
exports unchanged); major = breaking changes (requires CEO / G7 sign-off). Releases are
cut by `release-please`. Recent releases:

<!-- AUTOGEN:START changelog -->
- `2.1.3` — 2026-05-25
- `2.1.2` — 2026-05-20
- `2.1.1` — 2026-05-20
- `2.1.0` — 2026-05-20
- `2.0.0` — 2026-05-20
- `1.4.0` — 2026-05-14

Full history: [CHANGELOG.md](CHANGELOG.md).
<!-- AUTOGEN:END changelog -->

## Design-system reference

The authoritative spec lives under [`docs/design-system/`](docs/design-system/) (the
highest `v*` directory is current; its version is shown in the status block above). The
rendered design site — components, tokens, charts, patterns, changelog — is published at
[design.risqbase.com](https://design.risqbase.com) from these same sources by
[`tools/docs-build`](tools/docs-build/).

For consumer-app integration: see [`docs/theming.md`](docs/theming.md).

## Licence

MIT for code (`src/`, `tools/`, `tokens/`, build outputs).
Documentation under `docs/` is governed by the design-system release process.

## Security

To report a security vulnerability, please follow the procedure documented in [`SECURITY.md`](SECURITY.md). Do not file public GitHub issues for security concerns.

---

Maintained by **RisqBase d.o.o.**, registered in Croatia. Registered office: Zaostroška 3, 10000 Zagreb, Croatia. Design system site: [design.risqbase.com](https://design.risqbase.com).
