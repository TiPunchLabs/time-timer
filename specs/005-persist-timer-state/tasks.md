# Tasks: Persist Timer State on Reload

**Input**: Design documents from `/specs/005-persist-timer-state/`
**Prerequisites**: plan.md, spec.md, research.md

**Tests**: Tests are INCLUDED to validate persistence behavior

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup

**Purpose**: No setup needed - project already configured

**⚠️ SKIP**: Existing project with all dependencies already installed. useLocalStorage hook already exists.

---

## Phase 2: Foundational

**Purpose**: Modify types and remove the reset-on-mount behavior

- [X] T001 Update PersistedState type to include version field in src/types/timer.ts
- [X] T002 Remove the "clear persisted state on mount" useEffect in src/hooks/useTimer.ts (lines 40-44)

**Checkpoint**: Infrastructure ready for restoration logic

---

## Phase 3: User Story 1 - Restore Running Timer (Priority: P1) 🎯 MVP

**Goal**: Timer en cours reprend avec temps écoulé calculé après rechargement

**Independent Test**: Démarrer 10min, attendre 2min, recharger, vérifier ~8min restantes

### Implementation for User Story 1

- [X] T003 [US1] Add restoration logic for running timer in useTimer hook mount effect in src/hooks/useTimer.ts
- [X] T004 [US1] Calculate elapsed time since lastUpdated for running timers in src/hooks/useTimer.ts
- [X] T005 [US1] Handle timer expiration during absence (remainingTime <= 0) in src/hooks/useTimer.ts
- [X] T006 [P] [US1] Add test for running timer restoration in tests/hooks/useTimer.test.ts
- [X] T007 [P] [US1] Add test for timer expired during absence in tests/hooks/useTimer.test.ts

**Checkpoint**: Timer running se restaure avec temps correct

---

## Phase 4: User Story 2 - Restore Paused Timer (Priority: P2)

**Goal**: Timer en pause restauré à l'état exact

**Independent Test**: Démarrer, pause à 7:00, recharger, vérifier pause à 7:00

### Implementation for User Story 2

- [X] T008 [US2] Add restoration logic for paused timer in useTimer hook in src/hooks/useTimer.ts
- [X] T009 [US2] Ensure paused timer keeps exact remainingTime (no elapsed calculation) in src/hooks/useTimer.ts
- [X] T010 [P] [US2] Add test for paused timer restoration in tests/hooks/useTimer.test.ts
- [X] T011 [P] [US2] Add test for resume after paused restoration in tests/hooks/useTimer.test.ts

**Checkpoint**: Timer paused se restaure avec animation pulsation

---

## Phase 5: User Story 3 - Restore Configuration State (Priority: P3)

**Goal**: Durée configurée conservée après rechargement

**Independent Test**: Configurer 2h30, recharger, vérifier 2h30 affiché

### Implementation for User Story 3

- [X] T012 [US3] Add persistence of idle/configured state in useTimer hook in src/hooks/useTimer.ts
- [X] T013 [US3] Add restoration logic for idle timer with configured duration in src/hooks/useTimer.ts
- [X] T014 [P] [US3] Add test for idle timer configuration restoration in tests/hooks/useTimer.test.ts

**Checkpoint**: Configuration conservée après reload

---

## Phase 6: Edge Cases & Validation

**Purpose**: Handle edge cases and validate complete implementation

- [X] T015 Add corrupted data handling (invalid JSON, missing fields) in src/hooks/useTimer.ts
- [X] T016 [P] Add test for corrupted data fallback in tests/hooks/useTimer.test.ts
- [X] T017 Run pnpm test and verify all tests pass (no regressions)
- [X] T018 Run pnpm lint and fix any issues
- [X] T019 Run pnpm build and verify no errors
- [X] T020 Manual test: all 3 user stories on mobile browser

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skip - already configured
- **Foundational (Phase 2)**: Remove reset behavior first
- **User Story 1 (Phase 3)**: MVP - running timer restoration
- **User Story 2 (Phase 4)**: Depends on US1 foundation
- **User Story 3 (Phase 5)**: Depends on US1/US2 foundation
- **Validation (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - core restoration logic
- **User Story 2 (P2)**: Builds on US1 restoration infrastructure
- **User Story 3 (P3)**: Builds on US1/US2 restoration infrastructure

### Parallel Opportunities

**Tests peuvent être écrits en parallèle par story**:
```bash
# US1 tests
T006: Running timer restoration test
T007: Timer expired during absence test

# US2 tests
T010: Paused timer restoration test
T011: Resume after paused restoration test

# US3 tests
T014: Idle timer configuration restoration test

# Edge case tests
T016: Corrupted data fallback test
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (remove reset behavior)
2. Complete Phase 3: User Story 1 (running timer restoration)
3. **VALIDATE**: Test démarrer timer, recharger, vérifier reprise
4. Can be deployed independently

### Full Delivery

1. Complete User Story 1 (running) → Test → ✓
2. Complete User Story 2 (paused) → Test → ✓
3. Complete User Story 3 (idle config) → Test → ✓
4. Run validation (Phase 6) → Deploy

---

## Summary

| Phase | Tasks | Parallel | Story |
|-------|-------|----------|-------|
| Foundational | T001-T002 | 0 | - |
| US1: Running Timer | T003-T007 | 2 | P1 |
| US2: Paused Timer | T008-T011 | 2 | P2 |
| US3: Idle Config | T012-T014 | 1 | P3 |
| Validation | T015-T020 | 1 | - |

**Total**: 20 tasks
**Parallel opportunities**: 6 tasks (tests)
**MVP scope**: T001-T007 (7 tasks for running timer restoration)

---

## Notes

- Le hook useTimer a déjà l'infrastructure de persistance (useLocalStorage, PersistedState)
- La modification principale est de supprimer le reset on mount et ajouter la restauration
- Pour les running timers: calculer `elapsedSinceLastSave = Date.now() - savedAt`
- Pour les paused timers: restaurer remainingTime directement sans calcul
- Tous les tests existants (127) doivent continuer à passer
