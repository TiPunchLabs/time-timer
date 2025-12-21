/**
 * Design constants for TempoKids
 */

/** Timer blue color (TempoKids default) */
export const TIMER_BLUE = '#2196F3'

/** Empty circle gray */
export const TIMER_GRAY = '#E0E0E0'

/** Circle stroke color */
export const STROKE_COLOR = '#333333'

/** Background color */
export const BACKGROUND_COLOR = '#FFFFFF'

/** Default circle radius */
export const CIRCLE_RADIUS = 45

/** Circle stroke width for the fill */
export const FILL_STROKE_WIDTH = 8

/** Circle border stroke width */
export const BORDER_STROKE_WIDTH = 2

/** Maximum duration in hours */
export const MAX_HOURS = 4

/** Maximum duration in minutes */
export const MAX_DURATION_MINUTES = MAX_HOURS * 60

/** Minimum duration in minutes */
export const MIN_DURATION_MINUTES = 1

/** Minutes per circle */
export const MINUTES_PER_CIRCLE = 60

/** LocalStorage key for timer state */
export const STORAGE_KEY = 'tempokids_timer_state'

/** Update interval for timer (ms) */
export const TIMER_UPDATE_INTERVAL = 100

/** Circle sizes for responsive design (optimized for max 4 circles on mobile/tablet) */
export const CIRCLE_SIZES = {
  /** 1 circle - full width */
  xl: 220,
  /** 2 circles - side by side */
  lg: 160,
  /** 3-4 circles - 2x2 grid */
  md: 135,
} as const
