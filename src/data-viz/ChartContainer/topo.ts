// Minimal TopoJSON decoder for the pre-projected choropleth geometries
// (v4.4 D-119). The build pipeline (tools/charts/build-geo.mjs) emits
// quantised PLANAR topologies — coordinates are already in viewBox space,
// so decoding is delta-accumulation + transform; no projection math and
// no topojson-client dependency at runtime (zero-runtime-deps contract).

export interface GeoRegionProps {
  id?: string
  name?: string
  role: 'jurisdiction' | 'context'
}

interface GeoGeometry {
  type: 'Polygon' | 'MultiPolygon'
  // Polygon: number[][] (rings of arc indexes) · MultiPolygon: number[][][]
  arcs: number[][] | number[][][]
  properties: GeoRegionProps
}

export interface GeoTopology {
  type: 'Topology'
  transform: { scale: [number, number]; translate: [number, number] }
  arcs: number[][][]
  objects: { regions: { type: 'GeometryCollection'; geometries: GeoGeometry[] } }
  /** [width, height] of the pre-projected planar space (spec §1: 1000×640). */
  viewBox: [number, number]
}

export interface GeoRegion extends GeoRegionProps {
  /** SVG path data in viewBox coordinates. */
  d: string
  /** [minX, minY, maxX, maxY] in viewBox coordinates (chip-strip threshold, D-118). */
  bounds: [number, number, number, number]
}

const r1 = (n: number) => Math.round(n * 10) / 10

/** Decode one quantised delta-encoded arc to absolute planar points. */
function decodeArc(topology: GeoTopology, index: number): Array<[number, number]> {
  const { scale, translate } = topology.transform
  let x = 0
  let y = 0
  return topology.arcs[index].map(([dx, dy]) => {
    x += dx
    y += dy
    return [x * scale[0] + translate[0], y * scale[1] + translate[1]] as [number, number]
  })
}

/** Stitch a ring's arc references into one point list (negative index = reversed complement). */
function ring(topology: GeoTopology, arcRefs: number[], cache: Map<number, Array<[number, number]>>): Array<[number, number]> {
  const points: Array<[number, number]> = []
  for (const ref of arcRefs) {
    const idx = ref < 0 ? ~ref : ref
    let arc = cache.get(idx)
    if (!arc) {
      arc = decodeArc(topology, idx)
      cache.set(idx, arc)
    }
    const oriented = ref < 0 ? [...arc].reverse() : arc
    // Consecutive arcs share their join point — drop the duplicate.
    points.push(...(points.length ? oriented.slice(1) : oriented))
  }
  return points
}

function ringPath(points: Array<[number, number]>): string {
  if (points.length === 0) return ''
  const [first, ...rest] = points
  return `M${r1(first[0])},${r1(first[1])}${rest.map(([x, y]) => `L${r1(x)},${r1(y)}`).join('')}Z`
}

/** Decode every region in the topology to { path data + bounds + properties }. */
export function decodeRegions(topology: GeoTopology): GeoRegion[] {
  const cache = new Map<number, Array<[number, number]>>()
  return topology.objects.regions.geometries.map((geometry) => {
    const polygons = (geometry.type === 'Polygon' ? [geometry.arcs] : geometry.arcs) as number[][][]
    let d = ''
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const rings of polygons) {
      for (const arcRefs of rings) {
        const points = ring(topology, arcRefs, cache)
        d += ringPath(points)
        for (const [x, y] of points) {
          if (x < minX) minX = x
          if (y < minY) minY = y
          if (x > maxX) maxX = x
          if (y > maxY) maxY = y
        }
      }
    }
    return { ...geometry.properties, d, bounds: [minX, minY, maxX, maxY] }
  })
}
