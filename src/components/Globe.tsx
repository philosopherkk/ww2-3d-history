import { useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  countriesActiveAt,
  dateLabelFromFraction,
  incidentsVisible,
  involvementLabel,
  latLonToVec3,
  maxMetricValue,
  metricAtYear,
  pointStamp,
  yearFromFraction,
} from '../data/selectors'
import { ww2Dataset } from '../data/ww2Dataset'
import { paintEarthMap } from '../geo/earthMap'
import { useAppStore } from '../state/appStore'
import type { Country, Incident } from '../data/types'

const R = 2.2

function Earth() {
  const tex = useMemo(() => {
    const canvas = paintEarthMap(1536)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
  }, [])

  return (
    <mesh>
      <sphereGeometry args={[R, 96, 96]} />
      <meshStandardMaterial map={tex} roughness={0.88} metalness={0.04} />
    </mesh>
  )
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[R * 1.018, 64, 64]} />
      <meshBasicMaterial
        color="#6aa0c8"
        transparent
        opacity={0.07}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function MarkerLabel({
  title,
  lines,
  kind,
}: {
  title: string
  lines: string[]
  kind: 'country' | 'incident'
}) {
  return (
    <div className={`globe-label globe-label--${kind}`}>
      <div className="globe-label-kind">
        {kind === 'country' ? 'Country / entity metric' : 'Critical incident'}
      </div>
      <strong>{title}</strong>
      {lines.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
  )
}

function CountryMarker({ country, year }: { country: Country; year: number }) {
  const metric = useAppStore((s) => s.metric)
  const selected = useAppStore((s) => s.selectedCountryId === country.id)
  const hovered = useAppStore((s) => s.hoveredCountryId === country.id)
  const selectCountry = useAppStore((s) => s.selectCountry)
  const setHoveredCountry = useAppStore((s) => s.setHoveredCountry)
  const time = useAppStore((s) => s.time)
  const point = metricAtYear(country, metric, year)
  const max = maxMetricValue(metric, year)

  const pos = useMemo(
    () => latLonToVec3(country.lat, country.lon, R + 0.02),
    [country.lat, country.lon],
  )
  const dir = useMemo(() => new THREE.Vector3(...pos).normalize(), [pos])

  if (!point) return null

  const h = 0.12 + (point.value / max) * 0.75
  const color =
    country.side === 'axis' ? '#c45c3a' : country.side === 'allies' ? '#3a7ec4' : '#8a8a6a'
  const unsure = point.certainty === 'unsure'
  const showLabel = selected || hovered
  const [x, y, z] = pos

  return (
    <group position={[x, y, z]}>
      {/* Large invisible hit target — every metric pin is clickable */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          selectCountry(country.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          setHoveredCountry(country.id)
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
          setHoveredCountry(null)
        }}
      >
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh scale={selected || hovered ? 1.35 : 1}>
        <sphereGeometry args={[0.048, 20, 20]} />
        <meshStandardMaterial
          color={selected ? '#f0e6c8' : color}
          emissive={selected || hovered ? '#665522' : '#000000'}
          emissiveIntensity={selected ? 0.45 : hovered ? 0.25 : 0}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.055, selected || hovered ? 0.09 : 0.072, 24]} />
        <meshBasicMaterial
          color={selected ? '#f0e6c8' : color}
          transparent
          opacity={selected || hovered ? 0.85 : 0.45}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <RadialBar
        dir={dir}
        height={h}
        color={unsure ? '#c4a03a' : color}
        selected={selected || hovered}
        onSelect={() => selectCountry(country.id)}
        onHover={(v) => setHoveredCountry(v ? country.id : null)}
      />
      {showLabel && (
        <Html
          distanceFactor={7.5}
          position={[0, 0.22, 0]}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[20, 0]}
        >
          <MarkerLabel
            kind="country"
            title={country.name}
            lines={[
              dateLabelFromFraction(time),
              involvementLabel(country.involvement),
              `${point.value} ${point.unit} · ${pointStamp(point)} · ${point.certainty}`,
            ]}
          />
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
  onHover,
}: {
  dir: THREE.Vector3
  height: number
  color: string
  selected: boolean
  onSelect: () => void
  onHover: (v: boolean) => void
}) {
  const geom = useMemo(() => new THREE.CylinderGeometry(0.028, 0.038, 1, 10), [])
  const pos = dir.clone().multiplyScalar(R + height / 2)
  const quat = new THREE.Quaternion()
  quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())

  return (
    <mesh
      position={pos}
      quaternion={quat}
      scale={[selected ? 1.35 : 1, height, selected ? 1.35 : 1]}
      geometry={geom}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
        onHover(true)
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
        onHover(false)
      }}
    >
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.88}
        emissive={selected ? color : '#000000'}
        emissiveIntensity={selected ? 0.3 : 0}
      />
    </mesh>
  )
}

function IncidentMarker({ incident }: { incident: Incident }) {
  const selected = useAppStore((s) => s.selectedIncidentId === incident.id)
  const hovered = useAppStore((s) => s.hoveredIncidentId === incident.id)
  const selectIncident = useAppStore((s) => s.selectIncident)
  const setHoveredIncident = useAppStore((s) => s.setHoveredIncident)
  const time = useAppStore((s) => s.time)
  const [x, y, z] = latLonToVec3(incident.lat, incident.lon, R + 0.07)
  const showLabel = selected || hovered

  return (
    <group position={[x, y, z]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          selectIncident(incident.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          setHoveredIncident(incident.id)
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
          setHoveredIncident(null)
        }}
      >
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh scale={selected || hovered ? 1.25 : 1}>
        <octahedronGeometry args={[selected || hovered ? 0.065 : 0.05, 0]} />
        <meshStandardMaterial
          color={selected ? '#fff1a8' : '#e8c547'}
          emissive="#a08020"
          emissiveIntensity={selected ? 0.75 : hovered ? 0.5 : 0.28}
        />
      </mesh>
      {(selected || hovered) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.11, 20]} />
          <meshBasicMaterial
            color="#f5d76e"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
      {showLabel && (
        <Html
          distanceFactor={7.5}
          position={[0, 0.18, 0]}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[20, 0]}
        >
          <MarkerLabel
            kind="incident"
            title={incident.title}
            lines={[
              incident.date,
              `Scrubber · ${dateLabelFromFraction(time)}`,
              'Incident pin (not a metric bar)',
            ]}
          />
        </Html>
      )}
    </group>
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 2]} intensity={1.25} />
      <directionalLight position={[-3, -1, -2]} intensity={0.28} />
      <Stars radius={80} depth={40} count={2200} factor={3} saturation={0} fade speed={0.4} />
      <Earth />
      <Atmosphere />
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
        makeDefault
      />
    </>
  )
}

function SelectionHud() {
  const time = useAppStore((s) => s.time)
  const countryId = useAppStore((s) => s.selectedCountryId)
  const incidentId = useAppStore((s) => s.selectedIncidentId)
  const hoveredCountryId = useAppStore((s) => s.hoveredCountryId)
  const hoveredIncidentId = useAppStore((s) => s.hoveredIncidentId)

  const focusCountryId = countryId ?? hoveredCountryId
  const focusIncidentId = incidentId ?? hoveredIncidentId
  const c = focusCountryId
    ? ww2Dataset.countries.find((x) => x.id === focusCountryId)
    : null
  const inc = focusIncidentId
    ? ww2Dataset.incidents.find((x) => x.id === focusIncidentId)
    : null
  const sticky = Boolean(countryId || incidentId)

  if (!c && !inc) {
    return (
      <div className="globe-hud-stack">
        <div className="globe-hud">{dateLabelFromFraction(time)}</div>
        <div className="globe-legend">
          <span className="leg leg-country">● Country metric pin + bar</span>
          <span className="leg leg-incident">◆ Incident pin</span>
          <span className="leg">Amber bar = unsure</span>
        </div>
        <p className="globe-hint">Hover or click any pin — learning panel opens for that date.</p>
      </div>
    )
  }

  return (
    <div className="globe-hud-stack">
      <div className="globe-hud globe-hud--focus">
        <span className="globe-hud-kind">{c ? 'Country / entity' : 'Incident'}</span>
        <strong>{c?.name ?? inc?.title}</strong>
        <span>
          {dateLabelFromFraction(time)}
          {c ? ` · ${involvementLabel(c.involvement)}` : ''}
          {inc && !c ? ` · ${inc.date}` : ''}
          {sticky ? ' · selected' : ' · hover'}
        </span>
      </div>
      <div className="globe-legend">
        <span className="leg leg-country">● Country metric pin + bar</span>
        <span className="leg leg-incident">◆ Incident pin</span>
      </div>
    </div>
  )
}

export function Globe() {
  return (
    <div className="globe-wrap">
      <Canvas camera={{ position: [0, 1.2, 5.2], fov: 42 }} dpr={[1, 2]}>
        <color attach="background" args={['#0b1220']} />
        <SceneContent />
      </Canvas>
      <SelectionHud />
    </div>
  )
}
