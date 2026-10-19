
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Link } from "react-router";
import { publicAsset } from "../lib/publicAsset";
import { usePageMeta } from "../lib/usePageMeta";
import { useEnquiry } from "../hooks/useEnquiry";
import { useCategories, useIndustries } from "../lib/content/hooks";

const strengths = [
  {
    icon: ShieldCheck,
    title: "Safety-focused supply",
    description:
      "Industrial safety equipment and PPE for workplace protection requirements.",
  },
  {
    icon: PackageCheck,
    title: "B2B procurement",
    description:
      "A practical sourcing point for businesses, contractors and institutional buyers.",
  },
  {
    icon: Truck,
    title: "Supply coordination",
    description:
      "Support for coordinating product requirements and delivery arrangements.",
  },
  {
    icon: Headphones,
    title: "Requirement support",
    description:
      "Get in touch to discuss product categories, quantities and your project needs.",
  },
];

function About() {
  usePageMeta(
    "About Us",
    "MS Trading Co. supplies industrial safety equipment, PPE and professional tools to businesses in Chennai and beyond.",
  );

  const reduceMotion = useReducedMotion();
  const { openEnquiry } = useEnquiry();
  const categoriesResult = useCategories();
  const industriesResult = useIndustries();
  const categories =
    categoriesResult.status === "ready" ? categoriesResult.data : [];
  const industries =
    industriesResult.status === "ready" ? industriesResult.data : [];

  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>

      <div className="overflow-hidden bg-white text-slate-900">
        {/* About Hero */}
<section className="relative isolate overflow-hidden bg-[#05294f] text-white">
  {/* Background image and overlays */}
  <div className="absolute inset-0 -z-10" aria-hidden="true">
    {/* Animated industrial background */}
    <motion.div
      initial={reduceMotion ? undefined : { scale: 1.06 }}
      animate={reduceMotion ? undefined : { scale: 1 }}
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
    <div className="absolute inset-0 bg-[#031f3b]/75" />

    {/* Left-to-right gradient for text readability */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#031f3b] via-[#031f3b]/90 to-[#05294f]/35" />

    {/* Blue ambient glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(11,95,165,0.3),transparent_35%)]" />

    {/* Orange ambient glow */}
    <div className="absolute bottom-0 left-[40%] h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />

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
  <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 sm:py-28 lg:min-h-[760px] lg:grid-cols-[1.15fr_.85fr] lg:px-12 lg:py-32">
    {/* Left content */}
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 25 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative z-10"
    >
      <p className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-blue-100/80">
        <span className="h-px w-12 bg-orange-500" />
        About MS Trading Co.
      </p>

      <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
        Supplying the essentials that help workplaces{" "}
        <span className="relative inline-block text-orange-500">
          work safely.
          <span className="absolute -bottom-2 left-0 h-1 w-20 rounded-full bg-orange-500/70" />
        </span>
      </h1>

      <p className="mt-8 max-w-2xl text-base leading-8 text-blue-50/85 sm:text-lg">
        MS Trading Co. is a Chennai-based supplier of industrial
        safety equipment, personal protective equipment, tools and
        workplace essentials for business and institutional requirements.
      </p>

      {/* Action buttons */}
      <div className="mt-10 flex flex-wrap gap-4">
        <button
          onClick={() => openEnquiry()}
          className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-orange-500 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-orange-950/20 transition duration-300 hover:-translate-y-1 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Discuss Your Requirement
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>

        <Link
          to="/products"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Explore Products
        </Link>
      </div>

      {/* Trust indicators */}
      <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/70">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-orange-400" />
          Safety-focused supply
        </div>

        <div className="flex items-center gap-2">
          <BadgeCheck size={16} className="text-orange-400" />
          B2B procurement
        </div>

        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-orange-400" />
          Chennai-based business
        </div>
      </div>
    </motion.div>

    {/* Floating business information card */}
    <motion.div
      initial={
        reduceMotion ? undefined : { opacity: 0, y: 25, x: 15 }
      }
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.8, delay: 0.45 }}
      className="relative z-10"
    >
      <div className="rounded-3xl border border-white/15 bg-[#031f3b]/65 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200/60">
              Our business focus
            </p>

            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              Industrial supply.
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">
              Practical sourcing support for workplace safety,
              industrial tools and project requirements.
            </p>
          </div>

          <div className="shrink-0 rounded-2xl bg-orange-500/15 p-3 text-orange-400">
            <Building2 size={27} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-5">
          {[
            ["01", "Safety equipment"],
            ["02", "Personal protection"],
            ["03", "Industrial tools"],
            ["04", "B2B enquiries"],
          ].map(([number, label]) => (
            <div
              key={number}
              className="rounded-xl border border-white/10 bg-white/[0.05] p-4 transition hover:border-orange-500/40 hover:bg-white/[0.08]"
            >
              <span className="text-xs font-bold tracking-widest text-orange-400">
                {number}
              </span>

              <p className="mt-3 text-sm font-semibold text-white">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4">
          <ShieldCheck size={23} className="shrink-0 text-orange-400" />

          <p className="text-sm leading-6 text-slate-300">
            Supporting commercial and industrial supply needs.
          </p>
        </div>
      </div>

      {/* Card accent glow */}
      <div
        aria-hidden="true"
        className="absolute -bottom-5 -left-5 -z-10 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl"
      />
    </motion.div>
  </div>

  {/* Bottom trust strip */}
  <div className="relative z-10 border-t border-white/10 bg-[#031f3b]/80 backdrop-blur-xl">
    <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-5 py-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
      {[
        ["Safety First", "Workplace protection products"],
        ["B2B Supply", "Business and project requirements"],
        ["Chennai Based", "Industrial supply coordination"],
      ].map(([title, description]) => (
        <div key={title} className="px-4 py-4 sm:px-6">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-xs leading-5 text-blue-100/60">
            {description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>


        {/* Introduction */}
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
            transition={{ duration: 0.55 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Who we are
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              A practical sourcing partner for industrial requirements.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={reveal}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="space-y-5 text-base leading-8 text-slate-600"
          >
            <p>
              Industrial buyers often need to source different types of
              protective equipment and tools for their teams, facilities and
              projects. MS Trading Co. brings these requirements into one
              enquiry-led supply experience.
            </p>
            <p>
              Whether you are identifying a product category or preparing a
              bulk requirement, contact our team with your specifications,
              quantities and delivery needs so that the appropriate options can
              be discussed.
            </p>
            <p className="rounded-r-xl border-l-4 border-orange-500 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-700">
              We are a supplier and stockist, not a product manufacturer.
              Product availability, specifications and brand relationships
              should be confirmed for each requirement.
            </p>
          </motion.div>
        </section>

        {/* Strengths */}
        <section className="bg-[#f5f7fb] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                Why work with us
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Focused on your supply requirements.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                A straightforward way for business buyers to enquire about
                industrial safety products, tools and related supplies.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {strengths.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={reveal}
                    transition={{
                      duration: 0.45,
                      delay: reduceMotion ? 0 : index * 0.07,
                    }}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#081a33] text-orange-400 transition group-hover:bg-orange-500 group-hover:text-white">
                      <Icon size={23} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product coverage */}
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              What we supply
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Product categories for everyday industrial needs.
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Browse our product categories to identify the items you need.
              For bulk orders or project requirements, send us the product
              details and required quantities.
            </p>
            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#081a33] transition hover:text-orange-600"
            >
              Browse all product categories
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/products/${category.slug}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-orange-300 hover:bg-orange-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {category.title}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Industries */}
        <section className="bg-[#081a33] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                Industries
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Supporting varied workplace environments.
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Contact us to discuss the equipment and tools relevant to your
                application. Industry coverage is subject to confirmation.
              </p>
            </div>
            <Link
              to="/industries"
              className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-lg border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 lg:self-auto"
            >
              Explore industries
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="mx-auto mt-9 grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <div
                key={industry.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-medium text-slate-200"
              >
                <ClipboardCheck
                  size={18}
                  className="shrink-0 text-orange-400"
                />
                {industry.title}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-2xl bg-orange-500 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Have a product or bulk supply requirement?
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-white/90">
                Tell us what you need and our team can discuss the next steps.
              </p>
            </div>
            <button
              onClick={() => openEnquiry()}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#081a33] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#10294b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
            >
              Request a Quote
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
