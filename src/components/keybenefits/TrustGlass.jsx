import { useEffect, useRef } from "react";
import { FaHardHat, FaRulerCombined, FaTools } from "react-icons/fa";
import { glassState } from "../home3d/GlassCore";
import { RESPECT_REDUCED_MOTION } from "./keybenefitsData";
import "./trustglass.css";

/**
 * BuildGlass: a glass tower crane lifting prefab modules onto a blueprint plate.
 * Load-in: the crane rises and the first module is lowered into place.
 * Scroll:  the scene orbits while the crane swings, picks up and stacks the next two modules.
 * Pure CSS 3D (no extra dependencies). Reads the same `glassState.p` the hero already drives
 * (0 -> 0.9 on load, then up to ~2.2 while scrolling through the hero).
 * Units: 1u = 1% of the scene width. x/y run across the plate (0..100), z is up.
 */

const MAST = { x: 50, y: 10, H: 60, w: 6 };
const JIB = { back: 20, front: 76, h: 5, w: 4 };
const MOD = { w: 30, d: 20, h: 14 };
const SLOTS = [
  { x: 10, y: 60, z: 0, tint: "47, 212, 192" },
  { x: 48, y: 60, z: 0, tint: "108, 182, 255" },
  { x: 10, y: 60, z: 14, tint: "168, 218, 220" },
].map((s) => ({ ...s, cx: s.x + MOD.w / 2, cy: s.y + MOD.d / 2 }));

// timeline (in glassState.p units)
const SW = [[0, 0.28], [0.9, 1.1], [1.5, 1.7]]; // jib swings to slot k (module hangs from the hook)
const LO = [[0.28, 0.74], [1.1, 1.45], [1.7, 2.05]]; // module k is lowered into place
const HANG = 30; // z of a hanging module's underside
const RISE = 0.06; // hook climbs back up after a drop
const FADE = 0.08; // next module fades in on the hook

const POSE = SLOTS.map((s) => {
  const dx = s.cx - MAST.x, dy = s.cy - MAST.y;
  return { phi: Math.atan2(dy, dx), r: Math.hypot(dx, dy) };
});
const START = { phi: POSE[0].phi - 1.15, r: 30 };

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeIO = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const U = (n) => `calc(var(--u) * ${n})`;

/* lattice paths drawn in unit coordinates, stretched to the face with non-scaling strokes */
const mastPath = (w, h, bay) => {
  const n = Math.round(h / bay), by = h / n;
  let d = `M0 0V${h}M${w} 0V${h}`;
  for (let i = 0; i <= n; i++) d += `M0 ${i * by}H${w}`;
  for (let i = 0; i < n; i++) d += i % 2 ? `M0 ${i * by}L${w} ${(i + 1) * by}` : `M${w} ${i * by}L0 ${(i + 1) * by}`;
  return d;
};
const jibPath = (len, h, bay) => {
  const n = Math.round(len / bay), bx = len / n;
  let d = `M0 0H${len}M0 ${h}H${len}`;
  for (let i = 0; i <= n; i++) d += `M${i * bx} 0V${h}`;
  for (let i = 0; i < n; i++) d += i % 2 ? `M${i * bx} 0L${(i + 1) * bx} ${h}` : `M${i * bx} ${h}L${(i + 1) * bx} 0`;
  return d;
};
const MAST_D = mastPath(MAST.w, MAST.H, 6);
const JIB_LEN = JIB.back + JIB.front;
const JIB_D = jibPath(JIB_LEN, JIB.h, 5);
const APEX = 15;
const STAY_D = `M${JIB.back} 0L${JIB.back + JIB.front * 0.62} ${APEX}M${JIB.back} 0L${JIB.back * 0.05} ${APEX}M${JIB.back} 0V${APEX}`;

const Lattice = ({ d, w, h }) => (
  <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
    <path className="g" d={d} /><path className="l" d={d} />
  </svg>
);

const Box = ({ w, d, h, cls = "", style, children }) => (
  <div className={`tg-box ${cls}`} style={{ "--w": w, "--d": d, "--h": h, ...style }}>
    <i className="t" /><i className="f" /><i className="k" /><i className="l" /><i className="r" />
    {children}
  </div>
);

const TOKENS = [
  { Icon: FaHardHat, delay: 0 },
  { Icon: FaRulerCombined, delay: -6 },
  { Icon: FaTools, delay: -12 },
];

export default function TrustGlass() {
  const root = useRef(null);
  const scene = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const reduce = RESPECT_REDUCED_MOTION && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;

    const measure = () => el.style.setProperty("--u", `${(scene.current?.offsetWidth || 400) / 100}px`);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => { ptr.tx = (e.clientX / innerWidth - 0.5) * 2; ptr.ty = (e.clientY / innerHeight - 0.5) * 2; };
    if (fine && !reduce) window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; el.classList.toggle("is-paused", !visible); });
    io.observe(el);

    const sway = fine ? 3.5 : 7;
    const memo = {};
    const set = (k, v) => {
      const val = typeof v === "number" ? v.toFixed(3) : v;
      if (memo[k] === val) return; // skip untouched values: far fewer style recalculations on phones
      memo[k] = val;
      el.style.setProperty(k, val);
    };
    const cur = { p: reduce ? glassState.p : 0 };
    let raf;
    let lastY = window.scrollY, vel = 0; // touch screens have no mouse, so scroll speed tilts the scene instead

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = reduce ? 0 : now;
      cur.p += (glassState.p - cur.p) * 0.12;
      if (!fine && !reduce) {
        const y = window.scrollY;
        vel += (y - lastY - vel) * 0.15;
        lastY = y;
        ptr.tx = clamp(vel / 35, -1, 1);
        ptr.ty = clamp(vel / 28, -1, 1) * 1.5;
      }
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;
      const P = cur.p;
      const e = easeOut(clamp(P / 0.9));
      const s = clamp((P - 0.9) / 1.3);

      /* camera: spins in on load, orbits while scrolling */
      set("--rx", 60 + (1 - e) * 10 - s * 9 - ptr.y * 4 + (fine ? 0 : Math.sin(t * 0.0003) * 2.5));
      set("--rz", -12 - (1 - e) * 80 + s * 40 + Math.sin(t * 0.0004) * sway + ptr.x * 8);
      set("--sc", 0.62 + 0.38 * e - s * 0.05);
      set("--ee", e);
      set("--rise", easeOut(clamp(P / 0.5))); // crane grows out of the plate

      /* crane pose (jib angle + trolley reach) */
      let phi = START.phi, r = START.r;
      SW.forEach(([a, b], k) => {
        if (P < a) return;
        const from = k === 0 ? START : POSE[k - 1];
        const m = easeIO(clamp((P - a) / (b - a)));
        phi = lerp(from.phi, POSE[k].phi, m);
        r = lerp(from.r, POSE[k].r, m);
      });
      const tx = MAST.x + r * Math.cos(phi);
      const ty = MAST.y + r * Math.sin(phi);
      set("--ja", (phi * 180) / Math.PI);
      set("--tr", r);
      set("--cx", tx);
      set("--cy", ty);

      /* modules + hook */
      const hangTop = HANG + MOD.h;
      let hz = hangTop;
      SLOTS.forEach((sl, k) => {
        const d = clamp((P - LO[k][0]) / (LO[k][1] - LO[k][0]));
        const z = P < LO[k][0] ? HANG : lerp(HANG, sl.z, easeIO(d));
        const fadeAt = k === 0 ? 0 : LO[k - 1][1] + RISE;
        const o = clamp((P - fadeAt) / (k === 0 ? 0.08 : FADE));
        const carried = k === SLOTS.length - 1 || P < SW[k + 1][0];
        const px = carried ? tx : sl.cx;
        const py = carried ? ty : sl.cy;
        set(`--m${k}x`, px - MOD.w / 2);
        set(`--m${k}y`, py - MOD.d / 2);
        set(`--m${k}z`, z);
        set(`--m${k}o`, o);
        set(`--f${k}`, d >= 1 ? clamp(1 - (P - LO[k][1]) / 0.2) : 0); // landing flash
        set(`--s${k}`, d > 0 ? 1 : 0.55);
        // hook follows its module while it is carried / lowered, then climbs back up
        if (P >= SW[k][0] && P <= LO[k][1]) hz = z + MOD.h;
        else if (P > LO[k][1]) hz = lerp(sl.z + MOD.h, hangTop, easeIO(clamp((P - LO[k][1]) / RISE)));
      });
      const cz = MAST.H - 3.4;
      set("--hz", hz);
      set("--cl", Math.max(0.5, cz - hz));
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="tg" ref={root} aria-hidden="true">
      <i className="tg-glow" />
      <div className="tg-scene" ref={scene}>
        <i className="tg-shadow" />

        {/* ---- blueprint plate ---- */}
        <div className="tg-plate a">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <g className="dim">
              <path d="M10 90H78M10 87V93M78 87V93M5 60V80M2 60H8M2 80H8" />
              <path className="dash" d="M50 10V60M50 10L25 70M50 10L63 70" />
            </g>
            <text x="44" y="95.5">24.0 m</text>
            <text x="3.2" y="72" transform="rotate(-90 3.2 72)">6.0 m</text>
          </svg>
          {SLOTS.slice(0, 2).map((s, k) => (
            <i
              className="tg-slot"
              key={k}
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${MOD.w}%`, height: `${MOD.d}%`, "--t": s.tint, "--fl": `var(--f${k})` }}
            />
          ))}
        </div>

        {/* ---- tower crane ---- */}
        <div className="tg-up mast" style={{ transform: `translate3d(${U(MAST.x)}, ${U(MAST.y)}, 0) rotateX(-90deg) scaleY(var(--rise))` }}>
          {[0, 90, 180, 270].map((a) => (
            <div
              className="tg-face"
              key={a}
              style={{ left: U(-MAST.w / 2), top: U(-MAST.H), width: U(MAST.w), height: U(MAST.H), transform: `rotateY(${a}deg) translateZ(${U(MAST.w / 2)})` }}
            >
              <Lattice d={MAST_D} w={MAST.w} h={MAST.H} />
            </div>
          ))}
        </div>

        <div className="tg-jib" style={{ transform: `translate3d(${U(MAST.x)}, ${U(MAST.y)}, calc(${U(MAST.H)} * var(--rise))) rotateZ(calc(var(--ja) * 1deg))` }}>
          <Box w={9} d={9} h={3.4} cls="slew" style={{ left: U(-4.5), top: U(-4.5), transform: `translateZ(${U(-3.4)})` }} />
          <div className="tg-up">
            {[JIB.w / 2, -JIB.w / 2].map((z) => (
              <div className="tg-face" key={z} style={{ left: U(-JIB.back), top: U(-JIB.h), width: U(JIB_LEN), height: U(JIB.h), transform: `translateZ(${U(z)})` }}>
                <Lattice d={JIB_D} w={JIB_LEN} h={JIB.h} />
              </div>
            ))}
            {[0.7, -0.7].map((z) => (
              <div className="tg-face stay" key={z} style={{ left: U(-JIB.back), top: U(-JIB.h - APEX), width: U(JIB_LEN), height: U(APEX), transform: `translateZ(${U(z)})` }}>
                <svg viewBox={`0 0 ${JIB_LEN} ${APEX}`} preserveAspectRatio="none" aria-hidden="true">
                  <path className="g" d={STAY_D} /><path className="l" d={STAY_D} />
                </svg>
              </div>
            ))}
          </div>
          <Box w={7} d={5} h={5} cls="cw" style={{ left: U(-JIB.back - 1), top: U(-2.5), transform: `translateZ(${U(-4.6)})` }} />
          <Box w={3.4} d={3.4} h={2.2} cls="trolley" style={{ left: `calc((var(--tr) - 1.7) * var(--u))`, top: U(-1.7), transform: `translateZ(${U(-2.4)})` }} />
        </div>

        {/* cable + hook follow the trolley */}
        <div className="tg-pt" style={{ transform: `translate3d(calc(var(--cx) * var(--u)), calc(var(--cy) * var(--u)), ${U(MAST.H - 3.4)}) rotateX(-90deg)` }}>
          {[0, 90].map((a) => (
            <i className="tg-cable" key={a} style={{ height: `calc(var(--cl) * var(--u))`, transform: `rotateY(${a}deg)` }} />
          ))}
        </div>
        <div className="tg-pt" style={{ transform: `translate3d(calc(var(--cx) * var(--u)), calc(var(--cy) * var(--u)), calc(var(--hz) * var(--u)))` }}>
          <div className="tg-bb"><span className="tg-hook" /></div>
        </div>

        {/* ---- prefab modules ---- */}
        {SLOTS.map((s, k) => (
          <Box
            key={k}
            w={MOD.w}
            d={MOD.d}
            h={MOD.h}
            cls="mod"
            style={{
              left: 0, top: 0, "--t": s.tint, "--o": `var(--m${k}o)`,
              transform: `translate3d(calc(var(--m${k}x) * var(--u)), calc(var(--m${k}y) * var(--u)), calc(var(--m${k}z) * var(--u)))`,
            }}
          />
        ))}

        {/* ---- floating tokens on an orbit ---- */}
        <div className="tg-lift">
          <i className="tg-flat" />
          <i className="tg-flat dash" />
          {TOKENS.map(({ Icon, delay }, i) => (
            <div className="tg-spin" style={{ animationDelay: `${delay}s` }} key={i}>
              <div className="tg-arm">
                <div className="tg-counter" style={{ animationDelay: `${delay}s` }}>
                  <div className="tg-bb"><span className="tg-token"><Icon /></span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}