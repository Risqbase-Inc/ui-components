# Tokens — `ChartContainer`

Consumes the canonical chart-categorical palette:

| Token | Used for |
|---|---|
| `color.chart.cat.1` … `cat.8` | series colours, indexed by position |
| `color.chart.axis` | axis baseline |
| `color.chart.plot-area-bg` | container background |
| `color.text.default` | header copy |
| `color.text.subtle` | footer / figcaption |

The 8-step categorical palette is sequenced for safe pairwise discrimination — `cat.1` (indigo) and `cat.2` (teal) are the strongest contrast pair and should be used for the two most important series.

`heatmap`, `area`, `choropleth`, and `metric-card` are deferred to v4.4.
