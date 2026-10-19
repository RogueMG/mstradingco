import { ImageOff } from "lucide-react";
import { useState } from "react";

import { imageSources } from "../../lib/content/image";
import type { ContentImage } from "../../lib/content/types";

interface ContentImgProps {
  image: ContentImage | null | undefined;
  fallbackAlt: string;
  sizes?: string;
  width?: number;
  className?: string;
  loading?: "lazy" | "eager";
}

/** Renders a content image with a srcset when available, or a neutral placeholder. */
function ContentImg({
  image,
  fallbackAlt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  width,
  className = "",
  loading = "lazy",
}: ContentImgProps) {
  const [failed, setFailed] = useState(false);
  const sources = imageSources(image, width);

  if (!sources || failed) {
    return (
      <div
        role="img"
        aria-label={image?.alt || fallbackAlt}
        className={`flex items-center justify-center bg-[#e8eef6] text-[#063b73]/30 ${className}`}
      >
        <ImageOff size={32} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={sources.src}
      srcSet={sources.srcSet}
      sizes={sources.srcSet ? sizes : undefined}
      alt={image?.alt || fallbackAlt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default ContentImg;
