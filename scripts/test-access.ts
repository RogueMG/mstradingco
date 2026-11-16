/**
 * Tests server/access.ts (Cloudflare Access JWT verification) with a throwaway
 * RSA key and a mocked certs endpoint. No network, no Cloudflare account.
 *
 *   npm run test:access
 */
import { verifyAdmin } from "../server/access.ts";
import type { Env } from "../server/env.ts";

const TEAM = "https://example-team.cloudflareaccess.com";
const AUD = "test-audience-tag";

const keyPair = (await crypto.subtle.generateKey(
  { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
  true,
  ["sign", "verify"],
)) as CryptoKeyPair;

const publicJwk = { ...(await crypto.subtle.exportKey("jwk", keyPair.publicKey)), kid: "test-kid" };

let certFetches = 0;
globalThis.fetch = (async (input: RequestInfo | URL) => {
  const url = String(input);
  if (url === `${TEAM}/cdn-cgi/access/certs`) {
    certFetches++;
    return new Response(JSON.stringify({ keys: [publicJwk] }), { headers: { "Content-Type": "application/json" } });
  }
  return new Response("not mocked", { status: 500 });
}) as typeof fetch;

const b64url = (bytes: Uint8Array) =>
  Buffer.from(bytes).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const encode = (value: object) => b64url(new TextEncoder().encode(JSON.stringify(value)));

async function sign(payload: object, header: object = { alg: "RS256", kid: "test-kid" }): Promise<string> {
  const unsigned = `${encode(header)}.${encode(payload)}`;
  const signature = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", keyPair.privateKey, new TextEncoder().encode(unsigned)),
  );
  return `${unsigned}.${b64url(signature)}`;
}

const now = Math.floor(Date.now() / 1000);
const good = { aud: [AUD], iss: TEAM, exp: now + 600, iat: now, email: "editor@example.com" };

const env = { ACCESS_TEAM_DOMAIN: TEAM, ACCESS_AUD: AUD } as Env;

function request(token?: string, host = "mstradingco.pages.dev"): Request {
  return new Request(`https://${host}/api/admin/me`, {
    headers: token ? { "Cf-Access-Jwt-Assertion": token } : {},
  });
}

let failures = 0;
async function expect(name: string, actual: Promise<unknown>, expected: unknown) {
  const value = await actual;
  const pass = JSON.stringify(value) === JSON.stringify(expected);
  if (!pass) failures++;
  console.log(`${pass ? "✓" : "✗"} ${name}${pass ? "" : ` (got ${JSON.stringify(value)})`}`);
}

await expect("valid token is accepted", verifyAdmin(request(await sign(good)), env), { email: "editor@example.com" });
await expect("missing token is rejected", verifyAdmin(request(), env), null);
await expect("wrong audience is rejected", verifyAdmin(request(await sign({ ...good, aud: ["other-app"] })), env), null);
await expect("wrong issuer is rejected", verifyAdmin(request(await sign({ ...good, iss: "https://evil.cloudflareaccess.com" })), env), null);
await expect("expired token is rejected", verifyAdmin(request(await sign({ ...good, exp: now - 3600 })), env), null);
await expect("not-yet-valid token is rejected", verifyAdmin(request(await sign({ ...good, nbf: now + 3600 })), env), null);

const tampered = (await sign(good)).split(".");
tampered[1] = encode({ ...good, email: "attacker@example.com" });
await expect("tampered payload is rejected", verifyAdmin(request(tampered.join(".")), env), null);

await expect("HS256 token is rejected", verifyAdmin(request(await sign(good, { alg: "HS256", kid: "test-kid" })), env), null);

const before = certFetches;
await expect("unknown key id is rejected", verifyAdmin(request(await sign(good, { alg: "RS256", kid: "rotated" })), env), null);
console.log(`  (refreshed keys ${certFetches - before}x for the unknown kid)`);

await expect("unconfigured Access fails closed", verifyAdmin(request(await sign(good)), { ...env, ACCESS_AUD: "" }), null);
await expect(
  "dev bypass ignored off localhost",
  verifyAdmin(request(undefined, "mstradingco.pages.dev"), { ...env, DEV_BYPASS_ACCESS: "true" }),
  null,
);
await expect(
  "dev bypass works on localhost with the flag",
  verifyAdmin(request(undefined, "127.0.0.1:8790"), { ...env, DEV_BYPASS_ACCESS: "true" }),
  { email: "dev@localhost" },
);
await expect("localhost without the flag is rejected", verifyAdmin(request(undefined, "localhost:8790"), env), null);

console.log(`\n${failures === 0 ? "All access checks passed" : `${failures} failed`}`);
if (failures) process.exit(1);
