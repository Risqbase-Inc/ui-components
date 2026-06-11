---
group: duration
count: 5
---

# Tokens — `duration.*`

| Token | Tier | Type | Light | Dark | Description |
|---|---|---|---|---|---|
| `duration.motion.instant` (`--duration-motion-instant`) | primitive | duration | `0ms` | `0ms` | No animation — reduced-motion fallback and never-animate states (spec §5.1, §8.5.3) |
| `duration.motion.reactive` (`--duration-motion-reactive`) | primitive | duration | `100ms` | `100ms` | Direct response to input — hover, focus, tooltip in, citation chip pressed state (spec §5.1, §15.3 named exemplar) |
| `duration.motion.considered` (`--duration-motion-considered`) | primitive | duration | `300ms` | `300ms` | Deliberate state change — modal open, drawer slide, panel transition, system feedback (spec §5.1) |
| `duration.motion.celebratory` (`--duration-motion-celebratory`) | primitive | duration | `500ms` | `500ms` | Story-telling reveal — gauge fill, multi-step IRIS streaming, outcome-pattern transitions (spec §5.1, §6.5, §7.11) |
| `duration.gauge.reveal` (`--duration-gauge-reveal`) | primitive | duration | `500ms` | `500ms` | Gauge fill-arc reveal — alias to motion.celebratory (spec §15.6.2) |
