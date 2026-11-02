import { useEffect, useRef, useState } from "react";
import { createBimScene, STEPS } from "./bimScene";

// Live BIM viewport for the Projects hero: the Wonder Cement parking shed erected element by element,
// then orbiting, sectioned and tagged. Scrolling the hero explodes it into layers; drag to orbit.
export default function BimHero({ reduce = false }) {
  const wrap = useRef(null);
  const cv = useRef(null);
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(120);

  useEffect(() => {
    const scene = createBimScene(cv.current, {
      reduce,
      interactEl: wrap.current,
      heroEl: wrap.current.closest(".pj-hero"),
      onStep: setStep,
    });
    setCount(scene.count);
    return () => scene.destroy();
  }, [reduce]);

  const done = step >= STEPS.length;
  return (
    <div className="pj-bim" ref={wrap} data-cursor="Drag">
      <canvas className="pj-bim-cv" ref={cv} />
      <div className="pj-bim-hud" aria-hidden="true">
        <div className="pj-bim-top">
          <span className="pj-bim-live"><i />Live BIM model</span>
          <span className="pj-bim-chip">18 × 16.2 m · 5 m eave · {count} elements</span>
        </div>
        <div className="pj-bim-bot">
          <div className="pj-bim-seq">
            <span className="pj-bim-now">{done ? "Erection complete" : `Erecting · ${STEPS[step]}`}</span>
            <span className="pj-bim-rail">
              {STEPS.map((s, i) => <i key={s} className={i < step || done ? "done" : i === step ? "on" : ""} />)}
            </span>
          </div>
          <ul className="pj-bim-leg">
            <li><i style={{ background: "#86cfc3" }} />Primary frame</li>
            <li><i style={{ background: "#70b2e2" }} />Secondary steel</li>
            <li><i style={{ background: "#ffb854" }} />Bracing</li>
            <li><i style={{ background: "#c4eee8" }} />Sheeting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
