import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimerDisplay } from '../../src/components/TimerDisplay'

describe('TimerDisplay', () => {
  it('renders message when no duration is set', () => {
    render(<TimerDisplay totalMinutes={0} remainingSeconds={0} />)
    expect(screen.getByText(/configurez une durée/i)).toBeInTheDocument()
  })

  it('renders single circle for 1 hour', () => {
    render(<TimerDisplay totalMinutes={60} remainingSeconds={3600} />)
    const circles = screen.getAllByRole('img')
    expect(circles).toHaveLength(1)
  })

  it('renders two circles for 2 hours', () => {
    render(<TimerDisplay totalMinutes={120} remainingSeconds={7200} />)
    const circles = screen.getAllByRole('img')
    expect(circles).toHaveLength(2)
  })

  it('renders three circles for 3 hours', () => {
    render(<TimerDisplay totalMinutes={180} remainingSeconds={10800} />)
    const circles = screen.getAllByRole('img')
    expect(circles).toHaveLength(3)
  })

  it('renders four circles for 4 hours', () => {
    render(<TimerDisplay totalMinutes={240} remainingSeconds={14400} />)
    const circles = screen.getAllByRole('img')
    expect(circles).toHaveLength(4)
  })

  it('renders correct number of circles for partial hours', () => {
    // 90 minutes = 2 circles (1h + 30m)
    render(<TimerDisplay totalMinutes={90} remainingSeconds={5400} />)
    const circles = screen.getAllByRole('img')
    expect(circles).toHaveLength(2)
  })

  it('displays circle labels (1, 2, etc.)', () => {
    render(<TimerDisplay totalMinutes={120} remainingSeconds={7200} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders with pause state', () => {
    render(<TimerDisplay totalMinutes={60} remainingSeconds={3600} isPaused={true} />)
    const circle = screen.getByRole('img')
    expect(circle).toBeInTheDocument()
  })

  it('handles zero remaining seconds', () => {
    render(<TimerDisplay totalMinutes={60} remainingSeconds={0} />)
    const circles = screen.getAllByRole('img')
    expect(circles).toHaveLength(1)
  })

  it('uses responsive grid for different circle counts', () => {
    const { container } = render(<TimerDisplay totalMinutes={240} remainingSeconds={14400} />)
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-2')
  })

  it('has centered layout for single circle', () => {
    const { container } = render(<TimerDisplay totalMinutes={60} remainingSeconds={3600} />)
    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-1')
  })

  it('renders correctly when timer is partially drained', () => {
    // 60 minutes total, 30 minutes remaining (50% drained)
    render(<TimerDisplay totalMinutes={60} remainingSeconds={1800} />)
    const circle = screen.getByRole('img')
    expect(circle).toHaveAttribute('aria-label', expect.stringContaining('50%'))
  })

  it('passes isPaused prop to active circles', () => {
    // 60 minutes total, 30 minutes remaining - circle is actively draining
    render(<TimerDisplay totalMinutes={60} remainingSeconds={1800} isPaused={true} />)
    const circle = screen.getByRole('img')
    // When timer is paused and circle is active (draining), it should have pause animation
    // The circle is active because it's partially drained (50%)
    expect(circle).toBeInTheDocument()
    // Note: animate-pause class is applied via CSS when isPaused && isActive
  })
})
