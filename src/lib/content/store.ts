/**
 * A small request cache for content. Each request is keyed (e.g.
 * "product:body-ppe/safety-gloves") and read with useSyncExternalStore.
 * Synchronous loaders (local data) resolve on first read, so there's no
 * loading flash.
 */

export type ContentResult<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; error: Error };

const LOADING: ContentResult<never> = { status: "loading" };

const cache = new Map<string, ContentResult<unknown>>();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/** Returns the cached result for `key`, starting `load` the first time. */
export function read<T>(
  key: string,
  load: () => T | Promise<T>,
): ContentResult<T> {
  const cached = cache.get(key);

  if (cached) return cached as ContentResult<T>;

  let result: ContentResult<unknown>;

  try {
    const value = load();

    if (value instanceof Promise) {
      result = LOADING;

      value.then(
        (data) => {
          cache.set(key, { status: "ready", data });
          notify();
        },
        (error: unknown) => {
          cache.set(key, {
            status: "error",
            error: error instanceof Error ? error : new Error(String(error)),
          });
          notify();
        },
      );
    } else {
      result = { status: "ready", data: value };
    }
  } catch (error) {
    result = {
      status: "error",
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }

  cache.set(key, result);

  return result as ContentResult<T>;
}

/** Drops a cached result so the next read loads it again. */
export function invalidate(key: string) {
  cache.delete(key);
  notify();
}
