import { useEffect, useRef, useCallback, useState } from 'react'
import { PRESET_DURATIONS, COLOR_PALETTE } from '../../constants/design'

/**
 * Convert hex color to a lighter version (pastel)
 */
function getLightColor(hex: string, opacity: number = 0.25): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

interface BurgerMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelectDuration: (minutes: number) => void
  selectedColor: string
  onSelectColor: (hex: string) => void
  showPastel: boolean
  onTogglePastel: (enabled: boolean) => void
  showMinuteTicks: boolean
  onToggleMinuteTicks: (enabled: boolean) => void
  showFiveMinuteTicks: boolean
  onToggleFiveMinuteTicks: (enabled: boolean) => void
}

export function BurgerMenu({ isOpen, onClose, onSelectDuration, selectedColor, onSelectColor, showPastel, onTogglePastel, showMinuteTicks, onToggleMinuteTicks, showFiveMinuteTicks, onToggleFiveMinuteTicks }: BurgerMenuProps) {
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
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Couleur
          </h3>
          <div className="flex flex-wrap gap-3 justify-center" role="radiogroup" aria-label="Sélection de couleur">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.hex}
                onClick={() => onSelectColor(color.hex)}
                className={`w-12 h-12 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 rounded-full ${
                  selectedColor === color.hex
                    ? 'scale-110'
                    : 'hover:scale-105'
                }`}
                aria-label={`Sélectionner la couleur ${color.name}`}
                aria-checked={selectedColor === color.hex}
                role="radio"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow"
                >
                  {/* Inner track (light/pastel version - inside) - only if showPastel */}
                  {showPastel && (
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="none"
                      stroke={getLightColor(color.hex, 0.2)}
                      strokeWidth="8"
                    />
                  )}
                  {/* Outer color arc (full color - outside) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={color.hex}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Checkmark for selected */}
                  {selectedColor === color.hex && (
                    <path
                      d="M35 50 L45 60 L65 40"
                      fill="none"
                      stroke={color.hex}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Pastel toggle section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Options
          </h3>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-slate-700">Cercle pastel intérieur</span>
            <button
              type="button"
              role="switch"
              aria-checked={showPastel}
              onClick={() => onTogglePastel(!showPastel)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                showPastel ? 'bg-blue-500' : 'bg-slate-300'
              }`}
              aria-label="Activer ou désactiver le cercle pastel intérieur"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showPastel ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer mt-3">
            <span className="text-sm font-medium text-slate-700">Graduations minutes</span>
            <button
              type="button"
              role="switch"
              aria-checked={showMinuteTicks}
              onClick={() => onToggleMinuteTicks(!showMinuteTicks)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                showMinuteTicks ? 'bg-blue-500' : 'bg-slate-300'
              }`}
              aria-label="Activer ou désactiver les graduations minutes"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showMinuteTicks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer mt-3">
            <span className="text-sm font-medium text-slate-700">Graduations 5 minutes</span>
            <button
              type="button"
              role="switch"
              aria-checked={showFiveMinuteTicks}
              onClick={() => onToggleFiveMinuteTicks(!showFiveMinuteTicks)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                showFiveMinuteTicks ? 'bg-blue-500' : 'bg-slate-300'
              }`}
              aria-label="Activer ou désactiver les graduations 5 minutes"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showFiveMinuteTicks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </div>
      </div>
    </div>
  )
}
