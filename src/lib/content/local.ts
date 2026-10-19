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
  Category,
  ContentImage,
  Industry,
  Product,
  ProductCard,
} from "./types";

// Builds the same shapes as the Sanity queries from the local starter catalogue.

function image(path: string, alt: string): ContentImage {
  return { src: publicAsset(path), alt };
}

function toCard(product: StarterProduct): ProductCard {
  const category = starterCategories.find(
    (item) => item.slug === product.category,
  );
  const brand = starterBrands.find((item) => item.slug === product.brand);

  return {
    id: `product-${product.slug}`,
    title: product.title,
    slug: product.slug,
    summary: product.summary,
    image: category ? image(category.image, product.title) : null,
    brand: brand ? { name: brand.name, slug: brand.slug } : null,
    category: {
      title: category?.title ?? "",
      slug: product.category,
    },
    isSample: true,
  };
}

function categoryBase(slug: string) {
  const index = starterCategories.findIndex((item) => item.slug === slug);
  const category = starterCategories[index];

  return {
    id: `category-${category.slug}`,
    title: category.title,
    slug: category.slug,
    eyebrow: category.eyebrow,
    summary: category.summary,
    image: image(category.image, `${category.title} products`),
    showOnHome: true,
    order: (index + 1) * 10,
  };
}

function productsIn(category: string) {
  return starterProducts.filter((product) => product.category === category);
}

export const localSource = {
  categories: (): Category[] =>
    starterCategories.map((category) => ({
      ...categoryBase(category.slug),
      products: productsIn(category.slug).map(toCard),
    })),

  category: (slug: string): Category | null => {
    if (!starterCategories.some((item) => item.slug === slug)) return null;

    return {
      ...categoryBase(slug),
      products: productsIn(slug).map(toCard),
    };
  },

  product: (category: string, slug: string): Product | null => {
    const product = starterProducts.find(
      (item) => item.slug === slug && item.category === category,
    );

    if (!product) return null;

    const card = toCard(product);

    return {
      ...card,
      images: card.image ? [card.image] : [],
      keyFeatures: [],
      description: [],
      specifications: [],
      variants: [],
      related: productsIn(category)
        .filter((item) => item.slug !== slug)
        .slice(0, 3)
        .map(toCard),
    };
  },

  brands: (): Brand[] =>
    starterBrands.map((brand, index) => ({
      id: `brand-${brand.slug}`,
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
      id: `industry-${industry.slug}`,
      title: industry.title,
      slug: industry.slug,
      label: industry.label,
      summary: industry.summary,
      image: image(industry.image, industry.title),
      showOnHome: true,
      order: (index + 1) * 10,
    })),
};
