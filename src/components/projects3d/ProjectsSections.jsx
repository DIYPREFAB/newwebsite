import { createElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import ROUTE_PATHS from "../../routes/RoutePath";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { lenisOptions, lenisTick } from "../../utils/lenisTick";
import { FaArrowDown, FaArrowRight, FaCheck, FaChevronLeft, FaChevronRight, FaClipboardCheck, FaDraftingCompass, FaExternalLinkAlt, FaFileSignature, FaHardHat, FaIndustry, FaLayerGroup, FaMapMarkerAlt, FaTimes, FaTools, FaTruck, FaWarehouse } from "react-icons/fa";
import { navItems } from "../../Constants";
import SteelBits from "../home3d/SteelBits";
import BimHero from "./BimHero";
import HeroBackdrop from "./HeroBackdrop";
import Cursor from "../home3d/Cursor";
import { bookCall } from "../home3d/booking";
import {
  RESPECT_REDUCED_MOTION, HERO, PROJECTS_HEAD, PROJECTS, CASES_HEAD, CASES, APPROACH,
  TESTIMONIALS_HEAD, TESTIMONIALS, CTA,
} from "./projectsData";
import "../home3d/home3d.css";
import "../home3d/home3d-v4.css";
import "../home3d/home3d-v5.css";
import "./projects3d.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const pad2 = (v) => String(v).padStart(2, "0");

// scroll-triggered entrance that plays on the way down and reverses on the way back up
const io = (trigger, start = "top 88%", end = "bottom 10%") => ({ trigger, start, end, toggleActions: "play none none reverse" });

// mouse tilt for cards (fine pointers only; touch screens get the scroll-driven 3D instead)
const tiltMove = (e) => {
  if (e.pointerType === "touch") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return;
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.transform = `perspective(1100px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg)`;
};
const tiltLeave = (e) => { e.currentTarget.style.transform = ""; };

// Testimonials sit on one circular orbit (a tilted ellipse seen from the front). T is the card that is in front,
// as a continuous number, so every card travels along the same circle: front -> side -> behind -> other side.
// At rest (T a whole number) it is the 3-card coverflow: left card, front card, right card.
const TM = TESTIMONIALS.filter((t) => t.carousel !== false); // what the carousel shows
const cover = (client) => (PROJECTS.find((p) => p.client === client) || PROJECTS[0]).cover;
const RING = { xr: 73.75, zr: 173, tilt: 46 };
const placeRing = (cards, T) => {
  const n = cards.length || 1;
  const step = (Math.PI * 2) / n;
  cards.forEach((el, j) => {
    const f = (j - T) * step;
    const c = Math.cos(f);
    const s = Math.sin(f);
    gsap.set(el, {
      xPercent: s * RING.xr,
      z: (c - 1) * RING.zr,
      rotationY: -s * RING.tilt,
      scale: 0.88 + 0.12 * ((c + 1) / 2),
      opacity: 0.5 + 0.5 * Math.min(1, Math.max(0, (c + 0.5) / 1.5)),
      zIndex: 10 + Math.round(c * 10),
      pointerEvents: c > 0.9 ? "auto" : "none",
    });
  });
};

// Client logo on a white tile; if the file is missing, a monogram keeps the layout intact.
function ClientLogo({ src, name, bg }) {
  const [bad, setBad] = useState(!src);
  const mono = name.split(/\s+/).filter((w) => !/^(limited|private|pvt|ltd)$/i.test(w)).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <span className="pj-tc-logo" style={bg ? { background: bg } : undefined}>
      {bad ? <b aria-hidden="true">{mono}</b> : <img src={src} alt={`${name} logo`} loading="lazy" decoding="async" draggable="false" onError={() => setBad(true)} />}
    </span>
  );
}

const reducedNow = () => RESPECT_REDUCED_MOTION && typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// "16.2 m" -> ["16.2", "m"]; "Banswara" -> ["Banswara", ""]
const splitNum = (v) => {
  const m = /^(\d[\d.,]*)\s*(.*)$/.exec(String(v));
  return m ? [m[1], m[2]] : [String(v), ""];
};
const countAttrs = (raw) => ({ "data-to": parseFloat(raw.replace(/,/g, "")), "data-dec": (raw.split(".")[1] || "").length });
// picks a line icon for a scope item from its wording (falls back to a tick)
const SCOPE_ICONS = [
  [/supervis|inspect|quality|safety/i, FaClipboardCheck],
  [/install|erect|commission/i, FaHardHat],
  [/deliver|transport|logistic|dispatch/i, FaTruck],
  [/gutter|downspout|bolt|connection|fastener|accessor/i, FaTools],
  [/sheet|roof|wall|cladding|panel|skylight|louver/i, FaWarehouse],
  [/secondary|purlin|girt|brac|component/i, FaLayerGroup],
  [/fabricat|manufactur|supply/i, FaIndustry],
  [/design|engineer|detail|drawing/i, FaDraftingCompass],
];
const scopeIcon = (t) => (SCOPE_ICONS.find(([re]) => re.test(t)) || [null, FaCheck])[1];
const FigN = ({ raw }) => {
  const [n, u] = splitNum(raw);
  return (
    <b className="pj-fig-n">
      <span className="pj-fig-v"><span className="pj-cnt" {...countAttrs(n)}>{n}</span>{u && <small>{u}</small>}</span>
    </b>
  );
};
const fmtNum = (n, dec) => n.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });

function Words({ text, hl = [] }) {
  const set = new Set(hl);
  return text.split(" ").map((w, i) => (
    <span className="pj-m" key={i} aria-hidden="true">
      <span className={`pj-w${set.has(w) ? " hl" : ""}`}>
        {[...w].map((c, j) => <span className="pj-c" key={j}>{c}</span>)}
      </span>
    </span>
  ));
}
function Split({ text, hl, className, tag = "span" }) {
  return createElement(tag, { className, "aria-label": text }, <Words text={text} hl={hl} />);
}

/* =====================================================================
   Featured project card: a blueprint drawn from the project's own data on top, the facts underneath.
   The whole card opens the project sheet (the title is the real button).
   ===================================================================== */
// Card cover: the client's logo fills the whole cover on its own background (monogram if the file is missing).
function CardLogo({ p }) {
  const [bad, setBad] = useState(!p.logo);
  const mono = p.client.split(/\s+/).filter((w) => !/^(limited|private|pvt|ltd\.?)$/i.test(w)).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const bg = p.logoBg || "#ffffff";
  const dark = bg.toLowerCase() !== "#ffffff";
  return (
    <span className={`pj-card-logo${dark ? "" : " is-light"}`} style={{ background: bg }}>
      <span className="pj-sk pj-card-logo-img">
        {bad ? <b>{mono}</b> : <img src={p.logo} alt="" loading="lazy" decoding="async" draggable="false" onError={() => setBad(true)} />}
      </span>
    </span>
  );
}

function ProjectCard({ p, i, onOpen }) {
  const po = p.meta.find(([l]) => /purchase/i.test(l))?.[1];
  return (
    <article className="pj-card" id={`pj-card-${p.id}`}>
      <div className="pj-card-drift">
        <div className="pj-card-tilt">
          <div className="pj-card-in" onClick={() => onOpen(i)} data-cursor="Open">
            <div className="pj-card-viz" aria-hidden="true">
              <i className="pj-card-grid" />
              <CardLogo p={p} />
              <span className="pj-card-badge">{p.badge}</span>
              <span className="pj-card-no">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="pj-card-body">
              <span className="pj-client">{p.client}</span>
              <h3 className="pj-card-t">
                <button type="button" className="pj-card-open" onClick={(e) => { e.stopPropagation(); onOpen(i); }}>{p.title}</button>
              </h3>
              <span className="pj-place"><FaMapMarkerAlt aria-hidden="true" />{p.location}</span>
              <dl className="pj-card-stats">
                <div><dt>{p.kpi.label}</dt><dd>{p.kpi.big}{p.kpi.unit && <small>{p.kpi.unit}</small>}</dd></div>
                {po && <div><dt>Purchase order</dt><dd>{po}</dd></div>}
              </dl>
              <span className="pj-card-go" aria-hidden="true">View project<i><FaArrowRight /></i></span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* Wonder Cement: the footprint drawn to scale from the two real dimensions (48.8 m x 45 m) */
function PlanSketch({ plan, area }) {
  const SX = 250 / plan.w;
  const w = plan.w * SX;
  const h = plan.l * SX;
  const x0 = 76;
  const y0 = 54;
  return (
    <svg className="pj-plan" viewBox={`0 0 380 ${y0 + h + 24}`} role="img" aria-label={`Plan view to scale: ${plan.w} m wide by ${plan.l} m long, ${area}`}>
      <defs>
        <pattern id="pj-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V10" stroke="currentColor" strokeOpacity=".22" strokeWidth="1" />
        </pattern>
      </defs>
      <rect className="pj-plan-fill" x={x0} y={y0} width={w} height={h} fill="url(#pj-hatch)" />
      <rect className="dr" pathLength="1" x={x0} y={y0} width={w} height={h} fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path className="dr dim" pathLength="1" d={`M${x0} ${y0 - 20}H${x0 + w}M${x0} ${y0 - 27}V${y0 - 13}M${x0 + w} ${y0 - 27}V${y0 - 13}`} fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path className="dr dim" pathLength="1" d={`M${x0 - 22} ${y0}V${y0 + h}M${x0 - 29} ${y0}H${x0 - 15}M${x0 - 29} ${y0 + h}H${x0 - 15}`} fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text className="pj-plan-t" x={x0 + w / 2} y={y0 - 28} textAnchor="middle">{plan.w} m</text>
      <text className="pj-plan-t" x={x0 - 34} y={y0 + h / 2} textAnchor="middle" transform={`rotate(-90 ${x0 - 34} ${y0 + h / 2})`}>{plan.l} m</text>
      <text className="pj-plan-a" x={x0 + w / 2} y={y0 + h / 2 + 5} textAnchor="middle">{area}</text>
    </svg>
  );
}

/* =====================================================================
   Project sheet: opens out of the card, then every detail scrolls in parallax.
   ===================================================================== */
function Sheet({ index, onClose, onSwitch, onTalk, lenisRef }) {
  const p = PROJECTS[index];
  const nextI = (index + 1) % PROJECTS.length;
  const next = PROJECTS[nextI];
  const rec = TESTIMONIALS.find((t) => t.client === p.client);
  const sheet = useRef(null);
  const lbEl = useRef(null);
  const closing = useRef(false);
  const latest = useRef({});
  const swipe = useRef(null);
  const [lb, setLb] = useState(null);
  const lbDir = useRef(0); // 0 = opened, 1 = next, -1 = previous (drives the slide direction in the photo viewer)
  const [ratios, setRatios] = useState({}); // real width / height of each gallery photo, measured when it loads
  const setRatio = (src, el) => {
    if (!el || !el.naturalWidth || !el.naturalHeight) return;
    const r = el.naturalWidth / el.naturalHeight;
    setRatios((o) => (Math.abs((o[src] || 0) - r) < 0.001 ? o : { ...o, [src]: r }));
  };
  // the cover photo's real ratio drives the height of the cover picture box (see .pj-sh-cv-img in the CSS)
  const setCvRatio = (el) => {
    if (!el || !el.naturalWidth || !el.naturalHeight) return;
    const box = el.closest(".pj-sh-cv");
    if (box) box.style.setProperty("--cv-r", String(el.naturalWidth / el.naturalHeight));
  };

  const facts = [...p.meta, ["Location", p.location], ...(rec ? [["Completion record", `${rec.doc}, ${rec.date}`]] : [])];
  const totalSpec = p.specs.find(([l]) => /total/i.test(l));
  const totalNum = totalSpec ? parseFloat(totalSpec[1].replace(/,/g, "")) : 0;

  const requestClose = () => {
    if (closing.current) return;
    closing.current = true;
    const el = sheet.current;
    if (!el || reducedNow()) { onClose(); return; }
    gsap.to(el, { opacity: 0, duration: 0.25, ease: "power1.out", onComplete: onClose });
  };
  const stepLb = (d) => { lbDir.current = d; setLb((v) => (v === null ? v : (v + d + p.gallery.length) % p.gallery.length)); };
  latest.current = { lb, requestClose, stepLb };

  /* ---- keys (Escape, arrows, focus trap inside the photo viewer only). The page scrolls with the browser scroll bar. */
  useEffect(() => {
    const onKey = (e) => {
      const { lb: open, requestClose: close, stepLb: step } = latest.current;
      if (e.key === "Escape") { e.preventDefault(); if (open !== null) setLb(null); else close(); return; }
      if (open === null) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key !== "Tab") return;
      const scope = lbEl.current;
      if (!scope) return;
      const f = [...scope.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])")].filter((n) => !n.disabled && n.getClientRects().length);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !scope.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !scope.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- while the full-screen photo viewer is open the page behind it must not scroll */
  useEffect(() => {
    if (lb === null) return undefined;
    const body = document.body;
    const prev = { o: body.style.overflow, p: body.style.paddingRight };
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;
    lenisRef.current?.stop();
    return () => {
      body.style.overflow = prev.o;
      body.style.paddingRight = prev.p;
      lenisRef.current?.start();
    };
  }, [lb === null]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- entrance + every parallax layer inside the sheet (the sheet's own scroller drives them) */
  useLayoutEffect(() => {
    const el = sheet.current;
    if (!el || reducedNow()) return undefined;
    const k = window.innerWidth > 1000 ? 1 : window.innerWidth > 600 ? 0.8 : 0.6;
    const q = (s) => gsap.utils.toArray(s, el);
    const Q = (s) => el.querySelector(s);
    const S = (trigger, extra = {}) => ({ trigger, ...extra });
    const par = (trigger, scrub = 0.6, start = "top bottom", end = "bottom top") => S(trigger, { start, end, scrub });
    const on = (trigger, start = "top 88%") => S(trigger, { start, toggleActions: "play none none reverse" });
    const count = (c, trg, start) => {
      const to = Number(c.dataset.to);
      const dec = Number(c.dataset.dec || 0);
      const o = { v: 0 };
      c.textContent = fmtNum(0, dec);
      gsap.to(o, { v: to, duration: 1.8, ease: "power2.out", onUpdate: () => { c.textContent = fmtNum(o.v, dec); }, scrollTrigger: on(trg, start) });
    };

    const pointerOff = [];
    const ctx = gsap.context(() => {
      /* entrance */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(el, { opacity: 0, duration: 0.5 }, 0).from(Q(".pj-sh-cv-img"), { scale: 1.15, duration: 1.2, ease: "power2.out" }, 0);
      tl.from(q(".pj-sh-bar > :not(.pj-sh-prog)"), { y: -28, opacity: 0, stagger: 0.08, duration: 0.5 }, 0.3)
        .from(q(".pj-sh-cv .pj-c"), { yPercent: 115, rotationX: -80, opacity: 0, stagger: 0.015, duration: 0.7, transformOrigin: "50% 100%" }, 0.2)
        .from(q(".pj-sh-cv-fade"), { y: 34, opacity: 0, stagger: 0.07, duration: 0.6 }, 0.35)
        .from(q(".pj-cvf"), { y: 22, opacity: 0, stagger: 0.08, duration: 0.55 }, 0.7)
        .fromTo(Q(".pj-sh-cv-facts"), { "--ln": 0 }, { "--ln": 1, duration: 1, ease: "power3.inOut" }, 0.6)
        .add(() => gsap.set(q(".pj-sh-cv .pj-m"), { overflow: "visible" }));

      /* progress through the sheet */
      gsap.to(Q(".pj-sh-prog"), { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

      /* cover: the photo drifts slower than the page, the copy lifts and fades as you leave it */
      const cv = Q(".pj-sh-cv");
      gsap.to(Q(".pj-sh-cv-img img"), { yPercent: 4, ease: "none", scrollTrigger: par(cv, 0.6, "top top") });
      gsap.to(Q(".pj-sh-cv-copy"), { y: -120 * k, opacity: 0.05, ease: "none", scrollTrigger: par(cv, 0.6, "top top", "bottom 25%") });
      { const kc = Q(".pj-sh-cv .pj-cnt"); if (kc) count(kc, kc, "top 98%"); }

      /* pointer tilt (mouse only): the panel leans toward the cursor */
      const fp = matchMedia("(pointer: fine)").matches;
      const tilt = (el, max = 5) => {
        if (!fp || !el) return;
        gsap.set(el, { transformPerspective: 1100 });
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });
        const mv = (e) => { const r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * max * 2); rx(-((e.clientY - r.top) / r.height - 0.5) * max * 2); };
        const lv = () => { rx(0); ry(0); };
        el.addEventListener("pointermove", mv); el.addEventListener("pointerleave", lv);
        pointerOff.push(() => { el.removeEventListener("pointermove", mv); el.removeEventListener("pointerleave", lv); });
      };

      /* overview: label slides in, the paragraph rises word by word out of a mask, the details card opens upward
         and its hairlines draw one after another */
      const ov = Q(".pj-sh-ov");
      gsap.from(Q(".pj-sh-ov .pj-sh-k"), { y: 24 * k, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: on(ov, "top 78%") });
      gsap.from(q(".pj-sh-ov-t .pj-w"), { yPercent: 118, stagger: 0.016, duration: 1.1, ease: "power4.out", scrollTrigger: on(ov, "top 74%") });
      gsap.fromTo(Q(".pj-sh-ov-main"), { y: 20 * k }, { y: -20 * k, ease: "none", scrollTrigger: par(ov, 0.8) });
      const card = Q(".pj-sh-card");
      gsap.fromTo(card, { opacity: 0, scale: 0.95, clipPath: "inset(14% 0% 0% 0% round 20px)" }, { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 1.2, ease: "power4.out", clearProps: "clipPath", scrollTrigger: on(ov, "top 72%") });
      gsap.fromTo(card, { "--ln": 0 }, { "--ln": 1, duration: 1.3, ease: "power3.inOut", scrollTrigger: on(ov, "top 72%") });
      gsap.fromTo(q(".pj-sh-fact"), { "--ln": 0 }, { "--ln": 1, duration: 1.1, stagger: 0.14, delay: 0.3, ease: "power3.inOut", scrollTrigger: on(ov, "top 72%") });
      gsap.from(q(".pj-sh-card-h, .pj-sh-fact dt, .pj-sh-fact dd"), { y: 16 * k, opacity: 0, stagger: 0.06, duration: 0.8, delay: 0.35, ease: "power3.out", scrollTrigger: on(ov, "top 72%") });
      gsap.fromTo(card, { y: 22 * k }, { y: -22 * k, ease: "none", scrollTrigger: par(ov, 0.8) });
      tilt(card, 4);

      /* specifications: the blueprint panel is wiped open, the plan is drawn and a scan line sweeps it; the figure cells
         open upward in a diagonal sequence and their numbers roll up out of a mask while they count */
      const sp = Q(".pj-sh-spec");
      gsap.from(q(".pj-sp-head > *"), { y: 30 * k, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: on(sp, "top 80%") });
      const bp = Q(".pj-bp");
      if (bp) {
        const scan = bp.querySelector(".pj-bp-scan");
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: on(bp, "top 85%") });
        tl.fromTo(bp, { clipPath: "inset(0% 0% 100% 0% round 6px)", opacity: 0 }, { clipPath: "inset(0% 0% 0% 0% round 6px)", opacity: 1, duration: 1.2, ease: "power4.inOut", clearProps: "clipPath" }, 0)
          .fromTo(bp.querySelectorAll(".dr"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, stagger: 0.25, ease: "power2.inOut" }, 0.5)
          .from(bp.querySelectorAll(".pj-plan-fill, .pj-plan text, .pj-bp-tag, .pj-bp-c"), { opacity: 0, duration: 1, stagger: 0.08 }, 1.2)
          .fromTo(scan, { left: "0%", opacity: 1 }, { left: "100%", duration: 1.6, ease: "power2.inOut" }, 0.7)
          .to(scan, { opacity: 0, duration: 0.3 }, 2.1);
        gsap.fromTo(bp, { y: 36 * k }, { y: -36 * k, ease: "none", scrollTrigger: par(bp, 0.8) });
        tilt(bp, 4);
      }
      q(".pj-fig").forEach((f, i) => {
        const d = (i % 2) * 0.1 + Math.floor(i / 2) * 0.08;
        const v = f.querySelector(".pj-fig-v");
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: on(f, "top 92%") });
        tl.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power4.inOut", clearProps: "clipPath" }, d)
          .from(f.querySelectorAll(".pj-fig-l, .pj-fig-i"), { y: 14, opacity: 0, stagger: 0.06, duration: 0.7 }, d + 0.35)
          .from(v, { yPercent: 110, duration: 1, ease: "power4.out" }, d + 0.3);
        const c = f.querySelector(".pj-cnt");
        if (c && Number.isFinite(Number(c.dataset.to))) count(c, f, "top 90%");
        if (fp) {
          const mv = (e) => { const r = f.getBoundingClientRect(); f.style.setProperty("--mx", `${e.clientX - r.left}px`); f.style.setProperty("--my", `${e.clientY - r.top}px`); };
          f.addEventListener("pointermove", mv);
          pointerOff.push(() => f.removeEventListener("pointermove", mv));
        }
      });
      q(".pj-bar").forEach((b, i) => {
        gsap.from(b, { y: 40 * k, opacity: 0, duration: 0.8, delay: i * 0.05, scrollTrigger: on(b, "top 94%") });
        gsap.fromTo(b.querySelector(".pj-bar-f"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 1.5, ease: "power3.out", scrollTrigger: on(b, "top 94%") });
      });
      q(".pj-row").forEach((r) => {
        gsap.from(r, { y: 36 * k, opacity: 0, duration: 0.85, ease: "power3.out", scrollTrigger: on(r, "top 94%") });
      });

      /* scope: cards. Each card stands up out of the floor (a tilted plane that swings upright) while its hairline draws;
         once seated, the icon and the title drift at different speeds for depth, and with a mouse the card leans toward
         the cursor. Everything is tied to the scroll position, so it reverses when you scroll back up. */
      const scp = Q(".pj-sh-scope");
      gsap.from(q(".pj-sc-head > *"), { y: 30 * k, opacity: 0, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: on(scp, "top 76%") });
      q(".pj-sc").forEach((li, i) => {
        const col = i % 3;
        const inn = li.querySelector(".pj-sc-in");
        gsap.fromTo(li, { y: 80 * k, opacity: 0, rotationX: -26, scale: 0.94, transformPerspective: 900, transformOrigin: "50% 100%" }, { y: 0, opacity: 1, rotationX: 0, scale: 1, ease: "none", scrollTrigger: S(li, { start: `top ${98 - col * 3}%`, end: `top ${70 - col * 3}%`, scrub: 0.6 }) });
        gsap.fromTo(inn, { "--ln": 0 }, { "--ln": 1, ease: "none", scrollTrigger: S(li, { start: `top ${92 - col * 3}%`, end: `top ${60 - col * 3}%`, scrub: 0.5 }) });
        gsap.fromTo(li.querySelector(".pj-sc-ic"), { y: -16 * k }, { y: 16 * k, ease: "none", scrollTrigger: par(li, 0.6) });
        gsap.fromTo(li.querySelector(".pj-sc-t"), { y: 10 * k }, { y: -10 * k, ease: "none", scrollTrigger: par(li, 0.6) });
        tilt(inn, 5);
        if (fp) {
          const mv = (e) => { const r = inn.getBoundingClientRect(); inn.style.setProperty("--mx", `${e.clientX - r.left}px`); inn.style.setProperty("--my", `${e.clientY - r.top}px`); };
          inn.addEventListener("pointermove", mv);
          pointerOff.push(() => inn.removeEventListener("pointermove", mv));
        }
      });

      /* outcome (light): the photo opens from a small inset window into its full frame while the image settles from a zoom,
         and the paragraph is "read" word by word as you scroll, with a rail filling beside it. All scrubbed, so reversible. */
      const out = Q(".pj-sh-out");
      const win = { start: "top 85%", end: "top 20%", scrub: 0.6 };
      const rd = { start: "top 62%", end: "center 38%", scrub: 0.5 };
      gsap.from(Q(".pj-sh-out .pj-sh-k"), { y: 24 * k, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: on(out, "top 78%") });
      const ofig = Q(".pj-out-fig");
      gsap.fromTo(ofig, { clipPath: "inset(20% 16% 20% 16% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none", scrollTrigger: S(out, win) });
      gsap.fromTo(ofig.querySelector("img"), { scale: 1.3 }, { scale: 1.04, ease: "none", scrollTrigger: S(out, win) });
      gsap.fromTo(ofig.querySelector("img"), { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: par(out, 0.6) });
      gsap.fromTo(Q(".pj-out-chip"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: S(out, { start: "top 50%", end: "top 25%", scrub: 0.5 }) });
      gsap.fromTo(q(".pj-sh-out-t .pj-w"), { opacity: 0.14 }, { opacity: 1, stagger: { each: 0.1 }, ease: "none", scrollTrigger: S(out, rd) });
      gsap.fromTo(Q(".pj-out-rail b"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: S(out, rd) });
      gsap.fromTo(Q(".pj-sh-doc"), { y: 30 * k, opacity: 0, clipPath: "inset(0% 100% 0% 0% round 14px)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0% round 14px)", ease: "none", scrollTrigger: S(out, { start: "top 45%", end: "top 20%", scrub: 0.5 }) });
      gsap.fromTo(Q(".pj-out-main"), { y: 26 * k }, { y: -26 * k, ease: "none", scrollTrigger: par(out, 0.8) });

      /* gallery: each frame is wiped open (alternating sides) while its photo settles from a slow zoom, then the label
         and badge rise in. With a mouse the photo shifts against the pointer and a glare follows the cursor. */
      const fine = matchMedia("(pointer: fine)").matches;
      q(".pj-gf").forEach((f, i) => {
        const inn = f.querySelector(".pj-gf-in");
        const img = f.querySelector("img");
        const bits = f.querySelectorAll(".pj-gf-cap, .pj-gf-view");
        const left = i % 2 === 0;
        const d = (i % 2) * 0.14 + Math.floor(i / 2) * 0.08;
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        tl.fromTo(inn, { clipPath: left ? "inset(0% 100% 0% 0% round 14px)" : "inset(0% 0% 0% 100% round 14px)", y: 30 * k }, { clipPath: "inset(0% 0% 0% 0% round 14px)", y: 0, duration: 1.15, ease: "power4.inOut", clearProps: "clipPath,transform" }, d)
          .fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "power2.out", clearProps: "transform" }, d)
          .fromTo(bits, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, clearProps: "opacity,transform" }, d + 0.7);
        // plays every time the frame scrolls into view (down or up) and rewinds once it has left
        ScrollTrigger.create(S(f, { start: "top 94%", end: "bottom 6%", onEnter: () => tl.restart(), onEnterBack: () => tl.restart(), onLeave: () => tl.pause(0), onLeaveBack: () => tl.pause(0) }));
        if (fine) {
          const qx = gsap.quickTo(img, "x", { duration: 0.9, ease: "power3.out" });
          const qy = gsap.quickTo(img, "y", { duration: 0.9, ease: "power3.out" });
          const mv = (e) => {
            const r = inn.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            qx(-nx * 22); qy(-ny * 16);
            inn.style.setProperty("--mx", `${(nx + 0.5) * 100}%`);
            inn.style.setProperty("--my", `${(ny + 0.5) * 100}%`);
          };
          const lv = () => { qx(0); qy(0); };
          inn.addEventListener("pointermove", mv);
          inn.addEventListener("pointerleave", lv);
          pointerOff.push(() => { inn.removeEventListener("pointermove", mv); inn.removeEventListener("pointerleave", lv); });
        }
      });
      gsap.from(q(".pj-sh-gal .pj-sh-k"), { y: 40, opacity: 0, duration: 0.8, scrollTrigger: on(Q(".pj-sh-gal"), "top 80%") });
      gsap.fromTo(Q(".pj-gal-note .ln"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 1.3, ease: "power3.out", scrollTrigger: on(Q(".pj-gal-note"), "top 98%") });
      gsap.from(q(".pj-gal-note span"), { y: 22, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: on(Q(".pj-gal-note"), "top 98%") });

      /* next project */
      gsap.from(q(".pj-sh-ft .pj-sh-next, .pj-sh-ft-a > *"), { y: 36 * k, opacity: 0, stagger: 0.12, duration: 0.9, scrollTrigger: on(Q(".pj-sh-ft"), "top 85%") });
    }, el);

    const r1 = setTimeout(() => ScrollTrigger.refresh(), 150);
    const r2 = setTimeout(() => ScrollTrigger.refresh(), 900);
    return () => { clearTimeout(r1); clearTimeout(r2); pointerOff.forEach((f) => f()); ctx.revert(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cvDate = p.meta.find(([l]) => /purchase|contract/i.test(l)) || null;
  const goOverview = () => {
    const ov = sheet.current && sheet.current.querySelector(".pj-sh-ov");
    if (!ov) return;
    const y = ov.getBoundingClientRect().top + window.scrollY - 64;
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };
  const figs = p.specs.map(([label, value]) => ({ label, value, parts: splitNum(value) }));

  return (
    <div className="pj-sheet" ref={sheet} role="main" aria-labelledby="pj-sh-title">
      <div className="pj-sh-bar">
        <span className="pj-sh-cnt"><b>{pad2(index + 1)}</b> / {pad2(PROJECTS.length)}</span>
        <span className="pj-sh-who">{p.client}</span>
        <button type="button" className="pj-sh-x" onClick={requestClose} data-mag><span>Close</span><FaTimes aria-hidden="true" /></button>
        <i className="pj-sh-prog" aria-hidden="true" />
      </div>

      <div className="pj-sh-scroll">
        {/* ---- cover */}
        <header className="pj-sh-cv">
          <div className="pj-sh-cv-img" aria-hidden="true"><img src={p.cover.src} alt="" ref={(el) => { if (el && el.complete && el.naturalWidth) setCvRatio(el); }} onLoad={(e) => setCvRatio(e.currentTarget)} /></div>
          <i className="pj-sh-cv-shade" aria-hidden="true" />
          <i className="pj-sh-cv-grid" aria-hidden="true" />
          <div className="pj-sh-cv-copy">
            <div className="pj-sh-cv-top pj-sh-cv-fade">
              <span className="pj-sh-cv-tag">Project {pad2(index + 1)}</span>
              <span className="pj-sh-badge">{p.badge}</span>
            </div>
            <span className="pj-client pj-sh-cv-fade">{p.client}</span>
            <h2 id="pj-sh-title" className="pj-sh-h" aria-label={p.title}><Words text={p.title} /></h2>
            <div className="pj-sh-cv-facts pj-sh-cv-fade">
              <div className="pj-cvf pj-cvf--kpi">
                <span className="pj-cvf-l">{p.kpi.label}</span>
                <span className="pj-cvf-v">
                  {/^[\d.,]+$/.test(p.kpi.big) ? <span className="pj-cnt" {...countAttrs(p.kpi.big)}>{p.kpi.big}</span> : p.kpi.big}
                  {p.kpi.unit && <small>{p.kpi.unit}</small>}
                </span>
              </div>
              <div className="pj-cvf"><span className="pj-cvf-l">Location</span><span className="pj-cvf-v"><FaMapMarkerAlt aria-hidden="true" />{p.location}</span></div>
              {cvDate && <div className="pj-cvf"><span className="pj-cvf-l">{cvDate[0]}</span><span className="pj-cvf-v">{cvDate[1]}</span></div>}
              <button type="button" className="pj-cvf-go" onClick={goOverview} aria-label="Scroll to project overview" data-mag><FaArrowDown aria-hidden="true" /></button>
            </div>
          </div>
        </header>

        {/* ---- overview */}
        <section className="pj-sh-sec pj-sh-ov" aria-label="Project overview">
          <div className="pj-sh-in pj-sh-ov-g">
            <div className="pj-sh-ov-main">
              <h3 className="pj-sh-k">Project overview</h3>
              <p className="pj-sh-ov-t" aria-label={p.overview}><Words text={p.overview} /></p>
            </div>
            <aside className="pj-sh-card" aria-label="Project details">
              <span className="pj-sh-card-h">Project details</span>
              <dl className="pj-sh-facts">
                {facts.map(([a, b]) => <div className="pj-sh-fact" key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
              </dl>
            </aside>
          </div>
        </section>

        {/* ---- specifications */}
        <section className="pj-sh-sec pj-sh-spec" aria-label="Specifications">
          <div className="pj-sh-in">
            <div className="pj-sp-head">
              <h3 className="pj-sh-k">Specifications</h3>
              <span className="pj-sp-cnt"><b>{pad2(p.specs.length)}</b>key figures</span>
            </div>

            {p.specMode === "plan" && (
              <div className="pj-sp-plan">
                <div className="pj-bp">
                  <i className="pj-bp-c a" aria-hidden="true" /><i className="pj-bp-c b" aria-hidden="true" /><i className="pj-bp-c c" aria-hidden="true" /><i className="pj-bp-c d" aria-hidden="true" />
                  <span className="pj-bp-tag">Plan view</span>
                  <span className="pj-bp-tag pj-bp-tag--r">Drawn to scale</span>
                  <i className="pj-bp-scan" aria-hidden="true" />
                  <PlanSketch plan={p.plan} area={p.area} />
                </div>
                <div className="pj-figs">
                  {figs.map((f, i) => (
                    <div className="pj-fig" key={f.label}>
                      <span className="pj-fig-i" aria-hidden="true">{pad2(i + 1)}</span>
                      <span className="pj-fig-l">{f.label}</span>
                      <FigN raw={f.value} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {p.specMode === "bars" && (
              <div className="pj-sp-bars">
                {totalSpec && (
                  <div className="pj-fig pj-fig--total">
                    <span className="pj-fig-l">{totalSpec[0]}</span>
                    <FigN raw={totalSpec[1]} />
                  </div>
                )}
                <ul className="pj-bars" aria-label="Area of each building, as a share of the total">
                  {p.buildings.map((b) => {
                    const a = parseFloat(b.area.replace(/,/g, ""));
                    return (
                      <li className="pj-bar" key={b.name}>
                        <span className="pj-bar-n">{b.name}</span>
                        <span className="pj-bar-t"><i className="pj-bar-f" style={{ width: `${(a / totalNum) * 100}%` }} /></span>
                        <em>{b.area}</em>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {p.specMode === "rows" && (
              <dl className="pj-rows">
                {p.specs.map(([a, b]) => <div className="pj-row" key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
              </dl>
            )}
          </div>
        </section>

        {/* ---- scope */}
        <section className="pj-sh-sec pj-sh-scope" aria-label="Scope of work">
          <div className="pj-sh-in">
            <div className="pj-sc-head">
              <h3 className="pj-sh-k">Scope of work</h3>
              <span className="pj-sc-cnt"><b>{pad2(p.scope.length)}</b>{p.scope.length === 1 ? "item" : "items"} in scope</span>
            </div>
            <ul className="pj-sc-list">
              {p.scope.map((s, i) => {
                const Ic = scopeIcon(s);
                return (
                  <li className="pj-sc" key={s}>
                    <div className="pj-sc-in">
                      <div className="pj-sc-top">
                        <span className="pj-sc-ic" aria-hidden="true"><Ic /></span>
                        <span className="pj-sc-n" aria-hidden="true">{pad2(i + 1)}</span>
                      </div>
                      <span className="pj-sc-t">{s}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ---- outcome (light) */}
        <section className="pj-sh-out" aria-label="Project outcome">
          <div className="pj-sh-in pj-out-g">
            <div className="pj-out-main">
              <h3 className="pj-sh-k">Project outcome</h3>
              <div className="pj-out-txt">
                <i className="pj-out-rail" aria-hidden="true"><b /></i>
                <p className="pj-sh-out-t" aria-label={p.outcome}><Words text={p.outcome} /></p>
              </div>
              {rec && (
                <div className="pj-sh-doc">
                  <span className="pj-doc-ic" aria-hidden="true"><FaFileSignature /></span>
                  <span className="pj-doc-t"><small>{rec.docLabel || "Completion record"}</small><span>{rec.doc}</span></span>
                  <b>{rec.date}</b>
                </div>
              )}
            </div>
            <figure className="pj-out-fig" aria-hidden="true">
              <img src={(p.gallery[1] || p.cover).src} alt="" loading="lazy" />
              <figcaption className="pj-out-chip">{p.badge}</figcaption>
            </figure>
          </div>
        </section>

        {/* ---- gallery */}
        <section className="pj-sh-sec pj-sh-gal" aria-label="Project gallery">
          <div className="pj-sh-in">
            <div className="pj-sh-gal-h">
              <h3 className="pj-sh-k">Project gallery</h3>
            </div>
            {/* Rows of two. Every frame takes its photo's exact ratio and the two frames in a row share one height, so the
                photos are never cropped and the whole set (four photos = two rows) stays on one screen. */}
            <div className="pj-gg">
              {Array.from({ length: Math.ceil(p.gallery.length / 2) }, (_, r) => p.gallery.slice(r * 2, r * 2 + 2).map((g, j) => ({ g, i: r * 2 + j }))).map((row, ri) => (
                <div className="pj-gr" key={ri} style={{ "--n": row.length, "--sum": row.reduce((a, { g }) => a + (ratios[g.src] || 1.5), 0) }}>
                  {row.map(({ g, i }) => (
                    <div className="pj-gf" key={g.src} style={{ "--ar": ratios[g.src] || 1.5 }}>
                      <button type="button" className="pj-gf-in" onClick={() => { lbDir.current = 0; setLb(i); }} aria-label={`Enlarge photo: ${g.cap}`} data-cursor="View">
                        <img src={g.src} alt={g.alt} decoding="async" ref={(el) => { if (el && el.complete) setRatio(g.src, el); }} onLoad={(e) => setRatio(g.src, e.currentTarget)} />
                        <span className="pj-gf-no">{String(i + 1).padStart(2, "0")}</span>
                        <span className="pj-gf-cap">{g.cap}</span>
                        <span className="pj-gf-view" aria-hidden="true">View<FaArrowRight /></span>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="pj-gal-note"><i className="ln" aria-hidden="true" /><span>{p.galleryNote || "A look at the plant floor where our steel is cut, fitted and checked."}</span></p>
          </div>
        </section>

        {/* ---- next project */}
        <footer className="pj-sh-ft">
          <div className="pj-sh-in">
            <button type="button" className="pj-sh-next" onClick={() => onSwitch(nextI)} data-cursor="Next">
              <span>Next project</span>
              <strong>{next.client}</strong>
              <em>{next.title}</em>
              <i aria-hidden="true"><FaArrowRight /></i>
            </button>
            <div className="pj-sh-ft-a">
              <button type="button" className="pj-btn" onClick={onTalk} data-mag>Discuss your project<i><FaArrowRight aria-hidden="true" /></i></button>
              <button type="button" className="pj-btn pj-btn--ghost" onClick={requestClose} data-mag>Back to all projects</button>
            </div>
          </div>
        </footer>
      </div>

      {/* ---- photo viewer */}
      {lb !== null && p.gallery[lb] && (
        <div
          className="pj-lb"
          ref={lbEl}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setLb(null)}
          onTouchStart={(e) => { swipe.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (swipe.current === null) return;
            const dx = e.changedTouches[0].clientX - swipe.current;
            swipe.current = null;
            if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1);
          }}
        >
          <button type="button" className="pj-lb-x" onClick={() => setLb(null)} aria-label="Close photo viewer" autoFocus><FaTimes aria-hidden="true" /></button>
          <button type="button" className="pj-lb-n p" onClick={(e) => { e.stopPropagation(); stepLb(-1); }} aria-label="Previous photo"><FaChevronLeft aria-hidden="true" /></button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img key={lb} className={lbDir.current > 0 ? "go-n" : lbDir.current < 0 ? "go-p" : ""} src={p.gallery[lb].src} alt={p.gallery[lb].alt} />
            <figcaption key={`c${lb}`}><strong>{p.gallery[lb].cap}</strong><span>{lb + 1} / {p.gallery.length}</span></figcaption>
            <i className="pj-lb-bar" aria-hidden="true"><b style={{ width: `${((lb + 1) / p.gallery.length) * 100}%` }} /></i>
          </figure>
          <button type="button" className="pj-lb-n n" onClick={(e) => { e.stopPropagation(); stepLb(1); }} aria-label="Next photo"><FaChevronRight aria-hidden="true" /></button>
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   A project's own page (/project-case-studies/<id>). It uses the window scroll (one browser scroll bar) with smooth
   scrolling, and every parallax layer in the Sheet is driven by that window scroll.
   ===================================================================== */
export function ProjectDetailView({ projectId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const lenisRef = useRef(null);
  const index = PROJECTS.findIndex((p) => p.id === projectId);
  const listPath = ROUTE_PATHS.PROJECT_CASE_STUDIES;
  const contactLink = navItems.find((n) => n.title === "Contact Us")?.link || "/contact-us";

  useEffect(() => {
    const reduce = reducedNow();
    document.body.classList.add("pj-3d", "pj-detail-page");
    document.body.classList.toggle("pj-reduce", reduce);
    let lenis;
    let tick;
    if (!reduce) {
      lenis = new Lenis(lenisOptions);
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = lenisTick(lenis);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(100, 33);
    }
    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", onLoad);
      document.body.classList.remove("pj-3d", "pj-reduce", "pj-detail-page");
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  // opening another project (Next project) starts at its top
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [index]);

  if (index < 0) return <Navigate to={listPath} replace />;

  // Close: step back to the list when we came from it (the list restores its scroll position), else go to the list
  const close = () => {
    if (location.state?.fromList) navigate(-1);
    else navigate(listPath);
  };
  const switchTo = (i) => navigate(`${listPath}/${PROJECTS[i].id}`, { replace: true, state: location.state });
  const talk = (e) => {
    e?.preventDefault?.();
    bookCall(() => navigate(contactLink), e);
  };

  return (
    <div className="pj-root pj-detail">
      <Cursor />
      <Sheet key={projectId} index={index} onClose={close} onSwitch={switchTo} onTalk={talk} lenisRef={lenisRef} />
    </div>
  );
}

export default function ProjectsSections() {
  const root = useRef(null);
  const lenisRef = useRef(null);
  const navigate = useNavigate();
  const navType = useNavigationType();
  const [ti, setTi] = useState(0); // testimonial in front (small screens; on large screens scrolling drives it)
  const tmST = useRef(null); // the pinned testimonial ScrollTrigger, when active
  const tmCur = useRef(0);
  const ringT = useRef({ v: 0, to: 0 }); // orbit position of the testimonial ring (small screens)

  const contactLink = navItems.find((n) => n.title === "Contact Us")?.link || "/contact-us";
  const talk = (e) => {
    e?.preventDefault?.();
    bookCall(() => navigate(contactLink), e);
  };

  const jump = (sel) => {
    const el = root.current?.querySelector(sel);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -70, duration: 1.7 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  /* ---- a project opens on its own page (/project-case-studies/<id>); the list remembers where it was scrolled to */
  const projectPath = (i) => `${ROUTE_PATHS.PROJECT_CASE_STUDIES}/${PROJECTS[i].id}`;
  const openProject = (i) => {
    try { sessionStorage.setItem("pj-scroll", String(Math.round(window.scrollY))); } catch { /* storage unavailable */ }
    navigate(projectPath(i), { state: { fromList: true } });
  };
  // old links of the form /project-case-studies#project-<id> go to the project's page
  useEffect(() => {
    const m = /^#project-([\w-]+)$/.exec(window.location.hash);
    if (m && PROJECTS.some((p) => p.id === m[1])) navigate(`${ROUTE_PATHS.PROJECT_CASE_STUDIES}/${m[1]}`, { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- first placement of the testimonial orbit (before paint) */
  useLayoutEffect(() => {
    if (root.current) placeRing(gsap.utils.toArray(".pj-tc", root.current), 0);
  }, []);

  /* ---- all motion */
  useEffect(() => {
    const rootEl = root.current;
    const reduce = reducedNow();
    document.body.classList.add("pj-3d");
    document.body.classList.toggle("pj-reduce", reduce);

    let lenis, tick;
    if (!reduce) {
      lenis = new Lenis(lenisOptions);
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = lenisTick(lenis);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(100, 33);
    }

    const mm = gsap.matchMedia(rootEl);
    if (!reduce) {
      mm.add(
        {
          lg: "(min-width: 1101px)",
          md: "(min-width: 601px) and (max-width: 1100px)",
          fine: "(pointer: fine)",
          wide: "(min-width: 761px)",
          pin: "(min-width: 761px) and (min-height: 560px)", // same query the CSS uses for the pinned layouts
        },
        (c) => {
          const { lg, md, pin, fine } = c.conditions;
          const k = lg ? 1 : md ? 0.8 : 0.6; // motion strength per device size (nothing is switched off, it is scaled)
          const $ = (s) => gsap.utils.toArray(s, rootEl);
          const vh = () => window.innerHeight;
          const cleanups = [];
          const par = (trigger, scrub = 0.8, start = "top bottom", end = "bottom top") => ({ trigger, start, end, scrub });

          gsap.to(".pj-progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

          /* ---------- shared helpers ---------- */
          const headReveal = (scope) => {
            gsap.from(`${scope} .pj-ch-copy .pj-tag`, { opacity: 0, x: -30, duration: 0.7, ease: "power3.out", scrollTrigger: io(`${scope} .pj-ch-copy`, "top 85%") });
            gsap.from(`${scope} .pj-ch-copy .pj-c`, { yPercent: 115, rotationX: -80, opacity: 0, stagger: 0.018, duration: 0.9, transformOrigin: "50% 100%", ease: "power3.out", scrollTrigger: io(`${scope} .pj-ch-copy`, "top 82%") });
            gsap.from(`${scope} .pj-ch-copy .pj-lead`, { y: 50 * k, opacity: 0, rotationX: -25, transformPerspective: 900, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: io(`${scope} .pj-ch-copy`, "top 70%") });
          };
          const ghost = (scope, dir = 1) => gsap.fromTo(`${scope} .pj-ghost`, { xPercent: 12 * dir, rotationX: 50, opacity: 0.3 }, { xPercent: -14 * dir, rotationX: -25, opacity: 1, transformPerspective: 900, ease: "none", scrollTrigger: par(scope) });
          const flyIn = (sel, opts = {}) => {
            $(sel).forEach((el, i) => {
              const side = i % 2 ? 1 : -1;
              gsap.fromTo(el, { opacity: 0, y: 120 * k, x: side * 60 * k, z: -300, rotationX: -40, rotationY: side * -20, transformPerspective: 1200, scale: 0.86 }, { opacity: 1, y: 0, x: 0, z: 0, rotationX: 0, rotationY: 0, scale: 1, duration: 1.1, delay: opts.cols ? (i % opts.cols) * 0.1 : 0, ease: "power3.out", scrollTrigger: io(el, "top 93%", "bottom 5%") });
            });
          };

          /* ================================================= HERO ================================================= */
          const heroST = (end = "bottom top") => par(".pj-hero", 0.8, "top top", end);
          gsap.set(".pj-hero .pj-m", { overflow: "hidden" });
          const heroCount = rootEl.querySelector(".pj-cnt-h");
          const hc = { v: 0 };
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } })
            .from(".pj-bg-grid, .pj-bg-glow", { opacity: 0, duration: 1.8, stagger: 0.15, clearProps: "opacity" }, 0)
            .from(".pj-bg-frames path", { strokeDashoffset: 1, duration: 2.2, stagger: 0.1, ease: "power2.inOut", clearProps: "strokeDashoffset" }, 0.1)
            .from(".pj-bg-truss path", { strokeDashoffset: 1, duration: 2.4, ease: "power2.inOut", clearProps: "strokeDashoffset" }, 0.4)
            .from(".pj-bg-truss circle", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: { each: 0.03, from: "start" }, ease: "back.out(2)", clearProps: "transform" }, 0.9)
            .from(".pj-hero .pj-tag", { opacity: 0, y: -14, duration: 0.6 }, 0.1)
            .from(".pj-hero .pj-c", { yPercent: 120, rotationX: -80, opacity: 0, stagger: 0.02, duration: 0.9, transformOrigin: "50% 100%", onComplete: () => gsap.set(".pj-hero .pj-m", { overflow: "visible" }) }, 0.15)
            .from(".pj-hero-p, .pj-hero-s, .pj-hero-cta > *", { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, clearProps: "opacity,transform" }, 0.9)
            .fromTo(".pj-bim", { clipPath: "inset(0% 0% 100% 0% round 30px)", scale: 0.94 }, { clipPath: "inset(0% 0% 0% 0% round 30px)", scale: 1, duration: 1.4, ease: "power4.inOut", clearProps: "clipPath,transform" }, 0.5)
            .from(".pj-bim-hud > *", { y: 24, opacity: 0, stagger: 0.14, duration: 0.9, clearProps: "opacity,transform" }, 1.3)
            .from(".pj-hero-foot > *", { y: 46, opacity: 0, stagger: 0.1, duration: 0.9, clearProps: "opacity,transform" }, 1.35);
          if (heroCount) {
            heroCount.textContent = "0";
            intro.to(hc, { v: Number(heroCount.dataset.to), duration: 1.9, ease: "power2.out", onUpdate: () => { heroCount.textContent = fmtNum(hc.v, 0); } }, 1.5);
          }
          ScrollTrigger.create({ trigger: ".pj-hero", start: "top top", end: "bottom 30%", onEnterBack: () => intro.restart() });
          gsap.to(".pj-hero-copy", { yPercent: -12, opacity: 0.1, ease: "none", scrollTrigger: heroST() });
          // backdrop layers travel at different speeds (far = slow, near = fast, truss goes the other way)
          gsap.to(".pj-bg-grid", { yPercent: 14, ease: "none", scrollTrigger: heroST() });
          gsap.to(".pj-bg-frames", { yPercent: 28 * k, scale: 1.16, transformOrigin: "50% 70%", ease: "none", scrollTrigger: heroST() });
          gsap.to(".pj-bg-truss", { yPercent: -70 * k, xPercent: 5, ease: "none", scrollTrigger: heroST() });
          gsap.to(".pj-bg-glow.a", { yPercent: 70 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".pj-bg-glow.b", { yPercent: -50 * k, xPercent: -10, ease: "none", scrollTrigger: heroST() });
          // pointer depth: each layer follows the mouse by a different amount
          if (c.conditions.fine) {
            const heroEl = rootEl.querySelector(".pj-hero");
            const layers = [[".pj-bg-grid", 10], [".pj-bg-frames", 26], [".pj-bg-truss", -38], [".pj-bg-glow.a", 60], [".pj-bg-glow.b", -48]].map(([sel, amt]) => {
              const el = rootEl.querySelector(sel);
              return { amt, x: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3" }), y: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3" }) };
            });
            const onMove = (e) => {
              const r = heroEl.getBoundingClientRect();
              const nx = ((e.clientX - r.left) / r.width - 0.5) * 2, ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
              layers.forEach((l) => { l.x(nx * l.amt); l.y(ny * l.amt * 0.6); });
            };
            heroEl.addEventListener("pointermove", onMove);
            cleanups.push(() => heroEl.removeEventListener("pointermove", onMove));
          }
          gsap.to(".pj-hero-art", { y: -70 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".pj-hero-foot", { y: -50 * k, ease: "none", scrollTrigger: heroST() });

          /* ================================================= 01 FEATURED PROJECTS ================================================= */
          headReveal(".pj-pj");
          ghost(".pj-pj");
          // Cards: calm and static. Each card is uncovered with a "curtain" reveal (once), its blueprint draws itself, the
          // text rises and the headline figure counts up. Nothing floats or rolls while scrolling. With a mouse the
          // blueprint and badge shift slightly against the pointer and a soft glare follows the cursor; the rest of the
          // hover motion (lift, border glow, sheen, redraw) lives in the CSS.
          const cards = $(".pj-card");
          const topOf = (el) => Math.round(el.getBoundingClientRect().top);
          const cols = Math.max(1, cards.filter((c) => Math.abs(topOf(c) - topOf(cards[0])) < 8).length);
          cards.forEach((card, i) => {
            const inn = card.querySelector(".pj-card-in");
            const sk = card.querySelector(".pj-sk");
            const badge = card.querySelector(".pj-card-badge");
            const grid = card.querySelector(".pj-card-grid");
            const lines = card.querySelectorAll(".pj-sk .ln");
            const marks = card.querySelectorAll(".pj-sk .tx, .pj-sk .nd, .pj-sk .fillh");
            const parts = card.querySelectorAll(".pj-card-body > *");
            const kpi = card.querySelector(".pj-card-stats > div:first-child > dd");
            const kpiNode = kpi && kpi.firstChild && kpi.firstChild.nodeType === 3 ? kpi.firstChild : null;
            const kpiRaw = kpiNode ? kpiNode.nodeValue.trim() : "";
            const kpiNum = /^[\d.,]+$/.test(kpiRaw) ? parseFloat(kpiRaw.replace(/,/g, "")) : null;
            const kpiDec = kpiNum === null ? 0 : (kpiRaw.split(".")[1] || "").length;
            const d = (i % cols) * 0.1;
            const cnt = { v: 0 };
            const once = { trigger: card, start: "top 92%", once: true };

            const tl = gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: once });
            tl.fromTo(inn, { clipPath: "inset(100% 0% 0% 0% round 16px)", y: 48 * k, scale: 0.97 }, { clipPath: "inset(0% 0% 0% 0% round 16px)", y: 0, scale: 1, duration: 1.05, ease: "power4.inOut", clearProps: "clipPath,transform" }, d)
              .fromTo(grid, { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out", clearProps: "opacity,transform" }, d + 0.1)
              .fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.05, ease: "power2.inOut", clearProps: "strokeDashoffset" }, d + 0.4)
              .fromTo(marks, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.03, clearProps: "opacity" }, d + 0.9)
              .from(badge, { scale: 0.6, opacity: 0, transformOrigin: "0% 50%", duration: 0.6, ease: "back.out(2)", clearProps: "opacity,transform" }, d + 0.5)
              .from(parts, { y: 20, opacity: 0, duration: 0.75, stagger: 0.07, clearProps: "opacity,transform" }, d + 0.45);
            if (kpiNum !== null) {
              const finalTxt = fmtNum(kpiNum, kpiDec);
              tl.to(cnt, { v: kpiNum, duration: 1.3, ease: "power2.out", onUpdate: () => { kpiNode.nodeValue = fmtNum(cnt.v, kpiDec); }, onComplete: () => { kpiNode.nodeValue = finalTxt; } }, d + 0.6);
            }

            // pointer: blueprint and badge shift slightly against the cursor, glare under the cursor
            if (fine) {
              const qt = (el, prop) => gsap.quickTo(el, prop, { duration: 0.8, ease: "power3.out" });
              const skx = qt(sk, "x");
              const sky = qt(sk, "y");
              const bx = qt(badge, "x");
              const by = qt(badge, "y");
              const onMove = (e) => {
                if (e.pointerType === "touch") return;
                const r = card.getBoundingClientRect();
                const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
                const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
                skx(-nx * 7); sky(-ny * 5); bx(nx * 4); by(ny * 3);
                inn.style.setProperty("--mx", `${(nx / 2 + 0.5) * 100}%`);
                inn.style.setProperty("--my", `${(ny / 2 + 0.5) * 100}%`);
              };
              const onLeave = () => { skx(0); sky(0); bx(0); by(0); };
              card.addEventListener("pointermove", onMove);
              card.addEventListener("pointerleave", onLeave);
              cleanups.push(() => { card.removeEventListener("pointermove", onMove); card.removeEventListener("pointerleave", onLeave); });
            }
          });

          /* ================================================= 02 CASE STUDIES (pinned 3D carousel) ================================================= */
          headReveal(".pj-cs");
          ghost(".pj-cs");
          {
            const stage = rootEl.querySelector(".pj-cs-stage");
            const slides = $(".pj-slide");
            const NS = slides.length;
            const dots = $(".pj-cs-dots i");
            if (pin) {
              const dur = () => vh() * 4.4;
              gsap.set(slides, { opacity: 0, x: "30%" });
              gsap.set(slides[0], { opacity: 1, x: "0%" });
              let cur = -1;
              const setSlide = (i) => {
                if (i === cur || !rootEl.isConnected) return;
                cur = i;
                slides.forEach((s, j) => { s.classList.toggle("on", j === i); const a = s.querySelector(".pj-slide-link"); if (a) a.tabIndex = j === i ? 0 : -1; });
                dots.forEach((d, j) => { d.classList.toggle("on", j === i); d.classList.toggle("done", j < i); });
                const cn = rootEl.querySelector(".pj-cs-count b");
                if (cn) cn.textContent = pad2(i + 1);
              };
              setSlide(0);
              const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${dur()}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
                onUpdate: () => setSlide(Math.max(0, Math.min(NS - 1, Math.floor(tl.time() + 0.12)))),
              });
              tl.to(".pj-cs-bar i", { scaleX: 1, duration: NS - 1 }, 0);
              for (let i = 1; i < NS; i++) {
                tl.to(slides[i - 1], { opacity: 0, x: "-32%", duration: 0.55, ease: "power2.in" }, i - 0.6)
                  .fromTo(slides[i], { opacity: 0, x: "32%" }, { opacity: 1, x: "0%", duration: 0.6, ease: "power2.out", immediateRender: false }, i - 0.45);
              }
              tl.to({}, { duration: 0.0001 }, NS - 1 + 0.4);
              gsap.fromTo(".pj-cs-ghost", { xPercent: 8 }, { xPercent: -26, ease: "none", scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${dur()}`, scrub: true } });
            } else {
              slides.forEach((s) => s.classList.add("on"));
              $(".pj-slide").forEach((el) => gsap.from(el, { y: 60 * k, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: io(el, "top 93%", "bottom 5%") }));
              $(".pj-slide .pj-st").forEach((el, i) => gsap.from(el, { y: 40, opacity: 0, duration: 0.8, delay: (i % 4) * 0.06, ease: "power3.out", scrollTrigger: io(el, "top 95%", "bottom 5%") }));
            }
          }

          /* ================================================= 03 APPROACH (pinned revolving ring) ================================================= */
          headReveal(".pj-ap");
          ghost(".pj-ap", -1);
          {
            const sec = rootEl.querySelector(".pj-ap-pin");
            const panels = $(".pj-rp");
            const NP = panels.length;
            if (pin) {
              const dur = () => vh() * 4.2;
              const ring = ".pj-ring";
              gsap.set(ring, { rotationY: 0 });
              let cur = -1;
              const setP = (i) => {
                if (i === cur || !rootEl.isConnected) return;
                cur = i;
                panels.forEach((p, j) => p.classList.toggle("on", j === i));
                $(".pj-ap-dots i").forEach((d, j) => { d.classList.toggle("on", j === i); d.classList.toggle("done", j < i); });
              };
              setP(0);
              const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: { trigger: sec, start: "top top", end: () => `+=${dur()}`, pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
                onUpdate: () => setP(Math.max(0, Math.min(NP - 1, Math.round(tl.progress() * (NP - 1))))),
              });
              tl.to(ring, { rotationY: -(360 / NP) * (NP - 1), duration: 1 }, 0)
                .fromTo(".pj-ring-tilt", { rotationX: 14 }, { rotationX: -8, duration: 1 }, 0)
                .fromTo(".pj-ring-floor", { rotation: 0 }, { rotation: 300, duration: 1 }, 0);
            } else {
              panels.forEach((p) => p.classList.add("on"));
              flyIn(".pj-rp-in");
            }
          }

          /* ================================================= 05 TESTIMONIALS ================================================= */
          headReveal(".pj-tm");
          ghost(".pj-tm", -1);
          gsap.fromTo(".pj-tm-stage", { opacity: 0, rotationX: 38, z: -420, y: 120 * k, transformPerspective: 1300 }, { opacity: 1, rotationX: 0, z: 0, y: 0, duration: 1.3, ease: "power3.out", scrollTrigger: io(".pj-tm-stage", "top 90%", "bottom 5%") });
          gsap.fromTo(".pj-tm-mark", { y: 120 * k, rotationY: -40, scale: 0.9 }, { y: -160 * k, rotationY: 40, scale: 1.12, transformPerspective: 800, ease: "none", scrollTrigger: par(".pj-tm", 0.9) });
          // the cards are dealt out of a stack as the block scrolls into view (scrubbed, so it follows the scroll both ways)
          gsap.fromTo(".pj-tc-in", { y: 90 * k, rotationX: -24, scale: 0.9 }, { y: 0, rotationX: 0, scale: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: ".pj-tm-stage", start: "top 98%", end: "top 40%", scrub: 0.7 } });
          // layers inside each card drift at their own speed while the block passes
          gsap.fromTo(".pj-tc-photo img", { yPercent: -5, scale: 1.15 }, { yPercent: 5, scale: 1.15, ease: "none", scrollTrigger: par(".pj-tm-pin", 0.8) });
          gsap.fromTo(".pj-tc-act", { y: 24 * k, opacity: 0.3 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".pj-tm-stage", start: "top 92%", end: "top 38%", scrub: 0.6 } });
          // controls come in as one group (the buttons themselves are never animated, so they cannot drift out of line)
          gsap.from(".pj-tm-ctrl", { y: 30, opacity: 0, duration: 0.7, clearProps: "opacity,transform", scrollTrigger: io(".pj-tm-ctrl", "top 96%") });
          if (pin) {
            // pinned + scrubbed, exactly like the case studies: scrolling drives a continuous 3D coverflow, each card rests in front for a while
            const wrap = rootEl.querySelector(".pj-tm-pin");
            const stageEl = rootEl.querySelector(".pj-tm-stage");
            const cardsEl = $(".pj-tc");
            const dotsEl = $(".pj-tm-dots button");
            const NT = cardsEl.length;
            const span = Math.max(1, NT - 1);
            const dur = () => vh() * 1.4 * NT;
            stageEl.classList.add("is-scrub");
            const place = (T) => placeRing(cardsEl, T);
            let cur = -1;
            const mark = (i) => {
              if (i === cur) return;
              cur = i;
              tmCur.current = i;
              cardsEl.forEach((el, j) => { el.classList.toggle("front", j === i); el.setAttribute("aria-hidden", String(j !== i)); el.querySelectorAll("a, button").forEach((a) => { a.tabIndex = j === i ? 0 : -1; }); });
              dotsEl.forEach((d, j) => { d.classList.toggle("on", j === i); d.setAttribute("aria-current", String(j === i)); });
            };
            const dwell = (x) => { const f = Math.floor(x), fr = x - f; const e = fr < 0.3 ? 0 : fr > 0.7 ? 1 : (fr - 0.3) / 0.4; return f + e * e * (3 - 2 * e); };
            const proxy = { x: 0 };
            place(0);
            mark(0);
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: wrap, start: "center center", end: () => `+=${dur()}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
              onUpdate: () => { const T = dwell(proxy.x); place(T); mark(Math.max(0, Math.min(NT - 1, Math.round(T)))); },
            });
            tl.to(proxy, { x: span, duration: span }, 0)
              .to(".pj-tm-prog i", { scaleX: 1, duration: span }, 0);
            tmST.current = tl.scrollTrigger;
            cleanups.push(() => { stageEl.classList.remove("is-scrub"); tmST.current = null; });
          } else {
            // small screens: no pinning, the arrows / dots / swipe turn the same circular orbit
            placeRing($(".pj-tc"), ringT.current.v);
          }

          /* ================================================= CTA ================================================= */
          gsap.fromTo(".pj-cta-bg img", { yPercent: -14, scale: 1.2 }, { yPercent: 14, scale: 1.35, ease: "none", scrollTrigger: par(".pj-cta", 0.5) });
          gsap.from(".pj-cta .pj-cta-h .pj-c", { yPercent: 115, rotationX: -80, opacity: 0, stagger: 0.03, duration: 0.9, transformOrigin: "50% 100%", ease: "power3.out", scrollTrigger: io(".pj-cta", "top 60%", "bottom 10%") });
          gsap.from(".pj-cta .pj-cta-p, .pj-cta .pj-cta-s, .pj-cta .pj-btn", { y: 50, opacity: 0, rotationX: -30, transformPerspective: 800, stagger: 0.14, duration: 0.9, ease: "back.out(1.5)", clearProps: "opacity,transform", scrollTrigger: io(".pj-cta", "top 48%", "bottom 10%") });
          gsap.fromTo(".pj-cta .pj-cta-in", { scale: 0.78, rotationX: 22, transformPerspective: 1200 }, { scale: 1, rotationX: 0, ease: "none", scrollTrigger: par(".pj-cta", true, "top bottom", "center center") });
          $(".pj-cta .pj-cta-rings i").forEach((el, i) => gsap.to(el, { rotation: (i % 2 ? -1 : 1) * (140 + i * 70), scale: 1 + i * 0.12, ease: "none", scrollTrigger: par(".pj-cta") }));

          /* ================================================= depth marks everywhere ================================================= */
          $(".pj-sec").forEach((sec) => {
            const bits = sec.querySelectorAll(".sh-bit");
            if (!bits.length) return;
            gsap.to(bits, { y: (i, el) => -(Number(el.dataset.sp) || 0.5) * 340 * k, ease: "none", scrollTrigger: par(sec, true) });
          });

          return () => cleanups.forEach((fn) => fn());
        }
      );
    }

    // back from a project page: return to where the list was (the global scroll-to-top runs a few frames after mount, so apply again)
    let savedY = 0;
    try { savedY = Number(sessionStorage.getItem("pj-scroll")) || 0; sessionStorage.removeItem("pj-scroll"); } catch { /* storage unavailable */ }
    const restoreTimers = [];
    const stopRestore = () => restoreTimers.forEach(clearTimeout);
    if (navType === "POP" && savedY > 0) {
      let userMoved = false;
      const mark = () => { userMoved = true; };
      ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) => window.addEventListener(ev, mark, { passive: true, once: true }));
      const apply = () => {
        if (userMoved) return;
        if (lenis) lenis.scrollTo(savedY, { immediate: true, force: true });
        else window.scrollTo(0, savedY);
        ScrollTrigger.update();
      };
      apply();
      [60, 250, 700, 1300].forEach((ms) => restoreTimers.push(setTimeout(apply, ms)));
    }

    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(t);
      stopRestore();
      window.removeEventListener("load", onLoad);
      mm.revert();
      document.body.classList.remove("pj-3d", "pj-reduce");
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  /* ---- testimonial coverflow position */
  const nT = TM.length;
  const half = Math.floor(nT / 2);
  const offOf = (i) => ((i - ti + nT + half) % nT) - half;
  // pinned: move the page to that card's stretch of scroll; otherwise just switch the card
  const goTo = (i) => {
    const idx = ((i % nT) + nT) % nT;
    const st = tmST.current;
    if (st) {
      const y = st.start + (idx / Math.max(1, nT - 1)) * (st.end - st.start);
      if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.4 });
      else window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }
    // not pinned: turn the ring along the shortest way round
    const cardsNow = gsap.utils.toArray(".pj-tc", root.current);
    const r = ringT.current;
    let diff = (((idx - r.to) % nT) + nT) % nT;
    if (diff > nT / 2) diff -= nT;
    r.to += diff;
    setTi(idx);
    gsap.to(r, { v: r.to, duration: 1.1, ease: "power3.inOut", overwrite: true, onUpdate: () => placeRing(cardsNow, r.v) });
  };
  const goT = (dir) => goTo((tmST.current ? tmCur.current : ti) + dir);
  const drag = useRef(null);
  const dragMoved = useRef(false); // a swipe on the carousel must not count as a click on the card

  return (
    <div className="pj-root" ref={root}>
      <Cursor />
      <i className="pj-progress" aria-hidden="true" />

      {/* ============ Hero ============ */}
      <header className="pj-sec pj-hero">
        <HeroBackdrop />
        <i className="pj-hero-shade" aria-hidden="true" />
        <SteelBits n={14} />
        <div className="pj-hero-copy">
          <span className="pj-tag">{HERO.tag}</span>
          <h1 className="pj-h1" aria-label={HERO.lines.map((l) => l.text).join(" ")}>
            {HERO.lines.map((l) => <span className="pj-ln" key={l.text}><Words text={l.text} hl={l.hl} /></span>)}
          </h1>
          <p className="pj-hero-p">{HERO.text}</p>
          <p className="pj-hero-s">{HERO.sub}</p>
          <div className="pj-hero-cta">
            <button type="button" className="pj-btn" onClick={() => jump("#projects")} data-mag>Explore projects<i><FaArrowRight aria-hidden="true" /></i></button>
            <button type="button" className="pj-btn pj-btn--ghost" onClick={() => jump("#cases")} data-mag>Case studies</button>
          </div>
        </div>

        <div className="pj-hero-art" role="img" aria-label="Animated 3D BIM model of a prefabricated steel building being erected member by member">
          <BimHero reduce={reducedNow()} />
        </div>

        <div className="pj-hero-foot">
          <button type="button" className="pj-stat" onClick={() => jump("#projects")} data-cursor="Go" aria-label="Jump to featured projects">
            <b>{pad2(PROJECTS.length)}</b><strong>{HERO.chips[0].t}</strong><em>{HERO.chips[0].e}</em>
          </button>
          <button type="button" className="pj-stat" onClick={() => jump("#cases")} data-cursor="Go" aria-label="Jump to case studies">
            <b><span className="pj-cnt-h" data-to="11456">11,456</span>+</b><strong>{HERO.chips[1].t}</strong><em>{HERO.chips[1].e}</em>
          </button>
        </div>
      </header>

      {/* ============ 01 Featured projects ============ */}
      <section className="pj-sec pj-ch pj-pj" id="projects" aria-label="Featured projects">
        <SteelBits n={10} />
        <div className="pj-ghost" aria-hidden="true">01</div>
        <div className="pj-ch-copy pj-pj-head">
          <span className="pj-tag">{PROJECTS_HEAD.tag}</span>
          <Split text={PROJECTS_HEAD.title} hl={PROJECTS_HEAD.hl} className="pj-h2" tag="h2" />
          <p className="pj-lead">{PROJECTS_HEAD.text}</p>
        </div>
        <div className="pj-cards">
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} i={i} onOpen={openProject} />)}
        </div>
      </section>

      {/* ============ 02 Case studies ============ */}
      <section className="pj-sec pj-ch pj-lt pj-cs" id="cases" aria-label="Case studies">
        <SteelBits n={10} />
        <div className="pj-ghost" aria-hidden="true">02</div>
        <div className="pj-ch-copy pj-cs-head">
          <span className="pj-tag">{CASES_HEAD.tag}</span>
          <Split text={CASES_HEAD.title} hl={CASES_HEAD.hl} className="pj-h2" tag="h2" />
          <p className="pj-lead">{CASES_HEAD.text}</p>
        </div>
        <div className="pj-cs-stage">
          <div className="pj-cs-ghost" aria-hidden="true">CASE</div>
          <div className="pj-cs-tilt">
            {CASES.map((c) => {
              const pi = PROJECTS.findIndex((p) => p.client === c.client);
              return (
              <article className={`pj-slide${pi >= 0 ? " is-link" : ""}`} key={c.n} aria-label={`Case study ${c.n}: ${c.client}`} onClick={pi >= 0 ? () => openProject(pi) : undefined} data-cursor={pi >= 0 ? "Open" : undefined}>
                <div className="pj-slide-l">
                  <span className="pj-cs-tag">Case study {c.n}</span>
                  <span className="pj-client">{c.client}</span>
                  <h3 className="pj-h3">
                    {pi >= 0 ? <a className="pj-slide-link" href={projectPath(pi)} onClick={(e) => { e.preventDefault(); e.stopPropagation(); openProject(pi); }}>{c.title}</a> : c.title}
                  </h3>
                  <span className="pj-place"><FaMapMarkerAlt aria-hidden="true" />{c.place}</span>
                  <div className="pj-metric">
                    <strong>{c.metric.big}<small>{c.metric.unit}</small></strong>
                    <span>{c.metric.cap}</span>
                  </div>
                  <div className="pj-tline" aria-label="Timeline">
                    <span>{c.timeline[0]}</span>
                    <i aria-hidden="true" />
                    <span>{c.timeline[1]}</span>
                  </div>
                </div>
                <div className="pj-slide-r">
                  {c.stages.map((s, i) => (
                    <div className="pj-st" key={s.k}>
                      <em>{pad2(i + 1)}</em>
                      <h4>{s.k}</h4>
                      <p>{s.d}</p>
                    </div>
                  ))}
                </div>
              </article>
              );
            })}
          </div>
          <div className="pj-cs-foot" aria-hidden="true">
            <span className="pj-cs-count"><b>01</b> / {pad2(CASES.length)}</span>
            <span className="pj-cs-bar"><i /></span>
            <span className="pj-cs-dots">{CASES.map((c) => <i key={c.n} />)}</span>
          </div>
          <button type="button" className="pj-cs-skip" onClick={() => jump("#approach")} aria-label="Skip the case studies and jump to the next section" data-cursor="Skip" data-cursor-size="sm">
            <span>Jump to next</span><FaArrowDown aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* ============ 03 Approach ============ */}
      <section className="pj-sec pj-ch pj-ap" id="approach" aria-label="Our project approach">
        <SteelBits n={10} />
        <div className="pj-ghost" aria-hidden="true">03</div>
        <div className="pj-ap-pin">
          <div className="pj-ch-copy pj-ap-head">
            <span className="pj-tag">{APPROACH.tag}</span>
            <Split text={APPROACH.title} hl={APPROACH.hl} className="pj-h2" tag="h2" />
            <p className="pj-lead">{APPROACH.text}</p>
          </div>
          <div className="pj-ring-wrap">
            <i className="pj-ring-floor" aria-hidden="true" />
            <div className="pj-ring-tilt">
              <ol className="pj-ring">
                {APPROACH.steps.map((s, i) => (
                  <li className="pj-rp" style={{ "--i": i }} key={s.n}>
                    <div className="pj-rp-in" onPointerMove={tiltMove} onPointerLeave={tiltLeave}>
                      <em>{s.n}</em>
                      <h3>{s.t}</h3>
                      <p>{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="pj-ap-dots" aria-hidden="true">{APPROACH.steps.map((s) => <i key={s.n} />)}</div>
        </div>
      </section>


      {/* ============ 05 Testimonials ============ */}
      <section className="pj-sec pj-ch pj-lt pj-tm" id="testimonials" aria-label="Testimonials">
        <SteelBits n={10} />
        <div className="pj-ghost" aria-hidden="true">04</div>
        <div className="pj-tm-mark" aria-hidden="true">“</div>
        <div className="pj-ch-copy pj-tm-head">
          <span className="pj-tag">{TESTIMONIALS_HEAD.tag}</span>
          <Split text={TESTIMONIALS_HEAD.title} hl={TESTIMONIALS_HEAD.hl} className="pj-h2" tag="h2" />
          <p className="pj-lead">{TESTIMONIALS_HEAD.text}</p>
        </div>
        <div className="pj-tm-pin">
        <div className="pj-tm-tilt">
        <div
          className="pj-tm-stage"
          onPointerDown={(e) => { drag.current = e.clientX; dragMoved.current = false; }}
          onPointerUp={(e) => {
            if (drag.current === null) return;
            const dx = e.clientX - drag.current;
            drag.current = null;
            dragMoved.current = Math.abs(dx) > 8;
            if (Math.abs(dx) > 50) goT(dx < 0 ? 1 : -1);
          }}
        >
          {TM.map((t, i) => {
            const o = offOf(i);
            const pi = PROJECTS.findIndex((p) => p.client === t.client);
            return (
              <figure
                className={`pj-tc${o === 0 ? " front" : ""}`}
                key={t.client}
                aria-hidden={o !== 0}
              >
                <div
                  className={`pj-tc-in${pi >= 0 ? " is-link" : ""}`}
                  onClick={pi >= 0 ? (e) => { if (dragMoved.current || e.target.closest("a, button")) return; openProject(pi); } : undefined}
                  data-cursor={pi >= 0 ? "Open" : undefined}
                >
                  <div className="pj-tc-photo">
                    <img src={(t.photo || cover(t.client)).src} alt={(t.photo || cover(t.client)).alt || t.project} loading="lazy" decoding="async" draggable="false" />
                    <span className="pj-tc-l">{t.tag || "Documented client confirmation"}</span>
                  </div>
                  <div className="pj-tc-body">
                    <div className="pj-tc-top">
                      <ClientLogo src={t.logo} name={t.client} bg={t.logoBg} />
                      <div className="pj-tc-who">
                        <strong>{t.by || t.client}</strong>
                        <span className="pj-tc-pr">{t.project}</span>
                        <span className="pj-tc-pl"><FaMapMarkerAlt aria-hidden="true" />{t.place}</span>
                      </div>
                    </div>
                    <blockquote>{t.words || t.confirm}</blockquote>
                  <div className="pj-tc-act">
                    {pi >= 0 && (
                      <button type="button" className="pj-tc-btn" tabIndex={o === 0 ? 0 : -1} onClick={(e) => { e.stopPropagation(); openProject(pi); }}>
                        <span>View project details</span><FaArrowRight aria-hidden="true" />
                      </button>
                    )}
                    {t.letter ? (
                      <a className="pj-tc-doc" href={t.letter} target="_blank" rel="noopener noreferrer" tabIndex={o === 0 ? 0 : -1} aria-label={`Open ${t.doc} from ${t.client} (${t.date}) in a new tab`}>
                        <FaFileSignature aria-hidden="true" />
                        <span className="pj-tc-doc-t"><small>{t.date}</small>{t.doc}</span>
                        <FaExternalLinkAlt className="pj-tc-go" aria-hidden="true" />
                      </a>
                    ) : (
                      <div className="pj-tc-doc is-static">
                        <FaFileSignature aria-hidden="true" />
                        <span className="pj-tc-doc-t"><small>{t.date}</small>{t.doc}</span>
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              </figure>
            );
          })}
        </div>
        </div>
        <div className="pj-tm-ctrl">
          <button type="button" onClick={() => goT(-1)} aria-label="Previous testimonial"><FaChevronLeft aria-hidden="true" /></button>
          <span className="pj-tm-dots">
            {TM.map((t, i) => <button type="button" key={t.client} className={i === ti ? "on" : ""} onClick={() => goTo(i)} aria-label={`Show testimonial ${i + 1}`} aria-current={i === ti} />)}
          </span>
          <button type="button" onClick={() => goT(1)} aria-label="Next testimonial"><FaChevronRight aria-hidden="true" /></button>
        </div>
        <span className="pj-tm-prog" aria-hidden="true"><i /></span>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="pj-sec pj-cta" aria-label="Start a project">
        <div className="pj-cta-bg" aria-hidden="true"><img src="/images/ab/bg-dusk.webp" alt="" loading="lazy" decoding="async" width="1400" height="933" /></div>
        <i className="pj-scrim" aria-hidden="true" />
        <SteelBits n={10} />
        <div className="pj-cta-rings" aria-hidden="true"><i /><i /><i /></div>
        <div className="pj-cta-in">
          <span className="pj-tag">{CTA.tag}</span>
          <Split text={CTA.title} hl={CTA.hl} className="pj-h2 pj-cta-h" tag="h2" />
          <p className="pj-cta-p">{CTA.text}</p>
          <p className="pj-cta-s">{CTA.sub}</p>
          <a className="pj-btn" href={contactLink} onClick={talk} data-mag>{CTA.btn}<i><FaArrowRight aria-hidden="true" /></i></a>
        </div>
      </section>
    </div>
  );
}
