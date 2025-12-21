import type { TimerStatus } from '../../types/timer'
import { TIMER_RED } from '../../constants/design'

interface ControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onReset: () => void
}

export function Controls({
  status,
  onStart,
  onPause,
  onResume,
  onReset,
}: ControlsProps) {
  const buttonBase = `
    min-h-[48px] md:min-h-[56px] px-6 md:px-8
    rounded-xl md:rounded-2xl font-bold text-base md:text-lg
    transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-offset-2
    active:scale-95
    flex items-center justify-center gap-2 md:gap-3
  `

  const primaryButton = `${buttonBase} text-white shadow-lg hover:shadow-xl hover:brightness-110`
  const secondaryButton = `${buttonBase} bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400`

  return (
    <div className="flex items-center gap-4 md:gap-6">
      {/* Main action button */}
      {status === 'idle' && (
        <button
          type="button"
          onClick={onStart}
          className={primaryButton}
          style={{ backgroundColor: TIMER_RED }}
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
          style={{ backgroundColor: TIMER_RED }}
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
          style={{ backgroundColor: TIMER_RED }}
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
          style={{ backgroundColor: TIMER_RED }}
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

// SVG Icons
function PlayIcon() {
  return (
    <svg
      className="w-4 h-4 md:w-5 md:h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg
      className="w-4 h-4 md:w-5 md:h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
    </svg>
  )
}

function ResetIcon() {
  return (
    <svg
      className="w-4 h-4 md:w-5 md:h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}
