# Data Model: TempoKids - Module Time-Timer

**Date**: 2025-12-20
**Feature**: [spec.md](./spec.md)

## Vue d'ensemble

Application client-side sans backend. Les données sont gérées en mémoire (React state) et persistées localement (localStorage).

## Entités

### TimerState

État principal du timer, géré par le hook `useTimer`.

```typescript
type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

interface TimerState {
  /** Durée totale configurée en secondes */
  totalDuration: number;

  /** Temps restant en secondes */
  remainingTime: number;

  /** État actuel du timer */
  status: TimerStatus;

  /** Timestamp de démarrage (pour calcul précis) */
  startedAt: number | null;

  /** Durée cumulée des pauses en millisecondes */
  pausedDuration: number;
}
```

**Transitions d'état**:
```
idle ──[start]──> running
running ──[pause]──> paused
running ──[complete]──> finished
paused ──[resume]──> running
paused ──[reset]──> idle
running ──[reset]──> idle
finished ──[reset]──> idle
```

---

### ClockCircleData

Données calculées pour chaque rond d'horloge affiché.

```typescript
interface ClockCircleData {
  /** Position dans la séquence (0 = premier rond) */
  index: number;

  /** Minutes affichées sur ce rond (0-60) */
  minutes: number;

  /** État visuel du rond */
  state: 'full' | 'partial' | 'empty';

  /** Pourcentage de remplissage (0-1) */
  fillPercentage: number;

  /** Est-ce le rond actuellement en train de se vider */
  isActive: boolean;
}
```

---

### PersistedState

Structure des données sauvegardées dans localStorage.

```typescript
interface PersistedState {
  /** Durée totale configurée en secondes */
  totalDuration: number;

  /** Temps restant au moment de la sauvegarde */
  remainingTime: number;

  /** État au moment de la sauvegarde */
  status: TimerStatus;

  /** Timestamp de la dernière sauvegarde */
  savedAt: number;
}
```

**Clé localStorage**: `tempokids_timer_state`

---

## Calculs Dérivés

### Nombre de ronds à afficher

```typescript
function getCircleCount(totalMinutes: number): number {
  return Math.ceil(totalMinutes / 60);
}
// Exemple: 150 min (2h30) → 3 ronds
```

### Données de chaque rond

```typescript
function getCirclesData(
  totalMinutes: number,
  remainingMinutes: number
): ClockCircleData[] {
  const circleCount = getCircleCount(totalMinutes);
  const circles: ClockCircleData[] = [];

  for (let i = 0; i < circleCount; i++) {
    const circleStartMinutes = (circleCount - 1 - i) * 60;
    const circleMinutes = Math.min(60, totalMinutes - circleStartMinutes);

    let state: 'full' | 'partial' | 'empty';
    let fillPercentage: number;
    let minutes: number;

    if (remainingMinutes <= circleStartMinutes) {
      // Rond vidé
      state = 'empty';
      fillPercentage = 0;
      minutes = 0;
    } else if (remainingMinutes >= circleStartMinutes + circleMinutes) {
      // Rond plein
      state = circleMinutes === 60 ? 'full' : 'partial';
      fillPercentage = circleMinutes / 60;
      minutes = circleMinutes;
    } else {
      // Rond en cours de vidage
      state = 'partial';
      minutes = remainingMinutes - circleStartMinutes;
      fillPercentage = minutes / 60;
    }

    circles.push({
      index: i,
      minutes,
      state,
      fillPercentage,
      isActive: state === 'partial' && minutes > 0 && minutes < circleMinutes
    });
  }

  return circles;
}
```

---

## Validation

### Durée

| Règle | Min | Max | Message d'erreur |
|-------|-----|-----|------------------|
| Durée totale | 1 min | 720 min (12h) | "La durée doit être entre 1 minute et 12 heures" |
| Heures | 0 | 12 | "Maximum 12 heures" |
| Minutes | 0 | 59 | "Les minutes doivent être entre 0 et 59" |

### État

| État | Actions autorisées |
|------|-------------------|
| idle | start |
| running | pause, reset |
| paused | resume, reset |
| finished | reset |

---

## Diagramme de Flux de Données

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│ DurationPicker  │────▶│   useTimer   │────▶│  TimerDisplay   │
│ (input h:m)     │     │   (state)    │     │ (calcul ronds)  │
└─────────────────┘     └──────────────┘     └─────────────────┘
                              │                      │
                              │                      ▼
                              │               ┌─────────────────┐
                              │               │  ClockCircle    │
                              │               │  (rendu SVG)    │
                              │               └─────────────────┘
                              │
                              ▼
┌─────────────────┐     ┌──────────────┐
│    Controls     │────▶│ localStorage │
│ (play/pause)    │     │ (persist)    │
└─────────────────┘     └──────────────┘
```
