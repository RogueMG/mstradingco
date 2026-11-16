import type { AdminImage } from "../../shared/admin";
import type { Env } from "../env";
import { HttpError } from "../http";
import { isValidImageUrl, isValidUploadKey, thumbKey } from "../images";
import type { Validator } from "../validate";

/**
 * Reads an image field: either an uploaded R2 key or an https URL (or a site
 * file under /images/), plus required alt text. Returns null when absent.
 */
export async function readImage(
  env: Env,
  check: Validator,
  field: string,
  options: { required?: boolean; label?: string } = {},
): Promise<AdminImage | null> {
  const value = check.raw(field);
  const label = options.label ?? "Image";

  if (value === undefined || value === null) {
    if (options.required) check.issues[field] = `${label} is required.`;
    return null;
  }

  return parseImage(env, value, field, label, check.issues);
}

export async function parseImage(
  env: Env,
  value: unknown,
  field: string,
  label: string,
  issues: Record<string, string>,
): Promise<AdminImage | null> {
  if (!value || typeof value !== "object") {
    issues[field] = `${label} is not valid.`;
    return null;
  }

  const image = value as Partial<AdminImage>;
  const key = typeof image.key === "string" && image.key ? image.key : null;
  const url = typeof image.url === "string" && image.url.trim() ? image.url.trim() : null;
  const alt = typeof image.alt === "string" ? image.alt.trim() : "";
  const size = (n: unknown) => (typeof n === "number" && Number.isInteger(n) && n > 0 && n <= 10_000 ? n : null);

  if (!key && !url) {
    issues[field] = `${label}: upload an image or paste an image link.`;
    return null;
  }

  if (key && !isValidUploadKey(key)) {
    issues[field] = `${label}: unknown upload.`;
    return null;
  }

  if (key && !(await env.MEDIA.head(key))) {
    issues[field] = `${label}: the uploaded file was not found. Please upload it again.`;
    return null;
  }

  if (!key && url && !isValidImageUrl(url)) {
    issues[field] = `${label}: links must start with https://`;
    return null;
  }

  if (!alt) {
    issues[field] = `${label}: alt text is required (describe the image).`;
    return null;
  }

  if (alt.length > 200) {
    issues[field] = `${label}: alt text must be 200 characters or fewer.`;
    return null;
  }

  return { key, url: key ? null : url, alt, width: size(image.width), height: size(image.height) };
}

/** Deletes uploads (and their thumbnails) that no row references any more. */
export async function deleteUnreferencedUploads(env: Env, keys: (string | null | undefined)[]): Promise<void> {
  const unique = [...new Set(keys.filter((key): key is string => Boolean(key)))];

  for (const key of unique) {
    const row = await env.DB.prepare(
      `SELECT (SELECT count(*) FROM product_images WHERE image_key = ?1)
            + (SELECT count(*) FROM categories WHERE image_key = ?1)
            + (SELECT count(*) FROM brands WHERE logo_key = ?1)
            + (SELECT count(*) FROM industries WHERE image_key = ?1) AS refs`,
    )
      .bind(key)
      .first<{ refs: number }>();

    if ((row?.refs ?? 0) === 0) {
      await env.MEDIA.delete([key, thumbKey(key)]);
    }
  }
}

/** Next sort position after the current last item (keeps gaps of 10). */
export async function nextOrder(db: D1Database, sql: string, ...binds: unknown[]): Promise<number> {
  const row = await db.prepare(sql).bind(...binds).first<{ max_order: number | null }>();
  return (row?.max_order ?? 0) + 10;
}

/**
 * Rewrites sort_order for a list of ids that must all belong to one group
 * (e.g. siblings under one parent). `groupCheck` returns the ids actually in the group.
 */
export async function reorder(
  db: D1Database,
  table: "categories" | "products" | "brands" | "industries",
  ids: unknown,
  groupIds: number[],
): Promise<void> {
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 500 || !ids.every((id) => Number.isInteger(id))) {
    throw new HttpError(400, "Send the full list of ids in their new order.");
  }

  const wanted = new Set(groupIds);
  if (ids.length !== wanted.size || !ids.every((id) => wanted.has(id as number))) {
    throw new HttpError(400, "The list must contain exactly the items in this group.");
  }

  const now = new Date().toISOString();
  await db.batch(
    (ids as number[]).map((id, index) =>
      db.prepare(`UPDATE ${table} SET sort_order = ?1, updated_at = ?2 WHERE id = ?3`).bind((index + 1) * 10, now, id),
    ),
  );
}

export function parseId(value: string | undefined): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, "Not found.");
  return id;
}
