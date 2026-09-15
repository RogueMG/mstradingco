import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import {
  ArrowUpRight,
  Building2,
  ClipboardCheck,
  Factory,
  ShieldCheck,
  Truck,
} from "lucide-react";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Genuine Products",
    description:
      "Source safety equipment from established brands specified for industrial and workplace requirements.",
  },
  {
    icon: Factory,
    title: "Industrial Focus",
    description:
      "Built around the requirements of factories, projects, contractors and institutional buyers.",
  },
  {
    icon: Truck,
    title: "Bulk Supply",
    description:
      "A practical supply partner for recurring and project-based procurement requirements.",
  },
  {
    icon: ClipboardCheck,
    title: "Procurement Support",
    description:
      "Get assistance identifying suitable products and preparing your enquiry requirements.",
  },
];

function ClientTrust() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="client-trust-heading"
      className="relative overflow-hidden bg-[#f5f8fc] py-24 md:py-32"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#0b5fa5]/5 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          {/* Left content */}
          <motion.div
            initial={
              shouldReduceMotion ? false : { opacity: 0, x: -30 }
            }
            whileInView={
              shouldReduceMotion ? undefined : { opacity: 1, x: 0 }
            }
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#f4511e]" />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#f4511e]">
                Built for Industry
              </span>
            </div>

            <h2
              id="client-trust-heading"
              className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#063b73] md:text-5xl"
            >
              A supply partner for demanding workplaces.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
              From everyday PPE requirements to project-based procurement,
              MS Trading Co. is positioned to support organisations looking
              for dependable industrial safety and hardware supplies.
            </p>

            <div className="mt-8">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-[#f4511e] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-[#d94316] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] focus-visible:ring-offset-2"
              >
                Discuss Your Requirement

                <ArrowUpRight
                  size={17}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            <div className="mt-8 flex items-start gap-3 border-t border-slate-200 pt-6">
              <Building2
                size={20}
                className="mt-0.5 shrink-0 text-[#0b5fa5]"
                aria-hidden="true"
              />

              <p className="text-sm leading-6 text-slate-500">
                B2B industrial supply from Chennai, serving procurement and
                project requirements.
              </p>
            </div>
          </motion.div>

          {/* Right trust cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {trustPoints.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, y: 25 }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#0b5fa5]/20 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[#0b5fa5]/5 transition duration-300 group-hover:bg-[#f4511e]/10" />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#063b73]/5 text-[#063b73] transition duration-300 group-hover:bg-[#f4511e] group-hover:text-white">
                      <Icon size={22} aria-hidden="true" />
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-[#063b73]">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Client showcase placeholder */}
        <motion.div
          initial={
            shouldReduceMotion ? false : { opacity: 0, y: 25 }
          }
          whileInView={
            shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16 rounded-3xl bg-[#063b73] px-6 py-10 text-center md:px-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f4511e]">
            Client Showcase
          </p>

          <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">
            Trusted by teams that put safety first.
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100/75">
            Client names, logos and testimonials will be displayed here once
            approved and supplied by MS Trading Co.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              "Client Logo",
              "Client Logo",
              "Client Logo",
              "Client Logo",
            ].map((label, index) => (
              <div
                key={`${label}-${index}`}
                className="flex min-h-20 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold uppercase tracking-wider text-white/35"
              >
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ClientTrust;