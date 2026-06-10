import { ImpactGraph } from './ImpactGraph'
import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import { edpb_04_2026 } from './fixtures/edpb-04-2026'
import { marketingCategories } from './fixtures/marketing-categories'
import { buildAriaLabel } from './layout'

// Static, marketing-frozen wrapper over ImpactGraph. Locks
// width=1100×460, locks categories to the marketing canon, attaches no
// click handlers, and wraps the SVG in a screenshot-chrome (browser
// dots + URL bar) matching Demo D §2 pixel-for-pixel. Consumers in
// risqbase-com import this from @risqbase-inc/ui-components and pass
// only `fixture`, `withChrome`, `withLegend`. Spec §3.

export interface MarketingImpactGraphProps {
  /** Fixture key. v2.1.0 ships one: 'edpb-04-2026'. */
  fixture?: 'edpb-04-2026'
  /** Show the screenshot-chrome wrapper (browser dots + URL bar). */
  withChrome?: boolean
  /** Show the legend strip below the graph. */
  withLegend?: boolean
  className?: string
}

const FIXTURES = {
  'edpb-04-2026': edpb_04_2026,
} as const

export function MarketingImpactGraph({
  fixture = 'edpb-04-2026',
  withChrome = true,
  withLegend = true,
  className = '',
}: MarketingImpactGraphProps) {
  const data = FIXTURES[fixture]
  const ariaLabel = buildAriaLabel(data.alert, data.entities, marketingCategories, data.cascades)

  const graph = (
    <ImpactGraph
      {...data}
      categories={marketingCategories}
      width={1100}
      height={460}
      bare={!withLegend}
      ariaLabel={ariaLabel}
    />
  )

  return (
    <div className={`marketing-impact-graph ${className}`} style={{ width: '100%' }}>
      <TelemetryBeacon
        component="MarketingImpactGraph"
        variant={fixture}
        meta={{ withChrome, withLegend }}
      />
      {withChrome ? (
        <div
          style={{
            background: 'var(--color-surface-default)',
            borderRadius: 'var(--dimension-radius-2xl)',
            boxShadow: 'var(--shadow-floating)',
            border: '1px solid var(--color-border-subtle)',
            overflow: 'hidden',
          }}
        >
          {/* Chrome bar — browser dots + URL pill, per Demo D */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              background: 'var(--color-surface-muted)',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
            aria-hidden="true"
          >
            <div style={{ display: 'flex', gap: 6 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'var(--color-border-default)',
                }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'var(--color-border-default)',
                }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'var(--color-border-default)',
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                background: 'var(--color-surface-default)',
                padding: '4px 12px',
                borderRadius: 9999,
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                fontSize: 10,
                color: 'var(--color-text-subtle)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              ralia.io/horizon-iris/alerts/edpb-04-2026
            </div>
            <span
              style={{
                fontSize: 11,
                // D-125b: this caption sits on the muted chrome bar.
                color: 'var(--color-text-subtle-on-muted)',
                fontWeight: 500,
              }}
            >
              Impact graph · EDPB Guidelines 04/2026
            </span>
          </div>
          <div style={{ padding: 16 }}>{graph}</div>
        </div>
      ) : (
        graph
      )}
    </div>
  )
}
