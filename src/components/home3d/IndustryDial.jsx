import { useEffect, useRef } from "react";

// One entry per industry. The stage shows the matching building as a blueprint line-drawing while that industry is in focus.
export const INDUSTRY_DATA = [
  { name: "Warehouses & Logistics", sub: "Wide clear spans · dock-ready" },
  { name: "Manufacturing", sub: "Production halls built for flow" },
  { name: "Pharmaceutical", sub: "Clean, controlled environments" },
  { name: "Commercial", sub: "Offices, showrooms & retail" },
  { name: "Industrial", sub: "Heavy-duty, crane-ready frames" },
];

// Blueprint scenes, drawn in a 200 x 150 box with the ground line at y = 124.
// .f = filled body, .ac = teal detail, .wh = white highlight, .dim = faint grid, .sm = smoke
const SCENES = [
  // Warehouses & logistics: low-pitch shed, dock doors, truck
  <g key="w">
    <path className="f" d="M20 86h116v38H20z" />
    <path d="M16 87L78 66l62 21" />
    <path d="M28 100h24v24H28zM58 100h24v24H58zM88 100h24v24H88z" />
    <path className="ac" d="M28 108h24M28 114h24M28 120h24M58 108h24M58 114h24M58 120h24M88 108h24M88 114h24M88 120h24" />
    <path d="M146 98h30v22h-30zM176 106h10l6 8v6h-16z" />
    <circle cx="154" cy="121" r="3.5" /><circle cx="168" cy="121" r="3.5" /><circle cx="186" cy="121" r="3.5" />
  </g>,
  // Manufacturing: saw-tooth roof, chimney, strip windows
  <g key="m">
    <path className="f" d="M22 96h140v28H22z" />
    <path d="M22 96V78l30 18V78l30 18V78l30 18V78l30 18V78l20 18" />
    <path d="M168 124V50h12v74" />
    <path className="ac" d="M168 60h12M168 70h12M30 106h14v8H30zM58 106h14v8H58zM86 106h14v8H86zM114 106h14v8h-14zM142 106h14v8h-14z" />
    <circle className="sm" cx="176" cy="40" r="4" /><circle className="sm s2" cx="183" cy="29" r="6" />
  </g>,
  // Pharmaceutical: clean-room block, roof plant, cross emblem, flask
  <g key="p">
    <path className="f" d="M30 76h130v48H30z" />
    <path d="M44 76V66h26v10M96 76V62h32v14" />
    <circle className="ac" cx="112" cy="69" r="4.5" />
    <path className="ac" d="M50 66v-6M56 66v-6M62 66v-6" />
    <circle cx="95" cy="100" r="15" />
    <path className="wh" d="M95 92v16M87 100h16" />
    <path d="M40 96h30v14H40zM55 96v14M120 96h30v14h-30zM135 96v14" />
    <path className="ac" d="M173 80h12M176 80v12l-9 16a2.5 2.5 0 0 0 2.2 3.6h19.6a2.5 2.5 0 0 0 2.2-3.6l-9-16V80M170 104h18" />
  </g>,
  // Commercial: glazed tower with two wings and a mast
  <g key="c">
    <path className="f" d="M70 30h60v94H70z" />
    <path d="M28 84h42v40H28zM130 70h40v54h-40z" />
    <path className="dim" d="M70 44h60M70 58h60M70 72h60M70 86h60M70 100h60M85 30v94M100 30v94M115 30v94M28 98h42M28 112h42M130 84h40M130 98h40M130 112h40" />
    <path d="M100 30V14" /><circle cx="100" cy="12" r="2" />
    <path className="wh" d="M92 124v-14h16v14" />
  </g>,
  // Industrial: steep portal-frame shed with an overhead crane
  <g key="i">
    <path className="f" d="M22 124V88L100 58l78 30v36z" />
    <path d="M62 124V73M138 124V73" />
    <path className="dim" d="M62 73l38 26 38-26" />
    <path className="ac" d="M24 98h152" />
    <path d="M88 94h24v8H88zM100 102v14" />
    <path className="wh" d="M92 116h16v8H92z" />
  </g>,
];

/**
 * Stage card for the Industries section: blueprint scene + caption + step bars. It holds no state of its own:
 * animateIndustries() toggles `.on` on the nodes as the scroll timeline moves through the five industries.
 */
export default function IndustryStage() {
  const art = useRef(null);

  // Measure every stroke once so the "draw-in" works in every browser (no pathLength reliance).
  useEffect(() => {
    art.current?.querySelectorAll(".ix-scene :is(path, circle):not(.sm)").forEach((el, i) => {
      try { el.style.setProperty("--len", Math.ceil(el.getTotalLength()) + 2); } catch { /* leave undashed */ }
      el.style.setProperty("--k", i % 28);
    });
  }, []);

  return (
    <div className="ix-stage" aria-hidden="true">
      <div className="ix-stage-in">
        <span className="ix-corner tl" /><span className="ix-corner tr" /><span className="ix-corner bl" /><span className="ix-corner br" />
        <div className="ix-count"><b className="ix-count-n">01</b><span> / {String(INDUSTRY_DATA.length).padStart(2, "0")}</span></div>

        <svg className="ix-art" viewBox="0 0 200 150" ref={art} preserveAspectRatio="xMidYMid meet">
          <path className="ix-ground" d="M8 124h184" />
          <path className="ix-ground2" d="M24 131h152" />
          {SCENES.map((sc, i) => <g className="ix-scene" key={i}>{sc}</g>)}
        </svg>

        <div className="ix-cap">
          {INDUSTRY_DATA.map((d) => (
            <div className="ix-c" key={d.name}>
              <b>{d.name}</b>
              <span>{d.sub}</span>
            </div>
          ))}
        </div>

        <div className="ix-bars">
          {INDUSTRY_DATA.map((d) => <i className="ix-seg" key={d.name} />)}
        </div>
      </div>
    </div>
  );
}
