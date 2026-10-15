import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useT } from '../shared/i18n/translate'

interface Props {
  children: ReactNode
  onSwitchToMap?: () => void
  onOpenList?: () => void
  fallbackKind?: 'shell' | 'globe'
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          kind={this.props.fallbackKind ?? 'shell'}
          onSwitchToMap={this.props.onSwitchToMap}
          onOpenList={this.props.onOpenList}
        />
      )
    }
    return this.props.children
  }
}

function ErrorFallback({
  kind,
  onSwitchToMap,
  onOpenList,
}: {
  kind: 'shell' | 'globe'
  onSwitchToMap?: () => void
  onOpenList?: () => void
}) {
  const t = useT()
  return (
    <div className="error-fallback" role="alert">
      <p>{kind === 'globe' ? t('globeError') : t('atlasError')}</p>
      <div className="error-fallback-actions">
        <button type="button" onClick={() => window.location.reload()}>
          {t('reloadPage')}
        </button>
        {kind === 'globe' && onSwitchToMap ? (
          <button type="button" onClick={onSwitchToMap}>
            {t('switchToMap')}
          </button>
        ) : null}
        {onOpenList ? (
          <button type="button" onClick={onOpenList}>
            {t('openListView')}
          </button>
        ) : null}
      </div>
    </div>
  )
}
