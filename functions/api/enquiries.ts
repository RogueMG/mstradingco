import type { Env, Fn } from "../../server/env";
import { HttpError, json, readJson, toErrorResponse } from "../../server/http";
import { loadPrivateSettings, loadSiteSettings } from "../../server/lists";
import { Validator } from "../../server/validate";

const RATE_WINDOW_SECONDS = 10 * 60;
const RATE_MAX_PER_WINDOW = 5;

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Counts submissions per visitor in a 10-minute window. The key is a hash of
 * the IP with today's date as salt, so raw IPs are never stored and keys can't
 * be linked across days.
 */
async function checkRateLimit(db: D1Database, ip: string): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const key = await sha256(`enquiry:${new Date().toISOString().slice(0, 10)}:${ip}`);
  const cutoff = now - RATE_WINDOW_SECONDS;

  const row = await db
    .prepare(
      `INSERT INTO rate_limits (key, window_start, count) VALUES (?1, ?2, 1)
       ON CONFLICT(key) DO UPDATE SET
         count = CASE WHEN window_start < ?3 THEN 1 ELSE count + 1 END,
         window_start = CASE WHEN window_start < ?3 THEN ?2 ELSE window_start END
       RETURNING count`,
    )
    .bind(key, now, cutoff)
    .first<{ count: number }>();

  // Occasionally clear out old windows.
  if (Math.random() < 0.02) {
    await db.prepare("DELETE FROM rate_limits WHERE window_start < ?1").bind(now - 86_400).run();
  }

  if ((row?.count ?? 0) > RATE_MAX_PER_WINDOW) {
    throw new HttpError(429, "Too many enquiries from this connection. Please try again in a few minutes, or call us.");
  }
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });

  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

interface EnquiryInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  sourcePage: string;
}

/** Emails the enquiry through the mailer Worker; records the outcome on the row. */
async function notify(env: Env, id: number, enquiry: EnquiryInput): Promise<void> {
  if (!env.MAILER || !env.MAIL_FROM) return;

  const [privateSettings, site] = await Promise.all([loadPrivateSettings(env.DB), loadSiteSettings(env.DB)]);
  if (!privateSettings.notifyEmail) return;

  const text = [
    `New enquiry from the ${site.name} website`,
    "",
    `Name: ${enquiry.name}`,
    enquiry.company ? `Company: ${enquiry.company}` : "",
    `Email: ${enquiry.email}`,
    enquiry.phone ? `Phone: ${enquiry.phone}` : "",
    enquiry.interest ? `Interested in: ${enquiry.interest}` : "",
    enquiry.sourcePage ? `Sent from: ${enquiry.sourcePage}` : "",
    "",
    enquiry.message,
    "",
    "Reply to this email to answer the customer. All enquiries are also in the admin under Enquiries.",
  ]
    .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
    .join("\n");

  let status = "failed";

  try {
    const response = await env.MAILER.fetch("https://mailer/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        fromName: `${site.name} website`,
        to: privateSettings.notifyEmail,
        replyTo: enquiry.email,
        subject: `Website enquiry: ${enquiry.interest || enquiry.name}`.slice(0, 150),
        text,
      }),
    });
    status = response.ok ? "sent" : "failed";
    if (!response.ok) console.error("Mailer responded", response.status, await response.text());
  } catch (err) {
    console.error("Mailer call failed", err);
  }

  await env.DB.prepare("UPDATE enquiries SET email_status = ?1 WHERE id = ?2").bind(status, id).run();
}

/** POST /api/enquiries: validates, checks spam protection, stores, then notifies. */
export const onRequestPost: Fn = async ({ request, env, waitUntil }) => {
  try {
    const body = await readJson<Record<string, unknown>>(request, 20_000);
    const check = new Validator(body);

    // Honeypot: real visitors never see or fill this field.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return json({ ok: true }, { status: 201 });
    }

    const enquiry: EnquiryInput = {
      name: check.string("name", { required: true, max: 100, min: 2, label: "Name" }),
      company: check.string("company", { max: 150, label: "Company" }),
      email: check.email("email", { required: true, label: "Email" }),
      phone: check.string("phone", { max: 30, label: "Phone" }),
      interest: check.string("interest", { max: 200, label: "Product or industry" }),
      message: check.string("message", { required: true, max: 4000, min: 10, label: "Message" }),
      sourcePage: check.string("sourcePage", { max: 300 }),
    };

    if (enquiry.phone && !/^[+\d\s()-]{7,30}$/.test(enquiry.phone)) {
      check.issues.phone = "Phone must be a valid phone number.";
    }

    if (enquiry.sourcePage && !enquiry.sourcePage.startsWith("/")) {
      enquiry.sourcePage = "";
    }

    check.done();

    const ip = request.headers.get("CF-Connecting-IP") ?? "";

    if (env.TURNSTILE_SECRET) {
      const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
      if (!token || !(await verifyTurnstile(env.TURNSTILE_SECRET, token, ip))) {
        throw new HttpError(400, "Please complete the verification check and try again.");
      }
    }

    await checkRateLimit(env.DB, ip || "unknown");

    const row = await env.DB.prepare(
      `INSERT INTO enquiries (name, company, email, phone, interest, message, source_page)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7) RETURNING id`,
    )
      .bind(
        enquiry.name,
        enquiry.company,
        enquiry.email,
        enquiry.phone,
        enquiry.interest,
        enquiry.message,
        enquiry.sourcePage,
      )
      .first<{ id: number }>();

    if (row) waitUntil(notify(env, row.id, enquiry));

    return json({ ok: true }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
};
