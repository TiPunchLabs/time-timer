import type { TimerStatus } from '../../types/timer'
import { TIMER_BLUE } from '../../constants/design'
import { PlayIcon, PauseIcon, ResetIcon } from '../icons'

interface ControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
  /** Custom accent color for primary buttons */
  accentColor?: string
}

export function Controls({
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  accentColor = TIMER_BLUE,
}: ControlsProps) {
  const buttonBase = `
    h-14 px-6
    rounded-2xl font-semibold text-base md:text-[17px]
    transition-[filter,background-color] duration-150
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-ink
    active:brightness-95
    flex items-center justify-center gap-2.5
  `

  const primaryButton = `${buttonBase} flex-1 text-white hover:brightness-105`
  const secondaryButton = `${buttonBase} w-[118px] shrink-0 border border-hairline-strong bg-paper text-ink-70 hover:bg-hairline/40`

  return (
    <div className="flex items-center gap-3">
      {/* Main action button */}
      {status === 'idle' && (
        <button
          type="button"
          onClick={onStart}
          className={primaryButton}
          style={{ backgroundColor: accentColor }}
          aria-label="Démarrer le timer"
        >
          <PlayIcon />
          Démarrer
        </button>
      )}

      {status === 'running' && (
        <button
          type="button"
          onClick={onPause}
          className={primaryButton}
          style={{ backgroundColor: accentColor }}
          aria-label="Mettre en pause"
        >
          <PauseIcon />
          Pause
        </button>
      )}

      {status === 'paused' && (
        <button
          type="button"
          onClick={onResume}
          className={primaryButton}
          style={{ backgroundColor: accentColor }}
          aria-label="Reprendre le timer"
        >
          <PlayIcon />
          Reprendre
        </button>
      )}

      {status === 'finished' && (
        <button
          type="button"
          onClick={onReset}
          className={primaryButton}
          style={{ backgroundColor: accentColor }}
          aria-label="Recommencer"
        >
          <ResetIcon />
          Recommencer
        </button>
      )}

      {/* Reset button (visible when running or paused) */}
      {(status === 'running' || status === 'paused') && (
        <button
          type="button"
          onClick={onReset}
          className={secondaryButton}
          aria-label="Réinitialiser le timer"
        >
          <ResetIcon />
          Reset
        </button>
      )}
    </div>
  )
}
