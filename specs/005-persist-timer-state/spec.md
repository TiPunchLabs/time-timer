# Feature Specification: Persist Timer State on Reload

**Feature Branch**: `005-persist-timer-state`
**Created**: 2025-12-21
**Status**: Draft
**Input**: User description: "Conserver l'état du timer lors du rechargement du navigateur - Lorsque l'utilisateur recharge la page ou revient sur l'application mobile après avoir fait autre chose, l'état du timer doit être restauré automatiquement."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Restore Running Timer (Priority: P1)

Lorsqu'un utilisateur a un timer en cours d'exécution et que la page se recharge (changement d'app sur mobile, refresh accidentel), le timer doit reprendre automatiquement là où il en était, en tenant compte du temps écoulé pendant le rechargement.

**Why this priority**: C'est le scénario principal signalé - sur mobile, changer d'application provoque un rechargement et perd tout le décompte en cours. Frustration maximale pour l'utilisateur.

**Independent Test**: Démarrer un timer de 10 minutes, attendre 2 minutes, recharger la page, vérifier que le timer affiche ~8 minutes restantes et continue le décompte.

**Acceptance Scenarios**:

1. **Given** timer en cours (ex: 8:30 restantes sur 10:00), **When** utilisateur recharge la page, **Then** timer reprend à ~8:30 (moins le temps de rechargement) et continue le décompte
2. **Given** timer en cours depuis 5 minutes, **When** utilisateur change d'app mobile puis revient 30s plus tard, **Then** timer affiche le temps restant correct (original - 5min - 30s)
3. **Given** timer en cours, **When** page se recharge, **Then** les cercles d'horloge affichent le bon remplissage correspondant au temps restant

---

### User Story 2 - Restore Paused Timer (Priority: P2)

Lorsqu'un utilisateur a mis le timer en pause et que la page se recharge, le timer doit être restauré en état de pause avec le temps restant exact au moment de la pause.

**Why this priority**: Scénario fréquent - l'utilisateur met en pause pour faire autre chose, puis le navigateur recharge. Moins critique car le temps n'est pas en train de s'écouler.

**Independent Test**: Démarrer un timer, le mettre en pause à 7:00, recharger la page, vérifier que le timer est toujours en pause à 7:00.

**Acceptance Scenarios**:

1. **Given** timer en pause à 7:00 restantes, **When** utilisateur recharge la page, **Then** timer reste en pause à 7:00
2. **Given** timer en pause, **When** page rechargée, **Then** animation de pulsation (pause) est active
3. **Given** timer restauré en pause, **When** utilisateur clique sur play, **Then** timer reprend le décompte depuis 7:00

---

### User Story 3 - Restore Configuration State (Priority: P3)

Lorsqu'un utilisateur a configuré une durée mais n'a pas encore démarré le timer, et que la page se recharge, la durée configurée doit être conservée.

**Why this priority**: Moins critique car l'utilisateur n'a pas encore investi de temps dans un décompte, mais améliore l'expérience en évitant de reconfigurer.

**Independent Test**: Configurer un timer de 2h30, recharger la page, vérifier que la durée affichée est toujours 2h30.

**Acceptance Scenarios**:

1. **Given** durée configurée à 2h30 (non démarré), **When** utilisateur recharge la page, **Then** durée affichée reste 2h30
2. **Given** durée configurée restaurée, **When** utilisateur clique start, **Then** timer démarre avec la durée configurée

---

### Edge Cases

- **Timer expiré pendant le rechargement**: Si le temps restant était inférieur au temps de rechargement, le timer doit afficher l'état "terminé" (0:00, cercles vides)
- **Données corrompues**: Si les données sauvegardées sont invalides ou corrompues, revenir à l'état par défaut (timer reset à 5 minutes)
- **Très long temps d'absence**: Si l'utilisateur revient après plusieurs heures (timer aurait dû se terminer), afficher l'état terminé
- **Changement de fuseau horaire**: Le calcul du temps écoulé doit être basé sur des timestamps absolus, pas sur l'heure locale

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Système DOIT sauvegarder l'état du timer (durée initiale, temps restant, état running/paused/idle) automatiquement à chaque changement d'état
- **FR-002**: Système DOIT restaurer l'état du timer au chargement de la page
- **FR-003**: Système DOIT recalculer le temps restant pour un timer en cours en tenant compte du temps écoulé depuis la dernière sauvegarde
- **FR-004**: Système DOIT restaurer l'affichage visuel (cercles) correspondant à l'état restauré
- **FR-005**: Système DOIT gérer le cas où le timer aurait dû se terminer pendant l'absence (afficher état terminé)
- **FR-006**: Système DOIT revenir à l'état par défaut si les données sauvegardées sont invalides
- **FR-007**: Système DOIT sauvegarder le timestamp de la dernière mise à jour pour calculer le temps écoulé

### Key Entities

- **TimerState**: État complet du timer (initialDuration, remainingTime, status: 'idle' | 'running' | 'paused', lastUpdated: timestamp)
- **StorageKey**: Clé unique pour identifier les données du timer dans le stockage local

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% des rechargements de page restaurent correctement l'état du timer (running, paused, ou idle)
- **SC-002**: Le temps affiché après restauration d'un timer running est précis à ±1 seconde près
- **SC-003**: Aucune régression sur les fonctionnalités existantes (tests existants passent toujours)
- **SC-004**: L'utilisateur peut quitter et revenir sur l'app mobile sans perdre son timer en cours

## Assumptions

- Le stockage local du navigateur (localStorage) est disponible et persistant
- Le rechargement de page prend moins de 5 secondes dans des conditions normales
- L'horloge système de l'appareil est fiable pour calculer le temps écoulé
- La durée maximum du timer est de 4 heures (contrainte existante)
- La durée minimum est de 1 minute (MIN_DURATION_MINUTES = 1)
