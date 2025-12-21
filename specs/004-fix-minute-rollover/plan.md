# Implementation Plan: Fix Minute Rollover

**Branch**: `004-fix-minute-rollover` | **Date**: 2025-12-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-fix-minute-rollover/spec.md`

## Summary

Corriger le comportement du DurationPicker pour permettre le rollover des minutes :
- **Increment**: À 55 minutes, cliquer sur + ajoute 1 heure et remet les minutes à 0
- **Decrement**: À 0 minutes (avec heures > 0), cliquer sur - retire 1 heure et met les minutes à 55

## Technical Context

**Language/Version**: TypeScript 5.x, React 18+
**Primary Dependencies**: React, Vite, Tailwind CSS (aucune nouvelle dépendance)
**Storage**: N/A (pas de persistence pour cette feature)
**Testing**: Vitest + @testing-library/react
**Target Platform**: Web PWA (mobile-first, desktop compatible)
**Project Type**: Single web application (React SPA)
**Performance Goals**: Pas d'impact - simple modification de logique
**Constraints**: Respecter les limites existantes (5 min - 4h), pas de régression
**Scale/Scope**: Modification d'un seul composant (DurationPicker)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Statut | Notes |
|----------|--------|-------|
| **Simplicité Absolue** | ✅ PASS | Modification mineure de logique existante |
| **Clarté Visuelle Maximale** | ✅ PASS | Améliore l'UX - accès plus facile aux heures rondes |
| **Accessibilité Enfant** | ✅ PASS | Comportement plus intuitif pour les enfants |
| **Mobile-First & Offline** | ✅ PASS | Pas d'impact |
| **Performance** | ✅ PASS | Pas d'impact |
| **Pas de dépendances inutiles** | ✅ PASS | Aucune nouvelle dépendance |

**Gate Result**: ✅ PASSED - La modification respecte tous les principes

## Project Structure

### Documentation (this feature)

```text
specs/004-fix-minute-rollover/
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
│   └── DurationPicker/
│       └── DurationPicker.tsx  # MODIFY - add rollover logic
└── constants/
    └── design.ts               # READ - MAX_HOURS, MIN_DURATION_MINUTES

tests/
└── components/
    └── DurationPicker.test.tsx # MODIFY - add rollover tests
```

**Structure Decision**: Modification minimale - un seul fichier source et un fichier de test.

## Complexity Tracking

> Aucune violation de constitution - section non applicable

## Implementation Approach

### Modification du DurationPicker

1. **Modifier `incrementMinutes()`**:
   - Si `minutes === 55` ET `hours < MAX_HOURS`: incrémenter heures, remettre minutes à 0
   - Sinon: comportement existant (incrément de 5)

2. **Modifier `decrementMinutes()`**:
   - Si `minutes === 0` ET `hours > 0`: décrémenter heures, mettre minutes à 55
   - Sinon: comportement existant (décrément de 5)

3. **Mettre à jour les conditions de désactivation**:
   - Bouton + minutes: désactivé si `hours === MAX_HOURS && minutes === 0`
   - Bouton - minutes: désactivé si `hours === 0 && minutes <= 5`

### Tests à ajouter

- Test rollover increment: 55 → 0 avec hour++
- Test rollover decrement: 0 → 55 avec hour--
- Test limites max (4h00 bloqué)
- Test limites min (0h05 bloqué)
