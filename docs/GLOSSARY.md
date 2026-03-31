# GLOSSARY.md — TempoKids

Domain vocabulary used across code, specs, and documentation.

## Timer Domain

| Term | Definition |
|------|-----------|
| **Clock Circle** | A single SVG circle representing exactly 1 hour (60 minutes). Up to 4 displayed. |
| **Circle Count** | Number of circles needed = `ceil(totalMinutes / 60)`. |
| **Full Circle** | A circle at 100% fill (representing a complete hour). |
| **Partial Circle** | A circle with fill < 100% (the last circle when duration isn't a full hour). |
| **Empty Circle** | A circle at 0% fill — its time has been consumed. Remains visible (gray). |
| **Drain** | The visual process of a circle's fill arc decreasing over time. |
| **Drain Order** | Circle 0 drains first (sequential), partial circle drains last. |
| **Fill Percentage** | Ratio of remaining minutes to 60 (always relative to a full hour, 0-1). |
| **Max Fill Percentage** | Initial fill of a circle. Full circles = 1.0, last partial circle = `minutes / 60`. |

## Visual Design

| Term | Definition |
|------|-----------|
| **Colored Arc** | The thin external SVG arc showing remaining time (user-selected color). |
| **Pastel Arc** | The wide internal SVG arc (same color, lower opacity). Optional, toggled in menu. |
| **Dual-Arc** | The layered design pattern: colored arc + pastel arc draining together. |
| **Clockwise Fill** | Arc starts at 12h and extends clockwise. Achieved via `rotate(90deg) scaleX(-1)` CSS transform. |
| **Dial Outline** | Thin black circle (`#333333`, 1px) always visible on each clock circle, independent of timer state. |
| **Minute Ticks** | 60 small tick marks (one per minute) around the dial outline. Optional, toggled in burger menu. |
| **Five-Minute Ticks** | 12 prominent tick marks (every 5 minutes) around the dial outline. Optional, toggled in burger menu. |
| **Pulsation** | Opacity animation on circles when timer is paused, signaling the paused state. |

## Timer States

| Term | Definition |
|------|-----------|
| **idle** | Timer configured with a duration but not started. |
| **running** | Countdown active, circles draining via requestAnimationFrame loop. |
| **paused** | Countdown frozen, pulsation animation active. |
| **finished** | Remaining time = 0, "Termine !" displayed. |

## UI Components

| Term | Definition |
|------|-----------|
| **DurationPicker** | Input widget for hours + minutes with +/- buttons and rollover behavior. |
| **Burger Menu** | Slide-out panel (right side) with preset durations, color picker, pastel toggle, and tick marks toggles. |
| **Preset Duration** | Pre-configured duration (30, 45, 75, 90, 120, 150 min) selectable from burger menu. |
| **Color Palette** | Fixed set of 12 colors the user can choose from. |
| **Rollover** | DurationPicker behavior: incrementing minutes past 55 rolls to 0 and increments hours (and vice versa). |
| **Reload Prompt** | Bottom banner shown when a new service worker version is available. User can click to update or dismiss. |

## Technical

| Term | Definition |
|------|-----------|
| **stroke-dasharray** | SVG attribute controlling the pattern of dashes/gaps on a circle stroke. Used to render fill arcs. |
| **PersistedState** | Data structure saved to localStorage representing the timer's state at a point in time. |
| **savedAt** | Timestamp in `PersistedState` used to calculate elapsed time on page reload. |
| **rAF** | Abbreviation for `requestAnimationFrame` — the browser API driving the countdown loop. |
| **Service Worker Prompt** | PWA update strategy where the new SW waits for user confirmation before activating (vs `autoUpdate` which activates silently). |
