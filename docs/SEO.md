# Search engine checklist

The site already handles the technical side: per-page titles and descriptions, canonical URLs, Open
Graph tags, structured data (Organization, LocalBusiness per location, Product, breadcrumbs), a
crawlable text version of every page, a live `/sitemap.xml`, `/robots.txt`, real 404s for missing
pages, image alt text, and fast cached pages. No analytics or tracking cookies are used, so no cookie
banner is needed.

These one-time steps are done by the business owner, ideally once the custom domain is live. They're
all free.

## 1. Google Search Console

1. Go to https://search.google.com/search-console and add a **Domain** property for your domain.
2. Verify it with the DNS record Google gives you. Add it under your domain → DNS in Cloudflare.
3. Open **Sitemaps** and submit `https://<your-domain>/sitemap.xml`.
4. Use **URL inspection** on the home page and one product page, and click **Request indexing**.
5. Check back after a week under **Pages** and **Enhancements** for any problems.

## 2. Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters and sign in.
2. Choose **Import from Google Search Console** (quickest), or add the site and verify by DNS.
3. Submit the same sitemap URL.

This also covers DuckDuckGo and Yahoo, which use Bing's index.

## 3. Google Business Profile (one per location)

1. Go to https://business.google.com and create or claim a profile for each office in
   Admin → Settings → Locations.
2. Use **exactly** the same business name, address and phone number as on the website.
3. Set the category (e.g. "Safety equipment supplier"), add opening hours, photos and the website link.
4. Complete Google's verification (postcard, phone or video, depending on what it offers).
5. Add the same opening hours in Admin → Settings so the website's structured data matches.

## 4. Consistent name, address and phone (NAP)

Search engines trust businesses whose details match everywhere. Make sure these are identical
(same spelling, same phone format) on:

- the website (Admin → Settings);
- Google Business Profile and Bing Places;
- business directories you use, such as IndiaMART, Justdial, TradeIndia and Sulekha;
- your social media pages, if any. Add those links in Settings too, so they're included in the
  site's structured data.

## 5. Ongoing

- Replace sample products with real ones (real photos, specifications, summaries) and untick
  **Sample listing**. Unique, specific text ranks much better than placeholder text.
- Write a useful summary for every category and product; it becomes the page's search description.
- Keep slugs stable once pages are indexed.
- Check Search Console every month or two for errors.
- Optional: Google's Rich Results Test (https://search.google.com/test/rich-results) shows the
  structured data on any page.
