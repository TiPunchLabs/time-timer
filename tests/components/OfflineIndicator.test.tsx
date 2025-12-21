import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { OfflineIndicator } from '../../src/components/OfflineIndicator'

describe('OfflineIndicator', () => {
  const originalNavigator = global.navigator

  beforeEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: { onLine: true },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    })
  })

  it('does not render when online', () => {
    Object.defineProperty(global.navigator, 'onLine', { value: true })
    render(<OfflineIndicator />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders offline message when offline', () => {
    Object.defineProperty(global.navigator, 'onLine', { value: false })
    render(<OfflineIndicator />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/hors ligne/i)).toBeInTheDocument()
  })

  it('has correct aria attributes for accessibility', () => {
    Object.defineProperty(global.navigator, 'onLine', { value: false })
    render(<OfflineIndicator />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'polite')
  })

  it('appears when going offline', () => {
    Object.defineProperty(global.navigator, 'onLine', { value: true })
    render(<OfflineIndicator />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('disappears when coming back online', () => {
    Object.defineProperty(global.navigator, 'onLine', { value: false })
    render(<OfflineIndicator />)

    expect(screen.getByRole('alert')).toBeInTheDocument()

    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('has amber background for visibility', () => {
    Object.defineProperty(global.navigator, 'onLine', { value: false })
    render(<OfflineIndicator />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-amber-500')
  })
})
