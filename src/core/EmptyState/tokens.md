# Tokens — `EmptyState`

| Token | Used for |
|---|---|
| `color.text.default` | `title` |
| `color.text.subtle` | `description` + icon tint |

EmptyState has no surface of its own — it inherits the surface of its parent. This is deliberate: it should drop into cards, drawers, full-page routes, and chart containers without painting a new background.

Variant is exposed as `data-empty-variant="<variant>"` for telemetry / scanner inspection but does not change the visual treatment.
