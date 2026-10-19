/**
 * Writes sanity/seed.ndjson from the local starter catalogue.
 *
 *   npm run seed:build                 (node scripts/build-seed.ts)
 *   npm run seed --prefix studio       (imports it, skipping existing documents)
 *
 * Images are imported as links to the live site's copies, so nothing is
 * uploaded. Document IDs use dashes: Sanity hides IDs containing a dot from
 * public reads.
 */
import { writeFileSync } from "node:fs";

import {
  starterBrands,
  starterCategories,
  starterProducts,
} from "../src/data/catalogue.ts";

const LIVE_SITE = "https://roguemg.github.io/mstradingco";
const OUTPUT = new URL("../sanity/seed.ndjson", import.meta.url);

function link(path: string, alt: string) {
  return { _type: "mediaImage", url: `${LIVE_SITE}${path}`, alt };
}

function slug(current: string) {
  return { _type: "slug", current };
}

function ref(id: string) {
  return { _type: "reference", _ref: id };
}

const categories = starterCategories.map((category, index) => ({
  _id: `category-${category.slug}`,
  _type: "category",
  title: category.title,
  slug: slug(category.slug),
  eyebrow: category.eyebrow,
  summary: category.summary,
  image: link(category.image, `${category.title} products`),
  showOnHome: true,
  order: (index + 1) * 10,
}));

const brands = starterBrands.map((brand, index) => ({
  _id: `brand-${brand.slug}`,
  _type: "brand",
  name: brand.name,
  slug: slug(brand.slug),
  tagline: brand.tagline,
  confirmed: brand.confirmed,
  inHouse: false,
  logo: link(brand.logo, `${brand.name} logo`),
  order: (index + 1) * 10,
}));

const products = starterProducts.map((product) => {
  const category = starterCategories.find(
    (item) => item.slug === product.category,
  );

  if (!category) {
    throw new Error(`Unknown category "${product.category}" for ${product.slug}`);
  }

  if (product.brand && !starterBrands.some((item) => item.slug === product.brand)) {
    throw new Error(`Unknown brand "${product.brand}" for ${product.slug}`);
  }

  const position = starterProducts
    .filter((item) => item.category === product.category)
    .indexOf(product);

  return {
    _id: `product-${product.slug}`,
    _type: "product",
    title: product.title,
    slug: slug(product.slug),
    category: ref(`category-${product.category}`),
    ...(product.brand ? { brand: ref(`brand-${product.brand}`) } : {}),
    summary: product.summary,
    // Category image as a placeholder until product photography is supplied.
    images: [{ _key: "main", ...link(category.image, product.title) }],
    isSample: true,
    order: (position + 1) * 10,
  };
});

const documents = [...categories, ...brands, ...products];

const dotted = documents.filter((doc) => doc._id.includes("."));

if (dotted.length > 0) {
  throw new Error(`Document IDs must not contain dots: ${dotted.map((doc) => doc._id).join(", ")}`);
}

writeFileSync(OUTPUT, documents.map((doc) => JSON.stringify(doc)).join("\n") + "\n");

console.log(
  `Wrote ${documents.length} documents (${categories.length} categories, ${brands.length} brands, ${products.length} products) to sanity/seed.ndjson`,
);
