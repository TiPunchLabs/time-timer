# Feature Specification: Fix Minute Rollover in DurationPicker

**Feature Branch**: `004-fix-minute-rollover`
**Created**: 2025-12-20
**Status**: Draft
**Input**: User description: "Fix minute rollover in DurationPicker - When clicking + on minutes at 55, it should add a full hour and reset minutes to 0. Similarly, when clicking - on minutes at 0 with hours > 0, it should decrease hours by 1 and set minutes to 55."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Minute Increment Rollover (Priority: P1)

Lorsqu'un utilisateur configure la durée du timer et que les minutes sont à 55, cliquer sur le bouton + des minutes doit ajouter une heure complète et remettre les minutes à 0.

**Why this priority**: C'est le scénario principal signalé par l'utilisateur. L'expérience actuelle est frustrante car l'utilisateur ne peut pas facilement atteindre une heure ronde depuis 55 minutes.

**Independent Test**: Configurer 0h55, cliquer sur + minutes, vérifier que le résultat est 1h00.

**Acceptance Scenarios**:

1. **Given** durée à 0h55, **When** utilisateur clique sur + minutes, **Then** durée devient 1h00 (heures = 1, minutes = 0)
2. **Given** durée à 1h55, **When** utilisateur clique sur + minutes, **Then** durée devient 2h00
3. **Given** durée à 2h55, **When** utilisateur clique sur + minutes, **Then** durée devient 3h00
4. **Given** durée à 3h55, **When** utilisateur clique sur + minutes, **Then** durée devient 4h00
5. **Given** durée à 3h55 (max 4h), **When** durée atteint 4h00, **Then** bouton + minutes est désactivé

---

### User Story 2 - Minute Decrement Rollover (Priority: P2)

Lorsqu'un utilisateur configure la durée du timer et que les minutes sont à 0 avec au moins 1 heure, cliquer sur le bouton - des minutes doit retirer une heure et mettre les minutes à 55.

**Why this priority**: Comportement symétrique nécessaire pour une UX cohérente, mais moins fréquemment utilisé.

**Independent Test**: Configurer 2h00, cliquer sur - minutes, vérifier que le résultat est 1h55.

**Acceptance Scenarios**:

1. **Given** durée à 1h00, **When** utilisateur clique sur - minutes, **Then** durée devient 0h55 (heures = 0, minutes = 55)
2. **Given** durée à 2h00, **When** utilisateur clique sur - minutes, **Then** durée devient 1h55
3. **Given** durée à 4h00, **When** utilisateur clique sur - minutes, **Then** durée devient 3h55
4. **Given** durée à 0h05 (minimum), **When** bouton - minutes, **Then** bouton est désactivé (pas de rollover en dessous de 5 minutes)

---

### Edge Cases

- **Maximum atteint (4h00)**: Le bouton + minutes doit être désactivé quand la durée est à 4h00
- **Minimum atteint (0h05)**: Le bouton - minutes doit être désactivé quand la durée est à 5 minutes ou moins
- **Incréments de 5**: Le rollover se fait par pas de 5 minutes (55 → 0, 0 → 55)
- **État désactivé**: Les rollovers ne doivent pas se produire quand le timer est en cours

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Système DOIT faire un rollover de 55 minutes à 0 minutes ET incrémenter les heures de 1 quand l'utilisateur clique sur + minutes
- **FR-002**: Système DOIT faire un rollover de 0 minutes à 55 minutes ET décrémenter les heures de 1 quand l'utilisateur clique sur - minutes (si heures > 0)
- **FR-003**: Système DOIT désactiver le bouton + minutes quand la durée totale atteint le maximum (4 heures)
- **FR-004**: Système DOIT désactiver le bouton - minutes quand la durée totale est au minimum (5 minutes)
- **FR-005**: Système DOIT conserver le comportement normal (incrément/décrément de 5 minutes) quand aucun rollover n'est nécessaire
- **FR-006**: Système DOIT mettre à jour l'affichage du cercle d'horloge immédiatement après le rollover

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% des tests de rollover passent (increment 55→0, decrement 0→55)
- **SC-002**: Utilisateur peut atteindre n'importe quelle durée entre 5 minutes et 4 heures en utilisant uniquement les boutons +/-
- **SC-003**: Aucune régression sur les tests existants du DurationPicker
- **SC-004**: Le cercle d'horloge affiche correctement une heure pleine après rollover

## Assumptions

- Les minutes s'incrémentent/décrémentent par pas de 5 (comportement existant préservé)
- La durée minimum est de 5 minutes (MIN_DURATION_MINUTES = 5)
- La durée maximum est de 4 heures (MAX_HOURS = 4, MAX_DURATION_MINUTES = 240)
- Le rollover ne doit fonctionner que quand le timer est en mode configuration (disabled = false)
