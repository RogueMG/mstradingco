import { ArrowDown, ArrowUpRight, Phone } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05294f] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(11,95,165,0.45),transparent_35%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(110deg,#05294f_0%,rgba(5,41,79,0.92)_38%,rgba(5,41,79,0.45)_70%,rgba(5,41,79,0.78)_100%)]" />

        {/* Technical grid */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      {/* Hero content */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-24 pt-32 md:px-10 lg:px-12">
        <div className="max-w-3xl">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-[#f4511e]" />

            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">
              Industrial Safety & Supplies
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl"
          >
            Safety that
            <br />
            works as hard
            <br />
            as your{" "}
            <span className="text-[#f4511e]">
              people.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-7 max-w-xl text-base leading-7 text-blue-100 md:text-lg"
          >
            Reliable industrial safety equipment, PPE, tools and
            workplace essentials supplied to businesses across Chennai
            and beyond.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              to="/products"
              className="group flex items-center gap-3 rounded-full bg-[#f4511e] px-6 py-3.5 text-sm font-bold text-white transition-all hover:gap-5 hover:bg-[#e44718]"
            >
              Explore Products
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:rotate-45"
              />
            </Link>

            <a
              href="tel:+918939575200"
              className="flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <Phone size={17} />
              Talk to Us
            </a>
          </motion.div>

        </div>
      </div>

      {/* Bottom trust strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#031f3b]/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-6 py-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-10 lg:px-12">

          <div className="py-3 sm:px-6 sm:py-0">
            <p className="text-sm font-semibold">
              Genuine Brands
            </p>
            <p className="mt-1 text-xs text-blue-200">
              Trusted safety products
            </p>
          </div>

          <div className="py-3 sm:px-6 sm:py-0">
            <p className="text-sm font-semibold">
              Bulk Supply
            </p>
            <p className="mt-1 text-xs text-blue-200">
              Built for industrial procurement
            </p>
          </div>

          <div className="py-3 sm:px-6 sm:py-0">
            <p className="text-sm font-semibold">
              Chennai Based
            </p>
            <p className="mt-1 text-xs text-blue-200">
              Serving businesses reliably
            </p>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-32 right-6 hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 lg:flex"
      >
        Scroll
        <ArrowDown size={15} />
      </motion.div>
    </section>
  );
}

export default Hero;