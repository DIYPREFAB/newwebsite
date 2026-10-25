import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SteelScene from "./SteelScene";
import ROUTE_PATHS from "../../routes/RoutePath";
import "./steelhero.css";

gsap.registerPlugin(ScrollTrigger);

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (p, a, b) => { const t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); };

const CHAPTERS = [
  { id: "engineer", n: "01", label: "Engineer", range: [-1, 0.34], kicker: "Digital engineering",
    title: "Every member is modelled before it exists.",
    body: "Our 3D Smart Building Planner lets you visualise, customise and refine the structure in real time — layouts, spans and material use settled on screen, not on site." },
  { id: "fabricate", n: "02", label: "Fabricate", range: [0.36, 0.57], kicker: "Fabrication",
    title: "From drawing to H-section, inside one controlled plant.",
    body: "Cutting, welding, shot-blasting and fit-up happen in our own factory, to the dimensions in the model — so what leaves the plant is ready to be bolted together." },
  { id: "control", n: "03", label: "Control", range: [0.595, 0.77], kicker: "Process control",
    title: "Checked at every stage, not just at the end.",
    body: "Each connection is verified against the model. We also offer a free-of-cost quality verification check, so the standard is proven before dispatch." },
  { id: "deliver", n: "04", label: "Deliver", range: [0.8, 1.01], kicker: "Delivered",
    title: "Erected to a schedule fixed up front.",
    body: "Pre-engineered steel goes up fast and goes up right: warehouses, factories, offices and institutions delivered against a timeline agreed in your quote." },
];
const fade = (p, [a, b]) => seg(p, a, a + 0.03) * (1 - seg(p, b - 0.03, b));

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * The whole pinned hero: 3D steel building + HUD + captions + chapter rail + fabrication tracker.
 * Keep the class "sh-stage" — ScrollHome's ScrollTrigger pins on it.
 * `progress.current` (0..1) comes from that pin; everything here is driven by it, with no React state per frame.
 */
export default function SteelHero({ progress, onCta }) {
  const sec = useRef(null);
  const caps = useRef([]);
  const rail = useRef([]);
  const phase = useRef(null);
  const bar = useRef(null);
  const badge = useRef(null);
  const hint = useRef(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let raf, last = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const p = progress.current;
      if (p === last) return;
      last = p;
      CHAPTERS.forEach((c, i) => {
        const el = caps.current[i];
        if (!el) return;
        const o = fade(p, c.range);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0,${((1 - o) * 26).toFixed(1)}px,0)`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
      let active = 0;
      CHAPTERS.forEach((c, i) => { if (p >= c.range[0] - 0.01) active = i; });
      rail.current.forEach((el, i) => el && el.classList.toggle("is-active", i === active));
      if (phase.current) phase.current.textContent = CHAPTERS[active].kicker;
      if (bar.current) bar.current.style.transform = `scaleY(${p.toFixed(4)})`;
      if (badge.current) badge.current.style.opacity = (1 - seg(p, 0.01, 0.06)).toFixed(3);
      if (hint.current) hint.current.style.opacity = (1 - seg(p, 0, 0.03)).toFixed(3);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  const jumpTo = (i) => {
    const st = ScrollTrigger.getAll().find((s) => s.trigger === sec.current);
    if (!st) return;
    const target = i === 0 ? 0 : CHAPTERS[i].range[0] + 0.045;
    window.scrollTo({ top: st.start + (st.end - st.start) * target, behavior: "smooth" });
  };

  return (
    <section className="sh-stage sx-hero" ref={sec} aria-label="From blueprint to finished steel building">
      <SteelScene progress={progress} onStats={setStats} />
      <div className="sx-grain" aria-hidden="true" />
      <div className="sx-vignette" aria-hidden="true" />

      <div className="sx-captions">
        {CHAPTERS.map((c, k) => (
          <div className="sx-cap" key={c.id} ref={(el) => (caps.current[k] = el)}>
            <span className="sx-num">{c.n}</span>
            <span className="sx-kicker"><i /> {c.kicker}</span>
            {k === 0 ? <h1 className="sx-h2">{c.title}</h1> : <h2 className="sx-h2">{c.title}</h2>}
            <p className="sx-lead">{c.body}</p>
            {c.id === "deliver" && (
              <div className="sx-actions">
                <button type="button" className="sx-btn sx-btn-primary" onClick={onCta}>Start your project <Arrow /></button>
                <Link to={ROUTE_PATHS.PROJECT_CASE_STUDIES} className="sx-btn sx-btn-ghost">See delivered projects</Link>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="sx-hud" aria-hidden="true">
        <span className="sx-hud-label">Phase</span>
        <span className="sx-hud-value" ref={phase}>Digital engineering</span>
        {stats && <span className="sx-hud-meta">{stats.members} members · {stats.bays} bays · {stats.span} m span</span>}
      </div>

      <nav className="sx-rail" aria-label="Build chapters">
        <div className="sx-rail-line"><div className="sx-rail-fill" ref={bar} /></div>
        {CHAPTERS.map((c, k) => (
          <button key={c.id} type="button" className="sx-rail-dot" ref={(el) => (rail.current[k] = el)} onClick={() => jumpTo(k)} aria-label={`Jump to ${c.label}`}>
            <span>{c.n}</span><em>{c.label}</em>
          </button>
        ))}
      </nav>

      <div className="sx-badge" ref={badge} aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <defs><path id="sxCircle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
          <text><textPath href="#sxCircle" textLength="268" lengthAdjust="spacing">SCROLL TO BUILD · SCROLL TO BUILD ·</textPath></text>
        </svg>
        <b />
      </div>
      <div className="sx-hint" ref={hint} aria-hidden="true"><span /></div>
    </section>
  );
}
