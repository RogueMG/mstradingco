import type {
  AdminCategory,
  AdminImage,
  AdminProduct,
  AdminProductListItem,
  AdminTree,
} from "../../shared/admin";
import { isValidSlug } from "../../shared/slug";
import type { CategoryRow } from "../catalogue";
import type { Env } from "../env";
import { HttpError, nowIso } from "../http";
import { mediaUrl, thumbKey } from "../images";
import { sanitizeHtml } from "../sanitize";
import { Validator } from "../validate";
import { deleteUnreferencedUploads, nextOrder, parseImage, readImage, reorder } from "./common";

function rowImage(row: {
  image_key: string | null;
  image_url: string | null;
  image_alt: string;
  image_width: number | null;
  image_height: number | null;
}): AdminImage | null {
  if (!row.image_key && !row.image_url) return null;
  return {
    key: row.image_key,
    url: row.image_url,
    alt: row.image_alt,
    width: row.image_width,
    height: row.image_height,
  };
}

function toAdminCategory(row: CategoryRow): AdminCategory {
  return {
    id: row.id,
    parentId: row.parent_id,
    slug: row.slug,
    title: row.title,
    eyebrow: row.eyebrow,
    summary: row.summary,
    image: rowImage(row),
    showOnHome: row.show_on_home === 1,
    order: row.sort_order,
    updatedAt: row.updated_at,
  };
}

// ---------------------------------------------------------------- tree

export async function adminTree(env: Env): Promise<AdminTree> {
  const [categories, products] = await env.DB.batch([
    env.DB.prepare(
      `SELECT id, parent_id, slug, title, eyebrow, summary, image_key, image_url, image_alt,
              image_width, image_height, show_on_home, sort_order, updated_at
       FROM categories ORDER BY sort_order, title`,
    ),
    env.DB.prepare(
      `SELECT p.id, p.category_id, p.slug, p.title, p.published, p.is_sample, p.sort_order,
              (SELECT coalesce(i.image_key, i.image_url) FROM product_images i
               WHERE i.product_id = p.id ORDER BY i.sort_order, i.id LIMIT 1) AS first_image,
              (SELECT i.image_key FROM product_images i
               WHERE i.product_id = p.id ORDER BY i.sort_order, i.id LIMIT 1) AS first_key
       FROM products p ORDER BY p.sort_order, p.title`,
    ),
  ]);

  return {
    categories: ((categories.results ?? []) as unknown as CategoryRow[]).map(toAdminCategory),
    products: (
      (products.results ?? []) as unknown as {
        id: number;
        category_id: number;
        slug: string;
        title: string;
        published: number;
        is_sample: number;
        sort_order: number;
        first_image: string | null;
        first_key: string | null;
      }[]
    ).map(
      (row): AdminProductListItem => ({
        id: row.id,
        categoryId: row.category_id,
        slug: row.slug,
        title: row.title,
        published: row.published === 1,
        isSample: row.is_sample === 1,
        order: row.sort_order,
        thumb: row.first_key ? mediaUrl(thumbKey(row.first_key)) : row.first_image,
      }),
    ),
  };
}

// ---------------------------------------------------------------- path safety

/** A product slug must not equal a child category's slug in the same category, and vice versa. */
async function assertNoPathClash(
  db: D1Database,
  kind: "category" | "product",
  containerId: number | null,
  slug: string,
  selfId?: number,
): Promise<void> {
  if (containerId === null) return; // Top level has categories only.

  const clash =
    kind === "product"
      ? await db.prepare("SELECT id FROM categories WHERE parent_id = ?1 AND slug = ?2").bind(containerId, slug).first()
      : await db.prepare("SELECT id FROM products WHERE category_id = ?1 AND slug = ?2").bind(containerId, slug).first();

  if (clash) {
    throw new HttpError(
      409,
      kind === "product"
        ? "A subcategory here already uses that slug. Choose a different slug so the web address is unique."
        : "A product here already uses that slug. Choose a different slug so the web address is unique.",
      { slug: "Already used by a " + (kind === "product" ? "subcategory" : "product") + " in this category." },
    );
  }

  const sibling =
    kind === "product"
      ? await db
          .prepare("SELECT id FROM products WHERE category_id = ?1 AND slug = ?2 AND id <> ?3")
          .bind(containerId, slug, selfId ?? 0)
          .first()
      : null;

  if (sibling) {
    throw new HttpError(409, "Another product in this category already uses that slug.", {
      slug: "Already used in this category.",
    });
  }
}

/** Refuses to move a category under itself or one of its descendants. */
async function assertNoCycle(db: D1Database, categoryId: number, newParentId: number | null): Promise<void> {
  let current = newParentId;
  const seen = new Set<number>();

  while (current !== null) {
    if (current === categoryId) {
      throw new HttpError(400, "A category can't be moved inside itself or one of its own subcategories.", {
        parentId: "Choose a different parent.",
      });
    }
    if (seen.has(current)) break;
    seen.add(current);

    const row = await db.prepare("SELECT parent_id FROM categories WHERE id = ?1").bind(current).first<{ parent_id: number | null }>();
    if (!row) throw new HttpError(400, "That parent category doesn't exist.", { parentId: "Not found." });
    current = row.parent_id;
  }
}

// ---------------------------------------------------------------- categories

async function readCategoryInput(env: Env, body: unknown, partial: boolean) {
  const check = new Validator(body);
  const title = check.string("title", { required: !partial || check.has("title"), max: 120, label: "Title" });
  const slug = check.string("slug", { required: !partial || check.has("slug"), max: 80, label: "Slug" });

  if (slug && !isValidSlug(slug)) check.issues.slug = "Use lowercase letters, numbers and dashes only.";

  const input = {
    title,
    slug,
    eyebrow: check.string("eyebrow", { max: 60, label: "Short label" }),
    summary: check.string("summary", { max: 300, label: "Summary" }),
    image: await readImage(env, check, "image", { required: !partial, label: "Image" }),
    showOnHome: check.boolean("showOnHome", true),
    parentId: check.integer("parentId", { nullable: true, min: 1 }),
  };

  check.done();
  return { input, check };
}

export async function createCategory(env: Env, body: unknown): Promise<AdminCategory> {
  const { input } = await readCategoryInput(env, body, false);

  if (input.parentId !== null) {
    const parent = await env.DB.prepare("SELECT id FROM categories WHERE id = ?1").bind(input.parentId).first();
    if (!parent) throw new HttpError(400, "That parent category doesn't exist.", { parentId: "Not found." });
  }

  await assertNoPathClash(env.DB, "category", input.parentId, input.slug);

  const order = await nextOrder(
    env.DB,
    "SELECT max(sort_order) AS max_order FROM categories WHERE ifnull(parent_id, 0) = ?1",
    input.parentId ?? 0,
  );

  const row = await env.DB.prepare(
    `INSERT INTO categories (parent_id, slug, title, eyebrow, summary, image_key, image_url, image_alt,
                             image_width, image_height, show_on_home, sort_order)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
     RETURNING id, parent_id, slug, title, eyebrow, summary, image_key, image_url, image_alt,
               image_width, image_height, show_on_home, sort_order, updated_at`,
  )
    .bind(
      input.parentId,
      input.slug,
      input.title,
      input.eyebrow,
      input.summary,
      input.image?.key ?? null,
      input.image?.url ?? null,
      input.image?.alt ?? "",
      input.image?.width ?? null,
      input.image?.height ?? null,
      input.showOnHome ? 1 : 0,
      order,
    )
    .first<CategoryRow>();

  return toAdminCategory(row!);
}

export async function updateCategory(env: Env, id: number, body: unknown): Promise<AdminCategory> {
  const existing = await env.DB.prepare(
    `SELECT id, parent_id, slug, title, eyebrow, summary, image_key, image_url, image_alt,
            image_width, image_height, show_on_home, sort_order, updated_at
     FROM categories WHERE id = ?1`,
  )
    .bind(id)
    .first<CategoryRow>();

  if (!existing) throw new HttpError(404, "Category not found.");

  const { input, check } = await readCategoryInput(env, body, true);
  const moving = check.has("parentId") && input.parentId !== existing.parent_id;
  const parentId = check.has("parentId") ? input.parentId : existing.parent_id;
  const slug = check.has("slug") ? input.slug : existing.slug;

  if (moving) await assertNoCycle(env.DB, id, parentId);
  if (moving || slug !== existing.slug) await assertNoPathClash(env.DB, "category", parentId, slug);

  const image = check.has("image") ? input.image : rowImage(existing);
  const order = moving
    ? await nextOrder(env.DB, "SELECT max(sort_order) AS max_order FROM categories WHERE ifnull(parent_id, 0) = ?1", parentId ?? 0)
    : existing.sort_order;

  const row = await env.DB.prepare(
    `UPDATE categories SET parent_id = ?1, slug = ?2, title = ?3, eyebrow = ?4, summary = ?5,
            image_key = ?6, image_url = ?7, image_alt = ?8, image_width = ?9, image_height = ?10,
            show_on_home = ?11, sort_order = ?12, updated_at = ?13
     WHERE id = ?14
     RETURNING id, parent_id, slug, title, eyebrow, summary, image_key, image_url, image_alt,
               image_width, image_height, show_on_home, sort_order, updated_at`,
  )
    .bind(
      parentId,
      slug,
      check.has("title") ? input.title : existing.title,
      check.has("eyebrow") ? input.eyebrow : existing.eyebrow,
      check.has("summary") ? input.summary : existing.summary,
      image?.key ?? null,
      image?.url ?? null,
      image?.alt ?? "",
      image?.width ?? null,
      image?.height ?? null,
      (check.has("showOnHome") ? input.showOnHome : existing.show_on_home === 1) ? 1 : 0,
      order,
      nowIso(),
      id,
    )
    .first<CategoryRow>();

  if (existing.image_key && existing.image_key !== image?.key) {
    await deleteUnreferencedUploads(env, [existing.image_key]);
  }

  return toAdminCategory(row!);
}

export async function deleteCategory(env: Env, id: number): Promise<void> {
  const row = await env.DB.prepare(
    `SELECT image_key,
            (SELECT count(*) FROM categories WHERE parent_id = ?1) AS children,
            (SELECT count(*) FROM products WHERE category_id = ?1) AS products
     FROM categories WHERE id = ?1`,
  )
    .bind(id)
    .first<{ image_key: string | null; children: number; products: number }>();

  if (!row) throw new HttpError(404, "Category not found.");

  if (row.children > 0 || row.products > 0) {
    throw new HttpError(409, "Only empty categories can be deleted. Move or delete its subcategories and products first.");
  }

  await env.DB.prepare("DELETE FROM categories WHERE id = ?1").bind(id).run();
  await deleteUnreferencedUploads(env, [row.image_key]);
}

export async function reorderCategories(env: Env, body: unknown): Promise<void> {
  const check = new Validator(body);
  const parentId = check.integer("parentId", { nullable: true, min: 1 });
  check.done();

  const { results } = await env.DB.prepare("SELECT id FROM categories WHERE ifnull(parent_id, 0) = ?1")
    .bind(parentId ?? 0)
    .all<{ id: number }>();

  await reorder(env.DB, "categories", check.raw("ids"), results.map((row) => row.id));
}

// ---------------------------------------------------------------- products

interface ProductRow {
  id: number;
  category_id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  brand_id: number | null;
  key_features: string;
  specifications: string;
  variants: string;
  is_sample: number;
  published: number;
  sort_order: number;
  updated_at: string;
}

const PRODUCT_COLUMNS = `id, category_id, slug, title, summary, description, brand_id, key_features,
  specifications, variants, is_sample, published, sort_order, updated_at`;

function parseList<T>(text: string): T[] {
  try {
    const value = JSON.parse(text);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export async function getProduct(env: Env, id: number): Promise<AdminProduct> {
  const row = await env.DB.prepare(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = ?1`).bind(id).first<ProductRow>();
  if (!row) throw new HttpError(404, "Product not found.");

  const { results } = await env.DB.prepare(
    "SELECT image_key, image_url, alt, width, height FROM product_images WHERE product_id = ?1 ORDER BY sort_order, id",
  )
    .bind(id)
    .all<{ image_key: string | null; image_url: string | null; alt: string; width: number | null; height: number | null }>();

  return {
    id: row.id,
    categoryId: row.category_id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    brandId: row.brand_id,
    keyFeatures: parseList<string>(row.key_features),
    specifications: parseList<{ label: string; value: string }>(row.specifications),
    variants: parseList<string>(row.variants),
    isSample: row.is_sample === 1,
    published: row.published === 1,
    order: row.sort_order,
    images: results.map((image) => ({
      key: image.image_key,
      url: image.image_url,
      alt: image.alt,
      width: image.width,
      height: image.height,
    })),
    updatedAt: row.updated_at,
  };
}

async function readProductInput(env: Env, body: unknown) {
  const check = new Validator(body);

  const input = {
    categoryId: check.integer("categoryId", { required: true, min: 1 }),
    title: check.string("title", { required: true, max: 160, label: "Title" }),
    slug: check.string("slug", { required: true, max: 80, label: "Slug" }),
    summary: check.string("summary", { max: 400, label: "Summary" }),
    description: check.string("description", { max: 30_000, label: "Description" }),
    brandId: check.integer("brandId", { nullable: true, min: 1 }),
    keyFeatures: check.stringArray("keyFeatures", { maxItems: 30, maxLength: 200 }),
    variants: check.stringArray("variants", { maxItems: 60, maxLength: 60 }),
    isSample: check.boolean("isSample", false),
    published: check.boolean("published", true),
    specifications: [] as { label: string; value: string }[],
    images: [] as AdminImage[],
  };

  if (input.slug && !isValidSlug(input.slug)) check.issues.slug = "Use lowercase letters, numbers and dashes only.";

  const specs = check.raw("specifications");
  if (specs !== undefined) {
    if (!Array.isArray(specs) || specs.length > 60) {
      check.issues.specifications = "Specifications must be a list of up to 60 rows.";
    } else {
      for (const spec of specs) {
        const label = typeof spec?.label === "string" ? spec.label.trim() : "";
        const value = typeof spec?.value === "string" ? spec.value.trim() : "";
        if (!label && !value) continue;
        if (!label || !value || label.length > 80 || value.length > 300) {
          check.issues.specifications = "Each specification needs a label (max 80) and a value (max 300).";
          break;
        }
        input.specifications.push({ label, value });
      }
    }
  }

  const images = check.raw("images");
  if (!Array.isArray(images) || images.length === 0 || images.length > 20) {
    check.issues.images = "Add at least one image (up to 20). The first image is the main one.";
  } else {
    for (let index = 0; index < images.length; index++) {
      const image = await parseImage(env, images[index], "images", `Image ${index + 1}`, check.issues);
      if (image) input.images.push(image);
    }
  }

  check.done();

  const category = await env.DB.prepare("SELECT id FROM categories WHERE id = ?1").bind(input.categoryId).first();
  if (!category) throw new HttpError(400, "That category doesn't exist.", { categoryId: "Not found." });

  if (input.brandId !== null) {
    const brand = await env.DB.prepare("SELECT id FROM brands WHERE id = ?1").bind(input.brandId).first();
    if (!brand) throw new HttpError(400, "That brand doesn't exist.", { brandId: "Not found." });
  }

  input.description = await sanitizeHtml(input.description);

  return input as typeof input & { categoryId: number };
}

function imageStatements(db: D1Database, productId: number, images: AdminImage[]) {
  return [
    db.prepare("DELETE FROM product_images WHERE product_id = ?1").bind(productId),
    ...images.map((image, index) =>
      db
        .prepare(
          `INSERT INTO product_images (product_id, image_key, image_url, alt, width, height, sort_order)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`,
        )
        .bind(productId, image.key, image.url, image.alt, image.width, image.height, index),
    ),
  ];
}

export async function createProduct(env: Env, body: unknown): Promise<AdminProduct> {
  const input = await readProductInput(env, body);
  await assertNoPathClash(env.DB, "product", input.categoryId, input.slug);

  const order = await nextOrder(env.DB, "SELECT max(sort_order) AS max_order FROM products WHERE category_id = ?1", input.categoryId);

  const row = await env.DB.prepare(
    `INSERT INTO products (category_id, slug, title, summary, description, brand_id, key_features,
                           specifications, variants, is_sample, published, sort_order)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12) RETURNING id`,
  )
    .bind(
      input.categoryId,
      input.slug,
      input.title,
      input.summary,
      input.description,
      input.brandId,
      JSON.stringify(input.keyFeatures),
      JSON.stringify(input.specifications),
      JSON.stringify(input.variants),
      input.isSample ? 1 : 0,
      input.published ? 1 : 0,
      order,
    )
    .first<{ id: number }>();

  await env.DB.batch(imageStatements(env.DB, row!.id, input.images).slice(1));
  return getProduct(env, row!.id);
}

export async function updateProduct(env: Env, id: number, body: unknown): Promise<AdminProduct> {
  const existing = await getProduct(env, id);
  const input = await readProductInput(env, body);

  const moving = input.categoryId !== existing.categoryId;
  if (moving || input.slug !== existing.slug) {
    await assertNoPathClash(env.DB, "product", input.categoryId, input.slug, id);
  }

  const order = moving
    ? await nextOrder(env.DB, "SELECT max(sort_order) AS max_order FROM products WHERE category_id = ?1", input.categoryId)
    : existing.order;

  await env.DB.batch([
    env.DB.prepare(
      `UPDATE products SET category_id = ?1, slug = ?2, title = ?3, summary = ?4, description = ?5,
              brand_id = ?6, key_features = ?7, specifications = ?8, variants = ?9, is_sample = ?10,
              published = ?11, sort_order = ?12, updated_at = ?13
       WHERE id = ?14`,
    ).bind(
      input.categoryId,
      input.slug,
      input.title,
      input.summary,
      input.description,
      input.brandId,
      JSON.stringify(input.keyFeatures),
      JSON.stringify(input.specifications),
      JSON.stringify(input.variants),
      input.isSample ? 1 : 0,
      input.published ? 1 : 0,
      order,
      nowIso(),
      id,
    ),
    ...imageStatements(env.DB, id, input.images),
  ]);

  const kept = new Set(input.images.map((image) => image.key));
  await deleteUnreferencedUploads(
    env,
    existing.images.map((image) => image.key).filter((key) => key && !kept.has(key)),
  );

  return getProduct(env, id);
}

/** Publish/unpublish without re-sending the whole product. */
export async function setPublished(env: Env, id: number, body: unknown): Promise<void> {
  const check = new Validator(body);
  const published = check.boolean("published", true);
  check.done();

  const result = await env.DB.prepare("UPDATE products SET published = ?1, updated_at = ?2 WHERE id = ?3")
    .bind(published ? 1 : 0, nowIso(), id)
    .run();

  if (!result.meta.changes) throw new HttpError(404, "Product not found.");
}

export async function deleteProduct(env: Env, id: number): Promise<void> {
  const existing = await getProduct(env, id);
  await env.DB.prepare("DELETE FROM products WHERE id = ?1").bind(id).run();
  await deleteUnreferencedUploads(env, existing.images.map((image) => image.key));
}

export async function reorderProducts(env: Env, body: unknown): Promise<void> {
  const check = new Validator(body);
  const categoryId = check.integer("categoryId", { required: true, min: 1 });
  check.done();

  const { results } = await env.DB.prepare("SELECT id FROM products WHERE category_id = ?1").bind(categoryId).all<{ id: number }>();
  await reorder(env.DB, "products", check.raw("ids"), results.map((row) => row.id));
}
