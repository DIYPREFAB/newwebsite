import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImagePath from "../../assets/ImagePath";
import SteelBits from "./SteelBits";
import "./home3d.css";
import "./home3d-v4.css";
import "./home3d-v5.css";

gsap.registerPlugin(ScrollTrigger);

const HEAD = [["Certified", "by", "standards."], ["Trusted", "by", "industry."]];

// Same five logos the old TrustSlider used.
const LOGOS = [
  { img: ImagePath.downSlider1, alt: "ROHAN Limited - Trusted Engineering Partner" },
  { img: ImagePath.downSlider2, alt: "TTIPL - Industrial Innovation Leader" },
  { img: ImagePath.downSlider3, alt: "Alpha Natural Resources - Sustainable Solutions" },
  { img: ImagePath.downSlider4, alt: "BAS Engineering - Quality Structures" },
  { img: ImagePath.downSlider5, alt: "Industry Partner - Reliable Solutions" },
];

// Logo tile: image, or a clean text label (name before " - ") if the image fails to load.
function Tile({ logo }) {
  const [bad, setBad] = useState(!logo.img);
  const label = logo.alt.split(" - ")[0];
  return (
    <li className="sh-mq-tile" title={logo.alt}>
      {bad ? (
        <span className="sh-mq-text">{label}</span>
      ) : (
        <img src={logo.img} alt={logo.alt} loading="lazy" draggable="false" onError={() => setBad(true)} />
      )}
    </li>
  );
}

function Marquee() {
  const base = [...LOGOS, ...LOGOS]; // 10 per half so the loop is always wider than the viewport
  return (
    <div className="sh-mq" role="region" aria-label="Partner logos">
      <ul className="sh-mq-track">
        {[...base, ...base].map((l, i) => <Tile logo={l} key={i} />)}
      </ul>
    </div>
  );
}

const CSS = `
.sh-door-marq { width: min(960px, 88vw); margin: clamp(26px, 5vh, 52px) auto 0; }
.sh-mq { position: relative; overflow: hidden; padding: 6px 0;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent); }
.sh-mq-track { display: flex; align-items: center; gap: 18px; width: max-content; margin: 0; padding: 0; list-style: none; animation: shMq 40s linear infinite; will-change: transform; }
.sh-mq:hover .sh-mq-track { animation-play-state: paused; }
@keyframes shMq { to { transform: translateX(calc(-50% - 9px)); } }
.sh-mq-tile { flex: none; display: grid; place-items: center; min-width: 170px; height: 68px; padding: 0 26px; border-radius: 16px;
  background: linear-gradient(160deg, rgba(255,255,255,.96), rgba(228,240,243,.9)); border: 1px solid rgba(255,255,255,.5);
  box-shadow: 0 14px 34px rgba(0,8,16,.38), inset 0 1px 0 #fff; transition: transform .3s ease, box-shadow .3s ease; }
.sh-mq-tile:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,8,16,.5), 0 0 0 1px rgba(143,224,212,.7), inset 0 1px 0 #fff; }
.sh-mq-tile img { display: block; max-width: 140px; max-height: 40px; width: auto; height: auto; object-fit: contain; filter: grayscale(1) contrast(1.05); opacity: .85; transition: filter .3s, opacity .3s; }
.sh-mq-tile:hover img { filter: none; opacity: 1; }
.sh-mq-text { font-size: 14px; font-weight: 800; letter-spacing: .02em; color: #0b2740; white-space: nowrap; }
@media (max-width: 700px) {
  .sh-mq-tile { min-width: 130px; height: 54px; padding: 0 18px; }
  .sh-mq-tile img { max-width: 100px; max-height: 30px; }
  .sh-mq-text { font-size: 12.5px; }
}
@media (prefers-reduced-motion: reduce) {
  .sh-mq { overflow-x: auto; -webkit-mask-image: none; mask-image: none; }
  .sh-mq-track { animation: none; }
}
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
        .fromTo(".sh-door-seam", { scaleY: 0.1, opacity: 0 }, { scaleY: 1, opacity: 1, ease: "power2.out", duration: 0.12 }, 0)
        .fromTo(".sh-door-panel span", { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.14 }, 0.02)
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