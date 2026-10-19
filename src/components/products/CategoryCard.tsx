import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { Link } from "react-router";

import ContentImg from "../ui/ContentImg";
import type { Category } from "../../lib/content/types";

const MotionLink = motion.create(Link);

const categoryCardVariants: Variants = {
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

interface CategoryCardProps {
  category: Category;
  index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
  const count = category.products.length;

  return (
    <MotionLink
      variants={categoryCardVariants}
      to={`/products/${category.slug}`}
      className="group relative min-h-[360px] overflow-hidden rounded-2xl bg-[#063b73] shadow-sm transition-shadow duration-500 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/40"
    >
      {/* Category image */}
      <ContentImg
        image={category.image}
        fallbackAlt={`${category.title} products`}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        width={640}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#031d36] via-[#063b73]/35 to-transparent" />

      {/* Number */}
      <div className="absolute right-5 top-5">
        <span className="text-xs font-semibold tracking-[0.2em] text-white/60">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        {category.eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#ff8a65]">
            {category.eyebrow}
          </p>
        )}

        <h3 className="text-2xl font-bold text-white">{category.title}</h3>

        {category.summary && (
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/75">
            {category.summary}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">
            {count > 0
              ? `${count} ${count === 1 ? "product" : "products"}`
              : "Explore category"}
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4511e] text-white transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>
        </div>
      </div>
    </MotionLink>
  );
}

export default CategoryCard;
