import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";

function FinalCTA() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden bg-[#063b73] py-20 md:py-28"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#0b5fa5]/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#f4511e]/15 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={
            shouldReduceMotion ? false : { opacity: 0, y: 25 }
          }
          whileInView={
            shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] px-6 py-12 text-center backdrop-blur-sm md:px-12 md:py-16"
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#f4511e] to-transparent"
          />

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#f4511e]">
            Let's Work Together
          </span>

          <h2
            id="final-cta-heading"
            className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl"
          >
            Need the right safety equipment for your next requirement?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-blue-100/75 md:text-lg">
            Share your requirement with MS Trading Co. and let us help you
            identify the right products for your industrial or project needs.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/contact"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f4511e] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#d94316] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#063b73] sm:w-auto"
            >
              Get a Quote

              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <a
              href="tel:+918939575200"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-white transition duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
            >
              <Phone size={17} aria-hidden="true" />
              Call Us
            </a>

            <a
              href="https://wa.me/918939575200"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-white transition duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
            >
              <MessageCircle size={17} aria-hidden="true" />
              WhatsApp
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-blue-100/50">
            <span>B2B Industrial Supply</span>
            <span aria-hidden="true">•</span>
            <span>Chennai Based</span>
            <span aria-hidden="true">•</span>
            <span>GST Registered</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTA;