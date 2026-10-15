const enSource = {
  eyebrow: 'Project Ww 2 · v1',
  brand: 'WWII Atlas',
  sources: 'Sources',
  language: 'Language',
  play: 'Play',
  pause: 'Pause',
  time: 'Time',
  preludeTag: 'labeled prelude',
  tickPrelude: '1937 prelude',
  tick1939: '1939',
  tick1942: '1942',
  tick1945: '1945',
  mapView: 'Map view',
  viewMap: '2D map (default)',
  viewGlobe: '3D globe',
  viewList: 'List',
  metricLayer: 'Metric layer',
  studentDetail: 'Student detail',
  detailOverview: 'overview',
  detailStandard: 'standard',
  detailDeep: 'deep',
  metric_economicPower: 'Economic power',
  metric_population: 'Population',
  metric_militaryStrength: 'Military strength',
  metric_armyMobilisation: 'Army mobilisation',
  metric_navyMobilisation: 'Navy mobilisation',
  metric_economicPower_desc:
    'Approximate GDP in billion 1990 international dollars (Maddison-style). Dense series from sparse anchors — interpolated points are approximate/unsure.',
  metric_population_desc:
    'Approximate population in millions. Monthly/quarterly densification; wartime borders often unsure.',
  metric_militaryStrength_desc:
    'Rough active armed-forces size (personnel, millions). Comparative teaching index, not combat effectiveness.',
  metric_armyMobilisation_desc: 'Approximate army personnel in millions along the dense timeline.',
  metric_navyMobilisation_desc:
    'Approximate major combatant warships in commission — definition-sensitive; often unsure.',
  statsLine:
    '{countries} countries · {incidents} incidents · {points} metric points · default 2D equirectangular map · click pins for learning panel (people + Wikipedia / Grokipedia) · amber = unsure',
  person: 'Person',
  back: 'Back',
  close: 'Close',
  background: 'Background',
  contextAt: 'context @ {date}',
  dossierHint:
    'Detail “{detail}” deepens this dossier. Encyclopedia links use verified URL patterns — Grokipedia search is labeled unsure when the exact article slug was not verified.',
  encyclopedia: 'Encyclopedia',
  learningPanel: 'Learning panel',
  emptyPanel:
    'Click any country pin or incident diamond on the map — or pick an incident in the timeline. The panel explains that place/entity at the scrubber date ({date}), with people and encyclopedia links.',
  metricDetailHint:
    'Metric layer: {metric} · detail: {detail} · {countries} entities · {incidents} incidents.',
  legendCountry: 'Country pin — alliance colour; size = selected metric',
  legendIncident: 'Incident pin — dated event on the map',
  legendUnsure: 'Amber — metric/link labeled unsure',
  criticalIncident: 'Critical incident',
  backgroundAt: 'Background @ {date}',
  detailDeepens: 'Student detail “{detail}” deepens this text (overview → standard → deep).',
  peopleInvolved: 'People involved',
  noPeopleIncident: 'No rostered people linked to this incident pin yet.',
  nearbyEntities: 'Nearby entities on the map',
  sourcesHeading: 'Sources',
  countryEntity: 'Country / entity',
  detailAdds:
    'Detail level “{detail}” adds series, incident, and people context — it does not invent events.',
  noPeopleCountry:
    'No major rostered leaders for this entity — try a major combatant or related incident.',
  pointLabel: 'Point',
  certainty: 'certainty',
  noDatapoint: 'No nearby datapoint (outside active window or gap > ~5 months).',
  allMetricsAt: 'All metrics @ {date}',
  relatedIncidents: 'Related incidents',
  relatedHint:
    'Linked by proximity or by naming this entity — only incidents already reached by the scrubber. Each has Wikipedia + Grokipedia links.',
  timelineTitle: 'Critical incidents',
  timelineHint: 'Detail level filters which incidents appear. Click to inspect.',
  prelude: 'prelude',
  sourcesTitle: 'Data sources & certainty',
  sourcesIntro:
    'Figures are teaching estimates densified to weekly (major combatants), monthly (key secondaries), or quarterly (others) from sparse published anchors — not a research database. Interpolated / held points are never marked certain. Values marked unsure are debated, method-dependent, occupied/partitioned, or thinly sourced. Prefer Official Histories for graded work.',
  covers: 'Covers',
  link: 'link',
  timeframe: 'Timeframe',
  preludeLabeled: '(late-1930s Asian prelude labeled on the scrubber)',
  loadingMap: 'Loading Natural Earth basemap…',
  mapAlt: 'Equirectangular world map',
  countryPin: 'Country pin {name}',
  incidentPin: 'Incident pin {name}',
  incidentKind: 'Incident',
  selected: 'selected',
  hover: 'hover',
  dragHint: 'Drag to pan · scroll to zoom',
  legCountryOnMap: '● Country pin (on map)',
  legIncidentOnMap: '◆ Incident pin (on map)',
  legCountrySurface: '● Country pin (on surface)',
  legIncidentSurface: '◆ Incident pin (on surface)',
  legCountry: '● Country pin',
  legIncident: '◆ Incident pin',
  amberUnsure: 'Amber = unsure metric',
  globeHint: 'Optional 3D view — switch to 2D map for easier clicking. Hover or click pins.',
  countryPinKind: 'Country / entity pin',
  incidentPinKind: 'Critical incident',
  scrubberLine: 'Scrubber · {date}',
  incidentSurfaceHint: 'Incident pin on surface (not a metric stick)',
  datePrelude: '(prelude)',
  enOriginal: '英文原文',
  inv_allies: 'Allied combatant',
  inv_axis: 'Axis combatant',
  inv_coBelligerent: 'Co-belligerent (fought alongside a major alliance without full membership)',
  inv_puppet: 'Client / puppet regime (limited sovereignty)',
  inv_occupied: 'Occupied or annexed territory in this dataset window',
  inv_exile: 'Government-in-exile (homeland under occupation)',
  inv_dominion: 'British Dominion / Commonwealth partner',
  inv_late: 'Late declarant of war (often limited or no combat)',
  side_allies: 'Allies (globe colour)',
  side_axis: 'Axis (globe colour)',
  side_other: 'Other / mixed (globe colour)',
  markerCountry:
    'This map marker is a country / entity pin on the Earth surface at the teaching lat/lon. Pin size reflects the selected metric at the scrubber date (not a stick floating in space).',
  markerIncident:
    'This map marker is a critical-incident pin (diamond) on the map surface at the teaching lat/lon — distinct from country metric pins.',
  countryAt:
    '{name} at {date}: classified here as {involvement}, coloured on the map as {side}.',
  metricSentence:
    'Selected metric ({metric}) ≈ {value} {unit} at stamp {stamp} — certainty {certainty}{provenance}.',
  noMetricSentence:
    'No datapoint for the selected metric at this scrubber date (outside the active window or beyond the nearest-point gap).',
  incidentsReached: 'Incidents already reached by the scrubber that are near this pin or name this entity include: {list}.',
  noIncidentsReached:
    'No nearby/named incidents have been reached yet at {date} for the current detail filter.',
  seriesCaveat:
    'Teaching series use {cadence} densification from sparse anchors — interpolated or held points stay approximate/unsure and are never upgraded to “certain”.',
  metricNote: 'Metric note: {note}',
  peopleHint:
    'People linked below are major figures associated with this entity in the atlas — open a name for background and encyclopedia links.',
  fullSnapshot: 'Full metric snapshot @ {date}: {metrics}.',
  deepCaveat:
    'Deep mode adds denser incident links and person dossiers. Occupied, puppet, and late-declarant figures often double-count metropolitan powers or remain unsure — do not treat them as independent industrial peers without reading the certainty flags.',
  geoCaveat:
    'Geography pins mark teaching locations, not precise front lines. Political borders on the basemap are modern Natural Earth outlines for recognition, not 1939 frontiers.',
  metricMissing: '{label}: —',
  metricSnap: '{label}: {value} {unit} ({certainty}{extra})',
  interpolatedWord: ', interpolated',
  incidentExtraStandard:
    ' Compare the scrubber ({date}) with the incident date ({incidentDate}) to see what students already know on the timeline. People listed below are directly tied to this event in the atlas roster.',
  incidentExtraDeep:
    ' Deep mode keeps the longest teaching summary and emphasizes sources, encyclopedia links, and associated people. Certainty for this incident record: {certainty}. Casualty figures mentioned in prose may still be approximate even when the event date is certain.',
  statusPrelude: ' · Asian/European prelude (pre-Sep 1939)',
  statusScrubber: ' · scrubber {date}',
  statusUnsure: ' · unsure',
  seriesLegend: 'Metric series. Solid dots are anchors. Dashed lighter dots are interpolated or held.',
  seriesAnchor: 'Anchor (solid)',
  seriesInterpolated: 'Interpolated or held (dashed, lighter)',
} as const

export type MessageKey = keyof typeof enSource
export type Messages = { [K in MessageKey]: string }

export const en: Messages = enSource
