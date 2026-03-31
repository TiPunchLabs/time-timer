# ADR-001: SVG over Canvas for Circle Rendering

## Status
Accepted

## Date
2025-12-20

## Context
TempoKids needs to render analog clock circles with animated fill arcs that drain clockwise. Two main browser APIs are available for 2D graphics: SVG and Canvas.

## Decision
Use SVG with `stroke-dasharray` / `stroke-dashoffset` for rendering clock circles.

## Rationale
- **Declarative**: SVG elements integrate naturally into React's component model — each circle is a React component returning JSX
- **CSS transitions**: Fill animations can leverage CSS transitions for smooth visual updates
- **Accessibility**: SVG elements support `aria-*` attributes natively
- **Scalability**: Vector-based, renders crisp at any resolution (important for PWA installed on various devices)
- **Simplicity**: No imperative draw loop needed, no canvas context management
- **Clockwise trick**: Achievable via `transform: rotate(90deg) scaleX(-1)` on arc elements

## Alternatives Considered
- **Canvas 2D**: More performant for complex animations, but requires imperative drawing, doesn't integrate with React reconciliation, and needs manual hit detection. Overkill for 1-4 static-ish circles.
- **CSS conic-gradient**: Limited browser support at the time, no fine control over arc segments.

## Consequences
- Max 4 circles means SVG performance is never a concern
- Each `ClockCircle` component manages its own SVG layers (background, pastel arc, colored arc, border, tick marks)
- SVG math centralized in `src/utils/svg.ts`
