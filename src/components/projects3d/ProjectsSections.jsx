import { createElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { lenisOptions, lenisTick } from "../../utils/lenisTick";
import { FaArrowRight, FaCheck, FaChevronLeft, FaChevronRight, FaFileSignature, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
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

const reducedNow = () => RESPECT_REDUCED_MOTION && typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// "16.2 m" -> ["16.2", "m"]; "Banswara" -> ["Banswara", ""]
const splitNum = (v) => {
  const m = /^(\d[\d.,]*)\s*(.*)$/.exec(String(v));
  return m ? [m[1], m[2]] : [String(v), ""];
};
const countAttrs = (raw) => ({ "data-to": parseFloat(raw.replace(/,/g, "")), "data-dec": (raw.split(".")[1] || "").length });
const fmtNum = (n, dec) => n.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// the card's on-screen box, used to grow the project sheet out of it and shrink it back
const cardRect = (id) => {
  const el = document.getElementById(`pj-card-${id}`)?.querySelector(".pj-card-in");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const W = document.documentElement.clientWidth;
  const H = document.documentElement.clientHeight;
  if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) return null;
  return { top: r.top, left: r.left, right: r.right, bottom: r.bottom };
};
const insetOf = (r, rad = 26) => {
  const W = document.documentElement.clientWidth;
  const H = document.documentElement.clientHeight;
  return `inset(${Math.max(0, r.top)}px ${Math.max(0, W - r.right)}px ${Math.max(0, H - r.bottom)}px ${Math.max(0, r.left)}px round ${rad}px)`;
};
const OPEN_INSET = "inset(0px 0px 0px 0px round 0px)";

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
const shortName = (n) => n.replace(/\s*\(.*\)/, "").split(" ")[0];
const numOf = (v) => parseFloat(String(v).replace(/,/g, "")) || 0;

// portal-frame elevation as one path (x0,y0 = left foot on the ground)
const frameD = (x0, y0, W, H, R) => `M${x0} ${y0} V${y0 - H} L${x0 + W / 2} ${y0 - H - R} L${x0 + W} ${y0 - H} V${y0}`;

function CardSketch({ p }) {
  const eave = numOf(p.specs.find((s) => /clear height/i.test(s[0]))?.[1]) || 5;
  const T = (x, y, t, anchor = "middle") => <text className="tx" x={x} y={y} textAnchor={anchor}>{t}</text>;
  const L = (d, cls = "") => <path className={`ln ${cls}`} d={d} pathLength="1" />;
  let body;
  if (p.specMode === "plan" && p.plan) {
    const s = 168 / Math.max(p.plan.w, p.plan.l);
    const w = p.plan.w * s, h = p.plan.l * s, x = 44, y = 56;
    const es = 8.2, ew = p.plan.w * es, eh = eave * es, er = eh * 0.18, ex = 296, ey = y + h;
    body = (
      <>
        <rect className="fillh" x={x} y={y} width={w} height={h} />
        {L(`M${x} ${y} H${x + w} V${y + h} H${x} Z`)}
        {L(`M${x} ${y - 14} H${x + w} M${x} ${y - 19} V${y - 9} M${x + w} ${y - 19} V${y - 9}`, "dim")}
        {T(x + w / 2, y - 24, `${p.plan.w} m`)}
        {L(`M${x + w + 14} ${y} V${y + h} M${x + w + 9} ${y} H${x + w + 19} M${x + w + 9} ${y + h} H${x + w + 19}`, "dim")}
        {T(x + w + 24, y + h / 2 + 4, `${p.plan.l} m`, "start")}
        {[1, 2, 3].map((i) => <g key={i}>{L(`M${x + (w * i) / 4} ${y} V${y + h}`, "thin")}</g>)}
        {L(frameD(ex, ey, ew, eh, er))}
        {L(`M${ex - 12} ${ey} H${ex + ew + 12}`, "dim")}
        {[0.25, 0.5, 0.75].map((t) => <circle key={t} className="nd" cx={ex + (ew / 2) * t} cy={ey - eh - er * t} r="2.6" />)}
        {L(`M${ex - 18} ${ey} V${ey - eh} M${ex - 23} ${ey} H${ex - 13} M${ex - 23} ${ey - eh} H${ex - 13}`, "dim")}
        {T(ex - 26, ey - eh / 2 + 4, `${eave} m`, "end")}
        {T(x + w / 2, ey + 32, "PLAN, TO SCALE")}
        {T(ex + ew / 2, ey + 32, "ELEVATION")}
      </>
    );
  } else if (p.buildings?.length) {
    const tot = p.buildings.reduce((a, b) => a + numOf(b.area), 0) || 1;
    const gap = 14, avail = 400 - gap * (p.buildings.length - 1);
    let cx = 40;
    body = (
      <>
        {L("M40 70 H440 M40 64 V76 M440 64 V76", "dim")}
        {T(240, 58, p.area || `${tot.toLocaleString("en-IN")} Sq. Mtr.`)}
        {p.buildings.map((b, i) => {
          const w = (avail * numOf(b.area)) / tot, x = cx;
          cx += w + gap;
          return (
            <g key={b.name}>
              <rect className="fillh" x={x} y={96} width={w} height={104} />
              {L(`M${x} 96 H${x + w} V200 H${x} Z`)}
              {L(`M${x} 96 L${x + w / 2} 84 L${x + w} 96`, "thin")}
              {T(x + w / 2, 222 + (i % 2) * 24, shortName(b.name))}
              {T(x + w / 2, 235 + (i % 2) * 24, numOf(b.area).toLocaleString("en-IN"))}
            </g>
          );
        })}
        {T(240, 282, "AREAS DRAWN IN PROPORTION")}
      </>
    );
  } else {
    const x0 = 60, y0 = 218, W = 280, H = 96, R = 26, dx = 34, dy = -24;
    body = (
      <>
        {L(frameD(x0 + dx, y0 + dy, W, H, R), "thin")}
        {L(`M${x0} ${y0 - H} L${x0 + dx} ${y0 + dy - H} M${x0 + W / 2} ${y0 - H - R} L${x0 + W / 2 + dx} ${y0 + dy - H - R} M${x0 + W} ${y0 - H} L${x0 + W + dx} ${y0 + dy - H}`, "thin")}
        {L(frameD(x0, y0, W, H, R))}
        {L(`M${x0 - 14} ${y0} H${x0 + W + dx + 14}`, "dim")}
        {[0.2, 0.4, 0.6, 0.8].map((t) => <circle key={t} className="nd" cx={x0 + (W / 2) * t} cy={y0 - H - R * t} r="2.6" />)}
        {[0.2, 0.4, 0.6, 0.8].map((t) => <circle key={`r${t}`} className="nd" cx={x0 + W - (W / 2) * t} cy={y0 - H - R * t} r="2.6" />)}
        {T(x0 + W / 2, y0 + 34, `${p.kpi.big} · ${p.kpi.label}`.toUpperCase())}
      </>
    );
  }
  return <svg className="pj-sk" viewBox="0 0 480 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">{body}</svg>;
}

function ProjectCard({ p, i, onOpen }) {
  const po = p.meta.find(([l]) => /purchase/i.test(l))?.[1];
  return (
    <article className="pj-card" id={`pj-card-${p.id}`}>
      <div className="pj-card-drift">
        <div className="pj-card-tilt">
          <div className="pj-card-in" onClick={(e) => onOpen(i, e.currentTarget.querySelector(".pj-card-open"))} data-cursor="Open">
            <div className="pj-card-viz" aria-hidden="true">
              <i className="pj-card-grid" />
              <CardSketch p={p} />
              <span className="pj-card-badge">{p.badge}</span>
            </div>
            <div className="pj-card-body">
              <span className="pj-client">{p.client}</span>
              <h3 className="pj-card-t">
                <button type="button" className="pj-card-open" aria-haspopup="dialog" onClick={(e) => { e.stopPropagation(); onOpen(i, e.currentTarget); }}>{p.title}</button>
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

/* Wonder Cement: the footprint drawn to scale from the two real dimensions (18 m x 16.2 m) */
function PlanSketch({ plan, area }) {
  const SX = 250 / plan.w;
  const w = plan.w * SX;
  const h = plan.l * SX;
  const x0 = 76;
  const y0 = 54;
  return (
    <svg className="pj-plan" viewBox="0 0 380 340" role="img" aria-label={`Plan view to scale: ${plan.w} m wide by ${plan.l} m long, ${area}`}>
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
      <text className="pj-plan-n" x={x0 + w / 2} y={y0 + h + 28} textAnchor="middle">Plan view, drawn to scale</text>
    </svg>
  );
}

/* =====================================================================
   Project sheet: opens out of the card, then every detail scrolls in parallax.
   ===================================================================== */
function Sheet({ index, fromRect, onClose, onSwitch, onTalk, lenisRef }) {
  const p = PROJECTS[index];
  const nextI = (index + 1) % PROJECTS.length;
  const next = PROJECTS[nextI];
  const rec = TESTIMONIALS.find((t) => t.client === p.client);
  const sheet = useRef(null);
  const scr = useRef(null);
  const closeBtn = useRef(null);
  const lbEl = useRef(null);
  const closing = useRef(false);
  const latest = useRef({});
  const swipe = useRef(null);
  const [lb, setLb] = useState(null);

  const facts = [...p.meta, ["Location", p.location], ...(rec ? [["Completion record", `${rec.doc}, ${rec.date}`]] : [])];
  const totalSpec = p.specs.find(([l]) => /total/i.test(l));
  const totalNum = totalSpec ? parseFloat(totalSpec[1].replace(/,/g, "")) : 0;

  const requestClose = () => {
    if (closing.current) return;
    closing.current = true;
    const el = sheet.current;
    if (!el || reducedNow()) { onClose(); return; }
    const r = cardRect(p.id);
    gsap.to(scr.current, { opacity: 0, duration: 0.3, ease: "power1.out" });
    if (r) gsap.fromTo(el, { clipPath: OPEN_INSET }, { clipPath: insetOf(r), duration: 0.85, ease: "power4.inOut", onComplete: onClose });
    else gsap.to(el, { opacity: 0, duration: 0.4, onComplete: onClose });
  };
  const stepLb = (d) => setLb((v) => (v === null ? v : (v + d + p.gallery.length) % p.gallery.length));
  latest.current = { lb, requestClose, stepLb };

  /* ---- scroll lock, focus, keys (Escape, arrows, focus trap) */
  useEffect(() => {
    const body = document.body;
    const prev = { o: body.style.overflow, p: body.style.paddingRight };
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;
    lenisRef.current?.stop();
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      const { lb: open, requestClose: close, stepLb: step } = latest.current;
      if (e.key === "Escape") { e.preventDefault(); if (open !== null) setLb(null); else close(); return; }
      if (open !== null && e.key === "ArrowRight") step(1);
      if (open !== null && e.key === "ArrowLeft") step(-1);
      if (e.key !== "Tab") return;
      const scope = open !== null ? lbEl.current : sheet.current;
      if (!scope) return;
      const f = [...scope.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])")].filter((n) => !n.disabled && n.getClientRects().length);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !scope.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !scope.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prev.o;
      body.style.paddingRight = prev.p;
      lenisRef.current?.start();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- entrance + every parallax layer inside the sheet (the sheet's own scroller drives them) */
  useLayoutEffect(() => {
    const el = sheet.current;
    const sc = scr.current;
    if (!el || !sc || reducedNow()) return undefined;
    const k = window.innerWidth > 1000 ? 1 : window.innerWidth > 600 ? 0.8 : 0.6;
    const q = (s) => gsap.utils.toArray(s, el);
    const Q = (s) => el.querySelector(s);
    const S = (trigger, extra = {}) => ({ trigger, scroller: sc, ...extra });
    const par = (trigger, scrub = 0.6, start = "top bottom", end = "bottom top") => S(trigger, { start, end, scrub });
    const on = (trigger, start = "top 88%") => S(trigger, { start, toggleActions: "play none none reverse" });
    const count = (c, trg, start) => {
      const to = Number(c.dataset.to);
      const dec = Number(c.dataset.dec || 0);
      const o = { v: 0 };
      c.textContent = fmtNum(0, dec);
      gsap.to(o, { v: to, duration: 1.8, ease: "power2.out", onUpdate: () => { c.textContent = fmtNum(o.v, dec); }, scrollTrigger: on(trg, start) });
    };

    const ctx = gsap.context(() => {
      /* entrance: the card grows into the full sheet */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (fromRect) {
        tl.fromTo(el, { clipPath: insetOf(fromRect) }, { clipPath: OPEN_INSET, duration: 1.05, ease: "power4.inOut", clearProps: "clipPath" }, 0)
          .from(Q(".pj-sh-cv-img"), { scale: 1.3, duration: 1.6, ease: "power2.out" }, 0);
      } else {
        tl.from(el, { opacity: 0, duration: 0.5 }, 0).from(Q(".pj-sh-cv-img"), { scale: 1.15, duration: 1.2, ease: "power2.out" }, 0);
      }
      tl.from(q(".pj-sh-bar > :not(.pj-sh-prog)"), { y: -28, opacity: 0, stagger: 0.08, duration: 0.6 }, 0.7)
        .from(q(".pj-sh-cv .pj-c"), { yPercent: 115, rotationX: -80, opacity: 0, stagger: 0.02, duration: 0.9, transformOrigin: "50% 100%" }, 0.6)
        .from(q(".pj-sh-cv-fade"), { y: 34, opacity: 0, stagger: 0.09, duration: 0.8 }, 0.95)
        .from(Q(".pj-sh-gn"), { opacity: 0, x: 80, duration: 1.2 }, 0.5)
        .add(() => gsap.set(q(".pj-sh-cv .pj-m"), { overflow: "visible" }));

      /* progress through the sheet */
      gsap.to(Q(".pj-sh-prog"), { scaleX: 1, ease: "none", scrollTrigger: { scroller: sc, start: 0, end: "max", scrub: 0.2 } });

      /* cover: photo drifts slower than the page, copy and numeral drift faster */
      const cv = Q(".pj-sh-cv");
      gsap.to(Q(".pj-sh-cv-img img"), { yPercent: 7, ease: "none", scrollTrigger: par(cv, 0.6, "top top") });
      gsap.to(Q(".pj-sh-cv-copy"), { y: -120 * k, opacity: 0.05, ease: "none", scrollTrigger: par(cv, 0.6, "top top", "bottom 25%") });
      gsap.to(Q(".pj-sh-gn"), { y: -280 * k, ease: "none", scrollTrigger: par(cv, 0.6, "top top") });
      gsap.to(Q(".pj-sh-hint"), { opacity: 0, ease: "none", scrollTrigger: par(cv, 0.3, "top top", "20% top") });

      /* overview */
      const ov = Q(".pj-sh-ov");
      gsap.from(q(".pj-sh-ov .pj-sh-k, .pj-sh-ov-t"), { y: 60 * k, opacity: 0, stagger: 0.12, duration: 1, scrollTrigger: on(ov, "top 78%") });
      q(".pj-sh-fact").forEach((f, i) => {
        gsap.from(f, { x: 60 * k, opacity: 0, duration: 0.85, delay: i * 0.08, scrollTrigger: on(ov, "top 70%") });
        gsap.fromTo(f, { y: (i % 2 ? 1 : -1) * 26 * k }, { y: (i % 2 ? -1 : 1) * 26 * k, ease: "none", scrollTrigger: par(ov, 0.8) });
      });

      /* specifications */
      const sp = Q(".pj-sh-spec");
      gsap.from(Q(".pj-sh-spec .pj-sh-k"), { y: 40, opacity: 0, duration: 0.8, scrollTrigger: on(sp, "top 80%") });
      q(".pj-fig").forEach((f, i) => {
        gsap.from(f, { y: 90 * k, opacity: 0, rotationX: -22, transformPerspective: 900, duration: 1, ease: "power3.out", scrollTrigger: on(f, "top 92%") });
        gsap.fromTo(f.querySelector(".pj-fig-n"), { y: (i % 2 ? -1 : 1) * 42 * k }, { y: (i % 2 ? 1 : -1) * 42 * k, ease: "none", scrollTrigger: par(f, 0.7) });
        const c = f.querySelector(".pj-cnt");
        if (c) count(c, f, "top 90%");
      });
      const plan = Q(".pj-plan");
      if (plan) {
        gsap.fromTo(plan.querySelectorAll(".dr"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, stagger: 0.25, ease: "power2.inOut", scrollTrigger: on(plan, "top 85%") });
        gsap.from(plan.querySelectorAll(".pj-plan-fill, text"), { opacity: 0, duration: 1, delay: 0.6, stagger: 0.12, scrollTrigger: on(plan, "top 85%") });
        gsap.fromTo(plan, { y: 60 * k, rotation: -2 }, { y: -60 * k, rotation: 2, ease: "none", scrollTrigger: par(plan, 0.8) });
      }
      q(".pj-bar").forEach((b, i) => {
        gsap.from(b, { y: 50 * k, opacity: 0, duration: 0.8, delay: i * 0.05, scrollTrigger: on(b, "top 94%") });
        gsap.fromTo(b.querySelector(".pj-bar-f"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 1.5, ease: "power3.out", scrollTrigger: on(b, "top 94%") });
      });
      q(".pj-row").forEach((r, i) => {
        gsap.from(r, { x: (i % 2 ? 1 : -1) * 80 * k, opacity: 0, duration: 0.85, scrollTrigger: on(r, "top 94%") });
      });

      /* scope */
      const scp = Q(".pj-sh-scope");
      gsap.from(q(".pj-sc-head > *"), { y: 50 * k, opacity: 0, stagger: 0.1, duration: 0.9, scrollTrigger: on(scp, "top 76%") });
      gsap.fromTo(Q(".pj-sh-big"), { y: 70 * k }, { y: -70 * k, ease: "none", scrollTrigger: par(scp, 0.8) });
      q(".pj-sc").forEach((li) => {
        gsap.from(li, { x: 80 * k, opacity: 0, duration: 0.85, scrollTrigger: on(li, "top 94%") });
        gsap.fromTo(li.querySelector(".ln"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 1.2, ease: "power3.out", scrollTrigger: on(li, "top 94%") });
      });

      /* outcome */
      const out = Q(".pj-sh-out");
      gsap.fromTo(Q(".pj-sh-out-img img"), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: par(out, 0.6) });
      gsap.from(q(".pj-sh-out .pj-sh-k, .pj-sh-out-t, .pj-sh-doc"), { y: 70 * k, opacity: 0, stagger: 0.15, duration: 1, scrollTrigger: on(out, "top 70%") });

      /* gallery: the frames drift at different speeds, the photos inside them drift again */
      const drift = [56, -34, 44, -56];
      q(".pj-gf").forEach((f, i) => {
        gsap.fromTo(f, { y: drift[i % 4] * k }, { y: -drift[i % 4] * k, ease: "none", scrollTrigger: par(f, 0.7) });
        const inn = f.querySelector(".pj-gf-in");
        gsap.fromTo(inn, { opacity: 0, y: 70 * k, rotationX: -16, scale: 0.92, transformPerspective: 1100 }, { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: on(f, "top 94%") });
        gsap.fromTo(f.querySelector("img"), { yPercent: -9 }, { yPercent: 9, ease: "none", scrollTrigger: par(f, 0.5) });
      });
      gsap.from(q(".pj-sh-gal .pj-sh-k, .pj-sh-gal-h p"), { y: 40, opacity: 0, stagger: 0.1, duration: 0.8, scrollTrigger: on(Q(".pj-sh-gal"), "top 80%") });

      /* next project */
      gsap.from(q(".pj-sh-ft .pj-sh-next, .pj-sh-ft-a > *"), { y: 70 * k, opacity: 0, stagger: 0.12, duration: 0.9, scrollTrigger: on(Q(".pj-sh-ft"), "top 85%") });
    }, el);

    const r1 = setTimeout(() => ScrollTrigger.refresh(), 150);
    const r2 = setTimeout(() => ScrollTrigger.refresh(), 900);
    return () => { clearTimeout(r1); clearTimeout(r2); ctx.revert(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const figs = p.specs.map(([label, value]) => ({ label, value, parts: splitNum(value) }));

  return (
    <div className="pj-sheet" ref={sheet} role="dialog" aria-modal="true" aria-labelledby="pj-sh-title" data-lenis-prevent>
      <div className="pj-sh-bar">
        <span className="pj-sh-cnt"><b>{pad2(index + 1)}</b> / {pad2(PROJECTS.length)}</span>
        <span className="pj-sh-who">{p.client}</span>
        <button ref={closeBtn} type="button" className="pj-sh-x" onClick={requestClose} data-mag><span>Close</span><FaTimes aria-hidden="true" /></button>
        <i className="pj-sh-prog" aria-hidden="true" />
      </div>

      <div className="pj-sh-scroll" ref={scr} tabIndex={-1}>
        {/* ---- cover */}
        <header className="pj-sh-cv">
          <div className="pj-sh-cv-img" aria-hidden="true"><img src={p.cover.src} alt="" /></div>
          <i className="pj-sh-cv-shade" aria-hidden="true" />
          <div className="pj-sh-gn" aria-hidden="true">{p.n}</div>
          <div className="pj-sh-cv-copy">
            <div className="pj-sh-cv-main">
              <span className="pj-client pj-sh-cv-fade">{p.client}</span>
              <h2 id="pj-sh-title" className="pj-sh-h" aria-label={p.title}><Words text={p.title} /></h2>
              <div className="pj-sh-cv-meta pj-sh-cv-fade">
                <span className="pj-place"><FaMapMarkerAlt aria-hidden="true" />{p.location}</span>
                <span className="pj-sh-badge">{p.badge}</span>
              </div>
            </div>
            <div className="pj-sh-kpi pj-sh-cv-fade">
              <strong>{p.kpi.big}{p.kpi.unit && <small>{p.kpi.unit}</small>}</strong>
              <span>{p.kpi.label}</span>
            </div>
          </div>
          <div className="pj-sh-hint" aria-hidden="true"><i />Scroll</div>
        </header>

        {/* ---- overview */}
        <section className="pj-sh-sec pj-sh-ov" aria-label="Project overview">
          <div className="pj-sh-in pj-sh-ov-g">
            <div>
              <h3 className="pj-sh-k">Project overview</h3>
              <p className="pj-sh-ov-t">{p.overview}</p>
            </div>
            <dl className="pj-sh-facts">
              {facts.map(([a, b]) => <div className="pj-sh-fact" key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
            </dl>
          </div>
        </section>

        {/* ---- specifications */}
        <section className="pj-sh-sec pj-sh-spec" aria-label="Specifications">
          <div className="pj-sh-in">
            <h3 className="pj-sh-k">Specifications</h3>

            {p.specMode === "plan" && (
              <div className="pj-sp-plan">
                <PlanSketch plan={p.plan} area={p.area} />
                <div className="pj-figs">
                  {figs.map((f) => (
                    <div className="pj-fig" key={f.label}>
                      <b className="pj-fig-n">
                        <span className="pj-cnt" {...countAttrs(f.parts[0])}>{f.parts[0]}</span>{f.parts[1] && <small>{f.parts[1]}</small>}
                      </b>
                      <span className="pj-fig-l">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {p.specMode === "bars" && (
              <div className="pj-sp-bars">
                {totalSpec && (
                  <div className="pj-fig pj-fig--total">
                    <b className="pj-fig-n">
                      <span className="pj-cnt" {...countAttrs(splitNum(totalSpec[1])[0])}>{splitNum(totalSpec[1])[0]}</span><small>{splitNum(totalSpec[1])[1]}</small>
                    </b>
                    <span className="pj-fig-l">{totalSpec[0]}</span>
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
          <div className="pj-sh-in pj-sc-g">
            <div className="pj-sc-head">
              <h3 className="pj-sh-k">Scope of work</h3>
              <strong className="pj-sh-big" aria-hidden="true">{pad2(p.scope.length)}</strong>
              <span>{p.scope.length === 1 ? "item" : "items"} in scope</span>
            </div>
            <ul className="pj-sc-list">
              {p.scope.map((s) => (
                <li className="pj-sc" key={s}><i className="ln" aria-hidden="true" /><FaCheck aria-hidden="true" /><span>{s}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- outcome */}
        <section className="pj-sh-out" aria-label="Project outcome">
          <div className="pj-sh-out-img" aria-hidden="true"><img src={(p.gallery[1] || p.cover).src} alt="" loading="lazy" /></div>
          <i className="pj-sh-out-shade" aria-hidden="true" />
          <div className="pj-sh-in">
            <h3 className="pj-sh-k">Project outcome</h3>
            <p className="pj-sh-out-t">{p.outcome}</p>
            {rec && <div className="pj-sh-doc"><FaFileSignature aria-hidden="true" /><span>{rec.doc}</span><b>{rec.date}</b></div>}
          </div>
        </section>

        {/* ---- gallery */}
        <section className="pj-sh-sec pj-sh-gal" aria-label="Project gallery">
          <div className="pj-sh-in">
            <div className="pj-sh-gal-h">
              <h3 className="pj-sh-k">Project gallery</h3>
              <p>A look at the plant floor where our steel is cut, fitted and checked.</p>
            </div>
            <div className="pj-gg">
              {p.gallery.map((g, i) => (
                <div className={`pj-gf g${i}`} key={g.src}>
                  <button type="button" className="pj-gf-in" onClick={() => setLb(i)} aria-label={`Enlarge photo: ${g.cap}`} data-cursor="View">
                    <img src={g.src} alt={g.alt} loading="lazy" decoding="async" />
                    <span className="pj-gf-cap">{g.cap}</span>
                  </button>
                </div>
              ))}
            </div>
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
            <img key={lb} src={p.gallery[lb].src} alt={p.gallery[lb].alt} />
            <figcaption><strong>{p.gallery[lb].cap}</strong><span>{lb + 1} / {p.gallery.length}</span></figcaption>
          </figure>
          <button type="button" className="pj-lb-n n" onClick={(e) => { e.stopPropagation(); stepLb(1); }} aria-label="Next photo"><FaChevronRight aria-hidden="true" /></button>
        </div>
      )}
    </div>
  );
}

export default function ProjectsSections() {
  const root = useRef(null);
  const lenisRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(null); // { i: project index, rect: card box it grows out of }
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

  const openProject = (i, btn) => {
    const box = btn?.closest(".pj-card-in")?.getBoundingClientRect();
    setOpen({ i, rect: box ? { top: box.top, left: box.left, right: box.right, bottom: box.bottom } : null });
  };
  const closeProject = () => {
    const id = open ? PROJECTS[open.i].id : null;
    setOpen(null);
    if (id) requestAnimationFrame(() => document.querySelector(`#pj-card-${id} .pj-card-open`)?.focus({ preventScroll: true }));
  };

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
          // Cards: a "curtain" reveal. Each card is uncovered from the bottom while it settles upward, then its blueprint
          // draws itself, the badge pops in, the text rises line by line and the headline figure counts up. The columns
          // start one after another. Scrolling only adds a slow drift to the blueprint; with a mouse the card leans
          // toward the pointer, lifts slightly and a soft glare follows the cursor.
          const cards = $(".pj-card");
          cards.forEach((card, i) => {
            const drift = card.querySelector(".pj-card-drift");
            const tilt = card.querySelector(".pj-card-tilt");
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
            const d = (lg ? i % 3 : i % 2) * 0.16;
            const cnt = { v: 0 };

            const tl = gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: io(card, "top 88%") });
            tl.fromTo(inn, { clipPath: "inset(100% 0% 0% 0% round 22px)", y: 90 * k, scale: 0.94 }, { clipPath: "inset(0% 0% 0% 0% round 22px)", y: 0, scale: 1, duration: 1.2, ease: "power4.inOut", clearProps: "clipPath,transform" }, d)
              .fromTo(grid, { scale: 1.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.7, ease: "power2.out", clearProps: "opacity" }, d + 0.1)
              .fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, stagger: 0.07, ease: "power2.inOut" }, d + 0.45)
              .fromTo(marks, { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.035 }, d + 1.0)
              .from(badge, { scale: 0.5, opacity: 0, transformOrigin: "0% 50%", duration: 0.7, ease: "back.out(2.2)" }, d + 0.55)
              .from(parts, { y: 28, opacity: 0, duration: 0.85, stagger: 0.08, clearProps: "opacity,transform" }, d + 0.5);
            if (kpiNum !== null) {
              tl.to(cnt, { v: kpiNum, duration: 1.6, ease: "power2.out", onUpdate: () => { kpiNode.nodeValue = fmtNum(cnt.v, kpiDec); } }, d + 0.7);
            }

            // always moving: the card floats gently on its own, and as it travels up the screen it rolls through 3D
            gsap.fromTo(drift, { y: -9, rotationZ: -0.5 }, { y: 9, rotationZ: 0.5, duration: 2.6 + i * 0.55, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.35 });
            const pass = (lg ? [60, -40, 70][i % 3] : 30) * k;
            gsap.fromTo(card, { rotationX: 13, y: pass, transformPerspective: 1100 }, { rotationX: -11, y: -pass, ease: "none", scrollTrigger: par(card, 0.9) });

            // slow scroll drift of the blueprint inside its frame
            gsap.fromTo(sk, { yPercent: -6, scale: 1.06 }, { yPercent: 6, scale: 1.06, ease: "none", scrollTrigger: par(card, 0.6) });

            // pointer: lean, lift, counter-shift of the blueprint and badge, glare under the cursor
            if (fine) {
              gsap.set(tilt, { transformPerspective: 900 });
              const qt = (el, prop, dur = 0.7) => gsap.quickTo(el, prop, { duration: dur, ease: "power3.out" });
              const rx = qt(tilt, "rotationX");
              const ry = qt(tilt, "rotationY");
              const lift = qt(tilt, "y", 0.5);
              const skx = qt(sk, "x");
              const sky = qt(sk, "y");
              const bx = qt(badge, "x");
              const by = qt(badge, "y");
              const onMove = (e) => {
                if (e.pointerType === "touch") return;
                const r = card.getBoundingClientRect();
                const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
                const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
                ry(nx * 6); rx(-ny * 5); lift(-8);
                skx(-nx * 10); sky(-ny * 8); bx(nx * 8); by(ny * 6);
                inn.style.setProperty("--mx", `${(nx / 2 + 0.5) * 100}%`);
                inn.style.setProperty("--my", `${(ny / 2 + 0.5) * 100}%`);
              };
              const onLeave = () => { ry(0); rx(0); lift(0); skx(0); sky(0); bx(0); by(0); };
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
              gsap.set(slides, { opacity: 0, x: "30%", z: -420 * k, rotationY: 62 });
              gsap.set(slides[0], { opacity: 1, x: "0%", z: 0, rotationY: 0 });
              let cur = -1;
              const setSlide = (i) => {
                if (i === cur || !rootEl.isConnected) return;
                cur = i;
                slides.forEach((s, j) => s.classList.toggle("on", j === i));
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
                tl.to(slides[i - 1], { opacity: 0, x: "-32%", z: -420 * k, rotationY: -62, duration: 0.55, ease: "power2.in" }, i - 0.6)
                  .fromTo(slides[i], { opacity: 0, x: "32%", z: -420 * k, rotationY: 62 }, { opacity: 1, x: "0%", z: 0, rotationY: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, i - 0.45);
              }
              tl.to({}, { duration: 0.0001 }, NS - 1 + 0.4);
              gsap.fromTo(".pj-cs-tilt", { rotationX: 7, rotationZ: -1.5, transformPerspective: 1400 }, { rotationX: -5, rotationZ: 1.5, ease: "none", scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${dur()}`, scrub: true } });
              gsap.fromTo(".pj-cs-ghost", { xPercent: 8 }, { xPercent: -26, ease: "none", scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${dur()}`, scrub: true } });
            } else {
              slides.forEach((s) => s.classList.add("on"));
              flyIn(".pj-slide");
              $(".pj-slide .pj-st").forEach((el, i) => gsap.from(el, { y: 60, opacity: 0, rotationX: -40, transformPerspective: 800, duration: 0.8, delay: (i % 4) * 0.06, scrollTrigger: io(el, "top 95%", "bottom 5%") }));
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
          gsap.fromTo(".pj-tc-q", { y: -34 * k, rotation: -10 }, { y: 34 * k, rotation: 10, ease: "none", scrollTrigger: par(".pj-tm-pin", 0.8) });
          gsap.fromTo(".pj-tc blockquote", { y: 22 * k }, { y: -22 * k, ease: "none", scrollTrigger: par(".pj-tm-pin", 0.8) });
          gsap.fromTo(".pj-tc figcaption", { y: 30 * k }, { y: -12 * k, ease: "none", scrollTrigger: par(".pj-tm-pin", 0.8) });
          gsap.fromTo(".pj-tc-doc", { x: 40 * k, opacity: 0.3 }, { x: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".pj-tm-stage", start: "top 92%", end: "top 38%", scrub: 0.6 } });
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
              cardsEl.forEach((el, j) => { el.classList.toggle("front", j === i); el.setAttribute("aria-hidden", String(j !== i)); });
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

    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(t);
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
  const nT = TESTIMONIALS.length;
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
            <b><span className="pj-cnt-h" data-to="5856">5,856</span>+</b><strong>{HERO.chips[1].t}</strong><em>{HERO.chips[1].e}</em>
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
            {CASES.map((c) => (
              <article className="pj-slide" key={c.n} aria-label={`Case study ${c.n}: ${c.client}`}>
                <div className="pj-slide-l">
                  <span className="pj-cs-tag">Case study {c.n}</span>
                  <span className="pj-client">{c.client}</span>
                  <h3 className="pj-h3">{c.title}</h3>
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
                    <div className="pj-st" key={s.k} onPointerMove={tiltMove} onPointerLeave={tiltLeave}>
                      <em>{pad2(i + 1)}</em>
                      <h4>{s.k}</h4>
                      <p>{s.d}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="pj-cs-foot" aria-hidden="true">
            <span className="pj-cs-count"><b>01</b> / {pad2(CASES.length)}</span>
            <span className="pj-cs-bar"><i /></span>
            <span className="pj-cs-dots">{CASES.map((c) => <i key={c.n} />)}</span>
          </div>
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
          onPointerDown={(e) => { drag.current = e.clientX; }}
          onPointerUp={(e) => {
            if (drag.current === null) return;
            const dx = e.clientX - drag.current;
            drag.current = null;
            if (Math.abs(dx) > 50) goT(dx < 0 ? 1 : -1);
          }}
        >
          {TESTIMONIALS.map((t, i) => {
            const o = offOf(i);
            return (
              <figure
                className={`pj-tc${o === 0 ? " front" : ""}`}
                key={t.client}
                aria-hidden={o !== 0}
              >
                <div className="pj-tc-in">
                  <span className="pj-tc-q" aria-hidden="true">“</span>
                  {t.words ? (
                    <blockquote>{t.words}</blockquote>
                  ) : (
                    <>
                      <span className="pj-tc-l">Documented client confirmation</span>
                      <blockquote>{t.confirm}</blockquote>
                    </>
                  )}
                  <figcaption>
                    <strong>{t.by || t.client}</strong>
                    <span>{t.project}</span>
                    <span>{t.place}</span>
                  </figcaption>
                  <div className="pj-tc-doc"><FaFileSignature aria-hidden="true" /><span>{t.doc}</span><b>{t.date}</b></div>
                </div>
              </figure>
            );
          })}
        </div>
        </div>
        <div className="pj-tm-ctrl">
          <button type="button" onClick={() => goT(-1)} aria-label="Previous testimonial"><FaChevronLeft aria-hidden="true" /></button>
          <span className="pj-tm-dots">
            {TESTIMONIALS.map((t, i) => <button type="button" key={t.client} className={i === ti ? "on" : ""} onClick={() => goTo(i)} aria-label={`Show testimonial ${i + 1}`} aria-current={i === ti} />)}
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


      {/* ============ Project sheet ============ */}
      {open && (
        <Sheet
          key={open.i}
          index={open.i}
          fromRect={open.rect}
          onClose={closeProject}
          onSwitch={(i) => setOpen({ i, rect: null })}
          onTalk={talk}
          lenisRef={lenisRef}
        />
      )}
    </div>
  );
}
