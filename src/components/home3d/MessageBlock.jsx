import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SteelBits from "./SteelBits";
import "./home3d.css";
import "./home3d-v4.css";
import "./home3d-v5.css";

gsap.registerPlugin(ScrollTrigger);

// "Send us a message": centred on screen, pinned; card + rings spin and zoom out from huge to place.
export default function MessageBlock({ children }) {
  const root = useRef(null);

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
      build({ trigger: root.current, start: "top top", end: "+=180%", pin: true, scrub: 1, invalidateOnRefresh: true });
    });
    mm.add("(max-width: 899px)", () => {
      build({ trigger: root.current, start: "top 85%", end: "top 20%", scrub: 1 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="sh-msg sh-skip" ref={root} aria-label="Send us a message">
      <SteelBits n={26} />
      <i className="sh-msg-ring a" aria-hidden="true" />
      <i className="sh-msg-ring b" aria-hidden="true" />
      <i className="sh-msg-glow" aria-hidden="true" />
      <div className="sh-msg-card">{children}</div>
    </section>
  );
}
