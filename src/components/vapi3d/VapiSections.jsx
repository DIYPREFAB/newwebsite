import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { lenisOptions, lenisTick } from "../../utils/lenisTick";
import { FaArrowDown, FaCalendarAlt, FaEnvelope, FaLock, FaMapMarkerAlt, FaPhoneAlt, FaRulerCombined, FaUser } from "react-icons/fa";
import Cursor from "../home3d/Cursor";
import { createVapiScene } from "./VapiScene";
import exterior from "../../assets/vapi/vapi-exterior.webp";
import interior from "../../assets/vapi/vapi-interior.webp";
import warehouse from "../../assets/vapi/vapi-warehouse.webp";
import "../home3d/home3d.css";
import "../home3d/home3d-v4.css";
import "../home3d/home3d-v5.css";
import "./vapi3d.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ content (as briefed) */
const HERO = {
  title: "Factory sheds and warehouses in Vapi GIDC.",
  sub: "Planning a pre-engineered building (PEB)? Start with site readiness, erection sequence and first dispatch.",
  cta: "Discuss Your PEB Project",
};
const TYPES = [
  { id: "factory", tag: "Factory shed", img: interior, alt: "Representative interior of a steel-framed factory shed with a clear-span roof", copy: "Share the intended use, approximate area and equipment clearance needs." },
  { id: "warehouse", tag: "Warehouse", img: warehouse, alt: "Representative warehouse aisle with pallet racking", copy: "Share the storage use, approximate area and truck access needs." },
];
const CHECKS = [
  { n: "01", title: "Site readiness", copy: "Check site access, unloading space and foundation readiness." },
  { n: "02", title: "Erection sequence", copy: "Plan the order of work around site access and handover." },
  { n: "03", title: "First dispatch", copy: "Agree what should arrive first and confirm the site can receive it." },
];
const STAGES = ["Site readiness", "Erection sequence", "First dispatch"];

/* ------------------------------------------------------------------ helpers */
const io = (trigger, start = "top 88%", end = "bottom 10%") => ({ trigger, start, end, toggleActions: "play none none reverse" });

const Split = ({ text }) => (
  <>
    {text.split(" ").map((w, i) => (
      <span className="vp-w" key={i} aria-hidden="true">
        <span className="vp-wi">{[...w].map((c, j) => <span className="vp-c" key={j}>{c}</span>)}</span>
      </span>
    ))}
  </>
);

// pointer tilt + moving glare for the two building cards (fine pointers only)
const tiltMove = (e) => {
  if (e.pointerType === "touch") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  if (!r.width) return;
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.transform = `perspective(1100px) rotateX(${((0.5 - y) * 14).toFixed(2)}deg) rotateY(${((x - 0.5) * 18).toFixed(2)}deg) translateZ(24px)`;
  el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
};
const tiltLeave = (e) => { e.currentTarget.style.transform = ""; };

/* ------------------------------------------------------------------ page body */
export default function VapiSections() {
  const root = useRef(null);
  const lenisRef = useRef(null);

  const goEnquiry = () => {
    const el = document.getElementById("vp-enquiry");
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.9 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const rootEl = root.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("vp-3d");
    document.body.classList.toggle("vp-reduce", reduce);

    let lenis, tick;
    if (!reduce) {
      lenis = new Lenis(lenisOptions);
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = lenisTick(lenis);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(100, 33);
    }

    /* ---- the hero's 3D scene: one canvas, driven by sceneState.target (0..1) ---- */
    const sceneState = { target: reduce ? 1 : 0, cur: reduce ? 1 : 0 };
    const canvas = rootEl.querySelector(".vp-gl");
    const heroEl = rootEl.querySelector(".vp-hero");
    const coarse = matchMedia("(pointer: coarse)").matches;
    const sc = canvas ? createVapiScene(canvas, { lowPower: coarse || innerWidth < 760 }) : null;
    if (!sc) heroEl.classList.add("vp-nogl");
    let visible = true, hudStage = -1, hudFrames = -1, offScene = () => {};
    const stepEls = Array.from(rootEl.querySelectorAll(".vp-hud li"));
    const framesEl = rootEl.querySelector("[data-frames]");
    const pinEls = Array.from(rootEl.querySelectorAll(".vp-pin"));
    const barEl = rootEl.querySelector(".vp-hud-bar b");
    if (sc) {
      const pinSize = [];
      const fit = () => {
        sc.resize(heroEl.clientWidth, heroEl.clientHeight);
        pinEls.forEach((el, i) => { pinSize[i] = { w: el.offsetWidth, h: el.offsetHeight }; });
      };
      fit();
      const ro = new ResizeObserver(fit); ro.observe(heroEl);
      const vio = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }); vio.observe(heroEl);
      const move = (e) => sc.setPointer((e.clientX / innerWidth - 0.5) * 2, (e.clientY / innerHeight - 0.5) * 2);
      if (!coarse) heroEl.addEventListener("pointermove", move);
      const draw = (dt) => {
        const st = sc.update(sceneState.cur, dt);
        if (st.stage !== hudStage) { hudStage = st.stage; stepEls.forEach((el, i) => { el.classList.toggle("is-on", i === st.stage); el.classList.toggle("is-done", i < st.stage); }); }
        st.pins.forEach((pn, i) => {
          const el = pinEls[i]; if (!el) return;
          /* keep each label fully on screen and clear of the fixed nav (translate(-50%,-100%) anchors its bottom-centre) */
          const sz = pinSize[i] || { w: 160, h: 42 }, edge = 16;
          const navH = (parseFloat(getComputedStyle(heroEl).getPropertyValue("--nav")) || 96) + 18;
          const x = Math.min(Math.max(pn.x, sz.w / 2 + edge), heroEl.clientWidth - sz.w / 2 - edge);
          const y = Math.max(pn.y, navH + sz.h + 10);
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
          el.style.opacity = pn.a.toFixed(2);
          el.classList.toggle("is-on", pn.on);
          el.classList.toggle("is-clamped", x !== pn.x || y !== pn.y);
        });
        if (st.frames !== hudFrames && framesEl) { hudFrames = st.frames; framesEl.textContent = st.frames; }
        if (barEl) barEl.style.transform = `scaleX(${sceneState.cur.toFixed(4)})`;
      };
      if (reduce) { draw(0.016); window.addEventListener("resize", () => draw(0.016)); }
      else {
        var sceneTick = (time, dt) => { // eslint-disable-line no-var
          if (!visible) return;
          sceneState.cur += (sceneState.target - sceneState.cur) * 0.12;
          if (Math.abs(sceneState.target - sceneState.cur) < 4e-4) sceneState.cur = sceneState.target;
          draw(Math.min(dt, 50) / 1000);
        };
        gsap.ticker.add(sceneTick);
      }
      offScene = () => { ro.disconnect(); vio.disconnect(); heroEl.removeEventListener("pointermove", move); if (typeof sceneTick === "function") gsap.ticker.remove(sceneTick); sc.dispose(); };
    }

    const mm = gsap.matchMedia(rootEl);
    if (!reduce) {
      mm.add(
        { pin: "(min-width: 761px) and (min-height: 560px)", fine: "(pointer: fine)", lg: "(min-width: 1101px)" },
        (c) => {
          const { pin, fine, lg } = c.conditions;
          const k = lg ? 1 : 0.65; // motion strength scales with the screen, nothing is switched off
          const $ = (s) => gsap.utils.toArray(s, rootEl);

          gsap.to(".vp-progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

          /* ================= HERO: intro (text only: the 3D scene is the visual) ================= */
          gsap.timeline({ defaults: { ease: "power3.out" } })
            .from(".vp-gl", { opacity: 0, duration: 1.6, ease: "power2.out" }, 0)
            .from(".vp-hero .vp-tag", { opacity: 0, x: -30, duration: 0.7 }, 0.2)
            .from(".vp-h1 .vp-c", { yPercent: 125, rotationX: -90, opacity: 0, transformOrigin: "50% 100%", stagger: 0.016, duration: 1.1 }, 0.3)
            .from(".vp-sub", { y: 40, opacity: 0, duration: 0.9 }, 0.95)
            .from(".vp-cta", { y: 30, opacity: 0, duration: 0.8 }, 1.15)
            .from(".vp-hud", { y: 40, opacity: 0, duration: 0.9 }, 1.3);

          /* ================= HERO: pinned. Scroll builds the shed (progress -> VapiScene) ================= */
          ScrollTrigger.create({
            trigger: ".vp-hero", start: "top top", end: pin ? "+=300%" : "+=220%", pin: true, scrub: true, anticipatePin: 1,
            onUpdate: (self) => { sceneState.target = self.progress; },
          });

          /* ================= BUILDING TYPE ================= */
          gsap.from(".vp-types .vp-head > *", { opacity: 0, y: 70, rotationX: -40, transformPerspective: 900, stagger: 0.12, duration: 1.1, ease: "power3.out", scrollTrigger: io(".vp-types .vp-head", "top 85%") });
          gsap.fromTo(".vp-types .vp-ghost", { xPercent: 10, rotationX: 22, opacity: 0.4 }, { xPercent: -12, rotationX: -12, opacity: 1, transformPerspective: 900, ease: "none", scrollTrigger: { trigger: ".vp-types", start: "top bottom", end: "bottom top", scrub: true } });
          $(".vp-card").forEach((el, i) => {
            const side = i % 2 ? 1 : -1;
            // one plain transform per layer, no stacked perspectives (the parent .vp-cards supplies the only perspective)
            gsap.fromTo(el, { opacity: 0, x: side * 90 * k, y: 110 * k, rotationY: side * -24, rotationX: 8, scale: 0.92 }, { opacity: 1, x: 0, y: 0, rotationY: 0, rotationX: 0, scale: 1, duration: 1.3, ease: "power3.out", scrollTrigger: io(el, "top 90%", "bottom 5%") });
            gsap.fromTo(el.querySelector(".vp-card-sway"), { rotationY: side * 4, rotationX: 2 }, { rotationY: side * -4, rotationX: -2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } });
            gsap.fromTo(el.querySelector("img"), { yPercent: -8, scale: 1.2 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
          });
          gsap.fromTo(".vp-card:nth-child(2) .vp-card-sway", { y: 40 }, { y: -40, ease: "none", scrollTrigger: { trigger: ".vp-cards", start: "top bottom", end: "bottom top", scrub: 1 } });

          /* ================= BEFORE YOU BUILD: pinned 3D ring ================= */
          if (pin) {
            const ring = $(".vp-ring")[0];
            const panels = $(".vp-panel");
            const steps = $(".vp-step");
            const R = Math.min(560, innerWidth * 0.34);
            gsap.set(ring, { transformOrigin: `50% 50% ${-R}px` });
            panels.forEach((p, i) => gsap.set(p, { rotationY: i * 120, transformOrigin: `50% 50% ${-R}px` }));
            const setOn = (n) => { panels.forEach((p, i) => p.classList.toggle("is-on", i === n)); steps.forEach((s, i) => s.classList.toggle("is-on", i === n)); };
            setOn(0);
            gsap.from(".vp-checks .vp-head > *", { opacity: 0, y: 60, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: io(".vp-checks", "top 75%") });
            gsap.fromTo(".vp-scene", { z: -760, rotationX: 34, opacity: 0 }, { z: 0, rotationX: 0, opacity: 1, transformPerspective: 1400, ease: "none", scrollTrigger: { trigger: ".vp-checks", start: "top 85%", end: "top top", scrub: true } });
            gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: ".vp-checks", start: "top top", end: "+=250%", pin: true, scrub: 0.7, anticipatePin: 1,
                snap: { snapTo: [0, 0.5, 1], duration: { min: 0.3, max: 0.9 }, ease: "power2.inOut" },
                onUpdate: (self) => setOn(Math.round(self.progress * 2)),
              },
            })
              .fromTo(ring, { rotationY: 0 }, { rotationY: -240 }, 0)
              .fromTo(".vp-checks .vp-ghost", { xPercent: 10, rotationX: 40 }, { xPercent: -12, rotationX: -20 }, 0)
              .fromTo(".vp-steps-fill", { scaleX: 0 }, { scaleX: 1 }, 0);
          } else {
            $(".vp-panel").forEach((el, i) => {
              const side = i % 2 ? 1 : -1;
              gsap.fromTo(el, { opacity: 0, y: 90, x: side * 40, z: -240, rotationX: -32, rotationY: side * -18, transformPerspective: 1000 }, { opacity: 1, y: 0, x: 0, z: 0, rotationX: 0, rotationY: 0, duration: 1.1, ease: "power3.out", scrollTrigger: io(el, "top 92%", "bottom 5%") });
            });
            gsap.from(".vp-checks .vp-head > *", { opacity: 0, y: 50, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: io(".vp-checks .vp-head", "top 88%") });
          }

          /* ================= ENQUIRY: plain, reliable reveals (nothing stays tilted or hidden) ================= */
          const once = (trigger, start = "top 88%") => ({ trigger, start, once: true });
          gsap.from(".vp-enq .vp-head > *", { opacity: 0, y: 40, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: once(".vp-enq .vp-head") });
          gsap.from(".vp-ref", { opacity: 0, x: -60, duration: 1.1, ease: "power3.out", scrollTrigger: once(".vp-ref", "top 92%") });
          gsap.fromTo(".vp-ref img", { yPercent: -8, scale: 1.18 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".vp-enq", start: "top bottom", end: "bottom top", scrub: true } });
          gsap.from(".vp-form", { opacity: 0, y: 70, duration: 1, ease: "power3.out", scrollTrigger: once(".vp-form", "top 92%") });
          gsap.from(".vp-field, .vp-submit, .vp-note", { opacity: 0, y: 22, stagger: 0.08, duration: 0.7, delay: 0.25, ease: "power3.out", scrollTrigger: once(".vp-form", "top 92%") });

          return () => { if (typeof offHero === "function") offHero(); };
        }
      );
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
      offScene();
      if (tick) gsap.ticker.remove(tick);
      if (lenis) lenis.destroy();
      lenisRef.current = null;
      document.body.classList.remove("vp-3d", "vp-reduce");
    };
  }, []);

  return (
    <div className="vp-root" ref={root}>
      <Cursor />
      <i className="vp-progress" aria-hidden="true" />

      {/* ============================================================ 1. HERO: a 3D steel shed that scroll erects */}
      <section className="vp-hero" aria-label="Factory sheds and warehouses in Vapi GIDC">
        <div className="vp-grid" aria-hidden="true" />
        <canvas className="vp-gl" role="img" aria-label="3D contour map with a glowing route that a delivery truck follows through three plots: site readiness, erection sequence and first dispatch" />
        <div className="vp-pins" aria-hidden="true">
          {STAGES.map((t, i) => <span className="vp-pin" key={t}><b>0{i + 1}</b>{t}</span>)}
        </div>
        <div className="vp-hero-copy">
          <p className="vp-tag"><i />Plan in Vapi</p>
          <h1 className="vp-h1" aria-label={HERO.title}><Split text={HERO.title} /></h1>
          <p className="vp-sub">{HERO.sub}</p>
          <button type="button" className="vp-cta" onClick={goEnquiry} data-cursor="Enquire">
            <span>{HERO.cta}</span><i><FaArrowDown aria-hidden="true" /></i>
          </button>
        </div>
        <div className="vp-hud" aria-hidden="true">
          <ol>
            {STAGES.map((t, i) => <li key={t}><b>0{i + 1}</b><span>{t}</span></li>)}
          </ol>
          <i className="vp-hud-bar"><b /></i>
          <p className="vp-hud-read">Route <strong data-frames>0</strong>%</p>
        </div>
      </section>

      {/* ============================================================ 2. BUILDING TYPE */}
      <section className="vp-types" id="vp-types" aria-label="Building type">
        <span className="vp-ghost" aria-hidden="true">BUILD</span>
        <header className="vp-head">
          <p className="vp-tag"><i />01 · Building type</p>
          <h2 className="vp-h2">Factory shed or warehouse?</h2>
        </header>
        <div className="vp-cards">
          {TYPES.map((t, i) => (
            <article className="vp-card" key={t.id}>
              <div className="vp-card-sway">
                <div className="vp-card-tilt" onPointerMove={tiltMove} onPointerLeave={tiltLeave}>
                  <div className="vp-card-media"><img src={t.img} alt={t.alt} loading="lazy" decoding="async" /></div>
                  <div className="vp-card-body">
                    <span className="vp-card-no" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                    <h3>{t.tag}</h3>
                    <p>{t.copy}</p>
                  </div>
                  <i className="vp-glare" aria-hidden="true" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============================================================ 3. BEFORE YOU BUILD */}
      <section className="vp-checks" id="vp-checks" aria-label="Before you build">
        <span className="vp-ghost" aria-hidden="true">CHECK</span>
        <header className="vp-head">
          <p className="vp-tag"><i />02 · Before you build</p>
          <h2 className="vp-h2">Three short checks.</h2>
        </header>
        <div className="vp-scene">
          <div className="vp-ring">
            {CHECKS.map((c) => (
              <article className="vp-panel" key={c.n}>
                <span className="vp-panel-n" aria-hidden="true">{c.n}</span>
                <h3>{c.title}</h3>
                <p>{c.copy}</p>
              </article>
            ))}
          </div>
        </div>
        <ol className="vp-steps" aria-hidden="true">
          <i className="vp-steps-line"><b className="vp-steps-fill" /></i>
          {CHECKS.map((c) => <li className="vp-step" key={c.n}><span>{c.n}</span>{c.title}</li>)}
        </ol>
      </section>

      {/* ============================================================ 4. ENQUIRY (mockup) */}
      <section className="vp-enq" id="vp-enquiry" aria-label="Enquiry">
        <div className="vp-enq-grid">
          <div className="vp-enq-side">
            <header className="vp-head">
              <p className="vp-tag"><i />03 · Enquiry</p>
              <h2 className="vp-h2">Tell us about your PEB project.</h2>
            </header>
            <figure className="vp-ref">
              <img src={exterior} alt="Representative pre-engineered steel building with blue cladding and a large open bay" loading="lazy" decoding="async" />
              <figcaption>Representative visual</figcaption>
            </figure>
          </div>
        {/* Mockup only: no action, no network call, submit disabled, not connected to any enquiry system. */}
        <form className="vp-form" onSubmit={(e) => e.preventDefault()} noValidate aria-describedby="vp-form-note">
          <span className="vp-form-badge"><FaLock aria-hidden="true" /> Mockup · submission is off</span>
          <fieldset disabled>
            <legend className="vp-sr">Project enquiry (mockup)</legend>
            <div className="vp-field">
              <label htmlFor="vp-loc"><FaMapMarkerAlt aria-hidden="true" /> Project location</label>
              <input id="vp-loc" type="text" placeholder="Plot / area, Vapi GIDC" />
            </div>
            <div className="vp-field">
              <label htmlFor="vp-area"><FaRulerCombined aria-hidden="true" /> Approximate area</label>
              <input id="vp-area" type="text" placeholder="Approx. area in sq. m" />
            </div>
            <div className="vp-field">
              <label htmlFor="vp-date"><FaCalendarAlt aria-hidden="true" /> Target date</label>
              <input id="vp-date" type="text" placeholder="Month / year" />
            </div>
            <div className="vp-field vp-field-wide">
              <span className="vp-field-h"><FaUser aria-hidden="true" /> Contact details</span>
              <div className="vp-trio">
                <label className="vp-sr" htmlFor="vp-name">Name</label><input id="vp-name" type="text" placeholder="Name" />
                <label className="vp-sr" htmlFor="vp-phone">Phone</label><input id="vp-phone" type="tel" placeholder="Phone" />
                <label className="vp-sr" htmlFor="vp-mail">Email</label><input id="vp-mail" type="email" placeholder="Email" />
              </div>
            </div>
          </fieldset>
          <button type="submit" className="vp-submit" disabled aria-disabled="true"><span>Submit enquiry</span><i><FaArrowDown aria-hidden="true" /></i></button>
          <p className="vp-note" id="vp-form-note">
            <FaPhoneAlt aria-hidden="true" /><FaEnvelope aria-hidden="true" />
            <span>This is a layout mockup. Nothing you type here is sent anywhere. To reach the team now, use <Link to="/contact-us">Contact Us</Link>.</span>
          </p>
        </form>
        </div>
      </section>
    </div>
  );
}
