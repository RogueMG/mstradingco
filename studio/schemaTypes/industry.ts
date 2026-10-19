import { CaseIcon } from "@sanity/icons/Case";
import { defineField, defineType } from "sanity";

import { mediaPreview } from "./preview";

export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Short label",
      description: 'Short name used on tabs and cards, e.g. "Energy".',
      type: "string",
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(200).warning("Keep it under 200 characters."),
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
    select: { title: "title", label: "label", image: "image" },
    prepare({ title, label, image }) {
      return {
        title,
        subtitle: label,
        media: mediaPreview(image) as never,
      };
    },
  },
});
