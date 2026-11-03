import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import SteelBits from "../home3d/SteelBits";
import Cursor from "../home3d/Cursor";
import { bookCall } from "../home3d/booking";
import ROUTE_PATHS from "../../routes/RoutePath";
import useScrollStage, { isReduced, scrollToEl } from "../careers3d/useScrollStage";
import { HERO, PROJECTS, CASES, SPAN_NOTE, STATS, APPROACH, GALLERY, SIGNOFFS, CTA, TOTAL_AREA } from "./projectsData";
import "../home3d/home3d.css";
import "../home3d/home3d-v4.css";
import "../home3d/home3d-v5.css";
import "./projects3d.css";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = { wonder: "#2fd4c0", banswara: "#6cb6ff", assure: "#f2c14e" };
const fmt = (n) => n.toLocaleString("en-IN", { maximumFractionDigits: 1 });
const $ = (s) => gsap.utils.toArray(s);
const par = (trigger, scrub = 0.8) => ({ trigger, start: "top bottom", end: "bottom top", scrub });
const IO = "play reverse play reverse";
const io = (trigger, start = "top 88%", end = "bottom 10%") => ({ trigger, start, end, toggleActions: IO });

/* ---------- drawn plates for the gallery and the featured cards (swap in real photos with `src` in projectsData) ---------- */
function Plate({ kind, project, src, alt }) {
  const a = ACCENT[project];
  if (src) return <img className="pj-photo" src={src} alt={alt} loading="lazy" />;
  const shift = [0, 1, 2, 3];
  return (
    <svg className="pj-art" viewBox="0 0 400 300" role="img" aria-label={alt} style={{ "--a": a }}>
      <defs>
        <pattern id={`g-${kind}-${project}`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke={a} strokeOpacity=".14" /></pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#g-${kind}-${project})`} />
      <g fill="none" stroke={a} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        {kind === "frame" && (
          <>
            {shift.map((i) => <path key={i} opacity={1 - i * 0.2} d={`M${70 + i * 34} ${250 - i * 24}V${160 - i * 24}L${160 + i * 34} ${95 - i * 24}L${250 + i * 34} ${160 - i * 24}V${250 - i * 24}`} />)}
            {[[70, 160], [160, 95], [250, 160]].map(([x, y], k) => <path key={k} strokeOpacity=".5" strokeDasharray="4 5" d={`M${x} ${y}L${x + 102} ${y - 72}`} />)}
          </>
        )}
        {kind === "bays" && (
          <>
            <rect x="50" y="80" width="300" height="140" />
            {[0, 1, 2, 3, 4].map((i) => <path key={i} strokeOpacity=".6" d={`M${110 + i * 48} 80V220`} />)}
            <path strokeOpacity=".5" d="M50 150H350" strokeDasharray="3 6" />
            <path d="M50 244H350M50 238V250M350 238V250" strokeOpacity=".8" />
          </>
        )}
        {kind === "roof" && (
          <>
            <path d="M60 220L150 90H350L260 220Z" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} strokeOpacity=".55" d={`M${60 + i * 29} 220L${150 + i * 29} 90`} />)}
            {[0, 1, 2].map((i) => <path key={i} strokeOpacity=".4" strokeDasharray="3 6" d={`M${90 + i * 0} ${175 - i * 44}H${300 + 0}`} />)}
          </>
        )}
      </g>
    </svg>
  );
}

/* ---------- gallery ---------- */
function Tile({ item, onOpen, n }) {
  const el = useRef(null);
  useEffect(() => {
    if (isReduced() || !el.current) return undefined;
    const k = window.innerWidth > 1000 ? 1 : window.innerWidth > 600 ? 0.7 : 0.5;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.current, { opacity: 0, y: 120 * k, rotationX: -32, scale: 0.86, transformPerspective: 900 }, {
        opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: io(el.current, "top 94%", "bottom 6%"),
      });
      gsap.fromTo(el.current.querySelector(".pj-art, .pj-photo"), { yPercent: -9 }, { yPercent: 9, ease: "none", scrollTrigger: par(el.current, 0.6) });
    }, el);
    return () => ctx.revert();
  }, []);
  const tilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--ry", `${x * 14}deg`);
    e.currentTarget.style.setProperty("--rx", `${-y * 14}deg`);
    e.currentTarget.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
  };
  const rest = (e) => { e.currentTarget.style.setProperty("--ry", "0deg"); e.currentTarget.style.setProperty("--rx", "0deg"); };
  return (
    <figure className={`pj-tile t${n % 4}`} ref={el}>
      <button type="button" className="pj-tile-in" onClick={onOpen} onPointerMove={tilt} onPointerLeave={rest} aria-label={`Open: ${item.cap}`}>
        <span className="pj-tile-art"><Plate {...item} /></span>
        <figcaption><b>{PROJECTS.find((p) => p.id === item.project).client}</b><span>{item.cap}</span></figcaption>
      </button>
    </figure>
  );
}

function Gallery({ lenisRef }) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(-1);
  const list = filter === "all" ? GALLERY : GALLERY.filter((g) => g.project === filter);
  const closeRef = useRef(null);
  const trigRef = useRef(null);
  useEffect(() => { const t = setTimeout(() => ScrollTrigger.refresh(), 80); return () => clearTimeout(t); }, [filter]);
  useEffect(() => {
    if (open < 0) return undefined;
    lenisRef.current?.stop();
    closeRef.current?.focus();
    const key = (e) => {
      if (e.key === "Escape") setOpen(-1);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % list.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + list.length) % list.length);
    };
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("keydown", key); lenisRef.current?.start(); trigRef.current?.focus?.({ preventScroll: true }); };
  }, [open >= 0]); // eslint-disable-line react-hooks/exhaustive-deps
  const cur = list[open];
  return (
    <>
      <div className="pj-chips" role="group" aria-label="Filter gallery by project">
        {[["all", "All projects"], ...PROJECTS.map((p) => [p.id, p.client.replace(" Limited", "").replace(" Private", "")])].map(([id, label]) => (
          <button key={id} type="button" className={filter === id ? "on" : ""} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
        ))}
      </div>
      <div className="pj-masonry">
        {list.map((g, i) => <Tile key={`${filter}-${g.id}`} item={g} n={i} onOpen={(e) => { trigRef.current = e.currentTarget; setOpen(i); }} />)}
      </div>
      {cur && (
        <div className="pj-lb" role="dialog" aria-modal="true" aria-label={cur.cap} data-lenis-prevent onClick={(e) => e.target === e.currentTarget && setOpen(-1)}>
          <button ref={closeRef} className="pj-lb-x" type="button" aria-label="Close gallery" onClick={() => setOpen(-1)}><FaTimes /></button>
          <button className="pj-lb-n l" type="button" aria-label="Previous image" onClick={() => setOpen((i) => (i - 1 + list.length) % list.length)}><FaChevronLeft /></button>
          <div className="pj-lb-card" key={cur.id}>
            <Plate {...cur} />
            <p><b>{PROJECTS.find((p) => p.id === cur.project).client}</b> {cur.cap}</p>
          </div>
          <button className="pj-lb-n r" type="button" aria-label="Next image" onClick={() => setOpen((i) => (i + 1) % list.length)}><FaChevronRight /></button>
        </div>
      )}
    </>
  );
}

/* ---------- client sign-offs: 3D coverflow ---------- */
function Signoffs() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const n = SIGNOFFS.length;
  const go = useCallback((d) => setI((v) => (v + d + n) % n), [n]);
  useEffect(() => {
    if (hold || isReduced()) return undefined;
    const t = setInterval(() => go(1), 6500);
    return () => clearInterval(t);
  }, [hold, go]);
  const drag = useRef(0);
  return (
    <div className="pj-flow" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}
      onPointerDown={(e) => { drag.current = e.clientX; }}
      onPointerUp={(e) => { const dx = e.clientX - drag.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); }}>
      <div className="pj-flow-stage" aria-live="polite">
        {SIGNOFFS.map((s, k) => {
          let o = k - i;
          if (o > n / 2) o -= n;
          if (o < -n / 2) o += n;
          const p = PROJECTS.find((x) => x.id === s.id);
          return (
            <article key={s.id} className={`pj-sign${o === 0 ? " on" : ""}`} aria-hidden={o !== 0} style={{ "--o": o, "--a": ACCENT[s.id] }}>
              <span className="pj-sign-tag">Client sign-off</span>
              {s.quote ? <blockquote>{s.quote}</blockquote> : <blockquote>{s.line}</blockquote>}
              <footer>
                <b>{s.client}</b>
                <span>{s.doc}, {s.date}</span>
                <span>{p.title}</span>
              </footer>
            </article>
          );
        })}
      </div>
      <div className="pj-flow-ctl">
        <button type="button" onClick={() => go(-1)} aria-label="Previous sign-off"><FaChevronLeft /></button>
        {SIGNOFFS.map((s, k) => <button key={s.id} type="button" className={`dot${k === i ? " on" : ""}`} onClick={() => setI(k)} aria-label={`Show ${s.client}`} />)}
        <button type="button" onClick={() => go(1)} aria-label="Next sign-off"><FaChevronRight /></button>
      </div>
    </div>
  );
}

/* ---------- isometric footprints at scale ---------- */
const F = 3.1; // px per metre
const rect = (area, asp = 1.5) => [Math.sqrt(area * asp) * F, Math.sqrt(area / asp) * F];
const BLOCKS = [
  { id: "loom", name: "Loom Shed", area: 2380, x: 10, y: 20, c: "banswara" },
  { id: "ware", name: "Warehouse (Fiber & Yarn)", area: 2450, x: 250, y: 20, c: "banswara" },
  { id: "therm", name: "Thermopack TFH6000", area: 735, x: 500, y: 20, c: "banswara" },
  { id: "won", name: "Wonder Cement parking shed", area: 291.6, x: 500, y: 150, c: "wonder", dims: [16.2 * F, 18 * F] },
].map((b) => ({ ...b, dims: b.dims || rect(b.area) }));

function Box({ b }) {
  return (
    <div className="pj-box" style={{ left: b.x, top: b.y, width: b.dims[0], height: b.dims[1], "--c": ACCENT[b.c] }} data-box>
      <i className="top" /><i className="fr" /><i className="rt" />
    </div>
  );
}

/* ---------- page ---------- */
export default function ProjectSections() {
  const root = useRef(null);
  const navigate = useNavigate();
  const lenisRef = useScrollStage(root, ({ reduce, ctx, mm }) => {
    if (reduce) return;

    /* hero intro: plays on load and again on scrolling back to the top */
    ctx.add(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" }, onStart: () => gsap.set(".pj-h1-m", { overflow: "hidden" }) })
        .from(".pj-hero .pj-tag", { opacity: 0, y: -14, duration: 0.6 }, 0)
        .from(".pj-h1-w", { yPercent: 118, rotationX: -80, opacity: 0, stagger: 0.06, duration: 0.95, transformOrigin: "50% 100%", onComplete: () => gsap.set(".pj-h1-m", { overflow: "visible" }) }, 0.1)
        .from(".pj-hero-p, .pj-hero-cta > *", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8 }, 0.7)
        .from(".pj-fr", { y: -340, opacity: 0, rotationX: 80, stagger: 0.14, duration: 1.2, ease: "back.out(1.3)" }, 0.2)
        .from(".pj-pur", { opacity: 0, scaleX: 0, stagger: 0.04, duration: 0.8 }, 1.1)
        .from(".pj-floor", { opacity: 0, duration: 1 }, 0.2)
        .from(".pj-hero-stats > *", { y: 40, opacity: 0, stagger: 0.12, duration: 0.8 }, 1.1);
      ScrollTrigger.create({ trigger: ".pj-hero", start: "top top", end: "bottom 30%", onEnterBack: () => intro.restart() });
    });

    mm.add(
      { lg: "(min-width: 1001px)", md: "(min-width: 601px) and (max-width: 1000px)", wide: "(min-width: 861px)" },
      (c) => {
        const { lg, md } = c.conditions;
        const k = lg ? 1 : md ? 0.75 : 0.55;
        const heroST = (end = "bottom top") => ({ trigger: ".pj-hero", start: "top top", end, scrub: 0.8 });

        /* ===== HERO: the frame turns from elevation to plan view, then comes apart ===== */
        gsap.set(".pj-scene", { rotationX: 20, rotationY: -38 });
        gsap.to(".pj-scene", { rotationX: 64, rotationY: 34, y: 40 * k, ease: "none", scrollTrigger: heroST() });
        gsap.to(".pj-stage", { scale: 1 + 0.25 * k, yPercent: -8, ease: "none", scrollTrigger: heroST() });
        $(".pj-fr").forEach((el, i) => gsap.to(el, { x: (i - 2) * 46 * k, ease: "none", scrollTrigger: heroST() }));
        gsap.to(".pj-pur", { opacity: 0.12, ease: "none", scrollTrigger: heroST("60% top") });
        gsap.to(".pj-hero-copy", { yPercent: -14, opacity: 0.1, ease: "none", scrollTrigger: heroST() });
        $(".pj-h1-m").forEach((el, i) => gsap.to(el, { x: (i % 2 ? 1 : -1) * (24 + i * 8) * k, y: -(24 + i * 10) * k, rotation: (i % 2 ? 1 : -1) * 2.5 * k, ease: "none", scrollTrigger: heroST() }));
        gsap.to(".pj-blob.a", { y: 190 * k, x: -80 * k, ease: "none", scrollTrigger: heroST() });
        gsap.to(".pj-blob.b", { y: -150 * k, x: 90 * k, ease: "none", scrollTrigger: heroST() });
        gsap.to(".pj-scroll", { opacity: 0, y: 30, ease: "none", scrollTrigger: heroST("20% top") });
        if (matchMedia("(pointer: fine)").matches) {
          const ty = gsap.quickTo(".pj-tilt", "rotationY", { duration: 0.8, ease: "power3" });
          const tx = gsap.quickTo(".pj-tilt", "rotationX", { duration: 0.8, ease: "power3" });
          const mv = (e) => { ty((e.clientX / innerWidth - 0.5) * 16); tx(-(e.clientY / innerHeight - 0.5) * 12); };
          window.addEventListener("pointermove", mv);
          return () => window.removeEventListener("pointermove", mv);
        }
        return undefined;
      }
    );

    mm.add({ lg: "(min-width: 1001px)", md: "(min-width: 601px) and (max-width: 1000px)", wide: "(min-width: 861px)" }, (c) => {
      const { lg, md, wide } = c.conditions;
      const k = lg ? 1 : md ? 0.75 : 0.55;

      /* counters */
      $(".pj-count").forEach((el) => {
        const to = Number(el.dataset.to);
        const o = { v: 0 };
        ScrollTrigger.create({
          trigger: el, start: "top 94%", once: true,
          onEnter: () => gsap.to(o, { v: to, duration: 1.8, ease: "power2.out", onUpdate: () => { el.textContent = fmt(Math.round(o.v)); }, onComplete: () => { el.textContent = fmt(to); } }),
        });
      });

      /* section heads: tilt in and drift against the scroll */
      $(".pj-head").forEach((h) => {
        gsap.fromTo(h.children, { y: 50 * k, opacity: 0, rotationX: -40, transformPerspective: 800 }, { y: 0, opacity: 1, rotationX: 0, stagger: 0.12, duration: 0.95, ease: "power3.out", scrollTrigger: io(h, "top 88%", "bottom 10%") });
        gsap.fromTo(h, { y: 40 * k }, { y: -30 * k, ease: "none", scrollTrigger: par(h) });
      });

      /* ===== FEATURED: a stack of cards that swing past in 3D ===== */
      const cards = $(".pj-feat");
      if (wide) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".pj-fstage", start: "top top", end: `+=${cards.length * 100}%`, pin: true, scrub: 0.7, anticipatePin: 1 } });
        gsap.set(cards, { opacity: 0, rotationY: 70, x: "40%", scale: 0.8, transformPerspective: 1400 });
        gsap.set(cards[0], { opacity: 1, rotationY: 0, x: 0, scale: 1 });
        cards.forEach((el, i) => {
          if (i > 0) tl.to(el, { opacity: 1, rotationY: 0, x: 0, scale: 1, duration: 1, ease: "power2.out" }, i * 1.4 - 0.2);
          if (i < cards.length - 1) tl.to(el, { opacity: 0, rotationY: -70, x: "-40%", scale: 0.8, duration: 1, ease: "power2.in" }, i * 1.4 + 0.5);
          tl.fromTo(el.querySelector(".pj-feat-art"), { yPercent: 10, rotation: 4 }, { yPercent: -10, rotation: -4, duration: 1.6, ease: "none" }, i * 1.4 - 0.2);
          tl.fromTo(el.querySelector(".pj-feat-no"), { xPercent: 20 }, { xPercent: -30, duration: 1.8, ease: "none" }, i * 1.4 - 0.3);
        });
        tl.to({}, { duration: 0.2 });
        gsap.to(".pj-frail i", { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".pj-fstage", start: "top top", end: `+=${cards.length * 100}%`, scrub: true } });
      } else {
        cards.forEach((el) => {
          gsap.fromTo(el, { opacity: 0, rotationX: -22, y: 90 * k, scale: 0.9, transformPerspective: 900 }, { opacity: 1, rotationX: 0, y: 0, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: io(el, "top 90%", "bottom 8%") });
          gsap.fromTo(el.querySelector(".pj-feat-art"), { y: 30 * k }, { y: -30 * k, ease: "none", scrollTrigger: par(el) });
        });
      }

      /* ===== FOOTPRINTS AT SCALE: plate tilts and the buildings rise ===== */
      gsap.fromTo(".pj-iso-plate", { rotationX: 12, rotationZ: -90 }, { rotationX: 58, rotationZ: -36, ease: "none", scrollTrigger: { trigger: ".pj-iso", start: "top 85%", end: "center 45%", scrub: 0.8 } });
      gsap.fromTo(".pj-iso-plate", { y: 60 * k }, { y: -40 * k, ease: "none", scrollTrigger: par(".pj-iso") });
      $("[data-box]").forEach((b, i) => gsap.fromTo(b, { "--h": "0px" }, { "--h": "46px", ease: "none", scrollTrigger: { trigger: ".pj-iso", start: `top ${70 - i * 4}%`, end: `center ${50 - i * 3}%`, scrub: 0.6 } }));
      gsap.fromTo(".pj-bar i", { scaleX: 0 }, { scaleX: 1, stagger: 0.12, duration: 1.1, ease: "power3.out", scrollTrigger: io(".pj-legend", "top 85%", "bottom 10%") });
      gsap.fromTo(".pj-legend li", { x: 60 * k, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: io(".pj-legend", "top 88%", "bottom 10%") });

      /* ===== CASE STUDIES: folders tilt up, the stamp turns with the scroll ===== */
      $(".pj-case").forEach((cs) => {
        gsap.fromTo(cs.querySelector(".pj-case-no"), { xPercent: 20 }, { xPercent: -25, ease: "none", scrollTrigger: par(cs) });
        gsap.fromTo(cs.querySelector(".pj-stamp"), { rotation: -40, scale: 0.7 }, { rotation: 320, scale: 1, ease: "none", scrollTrigger: par(cs, 0.6) });
        gsap.fromTo(cs.querySelectorAll(".pj-case-l > *"), { x: -60 * k, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: io(cs, "top 72%", "bottom 25%") });
        cs.querySelectorAll(".pj-cs-block, .pj-cs-stats, .pj-chiplist").forEach((el, i) =>
          gsap.fromTo(el, { y: 90 * k, rotationX: -18, opacity: 0, transformPerspective: 1000 }, { y: 0, rotationX: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: io(el, "top 92%", "bottom 8%"), delay: wide ? i * 0.05 : 0 }));
        gsap.fromTo(cs.querySelectorAll(".pj-cs-stats > div"), { scale: 0.6, rotationY: 60, opacity: 0, transformPerspective: 800 }, { scale: 1, rotationY: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: "back.out(1.5)", scrollTrigger: io(cs.querySelector(".pj-cs-stats"), "top 90%", "bottom 8%") });
      });

      /* ===== APPROACH: five steps on a cylinder that spins with the scroll ===== */
      const panels = $(".pj-ring-p");
      const spin = gsap.to(".pj-spin", {
        rotationY: -72 * (panels.length - 1), ease: "none",
        scrollTrigger: {
          trigger: ".pj-ring", start: "top top", end: `+=${panels.length * 90}%`, pin: true, scrub: 0.6, anticipatePin: 1,
          onUpdate: (self) => { const idx = Math.round(self.progress * (panels.length - 1)); panels.forEach((p, i) => p.classList.toggle("on", i === idx)); },
        },
      });
      gsap.set(".pj-spin", { rotationY: 0 });
      gsap.fromTo(".pj-ring-head", { y: 0 }, { y: -60 * k, opacity: 0.25, ease: "none", scrollTrigger: { trigger: ".pj-ring", start: "top top", end: `+=${panels.length * 90}%`, scrub: true } });
      gsap.fromTo(".pj-ring-line i", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".pj-ring", start: "top top", end: `+=${panels.length * 90}%`, scrub: true } });
      void spin;

      /* ===== GALLERY ===== */
      gsap.to(".pj-gal .pj-ghost", { xPercent: -30, ease: "none", scrollTrigger: par(".pj-gal") });
      gsap.fromTo(".pj-chips", { y: 40 * k, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: io(".pj-chips", "top 92%", "bottom 8%") });

      /* ===== SIGN-OFFS ===== */
      gsap.fromTo(".pj-flow-stage", { y: 110 * k, rotationX: -18, opacity: 0, transformPerspective: 1200 }, { y: 0, rotationX: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: io(".pj-flow", "top 88%", "bottom 8%") });
      gsap.fromTo(".pj-flow", { y: 50 * k }, { y: -40 * k, ease: "none", scrollTrigger: par(".pj-sign-sec") });

      /* ===== CTA ===== */
      gsap.fromTo(".pj-cta .pj-ghost", { xPercent: 30 }, { xPercent: -40, ease: "none", scrollTrigger: par(".pj-cta") });
      gsap.fromTo(".pj-cta-in > *", { y: 70 * k, opacity: 0, rotationX: -30, transformPerspective: 900 }, { y: 0, opacity: 1, rotationX: 0, stagger: 0.14, duration: 1, ease: "power3.out", scrollTrigger: io(".pj-cta", "top 70%", "bottom 20%") });
      gsap.fromTo(".pj-cta-ring", { rotation: 0, scale: 0.7 }, { rotation: 200, scale: 1.1, ease: "none", scrollTrigger: par(".pj-cta") });

      /* depth marks drift at their own speed in every section */
      $(".pj-root .pj-sec, .pj-root .pj-hero").forEach((sec) => {
        const bits = sec.querySelectorAll(".sh-bit");
        if (bits.length) gsap.to(bits, { y: (i, el) => -(Number(el.dataset.sp) || 0.5) * 300 * k, ease: "none", scrollTrigger: par(sec, true) });
      });
    });
  });

  const toGallery = () => scrollToEl(lenisRef, root.current?.querySelector(".pj-gal"));
  const toFeat = () => scrollToEl(lenisRef, root.current?.querySelector(".pj-feats"));
  const talk = (e) => { e?.preventDefault?.(); bookCall(() => navigate(ROUTE_PATHS.CONTACT_US), e); };

  return (
    <div className="pj-root" ref={root}>
      <Cursor />

      {/* 1. Hero */}
      <header className="pj-hero">
        <SteelBits n={20} />
        <i className="pj-blob a" aria-hidden="true" />
        <i className="pj-blob b" aria-hidden="true" />
        <div className="pj-stage" aria-hidden="true">
          <div className="pj-tilt">
            <div className="pj-scene">
              <i className="pj-floor" />
              {[-2, -1, 0, 1, 2].map((z) => (
                <div className="pj-fr" key={z} style={{ transform: `translateZ(calc(var(--u) * ${z * 7}))` }}>
                  <i className="c l" /><i className="c r" /><i className="rf l" /><i className="rf r" /><i className="kb l" /><i className="kb r" />
                </div>
              ))}
              {[0, 0.34, 0.68, 1].flatMap((t) => [-1, 1].map((s) => (
                <i className="pj-pur" key={`${t}${s}`} style={{ transform: `translate3d(calc(var(--u) * ${s * (8 - t * 8)}), calc(var(--u) * ${-2.75 - 2.5 * t}), 0) rotateY(90deg)` }} />
              )))}
              {[-8, 8].map((x) => <i className="pj-pur eave" key={x} style={{ transform: `translate3d(calc(var(--u) * ${x}), calc(var(--u) * 5.25), 0) rotateY(90deg)` }} />)}
            </div>
          </div>
        </div>

        <div className="pj-hero-copy">
          <span className="pj-tag">Projects &amp; case studies</span>
          <h1 className="pj-h1" aria-label={HERO.title}>
            {HERO.title.split(" ").map((w, i) => (
              <span className="pj-h1-m" key={i} aria-hidden="true"><span className={`pj-h1-w${HERO.hl.has(w) ? " hl" : ""}`}>{w}</span></span>
            ))}
          </h1>
          <p className="pj-hero-p">{HERO.text}</p>
          <div className="pj-hero-cta">
            <button type="button" className="pj-btn" onClick={toFeat}>Explore our work<i><FaArrowRight /></i></button>
            <button type="button" className="pj-btn pj-btn--ghost" onClick={toGallery}>Project gallery</button>
          </div>
          <dl className="pj-hero-stats">
            {STATS.map(([v, unit, label]) => (
              <div key={label}><dt><span className="pj-count" data-to={v}>{fmt(v)}</span>{unit}</dt><dd>{label}</dd></div>
            ))}
          </dl>
        </div>
        <div className="pj-scroll" aria-hidden="true"><i />Scroll</div>
      </header>

      {/* 2. Featured projects */}
      <section className="pj-sec pj-feats" aria-label="Featured projects">
        <SteelBits n={14} />
        <div className="pj-head">
          <span className="pj-tag">Featured projects</span>
          <h2 className="pj-h2">Industrial buildings, steel fabrication, supply and installation</h2>
        </div>
        <div className="pj-fstage">
          {PROJECTS.map((p) => (
            <article className="pj-feat" key={p.id} style={{ "--a": ACCENT[p.id] }}>
              <span className="pj-feat-no" aria-hidden="true">{p.no}</span>
              <div className="pj-feat-txt">
                <span className="pj-feat-tag">{p.tag}</span>
                <h3>{p.client}</h3>
                <h4>{p.title}</h4>
                <p className="pj-feat-place">{p.place}</p>
                <p>{p.overview}</p>
                <dl className="pj-specs">
                  {p.specs.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
                </dl>
                <p className="pj-feat-dates">Purchase order {p.po}. Completed {p.done}.</p>
              </div>
              <div className="pj-feat-art"><Plate kind={p.id === "banswara" ? "bays" : "frame"} project={p.id} alt={`Drawing of the ${p.client} project`} /></div>
            </article>
          ))}
          <div className="pj-frail" aria-hidden="true"><i /></div>
        </div>
      </section>

      {/* 3. Footprints at scale */}
      <section className="pj-sec pj-iso" aria-label="Project footprints at scale">
        <SteelBits n={16} />
        <div className="pj-head">
          <span className="pj-tag">Scale of delivery</span>
          <h2 className="pj-h2">{fmt(TOTAL_AREA)} sq. m of covered area on record</h2>
        </div>
        <div className="pj-iso-grid">
          <div className="pj-iso-view" aria-hidden="true">
            <div className="pj-iso-wrap">
              <div className="pj-iso-plate">{BLOCKS.map((b) => <Box b={b} key={b.id} />)}</div>
            </div>
          </div>
          <div className="pj-legend">
            <ul>
              {BLOCKS.map((b) => (
                <li key={b.id} style={{ "--c": ACCENT[b.c] }}>
                  <span>{b.name}</span><b>{fmt(b.area)} sq. m</b>
                  <span className="pj-bar"><i style={{ width: `${(b.area / 2450) * 100}%` }} /></span>
                </li>
              ))}
            </ul>
            <p className="pj-note">{SPAN_NOTE} All buildings are extruded to the same height for comparison.</p>
          </div>
        </div>
      </section>

      {/* 4. Case studies */}
      <section className="pj-sec pj-cases" aria-label="Case studies">
        <SteelBits n={18} />
        <div className="pj-head">
          <span className="pj-tag">Case studies</span>
          <h2 className="pj-h2">How each project went from brief to handover</h2>
        </div>
        {CASES.map((c) => {
          const p = PROJECTS.find((x) => x.id === c.id);
          const s = SIGNOFFS.find((x) => x.id === c.id);
          return (
            <article className="pj-case" key={c.id} style={{ "--a": ACCENT[c.id] }}>
              <span className="pj-case-no" aria-hidden="true">{c.no}</span>
              <div className="pj-case-l">
                <span className="pj-feat-tag">{c.client}</span>
                <h3>{c.headline}</h3>
                <svg className="pj-stamp" viewBox="0 0 120 120" role="img" aria-label={`${s.doc}, ${s.date}`}>
                  <defs><path id={`st-${c.id}`} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
                  <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeOpacity=".5" strokeDasharray="2 4" />
                  <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeOpacity=".5" />
                  <text fontSize="7.4" fontWeight="800" fill="currentColor"><textPath href={`#st-${c.id}`} textLength="283" lengthAdjust="spacing">{`${s.doc}, ${s.date}`}</textPath></text>
                  <path d="M45 61l11 11 21-24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="pj-case-r">
                <div className="pj-cs-block"><h4>The brief</h4><p>{c.brief}</p></div>
                <div className="pj-cs-block"><h4>What we did</h4><p>{c.approach}</p></div>
                <ul className="pj-chiplist" aria-label="Scope of work">{p.scope.map((x) => <li key={x}>{x}</li>)}</ul>
                <div className="pj-cs-block"><h4>The result</h4><p>{c.result}</p></div>
                <div className="pj-cs-stats">{c.stats.map(([a, b]) => <div key={b}><b>{a}</b><span>{b}</span></div>)}</div>
              </div>
            </article>
          );
        })}
      </section>

      {/* 5. Approach */}
      <section className="pj-ring" aria-label="Our project approach">
        <SteelBits n={14} />
        <div className="pj-ring-head">
          <span className="pj-tag">Our project approach</span>
          <h2 className="pj-h2">From engineering to execution</h2>
          <p>Every project follows a coordinated approach focused on translating requirements into reliable built structures.</p>
        </div>
        <div className="pj-cyl-wrap">
          <div className="pj-cyl"><div className="pj-spin">
            {APPROACH.map(([t, d], i) => (
              <article className={`pj-ring-p${i === 0 ? " on" : ""}`} key={t} style={{ "--i": i }}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div></div>
        </div>
        <div className="pj-ring-line" aria-hidden="true"><i /></div>
      </section>

      {/* 6. Gallery */}
      <section className="pj-sec pj-gal" aria-label="Project gallery">
        <div className="pj-ghost" aria-hidden="true">Gallery</div>
        <SteelBits n={20} />
        <div className="pj-head">
          <span className="pj-tag">Project gallery</span>
          <h2 className="pj-h2">Structures we have raised</h2>
        </div>
        <Gallery lenisRef={lenisRef} />
      </section>

      {/* 7. Testimonials */}
      <section className="pj-sec pj-sign-sec" aria-label="Client testimonials">
        <SteelBits n={14} />
        <div className="pj-head">
          <span className="pj-tag">Client testimonials</span>
          <h2 className="pj-h2">What our clients have put in writing</h2>
        </div>
        <Signoffs />
      </section>

      {/* 8. CTA */}
      <section className="pj-sec pj-cta" aria-label="Start a project">
        <div className="pj-ghost" aria-hidden="true">Build</div>
        <i className="pj-cta-ring" aria-hidden="true" />
        <SteelBits n={18} />
        <div className="pj-cta-in">
          <span className="pj-tag">Start a project</span>
          <h2 className="pj-h2">{CTA.h}</h2>
          <p>{CTA.p}</p>
          <a className="pj-btn" href={ROUTE_PATHS.CONTACT_US} onClick={talk}>{CTA.btn}<i><FaArrowRight /></i></a>
        </div>
      </section>
    </div>
  );
}
