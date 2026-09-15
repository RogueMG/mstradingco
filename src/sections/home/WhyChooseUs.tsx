import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const values = [
  {
    icon: ShieldCheck,
    title: "Genuine Brands",
    description:
      "Safety equipment and workplace products sourced from established industrial brands.",
  },
  {
    icon: Boxes,
    title: "Bulk Supply",
    description:
      "Supporting industrial and institutional procurement requirements with practical supply solutions.",
  },
  {
    icon: Clock3,
    title: "Prompt Delivery",
    description:
      "Focused on dependable fulfilment for businesses that need safety products when they need them.",
  },
  {
    icon: BadgeCheck,
    title: "Industry Support",
    description:
      "A straightforward B2B supply partner for safety equipment, PPE and professional tools.",
  },
];

const stats = [
  {
    value: "8",
    label: "Product Categories",
  },
  {
    value: "GST",
    label: "Registered Business",
  },
  {
    value: "CHN",
    label: "Chennai Based",
  },
  {
    value: "B2B",
    label: "Industrial Supply",
  },
];

function WhyChooseUs() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#0b5fa5]/5 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-[#f4511e]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mb-5 flex items-center gap-3"
            >
              <span className="h-[2px] w-10 bg-[#f4511e]" />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#f4511e]">
                Why MS Trading Co.
              </span>
            </motion.div>

            <motion.h2
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-[#063b73] sm:text-5xl lg:text-6xl"
            >
              Reliable supply.
              <br />
              Trusted brands.
              <br />
              <span className="text-[#f4511e]">
                Built for industry.
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="max-w-lg text-base leading-7 text-slate-600 md:text-lg">
              MS Trading Co. supplies industrial safety equipment, PPE and
              professional tools for businesses and institutional buyers.
              Our focus is simple: dependable products, practical support and
              a smooth procurement experience.
            </p>

            <a
              href="/about"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#063b73] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4511e]/30"
            >
              Learn more about us

              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#063b73]/20 transition-all duration-300 group-hover:border-[#f4511e] group-hover:bg-[#f4511e] group-hover:text-white">
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
              </span>
            </a>
          </motion.div>
        </div>

        {/* Value cards */}
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4"
        >
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <motion.article
                key={value.title}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 25,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                className="group relative bg-white p-7 transition-colors duration-300 hover:bg-[#063b73] focus-within:bg-[#063b73] md:p-8"
              >
                {/* Number */}
                <span className="absolute right-6 top-6 text-xs font-bold tracking-[0.15em] text-slate-300 transition-colors group-hover:text-white/30">
                  0{index + 1}
                </span>

                {/* Icon */}
                <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-xl border border-[#063b73]/10 bg-[#063b73]/5 text-[#063b73] transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white">
                  <Icon size={22} strokeWidth={1.8} />
                </div>

                <h3 className="text-xl font-bold text-[#063b73] transition-colors group-hover:text-white">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500 transition-colors group-hover:text-white/70">
                  {value.description}
                </p>

                <div className="mt-8 h-px w-0 bg-[#f4511e] transition-all duration-500 group-hover:w-10" />
              </motion.article>
            );
          })}
        </motion.div>

        {/* Trust / business strip */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mt-5 grid overflow-hidden rounded-3xl bg-[#063b73] sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`relative px-7 py-8 md:px-9 md:py-10 ${
                index !== stats.length - 1
                  ? "border-b border-white/10 sm:border-r lg:border-b-0"
                  : ""
              }`}
            >
              <div className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                {stat.value}
              </div>

              <div className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-blue-200">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default WhyChooseUs;