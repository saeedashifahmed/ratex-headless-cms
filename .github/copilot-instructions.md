# Copilot / AI Agent Instructions — ratex-headless-cms

Purpose: concise, actionable guidance so AI coding agents can be immediately productive in this Next.js app.

## Big picture
- **Project type:** Next.js App Router site backed by WordPress GraphQL (WPGraphQL). Primary data flow: server components → `lib/api.js` → WordPress API → render to pages.
- **Core routes:** `app/page.js` (home feed + pagination), `app/[slug]/page.js` (post detail), `app/category/[slug]/page.js`, `app/search/page.js`.
- **Shared shell:** `app/layout.js` wires `Header` + `Footer` and global metadata/fonts.

## Data layer (WordPress GraphQL)
- Centralize queries in `lib/api.js`. `fetchAPI(query, { variables })` uses `next: { revalidate: 60 }` and throws on `json.errors`—callers expect this contract.
- Key query helpers: `getAllPosts(after)`, `getPostBySlug(slug)`, `getPostsByCategory(slug)`, `getSearchResults(term)`, `getMenus()`.
- **Pagination:** `getAllPosts(after)` returns the full `posts` object with `pageInfo`. `Pagination` builds `?after=` URLs; `app/page.js` reads `searchParams.after`.
- **Content normalization:** `replaceUrls(content)` rewrites `blog.ratex.co/.com` links to internal paths. Use it whenever rendering `post.excerpt` or `post.content` (see `app/page.js`, `app/[slug]/page.js`, `app/search/page.js`).

## Rendering + component conventions
- Server components are the default; client components are explicit via `'use client'` (e.g., `app/components/Search.js`, `ReadingProgress`, `SocialShare`). Move data fetching to server when converting to client.
- Menus: `getMenus()` may return empty arrays; `Header`/`Footer` fall back to static link lists. Header treats `uri`/`url` that start with `http` (and not `ratex.co`) as external.
- CSS Modules are used throughout (`<Component>.module.css` with `styles` import). New UI components live in `app/components` with matching CSS modules.

## Workflows & debugging
- **Dev:** `npm run dev` (Next dev server). **Build:** `npm run build`. **Start:** `npm run start`. **Lint:** `npm run lint`.
- **Required env:** `WORDPRESS_API_URL` (GraphQL endpoint). Optional `WORDPRESS_AUTH_REFRESH_TOKEN` for auth headers.
- **Debug scripts:** `debug-categories.js` and `debug-category-posts.js` run direct GraphQL queries (Node 18+ native `fetch`) against `https://blog.ratex.co/graphql`.

## Project-specific patterns to follow
- When adding fields, update the relevant GraphQL query in `lib/api.js` first, then update all consumers (`app/page.js`, `app/[slug]/page.js`, `app/category/[slug]/page.js`, `app/search/page.js`).
- Use the path alias `@/` from `jsconfig.json` (e.g., `import { getAllPosts } from '@/lib/api'`).

If anything here is unclear or incomplete, call it out and I’ll refine this document.
