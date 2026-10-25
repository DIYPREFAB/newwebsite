import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowRight, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import SteelBits from "../home3d/SteelBits";
import Cursor from "../home3d/Cursor";
import ROUTE_PATHS from "../../routes/RoutePath";
import useScrollStage, { scrollToEl, isReduced } from "./useScrollStage";
import { JOB_TITLE, JOB_HL, JOB_TEXT, CATEGORIES, LOCATIONS, JOBS, APPLY_EMAIL } from "./careersData";
import "../home3d/home3d.css";
import "../home3d/home3d-v4.css";
import "../home3d/home3d-v5.css";
import "../contact3d/contact3d.css";
import "./careers3d.css";

const BOTH = "play reverse play reverse";
const io = (trigger, start = "top 90%", end = "bottom 10%") => ({ trigger, start, end, toggleActions: BOTH });
// opens a Gmail compose window addressed to the hiring inbox
const apply = (j) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(APPLY_EMAIL)}&su=${encodeURIComponent(`Application for ${j.title} - ${j.location}`)}`;

export default function JobSections() {
  const root = useRef(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [loc, setLoc] = useState("");

  const visible = useMemo(() => {
    const t = q.trim().toLowerCase();
    return JOBS.filter((j) =>
      (!t || j.title.toLowerCase().includes(t)) &&
      (!cat || j.category === cat) &&
      (!loc || j.location.toLowerCase().includes(loc.toLowerCase())));
  }, [q, cat, loc]);
  const key = visible.map((j) => j.id).join("-");
  const filtered = q || cat || loc;
  const reset = () => { setQ(""); setCat(""); setLoc(""); };

  const lenisRef = useScrollStage(root, ({ reduce, ctx, mm }) => {
    if (reduce) return;
    const $ = gsap.utils.toArray;

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
        .from(".ct-hero-p, .ct-hero-cta > *", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8 }, 0.7)
        .from(".cr-o", { scale: 0.3, opacity: 0, stagger: 0.12, duration: 1.3 }, 0.2)
        .from(".cr-count", { scale: 0.6, opacity: 0, duration: 1, ease: "back.out(1.6)" }, 0.5);
      ScrollTrigger.create({ trigger: ".ct-hero", start: "top top", end: "bottom 30%", onEnterBack: () => intro.restart() });
    });

    mm.add({ all: "(min-width: 0px)", lg: "(min-width: 1001px)", md: "(min-width: 601px) and (max-width: 1000px)" }, (c) => {
      const { lg, md } = c.conditions;
      const k = lg ? 1 : md ? 0.75 : 0.55;
      const par = (trigger, scrub = 0.8) => ({ trigger, start: "top bottom", end: "bottom top", scrub });
      const heroST = (end = "bottom top") => ({ trigger: ".ct-hero", start: "top top", end, scrub: 0.8 });

      /* HERO */
      gsap.to(".ct-hero-copy", { yPercent: -16, opacity: 0.1, ease: "none", scrollTrigger: heroST() });
      $(".ct-h1-m").forEach((el, i) => {
        const dir = i % 2 ? 1 : -1;
        gsap.to(el, { x: dir * (30 + i * 12) * k, y: -(30 + i * 14) * k, rotation: dir * 3 * k, ease: "none", scrollTrigger: heroST() });
      });
      gsap.to(".ct-hero-p", { x: -90 * k, ease: "none", scrollTrigger: heroST("75% top") });
      gsap.to(".ct-hero-cta", { x: 100 * k, ease: "none", scrollTrigger: heroST("75% top") });
      $(".cr-o").forEach((el, i) => gsap.to(el, { rotation: (i % 2 ? -1 : 1) * (80 + i * 50), scale: 1 + 0.1 * (i + 1) * k, ease: "none", scrollTrigger: heroST() }));
      gsap.to(".cr-count", { yPercent: -30, xPercent: 12, rotation: 8 * k, scale: 1 + 0.35 * k, ease: "none", scrollTrigger: heroST() });
      gsap.to(".ct-blob.a", { y: 180 * k, x: -80 * k, ease: "none", scrollTrigger: heroST() });
      gsap.to(".ct-blob.b", { y: -140 * k, x: 90 * k, ease: "none", scrollTrigger: heroST() });
      gsap.to(".ct-scroll", { opacity: 0, y: 30, ease: "none", scrollTrigger: heroST("20% top") });

      /* LIST SECTION */
      gsap.to(".cr-list .ct-ghost", { xPercent: -34, ease: "none", scrollTrigger: par(".cr-list") });
      gsap.to(".cr-list .ct-hex", { backgroundPositionY: `${-460 * k}px`, ease: "none", scrollTrigger: par(".cr-list") });
      gsap.to(".cr-list .sh-ring", { rotation: (i) => (i % 2 ? -100 : 100), y: (i) => -90 * k * (i + 1), ease: "none", scrollTrigger: par(".cr-list") });
      gsap.fromTo(".cr-filter", { y: 110 * k, rotationX: -14, opacity: 0, transformPerspective: 1200 }, {
        y: 0, rotationX: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: io(".cr-filter", "top 92%", "bottom 8%"),
      });
      gsap.fromTo(".cr-list-head > *", { x: -70 * k, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.12, duration: 1, ease: "power3.out", scrollTrigger: io(".cr-list-head", "top 88%", "bottom 10%"),
      });

      /* CLOSING */
      gsap.to(".cr-cta .ct-ghost", { xPercent: -30, ease: "none", scrollTrigger: par(".cr-cta") });
      gsap.to(".cr-cta .cr-orb", { rotation: (i) => (i % 2 ? -160 : 160), scale: (i) => 1 + 0.2 * (i + 1), ease: "none", scrollTrigger: par(".cr-cta") });
      gsap.fromTo(".cr-cta-in > *", { y: 70 * k, opacity: 0, scale: 0.94 }, {
        y: 0, opacity: 1, scale: 1, stagger: 0.14, duration: 1, ease: "power3.out", scrollTrigger: io(".cr-cta", "top 65%", "bottom 20%"),
      });
      gsap.fromTo(".cr-cta-in", { y: 60 * k }, { y: -60 * k, ease: "none", scrollTrigger: par(".cr-cta") });

      $(".ct-root .ct-sec, .ct-root .ct-hero").forEach((sec) => {
        const bits = sec.querySelectorAll(".sh-bit");
        if (!bits.length) return;
        gsap.to(bits, { y: (i, el) => -(Number(el.dataset.sp) || 0.5) * 300 * k, ease: "none", scrollTrigger: par(sec, true) });
      });
    });
  });

  // job cards: fly in from alternating sides, every time they enter; rebuilt whenever the filter changes the list
  useEffect(() => {
    if (isReduced() || !root.current) return undefined;
    const k = innerWidth > 1000 ? 1 : innerWidth > 600 ? 0.75 : 0.55;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".cr-job").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, x: (i % 2 ? 1 : -1) * 90 * k, rotationX: -18, scale: 0.94, transformPerspective: 1000 }, {
          opacity: 1, x: 0, rotationX: 0, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: io(el, "top 94%", "bottom 6%"),
        });
        gsap.fromTo(el.querySelector(".n"), { y: 26 * k }, { y: -18 * k, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
      if (root.current.querySelector(".cr-empty")) gsap.fromTo(".cr-empty", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [key]);

  return (
    <div className="ct-root cr-root" ref={root}>
      <Cursor />

      {/* ============ 1. Hero ============ */}
      <header className="ct-hero cr-jhero">
        <SteelBits n={20} />
        <i className="ct-blob a" aria-hidden="true" />
        <i className="ct-blob b" aria-hidden="true" />
        <div className="cr-orbit" aria-hidden="true">
          <i className="cr-o o1" /><i className="cr-o o2" /><i className="cr-o o3" />
          <div className="cr-count"><strong>{String(JOBS.length).padStart(2, "0")}</strong><span>Open roles</span></div>
        </div>
        <div className="ct-hero-copy">
          <span className="ct-tag">Job openings</span>
          <h1 className="ct-h1" aria-label={JOB_TITLE}>
            {JOB_TITLE.split(" ").map((w, i) => (
              <span className="ct-h1-m" key={i} aria-hidden="true">
                <span className={`ct-h1-w${JOB_HL.has(w) ? " hl" : ""}`}>{w}</span>
              </span>
            ))}
          </h1>
          <p className="ct-hero-p">{JOB_TEXT}</p>
          <div className="ct-hero-cta">
            <button type="button" className="ct-btn" onClick={() => scrollToEl(lenisRef, root.current?.querySelector(".cr-list"))}>Browse roles<i><FaArrowRight /></i></button>
            <Link to={ROUTE_PATHS.CAREERS} className="ct-btn ct-btn--ghost">Our culture</Link>
          </div>
        </div>
        <div className="ct-scroll" aria-hidden="true"><i />Scroll</div>
      </header>

      {/* ============ 2. Filters + listings (light) ============ */}
      <section className="ct-sec cr-light cr-list" aria-label="Open positions">
        <div className="ct-hex" aria-hidden="true" />
        <div className="ct-rings" aria-hidden="true">
          <i className="sh-ring" style={{ width: "46vmax", height: "46vmax", left: "-16vmax", top: "-12vmax" }} />
          <i className="sh-ring" style={{ width: "28vmax", height: "28vmax", right: "-8vmax", bottom: "-8vmax" }} />
        </div>
        <div className="ct-ghost" aria-hidden="true">Careers</div>
        <SteelBits n={26} />

        <div className="cr-list-wrap">
          <div className="cr-list-head">
            <span className="ct-tag">Open Job Positions</span>
            <h2 className="ct-h2">Find the role that <span className="hl">fits you.</span></h2>
          </div>

          <div className="cr-filter" role="search">
            <label className="cr-f"><span>Job Title</span>
              <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Enter Job Title" />
            </label>
            <label className="cr-f"><span>Select Category</span>
              <select value={cat} onChange={(e) => setCat(e.target.value)}>
                <option value="">All categories</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="cr-f"><span>Select Location</span>
              <select value={loc} onChange={(e) => setLoc(e.target.value)}>
                <option value="">All locations</option>
                {LOCATIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            {filtered ? <button type="button" className="cr-reset" onClick={reset}>Reset</button> : null}
          </div>

          <div className="cr-jobs" aria-live="polite">
            {visible.map((j, i) => (
              <article className="cr-job" key={j.id}>
                <span className="n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="main">
                  <h3>{j.title}</h3>
                  <ul>
                    <li><FaBriefcase aria-hidden="true" />{j.company}</li>
                    <li><FaMapMarkerAlt aria-hidden="true" />{j.location}</li>
                  </ul>
                </div>
                <div className="meta">
                  <p>Posted on: {j.postedOn}</p>
                  <p><strong>No of vacancies: </strong>{j.vacancies}</p>
                </div>
                <a className="ct-btn" href={apply(j)} target="_blank" rel="noopener noreferrer">Apply Now<i><FaArrowRight /></i></a>
              </article>
            ))}
            {!visible.length && (
              <div className="cr-empty">
                {JOBS.length === 0 ? (
                  <>
                    <h3>Currently we don&rsquo;t have any openings</h3>
                    <p>New positions will be posted here as soon as they open. Please check back soon.</p>
                  </>
                ) : (
                  <>
                    <h3>No open positions match your filters</h3>
                    <p>Try a different title, category or location.</p>
                    <button type="button" className="ct-btn" onClick={reset}>Clear filters<i><FaArrowRight /></i></button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ 3. Closing ============ */}
      <section className="ct-sec cr-cta" aria-label="Learn about our culture">
        <div className="cr-orb o1" aria-hidden="true" /><div className="cr-orb o2" aria-hidden="true" />
        <div className="ct-ghost" aria-hidden="true">Join us</div>
        <SteelBits n={18} />
        <div className="cr-cta-in">
          <span className="ct-tag">Not sure yet?</span>
          <h2 className="ct-h2">See what it is like to <span className="hl">work with us.</span></h2>
          <p className="ct-hero-p">Our values, our team and the way we grow people.</p>
          <Link to={ROUTE_PATHS.CAREERS} className="ct-btn">Our work culture<i><FaArrowRight /></i></Link>
        </div>
      </section>
    </div>
  );
}
