import { useState, useCallback } from 'react'
import { DurationPicker } from './components/DurationPicker'
import { TimerDisplay } from './components/TimerDisplay'
import { Controls } from './components/Controls'
import { useTimer } from './hooks/useTimer'
import { MAX_DURATION_MINUTES, MIN_DURATION_MINUTES, TIMER_RED } from './constants/design'

function App() {
  const [durationMinutes, setDurationMinutes] = useState(60) // Default 1 hour
  const { state, actions } = useTimer(durationMinutes)

  const handleDurationChange = useCallback((minutes: number) => {
    // Clamp to valid range
    const clampedMinutes = Math.max(
      MIN_DURATION_MINUTES,
      Math.min(MAX_DURATION_MINUTES, minutes)
    )
    setDurationMinutes(clampedMinutes)
    actions.setDuration(clampedMinutes)
  }, [actions])

  const isRunningOrPaused = state.status === 'running' || state.status === 'paused'
  const isFinished = state.status === 'finished'

  return (
    <div className="min-h-full flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="pt-4 pb-2 md:pt-6 md:pb-4 text-center">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          <TimerIcon />
          <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            TempoKids
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-500 font-medium">Timer visuel pour enfants</p>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-3 pb-4 md:px-4 md:pb-6">
        {/* Duration Picker - hidden when running */}
        {!isRunningOrPaused && !isFinished && (
          <div className="mb-4 md:mb-6 p-4 md:p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
            <DurationPicker
              value={durationMinutes}
              onChange={handleDurationChange}
              disabled={isRunningOrPaused}
            />
          </div>
        )}

        {/* Timer Display */}
        <div className="flex-1 flex items-center justify-center w-full max-w-md">
          <div className="w-full bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-6 border border-slate-100">
            <TimerDisplay
              totalMinutes={durationMinutes}
              remainingSeconds={state.remainingTime}
              isPaused={state.status === 'paused'}
            />
          </div>
        </div>

        {/* Time remaining display */}
        {isRunningOrPaused && (
          <div className="mt-4 md:mt-6 px-6 py-3 md:px-8 md:py-4 bg-white rounded-xl md:rounded-2xl shadow-md border border-slate-100">
            <p
              className="text-3xl md:text-4xl font-mono font-bold tracking-wider"
              style={{ color: TIMER_RED }}
            >
              {formatTimeDisplay(state.remainingTime)}
            </p>
          </div>
        )}

        {/* Finished message */}
        {isFinished && (
          <div className="mt-4 md:mt-6 px-6 py-3 md:px-8 md:py-4 bg-green-50 rounded-xl md:rounded-2xl shadow-md border border-green-200">
            <p className="text-xl md:text-2xl font-bold text-green-600 flex items-center gap-2">
              <CheckIcon />
              Terminé !
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="mt-4 md:mt-6">
          <Controls
            status={state.status}
            onStart={actions.start}
            onPause={actions.pause}
            onResume={actions.resume}
            onReset={actions.reset}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-2 md:py-3 text-center">
        <p className="text-xs text-slate-400">
          Max 4 heures par session
        </p>
      </footer>
    </div>
  )
}

function formatTimeDisplay(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function TimerIcon() {
  return (
    <svg
      className="w-6 h-6 md:w-8 md:h-8 text-red-500"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
      <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

export default App
