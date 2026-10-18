/**
 * GitHub Pages serves 404.html for any path without a file. Copying the app's
 * index.html there lets deep links like /mstradingco/products/body-ppe render.
 *
 * Studio deep links (/mstradingco/studio/...) also land here, so a small
 * script sends them to the Studio's own index.html, which handles routing.
 */
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "/mstradingco/";
const STUDIO = `${BASE}studio/`;

const dist = new URL("../dist/", import.meta.url);
const html = readFileSync(new URL("index.html", dist), "utf8");

const redirect = `<script>(function(){var s=${JSON.stringify(STUDIO)};var p=location.pathname;if(p.indexOf(s)===0&&p!==s){location.replace(s);}})();</script>`;

if (!html.includes("<head>")) {
  throw new Error("dist/index.html has no <head> to inject into");
}

writeFileSync(new URL("404.html", dist), html.replace("<head>", `<head>${redirect}`));

console.log("Wrote dist/404.html (SPA fallback + Studio deep-link redirect)");
