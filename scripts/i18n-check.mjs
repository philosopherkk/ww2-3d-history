/**
 * Reports missing / unreviewed zh-Hant. Always exits 0 — CI treats this as a warning.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function keysOf(file) {
  const text = readFileSync(join(root, file), 'utf8')
  const keys = []
  for (const match of text.matchAll(/^\s{2}([A-Za-z0-9_]+):/gm)) keys.push(match[1])
  return keys
}

function scanLocalized(file) {
  const text = readFileSync(join(root, file), 'utf8')
  let total = 0
  let missing = 0
  let unreviewed = 0
  let reviewed = 0
  const token = '{ en:'
  let from = 0
  while (from < text.length) {
    const start = text.indexOf(token, from)
    if (start < 0) break
    let depth = 0
    let end = start
    for (let i = start; i < text.length; i++) {
      if (text[i] === '{') depth++
      else if (text[i] === '}') {
        depth--
        if (depth === 0) {
          end = i
          break
        }
      }
    }
    const body = text.slice(start, end + 1)
    total++
    const hasZh = /zhHant\s*:/.test(body)
    const reviewedFlag = /zhHantReviewed\s*:\s*true/.test(body)
    if (!hasZh) missing++
    else if (!reviewedFlag) unreviewed++
    else reviewed++
    from = end + 1
  }
  return { total, missing, unreviewed, reviewed }
}

const enKeys = keysOf('src/shared/i18n/locales/en.ts')
const zhKeys = keysOf('src/shared/i18n/locales/zh-Hant.ts')
const enSet = new Set(enKeys)
const zhSet = new Set(zhKeys)
const missingInZh = enKeys.filter((k) => !zhSet.has(k))
const missingInEn = zhKeys.filter((k) => !enSet.has(k))

function scanGlossary(file) {
  const text = readFileSync(join(root, file), 'utf8')
  const total = (text.match(/^\s+en:\s*['"]/gm) || []).length
  const reviewed = (text.match(/zhHantReviewed:\s*true,/g) || []).length
  const withZh = (text.match(/^\s+zhHant:\s*['"]/gm) || []).length
  const missing = Math.max(0, total - withZh)
  const unreviewed = Math.max(0, withZh - reviewed)
  return { total, missing, unreviewed, reviewed }
}

const files = ['src/data/countryRoster.ts', 'src/data/incidents.ts', 'src/data/people.ts']
const counts = [
  ...files.map((file) => ({ file, ...scanLocalized(file) })),
  { file: 'src/data/glossary.zh-Hant.ts', ...scanGlossary('src/data/glossary.zh-Hant.ts') },
]
const totals = counts.reduce(
  (acc, row) => ({
    total: acc.total + row.total,
    missing: acc.missing + row.missing,
    unreviewed: acc.unreviewed + row.unreviewed,
    reviewed: acc.reviewed + row.reviewed,
  }),
  { total: 0, missing: 0, unreviewed: 0, reviewed: 0 },
)

console.log('i18n:check')
console.log(`locale keys: en=${enKeys.length} zh-Hant=${zhKeys.length}`)
console.log(`missing in zh-Hant: ${missingInZh.length}${missingInZh.length ? ` (${missingInZh.join(', ')})` : ''}`)
console.log(`missing in en: ${missingInEn.length}${missingInEn.length ? ` (${missingInEn.join(', ')})` : ''}`)
for (const row of counts) {
  console.log(
    `${row.file}: LocalizedText=${row.total} missingZhHant=${row.missing} unreviewed=${row.unreviewed} reviewed=${row.reviewed}`,
  )
}
console.log(
  `LocalizedText total=${totals.total} missingZhHant=${totals.missing} unreviewed=${totals.unreviewed} reviewed=${totals.reviewed}`,
)
console.log('note: missing historical zh-Hant is expected; UI falls back to English with 「英文原文」. This check does not fail the build.')
process.exit(0)
