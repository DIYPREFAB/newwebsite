import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SteelHero from "./SteelHero";
import CounterCard from "../../common/CounterCard";
import { weOfferList } from "../../Constants";
import { WhoUs, animateWho } from "./WhoUs";
import { CardPrism, animatePrism } from "./CardPrism";
import { Industries, animateIndustries } from "./Industries";
import { Reveal, animateReveal } from "./Reveal";
import SteelBits from "./SteelBits";
import Cursor from "./Cursor";
import { bookCall } from "./booking";
import "./home3d.css";
import "./home3d-v4.css";
import "./home3d-v5.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const HEADER = 0; // nav floats over the page

const PLANT = [
  ["Plasma cutting", "plasma-3-maxpro-200.jpeg"],
  ["CNC shearing", "cnc-shearing-machine.jpeg"],
  ["Automated welding", "fully-automatic-ptw.jpeg"],
  ["Fit-up & tacking", "fittup-section.jpeg"],
  ["Shot blasting", "automatic-shot-blasting-machine.jpeg"],
];
const ACCENTS = [["#2fd4c0", "#a8dadc"], ["#6cb6ff", "#bfe0ff"], ["#f4c542", "#ffe39a"], ["#ff8a7a", "#ffc4bb"], ["#9b8cff", "#d3ccff"], ["#5fe0a0", "#b8f2d4"]];

// Spotlight that follows the pointer on a card.
const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function ScrollHome({ onCta }) {
  const root = useRef(null);
  const progress = useRef(0);
  const [plantIdx, setPlantIdx] = useState(0);

  const openBooking = (e) => bookCall(onCta, e);

  useEffect(() => {
    document.body.classList.add("home-3d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis, tick;
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      // 1. Pinned 3D stage: scroll drives blueprint -> assembled building
      ScrollTrigger.create({
        trigger: ".sh-stage",
        start: `top ${HEADER}px`,
        end: "+=580%",
        pin: true,
        onUpdate: (self) => { progress.current = self.progress; },
      });

      // Pinned horizontal tracks, with depth: floating parts drift slower, photos pan inside their frames
      const hs = root.current.querySelectorAll(".sh-h");
      const makeH = (wrap) => {
        const track = wrap.querySelector(".sh-track");
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: wrap, start: `top ${HEADER}px`, end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true,
            onUpdate: (self) => { if (wrap.dataset.counter) setPlantIdx(Math.round(self.progress * (PLANT.length - 1))); },
          },
        });
        tl.to(track, { x: () => -dist() }, 0);
        const bits = wrap.querySelector(".sh-dots");
        if (bits) tl.to(bits, { x: () => -dist() * 0.5 }, 0);
        wrap.querySelectorAll(".sh-photo img").forEach((img) => tl.fromTo(img, { xPercent: -8 }, { xPercent: 8 }, 0));
        wrap.querySelectorAll(".sh-card").forEach((card, i) => tl.fromTo(card, { y: i % 2 ? 26 : -26 }, { y: i % 2 ? -26 : 26 }, 0));
      };
      makeH(hs[0]);

      animateReveal();
      animateWho();
      animatePrism();
      makeH(hs[1]);
      animateIndustries();

      // Parallax: any element with data-speed, plus the inner content of every section after the home sections
      gsap.utils.toArray("[data-speed]").forEach((el) => {
        const s = parseFloat(el.dataset.speed) || 0.2;
        gsap.fromTo(el, { y: () => -s * 70 }, { y: () => s * 70, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
      });
      gsap.utils.toArray(".sh-root .counter-section > *").forEach((el) =>
        gsap.fromTo(el, { y: 40 }, { y: -40, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } })
      );
      [...root.current.parentElement.children].forEach((el) => {
        if (el === root.current || el.classList.contains("hn") || el.classList.contains("sh-skip") || /^(HEADER|FOOTER|SCRIPT)$/.test(el.tagName)) return;
        ScrollTrigger.create({
          trigger: el, start: "top bottom", end: "bottom top",
          onUpdate: (s) => {
            const c = el.firstElementChild;
            if (c) c.style.transform = `translate3d(0,${((0.5 - s.progress) * 64).toFixed(1)}px,0)`;
          },
        });
      });

      gsap.utils.toArray(".sh-fade").forEach((el) =>
        gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } })
      );
    }, root);

    return () => {
      ctx.revert();
      document.body.classList.remove("home-3d");
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div className="sh-root" ref={root}>
      <Cursor />
      {/* 1. Blueprint -> assembled building: whole pinned hero (3D + captions + HUD + rail) */}
      <SteelHero progress={progress} onCta={openBooking} />

      {/* 2. Services, horizontal */}
      <section className="sh-h sh-h--light">
        <SteelBits n={22} />
        <div className="sh-track">
          <div className="sh-intro">
            <span className="sh-tag">What we offer</span>
            <h2>Engineering solutions for every industry.</h2>
          </div>
          {weOfferList.map((o, i) => {
            const [a, b] = ACCENTS[i % ACCENTS.length];
            return (
              <Link className="sh-card" to={o.linkTo} key={o.id} onMouseMove={spot} data-cursor="Explore" style={{ "--a": a, "--b": b }}>
                <em>{String(i + 1).padStart(2, "0")}</em>
                <div className="sh-card-icon"><i>{o.icon}</i></div>
                <h3>{o.title}</h3>
                <p>{o.description}</p>
                <span className="sh-card-cta">Learn more <i>→</i></span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Proof */}
      <CounterCard />
      <Reveal />

      {/* Who we are: frame shrinks with its content, bg flips, statement reveals */}
      <WhoUs />

      {/* Why choose us: 3D rotating cards */}
      <CardPrism />

      {/* 4. Real factory photography, horizontal */}
      <section className="sh-h sh-h--dark" data-counter="1">
        <SteelBits n={14} />
        <div className="sh-track">
          <div className="sh-intro">
            <span className="sh-tag">Process control</span>
            <h2>Inside the plant.</h2>
            <p className="sh-count">{String(plantIdx + 1).padStart(2, "0")} / {String(PLANT.length).padStart(2, "0")}</p>
          </div>
          {PLANT.map(([label, file], i) => (
            <figure className="sh-photo" key={file} data-cursor="View">
              <img src={`/images/${file}`} alt={label} loading="lazy" />
              <figcaption><b>{String(i + 1).padStart(2, "0")}</b> {label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 5. Outcomes: headline splits apart on scroll */}
      <Industries />
    </div>
  );
}
