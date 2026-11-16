import type { Fn } from "../../server/env";

const KEY_PATTERN = /^uploads\/[a-f0-9-]{36}(?:-thumb)?\.webp$/;

/**
 * GET /media/<key>: streams an uploaded image from R2. Keys are unique per
 * upload and never reused, so responses are cached for a year as immutable.
 */
export const onRequestGet: Fn<"key"> = async ({ params, env, request }) => {
  const key = Array.isArray(params.key) ? params.key.join("/") : String(params.key ?? "");

  if (!KEY_PATTERN.test(key)) {
    return new Response("Not found", { status: 404 });
  }

  const object = await env.MEDIA.get(key, { onlyIf: request.headers });

  if (!object) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("ETag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");

  // A conditional request that matched returns metadata only.
  if (!("body" in object) || !object.body) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(object.body, { headers });
};
