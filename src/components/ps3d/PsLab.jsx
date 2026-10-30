import { EPC } from "./psData";

// "Capability lab": a sticky rail of the six DIYVA points on the left and ONE live panel on the right.
// Scrolling (or clicking a tab) swaps the scene; each scene is a small SVG story drawn with CSS animations,
// so no photos are needed. The scroll logic lives in PsSections.jsx (act 2); styles are at the end of ps3d.css.

const v = (o) => o; // tiny helper so inline CSS variables read clearly
const pad2 = (n) => String(n).padStart(2, "0");

/* 01 · Understand your documents: loose files are scanned, structured, and every row stays linked to its source */
function SceneDocs() {
  const src = [["PDF", 34], ["XLS", 118], ["QRF", 202]];
  const rows = [82, 120, 158, 196, 234];
  const widths = [120, 92, 108, 70, 98];
  return (
    <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMid meet">
      {src.map(([lab, y], i) => (
        <g key={lab} className="lb-s" style={v({ "--dl": `${i * 0.15}s`, "--dx": "-50px" })}>
          <rect className="lb-card" x="28" y={y} width="104" height="72" rx="10" />
          <text x="42" y={y + 24}>{lab}</text>
          <rect className="lb-line" x="42" y={y + 36} width="64" height="5" rx="2.5" />
          <rect className="lb-line" x="42" y={y + 50} width="44" height="5" rx="2.5" />
        </g>
      ))}
      <rect className="lb-scan" x="28" y="34" width="104" height="3" rx="1.5" style={v({ "--sy": "238px" })} />
      {src.map(([lab, y], i) => {
        const ry = rows[i * 2] + 14;
        return <path key={lab} className="lb-d lb-link" pathLength="1" d={`M132 ${y + 36}C204 ${y + 36} 196 ${ry} 262 ${ry}`} style={v({ "--dl": `${0.7 + i * 0.25}s`, "--t": ".9s" })} />;
      })}
      <g className="lb-s" style={v({ "--dl": ".3s", "--dx": "46px" })}>
        <rect className="lb-card" x="262" y="34" width="190" height="246" rx="14" />
        <text x="278" y="58">Structured project</text>
        {rows.map((y, i) => (
          <g key={y}>
            <rect className="lb-row" x="274" y={y} width="166" height="28" rx="8" />
            <circle className="lb-p lb-dot" cx="290" cy={y + 14} r="6" style={v({ "--dl": `${1.1 + i * 0.18}s` })} />
            <rect className="lb-g lb-fillm" x="304" y={y + 11} width={widths[i]} height="6" rx="3" style={v({ "--dl": `${1.2 + i * 0.18}s` })} />
          </g>
        ))}
      </g>
      <text className="lb-p lb-note" x="28" y="304" style={v({ "--dl": "2.2s" })}>Every input linked to its source</text>
    </svg>
  );
}

/* 02 · Visualize & engineer: the isometric building draws itself, then AI / standards / engineer light up in turn */
function SceneModel({ bd }) {
  return (
    <svg viewBox="0 0 560 400" preserveAspectRatio="xMidYMid meet">
      <g className="lb-float">
        {bd.lines.map(([cls, dd], i) => (
          <path key={i} className={`lb-d lb-ln ${cls}`} pathLength="1" d={dd} style={v({ "--dl": `${i * 0.045}s`, "--t": ".75s" })} />
        ))}
        {bd.nodes.map(([x, y], i) => (
          <circle key={i} className="lb-p lb-nd" cx={x} cy={y} r="3.2" style={v({ "--dl": `${1.1 + i * 0.03}s` })} />
        ))}
      </g>
      {[["AI proposes", 40], ["Standards validate", 205], ["Engineers approve", 370]].map(([t, x], i) => (
        <g key={t} className="lb-p" style={v({ "--dl": `${1.7 + i * 0.5}s` })}>
          <rect className={i === 2 ? "lb-pill lb-ok" : "lb-pill"} x={x} y="356" width="150" height="30" rx="15" />
          <text className={i === 2 ? "lb-oktxt" : ""} x={x + 75} y="375" textAnchor="middle">{t}</text>
        </g>
      ))}
    </svg>
  );
}

/* 03 · Design alternatives: three concepts, the ones that fail the structure check fade, the best one lifts */
function SceneAlt() {
  const cards = [
    { x: 24, name: "Concept A", d: "M22 150V96L66 66L110 96V150M16 150H116", pass: true },
    { x: 174, name: "Concept B", d: "M22 150V80L66 58L110 80V150M16 150H116M22 110H110", pass: true, win: true },
    { x: 324, name: "Concept C", d: "M22 150V122L66 102L110 122V150M16 150H116", pass: false },
  ];
  return (
    <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMid meet">
      {cards.map((c, i) => (
        <g key={c.name} transform={`translate(${c.x},40)`}>
          <g className="lb-s" style={v({ "--dl": `${i * 0.18}s`, "--dy": "50px", "--dx": "0px" })}>
            <g className={c.win ? "lb-win" : c.pass ? "" : "lb-fail"} style={v({ "--dl": c.win ? "2s" : "1.7s" })}>
              <rect className="lb-card" x="0" y="0" width="132" height="190" rx="14" />
              {c.win && <rect className="lb-p lb-glow" x="0" y="0" width="132" height="190" rx="14" style={v({ "--dl": "2s" })} />}
              <text x="14" y="26">{c.name}</text>
              <path className="lb-d lb-ln fr" pathLength="1" d={c.d} style={v({ "--dl": `${0.5 + i * 0.2}s`, "--t": "1s" })} />
              <g className="lb-p" style={v({ "--dl": `${1.3 + i * 0.12}s` })}>
                <circle cx="112" cy="22" r="11" className={c.pass ? "lb-badge ok" : "lb-badge no"} />
                <path className="lb-tick" d={c.pass ? "M106 22l4 4l8-9" : "M107 17l10 10M117 17l-10 10"} />
              </g>
            </g>
          </g>
        </g>
      ))}
      {[["Structural", 270, 190], ["Business fit", 296, 150]].map(([t, y, w], i) => (
        <g key={t}>
          <text className="lb-p" x="24" y={y} style={v({ "--dl": `${2.2 + i * 0.25}s` })}>{t}</text>
          <rect className="lb-track" x="124" y={y - 9} width="240" height="8" rx="4" />
          <rect className={i ? "lb-g lb-fillt" : "lb-g lb-fillm"} x="124" y={y - 9} width={w} height="8" rx="4" style={v({ "--dl": `${2.3 + i * 0.25}s`, "--t": "1s" })} />
        </g>
      ))}
    </svg>
  );
}

/* 04 · Know what every change means: one change ripples out to every affected area, and is logged */
function SceneImpact() {
  const rows = EPC.stage.impact.rows;
  const cx = 240, cy = 148;
  return (
    <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMid meet">
      {[0, 0.8, 1.6].map((d) => <circle key={d} className="lb-ring" cx={cx} cy={cy} r="34" style={v({ "--dl": `${d}s` })} />)}
      {rows.map((r, i) => {
        const a = ((-90 + i * 60) * Math.PI) / 180;
        const x = Math.round(cx + 172 * Math.cos(a)), y = Math.round(cy + 104 * Math.sin(a));
        return (
          <g key={r}>
            <path className="lb-d lb-link" pathLength="1" d={`M${cx} ${cy}L${x} ${y}`} style={v({ "--dl": `${0.5 + i * 0.35}s`, "--t": ".7s" })} />
            <g className="lb-p" style={v({ "--dl": `${0.95 + i * 0.35}s` })}>
              <rect className="lb-pill" x={x - 54} y={y - 15} width="108" height="30" rx="15" />
              <circle className="lb-dot" cx={x - 38} cy={y} r="5" />
              <text x={x + 6} y={y + 4} textAnchor="middle">{r}</text>
            </g>
          </g>
        );
      })}
      <g className="lb-p" style={v({ "--dl": ".1s" })}>
        <circle className="lb-core" cx={cx} cy={cy} r="32" />
        <text className="lb-oktxt" x={cx} y={cy + 4} textAnchor="middle">Change</text>
      </g>
      <text className="lb-p lb-note" x={cx} y="308" textAnchor="middle" style={v({ "--dl": "3.2s" })}>{EPC.stage.impact.note}</text>
    </svg>
  );
}

/* 05 · BOQ, cost & procurement: approved engineering becomes quantities, then supplier-ready packages */
function SceneBoq() {
  const items = [["Primary frames", 130], ["Purlins & girts", 92], ["Cladding", 110], ["Fasteners", 56], ["Erection", 76]];
  return (
    <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMid meet">
      <g className="lb-s" style={v({ "--dl": "0s", "--dx": "-40px" })}>
        <rect className="lb-card" x="24" y="34" width="276" height="246" rx="14" />
        <text x="40" y="58">BOQ / BOM</text>
        {items.map(([t, w], i) => (
          <g key={t}>
            <text className="lb-small" x="40" y={96 + i * 36}>{t}</text>
            <rect className="lb-track" x="150" y={87 + i * 36} width="130" height="8" rx="4" />
            <rect className={i % 2 ? "lb-g lb-fillt" : "lb-g lb-fillm"} x="150" y={87 + i * 36} width={w} height="8" rx="4" style={v({ "--dl": `${0.5 + i * 0.2}s`, "--t": ".8s" })} />
          </g>
        ))}
      </g>
      <path className="lb-d lb-link" pathLength="1" d="M300 150H330" style={v({ "--dl": "1.6s", "--t": ".5s" })} />
      {["Package A", "Package B", "Package C"].map((t, i) => (
        <g key={t} className="lb-s" style={v({ "--dl": `${1.7 + i * 0.22}s`, "--dx": "60px" })}>
          <rect className="lb-card" x="330" y={44 + i * 76} width="132" height="64" rx="12" />
          <text x="344" y={68 + i * 76}>{t}</text>
          <rect className="lb-line" x="344" y={80 + i * 76} width="76" height="5" rx="2.5" />
          <rect className="lb-line" x="344" y={92 + i * 76} width="50" height="5" rx="2.5" />
        </g>
      ))}
      <g className="lb-p" style={v({ "--dl": "3s" })}>
        <rect className="lb-pill lb-ok" x="372" y="107" width="86" height="26" rx="13" />
        <text className="lb-oktxt" x="415" y="124" textAnchor="middle">Best fit</text>
      </g>
      <text className="lb-p lb-note" x="330" y="300" style={v({ "--dl": "3.4s" })}>Technical context intact</text>
    </svg>
  );
}

/* 06 · Execution control: four threads read as one story, and a delay is flagged before it hits site */
function SceneExec() {
  const rows = [["Cost", 230], ["Schedule", 190, true], ["Supply", 262], ["Quality", 300]];
  return (
    <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMid meet">
      {rows.map(([t, w, flag], i) => (
        <g key={t}>
          <text x="24" y={86 + i * 56}>{t}</text>
          <rect className="lb-track" x="110" y={74 + i * 56} width="330" height="16" rx="8" />
          <rect className={flag ? "lb-g lb-delay" : "lb-g lb-fillm"} x="110" y={74 + i * 56} width={w} height="16" rx="8" style={v({ "--dl": `${0.2 + i * 0.2}s`, "--t": ".9s" })} />
        </g>
      ))}
      <line className="lb-now" x1="110" y1="44" x2="110" y2="290" style={v({ "--nx": "250px" })} />
      <g className="lb-tagA">
        <rect className="lb-pill lb-warn" x="226" y="104" width="170" height="26" rx="13" />
        <text className="lb-warntxt" x="311" y="121" textAnchor="middle">Potential delay flagged</text>
      </g>
      <g className="lb-tagB">
        <rect className="lb-pill lb-ok" x="226" y="104" width="170" height="26" rx="13" />
        <text className="lb-oktxt" x="311" y="121" textAnchor="middle">Resolved before site</text>
      </g>
    </svg>
  );
}

export default function CapabilityLab({ items, icons, bd }) {
  const scenes = [<SceneDocs />, <SceneModel bd={bd} />, <SceneAlt />, <SceneImpact />, <SceneBoq />, <SceneExec />];
  const N = items.length;
  return (
    <div className="ps-lab">
      <div className="ps-lab-stage">
        <div className="ps-lab-side">
          <ol className="ps-lab-rail">
            {items.map((it, i) => {
              const Ic = icons[it.icon];
              return (
                <li key={it.title} className={`ps-lab-tab${i === 0 ? " on" : ""}`} style={v({ "--p": 0 })}>
                  <button type="button" className="ps-lab-hd" data-i={i}>
                    <span className="ps-lab-ti" aria-hidden="true"><Ic /></span>
                    <span className="ps-lab-tt">{it.title}</span>
                    <span className="ps-lab-tn" aria-hidden="true">{pad2(i + 1)}</span>
                  </button>
                  <div className="ps-lab-more"><div><p>{it.text}</p></div></div>
                  <i className="ps-lab-prog" aria-hidden="true" />
                </li>
              );
            })}
          </ol>
          <div className="ps-lab-dots" aria-hidden="true">
            {items.map((it, i) => <i key={it.title} data-i={i} className={i === 0 ? "on" : ""} />)}
          </div>
        </div>

        <div className="ps-lab-view" aria-hidden="true">
          <i className="ps-lab-halo" />
          <div className="ps-lab-tilt">
            <div className="ps-lab-idle">
              <div className="ps-lab-panel">
                <div className="ps-lab-top">
                  <i /><i /><i />
                  <b>DIYVA</b>
                  <span className="ps-lab-st">{items[0].title}</span>
                  <em className="ps-lab-count"><b>01</b> / {pad2(N)}</em>
                </div>
                <div className="ps-lab-scenes">
                  {scenes.map((s, i) => <div key={i} className="ps-lab-scene">{s}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
