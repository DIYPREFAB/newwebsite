import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import SteelBits from "../home3d/SteelBits";
import Cursor from "../home3d/Cursor";
import { bookCall, BOOKING_LABEL } from "../home3d/booking";
import ContactForm from "./ContactForm";
import { TITLE, HERO_HL, HERO_TEXT, CHANNELS, STEPS, RESPECT_REDUCED_MOTION } from "./contactData";
import "../home3d/home3d.css";
import "../home3d/home3d-v4.css";
import "../home3d/home3d-v5.css";
import "./contact3d.css";

gsap.registerPlugin(ScrollTrigger);
// phones: ignore the address-bar resize so sections do not jump while scrolling
ScrollTrigger.config({ ignoreMobileResize: true });

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

// Entrance that plays every time the block enters the screen (from the bottom when scrolling down,
// from the top when scrolling up) and plays backwards when it leaves.
const BOTH = "play reverse play reverse";
const io = (trigger, start = "top 90%", end = "bottom 10%") => ({ trigger, start, end, toggleActions: BOTH });

export default function ContactSections() {
  const root = useRef(null);
  const lenisRef = useRef(null);

  const toForm = () => {
    const el = root.current?.querySelector(".ct-form-sec");
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("ct-name")?.focus({ preventScroll: true }), 900);
  };
  // Cal.com popup if available, otherwise take the visitor to the form on this page
  const book = (e) => bookCall(toForm, e);

  useEffect(() => {
    const reduce = RESPECT_REDUCED_MOTION && matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("ct-3d");
    document.body.classList.toggle("ct-reduce", reduce);

    let lenis, tick;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, syncTouch: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(100, 33);
    }

    /* ---------- Hero intro: plays on load and again every time you scroll back up to the top ---------- */
    const ctx = gsap.context(() => {
      if (reduce) return;
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onStart: () => gsap.set(".ct-h1-m", { overflow: "hidden" }),
      })
        .from(".ct-hero .ct-tag", { opacity: 0, y: -14, duration: 0.6 }, 0)
        .from(".ct-h1-w", {
          yPercent: 118, rotationX: -70, opacity: 0, stagger: 0.07, duration: 0.95, transformOrigin: "50% 100%",
          onComplete: () => gsap.set(".ct-h1-m", { overflow: "visible" }),
        }, 0.1)
        .from(".ct-hero-p, .ct-hero-cta > *", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8 }, 0.7)
        .from(".ct-r", { scale: 0.3, opacity: 0, stagger: 0.12, duration: 1.3 }, 0.2)
        .from(".ct-cross", { opacity: 0, duration: 1 }, 0.6)
        .from(".ct-pin, .ct-place", { scale: 0.5, opacity: 0, stagger: 0.15, duration: 0.8, ease: "back.out(1.7)" }, 1);
      ScrollTrigger.create({
        trigger: ".ct-hero", start: "top top", end: "bottom 30%",
        onEnterBack: () => intro.restart(),
      });
    }, root);

    /* ---------- Everything else: re-built whenever the screen size changes ---------- */
    const mm = gsap.matchMedia(root.current);

    if (!reduce) {
      mm.add(
        {
          all: "(min-width: 0px)",
          lg: "(min-width: 1001px)",
          md: "(min-width: 601px) and (max-width: 1000px)",
          cols3: "(min-width: 761px)",
          steps3: "(min-width: 861px)",
        },
        (c) => {
          const { lg, md, cols3, steps3 } = c.conditions;
          const k = lg ? 1 : md ? 0.75 : 0.55; // motion strength per device class
          const $ = (s) => gsap.utils.toArray(s);
          // parallax scrub over the whole time a section is on screen
          const par = (trigger, scrub = 0.8) => ({ trigger, start: "top bottom", end: "bottom top", scrub });

          /* ============ HERO: scroll-out + parallax (reverses when scrolling up) ============ */
          const heroST = (end = "bottom top") => ({ trigger: ".ct-hero", start: "top top", end, scrub: 0.8 });
          gsap.to(".ct-hero-copy", { yPercent: -16, opacity: 0.1, ease: "none", scrollTrigger: heroST() });
          $(".ct-h1-m").forEach((el, i) => {
            const dir = i % 2 ? 1 : -1;
            gsap.to(el, {
              x: dir * (30 + i * 12) * k, y: -(30 + i * 14) * k, rotation: dir * 3 * k,
              ease: "none", scrollTrigger: heroST(),
            });
          });
          gsap.to(".ct-hero-p", { x: -90 * k, ease: "none", scrollTrigger: heroST("75% top") });
          gsap.to(".ct-hero-cta", { x: 100 * k, ease: "none", scrollTrigger: heroST("75% top") });
          gsap.to(".ct-radar", { yPercent: 10, scale: 1 + 0.14 * k, rotation: 28 * k, ease: "none", scrollTrigger: heroST() });
          $(".ct-r").forEach((el, i) =>
            gsap.to(el, { rotation: (i % 2 ? -1 : 1) * (50 + i * 30), ease: "none", scrollTrigger: heroST() }));
          gsap.to(".ct-place", { x: 50 * k, y: -70 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ct-blob.a", { y: 180 * k, x: -80 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ct-blob.b", { y: -140 * k, x: 90 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ct-scroll", { opacity: 0, y: 30, ease: "none", scrollTrigger: heroST("20% top") });

          /* ============ CHANNELS ============ */
          // whole grid drifts slowly against the scroll (parallax)
          gsap.fromTo(".ct-ch-grid", { y: 50 * k }, { y: -50 * k, ease: "none", scrollTrigger: par(".ct-ch") });
          const chFrom = [
            { x: "-18vw", rotation: -6, rotationY: 30 },
            { y: 130, rotationX: -30 },
            { x: "18vw", rotation: 6, rotationY: -30 },
          ];
          $(".ct-ch-card").forEach((el, i) => {
            const f = cols3 ? chFrom[i] : { x: i % 2 ? 60 : -60, y: 40 };
            gsap.fromTo(el, { opacity: 0, scale: 1 - 0.18 * k, transformPerspective: 900, ...f }, {
              opacity: 1, scale: 1, x: 0, y: 0, rotation: 0, rotationX: 0, rotationY: 0,
              duration: 1.1, delay: cols3 ? i * 0.12 : 0, ease: "power3.out",
              scrollTrigger: io(el, "top 92%", "bottom 8%"),
            });
            // icon + text move at different speeds inside the card
            gsap.fromTo(el.querySelector(".ic"), { y: 30 * k }, { y: -14 * k, ease: "none", scrollTrigger: par(el, 0.6) });
          });

          /* ============ FORM ============ */
          const formST = par(".ct-form-sec");
          // left column
          gsap.fromTo(".ct-left > *", { x: -70 * k, opacity: 0 }, {
            x: 0, opacity: 1, stagger: 0.12, duration: 1, ease: "power3.out",
            scrollTrigger: io(".ct-form-sec", "top 72%", "bottom 28%"),
          });
          // card
          gsap.fromTo(".ct-card", { y: 110 * k, rotationX: -14, opacity: 0, transformPerspective: 1200 }, {
            y: 0, rotationX: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: io(".ct-card", "top 92%", "bottom 8%"),
          });
          // heading, fields and button: cascade in from alternating sides, every time
          const items = $(".ct-form-head, .ct-field"); // the Send Message button is intentionally static (no scroll motion)
          const hide = { opacity: 0, y: 30 * k };
          items.forEach((el, i) => gsap.set(el, { ...hide, x: (i % 2 ? 1 : -1) * 40 * k }));
          const show = (els) => gsap.to(els, { opacity: 1, x: 0, y: 0, stagger: 0.07, duration: 0.7, ease: "power3.out", overwrite: "auto" });
          const away = (els) => gsap.to(els, {
            opacity: 0, y: 30 * k, x: (i) => (items.indexOf(els[i]) % 2 ? 1 : -1) * 40 * k, duration: 0.35, overwrite: "auto",
          });
          ScrollTrigger.batch(items, {
            start: "top 94%", end: "bottom 6%",
            onEnter: show, onEnterBack: show, onLeave: away, onLeaveBack: away,
          });
          // parallax layers
          gsap.fromTo(".ct-wrap", { y: 40 * k }, { y: -40 * k, ease: "none", scrollTrigger: formST });
          gsap.to(".ct-ghost", { xPercent: -34, ease: "none", scrollTrigger: formST });
          gsap.to(".ct-form-sec .ct-hex", { backgroundPositionY: `${-460 * k}px`, ease: "none", scrollTrigger: formST });
          gsap.to(".ct-form-sec .sh-ring", {
            rotation: (i) => (i % 2 ? -100 : 100), y: (i) => -90 * k * (i + 1), ease: "none", scrollTrigger: formST,
          });

          /* ============ STEPS ============ */
          gsap.fromTo(".ct-steps .ct-head", { y: 50 * k }, { y: -30 * k, ease: "none", scrollTrigger: par(".ct-steps") });
          gsap.fromTo(".ct-steps .ct-head > *", { y: 40 * k, opacity: 0 }, {
            y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: "power3.out",
            scrollTrigger: io(".ct-steps .ct-head", "top 88%", "bottom 10%"),
          });
          gsap.fromTo(".ct-step-grid", { y: 60 * k }, { y: -40 * k, ease: "none", scrollTrigger: par(".ct-steps") });
          const stFrom = [
            { x: "-12vw", rotationY: 28 },
            { y: 110, rotationX: -24 },
            { x: "12vw", rotationY: -28 },
          ];
          $(".ct-step").forEach((el, i) => {
            const f = steps3 ? stFrom[i] : { x: i % 2 ? 50 : -50, y: 50 };
            gsap.fromTo(el, { opacity: 0, scale: 1 - 0.16 * k, transformPerspective: 1000, ...f }, {
              opacity: 1, scale: 1, x: 0, y: 0, rotationX: 0, rotationY: 0,
              duration: 1, delay: steps3 ? i * 0.14 : 0, ease: "power3.out",
              scrollTrigger: io(el, "top 90%", "bottom 8%"),
            });
          });
          // connecting line fills and un-fills with the scroll
          if (steps3) {
            gsap.fromTo(".ct-line-fill", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".ct-step-grid", start: "top 80%", end: "bottom 55%", scrub: true } });
          } else {
            gsap.fromTo(".ct-line-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".ct-step-grid", start: "top 70%", end: "bottom 60%", scrub: true } });
          }

          /* ============ DEPTH MARKS: parallax in every section ============ */
          $(".ct-root .ct-sec, .ct-root .ct-hero").forEach((sec) => {
            const bits = sec.querySelectorAll(".sh-bit");
            if (!bits.length) return;
            gsap.to(bits, {
              y: (i, el) => -(Number(el.dataset.sp) || 0.5) * 300 * k,
              ease: "none",
              scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
            });
          });
        }
      );
    }

    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(t);
      mm.revert();
      ctx.revert();
      document.body.classList.remove("ct-3d", "ct-reduce");
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return (
    <div className="ct-root" ref={root}>
      <Cursor />

      {/* ============ 1. Hero ============ */}
      <header className="ct-hero">
        <SteelBits n={20} />
        <i className="ct-blob a" aria-hidden="true" />
        <i className="ct-blob b" aria-hidden="true" />

        <div className="ct-radar" aria-hidden="true">
          <i className="ct-r r1" /><i className="ct-r r2" /><i className="ct-r r3" /><i className="ct-r r4" />
          <i className="ct-cross h" /><i className="ct-cross v" />
          <i className="ct-sweep" />
          <i className="ct-blip b1" /><i className="ct-blip b2" /><i className="ct-blip b3" /><i className="ct-blip b4" />
          <span className="ct-pin"><i /><i /><b /></span>
          <div className="ct-place">
            <FaMapMarkerAlt />
            <div><strong>Head Office</strong><span>Udaipur, Rajasthan</span></div>
          </div>
        </div>

        <div className="ct-hero-copy">
          <span className="ct-tag">Contact us</span>
          <h1 className="ct-h1" aria-label={TITLE}>
            {TITLE.split(" ").map((w, i) => (
              <span className="ct-h1-m" key={i} aria-hidden="true">
                <span className={`ct-h1-w${HERO_HL.has(w) ? " hl" : ""}`}>{w}</span>
              </span>
            ))}
          </h1>
          <p className="ct-hero-p">Tell us about your project. Our engineers will take it from there.</p>
          <div className="ct-hero-cta">
            <button type="button" className="ct-btn" onClick={book}>Book a call<i><FaArrowRight /></i></button>
            <button type="button" className="ct-btn ct-btn--ghost" onClick={toForm}>Send a message</button>
          </div>
        </div>

        <div className="ct-scroll" aria-hidden="true"><i />Scroll</div>
      </header>

      {/* ============ 2. Channels ============ */}
      <section className="ct-sec ct-ch" aria-label="Ways to reach us">
        <SteelBits n={14} />
        <div className="ct-ch-grid">
          {CHANNELS.map((c) => (
            <a
              key={c.id}
              className="ct-ch-card"
              href={c.href}
              onMouseMove={spot}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="ic"><c.Icon aria-hidden="true" /></span>
              <h3>{c.label}</h3>
              <p>{c.value}</p>
              <span className="go">{c.action}<FaArrowRight aria-hidden="true" /></span>
            </a>
          ))}
        </div>
      </section>

      {/* ============ 3. Form (light) ============ */}
      <section className="ct-sec ct-form-sec" aria-label="Send us a message">
        <div className="ct-hex" aria-hidden="true" />
        <div className="ct-rings" aria-hidden="true">
          <i className="sh-ring" style={{ width: "46vmax", height: "46vmax", left: "-16vmax", top: "-12vmax" }} />
          <i className="sh-ring" style={{ width: "28vmax", height: "28vmax", right: "-8vmax", bottom: "-8vmax" }} />
        </div>
        <div className="ct-ghost" aria-hidden="true">Contact</div>
        <SteelBits n={26} />

        <div className="ct-wrap">
          <div className="ct-left">
            <span className="ct-tag">Get in Touch</span>
            <h2 className="ct-h2">Connect with <span className="hl">Engineering Excellence</span></h2>
            <p className="ct-lead">{HERO_TEXT}</p>
            <div className="ct-book">
              <div>
                <h4>Prefer to talk it through?</h4>
                <p>Book a {BOOKING_LABEL} with our team.</p>
              </div>
              <button type="button" className="ct-btn" onClick={book}>Book a call<i><FaArrowRight /></i></button>
            </div>
          </div>
          <div className="ct-card">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ============ 4. What happens next ============ */}
      <section className="ct-sec ct-steps" aria-label="What happens next">
        <SteelBits n={18} />
        <div className="ct-head">
          <span className="ct-tag">What happens next</span>
          <h2 className="ct-h2">From first message to <span className="hl">final bolt.</span></h2>
        </div>
        <div className="ct-step-grid">
          <div className="ct-line" aria-hidden="true"><i className="ct-line-fill" /></div>
          {STEPS.map(([n, t, d]) => (
            <article className="ct-step" key={n}>
              <span className="n">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}