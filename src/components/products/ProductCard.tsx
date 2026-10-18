import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

import ContentImg from "../ui/ContentImg";
import type { ProductCard as ProductCardData } from "../../lib/content/types";

interface ProductCardProps {
  product: ProductCardData;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.category.slug}/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0b5fa5]/30 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f8fc]">
        <ContentImg
          image={product.image}
          fallbackAlt={product.title}
          width={640}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {product.brand && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#063b73] shadow-sm">
            {product.brand.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold leading-snug text-[#063b73]">
          {product.title}
        </h3>

        {product.summary && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {product.summary}
          </p>
        )}

        <span className="mt-auto flex items-center justify-between pt-6 text-sm font-bold text-[#063b73]">
          View details
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#063b73]/15 transition-all duration-300 group-hover:border-[#f4511e] group-hover:bg-[#f4511e] group-hover:text-white">
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:rotate-45"
            />
          </span>
        </span>
      </div>
    </Link>
  );
}

export default ProductCard;
