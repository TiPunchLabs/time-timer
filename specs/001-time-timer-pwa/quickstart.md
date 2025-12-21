# Quickstart: TempoKids - Module Time-Timer

**Date**: 2025-12-20
**Feature**: [spec.md](./spec.md)

## Installation

```bash
# Cloner le projet
git clone <repository-url>
cd time-timer

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Lancer les tests
npm run test

# Build production
npm run build

# Preview production
npm run preview
```

## Structure du Projet

```
src/
├── components/        # Composants React
├── hooks/            # Hooks personnalisés
├── utils/            # Fonctions utilitaires
├── types/            # Types TypeScript
├── App.tsx           # Composant racine
├── main.tsx          # Point d'entrée
└── index.css         # Tailwind CSS

tests/                # Tests Vitest
public/               # Assets statiques, manifest PWA
```

## Scénarios de Test Manuel

### Scénario 1 : Configuration et lancement d'un timer

1. Ouvrir l'application
2. Saisir une durée (ex: 2h30)
3. Vérifier que 3 ronds s'affichent (2 pleins, 1 à 50%)
4. Appuyer sur "Démarrer"
5. Vérifier que le remplissage rouge commence à diminuer
6. Vérifier la fluidité de l'animation

**Résultat attendu**: Le rond actif se vide progressivement dans le sens horaire

### Scénario 2 : Pause et reprise

1. Lancer un timer de 5 minutes
2. Attendre 1 minute
3. Appuyer sur "Pause"
4. Vérifier l'icône pause et la pulsation
5. Attendre 30 secondes
6. Appuyer sur "Reprendre"
7. Vérifier que le timer reprend à ~4 minutes restantes

**Résultat attendu**: Le temps de pause n'est pas décompté

### Scénario 3 : Transition entre ronds

1. Lancer un timer de 1h30 (2 ronds)
2. Attendre que le premier rond se vide complètement (ou accélérer en dev)
3. Vérifier que le premier rond devient gris/vide
4. Vérifier que le second rond commence à se vider

**Résultat attendu**: Transition fluide, premier rond reste visible mais vide

### Scénario 4 : Réinitialisation

1. Lancer un timer
2. Laisser défiler quelques secondes
3. Appuyer sur "Réinitialiser"
4. Vérifier que tous les ronds reviennent à leur état initial

**Résultat attendu**: Timer prêt à être relancé avec la même durée

### Scénario 5 : Persistance

1. Lancer un timer de 10 minutes
2. Attendre 2 minutes
3. Fermer l'onglet/application
4. Rouvrir l'application
5. Vérifier que le timer reprend environ là où il s'était arrêté

**Résultat attendu**: État restauré, temps ajusté si app fermée pendant running

### Scénario 6 : Mode hors ligne

1. Ouvrir l'application une première fois (en ligne)
2. Couper la connexion internet
3. Rafraîchir la page
4. Utiliser l'application normalement

**Résultat attendu**: Application fonctionnelle hors ligne

### Scénario 7 : Installation PWA

1. Ouvrir l'application dans Chrome mobile
2. Utiliser "Ajouter à l'écran d'accueil"
3. Ouvrir depuis l'écran d'accueil
4. Vérifier le mode standalone (pas de barre navigateur)

**Résultat attendu**: Application lancée comme app native

## Variables d'Environnement

Aucune variable d'environnement requise pour le développement.

## Commandes Utiles

```bash
# Développement avec hot reload
npm run dev

# Tests en mode watch
npm run test:watch

# Vérification TypeScript
npm run type-check

# Lint
npm run lint

# Build production
npm run build

# Analyse bundle
npm run build -- --analyze
```

## Debugging

### Timer drift
Si le timer semble imprécis, vérifier dans la console :
- `Date.now()` au démarrage et après pause
- Les calculs de `remainingTime`

### PWA non installable
Vérifier :
- Le fichier `manifest.json` est servi correctement
- Les icônes existent en 192x192 et 512x512
- HTTPS en production (localhost OK en dev)

### Animations saccadées
- Vérifier que `requestAnimationFrame` est utilisé
- Éviter les re-renders inutiles (React DevTools Profiler)
- Tester sur appareil physique, pas seulement émulateur
