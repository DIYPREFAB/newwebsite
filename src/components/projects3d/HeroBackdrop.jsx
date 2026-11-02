// Photo-free hero backdrop: four depth layers that ProjectsSections moves at different speeds on scroll
// (and with the mouse). Everything is vector line-art in the site's steel-and-teal palette.

// receding portal frames, drawn as one path each (pathLength=1 so the intro can "draw" them)
const FRAMES = Array.from({ length: 7 }, (_, i) => {
  const s = 1 / (1 + 0.34 * i);
  const hw = 640 * s, yg = 470 + 230 * s, ye = yg - 340 * s, yr = ye - 80 * s;
  return {
    d: `M${800 - hw} ${yg} V${ye} L800 ${yr} L${800 + hw} ${ye} V${yg}`,
    ye, yr, hw, op: 0.5 - i * 0.055,
  };
});
const LINKS = FRAMES.slice(0, -1).map((f, i) => {
  const n = FRAMES[i + 1];
  return `M${800 - f.hw} ${f.ye} L${800 - n.hw} ${n.ye} M${800 + f.hw} ${f.ye} L${800 + n.hw} ${n.ye} M800 ${f.yr} L800 ${n.yr}`;
});

// a long Warren truss
const PANELS = 14;
const TRUSS = (() => {
  const x0 = 60, x1 = 1540, yt = 40, yb = 160, w = (x1 - x0) / PANELS;
  let d = `M${x0} ${yt} H${x1} M${x0} ${yb} H${x1}`;
  const nodes = [];
  for (let i = 0; i <= PANELS; i++) {
    const x = x0 + i * w;
    d += ` M${x} ${yt} V${yb}`;
    if (i < PANELS) d += i % 2 ? ` M${x} ${yb} L${x + w} ${yt}` : ` M${x} ${yt} L${x + w} ${yb}`;
    nodes.push([x, yt], [x, yb]);
  }
  return { d, nodes };
})();

export default function HeroBackdrop() {
  return (
    <div className="pj-hero-bg" aria-hidden="true">
      <i className="pj-bg-glow a" />
      <i className="pj-bg-glow b" />
      <div className="pj-bg-grid" />
      <svg className="pj-bg-frames" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        {FRAMES.map((f, i) => <path key={i} d={f.d} pathLength="1" style={{ opacity: f.op }} />)}
        {LINKS.map((d, i) => <path key={`l${i}`} d={d} pathLength="1" className="lk" style={{ opacity: 0.22 - i * 0.025 }} />)}
      </svg>
      <svg className="pj-bg-truss" viewBox="0 0 1600 200" preserveAspectRatio="xMidYMid meet">
        <path d={TRUSS.d} pathLength="1" />
        {TRUSS.nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.4" />)}
      </svg>
    </div>
  );
}
