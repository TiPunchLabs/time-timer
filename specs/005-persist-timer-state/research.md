# Research: Persist Timer State on Reload

**Feature**: 005-persist-timer-state
**Date**: 2025-12-21

## Research Summary

Cette feature ne nécessite pas de recherche externe - elle utilise des patterns et technologies déjà présents dans le projet.

## Decision 1: Storage Mechanism

**Decision**: Utiliser localStorage avec le hook useLocalStorage existant

**Rationale**:
- Le projet utilise déjà localStorage (voir constitution ligne 67)
- Le hook useLocalStorage existe déjà dans src/hooks/
- Synchrone, donc pas de complexité async
- Persistant même après fermeture du navigateur
- Fonctionne offline (requis pour PWA)

**Alternatives considered**:
- sessionStorage: Rejeté - ne persiste pas entre sessions/onglets
- IndexedDB: Rejeté - complexité inutile pour des données simples
- Service Worker cache: Rejeté - pas adapté pour l'état dynamique

## Decision 2: Timestamp Strategy

**Decision**: Utiliser Date.now() pour les timestamps

**Rationale**:
- Retourne un nombre de millisecondes depuis epoch
- Indépendant du fuseau horaire
- Permet de calculer précisément le temps écoulé
- Supporté universellement

**Alternatives considered**:
- Date ISO string: Rejeté - nécessite parsing, plus complexe
- Performance.now(): Rejeté - relatif au chargement de la page, pas persistable

## Decision 3: State Structure

**Decision**: Sauvegarder un objet complet avec toutes les informations nécessaires

```typescript
interface TimerPersistState {
  initialDuration: number  // minutes
  remainingTime: number    // secondes
  status: 'idle' | 'running' | 'paused'
  lastUpdated: number      // timestamp
  version: number          // pour migrations futures
}
```

**Rationale**:
- Toutes les données nécessaires pour restaurer l'état exact
- Version field permet d'évoluer le format sans casser la compatibilité
- Format simple et lisible

## Decision 4: Save Frequency

**Decision**: Sauvegarder à chaque changement d'état + toutes les 5 secondes pendant running

**Rationale**:
- Chaque changement d'état (start/pause/reset) est critique
- Pendant running, sauvegarder périodiquement pour limiter la perte
- 5 secondes est un bon compromis performance/précision
- localStorage est synchrone donc rapide

**Alternatives considered**:
- Sauvegarder à chaque tick (1s): Rejeté - trop fréquent
- Sauvegarder uniquement aux transitions: Rejeté - perte jusqu'à 4h si crash

## Implementation Notes

1. **Pas de nouvelle dépendance** - utiliser le code existant
2. **Modifier useTimer.ts** - ajouter la logique de persistence
3. **Ajouter des tests** - couvrir les scénarios de restauration
4. **Gérer les edge cases** - données corrompues, timer expiré
