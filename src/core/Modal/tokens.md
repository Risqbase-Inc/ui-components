# Tokens — `Modal` · `Drawer` · `Sheet`

| Token | Used for |
|---|---|
| `color.surface.default` | overlay surface background |
| `color.text.default` | title colour |
| `dimension.radius.card.default` | Modal corners, Sheet top corners |

The scrim is a fixed `rgba(0, 0, 0, 0.5)` overlay — not tokenised in v4.3 (deliberate; the scrim colour doesn't theme with the rest of the system because it's a layer between themes). Revisit in v4.4 alongside the dark-mode theme stub.

The slide-in animation references `slide-in-from-right` / `slide-in-from-left` Tailwind utilities — wire these via your Tailwind config if the consumer site doesn't ship `tailwindcss-animate`.
