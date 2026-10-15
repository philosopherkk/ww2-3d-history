import { z } from 'zod'
import { adaptIncident } from './evidenceAdapt'
import type { Incident } from './types'

const START = '1937-07-01'
const END = '1945-09-30'

export const localizedTextSchema = z.object({
  en: z.string().min(1),
  zhHant: z.string().min(1).optional(),
  zhHantReviewed: z.boolean().optional(),
})

export const evidenceLevelSchema = z.enum([
  'sourced',
  'estimated',
  'disputed',
  'order_of_magnitude',
  'unverified',
  'unsure',
])

export const incidentSchema = z
  .object({
    id: z.string().min(1),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((date) => date >= START && date <= END, {
        message: `date must be within ${START}..${END}`,
      }),
    year: z.number(),
    month: z.number().int().min(1).max(12),
    title: localizedTextSchema,
    lat: z.number().gte(-90).lte(90),
    lon: z.number().gte(-180).lte(180),
    minDetail: z.enum(['overview', 'standard', 'deep']),
    summaryOverview: localizedTextSchema,
    summaryStandard: localizedTextSchema,
    summaryDeep: localizedTextSchema,
    sources: z.array(z.string().min(1)),
    certainty: z.enum(['certain', 'approximate', 'unsure']),
  })
  .superRefine((incident, ctx) => {
    const level = adaptIncident(incident as Incident).level
    if (!evidenceLevelSchema.safeParse(level).success) {
      ctx.addIssue({ code: 'custom', message: `invalid evidence level ${level}` })
    }
    if (level !== 'unverified' && incident.sources.length < 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'incident needs at least one source unless unverified',
        path: ['sources'],
      })
    }
  })

export const countrySpecSchema = z.object({
  id: z.string().min(1),
  name: localizedTextSchema,
  lat: z.number().gte(-90).lte(90),
  lon: z.number().gte(-180).lte(180),
  roleNote: localizedTextSchema,
  cadence: z.enum(['weekly', 'monthly', 'quarterly']),
  activeFrom: z.string().regex(/^\d{4}-\d{2}$/),
  activeTo: z.string().regex(/^\d{4}-\d{2}$/),
})

export const personSchema = z.object({
  id: z.string().min(1),
  name: localizedTextSchema,
  role: localizedTextSchema,
  backgroundOverview: localizedTextSchema,
  backgroundStandard: localizedTextSchema,
  backgroundDeep: localizedTextSchema,
  certainty: z.enum(['certain', 'approximate', 'unsure']),
  wikipediaTitle: z.string().min(1),
})
