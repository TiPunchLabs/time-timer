# Feature Specification: Fix Timer Display Order

**Feature Branch**: `002-fix-timer-display-order`
**Created**: 2025-12-20
**Status**: Draft
**Input**: User description: "Fix Timer Display Order - Le décompte doit commencer par les heures complètes (ronds pleins) et finir par le timer partiellement rempli. Le décompte part de zéro (position 12h) et s'efface progressivement dans le sens horaire. Le rond partiellement rempli doit toujours être en dernière position visuelle."

## Contexte

L'application TempoKids Time-Timer affiche actuellement les ronds d'horloge dans un ordre incorrect. Cette spécification décrit les corrections nécessaires pour que l'affichage corresponde au comportement attendu d'un Time-Timer classique.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ordre d'affichage correct des ronds (Priority: P1)

En tant qu'utilisateur, lorsque je configure un timer de 2h30, je veux voir les ronds affichés dans l'ordre logique : d'abord les 2 ronds pleins (heures complètes), puis le rond partiellement rempli (30 minutes) en dernière position.

**Why this priority**: C'est le comportement fondamental attendu d'un Time-Timer. L'ordre d'affichage doit refléter la progression naturelle du temps.

**Independent Test**: Configurer un timer de 2h30 et vérifier visuellement que les 2 premiers ronds sont pleins et le 3ème (dernier) est rempli à 50%.

**Acceptance Scenarios**:

1. **Given** un timer configuré à 2h30, **When** l'utilisateur démarre le timer, **Then** les ronds s'affichent dans l'ordre : rond 1 plein, rond 2 plein, rond 3 à moitié rempli.
2. **Given** un timer configuré à 1h15, **When** l'utilisateur démarre le timer, **Then** les ronds s'affichent dans l'ordre : rond 1 plein, rond 2 rempli à 25%.
3. **Given** un timer configuré à 45 minutes, **When** l'utilisateur démarre le timer, **Then** un seul rond s'affiche, rempli à 75%.

---

### User Story 2 - Décompte progressif dans le sens horaire (Priority: P1)

En tant qu'utilisateur, je veux que le remplissage rouge se retire progressivement dans le sens horaire, en partant de la position 12h (zéro), pour visualiser clairement le temps qui s'écoule.

**Why this priority**: Le sens horaire est la convention universelle pour les horloges et Time-Timers. Le départ depuis 12h est essentiel pour la compréhension intuitive.

**Independent Test**: Démarrer un timer et observer que le remplissage rouge diminue en partant de 12h et progresse dans le sens des aiguilles d'une montre.

**Acceptance Scenarios**:

1. **Given** un timer en cours, **When** le temps s'écoule, **Then** le remplissage rouge se retire depuis la position 12h dans le sens horaire.
2. **Given** un timer avec 30 minutes écoulées sur 1 heure, **When** l'utilisateur regarde le rond, **Then** la moitié droite du rond (de 12h à 6h) est vide, la moitié gauche est encore rouge.

---

### User Story 3 - Vidange séquentielle des ronds (Priority: P1)

En tant qu'utilisateur, je veux que les ronds se vident dans l'ordre correct : d'abord les heures complètes (de gauche à droite), puis le rond partiel en dernier.

**Why this priority**: La séquence de vidange doit correspondre à l'ordre d'affichage pour une expérience cohérente.

**Independent Test**: Démarrer un timer de 2h30 et observer que le premier rond se vide en premier, puis le deuxième, et enfin le rond partiel.

**Acceptance Scenarios**:

1. **Given** un timer de 2h30 en cours, **When** la première heure s'écoule, **Then** le premier rond devient vide, les deux autres restent remplis.
2. **Given** un timer de 2h30 avec 1h30 écoulées, **When** l'utilisateur regarde l'affichage, **Then** les 2 premiers ronds sont vides, le 3ème rond partiel montre le temps restant (30 min sur les 30 min initiales de ce rond).
3. **Given** un timer terminé, **When** le temps atteint zéro, **Then** tous les ronds sont complètement vides.

---

### Edge Cases

- Timer configuré à exactement 1h, 2h, 3h (heures pleines) : pas de rond partiel, tous les ronds sont pleins au départ
- Timer configuré à moins d'une heure : un seul rond partiellement rempli
- Timer configuré à 12h (maximum) : 12 ronds pleins, tous se vident séquentiellement

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT afficher les ronds d'horloge dans l'ordre suivant : ronds pleins (heures complètes) d'abord, rond partiellement rempli en dernier
- **FR-002**: Le système DOIT positionner le rond partiellement rempli toujours en dernière position visuelle (à droite ou en bas selon la grille)
- **FR-003**: Le remplissage rouge DOIT se retirer depuis la position 12h (haut du cercle) dans le sens horaire
- **FR-004**: Les ronds DOIVENT se vider séquentiellement du premier au dernier (gauche à droite, haut en bas)
- **FR-005**: Le premier rond à se vider DOIT être le premier rond affiché (en haut à gauche)
- **FR-006**: Le dernier rond à se vider DOIT être le rond partiellement rempli (s'il existe)
- **FR-007**: Pour un timer d'heures pleines (1h, 2h, etc.), tous les ronds sont pleins au départ et se vident séquentiellement

### Key Entities

- **ClockCircle**: Représentation visuelle d'une heure de temps avec remplissage progressif
- **TimerDisplay**: Conteneur ordonnant les ronds selon la logique définie
- **CircleData**: Données définissant l'état de remplissage de chaque rond

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% des utilisateurs peuvent identifier visuellement le temps restant sans confusion sur l'ordre des ronds
- **SC-002**: L'ordre d'affichage (ronds pleins puis partiel) est correct pour toutes les durées de 1 minute à 12 heures
- **SC-003**: Le sens de vidange (horaire depuis 12h) est cohérent sur tous les ronds
- **SC-004**: La séquence de vidange (premier rond d'abord, partiel en dernier) est respectée pour toutes les configurations

## Assumptions

- Le comportement visuel doit correspondre au Time-Timer classique rouge
- Le sens horaire et la position 12h sont des conventions universellement comprises
- L'interface conserve la disposition en grille existante
