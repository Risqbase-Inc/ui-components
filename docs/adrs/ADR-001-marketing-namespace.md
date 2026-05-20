# ADR-001: `src/marketing/` namespace

## Status

Accepted — 2026-05-20 (backfilled post-shipment of v2.1.0).

## Context

v2.1.0 introduced `HeroVideo` — a homepage-hero video component (BRIEF-429
V2) consumed by `risqbase-com`. The accessibility and loading contract for
this component is materially different from in-product `core/` components:

- **Lazy-loaded by default** (IntersectionObserver-gated; pre-roll cost
  too high for above-the-fold hydration on every page).
- **Captions required on media** (`<track kind="captions">` mandatory;
  WCAG 1.2.2 hard floor for marketing video).
- **No live data binding** (no Supabase, no auth, no `org_id` context;
  rendered at the marketing-tier where the user is unauthenticated).
- **Reduced-motion replaces the medium entirely**, not just stops animation
  — `prefers-reduced-motion: reduce` swaps the `<video>` for a 2×2
  storyboard grid with structured SR captions.

We had three options for where the component should live:

1. **Inside `src/core/`** — same tier as `Header`, `Button`, etc. Mixes
   marketing-tier loading expectations with in-product expectations; future
   `core/` consumers (RALIA app) would inherit `'use client'` lazy-load
   semantics they don't want.
2. **Inside `src/ai/`** — wrong domain (HeroVideo has no AI content).
3. **New top-level `src/marketing/` namespace** — what we shipped.

The component header comment on `src/marketing/index.ts` already captures
the rationale, but the **decision is irreversible-ish**: consumers
(`@risqbase-inc/ui-components/marketing` subpath) now have an import path
that depends on this namespace. Renaming or collapsing it back into `core/`
would be a breaking change.

G1 (Alex) post-merge audit (`docs/reviews/v2-1-0-post-merge-audit/G1.md`
§2.2 XCUT-2) called for a backfilled ADR.

## Decision

`src/marketing/` is a first-class namespace alongside `src/core/`,
`src/ai/`, `src/data-viz/`, `src/primitives/`, `src/content/`. It hosts
**marketing-tier compositions** — components designed for unauthenticated
top-of-funnel surfaces (homepage, landing pages, campaign pages) on
`risqbase-com` and `ralia.io`.

**Contract for entries in this namespace:**

| Contract | Rule |
|---|---|
| Loading | Lazy-loaded by default. Above-the-fold cost amortised across viewport visibility, not page mount. |
| Media | Captions required on `<video>` / `<audio>`. `<track kind="captions">` mandatory at v2.1.0+. |
| Motion | `prefers-reduced-motion: reduce` MUST have a non-degenerate fallback (not "animation pauses" — a substantively-equivalent static representation). |
| Data | No live data binding. No Supabase client. No auth context. No `org_id`. Inputs are static props or fixture data. |
| Hydration | Server-renderable shell where possible; client-island sub-trees only when behaviour requires it. |
| Telemetry | `TelemetryBeacon` opt-in (consumer decides whether to ship). |
| Subpath | Re-exported via `@risqbase-inc/ui-components/marketing` subpath (see `package.json` `exports`, `tsup.config.ts` entry). |

**Where consumers import from:**

```ts
// Marketing site (risqbase-com)
import { HeroVideo } from '@risqbase-inc/ui-components/marketing'

// NOT this:
import { HeroVideo } from '@risqbase-inc/ui-components/core'  // wrong tier
```

**RALIA app does not import from this namespace.** RALIA is post-login
utilitarian (per CEO directive 2026-05-14 "no marketing on authed
routes"). Marketing-tier components are not appropriate for in-product
surfaces.

## Consequences

**Easier:**

- Future marketing-only compositions (campaign banners, A/B-test widgets,
  OG-card components, conversion-event widgets) have an obvious home —
  add them under `src/marketing/<Component>/` and re-export from the
  barrel.
- Consumers can grep `'@risqbase-inc/ui-components/marketing'` to find
  every marketing-tier dependency at a glance.
- The marketing-vs-product loading-discipline boundary is a directory
  boundary, not a convention to remember.
- `risqbase-com` Vercel bundle excludes any `core/` / `ai/` / `data-viz/`
  primitives it doesn't use, because marketing imports go through a
  separate barrel + tsup entry — tree-shaking is cleaner.

**Harder:**

- New marketing components need a CONTRIBUTING reminder: "if it's lazy,
  captioned, motion-fallbacked, and unauthenticated → it goes under
  `src/marketing/`, not `src/core/`". Documented inline in
  `src/marketing/index.ts` header comment.
- Components that span tiers (e.g. a "marketing demo of an in-product
  component") need a clear ownership call — usually they're an
  ai-tier or data-viz-tier primitive plus a marketing-tier wrapper (see
  `MarketingImpactGraph` for the pattern: primitive lives in
  `src/data-viz/`, marketing-frozen wrapper lives next to it but in
  practice we keep it in the same module rather than crossing the
  namespace boundary, because the layout engine is shared and the
  wrapper is thin).

**Re-evaluate when:**

- A marketing component grows past ~500 LOC and needs internal helpers
  — at that point promote to its own subdirectory tree
  (`src/marketing/HeroVideo/lib/`, etc.) rather than flattening into
  the namespace root.
- We add a 3rd consumer (today: `risqbase-com` only; v2.2.0 may bring
  `design.risqbase.com`). At 3 consumers, evaluate whether the namespace
  needs sub-organisation by surface (e.g.
  `src/marketing/{homepage,landing,docs-site}/`).
- If a future component blurs the marketing-vs-product line (e.g. a
  trial-signup widget rendered both on marketing and inside RALIA),
  recognise that the contract differs and either compose two thin
  wrappers around a shared core primitive OR carve out a third tier.
  Do NOT relax the marketing namespace contract to fit.

## Alternatives considered

- **Inside `core/`** — rejected. Mixing marketing-tier loading discipline
  with in-product component expectations risks accidental marketing
  patterns leaking into RALIA bundles. The lazy-load + captions-required
  + no-live-data contract would either be ignored or applied too
  broadly.

- **Inside `ai/`** — rejected. `ai/` is the namespace for
  AI-content-aware components (CitationChip, IRIS panels). HeroVideo
  has no AI content; ai/ would dilute the namespace's meaning.

- **Inside `content/`** — rejected as too generic. `src/content/` already
  exists for static-content primitives (definitions, glossary entries);
  marketing-tier components are richer than content primitives and have
  a distinct loading contract.

- **Per-product directories (`src/risqbase-com/`, `src/ralia/`)** —
  rejected. We ship one package; product-scoped directories would
  fragment shared marketing primitives (HeroVideo is theoretically
  reusable across both marketing sites) and add namespace churn each
  time a new product launches.

## References

- G1 post-merge audit: `docs/reviews/v2-1-0-post-merge-audit/G1.md` §2.2 XCUT-2
- Implementation header: `src/marketing/index.ts`
- Component spec: `docs/specs/v2.1.0/02-HeroVideo.md`
- Brief: BRIEF-429 V2 homepage hero
- CEO directive: "no marketing on authed routes" (2026-05-14)
- ADR format: Michael Nygard, "Documenting Architecture Decisions" (public)
