import * as THREE from "three";

/*
 * VapiScene: a light, low-poly contour map with a glowing dispatch route. Scroll flies the camera along it.
 * Driven by ONE number, scroll progress p in [0, 1]:
 *   0.00 - 0.34  site readiness : first plot beacon rises, survey stakes and outline appear
 *   0.34 - 0.68  erection       : second plot, steel members float into a stack
 *   0.68 - 1.00  first dispatch : route reaches the third plot, the truck arrives at the dock ring
 * Procedural only: no photos, no models, no textures.
 */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x) => x * x * (3 - 2 * x);
const seg = (p, a, b) => smooth(clamp((p - a) / (b - a)));
const lerp = (a, b, t) => a + (b - a) * t;

const C = { ink: 0x0b2236, teal: 0x0fb5a3, tealDeep: 0x0b7f73, steel: 0x7d93a3 };
const MS_T = [0.1, 0.5, 0.9]; // where the three milestones sit along the route

export function createVapiScene(canvas, { lowPower = false } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPower, alpha: true, powerPreference: "high-performance" });
  } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 1, 500);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xbfd3dc, 1.5));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(-30, 60, 40); scene.add(sun);

  /* ---------- route (x/z first, heights after the terrain is shaped) */
  const flat = new THREE.CatmullRomCurve3([[-58, 36], [-44, 22], [-30, 10], [-12, 2], [4, 8], [18, 6], [30, -4], [40, -16], [52, -30]].map(([x, z]) => new THREE.Vector3(x, 0, z)));
  const msXZ = MS_T.map((t) => flat.getPointAt(t));

  const hBase = (x, z) => 4.2 * Math.sin(x * 0.07 + 1) * Math.cos(z * 0.06) + 2.4 * Math.sin(x * 0.15 + z * 0.11) + 1.3 * Math.sin(z * 0.23 - x * 0.09);
  function height(x, z) {
    let h = hBase(x, z);
    msXZ.forEach((m) => { const d = Math.hypot(x - m.x, z - m.z); h = lerp(h, 0, 1 - smooth(clamp((d - 7) / 11))); });
    // the road corridor is graded flatter too
    let best = 1e9;
    for (let i = 0; i <= 40; i++) { const q = flat.getPointAt(i / 40); best = Math.min(best, Math.hypot(x - q.x, z - q.z)); }
    h = lerp(h * 0.35, h, smooth(clamp((best - 3) / 9)));
    return h;
  }

  /* ---------- terrain */
  const SIZE = 170, SEGS = lowPower ? 110 : 170;
  const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGS, SEGS); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, height(pos.getX(i), pos.getZ(i)));
  geo.computeVertexNormals();
  const terrain = new THREE.Mesh(geo, new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { uLight: { value: new THREE.Vector3(-0.4, 0.8, 0.5).normalize() }, uCam: { value: new THREE.Vector3() } },
    vertexShader: `varying vec3 vP; varying vec3 vN; void main(){ vP = position; vN = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec3 vP; varying vec3 vN; uniform vec3 uLight; uniform vec3 uCam;
      float line(float v, float w){ float f = fract(v); float d = min(f, 1.0 - f); return 1.0 - smoothstep(0.0, fwidth(v) * w, d); }
      void main(){
        float h = vP.y;
        vec3 lo = vec3(0.90, 0.95, 0.96), hi = vec3(0.70, 0.84, 0.86);
        vec3 col = mix(lo, hi, clamp((h + 4.0) / 10.0, 0.0, 1.0));
        col *= 0.84 + 0.2 * max(dot(normalize(vN), uLight), 0.0);
        float c = max(line(h * 0.5, 1.2) * 0.55, line(h * 0.1, 1.6));
        col = mix(col, vec3(0.05, 0.50, 0.46), c * 0.55);
        float g = max(line(vP.x / 10.0, 0.9), line(vP.z / 10.0, 0.9));
        col = mix(col, vec3(0.04, 0.2, 0.3), g * 0.07);
        float r = length(vP.xz);
        float a = 1.0 - smoothstep(48.0, 82.0, r);
        gl_FragColor = vec4(col, a);
      }`,
  }));
  scene.add(terrain);

  /* ---------- route on the terrain */
  const pts = [];
  for (let i = 0; i <= 90; i++) { const q = flat.getPointAt(i / 90); pts.push(new THREE.Vector3(q.x, height(q.x, q.z) + 0.55, q.z)); }
  const route = new THREE.CatmullRomCurve3(pts);
  const TUBE = 420, RAD = 6;
  const tubeGeo = new THREE.TubeGeometry(route, TUBE, 0.32, RAD, false);
  const tube = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ color: C.teal }));
  scene.add(tube);
  const ghost = new THREE.Line(new THREE.BufferGeometry().setFromPoints(route.getSpacedPoints(200)), new THREE.LineDashedMaterial({ color: C.ink, dashSize: 1.1, gapSize: 1.1, transparent: true, opacity: 0.35 }));
  ghost.computeLineDistances(); scene.add(ghost);
  const idxTotal = tubeGeo.index.count;

  /* ---------- milestones */
  const ms = MS_T.map((t) => {
    const p0 = route.getPointAt(t); const g = new THREE.Group(); g.position.set(p0.x, height(p0.x, p0.z), p0.z);
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.6, 0.5, 48), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })); pad.position.y = 0.1; g.add(pad);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.16, 8, 64), new THREE.MeshBasicMaterial({ color: C.teal })); ring.rotation.x = Math.PI / 2; ring.position.y = 0.42; g.add(ring);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 15, 8), new THREE.MeshBasicMaterial({ color: C.teal, transparent: true, opacity: 0.55 })); beam.position.y = 7.9; g.add(beam);
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.95), new THREE.MeshStandardMaterial({ color: C.ink, metalness: 0.5, roughness: 0.25 })); gem.position.y = 16; g.add(gem);
    scene.add(g);
    return { g, ring, beam, gem, t, props: new THREE.Group() };
  });
  ms.forEach((m) => m.g.add(m.props));

  // 0: survey stakes + outline square
  const stakes = [];
  [[-3.6, -3.6], [3.6, -3.6], [3.6, 3.6], [-3.6, 3.6]].forEach(([x, z]) => {
    const s = new THREE.Mesh(new THREE.ConeGeometry(0.28, 2.4, 6), new THREE.MeshStandardMaterial({ color: 0xf2a33a, roughness: 0.5 })); s.position.set(x, 1.5, z); s.rotation.x = Math.PI; ms[0].props.add(s); stakes.push(s);
  });
  const outline = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([[-3.6, -3.6], [3.6, -3.6], [3.6, 3.6], [-3.6, 3.6]].map(([x, z]) => new THREE.Vector3(x, 0.5, z))), new THREE.LineBasicMaterial({ color: C.ink })); ms[0].props.add(outline);
  // 1: floating stack of steel members that rotate slowly
  const beams = [];
  for (let i = 0; i < 6; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.34, 0.9), new THREE.MeshStandardMaterial({ color: C.steel, metalness: 0.7, roughness: 0.3, emissive: C.teal, emissiveIntensity: 0.0 }));
    b.userData = { i }; ms[1].props.add(b); beams.push(b);
  }
  // 2: dock ring + crates
  const crates = [];
  [[-2, -1.6], [0.4, -1.6], [-2, 1], [0.4, 1], [-0.8, -0.3]].forEach(([x, z], i) => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(1.8, i === 4 ? 1.6 : 1.1, 1.8), new THREE.MeshStandardMaterial({ color: i === 4 ? C.teal : 0xffffff, roughness: 0.5 })); c.position.set(x, 0.9, z); ms[2].props.add(c); crates.push(c);
  });

  /* ---------- truck */
  const truck = new THREE.Group();
  const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2, ...o });
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.7, 2.3), std(C.teal, { metalness: 0.4 })); cab.position.set(0, 2.05, 1.15);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(2.62, 0.9, 0.3), std(0x0a1822, { metalness: 0.9, roughness: 0.1 })); glass.position.set(0, 2.7, 0.1);
  const cargo = new THREE.Mesh(new THREE.BoxGeometry(2.55, 2.5, 9.2), std(0xffffff)); cargo.position.set(0, 2.4, 7.9);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.58, 0.35, 9.22), std(C.teal)); stripe.position.set(0, 2.1, 7.9);
  const bed = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.35, 10.6), std(0x23323d)); bed.position.set(0, 0.95, 7.7);
  [cab, glass, cargo, stripe, bed].forEach((m) => truck.add(m));
  const wheels = [];
  [[-1.35, 1.0], [1.35, 1.0], [-1.35, 7.4], [1.35, 7.4], [-1.35, 9.2], [1.35, 9.2]].forEach(([x, z]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.45, 16), std(0x0a0f14, { roughness: 0.9, metalness: 0 })); w.rotation.z = Math.PI / 2; w.position.set(x, 0.62, z); truck.add(w); wheels.push(w);
  });
  truck.scale.setScalar(0.8); truck.position.y = 0; scene.add(truck);

  /* ---------- drifting dust for depth */
  const N = lowPower ? 140 : 320, dpos = new Float32Array(N * 3), dseed = [];
  for (let i = 0; i < N; i++) { dpos.set([(Math.random() - 0.5) * 140, 2 + Math.random() * 30, (Math.random() - 0.5) * 140], i * 3); dseed.push(Math.random() * 6.28); }
  const dgeo = new THREE.BufferGeometry(); dgeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
  const dust = new THREE.Points(dgeo, new THREE.PointsMaterial({ color: C.tealDeep, size: 0.5, transparent: true, opacity: 0.45, depthWrite: false }));
  scene.add(dust);

  /* ---------- sizing / camera */
  let W = 1, H = 1, view = { x: 0, y: 0, k: 1 };
  const px = { x: 0, y: 0, tx: 0, ty: 0 };
  function resize(w, h) {
    W = Math.max(1, w); H = Math.max(1, h);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const phone = W < 760, tab = W < 1100;
    view = phone ? { x: 0, y: -H * 0.3, k: 1.7 } : tab ? { x: -W * 0.08, y: -H * 0.1, k: 1.2 } : { x: -W * 0.2, y: -H * 0.1, k: 1.0 };
    camera.setViewOffset(W, H, view.x, view.y, W, H);
    camera.updateProjectionMatrix();
  }

  let tClock = 0, look = new THREE.Vector3(), prevU = 0, wheelRot = 0;
  const tmp = new THREE.Vector3(), tan = new THREE.Vector3(), wv = new THREE.Vector3();
  function update(p, dt = 0.016) {
    tClock += dt;
    px.x += (px.tx - px.x) * 0.06; px.y += (px.ty - px.y) * 0.06;

    const u = lerp(0.015, 1, seg(p, 0, 1));
    // route draws up to the truck
    tubeGeo.setDrawRange(0, Math.max(6, Math.floor((idxTotal * u) / 6) * 6));
    route.getPointAt(Math.min(u, 0.999), tmp);
    route.getTangentAt(Math.min(u, 0.999), tan);
    truck.position.copy(tmp); truck.position.y -= 0.35;
    truck.lookAt(tmp.x - tan.x, truck.position.y, tmp.z - tan.z);
    wheelRot -= (u - prevU) * 900; prevU = u; wheels.forEach((w) => { w.rotation.x = wheelRot; });

    // milestones come alive as the route reaches them
    ms.forEach((m, i) => {
      const a = seg(u, m.t - 0.18, m.t - 0.02);
      m.g.visible = a > 0.001;
      m.g.scale.setScalar(Math.max(a, 1e-3));
      m.gem.rotation.y = tClock * 1.2; m.gem.position.y = 16 + Math.sin(tClock * 1.6 + i) * 0.5;
      m.ring.material.color.setHex(u >= m.t ? C.teal : C.ink);
      m.ring.scale.setScalar(1 + (u >= m.t ? 0.04 * Math.sin(tClock * 3) : 0));
    });
    stakes.forEach((s, i) => { const k = seg(u, 0.02 + i * 0.015, 0.1 + i * 0.015); s.position.y = lerp(9, 1.2, k); s.visible = k > 0; });
    beams.forEach((b, i) => {
      const k = seg(u, 0.4 + i * 0.02, 0.52 + i * 0.02);
      b.visible = k > 0;
      b.position.set(0, lerp(14, 1.4 + i * 0.85, k), 0);
      b.rotation.y = i * 0.42 + tClock * 0.35;
      b.material.emissiveIntensity = (1 - k) * 0.9;
    });
    crates.forEach((c, i) => { const k = seg(u, 0.84 + i * 0.015, 0.95 + i * 0.015); c.visible = k > 0; c.scale.setScalar(Math.max(k, 1e-3)); });

    dust.rotation.y = tClock * 0.02;
    const dp = dgeo.attributes.position;
    for (let i = 0; i < N; i++) dp.setY(i, 2 + ((dp.getY(i) - 2 + dt * (0.6 + (dseed[i] % 1))) % 30));
    dp.needsUpdate = true;

    // camera flies along the route
    look.lerp(tmp, 0.12);
    const e = smooth(p);
    const az = lerp(-0.75, 0.55, e) + px.x * 0.16;
    const el = lerp(0.72, 0.5, e) + px.y * 0.07;
    const r = 70 * view.k;
    camera.position.set(look.x + r * Math.sin(az) * Math.cos(el), look.y + 4 + r * Math.sin(el), look.z + r * Math.cos(az) * Math.cos(el));
    camera.lookAt(look.x, look.y + 2, look.z);
    terrain.material.uniforms.uCam.value.copy(camera.position);
    renderer.render(scene, camera);
    // screen positions (px, relative to the canvas) of each milestone's beacon, for the HTML step labels
    const pins = ms.map((m) => {
      m.gem.getWorldPosition(wv); wv.y += 1.6;
      wv.project(camera);
      return { x: (wv.x * 0.5 + 0.5) * W, y: (-wv.y * 0.5 + 0.5) * H, a: clamp((m.g.scale.x - 0.35) / 0.65), on: u >= m.t - 0.02 };
    });
    return { frames: Math.round(u * 100), stage: u < 0.3 ? 0 : u < 0.7 ? 1 : 2, pins };
  }

  function dispose() {
    scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose()); });
    renderer.dispose(); renderer.forceContextLoss();
  }

  look.copy(route.getPointAt(0.015));
  return { update, resize, dispose, setPointer: (x, y) => { px.tx = x; px.ty = y; } };
}
