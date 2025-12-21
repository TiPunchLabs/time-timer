import { CIRCLE_RADIUS } from '../constants/design'

/**
 * Calculate the circumference of a circle
 * @param radius - Circle radius
 * @returns Circumference
 */
export function getCircumference(radius: number = CIRCLE_RADIUS): number {
  return 2 * Math.PI * radius
}

/**
 * Calculate stroke-dashoffset for a given fill percentage
 * The fill starts at 12 o'clock and moves clockwise
 * @param percentage - Fill percentage (0-1)
 * @param radius - Circle radius
 * @returns Stroke dashoffset value
 */
export function calculateDashOffset(
  percentage: number,
  radius: number = CIRCLE_RADIUS
): number {
  const circumference = getCircumference(radius)
  // Offset is the unfilled portion
  return circumference * (1 - percentage)
}

/**
 * Get the stroke-dasharray value for a circle
 * @param radius - Circle radius
 * @returns Dasharray value (same as circumference for full coverage)
 */
export function getDashArray(radius: number = CIRCLE_RADIUS): number {
  return getCircumference(radius)
}

/**
 * Calculate the stroke-dasharray for clockwise fill from 12h
 * With transform "rotate(90deg) scaleX(-1)":
 * - scaleX(-1): flips stroke start from 3h to 9h, direction becomes CW
 * - rotate(90deg): moves start from 9h to 12h
 * - Result: stroke starts at 12h, goes clockwise
 *
 * @param percentage - Fill percentage (0-1)
 * @param radius - Circle radius
 * @returns Dasharray string "dashLength gapLength"
 */
export function getClockwiseDashArray(
  percentage: number,
  radius: number = CIRCLE_RADIUS
): string {
  const circumference = getCircumference(radius)
  const dashLength = percentage * circumference
  const gapLength = circumference - dashLength
  return `${dashLength} ${gapLength}`
}

/**
 * Convert minutes to degrees for arc calculation
 * 60 minutes = 360 degrees, starting from top (12 o'clock)
 * @param minutes - Minutes (0-60)
 * @returns Degrees (0-360)
 */
export function minutesToDegrees(minutes: number): number {
  return (minutes / 60) * 360
}

/**
 * Get SVG rotation to start from 12 o'clock
 * SVG circles start at 3 o'clock, so we rotate -90 degrees
 */
export const SVG_ROTATION = -90

/**
 * Calculate the viewBox center coordinates
 * @param size - ViewBox size
 * @returns Center x and y
 */
export function getViewBoxCenter(size: number): { cx: number; cy: number } {
  return {
    cx: size / 2,
    cy: size / 2,
  }
}
