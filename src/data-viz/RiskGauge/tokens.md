# Tokens — `RiskGauge`

Consumes:
- `Gauge` tokens (see `../Gauge/tokens.md`)
- `Badge` band-* tokens (`color.badge.band.*`)
- `color.surface.muted` + `color.text.default` for the delta pill
- `dimension.radius.sm` for the delta pill

Band derivation (default thresholds, override via `bandOverride`):

| Residual | Band |
|---|---|
| 0–20 | `very-low` |
| 21–40 | `low` |
| 41–60 | `medium` |
| 61–80 | `high` |
| 81–100 | `very-high` |
