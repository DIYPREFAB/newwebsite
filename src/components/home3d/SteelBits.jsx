import { useMemo } from "react";

const rnd = (i, k) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Fine-line engineering marks: crosshair, ring, dashed ring, diamond, corner bracket, hexagon, glowing dot.
const SHAPES = [
  <path d="M20 6v11M20 23v11M6 20h11M23 20h11" />,
  <><circle cx="20" cy="20" r="13" /><circle className="f" cx="20" cy="20" r="1.8" /></>,
  <circle cx="20" cy="20" r="14" strokeDasharray="1.5 5" />,
  <path d="M20 4l16 16-16 16L4 20z" />,
  <path d="M5 15V5h10M35 25v10H25" />,
  <polygon points="20,4 34,12 34,28 20,36 6,28 6,12" />,
  <circle className="f" cx="20" cy="20" r="2.4" />,
];

// Depth-layered parallax details. GSAP moves `.sh-bit` (data-sp = depth speed): near marks are bigger,
// brighter and faster, far marks are small, dim and softly blurred. CSS adds a slow idle drift.
export default function SteelBits({ n = 24 }) {
  const bits = useMemo(() => {
    const count = Math.max(10, Math.round(n * 0.7));
    return Array.from({ length: count }, (_, i) => {
      const d = rnd(i, 9);
      const shape = Math.floor(rnd(i, 7) * SHAPES.length);
      return {
        line: i % 7 === 3,
        shape, d,
        x: rnd(i, 1) * 100, y: rnd(i, 2) * 125,
        s: 10 + d * 30, h: 30 + rnd(i, 3) * 40,
        sp: 0.35 + d * 1.25, o: 0.25 + d * 0.55,
        accent: rnd(i, 4) < 0.28, dur: 12 + rnd(i, 8) * 14, delay: rnd(i, 6) * 10,
      };
    });
  }, [n]);
  return (
    <div className="sh-dots" aria-hidden="true">
      {bits.map((b, i) =>
        b.line ? (
          <span key={i} className="sh-bit line" data-sp={b.sp} style={{ left: `${b.x}%`, top: `${b.y}%`, height: `${b.h}vh`, opacity: b.o * 0.7 }} />
        ) : (
          <span key={i} className={`sh-bit${b.accent ? " a" : ""}${b.d < 0.35 ? " far" : ""}${b.shape === 6 || b.d > 0.85 ? " glow" : ""}`}
            data-sp={b.sp} style={{ left: `${b.x}%`, top: `${b.y}%`, opacity: b.o }}>
            <svg viewBox="0 0 40 40" width={b.s} height={b.s} style={{ animationDuration: `${b.dur}s`, animationDelay: `-${b.delay}s` }}>{SHAPES[b.shape]}</svg>
          </span>
        )
      )}
    </div>
  );
}
