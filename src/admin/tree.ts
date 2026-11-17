import type { AdminCategory, AdminProductListItem, AdminTree } from "../../shared/admin";

export interface CategoryIndex {
  children: Map<number | null, AdminCategory[]>;
  products: Map<number, AdminProductListItem[]>;
  byId: Map<number, AdminCategory>;
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export function indexTree(tree: AdminTree): CategoryIndex {
  const children = new Map<number | null, AdminCategory[]>();
  const products = new Map<number, AdminProductListItem[]>();
  const byId = new Map<number, AdminCategory>();

  for (const category of tree.categories) {
    byId.set(category.id, category);
    const list = children.get(category.parentId) ?? [];
    list.push(category);
    children.set(category.parentId, list);
  }

  for (const product of tree.products) {
    const list = products.get(product.categoryId) ?? [];
    list.push(product);
    products.set(product.categoryId, list);
  }

  children.forEach((list) => list.sort(byOrder));
  products.forEach((list) => list.sort(byOrder));

  return { children, products, byId };
}

/** Every category depth-first with its depth, for indented dropdowns. */
export function flattenCategories(index: CategoryIndex, parentId: number | null = null, depth = 0) {
  const out: { category: AdminCategory; depth: number }[] = [];
  for (const category of index.children.get(parentId) ?? []) {
    out.push({ category, depth });
    out.push(...flattenCategories(index, category.id, depth + 1));
  }
  return out;
}

/** The category and all of its descendants (they can't become its parent). */
export function selfAndDescendants(index: CategoryIndex, id: number): Set<number> {
  const result = new Set<number>([id]);
  const stack = [id];
  while (stack.length) {
    const current = stack.pop()!;
    for (const child of index.children.get(current) ?? []) {
      if (!result.has(child.id)) {
        result.add(child.id);
        stack.push(child.id);
      }
    }
  }
  return result;
}

/** "/products/a/b" path of a category, for "View on site" links. */
export function categoryPath(index: CategoryIndex, id: number): string {
  const parts: string[] = [];
  const seen = new Set<number>();
  let current = index.byId.get(id);
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    parts.unshift(current.slug);
    current = current.parentId != null ? index.byId.get(current.parentId) : undefined;
  }
  return parts.join("/");
}

export function moveInList(ids: number[], id: number, delta: -1 | 1): number[] | null {
  const from = ids.indexOf(id);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= ids.length) return null;
  const next = [...ids];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}
