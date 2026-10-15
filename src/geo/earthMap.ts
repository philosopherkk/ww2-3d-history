/**
 * Real equirectangular Earth basemap:
 * NASA raster + Natural Earth 110m country/coast outlines (public domain).
 */

import * as THREE from 'three'

type Position = [number, number] | [number, number, number]
type LinearRing = Position[]
type PolygonCoords = LinearRing[]
type MultiPolygonCoords = PolygonCoords[]

interface GeoFeature {
  type: string
  properties?: Record<string, unknown>
  geometry?: {
    type: 'Polygon' | 'MultiPolygon' | 'LineString' | 'MultiLineString'
    coordinates: unknown
  }
}

interface GeoJSON {
  type: string
  features: GeoFeature[]
}

const REGION_LABELS: { text: string; lon: number; lat: number; size: number; color: string }[] = [
  { text: 'NORTH AMERICA', lon: -100, lat: 45, size: 15, color: 'rgba(235,225,200,0.7)' },
  { text: 'SOUTH AMERICA', lon: -58, lat: -15, size: 13, color: 'rgba(235,225,200,0.65)' },
  { text: 'EUROPE', lon: 15, lat: 50, size: 14, color: 'rgba(235,225,200,0.75)' },
  { text: 'AFRICA', lon: 20, lat: 5, size: 15, color: 'rgba(235,225,200,0.65)' },
  { text: 'ASIA', lon: 90, lat: 45, size: 16, color: 'rgba(235,225,200,0.7)' },
  { text: 'AUSTRALIA', lon: 134, lat: -25, size: 12, color: 'rgba(235,225,200,0.65)' },
  { text: 'ANTARCTICA', lon: 0, lat: -80, size: 11, color: 'rgba(220,230,240,0.45)' },
  { text: 'ATLANTIC OCEAN', lon: -30, lat: 20, size: 12, color: 'rgba(160,200,230,0.5)' },
  { text: 'PACIFIC OCEAN', lon: -150, lat: 5, size: 14, color: 'rgba(160,200,230,0.45)' },
  { text: 'INDIAN OCEAN', lon: 75, lat: -20, size: 12, color: 'rgba(160,200,230,0.45)' },
  { text: 'ARCTIC OCEAN', lon: 0, lat: 78, size: 10, color: 'rgba(180,210,230,0.4)' },
]

/** Countries large enough to label on a teaching globe (NAME from Natural Earth). */
const COUNTRY_LABEL_ALLOW = new Set([
  'United States of America',
  'Canada',
  'Brazil',
  'Argentina',
  'Mexico',
  'Russia',
  'China',
  'India',
  'Australia',
  'Greenland',
  'Kazakhstan',
  'Algeria',
  'Congo',
  'South Africa',
  'Egypt',
  'Turkey',
  'Iran',
  'Saudi Arabia',
  'Indonesia',
  'Japan',
  'Mongolia',
  'France',
  'Germany',
  'United Kingdom',
  'Spain',
  'Italy',
  'Poland',
  'Ukraine',
  'Sweden',
  'Norway',
  'Finland',
  'Peru',
  'Colombia',
  'Chile',
  'New Zealand',
  'Thailand',
  'Vietnam',
  'Philippines',
  'Myanmar',
  'Pakistan',
  'Afghanistan',
  'Ethiopia',
  'Nigeria',
  'Sudan',
  'Libya',
  'Mali',
  'Angola',
  'Madagascar',
])

function baseUrl(): string {
  return import.meta.env.BASE_URL || '/'
}

export function lonLatToCanvas(lon: number, lat: number, w: number, h: number): [number, number] {
  const x = ((lon + 180) / 360) * w
  const y = ((90 - lat) / 180) * h
  return [x, y]
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image ${src}`))
    img.src = src
  })
}

async function loadGeoJSON(path: string): Promise<GeoJSON> {
  const res = await fetch(`${baseUrl()}${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json() as Promise<GeoJSON>
}

function ringCentroid(ring: LinearRing): [number, number] | null {
  if (!ring.length) return null
  let sx = 0
  let sy = 0
  let n = 0
  for (const p of ring) {
    sx += p[0]
    sy += p[1]
    n++
  }
  return [sx / n, sy / n]
}

function pathRing(ctx: CanvasRenderingContext2D, ring: LinearRing, w: number, h: number) {
  if (!ring.length) return
  const [x0, y0] = lonLatToCanvas(ring[0][0], ring[0][1], w, h)
  ctx.moveTo(x0, y0)
  for (let i = 1; i < ring.length; i++) {
    const [x, y] = lonLatToCanvas(ring[i][0], ring[i][1], w, h)
    ctx.lineTo(x, y)
  }
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  coords: PolygonCoords,
  w: number,
  h: number,
  mode: 'fill' | 'stroke',
) {
  ctx.beginPath()
  for (const ring of coords) pathRing(ctx, ring, w, h)
  ctx.closePath()
  if (mode === 'fill') ctx.fill()
  else ctx.stroke()
}

function drawFeatureGeometry(
  ctx: CanvasRenderingContext2D,
  feature: GeoFeature,
  w: number,
  h: number,
  mode: 'fill' | 'stroke',
) {
  const g = feature.geometry
  if (!g) return
  if (g.type === 'Polygon') {
    drawPolygon(ctx, g.coordinates as PolygonCoords, w, h, mode)
  } else if (g.type === 'MultiPolygon') {
    for (const poly of g.coordinates as MultiPolygonCoords) {
      drawPolygon(ctx, poly, w, h, mode)
    }
  } else if (g.type === 'LineString') {
    ctx.beginPath()
    pathRing(ctx, g.coordinates as LinearRing, w, h)
    if (mode === 'stroke') ctx.stroke()
  } else if (g.type === 'MultiLineString') {
    for (const line of g.coordinates as LinearRing[]) {
      ctx.beginPath()
      pathRing(ctx, line, w, h)
      if (mode === 'stroke') ctx.stroke()
    }
  }
}

function featureLabelPoint(feature: GeoFeature): [number, number] | null {
  const g = feature.geometry
  if (!g) return null
  if (g.type === 'Polygon') {
    return ringCentroid((g.coordinates as PolygonCoords)[0])
  }
  if (g.type === 'MultiPolygon') {
    const polys = g.coordinates as MultiPolygonCoords
    let best: LinearRing | null = null
    let bestLen = 0
    for (const poly of polys) {
      const ring = poly[0]
      if (ring && ring.length > bestLen) {
        best = ring
        bestLen = ring.length
      }
    }
    return best ? ringCentroid(best) : null
  }
  return null
}

/** Lon/lat → 0..1 UV on equirectangular map (for 2D pin placement). */
export function lonLatToMapFraction(lon: number, lat: number): { x: number; y: number } {
  return {
    x: (lon + 180) / 360,
    y: (90 - lat) / 180,
  }
}

/** Build equirectangular canvas from NASA raster + Natural Earth outlines. */
export async function buildEarthCanvas(size = 2048): Promise<HTMLCanvasElement> {
  const w = size
  const h = size / 2
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  // Fallback ocean if raster fails
  const ocean = ctx.createLinearGradient(0, 0, 0, h)
  ocean.addColorStop(0, '#0c2744')
  ocean.addColorStop(0.5, '#123a52')
  ocean.addColorStop(1, '#0c2438')
  ctx.fillStyle = ocean
  ctx.fillRect(0, 0, w, h)

  try {
    const img = await loadImage(`${baseUrl()}earth-raster.jpg`)
    ctx.drawImage(img, 0, 0, w, h)
    // Slight darken so pins/labels read clearly
    ctx.fillStyle = 'rgba(8, 16, 32, 0.28)'
    ctx.fillRect(0, 0, w, h)
  } catch {
    // keep gradient fallback
  }

  // Graticule
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = ((90 - lat) / 180) * h
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
  for (let lon = -150; lon <= 150; lon += 30) {
    const x = ((lon + 180) / 360) * w
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(200,220,240,0.18)'
  ctx.beginPath()
  ctx.moveTo(0, h / 2)
  ctx.lineTo(w, h / 2)
  ctx.stroke()

  try {
    const [countries, coast] = await Promise.all([
      loadGeoJSON('geo/ne_110m_admin_0_countries.geojson'),
      loadGeoJSON('geo/ne_110m_coastline.geojson'),
    ])

    // Soft country fills for inland contrast (keeps raster visible)
    ctx.fillStyle = 'rgba(55, 85, 50, 0.12)'
    for (const f of countries.features) {
      drawFeatureGeometry(ctx, f, w, h, 'fill')
    }

    // Country borders
    ctx.strokeStyle = 'rgba(220, 200, 150, 0.4)'
    ctx.lineWidth = Math.max(0.8, w / 1600)
    ctx.lineJoin = 'round'
    for (const f of countries.features) {
      drawFeatureGeometry(ctx, f, w, h, 'stroke')
    }

    // Coast emphasis
    ctx.strokeStyle = 'rgba(230, 235, 220, 0.55)'
    ctx.lineWidth = Math.max(1, w / 1400)
    for (const f of coast.features) {
      drawFeatureGeometry(ctx, f, w, h, 'stroke')
    }

    // Country labels (Natural Earth NAME at polygon centroid)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const f of countries.features) {
      const name = String(f.properties?.NAME ?? f.properties?.ADMIN ?? '')
      if (!COUNTRY_LABEL_ALLOW.has(name)) continue
      const pt = featureLabelPoint(f)
      if (!pt) continue
      const [x, y] = lonLatToCanvas(pt[0], pt[1], w, h)
      ctx.font = `600 ${Math.max(9, w / 220)}px "IBM Plex Sans", sans-serif`
      ctx.fillStyle = 'rgba(245, 235, 210, 0.55)'
      ctx.fillText(name, x, y)
    }
  } catch (err) {
    console.warn('Natural Earth overlay failed', err)
  }

  // Region / ocean labels at real lon/lat
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const lab of REGION_LABELS) {
    const [x, y] = lonLatToCanvas(lab.lon, lab.lat, w, h)
    ctx.font = `600 ${lab.size * (w / 2048)}px "IBM Plex Sans", sans-serif`
    ctx.fillStyle = lab.color
    ctx.fillText(lab.text, x, y)
  }

  return canvas
}

/** Three.js texture wrapper around {@link buildEarthCanvas}. */
export async function buildEarthTexture(size = 2048): Promise<THREE.CanvasTexture> {
  const canvas = await buildEarthCanvas(size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

/** @deprecated sync stub — use buildEarthCanvas */
export function paintEarthMap(size = 1024): HTMLCanvasElement {
  const w = size
  const h = size / 2
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#123048'
  ctx.fillRect(0, 0, w, h)
  return canvas
}
