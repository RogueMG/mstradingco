/**
 * mstradingco-mailer: sends a plain-text email through Cloudflare Email
 * Routing's send_email binding. Called only by the Pages project's enquiry
 * Function through a service binding (this Worker has no public URL).
 *
 * POST /send  { from, fromName?, to, replyTo?, subject, text }
 */
import { EmailMessage } from "cloudflare:email";

interface Env {
  EMAIL: SendEmail;
}

interface SendRequest {
  from: string;
  fromName?: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
}

const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

/** Header values must never contain line breaks (header injection). */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function base64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** RFC 2047 encoded-word for non-ASCII header text. */
function encodeWord(text: string): string {
  return /^[\x20-\x7e]*$/.test(text) ? text : `=?UTF-8?B?${base64(text)}?=`;
}

function buildMime(message: SendRequest): string {
  const domain = message.from.split("@")[1];
  const fromName = message.fromName ? `"${encodeWord(headerSafe(message.fromName).replace(/"/g, "'"))}" ` : "";
  const body = base64(message.text.replace(/\r?\n/g, "\r\n"))
    .match(/.{1,76}/g)!
    .join("\r\n");

  return [
    `From: ${fromName}<${message.from}>`,
    `To: <${message.to}>`,
    ...(message.replyTo ? [`Reply-To: <${message.replyTo}>`] : []),
    `Subject: ${encodeWord(headerSafe(message.subject))}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    body,
  ].join("\r\n");
}

function invalid(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method !== "POST" || url.pathname !== "/send") {
      return new Response("Not found", { status: 404 });
    }

    let message: SendRequest;

    try {
      message = (await request.json()) as SendRequest;
    } catch {
      return invalid("Body must be JSON.");
    }

    if (!EMAIL_PATTERN.test(message.from ?? "") || !EMAIL_PATTERN.test(message.to ?? "")) {
      return invalid("from and to must be email addresses.");
    }

    if (message.replyTo && !EMAIL_PATTERN.test(message.replyTo)) {
      return invalid("replyTo must be an email address.");
    }

    if (typeof message.subject !== "string" || typeof message.text !== "string" || message.text.length > 20_000) {
      return invalid("subject and text are required.");
    }

    try {
      await env.EMAIL.send(new EmailMessage(message.from, message.to, buildMime(message)));
      return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      console.error("send_email failed", err);
      return new Response(JSON.stringify({ error: "Sending failed." }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
