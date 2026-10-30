import { useState } from "react";
import ImagePath from "../../assets/ImagePath";
import "./clientmarquee.css";

// Single source for the client logos: used by the TrustDoor block and by the strip under the stats bar.
// Same five logos the old TrustSlider used, plus Wonder Cement, RBL and Associated Golcha Minerals.
export const LOGOS = [
  { img: ImagePath.downSlider1, alt: "ROHAN Limited - Trusted Engineering Partner" },
  { img: ImagePath.downSlider2, alt: "TTIPL - Industrial Innovation Leader" },
  { img: ImagePath.downSlider3, alt: "Alpha Natural Resources - Sustainable Solutions" },
  { img: ImagePath.downSlider4, alt: "BAS Engineering - Quality Structures" },
  { img: ImagePath.downSlider5, alt: "Industry Partner - Reliable Solutions" },
  { img: "/images/clients/wonder-cement.png", alt: "Wonder Cement - Cement Industry Partner" },
  { img: "/images/clients/rbl.png", alt: "RBL - Rajasthan Barytes Limited" },
  { img: "/images/clients/associated-golcha-minerals.png", alt: "Associated Golcha Minerals" },
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

export function Marquee({ reverse = false }) {
  const base = [...LOGOS, ...LOGOS]; // 16 per half so the loop is always wider than the viewport
  return (
    <div className="sh-mq" role="region" aria-label="Partner logos">
      <ul className={`sh-mq-track${reverse ? " rev" : ""}`}>
        {[...base, ...base].map((l, i) => <Tile logo={l} key={i} />)}
      </ul>
    </div>
  );
}

// Full-width client strip that sits directly under the stats bar (96% / 20 / 100% / 100%).
export function ClientStrip() {
  return (
    <section className="sh-clients sh-fade" aria-label="Our clients">
      <span className="sh-tag">Trusted by our clients</span>
      <Marquee />
    </section>
  );
}

export default Marquee;
