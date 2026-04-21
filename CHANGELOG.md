# Changelog

All notable changes to Rate My Performance CFU are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/) | Versioning: [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

_Nothing pending._

---

## [1.0.0] — 2026-04-20

### Added

**Frontend**
- React 19 SPA with Vite build tooling and lazy-loaded routes
- Threaded comment system with collapsible/expandable branches
- Like/dislike voting with optimistic UI updates
- Comment reporting flow with moderation integration
- Anonymous posting — display name + avatar selection, no authentication required
- Infinite scroll pagination for comments
- WCAG 2.1 Level AA accessibility (keyboard nav, ARIA live regions, focus management, skip link, 44×44 px touch targets, `prefers-reduced-motion`)
- Mobile-responsive design with reduced indentation on narrow viewports
- Multi-language support: English, French, German, Italian, Dutch via URL-based routing (`/:lang/*`)
- `LanguageSelector` component with `aria-current` and `lang` attributes
- `ErrorBoundary` component wrapping the home page with dev-only error details
- Sentry error tracking (gated on `VITE_SENTRY_DSN`)
- Google Analytics 4 via `react-ga4` (gated on `VITE_GA_ID`; localhost excluded)
- Interactive CFU Boyfriend Quiz page
- Legal pages: Rules, Privacy Policy (GDPR/CCPA/COPPA/DMCA), User Agreement, Accessibility Statement
- All legal content translated to 5 languages

**Backend**
- Express 5 API with structured Zod request validation
- PostgreSQL database via Prisma 6 ORM
- IP-based vote and report deduplication (hashed IP, unique constraint)
- Google Gemini API integration for LLM-assisted content moderation
- Rate limiting: 100 req/15 min global; 10 req/1 min on POST endpoints
- XSS sanitisation via DOMPurify on all user-submitted text
- Winston structured logging (JSON in production, colourised in dev, log rotation)
- Sentry error tracking with `setupExpressErrorHandler`
- Database indexes: `Comment(postId)`, `Comment(parentCommentId)`, `Vote(commentId, ipHash)`
- CORS middleware controlled via `CORS_ORIGIN` environment variable

**Testing**
- 55 server unit tests across 14 files (controllers, validators, middleware, utilities)
- 27 client unit/integration tests across 10 files (components, hooks, context, API config)
- 3 Playwright E2E specs: `home.spec.js`, `comments.spec.js`, `votes.spec.js` — 9 tests, all passing

**DevOps / Documentation**
- Vercel (frontend) + Render (backend) + Neon (database) deployment pipeline
- Auto-deploy on push to `main`
- Comprehensive rollback procedures: `.github/ROLLBACK.md`
- `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `LICENSE`
- `.env.example` templates for both `server/` and `client/`

### Performance (Lighthouse, April 2026)
- Score: 95/100
- LCP: 2.4 s
- TBT: 0 ms

### Known Issues at Release
- **npm audit** — 6 vulnerabilities (Prisma 6.19.2 build-tooling transitive deps; no runtime exposure)
- **Axios pin** — `client` pinned to `1.14.0` to avoid compromised `1.14.1`/`0.30.4` versions
- **GA location data** — city/region may reflect Vercel edge-server IPs rather than actual visitor locations
- **Deep mobile threading** — 5+ level threads may require horizontal scroll on very narrow viewports

---

[Unreleased]: https://github.com/cadencekeys/rate-my-performance-website/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/cadencekeys/rate-my-performance-website/releases/tag/v1.0.0
