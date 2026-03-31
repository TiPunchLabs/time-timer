import { useState, useCallback, useEffect, useRef } from 'react'
import { fromMinutes, toMinutes } from '../../utils/time'
import { MAX_HOURS, MAX_DURATION_MINUTES, MIN_DURATION_MINUTES, TIMER_BLUE } from '../../constants/design'

interface DurationPickerProps {
  value: number // in minutes
  onChange: (minutes: number) => void
  disabled?: boolean
  /** Custom accent color */
  accentColor?: string
}

export function DurationPicker({ value, onChange, disabled = false, accentColor = TIMER_BLUE }: DurationPickerProps) {
  const { hours: initialHours, minutes: initialMinutes } = fromMinutes(value)
  const [hours, setHours] = useState(initialHours)
  const [minutes, setMinutes] = useState(initialMinutes)

  // Keep refs in sync for use in intervals
  const hoursRef = useRef(hours)
  const minutesRef = useRef(minutes)
  hoursRef.current = hours
  minutesRef.current = minutes

  // Sync with external value
  useEffect(() => {
    const { hours: h, minutes: m } = fromMinutes(value)
    setHours(h)
    setMinutes(m)
  }, [value])

  const handleHoursChange = useCallback((newHours: number) => {
    const clampedHours = Math.max(0, Math.min(MAX_HOURS, newHours))
    setHours(clampedHours)
    const totalMinutes = toMinutes(clampedHours, minutesRef.current)
    if (totalMinutes >= MIN_DURATION_MINUTES && totalMinutes <= MAX_DURATION_MINUTES) {
      onChange(totalMinutes)
    }
  }, [onChange])

  const handleMinutesChange = useCallback((newMinutes: number) => {
    const clampedMinutes = Math.max(0, Math.min(59, newMinutes))
    setMinutes(clampedMinutes)
    const totalMinutes = toMinutes(hoursRef.current, clampedMinutes)
    if (totalMinutes >= MIN_DURATION_MINUTES && totalMinutes <= MAX_DURATION_MINUTES) {
      onChange(totalMinutes)
    }
  }, [onChange])

  const incrementHours = useCallback(() => {
    handleHoursChange(hoursRef.current + 1)
  }, [handleHoursChange])

  const decrementHours = useCallback(() => {
    handleHoursChange(hoursRef.current - 1)
  }, [handleHoursChange])

  const incrementMinutes = useCallback(() => {
    const h = hoursRef.current
    const m = minutesRef.current
    if (m === 59 && h < MAX_HOURS) {
      const newHours = h + 1
      setHours(newHours)
      setMinutes(0)
      const total = toMinutes(newHours, 0)
      if (total >= MIN_DURATION_MINUTES && total <= MAX_DURATION_MINUTES) {
        onChange(total)
      }
    } else {
      handleMinutesChange(m + 1)
    }
  }, [onChange, handleMinutesChange])

  const decrementMinutes = useCallback(() => {
    const h = hoursRef.current
    const m = minutesRef.current
    if (m === 0 && h > 0) {
      const newHours = h - 1
      setHours(newHours)
      setMinutes(59)
      const total = toMinutes(newHours, 59)
      if (total >= MIN_DURATION_MINUTES && total <= MAX_DURATION_MINUTES) {
        onChange(total)
      }
    } else {
      handleMinutesChange(m - 1)
    }
  }, [onChange, handleMinutesChange])

  // Press-and-hold repeat logic
  const repeatRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopRepeat = useCallback(() => {
    if (repeatRef.current) clearTimeout(repeatRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
    repeatRef.current = null
    intervalRef.current = null
  }, [])

  const startRepeat = useCallback((action: () => void) => {
    stopRepeat()
    repeatRef.current = setTimeout(() => {
      intervalRef.current = setInterval(action, 80)
    }, 400)
  }, [stopRepeat])

  useEffect(() => stopRepeat, [stopRepeat])

  const holdProps = (action: () => void) => ({
    onMouseDown: () => startRepeat(action),
    onMouseUp: stopRepeat,
    onMouseLeave: stopRepeat,
    onTouchStart: () => startRepeat(action),
    onTouchEnd: stopRepeat,
  })

  const buttonClass = `
    w-10 h-10 md:w-14 md:h-14
    flex items-center justify-center
    rounded-lg md:rounded-xl
    transition-all duration-150
    active:scale-95
    disabled:opacity-30 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
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
          {...holdProps(incrementHours)}
        >
          <ChevronUpIcon />
        </button>
        <div
          className="text-4xl md:text-5xl font-bold w-14 md:w-16 text-center py-1"
          style={{ color: accentColor }}
        >
          {hours}
        </div>
        <button
          type="button"
          onClick={decrementHours}
          disabled={disabled || (hours === 0 && minutes <= MIN_DURATION_MINUTES)}
          className={activeButtonClass}
          aria-label="Diminuer les heures"
          {...holdProps(decrementHours)}
        >
          <ChevronDownIcon />
        </button>
        <span className="text-xs font-medium text-slate-500">heures</span>
      </div>

      {/* Separator - aligned with number display */}
      <div className="flex flex-col items-center gap-1">
        {/* Spacer for top button height */}
        <div className="h-10 md:h-14" aria-hidden="true" />
        <span
          className="text-4xl md:text-5xl font-bold py-1"
          style={{ color: accentColor }}
        >
          :
        </span>
        {/* Spacer for bottom button height */}
        <div className="h-10 md:h-14" aria-hidden="true" />
        {/* Spacer for label height */}
        <div className="h-4" aria-hidden="true" />
      </div>

      {/* Minutes */}
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={incrementMinutes}
          disabled={disabled || (hours >= MAX_HOURS && minutes === 0)}
          className={activeButtonClass}
          aria-label="Augmenter les minutes"
          {...holdProps(incrementMinutes)}
        >
          <ChevronUpIcon />
        </button>
        <div
          className="text-4xl md:text-5xl font-bold w-14 md:w-16 text-center py-1"
          style={{ color: accentColor }}
        >
          {minutes.toString().padStart(2, '0')}
        </div>
        <button
          type="button"
          onClick={decrementMinutes}
          disabled={disabled || (hours === 0 && (minutes - 1) < MIN_DURATION_MINUTES)}
          className={activeButtonClass}
          aria-label="Diminuer les minutes"
          {...holdProps(decrementMinutes)}
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
