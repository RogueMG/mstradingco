import { motion, useReducedMotion } from "motion/react";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  const centered = align === "center";

  return (
    <div
      className={`${
        centered ? "mx-auto text-center" : ""
      } max-w-3xl`}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className={`mb-4 flex items-center gap-3 ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-[2px] w-10 bg-[#f4511e]" />

        <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#f4511e]">
          {eyebrow}
        </span>
      </motion.div>

      <motion.h2
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-4xl font-bold leading-tight tracking-tight text-[#063b73] md:text-5xl"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`mt-5 text-base leading-7 text-slate-600 ${
            centered ? "mx-auto" : ""
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

export default SectionHeading;