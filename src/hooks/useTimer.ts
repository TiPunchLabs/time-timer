import { useState, useCallback, useRef, useEffect } from 'react'
import type { TimerState, TimerActions, PersistedState } from '../types/timer'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEY } from '../constants/design'

const initialState: TimerState = {
  totalDuration: 0,
  remainingTime: 0,
  status: 'idle',
  startedAt: null,
  pausedDuration: 0,
}

interface UseTimerReturn {
  state: TimerState
  actions: TimerActions
}

/**
 * Main timer hook with persistence
 * @param initialMinutes - Initial duration in minutes
 */
export function useTimer(initialMinutes: number): UseTimerReturn {
  const [state, setState] = useState<TimerState>(() => ({
    ...initialState,
    totalDuration: initialMinutes * 60,
    remainingTime: initialMinutes * 60,
  }))

  const animationFrameRef = useRef<number | null>(null)
  const pausedAtRef = useRef<number | null>(null)

  // Persistence
  const [persistedState, setPersistedState] = useLocalStorage<PersistedState | null>(
    STORAGE_KEY,
    null
  )

  // Clear persisted state on mount (page reload = reset)
  useEffect(() => {
    if (persistedState) {
      setPersistedState(null)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist state changes
  useEffect(() => {
    if (state.status !== 'idle') {
      setPersistedState({
        totalDuration: state.totalDuration,
        remainingTime: state.remainingTime,
        status: state.status,
        savedAt: Date.now(),
      })
    }
  }, [state.remainingTime, state.status, state.totalDuration, setPersistedState])

  // Animation loop for countdown
  const tick = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'running' || prev.startedAt === null) {
        return prev
      }

      const now = Date.now()
      const elapsed = (now - prev.startedAt - prev.pausedDuration) / 1000
      const remaining = Math.max(0, prev.totalDuration - elapsed)

      if (remaining <= 0) {
        return {
          ...prev,
          remainingTime: 0,
          status: 'finished',
        }
      }

      return {
        ...prev,
        remainingTime: remaining,
      }
    })
  }, [])

  // Start/stop animation loop based on status
  useEffect(() => {
    if (state.status === 'running') {
      const animate = () => {
        tick()
        animationFrameRef.current = requestAnimationFrame(animate)
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [state.status, tick])

  // Actions
  const setDuration = useCallback((minutes: number) => {
    const seconds = minutes * 60
    setState((prev) => ({
      ...prev,
      totalDuration: seconds,
      remainingTime: seconds,
      status: 'idle',
      startedAt: null,
      pausedDuration: 0,
    }))
  }, [])

  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: 'running',
      startedAt: Date.now(),
      pausedDuration: 0,
      remainingTime: prev.totalDuration,
    }))
  }, [])

  const pause = useCallback(() => {
    pausedAtRef.current = Date.now()
    setState((prev) => {
      if (prev.status !== 'running') return prev
      return {
        ...prev,
        status: 'paused',
      }
    })
  }, [])

  const resume = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'paused') return prev
      const pauseDuration = pausedAtRef.current ? Date.now() - pausedAtRef.current : 0
      pausedAtRef.current = null
      return {
        ...prev,
        status: 'running',
        pausedDuration: prev.pausedDuration + pauseDuration,
      }
    })
  }, [])

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      remainingTime: prev.totalDuration,
      status: 'idle',
      startedAt: null,
      pausedDuration: 0,
    }))
    setPersistedState(null)
  }, [setPersistedState])

  return {
    state,
    actions: {
      setDuration,
      start,
      pause,
      resume,
      reset,
    },
  }
}
