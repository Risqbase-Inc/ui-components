---
group: easing
count: 3
---

# Tokens — `easing.*`

| Token | Tier | Type | Light | Dark | Description |
|---|---|---|---|---|---|
| `easing.standard` (`--easing-standard`) | primitive | cubicBezier | `cubic-bezier(0.4, 0.0, 0.2, 1)` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Default curve — balanced acceleration / deceleration. Use for in-and-out transitions and most state changes (spec §5.1). |
| `easing.emphasised` (`--easing-emphasised`) | primitive | cubicBezier | `cubic-bezier(0.2, 0.0, 0, 1.0)` | `cubic-bezier(0.2, 0.0, 0, 1.0)` | Emphasised — biased toward the end. Use for moments that should land with intent (gauge fill, story reveals, hero CTAs). |
| `easing.decelerated` (`--easing-decelerated`) | primitive | cubicBezier | `cubic-bezier(0.0, 0.0, 0.2, 1)` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Pure deceleration — fast in, ease to rest. Use for entries: things appearing on screen (modals, drawers, citation chips mounting). |
