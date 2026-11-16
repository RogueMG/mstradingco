import {
  defaultSiteSettings,
  formatAddress,
  type SiteSettings,
} from "../../shared/site";

interface SiteData {
  site: SiteSettings;
  turnstileSiteKey: string;
}

/**
 * Site-wide facts are edited in Admin → Settings. The page middleware embeds
 * the current values in every page as <script id="site-data">; plain
 * `npm run dev` (no Functions) falls back to the defaults in shared/site.ts.
 */
function readSiteData(): SiteData {
  try {
    const element = document.getElementById("site-data");
    if (element?.textContent) {
      const data = JSON.parse(element.textContent) as Partial<SiteData>;
      return {
        site: { ...defaultSiteSettings, ...data.site },
        turnstileSiteKey: data.turnstileSiteKey ?? "",
      };
    }
  } catch {
    // Fall through to the defaults.
  }

  return { site: defaultSiteSettings, turnstileSiteKey: "" };
}

export const siteData = readSiteData();
export const site = siteData.site;

const primaryLocation = site.locations[0];

export const company = {
  name: site.name,
  phone: site.phone,
  phoneHref: `tel:${site.phone.replace(/[^\d+]/g, "")}`,
  landline: site.landline,
  landlineHref: `tel:${site.landline.replace(/[^\d+]/g, "")}`,
  email: site.email,
  whatsappNumber: site.whatsappNumber,
  gstin: site.gstin,
  address: primaryLocation ? formatAddress(primaryLocation) : "",
};

/** WhatsApp click-to-chat link with a pre-filled message. */
export function whatsappLink(message: string) {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export interface EnquiryDetails {
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  interest?: string;
  message?: string;
}

/** Formats enquiry form details as a plain-text message for WhatsApp or email. */
export function enquiryMessage(details: EnquiryDetails) {
  return [
    `Hello ${company.name}, I'd like a quote.`,
    "",
    details.interest ? `Interested in: ${details.interest}` : "",
    details.message ? `Details: ${details.message}` : "",
    "",
    `Name: ${details.name}`,
    details.company ? `Company: ${details.company}` : "",
    details.phone ? `Phone: ${details.phone}` : "",
    details.email ? `Email: ${details.email}` : "",
  ]
    .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
    .join("\n")
    .trim();
}

/** mailto: link with a pre-filled subject and body. */
export function emailLink(subject: string, body: string) {
  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
