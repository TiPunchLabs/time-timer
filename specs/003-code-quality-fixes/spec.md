# Feature Specification: Code Quality Fixes

**Feature Branch**: `003-code-quality-fixes`
**Created**: 2025-12-20
**Status**: Draft
**Input**: Amélioration du code suite à la revue de code senior avec corrections prioritaires identifiées

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Application Stability with Error Boundary (Priority: P1)

En tant qu'utilisateur de l'application TempoKids, je veux que l'application reste utilisable même si une erreur technique survient, afin de ne pas perdre ma session de timer en cours.

**Why this priority**: Une erreur non capturée crash actuellement toute l'application. C'est le problème de stabilité le plus critique identifié.

**Independent Test**: Peut être testé en simulant une erreur dans un composant enfant et en vérifiant que l'application affiche un message d'erreur plutôt que de crasher.

**Acceptance Scenarios**:

1. **Given** une erreur survient dans un composant enfant, **When** l'erreur se propage, **Then** un message d'erreur convivial s'affiche avec option de recharger
2. **Given** le message d'erreur est affiché, **When** l'utilisateur clique sur "Recharger", **Then** la page se recharge et l'application reprend normalement
3. **Given** une erreur survient dans TimerDisplay, **When** l'Error Boundary capture l'erreur, **Then** les autres composants (header, footer) restent fonctionnels

---

### User Story 2 - Indicateur État Réseau Offline/Online (Priority: P2)

En tant qu'utilisateur mobile de TempoKids, je veux savoir quand je suis hors ligne, afin de comprendre pourquoi certaines fonctionnalités pourraient ne pas fonctionner.

**Why this priority**: L'application est une PWA conçue pour fonctionner offline, mais l'utilisateur n'a aucun feedback visuel sur l'état du réseau. Amélioration UX significative.

**Independent Test**: Peut être testé en désactivant le réseau et en vérifiant qu'un indicateur visuel apparaît.

**Acceptance Scenarios**:

1. **Given** l'utilisateur est connecté à internet, **When** la connexion est perdue, **Then** un indicateur discret "Hors ligne" apparaît
2. **Given** l'utilisateur est hors ligne, **When** la connexion revient, **Then** l'indicateur disparaît automatiquement
3. **Given** l'application démarre hors ligne, **When** la page se charge, **Then** l'indicateur "Hors ligne" est visible dès le départ

---

### User Story 3 - Accessibilité des Contrôles (Priority: P2)

En tant qu'utilisateur naviguant au clavier, je veux voir clairement quel bouton est sélectionné, afin de pouvoir contrôler le timer sans souris.

**Why this priority**: L'accessibilité est cruciale pour une application destinée aux enfants et parents. Impact sur le score Lighthouse Accessibilité.

**Independent Test**: Peut être testé en naviguant à la Tab et vérifiant la visibilité du focus sur chaque bouton.

**Acceptance Scenarios**:

1. **Given** l'utilisateur navigue au clavier, **When** il appuie sur Tab pour atteindre un bouton, **Then** un anneau de focus visible entoure le bouton
2. **Given** un bouton a le focus, **When** l'utilisateur appuie sur Entrée ou Espace, **Then** l'action du bouton est déclenchée
3. **Given** l'utilisateur utilise le clavier, **When** il navigue entre les boutons, **Then** le focus est visible sur chaque bouton traversé

---

### User Story 4 - Zoom Accessible sur Mobile (Priority: P3)

En tant qu'utilisateur malvoyant, je veux pouvoir zoomer sur l'interface mobile, afin de mieux voir les éléments de l'application.

**Why this priority**: La restriction `user-scalable=no` dans le viewport empêche le zoom, ce qui est un problème d'accessibilité WCAG. Impact direct sur score Lighthouse.

**Independent Test**: Peut être testé en essayant de zoomer avec les doigts sur mobile.

**Acceptance Scenarios**:

1. **Given** l'utilisateur est sur mobile, **When** il fait un pinch-to-zoom, **Then** l'interface zoome correctement
2. **Given** l'utilisateur a zoomé, **When** il utilise l'application, **Then** tous les boutons restent fonctionnels

---

### User Story 5 - Tests de Composants UI (Priority: P3)

En tant que développeur maintenant le code, je veux des tests sur les composants React, afin de détecter les régressions UI avant déploiement.

**Why this priority**: Actuellement seuls les hooks et utils sont testés. Les composants n'ont pas de couverture, ce qui représente un risque de régression.

**Independent Test**: Peut être testé en exécutant la suite de tests et vérifiant que les nouveaux tests passent.

**Acceptance Scenarios**:

1. **Given** les tests de composants existent, **When** `pnpm test` est exécuté, **Then** tous les tests passent
2. **Given** le composant ClockCircle est modifié, **When** les tests sont exécutés, **Then** toute régression est détectée
3. **Given** le composant Controls a un focus visible, **When** les tests sont exécutés, **Then** l'accessibilité est validée

---

### User Story 6 - Code Maintenable et DRY (Priority: P4)

En tant que développeur, je veux un code sans duplication et bien organisé, afin de faciliter les futures modifications.

**Why this priority**: Refactoring interne qui n'affecte pas l'utilisateur final mais améliore la maintenabilité. Peut être fait en parallèle des autres corrections.

**Independent Test**: Peut être testé en vérifiant que les tests existants passent après refactoring.

**Acceptance Scenarios**:

1. **Given** la fonction formatTimeDisplay est dupliquée, **When** le refactoring est fait, **Then** une seule fonction formatTime existe dans utils/time.ts
2. **Given** les icônes sont inline dans App.tsx, **When** l'extraction est faite, **Then** un dossier icons/ contient les composants réutilisables
3. **Given** le refactoring est terminé, **When** les tests sont exécutés, **Then** tous les tests passent (régression zéro)

---

### Edge Cases

- Que se passe-t-il si l'Error Boundary reçoit une erreur pendant le rendu initial ?
- Comment gérer les transitions rapides online/offline (debounce nécessaire ?)
- Le focus visible doit-il persister après un clic (ou seulement pour la navigation clavier) ?
- Que se passe-t-il si le service worker échoue à s'enregistrer offline ?

## Requirements *(mandatory)*

### Functional Requirements

**Stabilité**
- **FR-001**: Le système DOIT capturer toutes les erreurs React non gérées via un Error Boundary
- **FR-002**: Le système DOIT afficher un message d'erreur convivial en français avec bouton de rechargement
- **FR-003**: L'Error Boundary DOIT permettre aux composants frères (header, footer) de rester fonctionnels

**État Réseau**
- **FR-004**: Le système DOIT détecter automatiquement les changements d'état réseau (online/offline)
- **FR-005**: Un indicateur visuel discret DOIT informer l'utilisateur de l'état hors ligne
- **FR-006**: L'indicateur DOIT disparaître automatiquement au retour de la connexion

**Accessibilité**
- **FR-007**: Tous les boutons interactifs DOIVENT avoir un indicateur de focus visible
- **FR-008**: Le viewport DOIT permettre le zoom utilisateur (supprimer user-scalable=no)
- **FR-009**: L'indicateur de focus DOIT utiliser un anneau de couleur contrastée

**PWA**
- **FR-010**: La configuration workbox DOIT inclure un navigateFallback vers index.html

**Tests**
- **FR-011**: Le système DOIT avoir des tests unitaires pour les composants ClockCircle, Controls, DurationPicker, TimerDisplay
- **FR-012**: Les tests DOIVENT vérifier le rendu correct et les attributs d'accessibilité

**Maintenabilité**
- **FR-013**: La fonction formatTimeDisplay DOIT être supprimée et remplacée par formatTime de utils/time.ts
- **FR-014**: Les icônes TimerIcon et CheckIcon DOIVENT être extraites dans des composants séparés

### Key Entities

- **ErrorBoundary**: Composant React capturant les erreurs enfants, affiche fallback UI
- **NetworkStatus**: État booléen (isOnline) géré par hook, reflète navigator.onLine
- **Icon Components**: Composants SVG réutilisables (TimerIcon, CheckIcon, PlayIcon, etc.)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Aucune erreur React ne crash l'application (100% des erreurs capturées par Error Boundary)
- **SC-002**: L'indicateur réseau apparaît en moins de 2 secondes après perte de connexion
- **SC-003**: Score Lighthouse Accessibilité >= 95 (actuellement estimé 85-90)
- **SC-004**: Score Lighthouse PWA = 100 (avec navigateFallback configuré)
- **SC-005**: Couverture de tests des composants >= 80%
- **SC-006**: Tous les tests passent après refactoring (régression zéro)
- **SC-007**: L'indicateur de focus est visible sur tous les boutons en navigation clavier

## Assumptions

- L'Error Boundary sera placé au niveau App pour capturer toutes les erreurs
- L'indicateur offline sera un bandeau discret en haut de page
- Le focus visible utilisera focus:ring-2 avec la couleur timer-red existante
- Les icônes seront placées dans src/components/icons/
- Les tests utiliseront @testing-library/react déjà présent dans les devDependencies

## Out of Scope

- Notification sonore de changement d'état réseau
- Sauvegarde automatique du timer en cas d'erreur
- Synchronisation background des données
- Tests end-to-end (E2E) avec Playwright
