import { PackageSearch } from "lucide-react";
import { motion } from "motion/react";

import ProductCard from "./ProductCard";
import type { ProductCard as ProductCardData } from "../../lib/content/types";

interface ProductGridProps {
  products: ProductCardData[];
  categoryName: string;
}

function ProductGrid({ products, categoryName }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#063b73]/5">
          <PackageSearch
            size={24}
            className="text-[#063b73]"
          />
        </div>

        <h3 className="mt-5 text-lg font-bold text-[#063b73]">
          Product catalogue coming soon
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Products for {categoryName} are being added. Send us your
          requirement in the meantime.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.07,
          },
        },
      }}
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
            },
            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ProductGrid;
