import type { ContentImage } from "./types";

/**
 * Builds <img> sources for a content image. Uploaded images come with a small
 * thumbnail, which becomes a srcset alongside the full-size WebP. Linked and
 * local images are used as-is (no server-side resizing, to keep Functions light).
 */
export function imageSources(
  image: ContentImage | null | undefined,
): { src: string; srcSet?: string } | null {
  if (!image?.src) return null;

  if (image.thumb && image.width) {
    return {
      src: image.src,
      srcSet: `${image.thumb} 400w, ${image.src} ${image.width}w`,
    };
  }

  return { src: image.src };
}
