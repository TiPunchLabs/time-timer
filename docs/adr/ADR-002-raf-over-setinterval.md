# ADR-002: requestAnimationFrame over setInterval for Timer

## Status
Accepted

## Date
2025-12-20

## Context
The timer countdown needs smooth, accurate visual updates. Two common approaches exist: `setInterval` with a fixed tick rate, or `requestAnimationFrame` (rAF) for frame-synced updates.

## Decision
Use `requestAnimationFrame` for the countdown animation loop in `useTimer`.

## Rationale
- **Accuracy**: rAF calculates elapsed time from `Date.now() - startedAt`, immune to timer drift
- **Smoothness**: Updates are synced to the display refresh rate (~60fps), producing fluid arc drain
- **Battery-friendly**: rAF automatically pauses when the tab is backgrounded
- **No drift**: `setInterval` can drift over long durations (up to 4 hours); rAF + timestamp comparison is drift-free

## Implementation
```
tick() {
  elapsed = (Date.now() - startedAt - pausedDuration) / 1000
  remaining = max(0, totalDuration - elapsed)
}
```
The animation loop runs via `requestAnimationFrame(animate)` recursively while `status === 'running'`.

## Alternatives Considered
- **setInterval(1000)**: Simple but drifts over time, doesn't pause in background tabs, updates only once per second (visible stutter on arc drain)
- **setInterval(100)**: Less drift, but still not frame-synced and wastes cycles when tab is hidden

## Consequences
- Timer precision depends on `Date.now()`, not tick count — correct even after tab backgrounding
- Persistence logic must account for elapsed time during page absence (see ADR-003)
- Update interval constant (`TIMER_UPDATE_INTERVAL = 100ms`) exists but rAF governs actual frame rate
