import { ArrowUpRight, Building2 } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useState } from "react";
import { Link } from "react-router";

import { industries } from "../../data/industries";
import { publicAsset } from "../../lib/publicAsset";

function IndustriesPreview() {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndustry, setActiveIndustry] = useState(industries[0]);

  return (
    <section className="relative overflow-hidden bg-[#063b73] py-24 text-white md:py-32">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#0b5fa5]/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, x: 0 }
              }
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mb-5 flex items-center gap-3"
            >
              <span className="h-[2px] w-10 bg-[#f4511e]" />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff8a65]">
                Industries We Serve
              </span>
            </motion.div>

            <motion.h2
              initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
              whileInView={
                shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
              }
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Safety solutions for
              <br />
              <span className="text-[#ff8a65]">
                demanding workplaces.
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={
              shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
            }
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-md text-base leading-7 text-blue-100"
          >
            From construction sites to manufacturing facilities and
            logistics operations, we support businesses with practical
            safety and workplace supply requirements.
          </motion.p>
        </div>

        {/* Main interactive panel */}
        <div className="mt-14 grid overflow-hidden rounded-3xl border border-white/10 bg-[#031f3b] lg:grid-cols-[1.15fr_0.85fr]">
          {/* Image */}
          <div className="relative min-h-[420px] overflow-hidden lg:min-h-[620px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndustry.id}
                src={publicAsset(activeIndustry.image)}
                alt={`${activeIndustry.name} industry`}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, scale: 1.04 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 0, scale: 1.02 }
                }
                transition={{ duration: 0.6 }}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </AnimatePresence>

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#031f3b] via-transparent to-transparent" />

            {/* Featured industry */}
            <motion.div
              key={activeIndustry.id}
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-0 left-0 max-w-xl p-7 md:p-10"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4511e]">
                  <Building2 size={18} />
                </span>

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                  {activeIndustry.number} / 07
                </span>
              </div>

              <h3 className="text-3xl font-bold md:text-4xl">
                {activeIndustry.name}
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-6 text-white/70 md:text-base">
                {activeIndustry.description}
              </p>
            </motion.div>
          </div>

          {/* Industry navigation */}
          <div className="flex flex-col">
            <div className="flex-1">
              {industries.map((industry) => {
                const isActive = activeIndustry.id === industry.id;

                return (
                  <button
                    key={industry.id}
                    type="button"
                    onClick={() => setActiveIndustry(industry)}
                    onMouseEnter={() => setActiveIndustry(industry)}
                    aria-pressed={isActive}
                    className={`group relative flex w-full items-center gap-5 border-b border-white/10 px-6 py-5 text-left transition-colors duration-300 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#f4511e]/50 md:px-8 ${
                      isActive
                        ? "bg-white/[0.07]"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Active indicator */}
                    <span
                      className={`absolute bottom-0 left-0 top-0 w-1 bg-[#f4511e] transition-transform duration-300 ${
                        isActive
                          ? "scale-y-100"
                          : "scale-y-0"
                      }`}
                    />

                    <span
                      className={`w-7 shrink-0 text-xs font-bold tracking-[0.12em] transition-colors ${
                        isActive
                          ? "text-[#ff8a65]"
                          : "text-white/30"
                      }`}
                    >
                      {industry.number}
                    </span>

                    <span className="flex-1">
                      <span
                        className={`block text-sm font-bold transition-colors md:text-base ${
                          isActive
                            ? "text-white"
                            : "text-white/65 group-hover:text-white"
                        }`}
                      >
                        {industry.name}
                      </span>

                      <span className="mt-1 block text-xs text-white/35">
                        {industry.shortName}
                      </span>
                    </span>

                    <ArrowUpRight
                      size={17}
                      className={`shrink-0 transition-all duration-300 ${
                        isActive
                          ? "translate-x-0 text-[#ff8a65]"
                          : "-translate-x-1 text-white/20 group-hover:translate-x-0 group-hover:text-white/60"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/10 p-6 md:p-8">
              <Link
                to="/contact"
                className="group flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 p-5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/40"
              >
                <div>
                  <p className="text-sm font-bold">
                    Need safety supplies for your industry?
                  </p>

                  <p className="mt-1 text-xs text-blue-200">
                    Talk to our team about your requirements.
                  </p>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4511e]">
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:rotate-45"
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Note for draft content */}
        <p className="mt-5 text-xs text-blue-200/50">
          Industry coverage shown here is based on the current project
          specification and is subject to final client confirmation.
        </p>
      </div>
    </section>
  );
}

export default IndustriesPreview;