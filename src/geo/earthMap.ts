/**
 * Procedural equirectangular teaching map — continents + coasts + labeled anchors.
 * Approximate outlines for geographic grounding, not political borders.
 */

type Blob = { cx: number; cy: number; rx: number; ry: number; rot?: number }

/** Rough landmass ellipses in 1024×512 equirectangular space (lon −180..180, lat 90..−90). */
const LAND: Blob[] = [
  // North America
  { cx: 220, cy: 160, rx: 95, ry: 70, rot: -0.2 },
  { cx: 180, cy: 220, rx: 55, ry: 45, rot: 0.3 },
  { cx: 250, cy: 250, rx: 40, ry: 55, rot: -0.4 },
  // Greenland
  { cx: 310, cy: 70, rx: 35, ry: 45 },
  // South America
  { cx: 300, cy: 340, rx: 45, ry: 95, rot: 0.15 },
  { cx: 290, cy: 420, rx: 35, ry: 40 },
  // Europe
  { cx: 530, cy: 145, rx: 55, ry: 40, rot: 0.1 },
  { cx: 555, cy: 175, rx: 40, ry: 30 },
  // Africa
  { cx: 545, cy: 300, rx: 70, ry: 110 },
  { cx: 575, cy: 380, rx: 45, ry: 50 },
  // Asia / Middle East
  { cx: 650, cy: 180, rx: 80, ry: 50 },
  { cx: 720, cy: 160, rx: 100, ry: 55, rot: -0.15 },
  { cx: 800, cy: 200, rx: 90, ry: 70 },
  { cx: 860, cy: 250, rx: 70, ry: 55 },
  // India / SE Asia
  { cx: 730, cy: 260, rx: 45, ry: 55 },
  { cx: 800, cy: 300, rx: 55, ry: 40 },
  // East Asia / Japan-ish islands
  { cx: 880, cy: 200, rx: 25, ry: 35, rot: 0.5 },
  // Australia
  { cx: 870, cy: 380, rx: 70, ry: 45 },
  // Antarctica fringe
  { cx: 512, cy: 490, rx: 280, ry: 28 },
]

const LABELS: { text: string; x: number; y: number; size: number; color: string }[] = [
  { text: 'NORTH AMERICA', x: 210, y: 175, size: 14, color: 'rgba(220,210,180,0.55)' },
  { text: 'SOUTH AMERICA', x: 285, y: 360, size: 12, color: 'rgba(220,210,180,0.5)' },
  { text: 'EUROPE', x: 535, y: 140, size: 13, color: 'rgba(220,210,180,0.65)' },
  { text: 'AFRICA', x: 545, y: 310, size: 14, color: 'rgba(220,210,180,0.5)' },
  { text: 'ASIA', x: 760, y: 180, size: 16, color: 'rgba(220,210,180,0.55)' },
  { text: 'AUSTRALIA', x: 870, y: 385, size: 11, color: 'rgba(220,210,180,0.5)' },
  { text: 'ATLANTIC', x: 400, y: 260, size: 12, color: 'rgba(140,180,210,0.45)' },
  { text: 'PACIFIC', x: 100, y: 280, size: 14, color: 'rgba(140,180,210,0.4)' },
  { text: 'PACIFIC', x: 960, y: 280, size: 12, color: 'rgba(140,180,210,0.35)' },
  { text: 'INDIAN OCEAN', x: 700, y: 370, size: 11, color: 'rgba(140,180,210,0.4)' },
  { text: 'ARCTIC', x: 512, y: 28, size: 10, color: 'rgba(180,200,220,0.35)' },
]

/** Lon/lat → canvas pixel (equirectangular 1024×512). */
export function lonLatToCanvas(lon: number, lat: number, w = 1024, h = 512): [number, number] {
  const x = ((lon + 180) / 360) * w
  const y = ((90 - lat) / 180) * h
  return [x, y]
}

export function paintEarthMap(size = 1024): HTMLCanvasElement {
  const w = size
  const h = size / 2
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const sx = w / 1024
  const sy = h / 512

  // Ocean
  const ocean = ctx.createLinearGradient(0, 0, 0, h)
  ocean.addColorStop(0, '#0f2744')
  ocean.addColorStop(0.35, '#153a58')
  ocean.addColorStop(0.65, '#124536')
  ocean.addColorStop(1, '#0e2438')
  ctx.fillStyle = ocean
  ctx.fillRect(0, 0, w, h)

  // Soft depth banding
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = `rgba(20, 60, 80, ${0.04 + i * 0.01})`
    ctx.beginPath()
    ctx.ellipse(w * 0.35, h * 0.55, w * 0.2, h * 0.12, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // Land fills
  ctx.fillStyle = '#3f5f3a'
  for (const b of LAND) {
    ctx.save()
    ctx.translate(b.cx * sx, b.cy * sy)
    ctx.rotate(b.rot ?? 0)
    ctx.scale(sx, sy)
    ctx.beginPath()
    ctx.ellipse(0, 0, b.rx, b.ry, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Inland tone variation
  ctx.fillStyle = 'rgba(70, 95, 55, 0.35)'
  for (const b of LAND.filter((_, i) => i % 2 === 0)) {
    ctx.beginPath()
    ctx.ellipse(b.cx * sx, b.cy * sy, b.rx * sx * 0.55, b.ry * sy * 0.55, b.rot ?? 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // Coast strokes
  ctx.strokeStyle = 'rgba(200, 220, 170, 0.35)'
  ctx.lineWidth = Math.max(1, 1.4 * sx)
  for (const b of LAND) {
    ctx.beginPath()
    ctx.ellipse(b.cx * sx, b.cy * sy, b.rx * sx, b.ry * sy, b.rot ?? 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Simple European / East Asian “border hint” arcs (teaching anchors, not accurate frontiers)
  ctx.strokeStyle = 'rgba(180, 160, 100, 0.22)'
  ctx.lineWidth = Math.max(1, 1.1 * sx)
  const borderHints: [number, number, number, number][] = [
    [500, 120, 580, 200], // W Europe box
    [560, 130, 640, 210], // E Europe / USSR west
    [820, 160, 920, 250], // E Asia
    [250, 200, 320, 280], // N America east
  ]
  for (const [x1, y1, x2, y2] of borderHints) {
    ctx.strokeRect(x1 * sx, y1 * sy, (x2 - x1) * sx, (y2 - y1) * sy)
  }

  // Graticule
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'
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
  // Equator emphasis
  ctx.strokeStyle = 'rgba(180, 200, 220, 0.2)'
  ctx.beginPath()
  ctx.moveTo(0, h / 2)
  ctx.lineTo(w, h / 2)
  ctx.stroke()

  // Region labels
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const lab of LABELS) {
    ctx.font = `600 ${lab.size * sx}px "IBM Plex Sans", sans-serif`
    ctx.fillStyle = lab.color
    ctx.fillText(lab.text, lab.x * sx, lab.y * sy)
  }

  // Capitals / theatre anchors (small labeled ticks for orientation)
  const anchors: { name: string; lon: number; lat: number }[] = [
    { name: 'London', lon: -0.1, lat: 51.5 },
    { name: 'Berlin', lon: 13.4, lat: 52.5 },
    { name: 'Moscow', lon: 37.6, lat: 55.8 },
    { name: 'Tokyo', lon: 139.7, lat: 35.7 },
    { name: 'Washington', lon: -77.0, lat: 38.9 },
    { name: 'Chongqing', lon: 106.5, lat: 29.5 },
    { name: 'Cairo', lon: 31.2, lat: 30.0 },
    { name: 'Sydney', lon: 151.2, lat: -33.9 },
  ]
  for (const a of anchors) {
    const [x, y] = lonLatToCanvas(a.lon, a.lat, w, h)
    ctx.fillStyle = 'rgba(230, 210, 150, 0.55)'
    ctx.beginPath()
    ctx.arc(x, y, 2.2 * sx, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = `500 ${9 * sx}px "IBM Plex Sans", sans-serif`
    ctx.fillStyle = 'rgba(230, 210, 150, 0.45)'
    ctx.textAlign = 'left'
    ctx.fillText(a.name, x + 4 * sx, y - 2 * sy)
  }

  return canvas
}
