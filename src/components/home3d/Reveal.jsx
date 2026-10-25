import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SteelBits from "./SteelBits";

gsap.registerPlugin(ScrollTrigger);

const REVEAL = "Faster approvals. Parallel detailing. One accountable team from first sketch to final bolt.";
const HL = new Set(["Faster", "Parallel", "accountable"]);
const PILLARS = [
  ["01", "Faster approvals", "Approval-ready drawings issued early, so sign-offs never hold up the build."],
  ["02", "Parallel detailing", "Engineering, detailing and fabrication prep run side by side, not in sequence."],
  ["03", "One accountable team", "A single point of responsibility from first sketch to final bolt."],
];

// Pinned statement: words light up, ghost type and rings drift, glass pillars rise in with depth.
export function animateReveal() {
  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: ".sh-rv", start: "top top", end: "+=240%", pin: true, scrub: 1, invalidateOnRefresh: true },
    })
    .fromTo(".sh-rv-ghost", { xPercent: 14 }, { xPercent: -26, duration: 1 }, 0)
    .to(".sh-rv-ring", { rotation: (i) => (i % 2 ? -80 : 80), y: (i) => (i % 2 ? 60 : -60), duration: 1 }, 0)
    .fromTo(".sh-rv-word", { opacity: 0.14, yPercent: 35 },
      { opacity: 1, yPercent: 0, stagger: 0.035, duration: 0.12, ease: "power2.out" }, 0.02)
    .fromTo(".sh-rv-line i", { scaleX: 0 }, { scaleX: 1, duration: 0.9 }, 0)
    .fromTo(".sh-rv-card", { y: 90, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.2, ease: "power2.out" }, 0.45)
    .fromTo(".sh-rv-card", { yPercent: 0 }, { yPercent: (i) => -5 * (i + 1), duration: 0.5 }, 0.5)
    .to(".sh-rv .sh-bit", { y: (i, el) => -Number(el.dataset.sp) * 380, duration: 1 }, 0)
    .to({}, { duration: 0.05 }, 0.95);
}

export function Reveal() {
  return (
    <section className="sh-rv" aria-label="How we work">
      <SteelBits n={20} />
      <i className="sh-rv-ring" style={{ width: "44vmax", height: "44vmax", right: "-14vmax", top: "-16vmax" }} />
      <i className="sh-rv-ring" style={{ width: "26vmax", height: "26vmax", left: "-8vmax", bottom: "-10vmax" }} />
      <div className="sh-rv-ghost" aria-hidden="true">One team</div>
      <div className="sh-rv-top">
        <span className="sh-tag">How we work</span>
        <p className="sh-rv-text">
          {REVEAL.split(" ").map((w, i) => (
            <span className={`sh-rv-word${HL.has(w) ? " hl" : ""}`} key={i}>{w}</span>
          ))}
        </p>
      </div>
      <div className="sh-rv-line" aria-hidden="true"><i /></div>
      <div className="sh-rv-cards">
        {PILLARS.map(([n, t, d]) => (
          <article className="sh-rv-card" key={n}>
            <em>{n}</em>
            <h3>{t}</h3>
            <p>{d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
