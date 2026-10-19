export const company = {
  name: "MS Trading Co.",
  phone: "+91 89395 75200",
  phoneHref: "tel:+918939575200",
  landline: "044 4512 2249",
  email: "mstrading52@yahoo.com",
  whatsappNumber: "918939575200",
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
  requirement: string;
  message?: string;
}

/** Formats enquiry form details as a plain-text message for WhatsApp or email. */
export function enquiryMessage(details: EnquiryDetails) {
  return [
    `Hello ${company.name}, I'd like a quote.`,
    "",
    `Requirement: ${details.requirement}`,
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
