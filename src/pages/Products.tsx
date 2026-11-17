import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  ChevronRight,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

import ProductGrid from "../components/products/ProductGrid";
import ContentImg from "../components/ui/ContentImg";
import ContentState from "../components/ui/ContentState";
import PageLoading from "../components/ui/PageLoading";
import { useEnquiry } from "../hooks/useEnquiry";
import { useNode, useTree } from "../lib/content/hooks";
import { categoryMatches } from "../lib/content/tree";
import type { CategoryNode, TreeCategory } from "../lib/content/types";
import { company } from "../data/company";
import { publicAsset } from "../lib/publicAsset";
import { usePageMeta } from "../lib/usePageMeta";

const EMPTY: TreeCategory[] = [];

/**
 * The catalogue: top-level categories in the sidebar, the active category
 * (any depth) in the main panel. `path` is relative to /products ("" = first category).
 */
function Products({ path }: { path: string }) {
  const navigate = useNavigate();
  const tree = useTree();
  const roots = tree.status === "ready" ? tree.data : EMPTY;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoots = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query ? roots.filter((category) => categoryMatches(category, query)) : roots;
  }, [roots, searchQuery]);

  /*
   * The active top-level category comes from the URL's first segment. When a
   * search hides it, the first matching category is shown instead.
   */
  const requestedRoot = roots.find((category) => category.slug === path.split("/")[0]);
  const activeRoot =
    requestedRoot && filteredRoots.includes(requestedRoot) ? requestedRoot : filteredRoots[0];
  const activePath = requestedRoot === activeRoot && path ? path : (activeRoot?.path ?? "");
  const activeIndex = activeRoot ? roots.indexOf(activeRoot) : -1;

  const node = useNode(activePath);
  const categoryNode: CategoryNode | null =
    node.status === "ready" && node.data?.kind === "category" ? node.data : null;

  /*
   * Switching tabs updates the URL without a new history entry
   * and without scrolling back to the top.
   */
  const handleCategoryChange = (slug: string) => {
    navigate(`/products/${slug}`, {
      replace: true,
      state: { keepScroll: true },
      preventScrollReset: true,
    });
  };

  usePageMeta(
    path && categoryNode ? categoryNode.category.title : "Products",
    (path && categoryNode?.category.summary) ||
      "Browse industrial safety helmets, safety footwear, PPE, eye, ear and respiratory protection, site safety, power tools and hand tools from MS Trading Co., Chennai.",
  );

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* =====================================================
    PRODUCTS HERO
====================================================== */}
<section className="relative min-h-[560px] overflow-hidden bg-[#05294f] pt-36 pb-24 md:min-h-[620px] md:pt-44 md:pb-28">
  {/* ===================================================
      BACKGROUND IMAGE
  ==================================================== */}
  <motion.div
    initial={{ scale: 1.08 }}
    animate={{ scale: 1 }}
    transition={{
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="absolute inset-0"
  >
    <img
      src={publicAsset("/images/hero/products-hero.png")}
      alt=""
      aria-hidden="true"
      className="h-full w-full object-cover object-center"
    />
  </motion.div>

  {/* ===================================================
      DARK IMAGE OVERLAY
  ==================================================== */}

  {/* Overall darkening */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[#031f3b]/60"
  />

  {/* Left-side gradient for typography */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-[linear-gradient(90deg,#031f3b_0%,rgba(3,31,59,0.96)_25%,rgba(5,41,79,0.78)_50%,rgba(5,41,79,0.30)_80%,rgba(3,31,59,0.55)_100%)]"
  />

  {/* Bottom fade */}
  <div
    aria-hidden="true"
    className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#031f3b] to-transparent"
  />

  {/* ===================================================
      BLUE AMBIENT LIGHT
  ==================================================== */}
  <div
    aria-hidden="true"
    className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#0b5fa5]/30 blur-[120px]"
  />

  <div
    aria-hidden="true"
    className="absolute bottom-0 left-[40%] h-[300px] w-[300px] rounded-full bg-[#f4511e]/10 blur-[100px]"
  />

  {/* ===================================================
      TECHNICAL GRID
  ==================================================== */}
  <div
    aria-hidden="true"
    className="absolute inset-0 opacity-[0.08]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
      backgroundSize: "64px 64px",
    }}
  />

  {/* Technical vertical lines */}
  <div
    aria-hidden="true"
    className="absolute bottom-0 left-[8%] top-0 hidden w-px bg-white/10 lg:block"
  />

  <div
    aria-hidden="true"
    className="absolute bottom-0 right-[8%] top-0 hidden w-px bg-white/10 lg:block"
  />

  {/* ===================================================
      CONTENT
  ==================================================== */}
  <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="max-w-4xl"
    >
      {/* Eyebrow */}
      <div className="mb-6 flex items-center gap-3">
        <span className="h-[2px] w-12 bg-[#f4511e]" />

        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff7043]">
          Product Range
        </span>
      </div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.15,
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[5.8rem]"
      >
        Safety products
        <br />
        built for{" "}
        <span className="relative inline-block text-[#f4511e]">
          demanding work.
          <span className="absolute -bottom-2 left-0 h-1 w-20 rounded-full bg-[#f4511e]/70 md:-bottom-3 md:w-28" />
        </span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.7,
        }}
        className="mt-7 max-w-2xl text-base leading-8 text-blue-50/80 md:text-lg"
      >
        Explore our range of personal protective equipment, safety
        supplies, professional tools and industrial essentials for
        workplace and project requirements.
      </motion.p>

      {/* Quick category indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.45,
          duration: 0.7,
        }}
        className="mt-8 flex flex-wrap gap-3"
      >
        {[
          "PPE",
          "Safety Equipment",
          "Power Tools",
          "Hand Tools",
          "Industrial Supplies",
        ].map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-md"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </motion.div>
  </div>

  {/* ===================================================
      BOTTOM META STRIP
  ==================================================== */}
  <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#031f3b]/80 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.8)]" />

        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
          Industrial Supply
        </span>
      </div>

      <div className="hidden h-4 w-px bg-white/15 sm:block" />

      <p className="text-xs text-white/45">
        PPE • Safety Equipment • Tools • Industrial Essentials
      </p>

      <div className="hidden h-4 w-px bg-white/15 sm:block" />

      <p className="text-xs font-semibold text-white/65">
        {company.cityLine}
      </p>
    </div>
  </div>
</section>

        {/* =====================================================
            PRODUCT CATALOGUE
        ====================================================== */}
        <section
          aria-labelledby="product-catalogue-heading"
          className="py-16 md:py-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Search header */}
            <div className="mb-10 flex flex-col gap-5 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Browse our categories
                </p>

                <h2
                  id="product-catalogue-heading"
                  className="mt-1 text-2xl font-bold text-[#063b73]"
                >
                  Find the right product group
                </h2>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <label
                  htmlFor="product-search"
                  className="sr-only"
                >
                  Search products and categories
                </label>

                <input
                  id="product-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search products, brands or categories..."
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0b5fa5] focus:bg-white focus:ring-4 focus:ring-[#0b5fa5]/10"
                />
              </div>
            </div>

            {tree.status === "loading" && <PageLoading />}

            {tree.status === "error" && (
              <ContentState
                kind="error"
                title="We couldn't load the catalogue"
                message="Please check your connection and try again."
                onRetry={tree.retry}
              />
            )}

            {tree.status === "ready" && roots.length === 0 && (
              <ContentState
                kind="empty"
                title="Catalogue coming soon"
                message="Our product categories are being added. Contact us for anything you need in the meantime."
                backHref="/contact"
                backLabel="Contact us"
              />
            )}

            {tree.status === "ready" && roots.length > 0 && (
            <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
              {/* =================================================
                  CATEGORY SIDEBAR
              ================================================== */}
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Categories
                </p>

                <nav aria-label="Product categories">
                  <div className="space-y-1">
                    {filteredRoots.map((category) => {
                      const isActive = category.id === activeRoot?.id;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategoryChange(category.path)}
                          aria-pressed={isActive}
                          className={`group flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] ${
                            isActive
                              ? "bg-[#063b73] text-white shadow-lg shadow-[#063b73]/15"
                              : "text-slate-600 hover:bg-slate-100 hover:text-[#063b73]"
                          }`}
                        >
                          <span>{category.title}</span>

                          <ChevronRight
                            size={17}
                            aria-hidden="true"
                            className={`transition-transform ${
                              isActive
                                ? "translate-x-0"
                                : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </nav>

                {filteredRoots.length === 0 && (
                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-[#063b73]">
                      No categories found
                    </p>

                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="mt-2 text-sm font-semibold text-[#f4511e] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </aside>

              {/* =================================================
                  ACTIVE CATEGORY (any depth)
              ================================================== */}
              <div className="min-w-0">
                {node.status === "loading" && activePath && <PageLoading />}

                {node.status === "error" && (
                  <ContentState
                    kind="error"
                    title="We couldn't load this category"
                    message="Please check your connection and try again."
                    onRetry={node.retry}
                  />
                )}

                {node.status === "ready" && !categoryNode && activePath && (
                  <ContentState
                    kind="not-found"
                    title="Category not found"
                    message="That category may have moved. Pick one from the list."
                  />
                )}

                <AnimatePresence mode="wait">
                  {categoryNode && (
                    <CategoryPanel
                      key={categoryNode.category.id}
                      node={categoryNode}
                      index={activeIndex}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function CategoryPanel({ node, index }: { node: CategoryNode; index: number }) {
  const { openEnquiry } = useEnquiry();
  const { category, children, products, breadcrumb } = node;
  const isNested = breadcrumb.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Trail for subcategories */}
      {isNested && (
        <nav aria-label="Category trail" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500">
            {breadcrumb.map((crumb, position) => (
              <li key={crumb.path} className="flex items-center gap-1.5">
                {position > 0 && <ChevronRight size={13} aria-hidden="true" />}
                {position === breadcrumb.length - 1 ? (
                  <span aria-current="page" className="text-[#063b73]">
                    {crumb.title}
                  </span>
                ) : (
                  <Link
                    to={`/products/${crumb.path}`}
                    state={{ keepScroll: true }}
                    className="transition hover:text-[#063b73]"
                  >
                    {crumb.title}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Category Hero */}
      <div className="group relative mb-8 min-h-[360px] overflow-hidden rounded-3xl bg-[#063b73] md:min-h-[440px]">
        <ContentImg
          image={category.image}
          fallbackAlt=""
          sizes="(min-width: 1024px) 66vw, 100vw"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#041f3d] via-[#063b73]/85 to-[#063b73]/20" />

        <div className="relative flex min-h-[360px] max-w-2xl flex-col justify-end p-7 md:min-h-[440px] md:p-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4511e]">
            {isNested
              ? category.eyebrow || "Subcategory"
              : `Category ${String(index + 1).padStart(2, "0")}`}
          </span>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
            {category.title}
          </h2>

          {category.summary && (
            <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/75 md:text-base">
              {category.summary}
            </p>
          )}

          <button
            type="button"
            onClick={() => openEnquiry(category.title)}
            className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#f4511e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d94316] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Enquire About This Category

            <ArrowUpRight
              size={17}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>

      {/* Subcategories */}
      {children.length > 0 && (
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Subcategories
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {children.map((child) => (
              <Link
                key={child.id}
                to={`/products/${child.path}`}
                state={{ keepScroll: true }}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#0b5fa5]/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/30"
              >
                <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5f8fc]">
                  <ContentImg
                    image={child.image}
                    fallbackAlt=""
                    sizes="64px"
                    className="h-full w-full object-cover"
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-[#063b73]">{child.title}</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {child.productCount} {child.productCount === 1 ? "product" : "products"}
                  </span>
                </span>

                <ArrowUpRight
                  size={17}
                  aria-hidden="true"
                  className="shrink-0 text-slate-300 transition group-hover:text-[#f4511e]"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Product grid */}
      {(products.length > 0 || children.length === 0) && (
        <div className="mt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Available Range
              </p>

              <h3 className="mt-1 text-xl font-bold text-[#063b73]">
                {products.length > 0
                  ? `${products.length} product${products.length > 1 ? "s" : ""}`
                  : "Product range"}
              </h3>
            </div>

            <span className="hidden text-xs text-slate-400 sm:block">
              Enquire for pricing & availability
            </span>
          </div>

          <ProductGrid products={products} categoryName={category.title} />
        </div>
      )}

      {/* Catalogue notice */}
      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[#063b73]">
              Looking for a specific product?
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Share your requirement and our team can help identify the
              appropriate product or product range.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openEnquiry(category.title)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#063b73] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#052f5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] focus-visible:ring-offset-2"
          >
            Send Requirement
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Products;