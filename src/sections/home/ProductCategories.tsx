import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { Link } from "react-router";

import CategoryCard from "../../components/products/CategoryCard";
import { useCategories } from "../../lib/content/hooks";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function ProductCategories() {
  const categories = useCategories();
  const homeCategories =
    categories.status === "ready"
      ? categories.data.filter((category) => category.showOnHome)
      : [];

  return (
    <section
      id="products"
      className="relative overflow-hidden bg-[#f5f8fc] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">

        {/* Section header */}
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mb-4 flex items-center gap-3"
            >
              <span className="h-[2px] w-10 bg-[#f4511e]" />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#f4511e]">
                Explore Our Products
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="text-4xl font-bold leading-tight tracking-tight text-[#063b73] md:text-5xl lg:text-6xl"
            >
              Safety equipment
              <br />
              for every workplace.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-md"
          >
            <p className="text-base leading-7 text-slate-600">
              From personal protective equipment to professional tools,
              explore products sourced from established industrial brands.
            </p>

            <Link
              to="/products"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#063b73]"
            >
              View complete product range
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* Category grid */}
        {categories.status === "loading" && (
          <div
            aria-hidden="true"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="min-h-[360px] animate-pulse rounded-2xl bg-[#063b73]/10"
              />
            ))}
          </div>
        )}

        {categories.status === "error" && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            Product categories couldn't be loaded right now.{" "}
            <Link to="/products" className="font-bold text-[#063b73]">
              View the product range
            </Link>
          </p>
        )}

        {homeCategories.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.08,
            }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {homeCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default ProductCategories;