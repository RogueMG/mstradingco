import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  ChevronRight,
  Search,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import ProductGrid from "../components/products/ProductGrid";
import ContentImg from "../components/ui/ContentImg";
import ContentState from "../components/ui/ContentState";
import PageLoading from "../components/ui/PageLoading";
import { useEnquiry } from "../hooks/useEnquiry";
import { useCategories } from "../lib/content/hooks";
import type { Category } from "../lib/content/types";
import { publicAsset } from "../lib/publicAsset";
import { usePageMeta } from "../lib/usePageMeta";

/** True when the category, or any of its products or brands, matches the search. */
function matches(category: Category, query: string) {
  const haystack = [
    category.title,
    category.eyebrow,
    category.summary,
    ...category.products.flatMap((product) => [
      product.title,
      product.brand?.name ?? "",
    ]),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function Products() {
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();
  const { openEnquiry } = useEnquiry();
  const result = useCategories();
  const categories = useMemo(
    () => (result.status === "ready" ? result.data : []),
    [result],
  );

  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) => matches(category, query));
  }, [categories, searchQuery]);

  /*
   * The active category comes from the URL (/products/<slug>).
   * Without one, or when a search hides it, the first match is shown.
   */
  const requested = categoryParam
    ? categories.find((category) => category.slug === categoryParam)
    : undefined;
  const unknownCategory =
    result.status === "ready" && Boolean(categoryParam) && !requested;

  const activeProductCategory =
    requested && filteredCategories.includes(requested)
      ? requested
      : filteredCategories[0];

  const activeIndex = activeProductCategory
    ? categories.indexOf(activeProductCategory)
    : -1;

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
    requested ? requested.title : unknownCategory ? "Category not found" : "Products",
    requested?.summary ||
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
        Chennai, Tamil Nadu
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

            {result.status === "loading" && <PageLoading />}

            {result.status === "error" && (
              <ContentState
                kind="error"
                title="We couldn't load the catalogue"
                message="Please check your connection and try again."
                onRetry={result.retry}
              />
            )}

            {unknownCategory && (
              <div className="mb-10">
                <ContentState
                  kind="not-found"
                  title="Category not found"
                  message="That category may have moved. Pick one from the list below."
                />
              </div>
            )}

            {result.status === "ready" && (
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
                    {filteredCategories.map((category) => {
                      const isActive =
                        category.id === activeProductCategory?.id;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() =>
                            handleCategoryChange(category.slug)
                          }
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

                {filteredCategories.length === 0 && (
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
                  ACTIVE CATEGORY
              ================================================== */}
              <div>
                <AnimatePresence mode="wait">
                  {activeProductCategory && (
                    <motion.div
                      key={activeProductCategory.id}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: "easeOut",
                      }}
                    >
                      {/* Category Hero */}
                      <div className="group relative mb-8 min-h-[360px] overflow-hidden rounded-3xl bg-[#063b73] md:min-h-[440px]">
                        <ContentImg
                          image={activeProductCategory.image}
                          fallbackAlt=""
                          sizes="(min-width: 1024px) 66vw, 100vw"
                          width={1280}
                          loading="eager"
                          className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-[#041f3d] via-[#063b73]/85 to-[#063b73]/20" />

                        <div className="relative flex min-h-[360px] max-w-2xl flex-col justify-end p-7 md:min-h-[440px] md:p-10">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4511e]">
                            Category {String(activeIndex + 1).padStart(2, "0")}
                          </span>

                          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
                            {activeProductCategory.title}
                          </h2>

                          <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/75 md:text-base">
                            {activeProductCategory.summary}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              openEnquiry(
                                activeProductCategory.title,
                              )
                            }
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

                      {/* Category information */}
                      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f4511e]">
                            Product Category
                          </p>

                          <h3 className="mt-2 text-2xl font-bold text-[#063b73]">
                            Explore {activeProductCategory.title}
                          </h3>
                        </div>

                        <p className="text-sm text-slate-400">
                          {activeProductCategory.eyebrow}
                        </p>
                      </div>

{/* =================================================
    PRODUCT GRID
================================================== */}
<div className="mt-8">
  <div className="mb-5 flex items-end justify-between gap-4">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        Available Range
      </p>

      <h3 className="mt-1 text-xl font-bold text-[#063b73]">
        {activeProductCategory.products.length > 0
          ? `${activeProductCategory.products.length} product${activeProductCategory.products.length > 1 ? "s" : ""}`
          : "Product range"}
      </h3>
    </div>

    <span className="hidden text-xs text-slate-400 sm:block">
      Enquire for pricing & availability
    </span>
  </div>

  <ProductGrid
    products={activeProductCategory.products}
    categoryName={activeProductCategory.title}
  />
</div>

                      {/* Catalogue notice */}
                      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-[#063b73]">
                              Looking for a specific product?
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              Share your requirement and our team
                              can help identify the appropriate
                              product or product range.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              openEnquiry(
                                activeProductCategory.title,
                              )
                            }
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#063b73] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#052f5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] focus-visible:ring-offset-2"
                          >
                            Send Requirement
                            <ArrowUpRight
                              size={16}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
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

export default Products;