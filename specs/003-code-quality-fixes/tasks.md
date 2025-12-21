# Tasks: Code Quality Fixes

**Input**: Design documents from `/specs/003-code-quality-fixes/`
**Prerequisites**: plan.md, spec.md, research.md

**Tests**: Tests are INCLUDED as per spec FR-011, FR-012

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create directory structure for new components

- [X] T001 Create directory src/components/ErrorBoundary/
- [X] T002 [P] Create directory src/components/OfflineIndicator/
- [X] T003 [P] Create directory src/components/icons/
- [X] T004 [P] Create directory tests/components/

**Checkpoint**: Directory structure ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational blocking tasks - project is already fully configured

**⚠️ SKIP**: Existing project with all dependencies already installed

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Error Boundary (Priority: P1) 🎯 MVP

**Goal**: Capturer toutes les erreurs React pour éviter les crashs applicatifs

**Independent Test**: Simuler une erreur dans un composant et vérifier que le fallback UI s'affiche

### Implementation for User Story 1

- [X] T005 [US1] Create ErrorBoundary component in src/components/ErrorBoundary/ErrorBoundary.tsx
- [X] T006 [US1] Create barrel export in src/components/ErrorBoundary/index.ts
- [X] T007 [US1] Wrap main content with ErrorBoundary in src/App.tsx
- [X] T008 [P] [US1] Create ErrorBoundary test in tests/components/ErrorBoundary.test.tsx

**Checkpoint**: Error Boundary fonctionnel - les erreurs sont capturées avec fallback UI

---

## Phase 4: User Story 2 - Network Status Indicator (Priority: P2)

**Goal**: Informer l'utilisateur de l'état réseau offline/online

**Independent Test**: Désactiver le réseau et vérifier l'apparition de l'indicateur

### Implementation for User Story 2

- [X] T009 [US2] Create useNetworkStatus hook in src/hooks/useNetworkStatus.ts
- [X] T010 [P] [US2] Create OfflineIndicator component in src/components/OfflineIndicator/OfflineIndicator.tsx
- [X] T011 [US2] Create barrel export in src/components/OfflineIndicator/index.ts
- [X] T012 [US2] Integrate OfflineIndicator in src/App.tsx
- [X] T013 [P] [US2] Create useNetworkStatus test in tests/hooks/useNetworkStatus.test.ts
- [X] T014 [P] [US2] Create OfflineIndicator test in tests/components/OfflineIndicator.test.tsx

**Checkpoint**: Indicateur réseau fonctionnel - visible hors ligne, masqué en ligne

---

## Phase 5: User Story 3 - Focus Visible Accessibility (Priority: P2)

**Goal**: Rendre tous les boutons accessibles au clavier avec focus visible

**Independent Test**: Naviguer au Tab et vérifier la visibilité du focus ring

### Implementation for User Story 3

- [X] T015 [US3] Add focus:ring-2 focus:ring-offset-2 focus:ring-red-500 to buttons in src/components/Controls/Controls.tsx
- [X] T016 [P] [US3] Add focus visible to buttons in src/components/DurationPicker/DurationPicker.tsx
- [X] T017 [US3] Update Controls test for focus accessibility in tests/components/Controls.test.tsx

**Checkpoint**: Tous les boutons ont un focus visible avec anneau rouge

---

## Phase 6: User Story 4 - Viewport Zoom Accessibility (Priority: P3)

**Goal**: Permettre le zoom sur mobile pour les utilisateurs malvoyants

**Independent Test**: Essayer pinch-to-zoom sur mobile

### Implementation for User Story 4

- [X] T018 [US4] Remove user-scalable=no and maximum-scale=1.0 from viewport meta in index.html

**Checkpoint**: Zoom mobile autorisé - WCAG compliant

---

## Phase 7: User Story 5 - Component Tests (Priority: P3)

**Goal**: Ajouter des tests de composants pour prévenir les régressions

**Independent Test**: Exécuter pnpm test et vérifier que tous les tests passent

### Tests for User Story 5

- [X] T019 [P] [US5] Create ClockCircle component test in tests/components/ClockCircle.test.tsx
- [X] T020 [P] [US5] Create Controls component test in tests/components/Controls.test.tsx
- [X] T021 [P] [US5] Create DurationPicker component test in tests/components/DurationPicker.test.tsx
- [X] T022 [P] [US5] Create TimerDisplay component test in tests/components/TimerDisplay.test.tsx

**Checkpoint**: Tous les composants ont des tests - couverture >= 80%

---

## Phase 8: User Story 6 - Code Maintainability (Priority: P4)

**Goal**: Supprimer la duplication et améliorer l'organisation du code

**Independent Test**: Vérifier que tous les tests passent après refactoring

### Implementation for User Story 6

- [X] T023 [US6] Remove formatTimeDisplay function and use formatTime from utils/time.ts in src/App.tsx
- [X] T024 [P] [US6] Extract TimerIcon to src/components/icons/TimerIcon.tsx
- [X] T025 [P] [US6] Extract CheckIcon to src/components/icons/CheckIcon.tsx
- [X] T026 [P] [US6] Extract PlayIcon to src/components/icons/PlayIcon.tsx
- [X] T027 [P] [US6] Extract PauseIcon to src/components/icons/PauseIcon.tsx
- [X] T028 [P] [US6] Extract ResetIcon to src/components/icons/ResetIcon.tsx
- [X] T029 [US6] Create barrel export in src/components/icons/index.ts
- [X] T030 [US6] Update src/App.tsx to import icons from components/icons/
- [X] T031 [US6] Update src/components/Controls/Controls.tsx to import icons from components/icons/

**Checkpoint**: Code DRY - une seule source pour chaque fonction/composant

---

## Phase 9: PWA Improvements

**Purpose**: Améliorer la configuration PWA pour score Lighthouse 100

- [X] T032 Add navigateFallback: '/index.html' to workbox config in vite.config.ts

**Checkpoint**: Configuration PWA complète

---

## Phase 10: Polish & Validation

**Purpose**: Vérification finale et qualité

- [X] T033 Run pnpm test and verify all tests pass
- [X] T034 Run pnpm lint and fix any issues
- [X] T035 Run pnpm build and verify no errors
- [X] T036 Verify Lighthouse scores (Accessibility >= 95, PWA = 100)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - créer les répertoires
- **Foundational (Phase 2)**: Skip - projet déjà configuré
- **User Stories (Phase 3-8)**: Peuvent démarrer après Setup
  - US1 (Error Boundary) peut être fait en parallèle de US2-US4
  - US5 (Tests) dépend de US1-US4 pour tester les nouvelles fonctionnalités
  - US6 (Refactoring) peut être fait en parallèle mais avant tests finaux
- **PWA (Phase 9)**: Indépendant - peut être fait en parallèle
- **Polish (Phase 10)**: Dépend de toutes les phases précédentes

### User Story Dependencies

- **US1 (P1)**: Indépendant - MVP
- **US2 (P2)**: Indépendant - peut démarrer en parallèle de US1
- **US3 (P2)**: Indépendant - peut démarrer en parallèle de US1-US2
- **US4 (P3)**: Indépendant - tâche unique
- **US5 (P3)**: Dépend de US1-US4 pour tests complets
- **US6 (P4)**: Indépendant mais avant tests finaux

### Parallel Opportunities

**Après Phase 1**:
```bash
# En parallèle:
US1: T005, T006, T007, T008
US2: T009, T010, T011, T012, T013, T014
US3: T015, T016
US4: T018
```

**Phase 8 (Icons extraction)**:
```bash
# Toutes les icônes en parallèle:
T024, T025, T026, T027, T028
```

**Phase 7 (Tests composants)**:
```bash
# Tous les tests en parallèle:
T019, T020, T021, T022
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup directories
2. Complete Phase 3: Error Boundary (US1)
3. **VALIDATE**: Tester que les erreurs sont capturées
4. Deploy/demo si prêt

### Incremental Delivery

1. Setup → Error Boundary (US1) → Test → MVP!
2. Add Network Status (US2) → Test → Demo
3. Add Focus Visible (US3) + Viewport (US4) → Test → Demo
4. Add Component Tests (US5) → Couverture complète
5. Add Refactoring (US6) → Code propre
6. Final validation → Lighthouse scores

---

## Summary

| Phase | Tasks | Parallel | Story |
|-------|-------|----------|-------|
| Setup | T001-T004 | 3 | - |
| US1: Error Boundary | T005-T008 | 1 | P1 |
| US2: Network Status | T009-T014 | 3 | P2 |
| US3: Focus Visible | T015-T017 | 1 | P2 |
| US4: Viewport Zoom | T018 | 0 | P3 |
| US5: Component Tests | T019-T022 | 4 | P3 |
| US6: Maintainability | T023-T031 | 5 | P4 |
| PWA | T032 | 0 | - |
| Polish | T033-T036 | 0 | - |

**Total**: 36 tasks
**Parallel opportunities**: 17 tasks can run in parallel
**MVP scope**: T001-T008 (8 tasks for Error Boundary)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story
- All tests marked [P] can run in parallel within their phase
- All icon extractions (T024-T028) can run in parallel
- Commit after each logical group of tasks
- Verify pnpm test passes after each user story
