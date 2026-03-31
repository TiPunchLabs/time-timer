# TempoKids - Development Guidelines

## Project Overview

TempoKids is a PWA visual timer for children using analog clock circles (1 circle = 1 hour). Built with React 18+, TypeScript, Vite, and Tailwind CSS.

## Commands

```bash
pnpm dev             # Development server (Vite)
pnpm build           # Production build
pnpm preview         # Preview production build
pnpm test            # Run tests (Vitest)
pnpm test:watch      # Tests in watch mode
pnpm test:coverage   # Tests with coverage
pnpm lint            # ESLint
pnpm type-check      # TypeScript type checking
```

## Project Structure

```text
src/
  App.tsx                        # Root component — layout, state orchestration
  main.tsx                       # Entry point
  components/
    BurgerMenu/                  # Slide-out menu: presets, color picker, pastel/ticks toggles
    ClockCircle/                 # SVG clock circle with dial outline, tick marks, dual-arc rendering
    Controls/                    # Start / Pause / Resume / Reset buttons
    DurationPicker/              # Hours + minutes input with rollover
    ErrorBoundary/               # React error boundary wrapper
    OfflineIndicator/            # Network status banner
    TimerDisplay/                # Grid layout for 1-4 clock circles
    icons/                       # SVG icon components (Play, Pause, Reset, Burger, etc.)
  hooks/
    useTimer.ts                  # Core timer logic (start/pause/resume/reset + persistence)
    useLocalStorage.ts           # Generic localStorage hook with JSON serialization
    useNetworkStatus.ts          # Online/offline detection
  utils/
    time.ts                      # Circle data calculation, time formatting
    svg.ts                       # SVG math (circumference, dasharray, clockwise fill)
  types/
    timer.ts                     # TimerState, TimerStatus, ClockCircleData, PersistedState
  constants/
    design.ts                    # Colors, sizes, presets, storage keys, intervals
tests/                           # Vitest tests mirroring src/ structure
specs/                           # Feature specifications (001-006)
terraform/                       # GitHub repository management via Terraform
public/                          # Static assets, PWA icons, screenshots
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

Key patterns:
- **Component-based**: Functional React components with hooks
- **Custom hooks**: `useTimer` manages all timer state + localStorage persistence
- **SVG rendering**: Clock circles use `stroke-dasharray` / transform tricks for clockwise fill from 12h
- **requestAnimationFrame**: Smooth countdown animation (not setInterval)
- **localStorage**: User preferences (color, pastel toggle, tick marks) and timer state persistence

## Code Style

- **Language**: TypeScript 5.x strict, React 18+ functional components
- **Styling**: Tailwind CSS utility classes only (no custom CSS)
- **Package manager**: pnpm (never npm/yarn)
- **Commits**: Conventional Commits (feat:, fix:, chore:, docs:)
- **Tests**: Vitest + @testing-library/react

## Active Technologies

| Technology | Role |
|------------|------|
| React 18+ | UI framework |
| TypeScript 5.x | Type safety |
| Vite 6 | Build tool + dev server |
| Tailwind CSS 3 | Styling |
| vite-plugin-pwa | Service worker, manifest, offline support |
| Vitest | Unit testing |
| @testing-library/react | Component testing |
| localStorage | State persistence (timer, color, pastel, tick marks prefs) |
| Terraform | GitHub repository IaC |

## Feature History

| # | Feature | Branch | Status |
|---|---------|--------|--------|
| 001 | Time Timer PWA (initial MVP) | main | Merged |
| 002 | Fix timer display order | 002-fix-timer-display-order | Merged |
| 003 | Code quality (ErrorBoundary, tests, a11y) | main | Merged |
| 004 | Fix minute rollover in DurationPicker | 004-fix-minute-rollover | Merged |
| 005 | Persist timer state on reload | 005-persist-timer-state | Merged |
| 006 | Burger menu with presets + color selector | 006-burger-menu-presets | Merged |
| 007 | Pastel circle toggle | 007-pastel-toggle | Merged |
| 008 | Static dial outline + tick marks | 008-static-dial-outline | In progress |

## User Preferences

- **Package Manager**: pnpm (always use pnpm instead of npm/yarn)
- **Documentation language**: French (README, specs, PRD) / English (code, comments, CLAUDE.md)
