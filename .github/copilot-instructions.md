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

## Current repo/project status (March 11, 2026)

Implemented now
- Frontend routes and lazy loading are wired in `client/src/App.jsx`.
- Core discussion flow exists: post display, comments/replies, voting/report UI, and moderation integration.
- Backend API routes are live for posts, comments, votes, reports, and ads.
- Local image serving is available from backend `/images`.

Partially complete / known risk areas
- Deep comment thread readability on mobile still needs a more robust Reddit-like UX treatment.
- Accessibility work is present (many ARIA attributes/components), but WCAG AA conformance is not yet fully validated end-to-end.
- Jest is configured in backend scripts, but full automated coverage is not yet established.

Not implemented yet
- Production Google Analytics integration.
- Translation framework and localized content.
- Frontend unit test setup with Vitest.
- Complete integration/system test matrix across frontend/backend.
- Comprehensive README and supporting project documentation.

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

#### 4. ❌ Rate Limiting (NOT IMPLEMENTED — DEPLOY BLOCKER)
- **Current State**: No request throttling; vulnerable to spam/abuse attacks
- **Risk**: Attacker can spam comments, generate thousands of votes, or overload the API
- **Implementation**:
  1. Install: `npm install express-rate-limit` in `server/`
  2. Create `server/src/middleware/rateLimit.middleware.js`:
     ```javascript
     const rateLimit = require('express-rate-limit');
     
     const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100, // 100 requests per windowMs
       standardHeaders: true,
       legacyHeaders: false,
       keyGenerator: (req) => req.ip || req.connection.remoteAddress
     });
     
     const strictLimiter = rateLimit({
       windowMs: 60 * 1000, // 1 minute
       max: 10, // 10 requests per minute for sensitive endpoints
     });
     
     module.exports = { limiter, strictLimiter };
     ```
  3. Apply in `server/server.js` before routes: `app.use(limiter);` for general, `app.post('/api/comments', strictLimiter, ...)` for forms
  4. Verify in production: trigger rate limit response (should return 429 Too Many Requests)
- **Verification**: Use `ab` (ApacheBench) or `autocannon` to send >100 requests in 15 min window; confirm 429 response after limit

#### 5. 🔵 Password Reset Link Expiration (NOT APPLICABLE)
- **Reason**: Site is intentionally anonymous; no user accounts, no authentication, no password resets
- **Design Choice**: Per [README.md](README.md), users enter a username/avatar without creating an account or logging in
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

#### 7. ❌ Server Logging (NOT IMPLEMENTED — DEPLOY BLOCKER)
- **Current State**: Only `console.log()` used; logs go to stdout, no structured format, difficult to parse/aggregate in production
- **Risk**: When production breaks, logs are scattered; no context (timestamps, request IDs, error severity)
- **Implementation**:
  1. Install: `npm install winston` in `server/`
  2. Create `server/src/utils/logger.js`:
     ```javascript
     const winston = require('winston');
     
     const logger = winston.createLogger({
       level: process.env.LOG_LEVEL || 'info',
       format: winston.format.combine(
         winston.format.timestamp(),
         winston.format.errors({ stack: true }),
         winston.format.json()
       ),
       transports: [
         new winston.transports.Console({
           format: winston.format.combine(
             winston.format.colorize(),
             winston.format.simple()
           )
         }),
         new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
         new winston.transports.File({ filename: 'logs/combined.log' })
       ]
     });
     
     module.exports = logger;
     ```
  3. Replace `console.log()` with `logger.info()` and `console.error()` with `logger.error()` in:
     - `server/server.js` (startup)
     - `server/src/middleware/error.middleware.js` (error stack traces)
     - `server/src/controllers/*` (request start/end, important decisions)
  4. Create `logs/` directory (add to `.gitignore`)
- **Verification**: Deploy to staging, trigger an error, check `logs/error.log` contains structured JSON with timestamp and error message

#### 8. ❌ Production Monitoring & Alerts (NOT IMPLEMENTED — DEPLOY BLOCKER)
- **Current State**: No error tracking service (Sentry, DataDog, New Relic); no automated alerts if site goes down
- **Risk**: Users discover bugs before you do; production outage has no visibility
- **Implementation (Option A: Sentry, recommended for MVP)**:
  1. Sign up at [sentry.io](https://sentry.io) (free tier available)
  2. Backend: `npm install @sentry/node` in `server/`
     ```javascript
     // server/server.js, near top
     const Sentry = require('@sentry/node');
     Sentry.init({ dsn: process.env.SENTRY_DSN });
     app.use(Sentry.Handlers.requestHandler());
     app.use(Sentry.Handlers.errorHandler()); // must be last middleware
     ```
  3. Frontend: `npm install @sentry/react` in `client/`
     ```javascript
     // client/src/main.jsx, before createRoot
     import * as Sentry from '@sentry/react';
     Sentry.init({ dsn: process.env.VITE_SENTRY_DSN });
     ```
  4. Set `.env.production` with `SENTRY_DSN` and `VITE_SENTRY_DSN` keys
  5. Create alert rule in Sentry dashboard: email on 10+ errors in 10 minutes
- **Verification**: 
  1. Trigger a test error in production: `throw new Error('Sentry test')` in a controller temporarily
  2. Confirm Sentry receives the error within seconds
  3. Confirm email alert is sent to your address

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

These 3 items **must** be addressed before production launch:

1. **Rate Limiting** — Without request throttling, site is vulnerable to spam/comment bombs. Add express-rate-limit middleware (1–2 hours)
2. **Server Logging (Structured)** — Replace console.log with Winston; add logs/error.log to production. Enables debugging when production breaks (1–2 hours)
3. **Monitoring & Alerts** — Integrate Sentry or equivalent to detect errors before users report them. Without this, you will be flying blind in production (1–3 hours depending on Sentry setup)

All other items are either already done (✅) or acceptable as post-launch improvements (🟡).

---

## TODO roadmap (pending work)

Important
- The items below are planned/pending and should not be assumed complete.
- When implementing them, update this file and README to keep status accurate.

1) Add Reddit-like threading to comments (especially for mobile screens)
- Improve deep-thread readability on narrow viewports.
- Reduce or eliminate forced horizontal scrolling for deep reply chains.
- Define mobile-friendly indentation/collapse rules and branch loading behavior.
- Keep accessibility semantics intact for nested discussions.

2) Make site meet WCAG AA accessibility standards
- Perform and document a WCAG AA audit.
- Ensure keyboard-only operability (navigation, forms, modal, thread controls).
- Ensure visible focus states and compliant color contrast.
- Validate semantic structure, labels, and screen-reader announcements.

3) Update legal pages (rules, privacy policy, user agreement, accessibility)
- Refresh legal copy for production readiness.
- Verify consistency of terms, moderation language, and contact information.
- Ensure page content and effective-date formatting are uniform.

4) Add Google Analytics to be used in production
- Implement GA in a production-safe way (no noisy local/dev tracking by default).
- Gate tracking by environment and consent requirements.
- Document configuration steps and required environment variables.

5) Add translations (include French, Italian, Dutch, German)
- Add i18n framework and locale routing/selection strategy.
- Localize core navigation, discussion UI, legal pages, and system messages.
- Support at minimum: English, French, Italian, Dutch, German.

6) Add unit, integrated, and system tests
- Frontend: adopt Vitest and add component/unit coverage for home/thread/form flows.
- Backend: use Jest for route/controller/validator coverage.
- Add integration/system coverage for key user journeys.
- Keep Lighthouse-based performance regression checks in the release workflow.

7) Documentation (README)
- Expand README with setup, run, build, test, env, architecture, and deployment guidance.
- Add clear contributor workflow notes for frontend/backend changes.

## Out-of-scope guardrail for instruction-only edits
- Updating this instruction file does not itself implement product features.
- Do not mark roadmap items complete until code, tests, and docs are actually delivered and verified.
