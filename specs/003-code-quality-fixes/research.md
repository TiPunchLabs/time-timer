# Research: Code Quality Fixes

**Feature Branch**: `003-code-quality-fixes`
**Date**: 2025-12-20

## Summary

Cette feature utilise exclusivement les technologies déjà établies dans le projet. Aucune nouvelle dépendance n'est requise. La recherche se concentre sur les meilleures pratiques d'implémentation.

## Research Topics

### 1. React Error Boundary

**Decision**: Utiliser un composant class React natif (seule option pour Error Boundaries)

**Rationale**:
- Les Error Boundaries doivent être des class components (limitation React)
- Utilise `static getDerivedStateFromError()` pour la mise à jour d'état
- Utilise `componentDidCatch()` pour le logging d'erreur
- Aucune dépendance externe nécessaire

**Alternatives considered**:
- react-error-boundary package → Rejeté: dépendance inutile pour un cas simple
- HOC pattern → Rejeté: moins lisible, même résultat

**Implementation Pattern**:
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI onReset={() => window.location.reload()} />
    }
    return this.props.children
  }
}
```

### 2. Network Status Detection

**Decision**: Hook personnalisé avec navigator.onLine et event listeners

**Rationale**:
- API native `navigator.onLine` disponible dans tous les navigateurs modernes
- Events `online` et `offline` pour les changements en temps réel
- Pas de dépendance externe nécessaire

**Alternatives considered**:
- use-network-state package → Rejeté: dépendance inutile
- Polling API endpoint → Rejeté: consomme bande passante, pas offline-first

**Implementation Pattern**:
```typescript
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
```

### 3. Focus Visible Accessibility

**Decision**: Tailwind CSS focus:ring utilities

**Rationale**:
- Tailwind inclut déjà les classes `focus:ring-*`
- Cohérent avec le design system existant
- Accessible et visible sur tous les navigateurs

**Implementation Pattern**:
```html
<button className="... focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
```

### 4. Workbox navigateFallback

**Decision**: Ajouter navigateFallback dans la config VitePWA

**Rationale**:
- Requis pour le score PWA Lighthouse 100
- Assure le fonctionnement offline pour toutes les routes
- Configuration simple dans vite.config.ts

**Implementation Pattern**:
```typescript
workbox: {
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/api/], // Si API existe
  // ... existing config
}
```

### 5. Component Testing with @testing-library/react

**Decision**: Utiliser @testing-library/react déjà installé

**Rationale**:
- Déjà présent dans devDependencies
- Approche "testing library" recommandée pour React
- Tests focalisés sur le comportement utilisateur

**Testing Patterns**:
```typescript
import { render, screen } from '@testing-library/react'

describe('ClockCircle', () => {
  it('renders with correct aria-label', () => {
    render(<ClockCircle fillPercentage={0.5} />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', expect.stringContaining('50%'))
  })
})
```

## Resolved Clarifications

Aucune clarification nécessaire - toutes les technologies sont déjà établies dans le projet.

## Dependencies Impact

| Dépendance | Action | Impact Bundle |
|------------|--------|---------------|
| React (existant) | Aucun ajout | 0 KB |
| @testing-library/react (existant) | Aucun ajout | 0 KB (dev only) |
| Tailwind CSS (existant) | Aucun ajout | 0 KB |
| vite-plugin-pwa (existant) | Config update | 0 KB |

**Total Bundle Impact**: 0 KB - Aucune nouvelle dépendance

## Conclusion

Cette feature n'introduit aucune nouvelle technologie ni dépendance. Elle utilise les patterns natifs React et les outils déjà configurés. L'implémentation peut procéder directement.
