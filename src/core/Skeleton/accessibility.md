# Skeleton — accessibility

A purely visual loading affordance. Conveys progress to sighted users only.

## Contracts
- `role="presentation"` + `aria-hidden="true"` — assistive tech skips the skeleton entirely.
- The consumer is responsible for an `aria-busy="true"` on the *parent* container while skeletons are mounted, and an `aria-live="polite"` region elsewhere that announces "loaded" / data summary when content swaps in. Don't try to make the skeleton itself accessible.
- Animation respects `prefers-reduced-motion: reduce` — the shimmer is suppressed; the surface remains a static muted block.

## Pair with
- Real content. A skeleton that approximates the eventual layout (matching block heights / line counts) prevents layout shift — a CLS win as much as an accessibility win.
