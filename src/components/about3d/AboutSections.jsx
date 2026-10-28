import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { FaArrowRight, FaBolt, FaCheck, FaCubes, FaRecycle, FaRulerCombined, FaSun, FaTint, FaTruck } from "react-icons/fa";
import ROUTE_PATHS from "../../routes/RoutePath";
import SteelBits from "../home3d/SteelBits";
import Cursor from "../home3d/Cursor";
import { RESPECT_REDUCED_MOTION, NAV_SECTIONS, HERO, OVERVIEW, FOUNDERS, VISION, GREEN, PROCESS, PLANT, CTA } from "./aboutData";
import "../home3d/home3d.css";
import "../home3d/home3d-v4.css";
import "../home3d/home3d-v5.css";
import "./about3d.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const pad2 = (v) => String(v).padStart(2, "0");
const ICONS = { recycle: FaRecycle, ruler: FaRulerCombined, drop: FaTint, bolt: FaBolt, cubes: FaCubes, truck: FaTruck, sun: FaSun };
const fmt = (n, f) => (f ? n.toLocaleString("en-IN") : String(n));

// scroll-triggered entrance that plays on the way down and reverses on the way back up
const io = (trigger, start = "top 88%", end = "bottom 10%") => ({ trigger, start, end, toggleActions: "play none none reverse" });

// mouse tilt (fine pointers only; touch devices get the scroll-driven 3D instead)
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

function Words({ text, hl = [] }) {
  const set = new Set(hl);
  return text.split(" ").map((w, i) => (
    <span className="ab-m" key={i} aria-hidden="true">
      <span className={`ab-w${set.has(w) ? " hl" : ""}`}>
        {[...w].map((c, j) => <span className="ab-c" key={j}>{c}</span>)}
      </span>
    </span>
  ));
}
function Split({ text, hl, className, tag: Tag = "span" }) {
  return <Tag className={className} aria-label={text}><Words text={text} hl={hl} /></Tag>;
}

function Photo({ im, className = "", lazy = true }) {
  return (
    <figure className={`ab-fig ${className}`}>
      <div className="ab-fig-in"><img src={im.src} alt={im.alt} loading="eager" decoding="async" width="1400" height="933" /></div>
    </figure>
  );
}

function Count({ s }) {
  return (
    <div className="ab-stat">
      <strong><b className="ab-count" data-n={s.n} data-fmt={s.fmt ? "1" : ""}>{fmt(s.n, s.fmt)}</b>{s.suffix}</strong>
      <span>{s.label}</span>
    </div>
  );
}

export default function AboutSections() {
  const root = useRef(null);
  const lenisRef = useRef(null);

  const jump = (sel) => {
    const el = root.current?.querySelector(sel);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -70, duration: 1.7 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const rootEl = root.current;
    const reduce = RESPECT_REDUCED_MOTION && matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("ab-3d");
    document.body.classList.toggle("ab-reduce", reduce);

    let lenis, tick;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, syncTouch: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(100, 33);
    }

    const mm = gsap.matchMedia(rootEl);
    if (!reduce) {
      mm.add(
        { all: "(min-width: 0px)", lg: "(min-width: 1001px)", md: "(min-width: 601px) and (max-width: 1000px)", fine: "(pointer: fine)", wide: "(min-width: 761px)" },
        (c) => {
          const { lg, md, fine, wide } = c.conditions;
          const k = lg ? 1 : md ? 0.8 : 0.6; // motion strength per device size (nothing is switched off, it is scaled)
          const $ = (s) => gsap.utils.toArray(s, rootEl);
          const vh = () => window.innerHeight;
          const cleanups = [];
          const par = (trigger, scrub = 0.8, start = "top bottom", end = "bottom top") => ({ trigger, start, end, scrub });

          gsap.to(".ab-progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

          /* ================================================= HERO ================================================= */
          const heroST = (end = "bottom top") => par(".ab-hero", 0.8, "top top", end);
          gsap.set(".ab-chip", { z: 230 * k });
          gsap.set(".ab-orbit-ds", { rotationX: -9 });
          gsap.set(".ab-hero .ab-m", { overflow: "hidden" });
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } })
            .from(".ab-hero .ab-tag", { opacity: 0, y: -14, duration: 0.6 }, 0)
            .from(".ab-hero .ab-c", { yPercent: 120, rotationX: -80, opacity: 0, stagger: 0.02, duration: 0.9, transformOrigin: "50% 100%", onComplete: () => gsap.set(".ab-hero .ab-m", { overflow: "visible" }) }, 0.1)
            .from(".ab-hero-p, .ab-hero-cta > *, .ab-index a", { y: 30, opacity: 0, stagger: 0.07, duration: 0.8, clearProps: "opacity,transform" }, 0.9)
            .from(".ab-op-in", { opacity: 0, scale: 0.35, rotationX: 70, stagger: 0.09, duration: 1.1, ease: "back.out(1.5)" }, 0.25)
            .fromTo(".ab-orbit-scroll", { rotationY: -200 }, { rotationY: 0, duration: 2.2, ease: "power3.out", immediateRender: false }, 0.25)
            .from(".ab-chip", { opacity: 0, scale: 0.4, y: 40, stagger: 0.18, duration: 0.9, ease: "back.out(1.7)" }, 1.0)
            .from(".ab-orbit-base", { opacity: 0, scale: 0.3, duration: 1.4 }, 0.3);
          ScrollTrigger.create({ trigger: ".ab-hero", start: "top top", end: "bottom 30%", onEnterBack: () => intro.restart() });
          // the ring turns by itself (so touch screens move too); scrolling spins it faster and splits the photos into a rising spiral
          gsap.to(".ab-orbit-spin", { rotationY: 360, duration: 46, ease: "none", repeat: -1 });
          if (fine) {
            const tx = gsap.quickTo(".ab-orbit-tilt", "rotationY", { duration: 1, ease: "power3.out" });
            const ty = gsap.quickTo(".ab-orbit-tilt", "rotationX", { duration: 1, ease: "power3.out" });
            const move = (e) => { tx((e.clientX / innerWidth - 0.5) * 36); ty(-(e.clientY / innerHeight - 0.5) * 16); };
            window.addEventListener("pointermove", move);
            cleanups.push(() => window.removeEventListener("pointermove", move));
          }
          gsap.to(".ab-hero-copy", { yPercent: -14, opacity: 0.1, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ab-orbit-ds", { rotationX: 14, yPercent: -8, scale: 1.12, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ab-orbit-scroll", { rotationY: -420, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ab-op-in", { y: (i) => (i % 2 ? -300 : -90) * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ab-hero .ab-chip .ab-chip-in", { y: (i) => (i ? -300 : -160) * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ab-orbit-base", { yPercent: 40, opacity: 0.15, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ab-blob.a", { y: 160 * k, x: -60 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ab-blob.b", { y: -140 * k, x: 80 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ab-scroll", { opacity: 0, y: 30, ease: "none", scrollTrigger: heroST("20% top") });

          /* ================================================= shared helpers ================================================= */
          const headReveal = (scope) => {
            gsap.from(`${scope} .ab-ch-copy .ab-tag`, { opacity: 0, x: -30, duration: 0.7, ease: "power3.out", scrollTrigger: io(scope + " .ab-ch-copy", "top 85%") });
            gsap.from(`${scope} .ab-ch-copy .ab-c`, { yPercent: 115, rotationX: -80, opacity: 0, stagger: 0.018, duration: 0.9, transformOrigin: "50% 100%", ease: "power3.out", scrollTrigger: io(scope + " .ab-ch-copy", "top 82%") });
            gsap.from(`${scope} .ab-ch-copy .ab-lead`, { y: 50 * k, opacity: 0, rotationX: -25, transformPerspective: 900, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: io(scope + " .ab-ch-copy", "top 70%") });
          };
          const ghost = (scope, dir = 1) => gsap.fromTo(`${scope} .ab-ghost`, { xPercent: 12 * dir, rotationX: 50, opacity: 0.3 }, { xPercent: -14 * dir, rotationX: -25, opacity: 1, transformPerspective: 900, ease: "none", scrollTrigger: par(scope) });
          // photo collage: clip-reveal, depth drift, inner parallax
          const collage = (scope, speed) => {
            $(`${scope} .ab-fig`).forEach((el, i) => {
              gsap.fromTo(el.querySelector(".ab-fig-in"), { clipPath: "inset(100% 0% 0% 0%)", scale: 0.8 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "power2.out", scrollTrigger: par(el, 0.6, "top 98%", "top 52%") });
              gsap.fromTo(el, { y: -speed[i] * 0.45 * k, rotationY: i % 2 ? 18 : -16, rotationX: 6, transformPerspective: 1300 }, { y: speed[i] * 0.45 * k, rotationY: i % 2 ? -12 : 14, rotationX: -6, ease: "none", scrollTrigger: par(`${scope} .ab-collage`, 0.9) });
              gsap.fromTo(el.querySelector("img"), { yPercent: -14, scale: 1.3 }, { yPercent: 14, scale: 1.3, ease: "none", scrollTrigger: par(el, 0.5) });
            });
          };
          // cards that fly in out of depth, staggered
          const flyIn = (sel, trig, opts = {}) => {
            const els = $(sel);
            els.forEach((el, i) => {
              const side = i % 2 ? 1 : -1;
              gsap.fromTo(el, { opacity: 0, y: 130 * k, x: side * 70 * k, z: -300, rotationX: -42, rotationY: side * -22, transformPerspective: 1200, scale: 0.86, ...opts.from }, { opacity: 1, y: 0, x: 0, z: 0, rotationX: 0, rotationY: 0, scale: 1, duration: 1.1, delay: (opts.cols ? (i % opts.cols) * 0.1 : 0), ease: "power3.out", scrollTrigger: io(trig ? trig(el) : el, "top 92%", "bottom 5%") });
            });
          };
          const countUps = (scope) => $(`${scope} .ab-count`).forEach((el) => {
            const n = Number(el.dataset.n); const f = !!el.dataset.fmt; const o = { v: 0 };
            gsap.to(o, { v: n, duration: 2, ease: "power2.out", onUpdate: () => { el.textContent = fmt(Math.round(o.v), f); }, scrollTrigger: io(el.closest(".ab-stat"), "top 90%", "bottom 5%") });
          });

          /* ================================================= 01 OVERVIEW ================================================= */
          headReveal(".ab-ov");
          ghost(".ab-ov");
          collage(".ab-ov", [-260, -90, -430]);
          gsap.fromTo(".ab-ov .ab-badge", { rotationY: -180, scale: 0.4, opacity: 0, transformPerspective: 900 }, { rotationY: 0, scale: 1, opacity: 1, duration: 1.1, ease: "back.out(1.6)", scrollTrigger: io(".ab-ov .ab-collage", "top 70%") });
          gsap.to(".ab-ov .ab-badge", { y: -120 * k, rotationZ: 8, ease: "none", scrollTrigger: par(".ab-ov .ab-collage", 0.9) });
          flyIn(".ab-ov .ab-stat", null, { cols: 4 });
          countUps(".ab-ov");
          gsap.from(".ab-who-t", { y: 40, opacity: 0, rotationX: -30, transformPerspective: 800, duration: 0.9, ease: "power3.out", scrollTrigger: io(".ab-who-t", "top 90%") });
          $(".ab-pill").forEach((el, i) => gsap.from(el, { x: (i % 2 ? 1 : -1) * 120 * k, rotationY: (i % 2 ? 1 : -1) * 60, opacity: 0, transformPerspective: 900, duration: 0.9, ease: "power3.out", scrollTrigger: io(el, "top 94%", "bottom 5%") }));
          flyIn(".ab-where, .ab-diff-c", null, { cols: 2 });

          /* ================================================= 02 FOUNDERS ================================================= */
          headReveal(".ab-fd");
          ghost(".ab-fd", -1);
          $(".ab-fp").forEach((el, i) => {
            const side = i ? 1 : -1;
            gsap.fromTo(el.querySelector(".ab-fp-card"), { opacity: 0, x: side * 180 * k, z: -400, rotationY: side * -55, rotationX: 10, transformPerspective: 1300 }, { opacity: 1, x: 0, z: 0, rotationY: 0, rotationX: 0, duration: 1.3, ease: "power3.out", scrollTrigger: io(el, "top 88%", "bottom 5%") });
            gsap.fromTo(el.querySelector(".ab-fp-img img"), { yPercent: -2, scale: 1.05 }, { yPercent: 2, scale: 1.05, ease: "none", scrollTrigger: par(el, 0.5) });
            gsap.fromTo(el, { y: (i ? 50 : -20) * k }, { y: (i ? -30 : 30) * k, ease: "none", scrollTrigger: par(".ab-fd-grid", 0.9) });
            gsap.fromTo(el.querySelector(".ab-fp-n"), { y: 70 * k, rotationX: 50 }, { y: -70 * k, rotationX: -20, transformPerspective: 700, ease: "none", scrollTrigger: par(el) });
            gsap.from(el.querySelectorAll(".ab-fp-body > *"), { y: 36, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out", scrollTrigger: io(el, "top 62%", "bottom 5%") });
          });
          gsap.fromTo(".ab-jr-line i", wide ? { scaleX: 0 } : { scaleY: 0 }, { ...(wide ? { scaleX: 1 } : { scaleY: 1 }), ease: "none", scrollTrigger: par(".ab-jr", 0.6, "top 75%", "bottom 55%") });
          $(".ab-jr-n").forEach((el, i) => gsap.from(el, { y: 70 * k, rotationX: -50, opacity: 0, scale: 0.85, transformPerspective: 900, duration: 0.9, delay: wide ? i * 0.12 : 0, ease: "back.out(1.5)", scrollTrigger: io(el, "top 92%", "bottom 5%") }));
          gsap.from(".ab-jr-t", { opacity: 0, y: 40, rotationX: -30, transformPerspective: 800, duration: 0.9, scrollTrigger: io(".ab-jr-t", "top 92%") });

          /* ================================================= 03 VISION & MISSION ================================================= */
          headReveal(".ab-vm");
          gsap.fromTo(".ab-vm-bg img", { yPercent: -16, scale: 1.25 }, { yPercent: 16, scale: 1.4, ease: "none", scrollTrigger: par(".ab-vm", 0.5) });
          gsap.fromTo(".ab-vm .ab-ghost.g1", { xPercent: -30, rotationX: 40 }, { xPercent: 20, rotationX: -20, transformPerspective: 900, ease: "none", scrollTrigger: par(".ab-vm") });
          gsap.fromTo(".ab-vm .ab-ghost.g2", { xPercent: 30, rotationX: 40 }, { xPercent: -20, rotationX: -20, transformPerspective: 900, ease: "none", scrollTrigger: par(".ab-vm") });
          $(".ab-vc").forEach((el, i) => {
            const side = i ? 1 : -1;
            gsap.fromTo(el.querySelector(".ab-vc-card"), { opacity: 0, x: side * 220 * k, z: -500, rotationY: side * -75, scale: 0.8, transformPerspective: 1400 }, { opacity: 1, x: 0, z: 0, rotationY: 0, scale: 1, duration: 1.4, ease: "power3.out", scrollTrigger: io(el, "top 88%", "bottom 5%") });
            gsap.fromTo(el, { y: (i ? 200 : -40) * k, rotationZ: i ? 2 : -2 }, { y: (i ? -140 : 80) * k, rotationZ: i ? -2 : 2, ease: "none", scrollTrigger: par(".ab-vc-grid", 0.9) });
            gsap.from(el.querySelectorAll(".ab-vc-card > *"), { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out", scrollTrigger: io(el, "top 65%", "bottom 5%") });
          });
          gsap.from(".ab-mt-t, .ab-mt-p", { y: 40, opacity: 0, rotationX: -30, transformPerspective: 800, stagger: 0.1, duration: 0.9, scrollTrigger: io(".ab-mt", "top 88%") });
          $(".ab-mt li").forEach((el, i) => gsap.from(el, { y: 90 * k, rotationX: -60, opacity: 0, z: -200, transformPerspective: 900, duration: 0.9, delay: wide ? i * 0.1 : 0, ease: "power3.out", scrollTrigger: io(el, "top 94%", "bottom 5%") }));

          /* ================================================= 04 SUSTAINABILITY ================================================= */
          headReveal(".ab-gr");
          ghost(".ab-gr");
          collage(".ab-gr", [-300, -140]);
          gsap.from(".ab-why", { y: 80 * k, opacity: 0, rotationX: -35, z: -200, transformPerspective: 1100, duration: 1.1, ease: "power3.out", scrollTrigger: io(".ab-why", "top 90%") });
          gsap.from(".ab-tiles-t", { y: 50, opacity: 0, rotationX: -30, transformPerspective: 800, duration: 0.9, scrollTrigger: io(".ab-tiles-t", "top 90%") });
          $(".ab-tile").forEach((el, i) => {
            gsap.fromTo(el, { opacity: 0, y: 160 * k, z: -600, rotationX: 60, rotationY: (i % 3 - 1) * 25, transformPerspective: 1200, scale: 0.8 }, { opacity: 1, y: 0, z: 0, rotationX: 0, rotationY: 0, scale: 1, duration: 1.2, delay: wide ? (i % 4) * 0.08 : 0, ease: "power3.out", scrollTrigger: io(el, "top 94%", "bottom 5%") });
            gsap.fromTo(el.querySelector(".ab-tile-i"), { y: 30 * k, rotationY: -90 }, { y: -30 * k, rotationY: 90, transformPerspective: 600, ease: "none", scrollTrigger: par(el) });
          });
          gsap.to(".ab-tiles", { y: -60 * k, ease: "none", scrollTrigger: par(".ab-tiles-wrap") });
          flyIn(".ab-panel, .ab-sdg-c", null, { cols: 3 });

          /* ================================================= 05 MANUFACTURING PROCESS (pinned 3D carousel) ================================================= */
          {
            const proc = rootEl.querySelector(".ab-proc");
            const slides = $(".ab-slide");
            const steps = $(".ab-step");
            const NS = slides.length;
            const dur = () => vh() * (lg ? 6 : 5);
            gsap.from(".ab-proc-copy .ab-c", { yPercent: 115, rotationX: -80, opacity: 0, stagger: 0.02, duration: 0.9, transformOrigin: "50% 100%", ease: "power3.out", scrollTrigger: io(".ab-proc", "top 70%", "bottom 5%") });
            gsap.set(slides, { opacity: 0, x: "30%", z: -420 * k, rotationY: 62 });
            gsap.set(slides[0], { opacity: 1, x: "0%", z: 0, rotationY: 0 });
            let cur = -1;
            const setStep = (i) => {
              if (i === cur || !rootEl.isConnected) return;
              cur = i;
              steps.forEach((s, j) => { s.classList.toggle("on", j === i); s.classList.toggle("done", j < i); });
              const cnt = rootEl.querySelector(".ab-proc-count b");
              if (cnt) cnt.textContent = pad2(i + 1);
            };
            setStep(0);
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: proc, start: "top top", end: () => `+=${dur()}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
              onUpdate: () => setStep(Math.max(0, Math.min(NS - 1, Math.floor(tl.time() + 0.12)))),
            });
            tl.to(".ab-proc-bar i", { scaleX: 1, duration: NS - 1 }, 0);
            for (let i = 1; i < NS; i++) {
              tl.to(slides[i - 1], { opacity: 0, x: "-32%", z: -420 * k, rotationY: -62, duration: 0.55, ease: "power2.in" }, i - 0.6)
                .fromTo(slides[i], { opacity: 0, x: "32%", z: -420 * k, rotationY: 62 }, { opacity: 1, x: "0%", z: 0, rotationY: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, i - 0.45);
            }
            tl.to({}, { duration: 0.0001 }, NS - 1 + 0.4);
            gsap.fromTo(".ab-proc-tilt", { rotationX: 8, rotationZ: -2, transformPerspective: 1400 }, { rotationX: -6, rotationZ: 2, ease: "none", scrollTrigger: { trigger: proc, start: "top top", end: () => `+=${dur()}`, scrub: true } });
            gsap.fromTo(".ab-proc-ghost", { xPercent: 6 }, { xPercent: -22, ease: "none", scrollTrigger: { trigger: proc, start: "top top", end: () => `+=${dur()}`, scrub: true } });
          }

          /* ================================================= 06 PRODUCTION PLANT ================================================= */
          headReveal(".ab-pl");
          ghost(".ab-pl", -1);
          flyIn(".ab-pl .ab-stat", null, { cols: 3 });
          countUps(".ab-pl");
          gsap.fromTo(".ab-iso", { rotationY: -180, scale: 0.4, opacity: 0, transformPerspective: 900 }, { rotationY: 0, scale: 1, opacity: 1, duration: 1.1, ease: "back.out(1.6)", scrollTrigger: io(".ab-iso", "top 92%") });
          {
            const gal = rootEl.querySelector(".ab-gal");
            const track = rootEl.querySelector(".ab-gal-track");
            const dist = () => Math.max(0, track.scrollWidth - gal.clientWidth);
            const slide = gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: gal, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true } });
            gsap.to(".ab-gal-bar i", { scaleX: 1, ease: "none", scrollTrigger: { trigger: gal, start: "top top", end: () => `+=${dist()}`, scrub: true } });
            $(".ab-gc").forEach((card, i) => {
              const img = card.querySelector("img");
              const st = (extra = {}) => ({ trigger: card, containerAnimation: slide, start: "left 105%", end: "right -5%", scrub: true, ...extra });
              gsap.fromTo(img, { xPercent: -10 }, { xPercent: 10, ease: "none", scrollTrigger: st() });
              gsap.fromTo(card, { rotationY: 34, rotationX: i % 2 ? 6 : -6, z: -120, y: i % 2 ? 40 * k : -40 * k, transformPerspective: 1300 }, { rotationY: -34, rotationX: i % 2 ? -6 : 6, z: -120, y: i % 2 ? -40 * k : 40 * k, ease: "none", scrollTrigger: st() });
            });
            gsap.from(".ab-gal-head > *", { y: 40, opacity: 0, stagger: 0.1, duration: 0.8, scrollTrigger: io(".ab-gal", "top 80%", "top 10%") });
          }
          gsap.from(".ab-cap-t", { y: 50, opacity: 0, rotationX: -30, transformPerspective: 800, duration: 0.9, scrollTrigger: io(".ab-cap-t", "top 90%") });
          $(".ab-cap").forEach((el, i) => gsap.fromTo(el, { opacity: 0, y: 140 * k, z: -500, rotationX: 55, rotationY: (i % 3 - 1) * 22, transformPerspective: 1200, scale: 0.84 }, { opacity: 1, y: 0, z: 0, rotationX: 0, rotationY: 0, scale: 1, duration: 1.1, delay: wide ? (i % 3) * 0.1 : 0, ease: "power3.out", scrollTrigger: io(el, "top 94%", "bottom 5%") }));

          /* ================================================= CTA ================================================= */
          gsap.fromTo(".ab-cta-bg img", { yPercent: -14, scale: 1.2 }, { yPercent: 14, scale: 1.35, ease: "none", scrollTrigger: par(".ab-cta", 0.5) });
          gsap.from(".ab-cta .ab-cta-h .ab-c", { yPercent: 115, rotationX: -80, opacity: 0, stagger: 0.03, duration: 0.9, transformOrigin: "50% 100%", ease: "power3.out", scrollTrigger: io(".ab-cta", "top 60%", "bottom 10%") });
          gsap.from(".ab-cta .ab-cta-p, .ab-cta .ab-cta-s, .ab-cta .ab-btn", { y: 50, opacity: 0, rotationX: -30, transformPerspective: 800, stagger: 0.14, duration: 0.9, ease: "back.out(1.5)", clearProps: "opacity,transform", scrollTrigger: io(".ab-cta", "top 48%", "bottom 10%") });
          gsap.fromTo(".ab-cta .ab-cta-in", { scale: 0.78, rotationX: 22, transformPerspective: 1200 }, { scale: 1, rotationX: 0, ease: "none", scrollTrigger: par(".ab-cta", true, "top bottom", "center center") });
          $(".ab-cta .ab-cta-rings i").forEach((el, i) => gsap.to(el, { rotation: (i % 2 ? -1 : 1) * (140 + i * 70), scale: 1 + i * 0.12, ease: "none", scrollTrigger: par(".ab-cta") }));

          /* ================================================= depth marks everywhere ================================================= */
          $(".ab-sec").forEach((sec) => {
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
      document.body.classList.remove("ab-3d", "ab-reduce");
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return (
    <div className="ab-root" ref={root}>
      <Cursor />
      <i className="ab-progress" aria-hidden="true" />

      {/* ============ Hero ============ */}
      <header className="ab-sec ab-hero">
        <SteelBits n={12} />
        <i className="ab-blob a" aria-hidden="true" />
        <i className="ab-blob b" aria-hidden="true" />
        <div className="ab-hero-copy">
          <span className="ab-tag">{HERO.tag}</span>
          <h1 className="ab-h1" aria-label={HERO.lines.map((l) => l.text).join(" ")}>
            {HERO.lines.map((l) => <span className="ab-ln" key={l.text}><Words text={l.text} hl={l.hl} /></span>)}
          </h1>
          <p className="ab-hero-p">{HERO.text}</p>
          <div className="ab-hero-cta">
            <button type="button" className="ab-btn" onClick={() => jump("#founders")} data-mag>Meet the founders<i><FaArrowRight aria-hidden="true" /></i></button>
            <button type="button" className="ab-btn ab-btn--ghost" onClick={() => jump("#plant")} data-mag>See our plant</button>
          </div>
          <nav className="ab-index" aria-label="On this page">
            {NAV_SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); jump(`#${s.id}`); }}><b>{s.n}</b>{s.label}</a>
            ))}
          </nav>
        </div>

        <div className="ab-orbit">
          <div className="ab-orbit-ds">
            <div className="ab-orbit-tilt">
              <div className="ab-orbit-base" aria-hidden="true"><i className="d1" /><i className="d2" /><i className="d3" /></div>
              <div className="ab-orbit-scroll">
                <div className="ab-orbit-spin">
                  {HERO.ring.map((p, i) => (
                    <figure className="ab-op" style={{ "--i": i }} key={p.src}>
                      <div className="ab-op-in">
                        <img src={p.src} alt={p.alt} loading="eager" decoding="async" width="1599" height="899" />
                        <figcaption><b>{String(i + 1).padStart(2, "0")}</b>{p.t}</figcaption>
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
              <button type="button" className="ab-chip c1" onClick={() => jump("#overview")} data-cursor="Go" aria-label="Jump to company overview">
                <span className="ab-chip-in"><b>{HERO.chips[0].b}</b><strong>{HERO.chips[0].t}</strong><em>{HERO.chips[0].e}</em></span>
              </button>
              <button type="button" className="ab-chip c2" onClick={() => jump("#plant")} data-cursor="Go" aria-label="Jump to production plant">
                <span className="ab-chip-in"><b>{HERO.chips[1].b}</b><strong>{HERO.chips[1].t}</strong><em>{HERO.chips[1].e}</em></span>
              </button>
            </div>
          </div>
        </div>
        <div className="ab-scroll" aria-hidden="true"><i />Scroll</div>
      </header>

      {/* ============ 01 Company overview ============ */}
      <section className="ab-sec ab-ch ab-epc ab-ov" id="overview" aria-label="Company overview">
        <SteelBits n={10} />
        <div className="ab-ghost" aria-hidden="true">01</div>
        <div className="ab-ch-top">
          <div className="ab-ch-copy">
            <span className="ab-tag">{OVERVIEW.tag}</span>
            <Split text={OVERVIEW.title} hl={OVERVIEW.hl} className="ab-h2 ab-h2--m" tag="h2" />
            {OVERVIEW.text.map((t) => <p className="ab-lead" key={t}>{t}</p>)}
          </div>
          <div className="ab-collage">
            {OVERVIEW.photos.map((im, i) => <Photo im={im} className={"abc"[i]} key={im.src} />)}
            <div className="ab-badge" aria-hidden="true"><strong>7+</strong><span>Years</span></div>
          </div>
        </div>

        <div className="ab-stats">
          {OVERVIEW.stats.map((s) => <Count s={s} key={s.label} />)}
        </div>

        <div className="ab-who">
          <p className="ab-who-t">{OVERVIEW.whoTitle}</p>
          <ul className="ab-pills">
            {OVERVIEW.specialisms.map((s, i) => <li className="ab-pill" key={s}><b>{pad2(i + 1)}</b>{s}</li>)}
          </ul>
        </div>

        <div className="ab-ov-grid">
          <div className="ab-where">
            <span className="ab-ideal-l">{OVERVIEW.where.title}</span>
            <p>{OVERVIEW.where.text}</p>
            <ul>{OVERVIEW.where.places.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <div className="ab-diff">
            {OVERVIEW.different.map((d) => (
              <div className="ab-diff-c" key={d.t}>
                <FaCheck aria-hidden="true" />
                <h4>{d.t}</h4>
                <p>{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 02 Founders ============ */}
      <section className="ab-sec ab-ch ab-fd" id="founders" aria-label="Our founders">
        <SteelBits n={10} />
        <div className="ab-ghost" aria-hidden="true">02</div>
        <div className="ab-ch-copy ab-fd-head">
          <span className="ab-tag">{FOUNDERS.tag}</span>
          <Split text={FOUNDERS.title} hl={FOUNDERS.hl} className="ab-h2" tag="h2" />
          <p className="ab-lead">{FOUNDERS.intro}</p>
        </div>
        <div className="ab-fd-grid">
          {FOUNDERS.people.map((p, i) => (
            <article className="ab-fp" key={p.name}>
              <div className="ab-fp-card" onPointerMove={tiltMove} onPointerLeave={tiltLeave}>
                <div className="ab-fp-img">
                  <img src={p.img} alt={p.alt} loading="eager" decoding="async" style={{ objectPosition: p.pos }} width="1000" height="1500" />
                  <span className="ab-fp-n" aria-hidden="true">{pad2(i + 1)}</span>
                </div>
                <div className="ab-fp-body">
                  <span className="ab-fp-role">{p.role}</span>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="ab-jr">
          <p className="ab-jr-t">The journey so far</p>
          <div className="ab-jr-line" aria-hidden="true"><i /></div>
          <ol>
            {FOUNDERS.journey.map((j, i) => (
              <li className="ab-jr-n" key={j.t}>
                <em>{pad2(i + 1)}</em>
                <h4>{j.t}</h4>
                <p>{j.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ 03 Vision & mission ============ */}
      <section className="ab-sec ab-ch ab-vm" id="vision" aria-label="Vision and mission">
        <div className="ab-vm-bg" aria-hidden="true"><img src="/images/ab/bg-hall.webp" alt="" loading="eager" decoding="async" width="1400" height="933" /></div>
        <i className="ab-scrim" aria-hidden="true" />
        <SteelBits n={10} />
        <div className="ab-ghost g1" aria-hidden="true">VISION</div>
        <div className="ab-ghost g2" aria-hidden="true">MISSION</div>
        <div className="ab-ch-copy ab-vm-head">
          <span className="ab-tag">{VISION.tag}</span>
          <Split text={VISION.title} hl={VISION.hl} className="ab-h2" tag="h2" />
        </div>
        <div className="ab-vc-grid">
          {[VISION.vision, VISION.mission].map((v, i) => (
            <div className="ab-vc" key={v.label}>
              <div className="ab-vc-card" onPointerMove={tiltMove} onPointerLeave={tiltLeave}>
                <span className="ab-vc-n" aria-hidden="true">{pad2(i + 1)}</span>
                <span className="ab-ideal-l">{v.label}</span>
                {v.lines.map((l) => <p className="ab-vc-p" key={l}>{l}</p>)}
                <p className="ab-vc-foot">{v.foot}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="ab-mt">
          <h3 className="ab-mt-t">{VISION.matters.title}</h3>
          <p className="ab-mt-p">{VISION.matters.text}</p>
          <ul>
            {VISION.matters.points.map((p, i) => <li key={p}><b>{pad2(i + 1)}</b>{p}</li>)}
          </ul>
        </div>
      </section>

      {/* ============ 04 Sustainability ============ */}
      <section className="ab-sec ab-ch ab-epc ab-gr" id="green" aria-label="Sustainability and eco-friendly initiatives">
        <SteelBits n={10} />
        <div className="ab-ghost" aria-hidden="true">04</div>
        <div className="ab-ch-top">
          <div className="ab-ch-copy">
            <span className="ab-tag">{GREEN.tag}</span>
            <Split text={GREEN.title} hl={GREEN.hl} className="ab-h2" tag="h2" />
            {GREEN.text.map((t) => <p className="ab-lead" key={t}>{t}</p>)}
          </div>
          <div className="ab-collage ab-collage--s">
            {GREEN.photos.map((im, i) => <Photo im={im} className={"ab"[i]} key={im.src} />)}
            <div className="ab-badge ab-badge--g" aria-hidden="true"><strong>♻</strong><span>100% recyclable steel</span></div>
          </div>
        </div>

        <div className="ab-why">
          <h3>{GREEN.why.title}</h3>
          <p>{GREEN.why.text}</p>
        </div>

        <div className="ab-tiles-wrap">
          <h3 className="ab-tiles-t">{GREEN.practicesTitle}</h3>
          <ul className="ab-tiles">
            {GREEN.practices.map((p, i) => {
              const Icon = ICONS[p.icon];
              return (
                <li className="ab-tile" key={p.t}>
                  <span className="ab-tile-i"><Icon aria-hidden="true" /></span>
                  <em>{pad2(i + 1)}</em>
                  <h4>{p.t}</h4>
                  <p>{p.d}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="ab-panels">
          <div className="ab-panel">
            <h4>{GREEN.benefitsTitle}</h4>
            <ul>{GREEN.benefits.map((b) => <li key={b}><FaCheck aria-hidden="true" />{b}</li>)}</ul>
          </div>
          <div className="ab-panel">
            <h4>{GREEN.innovationsTitle}</h4>
            <ul>{GREEN.innovations.map((b) => <li key={b}><FaCheck aria-hidden="true" />{b}</li>)}</ul>
            <div className="ab-sdg-head">
              <h4>{GREEN.sdg.title}</h4>
              <p>{GREEN.sdg.text}</p>
            </div>
            <div className="ab-sdgs">
              {GREEN.sdg.goals.map((g) => (
                <div className="ab-sdg-c" key={g.n}><strong>{g.n}</strong><span>Goal {g.n}: {g.t}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 05 Manufacturing process (pinned) ============ */}
      <section className="ab-sec ab-pr" id="process" aria-label="Manufacturing process">
        <div className="ab-proc">
          <SteelBits n={8} />
          <div className="ab-proc-ghost" aria-hidden="true">PROCESS</div>
          <div className="ab-proc-grid">
            <div className="ab-proc-copy">
              <span className="ab-tag">{PROCESS.tag}</span>
              <Split text={PROCESS.title} hl={PROCESS.hl} className="ab-h2" tag="h2" />
              <p className="ab-proc-p">{PROCESS.text}</p>
              <ol className="ab-steps">
                {PROCESS.steps.map((s, i) => (
                  <li className={`ab-step${i === 0 ? " on" : ""}`} key={s.t}>
                    <em>{pad2(i + 1)}</em>
                    <div><h4>{s.t}</h4><p>{s.d}</p></div>
                  </li>
                ))}
              </ol>
              <div className="ab-proc-rail">
                <span className="ab-proc-count"><b>01</b> / {pad2(PROCESS.steps.length)}</span>
                <div className="ab-proc-bar" aria-hidden="true"><i /></div>
              </div>
            </div>
            <div className="ab-proc-art">
              <div className="ab-proc-tilt">
                {PROCESS.steps.map((s, i) => (
                  <figure className="ab-slide" key={s.t}>
                    <img src={s.img} alt={s.alt} loading="eager" decoding="async" width="1400" height="933" />
                    <figcaption><b>{pad2(i + 1)}</b>{s.t}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 06 Production plant ============ */}
      <section className="ab-sec ab-ch ab-pl" id="plant" aria-label="Production plant">
        <SteelBits n={10} />
        <div className="ab-ghost" aria-hidden="true">06</div>
        <div className="ab-ch-copy ab-pl-head">
          <span className="ab-tag">{PLANT.tag}</span>
          <Split text={PLANT.title} hl={PLANT.hl} className="ab-h2" tag="h2" />
          <p className="ab-lead">{PLANT.text}</p>
        </div>
        <div className="ab-stats ab-stats--3">
          {PLANT.stats.map((s) => <Count s={s} key={s.label} />)}
        </div>
        <div className="ab-iso"><FaCheck aria-hidden="true" />{PLANT.badge}</div>

        <div className="ab-gal" aria-label={PLANT.galleryTitle}>
          <div className="ab-gal-head">
            <span className="ab-tag">{PLANT.galleryTitle}</span>
            <div className="ab-gal-bar" aria-hidden="true"><i /></div>
          </div>
          <div className="ab-gal-track">
            {PLANT.gallery.map((g, i) => (
              <figure className="ab-gc" key={g.t}>
                <div className="ab-gc-img"><img src={g.src} alt={g.alt} loading="eager" decoding="async" width="1400" height="788" /></div>
                <figcaption><em>{pad2(i + 1)}</em><h4>{g.t}</h4><p>{g.d}</p></figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="ab-caps">
          <h3 className="ab-cap-t">{PLANT.capabilitiesTitle}</h3>
          <ul>
            {PLANT.capabilities.map((c, i) => (
              <li className="ab-cap" key={c.t}>
                <em>{pad2(i + 1)}</em>
                <h4>{c.t}</h4>
                <p>{c.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="ab-sec ab-cta" aria-label="Book a factory tour">
        <div className="ab-cta-bg" aria-hidden="true"><img src={CTA.bg} alt="" loading="eager" decoding="async" width="1500" height="1000" /></div>
        <i className="ab-scrim" aria-hidden="true" />
        <SteelBits n={10} />
        <div className="ab-cta-rings" aria-hidden="true"><i /><i /><i /></div>
        <div className="ab-cta-in">
          <span className="ab-tag">{CTA.tag}</span>
          <Split text={CTA.title} hl={CTA.hl} className="ab-cta-h" tag="h2" />
          <p className="ab-cta-p">{CTA.text}</p>
          <p className="ab-cta-s">{CTA.statement}</p>
          <Link to={ROUTE_PATHS.CONTACT_US} className="ab-btn" data-mag>{CTA.button}<i><FaArrowRight aria-hidden="true" /></i></Link>
        </div>
      </section>
    </div>
  );
}