import { useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Factory,
  HardHat,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { publicAsset } from "../lib/publicAsset";
import { usePageMeta } from "../lib/usePageMeta";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import ContentImg from "../components/ui/ContentImg";
import { useEnquiry } from "../hooks/useEnquiry";
import { useIndustries } from "../lib/content/hooks";

const industryIcons = [
  HardHat,
  Factory,
  Building2,
  ShieldCheck,
  Factory,
  Building2,
  Truck,
];

function Industries() {
  usePageMeta(
    "Industries We Serve",
    "Safety equipment and PPE for construction, manufacturing, energy, pharma, food processing, infrastructure and logistics.",
  );

  const shouldReduceMotion = useReducedMotion();
  const { openEnquiry } = useEnquiry();

  const result = useIndustries();
  const industries = result.status === "ready" ? result.data : [];

  const [activeIndustry, setActiveIndustry] = useState("");

  const active =
    industries.find((industry) => industry.id === activeIndustry) ??
    industries[0];
  const activeNumber = String(
    Math.max(industries.indexOf(active), 0) + 1,
  ).padStart(2, "0");

  const handleIndustryChange = (id: string) => {
    setActiveIndustry(id);
  };

  return (
    <>

      <div className="min-h-screen bg-white">
       {/* =====================================================
    HERO
====================================================== */}
<section className="relative isolate overflow-hidden bg-[#05294f] text-white">
  {/* Background image and visual effects */}
  <div className="absolute inset-0 -z-10" aria-hidden="true">
    {/* Animated industrial background */}
    <motion.div
      initial={shouldReduceMotion ? undefined : { scale: 1.06 }}
      animate={shouldReduceMotion ? undefined : { scale: 1 }}
      transition={{
        duration: 1.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="absolute inset-0"
    >
      <img
        src={publicAsset("/images/hero/about-industrial.png")}
        alt=""
        className="h-full w-full object-cover object-center"
      />
    </motion.div>

    {/* Main dark overlay */}
    <div className="absolute inset-0 bg-[#031f3b]/70" />

    {/* Left-heavy gradient for text readability */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#031f3b] via-[#031f3b]/90 to-[#05294f]/35" />

    {/* Blue ambient glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(11,95,165,0.35),transparent_35%)]" />

    {/* Orange ambient glow */}
    <div className="absolute bottom-0 left-[40%] h-[350px] w-[350px] rounded-full bg-[#f4511e]/10 blur-[120px]" />

    {/* Technical grid */}
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    />

    {/* Decorative vertical lines */}
    <div className="absolute inset-y-0 left-[8%] hidden w-px bg-white/10 lg:block" />
    <div className="absolute inset-y-0 right-[8%] hidden w-px bg-white/10 lg:block" />
  </div>

  {/* Hero content */}
  <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-36 sm:px-8 md:pb-28 md:pt-44 lg:px-12">
    <motion.div
      initial={
        shouldReduceMotion ? undefined : { opacity: 0, y: 30 }
      }
      animate={
        shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
      }
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="max-w-4xl"
    >
      {/* Eyebrow */}
      <div className="mb-6 flex items-center gap-3">
        <span className="h-[2px] w-12 bg-[#f4511e]" />

        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff7043]">
          Industries We Serve
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[5.8rem]">
        Safety solutions for
        <br />
        every{" "}
        <span className="relative inline-block text-[#f4511e]">
          workplace.
          <span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-[#f4511e]/70 md:w-24" />
        </span>
      </h1>

      {/* Description */}
      <p className="mt-8 max-w-2xl text-base leading-8 text-blue-50/85 md:text-lg">
        Supporting industrial, construction, infrastructure and
        commercial requirements with safety equipment, PPE and
        workplace essentials.
      </p>

      {/* CTA buttons */}
      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => openEnquiry()}
          className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#f4511e] px-7 py-4 text-sm font-bold text-white shadow-[0_12px_40px_rgba(244,81,30,0.25)] transition duration-300 hover:-translate-y-1 hover:bg-[#e44718] hover:shadow-[0_16px_45px_rgba(244,81,30,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Discuss Your Requirement
          <ArrowUpRight
            size={18}
            className="transition-transform duration-300 group-hover:rotate-45"
          />
        </button>

        <a
          href="#industry-coverage"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Explore Industries
        </a>
      </div>

      {/* Trust indicators */}
      <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#f4511e]" />
          Workplace protection
        </div>

        <div className="flex items-center gap-2">
          <HardHat size={16} className="text-[#f4511e]" />
          Industrial PPE
        </div>

        <div className="flex items-center gap-2">
          <Truck size={16} className="text-[#f4511e]" />
          Project supply support
        </div>
      </div>
    </motion.div>
  </div>
</section>

        {/* =====================================================
            INTERACTIVE INDUSTRIES
        ====================================================== */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4511e]">
                Industry Coverage
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#063b73] md:text-4xl">
                Protection aligned with your environment
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-500">
                Different workplaces demand different safety
                requirements. Explore the industries covered by our
                current project specification.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
              {/* =================================================
                  INDUSTRY NAVIGATION
              ================================================== */}
              <aside>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
                  {industries.map((industry, index) => {
                    const isActive =
                      industry.id === active?.id;

                    const Icon =
                      industryIcons[index] ?? Building2;

                    return (
                      <button
                        key={industry.id}
                        type="button"
                        onClick={() =>
                          handleIndustryChange(industry.id)
                        }
                        aria-pressed={isActive}
                        className={`group flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] ${
                          isActive
                            ? "bg-[#063b73] text-white shadow-lg shadow-[#063b73]/15"
                            : "text-slate-600 hover:bg-white hover:text-[#063b73]"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                            isActive
                              ? "bg-white/10"
                              : "bg-[#063b73]/5 group-hover:bg-[#063b73]/10"
                          }`}
                        >
                          <Icon size={17} />
                        </span>

                        <span className="flex-1">
                          <span className="block text-sm font-semibold">
                            {industry.title}
                          </span>

                          <span
                            className={`mt-0.5 block text-[10px] uppercase tracking-[0.12em] ${
                              isActive
                                ? "text-blue-200/60"
                                : "text-slate-400"
                            }`}
                          >
                            Sector {String(index + 1).padStart(2, "0")}
                          </span>
                        </span>

                        <span
                          className={`text-xs font-bold ${
                            isActive
                              ? "text-[#f4511e]"
                              : "text-slate-300"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Confirmation note */}
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <p className="text-xs font-semibold leading-5 text-slate-500">
                    Industry coverage shown here is based on the
                    current project specification and is subject
                    to final client confirmation.
                  </p>
                </div>
              </aside>

              {/* =================================================
                  LARGE VISUAL PANEL
              ================================================== */}
              <div className="min-w-0">
                <AnimatePresence mode="wait">
                  {active && (
                    <motion.div
                      key={active.id}
                      initial={
                        shouldReduceMotion
                          ? undefined
                          : { opacity: 0, y: 15 }
                      }
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : { opacity: 1, y: 0 }
                      }
                      exit={
                        shouldReduceMotion
                          ? undefined
                          : { opacity: 0, y: -10 }
                      }
                      transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group relative min-h-[560px] overflow-hidden rounded-3xl bg-[#05294f] md:min-h-[620px]"
                    >
                      {/* Image */}
                      <motion.div
                        className="absolute inset-0"
                        initial={
                          shouldReduceMotion
                            ? undefined
                            : { scale: 1.05 }
                        }
                        animate={
                          shouldReduceMotion
                            ? undefined
                            : { scale: 1 }
                        }
                        transition={{
                          duration: 0.9,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <ContentImg
                          key={active.id}
                          image={active.image}
                          fallbackAlt={active.title}
                          sizes="(min-width: 1024px) 60vw, 100vw"
                          width={1280}
                          loading="eager"
                          className="h-full w-full object-cover"
                        />
                      </motion.div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#031f3b] via-[#031f3b]/60 to-[#031f3b]/10" />

                      {/* Side gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#031f3b]/75 via-transparent to-transparent" />

                      {/* Decorative frame */}
                      <div className="absolute inset-5 rounded-2xl border border-white/10" />

                      {/* Content */}
                      <div className="relative flex min-h-[560px] flex-col justify-between p-8 md:min-h-[620px] md:p-10">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="h-[2px] w-10 bg-[#f4511e]" />

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/65">
                              Industry {activeNumber}
                            </span>
                          </div>

                          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md">
                            <ShieldCheck
                              size={20}
                              className="text-white"
                            />
                          </div>
                        </div>

                        <div className="max-w-2xl">
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ff7043]">
                            {active.label}
                          </p>

                          <h3 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
                            {active.title}
                          </h3>

                          <p className="mt-5 max-w-xl text-sm leading-7 text-blue-50/75 md:text-base">
                            {active.summary}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              openEnquiry(active.title)
                            }
                            className="group mt-7 inline-flex items-center gap-3 rounded-full bg-[#f4511e] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#d94316] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            Discuss Your Requirement

                            <ArrowUpRight
                              size={17}
                              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            INDUSTRY APPLICATIONS
        ====================================================== */}
        <section className="border-y border-slate-200 bg-[#f5f8fc] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4511e]">
                  Built Around Requirements
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#063b73] md:text-4xl">
                  From site safety to industrial PPE
                </h2>

                <p className="mt-5 text-base leading-7 text-slate-500">
                  Our product range is structured around practical
                  workplace and project requirements rather than a
                  one-size-fits-all approach.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Personal Protective Equipment",
                  "Workplace Safety Equipment",
                  "Road & Site Safety",
                  "Professional Tools",
                  "Fall Protection",
                  "Industrial Essentials",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.45,
                    }}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#063b73]/5">
                      <ShieldCheck
                        size={19}
                        className="text-[#063b73]"
                      />
                    </div>

                    <span className="text-sm font-semibold text-[#063b73]">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}
        <section className="bg-[#063b73] py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff7043]">
              Have a Project Requirement?
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Let's identify the right safety products for your team.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-blue-100/70 md:text-base">
              Tell us about your workplace, project or procurement
              requirement and our team can help you identify the
              appropriate product range.
            </p>

            <button
              type="button"
              onClick={() => openEnquiry()}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#f4511e] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:bg-[#d94316] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Send Your Requirement
              <ArrowUpRight size={18} />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default Industries;