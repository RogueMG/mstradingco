import { motion } from "motion/react";

import CategoryCard from "../components/products/CategoryCard";
import EnquiryBand from "../components/products/EnquiryBand";
import ContentState from "../components/ui/ContentState";
import PageHeader from "../components/ui/PageHeader";
import PageLoading from "../components/ui/PageLoading";
import { useCategories } from "../lib/content/hooks";
import { usePageMeta } from "../lib/usePageMeta";

function Products() {
  const categories = useCategories();

  usePageMeta(
    "Products",
    "Browse industrial safety helmets, safety footwear, PPE, eye, ear and respiratory protection, site safety, power tools and hand tools from MS Trading Co., Chennai.",
  );

  return (
    <>
      <PageHeader
        eyebrow="Our Products"
        title="Safety equipment for every workplace."
        description="Explore our product categories, from personal protective equipment to professional power and hand tools, sourced from established industrial brands."
        crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      <section className="bg-[#f5f8fc] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          {categories.status === "loading" && <PageLoading />}

          {categories.status === "error" && (
            <ContentState
              kind="error"
              title="We couldn't load the catalogue"
              message="Please check your connection and try again."
              onRetry={categories.retry}
            />
          )}

          {categories.status === "ready" &&
            (categories.data.length === 0 ? (
              <ContentState
                kind="empty"
                title="Catalogue coming soon"
                message="Our product categories are being added. Contact us for anything you need in the meantime."
                backHref="/contact"
                backLabel="Contact us"
              />
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {categories.data.map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    index={index}
                  />
                ))}
              </motion.div>
            ))}

          <div className="mt-12">
            <EnquiryBand
              title="Need something that isn't listed?"
              description="We source across brands and categories. Tell us what you need."
              subject="safety equipment"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Products;
