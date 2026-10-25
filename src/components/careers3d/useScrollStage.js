import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { RESPECT_REDUCED_MOTION } from "../contact3d/contactData";

gsap.registerPlugin(ScrollTrigger);
// phones: ignore the address-bar resize so sections do not jump while scrolling
ScrollTrigger.config({ ignoreMobileResize: true });

export const isReduced = () =>
  typeof window !== "undefined" && RESPECT_REDUCED_MOTION && matchMedia("(prefers-reduced-motion: reduce)").matches;

// Same stage setup as the Contact page: body classes, Lenis smooth scroll wired to ScrollTrigger,
// a gsap.context + gsap.matchMedia scoped to `root`, and a full clean-up on unmount.
// build({ reduce, ctx, mm, lenis }) creates the page's animations.
export default function useScrollStage(root, build) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const reduce = isReduced();
    document.body.classList.add("ct-3d");
    document.body.classList.toggle("ct-reduce", reduce);

    let lenis, tick;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1 });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {}, root);
    const mm = gsap.matchMedia(root.current);
    build({ reduce, ctx, mm, lenis });

    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(t);
      mm.revert();
      ctx.revert();
      document.body.classList.remove("ct-3d", "ct-reduce");
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return lenisRef;
}

// scroll helper that works with or without Lenis
export const scrollToEl = (lenisRef, el) => {
  if (!el) return;
  if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: "smooth" });
};
