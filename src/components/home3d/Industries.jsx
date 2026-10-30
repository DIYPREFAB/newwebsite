import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ROUTE_PATHS from "../../routes/RoutePath";
import { glassState } from "./GlassCore"; // shared scroll-progress object (also read by the Key Benefits hero)
import IndustryStage, { INDUSTRY_DATA } from "./IndustryDial";
import "./industries.css";

gsap.registerPlugin(ScrollTrigger);

const N = INDUSTRY_DATA.length;

/**
 * Industries: a pinned two-column section. The list of industries sits on the left, the blueprint stage on the right.
 * Scrolling steps through the five industries (class toggles only, no React state per frame) while the stage tilts in 3D.
 */
export function animateIndustries() {
  const sec = document.querySelector(".ix");
  if (!sec) return;
  glassState.p = 0;

  const rows = gsap.utils.toArray(".ix-row", sec);
  const scenes = gsap.utils.toArray(".ix-scene", sec);
  const caps = gsap.utils.toArray(".ix-c", sec);
  const segs = gsap.utils.toArray(".ix-seg", sec);
  const countN = sec.querySelector(".ix-count-n");
  const rail = sec.querySelector(".ix-rail-fill");

  let last = -1;
  const sync = (p) => {
    const idx = Math.min(N - 1, Math.floor(p * N * 0.999));
    if (rail) rail.style.transform = `scaleY(${(p).toFixed(3)})`;
    if (idx === last) return;
    last = idx;
    rows.forEach((el, i) => { el.classList.toggle("on", i === idx); el.classList.toggle("done", i < idx); });
    scenes.forEach((el, i) => el.classList.toggle("on", i === idx));
    caps.forEach((el, i) => el.classList.toggle("on", i === idx));
    segs.forEach((el, i) => { el.classList.toggle("on", i === idx); el.classList.toggle("done", i < idx); });
    if (countN) countN.textContent = String(idx + 1).padStart(2, "0");
  };
  sync(0);

  const prog = { p: 0 };
  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: sec, start: "top top", end: "+=320%", pin: true, scrub: 0.8, invalidateOnRefresh: true },
    })
    // 1. intro: text tips up into place, the stage swings in from the right
    .fromTo(".ix-intro", { opacity: 0, y: 46, rotationX: -32, transformOrigin: "50% 100%", transformPerspective: 1000 },
      { opacity: 1, y: 0, rotationX: 0, stagger: 0.035, duration: 0.16, ease: "power2.out" }, 0)
    .fromTo(".ix-stage", { opacity: 0, x: 120, rotationY: -30, scale: 0.86, transformPerspective: 1400, transformOrigin: "0% 50%" },
      { opacity: 1, x: 0, rotationY: 0, scale: 1, duration: 0.26, ease: "power3.out" }, 0.04)
    // 2. step through the industries; the stage drifts and tilts gently while it does
    .to(prog, { p: 1, duration: 0.8, onUpdate: () => sync(prog.p) }, 0.22)
    .fromTo(".ix-stage-in", { rotationY: -7, rotationX: 3, transformPerspective: 1400 }, { rotationY: 7, rotationX: -3, duration: 0.8 }, 0.22)
    .fromTo(".ix-art", { y: 8 }, { y: -8, duration: 0.8 }, 0.22)
    .to({}, { duration: 0.06 }, 1.02);
}

export function Industries() {
  return (
    <section className="ix" aria-label="Industries we serve">
      <div className="ix-bg" aria-hidden="true" />
      <div className="ix-wrap">
        <div className="ix-list-col">
          <span className="sh-tag ix-intro">Real-world outcomes</span>
          <h2 className="ix-h ix-intro">Industries we build for</h2>
          <div className="ix-listbox ix-intro">
            <span className="ix-rail" aria-hidden="true"><i className="ix-rail-fill" /></span>
            <ol className="ix-list">
              {INDUSTRY_DATA.map((d, i) => (
                <li className="ix-row" key={d.name}>
                  <sup>{String(i + 1).padStart(2, "0")}</sup>
                  <span className="ix-name">{d.name}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <IndustryStage />

        <Link className="ix-cta ix-intro" to={ROUTE_PATHS.PROJECT_CASE_STUDIES} data-cursor="Go">
          Explore projects <i>→</i>
        </Link>
      </div>
    </section>
  );
}
