import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { FaArrowRight, FaBuilding, FaGraduationCap, FaHome, FaHospital, FaIndustry } from "react-icons/fa";
import ROUTE_PATHS from "../../routes/RoutePath";
import SteelBits from "../home3d/SteelBits";
import Cursor from "../home3d/Cursor";
import SectorScenes from "./SectorScenes";
import { HERO_TITLE, HERO_HL, HERO_TEXT, SECTORS, CORE, CTA_TITLE, CTA_TEXT, RESPECT_REDUCED_MOTION } from "./appData";
import "../home3d/home3d.css";
import "../home3d/home3d-v4.css";
import "../home3d/home3d-v5.css";
import "../careers3d/careers3d.css"; // shared base: buttons, headline, hero, marquee, CTA
import "./app3d.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const ICONS = { home: FaHome, building: FaBuilding, industry: FaIndustry, school: FaGraduationCap, hospital: FaHospital };
const N = SECTORS.length;

// Local helpers keep this page self-contained.
const pad2 = (value) => String(value).padStart(2, "0");

const io = (trigger, start, end) => ({
  trigger,
  start,
  end,
  toggleActions: "play none none reverse",
});

const tiltMove = (event) => {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const rotateX = (0.5 - y) * 8;
  const rotateY = (x - 0.5) * 8;

  element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};

const tiltLeave = (event) => {
  event.currentTarget.style.transform = "";
};
const nodePos = (i) => {
  const a = ((-90 + i * (360 / N)) * Math.PI) / 180;
  return { x: 50 + 40 * Math.cos(a), y: 50 + 40 * Math.sin(a) };
};

function Split({ text, hl, className, tag: Tag = "span" }) {
  return (
    <Tag className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span className="cr-m" key={i} aria-hidden="true">
          <span className={`cr-w${hl?.has(w) ? " hl" : ""}`}>
            {[...w].map((c, j) => <span className="cr-c" key={j}>{c}</span>)}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export default function AppSections() {
  const root = useRef(null);
  const lenisRef = useRef(null);
  const stRef = useRef(null);

  // jump to a sector chapter inside the pinned scene
  const goTo = (i) => {
    const st = stRef.current;
    if (!st) { root.current?.querySelector(".ap-stage")?.scrollIntoView({ behavior: "smooth" }); return; }
    const y = st.start + ((i + 0.72) / N) * (st.end - st.start);
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const reduce = RESPECT_REDUCED_MOTION && matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("cr-3d");
    document.body.classList.toggle("cr-reduce", reduce);

    let lenis, tick;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1, syncTouch: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    /* ---------- hero intro (plays on load and whenever you scroll back to the top) ---------- */
    const ctx = gsap.context(() => {
      if (reduce) return;
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        onStart: () => gsap.set(".ap-hero .cr-m", { overflow: "hidden" }),
      })
        .from(".ap-hero .cr-tag", { opacity: 0, y: -14, duration: 0.6 }, 0)
        .from(".ap-hero .cr-c", {
          yPercent: 120, rotationX: -80, opacity: 0, stagger: 0.025, duration: 0.9, transformOrigin: "50% 100%",
          onComplete: () => gsap.set(".ap-hero .cr-m", { overflow: "visible" }),
        }, 0.1)
        .from(".ap-hero-p, .ap-hero .cr-hero-cta > *", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, clearProps: "opacity,transform" }, 0.9)
        .from(".ap-tilt", { scale: 0.35, opacity: 0, duration: 1.3 }, 0.2)
        .fromTo(".ap-lines path", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.12, duration: 1.2, ease: "power2.inOut" }, 0.6)
        .from(".ap-node", { opacity: 0, stagger: 0.14, duration: 0.8, ease: "power2.out" }, 0.8);
      ScrollTrigger.create({ trigger: ".ap-hero", start: "top top", end: "bottom 30%", onEnterBack: () => intro.restart() });
    }, root);

    const mm = gsap.matchMedia(root.current);
    if (!reduce) {
      mm.add(
        { all: "(min-width: 0px)", lg: "(min-width: 1001px)", md: "(min-width: 601px) and (max-width: 1000px)", wide: "(min-width: 861px)" },
        (c) => {
          const { lg, md, wide } = c.conditions;
          const k = lg ? 1 : md ? 0.75 : 0.55;
          const $ = (s) => gsap.utils.toArray(s);
          const vh = () => window.innerHeight;
          const par = (trigger, scrub = 0.8) => ({ trigger, start: "top bottom", end: "bottom top", scrub });
          const heroST = (end = "bottom top") => ({ trigger: ".ap-hero", start: "top top", end, scrub: 0.8 });
          const cleanups = [];

          gsap.to(".cr-progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

          /* ============ HERO ============ */
          gsap.to(".ap-hero-copy", { yPercent: -10, opacity: 0.15, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ap-const", { yPercent: 8, scale: 1 + 0.08 * k, rotation: 18 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".ap-ring", { rotation: (i) => (i % 2 ? -1 : 1) * 90 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".cr-blob.a", { y: 120 * k, x: -50 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".cr-blob.b", { y: -100 * k, x: 60 * k, ease: "none", scrollTrigger: heroST() });
          gsap.to(".cr-scroll", { opacity: 0, y: 30, ease: "none", scrollTrigger: heroST("20% top") });
          if (matchMedia("(pointer: fine)").matches) {
            const tx = gsap.quickTo(".ap-tilt", "rotationY", { duration: 1, ease: "power3.out" });
            const ty = gsap.quickTo(".ap-tilt", "rotationX", { duration: 1, ease: "power3.out" });
            const move = (e) => { tx((e.clientX / innerWidth - 0.5) * 26); ty(-(e.clientY / innerHeight - 0.5) * 20); };
            window.addEventListener("pointermove", move);
            cleanups.push(() => window.removeEventListener("pointermove", move));
          }

          /* ============ STAGE: one pinned scene, five sectors built one after another ============ */
          const stage = root.current.querySelector(".ap-stage");
          const scenes = $(".sc-g");
          const panels = $(".ap-panel");
          const dots = $(".ap-dot");
          const count = root.current.querySelector(".ap-count b");
          const idx = root.current.querySelector(".ap-idx");
          const ghost = root.current.querySelector(".ap-ghost");
                    gsap.set(".s-ground, .s-d", { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(".s-hatch, .s-w, .s-a, .s-sm", { opacity: 0 });
          gsap.set(".s-r", { scaleY: 0, transformOrigin: "50% 100%" });
          gsap.set(".ap-bar i", { scaleX: 0 });
          gsap.set(panels, { opacity: 0, y: 40 });
          gsap.set(panels[0], { opacity: 1, y: 0 });
          gsap.set(".ap-panel .ap-uses span", { opacity: 0, y: 14 });
          gsap.set(panels[0].querySelectorAll(".ap-uses span"), { opacity: 1, y: 0 });

          let cur = -1;
          const setStage = (i) => {
            if (i === cur) return;
            cur = i;
            if (count) count.textContent = pad2(i + 1);
            panels.forEach((p, j) => p.classList.toggle("on", j === i));
            dots.forEach((d, j) => { d.classList.toggle("on", j <= i); d.classList.toggle("cur", j === i); });
            if (idx) { idx.textContent = pad2(i + 1); gsap.fromTo(idx, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out", overwrite: true }); }
            if (ghost) { ghost.textContent = SECTORS[i].short; gsap.fromTo(ghost, { xPercent: 8, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", overwrite: true }); }
          };
          setStage(0);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${vh() * (lg ? 6.4 : 4.8)}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
            onUpdate: () => setStage(Math.max(0, Math.min(N - 1, Math.floor(tl.time() + 0.1)))),
          });
          stRef.current = tl.scrollTrigger;
          tl.to(".s-ground", { strokeDashoffset: 0, duration: 0.3 }, 0)
            .to(".s-hatch", { opacity: 1, duration: 0.3 }, 0.1)
            .to(".ap-bar i", { scaleX: 1, duration: N }, 0);
          SECTORS.forEach((s, i) => {
            const sc = scenes[i];
            const q = gsap.utils.selector(sc);
            const t = i;
            if (i > 0) {
              tl.fromTo(".s-halo", { scale: 0.7 }, { scale: 1.05, duration: 0.9, immediateRender: false }, t);
            } else {
              tl.fromTo(".s-halo", { scale: 0.7 }, { scale: 1.05, duration: 0.9 }, 0);
            }
            tl.to(q(".s-r"), { scaleY: 1, stagger: { amount: 0.36 }, duration: 0.3, ease: "power2.out" }, t + 0.04)
              .to(q(".s-d"), { strokeDashoffset: 0, stagger: { amount: 0.2 }, duration: 0.25 }, t + 0.2)
              .to(q(".s-w"), { opacity: 1, stagger: { amount: 0.16 }, duration: 0.12 }, t + 0.5)
              .to(q(".s-a, .s-sm"), { opacity: 1, stagger: 0.04, duration: 0.15 }, t + 0.58);
            if (i < N - 1) tl.to(sc, { opacity: 0, y: 34, duration: 0.12 }, t + 0.88);
            // text panel swap
            if (i > 0) {
              tl.to(panels[i - 1], { opacity: 0, y: -40, duration: 0.18 }, t - 0.1)
                .fromTo(panels[i], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", immediateRender: false }, t + 0.04)
                .fromTo(panels[i].querySelectorAll(".ap-uses span"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.15, immediateRender: false }, t + 0.25);
            }
          });
          tl.to({}, { duration: 0.0001 }, N);
          // the whole stage leans through the scroll (3D) and the numerals/ghost drift (parallax)
          gsap.fromTo(".ap-art-tilt", { rotationY: -14, rotationX: 5, transformPerspective: 1200 }, {
            rotationY: 14, rotationX: -3, ease: "none",
            scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${vh() * (lg ? 6.4 : 4.8)}`, scrub: true },
          });
          gsap.fromTo(".ap-idx", { x: -30 }, { x: 40, ease: "none", scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${vh() * (lg ? 6.4 : 4.8)}`, scrub: true } });
          gsap.fromTo(".ap-ghost-wrap", { x: "4vw" }, { x: "-14vw", ease: "none", scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${vh() * (lg ? 6.4 : 4.8)}`, scrub: true } });
          cleanups.push(() => { stRef.current = null; });

          /* ============ CORE: four flipping cards with a staggered parallax ============ */
          gsap.fromTo(".ap-core-head > *", { y: 60 * k, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: "power3.out", scrollTrigger: io(".ap-core-head", "top 88%", "bottom 10%") });
          const coreFrom = [{ x: "-14vw", rotationY: 30 }, { y: 110, rotationX: -24 }, { y: 110, rotationX: -24 }, { x: "14vw", rotationY: -30 }];
          $(".ap-core-card").forEach((el, i) => {
            const f = wide ? coreFrom[i % 4] : { x: i % 2 ? 50 : -50, y: 50 };
            gsap.fromTo(el, { opacity: 0, scale: 1 - 0.16 * k, transformPerspective: 1000, ...f }, {
              opacity: 1, scale: 1, x: 0, y: 0, rotationX: 0, rotationY: 0, duration: 1, delay: wide ? i * 0.1 : 0, ease: "power3.out",
              scrollTrigger: io(el, "top 90%", "bottom 8%"),
            });
            gsap.fromTo(el.querySelector(".ap-core-n"), { y: 40 * k }, { y: -40 * k, ease: "none", scrollTrigger: par(el) });
          });
          gsap.to(".ap-core-grid", { y: (i) => (i ? 0 : -40 * k), ease: "none", scrollTrigger: par(".ap-shared") });

          /* ============ MARQUEE ============ */
          const rows = $(".cr-mq-row");
          const tweens = rows.map((row, i) => gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 36, ease: "none", repeat: -1 }));
          const mq = { s: 1, k: 0, ts: 1, tk: 0 };
          if (lenis) {
            const onScroll = ({ velocity }) => { mq.ts = 1 + Math.min(Math.abs(velocity) / 2, 5); };
            lenis.on("scroll", onScroll);
            cleanups.push(() => lenis.off?.("scroll", onScroll));
          }
          const mqTick = () => {
            mq.ts += (1 - mq.ts) * 0.05;
            mq.s += (mq.ts - mq.s) * 0.15;
            tweens.forEach((t) => t.timeScale(mq.s));
          };
          gsap.ticker.add(mqTick);
          cleanups.push(() => { gsap.ticker.remove(mqTick); tweens.forEach((t) => t.kill()); });

          /* ============ CTA ============ */
          gsap.from(".ap-cta .cr-cta-h .cr-c", { yPercent: 115, rotationX: -80, opacity: 0, stagger: 0.03, duration: 0.9, transformOrigin: "50% 100%", ease: "power3.out", scrollTrigger: io(".ap-cta", "top 60%", "bottom 15%") });
          gsap.from(".ap-cta .cr-cta-p, .ap-cta .cr-btn", { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: "back.out(1.6)", clearProps: "opacity,transform", scrollTrigger: io(".ap-cta", "top 45%", "bottom 15%") });
          gsap.fromTo(".ap-cta .cr-cta-in", { scale: 0.82 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".ap-cta", start: "top bottom", end: "center center", scrub: true } });
          $(".ap-cta .cr-cta-rings i").forEach((el, i) => gsap.to(el, { rotation: (i % 2 ? -1 : 1) * (120 + i * 60), scale: 1 + i * 0.1, ease: "none", scrollTrigger: par(".ap-cta") }));

          /* ============ depth marks everywhere ============ */
          $(".cr-root .cr-sec, .cr-root .ap-hero").forEach((sec) => {
            const bits = sec.querySelectorAll(".sh-bit");
            if (!bits.length) return;
            gsap.to(bits, { y: (i, el) => -(Number(el.dataset.sp) || 0.5) * 300 * k, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true } });
          });

          return () => cleanups.forEach((fn) => fn());
        }
      );
    }

    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(t);
      mm.revert();
      ctx.revert();
      document.body.classList.remove("cr-3d", "cr-reduce");
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  const marquee = (items, key) => {
    const half = [...items, ...items];
    return (
      <div className="cr-mq-row" key={key}>
        {[0, 1].map((n) => (
          <div className="cr-mq-half" key={n}>
            {half.map((t, i) => <span key={i}>{t}<i aria-hidden="true" /></span>)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="cr-root ap-root" ref={root}>
      <Cursor />
      <i className="cr-progress" aria-hidden="true" />

      {/* ============ 1. Hero: five sectors orbiting one system ============ */}
      <header className="cr-hero ap-hero">
        <SteelBits n={10} />
        <i className="cr-blob a" aria-hidden="true" />
        <i className="cr-blob b" aria-hidden="true" />

        <div className="ap-const">
          <div className="ap-tilt">
            <i className="ap-ring r1" aria-hidden="true" /><i className="ap-ring r2" aria-hidden="true" /><i className="ap-ring r3" aria-hidden="true" />
            <svg className="ap-lines" viewBox="0 0 100 100" aria-hidden="true">
              <path pathLength="1" d={SECTORS.map((_, i) => { const p = nodePos(i); return `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`; }).join("") + "Z"} />
              {SECTORS.map((_, i) => { const p = nodePos(i); return <path key={i} pathLength="1" d={`M50 50L${p.x.toFixed(1)} ${p.y.toFixed(1)}`} />; })}
            </svg>
            <div className="ap-core"><strong>{N}</strong><span>sectors</span></div>
            {SECTORS.map((s, i) => {
              const p = nodePos(i);
              const Icon = ICONS[s.icon];
              return (
                <button type="button" className="ap-node" key={s.id} style={{ left: `${p.x}%`, top: `${p.y}%`, "--c": s.color, "--z": `${24 + (i % 2) * 24}px`, "--d": `${i * 0.7}s` }} onClick={() => goTo(i)} data-cursor="Jump" aria-label={`Jump to ${s.name}`}>
                  <span className="ap-node-in"><i><Icon aria-hidden="true" /></i><b>{s.name}</b></span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="cr-hero-copy ap-hero-copy">
          <span className="cr-tag">Applications</span>
          <Split text={HERO_TITLE} hl={HERO_HL} className="cr-h1" tag="h1" />
          <p className="cr-hero-p ap-hero-p">{HERO_TEXT}</p>
          <div className="cr-hero-cta">
            <button type="button" className="cr-btn" onClick={() => goTo(0)} data-mag>Explore the sectors<i><FaArrowRight aria-hidden="true" /></i></button>
            <Link to={ROUTE_PATHS.CONTACT_US} className="cr-btn cr-btn--ghost">Talk to us</Link>
          </div>
        </div>
        <div className="cr-scroll" aria-hidden="true"><i />Scroll</div>
      </header>

      {/* ============ 2. Pinned stage: each sector is built in turn ============ */}
      <section className="cr-sec ap-stage" aria-label="Sectors we build for">
        <SteelBits n={8} />
        <div className="ap-ghost-wrap" aria-hidden="true"><div className="ap-ghost">{SECTORS[0].short}</div></div>
        <div className="ap-stage-grid">
          <div className="ap-copy">
            <span className="cr-tag">The five sectors</span>
            <div className="ap-panels">
              {SECTORS.map((s, i) => (
                <article className={`ap-panel${i === 0 ? " on" : ""}`} key={s.id} aria-label={s.name}>
                  <span className="ap-part">{pad2(i + 1)} · {s.short}</span>
                  <h2>{s.name}</h2>
                  <p className="ap-tag">{s.tagline}</p>
                  <p className="ap-text">{s.text}</p>
                  <ul>{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  <div className="ap-uses">{s.uses.map((u) => <span key={u}>{u}</span>)}</div>
                  <Link to={s.route} className="ap-link" data-mag>Explore {s.name}<i><FaArrowRight aria-hidden="true" /></i></Link>
                </article>
              ))}
            </div>
            <div className="ap-rail">
              <span className="ap-count"><b>01</b> / {pad2(N)}</span>
              <div className="ap-bar" aria-hidden="true"><i /></div>
              <div className="ap-dots">
                {SECTORS.map((s, i) => (
                  <button type="button" className="ap-dot" key={s.id} onClick={() => goTo(i)} aria-label={`Go to ${s.name}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="ap-art">
            <div className="ap-idx" aria-hidden="true">01</div>
            <div className="ap-art-tilt"><SectorScenes /></div>
          </div>
        </div>
      </section>

      {/* ============ 3. The shared engineering core ============ */}
      <section className="cr-sec ap-shared" aria-label="What every sector shares">
        <SteelBits n={8} />
        <div className="ap-core-head">
          <span className="cr-tag">Under every sector</span>
          <h2 className="cr-h2">One engineering core, <span className="hl">five ways to use it.</span></h2>
        </div>
        <div className="ap-core-grid">
          {CORE.map((c) => (
            <article className="ap-core-card" key={c.n}>
              <div className="ap-core-in" onMouseMove={tiltMove} onMouseLeave={tiltLeave}>
                <span className="ap-core-n" aria-hidden="true">{c.n}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============ 4. Marquee ============ */}
      <section className="cr-mq" aria-hidden="true">
        {marquee(SECTORS.map((s) => s.name), "a")}
        {marquee(SECTORS.map((s) => s.short), "b")}
      </section>

      {/* ============ 5. CTA ============ */}
      <section className="cr-sec cr-cta ap-cta" aria-label="Contact us">
        <SteelBits n={10} />
        <div className="cr-cta-rings" aria-hidden="true"><i /><i /><i /></div>
        <div className="cr-cta-in">
          <span className="cr-tag">Start a project</span>
          <Split text={CTA_TITLE} className="cr-cta-h" tag="h2" />
          <p className="cr-cta-p">{CTA_TEXT}</p>
          <div className="ap-cta-btns">
            <Link to={ROUTE_PATHS.CONTACT_US} className="cr-btn" data-mag>Contact us<i><FaArrowRight aria-hidden="true" /></i></Link>
            <Link to={ROUTE_PATHS.PROJECT_CASE_STUDIES} className="cr-btn cr-btn--ghost">See our projects</Link>
          </div>
        </div>
      </section>
    </div>
  );
}