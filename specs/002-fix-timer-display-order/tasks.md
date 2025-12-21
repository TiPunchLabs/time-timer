# Tasks: Fix Timer Display Order

**Input**: Design documents from `/specs/002-fix-timer-display-order/`
**Prerequisites**: plan.md ✅, spec.md ✅

**Tests**: Tests unitaires existants à mettre à jour pour refléter le nouveau comportement correct.

**Organization**: Tasks groupées par user story. Comme les 3 user stories sont interdépendantes (même correction de logique), elles sont regroupées.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Peut s'exécuter en parallèle (fichiers différents, pas de dépendances)
- **[Story]**: User story concernée (US1, US2, US3)
- Chemins exacts inclus dans les descriptions

---

## Phase 1: Analyse et Tests (Préparation) ✅

**Purpose**: Comprendre le bug et préparer les tests corrigés

- [x] T001 [P] Analyser le comportement actuel de getCirclesData dans src/utils/time.ts
- [x] T002 [P] Mettre à jour les tests pour refléter le comportement attendu dans tests/utils/time.test.ts

---

## Phase 2: User Stories 1, 2, 3 - Correction de la logique (Priority: P1) ✅

**Goal**: Corriger l'ordre d'affichage et de vidange des ronds d'horloge

**Independent Test**: Configurer un timer de 2h30 et vérifier que les 2 premiers ronds sont pleins, le 3ème est partiel, et que le premier rond se vide en premier.

### Implementation

- [x] T003 [US1] Corriger la fonction getCirclesData dans src/utils/time.ts pour inverser l'ordre des ronds
- [x] T004 [US2] Vérifier que le sens de vidange horaire depuis 12h est correct dans src/utils/svg.ts
- [x] T005 [US3] Vérifier l'ordre d'affichage dans src/components/TimerDisplay/TimerDisplay.tsx

**Checkpoint**: ✅ Les ronds s'affichent dans le bon ordre (pleins d'abord, partiel en dernier)

---

## Phase 3: Validation ✅

**Purpose**: Vérifier que tous les tests passent et que le comportement est correct

- [x] T006 Exécuter les tests unitaires (pnpm test) - 42/42 passés
- [x] T007 Vérifier le build production (pnpm build) - Succès
- [x] T008 Test visuel manuel avec différentes durées (30min, 1h, 2h30, 5h) - Validé via Playwright MCP

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: Analyse - peut démarrer immédiatement
- **Phase 2**: Correction - dépend de T002 (tests mis à jour)
- **Phase 3**: Validation - dépend de Phase 2

### Task Dependencies

- T001 et T002 peuvent s'exécuter en parallèle
- T003 est la correction principale
- T004 et T005 sont des vérifications (peuvent être skip si T003 suffit)
- T006, T007, T008 sont séquentiels

---

## Implementation Strategy

### Approche TDD

1. Mettre à jour les tests pour définir le comportement attendu (T002)
2. Les tests échouent avec le code actuel
3. Corriger getCirclesData (T003)
4. Les tests passent
5. Valider visuellement

---

## Summary

| Métrique | Valeur |
|----------|--------|
| **Total tasks** | 8 |
| **Tasks complétées** | 8 |
| **Tasks restantes** | 0 |
| **Tests unitaires** | 46/46 passés |
| **Build** | ✅ Succès |
| **Fichiers modifiés** | 4 (time.ts, time.test.ts, svg.ts, svg.test.ts) |
| **Test QA visuel** | ✅ Validé via Playwright MCP |
