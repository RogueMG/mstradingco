import { useCallback, useSyncExternalStore } from "react";

import { apiSource } from "./api";
import { localSource } from "./local";
import { invalidate, read, subscribe, type ContentResult } from "./store";
import type { Brand, CatalogueNode, Industry, TreeCategory } from "./types";

/*
 * Content comes from the Pages Functions API. Plain `npm run dev` (Vite only,
 * no Functions) sets VITE_CONTENT_SOURCE=local in .env.development and renders
 * the starter catalogue instead.
 */
const source = import.meta.env.VITE_CONTENT_SOURCE === "local" ? localSource : apiSource;

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

/** The whole category tree with product titles and paths. */
export function useTree() {
  return useContent<TreeCategory[]>("tree", () => source.tree());
}

/** A category or product by its path under /products ("" resolves to null). */
export function useNode(path: string) {
  return useContent<CatalogueNode | null>(`node:${path}`, () => (path ? source.node(path) : null));
}

export function useBrands() {
  return useContent<Brand[]>("brands", () => source.brands());
}

export function useIndustries() {
  return useContent<Industry[]>("industries", () => source.industries());
}
