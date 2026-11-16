import type { Brand, CatalogueNode, Industry, TreeCategory } from "./types";

/** Reads the public content API served by the Pages Functions (functions/api). */
async function get<T>(path: string): Promise<T> {
  const response = await fetch(path, { headers: { Accept: "application/json" } });

  if (response.status === 404) {
    throw new NotFoundError();
  }

  if (!response.ok) {
    throw new Error(`Content request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export class NotFoundError extends Error {
  constructor() {
    super("Not found");
  }
}

export const apiSource = {
  tree: async () => (await get<{ categories: TreeCategory[] }>("/api/tree")).categories,

  node: async (path: string): Promise<CatalogueNode | null> => {
    if (!path) return null;

    try {
      return await get<CatalogueNode>(`/api/node?path=${encodeURIComponent(path)}`);
    } catch (err) {
      if (err instanceof NotFoundError) return null;
      throw err;
    }
  },

  brands: async () => (await get<{ brands: Brand[] }>("/api/brands")).brands,

  industries: async () => (await get<{ industries: Industry[] }>("/api/industries")).industries,
};
