/**
 * Reads the catalogue from D1 and shapes it for the public API, the SEO
 * middleware and the sitemap. Prepared statements only.
 */
import type {
  CatalogueNode,
  CategorySummary,
  Crumb,
  Product,
  ProductCard,
  TreeCategory,
} from "../shared/content";
import { toImage } from "./images";

export interface CategoryRow {
  id: number;
  parent_id: number | null;
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  image_key: string | null;
  image_url: string | null;
  image_alt: string;
  image_width: number | null;
  image_height: number | null;
  show_on_home: number;
  sort_order: number;
  updated_at: string;
}

interface ProductLinkRow {
  id: number;
  category_id: number;
  slug: string;
  title: string;
  published: number;
  updated_at: string;
}

interface ProductCardRow {
  id: number;
  category_id: number;
  slug: string;
  title: string;
  summary: string;
  is_sample: number;
  brand_name: string | null;
  brand_slug: string | null;
  image_key: string | null;
  image_url: string | null;
  image_alt: string | null;
  image_width: number | null;
  image_height: number | null;
}

interface ProductRow extends ProductCardRow {
  description: string;
  key_features: string;
  specifications: string;
  variants: string;
  updated_at: string;
}

interface ProductImageRow {
  image_key: string | null;
  image_url: string | null;
  alt: string;
  width: number | null;
  height: number | null;
}

/** A tree node with database ids and an index for path lookups. */
export interface Tree {
  roots: TreeCategory[];
  byId: Map<number, TreeCategory & { parentId: number | null; updatedAt: string }>;
  products: ProductLinkRow[];
}

const CATEGORY_COLUMNS = `id, parent_id, slug, title, eyebrow, summary, image_key, image_url, image_alt,
  image_width, image_height, show_on_home, sort_order, updated_at`;

const CARD_SELECT = `
  SELECT p.id, p.category_id, p.slug, p.title, p.summary, p.is_sample,
         b.name AS brand_name, b.slug AS brand_slug,
         i.image_key, i.image_url, i.alt AS image_alt, i.width AS image_width, i.height AS image_height
  FROM products p
  LEFT JOIN brands b ON b.id = p.brand_id
  LEFT JOIN product_images i ON i.id = (
    SELECT id FROM product_images WHERE product_id = p.id ORDER BY sort_order, id LIMIT 1
  )`;

function parseJsonArray<T>(text: string): T[] {
  try {
    const value = JSON.parse(text);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

/**
 * Loads every category plus product links and builds the nested tree.
 * `includeUnpublished` is for the admin.
 */
export async function loadTree(db: D1Database, includeUnpublished = false): Promise<Tree> {
  const [categories, products] = await db.batch([
    db.prepare(`SELECT ${CATEGORY_COLUMNS} FROM categories ORDER BY sort_order, title`),
    db.prepare(
      `SELECT id, category_id, slug, title, published, updated_at FROM products
       WHERE published = 1 OR ?1 = 1 ORDER BY sort_order, title`,
    ).bind(includeUnpublished ? 1 : 0),
  ]);

  const categoryRows = (categories.results ?? []) as unknown as CategoryRow[];
  const productRows = (products.results ?? []) as unknown as ProductLinkRow[];

  const byId: Tree["byId"] = new Map();

  for (const row of categoryRows) {
    byId.set(row.id, {
      id: row.id,
      slug: row.slug,
      path: "",
      title: row.title,
      eyebrow: row.eyebrow,
      summary: row.summary,
      image: toImage(row.image_key, row.image_url, row.image_alt, row.image_width, row.image_height),
      showOnHome: row.show_on_home === 1,
      order: row.sort_order,
      children: [],
      products: [],
      productCount: 0,
      parentId: row.parent_id,
      updatedAt: row.updated_at,
    });
  }

  const roots: TreeCategory[] = [];

  for (const node of byId.values()) {
    const parent = node.parentId != null ? byId.get(node.parentId) : undefined;
    (parent ? parent.children : roots).push(node);
  }

  // Paths are assigned top-down; a cycle (shouldn't happen, the API prevents it)
  // would leave nodes unreachable from the roots rather than loop forever.
  const assign = (nodes: TreeCategory[], prefix: string) => {
    for (const node of nodes) {
      node.path = prefix ? `${prefix}/${node.slug}` : node.slug;
      assign(node.children, node.path);
    }
  };
  assign(roots, "");

  for (const product of productRows) {
    const category = byId.get(product.category_id);
    if (!category || !category.path) continue;
    category.products.push({
      title: product.title,
      slug: product.slug,
      path: `${category.path}/${product.slug}`,
    });
  }

  const count = (node: TreeCategory): number => {
    node.productCount = node.products.length + node.children.reduce((sum, child) => sum + count(child), 0);
    return node.productCount;
  };
  roots.forEach(count);

  return { roots, byId, products: productRows };
}

/** Strips internal fields so the tree can be sent to the browser. */
export function publicTree(nodes: TreeCategory[]): TreeCategory[] {
  return nodes.map((node) => ({
    id: node.id,
    slug: node.slug,
    path: node.path,
    title: node.title,
    eyebrow: node.eyebrow,
    summary: node.summary,
    image: node.image,
    showOnHome: node.showOnHome,
    order: node.order,
    children: publicTree(node.children),
    products: node.products,
    productCount: node.productCount,
  }));
}

function summary(node: TreeCategory): CategorySummary {
  return {
    id: node.id,
    slug: node.slug,
    path: node.path,
    title: node.title,
    eyebrow: node.eyebrow,
    summary: node.summary,
    image: node.image,
    productCount: node.productCount,
  };
}

function toCard(row: ProductCardRow, tree: Tree): ProductCard | null {
  const category = tree.byId.get(row.category_id);
  if (!category?.path) return null;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    path: `${category.path}/${row.slug}`,
    summary: row.summary,
    image: toImage(row.image_key, row.image_url, row.image_alt || row.title, row.image_width, row.image_height),
    brand: row.brand_name && row.brand_slug ? { name: row.brand_name, slug: row.brand_slug } : null,
    category: { title: category.title, path: category.path },
    isSample: row.is_sample === 1,
  };
}

/** Breadcrumb from the top level down to (and including) the given category. */
export function breadcrumbFor(tree: Tree, categoryId: number): Crumb[] {
  const crumbs: Crumb[] = [];
  const seen = new Set<number>();
  let node = tree.byId.get(categoryId);

  while (node && !seen.has(node.id)) {
    seen.add(node.id);
    crumbs.unshift({ title: node.title, path: node.path });
    node = node.parentId != null ? tree.byId.get(node.parentId) : undefined;
  }

  return crumbs;
}

/** Resolves "a/b/c" to a category or a product. Returns null when nothing matches. */
export async function resolveNode(db: D1Database, tree: Tree, path: string): Promise<CatalogueNode | null> {
  const segments = path.split("/").map((part) => part.trim()).filter(Boolean);
  if (segments.length === 0) return null;

  let siblings = tree.roots;
  let current: TreeCategory | undefined;

  for (let index = 0; index < segments.length; index++) {
    const segment = segments[index];
    const category = siblings.find((node) => node.slug === segment);

    if (category) {
      current = category;
      siblings = category.children;
      continue;
    }

    // Not a category: only the last segment may be a product of the current category.
    if (index === segments.length - 1 && current) {
      const product = await loadProduct(db, tree, current.id, segment);
      return product
        ? { kind: "product", product, breadcrumb: breadcrumbFor(tree, current.id) }
        : null;
    }

    return null;
  }

  if (!current) return null;

  const { results } = await db
    .prepare(`${CARD_SELECT} WHERE p.category_id = ?1 AND p.published = 1 ORDER BY p.sort_order, p.title`)
    .bind(current.id)
    .all<ProductCardRow>();

  return {
    kind: "category",
    category: summary(current),
    children: current.children.map(summary),
    products: results.map((row) => toCard(row, tree)).filter((card): card is ProductCard => card !== null),
    breadcrumb: breadcrumbFor(tree, current.id),
  };
}

async function loadProduct(db: D1Database, tree: Tree, categoryId: number, slug: string): Promise<Product | null> {
  const row = await db
    .prepare(
      `SELECT p.id, p.category_id, p.slug, p.title, p.summary, p.is_sample, p.description,
              p.key_features, p.specifications, p.variants, p.updated_at,
              b.name AS brand_name, b.slug AS brand_slug,
              NULL AS image_key, NULL AS image_url, NULL AS image_alt, NULL AS image_width, NULL AS image_height
       FROM products p LEFT JOIN brands b ON b.id = p.brand_id
       WHERE p.category_id = ?1 AND p.slug = ?2 AND p.published = 1`,
    )
    .bind(categoryId, slug)
    .first<ProductRow>();

  if (!row) return null;

  const [images, related] = await db.batch([
    db
      .prepare(
        `SELECT image_key, image_url, alt, width, height FROM product_images
         WHERE product_id = ?1 ORDER BY sort_order, id`,
      )
      .bind(row.id),
    db
      .prepare(
        `${CARD_SELECT} WHERE p.category_id = ?1 AND p.id <> ?2 AND p.published = 1
         ORDER BY p.sort_order, p.title LIMIT 3`,
      )
      .bind(categoryId, row.id),
  ]);

  const imageList = ((images.results ?? []) as unknown as ProductImageRow[])
    .map((image) => toImage(image.image_key, image.image_url, image.alt || row.title, image.width, image.height))
    .filter((image) => image !== null);

  const card = toCard({ ...row, ...firstImageColumns(imageList[0] ?? null) }, tree);
  if (!card) return null;

  card.image = imageList[0] ?? null;

  return {
    ...card,
    images: imageList,
    keyFeatures: parseJsonArray<string>(row.key_features),
    description: row.description,
    specifications: parseJsonArray<{ label: string; value: string }>(row.specifications),
    variants: parseJsonArray<string>(row.variants),
    related: ((related.results ?? []) as unknown as ProductCardRow[])
      .map((item) => toCard(item, tree))
      .filter((item): item is ProductCard => item !== null),
    updatedAt: row.updated_at,
  };
}

function firstImageColumns(image: ReturnType<typeof toImage>) {
  return {
    image_key: null,
    image_url: image?.src ?? null,
    image_alt: image?.alt ?? null,
    image_width: image?.width ?? null,
    image_height: image?.height ?? null,
  };
}
