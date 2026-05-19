# EmptyState — accessibility

EmptyState wraps a heading + supporting copy + optional actions in a stable layout. It deliberately doesn't pick an ARIA role — the consumer composes the semantics.

## Contracts
- The `title` renders as `<h3>`. Place EmptyState inside a section whose `<h2>` provides outer hierarchy; if EmptyState replaces a routed `<main>` (rare), wrap it in a higher heading.
- Decorative icon is `aria-hidden="true"` — meaning is in the text.
- If EmptyState is replacing tabular content as the result of filtering, set `aria-live="polite"` on the surrounding container so the new state is announced (don't put `aria-live` on EmptyState itself — replacing the wrapper would re-announce on every render).
- `action` / `secondaryAction` accept any node; for keyboard parity pass a `<Button>` from `core` rather than a plain `<a>`.
