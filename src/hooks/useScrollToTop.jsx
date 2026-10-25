import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Every page change starts at the top of the new page (hero first), instantly:
//  - the browser must not restore an old scroll position (back/forward included), so restoration is set to manual
//  - the jump happens before the new page paints (layout effect), so there is no visible glide from the old position
//  - `scroll-behavior: smooth` in CSS is bypassed for this one jump
const jumpToTop = () => {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.scrollTop = 0;
  document.body.scrollTop = 0;
  root.style.scrollBehavior = prev;
};

const useScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    // in-page anchors (/page#section) still go to their section
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) { requestAnimationFrame(() => el.scrollIntoView()); return undefined; }
    }
    jumpToTop();
    // once more after the new page has mounted and laid out (3D pages create their scroll engines on mount)
    let r2;
    const r1 = requestAnimationFrame(() => { jumpToTop(); r2 = requestAnimationFrame(jumpToTop); });
    return () => { cancelAnimationFrame(r1); if (r2) cancelAnimationFrame(r2); };
  }, [pathname]);

  // lazy pages can mount a moment after the route changes; make sure they also open at the top
  useEffect(() => {
    if (window.scrollY > 0 && !hash) jumpToTop();
  }, [pathname, hash]);
};

export default useScrollToTop;
