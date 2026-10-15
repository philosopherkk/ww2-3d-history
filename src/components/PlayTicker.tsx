import { useEffect } from 'react'
import { useAppStore } from '../state/appStore'

/** Advances the scrubber while playing — works for both flat map and globe. */
export function PlayTicker() {
  const playing = useAppStore((s) => s.playing)

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      const { time, setTime, setPlaying } = useAppStore.getState()
      const next = time + dt * 0.02
      if (next >= 1) {
        setTime(1)
        setPlaying(false)
      } else {
        setTime(next)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  return null
}
