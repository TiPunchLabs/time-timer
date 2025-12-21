# Implementation Plan: Persist Timer State on Reload

**Branch**: `005-persist-timer-state` | **Date**: 2025-12-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-persist-timer-state/spec.md`

## Summary

Modifier le comportement du timer pour conserver l'état lors du rechargement du navigateur. Actuellement, le rechargement de page reset le timer, ce qui est frustrant sur mobile où changer d'application provoque un rechargement. La solution utilise localStorage pour sauvegarder l'état complet du timer (durée, temps restant, statut, timestamp) et le restaurer au chargement en recalculant le temps écoulé.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18+
**Primary Dependencies**: React, Vite, Tailwind CSS (aucune nouvelle dépendance)
**Storage**: localStorage (existant, à utiliser pour la persistance)
**Testing**: Vitest + @testing-library/react
**Target Platform**: Web PWA (mobile-first, desktop compatible)
**Project Type**: Single web application (React SPA)
**Performance Goals**: Restauration instantanée (<100ms), pas d'impact sur les performances du timer
**Constraints**: Offline-capable, pas de dépendances externes, précision ±1 seconde
**Scale/Scope**: Modification du hook useTimer existant

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Statut | Notes |
|----------|--------|-------|
| **Simplicité Absolue** | ✅ PASS | Utilise localStorage existant, pas de nouvelle dépendance |
| **Clarté Visuelle Maximale** | ✅ PASS | Pas d'impact sur l'affichage |
| **Accessibilité Enfant** | ✅ PASS | Améliore l'UX - timer ne se perd plus |
| **Mobile-First & Offline** | ⚠️ VIOLATION JUSTIFIÉE | Modifie le principe "reset au reload" - voir justification |
| **Performance** | ✅ PASS | localStorage synchrone, impact négligeable |
| **Pas de dépendances inutiles** | ✅ PASS | Aucune nouvelle dépendance |

**Gate Result**: ✅ PASSED avec violation justifiée

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| "Reset au reload" changé en "Persist au reload" | Sur mobile, changer d'app provoque un rechargement involontaire qui perd le timer en cours - frustration utilisateur signalée | Aucune alternative - c'est le comportement demandé par l'utilisateur |

**Note**: La constitution sera mise à jour pour refléter ce nouveau comportement après implémentation.

## Project Structure

### Documentation (this feature)

```text
specs/005-persist-timer-state/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── checklists/          # Quality checklists
│   └── requirements.md  # Spec validation checklist
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── (no changes expected)
├── hooks/
│   ├── useTimer.ts           # MODIFY - add persistence logic
│   └── useLocalStorage.ts    # EXISTING - already available
├── types/
│   └── timer.ts              # MODIFY - add TimerPersistState type
└── constants/
    └── storage.ts            # CREATE - storage keys

tests/
└── hooks/
    └── useTimer.test.ts      # MODIFY - add persistence tests
```

**Structure Decision**: Modification minimale - principalement le hook useTimer existant. Le hook useLocalStorage existe déjà et sera réutilisé.

## Implementation Approach

### Modification du useTimer hook

1. **Définir TimerPersistState**:
   ```typescript
   interface TimerPersistState {
     initialDuration: number     // durée configurée en minutes
     remainingTime: number       // temps restant en secondes
     status: 'idle' | 'running' | 'paused'
     lastUpdated: number         // timestamp Date.now()
   }
   ```

2. **Sauvegarder l'état**:
   - À chaque changement de status (start, pause, reset)
   - À chaque tick du timer (ou toutes les secondes pour optimiser)
   - Utiliser une clé unique: `tempokids-timer-state`

3. **Restaurer l'état au mount**:
   - Lire depuis localStorage
   - Si status === 'running': calculer temps écoulé = Date.now() - lastUpdated
   - Soustraire temps écoulé du remainingTime
   - Si remainingTime <= 0: afficher état terminé
   - Sinon: reprendre le décompte

4. **Gérer les edge cases**:
   - Données corrompues → reset à l'état par défaut
   - Timer expiré pendant l'absence → afficher terminé
   - Validation des données avant restauration

### Tests à ajouter

- Test restauration timer running
- Test restauration timer paused
- Test restauration configuration idle
- Test timer expiré pendant absence
- Test données corrompues → fallback
