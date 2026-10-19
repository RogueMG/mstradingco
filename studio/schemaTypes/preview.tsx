import type { ReactElement } from "react";

interface MediaSource {
  upload?: unknown;
  url?: string;
  alt?: string;
}

/**
 * Picks a preview thumbnail for a mediaImage: the uploaded asset when there is
 * one, otherwise an <img> of the linked URL.
 */
export function mediaPreview(
  image: MediaSource | undefined,
): unknown | ReactElement | undefined {
  if (!image) return undefined;
  if (image.upload) return image.upload;
  if (image.url) {
    return (
      <img
        src={image.url}
        alt={image.alt ?? ""}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }
  return undefined;
}
