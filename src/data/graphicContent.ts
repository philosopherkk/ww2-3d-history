/**
 * Incidents whose longer summaries describe wartime atrocities.
 * The stored sentences are unchanged. The UI shows them only at the highest
 * detail level, after the content note is opened.
 */
export const GRAPHIC_INCIDENT_IDS = new Set<string>([
  'nanjing-fall',
  'kristallnacht',
  'ussr-poland',
  'wansee',
  'bataan',
  'warsaw-ghetto',
  'hamburg-gomorrah',
  'auschwitz-liberated',
  'dresden',
  'tokyo-firebombing',
  'berlin-falls',
  'hiroshima',
  'nagasaki',
])

export function incidentIsGraphic(id: string): boolean {
  return GRAPHIC_INCIDENT_IDS.has(id)
}
