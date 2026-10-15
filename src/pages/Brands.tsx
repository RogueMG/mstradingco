import { motion } from "motion/react";
import { ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { brands } from "../data/brands";
import { useEnquiry } from "../hooks/useEnquiry";

function Brands() {
  const { openEnquiry } = useEnquiry();

  const confirmedBrands = brands.filter(
    (brand) => brand.status === "confirmed",
  );

  const pendingBrands = brands.filter(
    (brand) => brand.status === "pending",
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        {/* =====================================================
    HERO
====================================================== */}
<section className="relative isolate overflow-hidden bg-[#05294f] text-white">
  {/* Background image and visual effects */}
  <div className="absolute inset-0 -z-10" aria-hidden="true">
    {/* Animated industrial background */}
    <motion.div
      initial={{ scale: 1.06 }}
      animate={{ scale: 1 }}
      transition={{
        duration: 1.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="absolute inset-0"
    >
      <img
        src="/images/hero/about-industrial.png"
        alt=""
        className="h-full w-full object-cover object-center"
      />
    </motion.div>

    {/* Main dark overlay */}
    <div className="absolute inset-0 bg-[#031f3b]/70" />

    {/* Left-heavy gradient for heading readability */}
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
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
          Our Brands
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[5.8rem]">
        Trusted brands for
        <br />
        demanding{" "}
        <span className="relative inline-block text-[#f4511e]">
          workplaces.
          <span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-[#f4511e]/70 md:w-24" />
        </span>
      </h1>

      {/* Description */}
      <p className="mt-8 max-w-2xl text-base leading-8 text-blue-50/85 md:text-lg">
        We supply safety equipment, PPE and professional tools from
        established brands across our product range. Explore our
        brand network and contact us for your specific requirements.
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
          href="#confirmed-brands"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Explore Our Brands
        </a>
      </div>

      {/* Trust indicators */}
      <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#f4511e]" />
          Established brand ranges
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#22c55e]" />
          B2B procurement
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#22c55e]" />
          Requirement support
        </div>
      </div>
    </motion.div>
  </div>
</section>


        {/* =====================================================
            CONFIRMED BRANDS
        ====================================================== */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4511e]">
                  Brand Network
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#063b73] md:text-4xl">
                  Brands we currently represent
                </h2>
              </div>

              <p className="max-w-md text-sm leading-6 text-slate-500">
                Product availability and specific ranges may vary
                by requirement. Contact our team for current
                availability.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {confirmedBrands.map((brand, index) => (
                <motion.article
                  key={brand.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    delay: index * 0.04,
                    duration: 0.5,
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#0b5fa5]/20 hover:shadow-xl hover:shadow-slate-900/10"
                >
                  {/* Top accent */}
                  <div className="absolute left-0 right-0 top-0 h-1 bg-[#063b73] transition-colors group-hover:bg-[#f4511e]" />

                  <div className="flex items-start justify-between gap-5">
                    <div className="flex h-20 flex-1 items-center justify-start">
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        loading="lazy"
                        decoding="async"
                        className="max-h-16 max-w-[150px] object-contain"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";

                          const fallback =
                            event.currentTarget
                              .nextElementSibling as HTMLElement | null;

                          if (fallback) {
                            fallback.style.display = "block";
                          }
                        }}
                      />

                      <span
                        style={{ display: "none" }}
                        className="text-xl font-bold tracking-tight text-[#063b73]"
                      >
                        {brand.name}
                      </span>
                    </div>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22c55e]/10">
                      <CheckCircle2
                        size={17}
                        className="text-[#22c55e]"
                      />
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4511e]">
                      {brand.category}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-[#063b73]">
                      {brand.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {brand.description}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        openEnquiry(brand.category)
                      }
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#063b73] transition hover:text-[#f4511e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e]"
                    >
                      Enquire about products

                      <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            PROCUREMENT SECTION
        ====================================================== */}
        <section className="border-y border-slate-200 bg-[#f5f8fc] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4511e]">
                  Procurement Support
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#063b73] md:text-4xl">
                  Need a specific brand or product?
                </h2>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">
                  Share your requirement with our team. We can
                  help identify the appropriate product range
                  based on your workplace or project needs.
                </p>

                <button
                  type="button"
                  onClick={() => openEnquiry()}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f4511e] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#d94316] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] focus-visible:ring-offset-2"
                >
                  Send Your Requirement
                  <ArrowUpRight size={17} />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    title: "Genuine Brands",
                    description:
                      "Source products through established brand ranges.",
                  },
                  {
                    title: "Bulk Supply",
                    description:
                      "Suitable for business and project procurement.",
                  },
                  {
                    title: "Requirement Support",
                    description:
                      "Discuss your application and product needs.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#063b73]/5">
                      <ShieldCheck
                        size={19}
                        className="text-[#063b73]"
                      />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-[#063b73]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PENDING / CLIENT CONFIRMATION
        ====================================================== */}
        {pendingBrands.length > 0 && (
          <section className="py-16">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 md:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Client Confirmation
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#063b73]">
                  Additional brand relationships
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  The following brands are currently marked for
                  confirmation and are not presented as confirmed
                  supplier relationships.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {pendingBrands.map((brand) => (
                    <span
                      key={brand.id}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500"
                    >
                      {brand.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Brands;