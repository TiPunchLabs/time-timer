import { useState, useCallback } from 'react'
import { DurationPicker } from './components/DurationPicker'
import { TimerDisplay } from './components/TimerDisplay'
import { Controls } from './components/Controls'
import { ErrorBoundary } from './components/ErrorBoundary'
import { OfflineIndicator } from './components/OfflineIndicator'
import { ReloadPrompt } from './components/ReloadPrompt'
import { BurgerMenuIcon, CheckIcon } from './components/icons'
import { BurgerMenu } from './components/BurgerMenu'
import { useTimer } from './hooks/useTimer'
import { useLocalStorage } from './hooks/useLocalStorage'
import { formatTime } from './utils/time'
import { MAX_DURATION_MINUTES, MIN_DURATION_MINUTES, TIMER_BLUE, COLOR_STORAGE_KEY, PASTEL_ENABLED_STORAGE_KEY, MINUTE_TICKS_STORAGE_KEY, FIVE_MINUTE_TICKS_STORAGE_KEY } from './constants/design'

function App() {
  const [durationMinutes, setDurationMinutes] = useState(60) // Default 1 hour
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useLocalStorage(COLOR_STORAGE_KEY, TIMER_BLUE)
  const [showPastel, setShowPastel] = useLocalStorage(PASTEL_ENABLED_STORAGE_KEY, false)
  const [showMinuteTicks, setShowMinuteTicks] = useLocalStorage(MINUTE_TICKS_STORAGE_KEY, false)
  const [showFiveMinuteTicks, setShowFiveMinuteTicks] = useLocalStorage(FIVE_MINUTE_TICKS_STORAGE_KEY, false)
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

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  const handlePresetSelect = useCallback((minutes: number) => {
    // Reset timer if running or paused before changing duration
    if (state.status === 'running' || state.status === 'paused') {
      actions.reset()
    }
    handleDurationChange(minutes)
  }, [state.status, actions, handleDurationChange])

  const handleColorChange = useCallback((hex: string) => {
    setSelectedColor(hex)
  }, [setSelectedColor])

  const handlePastelToggle = useCallback((enabled: boolean) => {
    setShowPastel(enabled)
  }, [setShowPastel])

  const handleMinuteTicksToggle = useCallback((enabled: boolean) => {
    setShowMinuteTicks(enabled)
  }, [setShowMinuteTicks])

  const handleFiveMinuteTicksToggle = useCallback((enabled: boolean) => {
    setShowFiveMinuteTicks(enabled)
  }, [setShowFiveMinuteTicks])

  const isRunningOrPaused = state.status === 'running' || state.status === 'paused'
  const isPaused = state.status === 'paused'
  const isFinished = state.status === 'finished'

  return (
    <div className="min-h-full flex flex-col bg-paper text-ink">
      {/* PWA update prompt */}
      <ReloadPrompt />

      {/* Offline indicator */}
      <OfflineIndicator />

      {/* Burger Menu */}
      <BurgerMenu
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
        onSelectDuration={handlePresetSelect}
        selectedColor={selectedColor}
        onSelectColor={handleColorChange}
        showPastel={showPastel}
        onTogglePastel={handlePastelToggle}
        showMinuteTicks={showMinuteTicks}
        onToggleMinuteTicks={handleMinuteTicksToggle}
        showFiveMinuteTicks={showFiveMinuteTicks}
        onToggleFiveMinuteTicks={handleFiveMinuteTicksToggle}
      />

      {/* Top bar */}
      <header className="flex items-center justify-between h-14 md:h-16 px-4 md:px-7 border-b border-hairline">
        <div className="flex items-center gap-2.5">
          <DialMark color={selectedColor} />
          <h1 className="font-display text-[17px] md:text-lg font-semibold -tracking-[0.015em]">
            TempoKids
          </h1>
        </div>
        <button
          onClick={handleMenuToggle}
          className="w-11 h-11 flex items-center justify-center rounded-xl border border-hairline bg-surface text-ink-70 hover:bg-hairline/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-paper focus:ring-ink transition-colors"
          aria-label="Ouvrir le menu"
          aria-expanded={isMenuOpen}
          aria-controls="burger-menu"
        >
          <BurgerMenuIcon className="w-5 h-5" />
        </button>
      </header>

      {/* Main content */}
      <ErrorBoundary>
        <main className="flex-1 flex flex-col items-center px-4 md:px-6 min-h-0">
          {/* Duration Picker - hidden once the timer owns the screen */}
          {!isRunningOrPaused && !isFinished && (
            <div className="w-full max-w-md shrink-0 pt-5 md:pt-7 flex flex-col gap-3.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-45">
                Durée
              </span>
              <div className="rounded-[18px] border border-hairline bg-surface px-3 py-3.5 md:px-5 md:py-4">
                <DurationPicker
                  value={durationMinutes}
                  onChange={handleDurationChange}
                  disabled={isRunningOrPaused}
                />
              </div>
            </div>
          )}

          {/* Timer Display + readout, centered together as one group */}
          <div className="flex-1 flex flex-col items-center justify-center gap-7 md:gap-8 w-full max-w-md py-6 min-h-0">
            <TimerDisplay
              totalMinutes={durationMinutes}
              remainingSeconds={state.remainingTime}
              isPaused={isPaused}
              color={selectedColor}
              showPastel={showPastel}
              showMinuteTicks={showMinuteTicks}
              showFiveMinuteTicks={showFiveMinuteTicks}
            />

            {/* Time remaining display */}
            {isRunningOrPaused && (
              <div className="flex flex-col items-center gap-1.5">
                <p
                  className={`tabular font-display text-5xl md:text-6xl font-medium leading-none tracking-[0.01em] ${
                    isPaused ? 'text-ink-45' : 'text-ink'
                  }`}
                >
                  {formatTime(state.remainingTime)}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-45">
                  {isPaused ? 'en pause' : 'restant'}
                </p>
              </div>
            )}

            {/* Finished message */}
            {isFinished && (
              <p className="flex items-center gap-3 font-display text-4xl md:text-5xl font-semibold -tracking-[0.01em] text-success">
                <CheckIcon className="w-8 h-8 md:w-9 md:h-9" />
                Terminé !
              </p>
            )}
          </div>

        </main>
      </ErrorBoundary>

      {/* Action bar */}
      <footer className="border-t border-hairline bg-surface px-4 pt-3.5 pb-6 md:px-7 md:pb-7">
        <div className="mx-auto w-full max-w-md flex flex-col gap-2.5">
          <Controls
            status={state.status}
            onStart={actions.start}
            onPause={actions.pause}
            onResume={actions.resume}
            onReset={actions.reset}
            accentColor={selectedColor}
          />
          <p className="text-center text-[11px] font-medium text-ink-45">
            Max 4 heures par session
          </p>
        </div>
      </footer>
    </div>
  )
}

/**
 * Small dial glyph used as the wordmark, tinted with the selected accent.
 */
function DialMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] md:w-6 md:h-6" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="#B7AF9E" strokeWidth="1.4" />
      <path d="M 12 2.5 A 9.5 9.5 0 0 1 21.5 12" fill="none" stroke={color} strokeWidth="3" />
    </svg>
  )
}

export default App
