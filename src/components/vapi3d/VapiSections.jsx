import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { lenisOptions, lenisTick } from "../../utils/lenisTick";
import { FaArrowDown, FaCalendarAlt, FaEnvelope, FaHardHat, FaLock, FaMapMarkerAlt, FaPhoneAlt, FaRoad, FaRulerCombined, FaTruck, FaUser } from "react-icons/fa";
import Cursor from "../home3d/Cursor";
import { createSteelScene } from "./SteelScene";
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
const CHECKS = [
  { n: "01", title: "Site readiness", Icon: FaRoad, copy: "Check site access, unloading space and foundation readiness." },
  { n: "02", title: "Erection sequence", Icon: FaHardHat, copy: "Plan the order of work around site access and handover." },
  { n: "03", title: "First dispatch", Icon: FaTruck, copy: "Agree what should arrive first and confirm the site can receive it." },
];

const TYPES = [
  { id: "factory", tag: "Factory shed", img: interior, alt: "Representative interior of a steel-framed factory shed with a clear-span roof", copy: "Share the intended use, approximate area and equipment clearance needs." },
  { id: "warehouse", tag: "Warehouse", img: warehouse, alt: "Representative warehouse aisle with pallet racking", copy: "Share the storage use, approximate area and truck access needs." },
];

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

const tiltMove = (e) => {
  if (e.pointerType === "touch") return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  if (!r.width) return;
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  el.style.transform = `perspective(1100px) rotateX(${((0.5 - y) * 10).toFixed(2)}deg) rotateY(${((x - 0.5) * 14).toFixed(2)}deg) translateZ(18px)`;
  el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
};
const tiltLeave = (e) => { e.currentTarget.style.transform = ""; };

/* ------------------------------------------------------------------ page body */
export default function VapiSections() {
  const root = useRef(null);
  const canvasRef = useRef(null);
  const lenisRef = useRef(null);

  const goEnquiry = () => {
    const el = document.getElementById("vp-enquiry");
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 2 });
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

    /* ---- 3D hero scene (WebGL). If WebGL is unavailable the CSS blueprint backdrop simply stays. ---- */
    let scene = null, drawTick = null, ro = null;
    const state = { scroll: 0 };
    const spine = rootEl.querySelector(".vp-spine-fill");
    const apply = () => {
      if (scene) scene.setProgress(state.scroll);
      if (spine) spine.style.transform = `scaleY(${state.scroll.toFixed(3)})`;
    };
    try {
      scene = createSteelScene(canvasRef.current);
      ro = new ResizeObserver(() => scene.resize());
      ro.observe(canvasRef.current.parentElement);
      if (reduce) { state.scroll = 0.4; }
    } catch (err) {
      scene = null;
      rootEl.classList.add("vp-no-gl");
    }
    apply();

    const mm = gsap.matchMedia(rootEl);
    if (!reduce) {
      mm.add(
        { pin: "(min-width: 761px) and (min-height: 560px)", fine: "(pointer: fine)", lg: "(min-width: 1101px)" },
        (c) => {
          const { pin, fine, lg } = c.conditions;
          const k = lg ? 1 : 0.65;
          const $ = (s) => gsap.utils.toArray(s, rootEl);

          gsap.to(".vp-progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

          /* ================= HERO: intro, then scroll curls the steel sheet into a vault ================= */
          gsap.timeline({ defaults: { ease: "power3.out" } })
            .from(".vp-hero .vp-tag", { opacity: 0, x: -30, duration: 0.7 }, 0.2)
            .from(".vp-h1 .vp-c", { yPercent: 125, rotationX: -90, opacity: 0, transformOrigin: "50% 100%", stagger: 0.016, duration: 1.1 }, 0.3)
            .from(".vp-sub", { y: 40, opacity: 0, duration: 0.9 }, 0.95)
            .from(".vp-cta", { y: 30, scale: 0.9, opacity: 0, duration: 0.8, ease: "back.out(1.6)" }, 1.15)
            .from(".vp-cue, .vp-spine", { opacity: 0, duration: 0.8 }, 1.9);

          if (scene) {
            let live = true;
            drawTick = (_, dt) => { if (live) scene.render(Math.min(dt, 50) / 1000); };
            gsap.ticker.add(drawTick);
            gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: ".vp-hero", start: "top top", end: "+=330%", pin: true, scrub: 0.6, anticipatePin: 1,
                onUpdate: (self) => { state.scroll = self.progress; apply(); },
                onToggle: (self) => { live = self.isActive || self.progress === 0; },
              },
            })
              .to(".vp-hero-copy", { opacity: 0, yPercent: -10, duration: 0.16 }, 0)
              .to(".vp-hero-copy", { opacity: 1, yPercent: 0, duration: 0.16 }, 0.84)
              .to({}, { duration: 1 }, 0);
            if (fine) {
              const hero = $(".vp-hero")[0];
              const move = (e) => scene.pointer(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
              hero.addEventListener("pointermove", move);
              var offHero = () => hero.removeEventListener("pointermove", move); // eslint-disable-line no-var
            }
          }

          /* ================= BUILDING TYPE ================= */
          gsap.from(".vp-types .vp-head > *", { opacity: 0, y: 70, rotationX: -40, transformPerspective: 900, stagger: 0.12, duration: 1.1, ease: "power3.out", scrollTrigger: io(".vp-types .vp-head", "top 85%") });
          gsap.fromTo(".vp-types .vp-ghost", { xPercent: 14 }, { xPercent: -16, ease: "none", scrollTrigger: { trigger: ".vp-types", start: "top bottom", end: "bottom top", scrub: true } });
          $(".vp-card").forEach((el, i) => {
            const side = i % 2 ? 1 : -1;
            gsap.fromTo(el, { opacity: 0, x: side * 140 * k, y: 120 * k, z: -420, rotationY: side * -45, rotationX: 18, transformPerspective: 1400, scale: 0.85 }, { opacity: 1, x: 0, y: 0, z: 0, rotationY: 0, rotationX: 0, scale: 1, duration: 1.4, ease: "power3.out", scrollTrigger: io(el, "top 90%", "bottom 5%") });
            gsap.fromTo(el.querySelector("img"), { yPercent: -11, scale: 1.24 }, { yPercent: 11, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
          });
          gsap.fromTo(".vp-card:nth-child(2)", { yPercent: 7 }, { yPercent: -7, ease: "none", scrollTrigger: { trigger: ".vp-cards", start: "top bottom", end: "bottom top", scrub: 1 } });

          /* ================= BEFORE YOU BUILD ================= */
          const panels = $(".vp-panel"), nodes = $(".vp-node");
          const setOn = (n) => { panels.forEach((p, i) => p.classList.toggle("is-on", i === n)); nodes.forEach((s, i) => s.classList.toggle("is-on", i <= n)); };
          if (pin) {
            setOn(0);
            gsap.from(".vp-checks .vp-head > *", { opacity: 0, y: 60, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: io(".vp-checks", "top 75%") });
            gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: ".vp-checks", start: "top top", end: "+=240%", pin: true, scrub: 0.7, anticipatePin: 1,
                snap: { snapTo: [0, 0.5, 1], duration: { min: 0.3, max: 0.8 }, ease: "power2.inOut" },
                onUpdate: (self) => setOn(Math.round(self.progress * 2)),
              },
            })
              .fromTo(".vp-rail-fill", { scaleX: 0 }, { scaleX: 1 }, 0)
              .fromTo(".vp-checks .vp-ghost", { xPercent: 8 }, { xPercent: -14 }, 0)
              .fromTo(".vp-dial", { rotation: 0 }, { rotation: 240 }, 0);
          } else {
            panels.forEach((el, i) => {
              const side = i % 2 ? 1 : -1;
              gsap.fromTo(el, { opacity: 0, y: 80, x: side * 36, rotationX: -26, transformPerspective: 1000 }, { opacity: 1, y: 0, x: 0, rotationX: 0, duration: 1, ease: "power3.out", scrollTrigger: io(el, "top 92%", "bottom 5%") });
            });
            gsap.from(".vp-checks .vp-head > *", { opacity: 0, y: 50, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger: io(".vp-checks .vp-head", "top 88%") });
          }

          /* ================= TEXT BAND ================= */
          gsap.fromTo(".vp-band-media", { clipPath: "inset(16% 14% 16% 14% round 48px)", scale: 1.3, rotationX: 10, transformPerspective: 1400 }, { clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1, rotationX: 0, ease: "none", scrollTrigger: { trigger: ".vp-band", start: "top 88%", end: "top 12%", scrub: true } });
          gsap.fromTo(".vp-band-media img", { yPercent: -14, scale: 1.2 }, { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".vp-band", start: "top bottom", end: "bottom top", scrub: true } });
          $(".vp-marq").forEach((m, i) => {
            gsap.fromTo(m, { xPercent: i % 2 ? -34 : 6, rotationX: i % 2 ? 20 : -20 }, { xPercent: i % 2 ? 4 : -34, rotationX: i % 2 ? -20 : 20, transformPerspective: 900, ease: "none", scrollTrigger: { trigger: ".vp-band", start: "top bottom", end: "bottom top", scrub: 0.8 } });
          });

          /* ================= ENQUIRY ================= */
          gsap.fromTo(".vp-enq-bg img", { yPercent: -13, scale: 1.28 }, { yPercent: 13, ease: "none", scrollTrigger: { trigger: ".vp-enq", start: "top bottom", end: "bottom top", scrub: true } });
          gsap.from(".vp-enq .vp-head > *", { opacity: 0, y: 70, rotationX: -40, transformPerspective: 900, stagger: 0.12, duration: 1.1, ease: "power3.out", scrollTrigger: io(".vp-enq .vp-head", "top 85%") });
          gsap.fromTo(".vp-form", { opacity: 0, y: 170, z: -400, rotationX: 36, transformPerspective: 1400, transformOrigin: "50% 100%" }, { opacity: 1, y: 0, z: 0, rotationX: 0, ease: "none", scrollTrigger: { trigger: ".vp-form", start: "top 105%", end: "top 66%", scrub: 0.8 } });
          gsap.from(".vp-field", { opacity: 0, x: -44, rotationY: -20, transformPerspective: 900, stagger: 0.09, duration: 0.9, ease: "power3.out", scrollTrigger: io(".vp-form", "top 72%") });
          $(".vp-float").forEach((el, i) => gsap.to(el, { yPercent: (i % 2 ? -1 : 1) * 150, rotation: (i % 2 ? -1 : 1) * 40, ease: "none", scrollTrigger: { trigger: ".vp-enq", start: "top bottom", end: "bottom top", scrub: 1 } }));

          return () => { if (typeof offHero === "function") offHero(); };
        }
      );
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
      if (drawTick) gsap.ticker.remove(drawTick);
      if (ro) ro.disconnect();
      if (scene) scene.dispose();
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

      {/* ============================================================ 1. HERO (3D building, built by scroll) */}
      <section className="vp-hero" aria-label="Factory sheds and warehouses in Vapi GIDC">
        <i className="vp-hero-grid" aria-hidden="true" />
        <canvas className="vp-gl" ref={canvasRef} aria-hidden="true" />
        <i className="vp-veil" aria-hidden="true" />
        <i className="vp-grain" aria-hidden="true" />
        <i className="vp-spine" aria-hidden="true"><b className="vp-spine-fill" /></i>

        <div className="vp-hero-copy">
          <p className="vp-tag"><i />Plan in Vapi</p>
          <h1 className="vp-h1" aria-label={HERO.title}><Split text={HERO.title} /></h1>
          <p className="vp-sub">{HERO.sub}</p>
          <button type="button" className="vp-cta" onClick={goEnquiry} data-cursor="Enquire">
            <span>{HERO.cta}</span><i><FaArrowDown aria-hidden="true" /></i>
          </button>
        </div>

        <div className="vp-cue" aria-hidden="true"><span /></div>
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
              <div className="vp-card-tilt" onPointerMove={tiltMove} onPointerLeave={tiltLeave}>
                <div className="vp-card-media"><img src={t.img} alt={t.alt} loading="lazy" decoding="async" /></div>
                <div className="vp-card-body">
                  <span className="vp-card-no" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                  <h3>{t.tag}</h3>
                  <p>{t.copy}</p>
                </div>
                <i className="vp-glare" aria-hidden="true" />
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
        <div className="vp-seq">
          <ol className="vp-rail" aria-hidden="true">
            <i className="vp-rail-line"><b className="vp-rail-fill" /></i>
            {CHECKS.map((c) => <li className="vp-node" key={c.n}><span>{c.n}</span>{c.title}</li>)}
          </ol>
          <div className="vp-stage">
            <i className="vp-dial" aria-hidden="true" />
            {CHECKS.map((c) => (
              <article className="vp-panel" key={c.n}>
                <span className="vp-panel-n" aria-hidden="true">{c.n}</span>
                <span className="vp-panel-ico" aria-hidden="true"><c.Icon /></span>
                <h3>{c.title}</h3>
                <p>{c.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ interlude: type band */}
      <section className="vp-band" aria-hidden="true">
        <div className="vp-band-media"><img src={interior} alt="" loading="lazy" decoding="async" /></div>
        <div className="vp-band-text">
        <p className="vp-marq">Site readiness · Site readiness · Site readiness</p>
        <p className="vp-marq vp-marq-hl">Erection sequence · Erection sequence</p>
        <p className="vp-marq">First dispatch · First dispatch · First dispatch</p>
        </div>
      </section>

      {/* ============================================================ 4. ENQUIRY (mockup) */}
      <section className="vp-enq" id="vp-enquiry" aria-label="Enquiry">
        <div className="vp-enq-bg" aria-hidden="true"><img src={warehouse} alt="" loading="lazy" decoding="async" /></div>
        <i className="vp-float f1" aria-hidden="true" /><i className="vp-float f2" aria-hidden="true" /><i className="vp-float f3" aria-hidden="true" />
        <header className="vp-head">
          <p className="vp-tag"><i />03 · Enquiry</p>
          <h2 className="vp-h2">Tell us about your PEB project.</h2>
        </header>

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
            This is a layout mockup. Nothing you type here is sent anywhere. To reach the team now, use <Link to="/contact-us">Contact Us</Link>.
          </p>
        </form>
      </section>
    </div>
  );
}
