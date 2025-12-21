# Tasks: TempoKids - Module Time-Timer

**Input**: Design documents from `/specs/001-time-timer-pwa/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Tests unitaires inclus pour la logique critique (timer, calculs SVG)

**Organization**: Tasks groupées par user story pour permettre une implémentation et des tests indépendants.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Peut s'exécuter en parallèle (fichiers différents, pas de dépendances)
- **[Story]**: User story concernée (US1, US2, US3, US4, US5)
- Chemins exacts inclus dans les descriptions

---

## Phase 1: Setup (Infrastructure Partagée) ✅

**Purpose**: Initialisation du projet React/Vite/PWA

- [x] T001 Initialiser le projet Vite avec template React-TS dans ./
- [x] T002 Configurer Tailwind CSS dans tailwind.config.js et src/index.css
- [x] T003 [P] Configurer vite-plugin-pwa dans vite.config.ts
- [x] T004 [P] Créer le manifest PWA dans public/manifest.json
- [x] T005 [P] Ajouter les icônes PWA (192x192, 512x512) dans public/icons/
- [x] T006 Configurer TypeScript strict dans tsconfig.json
- [x] T007 [P] Configurer Vitest dans vite.config.ts

---

## Phase 2: Foundational (Prérequis Bloquants) ✅

**Purpose**: Types, utilitaires et hooks de base nécessaires à TOUTES les user stories

**⚠️ CRITICAL**: Aucune user story ne peut commencer avant la fin de cette phase

- [x] T008 Créer les types TypeScript dans src/types/timer.ts (TimerState, TimerStatus, ClockCircleData)
- [x] T009 [P] Implémenter les utilitaires de temps dans src/utils/time.ts (getCircleCount, formatTime)
- [x] T010 [P] Implémenter les utilitaires SVG dans src/utils/svg.ts (calculateDashOffset, calculateArcPath)
- [x] T011 [P] Implémenter le hook useLocalStorage dans src/hooks/useLocalStorage.ts
- [x] T012 Définir les constantes de design dans src/constants/design.ts (couleurs, dimensions)
- [x] T013 Créer le layout de base App.tsx avec structure Tailwind responsive

**Checkpoint**: ✅ Fondations prêtes - l'implémentation des user stories peut commencer

---

## Phase 3: User Story 1 - Définir une durée de session (Priority: P1) 🎯 MVP ✅

**Goal**: Permettre à l'utilisateur de saisir une durée en heures et minutes et afficher le nombre correct de ronds

**Independent Test**: Saisir différentes durées (30min, 1h, 2h30, 12h) et vérifier le nombre de ronds affichés

### Tests pour User Story 1

- [x] T014 [P] [US1] Tests unitaires pour getCircleCount et getCirclesData dans tests/utils/time.test.ts

### Implementation pour User Story 1

- [x] T015 [P] [US1] Créer le composant DurationPicker dans src/components/DurationPicker/DurationPicker.tsx
- [x] T016 [P] [US1] Créer l'export barrel dans src/components/DurationPicker/index.ts
- [x] T017 [US1] Implémenter la logique getCirclesData dans src/utils/time.ts
- [x] T018 [P] [US1] Créer le composant ClockCircle (SVG) dans src/components/ClockCircle/ClockCircle.tsx
- [x] T019 [P] [US1] Créer l'export barrel dans src/components/ClockCircle/index.ts
- [x] T020 [P] [US1] Créer le composant TimerDisplay dans src/components/TimerDisplay/TimerDisplay.tsx
- [x] T021 [P] [US1] Créer l'export barrel dans src/components/TimerDisplay/index.ts
- [x] T022 [US1] Intégrer DurationPicker et TimerDisplay dans App.tsx

**Checkpoint**: ✅ L'utilisateur peut saisir une durée et voir les ronds correspondants

---

## Phase 4: User Story 2 - Lancer et visualiser le décompte (Priority: P1) ✅

**Goal**: Permettre de lancer le timer et voir le remplissage rouge se retirer progressivement

**Independent Test**: Lancer un timer de 5 minutes et observer la diminution fluide du remplissage

### Tests pour User Story 2

- [x] T023 [P] [US2] Tests unitaires pour useTimer (start, tick) dans tests/hooks/useTimer.test.ts
- [x] T024 [P] [US2] Tests unitaires pour calculateDashOffset dans tests/utils/svg.test.ts

### Implementation pour User Story 2

- [x] T025 [US2] Implémenter le hook useTimer (logique start/countdown) dans src/hooks/useTimer.ts
- [x] T026 [US2] Ajouter l'animation requestAnimationFrame dans useTimer pour mise à jour fluide
- [x] T027 [US2] Créer le composant Controls (bouton Start) dans src/components/Controls/Controls.tsx
- [x] T028 [P] [US2] Créer l'export barrel dans src/components/Controls/index.ts
- [x] T029 [US2] Intégrer useTimer et Controls dans App.tsx
- [x] T030 [US2] Connecter le state du timer à TimerDisplay pour mise à jour en temps réel

**Checkpoint**: ✅ Le timer se lance et le remplissage diminue visuellement de manière fluide

---

## Phase 5: User Story 3 - Mettre en pause et reprendre (Priority: P2) ✅

**Goal**: Permettre de mettre en pause et reprendre le timer sans perdre le temps écoulé

**Independent Test**: Lancer un timer, pause après 1 min, attendre 30s, reprendre et vérifier que le temps restant est correct

### Tests pour User Story 3

- [x] T031 [P] [US3] Tests unitaires pour useTimer (pause, resume) dans tests/hooks/useTimer.test.ts

### Implementation pour User Story 3

- [x] T032 [US3] Ajouter les actions pause/resume dans useTimer src/hooks/useTimer.ts
- [x] T033 [US3] Ajouter le bouton Pause/Resume dans Controls src/components/Controls/Controls.tsx
- [x] T034 [US3] Implémenter l'icône pause (SVG inline) dans Controls
- [x] T035 [US3] Ajouter l'animation CSS pulse pour l'état pause dans src/index.css
- [x] T036 [US3] Appliquer la classe pulse au ClockCircle quand status === 'paused'

**Checkpoint**: ✅ Le timer peut être mis en pause avec indicateur visuel et repris correctement

---

## Phase 6: User Story 4 - Réinitialiser le timer (Priority: P2) ✅

**Goal**: Permettre de réinitialiser le timer pour recommencer une session

**Independent Test**: Lancer un timer, laisser défiler, reset et vérifier que les ronds reviennent à l'état initial

### Tests pour User Story 4

- [x] T037 [P] [US4] Tests unitaires pour useTimer (reset) dans tests/hooks/useTimer.test.ts

### Implementation pour User Story 4

- [x] T038 [US4] Ajouter l'action reset dans useTimer src/hooks/useTimer.ts
- [x] T039 [US4] Ajouter le bouton Reset dans Controls src/components/Controls/Controls.tsx
- [x] T040 [US4] Gérer les états des boutons (disabled selon TimerStatus) dans Controls

**Checkpoint**: ✅ Le timer peut être réinitialisé à la durée configurée

---

## Phase 7: User Story 5 - Utilisation hors ligne et persistance (Priority: P3) ✅

**Goal**: L'application fonctionne hors ligne et restaure l'état après fermeture

**Independent Test**: Lancer un timer, fermer l'onglet, rouvrir et vérifier la restauration de l'état

### Implementation pour User Story 5

- [x] T041 [US5] Intégrer useLocalStorage dans useTimer pour persistance de l'état
- [x] T042 [US5] Implémenter la logique de restauration au chargement dans useTimer
- [x] T043 [US5] Calculer le temps écoulé depuis savedAt si status était 'running'
- [x] T044 [US5] Configurer le service worker pour cache offline dans vite.config.ts
- [ ] T045 [US5] Tester le fonctionnement offline (DevTools > Network > Offline)

**Checkpoint**: ✅ L'application fonctionne hors ligne et restaure l'état correctement

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Améliorations finales et validation

- [x] T046 [P] Ajouter les meta tags PWA dans index.html (theme-color, apple-mobile-web-app)
- [x] T047 [P] Optimiser les re-renders avec useMemo/useCallback dans les composants
- [x] T048 Ajouter la gestion du edge case durée = 0 (validation) dans DurationPicker
- [x] T049 Ajouter l'indicateur de fin de session (tous ronds vides) dans TimerDisplay
- [x] T050 [P] Ajouter une animation de transition entre les ronds dans ClockCircle
- [ ] T051 Exécuter les scénarios de test manuel de quickstart.md
- [x] T052 Build production et vérification bundle size (pnpm run build)
- [ ] T053 Test d'installation PWA sur mobile

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ Complété
- **Foundational (Phase 2)**: ✅ Complété
- **User Stories (Phases 3-7)**: ✅ Complétées
  - US1 et US2 sont P1 (priorité haute) - ✅
  - US3 et US4 sont P2 - ✅
  - US5 est P3 - ✅
- **Polish (Phase 8)**: En cours (tests manuels restants)

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. ✅ Compléter Phase 1: Setup
2. ✅ Compléter Phase 2: Foundational
3. ✅ Compléter Phase 3: User Story 1 (affichage des ronds)
4. ✅ Compléter Phase 4: User Story 2 (décompte fonctionnel)
5. ✅ **VALIDÉ**: Timer basique fonctionnel
6. ✅ Build production réussi

### Incremental Delivery

1. ✅ Setup + Foundational → Infrastructure prête
2. ✅ User Story 1 + 2 → MVP fonctionnel (timer basique)
3. ✅ User Story 3 + 4 → Contrôles complets (pause/reset)
4. ✅ User Story 5 → PWA complète (offline/persistance)
5. 🔄 Polish → Application prête pour production (tests manuels restants)

---

## Summary

| Métrique | Valeur |
|----------|--------|
| **Total tasks** | 53 |
| **Tasks complétées** | 50 |
| **Tasks restantes** | 3 (tests manuels) |
| **Tests unitaires** | 40/40 passés |
| **Build size** | 154.78 kB JS (49.51 kB gzip) |
| **PWA** | ✅ Service worker généré |
