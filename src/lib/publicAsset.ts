/**
 * Resolves a root-relative public asset path (e.g. "/images/foo.png") against
 * Vite's configured base path, so it still resolves when the site is served
 * from a subpath (e.g. GitHub Pages project sites at /mstradingco/).
 */
export function publicAsset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
