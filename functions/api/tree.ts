import { loadTree, publicTree } from "../../server/catalogue";
import type { Fn } from "../../server/env";
import { json, PUBLIC_CACHE, toErrorResponse } from "../../server/http";

/** GET /api/tree: the category tree with each category's product titles and slugs. */
export const onRequestGet: Fn = async ({ env }) => {
  try {
    const tree = await loadTree(env.DB);
    return json({ categories: publicTree(tree.roots) }, { cache: PUBLIC_CACHE });
  } catch (err) {
    return toErrorResponse(err);
  }
};
