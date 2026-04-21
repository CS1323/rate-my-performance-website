# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.0.x | Yes |

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Email: **cadence@cadencekeys.com**  
Subject: `[SECURITY] Rate My Performance — <brief description>`

Include:
1. Description of the vulnerability
2. Steps to reproduce (if applicable)
3. Potential impact (data exposure, service disruption, etc.)
4. Your contact info (optional — anonymous reports accepted)
5. Suggested fix if you have one

### Response Timeline

| Milestone | Target |
|---|---|
| Acknowledgement | Within 48 hours |
| Initial assessment + patch timeline | Within 14 days |
| Patch available (or mitigation plan) | Within 30 days |
| Public security advisory | After patch is deployed |

We will credit you in the advisory unless you prefer to remain anonymous.

---

## Security Measures

### API & Network
- **HTTPS enforced** in production
- **CORS** restricted to explicit allowed origins via `CORS_ORIGIN` environment variable — no wildcard
- **Rate limiting** — 100 req/15 min global; 10 req/1 min on POST endpoints (comments, votes, reports)

### Input Handling
- **Zod validation** on all API request bodies — mismatches return 400
- **DOMPurify sanitisation** on all user-submitted text (comment body, display name, report reason) before storage
- React's built-in escaping prevents XSS on render

### Data & Identity
- **No authentication** — site is intentionally anonymous; users are identified by IP hash only
- **IP hashing** — SHA-256 hash used for vote/report deduplication; original IP is never stored
- **No sensitive data in the browser** — no tokens, passwords, or secrets in localStorage or sessionStorage
- **Prisma ORM** — prepared statements prevent SQL injection
- **Database over TLS** — Neon enforces encrypted connections
- **Credentials in environment variables** — never committed to the repository

### Monitoring
- **Sentry** captures unhandled errors with stack traces; alerts configured in production
- **Winston** structured logs (server-side) include request context for audit trails
- **Rate limit violations** logged and visible in Render dashboard

---

## Known Vulnerabilities & Mitigations

### npm audit — Prisma transitive deps (server)
- **Issue**: 6 vulnerabilities (1 moderate, 5 high) in `server/package.json`
- **Root cause**: Prisma 6.19.2 transitive build-tooling dependencies
- **Runtime exposure**: None — affected packages are only used during `prisma generate`/`migrate`, not at API serve time
- **Action**: Monitor [Prisma releases](https://github.com/prisma/prisma/releases); upgrade when a clean version is available

### Axios supply-chain attack (client, March 2026)
- **Issue**: `axios` versions `1.14.1` and `0.30.4` were compromised with the WAVESHAPER.V2 backdoor
- **Our status**: Not affected — `package-lock.json` had `1.14.0` at the time of the attack
- **Mitigation**: `"axios": "1.14.0"` pinned (caret removed) in `client/package.json`
- **Action**: Once npm confirms a clean patched version (e.g. `1.14.2+`), update the pin and verify with `npm ls axios`; confirm no `plain-crypto-js` in the lockfile

---

## Compliance

| Regulation | Status |
|---|---|
| GDPR (EU) | Addressed in Privacy Policy — no personally identifiable data stored |
| CCPA/CPRA (California) | No sale of user data; opt-out mechanisms documented |
| COPPA | Age recommendation 16+ EEA; no direct marketing to minors |
| DMCA | Takedown procedure in User Agreement |

---

## Incident Response

1. **Detect** — Sentry alert or user report
2. **Assess** — determine if data is exposed or service is disrupted
3. **Contain** — disable affected feature or roll back (see [ROLLBACK.md](.github/ROLLBACK.md))
4. **Patch** — fix on a staging branch; test; deploy
5. **Communicate** — publish security advisory; notify affected parties if required
6. **Review** — post-incident analysis to prevent recurrence
