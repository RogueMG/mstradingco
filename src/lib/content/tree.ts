import type { TreeCategory, TreeProduct } from "./types";

/** Every category in the tree, depth-first, with its depth (0 = top level). */
export function flattenTree(
  nodes: TreeCategory[],
  depth = 0,
  out: { category: TreeCategory; depth: number }[] = [],
) {
  for (const category of nodes) {
    out.push({ category, depth });
    flattenTree(category.children, depth + 1, out);
  }

  return out;
}

/** What a /products/<path> URL points at, according to the tree. */
export function classifyPath(
  tree: TreeCategory[],
  path: string,
): { kind: "category"; category: TreeCategory } | { kind: "product"; product: TreeProduct } | null {
  for (const { category } of flattenTree(tree)) {
    if (category.path === path) return { kind: "category", category };

    const product = category.products.find((item) => item.path === path);
    if (product) return { kind: "product", product };
  }

  return null;
}

/** True when the category, a descendant, or one of their products matches the search text. */
export function categoryMatches(category: TreeCategory, query: string): boolean {
  const text = [category.title, category.eyebrow, category.summary, ...category.products.map((item) => item.title)]
    .join(" ")
    .toLowerCase();

  return text.includes(query) || category.children.some((child) => categoryMatches(child, query));
}
