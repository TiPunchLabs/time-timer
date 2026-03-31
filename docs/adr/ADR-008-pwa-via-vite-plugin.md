# ADR-008: PWA via vite-plugin-pwa with Workbox

## Status
Accepted

## Date
2025-12-20

## Context
The PRD requires the app to work offline and be installable on mobile devices. This requires a service worker, a web app manifest, and proper caching strategy.

## Decision
Use `vite-plugin-pwa` (backed by Workbox) for service worker generation and PWA support.

## Rationale
- **Zero-config SW**: Automatically generates a service worker with sensible defaults
- **Vite integration**: Seamlessly integrates with the Vite build pipeline
- **Workbox underneath**: Production-grade caching strategies without manual SW code
- **Auto-update**: `registerType: 'autoUpdate'` ensures users always get the latest version
- **Manifest generation**: Inline manifest config in `vite.config.ts`, no separate file to maintain

## Configuration Summary
```typescript
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'favicon.svg', 'icons/*.png'],
  manifest: { /* name, icons, theme_color, display: 'standalone' */ },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    navigateFallback: '/index.html',
    runtimeCaching: [/* Google Fonts cache */]
  }
})
```

## Caching Strategy
- **Precache**: All build assets (JS, CSS, HTML, icons, SVG) via `globPatterns`
- **Runtime cache**: Google Fonts with CacheFirst strategy (1 year expiry)
- **Navigation**: Fallback to `/index.html` for SPA routing

## Alternatives Considered
- **Manual service worker**: Full control but significant boilerplate, error-prone cache invalidation
- **@vite-pwa/assets-generator**: Considered for icon generation but manual icons were sufficient
- **Next.js / Remix with PWA**: Would introduce SSR complexity not needed for a client-only timer app

## Consequences
- Service worker is generated at build time, no source file to maintain
- `display: 'standalone'` + `orientation: 'portrait'` provides native-like experience
- Offline support is automatic — all assets are precached
- App updates are applied silently on next visit
