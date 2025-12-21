# Tasks: Fix Minute Rollover

**Input**: Design documents from `/specs/004-fix-minute-rollover/`
**Prerequisites**: plan.md, spec.md, research.md

**Tests**: Tests are INCLUDED to validate rollover behavior

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: Setup

**Purpose**: No setup needed - project already configured

**⚠️ SKIP**: Existing project with all dependencies already installed

---

## Phase 2: Foundational

**Purpose**: No foundational tasks - modifications only to existing component

**⚠️ SKIP**: Feature is a bug fix in existing component

---

## Phase 3: User Story 1 - Minute Increment Rollover (Priority: P1) 🎯 MVP

**Goal**: À 55 minutes, cliquer sur + ajoute 1 heure et remet les minutes à 0

**Independent Test**: Configurer 0h55, cliquer sur + minutes, vérifier que le résultat est 1h00

### Implementation for User Story 1

- [X] T001 [US1] Modify incrementMinutes function to handle rollover at 55 in src/components/DurationPicker/DurationPicker.tsx
- [X] T002 [US1] Update + minutes button disabled condition to check for max (4h00) in src/components/DurationPicker/DurationPicker.tsx
- [X] T003 [P] [US1] Add rollover increment tests (55→0 with hour++) in tests/components/DurationPicker.test.tsx

**Checkpoint**: Rollover 55→0 fonctionne, bouton désactivé à 4h00

---

## Phase 4: User Story 2 - Minute Decrement Rollover (Priority: P2)

**Goal**: À 0 minutes (avec heures > 0), cliquer sur - retire 1 heure et met les minutes à 55

**Independent Test**: Configurer 2h00, cliquer sur - minutes, vérifier que le résultat est 1h55

### Implementation for User Story 2

- [X] T004 [US2] Modify decrementMinutes function to handle rollover at 0 in src/components/DurationPicker/DurationPicker.tsx
- [X] T005 [US2] Update - minutes button disabled condition to check for min (0h05) in src/components/DurationPicker/DurationPicker.tsx
- [X] T006 [P] [US2] Add rollover decrement tests (0→55 with hour--) in tests/components/DurationPicker.test.tsx

**Checkpoint**: Rollover 0→55 fonctionne, bouton désactivé à 0h05

---

## Phase 5: Polish & Validation

**Purpose**: Vérification finale et qualité

- [X] T007 Run pnpm test and verify all tests pass (no regressions)
- [X] T008 Run pnpm lint and fix any issues
- [X] T009 Run pnpm build and verify no errors
- [X] T010 Manual test: navigate through all durations using only +/- buttons

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Skip - already configured
- **Foundational (Phase 2)**: Skip - existing component
- **User Story 1 (Phase 3)**: MVP - increment rollover
- **User Story 2 (Phase 4)**: Decrement rollover (can be done in parallel with US1)
- **Polish (Phase 5)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - increment logic
- **User Story 2 (P2)**: Independent - decrement logic
- Both stories modify the same file but different functions

### Parallel Opportunities

**User Stories peuvent être faites en parallèle**:
```bash
# US1 et US2 modifient des fonctions différentes
US1: incrementMinutes() + tests
US2: decrementMinutes() + tests
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1 (increment rollover)
2. **VALIDATE**: Test 0h55 → 1h00
3. Can be deployed independently

### Full Delivery

1. Complete User Story 1 (increment) → Test → ✓
2. Complete User Story 2 (decrement) → Test → ✓
3. Run validation (Phase 5) → Deploy

---

## Summary

| Phase | Tasks | Parallel | Story |
|-------|-------|----------|-------|
| US1: Increment Rollover | T001-T003 | 1 | P1 |
| US2: Decrement Rollover | T004-T006 | 1 | P2 |
| Polish | T007-T010 | 0 | - |

**Total**: 10 tasks
**Parallel opportunities**: 2 tasks (tests)
**MVP scope**: T001-T003 (3 tasks for increment rollover)

---

## Notes

- Simple fix: modifications to existing component
- No new files created
- Both user stories modify DurationPicker.tsx but different functions
- Tests verify no regressions on existing behavior
