import type { PortableTextBlock } from "@portabletext/react";

/** An image the site can render. `src` is null when an image has no upload or link. */
export interface ContentImage {
  src: string | null;
  alt: string;
}

export interface LinkRef {
  title: string;
  slug: string;
}

export interface BrandRef {
  name: string;
  slug: string;
}

interface CategoryBase {
  id: string;
  title: string;
  slug: string;
  eyebrow: string;
  summary: string;
  image: ContentImage | null;
  showOnHome: boolean;
  order: number;
}

/** A category with its product cards. */
export interface Category extends CategoryBase {
  products: ProductCard[];
}

export interface ProductCard {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: ContentImage | null;
  brand: BrandRef | null;
  category: LinkRef;
  isSample: boolean;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product extends ProductCard {
  images: ContentImage[];
  keyFeatures: string[];
  description: PortableTextBlock[];
  specifications: Specification[];
  variants: string[];
  related: ProductCard[];
}

export interface Brand {
  id: string;
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
  id: string;
  title: string;
  slug: string;
  label: string;
  summary: string;
  image: ContentImage | null;
  showOnHome: boolean;
  order: number;
}
