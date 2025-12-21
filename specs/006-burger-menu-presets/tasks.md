# Tasks: Burger Menu avec Durées Prédéfinies

**Input**: Design documents from `/specs/006-burger-menu-presets/`
**Prerequisites**: plan.md, spec.md

**Tests**: Tests are INCLUDED for components and accessibility

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in descriptions

---

## Phase 1: Setup

**Purpose**: No setup needed - project already configured

**⚠️ SKIP**: Existing project with all dependencies. Tailwind CSS animations déjà configurées.

---

## Phase 2: Foundational

**Purpose**: Create shared components and constants needed by all user stories

- [X] T001 Add PRESET_DURATIONS constant array in src/constants/design.ts
- [X] T002 [P] Create BurgerMenuIcon component in src/components/icons/BurgerMenuIcon.tsx
- [X] T003 [P] Export BurgerMenuIcon from src/components/icons/index.ts
- [X] T004 Create BurgerMenu directory with index.ts in src/components/BurgerMenu/

**Checkpoint**: Infrastructure ready for user story implementation

---

## Phase 3: User Story 1 - Accès Rapide aux Durées Prédéfinies (Priority: P1) 🎯 MVP

**Goal**: Utilisateur peut sélectionner une durée prédéfinie depuis le menu burger

**Independent Test**: Ouvrir menu, cliquer sur "45 min", vérifier que la durée est appliquée

### Implementation for User Story 1

- [X] T005 [US1] Create BurgerMenu component with preset duration list in src/components/BurgerMenu/BurgerMenu.tsx
- [X] T006 [US1] Add slide-in animation keyframes in tailwind.config.js
- [X] T007 [US1] Add isMenuOpen state and toggle handler in src/App.tsx
- [X] T008 [US1] Add BurgerMenuIcon button in header section of src/App.tsx
- [X] T009 [US1] Integrate BurgerMenu component in src/App.tsx
- [X] T010 [US1] Implement onSelectDuration handler that calls handleDurationChange and closes menu in src/App.tsx
- [X] T011 [P] [US1] Add test for BurgerMenu component in tests/components/BurgerMenu.test.tsx

**Checkpoint**: Menu burger fonctionnel avec sélection de durée

---

## Phase 4: User Story 2 - Fermeture du Menu (Priority: P2)

**Goal**: Utilisateur peut fermer le menu sans sélectionner de durée

**Independent Test**: Ouvrir menu, cliquer à l'extérieur ou appuyer Escape, vérifier fermeture

### Implementation for User Story 2

- [X] T012 [US2] Add backdrop/overlay with click-to-close in src/components/BurgerMenu/BurgerMenu.tsx
- [X] T013 [US2] Add close button (X) in menu header in src/components/BurgerMenu/BurgerMenu.tsx
- [X] T014 [US2] Add Escape key handler for closing menu in src/components/BurgerMenu/BurgerMenu.tsx
- [X] T015 [P] [US2] Add tests for close behaviors in tests/components/BurgerMenu.test.tsx

**Checkpoint**: Menu peut être fermé de multiples façons

---

## Phase 5: User Story 3 - Menu Accessible Pendant Timer (Priority: P3)

**Goal**: Menu reste accessible quand timer est actif et réinitialise le timer à la sélection

**Independent Test**: Démarrer timer, ouvrir menu, sélectionner durée, vérifier reset

### Implementation for User Story 3

- [X] T016 [US3] Update onSelectDuration to call actions.reset before setting new duration in src/App.tsx
- [X] T017 [US3] Ensure burger icon is always visible (not conditionally hidden) in src/App.tsx
- [X] T018 [P] [US3] Add test for reset during active timer in tests/components/BurgerMenu.test.tsx

**Checkpoint**: Menu fonctionne dans tous les états du timer

---

## Phase 6: Polish & Validation

**Purpose**: Accessibility, tests, and final validation

- [X] T019 Add aria-labels and aria-expanded to burger button in src/App.tsx
- [X] T020 Add focus trap in open menu in src/components/BurgerMenu/BurgerMenu.tsx
- [X] T021 Run pnpm test and verify all tests pass (no regressions)
- [X] T022 Run pnpm lint and fix any issues
- [X] T023 Run pnpm build and verify no errors
- [X] T024 Manual test on mobile browser

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skip - already configured
- **Foundational (Phase 2)**: Create constants and icon component first
- **User Story 1 (Phase 3)**: MVP - core menu functionality
- **User Story 2 (Phase 4)**: Depends on US1 foundation
- **User Story 3 (Phase 5)**: Depends on US1/US2 foundation
- **Validation (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - core menu selection
- **User Story 2 (P2)**: Builds on US1 menu structure
- **User Story 3 (P3)**: Builds on US1/US2 menu functionality

### Parallel Opportunities

**Foundational tasks can run in parallel**:
```
T002: BurgerMenuIcon.tsx
T003: icons/index.ts export
```

**Tests can run in parallel per story**:
```
T011: BurgerMenu component test (US1)
T015: Close behavior tests (US2)
T018: Reset during timer test (US3)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001-T004)
2. Complete Phase 3: User Story 1 (T005-T011)
3. **VALIDATE**: Test menu ouverture, sélection durée, fermeture
4. Can be deployed independently

### Full Delivery

1. Complete User Story 1 (menu + selection) → Test → ✓
2. Complete User Story 2 (close behaviors) → Test → ✓
3. Complete User Story 3 (timer reset) → Test → ✓
4. Run validation (Phase 6) → Deploy

---

## Summary

| Phase | Tasks | Parallel | Story |
|-------|-------|----------|-------|
| Foundational | T001-T004 | 2 | - |
| US1: Menu Selection | T005-T011 | 1 | P1 |
| US2: Close Behaviors | T012-T015 | 1 | P2 |
| US3: Timer Reset | T016-T018 | 1 | P3 |
| Validation | T019-T024 | 0 | - |

**Total**: 24 tasks
**Parallel opportunities**: 5 tasks
**MVP scope**: T001-T011 (11 tasks for menu with preset selection)

---

## Notes

- Le projet utilise déjà Tailwind CSS, pas besoin d'ajouter de dépendances
- Les animations peuvent utiliser les transitions Tailwind natives ou des keyframes custom
- L'icône burger doit suivre le style des autres icônes (text-blue-500, w-6 h-6)
- Les durées prédéfinies: 30, 45, 75 (1h15), 90 (1h30), 120 (2h), 150 (2h30) minutes
- Tous les 134 tests existants doivent continuer à passer
