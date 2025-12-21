# TempoKids - Module Time-Timer Constitution

## Vision Produit

**TempoKids - Module Time-Timer** est une application PWA React offrant une représentation visuelle claire et intuitive du temps restant dans une session. Basée sur des ronds d'horloge analogiques (1 rond = 1 heure), elle permet aux enfants de comprendre facilement le temps qui passe grâce à une métaphore visuelle accessible.

### Objectif Principal
Fournir un outil de gestion du temps visuel qui aide les enfants à mieux appréhender la durée des activités, en rendant le temps abstrait tangible et compréhensible.

---

## Public Cible

| Utilisateur | Besoin Principal |
|-------------|------------------|
| **Parents** | Définir des durées de session claires pour les activités de leurs enfants |
| **Éducateurs** | Structurer les temps d'activité et de pause de manière visuelle |
| **Enfants** | Comprendre combien de temps il reste grâce à une représentation analogique intuitive |

---

## Core Principles

### I. Simplicité Absolue
- Interface épurée sans éléments superflus
- Fond uni pour éviter les distractions
- Un seul concept visuel : le rond d'horloge
- Éviter la sur-ingénierie : le code le plus simple est le meilleur

### II. Clarté Visuelle Maximale
- Chaque rond représente exactement 1 heure (60 minutes)
- Remplissage bleu (couleur TempoKids) pour une reconnaissance immédiate
- Les ronds vides restent affichés pour marquer la progression
- Indicateurs visuels clairs pour les états (pause, en cours, terminé)

### III. Accessibilité Enfant
- Métaphore analogique universellement comprise
- Défilement visuel dans le sens horaire (de 12h vers 12h)
- Position de départ à 12h, vidange dans le sens horaire
- Design adapté aux capacités cognitives des enfants
- Maximum 4 heures par session (4 cercles max) pour garder une interface claire

### IV. Mobile-First & Offline
- Conception prioritairement pour les écrans mobiles et tablettes
- Interface tactile optimisée avec zones de touch généreuses
- Cercles dimensionnés pour une visibilité optimale sur petit écran
- Fonctionnement 100% hors ligne garanti
- Application installable (PWA)
- Persistance de l'état au rechargement (timer running/paused/config conservé)

### V. Performance
- Mise à jour du timer fluide à la seconde minimum
- Pas de décalage ni de saccade dans les animations
- Bundle léger, pas de dépendances inutiles

---

## Stack Technique

| Technologie | Rôle |
|-------------|------|
| **React 18+** | Framework UI principal |
| **Vite** | Outil de build et développement |
| **Tailwind CSS** | Système de styling utility-first |
| **vite-plugin-pwa** | Support PWA (service worker, manifest) |
| **SVG** | Rendu des cercles (arcs avec stroke-dasharray/dashoffset) |
| **localStorage** | Persistance de l'état du timer |
| **requestAnimationFrame** | Animation fluide du décompte |

---

## Contraintes et Conventions de Code

### Architecture
- **Composants fonctionnels** avec hooks React
- **Structure modulaire** : séparation claire entre UI, logique et état
- **Pas de dépendances inutiles** : garder le bundle léger

### Styling
- Utiliser exclusivement **Tailwind CSS** pour le styling
- Préférer les classes utilitaires aux CSS personnalisés
- Respecter le design system défini (couleurs, espacements)

### Performance
- Optimiser les re-renders avec `useMemo` et `useCallback`
- Lazy loading pour les composants non critiques

### PWA
- Cache des assets via service worker
- Manifest complet pour l'installation

### Qualité du Code
- TypeScript recommandé pour la robustesse
- Tests unitaires pour la logique du timer
- Code simple et lisible

---

## Design System

### Couleurs Principales

| Nom | Valeur | Usage |
|-----|--------|-------|
| **Bleu TempoKids** | `#2196F3` | Remplissage actif des ronds |
| **Gris Vide** | `#E0E0E0` | Ronds vidés/terminés |
| **Fond** | `#FFFFFF` | Arrière-plan principal |

---

## Hors Périmètre (v1)

Ces fonctionnalités sont explicitement exclues de la première version :
- Synchronisation cloud / multi-appareils
- Notifications push
- Historique des sessions
- Mode sombre

---

## Statut d'Implémentation

| Fonctionnalité | Statut |
|----------------|--------|
| Saisie durée (heures/minutes) | ✅ Implémenté |
| Affichage ronds d'horloge | ✅ Implémenté |
| Ordre d'affichage correct (pleins puis partiel) | ✅ Corrigé v1.1.0 |
| Décompte visuel temps réel | ✅ Implémenté |
| Vidange séquentielle (premier rond d'abord) | ✅ Corrigé v1.1.0 |
| Vidange dans le sens horaire depuis 12h | ✅ Corrigé v1.2.0 |
| Contrôles (start/pause/reset) | ✅ Implémenté |
| Animation pause (pulsation) | ✅ Implémenté |
| Persistance localStorage (session active) | ✅ Implémenté |
| Reset au rechargement de page | ✅ Implémenté v1.2.0 |
| Design mobile-first | ✅ Optimisé v1.2.0 |
| Maximum 4 heures (4 cercles) | ✅ Implémenté v1.2.0 |
| PWA (offline, installable) | ✅ Implémenté |
| Error Boundary (stabilité) | ✅ Implémenté v1.3.0 |
| Indicateur réseau (offline/online) | ✅ Implémenté v1.3.0 |
| Focus visible accessibilité | ✅ Implémenté v1.3.0 |
| Zoom viewport autorisé (WCAG) | ✅ Implémenté v1.3.0 |
| Tests composants (134 tests) | ✅ Implémenté v1.3.0 |
| Rollover minutes DurationPicker (+/- par pas de 5) | ✅ Implémenté v1.4.0 |
| Persistance état timer au rechargement | ✅ Implémenté v1.5.0 |

---

## Historique des Versions

| Version | Date | Description |
|---------|------|-------------|
| 1.6.0 | 2025-12-21 | Changement couleur par défaut: rouge → bleu (#2196F3) |
| 1.5.0 | 2025-12-21 | Persistance état timer au rechargement (running/paused/config conservé) |
| 1.4.0 | 2025-12-21 | Fix: Rollover minutes dans DurationPicker (55→0 avec hour++, 0→55 avec hour--) |
| 1.3.0 | 2025-12-20 | Qualité: Error Boundary, indicateur réseau, focus visible, zoom WCAG, tests composants |
| 1.2.0 | 2025-12-20 | Vidange horaire depuis 12h, max 4h, design mobile-first, reset au reload |
| 1.1.0 | 2025-12-20 | Fix: Ordre d'affichage des ronds (pleins d'abord, partiel en dernier) |
| 1.0.0 | 2025-12-20 | Version initiale avec toutes les fonctionnalités MVP |

---

## Governance

Cette constitution définit les principes fondamentaux du projet. Toute modification majeure de l'architecture ou des principes de design doit être documentée et justifiée.

**Version**: 1.6.0 | **Ratified**: 2025-12-20 | **Last Amended**: 2025-12-21 | **Implemented**: 2025-12-21
