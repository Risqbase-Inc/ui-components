#!/usr/bin/env node
/**
 * Choropleth geometry pipeline — v4.4 Workstream F, decision D-119
 * (GOV-DS-2026-02 rev. v4.4 §13; full contract in
 * docs/design-system/v4.4/choropleth-spec.html §6).
 *
 * Natural Earth (public domain, D-116) → filter/merge → simplify
 * (mapshaper, visvalingam ~10%, keep-shapes) → project at BUILD time
 * (azimuthal equal-area fit for europe, natural-earth for world — d3-geo
 * streams, so antimeridian cutting is correct) → quantised planar
 * TopoJSON committed at src/data-viz/geo/{europe,world}.json.
 *
 * The runtime component renders plain path data through a ~60-line
 * TopoJSON decoder — no projection library, no network, zero runtime
 * dependencies (the package stays as dependency-free as the MCP server).
 *
 * Budget (D-119): europe.json + world.json ≤ 80 KB gzipped combined.
 * CI enforces it on the COMMITTED files via `--check` (geo:check) — the
 * full pipeline needs the network (Natural Earth fetch) and is run
 * manually when geometry changes, like derive-dark.mjs.
 *
 * Geographies (D-115):
 *   europe — country-level EU-27 + IS/LI/NO + UK (31 jurisdictions,
 *            ISO-3166 alpha-3 ids) from 1:50m admin-0, plus
 *            non-interactive context neighbours; everything clipped to
 *            the European frame (lon −25…32, lat 34…72, D-116) so
 *            overseas territories don't distort the fit.
 *   world  — six continents (Antarctica excluded) from 1:110m admin-0
 *            dissolved on CONTINENT, slug ids.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT_DIR = path.join(ROOT, 'src', 'data-viz', 'geo')
const BUDGET_BYTES = 80 * 1024
const VIEW = { w: 1000, h: 640, pad: 8 } // spec §1 viewBox

const NE_BASE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson'

// D-115 — the 31 jurisdictions (EU-27 + IS/LI/NO + UK), ISO alpha-3.
const EURO = ['AUT','BEL','BGR','HRV','CYP','CZE','DNK','EST','FIN','FRA','DEU','GRC','HUN','IRL','ITA','LVA','LTU','LUX','MLT','NLD','POL','PRT','ROU','SVK','SVN','ESP','SWE','ISL','LIE','NOR','GBR']
// Context wash (spec §1 demo list): European non-jurisdictions + the
// Mediterranean/eastern rim that falls inside the frame.
const CONTEXT_EXTRA = ['TUR','MAR','DZA','TUN','RUS','GEO','ARM','AZE','SYR','LBN','ISR','EGY','LBY','KAZ','IRQ','IRN','JOR','SAU']
const FRAME = { lon: [-25, 32], lat: [34, 72] } // D-116

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const prop = (f, key) => {
  const p = f.properties || {}
  return p[key] != null ? p[key] : p[key.toLowerCase()]
}

/* ── check mode (CI budget gate) ─────────────────────────────────────── */

function checkBudget() {
  let total = 0
  const rows = []
  for (const name of ['europe', 'world']) {
    const file = path.join(OUT_DIR, `${name}.json`)
    if (!existsSync(file)) {
      console.error(`geo:check FAILED — missing ${path.relative(ROOT, file)} (run node tools/charts/build-geo.mjs)`)
      process.exit(1)
    }
    const raw = readFileSync(file)
    const gz = gzipSync(raw).length
    total += gz
    rows.push(`  ${name}.json: ${(raw.length / 1024).toFixed(1)} KB raw → ${(gz / 1024).toFixed(1)} KB gz`)
    // sanity: must be planar pre-projected TopoJSON (D-119)
    const topo = JSON.parse(raw)
    if (topo.type !== 'Topology' || !topo.transform) {
      console.error(`geo:check FAILED — ${name}.json is not quantised TopoJSON`)
      process.exit(1)
    }
  }
  const ok = total <= BUDGET_BYTES
  console.log(`geo:check ${ok ? 'passed' : 'FAILED'} — combined ${(total / 1024).toFixed(1)} KB gz (budget ${(BUDGET_BYTES / 1024).toFixed(0)} KB, D-119)`)
  for (const r of rows) console.log(r)
  process.exit(ok ? 0 : 1)
}

/* ── build mode ──────────────────────────────────────────────────────── */

async function fetchNe(file) {
  const cached = path.join('/tmp/ne', file)
  if (existsSync(cached)) return JSON.parse(readFileSync(cached, 'utf8'))
  const res = await fetch(`${NE_BASE}/${file}`)
  if (!res.ok) throw new Error(`Natural Earth fetch failed: ${file} → ${res.status}`)
  return res.json()
}

async function simplify(mapshaper, geojson, commands) {
  const out = await mapshaper.applyCommands(
    `-i input.json ${commands} -o output.json format=geojson`,
    { 'input.json': JSON.stringify(geojson) }
  )
  return JSON.parse(out['output.json'].toString())
}

/** mapshaper exports RFC 7946 winding (CCW exteriors); d3's spherical
 *  pipeline reads that as the polygon's complement and geoProject would
 *  emit whole-horizon geometry. Reverse every ring before projecting. */
function rewindForD3(geojson) {
  for (const f of geojson.features) {
    const g = f.geometry
    if (!g) continue
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates
    for (const poly of polys) for (const ringArr of poly) ringArr.reverse()
  }
  return geojson
}

function fitProjection(projection, frameCoords) {
  return projection.fitExtent(
    [
      [VIEW.pad, VIEW.pad],
      [VIEW.w - VIEW.pad, VIEW.h - VIEW.pad],
    ],
    { type: 'MultiPoint', coordinates: frameCoords } // winding-proof fit frame (spec §1)
  )
}

async function build() {
  const [{ geoAzimuthalEqualArea, geoNaturalEarth1 }, { geoProject }, { default: mapshaper }, { topology }] =
    await Promise.all([
      import('d3-geo'),
      import('d3-geo-projection'),
      import('mapshaper'),
      import('topojson-server'),
    ])

  mkdirSync(OUT_DIR, { recursive: true })

  /* europe — 1:50m (D-116: 50m so Malta/Liechtenstein keep geometry) */
  {
    const ne = await fetchNe('ne_50m_admin_0_countries.geojson')
    const wanted = new Set([...EURO, ...CONTEXT_EXTRA])
    const features = ne.features.filter((f) => {
      const a3 = prop(f, 'ADM0_A3')
      return wanted.has(a3) || prop(f, 'CONTINENT') === 'Europe'
    })
    // D-116: France/Norway are clipped to the European frame (overseas
    // territories would distort the fit); context neighbours are clipped
    // too (rim trim keeps the file inside the D-119 budget). All other
    // jurisdictions keep their full geometry — notably Cyprus, which lies
    // just east of the frame and is reachable via the D-118 chip strip.
    const clipSet = features.filter((f) => {
      const a3 = prop(f, 'ADM0_A3')
      return a3 === 'FRA' || a3 === 'NOR' || !EURO.includes(a3)
    })
    const keepSet = features.filter((f) => !clipSet.includes(f))
    const clippedPart = await simplify(
      mapshaper,
      { type: 'FeatureCollection', features: clipSet },
      `-clip bbox=${FRAME.lon[0]},${FRAME.lat[0]},${FRAME.lon[1]},${FRAME.lat[1]} -clean`
    )
    const clipped = await simplify(
      mapshaper,
      { type: 'FeatureCollection', features: [...keepSet, ...clippedPart.features] },
      `-simplify visvalingam 10% keep-shapes -clean`
    )
    const projection = fitProjection(geoAzimuthalEqualArea().rotate([-10, -52]), [
      [FRAME.lon[0], FRAME.lat[0]],
      [FRAME.lon[1], FRAME.lat[0]],
      [FRAME.lon[1], FRAME.lat[1]],
      [FRAME.lon[0], FRAME.lat[1]],
    ])
    const projected = geoProject(rewindForD3(clipped), projection)
    projected.features = projected.features
      .filter((f) => f.geometry && f.geometry.coordinates.length)
      .map((f) => {
        const a3 = prop(f, 'ADM0_A3')
        const role = EURO.includes(a3) ? 'jurisdiction' : 'context'
        return {
          type: 'Feature',
          geometry: f.geometry,
          properties: role === 'jurisdiction' ? { id: a3, name: prop(f, 'NAME'), role } : { role },
        }
      })
    const topo = topology({ regions: projected }, 1e4)
    topo.bbox = undefined
    writeFileSync(path.join(OUT_DIR, 'europe.json'), JSON.stringify({ ...topo, viewBox: [VIEW.w, VIEW.h] }))
  }

  /* world — 1:110m dissolved to six continents (D-115) */
  {
    const ne = await fetchNe('ne_110m_admin_0_countries.geojson')
    const features = ne.features.filter((f) => {
      const c = prop(f, 'CONTINENT')
      return c && c !== 'Antarctica' && c !== 'Seven seas (open ocean)'
    })
    const dissolved = await simplify(
      mapshaper,
      { type: 'FeatureCollection', features },
      `-dissolve CONTINENT -simplify visvalingam 10% keep-shapes -clean`
    )
    const projection = fitProjection(geoNaturalEarth1(), [
      [-179, -58],
      [179, -58],
      [179, 84],
      [-179, 84],
    ])
    const projected = geoProject(rewindForD3(dissolved), projection)
    projected.features = projected.features
      .filter((f) => f.geometry && f.geometry.coordinates.length)
      .map((f) => {
        const name = prop(f, 'CONTINENT')
        return {
          type: 'Feature',
          geometry: f.geometry,
          properties: { id: slug(name), name, role: 'jurisdiction' },
        }
      })
    const topo = topology({ regions: projected }, 1e4)
    topo.bbox = undefined
    writeFileSync(path.join(OUT_DIR, 'world.json'), JSON.stringify({ ...topo, viewBox: [VIEW.w, VIEW.h] }))
  }

  // report + enforce budget
  let total = 0
  for (const name of ['europe', 'world']) {
    const raw = readFileSync(path.join(OUT_DIR, `${name}.json`))
    const gz = gzipSync(raw).length
    total += gz
    console.log(`build-geo: ${name}.json ${(raw.length / 1024).toFixed(1)} KB raw → ${(gz / 1024).toFixed(1)} KB gz`)
  }
  console.log(`build-geo: combined ${(total / 1024).toFixed(1)} KB gz (budget ${(BUDGET_BYTES / 1024).toFixed(0)} KB)`)
  if (total > BUDGET_BYTES) {
    console.error('build-geo: OVER BUDGET (D-119) — raise simplification before committing.')
    process.exit(1)
  }
}

if (process.argv[2] === '--check') checkBudget()
else build().catch((err) => {
  console.error('build-geo failed:', err)
  process.exit(1)
})
