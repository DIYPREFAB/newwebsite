import { forwardRef, useEffect, useState } from "react";
import "./loadreadout.css";

/**
 * Small engineering read-out in the top-right corner of the home page.
 * Visible from the very first screen. It follows the hero's scroll: Line load (kN/m) -> Moment (kN·m) -> Force (kN), and the Force then stays on screen for every
 * scroll after that. It is rendered into <body> (fixed) so it is not carried away when the pinned hero releases.
 *
 * The three numbers are one consistent worked example for the building shown (illustrative, not a design calculation):
 *   w = 9.38 kN/m on the rafter (6.25 m bay x 1.5 kN/m² design pressure)
 *   M = w·L²/8   (simply supported span)        F = w·L/2   (end reaction)
 */
const W = 9.375; // kN/m  (6.25 m x 1.5 kN/m²)

const readings = (span) => [
  { key: "line", label: "Line load", unit: "kN/m", value: W, dec: 2 },
  { key: "moment", label: "Moment", unit: "kN·m", value: (W * span * span) / 8, dec: 1 },
  { key: "force", label: "Force", unit: "kN", value: (W * span) / 2, dec: 1 },
];

const fmt = (v, d) => v.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });

const LoadReadout = forwardRef(function LoadReadout({ stage, span = 20 }, ref) {
  const list = readings(Number(span) || 20);
  const r = list[Math.min(stage, 2)];
  const [shown, setShown] = useState(0);

  // count the new figure up from 0 each time the stage changes
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(r.value); return undefined; }
    let raf;
    const t0 = performance.now();
    const run = (t) => {
      const k = Math.min(1, (t - t0) / 900);
      setShown(r.value * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [r.key, r.value]);

  return (
    <aside className="lr" ref={ref} aria-label={`${r.label}: ${fmt(r.value, r.dec)} ${r.unit} (illustrative worked example)`}>
      <div className="lr-head">
        <span className="lr-tag">Structural</span>
        <span className="lr-dots" aria-hidden="true">
          {list.map((x, i) => <i key={x.key} className={i <= stage ? "is-on" : ""} />)}
        </span>
      </div>
      <div className="lr-body" key={r.key}>
        <span className="lr-label">{r.label}</span>
        <span className="lr-val"><b>{fmt(shown, r.dec)}</b><small>{r.unit}</small></span>
      </div>
      <p className="lr-note">Illustrative · {span} m span</p>
    </aside>
  );
});

export default LoadReadout;
