# Changelog

## Unreleased

### Documentation

- **Design System v4.2.1 — Complete.** All 14 spec-side gaps closed across 11 PRs (#17–#27) on 2026-05-11 + housekeeping PR landing the rename + tracker reconciliation. Documentation-only patch; no `@risqbase-inc/ui-components` version bump. Resolution log + outstanding handoffs in [`docs/design-system/v4.2.1/v4.2.1-COMPLETE.md`](docs/design-system/v4.2.1/v4.2.1-COMPLETE.md).
  - **P2 governance hygiene (G1–G4):** §8.5.6 sonification deferral, §16.2 marketing→content rename, §17 row-count drift note, §18 doc-site status note.
  - **P1 audit-flagged (A1–A7):** §8.7 visx@^3.0.0 library pin, §10.3.3 number-formatting (4 typed tables), §15.1 + §15.8.4 Figma `$extensions` key, §20.0.1 voice_examples template binding, §23.7 promotion log (5 rows), §8.16 print variants for all 28 chart types, §8.17 three composite recipes.
  - **P0 substrate (T1–T3):** §15.6 token enumeration (241 tokens authored; 38 TBD primitives queued for Claude Design), §8.1.1 chart taxonomy (7 → 28 active types + 11-row decision matrix), §10.6 canonical glossary (14 → 84 entries across 6 sub-categories).
- **Section-ID corrections** (5) recorded in `v4.2.1-COMPLETE.md` resolution log — patch plan's section IDs vs as-shipped spec.
- **Tracker-table reconciliation** — 6 row-state mismatches between entry-section headers and bottom tracker fixed in the housekeeping PR.
- `docs/design-system/v4.2/audit.md` "What needs honest attention before v4.2.1" updated to reference the completion document.
- `docs/design-system/v4.2/v4.2.1-backlog.md` (a working list maintained across S1 cleanup PRs) absorbed into the patch plan and removed.
- **BRIEF-401 — DS implementation audit + value-pass.** `docs/briefs/BRIEF-401-DS-IMPL-AUDIT.md` commissions the next slice of work: the v4.2.1 outstanding handoffs (38 TBD primitive hex values, dark + HC + print theme values, `scopes[]` patch per A7) plus a full system audit against the spec. Two-agent split: Claude Design produces artefacts, Claude Code lands them as PRs.

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
- Light values shipped now; dark and HC token overrides are stub layers (`tokens/themes/{dark,hc}.json`) that G4 fills in S4. Until then, `setTheme('dark')` renders light values.
- See `docs/theming.md` for the consumer integration guide.

**Toolchain**

- `npm run lint:tokens` — schema lint over `tokens/**/*.json`.
- `npm run build:tokens` — Style Dictionary build, runs first in `npm run build`.

### Changed

- Header, Footer, Button, Badge, SectionEyebrow migrated to consume role tokens via Tailwind arbitrary values (e.g. `bg-[var(--color-action-primary)]`). Migration is structural; no visual change is intended at light-mode parity (Chromatic verifies in G5).
- Stone-* (warm) neutral palette per spec §1; replaces `gray-*` references in component classNames where applicable.
- ESLint configuration moved into `package.json#eslintConfig` (single source of truth). `@typescript-eslint` remains at v6.21.0; the v8 upgrade is in flight in G1's parallel PR and will close behind it.

### Backwards compatibility

- Every v1.x export remains at the package root: `import { Button } from '@risqbase-inc/ui-components'` continues to work for all five components and for the new theme primitives. Sub-path imports are additive — no consumer is forced to migrate.
- The Tailwind preset (`@risqbase-inc/ui-components/tailwind.preset`) is unchanged in shape; new role tokens layer in.

### Known gaps closing in later sprints

- `dist/tokens.css` ships `[data-theme="dark"]` and `[data-theme="hc"]` as stub blocks today — switching modes will render light values until G4 fills the overrides in S4 (per `implementation-plan.md` §6 R3). No consumer code change is required when those values land.
- `.github/workflows/publish.yml` is gated by `if: false` pending the `apps/docs` path and monorepo-tool decision; the npm-publish-on-`v*.*.*`-tag flow is wired but not yet active. Owner: G1 (G1).

### Documentation

This release lands alongside documentation that has shipped to `main` separately:

- v4.2 spec, plan, audit, and v4.2 README — PR #2.
- v4.2 implementation plan — PR #4.
- DevOps stubs (workflow scaffolding, Vercel placeholder, CODEOWNERS) — PR #3.
- Per-component `tokens.md` content — PR #9 (Frontend).

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
