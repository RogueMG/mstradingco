import { loadTree } from "../server/catalogue";
import type { Fn } from "../server/env";

const STATIC_PATHS = ["/", "/about", "/products", "/brands", "/industries", "/contact"];

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** GET /sitemap.xml: static pages plus every category and published product, from D1. */
export const onRequestGet: Fn = async ({ request, env }) => {
  const origin = (env.SITE_URL || new URL(request.url).origin).replace(/\/+$/, "");
  const tree = await loadTree(env.DB);

  const entries: { loc: string; lastmod?: string }[] = STATIC_PATHS.map((path) => ({ loc: `${origin}${path}` }));

  for (const category of tree.byId.values()) {
    if (!category.path) continue;
    entries.push({ loc: `${origin}/products/${category.path}`, lastmod: category.updatedAt });
  }

  for (const product of tree.products) {
    const category = tree.byId.get(product.category_id);
    if (!category?.path) continue;
    entries.push({ loc: `${origin}/products/${category.path}/${product.slug}`, lastmod: product.updated_at });
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries
      .map(
        (entry) =>
          `  <url><loc>${escapeXml(entry.loc)}</loc>${
            entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod.slice(0, 10))}</lastmod>` : ""
          }</url>`,
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
