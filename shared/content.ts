/**
 * Shapes returned by the public content API (functions/api/*) and rendered by
 * the site. Paths are relative to /products, e.g. "body-ppe/gloves/nitrile".
 */

/** An image the site can render. Uploads also have a small `thumb` and their pixel size. */
export interface ContentImage {
  src: string | null;
  alt: string;
  thumb?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface BrandRef {
  name: string;
  slug: string;
}

/** One breadcrumb step. `path` is relative to /products ("" for /products itself). */
export interface Crumb {
  title: string;
  path: string;
}

export interface TreeProduct {
  title: string;
  slug: string;
  path: string;
}

/** A category in the tree, with its subcategories and its own products. */
export interface TreeCategory {
  id: number;
  slug: string;
  path: string;
  title: string;
  eyebrow: string;
  summary: string;
  image: ContentImage | null;
  showOnHome: boolean;
  order: number;
  children: TreeCategory[];
  products: TreeProduct[];
  /** Products in this category and every subcategory. */
  productCount: number;
}

export interface ProductCard {
  id: number;
  title: string;
  slug: string;
  path: string;
  summary: string;
  image: ContentImage | null;
  brand: BrandRef | null;
  category: { title: string; path: string };
  isSample: boolean;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product extends ProductCard {
  images: ContentImage[];
  keyFeatures: string[];
  /** Sanitised HTML: p, h3, ul/li, strong, em, br. */
  description: string;
  specifications: Specification[];
  variants: string[];
  related: ProductCard[];
  updatedAt: string;
}

/** A subcategory shown inside a category page. */
export interface CategorySummary {
  id: number;
  slug: string;
  path: string;
  title: string;
  eyebrow: string;
  summary: string;
  image: ContentImage | null;
  productCount: number;
}

export interface CategoryNode {
  kind: "category";
  category: CategorySummary;
  children: CategorySummary[];
  products: ProductCard[];
  breadcrumb: Crumb[];
}

export interface ProductNode {
  kind: "product";
  product: Product;
  breadcrumb: Crumb[];
}

export type CatalogueNode = CategoryNode | ProductNode;

export interface Brand {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  confirmed: boolean;
  inHouse: boolean;
  logo: ContentImage | null;
  order: number;
}

export interface Industry {
  id: number;
  title: string;
  slug: string;
  label: string;
  summary: string;
  image: ContentImage | null;
  showOnHome: boolean;
  order: number;
}
