import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ClockCircle } from '../../src/components/ClockCircle'

describe('ClockCircle', () => {
  it('renders an SVG with role img', () => {
    render(<ClockCircle fillPercentage={0.5} />)
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })

  it('has accessible aria-label with fill percentage', () => {
    render(<ClockCircle fillPercentage={0.5} />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveAttribute('aria-label', expect.stringContaining('50%'))
  })

  it('renders with empty state aria-label when isEmpty is true', () => {
    render(<ClockCircle fillPercentage={0} isEmpty={true} />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveAttribute('aria-label', expect.stringContaining('vide'))
  })

  it('applies pause animation class when isPaused and isActive', () => {
    render(<ClockCircle fillPercentage={0.5} isPaused={true} isActive={true} />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveClass('animate-pause')
  })

  it('does not apply pause animation when not paused', () => {
    render(<ClockCircle fillPercentage={0.5} isPaused={false} isActive={true} />)
    const svg = screen.getByRole('img')
    expect(svg).not.toHaveClass('animate-pause')
  })

  it('does not apply pause animation when not active', () => {
    render(<ClockCircle fillPercentage={0.5} isPaused={true} isActive={false} />)
    const svg = screen.getByRole('img')
    expect(svg).not.toHaveClass('animate-pause')
  })

  it('renders at specified size', () => {
    render(<ClockCircle fillPercentage={0.5} size={200} />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveAttribute('width', '200')
    expect(svg).toHaveAttribute('height', '200')
  })

  it('renders with default size when not specified', () => {
    render(<ClockCircle fillPercentage={0.5} />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveAttribute('width', '100')
    expect(svg).toHaveAttribute('height', '100')
  })

  it('renders correctly at 0% fill', () => {
    render(<ClockCircle fillPercentage={0} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('renders correctly at 100% fill', () => {
    render(<ClockCircle fillPercentage={1} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('uses maxFillPercentage for partial circles', () => {
    render(<ClockCircle fillPercentage={0.25} maxFillPercentage={0.5} />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveAttribute('aria-label', expect.stringContaining('25%'))
  })
})
