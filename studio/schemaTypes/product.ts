import { PackageIcon } from "@sanity/icons/Package";
import { defineArrayMember, defineField, defineType } from "sanity";

import { mediaPreview } from "./preview";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "details", title: "Details" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "basics",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "basics",
      description: "Used in the page URL: /products/<category>/<slug>",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      group: "basics",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      type: "reference",
      group: "basics",
      to: [{ type: "brand" }],
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      group: "basics",
      validation: (rule) =>
        rule.max(220).warning("Keep it under 220 characters."),
    }),
    defineField({
      name: "images",
      type: "array",
      group: "basics",
      description: "The first image is the main one.",
      of: [defineArrayMember({ type: "mediaImage" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "isSample",
      title: "Sample entry",
      description: 'Shows a "details to be confirmed" note on the product page.',
      type: "boolean",
      group: "basics",
      initialValue: false,
    }),
    defineField({
      name: "order",
      type: "number",
      group: "basics",
      description: "Lower numbers come first within a category.",
      initialValue: 100,
    }),
    defineField({
      name: "keyFeatures",
      title: "Key features",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "description",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h3" },
          ],
          lists: [{ title: "Bullet", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [],
          },
        }),
      ],
    }),
    defineField({
      name: "specifications",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          name: "spec",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        }),
      ],
    }),
    defineField({
      name: "variants",
      description: "Sizes, colours or other options, e.g. 6, 7, 8 or Yellow.",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
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
    select: {
      title: "title",
      category: "category.title",
      brand: "brand.name",
      image: "images.0",
    },
    prepare({ title, category, brand, image }) {
      return {
        title,
        subtitle: [category, brand].filter(Boolean).join(" · "),
        media: mediaPreview(image) as never,
      };
    },
  },
});
