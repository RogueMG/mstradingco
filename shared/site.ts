/**
 * Site-wide facts. These are the defaults; the live values are edited in
 * Admin → Settings and stored in D1 (settings table, key "site").
 *
 * Shared by the site (src/) and the Functions (functions/). Keep it free of
 * imports so Node scripts can load it too.
 */

export interface SiteLocation {
  id: string;
  name: string;
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2, e.g. "IN". */
  country: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  /** schema.org openingHours strings, e.g. "Mo-Sa 09:30-18:30". Empty when unknown. */
  openingHours: string[];
}

export interface SiteSettings {
  name: string;
  /** Other names people search for, used as schema.org alternateName. */
  alternateNames: string[];
  description: string;
  /** Public contact email shown on the site. */
  email: string;
  /** Main phone in international format, e.g. "+91 89395 75200". */
  phone: string;
  landline: string;
  /** WhatsApp number, digits only with country code, e.g. "918939575200". */
  whatsappNumber: string;
  gstin: string;
  locations: SiteLocation[];
  social: { label: string; url: string }[];
}

/** Settings that never leave the server. */
export interface PrivateSettings {
  /** Where enquiry notifications are emailed (must be verified in Email Routing). */
  notifyEmail: string;
}

export const defaultSiteSettings: SiteSettings = {
  name: "MS Trading Co.",
  alternateNames: ["MS Trading"],
  description:
    "Industrial safety equipment, PPE, power tools and hand tools supplier in Chennai. Genuine brands, bulk supply and quick quotes.",
  email: "mstrading52@yahoo.com",
  phone: "+91 89395 75200",
  landline: "044 4512 2249",
  whatsappNumber: "918939575200",
  gstin: "33GFZPM1541E1Z9",
  locations: [
    {
      id: "chennai",
      name: "Chennai office",
      streetAddress: "No. 232/178, Linghi Chetty Street",
      locality: "Chennai",
      region: "Tamil Nadu",
      postalCode: "600001",
      country: "IN",
      phone: "+91 89395 75200",
      latitude: null,
      longitude: null,
      openingHours: [],
    },
  ],
  social: [],
};

export const defaultPrivateSettings: PrivateSettings = {
  notifyEmail: "",
};

/** One-line postal address for a location. */
export function formatAddress(location: SiteLocation): string {
  return [
    location.streetAddress,
    location.locality,
    `${location.region} ${location.postalCode}`.trim(),
    location.country === "IN" ? "India" : location.country,
  ]
    .filter(Boolean)
    .join(", ");
}

/** Google Maps search link for a location (coordinates when known, else the address). */
export function mapsLink(location: SiteLocation): string {
  const query =
    location.latitude != null && location.longitude != null
      ? `${location.latitude},${location.longitude}`
      : `${formatAddress(location)}`;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Keyless Google Maps embed URL for a location. */
export function mapsEmbedUrl(location: SiteLocation): string {
  const query =
    location.latitude != null && location.longitude != null
      ? `${location.latitude},${location.longitude}`
      : formatAddress(location);

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
