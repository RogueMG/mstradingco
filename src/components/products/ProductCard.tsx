import { ArrowUpRight, Package } from "lucide-react";
import { motion } from "motion/react";

interface ProductCardProps {
  name: string;
  brand?: string;
  description: string;
  image: string;
  onEnquire: () => void;
}

function ProductCard({
  name,
  brand,
  description,
  image,
  onEnquire,
}: ProductCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-900/10"
    >
      {/* Product image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#031f3b]/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        {/* Category icon fallback */}
        <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/30 bg-[#031f3b]/60 text-white backdrop-blur-md">
          <Package size={17} />
        </div>

        {/* Enquire overlay */}
        <button
          type="button"
          onClick={onEnquire}
          className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-[#f4511e] text-white opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={`Enquire about ${name}`}
        >
          <ArrowUpRight size={18} />
        </button>
      </div>

      {/* Product information */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f4511e]">
            {brand || "Industrial Supply"}
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
        </div>

        <h3 className="mt-3 text-lg font-bold tracking-tight text-[#063b73]">
          {name}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <button
          type="button"
          onClick={onEnquire}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#063b73] transition hover:text-[#f4511e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
        >
          Enquire about product
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    </motion.article>
  );
}

export default ProductCard;