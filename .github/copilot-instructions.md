# Copilot instructions for "Rate My Performance"

Purpose
- Provide concise, repo-specific guidance so AI coding agents can make safe, focused edits to this Reddit-like discussion React site.

Big picture
- This is a React single-page application (SPA) built with client-side JavaScript. The main structure is in `client/src/`; presentation is split across `client/src/` CSS files and components.
- Major folders: `client/src/components/` (reusable React components), `client/src/pages/home/` (page components), `client/src/assets/` (icons/images), `client/public/` (static assets). Backend API (Node.js + Express + Prisma + PostgreSQL) runs separately on port 5001.
- The app uses React hooks (e.g., useState, useEffect) for state management and Axios for API calls.
- **Application Type:** Reddit-like discussion site with a single post, nested comments, voting system, reporting, and avatar selection.

Where to make changes (examples)
- Page structure & content: edit components in `client/src/pages/home/` (e.g., `HomePage.jsx`, `InitialPost.jsx`, `PostForm.jsx`, `Comment.jsx`)
- Component logic: update React components in `client/src/components/` for interactivity (e.g., Header, NavSidebar, AdsSidebar)
- Layout styling: `client/src/styles/` contains individual CSS files per component (`HomePage.css`, `Header.css`, `NavSidebar.css`, `AdsSidebar.css`)
- Global styles: `client/src/index.css` and `client/src/App.css` for site-wide resets and typography
- Assets: place new icons in `client/src/assets/images/icons/` and images in `client/src/assets/images/`; reference with relative paths
- API integration: modify Axios calls in components (e.g., fetch posts, comments, votes in HomePage)

Conventions & patterns
- Component-by-file: React components are organized in `client/src/components/` and `client/src/pages/`. Match markup to the corresponding CSS file (e.g., `.initial-post` → `HomePage.css`).
- Icons: import SVGs as modules (e.g., `import ThumbsUpIcon from '../../assets/images/icons/thumbs-up.svg';`) or use Google Material Symbols via the `<link>` in `index.html`.
- Build step: Use npm/yarn for development. Run `npm start` from `client/` for local dev server (typically http://localhost:3000). Build with `npm run build` for production.
- Backend: Node.js + Express server on port 5001; run `npm start` from `server/` directory.
- Data fetching: Use Axios in `useEffect` hooks to fetch posts, comments, and handle votes/reports from `/api/*` endpoints.

Preview / local workflow
- Quick preview (recommended) — from `client/` directory:

```bash
npm install  # if dependencies not installed
npm start
# then open http://localhost:3000 in a browser
```

- For backend API, ensure it's running separately (e.g., `npm start` from `server/` on port 5001).
- Debugging tips: Use React DevTools to inspect components. For CSS, use browser devtools to find classes (e.g., `.sidebar-link` → `client/src/styles/nav-sidebar.css`).
- Image/icon broken links: check `client/src/assets/` file names and imports in components.

Integration points / external dependencies
- Google Material Symbols font is loaded from fonts.googleapis.com in `client/public/index.html`.
- Social links point to external URLs in the `Header` component — these are content-only and safe to leave as-is unless instructed otherwise.
- API calls use Axios to endpoints like `/api/posts/`, `/api/comments/`, `/api/votes/`, `/api/reports/`; moderation via LLM can be added as async backend job.

Pull request guidance for AI edits
- Make minimal, atomic changes with clear intent (e.g., "Update HomePage API call" or "Adjust .initial-post spacing in HomePage.css").
- When changing styles, update only the relevant `client/src/styles/*.css` file.
- If adding new components or features, place them in appropriate `client/src/` subfolders and update imports.
- If adding backend or build enhancements, include a short README note describing how to run/build and update this copilot file.

If anything here looks incorrect or you want more detail (e.g., where to add tests, or how LLM moderation should be wired), tell me what to expand.

---

## CURRENT STATE ANALYSIS & IMPLEMENTATION ROADMAP (Jan 31, 2026)

### Backend Status: ✅ COMPLETE
- All endpoints working and tested with Requestly
- `/api/posts/:slug` — returns post with title, image, content
- `/api/comments/post/:postId` — returns nested comment tree with replies
- `/api/comments/post/:postId` (POST) — create top-level comment
- `/api/comments/:commentId/reply` (POST) — create reply
- `/api/votes` (POST) — cast vote (LIKE/DISLIKE) by IP hash
- `/api/reports` (POST) — report comment; auto-hide after 5 reports

### Frontend Issues & What Needs to be Fixed

**1. HomePage Rendering Error (Critical)**
   - Problem: InitialPost component crashes because `post` is null on initial render
   - Missing: Null checks in InitialPost; image path construction is broken (`../../assets${post.image}`)
   - Fix: Add conditional rendering in HomePage; construct correct image paths using `/assets/` prefix

**2. Comments Are Static (Major)**
   - Problem: HomePage has hardcoded UI mockup with 2 sample comments; no API integration
   - Missing: Fetch from `/api/comments/post/:postId`; render dynamically using Comment component
   - Fix: Use `useEffect` to fetch comments; map over nested tree in JSX

**3. Avatar Selector Incomplete (Medium)**
   - Problem: Radio buttons use values A, B, C, D but backend expects numeric `avatarId` (1-4)
   - Missing: Mapping between UI (letters) and backend (numbers); no images for avatars
   - Fix: Update PostForm radio values to 1-4; optionally add avatar images in `/assets/images/avatars/`

**4. Vote Buttons Non-functional (Medium)**
   - Problem: Vote buttons have no click handlers; hardcoded counts (12, 3, 5)
   - Missing: Handler to POST to `/api/votes`; optimistic UI update; user vote tracking
   - Fix: Add `handleVote(commentId, voteType)` in HomePage or Comment component; call `/api/votes` endpoint

**5. PostForm & CommentForm Have No Handlers (Medium)**
   - Problem: Forms are static HTML; no submission logic; no state management
   - Missing: `handleSubmit`, form state (username, avatarId, content), reset after submit
   - Fix: Convert to controlled components; add POST handlers for `/api/comments/post/:postId` and `/api/comments/:commentId/reply`

**6. Mobile Responsiveness Missing (Medium)**
   - Problem: AdsSidebar stays 400px fixed width; overlaps content on mobile; NavSidebar only 100px
   - Missing: Media query for mobile; hamburger toggle for sidebars
   - Fix: Add responsive CSS; implement sidebar toggle state in HomePage

**7. Comment.jsx Not Used (Minor)**
   - Problem: Separate Comment component exists but HomePage doesn't import it
   - Fix: Use Comment component in map() loop for rendering comments

### Data Structure (What API Returns)

**Post Object:**
```javascript
{
  id: "uuid",
  slug: "drew-dumontier",
  title: "String",
  image: "/path/to/image.jpg",  // Note: relative path, no leading /
  content: "String",
  createdAt: "ISO-8601"
}
```

**Comments Array (Nested):**
```javascript
[
  {
    id: "uuid",
    postId: "uuid",
    parentCommentId: null,  // null for top-level
    content: "String",
    authorName: "String",
    avatarId: 1,  // 1-4
    likeCount: 12,
    dislikeCount: 3,
    status: "VISIBLE",  // or HIDDEN, DELETED
    createdAt: "ISO-8601",
    replies: [  // Recursive array
      {
        id: "uuid",
        parentCommentId: "parent-uuid",
        content: "...",
        // ... same fields
        replies: []
      }
    ]
  }
]
```

### Implementation Plan (In Order)

**Phase 1: Fix HomePage Rendering**
1. Add null check in HomePage before rendering InitialPost
2. Fix image path in InitialPost: use `/assets/` prefix (images stored in public/assets/)
3. Add loading state to avoid null render

**Phase 2: Wire Comments API**
1. Fetch comments in HomePage useEffect: `GET /api/comments/post/:postId`
2. Build Comment component to render single comment + recursively render replies
3. Map over comments array in JSX

**Phase 3: Implement Voting**
1. Add vote handler: `handleVote(commentId, voteType)` 
2. POST to `/api/votes` with commentId, voteType (LIKE|DISLIKE), ipHash
3. Update comment counts optimistically in state

**Phase 4: Build Avatar Selector & Forms**
1. Update PostForm radio values to numeric (1-4)
2. Add form submission handler for `/api/comments/post/:postId`
3. Add reply handler for `/api/comments/:commentId/reply`

**Phase 5: Mobile Responsiveness**
1. Add hamburger toggle for NavSidebar
2. Hide/show AdsSidebar on mobile; reposition if needed
3. Add media queries for responsive layout

**Phase 6: LLM Comment Monitoring (Optional/Later)**
1. Add backend endpoint `/api/comments/:commentId/moderate`
2. Call LLM to score maturity; flag comments with threats/death references
3. Display moderation badge in Comment component

### Key File References
- [HomePage.jsx](client/src/pages/home/HomePage.jsx) — Main component; needs comments API + voting
- [InitialPost.jsx](client/src/pages/home/InitialPost.jsx) — Post display; needs null checks + image fix
- [PostForm.jsx](client/src/pages/home/PostForm.jsx) — Comment form; needs state + submission handler
- [Comment.jsx](client/src/pages/home/Comment.jsx) — Comment card; use for recursive rendering
- [HomePage.css](client/src/pages/home/HomePage.css) — Styling for comments
- [server/src/routes/comments.routes.js](server/src/routes/comments.routes.js) — API endpoints
- [server/src/routes/votes.routes.js](server/src/routes/votes.routes.js) — Vote endpoints
