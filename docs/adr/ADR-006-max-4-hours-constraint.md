# ADR-006: Maximum 4 Hours / 4 Circles Constraint

## Status
Accepted

## Date
2025-12-20

## Context
Each circle represents exactly 1 hour. The number of circles displayed directly impacts the UI layout, especially on mobile screens where space is limited.

## Decision
Limit the maximum duration to 4 hours (240 minutes), displaying at most 4 clock circles.

## Rationale
- **Mobile readability**: 4 circles fit in a 2x2 grid on small screens (135px each) while remaining clearly visible
- **Child-friendly**: Sessions beyond 4 hours are uncommon for children's activities
- **Layout simplicity**: Only 3 responsive tiers needed (1 circle = centered, 2 = side by side, 3-4 = 2x2 grid)
- **Cognitive load**: More than 4 circles becomes harder to parse at a glance

## Implementation
- `MAX_HOURS = 4` and `MAX_DURATION_MINUTES = 240` in `constants/design.ts`
- `MIN_DURATION_MINUTES = 1` (minimum 1 minute)
- `DurationPicker` clamps input to `[1, 240]` range
- `App.tsx` enforces clamping via `handleDurationChange`

## Circle Sizing
| Count | Size | Layout |
|-------|------|--------|
| 1 | 220px | Full width centered |
| 2 | 160px | Side by side |
| 3-4 | 135px | 2x2 grid |

## Alternatives Considered
- **No limit**: UI breaks down on mobile with 5+ circles
- **6 hours**: Would require a 3x2 grid, circles too small on phones
- **Scrollable circles**: Adds complexity, breaks the "see everything at once" principle

## Consequences
- Footer displays "Max 4 heures par session" as guidance
- Preset durations in burger menu respect the 4h cap (max preset: 2h30)
- `getCircleCount()` never returns more than 4
