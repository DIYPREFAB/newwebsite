import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaHelmetSafety } from "react-icons/fa6";
import { MdSupportAgent } from "react-icons/md";
import SteelBits from "./SteelBits";

gsap.registerPlugin(ScrollTrigger);

const small = () => window.innerWidth < 900;

// Called by ScrollHome in page order so ScrollTrigger pin spacing stays correct.
export function animateWho() {
  gsap.set(".sh-who-frame", { xPercent: -50, yPercent: -50 });
  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: ".sh-who", start: "top top", end: "+=260%", pin: true, scrub: 1, invalidateOnRefresh: true },
    })
    .fromTo(".sh-who-frame",
      { width: () => (small() ? "90vw" : "68vw"), height: () => (small() ? "64vh" : "58vh"), borderRadius: 26 },
      { width: () => (small() ? "72vw" : "42vw"), height: "64vh", borderRadius: 44, ease: "power2.inOut", duration: 0.42 }, 0)
    .to(".sh-who-label", { opacity: 0, duration: 0.15 }, 0.3)
    .to(".sh-who", { backgroundColor: "#a8dadc", duration: 0.12 }, 0.45)
    .to(".sh-who-bg", { opacity: 0, duration: 0.15 }, 0.45)
    .to(".sh-who-frame", { y: "-118vh", ease: "power2.in", duration: 0.25 }, 0.45)
    .fromTo(".sh-who-statement span",
      { yPercent: 70, opacity: 0, filter: "blur(10px)" },
      { yPercent: 0, opacity: 1, filter: "blur(0px)", stagger: 0.07, duration: 0.2, ease: "power2.out" }, 0.62)
    .to(".sh-who .sh-bit", { y: (i, el) => -Number(el.dataset.sp) * 420, duration: 1 }, 0)
    .to(".sh-ring", { rotation: (i) => (i % 2 ? -120 : 120), y: (i) => -80 * (i + 1), duration: 1 }, 0)
    .to({}, { duration: 0.05 }, 0.95);
}

export function WhoUs() {
  return (
    <section className="sh-who" aria-label="Who we are">
      <div className="sh-who-bg" aria-hidden="true">
        <i className="sh-ring" style={{ width: "46vmax", height: "46vmax", left: "-14vmax", top: "-10vmax" }} />
        <i className="sh-ring" style={{ width: "30vmax", height: "30vmax", right: "-8vmax", bottom: "-8vmax" }} />
        <i className="sh-ring" style={{ width: "18vmax", height: "18vmax", right: "18%", top: "6%" }} />
      </div>
      <SteelBits n={30} />
      <div className="sh-who-frame">
        <div className="sh-who-in">
          <div className="sh-tile sh-tile--stats">
            <b className="sh-big">7+</b>
            <span className="sh-big-l">Years of Experience</span>
            <ul>
              <li>Cutting-Edge Expertise</li>
              <li>Holistic Solutions Approach</li>
              <li>Client-Centric Collaboration</li>
            </ul>
          </div>
          <div className="sh-tile">
            <FaHelmetSafety />
            <h4>Professional Expert</h4>
            <p>Prefab buildings empower professional experts with faster deployment, design flexibility, and cost-effective construction solutions.</p>
          </div>
          <div className="sh-tile">
            <MdSupportAgent />
            <h4>24/7 Premium Support</h4>
            <p>Experience uninterrupted service and peace of mind with 24/7 premium support tailored for your prefab building needs.</p>
          </div>
        </div>
      </div>
      <span className="sh-who-label">Who we are</span>
      <h2 className="sh-who-statement">
        <span>Your trusted and</span>
        <span className="hl">visionary partner</span>
        <span>in engineering excellence</span>
      </h2>
    </section>
  );
}
