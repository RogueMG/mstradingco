
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
import { publicAsset } from "../lib/publicAsset";
import { usePageMeta } from "../lib/usePageMeta";
import LocationMap from "../components/common/LocationMap";
import Turnstile from "../components/common/Turnstile";
import { company, enquiryMessage, site, whatsappLink } from "../data/company";
import { useInterestOptions } from "../hooks/useInterestOptions";
import { submitEnquiry } from "../lib/enquiries";
import { formatAddress } from "../../shared/site";

// Site-wide facts come from Admin → Settings (see src/data/company.ts).
const BUSINESS_EMAIL = company.email;
const PRIMARY_PHONE = company.phoneHref.replace("tel:", "");
const DISPLAY_PHONE = company.phone;
const OFFICE_PHONE = company.landline;
const WHATSAPP_LINK = `https://wa.me/${company.whatsappNumber}`;

type ContactForm = {
  name: string;
  company: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
  website: string;
};

const initialForm: ContactForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  interest: "",
  message: "",
  website: "",
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
  usePageMeta(
    "Contact Us",
    `Contact ${company.name}, ${company.address}. Call ${company.phone} or send your requirement online or on WhatsApp.`,
  );

  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [prepared, setPrepared] = useState<"saved" | "whatsapp" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const interestGroups = useInterestOptions();

  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setPrepared(null);
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ContactForm, string>> = {};

    if (form.name.trim().length < 2) nextErrors.name = "Please enter your name.";

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (form.phone.trim() && (phoneDigits.length < 7 || phoneDigits.length > 15)) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Please describe your requirement.";
    } else if (form.message.trim().length < 10) {
      nextErrors.message = "Please provide at least 10 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  /*
   * Saves the enquiry (POST /api/enquiries): it lands in the admin inbox and,
   * once email is switched on, is emailed to the business.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPrepared(null);
    setFormError("");

    if (!validate()) return;

    setSubmitting(true);
    const result = await submitEnquiry({ ...form, turnstileToken });
    setSubmitting(false);

    if (result.ok) {
      setPrepared("saved");
      setForm(initialForm);
      return;
    }

    setFormError(result.message);
    if (result.fields) setErrors(result.fields as Partial<Record<keyof ContactForm, string>>);
  };

  /* Secondary option: send the same details on WhatsApp instead. */
  const handleWhatsApp = () => {
    if (form.name.trim().length < 2 || form.message.trim().length < 2) {
      setErrors({
        ...(form.name.trim().length < 2 ? { name: "Please enter your name." } : {}),
        ...(form.message.trim().length < 2 ? { message: "Please describe your requirement." } : {}),
      });
      return;
    }

    window.open(whatsappLink(enquiryMessage(form)), "_blank", "noopener,noreferrer");
    setPrepared("whatsapp");
  };

  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>

      <div className="overflow-hidden bg-white text-slate-900">
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
        {company.cityLine}
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
                Share your details and requirement. Your enquiry goes straight
                to our team, and we'll get back to you.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                {/* Honeypot: hidden from people, tempting to bots */}
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={(event) => updateField("website", event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  aria-hidden="true"
                />
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
                    htmlFor="interest"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Product or industry
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={form.interest}
                    onChange={(event) =>
                      updateField("interest", event.target.value)
                    }
                    aria-invalid={Boolean(errors.interest)}
                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    
                  >
                    <option value="">Not sure / general enquiry</option>
                    {interestGroups.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map((option) => (
                          <option key={`${group.label}-${option.value}`} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                    <option value="Bulk or project supply">Bulk or project supply</option>
                  </select>

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

                <Turnstile onToken={setTurnstileToken} />

                {formError && (
                  <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {formError}
                  </p>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Sending…" : "Send enquiry"}
                    <Send size={17} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-orange-500 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  >
                    <MessageCircle size={17} aria-hidden="true" />
                    Send on WhatsApp instead
                  </button>
                </div>

                {prepared && (
                  <p role="status" className="flex items-start gap-2 text-sm leading-6 text-emerald-700">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    {prepared === "saved"
                      ? "Thank you, we've received your enquiry and will get back to you shortly."
                      : "WhatsApp should open with your enquiry filled in. Press send there to reach us."}
                  </p>
                )}

                <p className="text-xs leading-5 text-slate-500">
                  Prefer to talk? Call {DISPLAY_PHONE} or email {BUSINESS_EMAIL}.
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
                    <div className="space-y-4">
                    {site.locations.map((location) => (
                      <div key={location.id}>
                        <h3 className="font-semibold">
                          {location.locality}, {location.region}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          {formatAddress(location)}
                        </p>
                      </div>
                    ))}
                    </div>
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
                      href={company.landlineHref}
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
                    {site.locations.some((location) => location.openingHours.length > 0) ? (
                      <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-300">
                        {site.locations.flatMap((location) =>
                          location.openingHours.map((hours) => (
                            <li key={`${location.id}-${hours}`}>
                              {site.locations.length > 1 ? `${location.name}: ` : ""}
                              {hours}
                            </li>
                          )),
                        )}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Please contact us to confirm current business hours and
                        availability before visiting.
                      </p>
                    )}
                  </div>
                </div>

                <p className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-slate-400">
                  GSTIN: {company.gstin}
                </p>
              </div>

              {site.locations.map((location) => (
                <LocationMap key={location.id} location={location} />
              ))}
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
      </div>
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
