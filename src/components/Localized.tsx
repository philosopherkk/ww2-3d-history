import { useLocale } from '../shared/i18n/useLocale'
import { t } from '../shared/i18n/translate'
import type { LocalizedText } from '../shared/i18n/types'
import { resolveLocalized, warnMissingZh } from '../data/localize'

export function Localized({ value }: { value: LocalizedText | string | undefined | null }) {
  const locale = useLocale((s) => s.locale)
  if (value == null || value === '') return null
  const resolved = resolveLocalized(value, locale)
  if (resolved.warn) warnMissingZh(typeof value === 'string' ? value : value.en)
  return (
    <>
      {resolved.text}
      {resolved.fallback ? <small className="en-original"> {t('enOriginal')}</small> : null}
    </>
  )
}
