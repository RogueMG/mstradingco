import type { Brand, Industry } from "../shared/content";
import {
  defaultPrivateSettings,
  defaultSiteSettings,
  type PrivateSettings,
  type SiteSettings,
} from "../shared/site";
import { toImage } from "./images";

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

export async function loadBrands(db: D1Database): Promise<Brand[]> {
  const { results } = await db
    .prepare(
      `SELECT id, slug, name, tagline, description, confirmed, in_house, logo_key, logo_url,
              logo_alt, logo_width, logo_height, sort_order
       FROM brands ORDER BY sort_order, name`,
    )
    .all<BrandRow>();

  return results.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline,
    description: row.description,
    confirmed: row.confirmed === 1,
    inHouse: row.in_house === 1,
    logo: toImage(row.logo_key, row.logo_url, row.logo_alt || `${row.name} logo`, row.logo_width, row.logo_height),
    order: row.sort_order,
  }));
}

export async function loadIndustries(db: D1Database): Promise<Industry[]> {
  const { results } = await db
    .prepare(
      `SELECT id, slug, title, label, summary, image_key, image_url, image_alt, image_width,
              image_height, show_on_home, sort_order
       FROM industries ORDER BY sort_order, title`,
    )
    .all<IndustryRow>();

  return results.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    label: row.label,
    summary: row.summary,
    image: toImage(row.image_key, row.image_url, row.image_alt || row.title, row.image_width, row.image_height),
    showOnHome: row.show_on_home === 1,
    order: row.sort_order,
  }));
}

async function loadSetting<T extends object>(db: D1Database, key: string, fallback: T): Promise<T> {
  const row = await db.prepare("SELECT value FROM settings WHERE key = ?1").bind(key).first<{ value: string }>();

  if (!row) return fallback;

  try {
    return { ...fallback, ...(JSON.parse(row.value) as Partial<T>) };
  } catch {
    return fallback;
  }
}

/** Public site facts (safe to send to the browser). */
export function loadSiteSettings(db: D1Database): Promise<SiteSettings> {
  return loadSetting(db, "site", defaultSiteSettings);
}

/** Server-only settings, e.g. the enquiry notification inbox. */
export function loadPrivateSettings(db: D1Database): Promise<PrivateSettings> {
  return loadSetting(db, "private", defaultPrivateSettings);
}
