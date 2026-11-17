import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router";

import { company, whatsappLink } from "../../data/company";

/**
 * The page or product the visitor is on, from the document title set by
 * usePageMeta ("Industrial Safety Gloves | MS Trading Co." → "Industrial Safety Gloves").
 */
function currentPageName(): string {
  const suffix = ` | ${company.name}`;
  const title = document.title;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length) : "";
}

function messageFor(pathname: string): string {
  const page = currentPageName();

  if (pathname === "/" || !page) {
    return `Hello ${company.name}, I'd like to know more about your products.`;
  }

  return `Hello ${company.name}, I'm interested in "${page}" (${window.location.origin}${pathname}). Could you share details and a quote?`;
}

/**
 * Floating WhatsApp chat button on every public page (bottom-right, below the
 * enquiry popup's layer). The pre-filled message is built at click time so it
 * names the page or product the visitor is looking at.
 */
function WhatsAppButton() {
  const { pathname } = useLocation();

  return (
    <a
      href={whatsappLink(`Hello ${company.name}, I'd like to know more about your products.`)}
      onClick={(event) => {
        event.currentTarget.href = whatsappLink(messageFor(pathname));
      }}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with ${company.name} on WhatsApp`}
      title="Chat on WhatsApp"
      className="fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-slate-900/20 transition hover:scale-105 hover:bg-[#1ebe5b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 sm:right-6"
      style={{ bottom: "max(1rem, calc(env(safe-area-inset-bottom) + 0.75rem))" }}
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  );
}

export default WhatsAppButton;
