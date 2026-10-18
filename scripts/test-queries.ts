/**
 * Runs every site query against sanity/seed.ndjson with groq-js and checks
 * the result shapes.
 *
 *   npm run test:queries     (needs `npm ci --prefix studio` for groq-js)
 */
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  brandsQuery,
  categoriesQuery,
  categoryQuery,
  productQuery,
} from "../src/lib/content/queries.ts";

type Doc = Record<string, unknown> & { _id: string; _type: string };
type Row = Record<string, unknown>;

const groqPath = fileURLToPath(
  new URL("../studio/node_modules/groq-js/dist/index.js", import.meta.url),
);

if (!existsSync(groqPath)) {
  console.error("groq-js not found. Run `npm ci --prefix studio` first.");
  process.exit(1);
}

// pathToFileURL keeps the import working on Windows drive-letter paths.
const groq = await import(pathToFileURL(groqPath).href);

const seed: Doc[] = readFileSync(new URL("../sanity/seed.ndjson", import.meta.url), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

let failures = 0;
let passes = 0;

function check(condition: unknown, message: string) {
  if (condition) {
    passes++;
  } else {
    failures++;
    console.error(`  ✗ ${message}`);
  }
}

async function run(query: string, params: Row = {}, dataset: Doc[] = seed) {
  const tree = groq.parse(query, { params });
  const value = await groq.evaluate(tree, { dataset, params });
  return value.get();
}

function isImage(value: unknown) {
  const image = value as Row | null;
  return (
    image !== null &&
    typeof image === "object" &&
    typeof image.src === "string" &&
    image.src.startsWith("https://") &&
    typeof image.alt === "string"
  );
}

function isCard(value: unknown) {
  const card = value as Row;
  const category = card.category as Row | null;
  return (
    typeof card.id === "string" &&
    typeof card.title === "string" &&
    typeof card.slug === "string" &&
    typeof card.summary === "string" &&
    typeof card.isSample === "boolean" &&
    category !== null &&
    typeof category.slug === "string" &&
    typeof category.title === "string" &&
    (card.brand === null || typeof (card.brand as Row).name === "string")
  );
}

const products = seed.filter((doc) => doc._type === "product");
const categoryIds = new Set(
  seed.filter((doc) => doc._type === "category").map((doc) => doc._id),
);
const brandIds = new Set(
  seed.filter((doc) => doc._type === "brand").map((doc) => doc._id),
);

console.log("seed");
check(seed.length > 0, "seed has documents");
check(
  seed.every((doc) => !doc._id.includes(".")),
  `no dotted IDs (found: ${seed.filter((doc) => doc._id.includes(".")).map((doc) => doc._id).join(", ") || "none"})`,
);
check(
  products.every((doc) => categoryIds.has((doc.category as Row)._ref as string)),
  "every product references an existing category",
);
check(
  products.every((doc) => !doc.brand || brandIds.has((doc.brand as Row)._ref as string)),
  "every product brand reference exists",
);

console.log("categoriesQuery");
const categories = (await run(categoriesQuery)) as Row[];
check(categories.length === categoryIds.size, `returns all ${categoryIds.size} categories`);
check(
  categories.every(
    (category) =>
      typeof category.id === "string" &&
      typeof category.slug === "string" &&
      typeof category.title === "string" &&
      typeof category.eyebrow === "string" &&
      typeof category.summary === "string" &&
      typeof category.showOnHome === "boolean" &&
      typeof category.order === "number" &&
      isImage(category.image) &&
      Array.isArray(category.products),
  ),
  "every category has the Category shape",
);
check(
  categories.every((category, index) =>
    index === 0 || (categories[index - 1].order as number) <= (category.order as number),
  ),
  "categories are ordered by order",
);
check(
  categories.reduce((sum, category) => sum + (category.products as Row[]).length, 0) === products.length,
  `product lists add up to ${products.length}`,
);
check(
  categories.every((category) =>
    (category.products as Row[]).every(
      (product) => typeof product.title === "string" && typeof product.slug === "string",
    ),
  ),
  "category products have title and slug",
);

console.log("categoryQuery");
const firstCategory = categories.find((category) => (category.products as Row[]).length > 0)!;
const detail = (await run(categoryQuery, { slug: firstCategory.slug })) as Row;
check(detail?.slug === firstCategory.slug, `finds category "${firstCategory.slug}"`);
check(
  Array.isArray(detail?.products) &&
    (detail.products as Row[]).length === (firstCategory.products as Row[]).length &&
    (detail.products as Row[]).every(isCard),
  "returns product cards",
);
check(
  (detail?.products as Row[]).every((card) => card.image === null || isImage(card.image)),
  "card images resolve to a src",
);
check((await run(categoryQuery, { slug: "does-not-exist" })) === null, "unknown slug returns null");

console.log("productQuery");
const sample = products.find((doc) => doc.brand)!;
const sampleCategory = seed.find((doc) => doc._id === (sample.category as Row)._ref)!;
const sampleSlug = (sample.slug as Row).current as string;
const sampleCategorySlug = (sampleCategory.slug as Row).current as string;
const product = (await run(productQuery, {
  category: sampleCategorySlug,
  slug: sampleSlug,
})) as Row;
check(product?.slug === sampleSlug, `finds product "${sampleCategorySlug}/${sampleSlug}"`);
check(isCard(product), "product has the card fields");
check(
  Array.isArray(product?.images) &&
    (product.images as Row[]).length > 0 &&
    (product.images as Row[]).every(isImage),
  "images resolve",
);
for (const field of ["keyFeatures", "description", "specifications", "variants", "related"]) {
  check(Array.isArray(product?.[field]), `${field} is an array`);
}
check(
  (product?.related as Row[]).every(
    (card) => isCard(card) && card.id !== product.id && (card.category as Row).slug === sampleCategorySlug,
  ),
  "related products are other products from the same category",
);
check(product?.brand !== null, "brand is resolved");

const otherCategory = categories.find((category) => category.slug !== sampleCategorySlug)!;
check(
  (await run(productQuery, { category: otherCategory.slug, slug: sampleSlug })) === null,
  "product under the wrong category returns null",
);

// Related products are capped at 3: add extra siblings in memory.
const extras: Doc[] = [1, 2, 3, 4].map((n) => ({
  ...sample,
  _id: `product-extra-${n}`,
  slug: { _type: "slug", current: `extra-${n}` },
}));
const crowded = (await run(
  productQuery,
  { category: sampleCategorySlug, slug: sampleSlug },
  [...seed, ...extras],
)) as Row;
check((crowded.related as Row[]).length === 3, "related is limited to 3");

// Optional fields come back as defaults when missing.
const bare: Doc = {
  _id: "product-bare",
  _type: "product",
  title: "Bare",
  slug: { _type: "slug", current: "bare" },
  category: { _type: "reference", _ref: sampleCategory._id },
};
const bareResult = (await run(
  productQuery,
  { category: sampleCategorySlug, slug: "bare" },
  [...seed, bare],
)) as Row;
check(
  bareResult.isSample === false &&
    bareResult.summary === "" &&
    bareResult.brand === null &&
    bareResult.image === null &&
    (bareResult.images as unknown[]).length === 0,
  "missing optional fields fall back to defaults",
);

// An uploaded asset wins over a link.
const uploaded: Doc[] = [
  {
    _id: "image-abc-100x100-png",
    _type: "sanity.imageAsset",
    url: "https://cdn.sanity.io/images/x/production/abc-100x100.png",
  },
  {
    ...bare,
    images: [
      {
        _type: "mediaImage",
        _key: "a",
        alt: "Uploaded",
        url: "https://example.com/linked.png",
        upload: { _type: "image", asset: { _type: "reference", _ref: "image-abc-100x100-png" } },
      },
    ],
  },
];
const uploadedResult = (await run(
  productQuery,
  { category: sampleCategorySlug, slug: "bare" },
  [...seed, ...uploaded],
)) as Row;
check(
  (uploadedResult.image as Row).src === "https://cdn.sanity.io/images/x/production/abc-100x100.png",
  "uploaded image is preferred over the link",
);

console.log("brandsQuery");
const brands = (await run(brandsQuery)) as Row[];
check(brands.length === brandIds.size, `returns all ${brandIds.size} brands`);
check(
  brands.every(
    (brand) =>
      typeof brand.id === "string" &&
      typeof brand.name === "string" &&
      typeof brand.slug === "string" &&
      typeof brand.tagline === "string" &&
      typeof brand.confirmed === "boolean" &&
      typeof brand.inHouse === "boolean" &&
      typeof brand.order === "number" &&
      (brand.logo === null || isImage(brand.logo)),
  ),
  "every brand has the Brand shape",
);

console.log(`\n${passes} passed, ${failures} failed`);

if (failures > 0) process.exit(1);
