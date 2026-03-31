# ADR-003: localStorage for State Persistence

## Status
Accepted

## Date
2025-12-21

## Context
Users expect the timer to survive page reloads — a running timer should resume, a paused timer should restore, and the configured duration should be preserved. The app also persists user preferences (color, pastel toggle).

## Decision
Use `localStorage` with JSON serialization for all persistence needs.

## Rationale
- **Simplicity**: Synchronous API, no async complexity, no schema/migration tooling needed
- **Sufficient capacity**: Timer state is a few hundred bytes; localStorage provides ~5MB
- **Universal support**: Available in all target browsers, works offline
- **No dependencies**: No IndexedDB wrapper library needed
- **Matches scope**: Single-device app with no sync requirements (cloud sync is explicitly out of scope for v1)

## Storage Keys
| Key | Content | Written by |
|-----|---------|-----------|
| `tempokids_timer_state` | `PersistedState` (totalDuration, remainingTime, status, savedAt) | `useTimer` |
| `tempokids_color` | Hex color string | `useLocalStorage` via App |
| `tempokids_pastel_enabled` | Boolean | `useLocalStorage` via App |

## Restore Logic on Reload
- **running**: `newRemaining = persisted.remainingTime - (now - savedAt) / 1000`. If <= 0, mark finished.
- **paused**: Restore exact `remainingTime` (no elapsed time deduction).
- **idle with duration**: Restore configured duration.
- **finished**: Discard, start fresh.

## Validation
`isValidPersistedState()` guards against corrupted or tampered data before restoring.

## Alternatives Considered
- **IndexedDB**: Async, more complex API, overkill for key-value storage of small objects
- **sessionStorage**: Doesn't survive browser restarts, too limited
- **No persistence**: Poor UX — accidental reload loses a multi-hour timer

## Consequences
- Data is device-local only (no cross-device sync, by design)
- `useLocalStorage` hook provides generic JSON read/write for any key
- Version field in `PersistedState` enables future migrations if schema changes
