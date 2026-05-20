# ADR-002: `src/primitives/` public + internal coexistence

## Status

Accepted — 2026-05-20 (backfilled post-shipment of v2.1.0).

## Context

`src/primitives/` was introduced at v2.0.0 with intent to be
**internal-only**: behavioural primitives like `Slot`, `useId`,
`VisuallyHidden`, `composeRefs`, etc. — implementation details that
ui-components' own internals depend on, never re-exported to consumers.
The package.json had no `./primitives` subpath export at v2.0.0.

v2.1.0 (Spec 06) shipped `ArcDecoration`: a pure-decoration SVG
primitive consumed by marketing surfaces (Demo B signature surfaces; cf.
`docs/specs/v2.1.0/06-ArcDecoration.md`). ArcDecoration is genuinely a
primitive in the architectural sense — pure geometry + SVG, no business
logic, no data binding, no theme awareness beyond palette tokens — so
forcing it into `src/core/` (where the Header lives) would mis-categorise
it. The cleanest home is `src/primitives/`.

This created a fork in the road:

1. **Make `primitives/` fully public** — promote every internal primitive
   to the public barrel. Risks exposing implementation details
   (`Slot.tsx` API churn would become a breaking change for consumers).
2. **Keep `primitives/` fully internal** — add a new `src/decorations/`
   namespace just for ArcDecoration. Cleaner but adds a 7th top-level
   namespace for what is conceptually one component.
3. **Coexistence**: keep public + internal primitives in the same
   directory, gated by the barrel — internal primitives stay
   unexported, public primitives get re-exported. This is what we
   shipped.

The component header comment on `src/primitives/index.ts` documents the
convention. G1 (Alex) post-merge audit
(`docs/reviews/v2-1-0-post-merge-audit/G1.md` §2.2 XCUT-2) called for a
backfilled ADR because the namespace's public/internal split is now an
import-path contract: consumers can `import { ArcDecoration } from
'@risqbase-inc/ui-components/primitives'` and that path is irreversible
without a breaking change.

## Decision

`src/primitives/` is a **mixed namespace** hosting both public and
internal primitives, with the public/internal split enforced by the
barrel (`src/primitives/index.ts`).

**Rules:**

| Rule | Implementation |
|---|---|
| Public primitives ARE re-exported from `src/primitives/index.ts`. | `export { ArcDecoration } from './ArcDecoration'` + type re-exports. |
| Internal primitives are NOT re-exported from the barrel. | `Slot`, `useId`, `VisuallyHidden`, `composeRefs` consumed via deep relative imports from sibling modules — never from the package barrel. |
| The barrel header comment documents the convention explicitly. | Already in place (see `src/primitives/index.ts` lines 1-21). |
| New primitives DEFAULT to public unless explicitly flagged internal. | Behavioural primitives (hooks, refs, composition utilities) are typically internal; decoration/composition primitives (SVG, gradient backdrops, watermarks, scrim primitives) are typically public. When in doubt, file as internal and promote later — promotion is non-breaking; demotion is. |
| Promotion to public requires G4 (Elena) review. | The barrel widening is part of the public API surface. Adding a new entry to `src/primitives/index.ts` requires a G4 sign-off in the PR description, because the consumer-facing surface is a design-system concern. |

**Public primitives at v2.1.0:**
- `ArcDecoration` (SVG pure-decoration; palette tokens; reduced-motion gated)

**Internal primitives at v2.1.0:**
- `Slot` (Radix-style composition)
- `useId` (SSR-stable ID hook)
- `VisuallyHidden` (sr-only wrapper)
- `composeRefs` (forwarded-ref merge utility)
- Any future behavioural utility added without an explicit promotion vote

**Subpath exports:**
- `@risqbase-inc/ui-components/primitives` exports the public set only
  (whatever the barrel re-exports).
- Internal primitives are NOT consumable from outside the package — no
  subpath, no deep import (TypeScript blocks deep imports outside
  `exports` map).

## Consequences

**Easier:**

- New decoration primitives compose naturally into the namespace
  (gradient backdrops, watermarks, scrim primitives all fit here without
  a new directory).
- Internal behavioural primitives have a stable home — they don't have
  to move when one of their cousins gets promoted to public.
- The G4-required-for-promotion rule keeps public-surface widening
  intentional rather than accidental.

**Harder:**

- Reviewers MUST check the barrel diff in every primitives/ PR to
  catch accidental public exports of internal helpers.
- The "public-by-default for decoration / internal-by-default for
  behaviour" heuristic is a judgment call — relies on reviewer
  discipline, not lint enforcement.
- A future internal primitive whose name collides with a public one
  (unlikely but possible) would need disambiguation by file rather
  than by import path.

**Re-evaluate when:**

- The mixed namespace grows past ~10 primitives total. At that point,
  the public/internal split may benefit from being a directory split
  (`src/primitives/public/`, `src/primitives/internal/`) for grep
  clarity, even if the barrel contract stays identical.
- A consumer reports that an internal primitive is leaking through a
  deep import (it should be impossible via the `exports` map, but
  package consumers occasionally bypass exports — file a fix and
  consider whether the primitive should be promoted instead).
- We adopt an ESLint rule that lint-enforces the public/internal split
  (e.g. `no-restricted-imports` blocking deep imports into
  `src/primitives/Slot`). Worth evaluating at the next platform-standards
  sweep.

## Alternatives considered

- **Fully public primitives namespace** — rejected. Promoting `Slot`,
  `useId`, etc. to public would freeze their APIs against consumer
  expectations. These are implementation details whose shape evolves
  with internal refactors; making them public removes that freedom for
  no consumer benefit (consumers don't ask for them — RALIA and
  risqbase-com use `core/` and `ai/` and don't need a Radix-style Slot
  primitive directly).

- **Fully internal primitives namespace + new `src/decorations/`** —
  rejected. Adding a 7th top-level namespace for a category that holds
  one component (and likely 2-3 more over the next 6 months) is
  premature granularity. Decoration primitives ARE primitives; the
  conceptual cohesion is high.

- **Move ArcDecoration into `src/core/`** — rejected. Core is for
  application-shell components (Header, Card, Button, TelemetryBeacon)
  that compose real UX. Decoration is a primitive of a different
  category — pure geometry, no UX semantics, no a11y role beyond
  `aria-hidden="true"`.

- **Move ArcDecoration into `src/marketing/`** — rejected. ArcDecoration
  is consumable by any tier: marketing surfaces (Demo B signature
  surfaces) AND in-product chrome (an in-product header decoration is
  plausible). Forcing it under `src/marketing/` would either prevent
  in-product reuse or require re-export from marketing into core, which
  is the opposite of the architectural intent.

## References

- G1 post-merge audit: `docs/reviews/v2-1-0-post-merge-audit/G1.md` §2.2 XCUT-2
- Implementation header: `src/primitives/index.ts` (lines 1-21)
- Component spec: `docs/specs/v2.1.0/06-ArcDecoration.md`
- Verification report: `docs/specs/v2.1.0/verification-report.md` §S-1, S-2, S-3
- Companion ADR: ADR-001 (marketing namespace)
- ADR format: Michael Nygard, "Documenting Architecture Decisions" (public)
