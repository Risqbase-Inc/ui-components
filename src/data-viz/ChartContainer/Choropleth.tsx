'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '../../core/MotionProvider'
import { decodeRegions, type GeoRegion, type GeoTopology } from './topo'
import type { ChoroplethBand, ChoroplethDatum, ChoroplethGeo, ChoroplethMode } from './types'
import europeTopo from '../geo/europe.json'
import worldTopo from '../geo/world.json'

// ChartContainer type="choropleth" — v4.4 Workstream F restoration
// (GOV-DS-2026-02 rev. v4.4 §8 + §13 D-115…D-119; full design contract in
// docs/design-system/v4.4/choropleth-spec.html).
//
// Geometry is pre-projected planar TopoJSON built by
// tools/charts/build-geo.mjs (D-119) — rendering is path data only:
// no projection math, no network, zero runtime dependencies.

const TOPOLOGIES: Record<ChoroplethGeo, GeoTopology> = {
  europe: europeTopo as unknown as GeoTopology,
  world: worldTopo as unknown as GeoTopology,
}

const regionCache = new Map<ChoroplethGeo, GeoRegion[]>()
function getRegions(geo: ChoroplethGeo): GeoRegion[] {
  let regions = regionCache.get(geo)
  if (!regions) {
    regions = decodeRegions(TOPOLOGIES[geo])
    regionCache.set(geo, regions)
  }
  return regions
}

export const BAND_LABEL: Record<ChoroplethBand, string> = {
  'very-low': 'Very low',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  'very-high': 'Very high',
}

const BAND_VARS: Record<ChoroplethBand, string> = {
  'very-low': 'var(--color-band-very-low-bg)',
  low: 'var(--color-band-low-bg)',
  medium: 'var(--color-band-medium-bg)',
  high: 'var(--color-band-high-bg)',
  'very-high': 'var(--color-band-very-high-bg)',
}

const SEQ_VARS = [
  'var(--color-chart-seq-1)',
  'var(--color-chart-seq-2)',
  'var(--color-chart-seq-3)',
  'var(--color-chart-seq-4)',
  'var(--color-chart-seq-5)',
]
const NULL_VAR = 'var(--color-chart-null)'

// D-118: a jurisdiction whose rendered bbox min-dimension falls below this
// (CSS px) is additionally rendered as a chip — reachability, not replacement.
const CHIP_THRESHOLD_PX = 24

/** Default seq quantisation: quintiles of the non-null values (D-117). */
function quintileThresholds(values: number[]): number[] {
  const sorted = [...values].sort((a, b) => a - b)
  if (sorted.length === 0) return []
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]
  return [at(0.2), at(0.4), at(0.6), at(0.8)]
}

function seqStep(value: number, thresholds: number[]): number {
  for (let i = 0; i < thresholds.length; i++) {
    if (value < thresholds[i]) return i + 1
  }
  return Math.min(5, thresholds.length + 1)
}

export interface ChoroplethEntry {
  id: string
  name: string
  datum: ChoroplethDatum
  region: GeoRegion | null
}

/** Join data ↔ geometry. Data-driven completeness: a datum without
 *  renderable geometry stays an entry (chip-only + table row); a
 *  jurisdiction region absent from `data` renders as context (spec §6). */
export function joinEntries(geo: ChoroplethGeo, data: ChoroplethDatum[]): ChoroplethEntry[] {
  const regions = getRegions(geo)
  const byId = new Map(regions.filter((r) => r.role === 'jurisdiction' && r.id).map((r) => [r.id as string, r]))
  return data.map((datum) => {
    const region = byId.get(datum.id) ?? null
    return { id: datum.id, name: region?.name ?? datum.id, datum, region }
  })
}

export function choroplethFill(datum: ChoroplethDatum | undefined, mode: ChoroplethMode, thresholds: number[]): string {
  if (!datum) return 'var(--color-surface-muted)'
  if (mode === 'band') return datum.band ? BAND_VARS[datum.band] : NULL_VAR
  if (datum.value === null || datum.value === undefined) return NULL_VAR
  return SEQ_VARS[seqStep(datum.value, thresholds) - 1]
}

const byValueDesc = (a: ChoroplethEntry, b: ChoroplethEntry) => (b.datum.value ?? -1) - (a.datum.value ??
 -1)

function entryAriaLabel(entry: ChoroplethEntry, mode: ChoroplethMode, unit: string): string {
  const value = entry.datum.value
  const parts = [entry.name, value !== null && value !== undefined ? `${value} ${unit}` : 'no data']
  if (mode === 'band' && entry.datum.band) parts.push(`${BAND_LABEL[entry.datum.band]} band`)
  return parts.join(', ')
}

interface TooltipState {
  x: number
  y: number
  title: string
  detail: string
}

export interface ChoroplethViewProps {
  geo: ChoroplethGeo
  mode: ChoroplethMode
  data: ChoroplethDatum[]
  unit: string
  thresholds?: number[]
  selectedId?: string | null
  onSelect?: (id: string | null) => void
}

export function ChoroplethView({
  geo,
  mode,
  data,
  unit,
  thresholds: thresholdsProp,
  selectedId,
  onSelect,
}: ChoroplethViewProps) {
  const reduced = useReducedMotion()
  const [viewW, viewH] = TOPOLOGIES[geo].viewBox
  const regions = getRegions(geo)
  const entries = useMemo(() => joinEntries(geo, data), [geo, data])
  const thresholds = useMemo(() => {
    if (thresholdsProp && thresholdsProp.length > 0) return thresholdsProp
    return quintileThresholds(
      data.map((d) => d.value).filter((v): v is number => v !== null && v !== undefined)
    )
  }, [thresholdsProp, data])

  const [internalSelected, setInternalSelected] = useState<string | null>(null)
  const selected = selectedId !== undefined ? selectedId : internalSelected
  const select = useCallback(
    (id: string) => {
      const next = selected === id ? null : id
      if (selectedId === undefined) setInternalSelected(next)
      onSelect?.(next)
    },
    [selected, selectedId, onSelect]
  )

  const [hovered, setHovered] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  // Roving tabindex (spec §5): the map is one tab stop; arrows move between
  // jurisdictions sorted by value descending.
  const roving = useMemo(() => [...entries].filter((e) => e.region).sort(byValueDesc), [entries])
  const [activeId, setActiveId] = useState<string | null>(null)
  const pathRefs = useRef(new Map<string, SVGPathElement>())
  const rovingActive = activeId && roving.some((e) => e.id === activeId) ? activeId : roving[0]?.id ?? null

  // D-118: chip threshold is evaluated at RENDERED size, re-evaluated on resize.
  const containerRef = useRef<HTMLDivElement>(null)
  const [renderedWidth, setRenderedWidth] = useState(0)
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver((obsEntries) => {
      for (const e of obsEntries) setRenderedWidth(e.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const scale = renderedWidth > 0 ? renderedWidth / viewW : 1

  const chips = useMemo(
    () =>
      entries
        .filter((e) => {
          if (!e.region) return true // no renderable geometry → always chip-only
          const [minX, minY, maxX, maxY] = e.region.bounds
          return Math.min(maxX - minX, maxY - minY) * scale < CHIP_THRESHOLD_PX
        })
        .sort(byValueDesc),
    [entries, scale]
  )

  const hasNull = entries.some((e) => e.datum.value === null || e.datum.value === undefined)
  const dataIds = useMemo(() => new Set(entries.map((e) => e.id)), [entries])

  const tipFor = (entry: ChoroplethEntry): Omit<TooltipState, 'x' | 'y'> => {
    const value = entry.datum.value
    const band = mode === 'band' && entry.datum.band ? `${BAND_LABEL[entry.datum.band]} band` : ''
    const val = value !== null && value !== undefined ? `${value} ${unit}` : 'No data'
    return { title: entry.name, detail: [val, band].filter(Boolean).join(' · ') }
  }

  const showTipAtPointer = (entry: ChoroplethEntry, clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltip({ ...tipFor(entry), x: clientX - rect.left + 12, y: clientY - rect.top - 36 })
  }

  const showTipAtRegion = (entry: ChoroplethEntry) => {
    if (!entry.region) return
    const [minX, minY, maxX, maxY] = entry.region.bounds
    setTooltip({ ...tipFor(entry), x: ((minX + maxX) / 2) * scale, y: ((minY + maxY) / 2) * scale - 36 })
  }

  const onKeyDown = (event: React.KeyboardEvent, entry: ChoroplethEntry) => {
    const index = roving.findIndex((e) => e.id === entry.id)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = roving[(index + 1) % roving.length]
      setActiveId(next.id)
      pathRefs.current.get(next.id)?.focus()
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const prev = roving[(index - 1 + roving.length) % roving.length]
      setActiveId(prev.id)
      pathRefs.current.get(prev.id)?.focus()
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      select(entry.id)
    } else if (event.key === 'Escape') {
      if (selectedId === undefined) setInternalSelected(null)
      onSelect?.(null)
    }
  }

  // States contract (spec §2): hover never re-encodes fill — fill is data.
  const strokeFor = (id: string): { stroke: string; strokeWidth: number } => {
    if (selected === id) return { stroke: 'var(--color-action-primary)', strokeWidth: 2 }
    if (hovered === id) return { stroke: 'var(--color-text-subtle)', strokeWidth: 1.4 }
    return { stroke: 'var(--color-surface-default)', strokeWidth: 0.75 }
  }

  // Raise hovered/selected to the top of the paint order (spec §2).
  const paintOrdered = useMemo(() => {
    const rendered = entries.filter((e) => e.region)
    const rank = (e: ChoroplethEntry) => (e.id === selected ? 2 : e.id === hovered ? 1 : 0)
    return [...rendered].sort((a, b) => rank(a) - rank(b))
  }, [entries, hovered, selected])

  const legendSwatch = (background: string, label: string) => (
    <span key={label} className="inline-flex items-center gap-1.5">
      <i
        aria-hidden="true"
        className="inline-block h-3 w-3 rounded-[3px] border border-[var(--color-border-default)]"
        style={{ background }}
      />
      {label}
    </span>
  )

  return (
    <div ref={containerRef} className="relative">
      <svg viewBox={`0 0 ${viewW} ${viewH}`} width="100%" height="auto" className="block">
        {/* context wash: non-jurisdiction neighbours + jurisdictions absent
            from data — not interactive, not in the table (spec §2/§6) */}
        {regions
          .filter((r) => r.role === 'context' || (r.id && !dataIds.has(r.id)))
          .map((r, i) => (
            <path
              key={r.id ?? `ctx-${i}`}
              d={r.d}
              fill="var(--color-surface-muted)"
              stroke="var(--color-surface-default)"
              strokeWidth={0.75}
              aria-hidden="true"
            />
          ))}
        {paintOrdered.map((entry) => {
          const region = entry.region as GeoRegion
          const { stroke, strokeWidth } = strokeFor(entry.id)
          return (
            <path
              key={entry.id}
              ref={(el) => {
                if (el) pathRefs.current.set(entry.id, el)
                else pathRefs.current.delete(entry.id)
              }}
              d={region.d}
              fill={choroplethFill(entry.datum, mode, thresholds)}
              stroke={stroke}
              strokeWidth={strokeWidth}
              style={reduced ? undefined : { transition: 'stroke 120ms, stroke-width 120ms' }}
              data-fc="region"
              role="graphics-symbol"
              aria-label={entryAriaLabel(entry, mode, unit)}
              tabIndex={entry.id === rovingActive ? 0 : -1}
              className="cursor-pointer focus:outline-none focus-visible:stroke-[var(--color-border-focus)] focus-visible:[stroke-width:2]"
              onPointerMove={(e) => {
                setHovered(entry.id)
                showTipAtPointer(entry, e.clientX, e.clientY)
              }}
              onPointerLeave={() => {
                setHovered(null)
                setTooltip(null)
              }}
              onFocus={() => {
                setActiveId(entry.id)
                showTipAtRegion(entry)
              }}
              onBlur={() => setTooltip(null)}
              onClick={() => select(entry.id)}
              onKeyDown={(e) => onKeyDown(e, entry)}
            />
          )
        })}
      </svg>

      {/* legend (spec §2: "No data" present whenever ≥1 region is null) */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 pt-3 text-xs text-[var(--color-text-subtle)]">
        {mode === 'band' ? (
          (Object.keys(BAND_LABEL) as ChoroplethBand[]).map((band) => legendSwatch(BAND_VARS[band], BAND_LABEL[band]))
        ) : (
          <span className="inline-flex items-center gap-1.5">
            Fewer
            <span aria-hidden="true" className="inline-flex overflow-hidden rounded-[3px]">
              {SEQ_VARS.map((v) => (
                <i key={v} className="block h-3 w-5" style={{ background: v }} />
              ))}
            </span>
            More {unit}
          </span>
        )}
        {hasNull && legendSwatch(NULL_VAR, 'No data')}
      </div>

      {/* small-jurisdiction chip strip (D-118 / spec §4) — full interaction peers */}
      {chips.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-dashed border-[var(--color-border-subtle)] px-1 pt-3">
          <span className="mr-1 text-xs text-[var(--color-text-subtle)]">Below hit-target size:</span>
          {chips.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-label={entryAriaLabel(entry, mode, unit)}
              aria-pressed={selected === entry.id}
              className={`inline-flex min-h-[28px] items-center gap-1.5 rounded-full border bg-[var(--color-surface-subtle)] px-3 py-1 text-xs font-medium text-[var(--color-text-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] ${
                selected === entry.id
                  ? 'border-[var(--color-action-primary)] shadow-[inset_0_0_0_1px_var(--color-action-primary)]'
                  : 'border-[var(--color-border-default)] hover:border-[var(--color-text-subtle)]'
              }`}
              onPointerEnter={(e) => {
                setHovered(entry.id)
                showTipAtPointer(entry, e.clientX, e.clientY)
              }}
              onPointerLeave={() => {
                setHovered(null)
                setTooltip(null)
              }}
              onClick={() => select(entry.id)}
            >
              <i
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-[3px]"
                style={{ background: choroplethFill(entry.datum, mode, thresholds) }}
              />
              {entry.name}
              {entry.datum.value !== null && entry.datum.value !== undefined && (
                <span className="tabular-nums text-[var(--color-text-subtle)]">{entry.datum.value}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* tooltip — role=status, supplementary only (spec §5) */}
      {tooltip && (
        <div
          role="status"
          className="pointer-events-none absolute z-10 max-w-[240px] rounded-[var(--dimension-radius-md)] border border-[var(--color-chart-tooltip-border)] bg-[var(--color-chart-tooltip-surface)] px-3 py-2 text-xs shadow-[var(--shadow-floating)]"
          style={{ left: tooltip.x, top: Math.max(0, tooltip.y) }}
        >
          <b className="block text-[13px] text-[var(--color-chart-tooltip-text)]">{tooltip.title}</b>
          <span className="text-[var(--color-text-subtle)]">{tooltip.detail}</span>
        </div>
      )}
    </div>
  )
}
