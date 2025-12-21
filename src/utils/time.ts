import type { ClockCircleData } from '../types/timer'
import { MINUTES_PER_CIRCLE } from '../constants/design'

/**
 * Get the number of circles needed to display the given duration
 * @param totalMinutes - Total duration in minutes
 * @returns Number of circles (rounded up to nearest hour)
 */
export function getCircleCount(totalMinutes: number): number {
  if (totalMinutes <= 0) return 0
  return Math.ceil(totalMinutes / MINUTES_PER_CIRCLE)
}

/**
 * Format seconds to mm:ss or hh:mm:ss
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  if (seconds < 0) seconds = 0

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Convert hours and minutes to total minutes
 * @param hours - Hours
 * @param minutes - Minutes
 * @returns Total minutes
 */
export function toMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes
}

/**
 * Convert minutes to hours and minutes
 * @param totalMinutes - Total minutes
 * @returns Object with hours and minutes
 */
export function fromMinutes(totalMinutes: number): { hours: number; minutes: number } {
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  }
}

/**
 * Get data for all circles based on total and remaining time
 * @param totalMinutes - Total configured duration in minutes
 * @param remainingSeconds - Remaining time in seconds
 * @returns Array of ClockCircleData
 *
 * DISPLAY ORDER: Full circles first, partial circle last
 * DRAIN ORDER: First circle (index 0) drains first, partial drains last
 */
export function getCirclesData(
  totalMinutes: number,
  remainingSeconds: number
): ClockCircleData[] {
  const circleCount = getCircleCount(totalMinutes)
  if (circleCount === 0) return []

  const remainingMinutes = remainingSeconds / 60
  const circles: ClockCircleData[] = []

  for (let i = 0; i < circleCount; i++) {
    // Circle i represents the time range from i*60 to min((i+1)*60, totalMinutes)
    const circleStart = i * MINUTES_PER_CIRCLE

    // How many minutes this circle represents at max (last circle may be partial)
    const circleMaxMinutes = Math.min(
      MINUTES_PER_CIRCLE,
      totalMinutes - circleStart
    )

    // Maximum fill percentage for this circle (based on initial configuration)
    const maxFillPercentage = circleMaxMinutes / MINUTES_PER_CIRCLE

    // Threshold: when remaining time is at or below this, the circle is fully drained
    const drainedThreshold = totalMinutes - circleStart - circleMaxMinutes

    // Threshold: when remaining time is at or above this, the circle is full
    const fullThreshold = totalMinutes - circleStart

    let state: ClockCircleData['state']
    let fillPercentage: number
    let minutes: number
    let isActive = false

    if (remainingMinutes <= drainedThreshold) {
      // This circle is completely empty (all its time has passed)
      state = 'empty'
      fillPercentage = 0
      minutes = 0
    } else if (remainingMinutes >= fullThreshold) {
      // This circle is full (or at its max if partial from initial config)
      state = circleMaxMinutes === MINUTES_PER_CIRCLE ? 'full' : 'partial'
      fillPercentage = circleMaxMinutes / MINUTES_PER_CIRCLE
      minutes = circleMaxMinutes
    } else {
      // This circle is actively draining
      state = 'partial'
      minutes = remainingMinutes - drainedThreshold
      fillPercentage = minutes / MINUTES_PER_CIRCLE
      isActive = true
    }

    circles.push({
      index: i,
      minutes,
      state,
      fillPercentage,
      maxFillPercentage,
      isActive,
    })
  }

  return circles
}
