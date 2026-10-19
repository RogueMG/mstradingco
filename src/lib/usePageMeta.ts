import { useEffect } from "react";

const SITE_NAME = "MS Trading Co.";
const DEFAULT_DESCRIPTION =
  "Industrial safety equipment, PPE, power tools and hand tools supplier in Chennai. Genuine brands, bulk supply and quick quotes.";

/** Sets the document title and meta description for the current page. */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Industrial Safety Equipment Supplier, Chennai`;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = description || DEFAULT_DESCRIPTION;
  }, [title, description]);
}
