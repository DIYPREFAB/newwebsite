import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { FaArrowRight, FaCheck, FaMinus, FaBolt, FaLeaf, FaCoins } from "react-icons/fa";
import { navItems } from "../../Constants";
import SteelBits from "../home3d/SteelBits";
import { glassState } from "../home3d/GlassCore"; // shared scroll progress that drives the hero art
import TrustGlass from "./TrustGlass";
import Cursor from "../home3d/Cursor";
import { bookCall } from "../home3d/booking";
import {
  TITLE, HERO_STATS, RIBBON, REVEAL, REVEAL_HL, PILLARS, BENEFITS, SPEED, COMPARE, STATS, USE_CASES, RESPECT_REDUCED_MOTION,
} from "./keybenefitsData";
import "../home3d/home3d.css";
import "../home3d/home3d-v4.css";
import "../home3d/home3d-v5.css";
import "./keybenefits.css";

gsap.registerPlugin(ScrollTrigger);
// phones: ignore the address-bar resize so pinned sections do not jump
ScrollTrigger.config({ ignoreMobileResize: true });

const HL_WORDS = new Set(["Visionary", "Engineering", "Excellence"]);
const pad2 = (n) => String(n).padStart(2, "0");
// chapters for the side dots + progress (selector, label)
const CHAPTERS = [
  [".kb-hero", "Intro"], [".kb-rv", "Why prefab"], [".kb-ben", "Benefits"],
  [".kb-cmp", "Compare"], [".kb-stats", "Results"], [".kb-uc", "Use cases"],
];
const CMP_WORDS = [["Prefab", 0], ["vs", 0], ["conventional:", 0], ["the", 1], ["honest", 1], ["comparison.", 1]];

// Card back shown while a stat card is face-down (before it flips over on scroll).
const CardBack = () => (
  <svg viewBox="0 0 240 240" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      <rect x="8" y="8" width="224" height="224" rx="12" strokeOpacity=".55" />
      <path d="M120 22 L218 120 L120 218 L22 120 Z" />
      <path d="M120 44 L196 120 L120 196 L44 120 Z" strokeOpacity=".6" />
      <circle cx="120" cy="120" r="44" />
      <circle cx="120" cy="120" r="54" strokeDasharray="2 5" strokeOpacity=".7" />
      <path d="M22 120 H66 M174 120 H218 M120 22 V66 M120 174 V218" strokeOpacity=".6" />
      <path d="M14 14 L40 40 M226 14 L200 40 M14 226 L40 200 M226 226 L200 200" strokeOpacity=".5" />
    </g>
    <text x="120" y="130" textAnchor="middle" fontSize="30" fontWeight="900" fill="currentColor" letterSpacing="2">DIY</text>
  </svg>
);

// Pointer spotlight on a card (same trick as the home page cards).
const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function KeyBenefitsSections() {
  const root = useRef(null);
  const lenisRef = useRef(null);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [chapter, setChapter] = useState(0);

  const talk = (e) =>
    bookCall(() => navigate(navItems.find((n) => n.title === "Contact Us")?.link || "/contact-us"), e);

  const explore = () => {
    const el = root.current?.querySelector(".kb-ben");
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  // side dots: jump to a chapter (uses the pin spacer when the section is pinned)
  const goTo = (i) => {
    const el = root.current?.querySelector(CHAPTERS[i][0]);
    if (!el) return;
    const target = i === 0 ? 0 : el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: 0 });
    else if (i === 0) window.scrollTo({ top: 0, behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    document.body.classList.add("kb-3d");
    const reduce = RESPECT_REDUCED_MOTION && matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.toggle("kb-reduce", reduce);

    // Open the page with ?motiondebug on the end of the URL to get a small on-screen readout (see what is blocking motion).
    let dbgTick, dbgEl, dbgProbe;
    if (new URLSearchParams(location.search).has("motiondebug")) {
      dbgEl = document.createElement("div");
      dbgEl.style.cssText = "position:fixed;left:6px;top:70px;z-index:99999;padding:6px 8px;border-radius:8px;font:11px/1.4 monospace;color:#9ff;background:rgba(0,0,0,.8);pointer-events:none;white-space:pre";
      dbgProbe = document.createElement("i");
      dbgProbe.className = "kb-probe";
      dbgProbe.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none";
      document.body.append(dbgEl, dbgProbe);
      let frames = 0, last = performance.now();
      dbgTick = () => {
        frames++;
        const now = performance.now();
        if (now - last < 500) return;
        const fps = Math.round((frames * 1000) / (now - last));
        frames = 0; last = now;
        const cs = getComputedStyle(dbgProbe);
        const anim = dbgProbe.getAnimations().some((a) => a.playState === "running");
        dbgEl.textContent = [
          `fps ${fps}`,
          `css animation ${anim ? "RUNNING" : "BLOCKED"}`,
          `css transition ${parseFloat(cs.transitionDuration) >= 0.5 ? "ok" : "BLOCKED (" + cs.transitionDuration + ")"}`,
          `reduced-motion setting ${matchMedia("(prefers-reduced-motion: reduce)").matches ? "ON" : "off"}`,
          `touch ${matchMedia("(pointer: coarse)").matches ? "yes" : "no"}  w ${innerWidth}`,
          `scrollY ${Math.round(scrollY)}  triggers ${ScrollTrigger.getAll().length}`,
          `crane p ${glassState.p.toFixed(2)}  lenis ${lenisRef.current ? "on" : "off"}`,
        ].join("\n");
      };
      gsap.ticker.add(dbgTick);
    }

    let lenis, tick, ribTick, ribTrack;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, syncTouch: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(100, 33);
    }

    const gp = { load: reduce ? 0.9 : 0, scroll: 0 };
    const sync = () => { glassState.p = gp.load + gp.scroll; };
    sync();

    const mm = gsap.matchMedia(root.current);
    const ctx = gsap.context(() => {
      /* ---------- Hero ---------- */
      if (!reduce) {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".kb-hero .kb-tag", { opacity: 0, y: -14, duration: 0.6 }, 0)
          .from(".kb-h1-w", {
            yPercent: 118, rotationX: -70, opacity: 0, stagger: 0.07, duration: 0.95, transformOrigin: "50% 100%",
            onComplete: () => gsap.set(".kb-h1-m", { overflow: "visible" }),
          }, 0.1)
          .from(".kb-hero-p, .kb-hero-cta, .kb-hero-stats > div", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8 }, 0.75)
          .from(".kb-chip-w", { scale: 0.6, opacity: 0, stagger: 0.14, duration: 0.7, ease: "back.out(1.6)" }, 1.1)
          .from(".kb-hero-halo", { scale: 0.6, opacity: 0, stagger: 0.15, duration: 1.2 }, 0.2);
        gsap.to(gp, { load: 0.9, duration: 2.8, ease: "power2.out", onUpdate: sync });
      }
      const heroST = { trigger: ".kb-hero", start: "top top", end: "bottom top", scrub: true };
      // crane animation follows the whole hero on desktop, and just the art's own screen on phones/tablets
      mm.add("(min-width: 1001px)", () => {
        gsap.to(gp, { scroll: 1.3, ease: "none", onUpdate: sync, scrollTrigger: heroST });
      });
      // phones/tablets: the hero is taller than the screen, so the whole sequence (crane, chips, parallax) is tied to the
      // stretch of scroll in which the model is actually on screen. It plays fully while you can see it.
      const artEnd = () => {
        const art = document.querySelector(".kb-hero-art");
        return "+=" + Math.round(art ? art.offsetTop + art.offsetHeight * 0.85 : innerHeight * 0.6);
      };
      const artST = { trigger: ".kb-hero", start: "top top", end: artEnd, scrub: 0.6, invalidateOnRefresh: true };
      mm.add("(max-width: 1000px)", () => {
        gsap.to(gp, { scroll: 1.3, ease: "none", onUpdate: sync, scrollTrigger: { ...artST, scrub: true } });
      });
      if (!reduce) {
        mm.add("(min-width: 1001px)", () => {
          gsap.to(".kb-hero-copy", { yPercent: -14, opacity: 0.1, ease: "none", scrollTrigger: heroST });
          // the three chips drift away from the model at different speeds
          gsap.to(".kb-chip-w.c1", { y: -130, x: -50, rotation: -6, ease: "none", scrollTrigger: heroST });
          gsap.to(".kb-chip-w.c2", { y: -80, x: 70, rotation: 5, ease: "none", scrollTrigger: heroST });
          gsap.to(".kb-chip-w.c3", { y: -200, x: -70, rotation: 4, ease: "none", scrollTrigger: heroST });
        });
        mm.add("(max-width: 1000px)", () => {
          // the copy is taller than the screen here, so it only fades as the hero leaves
          gsap.to(".kb-hero-copy", {
            y: -40, opacity: 0.1, ease: "none",
            scrollTrigger: { trigger: ".kb-hero", start: "bottom 75%", end: "bottom top", scrub: true },
          });
          // the chips orbit the model and drift apart at different speeds (depth parallax), on the same scroll span
          gsap.to(".kb-chip-w.c1", { y: -70, x: -14, rotation: -5, ease: "none", scrollTrigger: artST });
          gsap.to(".kb-chip-w.c2", { y: -34, x: 12, rotation: 4, ease: "none", scrollTrigger: artST });
          gsap.to(".kb-chip-w.c3", { y: 34, x: -12, rotation: 3, ease: "none", scrollTrigger: artST });
          // layers move at different rates: model slides slower than the page, halos lag behind it
          gsap.to(".kb-hero-art", { yPercent: 10, scale: 1.1, ease: "none", scrollTrigger: artST });
          gsap.to(".kb-hero-art .tg", { yPercent: -7, ease: "none", scrollTrigger: artST });
          gsap.to(".kb-hero-halo", { yPercent: 6, ease: "none", scrollTrigger: artST });
        });
        mm.add("(min-width: 1001px)", () => {
          gsap.to(".kb-hero-art", { yPercent: 12, scale: 1.12, ease: "none", scrollTrigger: heroST });
        });
        gsap.to(".kb-hero-halo:not(.s)", { rotation: 140, ease: "none", scrollTrigger: heroST });
        gsap.to(".kb-hero-blob.a", { y: 240, ease: "none", scrollTrigger: heroST });
        gsap.to(".kb-hero-blob.b", { y: -170, ease: "none", scrollTrigger: heroST });
        gsap.to(".kb-scroll", {
          opacity: 0, y: 24, ease: "none",
          scrollTrigger: { trigger: ".kb-hero", start: "top top", end: "+=18%", scrub: true },
        });
      }

      /* ---------- Pinned statement ---------- */
      if (!reduce) {
        const buildRv = (st) => gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: st })
          .fromTo(".kb-rv-ghost", { xPercent: 14 }, { xPercent: -26, duration: 1 }, 0)
          .to(".kb-rv-ring", { rotation: (i) => (i % 2 ? -80 : 80), y: (i) => (i % 2 ? 60 : -60), duration: 1 }, 0)
          .fromTo(".kb-rv-word", { opacity: 0.14, yPercent: 35 },
            { opacity: 1, yPercent: 0, stagger: 0.04, duration: 0.12, ease: "power2.out" }, 0.02)
          .fromTo(".kb-rv-line i", { scaleX: 0 }, { scaleX: 1, duration: 0.9 }, 0)
          .fromTo(".kb-rv-card", { y: 90, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.12, duration: 0.2, ease: "power2.out" }, 0.45)
          .to(".kb-rv .sh-bit", { y: (i, el) => -Number(el.dataset.sp) * 380, duration: 1 }, 0)
          .to({}, { duration: 0.05 }, 0.95);
        mm.add("(min-height: 561px)", () => {
          buildRv({ trigger: ".kb-rv", start: "top top", end: "+=240%", pin: true, scrub: 1, invalidateOnRefresh: true });
        });
        mm.add("(max-height: 560px)", () => {
          buildRv({ trigger: ".kb-rv", start: "top 85%", end: "bottom 30%", scrub: 1 });
        });
      } else {
        gsap.set(".kb-rv-word, .kb-rv-card", { opacity: 1 });
        gsap.set(".kb-rv-line i", { scaleX: 1 });
      }

      /* ---------- Benefits: light pinned block, cards fly in one by one ---------- */
      if (!reduce) {
        mm.add("(min-width: 1100px) and (min-height: 640px)", () => {
          const cards = gsap.utils.toArray(".kb-ben .kb-card");
          gsap.set(cards, { opacity: 0, transformPerspective: 1100 });
          // statement rises in when the block arrives (time based, so it is never blank at pin start)
          ScrollTrigger.create({
            trigger: ".kb-ben", start: "top 78%", once: true,
            onEnter: () => gsap.from(".kb-ben-hero .kb-tag, .kb-ben-line, .kb-ben-sub", {
              yPercent: 70, opacity: 0, filter: "blur(10px)", stagger: 0.08, duration: 0.9, ease: "power3.out",
            }),
          });
          const from = (el, vars, at) => tl.fromTo(el, { opacity: 0, ...vars }, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, ease: "power3.out", duration: 0.1 }, at);
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: ".kb-ben", start: "top top", end: "+=640%", pin: true, scrub: 1, invalidateOnRefresh: true },
          });
          // statement: lines drift apart, then the whole block zooms toward the camera and dissolves; cards follow
          tl.to(".kb-ben-line", { x: (i) => (i % 2 ? 7 : -7) + "vw", duration: 0.26 }, 0)
            .to(".kb-ben-hero", { scale: 1.45, opacity: 0, filter: "blur(14px)", ease: "power2.in", duration: 0.17 }, 0.1)
            // row 1: card 1 from the left, 2 + 3 together from the top, card 4 from the right
            ;
          from(cards[0], { x: "-110vw", rotation: -14, scale: 0.9 }, 0.3);
          from(cards[1], { y: "-115vh", rotation: -7, scale: 0.9 }, 0.4);
          from(cards[2], { y: "-115vh", rotation: 7, scale: 0.9 }, 0.4);
          from(cards[3], { x: "110vw", rotation: 14, scale: 0.9 }, 0.5);
          // row 2: card 5 from the left, 6 + 7 together from the bottom, card 8 from the right
          from(cards[4], { x: "-110vw", rotation: -14, scale: 0.9 }, 0.58);
          from(cards[5], { y: "115vh", rotation: 7, scale: 0.9 }, 0.68);
          from(cards[6], { y: "115vh", rotation: -7, scale: 0.9 }, 0.68);
          from(cards[7], { x: "110vw", rotation: 14, scale: 0.9 }, 0.78);
          // after landing: cards drift at different depths while the background keeps moving
          tl.to(cards, { y: (i) => -(8 + (i % 4) * 9), duration: 0.14 }, 0.88)
            .to(".kb-ben-hex", { backgroundPositionY: "-420px", duration: 1 }, 0)
            .to(".kb-ben .sh-bit", { y: (i, el) => -Number(el.dataset.sp) * 420, duration: 1 }, 0)
            .to(".kb-ben .sh-ring", { rotation: (i) => (i % 2 ? -120 : 120), y: (i) => -80 * (i + 1), duration: 1 }, 0)
            .to({}, { duration: 0.02 }, 0.98);
        });
        mm.add("(max-width: 1099px), (max-height: 639px)", () => {
          gsap.from(".kb-ben-hero .kb-tag, .kb-ben-line, .kb-ben-sub", {
            yPercent: 70, opacity: 0, filter: "blur(10px)", stagger: 0.08, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: ".kb-ben-hero", start: "top 85%", once: true },
          });
          // statement lines drift apart as it scrolls away
          gsap.to(".kb-ben-line", {
            x: (i) => (i % 2 ? 9 : -9) + "vw", ease: "none",
            scrollTrigger: { trigger: ".kb-ben-hero", start: "top 60%", end: "bottom 5%", scrub: true },
          });
          // every card flies in from alternating sides, tied to the scroll position
          gsap.utils.toArray(".kb-ben .kb-card").forEach((el, i) => {
            gsap.fromTo(el,
              { opacity: 0, x: i % 2 ? 100 : -100, y: 70, rotation: i % 2 ? 6 : -6, scale: 0.9, transformPerspective: 900 },
              { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 97%", end: "top 58%", scrub: 0.8 } });
          });
          gsap.to(".kb-ben .sh-bit", {
            y: (i, el) => -Number(el.dataset.sp) * 220, ease: "none",
            scrollTrigger: { trigger: ".kb-ben", start: "top bottom", end: "bottom top", scrub: true },
          });
          gsap.to(".kb-ben-hex", {
            backgroundPositionY: "-320px", ease: "none",
            scrollTrigger: { trigger: ".kb-ben", start: "top bottom", end: "bottom top", scrub: true },
          });
          gsap.to(".kb-ben .sh-ring", {
            rotation: (i) => (i % 2 ? -100 : 100), y: (i) => -60 * (i + 1), ease: "none",
            scrollTrigger: { trigger: ".kb-ben", start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      }
      gsap.utils.toArray(".kb-head").forEach((el) =>
        gsap.from(el.children, {
          y: 70, opacity: 0, filter: "blur(10px)", stagger: 0.14, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        })
      );

      // every section heading block also drifts at its own speed while it crosses the screen (all devices; skipped inside pinned blocks)
      if (!reduce) {
        gsap.utils.toArray(".kb-head").forEach((el) => {
          if (el.closest(".pin-spacer")) return;
          gsap.fromTo(el, { yPercent: 8 }, {
            yPercent: -8, ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      }

      /* ---------- Compare: one pinned screen, heavy scrubbed motion ---------- */
      if (!reduce) {
        mm.add("(min-width: 900px) and (min-height: 640px)", () => {
          const rows = gsap.utils.toArray(".kb-tbl tbody tr");
          gsap.set(".kb-tbl-wrap, .kb-speed", { transformPerspective: 1400 });
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".kb-cmp", start: "top top", end: "+=300%", pin: true, scrub: 1, invalidateOnRefresh: true },
          });
          tl.from(".kb-cmp-head .kb-tag", { opacity: 0, x: -60, duration: 0.08 }, 0)
            .from(".kb-cw", { yPercent: 120, rotationX: -80, opacity: 0, stagger: 0.025, duration: 0.14, transformOrigin: "50% 100%" }, 0.02)
            .from(".kb-speed", { y: 110, opacity: 0, rotationX: 28, scale: 0.92, duration: 0.2 }, 0.14)
            .from(".kb-speed-row label", { x: -50, opacity: 0, stagger: 0.06, duration: 0.12 }, 0.22)
            .fromTo(".kb-bar i", { scaleX: 0 }, { scaleX: 1, stagger: 0.08, duration: 0.3, ease: "power2.inOut" }, 0.26)
            .from(".kb-speed-note", { opacity: 0, x: -14, stagger: 0.08, duration: 0.1 }, 0.5)
            .from(".kb-tbl-wrap", { y: 160, opacity: 0, rotationX: 38, scale: 0.88, duration: 0.24 }, 0.42)
            .from(".kb-tbl thead th", { y: -46, opacity: 0, stagger: 0.05, duration: 0.12 }, 0.56);
          rows.forEach((r, i) => {
            const at = 0.62 + i * 0.07;
            tl.from(r, { x: i % 2 ? 220 : -220, opacity: 0, skewX: i % 2 ? -12 : 12, duration: 0.16 }, at)
              .from(r.querySelectorAll("svg"), { scale: 0, rotation: -180, stagger: 0.04, duration: 0.1, ease: "back.out(2.4)" }, at + 0.09);
          });
          tl.fromTo(".kb-cmp-ring", { rotation: 0 }, { rotation: (i) => (i % 2 ? -140 : 140), duration: 1.25, ease: "none" }, 0)
            .to({}, { duration: 0.12 }, 1.13);
        });
        mm.add("(max-width: 899px), (max-height: 639px)", () => {
          gsap.from(".kb-cmp-head .kb-tag, .kb-cw", {
            yPercent: 110, opacity: 0, rotationX: -60, transformOrigin: "50% 100%", stagger: 0.06, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: ".kb-cmp-head", start: "top 88%", once: true },
          });
          gsap.fromTo(".kb-speed",
            { y: 80, opacity: 0, rotationX: 24, scale: 0.94, transformPerspective: 1200 },
            { y: 0, opacity: 1, rotationX: 0, scale: 1, ease: "power2.out",
              scrollTrigger: { trigger: ".kb-speed", start: "top 98%", end: "top 62%", scrub: 0.8 } });
          gsap.fromTo(".kb-bar i", { scaleX: 0 }, {
            scaleX: 1, stagger: 0.25, ease: "none",
            scrollTrigger: { trigger: ".kb-speed", start: "top 80%", end: "bottom 45%", scrub: 0.8 },
          });
          gsap.utils.toArray(".kb-tbl tbody tr").forEach((r, i) => {
            gsap.fromTo(r,
              { x: i % 2 ? 70 : -70, opacity: 0, skewX: i % 2 ? -8 : 8 },
              { x: 0, opacity: 1, skewX: 0, ease: "power3.out",
                scrollTrigger: { trigger: r, start: "top 98%", end: "top 66%", scrub: 0.8 } });
            gsap.from(r.querySelectorAll("svg"), {
              scale: 0, rotation: -180, stagger: 0.08, ease: "back.out(2)",
              scrollTrigger: { trigger: r, start: "top 88%", end: "top 62%", scrub: 0.8 },
            });
          });
          gsap.to(".kb-cmp-ring", {
            rotation: (i) => (i % 2 ? -120 : 120), ease: "none",
            scrollTrigger: { trigger: ".kb-cmp", start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      }

      /* ---------- Stats: cards dealt face-down, then flip over one by one ---------- */
      const statCards = gsap.utils.toArray(".kb-stat");
      const RING = 289;
      // simple version (phones, short windows, reduced motion): count-up + a single flip when each card scrolls in
      const showStat = (el, i) => {
        const s = STATS[i];
        const num = el.querySelector("b");
        const v = el.querySelector(".v");
        gsap.set(v, { strokeDasharray: RING, strokeDashoffset: reduce ? RING * (1 - s.ring) : RING });
        if (reduce) { num.textContent = `${s.end}${s.suffix}`; return; }
        const o = { n: 0 };
        ScrollTrigger.create({
          trigger: el, start: "top 85%", once: true,
          onEnter: () => {
            gsap.to(o, { n: s.end, duration: 2.2, ease: "power2.out", onUpdate: () => { num.textContent = `${Math.round(o.n)}${s.suffix}`; } });
            gsap.to(v, { strokeDashoffset: RING * (1 - s.ring), duration: 2.2, ease: "power2.out" });
          },
        });
        gsap.from(el, {
          rotationY: 180, y: 50, opacity: 0, transformPerspective: 900, duration: 1.1, delay: i * 0.1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      };
      if (reduce) {
        statCards.forEach(showStat);
      } else {
        mm.add("(min-width: 900px) and (min-height: 640px)", () => {
          const path = root.current?.querySelector(".kb-ribbon path");
          const len = path ? path.getTotalLength() : 0;
          if (path) gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          gsap.set(".kb-stat .v", { strokeDasharray: RING, strokeDashoffset: RING });
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: ".kb-stats", start: "top top", end: "+=280%", pin: true, scrub: 1, invalidateOnRefresh: true },
          });
          // the ribbon sweeps across behind the cards
          if (path) tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0);
          // each card starts face-down, close to the camera and tilted, then flips over into its slot
          statCards.forEach((el, i) => {
            const s = STATS[i];
            const num = el.querySelector("b");
            const v = el.querySelector(".v");
            const o = { n: 0 };
            const at = 0.04 + i * 0.17;
            tl.fromTo(el,
              { x: 0, y: 56, z: 50 + i * 12, rotationY: 180, rotationX: 12, rotationZ: i % 2 ? -5 : 5, scale: 1 },
              { x: 0, y: 0, z: 0, rotationY: 0, rotationX: 0, rotationZ: 0, scale: 1, duration: 0.44, ease: "back.out(1.15)" }, at)
              .to(o, { n: s.end, duration: 0.26, onUpdate: () => { num.textContent = `${Math.round(o.n)}${s.suffix}`; } }, at + 0.22)
              .to(v, { strokeDashoffset: RING * (1 - s.ring), duration: 0.26, ease: "power2.out" }, at + 0.22);
          });
          tl.to({}, { duration: 0.15 }, 1);
        });
        mm.add("(max-width: 899px), (max-height: 639px)", () => {
          statCards.forEach((el, i) => {
            const s = STATS[i];
            const num = el.querySelector("b");
            const v = el.querySelector(".v");
            const o = { n: 0 };
            gsap.set(v, { strokeDasharray: RING, strokeDashoffset: RING });
            gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: el, start: "top 98%", end: "top 48%", scrub: 0.7 },
            })
              .fromTo(el,
                { x: i % 2 ? 60 : -60, y: 70, rotationY: 180, rotationX: 14, rotationZ: i % 2 ? -6 : 6, transformPerspective: 900 },
                { x: 0, y: 0, rotationY: 0, rotationX: 0, rotationZ: 0, ease: "back.out(1.1)", duration: 0.6 }, 0)
              .to(o, { n: s.end, duration: 0.4, onUpdate: () => { num.textContent = `${Math.round(o.n)}${s.suffix}`; } }, 0.45)
              .to(v, { strokeDashoffset: RING * (1 - s.ring), duration: 0.4 }, 0.45);
          });
        });
      }

      /* ---------- Use cases: pinned; panels rise in, then the open panel steps through every use case ---------- */
      if (!reduce) {
        mm.add("(min-width: 900px) and (min-height: 640px)", () => {
          const panels = gsap.utils.toArray(".kb-uc .kb-pan");
          const INTRO = 0.2; // share of the scroll used by the entrance
          let last = -1;
          gsap.set(panels, { transformPerspective: 1200 });
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: ".kb-uc", start: "top top", end: "+=380%", pin: true, scrub: 1, invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = Math.min(Math.max((self.progress - INTRO) / (1 - INTRO - 0.04), 0), 0.9999);
                const idx = Math.floor(p * panels.length);
                if (idx !== last) { last = idx; setActive(idx); }
              },
            },
          });
          const intro = 0.9;
          tl.from(panels, { y: 150, rotationX: 40, rotationZ: (i) => (i % 2 ? 7 : -7), opacity: 0, scale: 0.84, stagger: 0.11, duration: 0.34 }, 0)
            .from(".kb-uc .kb-acc", { rotationX: 8, duration: intro, ease: "power2.out", transformPerspective: 1400 }, 0)
            .fromTo(".kb-uc-prog i", { scaleX: 0 }, { scaleX: 1, duration: intro / INTRO - intro, ease: "none" }, intro)
            .to({}, { duration: 0.05 }, intro / INTRO);
        });
        mm.add("(max-width: 899px), (max-height: 639px)", () => {
          const panels = gsap.utils.toArray(".kb-uc .kb-pan");
          panels.forEach((el) => {
            gsap.fromTo(el,
              { y: 80, opacity: 0, rotationX: 24, scale: 0.92, transformPerspective: 1000 },
              { y: 0, opacity: 1, rotationX: 0, scale: 1, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 98%", end: "top 70%", scrub: 0.7 } });
          });
          // exactly one panel is open at a time, so the list height stays constant and the open panel can follow the scroll
          let last = -1;
          ScrollTrigger.create({
            trigger: ".kb-acc", start: "top 62%", end: "bottom 62%",
            onUpdate: (self) => {
              const idx = Math.min(panels.length - 1, Math.floor(self.progress * panels.length));
              if (idx !== last) { last = idx; setActive(idx); }
            },
          });
        });
      }

      /* ---------- Depth marks drift at their own speed ---------- */
      if (!reduce) {
        gsap.utils.toArray(".kb-root .kb-sec, .kb-root .kb-hero").forEach((sec) => {
          const bits = sec.querySelectorAll(".sh-bit");
          if (!bits.length) return;
          gsap.to(bits, {
            y: (i, el) => -Number(el.dataset.sp) * 260, ease: "none",
            scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      }

      /* ---------- Page-wide scroll motion ---------- */
      // top progress bar fills across the whole page
      gsap.fromTo(".kb-prog i", { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.25 },
      });
      // side dots follow whichever chapter is on screen
      CHAPTERS.forEach(([sel], i) => {
        const el = root.current?.querySelector(sel);
        if (!el) return;
        const trg = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
        ScrollTrigger.create({
          trigger: trg, start: "top 55%", end: "bottom 55%",
          onToggle: (self) => { if (self.isActive) setChapter(i); },
        });
      });
      // the word ribbon speeds up, skews and reverses with scroll velocity
      ribTrack = root.current?.querySelector(".kb-rib-track");
      if (ribTrack && !reduce) {
        ribTrack.style.animation = "none";
        const velocity = ScrollTrigger.create({ start: 0, end: "max" });
        const setX = gsap.quickSetter(ribTrack, "xPercent");
        const setSkew = gsap.quickTo(ribTrack, "skewX", { duration: 0.45, ease: "power3.out" });
        let pos = 0, speed = 1;
        ribTick = (time, dt) => {
          const v = velocity.getVelocity();
          const target = (v < -40 ? -1 : 1) * (1 + Math.min(Math.abs(v) / 160, 9));
          speed += (target - speed) * 0.08;
          pos = (((pos + speed * dt * 0.0013) % 50) + 50) % 50; // 50% of the track = one loop
          setX(-pos);
          setSkew(gsap.utils.clamp(-9, 9, -v / 220));
        };
        gsap.ticker.add(ribTick);
      }
    }, root);

    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(t);
      mm.revert();
      ctx.revert();
      if (dbgTick) gsap.ticker.remove(dbgTick);
      dbgEl?.remove();
      dbgProbe?.remove();
      glassState.p = 0;
      document.body.classList.remove("kb-3d", "kb-reduce");
      if (ribTick) gsap.ticker.remove(ribTick);
      if (ribTrack) ribTrack.style.animation = "";
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return (
    <div className="kb-root" ref={root}>
      <Cursor />
      <div className="kb-prog" aria-hidden="true"><i /></div>
      <nav className="kb-dots" aria-label="Page sections">
        {CHAPTERS.map(([, label], i) => (
          <button
            type="button"
            key={label}
            className={chapter === i ? "on" : ""}
            onClick={() => goTo(i)}
            aria-label={label}
            aria-current={chapter === i ? "true" : undefined}
          >
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* ============ 1. Hero ============ */}
      <header className="kb-hero">
        <SteelBits n={20} />
        <i className="kb-hero-blob a" aria-hidden="true" />
        <i className="kb-hero-blob b" aria-hidden="true" />

        <div className="kb-hero-art" aria-hidden="true">
          <i className="kb-hero-halo" />
          <i className="kb-hero-halo s" style={{ inset: "-8%" }} />
          <TrustGlass />
          <div className="kb-chips">
            <span className="kb-chip-w c1"><span className="kb-chip"><FaBolt />30–60% faster delivery</span></span>
            <span className="kb-chip-w c2"><span className="kb-chip"><FaLeaf />Recyclable steel</span></span>
            <span className="kb-chip-w c3"><span className="kb-chip"><FaCoins />Fixed, transparent costs</span></span>
          </div>
        </div>

        <div className="kb-hero-copy">
          <span className="kb-tag">Key benefits of prefab construction</span>
          <h1 className="kb-h1" aria-label={TITLE}>
            {TITLE.split(" ").map((w, i) => (
              <span className="kb-h1-m" key={i} aria-hidden="true">
                <span className={`kb-h1-w${HL_WORDS.has(w) ? " hl" : ""}`}>{w}</span>
              </span>
            ))}
          </h1>
          <p className="kb-hero-p">
            High-quality PEB and modular structures that go up faster, cost less and last longer, backed by expert
            engineers who stay with you from first sketch to final bolt.
          </p>
          <div className="kb-hero-cta">
            <button className="kb-btn" onClick={talk}>Let&apos;s talk<i><FaArrowRight /></i></button>
            <button className="kb-btn kb-btn--ghost" onClick={explore}>Explore the benefits</button>
          </div>
          <div className="kb-hero-stats">
            {HERO_STATS.map(([b, s]) => (
              <div key={s}><b>{b}</b><span>{s}</span></div>
            ))}
          </div>
        </div>

        <div className="kb-scroll" aria-hidden="true"><i />Scroll</div>
      </header>

      {/* ============ 2. Ribbon ============ */}
      <div className="kb-rib" aria-hidden="true">
        <div className="kb-rib-track">
          {[0, 1].map((k) => (
            <div key={k} style={{ display: "flex" }}>
              {[...RIBBON, ...RIBBON].map((w, i) => <span key={i}>{w}</span>)}
            </div>
          ))}
        </div>
      </div>

      {/* ============ 3. Pinned statement ============ */}
      <section className="kb-rv" aria-label="Why prefab">
        <SteelBits n={20} />
        <i className="kb-rv-ring" style={{ width: "44vmax", height: "44vmax", right: "-14vmax", top: "-16vmax" }} />
        <i className="kb-rv-ring" style={{ width: "26vmax", height: "26vmax", left: "-8vmax", bottom: "-10vmax" }} />
        <div className="kb-rv-ghost" aria-hidden="true">Prefab</div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <span className="kb-tag">Why prefab</span>
          <p className="kb-rv-text">
            {REVEAL.split(" ").map((w, i) => (
              <span className={`kb-rv-word${REVEAL_HL.has(w) ? " hl" : ""}`} key={i}>{w}</span>
            ))}
          </p>
        </div>
        <div className="kb-rv-line" style={{ zIndex: 2 }} aria-hidden="true"><i /></div>
        <div className="kb-rv-cards" style={{ position: "relative", zIndex: 2 }}>
          {PILLARS.map(([n, t, d]) => (
            <article className="kb-rv-card" key={n}><em>{n}</em><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </section>

      {/* ============ 4. Benefits: light pinned block ============ */}
      <section className="kb-ben" aria-label="Key benefits">
        <div className="kb-ben-hex" aria-hidden="true" />
        <div className="kb-ben-rings" aria-hidden="true">
          <i className="sh-ring" style={{ width: "46vmax", height: "46vmax", left: "-14vmax", top: "-10vmax" }} />
          <i className="sh-ring" style={{ width: "30vmax", height: "30vmax", right: "-8vmax", bottom: "-8vmax" }} />
          <i className="sh-ring" style={{ width: "18vmax", height: "18vmax", right: "18%", top: "6%" }} />
        </div>
        <SteelBits n={30} />

        <div className="kb-ben-hero">
          <span className="kb-tag">Key benefits</span>
          <h2 className="kb-ben-st">
            <span className="kb-ben-line">Everything prefab</span>
            <span className="kb-ben-line hl">does better,</span>
            <span className="kb-ben-line">engineered into</span>
            <span className="kb-ben-line">every structure.</span>
          </h2>
          <p className="kb-ben-sub">Eight reasons builders, businesses and homeowners choose DIY PreFab over conventional construction.</p>
        </div>

        <div className="kb-ben-grid">
          {BENEFITS.map((b, i) => (
            <article className="kb-card" key={b.title} onPointerMove={spot}>
              <div className="top">
                <span className="ic"><b.Icon /></span>
                <span className="no" aria-hidden="true">{pad2(i + 1)}</span>
              </div>
              <div className="bd">
                {b.stat && <span className="stat">{b.stat}</span>}
                <h3>{b.title}</h3>
                <p>{b.text}</p>
                {b.cta && <button type="button" className="more" onClick={talk}>Talk to our engineers<FaArrowRight /></button>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============ 5. Compare ============ */}
      <section className="kb-sec kb-cmp" aria-label="Prefab versus conventional">
        <SteelBits n={18} />
        <i className="kb-cmp-ring" style={{ width: "42vmax", height: "42vmax", right: "-14vmax", top: "-18vmax" }} aria-hidden="true" />
        <i className="kb-cmp-ring" style={{ width: "24vmax", height: "24vmax", left: "-8vmax", bottom: "-10vmax" }} aria-hidden="true" />
        <div className="kb-cmp-head">
          <span className="kb-tag">Side by side</span>
          <h2 className="kb-h2 kb-cmp-h2" aria-label="Prefab vs conventional: the honest comparison.">
            {CMP_WORDS.map(([w, hl], i) => (
              <span className="kb-cw-m" key={i} aria-hidden="true"><span className={`kb-cw${hl ? " hl" : ""}`}>{w}</span></span>
            ))}
          </h2>
        </div>

        <div className="kb-speed" aria-label="Illustrative build time comparison">
          {SPEED.map((s) => (
            <div className="kb-speed-row" key={s.key}>
              <label>{s.label}</label>
              <div className={`kb-bar ${s.key}`}><i style={{ "--w": s.w }} /></div>
              <span className={`kb-speed-note ${s.key}`}>{s.note}</span>
            </div>
          ))}
          <small>Illustrative only: prefab typically delivers 30–60% faster than conventional construction.</small>
        </div>

        <div className="kb-tbl-wrap">
          <table className="kb-tbl">
            <thead>
              <tr><th scope="col">Feature</th><th scope="col" className="p">Prefab / PEB construction</th><th scope="col">Conventional construction</th></tr>
            </thead>
            <tbody>
              {COMPARE.map(([f, p, c]) => (
                <tr key={f}>
                  <th scope="row">{f}</th>
                  <td className="p" data-label="Prefab / PEB"><span><FaCheck aria-hidden="true" />{p}</span></td>
                  <td className="c" data-label="Conventional"><span><FaMinus aria-hidden="true" />{c}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ 6. Stats ============ */}
      <section className="kb-sec kb-stats" aria-label="Our track record">
        <SteelBits n={18} />
        <svg className="kb-ribbon" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="kbRibGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#12a596" /><stop offset="1" stopColor="#4fd3c4" />
            </linearGradient>
          </defs>
          <path d="M -80 780 C 240 940, 520 560, 820 560 S 1320 300, 1700 20" />
        </svg>
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <linearGradient id="kbGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2fd4c0" /><stop offset="1" stopColor="#a8dadc" />
            </linearGradient>
          </defs>
        </svg>
        <div className="kb-head" style={{ textAlign: "center", marginInline: "auto" }}>
          <span className="kb-tag">Track record</span>
          <h2 className="kb-h2">Trusted because we <span className="hl">deliver.</span></h2>
        </div>
        <div className="kb-stat-grid">
          {STATS.map((s) => (
            <div className="kb-stat" key={s.label}>
              <div className="kb-stat-f">
                <div className="kb-ring">
                  <svg viewBox="0 0 100 100" aria-hidden="true"><circle className="t" cx="50" cy="50" r="46" /><circle className="v" cx="50" cy="50" r="46" /></svg>
                  <b>0{s.suffix}</b>
                </div>
                <p>{s.label}</p>
              </div>
              <div className="kb-stat-b" aria-hidden="true"><CardBack /></div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 7. Use cases ============ */}
      <section className="kb-sec kb-uc" aria-label="Real-world use cases">
        <SteelBits n={20} />
        <div className="kb-head">
          <span className="kb-tag">Real-world use cases</span>
          <h2 className="kb-h2">One system, <span className="hl">every kind of space.</span></h2>
          <p className="kb-lead">From warehouses to farmhouses, prefab adapts to the way you work and live.</p>
        </div>
        <div className="kb-acc">
          {USE_CASES.map((u, i) => (
            <div
              role="button"
              tabIndex={0}
              key={u.title}
              className={`kb-pan${active === i ? " on" : ""}`}
              style={{ "--a": u.a }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); } }}
              aria-expanded={active === i}
            >
              <span className="gh" aria-hidden="true">{pad2(i + 1)}</span>
              <div className="rail"><u.Icon aria-hidden="true" /><em>{u.title}</em></div>
              <div className="body">
                <span className="ic"><u.Icon aria-hidden="true" /></span>
                <h3>{u.title}</h3>
                <p>{u.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="kb-uc-prog" aria-hidden="true"><i /></div>
      </section>
    </div>
  );
}