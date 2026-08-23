import { useState, useCallback, useEffect } from 'react'
import { fromMinutes, toMinutes } from '../../utils/time'
import { MAX_HOURS, MAX_DURATION_MINUTES, MIN_DURATION_MINUTES } from '../../constants/design'

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

  const incrementMinutes = () => {
    // Rollover: at 59 minutes, add 1 hour and reset minutes to 0
    if (minutes === 59 && hours < MAX_HOURS) {
      const newHours = hours + 1
      const newMinutes = 0
      setHours(newHours)
      setMinutes(newMinutes)
      const totalMinutes = toMinutes(newHours, newMinutes)
      if (totalMinutes >= MIN_DURATION_MINUTES && totalMinutes <= MAX_DURATION_MINUTES) {
        onChange(totalMinutes)
      }
    } else {
      handleMinutesChange(minutes + 1)
    }
  }

  const decrementMinutes = () => {
    // Rollover: at 0 minutes with hours > 0, subtract 1 hour and set minutes to 59
    if (minutes === 0 && hours > 0) {
      const newHours = hours - 1
      const newMinutes = 59
      setHours(newHours)
      setMinutes(newMinutes)
      const totalMinutes = toMinutes(newHours, newMinutes)
      if (totalMinutes >= MIN_DURATION_MINUTES && totalMinutes <= MAX_DURATION_MINUTES) {
        onChange(totalMinutes)
      }
    } else {
      handleMinutesChange(minutes - 1)
    }
  }

  const stepperButtonClass = `
    w-11 h-11 md:w-12 md:h-12
    flex items-center justify-center
    rounded-full
    border border-hairline bg-paper text-ink-70
    transition-colors duration-150
    hover:bg-hairline/40 active:bg-hairline/70
    disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-paper
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-ink
  `

  return (
    <div className="flex items-end justify-center gap-1 md:gap-3 select-none">
      {/* Hours */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={decrementHours}
            disabled={disabled || (hours === 0 && minutes <= MIN_DURATION_MINUTES)}
            className={stepperButtonClass}
            aria-label="Diminuer les heures"
          >
            <MinusIcon />
          </button>
          <span
            className="tabular font-display text-4xl md:text-5xl font-medium leading-none w-11 md:w-14 text-center text-ink"
          >
            {hours}
          </span>
          <button
            type="button"
            onClick={incrementHours}
            disabled={disabled || hours >= MAX_HOURS}
            className={stepperButtonClass}
            aria-label="Augmenter les heures"
          >
            <PlusIcon />
          </button>
        </div>
        <span className="text-[11px] font-medium tracking-wide text-ink-45">heures</span>
      </div>

      {/* Separator - aligned with the number row */}
      <span
        className="font-display text-2xl md:text-3xl text-hairline-strong leading-none pb-[26px] md:pb-[30px]"
        aria-hidden="true"
      >
        :
      </span>

      {/* Minutes */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={decrementMinutes}
            disabled={disabled || (hours === 0 && (minutes - 1) < MIN_DURATION_MINUTES)}
            className={stepperButtonClass}
            aria-label="Diminuer les minutes"
          >
            <MinusIcon />
          </button>
          <span
            className="tabular font-display text-4xl md:text-5xl font-medium leading-none w-16 md:w-20 text-center text-ink"
          >
            {minutes.toString().padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={incrementMinutes}
            disabled={disabled || (hours >= MAX_HOURS && minutes === 0)}
            className={stepperButtonClass}
            aria-label="Augmenter les minutes"
          >
            <PlusIcon />
          </button>
        </div>
        <span className="text-[11px] font-medium tracking-wide text-ink-45">minutes</span>
      </div>
    </div>
  )
}

function MinusIcon() {
  return (
    <svg
      className="w-4 h-4 md:w-5 md:h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeWidth={2.4} d="M6 12h12" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      className="w-4 h-4 md:w-5 md:h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeWidth={2.4} d="M12 6v12M6 12h12" />
    </svg>
  )
}
