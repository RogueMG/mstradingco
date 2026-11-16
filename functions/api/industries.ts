import type { Fn } from "../../server/env";
import { json, PUBLIC_CACHE, toErrorResponse } from "../../server/http";
import { loadIndustries } from "../../server/lists";

/** GET /api/industries: every industry in display order. */
export const onRequestGet: Fn = async ({ env }) => {
  try {
    return json({ industries: await loadIndustries(env.DB) }, { cache: PUBLIC_CACHE });
  } catch (err) {
    return toErrorResponse(err);
  }
};
