---
group: color-action
count: 4
---

# Tokens — `color-action.*`

| Token | Tier | Type | Light | Dark | Description |
|---|---|---|---|---|---|
| `color.action.primary` (`--color-action-primary`) | semantic | color | `#4f46e5` | `#4768db` | Primary action surface — CTAs, primary buttons. Fill contract: ≥3:1 non-text vs the page surface (WCAG 1.4.11); the white-text-on-brand contract is carried by the text.on-action pair. For interactive TEXT on default surfaces use action.link (v4.4 B2). |
| `color.action.link` (`--color-action-link`) | semantic | color | `#4f46e5` | `#678af6` | Interactive text — links and inline text actions on default surfaces. Resolves identically to action.primary in light; themed independently in dark, where the fill contract (white-on-brand) and the text contract (brand-on-canvas, 4.5:1) cannot be satisfied by one value. Added v4.4 Workstream B. |
| `color.action.primary-hover` (`--color-action-primary-hover`) | semantic | color | `#4338ca` | `#678af6` | Primary action hover state |
| `color.action.primary-subtle` (`--color-action-primary-subtle`) | semantic | color | `#e0e7ff` | `#182241` | Primary action subtle background — hover for ghost/secondary |
