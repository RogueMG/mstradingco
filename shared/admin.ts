/** Shapes exchanged between the admin UI and /api/admin/*. */

/** An image as stored: an R2 upload key or a URL, plus alt text and size. */
export interface AdminImage {
  key: string | null;
  url: string | null;
  alt: string;
  width: number | null;
  height: number | null;
}

export interface AdminCategory {
  id: number;
  parentId: number | null;
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  image: AdminImage | null;
  showOnHome: boolean;
  order: number;
  updatedAt: string;
}

export interface AdminProductListItem {
  id: number;
  categoryId: number;
  slug: string;
  title: string;
  published: boolean;
  isSample: boolean;
  order: number;
  thumb: string | null;
}

export interface AdminTree {
  categories: AdminCategory[];
  products: AdminProductListItem[];
}

export interface AdminProduct {
  id: number;
  categoryId: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  brandId: number | null;
  keyFeatures: string[];
  specifications: { label: string; value: string }[];
  variants: string[];
  isSample: boolean;
  published: boolean;
  order: number;
  images: AdminImage[];
  updatedAt: string;
}

export interface AdminBrand {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  confirmed: boolean;
  inHouse: boolean;
  logo: AdminImage | null;
  order: number;
}

export interface AdminIndustry {
  id: number;
  slug: string;
  title: string;
  label: string;
  summary: string;
  image: AdminImage | null;
  showOnHome: boolean;
  order: number;
}

export type EnquiryStatus = "new" | "read" | "archived";

export interface AdminEnquiry {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  sourcePage: string;
  status: EnquiryStatus;
  emailStatus: string;
  createdAt: string;
}

export interface UploadResult {
  key: string;
  width: number;
  height: number;
}

/** Where an image is displayed from: /media/<key> for uploads, else the URL. */
export function adminImageSrc(image: AdminImage | null | undefined, thumb = false): string | null {
  if (!image) return null;
  if (image.key) return `/media/${thumb ? image.key.replace(/\.webp$/, "-thumb.webp") : image.key}`;
  return image.url;
}
