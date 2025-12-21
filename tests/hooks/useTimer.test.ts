import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../../src/hooks/useTimer'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorageMock.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with correct state', () => {
    const { result } = renderHook(() => useTimer(60))

    expect(result.current.state.totalDuration).toBe(3600) // 60 min in seconds
    expect(result.current.state.remainingTime).toBe(3600)
    expect(result.current.state.status).toBe('idle')
  })

  it('setDuration updates total and remaining time', () => {
    const { result } = renderHook(() => useTimer(60))

    act(() => {
      result.current.actions.setDuration(30)
    })

    expect(result.current.state.totalDuration).toBe(1800) // 30 min in seconds
    expect(result.current.state.remainingTime).toBe(1800)
    expect(result.current.state.status).toBe('idle')
  })

  it('start changes status to running', () => {
    const { result } = renderHook(() => useTimer(60))

    act(() => {
      result.current.actions.start()
    })

    expect(result.current.state.status).toBe('running')
    expect(result.current.state.startedAt).not.toBeNull()
  })

  it('pause changes status to paused', () => {
    const { result } = renderHook(() => useTimer(60))

    act(() => {
      result.current.actions.start()
    })

    act(() => {
      result.current.actions.pause()
    })

    expect(result.current.state.status).toBe('paused')
  })

  it('resume changes status back to running', () => {
    const { result } = renderHook(() => useTimer(60))

    act(() => {
      result.current.actions.start()
    })

    act(() => {
      result.current.actions.pause()
    })

    act(() => {
      result.current.actions.resume()
    })

    expect(result.current.state.status).toBe('running')
  })

  it('reset restores to initial state', () => {
    const { result } = renderHook(() => useTimer(60))

    act(() => {
      result.current.actions.start()
    })

    act(() => {
      result.current.actions.reset()
    })

    expect(result.current.state.status).toBe('idle')
    expect(result.current.state.remainingTime).toBe(3600)
    expect(result.current.state.startedAt).toBeNull()
  })

  it('does not pause when not running', () => {
    const { result } = renderHook(() => useTimer(60))

    act(() => {
      result.current.actions.pause()
    })

    expect(result.current.state.status).toBe('idle')
  })

  it('does not resume when not paused', () => {
    const { result } = renderHook(() => useTimer(60))

    act(() => {
      result.current.actions.resume()
    })

    expect(result.current.state.status).toBe('idle')
  })

  // Persistence tests
  describe('state persistence', () => {
    it('restores running timer with elapsed time calculated', () => {
      const now = Date.now()
      const savedAt = now - 120000 // 2 minutes ago (120 seconds)
      const savedState = {
        totalDuration: 600, // 10 minutes
        remainingTime: 480, // 8 minutes remaining at save time
        status: 'running' as const,
        savedAt,
        version: 1,
      }

      // Set the persisted state before rendering
      localStorageMock.setItem('tempokids_timer_state', JSON.stringify(savedState))
      vi.setSystemTime(now)

      const { result } = renderHook(() => useTimer(5))

      // Should have restored with elapsed time calculated
      // 480 seconds remaining - 120 seconds elapsed = 360 seconds (~6 minutes)
      expect(result.current.state.status).toBe('running')
      expect(result.current.state.totalDuration).toBe(600)
      expect(result.current.state.remainingTime).toBeCloseTo(360, 0)
    })

    it('shows finished state when timer expired during absence', () => {
      const now = Date.now()
      const savedAt = now - 600000 // 10 minutes ago
      const savedState = {
        totalDuration: 300, // 5 minutes
        remainingTime: 60, // 1 minute remaining at save time
        status: 'running' as const,
        savedAt,
        version: 1,
      }

      localStorageMock.setItem('tempokids_timer_state', JSON.stringify(savedState))
      vi.setSystemTime(now)

      const { result } = renderHook(() => useTimer(5))

      // Timer should show finished (expired during absence)
      expect(result.current.state.status).toBe('finished')
      expect(result.current.state.remainingTime).toBe(0)
    })

    it('restores paused timer with exact remaining time', () => {
      const now = Date.now()
      const savedAt = now - 300000 // 5 minutes ago
      const savedState = {
        totalDuration: 600, // 10 minutes
        remainingTime: 420, // 7 minutes remaining
        status: 'paused' as const,
        savedAt,
        version: 1,
      }

      localStorageMock.setItem('tempokids_timer_state', JSON.stringify(savedState))
      vi.setSystemTime(now)

      const { result } = renderHook(() => useTimer(5))

      // Paused timer should restore exact time (no elapsed calculation)
      expect(result.current.state.status).toBe('paused')
      expect(result.current.state.totalDuration).toBe(600)
      expect(result.current.state.remainingTime).toBe(420)
    })

    it('can resume after paused restoration', () => {
      const now = Date.now()
      const savedState = {
        totalDuration: 600,
        remainingTime: 420,
        status: 'paused' as const,
        savedAt: now - 60000,
        version: 1,
      }

      localStorageMock.setItem('tempokids_timer_state', JSON.stringify(savedState))
      vi.setSystemTime(now)

      const { result } = renderHook(() => useTimer(5))

      expect(result.current.state.status).toBe('paused')

      act(() => {
        result.current.actions.resume()
      })

      expect(result.current.state.status).toBe('running')
    })

    it('restores idle timer with configured duration', () => {
      const now = Date.now()
      const savedState = {
        totalDuration: 9000, // 150 minutes = 2h30
        remainingTime: 9000,
        status: 'idle' as const,
        savedAt: now - 60000,
        version: 1,
      }

      localStorageMock.setItem('tempokids_timer_state', JSON.stringify(savedState))
      vi.setSystemTime(now)

      const { result } = renderHook(() => useTimer(5))

      // Idle timer should restore configured duration
      expect(result.current.state.status).toBe('idle')
      expect(result.current.state.totalDuration).toBe(9000)
      expect(result.current.state.remainingTime).toBe(9000)
    })

    it('falls back to default state on corrupted data', () => {
      localStorageMock.setItem('tempokids_timer_state', 'invalid json {{{')

      const { result } = renderHook(() => useTimer(5))

      // Should use default state (5 minutes = 300 seconds)
      expect(result.current.state.status).toBe('idle')
      expect(result.current.state.totalDuration).toBe(300)
    })

    it('falls back to default state on invalid persisted data', () => {
      const invalidState = {
        totalDuration: -100, // Invalid: negative
        remainingTime: 300,
        status: 'running' as const,
        savedAt: Date.now(),
      }

      localStorageMock.setItem('tempokids_timer_state', JSON.stringify(invalidState))

      const { result } = renderHook(() => useTimer(5))

      // Should use default state
      expect(result.current.state.status).toBe('idle')
      expect(result.current.state.totalDuration).toBe(300)
    })
  })
})
