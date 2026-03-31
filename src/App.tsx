import { useState, useCallback } from 'react'
import { DurationPicker } from './components/DurationPicker'
import { TimerDisplay } from './components/TimerDisplay'
import { Controls } from './components/Controls'
import { ErrorBoundary } from './components/ErrorBoundary'
import { OfflineIndicator } from './components/OfflineIndicator'
import { TimerIcon, CheckIcon, BurgerMenuIcon } from './components/icons'
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
  const isFinished = state.status === 'finished'

  return (
    <div className="min-h-full flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
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

      {/* Header */}
      <header className="pt-4 pb-2 md:pt-6 md:pb-4">
        <div className="flex items-center justify-between px-4">
          {/* Empty spacer for centering */}
          <div className="w-10 h-10" aria-hidden="true" />
          <div className="flex items-center gap-2 md:gap-3">
            <TimerIcon />
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              TempoKids
            </h1>
          </div>
          <button
            onClick={handleMenuToggle}
            className="p-2 rounded-full hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Ouvrir le menu"
            aria-expanded={isMenuOpen}
            aria-controls="burger-menu"
          >
            <BurgerMenuIcon className="w-6 h-6 text-blue-500" />
          </button>
        </div>
        <p className="text-xs md:text-sm text-slate-500 font-medium text-center">Timer visuel pour enfants</p>
      </header>

      {/* Main content */}
      <ErrorBoundary>
        <main className="flex-1 flex flex-col items-center justify-center px-3 pb-4 md:px-4 md:pb-6">
          {/* Duration Picker - hidden when running */}
          {!isRunningOrPaused && !isFinished && (
            <div className="mb-4 md:mb-6 p-4 md:p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
              <DurationPicker
                value={durationMinutes}
                onChange={handleDurationChange}
                disabled={isRunningOrPaused}
                accentColor={selectedColor}
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
                color={selectedColor}
                showPastel={showPastel}
                showMinuteTicks={showMinuteTicks}
                showFiveMinuteTicks={showFiveMinuteTicks}
              />
            </div>
          </div>

          {/* Time remaining display */}
          {isRunningOrPaused && (
            <div className="mt-4 md:mt-6 px-6 py-3 md:px-8 md:py-4 bg-white rounded-xl md:rounded-2xl shadow-md border border-slate-100">
              <p
                className="text-3xl md:text-4xl font-mono font-bold tracking-wider"
                style={{ color: selectedColor }}
              >
                {formatTime(state.remainingTime)}
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
              accentColor={selectedColor}
            />
          </div>
        </main>
      </ErrorBoundary>

      {/* Footer */}
      <footer className="py-2 md:py-3 text-center">
        <p className="text-xs text-slate-400">
          Max 4 heures par session
        </p>
      </footer>
    </div>
  )
}

export default App
