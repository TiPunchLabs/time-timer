# ADR-005: Clockwise Drain from 12h Position

## Status
Accepted

## Date
2025-12-20

## Context
The PRD specifies that the colored fill should start at 12 o'clock and drain clockwise — matching real analog clock movement. However, SVG `stroke-dasharray` naturally draws counter-clockwise starting from the 3 o'clock position.

## Decision
Use a CSS transform `rotate(90deg) scaleX(-1)` on arc elements to achieve clockwise fill from 12h.

## Rationale
- **Matches real-world clocks**: Children understand the 12h starting position intuitively
- **PRD compliance**: EF-TT.04 explicitly requires "fill starts at 12h, drains clockwise"
- **Pure CSS solution**: No complex SVG path calculations needed, just a transform on the circle element

## How It Works
```
Default SVG stroke:  starts at 3h, goes counter-clockwise
scaleX(-1):          flips to clockwise, start moves to 9h
rotate(90deg):       rotates start from 9h to 12h

Result: stroke starts at 12h, goes clockwise
```

The `stroke-dasharray` then controls how much of the circumference is filled:
```
dasharray = "fillLength gapLength"
fillLength = percentage * circumference
```

## Alternatives Considered
- **SVG arc paths (d attribute)**: Full control but complex math, hard to animate smoothly
- **rotate(-90deg) only**: Moves start to 12h but draws counter-clockwise (wrong direction)
- **Canvas arc with manual angles**: Imperative, doesn't fit React model (see ADR-001)

## Consequences
- `svg.ts` provides `getClockwiseDashArray(percentage, radius)` as the single source of truth
- The transform is applied on the `<circle>` element, not the `<svg>` container
- Tick marks and borders use separate untransformed elements to avoid being flipped
