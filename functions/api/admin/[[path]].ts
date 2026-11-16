/**
 * /api/admin/*: every write for the admin panel. The sibling _middleware.ts
 * has already verified the Cloudflare Access JWT before anything here runs.
 */
import type { AdminIdentity } from "../../../server/access";
import {
  adminTree,
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getProduct,
  reorderCategories,
  reorderProducts,
  setPublished,
  updateCategory,
  updateProduct,
} from "../../../server/admin/catalogue";
import { parseId } from "../../../server/admin/common";
import {
  createBrand,
  createIndustry,
  deleteBrand,
  deleteIndustry,
  discardUpload,
  getSettings,
  listBrands,
  listEnquiries,
  listIndustries,
  reorderBrands,
  reorderIndustries,
  saveSettings,
  setEnquiryStatus,
  updateBrand,
  updateIndustry,
  upload,
} from "../../../server/admin/other";
import type { Env, Fn } from "../../../server/env";
import { error, json, readJson, toErrorResponse } from "../../../server/http";

type Handler = (ctx: { env: Env; request: Request; params: string[]; admin: AdminIdentity }) => Promise<Response>;

const ok = () => json({ ok: true });

/** Method + path pattern → handler. ":id" segments are passed in order. */
const routes: [string, string, Handler][] = [
  ["GET", "me", async ({ admin }) => json(admin)],
  ["GET", "tree", async ({ env }) => json(await adminTree(env))],

  ["POST", "categories", async ({ env, request }) => json(await createCategory(env, await readJson(request)), { status: 201 })],
  ["POST", "categories/reorder", async ({ env, request }) => (await reorderCategories(env, await readJson(request)), ok())],
  ["PATCH", "categories/:id", async ({ env, request, params }) => json(await updateCategory(env, parseId(params[0]), await readJson(request)))],
  ["DELETE", "categories/:id", async ({ env, params }) => (await deleteCategory(env, parseId(params[0])), ok())],

  ["POST", "products", async ({ env, request }) => json(await createProduct(env, await readJson(request)), { status: 201 })],
  ["POST", "products/reorder", async ({ env, request }) => (await reorderProducts(env, await readJson(request)), ok())],
  ["GET", "products/:id", async ({ env, params }) => json(await getProduct(env, parseId(params[0])))],
  ["PUT", "products/:id", async ({ env, request, params }) => json(await updateProduct(env, parseId(params[0]), await readJson(request)))],
  ["POST", "products/:id/published", async ({ env, request, params }) => (await setPublished(env, parseId(params[0]), await readJson(request)), ok())],
  ["DELETE", "products/:id", async ({ env, params }) => (await deleteProduct(env, parseId(params[0])), ok())],

  ["POST", "uploads", async ({ env, request }) => json(await upload(env, request), { status: 201 })],
  ["DELETE", "uploads/uploads/:file", async ({ env, params }) => (await discardUpload(env, `uploads/${params[0]}`), ok())],

  ["GET", "brands", async ({ env }) => json({ brands: await listBrands(env) })],
  ["POST", "brands", async ({ env, request }) => json(await createBrand(env, await readJson(request)), { status: 201 })],
  ["POST", "brands/reorder", async ({ env, request }) => (await reorderBrands(env, await readJson(request)), ok())],
  ["PUT", "brands/:id", async ({ env, request, params }) => json(await updateBrand(env, parseId(params[0]), await readJson(request)))],
  ["DELETE", "brands/:id", async ({ env, params }) => (await deleteBrand(env, parseId(params[0])), ok())],

  ["GET", "industries", async ({ env }) => json({ industries: await listIndustries(env) })],
  ["POST", "industries", async ({ env, request }) => json(await createIndustry(env, await readJson(request)), { status: 201 })],
  ["POST", "industries/reorder", async ({ env, request }) => (await reorderIndustries(env, await readJson(request)), ok())],
  ["PUT", "industries/:id", async ({ env, request, params }) => json(await updateIndustry(env, parseId(params[0]), await readJson(request)))],
  ["DELETE", "industries/:id", async ({ env, params }) => (await deleteIndustry(env, parseId(params[0])), ok())],

  ["GET", "enquiries", async ({ env, request }) => json(await listEnquiries(env, new URL(request.url).searchParams.get("status")))],
  ["PATCH", "enquiries/:id", async ({ env, request, params }) => (await setEnquiryStatus(env, parseId(params[0]), await readJson(request)), ok())],

  ["GET", "settings", async ({ env }) => json(await getSettings(env))],
  ["PUT", "settings", async ({ env, request }) => json(await saveSettings(env, await readJson(request)))],
];

function match(pattern: string, path: string): string[] | null {
  const want = pattern.split("/");
  const have = path.split("/");
  if (want.length !== have.length) return null;

  const params: string[] = [];
  for (let i = 0; i < want.length; i++) {
    if (want[i].startsWith(":")) params.push(have[i]);
    else if (want[i] !== have[i]) return null;
  }
  return params;
}

export const onRequest: Fn<"path"> = async ({ request, env, data }) => {
  const path = new URL(request.url).pathname.replace(/^\/api\/admin\/?/, "").replace(/\/+$/, "");
  let pathMatched = false;

  for (const [method, pattern, handler] of routes) {
    const params = match(pattern, path);
    if (!params) continue;
    pathMatched = true;
    if (method !== request.method) continue;

    try {
      return await handler({ env, request, params, admin: data.admin as AdminIdentity });
    } catch (err) {
      return toErrorResponse(err);
    }
  }

  return pathMatched ? error(405, "Method not allowed.") : error(404, "Not found.");
};
