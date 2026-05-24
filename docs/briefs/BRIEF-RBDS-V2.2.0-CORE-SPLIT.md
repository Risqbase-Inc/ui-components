# BRIEF-RBDS-V2.2.0-CORE-SPLIT: Split `/core` into `/core/server` + `/core/client` for RSC safety

**Owner**: Alex Chen (G1 Technical Lead)
**Priority**: P1 (no 25-May launch dependency; CEO target mid-June pre-launch)
**Created**: 2026-05-22
**Status**: Draft — Awaiting CEO review
**Estimated effort**: 1.5–2 days (1 dev-day implementation + ~½ day review + publish + consumer migration)
**Implementation owner**: G1 (or delegated to Liam contractor with G1 review)
**Closes**: marketing PR #41 `FooterClient` wrapper hack ([context](../../../risqbase-com/src/components/layout/FooterClient.tsx))
**Dependencies**: None — purely internal to `@risqbase-inc/ui-components`. v2.1.x consumers MUST keep working without change.
**Handoffs**: TBD — `docs/handoffs/BRIEF-RBDS-V2.2.0-CORE-SPLIT-<agent>-<date>.md` once implementation lands.

---

## 1. Problem recap

Empirically observed 2026-05-22 by marketing-site team: when an RSC page (server component) imports `Footer` (or any chrome) from `@risqbase-inc/ui-components/core`, Next.js 16 throws

> `TypeError: (0 , i.createContext) is not a function`

at module-load time, BEFORE the page renders. The marketing team shipped a workaround at `risqbase-com/src/components/layout/FooterClient.tsx` — a one-line `'use client'` wrapper that re-exports `Footer`. CEO directive 2026-05-22: **"do it better, once"** — skip the v2.1.3 `'use client'` stopgap, architect the split now.

### Empirical root-cause analysis

Audit of the current shipped `dist/core/index.mjs` (built 2026-05-13, pre-NavDropdown work — bundle is stale relative to source but the structural defect is the same):

1. **Source files DO have `'use client'`** where needed — `TelemetryBeacon`, `Modal`, `Toast`, `NavDropdown`, `NavDropdownContext` all start with the directive. So the CEO's stated hypothesis "no `'use client'`" is inaccurate at the **source** layer.

2. **tsup strips `'use client'` directives during bundling** — `dist/core/index.mjs` inlines `import { useEffect, useState } from "react"` and per-component function bodies in a SINGLE chunk, with zero `'use client'` lines preserved. Verified:
   ```
   $ grep -n "use client" dist/core/index.mjs
   (no matches)
   $ grep -n "import.*react" dist/core/index.mjs | head -2
   5:import { useEffect } from "react";
   633:import { useEffect as useEffect2, useState } from "react";
   ```
   This means **every consumer of `/core` sees ONE module** that calls `useEffect` / `useState` at module-load time without the client marker. RSC bails.

3. **The barrel `src/core/index.ts` has no `'use client'`** either. So the bug is twofold: (a) tsup strips directives, and (b) the barrel doesn't carry one to compensate.

4. **Only some components actually need `'use client'`** — most of `/core` is pure presentational markup that COULD be RSC-rendered if we structurally separate them.

The architectural fix CEO ratified: split `/core` into two entry-points so consumers explicitly opt into the client surface, and so the server surface contains zero client APIs.

### Why not the v2.1.3 stopgap

A 1-line `'use client'` at the top of `src/core/index.ts` (or wired via a tsup banner) would make the bundle work in RSC consumers — but at the cost of forcing EVERY consumer of `/core` into a client component, defeating RSC's payload-shrinking purpose. CEO: **"do it better, once"**.

---

## 2. Scope — deliverables table

### 2a. Component classification (empirical audit, complete)

| Component | Source `'use client'`? | React hooks used | Browser-only APIs | Classification |
| --------- | ---------------------- | ---------------- | ----------------- | -------------- |
| `Badge` | no | none | none | **server** |
| `Button` | no | none | none | **server** |
| `Callout` | no | none | none | **server** |
| `Card` | no | none | none | **server** |
| `EmptyState` | no | none | none | **server** |
| `Footer` | no | none | none | **server** |
| `Header` | no (chrome only) | none | none | **server** |
| `Header/NavLink` | no | none | none | **server** |
| `Header/NavDropdown` | **yes** | useState, useRef, useEffect, useId, useCallback | document, addEventListener | **client** |
| `Header/NavDropdownContext` | **yes** | createContext, useContext, useState, useMemo | none | **client** |
| `IconButton` | no | none | none | **server** |
| `Modal` (Modal, Drawer, Sheet) | **yes** | (via Radix Dialog) | (via Radix) | **client** |
| `SectionEyebrow` | no | none | none | **server** |
| `Skeleton` | no | none | none | **server** |
| `SkipLink` | no | none | none | **server** |
| `TelemetryBeacon` | **yes** | useEffect | process.env | **client** |
| `Toast` (Toast, ToastViewport) | **yes** | useEffect, useState | document, window | **client** |
| `WizardProgress` | no | none | none | **server** |
| `theme` (setTheme/getTheme/clearTheme/themeInitScript) | no (no JSX) | none | document, window (guarded) | **server-safe**¹ |

¹ `theme/index.ts` exports SSR-safe functions that no-op when `typeof window === 'undefined'`. The `themeInitScript` constant is a string. Safe to import from server components; the runtime behaviour activates only client-side after hydration.

### 2b. Transitive-dependency audit (no-leak verification)

Server-classified components MUST NOT transitively import any client-classified component at render time. Empirical verification per component:

| Server component | Imports `TelemetryBeacon` (client)? | Other client imports? | Verdict |
| ---------------- | ----------------------------------- | --------------------- | ------- |
| `Badge` | yes | none | LEAK² |
| `Button` | yes | none | LEAK² |
| `Callout` | yes | none | LEAK² |
| `Card` | yes | none | LEAK² |
| `EmptyState` | yes | none | LEAK² |
| `Footer` | yes | none | LEAK² |
| `Header` | yes | imports `NavDropdown` + `NavDropdownContext` (both client) | LEAK² |
| `Header/NavLink` | no | none | clean |
| `IconButton` | yes | none | LEAK² |
| `SectionEyebrow` | yes | none | LEAK² |
| `Skeleton` | yes | none | LEAK² |
| `SkipLink` | yes | none | LEAK² |
| `WizardProgress` | yes | none | LEAK² |
| `theme` | no | none | clean |

² This is NOT a runtime leak per React's RSC contract: **a server component CAN render a client component as a child** — React inserts the use-client serialisation boundary at the child's module edge. The constraint is that the parent's module-load-time code (imports, top-level statements, function bodies executed during SSR) cannot call client-only APIs. Importing a `'use client'` module from a server module is explicitly allowed. The bug is therefore **NOT** that Button transitively pulls TelemetryBeacon — it's that tsup bundles them into one chunk and strips the boundary marker.

The fix architecturally separates them into distinct bundles so:

- `dist/core/server/index.mjs` contains the server-classified components, each rendering `<TelemetryBeacon />` as a **deferred import** that lives in the **client bundle** chunk.
- `dist/core/client/index.mjs` carries the `'use client'` directive at top of file (tsup-preserved, see §2d) and contains TelemetryBeacon, Modal, Toast, NavDropdown, NavDropdownContext.
- The `Header` server component takes a `dropdownSlot` prop or similar to receive the client island from the consumer side, OR Header itself moves to client (simpler) — see Q3 in §6.

### 2c. Final classification (post-CEO decision in §6 Q3)

Default recommendation:

**`/core/server`** (12 server-safe exports)
- `Button`, `PrimaryButton`, `SecondaryButton`, `GhostButton`
- `Badge`, `BandBadge`, `MostPopularBadge`, `StandaloneProductBadge`, `NewBadge`, `ComingSoonBadge`
- `Callout`
- `Card`
- `EmptyState`
- `Footer` ← unblocks marketing PR #41
- `Header/NavLink` (`HeaderNavLink`) — useful standalone
- `IconButton`
- `SectionEyebrow`
- `Skeleton`
- `SkipLink`
- `WizardProgress`
- `setTheme`, `getTheme`, `clearTheme`, `themeInitScript`, `THEME_STORAGE_KEY` (from `theme`)

**`/core/client`** (5 client-only exports + their helpers)
- `TelemetryBeacon`
- `Modal`, `Drawer`, `Sheet`
- `Toast`, `ToastViewport`
- `Header` ← see Q3 (recommend: ship in `/core/client` because of transitive NavDropdownContext)
- `HeaderNavDropdown`, `HeaderDropdownProvider` (re-export if any consumer composes manually)

**Cross-cutting**: `TelemetryBeacon` is re-exported as a stable side-import that server components can render as a child. Since RSC permits server→client composition, this is fine **provided** tsup preserves the `'use client'` boundary on the client bundle (see §2d).

### 2d. Deliverables table

| File | Action | New / Modified |
| ---- | ------ | -------------- |
| `src/core/server/index.ts` | New barrel re-exporting server-classified components from their existing source paths (no file moves required — see §2e). Carries explanatory header. | New |
| `src/core/client/index.ts` | New barrel with `'use client'` directive at top, re-exporting client-classified components from their existing source paths. | New |
| `src/core/index.ts` | Replace existing content. Adds `'use client'` at top of file for full backward-compat (v2.1.x consumers continue to work — they pay a small bundle-size tax of being forced into client mode, but no API break). Re-exports the union of `/core/server` + `/core/client`. Adds dev-mode console.warn recommending migration to `/core/server` or `/core/client`. | Modified |
| `src/core/Header/index.tsx` | Add `'use client'` at top — Header transitively uses NavDropdownContext which uses `createContext`. (Decision Q3.) | Modified |
| `tsup.config.ts` | Add entries `core/server/index` and `core/client/index`. Enable `--banner` or per-file directive preservation so `'use client'` survives bundling. See §2f. | Modified |
| `package.json` `exports` | Add `./core/server` and `./core/client` entries pointing to new dist paths. Keep `./core` as backward-compat union. Add `"react-server"` condition on `./core` mapping to `./core/server/index.mjs` so RSC consumers transparently get the server-safe subset when they `import ... from '@risqbase-inc/ui-components/core'`. See §2g. | Modified |
| `package.json` version | Bump `2.1.0` → `2.2.0` (minor — additive, backward-compatible). | Modified |
| `tsup.config.ts` (or new `scripts/preserve-use-client.mjs`) | Either upgrade tsup to a version that preserves `'use client'` directives, OR add a post-build script that prepends `'use client'` to the client bundle. See §2f Decision Q4. | Modified |
| `src/core/__tests__/rsc-safety.test.ts` | New vitest spec: imports `/core/server` in a Node-only context (no DOM); asserts no `createContext`/`useState`/`useEffect`/`useRef` calls at module-load. Uses static analysis of the built `dist/core/server/index.mjs` (string-search). | New |
| `src/core/__tests__/exports.test.ts` | New vitest spec: asserts every export from `/core` is present in either `/core/server` or `/core/client` (backward-compat invariant). | New |
| `vitest.config.ts` | New if not present, OR modified to include the `__tests__` dir. | New / Modified |
| `package.json` `devDependencies` | Add `vitest`, `@vitest/coverage-v8` if not present. | Modified |
| `package.json` `scripts.test` | Add or update to `vitest run`. | Modified |
| `README.md` | New "Module entry points" section documenting the three barrels (`/core`, `/core/server`, `/core/client`), when to use each, and migration guidance for v2.1.x consumers. | Modified |
| `CHANGELOG.md` (`Unreleased` section) | Add v2.2.0 entry under `### Features` heading documenting the split, the RSC bug it fixes, backward-compat guarantees, and the new exports. | Modified |
| `docs/handoffs/BRIEF-RBDS-V2.2.0-CORE-SPLIT-<agent>-<date>.md` | New per agent-handoff pattern. | New (post-impl) |

**Net: 4 modified, 6 new files** (excluding handoff). Source-file footprint deliberately minimal because most of the win is in NEW barrels and build-config tuning — actual component source unchanged except Header (`'use client'` added).

### 2e. No physical file moves

We intentionally do NOT move `src/core/Button/index.tsx` to `src/core/server/Button/index.tsx`. The new barrels at `src/core/server/index.ts` and `src/core/client/index.ts` re-export from the existing component paths. Reasons:

1. **Zero churn in component source files** — keeps `git blame` history intact for design-system audits.
2. **Sub-path imports continue to work** — if any consumer somewhere does `import { Button } from '@risqbase-inc/ui-components/core/Button'` (none should but it's possible), it keeps resolving.
3. **Storybook stories stay co-located** with their components in `Button/Button.stories.tsx`.

If a future v3.0 decides to physically reorganise, that's a separate brief.

### 2f. `'use client'` preservation during bundling — the build-config decision

Two viable strategies:

**Option A (recommended): Upgrade tsup or add a directive-preserving plugin.**
- Current `tsup@^8.0.0` strips directives by default.
- `tsup@^8.4.0`+ supports `--preserve-directives` flag via esbuild option.
- Add `esbuildOptions: { keepNames: true }` + per-entry directive injection.

**Option B (fallback): Post-build script.**
- New `scripts/preserve-use-client.mjs` that walks `dist/core/client/index.mjs` (+ `.js`) after tsup builds and prepends `'use client'` to the file head if not already present. Idempotent.
- Wired into `npm run build` as `&& node scripts/preserve-use-client.mjs`.
- Simpler, no tsup upgrade risk, fully under our control.

Recommend **Option B** for v2.2.0 because it is the smallest blast-radius change (no tsup version bump, no esbuild surprise). Option A can be a v2.3.x cleanup if Option B proves brittle.

### 2g. `package.json` `exports` field — `"react-server"` conditional resolution

Per Node.js conditional exports spec, the `"react-server"` condition is set by RSC-aware bundlers (Next.js App Router, Turbopack) when resolving from a server-component context. Proposed shape:

```json
"./core": {
  "react-server": {
    "types": "./dist/core/server/index.d.ts",
    "import": "./dist/core/server/index.mjs",
    "require": "./dist/core/server/index.js"
  },
  "types": "./dist/core/index.d.ts",
  "import": "./dist/core/index.mjs",
  "require": "./dist/core/index.js"
},
"./core/server": {
  "types": "./dist/core/server/index.d.ts",
  "import": "./dist/core/server/index.mjs",
  "require": "./dist/core/server/index.js"
},
"./core/client": {
  "types": "./dist/core/client/index.d.ts",
  "import": "./dist/core/client/index.mjs",
  "require": "./dist/core/client/index.js"
}
```

**Why the `react-server` condition matters**: an RSC consumer that does `import { Footer } from '@risqbase-inc/ui-components/core'` will transparently resolve to `/core/server` and get the bug-free server bundle. A client component doing the same import gets the union bundle (with `'use client'`). **This is the architectural payoff** — the bug is fixed for callers who never knew there was a bug, while explicit `/core/server` / `/core/client` opt-in is available for callers who care.

Risk: `Header` (which we recommend lives in `/core/client` per Q3) is NOT in `/core/server`. RSC consumers who do `import { Header } from '@risqbase-inc/ui-components/core'` from a server component will get a "Header is not exported" runtime error after the conditional kicks in. **Mitigation**: ensure `/core/server` also re-exports a server-safe `Header` (one without NavDropdown — see Q3 alternatives), OR document the migration: RSC consumers must explicitly `import { Header } from '@risqbase-inc/ui-components/core/client'`. See Q3.

---

## 3. API contracts

Not applicable (no HTTP API surface; this is a build-config + barrel-organisation change). Public TypeScript API of `/core` is preserved; new public APIs are the two new sub-paths `/core/server` and `/core/client`.

---

## 4. Database

Not applicable.

---

## 5. UI / UX

Not applicable directly (no shipped UI changes). Indirectly: marketing PR #41 can revert its `FooterClient` wrapper after v2.2.0 lands — see §9 Phase 4.

Design system compliance (GOV-DS-2026-01): no changes to tokens, components, or visual treatment.

---

## 6. Decisions needed from CEO

1. **Backward-compat behaviour of `/core` post-split — `react-server` condition vs static union**
   - **Recommended default**: ship the `react-server` conditional export (§2g). RSC consumers get bug-free server bundle automatically; client consumers get full union. Existing v2.1.x callers see no API break **except** that RSC consumers will get a different bundle than they did before (in a way that fixes their bug). Lowest-friction outcome.
   - **Alternative**: skip the conditional; keep `/core` as a flat union with `'use client'` at top. RSC consumers must explicitly migrate to `/core/server`. Slower migration but no surprise resolution swap.

2. **Deprecation timeline for `/core` backward-compat union**
   - **Recommended default**: keep `/core` indefinitely (or until v3.0+, no committed timeline). Soft-deprecate in dev-mode console warning per existing root-barrel pattern (see `src/index.ts` lines 9–22). Cost is minimal; cleanup brief can come later.
   - **Alternative A**: hard-deprecate at v3.0 with a 6-month deprecation window. Forces consumer migration; clean long-term codebase.
   - **Alternative B**: NEVER deprecate. Maintenance cost is one barrel file.

3. **Where does `Header` live — `/core/server` or `/core/client`?**
   - **Empirical fact**: `Header/index.tsx` chrome itself uses zero client APIs. But it imports `HeaderDropdownProvider` (from `NavDropdownContext` — `createContext`) and `HeaderNavDropdown` (from `NavDropdown` — `useState`+`useEffect`+`useRef`). The `HeaderDropdownProvider` is wrapped conditionally only when `entries.some(isNavGroup)` is true — but the IMPORT still happens at module-load, which is when `createContext` evaluates in a non-`'use client'` context.
   - **Recommended default**: ship `Header` in `/core/client` because the dropdown import chain runs at module-load. Cost: marketing-site consumers using simple `<Header />` (no dropdowns) pay a small client-bundle tax. Benefit: zero runtime bug surface; no need to refactor Header.
   - **Alternative A** (zero-cost ideal): refactor Header to dynamically import the dropdown bits — `const HeaderNavDropdown = lazy(() => import('./NavDropdown'))`. Keeps Header server-safe. Cost: ~1 hr extra work + `Suspense` wiring; requires careful testing of SSR flash.
   - **Alternative B**: ship two Header exports — `HeaderServer` (chrome-only, no dropdowns) in `/core/server` and `Header` (full) in `/core/client`. Marketing site uses `HeaderServer`. Cost: API surface duplication, naming ugly.
   - **Recommendation lean**: go with default (Header in `/core/client`). If marketing-site bundle size becomes a problem post-launch, do Alternative A in v2.3.x.

4. **Build strategy for `'use client'` preservation — tsup upgrade vs post-build script**
   - **Recommended default**: post-build script (`scripts/preserve-use-client.mjs`, §2f Option B). Smallest blast radius; no toolchain version bump risk. ~30 LOC.
   - **Alternative**: tsup upgrade to ≥8.4.x with directive-preservation. More "correct" long-term but couples us to a tsup feature that may behave subtly differently across minor versions.

5. **Test framework — vitest vs jest**
   - **Recommended default**: vitest. Lightweight, native ESM, fast, no jest config sprawl. Aligns with RALIA's chosen test framework. Add as devDependency.
   - **Alternative**: skip framework entirely and rely on Storybook visual tests + manual integration in marketing PR #41 revert. Risk: regression on next core refactor goes undetected.

6. **Should `theme` (setTheme/getTheme/clearTheme/themeInitScript) live in `/core/server` or `/core/client`?**
   - **Empirical fact**: `theme/index.ts` exports SSR-safe functions guarded by `typeof window`. The `themeInitScript` constant is a plain string. No React hooks.
   - **Recommended default**: ship in `/core/server`. Functions no-op during SSR; consumers MUST inline `themeInitScript` in `<head>` per existing API docs. Fully RSC-safe.
   - **Alternative**: split — `themeInitScript` in `/core/server` (string constant), functions in `/core/client`. More precise but adds noise.

---

## 7. Risk register

| # | Risk | Severity | Mitigation |
| - | ---- | -------- | ---------- |
| R1 | `react-server` conditional resolves differently across bundler versions (Next.js, Turbopack, Vite, esbuild). Some bundlers may not respect the condition; consumers see "Footer is not exported from /core/server" if Header moved without their knowledge. | MED | Document supported bundler matrix in README. Test against Next.js 15 + 16, esbuild standalone, and `node --experimental-vm-modules`. Build CI matrix that exercises all three resolution conditions. Provide explicit `/core/server` + `/core/client` opt-in paths so consumers can sidestep conditional resolution entirely. |
| R2 | tsup behaviour-change in `'use client'` preservation across minor versions (if Option A chosen). | LOW (Option B mitigates) | Use Option B post-build script (recommended). If Option A chosen later, pin tsup version exactly in package.json and add a build assertion: `grep '^"use client";$' dist/core/client/index.mjs`. |
| R3 | Existing v2.1.x consumers (RALIA, internal-tools, cortex-agents/AgentForce) break on v2.2.0 publish because `react-server` condition changes which bundle they get. | MED | Pre-publish dry-run: build v2.2.0, `npm pack` it, install in a scratch RALIA branch + scratch internal-tools branch, build both, run smoke tests. Only publish after green. |
| R4 | Hidden client API in a "server-classified" component that the audit missed (e.g., an inline `onClick` handler that bundlers treat as needing client context). | LOW | The audit in §2a was empirical (read every component source). `onClick` in JSX is NOT a client-bundle trigger by itself — React serialises event handlers across the boundary. The audit checked for: imports of `react` hooks, top-level `createContext`, browser-API access at module-load. New automated test `rsc-safety.test.ts` (§2d) enforces this empirically against built bundle. |
| R5 | Marketing PR #41 `FooterClient` wrapper revert lands BEFORE v2.2.0 is published to GH Packages → marketing build breaks. | LOW | Sequence per §9: v2.2.0 PUBLISH first; only then revert PR #41 wrapper. Explicit step in §9. |
| R6 | tsup post-build script prepends `'use client'` to client bundle but a future maintainer adds a new file to `/core/server` that genuinely needs the directive — invisible regression. | LOW | `rsc-safety.test.ts` asserts `dist/core/server/index.mjs` does NOT contain `'use client'` (it would be incorrect there) AND does NOT contain top-level `createContext`/`useState`/`useEffect` calls. Inverse test for `/core/client`. |
| R7 | Storybook setup breaks because the multi-entry tsup output changes resolution. | LOW | Storybook resolves source files directly via Vite, not built dist. Should be unaffected. Verify with `npm run storybook` before publish. |
| R8 | Release-please autoversions to a patch (v2.1.1) instead of minor (v2.2.0) because we used `feat` but it's the first commit and bootstrap-sha may treat it as initial. | LOW | Verify in dry-run; use `release-as: 2.2.0` footer in commit message if release-please picks the wrong bump. |

---

## 8. Test plan

### 8a. New tests (atomic units)

**`src/core/__tests__/rsc-safety.test.ts`** (NEW, vitest)
- `it('dist/core/server/index.mjs contains no "use client" directive')` — string-search `dist/core/server/index.mjs`.
- `it('dist/core/server/index.mjs contains no top-level createContext call')` — regex against built bundle.
- `it('dist/core/server/index.mjs contains no top-level useState/useEffect/useRef/useContext/useMemo/useReducer/useCallback/useId/useTransition/useLayoutEffect call')` — regex.
- `it('dist/core/client/index.mjs starts with "use client" directive')` — assert first non-comment line.
- `it('dist/core/index.mjs starts with "use client" directive')` — assert backward-compat union has directive.

**`src/core/__tests__/exports.test.ts`** (NEW, vitest)
- `it('every export of /core is present in /core/server OR /core/client')` — dynamic import all three barrels, set-diff their exports.
- `it('/core/server exports are disjoint from /core/client exports (no overlap)')` — set-intersection empty.
- `it('every classified-server component (per §2a table) is exported from /core/server')` — explicit list assertion.
- `it('every classified-client component (per §2a table) is exported from /core/client')` — explicit list assertion.

### 8b. Integration test (the bug repro)

**`src/core/__tests__/rsc-resolution.test.ts`** (NEW, vitest, node env)
- Build the package (`npm run build` as a pre-step or in CI cache).
- Resolve `@risqbase-inc/ui-components/core/server` via Node's native `import` — must succeed without `createContext is not a function` error.
- Resolve `@risqbase-inc/ui-components/core/client` — must succeed and expose `Modal`, `Toast`, `TelemetryBeacon`.
- Resolve `@risqbase-inc/ui-components/core` from a context with `--conditions=react-server` flag — must transparently get the server bundle.

### 8c. Manual smoke (post-publish, pre-marketing-revert)

- `cd ~/Code/risqbase-com && npm install @risqbase-inc/ui-components@2.2.0`.
- Replace `import { Footer } from '@/components/layout/FooterClient'` with `import { Footer } from '@risqbase-inc/ui-components/core'` in one server-rendered page.
- `npm run build && npm run start` — verify no `createContext is not a function` error in console; page renders.

### 8d. Coverage target

- Per-file ≥ 90% branch coverage on new files (the only new code is two barrels + one test scaffold; branches are minimal).
- Global: do not regress existing coverage. Note: ui-components currently has no test suite (find . -name "*.test.*" → empty), so global coverage is starting from zero. This brief introduces the first vitest tests.

---

## 9. Execution plan — PR sequencing

Single atomic PR per CEO directive ("do it better, once").

### PR scope (one branch, one PR)

1. **Audit + brief** — this document (already written; commit-and-PR as `docs/briefs/BRIEF-RBDS-V2.2.0-CORE-SPLIT.md` for G4 design-system-owner review before implementation).
2. **Implementation** — single commit chain:
   - `feat(core): add /core/server and /core/client barrels`
   - `feat(build): preserve 'use client' directive in client bundle`
   - `feat(core): mark Header as client (transitive createContext)`
   - `test(core): add RSC safety + export-parity tests`
   - `docs(core): document /core/server + /core/client entry points`
3. **Publish v2.2.0** — release-please workflow auto-opens release PR after merge; merging release PR triggers `npm publish` to GH Packages.
4. **Consumer migration (separate PRs in consumer repos)**:
   - `risqbase-com` PR: revert `src/components/layout/FooterClient.tsx` wrapper, import directly from `@risqbase-inc/ui-components/core` (RSC consumers will get `/core/server` via `react-server` condition automatically) OR explicitly from `/core/server`.
   - `ralia-tier2`: no immediate action — backward-compat preserved. Opportunistic migration to `/core/server` / `/core/client` deferred to per-touch.
   - `internal-tools`, `cortex-agents` (now AgentForce): same — no immediate action.

### Parallelism

- Brief authoring + Elena G4 review can complete before any implementation starts.
- Implementation steps 2.1 → 2.5 are sequential (each builds on previous) but small (~1 dev-day).
- Marketing migration (step 4.1) can happen the same day publish lands.

### Reviewers

- **G4 (Elena, design-system owner)**: reviews brief BEFORE implementation. Confirms component classification (§2a, §2c) matches design intent.
- **G1 (Alex, this persona)**: reviews implementation PR. Architecture lens.
- **G2 (Marcus, security)**: reviews barrel split for any secret-leak or attack-surface change. Expected verdict: PASS (no security surface change).
- **G6 (Jordan, DevOps)**: reviews build config + release-please interaction + publish workflow.

---

## 10. Success criteria

- [ ] Brief reviewed and approved by Elena (G4) before implementation begins.
- [ ] All §2a component classifications confirmed by code-read (Liam or Alex re-audits during implementation).
- [ ] `dist/core/server/index.mjs` empirically contains zero `'use client'` directives AND zero top-level React-hook calls (verified by `rsc-safety.test.ts`).
- [ ] `dist/core/client/index.mjs` empirically starts with `'use client'` directive (verified by `rsc-safety.test.ts`).
- [ ] `dist/core/index.mjs` empirically starts with `'use client'` directive (backward-compat union).
- [ ] Every v2.1.x export of `/core` is reachable from `/core` (post-publish) without API break (verified by `exports.test.ts`).
- [ ] `npm pack` + manual install in scratch marketing branch + scratch RALIA branch builds green.
- [ ] `package.json` version is `2.2.0`.
- [ ] CHANGELOG.md `Unreleased` section has v2.2.0 entry under `### Features`.
- [ ] README.md has new "Module entry points" section.
- [ ] Marketing PR #41 `FooterClient` wrapper reverted in a follow-up PR (link from this brief's eventual handoff doc).
- [ ] G6 confirms release-please PR autogenerates with version 2.2.0 and publish workflow succeeds.

---

## 11. Out of scope

- **Physical file moves** of components (e.g., relocating `src/core/Button/` to `src/core/server/Button/`). Re-export from new barrels only. (See §2e.)
- **Other domain barrels** (`/ai`, `/data-viz`, `/marketing`, `/content`, `/primitives`). Same pattern may apply but is a separate audit. File follow-up brief if needed.
- **tsup version upgrade** beyond what's required for `'use client'` preservation (Option A vs B in §2f Q4).
- **Dynamic-import refactor of Header to keep it server-safe** (Q3 Alternative A). Defer to v2.3.x if marketing-site bundle-size analysis flags it.
- **Migration of RALIA / internal-tools / cortex-agents** consumers to explicit `/core/server` / `/core/client` paths. Opportunistic only; v2.1.x compat preserved.
- **Removal of v2.1.x `/core` barrel** — defer to v3.0+ per Q2.
- **New components** — none added.
- **Bundle-size analysis or optimisation** of the new bundles vs the old. Can be a follow-up.

---

## 12. Dependencies

- **Upstream briefs**: none. Self-contained.
- **External services**: GH Packages registry (`npm.pkg.github.com`) for publish. Already wired per `publishConfig.registry` in package.json.
- **CEO decisions required before implementation starts**: all 6 questions in §6 (recommend defaults for 1, 2, 4, 5, 6; Q3 needs explicit confirmation because it affects Header migration surface).
- **G4 (Elena) review** of this brief before dispatching implementer.

---

## Appendix: empirical evidence cited

- `src/core/index.ts` lines 1–63 (current barrel; no `'use client'`).
- `dist/core/index.mjs` lines 5, 633 (post-tsup; `useEffect`/`useState` inlined without directive).
- `grep '"use client"' dist/core/index.mjs` → no matches (verified 2026-05-22).
- `src/core/TelemetryBeacon/index.tsx` line 1 — `'use client'` present at source.
- `src/core/Modal/index.tsx` line 1 — `'use client'` present at source.
- `src/core/Toast/index.tsx` line 1 — `'use client'` present at source.
- `src/core/Header/NavDropdown.tsx` line 1 — `'use client'` present at source; uses `useState`, `useRef`, `useEffect`, `useCallback`, `useId`.
- `src/core/Header/NavDropdownContext.tsx` line 1 — `'use client'` present at source; uses `createContext`, `useContext`, `useState`, `useMemo`.
- `src/core/Header/index.tsx` lines 1–10 — explicit comment confirming chrome is RSC-safe, dropdown is the client island; imports `HeaderDropdownProvider` and `HeaderNavDropdown` unconditionally at module-load.
- `src/core/Footer/index.tsx` lines 1–172 — pure markup, no hooks, no browser APIs. Confirmed RSC-safe.
- `risqbase-com/src/components/layout/FooterClient.tsx` — current workaround.
- CEO directive 2026-05-22: "do it better, once. ui-components v2.2.0 splits /core into /core/server (RSC-safe) + /core/client (client-only). Skip v2.1.3 stopgap. This is the SOLE fix."
- React docs: ["use client" directive](https://react.dev/reference/rsc/use-client) — server modules MAY import client modules; tsup's directive-stripping behaviour is the trigger for this brief.

---

## Writing notes

- Brief authored by G1 (Alex Chen) per BRIEF-DEV ownership.
- British English throughout.
- Empirical audit performed 2026-05-22 against `~/Code/ui-components` working tree (no uncommitted local changes that affect classification — verified by `git status` reading file timestamps).
- Hexagonal/DDD framing not invoked — this is a build-tool + barrel-organisation change, not a domain-architecture change.
- ADR not warranted — barrel restructure with backward-compat preserved is not an irreversible decision per ADR criteria.
