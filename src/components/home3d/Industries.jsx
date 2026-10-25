import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ROUTE_PATHS from "../../routes/RoutePath";
import SteelBits from "./SteelBits";
import GlassCore, { glassState } from "./GlassCore";

gsap.registerPlugin(ScrollTrigger);

const INDUSTRIES = ["Warehouses & Logistics", "Manufacturing", "Pharmaceutical", "Commercial", "Industrial"];
const SIDES = [-1, -1, 1, 1, 1]; // first lines slide left, last lines slide right

// Headline zooms out from close-up in 3D, holds, then splits apart around a refractive glass sculpture.
export function animateIndustries() {
  const sec = document.querySelector(".sh-split");
  const lines = gsap.utils.toArray(".sh-split-line");
  const pad = () => window.innerWidth * 0.05;
  const gapY = () => window.innerHeight * (window.innerWidth < 800 ? 0.14 : 0.075); // phones: push the text well clear of the glass sphere
  gsap.set(lines, { transformPerspective: 1200 });
  glassState.p = 0;
  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: sec, start: "top top", end: "+=340%", pin: true, scrub: 1, invalidateOnRefresh: true },
    })
    // 1. strong zoom-out, lines tip up into place
    .fromTo(".sh-split-lines", { scale: 3.6, filter: "blur(14px)" }, { scale: 1, filter: "blur(0px)", ease: "power3.out", duration: 0.34 }, 0)
    .fromTo(lines, { opacity: 0, rotationX: -60, transformOrigin: "50% 100%" },
      { opacity: 1, rotationX: 0, stagger: 0.03, duration: 0.2, ease: "power2.out" }, 0)
    .fromTo(".sh-split-halo", { scale: 2.8, opacity: 0 }, { scale: 1, opacity: 1, ease: "power3.out", duration: 0.4 }, 0)
    .fromTo(".sh-split-tag", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.22)
    .to(".sh-split-tag", { opacity: 0, duration: 0.08 }, 0.42)
    // 2. split + glass sculpture
    .fromTo(".sh-split-glass", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, ease: "power2.out", duration: 0.3 }, 0.46)
    .to(lines, {
      x: (i, el) => SIDES[i] * ((sec.offsetWidth - el.offsetWidth) / 2 - pad()),
      y: (i) => (i < 2 ? -1 : 1) * gapY(),
      rotationY: (i) => -SIDES[i] * 12,
      ease: "power3.inOut", duration: 0.34, stagger: 0.04,
    }, 0.44)
    .to(glassState, { p: 1, duration: 1 }, 0)
    .to(".sh-split-blob", { x: (i) => (i ? 90 : -90), y: (i) => (i ? -120 : 120), duration: 1 }, 0)
    .fromTo(".sh-split-cta", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.74)
    .to(".sh-split .sh-bit", { y: (i, el) => -Number(el.dataset.sp) * 380, duration: 1 }, 0)
    .to({}, { duration: 0.05 }, 0.95);
}

export function Industries() {
  return (
    <section className="sh-split" aria-label="Industries we serve">
      <SteelBits n={30} />
      <i className="sh-split-blob a" aria-hidden="true" />
      <i className="sh-split-blob b" aria-hidden="true" />
      <i className="sh-split-halo" aria-hidden="true" />
      <span className="sh-tag sh-split-tag">Real-world outcomes</span>
      <div className="sh-split-glass" aria-hidden="true">
        <span className="sh-split-aura" />
        <GlassCore />
      </div>
      <h2 className="sh-split-lines">
        {INDUSTRIES.map((n, i) => (
          <span className="sh-split-line" key={n}><sup>{String(i + 1).padStart(2, "0")}</sup>{n}</span>
        ))}
      </h2>
      <Link className="sh-split-cta" to={ROUTE_PATHS.PROJECT_CASE_STUDIES} data-cursor="Go">Explore projects <i>→</i></Link>
    </section>
  );
}
