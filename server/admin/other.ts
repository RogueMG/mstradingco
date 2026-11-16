import type { AdminBrand, AdminEnquiry, AdminImage, AdminIndustry, EnquiryStatus, UploadResult } from "../../shared/admin";
import {
  defaultPrivateSettings,
  defaultSiteSettings,
  type PrivateSettings,
  type SiteLocation,
  type SiteSettings,
} from "../../shared/site";
import { isValidSlug } from "../../shared/slug";
import type { Env } from "../env";
import { HttpError, nowIso } from "../http";
import { UPLOAD_PREFIX, thumbKey } from "../images";
import { loadPrivateSettings, loadSiteSettings } from "../lists";
import { Validator } from "../validate";
import { deleteUnreferencedUploads, nextOrder, readImage, reorder } from "./common";

// ---------------------------------------------------------------- brands

interface BrandRow {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  confirmed: number;
  in_house: number;
  logo_key: string | null;
  logo_url: string | null;
  logo_alt: string;
  logo_width: number | null;
  logo_height: number | null;
  sort_order: number;
}

const BRAND_COLUMNS = `id, slug, name, tagline, description, confirmed, in_house, logo_key, logo_url,
  logo_alt, logo_width, logo_height, sort_order`;

function toAdminBrand(row: BrandRow): AdminBrand {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    confirmed: row.confirmed === 1,
    inHouse: row.in_house === 1,
    logo:
      row.logo_key || row.logo_url
        ? { key: row.logo_key, url: row.logo_url, alt: row.logo_alt, width: row.logo_width, height: row.logo_height }
        : null,
    order: row.sort_order,
  };
}

export async function listBrands(env: Env): Promise<AdminBrand[]> {
  const { results } = await env.DB.prepare(`SELECT ${BRAND_COLUMNS} FROM brands ORDER BY sort_order, name`).all<BrandRow>();
  return results.map(toAdminBrand);
}

async function readBrandInput(env: Env, body: unknown) {
  const check = new Validator(body);
  const input = {
    name: check.string("name", { required: true, max: 100, label: "Name" }),
    slug: check.string("slug", { required: true, max: 80, label: "Slug" }),
    tagline: check.string("tagline", { max: 80, label: "Tagline" }),
    description: check.string("description", { max: 400, label: "Description" }),
    confirmed: check.boolean("confirmed", true),
    inHouse: check.boolean("inHouse", false),
    logo: await readImage(env, check, "logo", { label: "Logo" }),
  };
  if (input.slug && !isValidSlug(input.slug)) check.issues.slug = "Use lowercase letters, numbers and dashes only.";
  check.done();
  return input;
}

function logoBinds(logo: AdminImage | null) {
  return [logo?.key ?? null, logo?.url ?? null, logo?.alt ?? "", logo?.width ?? null, logo?.height ?? null];
}

export async function createBrand(env: Env, body: unknown): Promise<AdminBrand> {
  const input = await readBrandInput(env, body);
  const order = await nextOrder(env.DB, "SELECT max(sort_order) AS max_order FROM brands");

  const row = await env.DB.prepare(
    `INSERT INTO brands (name, slug, tagline, description, confirmed, in_house, logo_key, logo_url, logo_alt,
                         logo_width, logo_height, sort_order)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12) RETURNING ${BRAND_COLUMNS}`,
  )
    .bind(input.name, input.slug, input.tagline, input.description, input.confirmed ? 1 : 0, input.inHouse ? 1 : 0, ...logoBinds(input.logo), order)
    .first<BrandRow>();

  return toAdminBrand(row!);
}

export async function updateBrand(env: Env, id: number, body: unknown): Promise<AdminBrand> {
  const existing = await env.DB.prepare(`SELECT ${BRAND_COLUMNS} FROM brands WHERE id = ?1`).bind(id).first<BrandRow>();
  if (!existing) throw new HttpError(404, "Brand not found.");

  const input = await readBrandInput(env, body);
  const row = await env.DB.prepare(
    `UPDATE brands SET name = ?1, slug = ?2, tagline = ?3, description = ?4, confirmed = ?5, in_house = ?6,
            logo_key = ?7, logo_url = ?8, logo_alt = ?9, logo_width = ?10, logo_height = ?11, updated_at = ?12
     WHERE id = ?13 RETURNING ${BRAND_COLUMNS}`,
  )
    .bind(input.name, input.slug, input.tagline, input.description, input.confirmed ? 1 : 0, input.inHouse ? 1 : 0, ...logoBinds(input.logo), nowIso(), id)
    .first<BrandRow>();

  if (existing.logo_key && existing.logo_key !== input.logo?.key) {
    await deleteUnreferencedUploads(env, [existing.logo_key]);
  }

  return toAdminBrand(row!);
}

export async function deleteBrand(env: Env, id: number): Promise<void> {
  const existing = await env.DB.prepare("SELECT logo_key FROM brands WHERE id = ?1").bind(id).first<{ logo_key: string | null }>();
  if (!existing) throw new HttpError(404, "Brand not found.");

  // Products keep existing; their brand is cleared (ON DELETE SET NULL).
  await env.DB.prepare("DELETE FROM brands WHERE id = ?1").bind(id).run();
  await deleteUnreferencedUploads(env, [existing.logo_key]);
}

export async function reorderBrands(env: Env, body: unknown): Promise<void> {
  const { results } = await env.DB.prepare("SELECT id FROM brands").all<{ id: number }>();
  await reorder(env.DB, "brands", (body as { ids?: unknown })?.ids, results.map((row) => row.id));
}

// ---------------------------------------------------------------- industries

interface IndustryRow {
  id: number;
  slug: string;
  title: string;
  label: string;
  summary: string;
  image_key: string | null;
  image_url: string | null;
  image_alt: string;
  image_width: number | null;
  image_height: number | null;
  show_on_home: number;
  sort_order: number;
}

const INDUSTRY_COLUMNS = `id, slug, title, label, summary, image_key, image_url, image_alt, image_width,
  image_height, show_on_home, sort_order`;

function toAdminIndustry(row: IndustryRow): AdminIndustry {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    label: row.label,
    summary: row.summary,
    image:
      row.image_key || row.image_url
        ? { key: row.image_key, url: row.image_url, alt: row.image_alt, width: row.image_width, height: row.image_height }
        : null,
    showOnHome: row.show_on_home === 1,
    order: row.sort_order,
  };
}

export async function listIndustries(env: Env): Promise<AdminIndustry[]> {
  const { results } = await env.DB.prepare(`SELECT ${INDUSTRY_COLUMNS} FROM industries ORDER BY sort_order, title`).all<IndustryRow>();
  return results.map(toAdminIndustry);
}

async function readIndustryInput(env: Env, body: unknown) {
  const check = new Validator(body);
  const input = {
    title: check.string("title", { required: true, max: 100, label: "Title" }),
    slug: check.string("slug", { required: true, max: 80, label: "Slug" }),
    label: check.string("label", { max: 60, label: "Short label" }),
    summary: check.string("summary", { max: 300, label: "Summary" }),
    showOnHome: check.boolean("showOnHome", true),
    image: await readImage(env, check, "image", { required: true, label: "Image" }),
  };
  if (input.slug && !isValidSlug(input.slug)) check.issues.slug = "Use lowercase letters, numbers and dashes only.";
  check.done();
  return input;
}

export async function createIndustry(env: Env, body: unknown): Promise<AdminIndustry> {
  const input = await readIndustryInput(env, body);
  const order = await nextOrder(env.DB, "SELECT max(sort_order) AS max_order FROM industries");

  const row = await env.DB.prepare(
    `INSERT INTO industries (title, slug, label, summary, show_on_home, image_key, image_url, image_alt,
                             image_width, image_height, sort_order)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11) RETURNING ${INDUSTRY_COLUMNS}`,
  )
    .bind(input.title, input.slug, input.label, input.summary, input.showOnHome ? 1 : 0, ...logoBinds(input.image), order)
    .first<IndustryRow>();

  return toAdminIndustry(row!);
}

export async function updateIndustry(env: Env, id: number, body: unknown): Promise<AdminIndustry> {
  const existing = await env.DB.prepare(`SELECT ${INDUSTRY_COLUMNS} FROM industries WHERE id = ?1`).bind(id).first<IndustryRow>();
  if (!existing) throw new HttpError(404, "Industry not found.");

  const input = await readIndustryInput(env, body);
  const row = await env.DB.prepare(
    `UPDATE industries SET title = ?1, slug = ?2, label = ?3, summary = ?4, show_on_home = ?5, image_key = ?6,
            image_url = ?7, image_alt = ?8, image_width = ?9, image_height = ?10, updated_at = ?11
     WHERE id = ?12 RETURNING ${INDUSTRY_COLUMNS}`,
  )
    .bind(input.title, input.slug, input.label, input.summary, input.showOnHome ? 1 : 0, ...logoBinds(input.image), nowIso(), id)
    .first<IndustryRow>();

  if (existing.image_key && existing.image_key !== input.image?.key) {
    await deleteUnreferencedUploads(env, [existing.image_key]);
  }

  return toAdminIndustry(row!);
}

export async function deleteIndustry(env: Env, id: number): Promise<void> {
  const existing = await env.DB.prepare("SELECT image_key FROM industries WHERE id = ?1").bind(id).first<{ image_key: string | null }>();
  if (!existing) throw new HttpError(404, "Industry not found.");

  await env.DB.prepare("DELETE FROM industries WHERE id = ?1").bind(id).run();
  await deleteUnreferencedUploads(env, [existing.image_key]);
}

export async function reorderIndustries(env: Env, body: unknown): Promise<void> {
  const { results } = await env.DB.prepare("SELECT id FROM industries").all<{ id: number }>();
  await reorder(env.DB, "industries", (body as { ids?: unknown })?.ids, results.map((row) => row.id));
}

// ---------------------------------------------------------------- enquiries

interface EnquiryRow {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  source_page: string;
  status: EnquiryStatus;
  email_status: string;
  created_at: string;
}

export async function listEnquiries(env: Env, status: string | null): Promise<{ enquiries: AdminEnquiry[]; counts: Record<string, number> }> {
  const filter = status && ["new", "read", "archived"].includes(status) ? status : null;

  const [rows, counts] = await env.DB.batch([
    env.DB.prepare(
      `SELECT id, name, company, email, phone, interest, message, source_page, status, email_status, created_at
       FROM enquiries WHERE ?1 IS NULL OR status = ?1 ORDER BY created_at DESC LIMIT 200`,
    ).bind(filter),
    env.DB.prepare("SELECT status, count(*) AS n FROM enquiries GROUP BY status"),
  ]);

  return {
    enquiries: ((rows.results ?? []) as unknown as EnquiryRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      company: row.company,
      email: row.email,
      phone: row.phone,
      interest: row.interest,
      message: row.message,
      sourcePage: row.source_page,
      status: row.status,
      emailStatus: row.email_status,
      createdAt: row.created_at,
    })),
    counts: Object.fromEntries(
      ((counts.results ?? []) as unknown as { status: string; n: number }[]).map((row) => [row.status, row.n]),
    ),
  };
}

export async function setEnquiryStatus(env: Env, id: number, body: unknown): Promise<void> {
  const check = new Validator(body);
  const status = check.string("status", { required: true, max: 10 });
  if (status && !["new", "read", "archived"].includes(status)) check.issues.status = "Status must be new, read or archived.";
  check.done();

  const result = await env.DB.prepare("UPDATE enquiries SET status = ?1 WHERE id = ?2").bind(status, id).run();
  if (!result.meta.changes) throw new HttpError(404, "Enquiry not found.");
}

// ---------------------------------------------------------------- settings

export async function getSettings(env: Env): Promise<{ site: SiteSettings; private: PrivateSettings }> {
  const [site, privateSettings] = await Promise.all([loadSiteSettings(env.DB), loadPrivateSettings(env.DB)]);
  return { site, private: privateSettings };
}

function readLocation(value: unknown, index: number, issues: Record<string, string>): SiteLocation | null {
  const check = new Validator(value);
  const field = (name: string) => `locations.${index}.${name}`;

  const location: SiteLocation = {
    id: check.string("id", { required: true, max: 40 }) || `location-${index + 1}`,
    name: check.string("name", { required: true, max: 80, label: "Location name" }),
    streetAddress: check.string("streetAddress", { required: true, max: 200, label: "Street address" }),
    locality: check.string("locality", { required: true, max: 80, label: "City" }),
    region: check.string("region", { max: 80, label: "State" }),
    postalCode: check.string("postalCode", { max: 20, label: "Postal code" }),
    country: check.string("country", { max: 2, label: "Country" }).toUpperCase() || "IN",
    phone: check.string("phone", { max: 30, label: "Phone" }),
    latitude: null,
    longitude: null,
    openingHours: check.stringArray("openingHours", { maxItems: 14, maxLength: 60 }),
  };

  for (const axis of ["latitude", "longitude"] as const) {
    const raw = check.raw(axis);
    if (raw === null || raw === undefined || raw === "") continue;
    const limit = axis === "latitude" ? 90 : 180;
    if (typeof raw !== "number" || !Number.isFinite(raw) || Math.abs(raw) > limit) {
      check.issues[axis] = `${axis} must be a number between -${limit} and ${limit}.`;
    } else {
      location[axis] = raw;
    }
  }

  if (!/^[a-z0-9-]+$/.test(location.id)) check.issues.id = "Location id must be lowercase letters, numbers and dashes.";

  for (const [name, message] of Object.entries(check.issues)) issues[field(name)] = message;
  return Object.keys(check.issues).length ? null : location;
}

export async function saveSettings(env: Env, body: unknown): Promise<{ site: SiteSettings; private: PrivateSettings }> {
  const root = new Validator(body);
  const siteCheck = new Validator(root.raw("site") ?? {});
  const privateCheck = new Validator(root.raw("private") ?? {});

  const site: SiteSettings = {
    ...defaultSiteSettings,
    name: siteCheck.string("name", { required: true, max: 100, label: "Business name" }),
    alternateNames: siteCheck.stringArray("alternateNames", { maxItems: 10, maxLength: 100 }),
    description: siteCheck.string("description", { required: true, max: 300, label: "Description" }),
    email: siteCheck.email("email", { required: true, label: "Public email" }),
    phone: siteCheck.string("phone", { required: true, max: 30, label: "Phone" }),
    landline: siteCheck.string("landline", { max: 30, label: "Landline" }),
    whatsappNumber: siteCheck.string("whatsappNumber", { required: true, max: 15, label: "WhatsApp number" }),
    gstin: siteCheck.string("gstin", { max: 20, label: "GSTIN" }),
    locations: [],
    social: [],
  };

  if (site.whatsappNumber && !/^\d{8,15}$/.test(site.whatsappNumber)) {
    siteCheck.issues.whatsappNumber = "Digits only, with country code (e.g. 918939575200).";
  }

  const locations = siteCheck.raw("locations");
  if (!Array.isArray(locations) || locations.length === 0 || locations.length > 20) {
    siteCheck.issues.locations = "Add at least one location (up to 20).";
  } else {
    locations.forEach((value, index) => {
      const location = readLocation(value, index, siteCheck.issues);
      if (location) site.locations.push(location);
    });
  }

  const social = siteCheck.raw("social");
  if (Array.isArray(social)) {
    for (const item of social.slice(0, 10)) {
      const label = typeof item?.label === "string" ? item.label.trim().slice(0, 40) : "";
      const url = typeof item?.url === "string" ? item.url.trim() : "";
      if (label && /^https:\/\/\S+$/.test(url)) site.social.push({ label, url });
    }
  }

  const privateSettings: PrivateSettings = {
    ...defaultPrivateSettings,
    notifyEmail: privateCheck.email("notifyEmail", { label: "Notification email" }),
  };

  const issues = {
    ...Object.fromEntries(Object.entries(siteCheck.issues).map(([key, value]) => [`site.${key}`, value])),
    ...Object.fromEntries(Object.entries(privateCheck.issues).map(([key, value]) => [`private.${key}`, value])),
  };

  if (Object.keys(issues).length) throw new HttpError(400, "Please check the highlighted fields.", issues);

  const now = nowIso();
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO settings (key, value, updated_at) VALUES ('site', ?1, ?2) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
    ).bind(JSON.stringify(site), now),
    env.DB.prepare(
      "INSERT INTO settings (key, value, updated_at) VALUES ('private', ?1, ?2) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
    ).bind(JSON.stringify(privateSettings), now),
  ]);

  return { site, private: privateSettings };
}

// ---------------------------------------------------------------- uploads

const MAX_FULL_BYTES = 3 * 1024 * 1024;
const MAX_THUMB_BYTES = 400 * 1024;

/** WebP files start with "RIFF" ... "WEBP". */
async function isWebp(file: File): Promise<boolean> {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const text = String.fromCharCode(...head);
  return text.startsWith("RIFF") && text.slice(8, 12) === "WEBP";
}

/**
 * POST /api/admin/uploads (multipart: file, thumb, width, height).
 * The browser has already resized and converted to WebP; here we only check
 * type and size and store both files. No image processing on the server.
 */
export async function upload(env: Env, request: Request): Promise<UploadResult> {
  const length = Number(request.headers.get("Content-Length") ?? 0);
  if (length > MAX_FULL_BYTES + MAX_THUMB_BYTES + 10_000) {
    throw new HttpError(413, "That image is too large. Images are resized in your browser; try a smaller original.");
  }

  const form = await request.formData();
  const file = form.get("file");
  const thumb = form.get("thumb");
  const width = Number(form.get("width"));
  const height = Number(form.get("height"));

  if (!(file instanceof File) || !(thumb instanceof File)) throw new HttpError(400, "Send the image and its thumbnail.");
  if (file.type !== "image/webp" || thumb.type !== "image/webp" || !(await isWebp(file)) || !(await isWebp(thumb))) {
    throw new HttpError(415, "Images must be WebP (the admin converts them for you).");
  }
  if (file.size > MAX_FULL_BYTES || thumb.size > MAX_THUMB_BYTES) {
    throw new HttpError(413, "That image is too large after resizing.");
  }
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 4000 || height > 4000) {
    throw new HttpError(400, "Image size is missing or invalid.");
  }

  const key = `${UPLOAD_PREFIX}${crypto.randomUUID()}.webp`;
  const metadata = { httpMetadata: { contentType: "image/webp", cacheControl: "public, max-age=31536000, immutable" } };

  await env.MEDIA.put(key, file.stream(), metadata);
  await env.MEDIA.put(thumbKey(key), thumb.stream(), metadata);

  return { key, width, height };
}

/** Removes an upload that was never saved (e.g. the editor was cancelled). Refuses if anything uses it. */
export async function discardUpload(env: Env, key: string): Promise<void> {
  if (!/^uploads\/[a-f0-9-]{36}\.webp$/.test(key)) throw new HttpError(404, "Not found.");
  await deleteUnreferencedUploads(env, [key]);
}
