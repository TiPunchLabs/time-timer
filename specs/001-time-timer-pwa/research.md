# Research: TempoKids - Module Time-Timer

**Date**: 2025-12-20
**Feature**: [spec.md](./spec.md) | [plan.md](./plan.md)

## Décisions Techniques

### 1. Rendu SVG des cercles d'horloge

**Decision**: Utiliser SVG avec `stroke-dasharray` et `stroke-dashoffset` pour le remplissage progressif

**Rationale**:
- Rendu vectoriel net à toutes les résolutions (retina, mobile)
- Performance excellente avec CSS transitions ou requestAnimationFrame
- Calcul simple : `dashoffset = circumference * (1 - percentage)`
- Pas de dépendance externe (Canvas API plus complexe pour ce use case)

**Alternatives considérées**:
- Canvas API : Plus complexe, nécessite gestion manuelle du re-render
- CSS conic-gradient : Support navigateur limité, moins flexible
- Bibliothèque d'animation (Framer Motion) : Overhead inutile pour ce cas simple

**Implementation**:
```typescript
// Calcul du dashoffset pour un pourcentage donné
const circumference = 2 * Math.PI * radius;
const strokeDashoffset = circumference * (1 - (minutes / 60));
```

---

### 2. Gestion du Timer

**Decision**: Hook personnalisé `useTimer` avec `requestAnimationFrame` pour la précision

**Rationale**:
- `setInterval` peut dériver dans le temps (pas synchronisé avec l'horloge système)
- `requestAnimationFrame` synchronisé avec le refresh rate du navigateur
- Calcul basé sur `Date.now()` pour précision absolue
- Pause/reprise gérées par timestamp, pas par durée écoulée

**Alternatives considérées**:
- `setInterval(1000)` : Dérive possible, moins fluide
- Web Workers : Overhead inutile pour une app simple
- Bibliothèque timer (react-timer-hook) : Dépendance non nécessaire

**Implementation**:
```typescript
const useTimer = () => {
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Calcul temps restant = totalDuration - (Date.now() - startTime - pausedTime)
};
```

---

### 3. Persistance État

**Decision**: localStorage avec serialization JSON simple

**Rationale**:
- API synchrone, simple à utiliser
- Suffisant pour un état timer simple
- Pas besoin d'IndexedDB (données volumineuses) ou sessionStorage (session unique)

**Données persistées**:
- `totalDuration`: Durée totale en secondes
- `remainingTime`: Temps restant en secondes
- `state`: 'idle' | 'running' | 'paused' | 'finished'
- `lastUpdated`: Timestamp pour calcul au rechargement

---

### 4. Configuration PWA

**Decision**: vite-plugin-pwa avec stratégie cache-first

**Rationale**:
- Intégration native avec Vite
- Génération automatique du service worker
- Cache-first optimal pour app offline-first

**Configuration clé**:
```javascript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}']
  },
  manifest: {
    name: 'TempoKids',
    short_name: 'TempoKids',
    theme_color: '#E53935',
    display: 'standalone'
  }
})
```

---

### 5. Structure des Composants

**Decision**: Composants fonctionnels avec hooks, pas de state management externe

**Rationale**:
- État simple (1 timer) ne nécessite pas Redux/Zustand
- `useState` + `useContext` suffisants si partage nécessaire
- Principe de simplicité de la constitution respecté

**Hiérarchie**:
```
App
├── DurationPicker (input heures/minutes)
├── TimerDisplay (conteneur des ronds)
│   └── ClockCircle (rond individuel SVG)
└── Controls (play/pause/reset)
```

---

### 6. Animation de Pause

**Decision**: CSS animation `pulse` avec opacité oscillante

**Rationale**:
- Indication visuelle claire de l'état pause
- Pas besoin de JavaScript pour l'animation
- Performance optimale (GPU-accelerated)

**Implementation**:
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.paused { animation: pulse 2s ease-in-out infinite; }
```

---

## Risques et Mitigations

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Drift du timer sur longues durées | Faible | Moyen | Calcul basé sur Date.now(), pas sur intervalles |
| Performance avec 12 ronds | Faible | Faible | SVG léger, pas de re-render inutile avec useMemo |
| Perte état fermeture app | Moyen | Moyen | Persistance localStorage toutes les secondes |
| Incompatibilité navigateur | Faible | Élevé | Cibler navigateurs modernes, PWA standard |

## Dépendances Externes

| Package | Version | Raison |
|---------|---------|--------|
| react | ^18.2.0 | Framework UI |
| react-dom | ^18.2.0 | Rendu DOM |
| vite-plugin-pwa | ^0.17.0 | Support PWA |
| tailwindcss | ^3.4.0 | Styling |
| typescript | ^5.3.0 | Typage statique |
| vitest | ^1.0.0 | Tests unitaires |
| @testing-library/react | ^14.0.0 | Tests composants |

**Total dépendances runtime** : 2 (React, React-DOM) - bundle minimal
