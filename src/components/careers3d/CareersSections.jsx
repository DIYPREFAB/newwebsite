import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowRight } from "react-icons/fa";
import SteelBits from "../home3d/SteelBits";
import Cursor from "../home3d/Cursor";
import ImagePath from "../../assets/ImagePath";
import ROUTE_PATHS from "../../routes/RoutePath";
import useScrollStage, { useHeroFallback, scrollToEl } from "./useScrollStage";
import {
  TITLE, HERO_HL, HERO_TEXT, CHIPS, MARQUEE, STATS, STORY_TAG, STORY_LEAD, STORY_STATEMENT, STORY_MORE,
  CULTURE_HEAD, CULTURE_TEXT, PILLARS, PROGRAMS_TITLE, PROGRAMS, BUILD_TAG, BUILD_TITLE, BUILD_TEXT, BUILD,
  CTA_TITLE, CTA_TEXT,
} from "./careersData";
import "../home3d/home3d.css";
import "../home3d/home3d-v4.css";
import "../home3d/home3d-v5.css";
import "../contact3d/contact3d.css";
import "./careers3d.css";

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};
// plays every time the block enters the screen (from either side) and reverses when it leaves
const BOTH = "play reverse play reverse";
const io = (trigger, start = "top 90%", end = "bottom 10%") => ({ trigger, start, end, toggleActions: BOTH });
const words = (s, cls) => s.split(" ").map((w, i) => <span className={cls} key={i}>{w} </span>);

export default function CareersSections() {
  const root = useRef(null);

  useHeroFallback(root);
  const lenisRef = useScrollStage(root, ({ reduce, ctx, mm }) => {
    if (reduce) return;
    const $ = gsap.utils.toArray;

    /* ---------- Hero intro: plays on load and again when you scroll back to the top ---------- */
    ctx.add(() => {
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onStart: () => gsap.set(".ct-h1-m", { overflow: "hidden" }),
      })
        .from(".ct-hero .ct-tag", { opacity: 0, y: -14, duration: 0.6 }, 0)
        .from(".ct-h1-w", {
          yPercent: 118, rotationX: -70, opacity: 0, stagger: 0.07, duration: 0.95, transformOrigin: "50% 100%",
          onComplete: () => gsap.set(".ct-h1-m", { overflow: "visible" }),
        }, 0.1)
        .from(".ct-hero-p, .ct-hero-cta > *", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, clearProps: "opacity,transform" }, 0.7)
        .from(".cr-p", { strokeDashoffset: 1, duration: 1.8, stagger: 0.07, ease: "power2.inOut" }, 0.2)
        .from(".cr-bolt", { scale: 0, transformOrigin: "50% 50%", stagger: 0.04, duration: 0.5, ease: "back.out(2)" }, 1.2)
        .from(".cr-chip", { scale: 0.4, opacity: 0, stagger: 0.15, duration: 0.8, ease: "back.out(1.7)" }, 1.1);
      ScrollTrigger.create({ trigger: ".ct-hero", start: "top top", end: "bottom 30%", onEnterBack: () => intro.restart() });
    });

    mm.add(
      { all: "(min-width: 0px)", lg: "(min-width: 1001px)", md: "(min-width: 601px) and (max-width: 1000px)", cols3: "(min-width: 761px)", stats4: "(min-width: 861px)" },
      (c) => {
        const { lg, md, cols3, stats4 } = c.conditions;
        const k = lg ? 1 : md ? 0.75 : 0.55; // motion strength per device class
        const par = (trigger, scrub = 0.8) => ({ trigger, start: "top bottom", end: "bottom top", scrub });

        /* ============ HERO: scroll-out + parallax ============ */
        const heroST = (end = "bottom top") => ({ trigger: ".ct-hero", start: "top top", end, scrub: 0.8 });
        gsap.to(".ct-hero-copy", { yPercent: -16, opacity: 0.1, ease: "none", scrollTrigger: heroST() });
        $(".ct-h1-m").forEach((el, i) => {
          const dir = i % 2 ? 1 : -1;
          gsap.to(el, { x: dir * (30 + i * 12) * k, y: -(30 + i * 14) * k, rotation: dir * 3 * k, ease: "none", scrollTrigger: heroST() });
        });
        gsap.to(".ct-hero-p", { x: -90 * k, ease: "none", scrollTrigger: heroST("75% top") });
        gsap.to(".ct-hero-cta", { x: 100 * k, ease: "none", scrollTrigger: heroST("75% top") });
        // the steel frame tips over in 3D as you leave the hero
        gsap.fromTo(".cr-frame", { rotationY: 0, rotationX: 0, scale: 1, transformPerspective: 900 },
          { rotationY: -42 * k, rotationX: 14 * k, scale: 1 + 0.28 * k, yPercent: -8, ease: "none", scrollTrigger: heroST() });
        $(".cr-chip").forEach((el, i) =>
          gsap.to(el, { x: (i % 2 ? 1 : -1) * 70 * k, y: -(90 + i * 70) * k, rotation: (i % 2 ? 1 : -1) * 6, ease: "none", scrollTrigger: heroST() }));
        gsap.to(".ct-blob.a", { y: 180 * k, x: -80 * k, ease: "none", scrollTrigger: heroST() });
        gsap.to(".ct-blob.b", { y: -140 * k, x: 90 * k, ease: "none", scrollTrigger: heroST() });
        gsap.to(".ct-scroll", { opacity: 0, y: 30, ease: "none", scrollTrigger: heroST("20% top") });

        /* ============ MARQUEE ============ */
        gsap.fromTo(".cr-mq.a .cr-mq-t", { xPercent: 0 }, { xPercent: -34, ease: "none", scrollTrigger: par(".cr-marq", true) });
        gsap.fromTo(".cr-mq.b .cr-mq-t", { xPercent: -34 }, { xPercent: 0, ease: "none", scrollTrigger: par(".cr-marq", true) });

        /* ============ STATS: counters count up and back down ============ */
        gsap.fromTo(".cr-stat-grid", { y: 60 * k }, { y: -40 * k, ease: "none", scrollTrigger: par(".cr-stats") });
        $(".cr-stat").forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, y: 90 * k, rotationX: -40, transformPerspective: 900 }, {
            opacity: 1, y: 0, rotationX: 0, duration: 1, delay: stats4 ? i * 0.1 : 0, ease: "power3.out",
            scrollTrigger: io(el, "top 92%", "bottom 8%"),
          });
          const b = el.querySelector("b");
          const o = { v: 0 };
          b.textContent = "0";
          gsap.to(o, {
            v: Number(b.dataset.to), duration: 1.8, ease: "power2.out",
            onUpdate: () => { b.textContent = Math.round(o.v).toLocaleString("en-US"); },
            scrollTrigger: io(el, "top 92%", "bottom 8%"),
          });
        });

        /* ============ STORY: clip-reveal photos, parallax inside them, words light up with the scroll ============ */
        $(".cr-ph").forEach((el, i) => {
          gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.out", scrollTrigger: io(el, "top 88%", "bottom 8%") });
          gsap.fromTo(el.querySelector("img"), { yPercent: -14 - i * 4, scale: 1.25 }, { yPercent: 14 + i * 4, scale: 1.25, ease: "none", scrollTrigger: par(el, true) });
        });
        gsap.fromTo(".cr-ph.a", { y: 70 * k }, { y: -70 * k, ease: "none", scrollTrigger: par(".cr-story") });
        gsap.fromTo(".cr-ph.b", { y: 190 * k }, { y: -120 * k, ease: "none", scrollTrigger: par(".cr-story") });
        gsap.fromTo(".cr-badge", { rotation: -14, y: 60 * k }, { rotation: 14, y: -100 * k, ease: "none", scrollTrigger: par(".cr-story") });
        gsap.fromTo(".cr-w", { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".cr-statement", start: "top 82%", end: "bottom 42%", scrub: true } });
        gsap.fromTo(".cr-story-copy > *:not(.cr-statement)", { y: 60 * k, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: io(".cr-story-copy", "top 80%", "bottom 15%"),
        });
        gsap.to(".cr-ghost2", { xPercent: -30, ease: "none", scrollTrigger: par(".cr-story") });

        /* ============ CULTURE: pinned horizontal run on desktop, flying cards below that ============ */
        gsap.fromTo(".cr-cult-head > *", { y: 50 * k, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: "power3.out", scrollTrigger: io(".cr-cult-head", "top 88%", "bottom 10%"),
        });
        if (lg) {
          const track = root.current.querySelector(".cr-track");
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
          const slide = gsap.to(track, {
            x: () => -dist(), ease: "none",
            scrollTrigger: { trigger: ".cr-cult", start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
          });
          gsap.to(".cr-prog i", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".cr-cult", start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true } });
          gsap.to(".cr-cult-bg", { backgroundPositionX: "-900px", ease: "none", scrollTrigger: { trigger: ".cr-cult", start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true } });
          $(".cr-pan").forEach((pan) => {
            gsap.fromTo(pan, { rotationY: 32, scale: 0.86, opacity: 0.3, transformPerspective: 1100 }, {
              rotationY: 0, scale: 1, opacity: 1, ease: "none",
              scrollTrigger: { trigger: pan, containerAnimation: slide, start: "left 96%", end: "left 48%", scrub: true },
            });
            gsap.fromTo(pan.querySelector(".num"), { xPercent: 45 }, {
              xPercent: -45, ease: "none",
              scrollTrigger: { trigger: pan, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
            });
            gsap.fromTo(pan.querySelectorAll("li"), { x: 80, opacity: 0 }, {
              x: 0, opacity: 1, stagger: 0.12, ease: "none",
              scrollTrigger: { trigger: pan, containerAnimation: slide, start: "left 85%", end: "left 40%", scrub: true },
            });
          });
        } else {
          $(".cr-pan").forEach((pan, i) => {
            gsap.fromTo(pan, { opacity: 0, x: (i % 2 ? 1 : -1) * 60, y: 60, rotationX: -18, transformPerspective: 900 }, {
              opacity: 1, x: 0, y: 0, rotationX: 0, duration: 1, ease: "power3.out", scrollTrigger: io(pan, "top 90%", "bottom 8%"),
            });
            gsap.fromTo(pan.querySelector(".num"), { y: 40 }, { y: -40, ease: "none", scrollTrigger: par(pan, 0.6) });
            gsap.fromTo(pan.querySelectorAll("li"), { x: 40, opacity: 0 }, {
              x: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power3.out", scrollTrigger: io(pan, "top 72%", "bottom 20%"),
            });
          });
        }

        /* ============ PROGRAMS ============ */
        gsap.fromTo(".cr-prog-sec .ct-head", { y: 50 * k }, { y: -30 * k, ease: "none", scrollTrigger: par(".cr-prog-sec") });
        gsap.fromTo(".cr-prog-sec .ct-head > *", { y: 40 * k, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: "power3.out", scrollTrigger: io(".cr-prog-sec .ct-head", "top 88%", "bottom 10%"),
        });
        gsap.fromTo(".ct-ch-grid", { y: 50 * k }, { y: -50 * k, ease: "none", scrollTrigger: par(".cr-prog-sec") });
        const from = [{ x: "-18vw", rotation: -6, rotationY: 30 }, { y: 130, rotationX: -30 }, { x: "18vw", rotation: 6, rotationY: -30 }];
        $(".ct-ch-card").forEach((el, i) => {
          const f = cols3 ? from[i] : { x: i % 2 ? 60 : -60, y: 40 };
          gsap.fromTo(el, { opacity: 0, scale: 1 - 0.18 * k, transformPerspective: 900, ...f }, {
            opacity: 1, scale: 1, x: 0, y: 0, rotation: 0, rotationX: 0, rotationY: 0,
            duration: 1.1, delay: cols3 ? i * 0.12 : 0, ease: "power3.out", scrollTrigger: io(el, "top 92%", "bottom 8%"),
          });
          gsap.fromTo(el.querySelector(".ic"), { y: 30 * k }, { y: -14 * k, ease: "none", scrollTrigger: par(el, 0.6) });
        });

        /* ============ WHAT WE BUILD ============ */
        gsap.fromTo(".cr-build-left > *", { x: -70 * k, opacity: 0 }, {
          x: 0, opacity: 1, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: io(".cr-build", "top 72%", "bottom 28%"),
        });
        gsap.to(".cr-ghost3", { xPercent: -34, ease: "none", scrollTrigger: par(".cr-build") });
        gsap.to(".cr-build .sh-ring", { rotation: (i) => (i % 2 ? -100 : 100), y: (i) => -90 * k * (i + 1), ease: "none", scrollTrigger: par(".cr-build") });
        $(".cr-row").forEach((el, i) => {
          gsap.fromTo(el, { opacity: 0, x: (i % 2 ? 1 : -1) * 18 * k + "vw", rotationY: (i % 2 ? -1 : 1) * 24, transformPerspective: 1000 }, {
            opacity: 1, x: 0, rotationY: 0, duration: 1.1, ease: "power3.out", scrollTrigger: io(el, "top 92%", "bottom 8%"),
          });
          gsap.fromTo(el.querySelector(".bar"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 88%", end: "top 45%", scrub: true } });
        });

        /* ============ CTA ============ */
        gsap.to(".cr-ghost4", { xPercent: -30, ease: "none", scrollTrigger: par(".cr-cta") });
        gsap.to(".cr-cta .cr-orb", { rotation: (i) => (i % 2 ? -160 : 160), scale: (i) => 1 + 0.2 * (i + 1), ease: "none", scrollTrigger: par(".cr-cta") });
        gsap.fromTo(".cr-cta-in > *", { y: 70 * k, opacity: 0, scale: 0.94 }, {
          y: 0, opacity: 1, scale: 1, stagger: 0.14, duration: 1, ease: "power3.out", scrollTrigger: io(".cr-cta", "top 65%", "bottom 20%"),
        });
        gsap.fromTo(".cr-cta-in", { y: 60 * k }, { y: -60 * k, ease: "none", scrollTrigger: par(".cr-cta") });

        /* ============ DEPTH MARKS: parallax in every section ============ */
        $(".ct-root .ct-sec, .ct-root .ct-hero").forEach((sec) => {
          const bits = sec.querySelectorAll(".sh-bit");
          if (!bits.length) return;
          gsap.to(bits, { y: (i, el) => -(Number(el.dataset.sp) || 0.5) * 300 * k, ease: "none", scrollTrigger: par(sec, true) });
        });
      }
    );
  });

  const toCulture = () => scrollToEl(lenisRef, root.current?.querySelector(".cr-cult"));
  const jobsBtn = (cls = "") => (
    <Link to={ROUTE_PATHS.JOB_OPENINGS} className={`ct-btn ${cls}`.trim()}>View job openings<i><FaArrowRight /></i></Link>
  );

  return (
    <div className="ct-root cr-root" ref={root}>
      <Cursor />

      {/* ============ 1. Hero ============ */}
      <header className="ct-hero">
        <SteelBits n={20} />
        <i className="ct-blob a" aria-hidden="true" />
        <i className="ct-blob b" aria-hidden="true" />

        <div className="cr-stage" aria-hidden="true">
          <svg className="cr-frame" viewBox="0 0 600 600">
            <g className="cr-g" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path className="cr-p" pathLength="1" d="M40 548H560" />
              <path className="cr-p" pathLength="1" d="M120 548V268M480 548V268" />
              <path className="cr-p" pathLength="1" d="M120 268L300 128L480 268" />
              <path className="cr-p" pathLength="1" d="M120 268H480M300 128V268" />
              <path className="cr-p thin" pathLength="1" d="M120 548L300 268L480 548" />
              <path className="cr-p thin" pathLength="1" d="M120 408L300 268L480 408" />
              <path className="cr-p ghost" pathLength="1" d="M172 548V300M428 548V300M172 300L300 200L428 300" />
              <path className="cr-p ghost" pathLength="1" d="M70 568H530M70 568L120 548M530 568L480 548" />
            </g>
            {[[120, 268], [300, 128], [480, 268], [300, 268], [120, 408], [480, 408], [120, 548], [480, 548]].map(([x, y]) => (
              <circle className="cr-bolt" key={`${x}-${y}`} cx={x} cy={y} r="7" />
            ))}
          </svg>
          {CHIPS.map(([a, b], i) => (
            <div className={`cr-chip c${i + 1}`} key={a}><strong>{a}</strong><span>{b}</span></div>
          ))}
        </div>

        <div className="ct-hero-copy">
          <span className="ct-tag">Careers &amp; work culture</span>
          <h1 className="ct-h1" aria-label={TITLE}>
            {TITLE.split(" ").map((w, i) => (
              <span className="ct-h1-m" key={i} aria-hidden="true">
                <span className={`ct-h1-w${HERO_HL.has(w) ? " hl" : ""}`}>{w}</span>
              </span>
            ))}
          </h1>
          <p className="ct-hero-p">{HERO_TEXT}</p>
          <div className="ct-hero-cta">
            {jobsBtn()}
            <button type="button" className="ct-btn ct-btn--ghost" onClick={toCulture}>Our culture</button>
          </div>
        </div>
        <div className="ct-scroll" aria-hidden="true"><i />Scroll</div>
      </header>

      {/* ============ 2. Marquee ============ */}
      <section className="cr-marq" aria-hidden="true">
        {["a", "b"].map((d) => (
          <div className={`cr-mq ${d}`} key={d}>
            <div className="cr-mq-t">
              {Array.from({ length: 3 }).flatMap((_, r) => MARQUEE.map((m) => <span key={`${r}-${m}`}>{m}<i /></span>))}
            </div>
          </div>
        ))}
      </section>

      {/* ============ 3. Numbers ============ */}
      <section className="ct-sec cr-stats" aria-label="DIY PreFab in numbers">
        <SteelBits n={14} />
        <div className="cr-stat-grid">
          {STATS.map(([v, s, l]) => (
            <div className="cr-stat" key={l}>
              <strong><b data-to={v}>{v.toLocaleString("en-US")}</b>{s}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 4. Story (light) ============ */}
      <section className="ct-sec cr-light cr-story" aria-label="Our people">
        <div className="ct-hex" aria-hidden="true" />
        <div className="ct-ghost cr-ghost2" aria-hidden="true">People</div>
        <SteelBits n={24} />
        <div className="cr-story-wrap">
          <div className="cr-photos" aria-hidden="true">
            <figure className="cr-ph a"><img src={ImagePath.WRB} alt="" loading="lazy" /></figure>
            <figure className="cr-ph b"><img src={ImagePath.ourService} alt="" loading="lazy" /></figure>
            <div className="cr-badge"><strong>7+</strong><span>Years of experience</span></div>
          </div>
          <div className="cr-story-copy">
            <span className="ct-tag">{STORY_TAG}</span>
            <h2 className="ct-h2">Cutting-edge expertise, <span className="hl">people first.</span></h2>
            <p className="ct-lead">{STORY_LEAD}</p>
            <p className="cr-statement" aria-label={STORY_STATEMENT}>{words(STORY_STATEMENT, "cr-w")}</p>
            <p className="ct-lead">{STORY_MORE}</p>
          </div>
        </div>
      </section>

      {/* ============ 5. Work culture: pinned horizontal run ============ */}
      <section className="ct-sec cr-cult" aria-label="Work culture">
        <div className="cr-cult-bg" aria-hidden="true" />
        <SteelBits n={16} />
        <div className="cr-cult-head">
          <span className="ct-tag">{CULTURE_HEAD}</span>
          <h2 className="ct-h2">Great work stems from a <span className="hl">great environment.</span></h2>
          <p className="ct-lead">{CULTURE_TEXT}</p>
        </div>
        <div className="cr-track">
          {PILLARS.map((p) => (
            <article className="cr-pan" key={p.n}>
              <span className="num" aria-hidden="true">{p.n}</span>
              <h3>{p.t}</h3>
              <p>{p.lead}</p>
              <ul>{p.pts.map((t) => <li key={t}>{t}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="cr-prog" aria-hidden="true"><i /></div>
      </section>

      {/* ============ 6. Programs ============ */}
      <section className="ct-sec ct-ch cr-prog-sec" aria-label="Programs for talent">
        <SteelBits n={14} />
        <div className="ct-head">
          <span className="ct-tag">Early careers</span>
          <h2 className="ct-h2">{PROGRAMS_TITLE}</h2>
        </div>
        <div className="ct-ch-grid">
          {PROGRAMS.map((c) => (
            <article key={c.id} className="ct-ch-card" onMouseMove={spot}>
              <span className="ic"><c.Icon aria-hidden="true" /></span>
              <h3>{c.label}</h3>
              <p>{c.value}</p>
              <span className="cr-txt">{c.text}</span>
              <span className="go">{c.action}<FaArrowRight aria-hidden="true" /></span>
            </article>
          ))}
        </div>
      </section>

      {/* ============ 7. What we build (light) ============ */}
      <section className="ct-sec cr-light cr-build" aria-label="Who we are">
        <div className="ct-hex" aria-hidden="true" />
        <div className="ct-rings" aria-hidden="true">
          <i className="sh-ring" style={{ width: "46vmax", height: "46vmax", left: "-16vmax", top: "-12vmax" }} />
          <i className="sh-ring" style={{ width: "28vmax", height: "28vmax", right: "-8vmax", bottom: "-8vmax" }} />
        </div>
        <div className="ct-ghost cr-ghost3" aria-hidden="true">Build</div>
        <SteelBits n={22} />
        <div className="cr-build-wrap">
          <div className="cr-build-left">
            <span className="ct-tag">{BUILD_TAG}</span>
            <h2 className="ct-h2">{BUILD_TITLE}</h2>
            <p className="ct-lead">{BUILD_TEXT}</p>
          </div>
          <ol className="cr-rows">
            {BUILD.map((b, i) => (
              <li className="cr-row" key={b}>
                <em>{String(i + 1).padStart(2, "0")}</em>
                <span>{b}</span>
                <i className="bar" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ 8. CTA -> Job openings ============ */}
      <section className="ct-sec cr-cta" aria-label="Job openings">
        <div className="cr-orb o1" aria-hidden="true" /><div className="cr-orb o2" aria-hidden="true" />
        <div className="ct-ghost cr-ghost4" aria-hidden="true">Careers</div>
        <SteelBits n={20} />
        <div className="cr-cta-in">
          <span className="ct-tag">Join the team</span>
          <h2 className="ct-h2">{CTA_TITLE}</h2>
          <p className="ct-hero-p">{CTA_TEXT}</p>
          {jobsBtn()}
        </div>
      </section>
    </div>
  );
}
