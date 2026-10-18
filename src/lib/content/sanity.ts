import { apiVersion, dataset, projectId } from "./config";
import {
  brandsQuery,
  categoriesQuery,
  categoryQuery,
  productQuery,
} from "./queries";
import type { Brand, Category, CategoryDetail, Product } from "./types";

type Params = Record<string, string | number | boolean>;

/**
 * Runs a GROQ query against the public dataset through the API CDN.
 * Plain fetch keeps @sanity/client out of the bundle; no token is ever sent.
 */
async function query<T>(groq: string, params: Params = {}): Promise<T> {
  const url = new URL(
    `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`,
  );

  url.searchParams.set("query", groq);

  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(`$${name}`, JSON.stringify(value));
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Content request failed (${response.status})`);
  }

  const body = (await response.json()) as { result: T };

  return body.result;
}

export const sanitySource = {
  categories: () => query<Category[]>(categoriesQuery),
  category: (slug: string) => query<CategoryDetail | null>(categoryQuery, { slug }),
  product: (category: string, slug: string) =>
    query<Product | null>(productQuery, { category, slug }),
  brands: () => query<Brand[]>(brandsQuery),
};
