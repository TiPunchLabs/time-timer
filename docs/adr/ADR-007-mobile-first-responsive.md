# ADR-007: Mobile-First Responsive Design with Circle Size Tiers

## Status
Accepted

## Date
2025-12-20

## Context
TempoKids is primarily used on mobile phones and tablets by parents and children. The UI must be optimized for small screens first, then enhanced for larger ones.

## Decision
Adopt a mobile-first approach with Tailwind CSS responsive prefixes (`md:`) and fixed circle size tiers based on circle count.

## Rationale
- **Primary use case**: Parents hand their phone/tablet to children during activities
- **Touch targets**: Controls and interactive elements must be large enough for children's fingers
- **Visual clarity**: Clock circles must be large enough to see the fill arc clearly on a 5" screen
- **PWA context**: Installed PWA runs in standalone mode, typically on mobile

## Implementation
- Base styles target mobile, `md:` prefix enhances for tablets/desktop
- Circle sizes are fixed per count tier (not percentage-based) to guarantee readability
- Padding, font sizes, and spacing scale up at `md:` breakpoint
- `DurationPicker` uses large touch targets for +/- buttons

## Responsive Patterns
```
Mobile (< 768px):          md: (>= 768px):
- pt-4 pb-2               - pt-6 pb-4
- text-2xl                 - text-3xl
- p-4 rounded-2xl          - p-6 rounded-3xl
- Circle: 135-220px        - Same sizes (adequate on larger screens)
```

## Alternatives Considered
- **Desktop-first**: Would require overriding many styles for mobile, error-prone
- **Fluid/percentage circles**: Size unpredictable, circles could be too small on compact phones
- **Separate mobile/desktop layouts**: Over-engineered for this app's scope

## Consequences
- All Tailwind classes start with mobile values
- No horizontal scrolling on any screen size
- Burger menu slides from the right with full-height overlay (mobile-native pattern)
