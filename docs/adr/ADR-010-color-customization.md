# ADR-010: Color Customization with 12-Color Palette

## Status
Accepted

## Date
2025-12-21

## Context
The original design used a fixed red fill (like the classic Time Timer). User feedback and design iteration led to the desire for color personalization while keeping the interface simple.

## Decision
Offer a fixed 12-color palette accessible from the burger menu, with the selected color persisted in localStorage.

## Rationale
- **Personalization**: Children enjoy choosing "their" color, increasing engagement
- **Controlled palette**: A curated set of 12 colors ensures all options look good with both the colored arc and the pastel variant
- **Persistence**: Color choice survives page reloads and app restarts (localStorage key: `tempokids_color`)
- **Simplicity**: No color picker widget, no hex input — just tap a swatch
- **Default**: Blue (`#2196F3`) was chosen as default over red for a calmer, more modern feel

## Palette
| Color | Hex |
|-------|-----|
| Bleu | `#2196F3` |
| Rouge | `#F44336` |
| Vert | `#4CAF50` |
| Orange | `#FF9800` |
| Violet | `#9C27B0` |
| Rose | `#E91E63` |
| Turquoise | `#00BCD4` |
| Jaune | `#FFC107` |
| Indigo | `#3F51B5` |
| Teal | `#009688` |
| Lime | `#8BC34A` |
| Amber | `#FF5722` |

## Color Application
The selected color is applied to:
- Clock circle colored arc (external)
- Clock circle pastel arc (internal, derived with opacity)
- DurationPicker accent (active buttons)
- Controls accent (start/resume button)
- Time remaining display text

## Alternatives Considered
- **Full color picker (HSL wheel)**: Too complex for a children's app, hard to use on mobile
- **Theme presets (light/dark/colorful)**: Less granular, doesn't satisfy the "my color" desire
- **Per-circle colors**: Over-complicated, confusing visual output with multiple circles

## Consequences
- `COLOR_PALETTE` constant in `design.ts` is the single source of truth
- `selectedColor` prop threads from `App.tsx` to all colored components
- Adding a new color only requires adding an entry to `COLOR_PALETTE`
