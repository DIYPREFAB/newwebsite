import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { weDo } from "../../Constants";
import ROUTE_PATHS from "../../routes/RoutePath";
import SteelBits from "./SteelBits";

gsap.registerPlugin(ScrollTrigger);

const CHIPS = ["Reliability", "Scalability", "Custom design", "Precision"];

// Scroll rotates a 4-sided prism, one card per face, snapping to each card.
export function animatePrism() {
  const count = document.querySelector(".sh-prism-count");
  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".sh-prism", start: "top top", end: "+=320%", pin: true, scrub: 1,
        snap: { snapTo: 1 / 3, duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut" },
        onUpdate: (s) => {
          if (count) count.textContent = `${String(Math.round(s.progress * 3) + 1).padStart(2, "0")} / 04`;
        },
      },
    })
    .fromTo(".sh-prism-body", { rotateY: 0 }, { rotateY: -270, duration: 1 }, 0)
    .fromTo(".sh-prism-tilt", { rotateX: 6 }, { rotateX: -5, duration: 1 }, 0)
    .fromTo(".sh-prism-floor", { scaleX: 0.8, opacity: 0.5 }, { scaleX: 1.1, opacity: 1, duration: 1 }, 0)
    .to(".sh-prism .sh-bit", { y: (i, el) => -Number(el.dataset.sp) * 520, duration: 1 }, 0);
}

export function CardPrism() {
  return (
    <section className="sh-prism" aria-label="Why choose DIY Prefab">
      <SteelBits n={34} />
      <div className="sh-prism-head">
        <span className="sh-tag">Why choose us</span>
        <p className="sh-prism-count">01 / 04</p>
      </div>
      <div className="sh-prism-stage">
        <div className="sh-prism-tilt">
          <div className="sh-prism-body">
            {weDo.map(({ icon, title, desc }, i) => (
              <article className="sh-face" key={title}
                style={{ transform: `rotateY(${i * 90}deg) translateZ(calc(var(--w) / 2))` }}>
                <div className="sh-face-body">
                  <span className="sh-face-no">{String(i + 1).padStart(2, "0")}</span>
                  <div className="sh-face-icon">{icon}</div>
                  <span className="sh-chip">{CHIPS[i % CHIPS.length]}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <Link className="sh-pill" to={ROUTE_PATHS.CARD_DETAILS} data-cursor="Open">Learn more <i>→</i></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="sh-prism-floor" aria-hidden="true" />
      </div>
    </section>
  );
}
