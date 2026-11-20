import { createContext, useContext, useEffect, useMemo, useRef } from "react";

import type { AdminImage } from "../../shared/admin";

/**
 * Keeps track of images uploaded while an editor is open, so that uploads which never get
 * saved are deleted from R2 again: when the editor is left (another item chosen, another admin
 * page, "Add" clicked) or the tab is closed/reloaded without saving, and, after a save, any
 * upload that was replaced or removed before saving.
 *
 * Deleting is always safe: the server only deletes an upload that no saved row references.
 */
export interface DraftUploads {
  /** Records a new upload made in this editor. */
  track: (key: string) => void;
  /** Call around the save request, so leaving mid-save doesn't delete what is being saved. */
  setSaving: (saving: boolean) => void;
  /** Call after a successful save with the images that were saved; discards the rest. */
  saved: (images: (AdminImage | null | undefined)[]) => void;
}

const DraftUploadsContext = createContext<DraftUploads | null>(null);

export const DraftUploadsProvider = DraftUploadsContext.Provider;

/** The current editor's tracker, or null outside an editor. */
export function useDraftUploadsContext(): DraftUploads | null {
  return useContext(DraftUploadsContext);
}

/** Asks the server to delete uploads that nothing references. `keepalive` lets it finish while the tab closes. */
function discard(keys: Iterable<string>, keepalive = false): void {
  for (const key of keys) {
    // Keys look like "uploads/<uuid>.webp"; the route is DELETE /api/admin/uploads/<key>.
    void fetch(`/api/admin/uploads/${key}`, { method: "DELETE", credentials: "same-origin", keepalive }).catch(() => {});
  }
}

/** One tracker per editor. Unsaved uploads are discarded when the editor unmounts or the page is closed. */
export function useDraftUploads(): DraftUploads {
  const pending = useRef(new Set<string>());
  const saving = useRef(false);

  useEffect(() => {
    const keys = pending.current;
    const onPageHide = () => {
      if (saving.current) return;
      discard(keys, true);
      keys.clear();
    };
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      if (!saving.current) discard(keys);
      keys.clear();
    };
  }, []);

  return useMemo<DraftUploads>(
    () => ({
      track: (key) => {
        pending.current.add(key);
      },
      setSaving: (value) => {
        saving.current = value;
      },
      saved: (images) => {
        const kept = new Set(images.map((image) => image?.key).filter((key): key is string => Boolean(key)));
        const unused = [...pending.current].filter((key) => !kept.has(key));
        pending.current.clear();
        discard(unused);
      },
    }),
    [],
  );
}
