
import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const BUSINESS_EMAIL = "mstrading52@yahoo.com";
const PRIMARY_PHONE = "+918939575200";
const DISPLAY_PHONE = "+91 89395 75200";
const OFFICE_PHONE = "044 4512 2249";
const WHATSAPP_LINK = `https://wa.me/${PRIMARY_PHONE.replace("+", "")}`;

type ContactForm = {
  name: string;
  company: string;
  phone: string;
  email: string;
  requirement: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  requirement: "",
  message: "",
};

const contactMethods = [
  {
    icon: Phone,
    eyebrow: "Call our team",
    title: DISPLAY_PHONE,
    description: "Speak to us about your product requirements.",
    href: `tel:${PRIMARY_PHONE}`,
    action: "Call now",
  },
  {
    icon: Mail,
    eyebrow: "Email enquiries",
    title: BUSINESS_EMAIL,
    description: "Send product details, quantities or specifications.",
    href: `mailto:${BUSINESS_EMAIL}`,
    action: "Send email",
  },
  {
    icon: MessageCircle,
    eyebrow: "WhatsApp",
    title: "Chat with our team",
    description: "Start a conversation about your supply needs.",
    href: WHATSAPP_LINK,
    action: "Open WhatsApp",
  },
];

function Contact() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [prepared, setPrepared] = useState(false);

  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setPrepared(false);
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ContactForm, string>> = {};

    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!form.company.trim()) nextErrors.company = "Please enter your company name.";

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!form.phone.trim()) {
      nextErrors.phone = "Please enter your phone number.";
    } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.requirement) {
      nextErrors.requirement = "Please select a requirement.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Please describe your requirement.";
    } else if (form.message.trim().length < 10) {
      nextErrors.message = "Please provide at least 10 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPrepared(false);

    if (!validate()) return;

    const subject = encodeURIComponent(
      `Website Enquiry — ${form.requirement} — ${form.company.trim()}`,
    );

    const body = encodeURIComponent(
      [
        "New website enquiry",
        "",
        `Name: ${form.name.trim()}`,
        `Company: ${form.company.trim()}`,
        `Phone: ${form.phone.trim()}`,
        `Email: ${form.email.trim()}`,
        `Requirement: ${form.requirement}`,
        "",
        "Details:",
        form.message.trim(),
      ].join("\n"),
    );

    setPrepared(true);
    window.location.href = `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`;
  };

  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Navbar />

      <main className="overflow-hidden bg-white text-slate-900">
        {/* Contact Hero */}
<section className="relative isolate overflow-hidden bg-[#05294f] text-white">
  {/* Background image and overlays */}
  <div
    className="absolute inset-0 -z-10"
    aria-hidden="true"
  >
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
        src="/images/hero/about-industrial.png"
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
  <motion.div
    initial="hidden"
    animate="visible"
    variants={reveal}
    transition={{ duration: 0.7 }}
    className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
  >
    {/* Eyebrow */}
    <p className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-orange-400">
      <span className="h-px w-12 bg-[#f4511e]" />
      Contact MS Trading Co.
    </p>

    {/* Heading */}
    <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
      Let’s discuss your industrial supply{" "}
      <span className="relative inline-block text-[#f4511e]">
        requirements.
        <span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-[#f4511e]/70 md:w-24" />
      </span>
    </h1>

    {/* Description */}
    <p className="mt-8 max-w-2xl text-base leading-8 text-blue-50/85 sm:text-lg">
      Looking for safety equipment, PPE, industrial tools or bulk
      supplies? Share your requirements with our Chennai team.
    </p>

    {/* CTA buttons */}
    <div className="mt-10 flex flex-wrap gap-4">
      <a
        href={`tel:${PRIMARY_PHONE}`}
        className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#f4511e] px-7 py-4 text-sm font-bold text-white shadow-[0_12px_40px_rgba(244,81,30,0.25)] transition duration-300 hover:-translate-y-1 hover:bg-[#e44718] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Phone size={17} />
        Call Us
        <ArrowRight
          size={17}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </a>

      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <MessageCircle size={17} />
        WhatsApp
      </a>
    </div>

    {/* Trust indicators */}
    <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/70">
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} className="text-[#22c55e]" />
        Business enquiries
      </div>

      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-[#f4511e]" />
        Industrial supply support
      </div>

      <div className="flex items-center gap-2">
        <MapPin size={16} className="text-[#f4511e]" />
        Chennai, Tamil Nadu
      </div>
    </div>
  </motion.div>
</section>

        {/* Contact methods */}
        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-10">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;

            return (
              <motion.a
                key={method.title}
                href={method.href}
                target={method.href.startsWith("https://") ? "_blank" : undefined}
                rel={method.href.startsWith("https://") ? "noreferrer" : undefined}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={reveal}
                transition={{
                  duration: 0.45,
                  delay: reduceMotion ? 0 : index * 0.07,
                }}
                className="group rounded-2xl border border-slate-200 p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                  <Icon size={22} />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {method.eyebrow}
                </p>
                <h2 className="mt-2 break-words text-lg font-bold text-slate-900">
                  {method.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {method.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orange-600">
                  {method.action}
                  <ArrowRight size={16} />
                </span>
              </motion.a>
            );
          })}
        </section>

        {/* Form and office details */}
        <section className="bg-[#f5f7fb] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={reveal}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-9"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                Send an enquiry
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                What do you need?
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Provide your contact details and requirement so the enquiry can
                be prepared for our business email.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    value={form.name}
                    onChange={(value) => updateField("name", value)}
                    error={errors.name}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                  <Field
                    label="Company name"
                    value={form.company}
                    onChange={(value) => updateField("company", value)}
                    error={errors.company}
                    placeholder="Company or organisation"
                    autoComplete="organization"
                  />
                  <Field
                    label="Phone number"
                    value={form.phone}
                    onChange={(value) => updateField("phone", value)}
                    error={errors.phone}
                    placeholder="+91 ..."
                    type="tel"
                    autoComplete="tel"
                  />
                  <Field
                    label="Business email"
                    value={form.email}
                    onChange={(value) => updateField("email", value)}
                    error={errors.email}
                    placeholder="you@company.com"
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="requirement"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Requirement type <span className="text-orange-600">*</span>
                  </label>
                  <select
                    id="requirement"
                    name="requirement"
                    value={form.requirement}
                    onChange={(event) =>
                      updateField("requirement", event.target.value)
                    }
                    aria-invalid={Boolean(errors.requirement)}
                    aria-describedby={errors.requirement ? "requirement-error" : undefined}
                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    required
                  >
                    <option value="">Select a requirement</option>
                    <option value="Safety equipment and PPE">Safety equipment and PPE</option>
                    <option value="Safety footwear">Safety footwear</option>
                    <option value="Power tools">Power tools</option>
                    <option value="Hand tools">Hand tools</option>
                    <option value="Road and site safety">Road and site safety</option>
                    <option value="Steel and hardware">Steel and hardware</option>
                    <option value="Bulk or project supply">Bulk or project supply</option>
                    <option value="Other requirement">Other requirement</option>
                  </select>
                  {errors.requirement && (
                    <p id="requirement-error" role="alert" className="mt-2 text-sm text-red-600">
                      {errors.requirement}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Requirement details <span className="text-orange-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    rows={5}
                    maxLength={3000}
                    placeholder="Mention product names, quantities, specifications and delivery location..."
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    required
                  />
                  <div className="mt-2 flex items-start justify-between gap-3">
                    {errors.message ? (
                      <p id="message-error" role="alert" className="text-sm text-red-600">
                        {errors.message}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Please include quantities or specifications if available.
                      </p>
                    )}
                    <span className="shrink-0 text-xs text-slate-400">
                      {form.message.length}/3000
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                >
                  Prepare Email Enquiry
                  <Send size={17} />
                </button>

                {prepared && (
                  <p role="status" className="flex items-start gap-2 text-sm leading-6 text-emerald-700">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    Your email application should open with the enquiry details.
                    Please review and send the email to complete the submission.
                  </p>
                )}

                <p className="text-xs leading-5 text-slate-500">
                  This form uses your device’s configured email application. If
                  nothing opens, email us directly at {BUSINESS_EMAIL}.
                </p>
              </form>
            </motion.div>

            {/* Office information */}
            <motion.aside
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={reveal}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="space-y-5"
            >
              <div className="rounded-2xl bg-[#081a33] p-6 text-white sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                  Our office
                </p>
                <h2 className="mt-3 text-2xl font-bold">Visit MS Trading Co.</h2>

                <div className="mt-7 flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange-400">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Chennai, Tamil Nadu</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      No. 232/178, Linghi Chetty Street,
                      <br />
                      Chennai – 600 001,
                      <br />
                      Tamil Nadu, India.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-4 border-t border-white/10 pt-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange-400">
                    <Phone size={21} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Contact numbers</h3>
                    <a
                      href={`tel:${PRIMARY_PHONE}`}
                      className="mt-2 block text-sm text-slate-300 transition hover:text-white"
                    >
                      {DISPLAY_PHONE}
                    </a>
                    <a
                      href="tel:+914445122249"
                      className="mt-1 block text-sm text-slate-300 transition hover:text-white"
                    >
                      {OFFICE_PHONE}
                    </a>
                  </div>
                </div>

                <div className="mt-6 flex gap-4 border-t border-white/10 pt-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange-400">
                    <Mail size={21} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold">Email</h3>
                    <a
                      href={`mailto:${BUSINESS_EMAIL}`}
                      className="mt-2 break-all text-sm text-slate-300 transition hover:text-white"
                    >
                      {BUSINESS_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="mt-6 flex gap-4 border-t border-white/10 pt-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange-400">
                    <Clock3 size={21} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business hours</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Please contact us to confirm current business hours and
                      availability before visiting.
                    </p>
                  </div>
                </div>

                <p className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-slate-400">
                  GSTIN: 33GFZPM1541E1Z9
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="p-5">
                  <h3 className="font-bold">Find our office</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    View the office location on Google Maps before planning
                    your visit.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=No.+232%2F178%2C+Linghi+Chetty+Street%2C+Chennai+600001%2C+Tamil+Nadu%2C+India"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    Open in Google Maps
                    <ArrowRight size={16} />
                  </a>
                </div>
                <div className="border-t border-slate-200 bg-slate-100 p-4">
                  <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 text-center">
                    <div>
                      <MapPin className="mx-auto text-orange-500" size={25} />
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        Linghi Chetty Street, Chennai
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Google Maps opens separately
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-2xl border border-slate-200 p-6 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Prefer a quick conversation?
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Call our team or start a WhatsApp conversation about your
                requirement.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${PRIMARY_PHONE}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#081a33] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#10294b]"
              >
                <Phone size={16} />
                Call Us
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
};

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  autoComplete,
}: FieldProps) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label} <span className="text-orange-600">*</span>
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        required
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Contact;
