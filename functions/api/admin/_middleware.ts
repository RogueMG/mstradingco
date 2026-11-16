import { verifyAdmin } from "../../../server/access";
import type { Fn } from "../../../server/env";
import { error } from "../../../server/http";

/**
 * Every /api/admin/* request must carry a valid Cloudflare Access JWT, even
 * though Access also guards the route at the edge. Local dev can bypass this
 * only with DEV_BYPASS_ACCESS=true on localhost (see server/access.ts).
 */
export const onRequest: Fn = async (context) => {
  const admin = await verifyAdmin(context.request, context.env);

  if (!admin) {
    return error(403, "Forbidden: a valid Cloudflare Access login is required.");
  }

  context.data.admin = admin;

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: response.status, headers });
};
