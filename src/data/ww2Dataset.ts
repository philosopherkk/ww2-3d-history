import { buildCountries } from './buildSeries'
import { countrySpecs } from './countryRoster'
import { incidents } from './incidents'
import { END, START } from './timeScale'
import type { DataCatalog } from './types'

const countries = buildCountries(countrySpecs, '1937-07', '1945-09')

/**
 * WWII teaching dataset — dense series built from compact anchors.
 * Interpolated / held points are approximate or unsure (never upgraded to certain).
 */
export const ww2Dataset: DataCatalog = {
  timeframe: {
    start: '1937-07-01',
    end: '1945-09-02',
    preludeLabeled: true,
  },

  series: {
    defaultCadence: 'weekly',
    startYear: START,
    endYear: END,
    note:
      'Eight major combatants use weekly densification from sparse anchors (interpolated points are approximate/unsure — never treated as measured weekly statistics). Key secondary combatants use monthly cadence; remaining participants use quarterly. Gaps outside each country’s active window are omitted (not invented).',
  },

  metricLabels: {
    economicPower: {
      label: 'Economic power',
      description:
        'Approximate GDP in billion 1990 international dollars (Maddison-style). Dense series from sparse anchors — interpolated points are approximate/unsure.',
    },
    population: {
      label: 'Population',
      description:
        'Approximate population in millions. Monthly/quarterly densification; wartime borders often unsure.',
    },
    militaryStrength: {
      label: 'Military strength',
      description:
        'Rough active armed-forces size (personnel, millions). Comparative teaching index, not combat effectiveness.',
    },
    armyMobilisation: {
      label: 'Army mobilisation',
      description: 'Approximate army personnel in millions along the dense timeline.',
    },
    navyMobilisation: {
      label: 'Navy mobilisation',
      description:
        'Approximate major combatant warships in commission — definition-sensitive; often unsure.',
    },
  },

  sources: [
    {
      id: 'maddison',
      citation:
        'Maddison Project Database / Angus Maddison, Historical Statistics of the World Economy (1990 Int$ GDP series).',
      url: 'https://www.rug.nl/ggdc/historicaldevelopment/maddison/',
      covers: 'economicPower',
    },
    {
      id: 'ourworldindata-pop',
      citation: 'Our World in Data / UN & historical population compilations (country aggregates).',
      url: 'https://ourworldindata.org/population-growth',
      covers: 'population',
    },
    {
      id: 'harrison-ww2-econ',
      citation:
        'Mark Harrison (ed.), The Economics of World War II (Cambridge University Press, 1998) — mobilisation & output shares.',
      covers: 'economicPower, militaryStrength, armyMobilisation',
    },
    {
      id: 'ellis-ww2-datbook',
      citation:
        'John Ellis, The World War II Databook (Aurum Press) — force strengths and order-of-battle snapshots.',
      covers: 'armyMobilisation, navyMobilisation, militaryStrength',
    },
    {
      id: 'britannica-timeline',
      citation: 'Encyclopaedia Britannica — World War II timeline (incident dates & overviews).',
      url: 'https://www.britannica.com/event/World-War-II',
      covers: 'incidents, belligerent lists',
    },
    {
      id: 'usni-navy',
      citation:
        'U.S. Naval Institute / Jane’s Fighting Ships era summaries — major fleet composition (approximate).',
      covers: 'navyMobilisation',
    },
    {
      id: 'un-declarations',
      citation:
        'United Nations / wartime declaration lists — late declarants and Latin American entry dates (teaching compilation).',
      covers: 'late-declarant active windows',
    },
    {
      id: 'official-histories',
      citation:
        'National Official Histories (UK Cabinet Office / US Army CMH / Australian War Memorial summaries) — campaign chronology cross-check for incident dates.',
      covers: 'incidents',
    },
    {
      id: 'yale-avalon',
      citation:
        'Yale Law School Avalon Project — wartime treaties, armistice instruments, and conference communiqués (dates).',
      url: 'https://avalon.law.yale.edu/subject_menus/wwii.asp',
      covers: 'incidents (diplomatic)',
    },
  ],

  countries,
  incidents,
}

export const datasetStats = {
  countryCount: countries.length,
  weeklyCountries: countries.filter((c) => c.cadence === 'weekly').length,
  monthlyCountries: countries.filter((c) => c.cadence === 'monthly').length,
  quarterlyCountries: countries.filter((c) => c.cadence === 'quarterly').length,
  incidentCount: incidents.length,
  totalMetricPoints: countries.reduce(
    (n, c) => n + Object.values(c.metrics).reduce((m, pts) => m + pts.length, 0),
    0,
  ),
}
