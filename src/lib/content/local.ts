import {
  starterBrands,
  starterCategories,
  starterIndustries,
  starterProducts,
  type StarterProduct,
} from "../../data/catalogue";
import { publicAsset } from "../publicAsset";
import type {
  Brand,
  CatalogueNode,
  CategorySummary,
  ContentImage,
  Industry,
  ProductCard,
  TreeCategory,
} from "./types";

/*
 * Builds the same shapes as the content API from the local starter catalogue.
 * Used by `npm run dev` (no Functions running); the starter data is flat, so
 * every category is top-level.
 */

function image(path: string, alt: string): ContentImage {
  return { src: publicAsset(path), alt };
}

const categoryId = (slug: string) => starterCategories.findIndex((item) => item.slug === slug) + 1;
const productId = (product: StarterProduct) => starterProducts.indexOf(product) + 1;

function productsIn(category: string) {
  return starterProducts.filter((product) => product.category === category);
}

function toCard(product: StarterProduct): ProductCard {
  const category = starterCategories.find((item) => item.slug === product.category);
  const brand = starterBrands.find((item) => item.slug === product.brand);

  return {
    id: productId(product),
    title: product.title,
    slug: product.slug,
    path: `${product.category}/${product.slug}`,
    summary: product.summary,
    image: category ? image(category.image, product.title) : null,
    brand: brand ? { name: brand.name, slug: brand.slug } : null,
    category: { title: category?.title ?? "", path: product.category },
    isSample: true,
  };
}

function summary(slug: string): CategorySummary {
  const category = starterCategories.find((item) => item.slug === slug)!;

  return {
    id: categoryId(slug),
    slug,
    path: slug,
    title: category.title,
    eyebrow: category.eyebrow,
    summary: category.summary,
    image: image(category.image, `${category.title} products`),
    productCount: productsIn(slug).length,
  };
}

export const localSource = {
  tree: (): TreeCategory[] =>
    starterCategories.map((category, index) => ({
      ...summary(category.slug),
      showOnHome: true,
      order: (index + 1) * 10,
      children: [],
      products: productsIn(category.slug).map((product) => ({
        title: product.title,
        slug: product.slug,
        path: `${category.slug}/${product.slug}`,
      })),
    })),

  node: (path: string): CatalogueNode | null => {
    const [categorySlug, productSlug, ...rest] = path.split("/").filter(Boolean);
    const category = starterCategories.find((item) => item.slug === categorySlug);

    if (!category || rest.length > 0) return null;

    const breadcrumb = [{ title: category.title, path: category.slug }];

    if (!productSlug) {
      return {
        kind: "category",
        category: summary(category.slug),
        children: [],
        products: productsIn(category.slug).map(toCard),
        breadcrumb,
      };
    }

    const product = productsIn(category.slug).find((item) => item.slug === productSlug);
    if (!product) return null;

    const card = toCard(product);

    return {
      kind: "product",
      breadcrumb,
      product: {
        ...card,
        images: card.image ? [card.image] : [],
        keyFeatures: [],
        description: "",
        specifications: [],
        variants: [],
        related: productsIn(category.slug)
          .filter((item) => item.slug !== productSlug)
          .slice(0, 3)
          .map(toCard),
        updatedAt: "",
      },
    };
  },

  brands: (): Brand[] =>
    starterBrands.map((brand, index) => ({
      id: index + 1,
      name: brand.name,
      slug: brand.slug,
      tagline: brand.tagline,
      description: brand.description,
      confirmed: brand.confirmed,
      inHouse: false,
      logo: image(brand.logo, `${brand.name} logo`),
      order: (index + 1) * 10,
    })),

  industries: (): Industry[] =>
    starterIndustries.map((industry, index) => ({
      id: index + 1,
      title: industry.title,
      slug: industry.slug,
      label: industry.label,
      summary: industry.summary,
      image: image(industry.image, industry.title),
      showOnHome: true,
      order: (index + 1) * 10,
    })),
};
