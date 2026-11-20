# MS Trading Co. website

Catalogue website for MS Trading Co., an industrial safety equipment and PPE stockist in Chennai, with
its own admin panel.

- **Site:** Vite, React, TypeScript and Tailwind CSS, served by **Cloudflare Pages**.
- **API, SEO, enquiries:** Cloudflare **Pages Functions** (`functions/`).
- **Content:** Cloudflare **D1** (SQLite); uploaded images in **R2**.
- **Admin:** `/admin`, protected by **Cloudflare Access** (email one-time codes). Until the custom
  domain is live, editors use https://develop.mstradingco.pages.dev/admin; the production
  `mstradingco.pages.dev/admin` is deliberately locked.

## Documentation

- [docs/ADMIN.md](docs/ADMIN.md): how editors update products, categories, brands, industries,
  enquiries and settings.
- [docs/API.md](docs/API.md): endpoints, database tables, bindings, scripts, deployment, custom domain,
  enquiry emails and free-plan limits.
- [docs/SEO.md](docs/SEO.md): Search Console, Bing, Google Business Profile and directory checklist.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | Company story, product areas and industries |
| `/products` | Catalogue with category tabs and search |
| `/products/<category>/<subcategory>/…` | A category at any depth: breadcrumb, subcategories and products |
| `/products/<category>/…/<product>` | Product details, gallery, specifications and enquiry buttons |
| `/brands` | Brands we deal in |
| `/industries` | Industries served |
| `/contact` | Contact details, enquiry form and click-to-load map |
| `/gallery` | Placeholder (not in the nav until photos are supplied) |
| `/admin` | Admin panel (signed-in editors only) |
| anything else | Not found (HTTP 404) |

Every public page has a floating WhatsApp button. Enquiry forms save to the database (and email the business
once email is switched on), with "Send on WhatsApp instead" as an option.

## Scripts

Requires Node 22.18 or newer.

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server at http://localhost:5173, using the local starter data (no Functions) |
| `npm run dev:cf` | Build, then run the site **with Functions, local D1 and local R2** at http://127.0.0.1:8790 |
| `npm run build` | Type-check and build to `dist/` |
| `npm run typecheck` | Type-check the site, the Functions and the mailer Worker |
| `npm run lint` | ESLint |
| `npm run test:access` | Tests the admin's Cloudflare Access JWT check |
| `npm run db:migrate:local` / `db:seed:local` | Create tables / starter content in the local D1 |
| `npm run db:migrate:remote` / `db:seed:remote` | The same against the real D1 database |

### Run it locally

```bash
cp .dev.vars.example .dev.vars
npm ci
npm run dev:cf
```

Open http://127.0.0.1:8790 for the site and http://127.0.0.1:8790/admin for the admin. On localhost the
admin's sign-in is bypassed by `DEV_BYPASS_ACCESS` in `.dev.vars`; this never applies to a deployed site.

## Deployment

See [docs/API.md → Deploying](docs/API.md#deploying). In short: create the D1 database and R2 bucket
with Wrangler, apply migrations and the seed, connect the GitHub repository in Cloudflare Pages
(production branch `main`, build `npm run build`, output `dist`), then turn on Cloudflare Access for
the previews ("Restrict previews") and Turnstile for the forms. Live at https://mstradingco.pages.dev.
