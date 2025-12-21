import { describe, it, expect } from 'vitest'
import {
  getCircumference,
  calculateDashOffset,
  getDashArray,
  getClockwiseDashArray,
  minutesToDegrees,
  getViewBoxCenter,
} from '../../src/utils/svg'
import { CIRCLE_RADIUS } from '../../src/constants/design'

describe('getCircumference', () => {
  it('calculates circumference with default radius', () => {
    const expected = 2 * Math.PI * CIRCLE_RADIUS
    expect(getCircumference()).toBeCloseTo(expected, 5)
  })

  it('calculates circumference with custom radius', () => {
    const radius = 50
    const expected = 2 * Math.PI * radius
    expect(getCircumference(radius)).toBeCloseTo(expected, 5)
  })
})

describe('calculateDashOffset', () => {
  it('returns full circumference for 0% fill', () => {
    const circumference = getCircumference()
    expect(calculateDashOffset(0)).toBeCloseTo(circumference, 5)
  })

  it('returns 0 for 100% fill', () => {
    expect(calculateDashOffset(1)).toBeCloseTo(0, 5)
  })

  it('returns half circumference for 50% fill', () => {
    const circumference = getCircumference()
    expect(calculateDashOffset(0.5)).toBeCloseTo(circumference / 2, 5)
  })

  it('returns 75% circumference for 25% fill', () => {
    const circumference = getCircumference()
    expect(calculateDashOffset(0.25)).toBeCloseTo(circumference * 0.75, 5)
  })
})

describe('getDashArray', () => {
  it('returns circumference value', () => {
    const circumference = getCircumference()
    expect(getDashArray()).toBeCloseTo(circumference, 5)
  })
})

describe('minutesToDegrees', () => {
  it('converts 0 minutes to 0 degrees', () => {
    expect(minutesToDegrees(0)).toBe(0)
  })

  it('converts 15 minutes to 90 degrees', () => {
    expect(minutesToDegrees(15)).toBe(90)
  })

  it('converts 30 minutes to 180 degrees', () => {
    expect(minutesToDegrees(30)).toBe(180)
  })

  it('converts 60 minutes to 360 degrees', () => {
    expect(minutesToDegrees(60)).toBe(360)
  })
})

describe('getViewBoxCenter', () => {
  it('calculates center for 100x100 viewBox', () => {
    expect(getViewBoxCenter(100)).toEqual({ cx: 50, cy: 50 })
  })

  it('calculates center for 200x200 viewBox', () => {
    expect(getViewBoxCenter(200)).toEqual({ cx: 100, cy: 100 })
  })
})

describe('getClockwiseDashArray', () => {
  it('returns full dash for 100% fill', () => {
    const circumference = getCircumference()
    const result = getClockwiseDashArray(1)
    // Pattern: "dashLength gapLength" with full dash and no gap
    expect(result).toBe(`${circumference} 0`)
  })

  it('returns no dash for 0% fill', () => {
    const circumference = getCircumference()
    const result = getClockwiseDashArray(0)
    // Pattern: "dashLength gapLength" with no dash and full gap
    expect(result).toBe(`0 ${circumference}`)
  })

  it('returns half dash half gap for 50% fill', () => {
    const circumference = getCircumference()
    const halfCirc = circumference / 2
    const result = getClockwiseDashArray(0.5)
    // Pattern: "dashLength gapLength" with half each
    expect(result).toBe(`${halfCirc} ${halfCirc}`)
  })

  it('returns quarter dash for 25% fill', () => {
    const circumference = getCircumference()
    const quarter = circumference * 0.25
    const threeQuarters = circumference * 0.75
    const result = getClockwiseDashArray(0.25)
    // Pattern: "dashLength gapLength" with 1/4 dash and 3/4 gap
    expect(result).toBe(`${quarter} ${threeQuarters}`)
  })
})
