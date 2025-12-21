# Implementation Plan: Burger Menu avec Durées Prédéfinies

**Feature Branch**: `006-burger-menu-presets`
**Created**: 2025-12-21
**Status**: Ready for Implementation

## Technical Context

### Existing Architecture

- **Framework**: React 18+ avec TypeScript
- **Styling**: Tailwind CSS
- **State**: useState hooks dans App.tsx
- **Components**: Modular structure in src/components/

### Key Integration Points

- **App.tsx**: Header section (lines 35-43) - burger menu à ajouter ici
- **handleDurationChange**: Callback existant pour mettre à jour la durée
- **actions.reset**: Action existante pour réinitialiser le timer

## Implementation Strategy

### New Components

1. **BurgerMenuIcon** (`src/components/icons/BurgerMenuIcon.tsx`)
   - Icône hamburger à 3 lignes
   - Style cohérent avec les autres icônes

2. **BurgerMenu** (`src/components/BurgerMenu/BurgerMenu.tsx`)
   - Composant menu slide-in depuis la gauche
   - Liste des durées prédéfinies
   - Overlay/backdrop pour fermeture
   - Gestion du focus et accessibilité

### Constants

- **PRESET_DURATIONS** (`src/constants/design.ts`)
  - Array des durées prédéfinies avec label et valeur en minutes
  - `[{ label: '30 min', minutes: 30 }, { label: '45 min', minutes: 45 }, ...]`

### App.tsx Modifications

- Ajouter état `isMenuOpen` avec useState
- Ajouter burger icon dans le header
- Intégrer composant BurgerMenu
- Handler pour sélection de durée prédéfinie

## File Structure

```
src/
├── components/
│   ├── BurgerMenu/
│   │   ├── BurgerMenu.tsx      # Main menu component
│   │   └── index.ts            # Export
│   └── icons/
│       └── BurgerMenuIcon.tsx  # Hamburger icon
├── constants/
│   └── design.ts               # Add PRESET_DURATIONS
└── App.tsx                     # Integration
```

## Animation Specifications

- **Open**: Slide-in from left, 200ms ease-out
- **Close**: Slide-out to left, 150ms ease-in
- **Backdrop**: Fade-in/out 150ms

## Accessibility

- `aria-expanded` sur le bouton burger
- `aria-label` sur tous les éléments interactifs
- Focus trap dans le menu ouvert
- Fermeture avec Escape
- Navigation clavier (Tab, Enter)

## Testing Strategy

- Tests unitaires pour BurgerMenu component
- Tests d'intégration pour sélection de durée
- Tests d'accessibilité (keyboard navigation)

## Dependencies

- Aucune nouvelle dépendance requise
- Utilise Tailwind CSS animations natives
