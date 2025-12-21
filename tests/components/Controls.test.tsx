import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Controls } from '../../src/components/Controls'

describe('Controls', () => {
  const defaultProps = {
    status: 'idle' as const,
    onStart: vi.fn(),
    onPause: vi.fn(),
    onResume: vi.fn(),
    onReset: vi.fn(),
  }

  it('shows Start button when idle', () => {
    render(<Controls {...defaultProps} status="idle" />)
    expect(screen.getByRole('button', { name: /démarrer/i })).toBeInTheDocument()
  })

  it('shows Pause button when running', () => {
    render(<Controls {...defaultProps} status="running" />)
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
  })

  it('shows Resume button when paused', () => {
    render(<Controls {...defaultProps} status="paused" />)
    expect(screen.getByRole('button', { name: /reprendre/i })).toBeInTheDocument()
  })

  it('shows Restart button when finished', () => {
    render(<Controls {...defaultProps} status="finished" />)
    expect(screen.getByRole('button', { name: /recommencer/i })).toBeInTheDocument()
  })

  it('shows Reset button when running', () => {
    render(<Controls {...defaultProps} status="running" />)
    expect(screen.getByRole('button', { name: /réinitialiser/i })).toBeInTheDocument()
  })

  it('shows Reset button when paused', () => {
    render(<Controls {...defaultProps} status="paused" />)
    expect(screen.getByRole('button', { name: /réinitialiser/i })).toBeInTheDocument()
  })

  it('does not show Reset button when idle', () => {
    render(<Controls {...defaultProps} status="idle" />)
    expect(screen.queryByRole('button', { name: /réinitialiser/i })).not.toBeInTheDocument()
  })

  it('calls onStart when Start button is clicked', () => {
    const onStart = vi.fn()
    render(<Controls {...defaultProps} onStart={onStart} status="idle" />)
    fireEvent.click(screen.getByRole('button', { name: /démarrer/i }))
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('calls onPause when Pause button is clicked', () => {
    const onPause = vi.fn()
    render(<Controls {...defaultProps} onPause={onPause} status="running" />)
    fireEvent.click(screen.getByRole('button', { name: /pause/i }))
    expect(onPause).toHaveBeenCalledTimes(1)
  })

  it('calls onResume when Resume button is clicked', () => {
    const onResume = vi.fn()
    render(<Controls {...defaultProps} onResume={onResume} status="paused" />)
    fireEvent.click(screen.getByRole('button', { name: /reprendre/i }))
    expect(onResume).toHaveBeenCalledTimes(1)
  })

  it('calls onReset when Reset button is clicked', () => {
    const onReset = vi.fn()
    render(<Controls {...defaultProps} onReset={onReset} status="running" />)
    fireEvent.click(screen.getByRole('button', { name: /réinitialiser/i }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('has focus ring on primary button', () => {
    render(<Controls {...defaultProps} status="idle" />)
    const button = screen.getByRole('button', { name: /démarrer/i })
    expect(button.className).toContain('focus:ring-2')
    expect(button.className).toContain('focus:ring-red-500')
  })

  it('has focus ring on secondary button', () => {
    render(<Controls {...defaultProps} status="running" />)
    const resetButton = screen.getByRole('button', { name: /réinitialiser/i })
    expect(resetButton.className).toContain('focus:ring-2')
  })

  it('buttons have correct aria-labels', () => {
    render(<Controls {...defaultProps} status="idle" />)
    const startButton = screen.getByRole('button', { name: /démarrer le timer/i })
    expect(startButton).toBeInTheDocument()
  })
})
