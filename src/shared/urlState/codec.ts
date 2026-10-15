export interface FieldCodec<T> {
  parse: (raw: string) => T | undefined
  /** Return null to omit the key. */
  serialize: (value: T) => string | null
}

export function readSearch<T extends object>(
  search: string,
  fields: { [K in keyof T]: FieldCodec<T[K]> },
): Partial<T> {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const out: Partial<T> = {}
  for (const key of Object.keys(fields) as (keyof T)[]) {
    const raw = params.get(String(key))
    if (raw == null || raw === '') continue
    const parsed = fields[key].parse(raw)
    if (parsed !== undefined) out[key] = parsed
  }
  return out
}

export function writeSearch<T extends object>(
  fields: { [K in keyof T]: FieldCodec<T[K]> },
  values: T,
): string {
  const params = new URLSearchParams()
  for (const key of Object.keys(fields) as (keyof T)[]) {
    const serialized = fields[key].serialize(values[key])
    if (serialized != null && serialized !== '') params.set(String(key), serialized)
  }
  const q = params.toString()
  return q ? `?${q}` : ''
}
