# Changelog

## 1.3.0 (pending tag) — Design System v4.2

S1 of the v4.2 implementation programme is the largest single sprint in the package's history: ~1,800 lines of new and changed code across `src/`, `tokens/`, and `tools/`, plus the W3C-format token corpus, the Style Dictionary build pipeline, and the SSR-safe theming infrastructure. This release ships those changes; subsequent v4.2 sprints (S2 — data-viz, S3 — ai, S4 — content/dark/HC, S5 — Figma, S6 — consumer migration) layer additional v1.3.x and v1.4.x releases on top.

### Added

**Sub-path imports** (spec §22.2)

- `src/` restructured into domain folders (`core/`, `ai/`, `data-viz/`, `content/`, `tokens/`, `primitives/`). Consumers can import from sub-paths:
  - `@risqbase-inc/ui-components/core` — the five v1.x components plus theming primitives.
  - `@risqbase-inc/ui-components/tokens` — typed design tokens.
  - `@risqbase-inc/ui-components/ai`, `/data-viz`, `/content` — empty placeholders today; reserved for S2 (data-viz), S3 (ai), S4 (content). Imports resolve cleanly from S1 onwards.
  - `primitives/` is intentionally internal-only.

**Design tokens — three-tier W3C corpus**

- ~150+ tokens authored as W3C Design Tokens Format JSON across primitive, semantic, and component tiers in `tokens/`.
- Style Dictionary build pipeline (`npm run build:tokens`) emits four artefacts: `dist/tokens.css`, `dist/tailwind-tokens.js`, `dist/figma-tokens.json`, and `src/tokens/generated.ts`.
- Schema lint (`npm run lint:tokens`) rejects W3C violations and unresolved `{token.path}` references.
- See `tokens/README.md` for authoring guidance.

**Theming infrastructure** (spec §15.2.1, plan D11)

- `data-theme` attribute on `<html>` is the single switch for `light` | `dark` | `hc`. CSS custom properties cascade off the attribute; theme swaps require no React re-render.
- New public API (exported from both root and `/core`):
  - `setTheme(theme)` — runtime mode setter; persists to `localStorage`. SSR-safe (no-op on server).
  - `getTheme()` — read the active mode (returns `'light'` during SSR).
  - `themeInitScript` — ~280-byte SSR-safe init string. Inline as the **first** `<script>` in `<head>` to avoid flash-of-wrong-theme on reload.
  - `THEME_STORAGE_KEY` — `localStorage` key name (`'risqbase-ds-theme'`) for consumer integrations.
  - `Theme` — exported type alias: `'light' | 'dark' | 'hc'`.
- Light values shipped now; dark and HC token overrides are stub layers (`tokens/themes/{dark,hc}.json`) that Elena fills in S4. Until then, `setTheme('dark')` renders light values.
- See `docs/theming.md` for the consumer integration guide.

**Toolchain**

- `npm run lint:tokens` — schema lint over `tokens/**/*.json`.
- `npm run build:tokens` — Style Dictionary build, runs first in `npm run build`.

### Changed

- Header, Footer, Button, Badge, SectionEyebrow migrated to consume role tokens via Tailwind arbitrary values (e.g. `bg-[var(--color-action-primary)]`). Migration is structural; no visual change is intended at light-mode parity (Chromatic verifies in G5).
- Stone-* (warm) neutral palette per spec §1; replaces `gray-*` references in component classNames where applicable.
- ESLint configuration moved into `package.json#eslintConfig` (single source of truth). `@typescript-eslint` remains at v6.21.0; the v8 upgrade is in flight in Alex's parallel PR and will close behind it.

### Backwards compatibility

- Every v1.x export remains at the package root: `import { Button } from '@risqbase-inc/ui-components'` continues to work for all five components and for the new theme primitives. Sub-path imports are additive — no consumer is forced to migrate.
- The Tailwind preset (`@risqbase-inc/ui-components/tailwind.preset`) is unchanged in shape; new role tokens layer in.

### Known gaps closing in later sprints

- `dist/tokens.css` ships `[data-theme="dark"]` and `[data-theme="hc"]` as stub blocks today — switching modes will render light values until Elena fills the overrides in S4 (per `implementation-plan.md` §6 R3). No consumer code change is required when those values land.
- `.github/workflows/publish.yml` is gated by `if: false` pending the `apps/docs` path and monorepo-tool decision; the npm-publish-on-`v*.*.*`-tag flow is wired but not yet active. Owner: Alex (G1).

### Documentation

This release lands alongside documentation that has shipped to `main` separately:

- v4.2 spec, plan, audit, and v4.2 README — PR #2.
- v4.2 implementation plan — PR #4.
- DevOps stubs (workflow scaffolding, Vercel placeholder, CODEOWNERS) — PR #3.
- Per-component `tokens.md` content — PR #9 (Priya).

In this PR (`s1/cleanup-3-doc-consistency`):

- `notes/gov-id-format.md` flipped from `PENDING VERIFICATION` to **VERIFIED**; canonical format is `GOV-DS-<YEAR>-<SEQ>[-<DOC-TYPE>-<VERSION>]` with `<VERSION>` rendered dotted (e.g. `4.2`, not `420`).
- `plan.md` and `audit.md` Document IDs corrected to `GOV-DS-2026-02-PLAN-4.2` and `GOV-DS-2026-02-AUDIT-4.2`.
- `notes/audit-row-counts.md` and `notes/glossary-scope.md` carried forward from PR #11.
- `implementation-plan.md` row-count reconciliation carried forward from PR #11 (§1 executive summary, §4 heading, §7 DoD).
- `README.md` (repo root) refreshed: install, sub-path imports, theme API, build commands, available components, design-system reference.

### Tracking

- v4.2 supersedes v4.1.1 at the document level.
- v4.2.1 patch backlog is enumerated in `docs/design-system/v4.2/implementation-plan.md` §8 (motion tokens, sonification reconciliation, U1.9 chart-library decision, glossary term list, Figma metadata extension key, plus the historical `-420` strings preserved in PR #2's commit message footer — repo working tree is clean).

## 1.2.0 — 2026-02-03

- Initial Header, Footer, Button, Badge, SectionEyebrow components.
- Tailwind preset with brand colours (indigo-600 primary).
- Documented in `CLAUDE.md`.

## 1.1.1 — earlier 2026

- Footer legal-links route correction (always `risqbase.com`).

## 1.0.0 and earlier

See git tags `v1.0.0` through `v1.1.0` for prior history.
