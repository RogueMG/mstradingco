/**
 * GROQ queries for the site. Plain strings with no imports, so scripts
 * (scripts/test-queries.ts) and other developers can run them as-is.
 * Result shapes are described in ./types.ts and docs/CONTENT_API.md.
 */

// Uploaded asset wins over a pasted link.
const imageFields = `"src": coalesce(upload.asset->url, url), "alt": coalesce(alt, "")`;

const categoryFields = `
  "id": _id,
  title,
  "slug": slug.current,
  "eyebrow": coalesce(eyebrow, ""),
  "summary": coalesce(summary, ""),
  "image": image{ ${imageFields} },
  "showOnHome": coalesce(showOnHome, true),
  "order": coalesce(order, 100)
`;

const productCardFields = `
  "id": _id,
  title,
  "slug": slug.current,
  "summary": coalesce(summary, ""),
  "image": images[0]{ ${imageFields} },
  "brand": brand->{ name, "slug": slug.current },
  "category": category->{ title, "slug": slug.current },
  "isSample": coalesce(isSample, false)
`;

const productOrder = `order(coalesce(order, 100) asc, title asc)`;

/** All categories in display order, each with its products' titles and slugs. Returns Category[]. */
export const categoriesQuery = `
*[_type == "category" && defined(slug.current)] | order(coalesce(order, 100) asc, title asc) {
  ${categoryFields},
  "products": *[_type == "product" && category._ref == ^._id && defined(slug.current)] | ${productOrder} {
    title,
    "slug": slug.current
  }
}`;

/** One category by $slug, with product cards. Returns CategoryDetail | null. */
export const categoryQuery = `
*[_type == "category" && slug.current == $slug][0] {
  ${categoryFields},
  "products": *[_type == "product" && category._ref == ^._id && defined(slug.current)] | ${productOrder} {
    ${productCardFields}
  }
}`;

/**
 * One product by $category and $slug. Only matches a product filed under that
 * category, so /products/<wrong-category>/<slug> is a not-found.
 * Returns Product | null, with up to 3 related products from the same category.
 */
export const productQuery = `
*[_type == "product" && slug.current == $slug && category->slug.current == $category][0] {
  ${productCardFields},
  "images": coalesce(images[]{ ${imageFields} }, []),
  "keyFeatures": coalesce(keyFeatures, []),
  "description": coalesce(description, []),
  "specifications": coalesce(specifications[]{ label, value }, []),
  "variants": coalesce(variants, []),
  "related": *[_type == "product" && category._ref == ^.category._ref && _id != ^._id && defined(slug.current)] | ${productOrder} [0...3] {
    ${productCardFields}
  }
}`;

/** All brands in display order. Returns Brand[]. */
export const brandsQuery = `
*[_type == "brand" && defined(slug.current)] | order(coalesce(order, 100) asc, name asc) {
  "id": _id,
  name,
  "slug": slug.current,
  "tagline": coalesce(tagline, ""),
  "confirmed": coalesce(confirmed, true),
  "inHouse": coalesce(inHouse, false),
  "logo": logo{ ${imageFields} },
  "order": coalesce(order, 100)
}`;
