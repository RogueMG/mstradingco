import { loadTree, resolveNode } from "../../server/catalogue";
import type { Fn } from "../../server/env";
import { error, json, PUBLIC_CACHE, toErrorResponse } from "../../server/http";

const PATH_PATTERN = /^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/;

/**
 * GET /api/node?path=a/b/c
 * A category (children, products, breadcrumb) or a product (all fields, images,
 * brand, breadcrumb, related products), or 404.
 */
export const onRequestGet: Fn = async ({ request, env }) => {
  try {
    const path = (new URL(request.url).searchParams.get("path") ?? "").replace(/^\/+|\/+$/g, "");

    if (!path || path.length > 400 || !PATH_PATTERN.test(path)) {
      return error(400, "Pass a catalogue path, e.g. ?path=body-ppe/safety-gloves");
    }

    const tree = await loadTree(env.DB);
    const node = await resolveNode(env.DB, tree, path);

    if (!node) {
      return json({ error: "Not found" }, { status: 404, cache: PUBLIC_CACHE });
    }

    return json(node, { cache: PUBLIC_CACHE });
  } catch (err) {
    return toErrorResponse(err);
  }
};
