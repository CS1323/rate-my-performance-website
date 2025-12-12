# Copilot instructions for "Rate My Performance"

Purpose
- Provide concise, repo-specific guidance so AI coding agents can make safe, focused edits to this static site.

Big picture
- This is a static, single-page site. The structure is in `index.html`; presentation is split across `styles/` CSS files.
- Major folders: `icons/` (SVG icons), `images/` (content/ads), `styles/` (component CSS). There is no server or JS in this repo.
- The README mentions an LLM-assisted moderation concept, but there is no backend or API code in this repository — treat that as an external/system requirement, not implemented here.

Where to make changes (examples)
- Page structure & content: edit `index.html`. Example: change the header text in the top `<header>` block.
- Layout styling: `styles/layout.css` controls the overall grid; change component spacing there.
- Component styles: each component has its own file — `styles/header.css`, `styles/left-sidebar.css`, `styles/home.css`, `styles/right-sidebar.css`. Prefer editing the corresponding file rather than adding global overrides.
- Global styles: `styles/general.css` contains site-wide variables and resets; use it for site-wide color/typography updates.
- Assets: place new icons in `icons/` and raster images in `images/`; reference them with relative paths (e.g., `<img src="images/new.png">`).

Conventions & patterns
- CSS-by-file: styles are organized per visual region. Match markup to the corresponding CSS file (e.g., `.initial-post` → `styles/home.css`).
- Icons: referenced with `<img src="icons/*.svg">` for SVGs, and Google Material Symbols are included via the `<link>` in `index.html`.
- No build step: changes are visible by opening `index.html` in a browser or serving the directory via a simple static server.

Preview / local workflow
- Quick preview (recommended) — run a local static server from the repo root:

```powershell
# from repo root
python -m http.server 8000
# then open http://localhost:8000 in a browser
```

Or, if you prefer Node tooling and have it installed:

```powershell
npx http-server -p 8000
```

Debugging tips
- Use browser devtools to inspect DOM and CSS. To find which CSS file to edit, inspect an element and search for its class (e.g., `.sidebar-link` → `styles/left-sidebar.css`).
- Image/icon broken links: check `icons/` and `images/` file names and relative paths in `index.html`.

Integration points / external dependencies
- Google Material Symbols font is loaded from fonts.googleapis.com in `index.html`.
- Social links point to external URLs in the header — these are content-only and safe to leave as-is unless instructed otherwise.
- There are references to moderation via an LLM in `README.md`, but no code or config for that here. If implementing LLM features, add a separate service and document any API surface in a new top-level README or `backend/` folder.

Pull request guidance for AI edits
- Make minimal, atomic changes with clear intent (e.g., "Update header title" or "Adjust .initial-post spacing").
- When changing styles, update only the relevant `styles/*.css` file.
- If adding JS or a build system, include a short README note describing how to run/build and update this copilot file.

If anything here looks incorrect or you want more detail (e.g., where to add tests, or how LLM moderation should be wired), tell me what to expand.
