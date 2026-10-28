import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { FaArrowRight } from "react-icons/fa";
import ROUTE_PATHS from "../../routes/RoutePath";
import SteelBits from "../home3d/SteelBits";
import Cursor from "../home3d/Cursor";
import { RESPECT_REDUCED_MOTION, SHOW_EPC, HERO, EPC, BUILD, PROCESS, MARQUEE, CTA } from "./psData";
import "../home3d/home3d.css";
import "../home3d/home3d-v4.css";
import "../home3d/home3d-v5.css";
import "./ps3d.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const pad2 = (v) => String(v).padStart(2, "0");

// scroll-triggered entrance that plays on the way down and reverses on the way back up
const io = (trigger, start = "top 88%", end = "bottom 10%") => ({ trigger, start, end, toggleActions: "play none none reverse" });

// mouse tilt for the service cards (fine pointers only; touch devices get the scroll-driven 3D instead)
const tiltMove = (e) => {
  if (e.pointerType === "touch") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return;
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.transform = `perspective(1100px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg)`;
};
const tiltLeave = (e) => { e.currentTarget.style.transform = ""; };

// words > characters, so headlines can fly in letter by letter
function Words({ text, hl = [] }) {
  const set = new Set(hl);
  return text.split(" ").map((w, i) => (
    <span className="ps-m" key={i} aria-hidden="true">
      <span className={`ps-w${set.has(w) ? " hl" : ""}`}>
        {[...w].map((c, j) => <span className="ps-c" key={j}>{c}</span>)}
      </span>
    </span>
  ));
}
function Split({ text, hl, className, tag: Tag = "span" }) {
  return <Tag className={className} aria-label={text}><Words text={text} hl={hl} /></Tag>;
}

// A fine-line portal frame that draws itself as you scroll (steel structure for chapter 02)
function PortalFrame() {
  return (
    <svg className="ps-frame" viewBox="0 0 440 340" aria-hidden="true" fill="none">
      <path className="ps-fp g" pathLength="1" d="M10 312H430" />
      {/* columns */}
      <path className="ps-fp" pathLength="1" d="M40 312V176" />
      <path className="ps-fp" pathLength="1" d="M220 312V176" />
      <path className="ps-fp" pathLength="1" d="M400 312V176" />
      {/* rafters */}
      <path className="ps-fp" pathLength="1" d="M40 176L130 112L220 176" />
      <path className="ps-fp" pathLength="1" d="M220 176L310 112L400 176" />
      {/* purlins */}
      <path className="ps-fp t" pathLength="1" d="M85 144L85 150M130 112V120M175 144V150M265 144V150M310 112V120M355 144V150" />
      <path className="ps-fp t" pathLength="1" d="M40 176H400" />
      {/* bracing */}
      <path className="ps-fp t" pathLength="1" d="M40 176L220 312M220 176L40 312" />
      <path className="ps-fp t" pathLength="1" d="M220 176L400 312M400 176L220 312" />
      {/* dimension line */}
      <path className="ps-fp d" pathLength="1" d="M40 330H400M40 324V336M400 324V336" />
      {[[40, 176], [130, 112], [220, 176], [310, 112], [400, 176], [40, 312], [220, 312], [400, 312]].map(([x, y], i) => (
        <circle className="ps-bolt" key={i} cx={x} cy={y} r="5" />
      ))}
    </svg>
  );
}

// One service chapter: collage / hero + stacked 3D service cards + "ideal for" panel
function ServiceStack({ data, variant }) {
  return (
    <div className={`ps-stack ps-stack--${variant}`}>
      <div className="ps-stack-head">
        <span className="ps-tag">{data.n} · {data.name}</span>
        <h3 className="ps-h3">{data.listTitle}</h3>
      </div>
      <ol className="ps-stack-list">
        {data.items.map((it, i) => (
          <li className="ps-sc" key={it.title} style={{ "--i": i, zIndex: i + 1 }}>
            <div className="ps-sc-body">
              <div className="ps-sc-in" onPointerMove={tiltMove} onPointerLeave={tiltLeave}>
                <div className="ps-sc-img"><img src={it.img} alt={it.alt} loading="lazy" decoding="async" width="1600" height="1066" /></div>
                <div className="ps-sc-txt">
                  <span className="ps-sc-n" aria-hidden="true">{pad2(i + 1)}</span>
                  <h4>{it.title}</h4>
                  <p>{it.text}</p>
                  <i className="ps-sc-bar" aria-hidden="true" />
                </div>
              </div>
            </div>
            <i className="ps-sc-veil" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </div>
  );
}

function Ideal({ data, to }) {
  return (
    <div className="ps-ideal-wrap">
      <div className="ps-ideal">
        <i className="ps-ideal-glow" aria-hidden="true" />
        <span className="ps-ideal-l">{data.idealLabel}</span>
        <p>{data.ideal}</p>
        <Link to={to} className="ps-btn" data-mag>{data.cta}<i><FaArrowRight aria-hidden="true" /></i></Link>
      </div>
    </div>
  );
}

export default function PsSections() {
  const root = useRef(null);
  const lenisRef = useRef(null);

  // smooth jump to a chapter
  const jump = (sel) => {
    const el = root.current?.querySelector(sel);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -70, duration: 1.7 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const rootEl = root.current;
    const reduce = RESPECT_REDUCED_MOTION && matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("ps-3d");
    document.body.classList.toggle("ps-reduce", reduce);

    let lenis, tick;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, syncTouch: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const mm = gsap.matchMedia(rootEl);
    if (!reduce) {
      mm.add(
        { all: "(min-width: 0px)", lg: "(min-width: 1001px)", md: "(min-width: 601px) and (max-width: 1000px)", fine: "(pointer: fine)" },
        (c) => {
          const { lg, md, fine } = c.conditions;
          const k = lg ? 1 : md ? 0.8 : 0.6; // motion strength per device size (nothing is switched off, it is scaled)
          const $ = (s) => gsap.utils.toArray(s, rootEl);
          const vh = () => window.innerHeight;
          const cleanups = [];
          const par = (trigger, scrub = 0.8, start = "top bottom", end = "bottom top") => ({ trigger, start, end, scrub });

          gsap.to(".ps-progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

          /* ====================================================== HERO ====================================================== */
          const heroST = (end = "bottom top") => par(".ps-hero", 0.8, "top top", end);

          // static depth for the three photo planes (z) – the intro and the scroll act on other layers
          gsap.set(".ps-dc.d1", { z: -140 * k, rotationY: 14 });
          gsap.set(".ps-dc.d2", { z: 20 * k, rotationY: 6 });
          gsap.set(".ps-dc.d3", { z: 190 * k, rotationY: -8 });
          gsap.set(".ps-chip", { z: 260 * k });

          gsap.set(".ps-hero .ps-m", { overflow: "hidden" });
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } })
            .from(".ps-hero .ps-tag", { opacity: 0, y: -14, duration: 0.6 }, 0)
            .from(".ps-hero .ps-c", {
              yPercent: 120, rotationX: -80, opacity: 0, stagger: 0.022, duration: 0.9, transformOrigin: "50% 100%",
              onComplete: () => gsap.set(".ps-hero .ps-m", { overflow: "visible" }),
            }, 0.1)
            .from(".ps-hero-p, .ps-hero-cta > *", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, clearProps: "opacity,transform" }, 0.9)
            .from(".ps-dc", { opacity: 0, y: 220, rotationX: 40, scale: 0.6, stagger: 0.16, duration: 1.3, ease: "power4.out" }, 0.25)
            .from(".ps-chip", { opacity: 0, scale: 0.4, y: 40, stagger: 0.18, duration: 0.9, ease: "back.out(1.7)" }, 1.0)
            .from(".ps-ring", { opacity: 0, scale: 0.3, stagger: 0.12, duration: 1.2 }, 0.3)
            .from(".ps-floor", { opacity: 0, duration: 1.4 }, 0.2);
          ScrollTrigger.create({ trigger: ".ps-hero", start: "top top", end: "bottom 30%", onEnterBack: () => intro.restart() });

          // always-on idle sway so touch devices (no mouse) still get a living 3D scene
          gsap.fromTo(".ps-idle", { rotationY: -9, rotationX: 3 }, { rotationY: 9, rotationX: -3, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
          if (fine) {
            const tx = gsap.quickTo(".ps-tilt", "rotationY", { duration: 1, ease: "power3.out" });
            const ty = gsap.quickTo(".ps-tilt", "rotationX", { duration: 1, ease: "power3.out" });
            const move = (e) => { tx((e.clientX / innerWidth - 0.5) * 30); ty(-(e.clientY / innerHeight - 0.5) * 22); };
            window.addEventListener("pointermove", move);
            cleanups.push(() => window.removeEventListener("pointermove", move));
          }

          // scroll: copy sinks away, photo planes pull apart at very different speeds (extreme parallax)
          gsap.to(".ps-hero-copy", { yPercent: -14, opacity: 0.1, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ps-ds", { rotationX: 16, rotationZ: -5, yPercent: -6, scale: 1.08, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ps-dc.d1 .ps-dc-in", { y: -80 * k, rotationZ: 3, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ps-dc.d2 .ps-dc-in", { y: -220 * k, rotationZ: -4, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ps-dc.d3 .ps-dc-in", { y: -420 * k, rotationZ: 6, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ps-hero .ps-chip .ps-chip-in", { y: (i) => (i ? -300 : -160) * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ps-ring.r1", { rotation: 140 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ps-ring.r2", { rotation: -200 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ps-floor", { yPercent: 30, opacity: 0.2, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ps-blob.a", { y: 160 * k, x: -60 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ps-blob.b", { y: -140 * k, x: 80 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ps-scroll", { opacity: 0, y: 30, ease: "none", scrollTrigger: heroST("20% top") });

          /* ====================================================== MARQUEE ====================================================== */
          const rows = $(".ps-mq-row");
          const tweens = rows.map((row, i) => gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 38, ease: "none", repeat: -1 }));
          const mq = { s: 1, ts: 1 };
          if (lenis) {
            const onScroll = ({ velocity }) => { mq.ts = 1 + Math.min(Math.abs(velocity) / 2, 6); };
            lenis.on("scroll", onScroll);
            cleanups.push(() => lenis.off?.("scroll", onScroll));
          }
          const mqTick = () => { mq.ts += (1 - mq.ts) * 0.05; mq.s += (mq.ts - mq.s) * 0.15; tweens.forEach((t) => t.timeScale(mq.s)); };
          gsap.ticker.add(mqTick);
          cleanups.push(() => { gsap.ticker.remove(mqTick); tweens.forEach((t) => t.kill()); });
          gsap.fromTo(".ps-mq", { rotationX: 35, scale: 0.9, transformPerspective: 900 }, { rotationX: 0, scale: 1, ease: "none", scrollTrigger: par(".ps-mq", 0.6, "top bottom", "top 40%") });

          /* ====================================================== CHAPTERS ====================================================== */
          const headReveal = (scope) => {
            gsap.from(`${scope} .ps-ch-copy .ps-tag`, { opacity: 0, x: -30, duration: 0.7, ease: "power3.out", scrollTrigger: io(scope + " .ps-ch-copy", "top 85%") });
            gsap.from(`${scope} .ps-ch-copy .ps-c`, { yPercent: 115, rotationX: -80, opacity: 0, stagger: 0.02, duration: 0.9, transformOrigin: "50% 100%", ease: "power3.out", scrollTrigger: io(scope + " .ps-ch-copy", "top 82%") });
            gsap.from(`${scope} .ps-ch-copy .ps-lead`, { y: 50 * k, opacity: 0, rotationX: -25, transformPerspective: 900, duration: 1, ease: "power3.out", scrollTrigger: io(scope + " .ps-ch-copy", "top 70%") });
          };

          if (SHOW_EPC) {
          /* ---- 01 EPC: light collage ---- */
          headReveal(".ps-epc");
          gsap.fromTo(".ps-epc .ps-ghost", { xPercent: 12, rotationX: 50, opacity: 0.3 }, { xPercent: -14, rotationX: -25, opacity: 1, transformPerspective: 900, ease: "none", scrollTrigger: par(".ps-epc") });

          const figs = $(".ps-epc .ps-fig");
          const figSpeed = [-260, -90, -430];
          const figRot = [{ a: -16, b: 14 }, { a: 18, b: -12 }, { a: -22, b: 20 }];
          figs.forEach((el, i) => {
            gsap.fromTo(el.querySelector(".ps-fig-in"), { clipPath: "inset(100% 0% 0% 0%)", scale: 0.8 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "power2.out", scrollTrigger: par(el, 0.6, "top 98%", "top 52%") });
            gsap.fromTo(el, { y: -figSpeed[i] * 0.45 * k, rotationY: figRot[i].a, rotationX: 6, transformPerspective: 1300 }, { y: figSpeed[i] * 0.45 * k, rotationY: figRot[i].b, rotationX: -6, ease: "none", scrollTrigger: par(".ps-epc .ps-collage", 0.9) });
            gsap.fromTo(el.querySelector("img"), { yPercent: -14, scale: 1.3 }, { yPercent: 14, scale: 1.3, ease: "none", scrollTrigger: par(el, 0.5) });
          });
          gsap.fromTo(".ps-epc .ps-badge", { rotationY: -180, scale: 0.4, opacity: 0, transformPerspective: 900 }, { rotationY: 0, scale: 1, opacity: 1, duration: 1.1, ease: "back.out(1.6)", scrollTrigger: io(".ps-epc .ps-collage", "top 70%") });
          gsap.to(".ps-epc .ps-badge", { y: -120 * k, rotationZ: 8, ease: "none", scrollTrigger: par(".ps-epc .ps-collage", 0.9) });
          }

          /* ---- 02 Build: full-bleed parallax + drawing frame ---- */
          headReveal(".ps-build");
          gsap.fromTo(".ps-build-bg img", { yPercent: -16, scale: 1.25 }, { yPercent: 16, scale: 1.4, ease: "none", scrollTrigger: par(".ps-build-hero", 0.5) });
          if (SHOW_EPC) gsap.fromTo(".ps-build .ps-ghost", { xPercent: -14, rotationX: 50, opacity: 0.3 }, { xPercent: 12, rotationX: -25, opacity: 1, transformPerspective: 900, ease: "none", scrollTrigger: par(".ps-build-hero") });
          gsap.set(".ps-fp", { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(".ps-bolt", { scale: 0, transformOrigin: "50% 50%" });
          const frameTl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: par(".ps-build-hero", 0.8, "top 60%", "bottom 55%") });
          frameTl.to(".ps-fp.g", { strokeDashoffset: 0, duration: 0.15 }, 0)
            .to(".ps-fp:not(.g):not(.t):not(.d)", { strokeDashoffset: 0, stagger: 0.12, duration: 0.3 }, 0.1)
            .to(".ps-fp.t", { strokeDashoffset: 0, stagger: 0.1, duration: 0.3 }, 0.5)
            .to(".ps-fp.d", { strokeDashoffset: 0, duration: 0.2 }, 0.8)
            .to(".ps-bolt", { scale: 1, stagger: 0.04, duration: 0.15, ease: "back.out(3)" }, 0.75);
          gsap.fromTo(".ps-frame-wrap", { rotationY: -28, rotationX: 10, y: 120 * k, transformPerspective: 1200 }, { rotationY: 24, rotationX: -8, y: -140 * k, ease: "none", scrollTrigger: par(".ps-build-hero", 0.9) });
          $(".ps-build-float").forEach((el, i) => {
            gsap.fromTo(el.querySelector(".ps-fig-in"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: par(el, 0.6, "top 98%", "top 55%") });
            gsap.fromTo(el, { y: (i ? 280 : 120) * k, rotationZ: i ? 10 : -8, rotationY: i ? -30 : 26, transformPerspective: 1100 }, { y: (i ? -380 : -240) * k, rotationZ: i ? -6 : 6, rotationY: i ? 18 : -16, ease: "none", scrollTrigger: par(".ps-build-hero", 0.8) });
            gsap.fromTo(el.querySelector("img"), { yPercent: -13, scale: 1.3 }, { yPercent: 13, scale: 1.3, ease: "none", scrollTrigger: par(el, 0.5) });
          });
          gsap.fromTo(".ps-build-hero .ps-scrim", { opacity: 0.35 }, { opacity: 0.8, ease: "none", scrollTrigger: par(".ps-build-hero", 0.6, "top 30%", "bottom top") });

          /* ====================================================== SERVICE CARD STACKS ====================================================== */
          $(".ps-stack").forEach((stack) => {
            gsap.from(stack.querySelectorAll(".ps-stack-head > *"), { y: 60 * k, opacity: 0, rotationX: -40, transformPerspective: 900, stagger: 0.12, duration: 0.9, ease: "power3.out", scrollTrigger: io(stack.querySelector(".ps-stack-head"), "top 88%") });
            const cards = Array.from(stack.querySelectorAll(".ps-sc"));
            const topOf = (el) => parseFloat(getComputedStyle(el).top) || 0;
            cards.forEach((card, i) => {
              const body = card.querySelector(".ps-sc-body");
              const side = i % 2 ? 1 : -1;
              // fly in from alternating sides with a hinge
              gsap.fromTo(body, { opacity: 0, y: 140 * k, x: side * 90 * k, rotationX: -38, rotationY: side * -26, scale: 0.86, transformPerspective: 1200 }, {
                opacity: 1, y: 0, x: 0, rotationX: 0, rotationY: 0, scale: 1, duration: 1.1, ease: "power3.out",
                scrollTrigger: io(card, "top 92%", "bottom 8%"),
              });
              // photo drifts inside its frame, big numeral slides against it
              gsap.fromTo(card.querySelector(".ps-sc-img img"), { yPercent: -12, scale: 1.28 }, { yPercent: 12, scale: 1.28, ease: "none", scrollTrigger: par(card, 0.5) });
              gsap.fromTo(card.querySelector(".ps-sc-n"), { y: 50 * k, rotationX: 40 }, { y: -50 * k, rotationX: -20, transformPerspective: 700, ease: "none", scrollTrigger: par(card) });
              gsap.fromTo(card.querySelector(".ps-sc-bar"), { scaleX: 0 }, { scaleX: 1, ease: "power2.out", duration: 1, scrollTrigger: io(card, "top 70%", "bottom 8%") });
              // when the next card arrives, this one leans back into the deck
              const next = cards[i + 1];
              if (next) {
                gsap.to(card, {
                  scale: 0.9, rotationX: 7, transformOrigin: "50% 0%", transformPerspective: 1300, y: -14, ease: "none",
                  scrollTrigger: { trigger: next, start: "top 96%", end: () => `top ${topOf(next)}px`, scrub: true, invalidateOnRefresh: true },
                });
                gsap.to(card.querySelector(".ps-sc-veil"), { opacity: 0.62, ease: "none", scrollTrigger: { trigger: next, start: "top 96%", end: () => `top ${topOf(next)}px`, scrub: true, invalidateOnRefresh: true } });
              }
            });
          });

          /* ---- ideal-for panels ---- */
          $(".ps-ideal").forEach((el) => {
            gsap.fromTo(el, { rotationX: -55, y: 120 * k, z: -240, opacity: 0, transformPerspective: 1100, transformOrigin: "50% 100%" }, { rotationX: 0, y: 0, z: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: io(el, "top 92%", "bottom 5%") });
            gsap.fromTo(el.querySelector(".ps-ideal-glow"), { xPercent: -40, rotation: -20 }, { xPercent: 60, rotation: 40, ease: "none", scrollTrigger: par(el) });
            gsap.from(el.querySelectorAll(".ps-ideal-l, p, .ps-btn"), { y: 36, opacity: 0, stagger: 0.14, duration: 0.8, ease: "back.out(1.5)", clearProps: "opacity,transform", scrollTrigger: io(el, "top 75%", "bottom 5%") });
          });

          /* ====================================================== PROCESS: pinned 3D photo carousel ====================================================== */
          {
            const proc = rootEl.querySelector(".ps-proc");
            const slides = $(".ps-slide");
            const steps = $(".ps-step");
            const NS = slides.length;
            const dur = () => vh() * (lg ? 4.2 : 3.4);
            gsap.from(".ps-proc-copy .ps-c", { yPercent: 115, rotationX: -80, opacity: 0, stagger: 0.02, duration: 0.9, transformOrigin: "50% 100%", ease: "power3.out", scrollTrigger: io(".ps-proc", "top 70%", "bottom 5%") });
            gsap.set(slides, { opacity: 0, x: "30%", z: -420 * k, rotationY: 62 });
            gsap.set(slides[0], { opacity: 1, x: "0%", z: 0, rotationY: 0 });
            let cur = -1;
            const setStep = (i) => {
              if (i === cur || !rootEl.isConnected) return;
              cur = i;
              steps.forEach((s, j) => { s.classList.toggle("on", j === i); s.classList.toggle("done", j < i); });
              const cnt = rootEl.querySelector(".ps-proc-count b");
              if (cnt) cnt.textContent = pad2(i + 1);
            };
            setStep(0);
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: proc, start: "top top", end: () => `+=${dur()}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
              onUpdate: () => setStep(Math.max(0, Math.min(NS - 1, Math.floor(tl.time() + 0.12)))),
            });
            tl.to(".ps-proc-bar i", { scaleX: 1, duration: NS - 1 }, 0);
            for (let i = 1; i < NS; i++) {
              tl.to(slides[i - 1], { opacity: 0, x: "-32%", z: -420 * k, rotationY: -62, duration: 0.55, ease: "power2.in" }, i - 0.6)
                .fromTo(slides[i], { opacity: 0, x: "32%", z: -420 * k, rotationY: 62 }, { opacity: 1, x: "0%", z: 0, rotationY: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, i - 0.45);
            }
            tl.to({}, { duration: 0.0001 }, NS - 1 + 0.4);
            gsap.fromTo(".ps-proc-tilt", { rotationX: 8, rotationZ: -2, transformPerspective: 1400 }, { rotationX: -6, rotationZ: 2, ease: "none", scrollTrigger: { trigger: proc, start: "top top", end: () => `+=${dur()}`, scrub: true } });
            gsap.fromTo(".ps-proc-ghost", { xPercent: 6 }, { xPercent: -22, ease: "none", scrollTrigger: { trigger: proc, start: "top top", end: () => `+=${dur()}`, scrub: true } });
          }

          /* ====================================================== FINAL CTA ====================================================== */
          gsap.fromTo(".ps-cta-bg img", { yPercent: -14, scale: 1.2 }, { yPercent: 14, scale: 1.35, ease: "none", scrollTrigger: par(".ps-cta", 0.5) });
          gsap.from(".ps-cta .ps-cta-h .ps-c", { yPercent: 115, rotationX: -80, opacity: 0, stagger: 0.03, duration: 0.9, transformOrigin: "50% 100%", ease: "power3.out", scrollTrigger: io(".ps-cta", "top 60%", "bottom 10%") });
          gsap.from(".ps-cta .ps-cta-p, .ps-cta .ps-cta-s, .ps-cta .ps-btn", { y: 50, opacity: 0, rotationX: -30, transformPerspective: 800, stagger: 0.14, duration: 0.9, ease: "back.out(1.5)", clearProps: "opacity,transform", scrollTrigger: io(".ps-cta", "top 48%", "bottom 10%") });
          gsap.fromTo(".ps-cta .ps-cta-in", { scale: 0.78, rotationX: 22, transformPerspective: 1200 }, { scale: 1, rotationX: 0, ease: "none", scrollTrigger: par(".ps-cta", true, "top bottom", "center center") });
          $(".ps-cta .ps-cta-rings i").forEach((el, i) => gsap.to(el, { rotation: (i % 2 ? -1 : 1) * (140 + i * 70), scale: 1 + i * 0.12, ease: "none", scrollTrigger: par(".ps-cta") }));

          /* ====================================================== depth marks everywhere ====================================================== */
          $(".ps-sec").forEach((sec) => {
            const bits = sec.querySelectorAll(".sh-bit");
            if (!bits.length) return;
            gsap.to(bits, { y: (i, el) => -(Number(el.dataset.sp) || 0.5) * 340 * k, ease: "none", scrollTrigger: par(sec, true) });
          });

          return () => cleanups.forEach((fn) => fn());
        }
      );
    }

    // Refresh trigger positions once images / fonts / lazy chunks have settled
    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(t);
      window.removeEventListener("load", onLoad);
      mm.revert();
      document.body.classList.remove("ps-3d", "ps-reduce");
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  const marquee = (items, key) => {
    const dbl = [...items, ...items];
    return (
      <div className="ps-mq-row" key={key}>
        {[0, 1].map((n) => (
          <div className="ps-mq-half" key={n}>
            {dbl.map((t, i) => <span key={i}>{t}<i aria-hidden="true" /></span>)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="ps-root" ref={root}>
      <Cursor />
      <i className="ps-progress" aria-hidden="true" />

      {/* ============ 1. Hero ============ */}
      <header className="ps-sec ps-hero">
        <SteelBits n={12} />
        <i className="ps-blob a" aria-hidden="true" />
        <i className="ps-blob b" aria-hidden="true" />

        <div className="ps-hero-copy">
          <span className="ps-tag">{HERO.tag}</span>
          <h1 className="ps-h1" aria-label={HERO.lines.map((l) => l.text).join(" ")}>
            {HERO.lines.map((l) => <span className="ps-ln" key={l.text}><Words text={l.text} hl={l.hl} /></span>)}
          </h1>
          <p className="ps-hero-p">{SHOW_EPC ? HERO.text : HERO.textSolo}</p>
          <div className="ps-hero-cta">
            {SHOW_EPC ? (
              <>
                <button type="button" className="ps-btn" onClick={() => jump("#epc")} data-mag>EPC Consultancy<i><FaArrowRight aria-hidden="true" /></i></button>
                <button type="button" className="ps-btn ps-btn--ghost" onClick={() => jump("#build")} data-mag>Construction &amp; Execution</button>
              </>
            ) : (
              <button type="button" className="ps-btn" onClick={() => jump("#build")} data-mag>Construction &amp; Execution<i><FaArrowRight aria-hidden="true" /></i></button>
            )}
          </div>
        </div>

        <div className="ps-deck" aria-hidden="false">
          <div className="ps-floor" aria-hidden="true" />
          <div className="ps-ds">
            <div className="ps-idle">
              <div className="ps-tilt">
                <i className="ps-ring r1" aria-hidden="true" />
                <i className="ps-ring r2" aria-hidden="true" />
                {[["d1", HERO.images.back], ["d2", HERO.images.mid], ["d3", HERO.images.front]].map(([cls, im]) => (
                  <figure className={`ps-dc ${cls}`} key={cls}>
                    <div className="ps-dc-in">
                      <img src={im.src} alt={im.alt} loading="eager" decoding="async" width="1600" height="1066" />
                    </div>
                  </figure>
                ))}
                {SHOW_EPC && (
                  <button type="button" className="ps-chip c1" onClick={() => jump("#epc")} data-cursor="Go" aria-label="Jump to EPC Consultancy">
                    <span className="ps-chip-in"><b>01</b><strong>EPC Consultancy</strong><em>Plan smarter</em></span>
                  </button>
                )}
                <button type="button" className="ps-chip c2" onClick={() => jump("#build")} data-cursor="Go" aria-label="Jump to Prefabricated Construction and Execution">
                  <span className="ps-chip-in">{SHOW_EPC && <b>02</b>}<strong>Prefab Construction &amp; Execution</strong><em>Design to reality</em></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="ps-scroll" aria-hidden="true"><i />Scroll</div>
      </header>

      {SHOW_EPC && (
        <>
      {/* ============ 2. Chapter 01 — EPC Consultancy ============ */}
      <section className="ps-sec ps-ch ps-epc" id="epc" aria-label={EPC.name}>
        <SteelBits n={10} />
        <div className="ps-ghost" aria-hidden="true">{EPC.n}</div>
        <div className="ps-ch-top">
          <div className="ps-ch-copy">
            <span className="ps-tag">{EPC.n} · {EPC.name}</span>
            <Split text={EPC.title} hl={EPC.hl} className="ps-h2" tag="h2" />
            <p className="ps-lead">{EPC.text}</p>
          </div>
          <div className="ps-collage">
            {EPC.collage.map((im, i) => (
              <figure className={`ps-fig ${"abc"[i]}`} key={im.src + i}>
                <div className="ps-fig-in"><img src={im.src} alt={im.alt} loading="lazy" decoding="async" width="1600" height="1066" /></div>
              </figure>
            ))}
            <div className="ps-badge" aria-hidden="true"><strong>{EPC.n}</strong><span>EPC</span></div>
          </div>
        </div>
        <ServiceStack data={EPC} variant="light" />
        <Ideal data={EPC} to={ROUTE_PATHS.CONTACT_US} />
      </section>
        </>
      )}

      {/* ============ 3. Marquee ============ */}
      <section className="ps-mq" aria-hidden="true">
        {MARQUEE.map((row, i) => marquee(row, i))}
      </section>

      {/* ============ 4. Chapter 02 — Prefabricated Construction & Execution ============ */}
      <section className="ps-sec ps-ch ps-build" id="build" aria-label={BUILD.name}>
        <div className="ps-build-hero">
          <div className="ps-build-bg" aria-hidden="true"><img src="/images/ps/steel.webp" alt="" loading="lazy" decoding="async" width="1600" height="900" /></div>
          <i className="ps-scrim" aria-hidden="true" />
          <SteelBits n={10} />
          {SHOW_EPC && <div className="ps-ghost" aria-hidden="true">{BUILD.n}</div>}
          <div className="ps-build-grid">
            <div className="ps-ch-copy">
              <span className="ps-tag">{SHOW_EPC ? `${BUILD.n} · ${BUILD.name}` : BUILD.name}</span>
              <Split text={BUILD.title} hl={BUILD.hl} className="ps-h2" tag="h2" />
              <p className="ps-lead">{BUILD.text}</p>
            </div>
            <div className="ps-build-art">
              <div className="ps-frame-wrap"><PortalFrame /></div>
              {BUILD.float.map((im, i) => (
                <figure className={`ps-fig ps-build-float f${i + 1}`} key={im.src}>
                  <div className="ps-fig-in"><img src={im.src} alt={im.alt} loading="lazy" decoding="async" width="1600" height="1066" /></div>
                </figure>
              ))}
            </div>
          </div>
        </div>
        <ServiceStack data={BUILD} variant="dark" />

        {/* pinned process */}
        <div className="ps-proc" aria-label="Our construction process">
          <SteelBits n={8} />
          <div className="ps-proc-ghost" aria-hidden="true">BUILD</div>
          <div className="ps-proc-grid">
            <div className="ps-proc-copy">
              <span className="ps-tag">{PROCESS.tag}</span>
              <Split text={PROCESS.title} hl={PROCESS.hl} className="ps-h2" tag="h2" />
              <p className="ps-proc-p">{PROCESS.text}</p>
              <ol className="ps-steps">
                {PROCESS.steps.map((s, i) => (
                  <li className={`ps-step${i === 0 ? " on" : ""}`} key={s.title}>
                    <em>{pad2(i + 1)}</em>
                    <div><h4>{s.title}</h4><p>{s.text}</p></div>
                  </li>
                ))}
              </ol>
              <div className="ps-proc-rail">
                <span className="ps-proc-count"><b>01</b> / {pad2(PROCESS.steps.length)}</span>
                <div className="ps-proc-bar" aria-hidden="true"><i /></div>
              </div>
            </div>
            <div className="ps-proc-art">
              <div className="ps-proc-tilt">
                {PROCESS.steps.map((s, i) => (
                  <figure className="ps-slide" key={s.title}>
                    <img src={s.img} alt={s.alt} loading="lazy" decoding="async" width="1600" height="1066" />
                    <figcaption><b>{pad2(i + 1)}</b>{s.title}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Ideal data={BUILD} to={ROUTE_PATHS.CONTACT_US} />
      </section>

      {/* ============ 5. Closing CTA ============ */}
      <section className="ps-sec ps-cta" aria-label="Get in touch">
        <div className="ps-cta-bg" aria-hidden="true"><img src={CTA.bg} alt="" loading="lazy" decoding="async" width="1500" height="1000" /></div>
        <i className="ps-scrim" aria-hidden="true" />
        <SteelBits n={10} />
        <div className="ps-cta-rings" aria-hidden="true"><i /><i /><i /></div>
        <div className="ps-cta-in">
          <span className="ps-tag">{CTA.tag}</span>
          <Split text={CTA.title} hl={CTA.hl} className="ps-cta-h" tag="h2" />
          <p className="ps-cta-p">{SHOW_EPC ? CTA.text : CTA.textSolo}</p>
          <p className="ps-cta-s">{CTA.statement}</p>
          <Link to={ROUTE_PATHS.CONTACT_US} className="ps-btn" data-mag>{CTA.button}<i><FaArrowRight aria-hidden="true" /></i></Link>
        </div>
      </section>
    </div>
  );
}
