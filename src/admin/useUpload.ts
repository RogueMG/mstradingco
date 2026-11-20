import { useState } from "react";

import type { AdminImage } from "../../shared/admin";
import { adminApi } from "./api";
import { useDraftUploadsContext } from "./draftUploads";
import { prepareImage } from "./images";
import { errorMessage, useToast } from "./toast";

/** Resizes, converts and uploads an image; returns it as a stored AdminImage. */
export function useUpload() {
  const toast = useToast();
  const drafts = useDraftUploadsContext();
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File, alt: string): Promise<AdminImage | null> => {
    setUploading(true);

    try {
      const prepared = await prepareImage(file);
      const form = new FormData();
      form.append("file", new File([prepared.full], "image.webp", { type: "image/webp" }));
      form.append("thumb", new File([prepared.thumb], "thumb.webp", { type: "image/webp" }));
      form.append("width", String(prepared.width));
      form.append("height", String(prepared.height));

      const result = await adminApi.upload(form);
      drafts?.track(result.key);
      return { key: result.key, url: null, alt, width: result.width, height: result.height };
    } catch (err) {
      toast.error(errorMessage(err));
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
