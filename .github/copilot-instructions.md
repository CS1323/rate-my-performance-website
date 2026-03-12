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
