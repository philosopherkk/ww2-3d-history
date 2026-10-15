import { useT } from '../shared/i18n/translate'

export function BorderNotice() {
  const t = useT()
  return <p className="border-notice">{t('borderNotice')}</p>
}
