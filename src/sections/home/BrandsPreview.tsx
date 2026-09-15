import { ArrowUpRight, CheckCircle2, Clock3 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";

import { brands } from "../../data/brands";

const MotionLink = motion.create(Link);

function BrandsPreview() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#f5f8fc] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">

        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, x: 0 }
              }
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mb-4 flex items-center gap-3"
            >
              <span className="h-[2px] w-10 bg-[#f4511e]" />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#f4511e]">
                Brands We Deal In
              </span>
            </motion.div>

            <motion.h2
              initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
              }
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-[#063b73] md:text-5xl"
            >
              Trusted brands.
              <br />
              <span className="text-[#f4511e]">
                Reliable protection.
              </span>
            </motion.h2>
          </div>

          <MotionLink
            to="/brands"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            whileInView={
              shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
            }
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#063b73] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/30"
          >
            View all brands

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#063b73]/20 transition-all duration-300 group-hover:border-[#f4511e] group-hover:bg-[#f4511e] group-hover:text-white">
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </span>
          </MotionLink>
        </div>

        {/* Intro */}
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          whileInView={
            shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-2xl text-base leading-7 text-slate-600"
        >
          We work with established industrial brands across safety,
          PPE, footwear and tools, helping businesses source the
          products they need from one reliable supplier.
        </motion.p>

        {/* Brand grid */}
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.07,
              },
            },
          }}
          className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {brands.map((brand, index) => {
            const isPending = brand.status === "pending";

            return (
              <motion.article
                key={brand.id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className={`group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-300 ${
                  isPending
                    ? "border-dashed border-slate-300 opacity-70"
                    : "border-slate-200 hover:-translate-y-1 hover:border-[#0b5fa5]/30 hover:shadow-xl"
                }`}
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold tracking-[0.16em] text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {isPending ? (
                    <Clock3
                      size={15}
                      className="text-slate-400"
                      aria-label="Pending confirmation"
                    />
                  ) : (
                    <CheckCircle2
                      size={15}
                      className="text-[#0b5fa5]"
                      aria-label="Confirmed brand"
                    />
                  )}
                </div>

                {/* Logo */}
                <div className="flex min-h-[65px] items-center justify-center">
  <img
    src={brand.logo}
    alt={`${brand.name} logo`}
    loading="lazy"
    decoding="async"
    className={`max-h-14 max-w-[120px] object-contain transition-all duration-300 ${
      isPending ? "grayscale" : "group-hover:scale-105"
    }`}
    onError={(event) => {
      event.currentTarget.style.display = "none";

      const fallback = event.currentTarget
        .nextElementSibling as HTMLElement | null;

      if (fallback) {
        fallback.style.display = "block";
      }
    }}
  />

  <span
    style={{ display: "none" }}
    className={`text-center text-lg font-bold tracking-tight ${
      isPending ? "text-slate-400" : "text-[#063b73]"
    }`}
  >
    {brand.name}
  </span>
</div>

                {/* Bottom */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {brand.category}
                  </p>

                  {isPending && (
                    <p className="mt-1 text-[10px] leading-4 text-slate-400">
                      Client confirmation pending
                    </p>
                  )}
                </div>

                {/* Hover accent */}
                {!isPending && (
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#f4511e] transition-all duration-500 group-hover:w-full" />
                )}
              </motion.article>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={
            shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-8 flex flex-col gap-6 rounded-3xl bg-[#063b73] p-7 text-white md:flex-row md:items-center md:justify-between md:p-9"
        >
          <div>
            <p className="text-lg font-bold">
              Looking for a specific brand or product?
            </p>

            <p className="mt-1 text-sm text-blue-200">
              Tell us what you need and we'll help you find the right
              solution.
            </p>
          </div>

          <Link
            to="/contact"
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#f4511e] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#e44718] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            Request a Quote

            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default BrandsPreview;