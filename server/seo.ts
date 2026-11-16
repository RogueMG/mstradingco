/**
 * Per-URL SEO for the single-page app: title, description, canonical, Open
 * Graph/Twitter, JSON-LD and a crawlable text summary. Used by functions/_middleware.ts.
 */
import type { CatalogueNode, Crumb } from "../shared/content";
import { formatAddress, type SiteSettings } from "../shared/site";
import { loadTree, resolveNode, type Tree } from "./catalogue";
import { loadBrands, loadIndustries } from "./lists";

export interface PageSeo {
  status: 200 | 404;
  title: string;
  description: string;
  canonicalPath: string;
  imagePath: string;
  ogType: "website" | "product";
  noindex: boolean;
  jsonLd: object[];
  /** Plain HTML placed inside #root for crawlers; React replaces it on load. */
  summaryHtml: string;
}

const DEFAULT_IMAGE = "/images/hero/industrial-safety.png";
const LOGO = "/images/logo/ms-trading-logo.png";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function clip(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

function absolute(origin: string, path: string): string {
  return /^https?:\/\//.test(path) ? path : `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}

function linkList(items: { href: string; label: string }[]): string {
  if (items.length === 0) return "";
  return `<ul>${items.map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`).join("")}</ul>`;
}

function organization(origin: string, site: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: site.name,
    ...(site.alternateNames.length ? { alternateName: site.alternateNames } : {}),
    url: `${origin}/`,
    logo: absolute(origin, LOGO),
    email: site.email,
    telephone: site.phone,
    ...(site.gstin ? { taxID: site.gstin } : {}),
    ...(site.social.length ? { sameAs: site.social.map((item) => item.url) } : {}),
  };
}

function website(origin: string, site: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    name: site.name,
    url: `${origin}/`,
    publisher: { "@id": `${origin}/#organization` },
  };
}

function localBusinesses(origin: string, site: SiteSettings) {
  return site.locations.map((location) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${origin}/#location-${location.id}`,
    name: site.locations.length > 1 ? `${site.name} – ${location.name}` : site.name,
    url: `${origin}/contact`,
    image: absolute(origin, LOGO),
    telephone: location.phone || site.phone,
    email: site.email,
    parentOrganization: { "@id": `${origin}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: location.streetAddress,
      addressLocality: location.locality,
      addressRegion: location.region,
      postalCode: location.postalCode,
      addressCountry: location.country,
    },
    ...(location.latitude != null && location.longitude != null
      ? { geo: { "@type": "GeoCoordinates", latitude: location.latitude, longitude: location.longitude } }
      : {}),
    ...(location.openingHours.length ? { openingHours: location.openingHours } : {}),
  }));
}

function breadcrumbList(origin: string, crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(origin, crumb.path),
    })),
  };
}

function catalogueCrumbs(trail: Crumb[], last?: { name: string; path: string }) {
  return [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    ...trail.map((crumb) => ({ name: crumb.title, path: `/products/${crumb.path}` })),
    ...(last ? [last] : []),
  ];
}

interface StaticPage {
  title: string;
  description: string;
  name: string;
  noindex?: boolean;
  localBusiness?: boolean;
}

const STATIC_PAGES: Record<string, StaticPage> = {
  "/about": {
    name: "About Us",
    title: "About Us",
    description: "MS Trading Co. supplies industrial safety equipment, PPE and professional tools to businesses in Chennai and beyond.",
    localBusiness: true,
  },
  "/products": {
    name: "Products",
    title: "Products",
    description: "Browse industrial safety helmets, safety footwear, PPE, eye, ear and respiratory protection, site safety, power tools and hand tools from MS Trading Co., Chennai.",
  },
  "/brands": {
    name: "Brands",
    title: "Brands We Deal In",
    description: "Genuine safety and tool brands supplied by MS Trading Co.: Udyogi, 3M, Allen Cooper, Karam, Bosch, Taparia and more.",
  },
  "/industries": {
    name: "Industries",
    title: "Industries We Serve",
    description: "Safety equipment and PPE for construction, manufacturing, energy, pharma, food processing, infrastructure and logistics.",
  },
  "/contact": {
    name: "Contact",
    title: "Contact Us",
    description: "Contact MS Trading Co. in Chennai for quotes on safety equipment, PPE and tools. Call, WhatsApp or send an enquiry.",
    localBusiness: true,
  },
  "/gallery": { name: "Gallery", title: "Gallery", description: "Photos from MS Trading Co.", noindex: true },
};

function titleFor(site: SiteSettings, page?: string): string {
  return page ? `${page} | ${site.name}` : `${site.name} | Industrial Safety Equipment Supplier, Chennai`;
}

function contactSummary(site: SiteSettings): string {
  const locations = site.locations
    .map((location) => `<p>${escapeHtml(location.name)}: ${escapeHtml(formatAddress(location))}. Phone ${escapeHtml(location.phone || site.phone)}.</p>`)
    .join("");
  return `${locations}<p>Email ${escapeHtml(site.email)}. WhatsApp +${escapeHtml(site.whatsappNumber)}.</p>`;
}

function topCategoryLinks(tree: Tree) {
  return linkList(tree.roots.map((node) => ({ href: `/products/${node.path}`, label: node.title })));
}

/** Builds the SEO for a pathname. Unknown paths come back with status 404. */
export async function seoFor(
  db: D1Database,
  pathname: string,
  origin: string,
  site: SiteSettings,
): Promise<PageSeo> {
  const base = { imagePath: DEFAULT_IMAGE, ogType: "website" as const, noindex: false };
  const shared = [organization(origin, site), website(origin, site)];

  if (pathname === "/") {
    const tree = await loadTree(db);
    return {
      ...base,
      status: 200,
      title: titleFor(site),
      description: clip(site.description),
      canonicalPath: "/",
      jsonLd: [...shared, ...localBusinesses(origin, site)],
      summaryHtml: `<h1>${escapeHtml(site.name)}</h1><p>${escapeHtml(site.description)}</p><h2>Products</h2>${topCategoryLinks(tree)}${contactSummary(site)}`,
    };
  }

  const page = STATIC_PAGES[pathname];

  if (page) {
    let body = "";

    if (pathname === "/products" || pathname === "/about") {
      body = topCategoryLinks(await loadTree(db));
    } else if (pathname === "/brands") {
      const brands = await loadBrands(db);
      body = `<ul>${brands.map((brand) => `<li>${escapeHtml(brand.name)}${brand.tagline ? `: ${escapeHtml(brand.tagline)}` : ""}</li>`).join("")}</ul>`;
    } else if (pathname === "/industries") {
      const industries = await loadIndustries(db);
      body = `<ul>${industries.map((industry) => `<li>${escapeHtml(industry.title)}: ${escapeHtml(industry.summary)}</li>`).join("")}</ul>`;
    } else if (pathname === "/contact") {
      body = contactSummary(site);
    }

    return {
      ...base,
      status: 200,
      title: titleFor(site, page.title),
      description: clip(page.description),
      canonicalPath: pathname,
      noindex: Boolean(page.noindex),
      jsonLd: [
        ...shared,
        ...(page.localBusiness ? localBusinesses(origin, site) : []),
        breadcrumbList(origin, [
          { name: "Home", path: "/" },
          { name: page.name, path: pathname },
        ]),
      ],
      summaryHtml: `<h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p>${body}`,
    };
  }

  if (pathname.startsWith("/products/")) {
    const path = pathname.slice("/products/".length);

    if (/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(path)) {
      const tree = await loadTree(db);
      const node = await resolveNode(db, tree, path);
      if (node) return nodeSeo(node, origin, site, shared);
    }
  }

  return notFound(site, pathname);
}

function nodeSeo(node: CatalogueNode, origin: string, site: SiteSettings, shared: object[]): PageSeo {
  if (node.kind === "category") {
    const { category } = node;
    const description = clip(category.summary || `${category.title} from ${site.name}, Chennai. Request a quote for bulk supply.`);

    return {
      status: 200,
      title: titleFor(site, category.title),
      description,
      canonicalPath: `/products/${category.path}`,
      imagePath: category.image?.src ?? DEFAULT_IMAGE,
      ogType: "website",
      noindex: false,
      jsonLd: [...shared, breadcrumbList(origin, catalogueCrumbs(node.breadcrumb))],
      summaryHtml:
        `<h1>${escapeHtml(category.title)}</h1><p>${escapeHtml(category.summary)}</p>` +
        linkList([
          ...node.children.map((child) => ({ href: `/products/${child.path}`, label: child.title })),
          ...node.products.map((product) => ({ href: `/products/${product.path}`, label: product.title })),
        ]),
    };
  }

  const { product } = node;
  const plainDescription = stripHtml(product.description);
  const description = clip(product.summary || plainDescription || `${product.title} from ${site.name}, Chennai.`);
  const images = product.images.map((image) => image.src).filter((src): src is string => Boolean(src));

  return {
    status: 200,
    title: titleFor(site, product.title),
    description,
    canonicalPath: `/products/${product.path}`,
    imagePath: images[0] ?? DEFAULT_IMAGE,
    ogType: "product",
    noindex: false,
    jsonLd: [
      ...shared,
      // No prices are published, so there is no "offers" block; Google treats
      // this as structured data but not as a product rich-result candidate.
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: description,
        url: absolute(origin, `/products/${product.path}`),
        ...(images.length ? { image: images.map((src) => absolute(origin, src)) } : {}),
        ...(product.brand ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
        category: product.category.title,
        ...(product.specifications.length
          ? {
              additionalProperty: product.specifications.map((spec) => ({
                "@type": "PropertyValue",
                name: spec.label,
                value: spec.value,
              })),
            }
          : {}),
      },
      breadcrumbList(origin, catalogueCrumbs(node.breadcrumb, { name: product.title, path: `/products/${product.path}` })),
    ],
    summaryHtml:
      `<h1>${escapeHtml(product.title)}</h1>` +
      (product.brand ? `<p>Brand: ${escapeHtml(product.brand.name)}</p>` : "") +
      `<p>${escapeHtml(product.summary)}</p>` +
      (plainDescription ? `<p>${escapeHtml(clip(plainDescription, 600))}</p>` : "") +
      (product.keyFeatures.length ? `<ul>${product.keyFeatures.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>` : "") +
      `<p><a href="/products/${escapeHtml(product.category.path)}">More ${escapeHtml(product.category.title)}</a></p>`,
  };
}

export function notFound(site: SiteSettings, pathname: string): PageSeo {
  return {
    status: 404,
    title: titleFor(site, "Page not found"),
    description: "The page you're looking for doesn't exist or has moved.",
    canonicalPath: pathname,
    imagePath: DEFAULT_IMAGE,
    ogType: "website",
    noindex: true,
    jsonLd: [],
    summaryHtml: `<h1>Page not found</h1><p><a href="/products">Browse products</a></p>`,
  };
}

/** Serialises JSON-LD safely for a <script> tag. */
export function jsonLdScript(data: object): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}
