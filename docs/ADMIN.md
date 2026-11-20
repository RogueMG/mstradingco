# Editing the website: a guide for editors

This guide explains how to update the MS Trading Co. website yourself: products, categories,
brands, industries, enquiries and the business details shown on every page. You don't need any
technical knowledge.

## Signing in

1. Go to **https://develop.mstradingco.pages.dev/admin**. (Once the business has its own web
   address, the admin moves to `https://<that-address>/admin`; the site owner will tell you.)
2. Cloudflare asks for your email address. Enter the email the site owner added for you.
3. Cloudflare emails you a **one-time code**. Type it in. There is no password to remember.
4. You're in. The admin stays signed in for a while; after that it asks for a new code.

`https://mstradingco.pages.dev/admin` (without `develop.`) is deliberately locked and always shows
"Forbidden"; use the address above. Both addresses use the same content, so what you save there is
what the public site shows.

If you see "Sign-in required" or "Forbidden" on the right address, ask the site owner to add your
email to the allowed list. Changes you save appear on the public site within about a minute.

The top bar has five sections: **Catalogue**, **Brands**, **Industries**, **Enquiries** and
**Settings**. "View site" opens the public website in a new tab.

## Catalogue: categories and products

The left side shows the **category tree**. Click the arrow next to a category to open it and see its
subcategories and products. Click a name to edit it on the right.

Buttons next to each category:

| Button | What it does |
| --- | --- |
| ↑ ↓ | Move the category up or down among its neighbours (this is the order on the website) |
| Folder with + | Add a **subcategory** inside it |
| Box with + | Add a **product** inside it |

Categories can go as deep as you like, for example *Body & PPE → Gloves → Nitrile gloves*. The web
address follows the tree: `/products/body-ppe/gloves/nitrile-gloves/...`.

### Adding or editing a category

- **Title**: the name people see.
- **Web address (slug)**: filled in from the title. Use lowercase letters, numbers and dashes only.
  Changing it changes the page's address, so avoid changing it once the page is live.
- **Parent category**: choose another parent to **move** the category (with everything inside it).
  "Top level" puts it in the main list. A category can't be moved inside itself.
- **Short label**: a small word shown above the title, e.g. "Safety Footwear".
- **Summary**: one or two sentences shown on cards and the category page.
- **Image**: required. See [Images](#images) below.
- **Show on the home page**: top-level categories with this ticked appear on the home page.
- **Delete**: only possible when the category is empty. Move or delete its subcategories and products
  first.

### Adding or editing a product

**Basics**

- **Title** and **web address (slug)**, as above. A product's slug must be different from any
  subcategory's slug in the same category.
- **Category**: choose another category to **move** the product.
- **Brand**: optional. Pick from your brands list.
- **Summary**: one or two sentences shown on product cards.
- **Images**: at least one. The first image is the **main** image.
- **Published**: untick to hide the product from the website without deleting it. You can also use
  the eye icon next to the product in the tree.
- **Sample listing**: shows a "details to be confirmed" note on the product page. Untick it once the
  product details are final.

**Details**

- **Description**: a small editor with a paragraph style, a heading, **bold**, *italic* and bullet
  lists. Other formatting is removed when you save.
- **Key features**: short bullet points. Click "Add feature" for each one.
- **Specifications**: rows of a label and a value, e.g. *Material: Nitrile*. They appear as a table.
- **Variants**: sizes, colours and so on. Type one and press Enter.

Click **Save changes** (or **Create product**) at the bottom. A green message confirms the save; a red
one explains what to fix, and the field is highlighted.

To change the order of products inside a category, use the ↑ ↓ arrows next to the product in the tree.

## Images

Every image can be added in one of two ways:

- **Upload**: choose a JPG, PNG or WebP file. The admin automatically shrinks it (largest side
  1600 pixels, plus a small thumbnail) and converts it to the fast WebP format before uploading.
  Please upload from **Chrome, Edge or Firefox**; Safari can't do this conversion.
- **Paste link**: paste the address of an image that's already online. It must start with
  `https://`.

**Alt text is required** for every image. Describe what the picture shows, e.g. "Orange safety
helmet with chin strap". It helps visually impaired visitors and search engines.

For products with several images, drag them (or use the arrows) to change the order. The first is
the main image. Removing an image, or replacing it, deletes the uploaded file once nothing else
uses it.

## Brands

The list on the left is in website order; use the arrows to reorder. Click a brand to edit:

- **Name**, **slug**, **tagline** (what the brand covers, e.g. "Power Tools") and a one-line
  **description** for the Brands page.
- **Logo**: optional.
- **Confirmed**: untick to show the brand as "confirmation pending".
- **In-house range**: tick for the company's own range.

Deleting a brand keeps its products; they simply no longer show a brand.

## Industries

Works like Brands. Each industry has a title, slug, a short label for the tabs, a summary, a
required image and a "Show on the home page" option.

## Enquiries

Every enquiry sent from the website's forms lands here.

- **New** shows unread enquiries. Opening one marks it as **read**.
- Use **Archive** to clear handled enquiries, or **Mark as new** to flag one again.
- **Reply by email** opens your email app with the customer's address filled in.
- "Email notification" shows whether the enquiry was also emailed to you. Until email notifications
  are switched on (the site owner does this once the custom domain is set up), it says "not switched
  on yet". Enquiries are still saved here either way.

## Settings

Business details used across the whole website, search results and enquiry emails:

- **Business**: name, other names people search for, description, public email, phone, landline,
  WhatsApp number (digits only with country code, e.g. `918939575200`) and GSTIN.
- **Locations**: one block per office or branch: name, address, phone, and optionally the map
  position (latitude and longitude) and opening hours, written like `Mo-Sa 09:30-18:30`.
- **Enquiry notifications**: the email address that receives new enquiries. It is never shown on the
  website.

Click **Save settings**. Pages pick up the new details the next time they load.

## Good habits

- Keep **Sample listing** ticked until a product's details are confirmed.
- Write alt text for every image.
- Avoid changing slugs of pages that are already live; links to the old address will stop working.
- If something looks wrong on the website, reload the page; changes can take up to a minute to appear.
