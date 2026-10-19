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

/** mailto: link with a pre-filled subject and body. */
export function emailLink(subject: string, body: string) {
  return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
