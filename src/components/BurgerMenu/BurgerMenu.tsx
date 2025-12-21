import { useEffect, useRef, useCallback, useState } from 'react'
import { PRESET_DURATIONS, COLOR_PALETTE } from '../../constants/design'

interface BurgerMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelectDuration: (minutes: number) => void
  selectedColor: string
  onSelectColor: (hex: string) => void
}

export function BurgerMenu({ isOpen, onClose, onSelectDuration, selectedColor, onSelectColor }: BurgerMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300) // Match slide-out-right animation duration
  }, [onClose])

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen || !menuRef.current) return

    const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element when menu opens
    firstElement?.focus()

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isOpen])

  const handleSelectDuration = (minutes: number) => {
    onSelectDuration(minutes)
    handleClose()
  }

  if (!isOpen && !isClosing) return null

  return (
    <div
      className={`fixed inset-0 z-50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Menu panel - Slide-over / Drawer */}
      <div
        ref={menuRef}
        className={`absolute right-0 top-0 h-full w-72 max-w-[80vw] bg-white shadow-xl ${
          isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 id="menu-title" className="text-lg font-bold text-slate-800">
            Paramètres
          </h2>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Fermer le menu"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Duration section */}
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Durées prédéfinies
          </h3>
          <nav aria-label="Sélection de durée">
            <div className="flex flex-wrap gap-2 justify-center">
              {PRESET_DURATIONS.map((preset, index) => (
                <button
                  key={preset.minutes}
                  ref={index === 0 ? firstButtonRef : undefined}
                  onClick={() => handleSelectDuration(preset.minutes)}
                  className="px-3 py-1.5 bg-slate-50 text-slate-700 font-medium text-sm rounded-full border border-slate-200 hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:bg-slate-200 transition-all duration-150"
                  aria-label={`Sélectionner ${preset.label}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Color section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Couleur
          </h3>
          <div className="flex flex-wrap gap-3 justify-center" role="radiogroup" aria-label="Sélection de couleur">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.hex}
                onClick={() => onSelectColor(color.hex)}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 ${
                  selectedColor === color.hex
                    ? 'border-slate-800 ring-2 ring-slate-300 scale-110'
                    : 'border-white hover:scale-105 hover:border-slate-200'
                }`}
                style={{ backgroundColor: color.hex }}
                aria-label={`Sélectionner la couleur ${color.name}`}
                aria-checked={selectedColor === color.hex}
                role="radio"
              >
                {selectedColor === color.hex && (
                  <svg
                    className="w-5 h-5 mx-auto text-white drop-shadow-md"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
