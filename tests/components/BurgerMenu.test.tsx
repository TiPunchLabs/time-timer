import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BurgerMenu } from '../../src/components/BurgerMenu'
import { PRESET_DURATIONS, TIMER_BLUE } from '../../src/constants/design'

describe('BurgerMenu', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSelectDuration: vi.fn(),
    selectedColor: TIMER_BLUE,
    onSelectColor: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders nothing when closed', () => {
      render(<BurgerMenu {...defaultProps} isOpen={false} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders menu when open', () => {
      render(<BurgerMenu {...defaultProps} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('displays all preset durations', () => {
      render(<BurgerMenu {...defaultProps} />)
      PRESET_DURATIONS.forEach(preset => {
        expect(screen.getByText(preset.label)).toBeInTheDocument()
      })
    })

    it('displays menu title', () => {
      render(<BurgerMenu {...defaultProps} />)
      expect(screen.getByText('Paramètres')).toBeInTheDocument()
    })

    it('displays section titles', () => {
      render(<BurgerMenu {...defaultProps} />)
      expect(screen.getByText('Durées prédéfinies')).toBeInTheDocument()
      expect(screen.getByText('Couleur')).toBeInTheDocument()
    })

    it('displays close button', () => {
      render(<BurgerMenu {...defaultProps} />)
      expect(screen.getByRole('button', { name: /fermer le menu/i })).toBeInTheDocument()
    })
  })

  describe('User Story 1: Preset Duration Selection', () => {
    it('calls onSelectDuration with correct minutes when preset is clicked', async () => {
      const onSelectDuration = vi.fn()
      render(<BurgerMenu {...defaultProps} onSelectDuration={onSelectDuration} />)

      fireEvent.click(screen.getByRole('button', { name: /sélectionner 45 min/i }))

      expect(onSelectDuration).toHaveBeenCalledWith(45)
    })

    it('calls onClose after selecting a duration', async () => {
      const onClose = vi.fn()
      render(<BurgerMenu {...defaultProps} onClose={onClose} />)

      fireEvent.click(screen.getByRole('button', { name: /sélectionner 30 min/i }))

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled()
      })
    })

    it('selects 1h15 (75 minutes) correctly', () => {
      const onSelectDuration = vi.fn()
      render(<BurgerMenu {...defaultProps} onSelectDuration={onSelectDuration} />)

      fireEvent.click(screen.getByRole('button', { name: /sélectionner 1h15/i }))

      expect(onSelectDuration).toHaveBeenCalledWith(75)
    })

    it('selects 2h30 (150 minutes) correctly', () => {
      const onSelectDuration = vi.fn()
      render(<BurgerMenu {...defaultProps} onSelectDuration={onSelectDuration} />)

      fireEvent.click(screen.getByRole('button', { name: /sélectionner 2h30/i }))

      expect(onSelectDuration).toHaveBeenCalledWith(150)
    })
  })

  describe('User Story 2: Close Behaviors', () => {
    it('closes when clicking the X button', async () => {
      const onClose = vi.fn()
      render(<BurgerMenu {...defaultProps} onClose={onClose} />)

      fireEvent.click(screen.getByRole('button', { name: /fermer le menu/i }))

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled()
      })
    })

    it('closes when clicking the backdrop', async () => {
      const onClose = vi.fn()
      render(<BurgerMenu {...defaultProps} onClose={onClose} />)

      // Click on backdrop (the outer div)
      const backdrop = screen.getByRole('dialog').querySelector('.bg-black\\/50')
      if (backdrop) {
        fireEvent.click(backdrop)
      }

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled()
      })
    })

    it('closes when pressing Escape key', async () => {
      const onClose = vi.fn()
      render(<BurgerMenu {...defaultProps} onClose={onClose} />)

      fireEvent.keyDown(document, { key: 'Escape' })

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled()
      })
    })
  })

  describe('Accessibility', () => {
    it('has correct dialog role', () => {
      render(<BurgerMenu {...defaultProps} />)
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    })

    it('has accessible labels for preset buttons', () => {
      render(<BurgerMenu {...defaultProps} />)
      PRESET_DURATIONS.forEach(preset => {
        // Use exact match with case-insensitive comparison
        expect(screen.getByRole('button', { name: `Sélectionner ${preset.label}` })).toBeInTheDocument()
      })
    })

    it('has navigation landmark for duration selection', () => {
      render(<BurgerMenu {...defaultProps} />)
      expect(screen.getByRole('navigation', { name: /sélection de durée/i })).toBeInTheDocument()
    })

    it('focuses first element when opened', async () => {
      render(<BurgerMenu {...defaultProps} />)

      await waitFor(() => {
        // The first focusable element should receive focus
        const firstButton = screen.getAllByRole('button')[0]
        expect(document.activeElement).toBe(firstButton)
      })
    })

    it('traps focus within the menu', async () => {
      render(<BurgerMenu {...defaultProps} />)

      // Get all focusable elements (buttons and radio buttons for color picker)
      const allFocusable = [
        ...screen.getAllByRole('button'),
        ...screen.getAllByRole('radio'),
      ]
      const firstFocusable = allFocusable[0]
      const lastFocusable = allFocusable[allFocusable.length - 1]

      // Focus the last focusable element
      lastFocusable.focus()

      // Simulate Tab key on last element - should wrap to first
      fireEvent.keyDown(document, { key: 'Tab' })

      await waitFor(() => {
        expect(document.activeElement).toBe(firstFocusable)
      })
    })
  })

  describe('Animation', () => {
    it('has slide-in animation class when open', () => {
      render(<BurgerMenu {...defaultProps} />)
      const dialog = screen.getByRole('dialog')
      expect(dialog.className).toContain('animate-fade-in')
    })
  })

  describe('Color Selection', () => {
    it('displays color picker with all colors', () => {
      render(<BurgerMenu {...defaultProps} />)
      const colorButtons = screen.getAllByRole('radio')
      expect(colorButtons.length).toBe(12) // 12 colors in palette
    })

    it('calls onSelectColor when a color is clicked', () => {
      const onSelectColor = vi.fn()
      render(<BurgerMenu {...defaultProps} onSelectColor={onSelectColor} />)

      const redButton = screen.getByRole('radio', { name: /sélectionner la couleur rouge/i })
      fireEvent.click(redButton)

      expect(onSelectColor).toHaveBeenCalledWith('#F44336')
    })

    it('shows check mark on selected color', () => {
      render(<BurgerMenu {...defaultProps} selectedColor="#F44336" />)

      const redButton = screen.getByRole('radio', { name: /sélectionner la couleur rouge/i })
      expect(redButton).toHaveAttribute('aria-checked', 'true')

      // Check that there's a checkmark path inside (for the check mark overlay)
      const checkmark = redButton.querySelector('path')
      expect(checkmark).toBeInTheDocument()
    })

    it('does not show check mark on unselected colors', () => {
      render(<BurgerMenu {...defaultProps} selectedColor={TIMER_BLUE} />)

      const redButton = screen.getByRole('radio', { name: /sélectionner la couleur rouge/i })
      expect(redButton).toHaveAttribute('aria-checked', 'false')

      // No checkmark path inside unselected color (SVG exists but no path for checkmark)
      const checkmark = redButton.querySelector('path')
      expect(checkmark).not.toBeInTheDocument()
    })

    it('has radiogroup role for color selection', () => {
      render(<BurgerMenu {...defaultProps} />)
      expect(screen.getByRole('radiogroup', { name: /sélection de couleur/i })).toBeInTheDocument()
    })
  })
})
