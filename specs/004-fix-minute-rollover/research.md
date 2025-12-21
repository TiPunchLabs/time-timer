# Research: Fix Minute Rollover

**Feature Branch**: `004-fix-minute-rollover`
**Date**: 2025-12-20

## Summary

Cette feature est une correction de comportement simple qui n'introduit aucune nouvelle technologie. La recherche se concentre sur les meilleures pratiques d'implémentation.

## Research Topics

### 1. Rollover Logic Pattern

**Decision**: Modifier les fonctions `incrementMinutes` et `decrementMinutes` inline

**Rationale**:
- Logique simple (if/else)
- Pas besoin d'abstraction supplémentaire
- Maintient la cohérence avec le code existant

**Alternatives considered**:
- Fonction utilitaire séparée → Rejeté: sur-ingénierie pour 2-3 lignes de code
- Hook personnalisé → Rejeté: la logique reste dans le composant

**Implementation Pattern**:
```typescript
const incrementMinutes = () => {
  if (minutes === 55 && hours < MAX_HOURS) {
    // Rollover: 55 → 0, hours++
    handleHoursChange(hours + 1)
    handleMinutesChange(0)
  } else {
    handleMinutesChange(minutes + 5)
  }
}

const decrementMinutes = () => {
  if (minutes === 0 && hours > 0) {
    // Rollover: 0 → 55, hours--
    handleHoursChange(hours - 1)
    handleMinutesChange(55)
  } else {
    handleMinutesChange(minutes - 5)
  }
}
```

### 2. Button Disable Conditions

**Decision**: Mettre à jour les conditions `disabled` des boutons

**Rationale**:
- Le bouton + minutes doit être désactivé à 4h00 exactement (max atteint)
- Le bouton - minutes doit être désactivé à 0h05 ou moins (min atteint)

**Current behavior** (à corriger):
```typescript
// Actuel - ne permet pas le rollover
disabled={toMinutes(hours, minutes + 5) > MAX_DURATION_MINUTES}
```

**New behavior**:
```typescript
// Nouveau - permet le rollover sauf au max
disabled={hours >= MAX_HOURS && minutes === 0}
```

### 3. Test Strategy

**Decision**: Ajouter des tests spécifiques pour le rollover

**Test cases**:
1. Increment: 0h55 → 1h00
2. Increment: 1h55 → 2h00
3. Increment: 3h55 → 4h00
4. Decrement: 1h00 → 0h55
5. Decrement: 2h00 → 1h55
6. Decrement: 4h00 → 3h55
7. Edge: 4h00 + disabled
8. Edge: 0h05 - disabled

## Dependencies Impact

| Dépendance | Action | Impact Bundle |
|------------|--------|---------------|
| React (existant) | Aucun ajout | 0 KB |
| @testing-library/react (existant) | Aucun ajout | 0 KB (dev only) |

**Total Bundle Impact**: 0 KB - Aucune nouvelle dépendance

## Conclusion

Cette feature n'introduit aucune nouvelle technologie. Elle corrige le comportement du DurationPicker en ajoutant une logique de rollover simple. L'implémentation peut procéder directement.
