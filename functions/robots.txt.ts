import type { Fn } from "../server/env";

/** GET /robots.txt: allow everything public, keep admin and API out, point at the sitemap. */
export const onRequestGet: Fn = async ({ request, env }) => {
  const origin = (env.SITE_URL || new URL(request.url).origin).replace(/\/+$/, "");

  const body = ["User-agent: *", "Allow: /", "Disallow: /admin", "Disallow: /api/", "", `Sitemap: ${origin}/sitemap.xml`, ""].join(
    "\n",
  );

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
};
