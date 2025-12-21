# Feature Specification: Burger Menu avec Durées Prédéfinies

**Feature Branch**: `006-burger-menu-presets`
**Created**: 2025-12-21
**Status**: Draft
**Input**: User description: "Ajouter un burger menu accessible depuis tous les écrans avec des durées prédéfinies cliquables: 30 minutes, 45 minutes, 1h15, 1h30, 2h, 2h30. Sélection applique immédiatement la durée et ferme le menu avec animation."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accès Rapide aux Durées Prédéfinies (Priority: P1)

En tant qu'utilisateur (parent/éducateur), je veux pouvoir sélectionner rapidement une durée prédéfinie depuis un menu accessible à tout moment, afin de configurer le timer sans avoir à ajuster manuellement les heures et minutes.

**Why this priority**: C'est le cas d'usage principal. Les durées prédéfinies (30min, 45min, 1h15, etc.) correspondent aux temps d'activité courants pour les enfants. Cela accélère significativement la configuration du timer.

**Independent Test**: Ouvrir le menu burger, cliquer sur "45 min", vérifier que le DurationPicker affiche 0h45 et que le menu se ferme.

**Acceptance Scenarios**:

1. **Given** l'application est ouverte sur l'écran principal, **When** l'utilisateur clique sur l'icône burger menu, **Then** le menu s'ouvre avec une animation fluide
2. **Given** le menu burger est ouvert, **When** l'utilisateur clique sur "30 min", **Then** la durée 0h30 est appliquée au timer et le menu se ferme
3. **Given** le menu burger est ouvert, **When** l'utilisateur clique sur "1h15", **Then** la durée 1h15 est appliquée au timer et le menu se ferme
4. **Given** le menu burger est ouvert, **When** l'utilisateur clique sur "2h30", **Then** la durée 2h30 est appliquée au timer et le menu se ferme

---

### User Story 2 - Fermeture du Menu (Priority: P2)

En tant qu'utilisateur, je veux pouvoir fermer le menu burger sans sélectionner de durée, en cliquant à l'extérieur ou sur un bouton de fermeture.

**Why this priority**: Comportement standard d'UX attendu pour tout menu. L'utilisateur doit pouvoir annuler son action.

**Independent Test**: Ouvrir le menu burger, cliquer à l'extérieur, vérifier que le menu se ferme sans modifier la durée.

**Acceptance Scenarios**:

1. **Given** le menu burger est ouvert, **When** l'utilisateur clique en dehors du menu, **Then** le menu se ferme sans changer la durée
2. **Given** le menu burger est ouvert, **When** l'utilisateur clique sur le bouton de fermeture (X), **Then** le menu se ferme sans changer la durée
3. **Given** le menu burger est ouvert, **When** l'utilisateur appuie sur la touche Escape, **Then** le menu se ferme sans changer la durée

---

### User Story 3 - Visibilité du Menu Pendant le Timer (Priority: P3)

En tant qu'utilisateur, je veux que le menu burger reste accessible même quand le timer est en cours, afin de pouvoir changer rapidement de durée si nécessaire.

**Why this priority**: Flexibilité d'usage. Un parent peut avoir besoin de changer la durée en cours d'activité.

**Independent Test**: Démarrer un timer, ouvrir le menu burger, sélectionner une nouvelle durée, vérifier que le timer est réinitialisé avec la nouvelle durée.

**Acceptance Scenarios**:

1. **Given** le timer est en cours (running), **When** l'utilisateur ouvre le menu et sélectionne une durée, **Then** le timer est réinitialisé avec la nouvelle durée (état idle)
2. **Given** le timer est en pause, **When** l'utilisateur ouvre le menu et sélectionne une durée, **Then** le timer est réinitialisé avec la nouvelle durée (état idle)

---

### Edge Cases

- **Menu déjà ouvert**: Si l'utilisateur clique sur le burger alors que le menu est ouvert, le menu se ferme
- **Animation en cours**: Les clics pendant l'animation d'ouverture/fermeture sont ignorés ou mis en file d'attente
- **Durée identique**: Si l'utilisateur sélectionne une durée identique à celle actuellement configurée, le menu se ferme quand même (confirmation implicite)
- **Timer terminé**: Si le timer est à l'état "finished", sélectionner une durée le remet en état "idle" avec la nouvelle durée

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Système DOIT afficher une icône burger menu dans le header de l'application, à côté du titre TempoKids
- **FR-002**: Système DOIT afficher un menu avec les durées prédéfinies: 30 min, 45 min, 1h15, 1h30, 2h, 2h30
- **FR-003**: Système DOIT appliquer immédiatement la durée sélectionnée au DurationPicker quand l'utilisateur clique sur une option
- **FR-004**: Système DOIT fermer le menu avec une animation fluide après sélection d'une durée
- **FR-005**: Système DOIT permettre la fermeture du menu sans sélection (clic extérieur, bouton X, touche Escape)
- **FR-006**: Système DOIT réinitialiser le timer à l'état "idle" quand une durée prédéfinie est sélectionnée pendant que le timer est actif
- **FR-007**: Menu burger DOIT être accessible (focus clavier, aria-labels appropriés)
- **FR-008**: Animations DOIVENT être fluides et durer moins de 300ms

### Key Entities

- **PresetDuration**: Représente une durée prédéfinie avec son libellé (ex: "1h15") et sa valeur en minutes (ex: 75)
- **BurgerMenu**: Composant UI contenant l'état ouvert/fermé et la liste des durées prédéfinies

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Utilisateur peut configurer le timer en 2 clics (burger + durée) au lieu de multiples ajustements
- **SC-002**: 100% des durées prédéfinies sont sélectionnables et appliquées correctement
- **SC-003**: Animation d'ouverture/fermeture du menu complétée en moins de 300ms
- **SC-004**: Menu accessible au clavier (navigation tab, sélection Enter, fermeture Escape)
- **SC-005**: Aucune régression sur les fonctionnalités existantes (134 tests existants passent toujours)

## Assumptions

- Les durées prédéfinies sont fixes (30min, 45min, 1h15, 1h30, 2h, 2h30) et ne nécessitent pas de configuration utilisateur
- Le menu utilise un overlay/backdrop pour permettre la fermeture par clic extérieur
- L'animation de fermeture est un slide-out vers la gauche ou un fade-out
- Le menu n'affiche que les durées prédéfinies, pas d'autres options de configuration
- L'icône burger menu est le standard "hamburger" à 3 lignes horizontales
