import { useCallback, useSyncExternalStore } from "react";

import { cmsEnabled } from "./config";
import { localSource } from "./local";
import { sanitySource } from "./sanity";
import { invalidate, read, subscribe, type ContentResult } from "./store";
import type { Brand, Category, CategoryDetail, Product } from "./types";

const source = cmsEnabled ? sanitySource : localSource;

function useContent<T>(
  key: string,
  load: () => T | Promise<T>,
): ContentResult<T> & { retry: () => void } {
  // `load` changes every render; the cache key identifies the request.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getSnapshot = useCallback(() => read(key, load), [key]);
  const result = useSyncExternalStore(subscribe, getSnapshot);
  const retry = useCallback(() => invalidate(key), [key]);

  return { ...result, retry };
}

export function useCategories() {
  return useContent<Category[]>("categories", () => source.categories());
}

export function useCategory(slug: string) {
  return useContent<CategoryDetail | null>(`category:${slug}`, () =>
    source.category(slug),
  );
}

export function useProduct(category: string, slug: string) {
  return useContent<Product | null>(`product:${category}/${slug}`, () =>
    source.product(category, slug),
  );
}

export function useBrands() {
  return useContent<Brand[]>("brands", () => source.brands());
}
