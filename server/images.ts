import type { ContentImage } from "../shared/content";

/** Uploaded images live in R2 as uploads/<id>.webp with a uploads/<id>-thumb.webp twin. */
export const UPLOAD_PREFIX = "uploads/";

export function thumbKey(key: string): string {
  return key.replace(/\.webp$/, "-thumb.webp");
}

export function mediaUrl(key: string): string {
  return `/media/${key}`;
}

/** Valid stored image locations: an R2 upload key, an https URL, or a site file under /images/. */
export function isValidImageUrl(url: string): boolean {
  return /^https:\/\/[^\s"'<>]+$/i.test(url) || /^\/images\/[\w./-]+$/.test(url);
}

export function isValidUploadKey(key: string): boolean {
  return /^uploads\/[a-f0-9-]{36}\.webp$/.test(key);
}

export function toImage(
  key: string | null,
  url: string | null,
  alt: string,
  width?: number | null,
  height?: number | null,
): ContentImage | null {
  if (key) {
    return {
      src: mediaUrl(key),
      thumb: mediaUrl(thumbKey(key)),
      alt,
      width: width ?? null,
      height: height ?? null,
    };
  }

  if (url) {
    return { src: url, alt, width: width ?? null, height: height ?? null };
  }

  return null;
}
