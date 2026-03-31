import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DurationPicker } from '../../src/components/DurationPicker'

describe('DurationPicker', () => {
  const defaultProps = {
    value: 60, // 1 hour
    onChange: vi.fn(),
    disabled: false,
  }

  it('displays initial hours and minutes correctly', () => {
    render(<DurationPicker {...defaultProps} value={90} />)
    // 90 minutes = 1 hour 30 minutes
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('displays zero-padded minutes', () => {
    render(<DurationPicker {...defaultProps} value={65} />)
    // 65 minutes = 1 hour 05 minutes
    expect(screen.getByText('05')).toBeInTheDocument()
  })

  it('has increment hour button', () => {
    render(<DurationPicker {...defaultProps} />)
    expect(screen.getByRole('button', { name: /augmenter les heures/i })).toBeInTheDocument()
  })

  it('has decrement hour button', () => {
    render(<DurationPicker {...defaultProps} />)
    expect(screen.getByRole('button', { name: /diminuer les heures/i })).toBeInTheDocument()
  })

  it('has increment minutes button', () => {
    render(<DurationPicker {...defaultProps} />)
    expect(screen.getByRole('button', { name: /augmenter les minutes/i })).toBeInTheDocument()
  })

  it('has decrement minutes button', () => {
    render(<DurationPicker {...defaultProps} />)
    expect(screen.getByRole('button', { name: /diminuer les minutes/i })).toBeInTheDocument()
  })

  it('calls onChange when incrementing hours', () => {
    const onChange = vi.fn()
    render(<DurationPicker {...defaultProps} value={60} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /augmenter les heures/i }))
    expect(onChange).toHaveBeenCalledWith(120) // 2 hours
  })

  it('calls onChange when decrementing hours', () => {
    const onChange = vi.fn()
    render(<DurationPicker {...defaultProps} value={120} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /diminuer les heures/i }))
    expect(onChange).toHaveBeenCalledWith(60) // 1 hour
  })

  it('calls onChange when incrementing minutes (by 1)', () => {
    const onChange = vi.fn()
    render(<DurationPicker {...defaultProps} value={60} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /augmenter les minutes/i }))
    expect(onChange).toHaveBeenCalledWith(61)
  })

  it('calls onChange when decrementing minutes (by 1)', () => {
    const onChange = vi.fn()
    render(<DurationPicker {...defaultProps} value={61} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /diminuer les minutes/i }))
    expect(onChange).toHaveBeenCalledWith(60)
  })

  it('disables all buttons when disabled prop is true', () => {
    render(<DurationPicker {...defaultProps} disabled={true} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  it('disables increment hours at max (4 hours)', () => {
    render(<DurationPicker {...defaultProps} value={240} />)
    expect(screen.getByRole('button', { name: /augmenter les heures/i })).toBeDisabled()
  })

  it('has focus ring on buttons', () => {
    render(<DurationPicker {...defaultProps} />)
    const incrementButton = screen.getByRole('button', { name: /augmenter les heures/i })
    expect(incrementButton.className).toContain('focus:ring-2')
    expect(incrementButton.className).toContain('focus:ring-blue-500')
  })

  it('displays labels for hours and minutes', () => {
    render(<DurationPicker {...defaultProps} />)
    expect(screen.getByText('heures')).toBeInTheDocument()
    expect(screen.getByText('minutes')).toBeInTheDocument()
  })

  it('updates when value prop changes', () => {
    const { rerender } = render(<DurationPicker {...defaultProps} value={60} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('00')).toBeInTheDocument()

    rerender(<DurationPicker {...defaultProps} value={150} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  // Rollover tests - Increment (US1)
  describe('minute increment rollover', () => {
    it('rolls over from 59 minutes to next hour (0h59 → 1h00)', () => {
      const onChange = vi.fn()
      render(<DurationPicker {...defaultProps} value={59} onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: /augmenter les minutes/i }))
      // Should call onChange with 60 (1 hour, 0 minutes)
      expect(onChange).toHaveBeenCalledWith(60)
    })

    it('rolls over from 1h59 to 2h00', () => {
      const onChange = vi.fn()
      render(<DurationPicker {...defaultProps} value={119} onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: /augmenter les minutes/i }))
      expect(onChange).toHaveBeenCalledWith(120)
    })

    it('rolls over from 3h59 to 4h00', () => {
      const onChange = vi.fn()
      render(<DurationPicker {...defaultProps} value={239} onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: /augmenter les minutes/i }))
      expect(onChange).toHaveBeenCalledWith(240)
    })

    it('disables + minutes at 4h00 (max reached)', () => {
      render(<DurationPicker {...defaultProps} value={240} />)
      expect(screen.getByRole('button', { name: /augmenter les minutes/i })).toBeDisabled()
    })

    it('enables + minutes at 3h55 (rollover possible)', () => {
      render(<DurationPicker {...defaultProps} value={235} />)
      expect(screen.getByRole('button', { name: /augmenter les minutes/i })).not.toBeDisabled()
    })
  })

  // Rollover tests - Decrement (US2)
  describe('minute decrement rollover', () => {
    it('rolls over from 0 minutes to previous hour (1h00 → 0h59)', () => {
      const onChange = vi.fn()
      render(<DurationPicker {...defaultProps} value={60} onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: /diminuer les minutes/i }))
      expect(onChange).toHaveBeenCalledWith(59)
    })

    it('rolls over from 2h00 to 1h59', () => {
      const onChange = vi.fn()
      render(<DurationPicker {...defaultProps} value={120} onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: /diminuer les minutes/i }))
      expect(onChange).toHaveBeenCalledWith(119)
    })

    it('rolls over from 4h00 to 3h59', () => {
      const onChange = vi.fn()
      render(<DurationPicker {...defaultProps} value={240} onChange={onChange} />)
      fireEvent.click(screen.getByRole('button', { name: /diminuer les minutes/i }))
      expect(onChange).toHaveBeenCalledWith(239)
    })

    it('disables - minutes at 0h01 (min reached)', () => {
      render(<DurationPicker {...defaultProps} value={1} />)
      expect(screen.getByRole('button', { name: /diminuer les minutes/i })).toBeDisabled()
    })

    it('enables - minutes at 1h00 (rollover possible)', () => {
      render(<DurationPicker {...defaultProps} value={60} />)
      expect(screen.getByRole('button', { name: /diminuer les minutes/i })).not.toBeDisabled()
    })
  })
})
