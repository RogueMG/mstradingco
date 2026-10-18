import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Scrolls to the top on page change, or to the element named by the URL hash
 * (e.g. /#contact) once it has rendered. Lazy pages can take a few frames to
 * mount, so the hash target is retried briefly.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
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
  }, [pathname, hash]);

  return null;
}

export default ScrollManager;
