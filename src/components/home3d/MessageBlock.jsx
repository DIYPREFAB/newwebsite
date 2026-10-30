import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SteelBits from "./SteelBits";
import "./home3d.css";
import "./home3d-v4.css";
import "./home3d-v5.css";

gsap.registerPlugin(ScrollTrigger);

// Desktop: the section is held on screen with CSS "position: sticky" inside a track that is exactly 100vh + 180vh tall.
// No pin-spacer maths is involved, so nothing can add empty space between the form and the footer, and the zoom is tied
// 1:1 to the scroll distance of the track. Phones/tablets keep the plain in-flow section.
const CSS = `
/* the site sets overflow-x:hidden on <body>, which turns it into a scroll container and breaks sticky; "clip" crops the same way without that */
body.home-3d { overflow-x: clip !important; }
@media (min-width: 900px) {
  .sh-msg-track { position: relative; height: 280vh; height: 280svh; }
  .sh-msg-track .sh-msg { position: sticky; top: 0; }
}
`;

// "Send us a message": centred on screen, held in place; card + rings spin and zoom out from huge to place.
export default function MessageBlock({ children }) {
  const root = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const build = (scrollTrigger) => {
      gsap.set(".sh-msg-card", { transformPerspective: 1400 });
      gsap
        .timeline({ defaults: { ease: "none" }, scrollTrigger })
        .fromTo(".sh-msg-ring.a", { scale: 3.4, rotation: -200, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, ease: "power3.out", duration: 0.6 }, 0)
        .fromTo(".sh-msg-ring.b", { scale: 2.4, rotation: 160, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, ease: "power3.out", duration: 0.6 }, 0)
        .fromTo(".sh-msg-glow", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, 0)
        .fromTo(".sh-msg-card", { scale: 3.4, rotation: -38, rotationY: 30 }, { scale: 1, rotation: 0, rotationY: 0, ease: "power3.out", duration: 0.6 }, 0)
        .fromTo(".sh-msg-card", { opacity: 0 }, { opacity: 1, duration: 0.18 }, 0)
        .to(".sh-msg .sh-bit", { y: (i, el) => -Number(el.dataset.sp) * 300, duration: 1 }, 0)
        .to({}, { duration: 0.4 }, 0.6);
    };
    mm.add("(min-width: 900px)", () => {
      build({ trigger: track.current, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true });
    });
    mm.add("(max-width: 899px)", () => {
      build({ trigger: root.current, start: "top 85%", end: "top 20%", scrub: 1 });
    });
    // layout above can still settle after first paint (fonts, images): re-measure once it has
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready?.then(refresh).catch(() => {});
    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return (
    <div className="sh-msg-track sh-skip" ref={track}>
      <style>{CSS}</style>
      <section className="sh-msg sh-skip" ref={root} aria-label="Send us a message">
        <SteelBits n={26} />
        <i className="sh-msg-ring a" aria-hidden="true" />
        <i className="sh-msg-ring b" aria-hidden="true" />
        <i className="sh-msg-glow" aria-hidden="true" />
        <div className="sh-msg-card">{children}</div>
      </section>
    </div>
  );
}
