# Copilot / AI Agent Instructions — ratex-headless-cms

Purpose: concise, actionable guidance so AI coding agents can be immediately productive in this Next.js app.

- **Project type:** Next.js (app router) site using GraphQL against a WordPress backend.
- **Run:** `npm run dev` (uses `next dev`), build with `npm run build`, start with `npm run start`.
- **Important env:** `WORDPRESS_API_URL` (required), `WORDPRESS_AUTH_REFRESH_TOKEN` (optional for auth).

Key patterns and locations
- Data layer: `lib/api.js` — single GraphQL helper `fetchAPI(query, {variables})` + exported query functions (`getAllPosts`, `getPostBySlug`, `getSearchResults`, `getMenus`, `getPostsByCategory`). When changing data shapes, update these queries first and adapt callers.
  - `fetchAPI` uses `fetch` with `next: { revalidate: 60 }` and throws on `json.errors` — preserve this contract.
  - Pagination: `getAllPosts(after)` returns the GraphQL `posts` object (includes `pageInfo.endCursor` and `hasNextPage`) — consumers expect `pageInfo`.
  - `replaceUrls(content)` normalizes WordPress links to internal site paths — use when injecting post `content` into pages.

- App structure: all pages/components live under the `app/` directory.
  - Top-level routes: `app/page.js` (home), `app/[slug]/page.js` (post pages), `app/category/[slug]/page.js`, `app/search/page.js`.
  - Layout and shared UI: `app/layout.js` imports `app/components/Header` and `app/components/Footer` and sets global metadata/fonts.
  - Components use CSS modules alongside component files: e.g., `app/components/Header.js` + `app/components/header.module.css`.

- Server components and data fetching:
  - Several components are async server components (see `app/components/Header.js` which `await`s `getMenus()` server-side). When converting to client components, ensure data fetching is moved to server or via client hooks.
  - Use `'use client'` only where interactive behavior is required (e.g., `Search` component likely uses client-side interactivity).

- Path alias:
  - `@/*` maps to repository root (see `jsconfig.json`). Use `import { foo } from '@/lib/api'` patterns consistently.

Conventions & gotchas
- Files use CSS Modules; class names live in `<component>.module.css` and are imported as `styles`.
- GraphQL shape is tightly coupled to WordPress schema. When adding fields, update both `lib/api.js` queries and all components that read those fields (common spots: `app/[slug]/page.js`, `app/page.js`, `app/category/*`).
- Error handling: `fetchAPI` throws on API errors — calling code does not deep-guard against `null` results in all places; prefer to check for `null` and surface user-friendly fallbacks.
- External links: Header menu items may include `uri` or `url`; Header treats links starting with `http` as external unless they include `ratex.co`.

Developer workflows
- Local dev: `npm run dev` (port 3000). Lint: `npm run lint` (calls `eslint`).
- Env setup: set `WORDPRESS_API_URL` before running locally. Example:

```bash
export WORDPRESS_API_URL="https://your-wp-site/graphql"
npm run dev
```

- Making API changes: edit `lib/api.js` first, run the dev server and validate pages that use the changed query (home, post, category, search). Use browser and console logs for GraphQL errors — `fetchAPI` writes `json.errors` to console.

Notes for code changes
- When altering routes, follow the `app/` router conventions (file-based routing). Dynamic params use `[param]` folders.
- To add a new UI component, place it in `app/components` and create a matching `*.module.css` file.
- When making a component interactive, add `'use client'` at the top and move heavy data fetching back to a parent server component or to `lib/api.js` endpoints.

What I looked at (examples)
- Data fetching and pagination: `lib/api.js`
- Top-level layout and metadata: `app/layout.js`
- Header (server component + menu fallback): `app/components/Header.js`
- Scripts and versions: `package.json` (Next.js `16.1.5`, React `19.2.3`)

If anything here is unclear or you'd like more detail (examples of editing a specific query, converting a server component to client, or adding a test harness), tell me which area and I'll expand the file accordingly.
