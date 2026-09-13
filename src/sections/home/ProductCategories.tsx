import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { productCategories } from "../../data/products";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

function ProductCategories() {
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

            <a
              href="/products"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#063b73]"
            >
              View complete product range
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </motion.div>
        </div>

        {/* Category grid */}
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
          {productCategories.map((category) => (
            <motion.a
              key={category.id}
              variants={itemVariants}
              href={category.href}
              className="group relative min-h-[360px] overflow-hidden rounded-2xl bg-[#063b73] shadow-sm transition-shadow duration-500 hover:shadow-2xl"
            >
              {/* Product image */}
              <img
  src={category.image}
  alt={`${category.name} products`}
  loading="lazy"
  decoding="async"
  onError={(event) => {
    event.currentTarget.style.display = "none";
  }}
  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
/>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#031d36] via-[#063b73]/35 to-transparent" />

              {/* Number */}
              <div className="absolute right-5 top-5">
                <span className="text-xs font-semibold tracking-[0.2em] text-white/60">
                  {category.number}
                </span>
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#ff8a65]">
                  {category.shortName}
                </p>

                <h3 className="text-2xl font-bold text-white">
                  {category.name}
                </h3>

                <p className="mt-3 max-w-xs text-sm leading-6 text-white/75">
                  {category.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    Explore category
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4511e] text-white transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ProductCategories;