/// <reference types="node" />
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function walk(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) out.push(...walk(path))
    else if (/\.(ts|tsx|css|mjs)$/.test(name)) out.push(path)
  }
  return out
}

function specifiers(source: string): string[] {
  const specs: string[] = []
  const pattern = /(?:from|import)\s*(?:\(\s*)?['"]([^'"]+)['"]/g
  for (const match of source.matchAll(pattern)) specs.push(match[1])
  return specs
}

function isForbidden(file: string, spec: string): boolean {
  if (/ww2/i.test(spec)) return true
  if (!spec.startsWith('.')) return false
  const target = resolve(dirname(file), spec).replaceAll('\\', '/')
  return /\/src\/(data|components|geo|state)(\/|$)/.test(target)
}

describe('shared boundary', () => {
  it('does not import WWII modules', () => {
    const root = resolve('src/shared')
    const offenders: string[] = []
    for (const file of walk(root)) {
      const source = readFileSync(file, 'utf8')
      for (const spec of specifiers(source)) {
        if (isForbidden(file, spec)) offenders.push(`${file} → ${spec}`)
      }
    }
    expect(offenders).toEqual([])
  })
})
