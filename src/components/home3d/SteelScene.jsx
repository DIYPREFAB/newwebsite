import { useEffect, useRef, useState } from "react";
import SteelEngine from "./SteelEngine";

// <SteelScene progress={ref} onStats={fn} />  — progress.current is 0..1 from the pinned ScrollTrigger.
export default function SteelScene({ progress, onStats }) {
  const mount = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = mount.current;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block";
    el.appendChild(canvas);

    let engine;
    try {
      const lowPower = innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4;
      engine = new SteelEngine(canvas, { lowPower });
    } catch {
      canvas.remove();
      setFailed(true);
      return;
    }
    engine.smoothing = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    engine.setProgress(progress.current);
    engine.pS = progress.current;
    onStats?.(engine.stats);

    const ro = new ResizeObserver(() => engine.resize());
    ro.observe(el);
    // Feed scroll progress every frame and render only while the stage is on screen.
    // (A per-frame rect check is used instead of IntersectionObserver because GSAP re-parents the
    // pinned section into a pin-spacer, which makes the observer report "not visible" and never recover.)
    let raf;
    const feed = () => {
      raf = requestAnimationFrame(feed);
      engine.setProgress(progress.current);
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.bottom > 0 && r.top < innerHeight) engine.start();
      else engine.stop();
    };
    feed();

    const onLost = (e) => { e.preventDefault(); setFailed(true); };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      ro.disconnect();
      engine.dispose();
      canvas.remove();
    };
  }, [progress]);

  return <div className={`sh-canvas${failed ? " sh-canvas--off" : ""}`} ref={mount} aria-hidden="true" />;
}
