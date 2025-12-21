import { useMemo } from 'react'
import {
  TIMER_BLUE,
  CIRCLE_RADIUS,
} from '../../constants/design'

/** Stroke width for the outer colored arc */
const OUTER_STROKE_WIDTH = 4

/** Stroke width for the inner pastel track */
const INNER_STROKE_WIDTH = 8

/**
 * Convert hex color to a lighter version (pastel)
 * @param hex - Hex color string (e.g., '#2196F3')
 * @param opacity - Opacity value (0-1), default 0.25
 */
function getLightColor(hex: string, opacity: number = 0.25): string {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

interface ClockCircleProps {
  /** Fill percentage (0-1) - current fill level */
  fillPercentage: number
  /** Maximum fill percentage (0-1) - initial/max fill for this circle */
  maxFillPercentage?: number
  /** Size of the circle in pixels */
  size?: number
  /** Whether this circle is actively draining */
  isActive?: boolean
  /** Whether the timer is paused */
  isPaused?: boolean
  /** Whether this circle is empty */
  isEmpty?: boolean
  /** Custom fill color (defaults to TIMER_BLUE) */
  color?: string
}

/**
 * Calculate the point on a circle at a given angle
 * Angle 0 = 12h (top), going clockwise
 * @param cx - Center x
 * @param cy - Center y
 * @param r - Radius
 * @param percentage - 0 to 1 (0 = 12h, 0.25 = 3h, 0.5 = 6h, 0.75 = 9h)
 */
function getPointOnCircle(cx: number, cy: number, r: number, percentage: number) {
  const angle = percentage * 2 * Math.PI
  return {
    x: cx + r * Math.sin(angle),
    y: cy - r * Math.cos(angle),
  }
}

/**
 * Create SVG arc path for clockwise drain
 * Arc goes from startPercentage to endPercentage in clockwise direction
 * @param cx - Center x
 * @param cy - Center y
 * @param r - Radius
 * @param startPercentage - Start position (0-1)
 * @param endPercentage - End position (0-1)
 */
function createClockwiseArcPath(
  cx: number,
  cy: number,
  r: number,
  startPercentage: number,
  endPercentage: number
): string {
  // Normalize percentages
  const arcLength = endPercentage - startPercentage

  if (arcLength <= 0) return ''

  if (arcLength >= 1) {
    // Full circle: use two arcs
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`
  }

  const start = getPointOnCircle(cx, cy, r, startPercentage)
  const end = getPointOnCircle(cx, cy, r, endPercentage)

  // large-arc-flag: 1 if arc > 180°, else 0
  const largeArcFlag = arcLength > 0.5 ? 1 : 0
  // sweep-flag: 1 for clockwise
  const sweepFlag = 1

  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`
}

export function ClockCircle({
  fillPercentage,
  maxFillPercentage = 1,
  size = 100,
  isActive = false,
  isPaused = false,
  isEmpty = false,
  color = TIMER_BLUE,
}: ClockCircleProps) {
  const viewBoxSize = 100
  const center = viewBoxSize / 2
  const radius = CIRCLE_RADIUS

  // Arc for clockwise drain:
  // - Start at position where the "drained" portion ends
  // - End at the max fill position
  // This way, as fillPercentage decreases, the start moves clockwise (drain from 12h)
  const arcPath = useMemo(() => {
    const drainedPercentage = maxFillPercentage - fillPercentage
    return createClockwiseArcPath(center, center, radius, drainedPercentage, maxFillPercentage)
  }, [center, radius, fillPercentage, maxFillPercentage])

  const fillColor = isEmpty ? 'transparent' : color
  const lightColor = getLightColor(color, 0.2)
  const pauseClass = isPaused && isActive ? 'animate-pause' : ''

  // Inner radius for pastel track (smaller)
  const innerRadius = radius - 6

  // Inner arc path (same behavior, smaller radius)
  const innerArcPath = useMemo(() => {
    const drainedPercentage = maxFillPercentage - fillPercentage
    return createClockwiseArcPath(center, center, innerRadius, drainedPercentage, maxFillPercentage)
  }, [center, innerRadius, fillPercentage, maxFillPercentage])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className={`${pauseClass} transition-opacity drop-shadow-lg`}
      role="img"
      aria-label={`Cercle ${isEmpty ? 'vide' : `rempli à ${Math.round(fillPercentage * 100)}%`}`}
    >
      {/* Inner arc (light/pastel version - inside, same drain behavior) */}
      {!isEmpty && fillPercentage > 0 && (
        <path
          d={innerArcPath}
          fill="none"
          stroke={lightColor}
          strokeWidth={INNER_STROKE_WIDTH}
          strokeLinecap="round"
        />
      )}

      {/* Outer arc (full color - outside) */}
      {!isEmpty && fillPercentage > 0 && (
        <path
          d={arcPath}
          fill="none"
          stroke={fillColor}
          strokeWidth={OUTER_STROKE_WIDTH}
          strokeLinecap="round"
          className="clock-circle-fill"
        />
      )}
    </svg>
  )
}
