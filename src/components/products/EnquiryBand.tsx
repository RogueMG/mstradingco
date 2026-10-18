import { Mail, MessageCircle, Phone } from "lucide-react";

import { company, emailLink, whatsappLink } from "../../data/company";

interface EnquiryBandProps {
  title: string;
  description: string;
  /** What the enquiry is about, used to pre-fill WhatsApp and email. */
  subject: string;
}

/** Navy call-to-action band with WhatsApp, email and call buttons. */
function EnquiryBand({ title, description, subject }: EnquiryBandProps) {
  const message = `Hello ${company.name}, I'd like a quote for ${subject}.`;

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-[#063b73] p-7 text-white md:p-9 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-lg font-bold">{title}</p>
        <p className="mt-1 text-sm text-blue-200">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f4511e] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#e44718] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        >
          <MessageCircle size={17} aria-hidden="true" />
          WhatsApp
        </a>

        <a
          href={emailLink(`Quote request: ${subject}`, message)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white hover:text-[#063b73] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        >
          <Mail size={17} aria-hidden="true" />
          Email
        </a>

        <a
          href={company.phoneHref}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white hover:text-[#063b73] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        >
          <Phone size={17} aria-hidden="true" />
          Call
        </a>
      </div>
    </div>
  );
}

export default EnquiryBand;
