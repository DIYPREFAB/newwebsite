import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ImagePath from "../../assets/ImagePath";
import "./projectspresenting.css";

/**
 * "PRESENTING DIYPREFAB PROJECT" screen (light theme). Mounted once in App.jsx so it survives the route change.
 * startPresenting(go) is called from the home popup's "Explore the site with projects": the screen rises straight over
 * the open popup, `go()` navigates to Projects & Case Studies while it is covered, then the screen lifts away and the
 * page glides to Featured projects (via the "pj:present-reveal" event that ProjectsSections listens for).
 */
let starter = null;
export const startPresenting = (go) => { if (starter) starter(go); else go?.(); };

const Letters = ({ text, base, step = 0.06 }) => (
  <span className="pp-word" aria-hidden="true">
    {[...text].map((c, i) => (
      <span className="pp-ch" key={i} style={{ "--d": `${(base + i * step).toFixed(2)}s` }}>{c}</span>
    ))}
  </span>
);

export default function ProjectsPresenting() {
  const [phase, setPhase] = useState(null); // null | "in" | "leaving"
  const rootRef = useRef(null);
  const timers = useRef([]);
  const state = useRef({ phase: null, covered: false });

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const unlock = () => { document.documentElement.style.overflow = ""; document.body.style.overflow = ""; };

  const leave = () => {
    if (state.current.phase !== "in") return;
    state.current.phase = "leaving";
    setPhase("leaving");
    unlock();
    timers.current.push(setTimeout(() => window.dispatchEvent(new Event("pj:present-reveal")), 450));
    timers.current.push(setTimeout(() => { state.current.phase = null; setPhase(null); }, 1300));
  };

  useEffect(() => {
    starter = (go) => {
      if (state.current.phase) { go?.(); return; }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      clear();
      state.current = { phase: "in", covered: false };
      setPhase("in");
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      // once the screen fully covers the popup, change page behind it
      timers.current.push(setTimeout(() => { state.current.covered = true; go?.(); }, reduce ? 200 : 1050));
      timers.current.push(setTimeout(leave, reduce ? 1100 : 3600));
    };
    return () => { starter = null; clear(); unlock(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (phase === "in") rootRef.current?.focus({ preventScroll: true }); }, [phase]);

  if (!phase) return null;
  return createPortal(
    <div
      ref={rootRef}
      className={`pp-root${phase === "leaving" ? " is-leaving" : ""}`}
      role="status"
      aria-label="Presenting DIYPREFAB project"
      tabIndex={-1}
      data-lenis-prevent=""
      onClick={() => { if (state.current.covered) leave(); }}
      onKeyDown={(e) => { if (state.current.covered && ["Escape", "Enter", " "].includes(e.key)) { e.preventDefault(); leave(); } }}
    >
      <div className="pp-panel">
        <div className="pp-bg" aria-hidden="true">
          <div className="pp-grid" />
          <div className="pp-glow" />
        </div>
        <div className="pp-center">
          <span className="pp-logo" aria-hidden="true"><img src={ImagePath.Logo} alt="" /></span>
          <p className="pp-eyebrow"><i /><span>Presenting</span><i /></p>
          <h2 className="pp-title" aria-hidden="true">
            <span className="pp-row"><Letters text="DIYPREFAB" base={1.05} step={0.05} /></span>
            <span className="pp-row pp-row-hl"><Letters text="PROJECT" base={1.55} step={0.055} /></span>
          </h2>
          <span className="pp-rule" aria-hidden="true"><b /></span>
        </div>
        <p className="pp-skip">Tap to skip</p>
      </div>
    </div>,
    document.body
  );
}
