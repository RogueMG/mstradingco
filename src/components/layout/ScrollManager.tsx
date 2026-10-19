import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Scrolls to the top on page change, or to the element named by the URL hash
 * (e.g. /#contact) once it has rendered. Lazy pages can take a few frames to
 * mount, so the hash target is retried briefly.
 *
 * Navigations that pass `state: { keepScroll: true }` (e.g. switching
 * category tabs on the Products page) leave the scroll position alone.
 */
function ScrollManager() {
  const { pathname, hash, state } = useLocation();
  const keepScroll = Boolean(
    (state as { keepScroll?: boolean } | null)?.keepScroll,
  );

  useEffect(() => {
    if (keepScroll) return;

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let frame = 0;
    let attempts = 0;

    const tryScroll = () => {
      const target = document.getElementById(id);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (attempts++ < 60) {
        frame = requestAnimationFrame(tryScroll);
      }
    };

    tryScroll();

    return () => cancelAnimationFrame(frame);
    // keepScroll is read with the location it belongs to.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash]);

  return null;
}

export default ScrollManager;
