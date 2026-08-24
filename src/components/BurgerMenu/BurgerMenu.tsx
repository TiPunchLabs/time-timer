import { useEffect, useRef, useCallback, useState } from 'react'
import { PRESET_DURATIONS, COLOR_PALETTE, APP_VERSION, GITHUB_URL } from '../../constants/design'

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
        className={`absolute right-0 top-0 h-full w-[314px] max-w-[85vw] bg-surface border-l border-hairline flex flex-col overflow-y-auto ${
          isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 pl-5 pr-4 border-b border-hairline shrink-0">
          <h2 id="menu-title" className="font-display text-lg font-semibold -tracking-[0.01em] text-ink">
            Paramètres
          </h2>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-hairline bg-paper text-ink-70 hover:bg-hairline/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-ink transition-colors"
            aria-label="Fermer le menu"
          >
            <svg
              className="w-[17px] h-[17px]"
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
        <div className="px-5 pt-5">
          <h3 className="text-[11px] font-semibold text-ink-45 uppercase tracking-[0.14em] mb-3">
            Durées prédéfinies
          </h3>
          <nav aria-label="Sélection de durée">
            <div className="flex flex-wrap gap-2">
              {PRESET_DURATIONS.map((preset, index) => (
                <button
                  key={preset.minutes}
                  ref={index === 0 ? firstButtonRef : undefined}
                  onClick={() => handleSelectDuration(preset.minutes)}
                  className="h-11 px-4 inline-flex items-center bg-paper text-ink-70 font-semibold text-[13px] rounded-full border border-hairline hover:bg-hairline/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-ink transition-colors duration-150"
                  aria-label={`Sélectionner ${preset.label}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Color section */}
        <div className="px-5 pt-6">
          <h3 className="text-[11px] font-semibold text-ink-45 uppercase tracking-[0.14em] mb-3">
            Couleur
          </h3>
          <div className="grid grid-cols-4 gap-2.5 place-items-center" role="radiogroup" aria-label="Sélection de couleur">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.hex}
                onClick={() => onSelectColor(color.hex)}
                className={`w-12 h-12 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-ink rounded-full ${
                  selectedColor === color.hex
                    ? 'scale-105'
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
                  className="w-full h-full"
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
        <div className="px-5 pt-6 pb-5">
          <h3 className="text-[11px] font-semibold text-ink-45 uppercase tracking-[0.14em] mb-1">
            Options
          </h3>
          <label className="flex items-center justify-between gap-3 min-h-[44px] cursor-pointer">
            <span className="text-sm font-medium text-ink-70">Cercle pastel intérieur</span>
            <button
              type="button"
              role="switch"
              aria-checked={showPastel}
              onClick={() => onTogglePastel(!showPastel)}
              className={`relative inline-flex h-[27px] w-[46px] shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-surface ${
                showPastel ? '' : 'bg-hairline-strong'
              }`}
              style={showPastel ? { backgroundColor: selectedColor } : undefined}
              aria-label="Activer ou désactiver le cercle pastel intérieur"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  showPastel ? 'translate-x-[22px]' : 'translate-x-[3px]'
                }`}
              />
            </button>
          </label>
          <label className="flex items-center justify-between gap-3 min-h-[44px] cursor-pointer">
            <span className="text-sm font-medium text-ink-70">Graduations minutes</span>
            <button
              type="button"
              role="switch"
              aria-checked={showMinuteTicks}
              onClick={() => onToggleMinuteTicks(!showMinuteTicks)}
              className={`relative inline-flex h-[27px] w-[46px] shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-surface ${
                showMinuteTicks ? '' : 'bg-hairline-strong'
              }`}
              style={showMinuteTicks ? { backgroundColor: selectedColor } : undefined}
              aria-label="Activer ou désactiver les graduations minutes"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  showMinuteTicks ? 'translate-x-[22px]' : 'translate-x-[3px]'
                }`}
              />
            </button>
          </label>
          <label className="flex items-center justify-between gap-3 min-h-[44px] cursor-pointer">
            <span className="text-sm font-medium text-ink-70">Graduations 5 minutes</span>
            <button
              type="button"
              role="switch"
              aria-checked={showFiveMinuteTicks}
              onClick={() => onToggleFiveMinuteTicks(!showFiveMinuteTicks)}
              className={`relative inline-flex h-[27px] w-[46px] shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-surface ${
                showFiveMinuteTicks ? '' : 'bg-hairline-strong'
              }`}
              style={showFiveMinuteTicks ? { backgroundColor: selectedColor } : undefined}
              aria-label="Activer ou désactiver les graduations 5 minutes"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  showFiveMinuteTicks ? 'translate-x-[22px]' : 'translate-x-[3px]'
                }`}
              />
            </button>
          </label>
        </div>

        {/* About section */}
        <div className="px-5 pt-4 pb-6 border-t border-hairline mt-auto">
          <h3 className="text-[11px] font-semibold text-ink-45 uppercase tracking-[0.14em] mb-2">
            À propos
          </h3>
          <p className="text-xs font-medium text-ink-70">
            TempoKids v{APP_VERSION} — Timer visuel pour enfants
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#1D6FB8] hover:underline focus:outline-none focus:ring-2 focus:ring-ink rounded transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
