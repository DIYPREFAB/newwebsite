import { EPC } from "./psData";
import BrandText from "../../common/BrandText";

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

/* 03 · Design alternatives: a weighted scorecard, one card per concept (modelled on the concept-comparison board).

   HOW THE MARKS WORK (edit ALT_PARAMS and everything below follows: bars, totals, verdicts, ranking)
   - Every factor is scored 0-5 per concept.
   - dir "up"   = a BENEFIT (structure, lifecycle, quality, maintainability, material efficiency, utility):
                  more points is better and counts as-is.
   - dir "down" = a LOAD (schedule, cost): more points means a longer programme / a bigger bill, so it must never
                  help a concept. It is drawn as a load bar and counts toward the total as (5 - points).
                  A concept can therefore never gain marks by being slower or dearer.
   - "w" is an optional weight (default 1) if the client wants one factor to matter more.
   Scores are ILLUSTRATIVE. The verdict is not typed in: the highest total is SELECTED, the next is FALLBACK and the
   rest are REJECTED, so the badges can never disagree with the numbers. */
const ALT_MAX = 5;
const ALT_CONCEPTS = [
  { k: "A", kind: "clear", g: "psAltA" },
  { k: "B", kind: "cols", g: "psAltB" },
  { k: "C", kind: "saw", g: "psAltC" },
];
const ALT_PARAMS = [
  { label: "Structural Performance", ic: "shield", dir: "up", s: [4.6, 4.1, 3.9] },
  { label: "Lifecycle", ic: "cycle", dir: "up", s: [4.4, 4.3, 2.9] },
  { label: "Quality", ic: "medal", dir: "up", s: [4.5, 4.0, 3.6] },
  { label: "Maintainability", ic: "wrench", dir: "up", s: [4.2, 4.2, 3.0] },
  { label: "Material Efficiency", ic: "cube", dir: "up", s: [4.5, 3.5, 3.4] },
  { label: "Utility", ic: "grid", dir: "up", s: [4.3, 3.7, 3.2] },
  { label: "Schedule", ic: "clock", dir: "down", s: [2.0, 3.6, 4.1] },
  { label: "Cost", ic: "coin", dir: "down", s: [3.0, 2.4, 3.4] },
];
const altPts = (p, j) => (p.dir === "down" ? ALT_MAX - p.s[j] : p.s[j]) * (p.w ?? 1);
const ALT_OUT = ALT_PARAMS.reduce((a, p) => a + ALT_MAX * (p.w ?? 1), 0);
const ALT_TOTALS = ALT_CONCEPTS.map((_, j) => ALT_PARAMS.reduce((a, p) => a + altPts(p, j), 0));
const ALT_RANK = ALT_TOTALS.map((t) => ALT_TOTALS.filter((u) => u > t).length); // 0 = best
const ALT_VERDICT = [
  { text: "SELECTED", tone: "ok" },
  { text: "FALLBACK", tone: "mid" },
  { text: "REJECTED", tone: "no" },
];

// 14x14 line icons, one per factor
const ALT_ICONS = {
  shield: "M7 1.6 12 3.6v3.6c0 2.7-2 4.6-5 5.8-3-1.2-5-3.1-5-5.8V3.6z",
  cycle: "M11.8 7A4.8 4.8 0 1 1 10.4 3.6M11.9 1.8v2.8H9.1",
  medal: "M7 1.8a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4zM5.4 10l-.9 3L7 11.8 9.5 13l-.9-3M5.3 6l1.2 1.2L8.8 4.9",
  wrench: "M9.6 1.8a3 3 0 0 0-2.7 4.1L2 10.8 3.2 12l4.9-4.9A3 3 0 0 0 12.2 4.4L10.4 6.2 8.9 5.7 8.4 4.2 10.2 2.4z",
  cube: "M7 1.5 12 4v6L7 12.5 2 10V4zM2 4l5 2.5L12 4M7 6.5v6",
  grid: "M2 2h10v10H2zM2 7h10M7 7v5",
  clock: "M7 1.8a5.2 5.2 0 1 0 0 10.4A5.2 5.2 0 0 0 7 1.8zM7 4.2V7l2 1.3",
  coin: "M7 1.8a5.2 5.2 0 1 0 0 10.4A5.2 5.2 0 0 0 7 1.8zM7 4v6M8.7 5.3c-.4-.5-1-.7-1.7-.7-.9 0-1.6.4-1.6 1.1 0 1.5 3.3.7 3.3 2.3 0 .7-.7 1.2-1.7 1.2-.7 0-1.3-.3-1.7-.8",
};

// tiny warehouse line-drawings (front gable + side wall), one silhouette per concept idea
function altShed(kind) {
  const d = [];
  const t = (i, n) => i / (n + 1);
  const side = (n) => {
    let ribs = "", roof = "";
    for (let i = 1; i <= n; i++) {
      const u = t(i, n), x = 54 + 50 * u;
      ribs += `M${x} ${34 - 6 * u}V${20 - 6 * u}`;
      roof += `M${x} ${20 - 6 * u}L${31 + 50 * u} ${11 - 6 * u}`;
    }
    return [ribs, roof];
  };
  if (kind === "saw") {
    d.push("M8 34V20L19 12V20L30 12V20L41 12V20H54V34Z");
    d.push("M54 34L104 28V14L54 20");
    d.push("M19 12L69 6M30 12L80 6M41 12L91 6M54 20L104 14");
    d.push(side(5)[0]);
  } else {
    d.push("M8 34V20L31 11L54 20V34Z");
    d.push("M54 34L104 28V14L54 20");
    d.push("M31 11L81 5L104 14M54 20L104 14");
    const [ribs, roof] = side(5);
    d.push(ribs, roof);
    if (kind === "cols") d.push("M23 34V17M39 34V17"); // internal columns: not a clear span
  }
  return d;
}

function SceneAlt() {
  const CX = [186, 324, 462], CW = 130, CTOP = 28, CH = 440;
  const ROW0 = 132, RH = 29;
  const BX = 10, BW = 74;
  const yRow = (i) => ROW0 + i * RH + (i >= 6 ? 6 : 0); // a small gap before the two load rows
  const loadFrom = ALT_PARAMS.findIndex((p) => p.dir === "down");
  const totalTop = yRow(ALT_PARAMS.length - 1) + RH + 8;
  const grads = [["psAltA", "#1fb8a4", "#8ff0da"], ["psAltB", "#3b82f6", "#8cc8ff"], ["psAltC", "#8b6cf0", "#c8b4ff"], ["psAltL", "#f2a43a", "#ff7d7d"]];
  return (
    <svg viewBox="0 0 620 520" preserveAspectRatio="xMidYMid meet">
      <defs>
        {grads.map(([id, a, b]) => (
          <linearGradient key={id} id={id} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
      </defs>

      <g className="lb-p" style={v({ "--dl": "0s" })}>
        <text className="lb-eyebrow" x="24" y="16">EXAMPLE · CONCEPT SELECTION</text>
      </g>
      <g className="lb-p" style={v({ "--dl": ".15s" })}>
        <rect x="346" y="8" width="8" height="8" rx="2" fill="url(#psAltA)" />
        <text className="lb-a-leg" x="359" y="15.5">Benefit · higher is better</text>
        <rect x="490" y="8" width="8" height="8" rx="2" fill="url(#psAltL)" />
        <text className="lb-a-leg" x="503" y="15.5">Load · lower is better</text>
      </g>

      {/* concept cards */}
      {ALT_CONCEPTS.map((c, j) => {
        const best = ALT_RANK[j] === 0, vd = ALT_VERDICT[Math.min(ALT_RANK[j], 2)];
        const cx = CX[j], mid = cx + CW / 2;
        const sh = altShed(c.kind);
        return (
          <g key={c.k} className={ALT_RANK[j] >= 2 ? "lb-dim" : ""}>
            <g className="lb-s" style={v({ "--dl": `${0.1 + j * 0.12}s`, "--dx": "0px", "--dy": "18px" })}>
              <rect className={best ? "lb-a-card lb-a-best" : "lb-a-card"} x={cx} y={CTOP} width={CW} height={CH} rx="16" />
              {best && <rect className="lb-a-top" x={cx + 1} y={CTOP + 1} width={CW - 2} height="3" rx="1.5" />}
            </g>

            {/* silhouette */}
            <g transform={`translate(${cx + 11} ${CTOP + 12})`} style={{ stroke: `var(--c${c.k})` }}>
              {sh.map((dd, i) => <path key={i} className="lb-d lb-a-shed" pathLength="1" d={dd} style={v({ "--dl": `${0.5 + j * 0.12 + i * 0.07}s`, "--t": ".9s" })} />)}
            </g>

            <g className="lb-p" style={v({ "--dl": `${0.55 + j * 0.12}s` })}>
              <text className="lb-ch" x={mid} y={CTOP + 72} textAnchor="middle">Concept {c.k}</text>
              <rect className={`lb-vd lb-vd-${vd.tone}`} x={mid - 36} y={CTOP + 80} width="72" height="17" rx="8.5" />
              <text className={`lb-vdt lb-vdt-${vd.tone}`} x={mid} y={CTOP + 91.8} textAnchor="middle">{vd.text}</text>
            </g>
          </g>
        );
      })}

      {/* tint behind the two load rows */}
      <g className="lb-p" style={v({ "--dl": "1.3s" })}>
        <rect className="lb-a-loadband" x="16" y={yRow(loadFrom) - 1} width="588" height={RH * 2 - 1} rx="10" />
      </g>

      {/* factor rows */}
      {ALT_PARAMS.map((p, i) => {
        const y = yRow(i), cy = y + RH / 2 - 0.5, load = p.dir === "down";
        return (
          <g key={p.label}>
            <g className="lb-s" style={v({ "--dl": `${0.6 + i * 0.09}s`, "--dx": "-22px" })}>
              <g transform={`translate(24 ${cy - 7})`}><path className={load ? "lb-a-ic lb-a-ic-l" : "lb-a-ic"} d={ALT_ICONS[p.ic]} /></g>
              <text className="lb-rl" x="46" y={load ? cy - 0.5 : cy + 4}>{p.label}</text>
              {load && <text className="lb-a-sub" x="46" y={cy + 9.5}>load · lower is better</text>}
              {i < ALT_PARAMS.length - 1 && i !== loadFrom - 1 && <line className="lb-rowline" x1="24" y1={y + RH} x2="176" y2={y + RH} />}
            </g>
            {ALT_CONCEPTS.map((c, j) => {
              const s = p.s[j];
              return (
                <g key={c.k}>
                  <rect className="lb-track" x={CX[j] + BX} y={cy - 3} width={BW} height="6" rx="3" />
                  <rect className="lb-g" x={CX[j] + BX} y={cy - 3} width={(BW * s) / ALT_MAX} height="6" rx="3" fill={`url(#${load ? "psAltL" : c.g})`} style={v({ "--dl": `${0.85 + i * 0.09 + j * 0.05}s`, "--t": ".8s" })} />
                  <g className="lb-p" style={v({ "--dl": `${1 + i * 0.09 + j * 0.05}s` })}>
                    <text className={load ? "lb-a-val lb-a-val-l" : "lb-a-val"} x={CX[j] + CW - 10} y={cy + 4} textAnchor="end">{s.toFixed(1)}</text>
                  </g>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* totals */}
      {ALT_CONCEPTS.map((c, j) => {
        const best = ALT_RANK[j] === 0, cx = CX[j], tot = ALT_TOTALS[j];
        return (
          <g key={c.k} className={ALT_RANK[j] >= 2 ? "lb-dim" : ""}>
          <g className="lb-p" style={v({ "--dl": `${1.9 + j * 0.15}s` })}>
            <line className="lb-rowline" x1={cx + 12} y1={totalTop} x2={cx + CW - 12} y2={totalTop} />
            <text className="lb-a-tl" x={cx + 12} y={totalTop + 17}>TOTAL SCORE</text>
            <text className={best ? "lb-a-big lb-a-big-best" : "lb-a-big"} x={cx + 12} y={totalTop + 46}>{tot.toFixed(1)}</text>
            <text className="lb-a-of" x={cx + CW - 12} y={totalTop + 46} textAnchor="end">/ {ALT_OUT}</text>
            <rect className="lb-track" x={cx + 12} y={totalTop + 56} width={CW - 24} height="4" rx="2" />
            <rect className="lb-g" x={cx + 12} y={totalTop + 56} width={((CW - 24) * tot) / ALT_OUT} height="4" rx="2" fill={best ? "url(#psAltA)" : "rgba(168,218,220,.5)"} style={v({ "--dl": `${2.1 + j * 0.15}s`, "--t": ".9s" })} />
            <text className="lb-a-ex" x={cx + 12} y={totalTop + 77}>Example score</text>
          </g>
          </g>
        );
      })}

      <g className="lb-p" style={v({ "--dl": "2.6s" })}>
        <text className="lb-a-foot" x="24" y="490">Schedule and Cost are scored as load: every extra point lowers the total (counted as 5 − score).</text>
        <text className="lb-a-foot lb-a-foot-ex" x="24" y="508">Example values for illustration only. Not validated engineering results or a project recommendation.</text>
      </g>
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
        <rect className="lb-pill lb-ok" x="388" y="109" width="70" height="22" rx="11" />
        <text className="lb-oktxt" x="423" y="124" textAnchor="middle">Best fit</text>
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

// Text equivalent of the animated concept scorecard (the SVG is aria-hidden). Built from the same ALT_* data, so the numbers,
// totals and ranking can never differ from what is drawn. Visually hidden (.ps-lab-sr) but read by screen readers.
function AltScorecardSummary() {
  const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  return (
    <section className="ps-lab-sr" aria-labelledby="ps-alt-sr-h">
      <h3 id="ps-alt-sr-h">Concept selection scorecard (illustrative example)</h3>
      <p>
        Example values for illustration only. These are not validated engineering results or a project recommendation. Each factor is scored from 0 to {ALT_MAX}.
        Schedule and Cost are loads, so a lower score is better and each counts toward the total as {ALT_MAX} minus the score.
      </p>
      <table>
        <caption>Illustrative scores for three example concepts</caption>
        <thead>
          <tr>
            <th scope="col">Factor</th>
            <th scope="col">Type</th>
            {ALT_CONCEPTS.map((c) => <th scope="col" key={c.k}>Concept {c.k}</th>)}
          </tr>
        </thead>
        <tbody>
          {ALT_PARAMS.map((p) => (
            <tr key={p.label}>
              <th scope="row">{p.label}{p.w && p.w !== 1 ? ` (weight ${p.w})` : ""}</th>
              <td>{p.dir === "down" ? "Load, lower is better" : "Benefit, higher is better"}</td>
              {p.s.map((sc, j) => <td key={ALT_CONCEPTS[j].k}>{sc.toFixed(1)} out of {ALT_MAX}</td>)}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total score</th>
            <td>Out of {fmt(ALT_OUT)}</td>
            {ALT_TOTALS.map((t, j) => <td key={ALT_CONCEPTS[j].k}>{t.toFixed(1)} out of {fmt(ALT_OUT)}</td>)}
          </tr>
          <tr>
            <th scope="row">Example ranking</th>
            <td>By total score</td>
            {ALT_RANK.map((r, j) => (
              <td key={ALT_CONCEPTS[j].k}>Rank {r + 1} of {ALT_CONCEPTS.length}: {ALT_VERDICT[Math.min(r, 2)].text.toLowerCase()} in this example</td>
            ))}
          </tr>
        </tfoot>
      </table>
    </section>
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
                  <b><BrandText text="DIYVA" /></b>
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
      <AltScorecardSummary />
    </div>
  );
}