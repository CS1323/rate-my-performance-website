# Copilot instructions for "Rate My Performance"

Purpose
- Provide concise, repo-specific guidance so AI coding agents can make safe, focused edits to this project.

## What the site does
- Reddit-like single-post discussion experience for the "Rate My Performance" world.
- Home page presents one primary post with content/image plus community comments and nested replies.
- Comment system supports:
  - Top-level comments and replies
  - Recursive threading
  - Sort modes and infinite scroll behavior on the home feed
  - Like/dislike voting
  - Reporting flow with moderation handling
- Additional routed pages include:
  - About Me
  - Rules
  - Privacy Policy
  - User Agreement
  - Accessibility
  - CFU Boyfriend Quiz
- Frontend is a React SPA (Vite). Backend is Express + Prisma + PostgreSQL.

## Current repo/project status (March 28, 2026)

Implemented now
- Frontend routes and lazy loading are wired in `client/src/App.jsx`.
- Core discussion flow exists: post display, comments/replies, voting/report UI, and moderation integration.
- Backend API routes are live for posts, comments, votes, reports, and ads.
- Local image serving is available from backend `/images`.
- CORS middleware configured with environment variable control.
- Database indexes on Comment(postId), Comment(parentCommentId), Vote(commentId, ipHash) for performance.
- Zod validators for posts, comments, votes, reports in `server/src/validators/`.
- Try-catch and error states in HomePage.jsx and CommentForm.jsx.
- IP-based vote/report deduplication via hashIp utility.

Partially complete / known risk areas
- **Pre-deployment (due 3/31)**: Rate limiting, structured logging, Sentry monitoring, error boundaries, XSS sanitization, authorization audit, rollback documentation
- **Pre-launch features (due 3/31)**: Reddit-like mobile threading UX, legal pages refresh, Google Analytics setup, WCAG AA compliance
- Deep comment thread readability on mobile still needs mobile-first collapse/indent treatment.
- Accessibility work is present (many ARIA attributes) but WCAG AA end-to-end conformance not yet validated.
- Testing setup with Vitest and Playwright mostly complete; coverage and integration tests in progress.
- Error handling exists but no error boundary component; XSS sanitization not yet added.

Not implemented yet
- Rate limiting middleware (express-rate-limit).
- Structured logging (Winston).
- Production error monitoring (Sentry).
- Frontend ErrorBoundary component.
- Input sanitization (dompurify for XSS prevention).
- Translation framework and localized content (5+ languages).
- Complete integration/system test matrix across frontend/backend.
- Comprehensive README with setup/deploy/contributor guides.

## Conventions and patterns

Architecture and ownership
- Frontend app code: `client/src/`
- Reusable UI: `client/src/components/`
- Page-level views: `client/src/pages/`
- Home discussion feature: `client/src/pages/home/`
- API config and URL helpers: `client/src/config/api.js`
- Backend server entry: `server/server.js`
- Backend routes/controllers/validators:
  - `server/src/routes/`
  - `server/src/controllers/`
  - `server/src/validators/`
- Prisma schema/migrations/seeding:
  - `server/prisma/schema.prisma`
  - `server/prisma/migrations/`
  - `server/prisma/seed.js`

Frontend patterns
- Functional React components with hooks.
- CSS lives alongside/near related components/pages (component/page specific CSS files).
- Use centralized API base URL helpers from `client/src/config/api.js`.
- Keep route-level concerns in page folders and shared concerns in `components` or `utils`.

Backend patterns
- Express route -> controller -> validation/middleware flow.
- Keep request validation in `server/src/validators/`.
- Keep shared middleware in `server/src/middleware/`.
- Keep business logic and API behavior in controllers.

Agent edit style
- Make small, atomic edits.
- Preserve existing naming, folder boundaries, and API contracts unless task explicitly requires change.
- Prefer updating the nearest relevant file instead of broad refactors.

## Preview / local workflow (Windows PowerShell)

Use two PowerShell terminals from the repo root.

Terminal 1: backend API
```powershell
cd .\server
npm install
npm run dev
```
Expected:
- Backend runs on `http://localhost:5001` (default from `PORT` fallback).
- API base routes are under `/api/*`.

Terminal 2: frontend app
```powershell
cd .\client
npm install
npm run dev
```
Expected:
- Vite dev server at `http://localhost:5173`.
- Frontend talks to backend using `VITE_API_BASE_URL` (or fallback `http://localhost:5001`).
- This is the default local workflow for regular development.

Switching directories quickly in PowerShell
```powershell
cd ..\server
cd ..\client
```

Optional frontend preview of the production build
```powershell
cd .\client
npm run build
npm run preview
```
Expected:
- Preview server commonly on `http://localhost:4173`.
- Keep the backend server running separately while using preview.
- Ensure `CORS_ORIGIN` includes `http://localhost:4173` if the preview app is calling the local backend directly.
- Use this only when you specifically want to smoke-test the built bundle; it is not required for normal development.

Useful backend scripts
```powershell
cd .\server
npm run prisma:migrate
npm run seed:db
npm run default:db
npm test
```

Environment reminders
- Backend reads env such as `PORT`, `CORS_ORIGIN`, `GEMINI_API_KEY`.
- Frontend reads `VITE_API_BASE_URL`.
- Test workflows may rely on `.env.test` in `server/`.

## Pre-Deployment Checklist (Target: Tuesday, 3/31/2026)

This checklist ensures the site is hardened for production launch. Each item has a status icon and verification steps.

### Status Legend
- ✅ **Already Implemented** — verified in codebase; confirm before deploy
- 🟡 **Partially Implemented** — exists but has gaps; address gaps or document why acceptable
- ❌ **Not Implemented** — missing; must address before production
- 🔵 **Not Applicable** — intentional design or N/A for this site

### Checklist Items

#### 1. ✅ CORS (already implemented)
- **File**: `server/src/middleware/cors.middleware.js`
- **Current State**: CORS origins controlled via `CORS_ORIGIN` environment variable; supports multiple comma-separated origins; credentials enabled
- **Verification**:
  1. Check `CORS_ORIGIN` is set correctly for production domain in `.env.production`
  2. Verify no `*` wildcard used (must be explicit origin list)
  3. Test cross-origin requests from production domain are allowed, others denied
- **No action needed** unless production domain is not yet set in environment

#### 2. ✅ Database Indexes (already implemented)
- **File**: `server/prisma/schema.prisma`
- **Current State**: Indexes exist on `Comment(postId)`, `Comment(parentCommentId)` for threading queries; `Vote(commentId, ipHash)` unique index prevents duplicate votes
- **Verification**:
  1. Confirm migrations have been applied: `npm run prisma:migrate`
  2. Run load test or check query performance: key queries (list comments, fetch post) should complete in <100ms
  3. Query plan inspection: `EXPLAIN ANALYZE` on recursive comment queries should use indexes
- **No action needed** if performance is acceptable

#### 3. 🟡 Input Validation & Sanitization (partially implemented)
- **Validation**: ✅ Backend validators exist in `server/src/validators/` (Zod schemas for comments, posts, votes, reports)
- **Frontend Validation**: ✅ Partial validation in `client/src/pages/home/CommentForm.jsx` (length limits, emptiness checks)
- **Sanitization Gap**: ❌ No XSS sanitization library actively used; comments rendered with user-provided text
- **Verification**:
  1. Test SQL injection: try `'; DROP TABLE comments; --` in comment form → should be escaped
  2. Test XSS payload: try `<script>alert('xss')</script>` in comment → should render as text, not execute
  3. Verify Zod validators enforce max lengths (especially comments field)
- **If failing**: Add `dompurify` to `server/package.json`, sanitize comment body and names before storing: use `DOMPurify.sanitize(input)` in `server/src/controllers/comments.controller.js`

#### 4. ✅ Rate Limiting (IMPLEMENTED)
- **Current State**: `express-rate-limit` fully configured and deployed
- **Implementation Details**:
  - File: `server/src/middleware/rateLimit.middleware.js` — Reusable rate limiting middleware
  - General limiter: 100 requests per 15 minutes (applied globally)
  - Strict limiter: 10 requests per 1 minute (applied to POST endpoints: comments, votes, reports)
  - IPv6 compatible; skipped in development mode to avoid blocking local testing
  - Applied to all sensitive routes: `comments.routes.js`, `votes.routes.js`, `reports.routes.js`
- **Verification**: ✅ Tested locally; confirmed rate limiter blocks requests and returns 429 on limit exceeded

#### 5. 🔵 Password Reset Link Expiration (NOT APPLICABLE)
- **Reason**: Site is intentionally anonymous; no user accounts, no authentication, no password resets
- **Design Choice**: Per [README.md](../README.md), users enter a username/avatar without creating an account or logging in
- **No action needed**

#### 6. 🟡 Frontend Error Handling (partially implemented)
- **Current State**: ✅ Try-catch exists in `HomePage.jsx` and `CommentForm.jsx`; error states shown to user
- **Gaps**: ❌ No error boundary component; some errors only logged to console; no 500-error fallback UI
- **Verification**:
  1. Test network outage: disable backend, try posting a comment → user should see error message (not blank/crash)
  2. Test API error response: manually return 500 from backend → frontend should show user-friendly error
  3. Inspect browser console: should not show uncaught exceptions for missing optional data
- **If failing**: 
  1. Create `client/src/components/ErrorBoundary.jsx` with class component + `componentDidCatch()` to catch React render errors
  2. Wrap `<HomePage />` in `ErrorBoundary` in `App.jsx`
  3. Ensure all `.then()` chains include `.catch()` with error state update

#### 7. ✅ Server Logging (IMPLEMENTED)
- **Current State**: Winston logger fully configured with structured JSON output
- **Implementation Details**:
  - File: `server/src/utils/logger.js` — Winston logger with dual transports (console + file)
  - Colorized console output in development; JSON format in production
  - Error log: `logs/error.log` (errors only, 5MB max files, 5-file rotation)
  - Combined log: `logs/combined.log` (all levels, 5MB max files, 5-file rotation)
  - Log level configurable via `LOG_LEVEL` environment variable (default: debug in dev, info in prod)
  - All controllers updated: replaced `console.error()` with structured `logger.error()` calls
  - Error middleware logs errors with context: statusCode, stack, method, path, URL
- **Verification**: ✅ Tested locally; debug endpoints confirm logs writing to disk with full JSON context

#### 8. ✅ Production Monitoring & Alerts (IMPLEMENTED)
- **Current State**: Sentry fully integrated for both backend and frontend error tracking
- **Implementation Details**:
  - Backend: `server/instrument.js` initializes Sentry at module load (imported via `NODE_OPTIONS='--import ./instrument.js'`)
    - Follows Sentry's recommended Node.js pattern with proper ESM support
    - Loads `.env` via `dotenv.config()` before Sentry initialization
    - Reads `SENTRY_DSN` from environment; silent when DSN is empty (dev-safe)
    - Error handler via `Sentry.setupExpressErrorHandler(app)` applied after all routes
  - Frontend: `client/src/main.jsx` initializes Sentry before React root creation
    - Reads `VITE_SENTRY_DSN` from environment; silent when DSN is empty
    - Automatic error boundary capture for unhandled React errors
  - Environment configuration: DSNs configured in Render (backend) and Vercel (frontend)
  - Production deployment: Errors automatically send to Sentry in production
- **Verification**: ✅ Tested locally; DSNs deployed to production; errors flowing to sentry.io

#### 9. 🟡 Authorization & Access Control (partially applicable)
- **Current State**: 🔵 No user authentication—by design, site is fully anonymous
- **Access Control Needed**: Only validate that:
  - Users can only report/vote on their own IP (prevent manipulation): ✅ already hash IP + store in Vote/Report
  - Moderation endpoints (if any) are not exposed: ⚠️ check that `server/src/routes/` do not include unprotected moderation APIs
- **Verification**:
  1. Check `server/src/routes/` — confirm no "delete user", "ban user", "moderate" endpoints are public
  2. Test: try to delete someone else's comment via REST client → should fail (403 Forbidden or 401 Unauthorized)
- **If failing**: Add middleware to validate user owns the resource before allow deletion

#### 10. 🟡 Rollback Strategy (partially implemented)
- **Current State**: 
  - Frontend: ✅ Vercel auto-rollback on failed deploy available (via dashboard)
  - Database: ⚠️ Prisma migrations support rollback via `npm run prisma:migrate resolve --rolled-back <migration_name>`, but not automated
  - Noted in `server/package.json`: `prisma:migrate` is available
- **Verification**:
  1. Verify Vercel "Auto-rollback" is enabled for frontend deployment
  2. Document rollback steps in deployment runbook:
     - Frontend: Redeploy previous commit to Vercel (or use Vercel rollback button)
     - Backend: For database, note: `npm run prisma:migrate resolve --rolled-back <migration>` then redeploy Express server
     - Create a `.github/ROLLBACK.md` file with step-by-step instructions
- **Action**: Create `.github/ROLLBACK.md` with rollback procedures; no code changes required if manual process is documented

---

### Deploy Blockers (Must Fix Before Tuesday 3/31)

These 7 items **must** be completed before production launch, alongside roadmap items 1–4. Critical blockers should be prioritized first.

**Hard Blockers (Security/Stability) — ALL COMPLETE & DEPLOYED:**
1. ✅ **Rate Limiting** — `express-rate-limit` installed and deployed; 10 req/min on POST, 100 req/15min general. Live in production.
2. ✅ **Server Logging (Structured)** — Winston logger active; JSON logs to disk with full context. Live in production.
3. ✅ **Monitoring & Alerts** — Sentry fully integrated and deployed to production. Errors flowing to sentry.io and alerts configured.

**High-Priority Gaps (Pre-Launch Risk Mitigation):**
4. **Frontend Error Handling** — Add ErrorBoundary component and ensure all API calls have error handlers.
5. **XSS Sanitization** — Add dompurify to prevent code injection attacks on user-submitted content.
6. **Authorization Audit** — Verify no unprotected moderation endpoints; test delete/vote restrictions.
7. **Rollback Strategy Doc** — Create .github/ROLLBACK.md with step-by-step recovery procedures.

**Recommended Priority Order**: 
1. Items 1–3 (hard blockers: rate limiting, logging, monitoring)
2. Items 4–6 (gap mitigation: error handling, sanitization, auth audit)
3. Item 7 (documentation: rollback procedures)
4. Roadmap 1 & 4 (high user impact: Reddit threading, Google Analytics)
5. Roadmap 3 (compliance/trust: legal pages)
6. Roadmap 2 (defer to post-launch if time pressure: WCAG AA audit)

---

## Known Issues & Limitations (as of 3/29/2026)

### Hard Blockers Status: ✅ COMPLETE & DEPLOYED
All three hard blockers are implemented, tested locally, and deployed to production (Render + Vercel). DSNs configured and errors now flowing to sentry.io.

### Code-Complete Items
- **Server startup**: Processes cleanly; all middleware in correct order
- **Rate limiting**: Enabled in production, skipped in development to avoid blocking local testing
- **Logging**: Winston logger writing to disk; colorized console in dev, JSON in production
- **Sentry**: Initialized via `NODE_OPTIONS='--import ./instrument.js'` pattern; active in production

### Pending Production Items (Before 3/31)
1. **Frontend Error Boundary** (gap mitigation)
   - Error states exist in HomePage.jsx and CommentForm.jsx
   - No React ErrorBoundary component yet; add if uncaught render errors occur in production

2. **XSS Sanitization** (security audit recommended pre-launch)
   - Comments rendered with user text; test with payload: `<script>alert('xss')</script>`
   - If vulnerable: add `dompurify` package and sanitize comment bodies in controllers

3. **Authorization audit**
   - Verify no unprotected moderation endpoints in `server/src/routes/`
   - Test delete/report restrictions

4. **Rollback strategy documentation**
   - Create `.github/ROLLBACK.md` with frontend/backend recovery procedures

### Known Dependency Issues
- **npm audit warnings**: 6 vulnerabilities (1 moderate, 5 high) in `server/package.json`
  - Root cause: Prisma 6.19.2 dependency on `@prisma/internals` has transitive deps with known CVEs
  - Status: Cannot be resolved without Prisma upgrade (not available as of 3/29/2026)
  - Risk mitigation: High-severity packages only affect Prisma's internal build tooling, not runtime code
  - Action: Monitor Prisma releases; upgrade when available
  - Reference: `npm audit` in server/ shows details

### Remaining Roadmap Items (Post-launch or if time permits)
- Reddit-like mobile threading UX (⭐⭐⭐ priority)
- Google Analytics integration (⭐⭐⭐ priority)
- Legal pages refresh (⭐⭐ priority)
- WCAG AA audit (⭐ lowest priority)
- i18n translations (post-launch)

---

### ⏰ Deadline Breakdown
- **Items 1–4**: Due **3/31/2026** (pre-launch requirements; deploy blockers must complete first)
- **Item 6**: ✅ **Mostly complete** (verify & finalize)
- **Items 5, 7**: Due **4/16/2026** (post-launch sprints)

### 🚀 Pre-Launch — Due 3/31/2026

1) ❌ Add Reddit-like threading to comments (especially for mobile screens)
- **Priority**: ⭐⭐⭐ User-facing impact, high priority
- **Scope**: Improve deep-thread readability on narrow viewports
  - Reduce or eliminate forced horizontal scrolling for deep reply chains
  - Define mobile-friendly indentation/collapse rules and branch loading behavior
  - Keep accessibility semantics intact for nested discussions

2) 🟡 Make site meet WCAG AA accessibility standards
- **Priority**: ⭐ Defer if time critical (lowest of pre-launch items)
- **Scope**: Full WCAG AA audit and compliance
  - Ensure keyboard-only operability (navigation, forms, modal, thread controls)
  - Ensure visible focus states and compliant color contrast
  - Validate semantic structure, labels, and screen-reader announcements

3) ❌ Update legal pages (rules, privacy policy, user agreement, accessibility)
- **Priority**: ⭐⭐ Medium (compliance + user trust)
- **Scope**: Production-ready legal content
  - Refresh legal copy for production readiness
  - Verify consistency of terms, moderation language, and contact information
  - Ensure page content and effective-date formatting are uniform

4) ❌ Add Google Analytics to be used in production
- **Priority**: ⭐⭐⭐ User-flagged priority
- **Scope**: Production-safe analytics integration
  - Implement GA in production-safe way (no noisy local/dev tracking by default)
  - Gate tracking by environment and consent requirements
  - Document configuration steps and required environment variables

### 📋 Post-Launch — Due 4/16/2026

5) Add translations (include French, Italian, Dutch, German)
- Add i18n framework and locale routing/selection strategy.
- Localize core navigation, discussion UI, legal pages, and system messages.
- Support at minimum: English, French, Italian, Dutch, German.

6) ✅ Add unit, integrated, and system tests
- **Status**: Mostly complete—verify final coverage
- Frontend: Vitest with component/unit coverage for home/thread/form flows.
- Backend: Vitest for route/controller/validator coverage.
- Playwright for e2e integration tests covering key user journeys.
- Keep Lighthouse-based performance regression checks in the release workflow.

7) Documentation (README)
- Expand README with setup, run, build, test, env, architecture, and deployment guidance.
- Add clear contributor workflow notes for frontend/backend changes.

## Out-of-scope guardrail for instruction-only edits
- Updating this instruction file does not itself implement product features.
- Do not mark roadmap items complete until code, tests, and docs are actually delivered and verified.
