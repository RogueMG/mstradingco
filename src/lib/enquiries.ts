export interface EnquiryPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  /** Honeypot: always empty for real visitors. */
  website: string;
  turnstileToken: string;
}

export type EnquiryResult =
  | { ok: true }
  | { ok: false; message: string; fields?: Record<string, string> };

/** Sends an enquiry to POST /api/enquiries (stored in D1, emailed once switched on). */
export async function submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResult> {
  try {
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, sourcePage: window.location.pathname }),
    });

    if (response.ok) return { ok: true };

    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
      details?: Record<string, string>;
    };

    return {
      ok: false,
      message: body.error ?? "We couldn't send your enquiry. Please try again or call us.",
      fields: body.details,
    };
  } catch {
    return {
      ok: false,
      message: "We couldn't reach the server. Check your connection, or send it on WhatsApp instead.",
    };
  }
}
