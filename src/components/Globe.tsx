import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
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
import { buildEarthTexture } from '../geo/earthMap'
import { useAppStore } from '../state/appStore'
import type { Country, Incident } from '../data/types'

const R = 2.2
/** Slight lift above the mesh to avoid z-fighting — markers sit on the ground. */
const SURFACE_EPS = 0.012
const INCIDENT_EPS = 0.018

function surfacePose(lat: number, lon: number, radius: number) {
  const [x, y, z] = latLonToVec3(lat, lon, radius)
  const dir = new THREE.Vector3(x, y, z).normalize()
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir)
  return { position: [x, y, z] as [number, number, number], quaternion: quat }
}

function Earth() {
  const [map, setMap] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let alive = true
    buildEarthTexture(2048)
      .then((tex) => {
        if (alive) setMap(tex)
      })
      .catch((err) => console.warn(err))
    return () => {
      alive = false
    }
  }, [])

  return (
    <mesh>
      <sphereGeometry args={[R, 128, 128]} />
      <meshStandardMaterial
        map={map ?? undefined}
        color={map ? '#ffffff' : '#1a3a52'}
        roughness={0.9}
        metalness={0.04}
      />
    </mesh>
  )
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[R * 1.012, 64, 64]} />
      <meshBasicMaterial
        color="#6aa0c8"
        transparent
        opacity={0.06}
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
        {kind === 'country' ? 'Country / entity pin' : 'Critical incident'}
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

  const pose = useMemo(
    () => surfacePose(country.lat, country.lon, R + SURFACE_EPS),
    [country.lat, country.lon],
  )

  if (!point) return null

  const t = Math.min(1, point.value / max)
  const pinR = 0.026 + t * 0.032
  const color =
    country.side === 'axis' ? '#c45c3a' : country.side === 'allies' ? '#3a7ec4' : '#8a8a6a'
  const unsure = point.certainty === 'unsure'
  const showLabel = selected || hovered
  const accent = unsure ? '#c4a03a' : color

  return (
    <group position={pose.position} quaternion={pose.quaternion}>
      {/* Hit target — flat on surface, clickable */}
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
        <circleGeometry args={[0.1, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Ground disc — metric size encoded in radius, not height */}
      <mesh scale={selected || hovered ? 1.2 : 1}>
        <circleGeometry args={[pinR, 28]} />
        <meshStandardMaterial
          color={selected ? '#f0e6c8' : accent}
          emissive={selected || hovered ? accent : '#000000'}
          emissiveIntensity={selected ? 0.4 : hovered ? 0.22 : 0.08}
          roughness={0.55}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer ring flush on ground */}
      <mesh>
        <ringGeometry args={[pinR * 1.05, pinR * (selected || hovered ? 1.55 : 1.35), 28]} />
        <meshBasicMaterial
          color={selected ? '#f0e6c8' : accent}
          transparent
          opacity={selected || hovered ? 0.9 : 0.55}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Tiny center bead so the pin reads as a “dot” on the sphere */}
      <mesh position={[0, 0, 0.004]}>
        <sphereGeometry args={[pinR * 0.35, 12, 12]} />
        <meshStandardMaterial
          color={selected ? '#fff8e0' : accent}
          emissive={accent}
          emissiveIntensity={0.15}
        />
      </mesh>

      {showLabel && (
        <Html
          distanceFactor={7.5}
          position={[0, pinR * 2.2, 0.04]}
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

function IncidentMarker({ incident }: { incident: Incident }) {
  const selected = useAppStore((s) => s.selectedIncidentId === incident.id)
  const hovered = useAppStore((s) => s.hoveredIncidentId === incident.id)
  const selectIncident = useAppStore((s) => s.selectIncident)
  const setHoveredIncident = useAppStore((s) => s.setHoveredIncident)
  const time = useAppStore((s) => s.time)
  const pose = useMemo(
    () => surfacePose(incident.lat, incident.lon, R + INCIDENT_EPS),
    [incident.lat, incident.lon],
  )
  const showLabel = selected || hovered
  const size = selected || hovered ? 0.038 : 0.03

  return (
    <group position={pose.position} quaternion={pose.quaternion}>
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
        <circleGeometry args={[0.09, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Diamond flat on the ground (XY), normal = outward */}
      <mesh rotation={[0, 0, Math.PI / 4]} scale={selected || hovered ? 1.15 : 1}>
        <planeGeometry args={[size * 1.6, size * 1.6]} />
        <meshStandardMaterial
          color={selected ? '#fff1a8' : '#e8c547'}
          emissive="#a08020"
          emissiveIntensity={selected ? 0.7 : hovered ? 0.45 : 0.25}
          side={THREE.DoubleSide}
          roughness={0.4}
        />
      </mesh>

      {(selected || hovered) && (
        <mesh>
          <ringGeometry args={[size * 1.1, size * 1.55, 20]} />
          <meshBasicMaterial
            color="#f5d76e"
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {showLabel && (
        <Html
          distanceFactor={7.5}
          position={[0, size * 2.4, 0.04]}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[20, 0]}
        >
          <MarkerLabel
            kind="incident"
            title={incident.title}
            lines={[
              incident.date,
              `Scrubber · ${dateLabelFromFraction(time)}`,
              'Incident pin on surface (not a metric stick)',
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
  const year = yearFromFraction(time)
  const metric = useAppStore((s) => s.metric)
  const incidents = incidentsVisible(detail, year)
  const active = countriesActiveAt(year, metric)

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 3, 2]} intensity={1.15} />
      <directionalLight position={[-3, -1, -2]} intensity={0.3} />
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
          <span className="leg leg-country">● Country pin (on surface)</span>
          <span className="leg leg-incident">◆ Incident pin (on surface)</span>
          <span className="leg">Amber = unsure metric</span>
        </div>
        <p className="globe-hint">
          Optional 3D view — switch to 2D map for easier clicking. Hover or click pins.
        </p>
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
        <span className="leg leg-country">● Country pin</span>
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
