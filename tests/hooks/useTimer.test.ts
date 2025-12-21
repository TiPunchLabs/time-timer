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
})
