/**
 * Timer status states
 */
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

/**
 * Main timer state
 */
export interface TimerState {
  /** Total duration configured in seconds */
  totalDuration: number
  /** Remaining time in seconds */
  remainingTime: number
  /** Current timer status */
  status: TimerStatus
  /** Timestamp when timer was started (for precise calculation) */
  startedAt: number | null
  /** Cumulative pause duration in milliseconds */
  pausedDuration: number
}

/**
 * Visual state of a clock circle
 */
export type ClockCircleState = 'full' | 'partial' | 'empty'

/**
 * Data for rendering a single clock circle
 */
export interface ClockCircleData {
  /** Position in sequence (0 = first circle) */
  index: number
  /** Minutes displayed on this circle (0-60) */
  minutes: number
  /** Visual state of the circle */
  state: ClockCircleState
  /** Fill percentage (0-1) */
  fillPercentage: number
  /** Maximum fill percentage this circle can have (0-1) - used for clockwise drain */
  maxFillPercentage: number
  /** Is this the circle currently draining */
  isActive: boolean
}

/**
 * Persisted state for localStorage
 */
export interface PersistedState {
  /** Total duration in seconds */
  totalDuration: number
  /** Remaining time at save time */
  remainingTime: number
  /** Status at save time */
  status: TimerStatus
  /** Timestamp of last save */
  savedAt: number
}

/**
 * Timer actions for the hook
 */
export interface TimerActions {
  /** Set the total duration in minutes */
  setDuration: (minutes: number) => void
  /** Start the timer */
  start: () => void
  /** Pause the timer */
  pause: () => void
  /** Resume the timer */
  resume: () => void
  /** Reset the timer */
  reset: () => void
}
