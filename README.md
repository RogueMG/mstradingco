# MS Trading Co. website

Catalogue website for MS Trading Co., an industrial safety equipment and PPE stockist in Chennai.
Built with Vite, React, TypeScript and Tailwind CSS, and deployed to GitHub Pages:
https://roguemg.github.io/mstradingco/

The product catalogue is managed in Sanity. The admin (Sanity Studio) is served from the same deployment at
https://roguemg.github.io/mstradingco/studio/.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | Company story, product areas and industries |
| `/products` | Catalogue with category tabs and search |
| `/products/:category` | The catalogue with that category's tab selected |
| `/products/:category/:product` | Product details, gallery, specifications and enquiry buttons |
| `/brands` | Brands we deal in |
| `/industries` | Industries served |
| `/contact` | Contact details and enquiry form |
| `/gallery` | Placeholder (not in the nav until photos are supplied) |
| anything else | Not found |

Products, categories, brands and industries come from Sanity. Every "Enquire" / "Request a quote"
action opens one shared enquiry form. There is no form backend: the form opens WhatsApp or the
visitor's email app with the details filled in, ready to send.

## Scripts

Requires Node 22.18 or newer.

| Command | What it does |
| --- | --- |
| `npm run dev` | Site dev server at http://localhost:5173/mstradingco/ |
| `npm run build` | Type-check, build to `dist/`, and write `dist/404.html` for deep links |
| `npm run lint` | ESLint |
| `npm run studio` | Studio dev server at http://localhost:3333 (run `npm ci --prefix studio` first) |
| `npm run seed:build` | Regenerate `sanity/seed.ndjson` from `src/data/catalogue.ts` |
| `npm run test:queries` | Run the site's GROQ queries against the seed file and check result shapes |
| `npm run seed --prefix studio` | Import the seed into the `production` dataset, skipping documents that exist |

## Content

- With a `projectId` in `sanity.project.json`, the site reads categories, products and brands from Sanity's
  public API.
- With an empty `projectId`, it renders the local starter catalogue in `src/data/catalogue.ts`.

See [docs/CONTENT_API.md](docs/CONTENT_API.md) for the content model, setup, the read endpoints and their
queries.

## Deployment

Pushing to `main` runs `.github/workflows/main.yml`. It builds the site, builds the Studio into `dist/studio`
when a projectId is set, and publishes `dist/` to GitHub Pages. Day-to-day work happens on feature branches.
