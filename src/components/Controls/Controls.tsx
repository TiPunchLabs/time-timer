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
    min-h-[48px] md:min-h-[56px] px-6 md:px-8
    rounded-xl md:rounded-2xl font-bold text-base md:text-lg
    transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-95
    flex items-center justify-center gap-2 md:gap-3
  `

  const primaryButton = `${buttonBase} text-white shadow-lg hover:shadow-xl hover:brightness-110 focus:ring-blue-500`
  const secondaryButton = `${buttonBase} bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400`

  return (
    <div className="flex items-center gap-4 md:gap-6">
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
