import { describe, it, expect } from 'vitest'
import {
  getCircleCount,
  formatTime,
  toMinutes,
  fromMinutes,
  getCirclesData,
} from '../../src/utils/time'

describe('getCircleCount', () => {
  it('returns 0 for 0 minutes', () => {
    expect(getCircleCount(0)).toBe(0)
  })

  it('returns 0 for negative minutes', () => {
    expect(getCircleCount(-10)).toBe(0)
  })

  it('returns 1 for 1-60 minutes', () => {
    expect(getCircleCount(1)).toBe(1)
    expect(getCircleCount(30)).toBe(1)
    expect(getCircleCount(60)).toBe(1)
  })

  it('returns 2 for 61-120 minutes', () => {
    expect(getCircleCount(61)).toBe(2)
    expect(getCircleCount(90)).toBe(2)
    expect(getCircleCount(120)).toBe(2)
  })

  it('returns 3 for 2h30 (150 minutes)', () => {
    expect(getCircleCount(150)).toBe(3)
  })

  it('returns 4 for 4 hours (240 minutes) - max supported', () => {
    expect(getCircleCount(240)).toBe(4)
  })
})

describe('formatTime', () => {
  it('formats seconds only', () => {
    expect(formatTime(45)).toBe('0:45')
  })

  it('formats minutes and seconds', () => {
    expect(formatTime(125)).toBe('2:05')
    expect(formatTime(600)).toBe('10:00')
  })

  it('formats hours, minutes, and seconds', () => {
    expect(formatTime(3661)).toBe('1:01:01')
    expect(formatTime(7200)).toBe('2:00:00')
  })

  it('handles 0 seconds', () => {
    expect(formatTime(0)).toBe('0:00')
  })

  it('handles negative seconds as 0', () => {
    expect(formatTime(-10)).toBe('0:00')
  })
})

describe('toMinutes', () => {
  it('converts hours and minutes to total minutes', () => {
    expect(toMinutes(0, 30)).toBe(30)
    expect(toMinutes(1, 0)).toBe(60)
    expect(toMinutes(1, 30)).toBe(90)
    expect(toMinutes(2, 45)).toBe(165)
  })
})

describe('fromMinutes', () => {
  it('converts total minutes to hours and minutes', () => {
    expect(fromMinutes(30)).toEqual({ hours: 0, minutes: 30 })
    expect(fromMinutes(60)).toEqual({ hours: 1, minutes: 0 })
    expect(fromMinutes(90)).toEqual({ hours: 1, minutes: 30 })
    expect(fromMinutes(150)).toEqual({ hours: 2, minutes: 30 })
  })
})

describe('getCirclesData', () => {
  it('returns empty array for 0 minutes', () => {
    expect(getCirclesData(0, 0)).toEqual([])
  })

  it('returns one full circle for 60 minutes remaining', () => {
    const circles = getCirclesData(60, 3600) // 60 min total, 60 min remaining
    expect(circles).toHaveLength(1)
    expect(circles[0]).toMatchObject({
      index: 0,
      minutes: 60,
      state: 'full',
      fillPercentage: 1,
      maxFillPercentage: 1,
      isActive: false,
    })
  })

  it('returns one partial circle for 30 minutes', () => {
    const circles = getCirclesData(30, 1800) // 30 min total, 30 min remaining
    expect(circles).toHaveLength(1)
    expect(circles[0]).toMatchObject({
      index: 0,
      minutes: 30,
      state: 'partial',
      fillPercentage: 0.5,
      maxFillPercentage: 0.5, // Partial circle has max fill at 50%
      isActive: false,
    })
  })

  it('maxFillPercentage tracks initial fill for clockwise drain', () => {
    // 45 min timer - partial circle at 75%
    const circles = getCirclesData(45, 2700) // 45 min total, 45 min remaining
    expect(circles).toHaveLength(1)
    expect(circles[0]?.maxFillPercentage).toBe(0.75) // 45/60 = 0.75
    expect(circles[0]?.fillPercentage).toBe(0.75)

    // After 15 min (30 min remaining)
    const circlesAfter = getCirclesData(45, 1800) // 45 min total, 30 min remaining
    expect(circlesAfter[0]?.maxFillPercentage).toBe(0.75) // Still 75% max
    expect(circlesAfter[0]?.fillPercentage).toBe(0.5) // 30/60 = 0.5
  })

  it('returns correct circles for 2h30 with 1h45 remaining', () => {
    const circles = getCirclesData(150, 6300) // 150 min total, 105 min remaining
    expect(circles).toHaveLength(3)

    // CORRECT ORDER: Full circles first, partial last
    // Circle 0 (0-60 min): actively draining, 15 min left (105-90=15)
    // Circle 1 (60-120 min): full
    // Circle 2 (120-150 min): partial at max (30 min)
    expect(circles[0]?.state).toBe('partial')
    expect(circles[0]?.fillPercentage).toBeCloseTo(0.25, 2) // 15/60 = 0.25
    expect(circles[0]?.isActive).toBe(true)

    expect(circles[1]?.state).toBe('full')
    expect(circles[1]?.fillPercentage).toBe(1)
    expect(circles[1]?.isActive).toBe(false)

    expect(circles[2]?.state).toBe('partial') // Initial partial state
    expect(circles[2]?.fillPercentage).toBe(0.5) // 30/60 = 0.5
    expect(circles[2]?.isActive).toBe(false)
  })

  it('marks the active draining circle correctly', () => {
    const circles = getCirclesData(120, 4500) // 120 min total, 75 min remaining
    expect(circles).toHaveLength(2)

    // With 75 min remaining (120 total), 45 min elapsed:
    // Circle 0 (0-60 min): actively draining, 15 min left (75-60=15)
    // Circle 1 (60-120 min): full
    expect(circles[0]?.isActive).toBe(true)  // First circle is draining
    expect(circles[0]?.fillPercentage).toBeCloseTo(0.25, 2) // 15/60 = 0.25
    expect(circles[1]?.isActive).toBe(false) // Second circle is still full
    expect(circles[1]?.fillPercentage).toBe(1)
  })

  it('all circles empty when time is up', () => {
    const circles = getCirclesData(120, 0) // 120 min total, 0 remaining
    expect(circles).toHaveLength(2)
    expect(circles.every((c) => c.state === 'empty')).toBe(true)
    expect(circles.every((c) => c.fillPercentage === 0)).toBe(true)
  })

  it('first circle drains first for multi-hour timer', () => {
    // 3 hour timer with 2h30 remaining (30 min elapsed)
    const circles = getCirclesData(180, 9000) // 180 min total, 150 min remaining
    expect(circles).toHaveLength(3)

    // Circle 0 (0-60): draining, 30 min left (150-120=30)
    // Circle 1 (60-120): full
    // Circle 2 (120-180): full
    expect(circles[0]?.state).toBe('partial')
    expect(circles[0]?.fillPercentage).toBe(0.5) // 30/60
    expect(circles[0]?.isActive).toBe(true)

    expect(circles[1]?.state).toBe('full')
    expect(circles[2]?.state).toBe('full')
  })

  it('partial circle is always last and drains last', () => {
    // 2h30 timer with only 15 min remaining
    const circles = getCirclesData(150, 900) // 150 min total, 15 min remaining
    expect(circles).toHaveLength(3)

    // Circle 0 (0-60): empty
    // Circle 1 (60-120): empty
    // Circle 2 (120-150): draining, 15 min left
    expect(circles[0]?.state).toBe('empty')
    expect(circles[1]?.state).toBe('empty')
    expect(circles[2]?.state).toBe('partial')
    expect(circles[2]?.fillPercentage).toBe(0.25) // 15/60
    expect(circles[2]?.isActive).toBe(true)
  })
})
