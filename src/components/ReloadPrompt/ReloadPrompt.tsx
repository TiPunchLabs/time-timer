import { useRegisterSW } from 'virtual:pwa-register/react'

export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)
      }
    },
  })

  if (!needRefresh) return null

  return (
    <div className="fixed bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-fade-in">
      <div className="flex items-center justify-center gap-3 px-4 py-3 bg-surface rounded-2xl border border-hairline-strong shadow-lg shadow-ink/5">
        <span className="text-sm font-medium text-ink-70">
          Nouvelle version disponible
        </span>
        <button
          onClick={() => updateServiceWorker(true)}
          className="h-11 px-4 text-sm font-semibold text-white bg-ink rounded-xl hover:bg-ink-70 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-surface transition-colors"
        >
          Mettre à jour
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="w-11 h-11 flex items-center justify-center text-ink-45 hover:text-ink-70 focus:outline-none focus:ring-2 focus:ring-ink rounded-xl transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
