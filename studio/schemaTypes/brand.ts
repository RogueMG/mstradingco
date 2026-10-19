import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";
import { defineField, defineType } from "sanity";

import { mediaPreview } from "./preview";

export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      description: 'What the brand covers, e.g. "Safety Footwear".',
      type: "string",
    }),
    defineField({
      name: "description",
      description: "One line shown on the Brands page.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "confirmed",
      description: 'Turn off to show the brand as "confirmation pending".',
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "inHouse",
      title: "In-house range",
      description: "The company's own range rather than a third-party brand.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "logo",
      type: "mediaImage",
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
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      name: "name",
      tagline: "tagline",
      confirmed: "confirmed",
      logo: "logo",
    },
    prepare({ name, tagline, confirmed, logo }) {
      return {
        title: name,
        subtitle:
          confirmed === false
            ? [tagline, "pending"].filter(Boolean).join(" · ")
            : tagline,
        media: mediaPreview(logo) as never,
      };
    },
  },
});
