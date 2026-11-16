import { useIndustries, useTree } from "../lib/content/hooks";
import { flattenTree } from "../lib/content/tree";

export interface InterestGroup {
  label: string;
  options: { value: string; label: string }[];
}

/**
 * Options for the enquiry "Product or industry" dropdown: every category (at
 * any depth) with its products, then the industries.
 */
export function useInterestOptions(): InterestGroup[] {
  const tree = useTree();
  const industries = useIndustries();

  const groups: InterestGroup[] =
    tree.status === "ready"
      ? flattenTree(tree.data).map(({ category, depth }) => ({
          label: `${"– ".repeat(depth)}${category.title}`,
          options: [
            { value: category.title, label: `Any ${category.title}` },
            ...category.products.map((product) => ({ value: product.title, label: product.title })),
          ],
        }))
      : [];

  if (industries.status === "ready" && industries.data.length > 0) {
    groups.push({
      label: "Industry",
      options: industries.data.map((industry) => ({
        value: `Industry: ${industry.title}`,
        label: industry.title,
      })),
    });
  }

  return groups;
}
