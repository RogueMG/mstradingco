/**
 * Runs for every request that reaches Functions (static files under /assets
 * and /images are excluded by public/_routes.json and never get here).
 *
 * For page URLs it serves the SPA's index.html, rewritten with per-URL SEO
 * (title, description, canonical, Open Graph, JSON-LD, a crawlable summary)
 * and the public site settings, and returns a real 404 for unknown paths.
 */
import { verifyAdmin } from "../server/access";
import type { Env, Fn } from "../server/env";
import { loadSiteSettings } from "../server/lists";
import { escapeHtml, jsonLdScript, notFound, seoFor, type PageSeo } from "../server/seo";
import { defaultSiteSettings, type SiteSettings } from "../shared/site";

const PASS_THROUGH = /^\/(?:api\/|media\/|sitemap\.xml$|robots\.txt$)/;

function originFor(request: Request, env: Env): string {
  return (env.SITE_URL || new URL(request.url).origin).replace(/\/+$/, "");
}

function headTags(seo: PageSeo, origin: string, site: SiteSettings, siteData: object): string {
  const canonical = `${origin}${seo.canonicalPath}`;
  const image = /^https?:\/\//.test(seo.imagePath) ? seo.imagePath : `${origin}${seo.imagePath}`;
  const tags = [
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    seo.noindex ? `<meta name="robots" content="noindex, follow">` : "",
    seo.status === 200 && !seo.noindex ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : "",
    `<meta property="og:site_name" content="${escapeHtml(site.name)}">`,
    `<meta property="og:type" content="${seo.ogType}">`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
    `<meta property="og:image" content="${escapeHtml(image)}">`,
    `<meta property="og:locale" content="en_IN">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(image)}">`,
    ...seo.jsonLd.map(jsonLdScript),
    // Read by the app on start-up (src/data/company.ts).
    `<script id="site-data" type="application/json">${JSON.stringify(siteData).replace(/</g, "\\u003c")}</script>`,
  ];

  return tags.filter(Boolean).join("");
}

async function renderPage(request: Request, env: Env, seo: PageSeo, site: SiteSettings): Promise<Response> {
  const origin = originFor(request, env);
  const shell = await env.ASSETS.fetch(new Request(new URL("/", request.url), { method: "GET" }));
  const siteData = { site, turnstileSiteKey: env.TURNSTILE_SITE_KEY || "" };

  const rewritten = new HTMLRewriter()
    .on("title", {
      element(element) {
        element.setInnerContent(seo.title);
      },
    })
    .on('meta[name="description"]', {
      element(element) {
        element.remove();
      },
    })
    .on("head", {
      element(element) {
        element.append(headTags(seo, origin, site, siteData), { html: true });
      },
    })
    .on("div#root", {
      element(element) {
        element.setInnerContent(`<div data-seo-summary>${seo.summaryHtml}</div>`, { html: true });
      },
    })
    .transform(shell);

  const headers = new Headers(rewritten.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  // Pages change on every content edit and deploy; let browsers revalidate.
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.delete("ETag");
  if (seo.noindex) headers.set("X-Robots-Tag", "noindex");

  return new Response(rewritten.body, { status: seo.status, headers });
}

export const onRequest: Fn = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const { pathname } = url;

  if (PASS_THROUGH.test(pathname) || (request.method !== "GET" && request.method !== "HEAD")) {
    return context.next();
  }

  // Files with an extension (e.g. /favicon.svg) are static assets.
  if (/\.[a-z0-9]{2,5}$/i.test(pathname)) {
    return context.next();
  }

  // One canonical form per page: no trailing slash.
  if (pathname.length > 1 && pathname.endsWith("/")) {
    url.pathname = pathname.replace(/\/+$/, "");
    return Response.redirect(url.toString(), 301);
  }

  let site = defaultSiteSettings;

  try {
    site = await loadSiteSettings(env.DB);
  } catch (err) {
    console.error("Could not load site settings", err);
  }

  // Admin pages: Access protects them at the edge; check the JWT here too.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const admin = await verifyAdmin(request, env);

    if (!admin) {
      return new Response("Forbidden: sign in through Cloudflare Access to use the admin.", {
        status: 403,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      });
    }

    const seo = { ...notFound(site, pathname), status: 200 as const, title: `Admin | ${site.name}`, summaryHtml: "" };
    const response = await renderPage(request, env, seo, site);
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  try {
    const seo = await seoFor(env.DB, pathname, originFor(request, env), site);
    return await renderPage(request, env, seo, site);
  } catch (err) {
    // Never take the site down over SEO: fall back to the plain app shell.
    console.error("SEO rendering failed", err);
    return context.next();
  }
};
