# MS Trading Co. website

Catalogue website for MS Trading Co., an industrial safety equipment and PPE stockist in Chennai.
Built with Vite, React, TypeScript and Tailwind CSS.

The site is moving from GitHub Pages to Cloudflare Pages (Functions, D1 and R2) with its own admin
panel. Until that work lands, the site renders the local starter catalogue in `src/data/catalogue.ts`.

## Scripts

Requires Node 22.18 or newer.

| Command | What it does |
| --- | --- |
| `npm run dev` | Site dev server at http://localhost:5173/ (local starter data) |
| `npm run build` | Type-check and build to `dist/` |
| `npm run lint` | ESLint |
