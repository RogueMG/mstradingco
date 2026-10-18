import type { ContentImage } from "./types";

const DEFAULT_WIDTHS = [320, 640, 960, 1280, 1600];

/**
 * Builds <img> sources for a content image. Sanity CDN uploads get resized,
 * format-negotiated variants and a srcset; linked and local images are used as-is.
 */
export function imageSources(
  image: ContentImage | null | undefined,
  width = 960,
  widths: number[] = DEFAULT_WIDTHS,
): { src: string; srcSet?: string } | null {
  if (!image?.src) return null;

  if (!image.src.startsWith("https://cdn.sanity.io/")) {
    return { src: image.src };
  }

  const sized = (w: number) => `${image.src}?w=${w}&fit=max&auto=format`;

  return {
    src: sized(width),
    srcSet: widths.map((w) => `${sized(w)} ${w}w`).join(", "),
  };
}
