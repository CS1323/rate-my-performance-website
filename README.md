# Rate My Performance CFU

A lightweight, interactive companion website for the sports-romance novel *Campus Rival* by Cadence Keys. Readers can browse in-universe "revenge" comments on Drew Dumontier, upvote/downvote, reply to threads, and submit their own comments by selecting from pre-generated avatars and entering a custom username — no authentication required. Moderation is self-sustaining: users can report inappropriate content, and an LLM assists in automatically flagging or hiding posts.

**Live Site**: [ratemyperformancecfu.com](https://ratemyperformancecfu.com)  
**Status**: Production — launched April 2026

---

## Features

- **Anonymous discussion** — no login required; join with a display name and avatar
- **Threaded comments** — nested replies with collapsible/expandable branches
- **Real-time voting** — like/dislike with optimistic UI updates and IP-based deduplication
- **Content moderation** — user reporting with Google Gemini LLM-assisted auto-flagging
- **Multi-language** — English, French, German, Italian, Dutch (URL-based routing)
- **Accessible** — WCAG 2.1 Level AA: full keyboard navigation, screen reader support, focus management, 44×44 px touch targets
- **Mobile-responsive** — mobile-first CSS, reduced thread indentation on narrow viewports
- **Performance** — Lighthouse 95/100, LCP 2.4 s, TBT 0 ms

---

## Architecture

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, CSS3, i18next, react-router 7 |
| Backend | Node.js, Express 5, Prisma 6, PostgreSQL |
| Moderation | Google Gemini API |
| Testing | Vitest (unit & integration), Playwright (E2E) |
| Monitoring | Sentry (errors), Google Analytics 4 (usage), Winston (server logs) |
| Hosting | Vercel (frontend) + Render (backend) + Neon (database) |

### Repository Structure

```
rate-my-performance-website/
├── client/                    # React SPA (Vite)
│   ├── src/
│   │   ├── pages/             # Route-level views (home, quiz, legal pages, …)
│   │   ├── components/        # Reusable UI (Header, NavSidebar, ErrorBoundary, …)
│   │   ├── hooks/             # Custom hooks (useInfiniteScroll)
│   │   ├── context/           # React Context (AdsContext)
│   │   ├── config/api.js      # API base-URL helpers
│   │   ├── utils/             # Utilities (Google Analytics, userIdentifier, errorMapper)
│   │   └── locales/           # i18n translation files (en, fr, de, it, nl)
│   ├── tests/                 # Client integration tests
│   └── package.json
├── server/                    # Express API
│   ├── src/
│   │   ├── routes/            # Express routers (posts, comments, votes, reports, ads)
│   │   ├── controllers/       # Business logic layer
│   │   ├── validators/        # Zod request schemas
│   │   ├── middleware/        # CORS, error, rate limiting, validate request
│   │   └── utils/             # logger, moderateContent, hashIp
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── migrations/        # Prisma migration history
│   │   └── seed*.js           # Per-language seed scripts
│   ├── tests/                 # Server integration tests
│   ├── server.js              # App entry point
│   ├── instrument.js          # Sentry initialisation (loaded via NODE_OPTIONS)
│   └── package.json
├── e2e/                       # Playwright end-to-end tests
│   ├── home.spec.js
│   ├── comments.spec.js
│   └── votes.spec.js
├── .github/
│   ├── ROLLBACK.md            # Step-by-step rollback procedures
│   └── copilot-instructions.md
├── playwright.config.js
├── CONTRIBUTING.md
├── CHANGELOG.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── LICENSE
└── package.json               # Root workspace (E2E scripts)
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** — local instance or a [Neon](https://neon.tech) serverless database

### 1 — Clone and install

```powershell
git clone https://github.com/cadencekeys/rate-my-performance-website.git
cd rate-my-performance-website

# Root (E2E)
npm install

# Backend
cd server ; npm install ; cd ..

# Frontend
cd client ; npm install ; cd ..
```

### 2 — Environment variables

```bash
# Backend
cp server/.env.example server/.env

# Frontend (optional — defaults to localhost:5001)
cp client/.env.example client/.env
```

Edit each `.env` file with your values. See [Environment Variables](#environment-variables) below.

### 3 — Apply database migrations and seed

```powershell
cd server
npm run prisma:migrate   # apply pending migrations
npm run seed:test        # seed with local dev data
cd ..
```

> `seed:test` reads the local `.env`. Use `seed:db` only when targeting production (reads `.env.production`).

### 4 — Start local development

Open two terminals from the repo root.

**Terminal 1 — backend**
```powershell
cd server
npm run dev
# → http://localhost:5001
```

**Terminal 2 — frontend**
```powershell
cd client
npm run dev
# → http://localhost:5173
```

Visit `http://localhost:5173`. The frontend proxies API calls to `http://localhost:5001` via `VITE_API_BASE_URL`.

---

## Scripts Reference

### Backend (`server/`)

| Script | Description |
|---|---|
| `npm run dev` | Start with nodemon + Sentry instrumentation |
| `npm start` | Production start (no file-watching) |
| `npm test` | Run Vitest unit tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with V8 coverage |
| `npm run prisma:migrate` | Deploy pending Prisma migrations |
| `npm run seed:test` | Seed database using local `.env` |
| `npm run seed:db` | Seed database using `.env.production` |

### Frontend (`client/`)

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | Production bundle to `dist/` |
| `npm run preview` | Preview production bundle locally |
| `npm test` | Run Vitest unit/integration tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with V8 coverage |
| `npm run lint` | ESLint check |

### Root (E2E)

| Script | Description |
|---|---|
| `npm run test:e2e` | Run all Playwright specs |
| `npm run test:e2e:ui` | Playwright interactive UI mode |
| `npm run test:e2e:report` | Open the last HTML test report |

---

## Environment Variables

### Backend — `server/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5001` | API server port |
| `NODE_ENV` | **Yes** | `development` | Environment: `development`, `test`, or `production` |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `CORS_ORIGIN` | **Yes** | — | Comma-separated allowed origins |
| `GEMINI_API_KEY` | **Yes** | — | Google Gemini key for moderation |
| `SENTRY_DSN` | No | — | Sentry DSN (blank = disabled) |
| `LOG_LEVEL` | No | `debug`/`info` | Winston log level |

### Frontend — `client/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | **Yes** | `http://localhost:5001` | Backend base URL |
| `VITE_SENTRY_DSN` | No | — | Sentry DSN for frontend (blank = disabled) |
| `VITE_GA_ID` | No | — | GA4 measurement ID (blank = disabled; localhost excluded) |

See `.env.example` in `server/` and `client/` for copy-paste templates.

---

## Testing

### Unit & Integration

```powershell
cd server ; npm test    # 55 tests, 14 files
cd client ; npm test    # 27 tests, 10 files
```

### End-to-End (Playwright)

Playwright targets the **development environment** (`http://127.0.0.1:5173`). The config auto-starts both dev servers if they are not already running; running `npm run dev` in both directories first reuses existing processes and skips cold-start time.

```powershell
npm run test:e2e
```

**Results — April 20, 2026 — 9/9 passing (16.6 s, Chromium)**

| Spec | Tests | Result |
|---|---|---|
| `home.spec.js` | 4 | All pass (2.3 s avg) |
| `comments.spec.js` | 3 | All pass (2.1 s avg) |
| `votes.spec.js` | 2 | All pass (1.8 s avg) |

Performance Metrics (April 20, 2026):
- **Lighthouse Score**: 90/100
- **LCP (Largest Contentful Paint)**: 3.0 s
- **TBT (Total Blocking Time)**: 0 ms

Coverage: post display, comment form visibility, seeded data, validation error messages, full comment submission with real DB write, like/dislike toggle with `aria-label` verification.

---

## Deployment

### Frontend — Vercel

Auto-deploys on every push to `main`. Prisma migrations are not involved; Vercel serves only the static `dist/` bundle.

### Backend — Render

Auto-deploys on every push to `main`. Migrations run automatically on startup (`npm run build` calls `npm run prisma:migrate`).

### Rollback

See [.github/ROLLBACK.md](.github/ROLLBACK.md) for step-by-step procedures covering Vercel, Render, and database migration rollback.

---

## Security & Privacy

- **Rate limiting** — 100 req/15 min global; 10 req/1 min on POST endpoints
- **Input sanitisation** — DOMPurify on all user-submitted text before storage
- **Zod validation** — all API request bodies validated with typed schemas
- **IP deduplication** — votes and reports deduplicated via hashed IP; original IP never stored
- **No credentials in frontend** — no secrets or tokens exposed to the browser

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

---

## Accessibility

WCAG 2.1 Level AA compliant. Highlights:

- Full keyboard navigation (Tab, Shift+Tab, Enter, Space, Escape)
- Skip link, semantic landmarks (`<header>`, `<nav>`, `<main>`, `<article>`)
- ARIA live regions for vote/report feedback
- Focus trap in report modal with restoration on close
- `prefers-reduced-motion` respected globally
- 44×44 px touch targets, minimum 4.5:1 colour contrast

Full statement: [ratemyperformancecfu.com/accessibility](https://ratemyperformancecfu.com/accessibility)

---

## Known Issues & Limitations

### npm audit (server)

6 vulnerabilities (1 moderate, 5 high) in `server/package.json`. Root cause: Prisma 6.19.2 transitive dependencies. Impact is limited to Prisma build tooling — no runtime exposure. Monitor [Prisma releases](https://github.com/prisma/prisma/releases) and upgrade when a clean version is available.

### Axios version pin (client)

`axios` is pinned to `1.14.0` in `client/package.json`. Versions `1.14.1` and `0.30.4` were compromised in a supply-chain attack (March 2026, WAVESHAPER.V2 backdoor). Once npm confirms a safe patched release (e.g. `1.14.2+`), update the pin and verify with `npm ls axios`.

### Google Analytics location data

GA4 city/region data may reflect **Vercel edge-server locations** rather than actual visitor locations. Vercel's CDN can terminate requests at an edge node before forwarding them, causing GA's IP geolocation to log the edge server's IP. Treat city-level location metrics as approximate; country-level data is generally reliable.

### Deep comment threading on mobile

Comment threads beyond 5 levels may require horizontal scrolling on very narrow viewports. The collapse/expand button mitigates this; full Reddit-style lazy-load branch pagination is not implemented.

---

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow, code standards, and pull request process.

---

## License

See [LICENSE](LICENSE) for terms.

---

## Acknowledgments

Created by Cheyenne Sterbick in collaboration with [Cadence Keys](https://cadencekeys.com), author of *Campus Rival*.  
Contact: cadence@cadencekeys.com
