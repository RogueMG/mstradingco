/**
 * Sanitises product descriptions from the admin's rich-text editor down to
 * p, h3, ul, ol, li, strong, em, b, i and br, with no attributes. Script-like
 * elements are dropped with their content; anything else is unwrapped.
 */
const ALLOWED = new Set(["p", "h3", "ul", "ol", "li", "strong", "em", "b", "i", "br"]);
const DROP_WITH_CONTENT = "script, style, iframe, object, embed, noscript, template, svg, math, form, textarea, select, button";

export async function sanitizeHtml(input: string): Promise<string> {
  if (!input.trim()) return "";

  const rewriter = new HTMLRewriter()
    .on(DROP_WITH_CONTENT, {
      element(element) {
        element.remove();
      },
    })
    .on("*", {
      element(element) {
        const tag = element.tagName.toLowerCase();

        if (!ALLOWED.has(tag)) {
          element.removeAndKeepContent();
          return;
        }

        // Strip every attribute (no styles, classes, handlers or links).
        for (const [name] of [...element.attributes]) {
          element.removeAttribute(name);
        }
      },
      comments(comment) {
        comment.remove();
      },
    });

  const output = await rewriter.transform(new Response(`<div>${input}</div>`)).text();

  return output
    .replace(/^<div>|<\/div>$/g, "")
    .replace(/<p>\s*<\/p>/g, "")
    .trim();
}
