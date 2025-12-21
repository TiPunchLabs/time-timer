# Feature Specification: TempoKids - Module Time-Timer

**Feature Branch**: `001-time-timer-pwa`
**Created**: 2025-12-20
**Status**: Draft
**Input**: Application PWA de gestion visuelle du temps pour enfants avec ronds d'horloge analogiques (1 rond = 1 heure), contrôles play/pause/reset, rendu SVG, style Time-Timer rouge classique, mobile-first, fonctionnement hors ligne

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Définir une durée de session (Priority: P1)

En tant que parent ou éducateur, je veux définir une durée précise pour une activité (en heures et minutes) afin que l'enfant sache exactement combien de temps l'activité va durer.

**Why this priority**: C'est la fonctionnalité fondamentale - sans possibilité de définir une durée, l'application n'a pas de valeur.

**Independent Test**: Peut être testé en saisissant différentes durées (30 min, 1h, 2h30) et en vérifiant que le nombre de ronds affichés correspond à la durée arrondie à l'heure supérieure.

**Acceptance Scenarios**:

1. **Given** l'application est ouverte, **When** l'utilisateur saisit 1h45, **Then** 2 ronds sont affichés (1 plein à 60 min, 1 rempli à 45 min)
2. **Given** l'application est ouverte, **When** l'utilisateur saisit 30 min, **Then** 1 rond est affiché rempli à 50% (de 12h à 6h)
3. **Given** l'application est ouverte, **When** l'utilisateur saisit 3h00, **Then** 3 ronds pleins sont affichés

---

### User Story 2 - Lancer et visualiser le décompte (Priority: P1)

En tant qu'enfant/utilisateur, je veux voir la couleur rouge se retirer progressivement du rond en cours afin de savoir combien de temps il me reste dans l'heure actuelle.

**Why this priority**: La visualisation du temps qui passe est le cœur de l'expérience utilisateur et la raison d'être de l'application.

**Independent Test**: Peut être testé en lançant un timer de 5 minutes et en vérifiant que le remplissage diminue visuellement de manière fluide dans le sens horaire.

**Acceptance Scenarios**:

1. **Given** une durée de 1h est configurée, **When** l'utilisateur appuie sur "Démarrer", **Then** le remplissage rouge commence à se retirer progressivement depuis 12h dans le sens horaire
2. **Given** le timer est en cours avec 45 min restantes, **When** 15 minutes s'écoulent, **Then** le remplissage passe de 75% à 50% (de 12h-9h à 12h-6h)
3. **Given** une session de 2h30 est lancée, **When** la première heure est écoulée, **Then** le premier rond devient vide mais reste visible, et le décompte continue sur le deuxième rond

---

### User Story 3 - Mettre en pause et reprendre (Priority: P2)

En tant que parent/éducateur, je veux pouvoir mettre en pause et reprendre le timer afin de gérer les interruptions sans perdre le temps écoulé.

**Why this priority**: Essentiel pour l'usage réel (interruptions inévitables), mais secondaire par rapport au flux principal.

**Independent Test**: Peut être testé en lançant un timer, en appuyant sur pause, en attendant quelques secondes, puis en reprenant et en vérifiant que le temps reprend là où il s'était arrêté.

**Acceptance Scenarios**:

1. **Given** le timer est en cours, **When** l'utilisateur appuie sur "Pause", **Then** le décompte s'arrête et une icône pause s'affiche
2. **Given** le timer est en pause, **When** l'utilisateur appuie sur "Reprendre", **Then** le décompte reprend exactement où il s'était arrêté
3. **Given** le timer est en pause, **When** l'utilisateur observe l'écran, **Then** une pulsation douce (opacité oscillante) indique l'état de pause

---

### User Story 4 - Réinitialiser le timer (Priority: P2)

En tant qu'utilisateur, je veux pouvoir réinitialiser le timer afin de recommencer une session ou d'en démarrer une nouvelle.

**Why this priority**: Important pour la flexibilité d'usage, mais pas critique pour le MVP.

**Independent Test**: Peut être testé en lançant un timer, en laissant passer du temps, puis en appuyant sur reset et en vérifiant que tous les ronds reviennent à leur état initial.

**Acceptance Scenarios**:

1. **Given** le timer est en cours ou en pause, **When** l'utilisateur appuie sur "Réinitialiser", **Then** tous les ronds reviennent à leur état initial (pleins selon la durée configurée)
2. **Given** le timer a été réinitialisé, **When** l'utilisateur observe l'écran, **Then** le timer est prêt à être relancé avec la même durée

---

### User Story 5 - Utiliser l'application hors ligne (Priority: P3)

En tant qu'utilisateur mobile, je veux pouvoir utiliser l'application sans connexion internet afin de l'utiliser partout (école, voiture, maison).

**Why this priority**: Important pour l'usage réel mais peut être ajouté après les fonctionnalités core.

**Independent Test**: Peut être testé en installant l'application, en coupant la connexion internet, puis en vérifiant que toutes les fonctionnalités restent opérationnelles.

**Acceptance Scenarios**:

1. **Given** l'application a été visitée une première fois en ligne, **When** l'utilisateur revient sans connexion, **Then** l'application se charge et fonctionne normalement
2. **Given** l'application est installée sur l'écran d'accueil, **When** l'utilisateur l'ouvre sans connexion, **Then** toutes les fonctionnalités sont disponibles

---

### Edge Cases

- **Durée nulle** : Si l'utilisateur tente de lancer un timer avec 0 minute, le système affiche un message d'erreur et empêche le démarrage
- **Durée maximale** : Le système limite la durée à 12 heures maximum (12 ronds) pour maintenir la lisibilité
- **Fermeture accidentelle** : Si l'utilisateur ferme l'application pendant un timer en cours, l'état est persisté et restauré à la réouverture
- **Fin de session** : Quand le timer atteint 0, tous les ronds sont vides et un indicateur visuel clair signale la fin
- **Minutes partielles** : Pour une durée comme 1h15, le rond partiel affiche 15 minutes (rempli de 12h à 3h)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT afficher 1 rond d'horloge par heure (arrondi à l'heure supérieure)
- **FR-002**: Le système DOIT permettre la saisie d'une durée en heures et minutes (0-12h, 0-59min)
- **FR-003**: Le remplissage rouge DOIT partir de 12h et se retirer dans le sens horaire
- **FR-004**: Les ronds pleins DOIVENT se vider en premier, le rond partiel en dernier
- **FR-005**: Un rond vidé DOIT rester affiché (sans couleur) pour marquer la progression
- **FR-006**: L'utilisateur DOIT pouvoir lancer, mettre en pause et réinitialiser le timer
- **FR-007**: En pause, le système DOIT afficher une icône pause et une pulsation douce sur le remplissage
- **FR-008**: Le remplissage DOIT utiliser le rouge classique (#E53935) style Time-Timer
- **FR-009**: L'application DOIT fonctionner hors ligne après le premier chargement
- **FR-010**: L'application DOIT être installable sur l'écran d'accueil des appareils mobiles
- **FR-011**: La mise à jour visuelle DOIT être fluide (au moins 1 fois par seconde)
- **FR-012**: L'état du timer DOIT être persisté localement pour survivre à une fermeture accidentelle

### Key Entities

- **Session** : Représente une période de temps définie par l'utilisateur. Attributs : durée totale (minutes), temps restant (secondes), état (idle/running/paused/finished)
- **Rond d'horloge** : Unité visuelle représentant 1 heure. Attributs : minutes affichées (0-60), état (plein/partiel/vide), position dans la séquence
- **Timer** : Gestionnaire du décompte. Attributs : heure de démarrage, durée de pause cumulée, intervalle de mise à jour

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: L'utilisateur peut configurer et lancer un timer en moins de 10 secondes
- **SC-002**: 100% des enfants de 5 ans et plus comprennent la représentation visuelle du temps restant sans explication
- **SC-003**: L'animation du décompte est fluide sans saccade visible (60 fps minimum perçu)
- **SC-004**: L'application se charge en moins de 2 secondes sur un appareil mobile standard
- **SC-005**: L'application fonctionne sans aucune dégradation en mode hors ligne
- **SC-006**: La durée affichée est précise à la seconde près par rapport au temps réel écoulé

## Assumptions

- Les utilisateurs ont accès à un navigateur moderne supportant les PWA (Chrome, Safari, Firefox, Edge)
- L'écran de l'appareil est suffisamment grand pour afficher jusqu'à 12 ronds de manière lisible
- Les enfants utilisateurs ont au moins 3 ans et comprennent le concept basique d'une horloge analogique
- Le design mobile-first couvre également l'usage sur tablette et desktop
