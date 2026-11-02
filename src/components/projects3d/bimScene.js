/* =====================================================================
   bimScene.js: the hero's live BIM viewport (no libraries, plain canvas 2D, own 3D projection).

   The model is the Wonder Cement parking shed from the project list, built member by member:
   18 m span, 16.2 m long (3 bays of 5.4 m), 5 m side clear height, 1 in 10 roof.
   Every foundation pad, base plate, tapered I-section column and rafter, purlin, eave strut, girt,
   bracing rod and roof panel is its own element, erected in site order, then the model orbits,
   a section plane sweeps through it, an inspector callout tags elements one by one, and scrolling
   the hero explodes it into layers. Drag to orbit.
   ===================================================================== */

const SPAN = 18, LEN = 16.2, EAVE = 5, RISE = 0.9;
const ZS = [0, 5.4, 10.8, 16.2];
const C0 = [SPAN / 2, 2.6, LEN / 2];
const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
const D = 46; // camera distance (m)
const ASSEMBLED_AT = 9.3; // seconds until the last panel lands

/* ---------- small maths ---------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/* ---------- element kinds ---------- */
const KIND = {
  found:  { rgb: [122, 150, 162], lw: 1.0, fa: 0.2,  desc: "Foundation pad" },
  base:   { rgb: [170, 206, 214], lw: 1.1, fa: 0.5,  desc: "Base plate, 4 anchor bolts" },
  column: { rgb: [134, 207, 195], lw: 1.2, fa: 0.34, desc: "Tapered I-section column" },
  rafter: { rgb: [134, 207, 195], lw: 1.2, fa: 0.34, desc: "Tapered I-section rafter" },
  strut:  { rgb: [112, 178, 226], lw: 1.0, fa: 0.4,  desc: "Eave strut" },
  purlin: { rgb: [112, 178, 226], lw: 1.0, fa: 0.4,  desc: "Roof purlin" },
  girt:   { rgb: [98, 162, 214],  lw: 1.0, fa: 0.4,  desc: "Wall girt" },
  brace:  { rgb: [255, 184, 84],  lw: 1.7, fa: 0,    desc: "X-bracing rod" },
  sheet:  { rgb: [196, 238, 232], lw: 0.9, fa: 0.07, desc: "Roof sheeting panel" },
};
const TAG = { found: "FT", base: "BP", column: "C", rafter: "R", strut: "ES", purlin: "P", girt: "G", brace: "XB", sheet: "SH" };
const GRP = { found: 0, base: 0, column: 1, rafter: 2, strut: 3, purlin: 3, girt: 4, brace: 5, sheet: 6 };
// erection schedule: [start (s), stagger between elements (s)]
const SCH = {
  found: [0.15, 0.08], base: [0.7, 0.07], column: [1.5, 0.14], rafter: [2.8, 0.17], strut: [4.2, 0.05],
  purlin: [4.3, 0.045], girt: [5.3, 0.04], brace: [6.1, 0.07], sheet: [7.0, 0.16],
};
export const STEPS = ["Foundations", "Columns", "Rafters", "Purlins & struts", "Girts", "Bracing", "Sheeting"];
const GRP_START = [0.15, 1.5, 2.8, 4.2, 5.3, 6.1, 7.0];
const CYCLE = ["column", "rafter", "purlin", "girt", "brace", "base", "sheet"];

/* ---------- geometry builders ---------- */
const P = (pts, t) => ({ t, v: Float64Array.from(pts.flat()), w: new Float64Array(pts.length * 5), d: 0 });
const quad = (p, u, v, du, dv) => [
  add(add(p, mul(u, du)), mul(v, dv)), add(add(p, mul(u, du)), mul(v, -dv)),
  add(add(p, mul(u, -du)), mul(v, -dv)), add(add(p, mul(u, -du)), mul(v, dv)),
];
const prism = (S, E) => P([...S, ...E], "p");
const bar = (a, b, u, v, hu, hv) => prism(quad(a, u, v, hu, hv), quad(b, u, v, hu, hv));
// I-section member: two flanges + web, depth tapering from d0 (at a) to d1 (at b)
const iBeam = (a, b, u, v, d0, d1, bw, tf, tw) => {
  const fl = (sg) => prism(quad(add(a, mul(u, sg * (d0 / 2 - tf / 2))), u, v, tf / 2, bw / 2), quad(add(b, mul(u, sg * (d1 / 2 - tf / 2))), u, v, tf / 2, bw / 2));
  return [fl(1), fl(-1), prism(quad(a, u, v, d0 / 2 - tf, tw / 2), quad(b, u, v, d1 / 2 - tf, tw / 2))];
};

function buildModel() {
  const members = [];
  const cnt = {};
  const mk = (kind, items, len, o = {}) => {
    const k = (cnt[kind] = (cnt[kind] || 0) + 1);
    const [b0, st] = SCH[kind];
    const m = {
      kind, grp: GRP[kind], tag: `${TAG[kind]}-${String(k).padStart(2, "0")}`, len, items, note: o.note || "",
      t0: b0 + (k - 1) * st, dur: kind === "sheet" ? 1.1 : 0.9, fly: o.fly || [0, 0, 0], out: o.out || [0, 0, 0], draw: !!o.draw,
      c: [0, 0, 0], zmin: 1e9, zmax: -1e9, depth: 0, p: 0, vis: false, off: [0, 0, 0], hl: 0, scan: 0, flash: 0,
    };
    let n = 0;
    items.forEach((it) => {
      it.m = m;
      for (let i = 0; i < it.v.length; i += 3) {
        m.c[0] += it.v[i]; m.c[1] += it.v[i + 1]; m.c[2] += it.v[i + 2]; n++;
        m.zmin = Math.min(m.zmin, it.v[i + 2]); m.zmax = Math.max(m.zmax, it.v[i + 2]);
      }
    });
    m.c = m.c.map((v) => v / n);
    members.push(m);
    return m;
  };

  // roof geometry: side 0 = left slope, 1 = right slope (rafter centre line + upward normal)
  const roof = [0, 1].map((side) => {
    const a = [side === 0 ? 0 : SPAN, EAVE, 0];
    const b = [SPAN / 2, EAVE + RISE, 0];
    const s = norm(sub(b, a));
    let u = cross(Z, s);
    if (u[1] < 0) u = mul(u, -1);
    return { a, b, s, u };
  });
  const rd = (t) => lerp(0.55, 0.32, t); // rafter depth along the slope
  const roofPt = (side, z, t, off = 0) => {
    const r = roof[side];
    const p = lerp3(r.a, r.b, t);
    p[2] = z;
    return add(p, mul(r.u, rd(t) / 2 + off));
  };
  const colDepth = (y) => lerp(0.3, 0.55, clamp(y / EAVE));

  // 0 foundations + base plates
  ZS.forEach((z) => [0, SPAN].forEach((x) => {
    mk("found", [prism(quad([x, -0.5, z], X, Z, 0.55, 0.55), quad([x, 0, z], X, Z, 0.55, 0.55))], 1.1, { fly: [0, -2.5, 0], out: [0, -2.4, 0] });
  }));
  ZS.forEach((z) => [0, SPAN].forEach((x) => {
    const it = [prism(quad([x, 0, z], X, Z, 0.21, 0.21), quad([x, 0.04, z], X, Z, 0.21, 0.21))];
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([sx, sz]) => it.push(P([[x + sx * 0.14, -0.4, z + sz * 0.14], [x + sx * 0.14, 0.14, z + sz * 0.14]], "l")));
    mk("base", it, 0.42, { fly: [0, 1.6, 0], out: [0, -1.0, 0] });
  }));
  // 1 columns
  ZS.forEach((z) => [0, SPAN].forEach((x) => {
    mk("column", iBeam([x, 0.04, z], [x, EAVE, z], X, Z, 0.3, 0.55, 0.2, 0.022, 0.03), EAVE - 0.04, { fly: [x === 0 ? -2.5 : 2.5, 7.5, 0], out: [0, 0, 0] });
  }));
  // 2 rafters
  ZS.forEach((z) => [0, 1].forEach((side) => {
    const a = [roof[side].a[0], EAVE, z], b = [SPAN / 2, EAVE + RISE, z];
    mk("rafter", iBeam(a, b, roof[side].u, Z, 0.55, 0.32, 0.2, 0.022, 0.03), dist(a, b), { fly: [0, 9, 0], out: [0, 1.6, 0] });
  }));
  // 3 eave struts + purlins, one bay at a time
  for (let i = 0; i < 3; i++) {
    const za = ZS[i] + 0.12, zb = ZS[i + 1] - 0.12;
    [0, SPAN].forEach((x) => {
      const xo = x === 0 ? -0.3 : SPAN + 0.3;
      mk("strut", [bar([xo, EAVE + 0.05, za], [xo, EAVE + 0.05, zb], X, Y, 0.05, 0.09)], zb - za, { fly: [0, 4, 0], out: [0, 3.4, 0] });
    });
  }
  for (let i = 0; i < 3; i++) {
    const za = ZS[i] + 0.12, zb = ZS[i + 1] - 0.12;
    [0.03, 0.21, 0.39, 0.57, 0.75, 0.97].forEach((t) => [0, 1].forEach((side) => {
      const u = roof[side].u, s = roof[side].s;
      mk("purlin", [prism(quad(roofPt(side, za, t, 0.11), u, s, 0.1, 0.04), quad(roofPt(side, zb, t, 0.11), u, s, 0.1, 0.04))], zb - za, { fly: [0, 4.5, -2.5], out: [0, 3.4, 0] });
    }));
  }
  // 4 girts: side walls, then end walls
  [1.2, 2.4, 3.6].forEach((y) => {
    for (let i = 0; i < 3; i++) {
      const za = ZS[i] + 0.12, zb = ZS[i + 1] - 0.12;
      [0, SPAN].forEach((x) => {
        const xo = x === 0 ? -(colDepth(y) / 2 + 0.07) : SPAN + colDepth(y) / 2 + 0.07;
        mk("girt", [bar([xo, y, za], [xo, y, zb], X, Y, 0.045, 0.1)], zb - za, { fly: [x === 0 ? -6 : 6, 0, 0], out: [x === 0 ? -5.5 : 5.5, 0, 0] });
      });
    }
    [-0.2, LEN + 0.2].forEach((zz) => {
      mk("girt", [bar([0.4, y, zz], [SPAN - 0.4, y, zz], Y, Z, 0.1, 0.045)], SPAN - 0.8, { fly: [0, 0, zz < 0 ? -6 : 6], out: [0, 0, zz < 0 ? -5.5 : 5.5] });
    });
  });
  // 5 bracing: roof X in the end bays, wall X in the end bays
  [0, 2].forEach((i) => {
    const za = ZS[i], zb = ZS[i + 1];
    [0, 1].forEach((side) => {
      [[roofPt(side, za, 0.05, 0.01), roofPt(side, zb, 0.95, 0.01)], [roofPt(side, zb, 0.05, 0.01), roofPt(side, za, 0.95, 0.01)]].forEach(([a, b]) => {
        mk("brace", [P([a, b], "l")], dist(a, b), { draw: true, out: [0, 1.4, 0] });
      });
    });
    [-0.36, SPAN + 0.36].forEach((xo) => {
      [[[xo, 0.35, za], [xo, 4.6, zb]], [[xo, 0.35, zb], [xo, 4.6, za]]].forEach(([a, b]) => {
        mk("brace", [P([a, b], "l")], dist(a, b), { draw: true, out: [0, 1.4, 0] });
      });
    });
  });
  // 6 roof sheeting, one panel per bay per slope
  for (let i = 0; i < 3; i++) {
    const za = ZS[i] - (i === 0 ? 0.25 : 0), zb = ZS[i + 1] + (i === 2 ? 0.25 : 0);
    [0, 1].forEach((side) => {
      const t0 = -0.03, t1 = 1;
      const corners = [roofPt(side, za, t0, 0.24), roofPt(side, za, t1, 0.24), roofPt(side, zb, t1, 0.24), roofPt(side, zb, t0, 0.24)];
      const segs = [];
      for (let z = za + 0.3; z < zb - 0.05; z += 0.45) segs.push([roofPt(side, z, t0, 0.24), roofPt(side, z, t1, 0.24)]);
      mk("sheet", [P(corners, "q"), P(segs.flat(), "r")], dist(corners[0], corners[1]), { fly: [0, 5, 0], out: [0, 6.4, 0], note: `${(zb - za).toFixed(2)} × ${dist(corners[0], corners[1]).toFixed(2)} m` });
    });
  }
  return { members };
}

/* ---------- face / edge tables of a prism (vertices 0-3 = start quad, 4-7 = end quad) ---------- */
const FACES = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
const EDGES = [[0, 1, 0, 2], [1, 2, 0, 3], [2, 3, 0, 4], [3, 0, 0, 5], [4, 5, 1, 2], [5, 6, 1, 3], [6, 7, 1, 4], [7, 4, 1, 5], [0, 4, 2, 5], [1, 5, 2, 3], [2, 6, 3, 4], [3, 7, 4, 5]];
const LIGHT = norm([-0.45, 0.75, 0.5]);
const MINT = [134, 207, 195];
const mix = (c, to, k) => [lerp(c[0], to[0], k), lerp(c[1], to[1], k), lerp(c[2], to[2], k)];
const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${clamp(a).toFixed(3)})`;

export function createBimScene(canvas, opts = {}) {
  const { reduce = false, heroEl = null, interactEl = canvas, onStep = () => {}, size = null } = opts;
  const ctx = canvas.getContext("2d");
  const model = buildModel();
  const members = model.members;
  const items = [];
  members.forEach((m) => m.items.forEach((it) => items.push(it)));

  const st = {
    t0: 0, last: 0, yaw: 0, uYaw: 0, uPitch: 0, vYaw: 0, tx: 0, ty: 0, px: 0, py: 0, ex: 0, drag: false, lx: 0, ly: 0,
    step: -1, callIdx: -2, callM: null, visible: true, hiddenAt: 0, dirty: true, raf: 0, ovr: null,
  };
  let W = 0, H = 0, dpr = 1;
  const tmp = new Float64Array(5);
  const list = [];
  const sheets = [];
  const vis = [false, false, false, false, false, false];
  const shade = [0, 0, 0, 0, 0, 0];

  /* ---------- sizing ---------- */
  const resize = () => {
    const w = size ? size.w : interactEl.clientWidth || canvas.clientWidth;
    const h = size ? size.h : interactEl.clientHeight || canvas.clientHeight;
    if (!w || !h) return;
    W = w; H = h;
    dpr = size ? size.dpr : Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, W < 700 ? 1.5 : 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    st.dirty = true;
  };

  /* ---------- one frame ---------- */
  const draw = (t, dt) => {
    if (!W || !H) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // hero scroll progress -> exploded view
    let sc = 0;
    if (heroEl && !st.ovr) {
      const r = heroEl.getBoundingClientRect();
      sc = clamp(-r.top / (r.height * 0.85));
    }
    const target = st.ovr && st.ovr.ex != null ? st.ovr.ex : reduce ? 0 : sc;
    st.ex += (target - st.ex) * (1 - Math.pow(0.0008, dt || 0.016));
    const ex = st.ex;

    // camera
    if (!st.drag) { st.uYaw += st.vYaw; st.vYaw *= 0.93; }
    st.px += (st.tx - st.px) * 0.06;
    st.py += (st.ty - st.py) * 0.06;
    const intro = reduce ? 0 : (1 - (1 - Math.pow(1 - clamp(t / 7), 3))) * -0.9;
    const yaw = -0.62 + (reduce ? 0 : t * 0.085) + intro + st.uYaw + st.px * 0.25 + ex * 1.1;
    const pitch = clamp(0.44 + st.uPitch + st.py * 0.12 + ex * 0.22, 0.12, 0.95);
    const cosY = Math.cos(yaw), sinY = Math.sin(yaw), cosP = Math.cos(pitch), sinP = Math.sin(pitch);
    const cy0 = C0[1] + ex * 2.8;
    const fit = Math.min(W / (2 * 15.2), H / (2 * 12.4)) * (1 - 0.34 * ex);
    const F = fit * D;
    const cx = W / 2, cy = H * 0.53;
    const fs = clamp(W / 52, 10, 12.5);

    const proj = (x, y, z, o, i) => {
      const xx = x - C0[0], yy = y - cy0, zz = z - C0[2];
      const x1 = xx * cosY + zz * sinY, z1 = -xx * sinY + zz * cosY;
      const y2 = yy * cosP - z1 * sinP, z2 = yy * sinP + z1 * cosP;
      const s = F / (D - z2);
      o[i] = x1; o[i + 1] = y2; o[i + 2] = z2; o[i + 3] = cx + x1 * s; o[i + 4] = cy - y2 * s;
      return s;
    };

    /* --- ground: grid, footprint, structural grid --- */
    const gA = reduce ? 1 : smooth(0, 1.4, t);
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(MINT, 0.075 * gA);
    ctx.beginPath();
    for (let g = -6; g <= SPAN + 6; g += 3) { proj(g, 0, -6, tmp, 0); ctx.moveTo(tmp[3], tmp[4]); proj(g, 0, LEN + 6, tmp, 0); ctx.lineTo(tmp[3], tmp[4]); }
    for (let g = -6; g <= LEN + 6; g += 3) { proj(-6, 0, g, tmp, 0); ctx.moveTo(tmp[3], tmp[4]); proj(SPAN + 6, 0, g, tmp, 0); ctx.lineTo(tmp[3], tmp[4]); }
    ctx.stroke();
    // slab outline
    ctx.beginPath();
    [[-0.9, -0.9], [SPAN + 0.9, -0.9], [SPAN + 0.9, LEN + 0.9], [-0.9, LEN + 0.9]].forEach(([x, z], i) => { proj(x, 0, z, tmp, 0); i ? ctx.lineTo(tmp[3], tmp[4]) : ctx.moveTo(tmp[3], tmp[4]); });
    ctx.closePath();
    ctx.fillStyle = rgba(MINT, 0.045 * gA);
    ctx.fill();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = rgba(MINT, 0.32 * gA);
    ctx.stroke();
    // structural grid lines
    ctx.strokeStyle = rgba(MINT, 0.2 * gA);
    ctx.beginPath();
    ZS.forEach((z) => { proj(-4.2, 0, z, tmp, 0); ctx.moveTo(tmp[3], tmp[4]); proj(SPAN + 1.6, 0, z, tmp, 0); ctx.lineTo(tmp[3], tmp[4]); });
    [0, SPAN].forEach((x) => { proj(x, 0, -4.2, tmp, 0); ctx.moveTo(tmp[3], tmp[4]); proj(x, 0, LEN + 1.6, tmp, 0); ctx.lineTo(tmp[3], tmp[4]); });
    ctx.stroke();
    ctx.setLineDash([]);

    /* --- members: schedule, offsets, projection --- */
    const assembled = t >= ASSEMBLED_AT;
    const scanOn = !reduce && assembled && ex < 0.5;
    const tri = (v) => { const f = v % 2; return f < 1 ? f : 2 - f; };
    const zScan = scanOn ? lerp(-1.4, LEN + 1.4, smooth(0, 1, tri((t - ASSEMBLED_AT) / 7))) : null;
    list.length = 0;
    sheets.length = 0;
    for (let mi = 0; mi < members.length; mi++) {
      const m = members[mi];
      const p = clamp((t - m.t0) / m.dur);
      m.p = p;
      m.vis = p > 0;
      if (!m.vis) continue;
      const e = 1 - Math.pow(1 - p, 4);
      const k1 = 1 - e;
      m.off[0] = m.fly[0] * k1 + m.out[0] * ex + (m.c[0] - C0[0]) * ex * 0.12;
      m.off[1] = m.fly[1] * k1 + m.out[1] * ex;
      m.off[2] = m.fly[2] * k1 + m.out[2] * ex + (m.c[2] - C0[2]) * ex * 0.12;
      m.flash = t > m.t0 + m.dur ? clamp(1 - (t - m.t0 - m.dur) / 0.5) : p * 0.25;
      m.scan = zScan != null && m.zmin + m.off[2] - 0.12 <= zScan && m.zmax + m.off[2] + 0.12 >= zScan ? 1 : 0;
      let dsum = 0, n = 0;
      for (let ii = 0; ii < m.items.length; ii++) {
        const it = m.items[ii];
        const v = it.v, w = it.w, np = v.length / 3;
        for (let i = 0; i < np; i++) {
          let x = v[i * 3] + m.off[0], y = v[i * 3 + 1] + m.off[1], z = v[i * 3 + 2] + m.off[2];
          if (m.draw && i === 1) { // rods are drawn in from one end
            const ax = v[0] + m.off[0], ay = v[1] + m.off[1], az = v[2] + m.off[2];
            x = lerp(ax, x, e); y = lerp(ay, y, e); z = lerp(az, z, e);
          }
          proj(x, y, z, w, i * 5);
          dsum += w[i * 5 + 2]; n++;
        }
        let ds = 0;
        for (let i = 0; i < np; i++) ds += w[i * 5 + 2];
        it.d = ds / np;
        (m.kind === "sheet" ? sheets : list).push(it);
      }
      m.depth = dsum / n;
    }
    list.sort((a, b) => a.d - b.d);
    sheets.sort((a, b) => a.d - b.d);

    /* --- inspector: which element is tagged right now --- */
    let callM = null, callA = 0;
    if (!reduce && assembled && ex < 0.35) {
      const local = (t - ASSEMBLED_AT - 0.4) / 3.2;
      const idx = Math.floor(local);
      if (local >= 0) {
        if (idx !== st.callIdx) {
          st.callIdx = idx;
          const kind = CYCLE[idx % CYCLE.length];
          let best = null;
          members.forEach((m) => { if (m.kind === kind && m.vis && (!best || m.depth > best.depth)) best = m; });
          st.callM = best;
        }
        const f = local - idx;
        callA = smooth(0, 0.12, f) * (1 - smooth(0.86, 1, f));
        callM = st.callM;
      }
    }
    members.forEach((m) => { m.hl = m === callM ? callA : 0; });

    /* --- draw elements, far to near --- */
    const BASE_AM = 1;
    for (let li = 0; li < list.length; li++) {
      const it = list[li], m = it.m, kd = KIND[m.kind];
      const w = it.w;
      const bright = Math.max(m.hl, m.scan * 0.75, m.flash * 0.8);
      const col = bright > 0 ? mix(kd.rgb, [236, 255, 250], clamp(bright)) : kd.rgb;
      const al = clamp(m.p * 3) * BASE_AM;
      const df = clamp((it.d + 14) / 28);
      const dep = 0.38 + 0.62 * df;
      const lw = kd.lw * (1 + bright * 0.9);
      if (it.t === "l") {
        ctx.strokeStyle = rgba(col, (m.kind === "brace" ? 0.95 : 0.6) * al * dep);
        ctx.lineWidth = lw * (m.kind === "brace" ? 1 : 0.9);
        ctx.beginPath(); ctx.moveTo(w[3], w[4]); ctx.lineTo(w[8], w[9]); ctx.stroke();
        continue;
      }
      // prism
      let pcx = 0, pcy = 0, pcz = 0;
      for (let i = 0; i < 8; i++) { pcx += w[i * 5]; pcy += w[i * 5 + 1]; pcz += w[i * 5 + 2]; }
      pcx /= 8; pcy /= 8; pcz /= 8;
      const fillMul = smooth(0.45, 1, m.p);
      for (let f = 0; f < 6; f++) {
        const fc = FACES[f];
        const a = fc[0] * 5, b = fc[1] * 5, c = fc[2] * 5, d = fc[3] * 5;
        const e1x = w[b] - w[a], e1y = w[b + 1] - w[a + 1], e1z = w[b + 2] - w[a + 2];
        const e2x = w[d] - w[a], e2y = w[d + 1] - w[a + 1], e2z = w[d + 2] - w[a + 2];
        let nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
        const fx = (w[a] + w[b] + w[c] + w[d]) / 4, fy = (w[a + 1] + w[b + 1] + w[c + 1] + w[d + 1]) / 4, fz = (w[a + 2] + w[b + 2] + w[c + 2] + w[d + 2]) / 4;
        if (nx * (fx - pcx) + ny * (fy - pcy) + nz * (fz - pcz) < 0) { nx = -nx; ny = -ny; nz = -nz; }
        const nl = Math.hypot(nx, ny, nz) || 1;
        vis[f] = (nx * (0 - fx) + ny * (0 - fy) + nz * (D - fz)) / nl > 0;
        shade[f] = (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / nl;
        if (vis[f] && kd.fa > 0) {
          const k = 0.55 + 0.75 * Math.max(0, shade[f]);
          ctx.fillStyle = rgba([col[0] * k, col[1] * k, col[2] * k], kd.fa * fillMul * al * (0.6 + 0.4 * df) + bright * 0.12);
          ctx.beginPath();
          ctx.moveTo(w[a + 3], w[a + 4]); ctx.lineTo(w[b + 3], w[b + 4]); ctx.lineTo(w[c + 3], w[c + 4]); ctx.lineTo(w[d + 3], w[d + 4]);
          ctx.closePath(); ctx.fill();
        }
      }
      // hidden edges first (faint), then the visible ones
      ctx.lineWidth = lw * 0.8;
      ctx.strokeStyle = rgba(col, 0.16 * al * dep);
      ctx.beginPath();
      for (let ei = 0; ei < 12; ei++) { const e = EDGES[ei]; if (vis[e[2]] || vis[e[3]]) continue; ctx.moveTo(w[e[0] * 5 + 3], w[e[0] * 5 + 4]); ctx.lineTo(w[e[1] * 5 + 3], w[e[1] * 5 + 4]); }
      ctx.stroke();
      ctx.lineWidth = lw;
      ctx.strokeStyle = rgba(col, 0.9 * al * dep);
      if (m.hl > 0.5) { ctx.shadowColor = rgba(MINT, 0.95); ctx.shadowBlur = 14; }
      ctx.beginPath();
      for (let ei = 0; ei < 12; ei++) { const e = EDGES[ei]; if (!(vis[e[2]] || vis[e[3]])) continue; ctx.moveTo(w[e[0] * 5 + 3], w[e[0] * 5 + 4]); ctx.lineTo(w[e[1] * 5 + 3], w[e[1] * 5 + 4]); }
      ctx.stroke();
      if (m.hl > 0.5) { ctx.shadowBlur = 0; ctx.shadowColor = "transparent"; }
    }

    /* --- roof sheeting over everything --- */
    for (let si = 0; si < sheets.length; si++) {
      const it = sheets[si];
      if (it.t !== "q") continue;
      const m = it.m, rib = m.items[1], w = it.w, rw = rib.w;
      const al = clamp(m.p * 2.4);
      const bright = Math.max(m.hl, m.scan * 0.6, m.flash * 0.6);
      const col = mix(KIND.sheet.rgb, [255, 255, 255], bright * 0.6);
      ctx.fillStyle = rgba(col, (0.075 + bright * 0.2) * al);
      ctx.beginPath(); ctx.moveTo(w[3], w[4]);
      for (let i = 1; i < 4; i++) ctx.lineTo(w[i * 5 + 3], w[i * 5 + 4]);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(col, (0.4 + bright * 0.5) * al);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.strokeStyle = rgba(col, (0.13 + bright * 0.3) * al);
      ctx.beginPath();
      for (let i = 0; i < rib.v.length / 6; i++) { ctx.moveTo(rw[i * 10 + 3], rw[i * 10 + 4]); ctx.lineTo(rw[i * 10 + 8], rw[i * 10 + 9]); }
      ctx.stroke();
    }

    /* --- section plane --- */
    if (zScan != null) {
      const pa = smooth(0, 0.6, t - ASSEMBLED_AT) * (1 - ex * 2);
      const pts = [[-1.6, -0.4], [SPAN + 1.6, -0.4], [SPAN + 1.6, 7.6], [-1.6, 7.6]];
      ctx.beginPath();
      pts.forEach(([x, y], i) => { proj(x, y, zScan, tmp, 0); i ? ctx.lineTo(tmp[3], tmp[4]) : ctx.moveTo(tmp[3], tmp[4]); });
      ctx.closePath();
      ctx.fillStyle = rgba([47, 212, 192], 0.07 * pa);
      ctx.fill();
      ctx.strokeStyle = rgba([47, 212, 192], 0.55 * pa);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      proj(SPAN + 1.6, 7.6, zScan, tmp, 0);
      const lx = tmp[3], ly = tmp[4];
      ctx.font = `700 ${fs}px Lato, Arial, sans-serif`;
      const txt = `SECTION A-A  z = ${zScan.toFixed(2)} m`;
      const tw = ctx.measureText(txt).width + 18;
      const bx = clamp(lx - tw, 6, W - tw - 6), by = clamp(ly - 30, 40, H - 60);
      ctx.fillStyle = rgba([0, 21, 36], 0.85 * pa);
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, tw, 22, 11) : ctx.rect(bx, by, tw, 22); ctx.fill();
      ctx.fillStyle = rgba([143, 232, 218], pa);
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(txt, bx + 9, by + 11.5);
    }

    /* --- dimensions + grid bubbles --- */
    const dA = reduce ? 1 : smooth(ASSEMBLED_AT - 0.4, ASSEMBLED_AT + 0.8, t) * (1 - clamp(ex * 2.5));
    const pill = (txt, x, y, a, tone = 0) => {
      ctx.font = `700 ${fs}px Lato, Arial, sans-serif`;
      const tw = ctx.measureText(txt).width + 14;
      ctx.fillStyle = rgba([0, 21, 36], 0.82 * a);
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - tw / 2, y - 10, tw, 20, 10) : ctx.rect(x - tw / 2, y - 10, tw, 20); ctx.fill();
      ctx.strokeStyle = rgba(MINT, (tone ? 0.7 : 0.4) * a);
      ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = rgba(tone ? [236, 255, 250] : [210, 232, 236], a);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(txt, x, y + 0.5);
    };
    if (dA > 0.01) {
      const dim = (A, B, tick, ext, label) => {
        ctx.strokeStyle = rgba([255, 255, 255], 0.5 * dA);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ext.forEach(([e0, e1]) => { proj(e0[0], e0[1], e0[2], tmp, 0); ctx.moveTo(tmp[3], tmp[4]); proj(e1[0], e1[1], e1[2], tmp, 0); ctx.lineTo(tmp[3], tmp[4]); });
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        proj(A[0], A[1], A[2], tmp, 0); ctx.moveTo(tmp[3], tmp[4]);
        proj(B[0], B[1], B[2], tmp, 0); ctx.lineTo(tmp[3], tmp[4]);
        [A, B].forEach((p) => { const q1 = add(p, tick), q2 = sub(p, tick); proj(q1[0], q1[1], q1[2], tmp, 0); ctx.moveTo(tmp[3], tmp[4]); proj(q2[0], q2[1], q2[2], tmp, 0); ctx.lineTo(tmp[3], tmp[4]); });
        ctx.stroke();
        const mid = lerp3(A, B, 0.5);
        proj(mid[0], mid[1], mid[2], tmp, 0);
        pill(label, tmp[3], tmp[4], dA);
      };
      dim([0, 0, -2.4], [SPAN, 0, -2.4], [0, 0, 0.3], [[[0, 0, 0], [0, 0, -2.6]], [[SPAN, 0, 0], [SPAN, 0, -2.6]]], "18.00 m span");
      dim([SPAN + 2.4, 0, 0], [SPAN + 2.4, 0, LEN], [0.3, 0, 0], [[[SPAN, 0, 0], [SPAN + 2.6, 0, 0]], [[SPAN, 0, LEN], [SPAN + 2.6, 0, LEN]]], "16.20 m = 3 × 5.40");
      dim([-1.5, 0, -1.5], [-1.5, EAVE, -1.5], [0.3, 0, 0], [[[0, EAVE, 0], [-1.7, EAVE, -1.7]]], "5.00 m");
    }
    if (gA > 0.05) {
      const bub = (x, z, label) => {
        const s = proj(x, 0, z, tmp, 0);
        const r = Math.max(8, 0.55 * s);
        ctx.fillStyle = rgba([0, 21, 36], 0.8 * gA);
        ctx.strokeStyle = rgba(MINT, 0.6 * gA);
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(tmp[3], tmp[4], r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = rgba([210, 240, 235], gA);
        ctx.font = `800 ${Math.max(9, r * 1.05)}px Lato, Arial, sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(label, tmp[3], tmp[4] + 0.5);
      };
      ZS.forEach((z, i) => bub(-4.9, z, String(i + 1)));
      bub(0, -4.9, "A"); bub(SPAN, -4.9, "B");
    }

    /* --- inspector callout --- */
    if (callM && callA > 0.01) {
      const it = callM.items[0];
      const w = it.w, np = w.length / 5;
      let ax = 0, ay = 0;
      for (let i = 0; i < np; i++) { ax += w[i * 5 + 3]; ay += w[i * 5 + 4]; }
      ax /= np; ay /= np;
      const lines = [`${callM.tag}`, KIND[callM.kind].desc, callM.kind === "sheet" ? `Panel ${callM.note}` : callM.kind === "base" ? "0.42 × 0.42 m plate" : `Length ${callM.len.toFixed(2)} m`];
      const f1 = `800 ${fs + 1}px Lato, Arial, sans-serif`, f2 = `600 ${fs}px Lato, Arial, sans-serif`;
      ctx.font = f2;
      const bw = Math.max(...lines.map((s, i) => { ctx.font = i === 0 ? f1 : f2; return ctx.measureText(s).width; })) + 30;
      const bh = 66;
      let bx = ax + 44, by = ay - 62;
      if (bx + bw > W - 8) bx = ax - 44 - bw;
      bx = clamp(bx, 8, W - bw - 8); by = clamp(by, 44, H - bh - 54);
      ctx.strokeStyle = rgba(MINT, 0.85 * callA);
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx + (bx > ax ? 0 : bw), by + bh / 2); ctx.stroke();
      ctx.fillStyle = rgba(MINT, callA);
      ctx.beginPath(); ctx.arc(ax, ay, 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba([0, 21, 36], 0.9 * callA);
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 12) : ctx.rect(bx, by, bw, bh); ctx.fill();
      ctx.stroke();
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.font = f1; ctx.fillStyle = rgba(MINT, callA); ctx.fillText(lines[0], bx + 15, by + 15);
      ctx.font = f2; ctx.fillStyle = rgba([255, 255, 255], callA); ctx.fillText(lines[1], bx + 15, by + 34);
      ctx.fillStyle = rgba([157, 188, 196], callA); ctx.fillText(lines[2], bx + 15, by + 52);
    }

    /* --- axis gizmo --- */
    {
      const gx = 46, gy = 96, L = 24;
      const ax = [[X, "X", MINT], [Y, "Z", [255, 255, 255]], [Z, "Y", [112, 178, 226]]];
      ctx.lineWidth = 1.6;
      ax.forEach(([v, lab, c]) => {
        const x1 = v[0] * cosY + v[2] * sinY, z1 = -v[0] * sinY + v[2] * cosY;
        const y2 = v[1] * cosP - z1 * sinP;
        ctx.strokeStyle = rgba(c, 0.85);
        ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + x1 * L, gy - y2 * L); ctx.stroke();
        ctx.fillStyle = rgba(c, 0.95);
        ctx.font = `800 10px Lato, Arial, sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(lab, gx + x1 * (L + 9), gy - y2 * (L + 9));
      });
    }

    // erection step for the HUD
    let step = 7;
    if (t < ASSEMBLED_AT) { step = 0; GRP_START.forEach((s, g) => { if (t >= s) step = g; }); }
    if (step !== st.step) { st.step = step; onStep(step); }
  };

  /* ---------- loop + input ---------- */
  const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());
  st.t0 = now();
  st.last = st.t0;
  const loop = (ts) => {
    st.raf = 0;
    if (!st.visible) return;
    const n = ts || now();
    const dt = Math.min(0.05, (n - st.last) / 1000);
    st.last = n;
    const t = reduce ? 99 : (n - st.t0) / 1000;
    if (!reduce || st.dirty || st.drag || Math.abs(st.vYaw) > 0.0005) { draw(t, dt); st.dirty = false; }
    st.raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!st.raf && st.visible && typeof requestAnimationFrame !== "undefined") st.raf = requestAnimationFrame(loop); };

  const cleanups = [];
  if (typeof window !== "undefined" && !size) {
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(interactEl);
    window.addEventListener("resize", resize);
    cleanups.push(() => { ro?.disconnect(); window.removeEventListener("resize", resize); });
    if (typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver(([en]) => {
        const was = st.visible;
        st.visible = en.isIntersecting;
        if (st.visible && !was) {
          if (!reduce && now() - st.hiddenAt > 1600) { st.t0 = now(); st.callIdx = -2; } // came back after a while: erect it again
          st.last = now();
          start();
        }
        if (!st.visible) st.hiddenAt = now();
      }, { threshold: 0.02 });
      io.observe(interactEl);
      cleanups.push(() => io.disconnect());
    }
    // pointer: hover tilt (mouse) + drag to orbit (mouse, touch, pen)
    const onMove = (e) => {
      const r = interactEl.getBoundingClientRect();
      if (e.pointerType === "mouse" && !st.drag) { st.tx = ((e.clientX - r.left) / r.width - 0.5) * 2; st.ty = ((e.clientY - r.top) / r.height - 0.5) * 2; }
      if (st.drag) {
        const dx = e.clientX - st.lx, dy = e.clientY - st.ly;
        st.lx = e.clientX; st.ly = e.clientY;
        st.uYaw += dx * 0.0085; st.vYaw = dx * 0.0085;
        st.uPitch = clamp(st.uPitch + dy * 0.004, -0.3, 0.4);
        st.dirty = true;
      }
    };
    const onDown = (e) => { st.drag = true; st.lx = e.clientX; st.ly = e.clientY; st.vYaw = 0; try { interactEl.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } };
    const onUp = () => { st.drag = false; };
    const onLeave = () => { st.tx = 0; st.ty = 0; };
    interactEl.addEventListener("pointermove", onMove);
    interactEl.addEventListener("pointerdown", onDown);
    interactEl.addEventListener("pointerup", onUp);
    interactEl.addEventListener("pointercancel", onUp);
    interactEl.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      interactEl.removeEventListener("pointermove", onMove);
      interactEl.removeEventListener("pointerdown", onDown);
      interactEl.removeEventListener("pointerup", onUp);
      interactEl.removeEventListener("pointercancel", onUp);
      interactEl.removeEventListener("pointerleave", onLeave);
    });
    resize();
    start();
  } else {
    resize();
  }

  return {
    count: members.length,
    // draws one frame at time t (used for previews / tests)
    renderAt(t, o = {}) { st.ovr = o; st.uYaw = o.uYaw || 0; st.ex = o.ex || 0; draw(t, 1); },
    destroy() {
      if (st.raf) cancelAnimationFrame(st.raf);
      st.visible = false;
      cleanups.forEach((fn) => fn());
    },
  };
}
