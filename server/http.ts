/** Small response helpers shared by the Functions. */

/** Public, cacheable reads: short freshness, longer stale-while-revalidate. */
export const PUBLIC_CACHE = "public, max-age=60, stale-while-revalidate=600";
export const NO_STORE = "no-store";

export function json(data: unknown, init: ResponseInit & { cache?: string } = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", init.cache ?? NO_STORE);
  headers.set("X-Content-Type-Options", "nosniff");

  return new Response(JSON.stringify(data), { ...init, headers });
}

export function error(status: number, message: string, details?: unknown): Response {
  return json({ error: message, ...(details ? { details } : {}) }, { status });
}

/** Thrown by validators and handlers; turned into a JSON error response. */
export class HttpError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function toErrorResponse(err: unknown): Response {
  if (err instanceof HttpError) {
    return error(err.status, err.message, err.details);
  }

  const message = err instanceof Error ? err.message : String(err);

  // SQLite constraint failures are client errors (duplicate slug, missing parent…).
  if (/UNIQUE constraint failed/i.test(message)) {
    return error(409, "That slug is already used here. Choose a different one.");
  }

  if (/FOREIGN KEY constraint failed/i.test(message)) {
    return error(409, "This item is still referenced by something else.");
  }

  console.error(err);
  return error(500, "Something went wrong on the server.");
}

export async function readJson<T = unknown>(request: Request, maxBytes = 200_000): Promise<T> {
  const length = Number(request.headers.get("Content-Length") ?? 0);

  if (length > maxBytes) {
    throw new HttpError(413, "Request body is too large.");
  }

  const text = await request.text();

  if (text.length > maxBytes) {
    throw new HttpError(413, "Request body is too large.");
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, "Request body must be valid JSON.");
  }
}

export function nowIso(): string {
  return new Date().toISOString();
}
