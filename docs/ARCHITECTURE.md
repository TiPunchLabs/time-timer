# ARCHITECTURE.md — TempoKids

## Mental Model

```
+----------------------------------------------------------+
|  App.tsx  (state orchestration)                          |
|                                                          |
|  +-----------+  +-------------+  +-----------+           |
|  | Duration  |  | TimerDisplay|  | Controls  |           |
|  | Picker    |  |  (grid)     |  | (buttons) |           |
|  +-----------+  +------+------+  +-----------+           |
|                        |                                  |
|               +--------+--------+                        |
|               | ClockCircle x N |  (SVG, dual-arc)       |
|               +-----------------+                        |
|                                                          |
|  +-------------+  +------------------+                   |
|  | BurgerMenu  |  | OfflineIndicator |                   |
|  | (presets,   |  +------------------+                   |
|  |  color,     |                                         |
|  |  pastel,   |
|  |  ticks)    |  +------------------+                   |
|  +-------------+  | ErrorBoundary    |                   |
|                    +------------------+                   |
+----------------------------------------------------------+

Hooks:
  useTimer          -->  timer state + persistence (localStorage)
  useLocalStorage   -->  generic JSON read/write to localStorage
  useNetworkStatus  -->  online/offline detection

Utils:
  time.ts  -->  circle data calculation, formatting
  svg.ts   -->  circumference, dasharray, clockwise math
```

## Component Hierarchy

```
ErrorBoundary
  App
    OfflineIndicator
    BurgerMenu
    DurationPicker          (hidden when running/paused/finished)
    TimerDisplay
      ClockCircle * N       (1 to 4, based on duration)
    Controls
```

## Data Flow

```
                    +-----------+
                    |  App.tsx  |
                    +-----+-----+
                          |
        +-----------------+-----------------+
        |                 |                 |
  durationMinutes    useTimer()       useLocalStorage()
  (local state)     (hook)           (color, pastel, ticks)
        |                 |                 |
        v                 v                 v
  DurationPicker    TimerDisplay      BurgerMenu
        |           (reads state)     (writes prefs)
        |                 |
        +--------+--------+
                 |
           time.ts: getCirclesData(totalMinutes, remainingSeconds)
                 |
                 v
           ClockCircleData[]  -->  ClockCircle (SVG rendering)
                                        |
                                   svg.ts: getClockwiseDashArray()
```

### Timer State Machine

```
  idle  ---start()--->  running  ---pause()--->  paused
   ^                      |                        |
   |                      v                        |
   +---reset()---   finished                 resume()
   |                                               |
   +<-----------reset()---------------------------+
```

States:
- **idle**: Duration configured, waiting for start
- **running**: Countdown active via requestAnimationFrame loop
- **paused**: Countdown frozen, pulsation animation on circles
- **finished**: Remaining time = 0, "Termine !" message displayed

### Persistence Strategy

```
+------------------+       +------------------+
|   useTimer       |       | useLocalStorage  |
|                  |       |                  |
| On state change: |       | On pref change:  |
| save to          |       | save to          |
| STORAGE_KEY      |       | COLOR_STORAGE_KEY|
| (timer state)    |       | PASTEL_ENABLED_  |
|                  |       | STORAGE_KEY      |
|                  |       | MINUTE_TICKS_    |
|                  |       | STORAGE_KEY      |
|                  |       | FIVE_MINUTE_     |
|                  |       | TICKS_STORAGE_KEY|
+--------+---------+       +--------+---------+
         |                          |
         v                          v
    localStorage               localStorage
    "tempokids_timer_state"    "tempokids_color"
                               "tempokids_pastel_enabled"
                               "tempokids_minute_ticks"
                               "tempokids_five_minute_ticks"
```

On page reload:
1. `useTimer` reads persisted state
2. If `running`: recalculates remaining time based on elapsed time since `savedAt`
3. If `paused`: restores exact remaining time
4. If `idle` with duration: restores configured duration
5. Color, pastel, and tick marks preferences are restored independently

## SVG Circle Rendering

Each `ClockCircle` renders a layered SVG:

```
Layer 1: Static dial outline (thin black stroke, always visible)
Layer 2: Optional minute tick marks (60 small lines, toggled)
Layer 3: Optional 5-minute tick marks (12 major lines, toggled)
Layer 4: Optional pastel arc (wide stroke, clockwise fill)
Layer 5: Colored arc (thin stroke, clockwise fill)
```

The clockwise fill trick:
- SVG `stroke-dasharray` normally draws counter-clockwise from 3h
- Apply `transform: rotate(90deg) scaleX(-1)` on the arc element
- `scaleX(-1)` flips direction to clockwise
- `rotate(90deg)` moves start from 9h to 12h
- Result: arc fills clockwise from 12h position

## Circle Data Calculation

`getCirclesData(totalMinutes, remainingSeconds)` computes an array of `ClockCircleData`:

- Each circle covers a 60-minute slot
- **Drain order**: circle 0 drains first, last circle (partial) drains last
- **Fill percentage**: `minutes / 60` (always relative to a full hour)
- **maxFillPercentage**: initial fill for last circle (e.g., 30min = 0.5)

Example for 2h30:
```
Start:    [100%] [100%] [50%]     3 circles
After 1h: [  0%] [100%] [50%]     circle 0 drained
After 2h: [  0%] [  0%] [50%]     circle 1 drained
After 2h30:[  0%] [  0%] [  0%]   finished
```

## Responsive Layout

Circle sizes adapt to count:

| Circle count | Size (px) | Layout |
|-------------|-----------|--------|
| 1 | 220 (xl) | Centered |
| 2 | 160 (lg) | Side by side |
| 3-4 | 135 (md) | 2x2 grid |

## Infrastructure

GitHub repository managed via Terraform (`terraform/`):
- Provider: `github`
- Resource: `github_repository`
- Settings: issues enabled, wiki disabled, delete branch on merge

## Key Files

| File | Responsibility |
|------|---------------|
| `src/App.tsx` | Root layout, state wiring, event handlers |
| `src/hooks/useTimer.ts` | Timer state machine, rAF loop, persistence |
| `src/hooks/useLocalStorage.ts` | Generic localStorage with JSON serialization |
| `src/utils/time.ts` | `getCirclesData()`, `formatTime()`, conversions |
| `src/utils/svg.ts` | SVG math for clockwise arcs |
| `src/constants/design.ts` | All magic numbers, colors, presets, storage keys |
| `src/types/timer.ts` | TypeScript interfaces for timer domain |
| `vite.config.ts` | Vite + PWA + Vitest configuration |
