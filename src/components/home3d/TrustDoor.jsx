import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SteelBits from "./SteelBits";
import { Marquee } from "./ClientMarquee";
import "./home3d.css";
import "./home3d-v4.css";
import "./home3d-v5.css";

gsap.registerPlugin(ScrollTrigger);

const HEAD = [["Certified", "by", "standards."], ["Trusted", "by", "industry."]];

const CSS = `
.sh-door-marq { width: min(960px, 88vw); margin: clamp(26px, 5vh, 52px) auto 0; }
.sh-door-marq .sh-mq { width: 100%; }
`;

// Pinned "door" screen with the client-logo marquee under the intro line.
// The old light sheet (Certifications + "Trusted by..." + world map + TrustSlider) is removed completely;
// any children passed by the parent are ignored.
export default function TrustDoor() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".sh-door-w", { transformPerspective: 900 });
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ".sh-door", start: "top top", end: "+=240%", pin: true, scrub: 1, invalidateOnRefresh: true },
        })
        // the closed door ("DIY | PREFAB" and the seam) is visible from the very first scroll pixel, so the screen is never empty
        .fromTo(".sh-door-seam", { scaleY: 0.35, opacity: 1 }, { scaleY: 1, opacity: 1, ease: "power2.out", duration: 0.12 }, 0)
        .to(".sh-door-seam", { opacity: 0, duration: 0.14 }, 0.3)
        .to(".sh-door-panel.l", { xPercent: -100, ease: "power3.inOut", duration: 0.46 }, 0.16)
        .to(".sh-door-panel.r", { xPercent: 100, ease: "power3.inOut", duration: 0.46 }, 0.16)
        .fromTo(".sh-door-stage", { scale: 1.3 }, { scale: 1, ease: "power2.out", duration: 0.55 }, 0.16)
        .fromTo(".sh-door-w", { yPercent: 120, rotationX: -55, opacity: 0 },
          { yPercent: 0, rotationX: 0, opacity: 1, stagger: 0.05, duration: 0.2, ease: "power3.out" }, 0.34)
        .fromTo(".sh-door-p", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15, ease: "power2.out" }, 0.62)
        .fromTo(".sh-door-marq", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" }, 0.7)
        .fromTo(".sh-door-copy .sh-tag", { opacity: 0, letterSpacing: "0.5em" }, { opacity: 1, letterSpacing: "0.18em", duration: 0.2, ease: "power2.out" }, 0.3)
        .to(".sh-door-ring", { rotation: (i) => (i % 2 ? -90 : 90), duration: 1 }, 0)
        .to(".sh-door .sh-bit", { y: (i, el) => -Number(el.dataset.sp) * 320, duration: 1 }, 0)
        .to({}, { duration: 0.05 }, 0.95);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="sh-trust sh-skip" ref={root}>
      <style>{CSS}</style>
      <section className="sh-door" aria-label="Certifications and clients">
        <div className="sh-door-stage">
          <SteelBits n={26} />
          <i className="sh-door-ring" style={{ width: "46vmax", height: "46vmax", right: "-14vmax", top: "-16vmax" }} />
          <i className="sh-door-ring" style={{ width: "28vmax", height: "28vmax", left: "-8vmax", bottom: "-10vmax" }} />
          <div className="sh-door-copy">
            <span className="sh-tag">Credentials &amp; clients</span>
            <h2 className="sh-door-h">
              {HEAD.map((row, r) => (
                <span className="sh-door-row" key={r}>
                  {row.map((w, i) => <span className="sh-door-w" key={i}>{w}</span>)}
                </span>
              ))}
            </h2>
            <p className="sh-door-p">Recognised certifications and the clients behind them: the proof behind every structure we deliver.</p>
            <div className="sh-door-marq"><Marquee /></div>
          </div>
        </div>
        <div className="sh-door-panel l" aria-hidden="true"><span>DIY</span></div>
        <div className="sh-door-panel r" aria-hidden="true"><span>PREFAB</span></div>
        <div className="sh-door-seam" aria-hidden="true" />
      </section>
    </div>
  );
}