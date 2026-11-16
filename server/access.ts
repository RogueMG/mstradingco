/**
 * Verifies the Cloudflare Access JWT (Cf-Access-Jwt-Assertion) on admin
 * requests: RS256 signature against the team's public keys, audience, issuer
 * and expiry. Access already blocks unauthenticated visitors at the edge; this
 * is the second check so the Functions never trust the route alone.
 */
import type { Env } from "./env";

export interface AdminIdentity {
  email: string;
}

interface Jwk extends JsonWebKey {
  kid: string;
}

interface JwtHeader {
  alg: string;
  kid: string;
}

interface JwtPayload {
  aud: string | string[];
  iss: string;
  exp: number;
  nbf?: number;
  iat?: number;
  email?: string;
  sub?: string;
}

const CLOCK_SKEW_SECONDS = 60;
const KEY_CACHE_MS = 60 * 60 * 1000;

let keyCache: { domain: string; fetchedAt: number; keys: Jwk[] } | null = null;

function base64UrlDecode(input: string): Uint8Array {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodeJson<T>(part: string): T {
  return JSON.parse(new TextDecoder().decode(base64UrlDecode(part))) as T;
}

function normaliseDomain(domain: string): string {
  const trimmed = domain.trim().replace(/\/+$/, "");
  return /^https:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

async function signingKeys(domain: string, forceRefresh = false): Promise<Jwk[]> {
  if (!forceRefresh && keyCache && keyCache.domain === domain && Date.now() - keyCache.fetchedAt < KEY_CACHE_MS) {
    return keyCache.keys;
  }

  const response = await fetch(`${domain}/cdn-cgi/access/certs`, { cf: { cacheTtl: 3600 } } as RequestInit);

  if (!response.ok) {
    throw new Error(`Could not load Access signing keys (${response.status})`);
  }

  const body = (await response.json()) as { keys?: Jwk[] };
  keyCache = { domain, fetchedAt: Date.now(), keys: body.keys ?? [] };
  return keyCache.keys;
}

function isLocalhost(request: Request): boolean {
  const { hostname } = new URL(request.url);
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

/** Returns the signed-in admin, or null when the request isn't properly authenticated. */
export async function verifyAdmin(request: Request, env: Env): Promise<AdminIdentity | null> {
  // Local development only: needs the explicit flag AND a localhost request.
  if (env.DEV_BYPASS_ACCESS === "true" && isLocalhost(request)) {
    return { email: "dev@localhost" };
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");

  // Fail closed until Access is configured.
  if (!token || !env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  let header: JwtHeader;
  let payload: JwtPayload;

  try {
    header = decodeJson<JwtHeader>(parts[0]);
    payload = decodeJson<JwtPayload>(parts[1]);
  } catch {
    return null;
  }

  if (header.alg !== "RS256" || !header.kid) return null;

  const domain = normaliseDomain(env.ACCESS_TEAM_DOMAIN);

  try {
    let keys = await signingKeys(domain);
    let jwk = keys.find((key) => key.kid === header.kid);

    // Keys rotate; refresh once if the kid is new to us.
    if (!jwk) {
      keys = await signingKeys(domain, true);
      jwk = keys.find((key) => key.kid === header.kid);
    }

    if (!jwk) return null;

    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      base64UrlDecode(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );

    if (!valid) return null;
  } catch (err) {
    console.error("Access JWT verification failed", err);
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

  if (!audiences.includes(env.ACCESS_AUD)) return null;
  if (normaliseDomain(payload.iss ?? "") !== domain) return null;
  if (typeof payload.exp !== "number" || payload.exp + CLOCK_SKEW_SECONDS < now) return null;
  if (typeof payload.nbf === "number" && payload.nbf - CLOCK_SKEW_SECONDS > now) return null;

  return { email: payload.email ?? payload.sub ?? "unknown" };
}
