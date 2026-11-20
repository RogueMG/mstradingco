# Developer reference: Cloudflare Pages, Functions, D1 and R2

The site is a static React app (`dist/`) served by **Cloudflare Pages**. **Pages Functions**
(`functions/`) provide the content API, the admin API, image serving, enquiries, per-page SEO, the
sitemap and robots.txt. Content lives in **D1** (SQLite) and uploaded images in **R2**. The admin
panel is part of the same app at `/admin`, protected by **Cloudflare Access**.

For the editor-facing guide see [ADMIN.md](ADMIN.md). For search-engine setup see [SEO.md](SEO.md).

## Layout of the code

| Path | What it is |
| --- | --- |
| `src/` | The React site (Vite, React Router, Tailwind). `src/admin/` is the lazy-loaded admin panel |
| `functions/` | Pages Functions: file names are routes (see [Endpoints](#endpoints)) |
| `server/` | Code shared by the Functions (not routes): catalogue queries, SEO, Access JWT check, validation, sanitiser |
| `shared/` | Types and helpers used by both the site and the Functions (`content.ts`, `admin.ts`, `site.ts`, `slug.ts`) |
| `migrations/` | D1 schema migrations |
| `scripts/build-seed-sql.ts` | Generates `db/seed.sql` from the starter catalogue in `src/data/catalogue.ts` |
| `scripts/test-access.ts` | Tests the Access JWT verification with a throwaway key |
| `workers/mailer/` | Small separate Worker that sends enquiry emails (Pages Functions can't use the `send_email` binding) |
| `public/_routes.json` | Keeps `/assets/*` and `/images/*` off Functions so static files never count against the Functions quota |
| `public/_headers` | Long-lived caching for content-hashed `/assets/*` files |
| `wrangler.toml` | Pages project config: bindings and non-secret variables |

## Resources and bindings

| Name | Type | Binding / variable | Notes |
| --- | --- | --- | --- |
| `mstradingco` | Pages project | n/a | https://mstradingco.pages.dev. Production branch `main`; other branches get preview deployments (`https://<branch>.mstradingco.pages.dev`), which are all behind Cloudflare Access |
| `mstradingco-db` | D1 database | `DB` | `database_id` goes in `wrangler.toml` after creating it |
| `mstradingco-media` | R2 bucket | `MEDIA` | Uploaded images, keys `uploads/<uuid>.webp` and `uploads/<uuid>-thumb.webp` |
| `mstradingco-mailer` | Worker | `MAILER` (service binding) | Optional; commented out in `wrangler.toml` until email is switched on |
| (automatic) | Static assets | `ASSETS` | Used by the page middleware to fetch `index.html` |

Variables (`[vars]` in `wrangler.toml`, not secret):

| Variable | Meaning |
| --- | --- |
| `ACCESS_TEAM_DOMAIN` | `https://<team>.cloudflareaccess.com` |
| `ACCESS_AUD` | The Access application's Audience (AUD) tag |
| `TURNSTILE_SITE_KEY` | Public Turnstile site key; empty = no Turnstile widget |
| `SITE_URL` | Canonical origin once a custom domain is live (e.g. `https://www.example.com`); empty = each request's origin |
| `MAIL_FROM` | Sender address for enquiry emails, on the domain that has Email Routing |

Secrets (never committed). Add them in the dashboard: Pages project → Settings → Variables and
Secrets, type *Secret*, for **both Production and Preview**. (`npx wrangler pages secret put` only
sets the production value.)

| Secret | Meaning |
| --- | --- |
| `TURNSTILE_SECRET` | Turnstile secret key. While unset, enquiries are accepted without a Turnstile check (honeypot and rate limit still apply) |

Local only (`.dev.vars`, git-ignored; copy from `.dev.vars.example`):

| Variable | Meaning |
| --- | --- |
| `DEV_BYPASS_ACCESS=true` | Skips the Access check, **only** for requests to `localhost` / `127.0.0.1` |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET` | Cloudflare's published always-pass test keys |

## Database (D1)

Schema: [`migrations/0001_init.sql`](../migrations/0001_init.sql). Timestamps are ISO-8601 UTC text.
Images are stored as either an R2 key (`*_key`) or a URL (`*_url`, https or a site file under
`/images/`), plus alt text and optional pixel size.

| Table | Purpose and key rules |
| --- | --- |
| `categories` | Self-nesting tree (`parent_id`, unlimited depth). Slug unique among siblings (`ifnull(parent_id,0), slug`). `show_on_home`, `sort_order` |
| `products` | Belongs to one category. Slug unique per category. `description` is sanitised HTML; `key_features`, `specifications` (`[{label,value}]`) and `variants` are JSON arrays. `is_sample`, `published`, `sort_order` |
| `product_images` | `product_id`, key **or** url, required `alt`, `sort_order` (0 = main image). Deleted with the product |
| `brands` | `slug` unique, `name`, `tagline`, `description`, `confirmed`, `in_house`, optional logo |
| `industries` | `slug` unique, `title`, `label`, `summary`, image, `show_on_home` |
| `enquiries` | `name, company, email, phone, interest, message, source_page, status (new/read/archived), email_status (off/sent/failed), created_at` |
| `rate_limits` | Per-visitor enquiry counter. The key is a SHA-256 of the IP salted with the UTC date, so raw IPs are never stored |
| `settings` | `site` = public business facts (JSON); `private` = server-only, e.g. `notifyEmail` |

Rules enforced by the API (not expressible as constraints):

- A product slug can't equal a child category's slug in the same category (and vice versa), so every
  `/products/<path>` is unambiguous.
- A category can't be moved under itself or a descendant.
- A category can only be deleted when it has no subcategories and no products.
- Uploaded R2 objects are deleted when the last row referencing them is changed or deleted.

## Scripts

Node 22.18 or newer (runs TypeScript scripts directly).

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server, **local starter data only** (no Functions), http://localhost:5173 |
| `npm run dev:cf` | Build, migrate + seed the local D1, then serve the built site **with Functions, local D1 and local R2** at http://127.0.0.1:8790 |
| `npm run build` | Type-check and build to `dist/` |
| `npm run typecheck` | Type-check the site, the Functions and the mailer Worker |
| `npm run lint` | ESLint |
| `npm run test:access` | Access JWT verification tests (no network) |
| `npm run db:seed:build` | Regenerate `db/seed.sql` from `src/data/catalogue.ts` |
| `npm run db:migrate:local` / `db:seed:local` | Apply migrations / seed to the local D1 (`.wrangler/state`) |
| `npm run db:migrate:remote` / `db:seed:remote` | The same against the real D1 database |

Seeding uses `INSERT OR IGNORE` with fixed ids, so running it again never duplicates rows or overwrites
admin edits.

### Local development

```bash
cp .dev.vars.example .dev.vars
npm ci
npm run dev:cf
```

Then open http://127.0.0.1:8790 for the site and http://127.0.0.1:8790/admin for the admin (the Access
check is bypassed only on localhost). Port 8790 is used so it doesn't clash with other local wrangler
projects on 8788.

## Endpoints

All public responses use `Cache-Control: public, max-age=60, stale-while-revalidate=600` unless noted.
All SQL uses prepared statements.

### Public

| Method & path | Returns |
| --- | --- |
| `GET /api/tree` | `{ categories: TreeCategory[] }`: nested categories, each with `products: {title, slug, path}[]` and `productCount` (including subcategories) |
| `GET /api/node?path=a/b/c` | A category `{ kind: "category", category, children, products: ProductCard[], breadcrumb }` or a product `{ kind: "product", product, breadcrumb }` (product includes images, brand, description, key features, specifications, variants and up to 3 `related`). `404` when nothing matches, `400` for a malformed path |
| `GET /api/brands` | `{ brands: Brand[] }` |
| `GET /api/industries` | `{ industries: Industry[] }` |
| `POST /api/enquiries` | Body `{ name, company?, email, phone?, interest?, message, sourcePage?, website (honeypot), turnstileToken? }`. `201` on success; `400` with per-field `details`; `429` after 5 submissions in 10 minutes from one visitor |
| `GET /media/<key>` | Streams an R2 upload with `Cache-Control: public, max-age=31536000, immutable` |
| `GET /sitemap.xml` | Static pages plus every category and published product, with `lastmod` from D1 (`max-age=3600`) |
| `GET /robots.txt` | Allows everything except `/admin` and `/api/`, points at the sitemap |

Types are in [`shared/content.ts`](../shared/content.ts).

### Page middleware (`functions/_middleware.ts`)

Every page URL is served as the SPA's `index.html`, rewritten with `HTMLRewriter`:

- `<title>`, meta description, canonical, Open Graph and Twitter tags (with an image);
- JSON-LD: `Organization` (with `alternateName`), `WebSite`, `LocalBusiness` for each location in
  Settings (home, About and Contact), `BreadcrumbList`, and `Product` on product pages;
- a crawlable text summary inside `#root` (React replaces it on load);
- `<script id="site-data">` with the public Settings and the Turnstile site key, read by
  `src/data/company.ts`.

Unknown paths return **404** with `noindex`. Trailing slashes redirect (301) to the slash-less URL.
`/admin*` re-checks the Access JWT and returns 403 without it.

Products have no prices, so the `Product` JSON-LD has no `offers`. Google reads it as structured data,
but it won't qualify for product rich results until prices or reviews are added.

### Admin (`/api/admin/*`)

Every request goes through `functions/api/admin/_middleware.ts`, which verifies the
`Cf-Access-Jwt-Assertion` header: RS256 signature against
`https://<team>.cloudflareaccess.com/cdn-cgi/access/certs`, audience = `ACCESS_AUD`,
issuer = `ACCESS_TEAM_DOMAIN`, not expired. Anything else gets **403**. If the Access variables are
empty, everything is refused (fail closed). Responses are `no-store`.

| Method & path | Purpose |
| --- | --- |
| `GET me` | Signed-in email |
| `GET tree` | All categories and products, including unpublished |
| `POST categories` · `PATCH categories/:id` · `DELETE categories/:id` | Create, edit/move, delete-if-empty |
| `POST categories/reorder` | `{ parentId, ids }`: full sibling list in the new order |
| `POST products` · `GET products/:id` · `PUT products/:id` · `DELETE products/:id` | Create, read, replace (all fields and images), delete |
| `POST products/:id/published` | `{ published }` |
| `POST products/reorder` | `{ categoryId, ids }` |
| `POST uploads` | Multipart `file` + `thumb` (WebP, max 3 MB and 400 KB) + `width`/`height` → `{ key, width, height }` |
| `DELETE uploads/<key>` | Removes an upload if nothing references it |
| `GET/POST brands` · `PUT/DELETE brands/:id` · `POST brands/reorder` | Brands |
| `GET/POST industries` · `PUT/DELETE industries/:id` · `POST industries/reorder` | Industries |
| `GET enquiries?status=new\|read\|archived\|all` · `PATCH enquiries/:id` | Inbox list (latest 200) and `{ status }` |
| `GET settings` · `PUT settings` | `{ site, private }` |

Validation errors return `400` with `{ error, details: { field: message } }`; slug clashes return `409`.
Product descriptions are sanitised server-side to `p, h3, ul, ol, li, strong, em, b, i, br` with no
attributes.

Images are resized and converted to WebP **in the browser** (1600 px plus a 400 px thumbnail) before
upload; the Function only checks the type, size and WebP signature. No image processing runs on the
server.

Uploads that are never saved are cleaned up by the admin (`src/admin/draftUploads.ts`): each editor
tracks the images uploaded while it is open and calls `DELETE /api/admin/uploads/<key>` for them
when it is left, when the tab is reloaded or closed (`pagehide`, `keepalive`), and, after a save, for
uploads that were replaced or removed before saving. The server only deletes an upload that no row
references, so saved images are never affected.

## Deploying

The site owner does the sign-ins and dashboard steps; commands run from the repo root.

1. **Sign in:** `npx wrangler login` (opens the browser).
2. **Create the database and bucket:**
   ```bash
   npx wrangler d1 create mstradingco-db
   npx wrangler r2 bucket create mstradingco-media
   ```
   Copy the printed `database_id` into `wrangler.toml` and commit.
3. **Create tables and starter content:**
   ```bash
   npm run db:migrate:remote
   npm run db:seed:remote
   ```
   Then set the enquiry inbox, either later in Admin → Settings or now:
   ```bash
   npx wrangler d1 execute mstradingco-db --remote --command "INSERT INTO settings (key, value) VALUES ('private', '{\"notifyEmail\":\"you@example.com\"}') ON CONFLICT(key) DO UPDATE SET value = excluded.value"
   ```
4. **Connect the repository** (Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git):
   repository `RogueMG/mstradingco`, production branch `main`, framework preset *None*, build command
   `npm run build`, build output directory `dist`, root directory `/`. Use Node 22 or newer for the
   build. Bindings and variables come from `wrangler.toml`. Pushes to other branches (e.g. `develop`)
   create preview deployments.
5. **Protect the previews (and so the editors' admin) with Cloudflare Access** (Zero Trust; choose
   the Free plan and confirm it shows $0 before accepting). A self-hosted Access app can't be created
   for `pages.dev` directly (its Domain list only offers zones the account owns), so use the Pages
   route: Pages project → Settings → General → **Preview access → Restrict previews**. This creates
   the Access app "mstradingco - Cloudflare Pages" for `*.mstradingco.pages.dev`. Leave its path
   empty (whole site): Access only adds the `Cf-Access-Jwt-Assertion` header on paths it protects,
   and both `/admin` and `/api/admin` need it. Add a policy *Allow*, Include → Emails → the editors'
   addresses; one-time PIN login works without further setup. Copy the team domain and the app's
   **AUD** tag into `ACCESS_TEAM_DOMAIN` / `ACCESS_AUD` in `wrangler.toml`, then commit and deploy.

   Result: every preview needs sign-in, and editors use **https://develop.mstradingco.pages.dev/admin**
   (it writes to the same D1 as production). Production `mstradingco.pages.dev` has no Access app, so
   its `/admin` and `/api/admin/*` refuse everything (403, fail closed) until the custom domain gets
   its own Access app (see [Custom domain](#custom-domain-and-enquiry-emails)).
6. **Turnstile** (dashboard → Turnstile → Add widget, Managed): hostname `mstradingco.pages.dev`
   (covers its subdomains). Put the **site key** in `TURNSTILE_SITE_KEY` (`wrangler.toml`) and add
   `TURNSTILE_SECRET` in the dashboard for Production and Preview (see Secrets above).
7. **Verify on the preview URL** (signed in, since previews are behind Access): every page renders
   from D1; signed-out requests to `/admin` and `/api/admin/*` are sent to the Access login; an upload
   works; an enquiry is stored; `/sitemap.xml` and `/robots.txt` are valid; an unknown URL returns
   404; no console errors; no horizontal scrolling at 1440 px and 390 px. The Rich Results Test
   can't reach previews; run it on production.
8. **Go live:** fast-forward `main` to `develop` and push; Cloudflare builds and deploys production.
   Keep `develop` equal to `main` afterwards (it serves the editors' admin).

## Custom domain and enquiry emails

1. Add the domain to Cloudflare (Free plan) and change the nameservers at your registrar to the two
   Cloudflare gives you. Wait until the domain shows **Active**.
2. Pages project → Custom domains → add the domain (and `www` if you want both).
3. **Admin on the domain:** Zero Trust → Access → Applications → Add → Self-hosted, hostname(s) of
   the domain with the paths `admin` and `api/admin` (zone domains allow several rows), the same
   *Allow* policy as the preview app. This app has its own AUD tag, so the config must accept both
   AUDs (the preview app's and this one); `ACCESS_AUD` holds a single value today, so that needs a
   small code change first.
4. Add the domain to the Turnstile widget's hostnames, set `SITE_URL` in `wrangler.toml`, and
   redirect `mstradingco.pages.dev` to the domain.
5. Domain → Email → **Email Routing** → enable it. Under *Destination addresses*, add the enquiry inbox
   and click the verification link Cloudflare emails to it.
6. Deploy the mailer Worker:
   ```bash
   npx wrangler deploy --config workers/mailer/wrangler.toml
   ```
7. In `wrangler.toml`, set `MAIL_FROM` to an address on the domain (e.g. `website@example.com`) and
   uncomment the `[[services]]` block for `MAILER`. Commit and deploy.
8. Send a test enquiry. In Admin → Enquiries it should show "Email notification: sent". A `failed`
   status usually means the inbox isn't a verified destination address or `MAIL_FROM` isn't on the
   domain.

Email is optional: without it, enquiries are still stored and shown in the admin.

## Free plan: limits and what happens at them

The Cloudflare account is shared with another project, so these limits are shared too. Figures were
checked on developers.cloudflare.com on 2026-11-17; check the linked pages for current values.

| Service | Free allowance | At the limit |
| --- | --- | --- |
| Workers / Pages Functions ([limits](https://developers.cloudflare.com/workers/platform/limits/), [Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/)) | 100,000 requests per day (resets 00:00 UTC), 10 ms CPU per request. Static asset requests are free and unlimited | Function requests fail for the rest of the day (Workers return error 1027). Cloudflare's Pages docs don't say whether static files keep serving |
| D1 ([limits](https://developers.cloudflare.com/d1/platform/limits/), [pricing](https://developers.cloudflare.com/d1/platform/pricing/)) | 5 million rows read and 100,000 rows written per day; 10 databases; 500 MB each; 5 GB per account | Queries error until 00:00 UTC; at the storage limit, data must be deleted before inserting |
| R2 ([pricing](https://developers.cloudflare.com/r2/pricing/)) | 10 GB-month storage, 1 million Class A and 10 million Class B operations per month, free egress | Usage beyond the free tier is billed |

How this site stays inside them:

- Static files (`/assets/*`, `/images/*`) never invoke Functions (`_routes.json`).
- Each page view costs roughly 3 to 5 Function requests (the HTML page plus a few API calls), so the
  daily quota covers on the order of 20,000+ page views per day.
- API responses are cached briefly (`max-age=60`, `stale-while-revalidate=600`), and uploaded images
  are cached for a year.
- Functions do no image processing (images are resized in the browser).
- The catalogue is small; a tree read is tens of rows.

**Workers Paid ($5/month)** ([pricing](https://developers.cloudflare.com/workers/platform/pricing/)) covers
Pages Functions too: 10 million requests per month included (then $0.30 per million), 30 million CPU-ms
included (then $0.02 per million CPU-ms), no daily request cap, and D1 allowances of 25 billion rows
read, 50 million rows written and 5 GB storage per month. Static asset requests stay free.

Not confirmed from the docs: whether Turnstile and the Zero Trust Free plan (Access) are free for this
use. Check that each shows $0 when you add them.
