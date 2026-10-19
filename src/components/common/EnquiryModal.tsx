import { useEffect, useId, useState } from "react";
import {
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
  company,
  emailLink,
  enquiryMessage,
  whatsappLink,
} from "../../data/company";

type Channel = "whatsapp" | "email";

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  category?: string | null;
  product?: string | null;
}

interface FormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  requirement: string;
  message: string;
  website: string;
}

const initialForm: FormData = {
  name: "",
  company: "",
  phone: "",
  email: "",
  requirement: "",
  message: "",
  website: "",
};

function EnquiryModal({
  open,
  onClose,
  category,
  product,
}: EnquiryModalProps) {
  // EnquiryProvider re-mounts this component on every open, so the
  // form starts fresh and pre-filled with what was enquired about.
  const [form, setForm] = useState<FormData>(() => ({
    ...initialForm,
    requirement: product || category || "",
  }));
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});
  const [sentVia, setSentVia] = useState<Channel | null>(null);

  const nameId = useId();
  const companyId = useId();
  const phoneId = useId();
  const emailId = useId();
  const requirementId = useId();
  const messageId = useId();

  /*
   * Lock page scrolling while modal is open.
   */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /*
   * Close on Escape.
   */
  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const updateField = (
    field: keyof FormData,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const validate = () => {
    const nextErrors: Partial<
      Record<keyof FormData, string>
    > = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!form.company.trim()) {
      nextErrors.company = "Please enter your company name.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Please enter your phone number.";
    } else if (!/^[+]?[0-9\s()-]{8,18}$/.test(form.phone)) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.requirement.trim()) {
      nextErrors.requirement =
        "Please tell us what you need.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /*
   * There is no backend: the enquiry is handed to WhatsApp or the
   * visitor's email app with every detail filled in, ready to send.
   */
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    /*
     * Honeypot spam protection.
     */
    if (form.website) {
      return;
    }

    if (!validate()) {
      return;
    }

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const channel: Channel =
      submitter?.value === "email" ? "email" : "whatsapp";
    const message = enquiryMessage(form);
    const subject = `Quote request: ${
      product || category || form.requirement
    }`.slice(0, 120);

    if (channel === "whatsapp") {
      window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    } else {
      window.location.href = emailLink(subject, message);
    }

    setSentVia(channel);
  };

  const handleClose = () => {
    setForm(initialForm);
    setErrors({});
    setSentVia(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close enquiry"
            onClick={handleClose}
            className="absolute inset-0 cursor-default bg-[#031f3b]/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-title"
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative flex max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* =================================================
                LEFT PANEL
            ================================================== */}
            <div className="hidden w-[36%] flex-col justify-between bg-[#063b73] p-8 text-white lg:flex">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4511e]">
                  <Send size={20} />
                </div>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                  Request a Quote
                </p>

                <h2 className="mt-3 text-3xl font-bold leading-tight">
                  Tell us what your business needs.
                </h2>

                <p className="mt-5 text-sm leading-7 text-blue-100/70">
                  Share your requirement and our team can
                  help identify the appropriate safety
                  products and supply options.
                </p>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex gap-3">
                  <Phone
                    size={17}
                    className="mt-0.5 text-[#f4511e]"
                  />

                  <div>
                    <p className="text-xs text-blue-200/60">
                      Call us
                    </p>

                    <a
                      href={company.phoneHref}
                      className="mt-1 block text-sm font-semibold hover:text-[#f4511e]"
                    >
                      {company.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail
                    size={17}
                    className="mt-0.5 text-[#f4511e]"
                  />

                  <div>
                    <p className="text-xs text-blue-200/60">
                      Email
                    </p>

                    <a
                      href={`mailto:${company.email}`}
                      className="mt-1 block text-sm font-semibold break-all hover:text-[#f4511e]"
                    >
                      {company.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                FORM AREA
            ================================================== */}
            <div className="relative flex-1 overflow-y-auto">
              {/* Close */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close enquiry form"
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] disabled:opacity-50"
              >
                <X size={18} />
              </button>

              <div className="p-6 sm:p-8 md:p-10">
                {sentVia ? (
                  /* =================================================
                      SUCCESS
                  ================================================== */
                  <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/10">
                      <CheckCircle2
                        size={34}
                        className="text-[#22c55e]"
                      />
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-[#063b73]">
                      Almost done: press send
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
                      {sentVia === "whatsapp"
                        ? "Your enquiry is filled in on WhatsApp. Press send there and our team will get back to you."
                        : "Your enquiry is filled in your email app. Press send there and our team will get back to you."}
                    </p>

                    <p className="mt-2 max-w-md text-xs leading-6 text-slate-400">
                      Nothing opened? Call {company.phone} or email{" "}
                      {company.email}.
                    </p>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="mt-8 rounded-full bg-[#063b73] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#052f5b]"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="pr-12">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4511e]">
                        Business Enquiry
                      </p>

                      <h2
                        id="enquiry-title"
                        className="mt-2 text-2xl font-bold tracking-tight text-[#063b73] sm:text-3xl"
                      >
                        Request a quote
                      </h2>

                      {(category || product) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {category && (
                            <span className="rounded-full bg-[#063b73]/5 px-3 py-1.5 text-xs font-semibold text-[#063b73]">
                              {category}
                            </span>
                          )}

                          {product && (
                            <span className="rounded-full bg-[#f4511e]/10 px-3 py-1.5 text-xs font-semibold text-[#f4511e]">
                              {product}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="mt-8 space-y-5"
                      noValidate
                    >
                      {/* Honeypot */}
                      <input
                        type="text"
                        name="website"
                        value={form.website}
                        onChange={(event) =>
                          updateField(
                            "website",
                            event.target.value,
                          )
                        }
                        tabIndex={-1}
                        autoComplete="off"
                        className="absolute left-[-9999px] h-0 w-0 opacity-0"
                        aria-hidden="true"
                      />

                      {/* Name + Company */}
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                          id={nameId}
                          label="Your Name"
                          required
                          value={form.name}
                          error={errors.name}
                          placeholder="Enter your name"
                          onChange={(value) =>
                            updateField("name", value)
                          }
                        />

                        <Field
                          id={companyId}
                          label="Company"
                          required
                          value={form.company}
                          error={errors.company}
                          placeholder="Company name"
                          onChange={(value) =>
                            updateField("company", value)
                          }
                        />
                      </div>

                      {/* Phone + Email */}
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                          id={phoneId}
                          label="Phone Number"
                          required
                          type="tel"
                          value={form.phone}
                          error={errors.phone}
                          placeholder="+91 XXXXX XXXXX"
                          onChange={(value) =>
                            updateField("phone", value)
                          }
                        />

                        <Field
                          id={emailId}
                          label="Business Email"
                          required
                          type="email"
                          value={form.email}
                          error={errors.email}
                          placeholder="name@company.com"
                          onChange={(value) =>
                            updateField("email", value)
                          }
                        />
                      </div>

                      {/* Requirement */}
                      <div>
                        <label
                          htmlFor={requirementId}
                          className="text-sm font-semibold text-slate-700"
                        >
                          Requirement{" "}
                          <span className="text-[#f4511e]">
                            *
                          </span>
                        </label>

                        <textarea
                          id={requirementId}
                          rows={3}
                          value={form.requirement}
                          onChange={(event) =>
                            updateField(
                              "requirement",
                              event.target.value,
                            )
                          }
                          placeholder="Tell us the products, quantities or safety requirements you need..."
                          className={`mt-2 w-full resize-none rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                            errors.requirement
                              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                              : "border-slate-200 focus:border-[#0b5fa5] focus:ring-[#0b5fa5]/10"
                          }`}
                        />

                        {errors.requirement && (
                          <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.requirement}
                          </p>
                        )}
                      </div>

                      {/* Additional message */}
                      <div>
                        <label
                          htmlFor={messageId}
                          className="text-sm font-semibold text-slate-700"
                        >
                          Additional Details
                          <span className="ml-1 text-xs font-normal text-slate-400">
                            Optional
                          </span>
                        </label>

                        <textarea
                          id={messageId}
                          rows={3}
                          value={form.message}
                          onChange={(event) =>
                            updateField(
                              "message",
                              event.target.value,
                            )
                          }
                          placeholder="Project details, delivery location, timeline, preferred brand, etc."
                          className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0b5fa5] focus:bg-white focus:ring-4 focus:ring-[#0b5fa5]/10"
                        />
                      </div>

                      {/* Submit */}
                      <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs leading-5 text-slate-400">
                          Opens WhatsApp or your email app with
                          these details filled in.
                        </p>

                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                          <button
                            type="submit"
                            value="whatsapp"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f4511e] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#f4511e]/20 transition hover:-translate-y-0.5 hover:bg-[#d94316] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] focus-visible:ring-offset-2"
                          >
                            <MessageCircle size={16} aria-hidden="true" />
                            Send on WhatsApp
                          </button>

                          <button
                            type="submit"
                            value="email"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#063b73]/20 px-6 py-3.5 text-sm font-bold text-[#063b73] transition hover:border-[#063b73] hover:bg-[#063b73] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4511e] focus-visible:ring-offset-2"
                          >
                            <Mail size={16} aria-hidden="true" />
                            Send by email
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   REUSABLE FIELD
========================================================= */

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function Field({
  id,
  label,
  required,
  type = "text",
  value,
  error,
  placeholder,
  onChange,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-semibold text-slate-700"
      >
        {label}{" "}
        {required && (
          <span className="text-[#f4511e]">*</span>
        )}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : undefined
        }
        className={`mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
            : "border-slate-200 focus:border-[#0b5fa5] focus:ring-[#0b5fa5]/10"
        }`}
      />

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default EnquiryModal;