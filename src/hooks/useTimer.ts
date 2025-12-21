import { useState, useCallback, useRef, useEffect } from 'react'
import type { TimerState, TimerActions, PersistedState } from '../types/timer'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEY } from '../constants/design'

/**
 * Validate persisted state data
 * Returns false if data is corrupted or invalid
 */
function isValidPersistedState(data: unknown): data is PersistedState {
  if (!data || typeof data !== 'object') return false
  const state = data as PersistedState
  return (
    typeof state.totalDuration === 'number' &&
    typeof state.remainingTime === 'number' &&
    typeof state.savedAt === 'number' &&
    state.totalDuration > 0 &&
    state.remainingTime >= 0 &&
    state.savedAt > 0 &&
    ['idle', 'running', 'paused', 'finished'].includes(state.status)
  )
}

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

  // Restore persisted state on mount
  useEffect(() => {
    if (persistedState && isValidPersistedState(persistedState)) {
      const now = Date.now()
      const elapsedSinceLastSave = (now - persistedState.savedAt) / 1000

      if (persistedState.status === 'running') {
        // For running timer: calculate new remaining time
        const newRemainingTime = Math.max(0, persistedState.remainingTime - elapsedSinceLastSave)

        if (newRemainingTime <= 0) {
          // Timer expired during absence
          setState({
            totalDuration: persistedState.totalDuration,
            remainingTime: 0,
            status: 'finished',
            startedAt: null,
            pausedDuration: 0,
          })
        } else {
          // Resume running timer with adjusted time
          setState({
            totalDuration: persistedState.totalDuration,
            remainingTime: newRemainingTime,
            status: 'running',
            startedAt: now - (persistedState.totalDuration - newRemainingTime) * 1000,
            pausedDuration: 0,
          })
        }
      } else if (persistedState.status === 'paused') {
        // For paused timer: restore exact state
        setState({
          totalDuration: persistedState.totalDuration,
          remainingTime: persistedState.remainingTime,
          status: 'paused',
          startedAt: null,
          pausedDuration: 0,
        })
      } else if (persistedState.status === 'idle' && persistedState.totalDuration > 0) {
        // For idle timer: restore configured duration
        setState({
          totalDuration: persistedState.totalDuration,
          remainingTime: persistedState.totalDuration,
          status: 'idle',
          startedAt: null,
          pausedDuration: 0,
        })
      }
      // If status is 'finished' or invalid, keep default state
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist state changes (including idle with configured duration)
  useEffect(() => {
    // Persist if running, paused, or idle with a configured duration
    if (state.status !== 'idle' || state.totalDuration > 0) {
      setPersistedState({
        totalDuration: state.totalDuration,
        remainingTime: state.remainingTime,
        status: state.status,
        savedAt: Date.now(),
        version: 1,
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
