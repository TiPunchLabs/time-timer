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

/** LocalStorage key for color preference */
export const COLOR_STORAGE_KEY = 'tempokids_color'

/** Color palette for customization */
export const COLOR_PALETTE = [
  { name: 'Bleu', hex: '#2196F3' },
  { name: 'Rouge', hex: '#F44336' },
  { name: 'Vert', hex: '#4CAF50' },
  { name: 'Orange', hex: '#FF9800' },
  { name: 'Violet', hex: '#9C27B0' },
  { name: 'Rose', hex: '#E91E63' },
  { name: 'Turquoise', hex: '#00BCD4' },
  { name: 'Jaune', hex: '#FFC107' },
  { name: 'Indigo', hex: '#3F51B5' },
  { name: 'Teal', hex: '#009688' },
  { name: 'Lime', hex: '#8BC34A' },
  { name: 'Amber', hex: '#FF5722' },
] as const

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

/** Preset durations for quick selection */
export const PRESET_DURATIONS = [
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '1h15', minutes: 75 },
  { label: '1h30', minutes: 90 },
  { label: '2h', minutes: 120 },
  { label: '2h30', minutes: 150 },
] as const
