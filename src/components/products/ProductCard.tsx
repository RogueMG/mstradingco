import { ArrowUpRight, Package } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

import ContentImg from "../ui/ContentImg";
import { useEnquiry } from "../../hooks/useEnquiry";
import type { ProductCard as ProductCardData } from "../../lib/content/types";

interface ProductCardProps {
  product: ProductCardData;
}

function ProductCard({ product }: ProductCardProps) {
  const { openEnquiry } = useEnquiry();
  const href = `/products/${product.category.slug}/${product.slug}`;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-900/10"
    >
      {/* Product image */}
      <Link
        to={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
      >
        <ContentImg
          image={product.image}
          fallbackAlt={product.title}
          width={640}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#031f3b]/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        {/* Category icon */}
        <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/30 bg-[#031f3b]/60 text-white backdrop-blur-md">
          <Package size={17} />
        </div>
      </Link>

      {/* Product information */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f4511e]">
            {product.brand?.name || "Industrial Supply"}
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
        </div>

        <h3 className="mt-3 text-lg font-bold tracking-tight text-[#063b73]">
          <Link
            to={href}
            className="transition hover:text-[#f4511e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
          >
            {product.title}
          </Link>
        </h3>

        {product.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {product.summary}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <Link
            to={href}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#063b73] transition hover:text-[#f4511e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
          >
            View details
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>

          <button
            type="button"
            onClick={() => openEnquiry(product.category.title, product.title)}
            aria-label={`Enquire about ${product.title}`}
            className="rounded-full bg-[#f4511e]/10 px-4 py-2 text-xs font-bold text-[#f4511e] transition hover:bg-[#f4511e] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
          >
            Enquire
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;
