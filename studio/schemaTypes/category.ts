import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

import { mediaPreview } from "./preview";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Used in the page URL: /products/<slug>",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Short label",
      description:
        'Small label shown above the title on cards, e.g. "Safety Footwear".',
      type: "string",
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(180).warning("Keep it under 180 characters."),
    }),
    defineField({
      name: "image",
      type: "mediaImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "showOnHome",
      title: "Show on home page",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers come first.",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", eyebrow: "eyebrow", image: "image" },
    prepare({ title, eyebrow, image }) {
      return {
        title,
        subtitle: eyebrow,
        media: mediaPreview(image) as never,
      };
    },
  },
});
