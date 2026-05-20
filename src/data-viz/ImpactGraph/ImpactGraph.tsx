import { useMemo, type KeyboardEvent } from 'react'
import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import type {
  CategoryPalette,
  ImpactEntity,
  ImpactGraphProps,
} from './types'
import {
  SEVERITY_EDGE_STROKE,
  SEVERITY_RING_FILL,
  SEVERITY_STROKE,
  buildAriaLabel,
  computeLabelPositions,
  getCentre,
  getCentreRadius,
  layoutEntities,
} from './layout'

// Spec: docs/specs/v2.1.0/01-ImpactGraph.md (full design),
// docs/specs/v2.1.0/01-ImpactGraph.accessibility.md (SVG a11y).
//
// Two render paths converge here:
//   - static (no click handlers) → presentational SVG with structured
//     SR caption; used by MarketingImpactGraph.
//   - interactive (onEntityClick / onAlertClick) → SVG with focusable
//     <a role="button"> nodes wired through keyboard handlers.
//
// Layout is pure (see ./layout.ts) so it can be tested in isolation
// without React.

const MONO_FONT_STACK =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'

const DEFAULT_WIDTH = 1100
const DEFAULT_HEIGHT = 460

/** REFINE 1.1: dev throws on unknown category; prod renders with a
 *  default fill + warns. Kept as a side-effect inside the component
 *  body so React error boundaries can catch dev-mode throws. */
function checkUnknownCategories(
  entities: ImpactEntity[],
  categories: CategoryPalette[]
): void {
  const known = new Set(categories.map((c) => c.key))
  const unknown = entities.filter((e) => !known.has(e.category))
  if (unknown.length === 0) return
  const isProd = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production'
  if (!isProd) {
    throw new Error(
      `ImpactGraph: unknown categor${unknown.length === 1 ? 'y' : 'ies'} ` +
        unknown.map((e) => `"${e.category}" (entity ${e.id})`).join(', ') +
        `. Add the key to the \`categories\` prop or remove the entity.`
    )
  }
  for (const e of unknown) {
    // eslint-disable-next-line no-console
    console.warn(
      `ImpactGraph: unknown category "${e.category}" for entity ${e.id}; rendering with default fill.`
    )
  }
}

export function ImpactGraph(props: ImpactGraphProps) {
  const {
    alert,
    entities,
    cascades = [],
    categories,
    irisAttribution,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    bare = false,
    onEntityClick,
    onAlertClick,
    className = '',
    ariaLabel,
  } = props

  checkUnknownCategories(entities, categories)

  const interactive = Boolean(onEntityClick || onAlertClick)
  const { cx, cy } = getCentre(width, height)
  const centreR = getCentreRadius(width)

  const layouts = useMemo(
    () => layoutEntities({ entities, categories, width, height }),
    [entities, categories, width, height]
  )

  const labelPositions = useMemo(
    () => computeLabelPositions(layouts, { cx, cy }),
    [layouts, cx, cy]
  )

  // Cascade-edge lookup: id → layout, used to route entity-to-entity
  // dashed paths.
  const layoutById = useMemo(() => {
    const m = new Map<string, (typeof layouts)[number]>()
    for (const l of layouts) m.set(l.entity.id, l)
    return m
  }, [layouts])

  const resolvedAriaLabel = ariaLabel ?? buildAriaLabel(alert, entities, categories, cascades)
  const figureId = useMemo(() => `ig-${Math.random().toString(36).slice(2, 9)}`, [])

  const handleKeyDown = (
    e: KeyboardEvent<HTMLAnchorElement>,
    handler: () => void
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handler()
    }
  }

  const entitiesById = useMemo(() => {
    const m = new Map<string, ImpactEntity>()
    for (const e of entities) m.set(e.id, e)
    return m
  }, [entities])

  return (
    <figure
      role="figure"
      aria-labelledby={`${figureId}-title`}
      aria-describedby={`${figureId}-desc`}
      className={`relative ${className}`}
      style={{ width: '100%', maxWidth: width, margin: 0 }}
    >
      <TelemetryBeacon
        component="ImpactGraph"
        variant={interactive ? 'interactive' : 'static'}
        meta={{ entityCount: entities.length, categoryCount: categories.length, cascadeCount: cascades.length, bare }}
      />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby={`${figureId}-title`}
        aria-describedby={`${figureId}-desc`}
        focusable="false"
        width="100%"
        height="auto"
        style={{ display: 'block' }}
      >
        <title id={`${figureId}-title`}>{resolvedAriaLabel}</title>
        <desc id={`${figureId}-desc`}>
          {alert.description ?? resolvedAriaLabel}
        </desc>

        {/* Chrome ring around centre — suppressed when `bare` */}
        {!bare && (
          <circle
            cx={cx}
            cy={cy}
            r={centreR + 18}
            fill="none"
            stroke="var(--color-border-default)"
            strokeWidth={1}
            opacity={0.5}
            aria-hidden="true"
          />
        )}

        {/* Edges (rendered before nodes so nodes sit on top) */}
        <g aria-hidden="true" strokeOpacity={0.6} fill="none">
          {layouts.map((l) => (
            <path
              key={`edge-${l.entity.id}`}
              d={`M ${cx} ${cy} Q ${l.edgeControl.x} ${l.edgeControl.y} ${l.x} ${l.y}`}
              stroke={SEVERITY_EDGE_STROKE[l.entity.severity]}
              strokeWidth={SEVERITY_STROKE[l.entity.severity]}
              strokeLinecap="round"
            />
          ))}

          {/* Cascade edges — dashed, entity→entity */}
          {cascades.map((c, i) => {
            const from = layoutById.get(c.from)
            const to = layoutById.get(c.to)
            if (!from || !to) return null
            const midX = (from.x + to.x) / 2
            const midY = (from.y + to.y) / 2
            return (
              <path
                key={`cascade-${i}`}
                d={`M ${from.x} ${from.y} Q ${midX} ${midY - 30} ${to.x} ${to.y}`}
                stroke="var(--color-text-subtle)"
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={0.4}
              />
            )
          })}
        </g>

        {/* Edge clause labels */}
        <g
          aria-hidden="true"
          fontFamily={MONO_FONT_STACK}
          fontSize={9}
          fill="var(--color-text-subtle)"
          fontWeight={500}
          letterSpacing="0.04em"
        >
          {layouts.map((l) => {
            const pos = labelPositions.get(l.entity.id) ?? l.edgeMid
            return (
              <text key={`label-${l.entity.id}`} x={pos.x} y={pos.y} textAnchor="middle">
                {l.entity.clauseLabel}
              </text>
            )
          })}
          {cascades.map((c, i) => {
            if (!c.label) return null
            const from = layoutById.get(c.from)
            const to = layoutById.get(c.to)
            if (!from || !to) return null
            return (
              <text
                key={`cascade-label-${i}`}
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 18}
                textAnchor="middle"
                fontStyle="italic"
              >
                {c.label}
              </text>
            )
          })}
        </g>

        {/* Entity nodes */}
        <g>
          {layouts.map((l) => {
            const accessibleName =
              `${l.category.label}: ${l.entity.name}. Severity ${l.entity.severity}. ` +
              `Clause ${l.entity.clauseLabel}.` +
              (l.entity.annotation ? ` ${l.entity.annotation}.` : '') +
              (onEntityClick ? ' Activate to open.' : '')
            const node = (
              <>
                <circle
                  cx={l.x}
                  cy={l.y}
                  r={l.haloRadius}
                  fill={l.category.color}
                  opacity={0.15}
                  aria-hidden="true"
                />
                <circle
                  cx={l.x}
                  cy={l.y}
                  r={l.radius}
                  fill={l.category.color}
                  aria-hidden="true"
                />
                <text
                  x={l.x}
                  y={l.y + 3}
                  textAnchor="middle"
                  fill="white"
                  fontSize={Math.max(8, Math.round(l.radius * 0.5))}
                  fontWeight={600}
                  aria-hidden="true"
                >
                  {l.entity.glyph}
                </text>
                <text
                  x={l.x}
                  y={l.y + l.haloRadius + 12}
                  textAnchor="middle"
                  fill="var(--color-text-default)"
                  fontSize={9}
                  fontWeight={500}
                  aria-hidden="true"
                >
                  {l.entity.name}
                </text>
                {l.entity.annotation && (
                  <text
                    x={l.x}
                    y={l.y + l.haloRadius + 24}
                    textAnchor="middle"
                    fill="var(--color-text-subtle)"
                    fontSize={9}
                    fontFamily={MONO_FONT_STACK}
                    aria-hidden="true"
                  >
                    {l.entity.annotation}
                  </text>
                )}
              </>
            )
            if (onEntityClick) {
              return (
                <a
                  key={`node-${l.entity.id}`}
                  role="button"
                  tabIndex={0}
                  aria-label={accessibleName}
                  className="impact-graph__node--interactive"
                  onClick={(e) => {
                    e.preventDefault()
                    const ent = entitiesById.get(l.entity.id)
                    if (ent) onEntityClick(ent)
                  }}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => {
                      const ent = entitiesById.get(l.entity.id)
                      if (ent) onEntityClick(ent)
                    })
                  }
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  {node}
                </a>
              )
            }
            return <g key={`node-${l.entity.id}`}>{node}</g>
          })}
        </g>

        {/* Centre alert node — rendered last so it sits above everything */}
        {(() => {
          const centreName =
            `Alert: ${alert.source}. ${alert.title.join(' ')}. Severity ${alert.severity}. ` +
            `${entities.length} affected entities across ${categories.length} categories.` +
            (onAlertClick ? ' Activate to open.' : '')
          const centreNode = (
            <>
              <circle
                cx={cx}
                cy={cy}
                r={centreR}
                fill="var(--color-surface-inverse)"
                aria-hidden="true"
              />
              <circle
                cx={cx}
                cy={cy}
                r={centreR}
                fill="none"
                stroke={SEVERITY_RING_FILL[alert.severity]}
                strokeWidth={onAlertClick ? 2 : 2}
                aria-hidden="true"
                className={onAlertClick ? 'impact-graph__centre-ring--interactive' : ''}
              />
              <text
                x={cx}
                y={cy - 12}
                textAnchor="middle"
                fill="var(--color-text-on-inverse-subtle)"
                fontFamily={MONO_FONT_STACK}
                fontSize={9}
                letterSpacing="0.06em"
                aria-hidden="true"
              >
                {alert.source}
              </text>
              <text
                x={cx}
                y={cy + 8}
                textAnchor="middle"
                fill="var(--color-text-on-inverse)"
                fontSize={15}
                fontWeight={600}
                aria-hidden="true"
              >
                {alert.title[0]}
              </text>
              <text
                x={cx}
                y={cy + 26}
                textAnchor="middle"
                fill="var(--color-text-on-inverse)"
                fontSize={15}
                fontWeight={600}
                aria-hidden="true"
              >
                {alert.title[1]}
              </text>
            </>
          )
          if (onAlertClick) {
            return (
              <a
                role="button"
                tabIndex={0}
                aria-label={centreName}
                className="impact-graph__centre--interactive"
                onClick={(e) => {
                  e.preventDefault()
                  onAlertClick()
                }}
                onKeyDown={(e) => handleKeyDown(e, onAlertClick)}
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                {centreNode}
              </a>
            )
          }
          return <g>{centreNode}</g>
        })()}

        {/* Iris attribution badge — top-left */}
        {irisAttribution && (
          <g transform="translate(20, 20)" aria-hidden="true">
            <rect
              x={0}
              y={0}
              width={170}
              height={28}
              rx={14}
              fill="var(--color-iris-surface)"
              stroke="var(--color-iris-accent-subtle)"
              strokeWidth={1}
            />
            <circle cx={14} cy={14} r={7} fill="var(--color-iris-accent)" />
            <text x={14} y={17.5} textAnchor="middle" fill="white" fontSize={9} fontWeight={600}>
              I
            </text>
            <text x={28} y={18} fill="var(--color-iris-accent-hover)" fontSize={10} fontWeight={500}>
              Iris {irisAttribution.verb ?? 'analysed'} {irisAttribution.count} entities
            </text>
          </g>
        )}
      </svg>

      {/* Visually-hidden expanded entity list — accessibility spec §1.2.
          Always rendered for SR; pinned out of view for sighted users. */}
      <figcaption
        id={`${figureId}-caption`}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        <p>Affected entities, clockwise from top:</p>
        <ol>
          {layouts.map((l) => (
            <li key={`sr-${l.entity.id}`}>
              {l.category.label} · {l.entity.name}
              {l.entity.annotation ? `, ${l.entity.annotation}` : ''}. Clause:{' '}
              {l.entity.clauseLabel}. Severity: {l.entity.severity}.
            </li>
          ))}
          {cascades.map((c, i) => {
            const from = entitiesById.get(c.from)
            const to = entitiesById.get(c.to)
            if (!from || !to) return null
            return (
              <li key={`sr-cascade-${i}`}>
                Cascade: {from.name} ({from.category}) triggers {to.name} ({to.category}).
                {c.label ? ` ${c.label}.` : ''}
              </li>
            )
          })}
        </ol>
      </figcaption>

      {/* Legend strip — suppressed when `bare` */}
      {!bare && (
        <ul
          className="impact-graph__legend"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            margin: '12px 0 0',
            padding: 0,
            listStyle: 'none',
            fontSize: 12,
            color: 'var(--color-text-subtle)',
          }}
          aria-label="Category legend"
        >
          {categories.map((cat) => (
            <li
              key={cat.key}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: cat.color,
                }}
              />
              {cat.label}
            </li>
          ))}
        </ul>
      )}

      {/* Reduced-motion-respecting pulse animation for the interactive
          centre ring (spec accessibility §3). Lives inline as a <style>
          tag rather than a separate CSS file so the component remains
          self-contained for tree-shaking. */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .impact-graph__centre--interactive:hover .impact-graph__centre-ring--interactive {
            animation: impact-graph-pulse 1.4s ease-in-out infinite;
          }
        }
        @keyframes impact-graph-pulse {
          0%, 100% { stroke-width: 2; }
          50% { stroke-width: 3.5; }
        }
        .impact-graph__node--interactive:focus-visible,
        .impact-graph__centre--interactive:focus-visible {
          outline: 2px solid var(--color-action-primary);
          outline-offset: 4px;
        }
      `}</style>
    </figure>
  )
}

export type {
  ImpactAlert,
  ImpactCascade,
  ImpactCategory,
  ImpactEntity,
  ImpactGraphProps,
  ImpactSeverity,
  CategoryPalette,
} from './types'
