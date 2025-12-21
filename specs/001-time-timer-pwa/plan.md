# Implementation Plan: TempoKids - Module Time-Timer

**Branch**: `001-time-timer-pwa` | **Date**: 2025-12-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-time-timer-pwa/spec.md`

## Summary

Application PWA React de gestion visuelle du temps pour enfants. Représentation analogique avec ronds d'horloge (1 rond = 1 heure), remplissage rouge classique style Time-Timer, contrôles play/pause/reset, rendu SVG fluide, mobile-first et fonctionnement hors ligne.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18+
**Primary Dependencies**: React, Vite, Tailwind CSS, vite-plugin-pwa
**Storage**: localStorage (persistance état timer)
**Testing**: Vitest + React Testing Library
**Target Platform**: PWA (Chrome, Safari, Firefox, Edge - mobile et desktop)
**Project Type**: Web/PWA - structure frontend uniquement
**Performance Goals**: 60 fps animation, chargement < 2s, mise à jour timer à la seconde
**Constraints**: Offline-capable, bundle léger, mobile-first
**Scale/Scope**: Application mono-page, 1-12 ronds affichables

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Implementation |
|-----------|--------|----------------|
| I. Simplicité Absolue | ✅ PASS | Interface épurée, un seul concept visuel (rond d'horloge) |
| II. Clarté Visuelle Maximale | ✅ PASS | Rouge #E53935, défilement horaire, états visuels clairs |
| III. Accessibilité Enfant | ✅ PASS | Métaphore analogique, design intuitif |
| IV. Mobile-First & Offline | ✅ PASS | vite-plugin-pwa, service worker, responsive design |
| V. Performance | ✅ PASS | requestAnimationFrame, optimisation re-renders |

**Stack Compliance**:
- ✅ React 18+ avec composants fonctionnels
- ✅ Vite comme build tool
- ✅ Tailwind CSS exclusivement
- ✅ SVG pour le rendu des cercles
- ✅ localStorage pour la persistance

## Project Structure

### Documentation (this feature)

```text
specs/001-time-timer-pwa/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # N/A - pas d'API backend
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── ClockCircle/        # Composant rond d'horloge SVG
│   │   ├── ClockCircle.tsx
│   │   └── index.ts
│   ├── TimerDisplay/       # Affichage des ronds multiples
│   │   ├── TimerDisplay.tsx
│   │   └── index.ts
│   ├── Controls/           # Boutons play/pause/reset
│   │   ├── Controls.tsx
│   │   └── index.ts
│   └── DurationPicker/     # Saisie durée heures/minutes
│       ├── DurationPicker.tsx
│       └── index.ts
├── hooks/
│   ├── useTimer.ts         # Logique du timer (state, countdown)
│   └── useLocalStorage.ts  # Persistance état
├── utils/
│   ├── time.ts             # Calculs temps, conversion minutes/heures
│   └── svg.ts              # Calculs arcs SVG (dasharray/dashoffset)
├── types/
│   └── timer.ts            # Types TypeScript (TimerState, Session)
├── App.tsx                 # Composant racine
├── main.tsx                # Point d'entrée
└── index.css               # Tailwind imports

public/
├── manifest.json           # PWA manifest
└── icons/                  # Icônes PWA (192x192, 512x512)

tests/
├── components/             # Tests composants
├── hooks/                  # Tests hooks
└── utils/                  # Tests utilitaires
```

**Structure Decision**: Structure frontend PWA simple avec séparation claire entre composants UI, logique (hooks), et utilitaires. Pas de backend - tout est client-side.

## Complexity Tracking

> Aucune violation de la constitution - pas de justification nécessaire.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| - | - | - |
