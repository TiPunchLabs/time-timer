import { useState, useCallback, useEffect } from 'react'
import { fromMinutes, toMinutes } from '../../utils/time'
import { MAX_HOURS, MAX_DURATION_MINUTES, MIN_DURATION_MINUTES, TIMER_RED } from '../../constants/design'

interface DurationPickerProps {
  value: number // in minutes
  onChange: (minutes: number) => void
  disabled?: boolean
}

export function DurationPicker({ value, onChange, disabled = false }: DurationPickerProps) {
  const { hours: initialHours, minutes: initialMinutes } = fromMinutes(value)
  const [hours, setHours] = useState(initialHours)
  const [minutes, setMinutes] = useState(initialMinutes)

  // Sync with external value
  useEffect(() => {
    const { hours: h, minutes: m } = fromMinutes(value)
    setHours(h)
    setMinutes(m)
  }, [value])

  const handleHoursChange = useCallback((newHours: number) => {
    const clampedHours = Math.max(0, Math.min(MAX_HOURS, newHours))
    setHours(clampedHours)
    const totalMinutes = toMinutes(clampedHours, minutes)
    if (totalMinutes >= MIN_DURATION_MINUTES && totalMinutes <= MAX_DURATION_MINUTES) {
      onChange(totalMinutes)
    }
  }, [minutes, onChange])

  const handleMinutesChange = useCallback((newMinutes: number) => {
    const clampedMinutes = Math.max(0, Math.min(59, newMinutes))
    setMinutes(clampedMinutes)
    const totalMinutes = toMinutes(hours, clampedMinutes)
    if (totalMinutes >= MIN_DURATION_MINUTES && totalMinutes <= MAX_DURATION_MINUTES) {
      onChange(totalMinutes)
    }
  }, [hours, onChange])

  const incrementHours = () => handleHoursChange(hours + 1)
  const decrementHours = () => handleHoursChange(hours - 1)
  const incrementMinutes = () => handleMinutesChange(minutes + 5)
  const decrementMinutes = () => handleMinutesChange(minutes - 5)

  const buttonClass = `
    w-10 h-10 md:w-14 md:h-14
    flex items-center justify-center
    rounded-lg md:rounded-xl
    transition-all duration-150
    active:scale-95
    disabled:opacity-30 disabled:cursor-not-allowed
  `

  const activeButtonClass = `${buttonClass} bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300`

  return (
    <div className="flex items-center gap-4 md:gap-6 select-none">
      {/* Hours */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={incrementHours}
          disabled={disabled || hours >= MAX_HOURS}
          className={activeButtonClass}
          aria-label="Augmenter les heures"
        >
          <ChevronUpIcon />
        </button>
        <div
          className="text-4xl md:text-5xl font-bold w-14 md:w-16 text-center py-1"
          style={{ color: TIMER_RED }}
        >
          {hours}
        </div>
        <button
          type="button"
          onClick={decrementHours}
          disabled={disabled || (hours === 0 && minutes <= MIN_DURATION_MINUTES)}
          className={activeButtonClass}
          aria-label="Diminuer les heures"
        >
          <ChevronDownIcon />
        </button>
        <span className="text-xs font-medium text-slate-500">heures</span>
      </div>

      {/* Separator */}
      <span
        className="text-4xl md:text-5xl font-bold"
        style={{ color: TIMER_RED }}
      >
        :
      </span>

      {/* Minutes */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={incrementMinutes}
          disabled={disabled || toMinutes(hours, minutes + 5) > MAX_DURATION_MINUTES}
          className={activeButtonClass}
          aria-label="Augmenter les minutes"
        >
          <ChevronUpIcon />
        </button>
        <div
          className="text-4xl md:text-5xl font-bold w-14 md:w-16 text-center py-1"
          style={{ color: TIMER_RED }}
        >
          {minutes.toString().padStart(2, '0')}
        </div>
        <button
          type="button"
          onClick={decrementMinutes}
          disabled={disabled || toMinutes(hours, minutes - 5) < MIN_DURATION_MINUTES}
          className={activeButtonClass}
          aria-label="Diminuer les minutes"
        >
          <ChevronDownIcon />
        </button>
        <span className="text-xs font-medium text-slate-500">minutes</span>
      </div>
    </div>
  )
}

function ChevronUpIcon() {
  return (
    <svg
      className="w-6 h-6 md:w-7 md:h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M5 15l7-7 7 7"
      />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      className="w-6 h-6 md:w-7 md:h-7"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  )
}
