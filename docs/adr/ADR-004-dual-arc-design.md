# ADR-004: Dual-Arc Design Pattern for Clock Circles

## Status
Accepted

## Date
2025-12-21

## Context
The original Time Timer product uses a single solid color fill. TempoKids needed a distinctive visual identity while remaining clear and child-friendly.

## Decision
Implement a dual-arc design: a thin colored external arc + an optional wide pastel internal arc, both draining together.

## Rationale
- **Visual distinction**: Differentiates TempoKids from the original Time Timer aesthetic
- **Depth effect**: The layered arcs create a sense of volume without 3D complexity
- **Customization**: The pastel layer is optional (toggle in burger menu), letting users choose their preferred visual style
- **Child-friendly**: Pastel tones are softer and more appealing to young users
- **Color coherence**: The pastel arc is derived from the selected color (same hue, lower opacity), maintaining visual harmony

## SVG Layering (bottom to top)
1. Gray background circle (always visible)
2. Pastel arc — wide stroke, clockwise fill (optional)
3. Colored arc — thin stroke, clockwise fill (always visible)
4. Border outline
5. Tick marks at 12h, 3h, 6h, 9h

## User Control
- Pastel circle disabled by default (cleaner initial experience)
- Toggle in BurgerMenu: `showPastel` state persisted in localStorage (`tempokids_pastel_enabled`)

## Alternatives Considered
- **Single solid fill** (like original Time Timer): Functional but visually flat
- **Gradient fill**: More complex SVG, harder to animate smoothly with dasharray
- **Background image/pattern**: Not scalable, resolution-dependent

## Consequences
- `ClockCircle` component renders 5 SVG layers
- Both arcs share the same `fillPercentage`, keeping drain synchronized
- Color palette must work for both full-saturation and pastel variants
