import { useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  countriesActiveAt,
  dateLabelFromFraction,
  incidentsVisible,
  latLonToVec3,
  maxMetricValue,
  metricAtYear,
  pointStamp,
  yearFromFraction,
} from '../data/selectors'
import { useAppStore } from '../state/appStore'
import type { Country, Incident } from '../data/types'

const R = 2.2

function Earth() {
  const tex = useMemo(() => {
    // Procedural simple Earth-ish texture via canvas (no external assets)
    const size = 1024
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const g = ctx.createLinearGradient(0, 0, 0, size)
    g.addColorStop(0, '#1a3a5c')
    g.addColorStop(0.5, '#1e4d3a')
    g.addColorStop(1, '#1a3a5c')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)

    // crude continents as darker blobs
    ctx.fillStyle = '#3d5c3a'
    const blobs = [
      [280, 320, 140, 100],
      [420, 280, 90, 120],
      [520, 400, 70, 90],
      [700, 300, 160, 80],
      [780, 420, 100, 110],
      [200, 520, 80, 140],
      [850, 550, 60, 50],
    ]
    for (const [x, y, w, h] of blobs) {
      ctx.beginPath()
      ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    for (let i = 0; i < 18; i++) {
      const y = (i / 18) * size
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(size, y)
      ctx.stroke()
    }
    for (let i = 0; i < 36; i++) {
      const x = (i / 36) * size
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, size)
      ctx.stroke()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }, [])

  return (
    <mesh>
      <sphereGeometry args={[R, 64, 64]} />
      <meshStandardMaterial map={tex} roughness={0.85} metalness={0.05} />
    </mesh>
  )
}

function CountryMarker({ country, year }: { country: Country; year: number }) {
  const metric = useAppStore((s) => s.metric)
  const selected = useAppStore((s) => s.selectedCountryId === country.id)
  const selectCountry = useAppStore((s) => s.selectCountry)
  const point = metricAtYear(country, metric, year)
  if (!point) return null
  const max = maxMetricValue(metric, year)
  const [x, y, z] = latLonToVec3(country.lat, country.lon, R + 0.02)
  const h = 0.12 + (point.value / max) * 0.75
  const color =
    country.side === 'axis' ? '#c45c3a' : country.side === 'allies' ? '#3a7ec4' : '#8a8a6a'
  const unsure = point.certainty === 'unsure'

  return (
    <group position={[x, y, z]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          selectCountry(country.id)
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.045 + (selected ? 0.02 : 0), 16, 16]} />
        <meshStandardMaterial
          color={selected ? '#f0e6c8' : color}
          emissive={selected ? '#665522' : '#000000'}
        />
      </mesh>
      <RadialBar
        dir={new THREE.Vector3(x, y, z).normalize()}
        height={h}
        color={unsure ? '#c4a03a' : color}
        selected={selected}
        onSelect={() => selectCountry(country.id)}
      />
      {selected && (
        <Html distanceFactor={8} position={[0, 0.2, 0]} style={{ pointerEvents: 'none' }}>
          <div className="globe-label">
            {country.name}
            <br />
            {point.value} {point.unit}
            <br />
            {pointStamp(point)} · {point.certainty}
            {point.provenance && point.provenance !== 'anchor' ? ` · ${point.provenance}` : ''}
          </div>
        </Html>
      )}
    </group>
  )
}

function RadialBar({
  dir,
  height,
  color,
  selected,
  onSelect,
}: {
  dir: THREE.Vector3
  height: number
  color: string
  selected: boolean
  onSelect: () => void
}) {
  const geom = useMemo(() => new THREE.CylinderGeometry(0.025, 0.035, 1, 8), [])
  const pos = dir.clone().multiplyScalar(R + height / 2)
  const quat = new THREE.Quaternion()
  quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())

  return (
    <mesh
      position={pos}
      quaternion={quat}
      scale={[selected ? 1.3 : 1, height, selected ? 1.3 : 1]}
      geometry={geom}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.85}
        emissive={selected ? color : '#000000'}
        emissiveIntensity={selected ? 0.25 : 0}
      />
    </mesh>
  )
}

function IncidentMarker({ incident }: { incident: Incident }) {
  const selected = useAppStore((s) => s.selectedIncidentId === incident.id)
  const selectIncident = useAppStore((s) => s.selectIncident)
  const [x, y, z] = latLonToVec3(incident.lat, incident.lon, R + 0.06)

  return (
    <mesh
      position={[x, y, z]}
      onClick={(e) => {
        e.stopPropagation()
        selectIncident(incident.id)
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <octahedronGeometry args={[selected ? 0.07 : 0.05, 0]} />
      <meshStandardMaterial
        color={selected ? '#f5d76e' : '#e8c547'}
        emissive="#a08020"
        emissiveIntensity={selected ? 0.6 : 0.25}
      />
    </mesh>
  )
}

function SceneContent() {
  const time = useAppStore((s) => s.time)
  const detail = useAppStore((s) => s.detail)
  const playing = useAppStore((s) => s.playing)
  const setTime = useAppStore((s) => s.setTime)
  const setPlaying = useAppStore((s) => s.setPlaying)
  const year = yearFromFraction(time)
  const metric = useAppStore((s) => s.metric)
  const incidents = incidentsVisible(detail, year)
  const active = countriesActiveAt(year, metric)

  useFrame((_, dt) => {
    if (!playing) return
    const next = time + dt * 0.02
    if (next >= 1) {
      setTime(1)
      setPlaying(false)
    } else {
      setTime(next)
    }
  })

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 3, 2]} intensity={1.2} />
      <directionalLight position={[-3, -1, -2]} intensity={0.25} />
      <Stars radius={80} depth={40} count={2000} factor={3} saturation={0} fade speed={0.4} />
      <Earth />
      {active.map((c) => (
        <CountryMarker key={c.id} country={c} year={year} />
      ))}
      {incidents.map((i) => (
        <IncidentMarker key={i.id} incident={i} />
      ))}
      <OrbitControls
        enablePan
        enableZoom
        minDistance={3.2}
        maxDistance={10}
        rotateSpeed={0.55}
        zoomSpeed={0.7}
      />
    </>
  )
}

export function Globe() {
  const time = useAppStore((s) => s.time)
  return (
    <div className="globe-wrap">
      <Canvas camera={{ position: [0, 1.2, 5.2], fov: 42 }} dpr={[1, 2]}>
        <color attach="background" args={['#0b1220']} />
        <SceneContent />
      </Canvas>
      <div className="globe-hud">{dateLabelFromFraction(time)}</div>
    </div>
  )
}
