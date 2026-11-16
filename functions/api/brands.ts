import type { Fn } from "../../server/env";
import { json, PUBLIC_CACHE, toErrorResponse } from "../../server/http";
import { loadBrands } from "../../server/lists";

/** GET /api/brands: every brand in display order. */
export const onRequestGet: Fn = async ({ env }) => {
  try {
    return json({ brands: await loadBrands(env.DB) }, { cache: PUBLIC_CACHE });
  } catch (err) {
    return toErrorResponse(err);
  }
};
