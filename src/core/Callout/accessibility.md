# Callout — accessibility

The role applied to the wrapper depends on `intent`:

| Intent | ARIA role | Rationale |
|---|---|---|
| `info` | `status` | Polite live region — announce when content appears mid-flow |
| `warning` | `alert` | Assertive — needs immediate attention |
| `danger` | `alert` | Assertive — same |
| `success` | `status` | Polite — confirmation, not a warning |
| `tip` | (none — plain `div`) | Decorative; the body is the message |

## Contracts
- Icon is `aria-hidden="true"` — the visible text carries the meaning. WCAG 1.4.1 (Use of Color) is satisfied because intent is conveyed in the surrounding `title` / body copy as well as the colour.
- Pass `icon={null}` to omit the glyph entirely (text-only callout).
- For `danger` / `warning` content that *changes* during the page lifetime (e.g. a streaming validation error), keep the wrapper mounted and update its children — replacing the wrapper re-fires the `alert` announcement.
