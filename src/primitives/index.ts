// Primitives — public surfaces.
//
// Initial v2.0.0 intent was for this directory to be internal-only
// (Slot, useId, VisuallyHidden, composeRefs etc). v2.1.0 (Spec 06,
// ArcDecoration) introduces the first PUBLIC primitive in this
// namespace: a pure-decoration SVG that downstream marketing surfaces
// consume. The directory now hosts both flavours:
//
//   - **Public** decoration / composition primitives (ArcDecoration
//     and future siblings: gradient backdrops, watermarks, scrim
//     primitives). Re-exported here and ship as the
//     `@risqbase-inc/ui-components/primitives` subpath in
//     package.json `exports`.
//
//   - **Internal** behavioural primitives (Slot, useId, etc) live in
//     the same directory but are NOT re-exported here. They remain
//     implementation details consumed via deep relative imports from
//     other domains.
//
// Adding a new entry to this barrel widens the package surface area —
// review at G4 (Elena) before promoting.

export { ArcDecoration } from './ArcDecoration'
export type {
  ArcDecorationProps,
  ArcPalette,
  ArcPosition,
} from './ArcDecoration'
