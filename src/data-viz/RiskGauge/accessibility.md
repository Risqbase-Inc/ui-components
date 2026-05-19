# RiskGauge — accessibility

A higher-level configuration over `Gauge`. The accessible name combines the consumer label, residual, and inherent in one string so screen-reader users hear the whole context at once.

## Contracts
- Renders `Gauge` with a derived `aria-label` like *"GDPR Art. 32 — residual 42 of 100, inherent 78 of 100"*.
- The band chip uses `BandBadge` which carries its own accessible label.
- The delta pill is annotated with `aria-label="Delta: −36"` — sign-aware ("−" / "+" / "No change").
- Use `bandOverride` when the consumer enforces non-default thresholds (regulatory regime, jurisdictional cut-points). The visual band still tracks the override; the underlying residual numeric is unchanged.
