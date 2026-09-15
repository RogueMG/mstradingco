import {
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05294f] text-white">
      {/* =========================================================
          BACKGROUND
      ========================================================== */}
      <div className="absolute inset-0">
        {/* Industrial background image */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { scale: 1.05 }}
          animate={shouldReduceMotion ? undefined : { scale: 1 }}
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          <img
            src="/images/hero/industrial-safety.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>

        {/* Main dark overlay */}
        <div className="absolute inset-0 bg-[#031f3b]/75" />

        {/* Left-heavy gradient for text readability */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#031f3b_0%,rgba(3,31,59,0.96)_25%,rgba(5,41,79,0.78)_50%,rgba(5,41,79,0.35)_75%,rgba(3,31,59,0.65)_100%)]" />

        {/* Blue ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(11,95,165,0.35),transparent_32%)]" />

        {/* Orange ambient glow */}
        <div className="absolute bottom-0 left-[45%] h-[420px] w-[420px] rounded-full bg-[#f4511e]/10 blur-[120px]" />

        {/* Technical grid */}
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:80px_80px]" />

        {/* Technical vertical line */}
        <div className="absolute bottom-0 left-[8%] top-0 hidden w-px bg-white/10 lg:block" />
        <div className="absolute bottom-0 right-[8%] top-0 hidden w-px bg-white/10 lg:block" />
      </div>

      {/* =========================================================
          TOP META
      ========================================================== */}
      <div className="absolute left-6 right-6 top-28 z-10 md:left-10 md:right-10 lg:left-12 lg:right-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: -20 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55"
          >
            <MapPin size={13} className="text-[#f4511e]" />
            Chennai, Tamil Nadu
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: 20 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55 md:flex"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            B2B Industrial Supply
          </motion.div>
        </div>
      </div>

      {/* =========================================================
          HERO CONTENT
      ========================================================== */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-40 pt-40 md:px-10 lg:px-12">
        <div className="w-full">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.65 }}
              className="mb-7 flex items-center gap-3"
            >
              <span className="h-px w-12 bg-[#f4511e]" />

              <span className="text-xs font-bold uppercase tracking-[0.28em] text-blue-100">
                Industrial Safety & Supplies
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 35 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.85 }}
              className="max-w-4xl text-5xl font-bold leading-[0.92] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[6.7rem]"
            >
              Safety that
              <br />
              works as hard
              <br />
              as your{" "}
              <span className="relative inline-block text-[#f4511e]">
                people.
                <span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-[#f4511e]/70 md:-bottom-3 md:w-24" />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 25 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
              className="mt-8 max-w-2xl text-base leading-7 text-blue-50/85 md:text-lg md:leading-8"
            >
              Reliable industrial safety equipment, PPE, tools and
              workplace essentials supplied to businesses across Chennai
              and beyond.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="/products"
                className="group inline-flex items-center gap-3 rounded-full bg-[#f4511e] px-7 py-4 text-sm font-bold text-white shadow-[0_12px_40px_rgba(244,81,30,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e44718] hover:shadow-[0_16px_45px_rgba(244,81,30,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#05294f]"
              >
                Explore Products

                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
              </a>

              <a
                href="tel:+918939575200"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <Phone size={14} />
                </span>

                Talk to Us
              </a>
            </motion.div>

            {/* Mini assurance row */}
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/65"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22c55e]" />
                Genuine brands
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22c55e]" />
                Bulk supply
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22c55e]" />
                Procurement support
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FLOATING INDUSTRIAL CARD
      ========================================================== */}
      <motion.div
        initial={
          shouldReduceMotion
            ? undefined
            : { opacity: 0, y: 25, x: 20 }
        }
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: 1, y: 0, x: 0 }
        }
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-40 right-[8%] z-10 hidden w-[250px] lg:block xl:w-[280px]"
      >
        <div className="rounded-2xl border border-white/15 bg-[#031f3b]/65 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200/60">
                Safety First
              </p>

              <p className="mt-2 text-lg font-bold">
                Built for the workplace.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4511e]/15">
              <ShieldCheck
                size={21}
                className="text-[#f4511e]"
              />
            </div>
          </div>

          <div className="mt-5 h-px bg-white/10" />

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-white/45">
                Product Categories
              </p>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div>
              <p className="text-2xl font-bold">B2B</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-white/45">
                Supply Focus
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* =========================================================
          BOTTOM TRUST STRIP
      ========================================================== */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-[#031f3b]/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-6 py-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-10 lg:px-12">
          <div className="flex items-center gap-3 py-3 sm:px-6 sm:py-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
              <ShieldCheck size={17} className="text-[#f4511e]" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Genuine Brands
              </p>

              <p className="mt-0.5 text-[11px] text-blue-200/60">
                Trusted safety products
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 sm:px-6 sm:py-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
              <CheckCircle2 size={17} className="text-[#22c55e]" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Bulk Supply
              </p>

              <p className="mt-0.5 text-[11px] text-blue-200/60">
                Built for procurement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 sm:px-6 sm:py-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5">
              <MapPin size={17} className="text-[#f4511e]" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Chennai Based
              </p>

              <p className="mt-0.5 text-[11px] text-blue-200/60">
                Serving businesses reliably
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          SCROLL INDICATOR
      ========================================================== */}
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : { y: [0, 7, 0] }
        }
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-32 right-6 z-20 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45 lg:flex"
      >
        <span className="h-px w-8 bg-white/20" />
        Scroll
        <ArrowDown size={14} />
      </motion.div>
    </section>
  );
}

export default Hero;