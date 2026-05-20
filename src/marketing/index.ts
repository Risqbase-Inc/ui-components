// Marketing — Layer-2 marketing-tier compositions (spec docs/specs/v2.1.0/00-cover.md §2.1).
//
// Marketing surfaces have different accessibility/loading characteristics
// from in-product `core/` components: lazy-loaded by default, captions
// required on media, no live data binding. Promoting a `marketing/`
// namespace keeps those expectations legible. Future migrations can move
// marketing-only compositions out of `core/` into this directory.
//
// v2.1.0 ships:
//   - HeroVideo  (BRIEF-429 V2 homepage hero — lazy-loaded, captioned,
//                 reduced-motion 2×2 storyboard fallback)

export { HeroVideo } from './HeroVideo'

export type {
  HeroVideoBeat,
  HeroVideoSource,
  HeroVideoState,
  HeroVideoProps,
} from './HeroVideo/types'
