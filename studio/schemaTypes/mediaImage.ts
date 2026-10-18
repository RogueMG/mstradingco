import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

import { mediaPreview } from "./preview";

interface MediaImageValue {
  upload?: { asset?: { _ref?: string } };
  url?: string;
  alt?: string;
}

/**
 * An image that is either uploaded to Sanity or linked by URL. Editors can
 * paste a link instead of uploading; the site prefers the upload when both
 * are set.
 */
export const mediaImage = defineType({
  name: "mediaImage",
  title: "Image",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "upload",
      title: "Upload",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "url",
      title: "Or image link",
      description: "An https:// link to an image, used when nothing is uploaded.",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      description: "Describe the image for screen readers and search engines.",
      type: "string",
      validation: (rule) =>
        rule.required().warning("Alt text helps accessibility and SEO."),
    }),
  ],
  validation: (rule) =>
    rule.custom((value: MediaImageValue | undefined) => {
      if (!value) return true;
      if (value.upload?.asset?._ref || value.url) return true;
      return "Upload an image or paste an image link.";
    }),
  preview: {
    select: { upload: "upload", url: "url", alt: "alt" },
    prepare({ upload, url, alt }) {
      return {
        title: alt || "Image",
        subtitle: upload ? "Uploaded" : url ? "Linked" : "Empty",
        media: mediaPreview({ upload, url, alt }) as never,
      };
    },
  },
});
