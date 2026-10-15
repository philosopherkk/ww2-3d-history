import type { MetricKey } from './types'

export const DEFAULT_UNITS: Record<MetricKey, string> = {
  economicPower: 'bn 1990 Int$',
  population: 'millions',
  militaryStrength: 'millions personnel',
  armyMobilisation: 'millions',
  navyMobilisation: 'major warships (approx)',
}
