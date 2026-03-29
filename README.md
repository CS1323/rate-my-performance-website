# Rate My Performance - Drew Dumontier

A lightweight, interactive companion site for the sports-romance novel *Campus Rival*, created in collaboration with author Cadence Keys. Readers can browse in-universe “revenge” comments, upvote/downvote posts, reply to threads, and submit their own comments by selecting from pre-generated avatars and entering a custom username — no authentication required. Moderation is self-sustaining: users can report inappropriate content, and an LLM assists in automatically flagging or hiding posts.

### Performance Metrics
- Lighthouse Score: 95/100
- LCP: 2.4s
- TBT: 0ms

## Known Issues

### npm audit Vulnerabilities
- **6 vulnerabilities** (1 moderate, 5 high) in `server/package.json`
  - **Root cause**: Prisma 6.19.2 has transitive dependencies with known CVEs
  - **Impact**: Affects Prisma's build tooling only; does not affect runtime code
  - **Status**: Cannot be resolved until Prisma releases an update
  - **Mitigation**: Monitor Prisma releases and upgrade when available

### :handshake: Acknowledgments

Created in collaboration with Cadence Keys as an interactive extension of the world of *Campus Rival*.