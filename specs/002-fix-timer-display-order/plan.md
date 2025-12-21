# Implementation Plan: Fix Timer Display Order

**Branch**: `002-fix-timer-display-order` | **Date**: 2025-12-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-fix-timer-display-order/spec.md`

## Summary

Corriger l'ordre d'affichage et de vidange des ronds d'horloge dans l'application TempoKids Time-Timer. Actuellement, le rond partiellement rempli est affiché en première position alors qu'il devrait être en dernière position. Le décompte doit commencer par les ronds pleins et finir par le rond partiel.

## Technical Context

**Language/Version**: TypeScript 5.6, React 18.3
**Primary Dependencies**: React, Vite, Tailwind CSS
**Storage**: localStorage (existant)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web PWA (mobile-first)
**Project Type**: Single React PWA
**Performance Goals**: Animation fluide à 60 fps
**Constraints**: Compatibilité avec l'état existant du timer

## Constitution Check

*GATE: Passed - Modification mineure respectant les principes de simplicité et clarté visuelle*

- ✅ Simplicité Absolue: Correction de logique, pas d'ajout de complexité
- ✅ Clarté Visuelle Maximale: Amélioration de la cohérence visuelle
- ✅ Performance: Aucun impact sur les performances

## Project Structure

### Documentation (this feature)

```text
specs/002-fix-timer-display-order/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklists/          # Validation checklists
└── tasks.md             # Implementation tasks
```

### Source Code (existing - to modify)

```text
src/
├── utils/
│   └── time.ts          # FIX: getCirclesData() - ordre des ronds
├── components/
│   ├── ClockCircle/
│   │   └── ClockCircle.tsx   # Vérifier le rendu SVG
│   └── TimerDisplay/
│       └── TimerDisplay.tsx  # Vérifier l'ordre d'affichage

tests/
└── utils/
    └── time.test.ts     # FIX: Mettre à jour les tests
```

## Analysis of Current Bug

### Current Behavior (Incorrect)

Dans `getCirclesData()`, la boucle calcule:
```
circleIndex = circleCount - 1 - i
```

Pour un timer de 2h30 (3 ronds):
- circles[0] → représente les minutes 120-150 (partiel 30 min) ❌ PREMIER
- circles[1] → représente les minutes 60-120 (heure 2)
- circles[2] → représente les minutes 0-60 (heure 1) ❌ DERNIER

### Expected Behavior (Correct)

Pour un timer de 2h30 (3 ronds):
- circles[0] → représente les minutes 0-60 (heure 1) - se vide EN PREMIER
- circles[1] → représente les minutes 60-120 (heure 2)
- circles[2] → représente les minutes 120-150 (partiel 30 min) - se vide EN DERNIER

### Fix Strategy

1. Modifier `getCirclesData()` pour itérer dans l'ordre naturel (0 → circleCount-1)
2. Chaque cercle représente sa tranche horaire dans l'ordre:
   - Circle 0: 0-60 min
   - Circle 1: 60-120 min
   - Circle N-1: dernier cercle (potentiellement partiel)
3. La vidange se fait naturellement: le premier cercle (0-60 min) se vide en premier

## Complexity Tracking

Aucune violation - correction simple de logique.
