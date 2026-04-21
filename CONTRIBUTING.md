# Contributing to Rate My Performance CFU

Thank you for your interest in contributing! This document covers the development workflow, code standards, and pull request process.

---

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before participating. We are committed to a welcoming, inclusive environment for all contributors.

---

## Reporting Bugs

1. Check [existing issues](https://github.com/cadencekeys/rate-my-performance-website/issues) to avoid duplicates.
2. Open a new issue with:
   - A clear title
   - Steps to reproduce (URL, browser, OS)
   - Expected vs. actual behaviour
   - Screenshots or console output if helpful

## Requesting Features

Open an issue titled `[Feature Request]: …` describing what the feature does, why it is useful, and any implementation ideas.

## Security Issues

**Do not** open a public issue for vulnerabilities. See [SECURITY.md](SECURITY.md) for responsible disclosure.

---

## Development Workflow

### 1 — Fork and clone

```bash
git clone https://github.com/YOUR_USERNAME/rate-my-performance-website.git
cd rate-my-performance-website
```

### 2 — Create a branch

```bash
git checkout -b feature/short-description
# or fix/short-description | docs/short-description | chore/short-description
```

### 3 — Set up the environment

Follow the [Getting Started](README.md#getting-started) steps in the README to install dependencies, configure `.env` files, and start both dev servers.

### 4 — Make changes

See [Project Structure](#project-structure) below for where files belong.

### 5 — Test before committing

```powershell
cd server ; npm test        # unit tests
cd client ; npm test        # unit + integration tests
npm run test:e2e            # Playwright E2E (requires both servers running)
cd client ; npm run lint    # ESLint
```

### 6 — Commit with clear messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     add keyboard shortcut for collapse/expand
fix:      correct aria-label on vote button count
docs:     update README with i18n setup
test:     add E2E spec for report modal
refactor: extract vote logic to usVote hook
chore:    upgrade Vitest to 3.x
```

### 7 — Push and open a pull request

```bash
git push origin feature/short-description
```

Open a PR with a clear title, description of what changed and why, and a reference to related issues (`Fixes #123`).

---

## Project Structure

**Frontend** (`client/src/`):

| Folder | Purpose |
|---|---|
| `pages/` | Route-level components (Home, Quiz, legal pages, …) |
| `components/` | Reusable UI (Header, NavSidebar, ErrorBoundary, …) |
| `hooks/` | Custom React hooks |
| `context/` | React Context state |
| `config/` | API base-URL helpers |
| `utils/` | Utility functions (GA, user identifier, …) |
| `locales/` | i18n translation files (en, fr, de, it, nl) |

**Backend** (`server/src/`):

| Folder | Purpose |
|---|---|
| `routes/` | Express route handlers |
| `controllers/` | Business logic |
| `validators/` | Zod request schemas |
| `middleware/` | CORS, rate limiting, … |
| `utils/` | logger, moderateContent, hashIp, … |

**Tests**: `client/tests/`, `server/tests/`, `e2e/`

---

## Code Standards

### React / JavaScript

- Functional components with hooks only.
- CSS lives alongside its component (`Comment.jsx` + `Comment.css`).
- Clear, descriptive prop and variable names.
- Comments only where logic is non-obvious — avoid comment noise on trivial code.

### CSS

- Mobile-first: base styles for small screens, `@media (min-width: …)` for larger.
- All interactive elements need a `:focus-visible` outline (`2px solid #5c0700`).
- Minimum 44×44 px touch targets (use `::after` pseudo-elements to avoid changing visual size).
- Minimum 4.5:1 colour contrast on all text.

### Backend (Express)

- Middleware order: CORS → Rate Limiting → Body Parser → Routes → Error Handler.
- Validate request bodies with Zod before any business logic.
- Use `logger` (Winston) instead of `console.log`/`console.error`.
- Return consistent JSON error responses; do not leak internal details (stack traces, query text).

---

## Testing Requirements

- Add unit tests for new controllers, validators, hooks, and utility functions.
- Add Playwright tests for new user-facing flows.
- New interactive components must include correct ARIA attributes and be keyboard-navigable.
- Run the full test suite before opening a PR.

---

## Pull Request Checklist

- [ ] `npm test` passes in both `client/` and `server/`
- [ ] `npm run test:e2e` passes
- [ ] `npm run lint` passes in `client/`
- [ ] New dependencies justified in the PR description
- [ ] Breaking changes documented
- [ ] Accessibility checked for any UI changes (focus indicators, ARIA labels, keyboard nav)
- [ ] Screenshots included if there is a visible UI change

---

## Release Process

Releases follow [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`):

1. Create `release/vX.Y.Z` branch.
2. Update [CHANGELOG.md](CHANGELOG.md).
3. Open PR, get reviews, merge to `main`.
4. Tag: `git tag vX.Y.Z && git push origin vX.Y.Z`.
5. Vercel and Render auto-deploy on tag.

---

## Questions?

Open an issue or leave a comment on an existing PR.  
By contributing you agree your changes will be licensed under the project [LICENSE](LICENSE).
