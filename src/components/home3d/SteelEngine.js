import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * SteelScene — a procedural pre-engineered steel building that is driven
 * entirely by one number: scroll progress p in [0, 1].
 *
 *   0.00 – 0.14  blueprint grid, first frame draws itself (wireframe)
 *   0.14 – 0.36  digital engineering: every member drawn as a wire model
 *   0.36 – 0.60  fabrication: wire members become solid H-section steel
 *   0.58 – 0.76  process control: QC scan sweeps the structure, nodes verified
 *   0.72 – 0.92  cladding: wall sheets and roof sheets fly in
 *   0.90 – 1.00  delivered: hero camera orbit, blueprint fades to site
 */

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x) => x * x * (3 - 2 * x);
const seg = (p, a, b) => smooth(clamp((p - a) / (b - a)));
const lerp = (a, b, t) => a + (b - a) * t;

export const COLORS = {
  navy: 0x001524,
  navyLift: 0x072a40,
  steel: 0xa9b6c0,
  steelDark: 0x5d6d7a,
  teal: 0x1fb6a6,
  tealSoft: 0x6fe3d4,
  wall: 0xdfe6ea,
  roof: 0x4a6b80,
};

// 1 = original framing; larger = camera further away = smaller building on screen.
// Fallback only: resize() picks the real value per screen shape (closer on wide desktops, further on phones).
const CAMERA_PULLBACK = 1.42;

// --- model dimensions (metres) ---------------------------------------------
const SPAN = 20;
const EAVE = 7;
const RIDGE = 8.6;
const BAY = 6.25;
const BAYS = 5;
const LEN = BAY * BAYS;
const HALF_X = SPAN / 2;
const Z0 = -LEN / 2;

const roofY = (x) => EAVE + (RIDGE - EAVE) * (1 - Math.abs(x) / HALF_X);

function iSection(depth, flange, tf, tw) {
  const d = depth / 2;
  const f = flange / 2;
  const w = tw / 2;
  const s = new THREE.Shape();
  s.moveTo(-f, -d);
  s.lineTo(f, -d);
  s.lineTo(f, -d + tf);
  s.lineTo(w, -d + tf);
  s.lineTo(w, d - tf);
  s.lineTo(f, d - tf);
  s.lineTo(f, d);
  s.lineTo(-f, d);
  s.lineTo(-f, d - tf);
  s.lineTo(-w, d - tf);
  s.lineTo(-w, -d + tf);
  s.lineTo(-f, -d + tf);
  s.closePath();
  // length 1 along +Z so scale.z = member length
  return new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false });
}

function unitBox(w, h) {
  const g = new THREE.BoxGeometry(w, h, 1);
  g.translate(0, 0, 0.5);
  return g;
}

function labelSprite(text, sub) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 160;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(0,21,36,0.78)";
  ctx.strokeStyle = "rgba(111,227,212,0.9)";
  ctx.lineWidth = 3;
  const r = 14;
  ctx.beginPath();
  ctx.moveTo(r, 4);
  ctx.arcTo(508, 4, 508, 156, r);
  ctx.arcTo(508, 156, 4, 156, r);
  ctx.arcTo(4, 156, 4, 4, r);
  ctx.arcTo(4, 4, 508, 4, r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#6fe3d4";
  ctx.font = "700 62px Lato, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, 256, 82);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "400 30px Lato, Arial, sans-serif";
  ctx.fillText(sub, 256, 130);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 });
  const sp = new THREE.Sprite(m);
  sp.scale.set(5.6, 1.75, 1);
  return sp;
}

function ribTexture(base, rib, repeatX) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 16;
  const ctx = c.getContext("2d");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 16);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = rib;
    ctx.fillRect(i * 32 + 4, 0, 6, 16);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(i * 32 + 10, 0, 2, 16);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, 1);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export default class SteelScene {
  constructor(canvas, { lowPower = false, renderer = null } = {}) {
    this.canvas = canvas;
    this.lowPower = lowPower;
    this.p = 0; // target progress
    this.pS = 0; // smoothed progress
    this.mouse = new THREE.Vector2();
    this.mouseS = new THREE.Vector2();
    this.running = false;
    this.smoothing = true;
    this.intro = 0; // time-based opening: the first frames draw themselves even before any scroll
    this.members = [];
    this.nodes = [];
    this.sheets = [];
    this.labels = [];
    this.stats = { members: 0, bays: BAYS, span: SPAN, length: LEN };

    this.renderer =
      renderer ||
      new THREE.WebGLRenderer({
        canvas,
        antialias: !lowPower,
        alpha: false,
        powerPreference: "high-performance",
      });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.bg = new THREE.Color(COLORS.navy);
    this.scene.background = this.bg;
    this.scene.fog = new THREE.Fog(COLORS.navy, 100, 250);

    try {
      const pm = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    } catch {
      /* environment lighting is an enhancement; lights still work without it */
    }
    this.scene.environmentIntensity = 0.55;

    this.camera = new THREE.PerspectiveCamera(36, 1, 0.5, 400);

    this.hemi = new THREE.HemisphereLight(0xbfd8e6, 0x04101a, 0.55);
    this.sun = new THREE.DirectionalLight(0xffffff, 1.5);
    this.sun.position.set(-26, 36, 24);
    this.rim = new THREE.DirectionalLight(COLORS.teal, 1.4);
    this.rim.position.set(30, 12, -30);
    this.scene.add(this.hemi, this.sun, this.rim);

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.buildGround();
    this.buildDimensions();
    this.buildFrames();
    this.buildSecondary();
    this.buildNodes();
    this.buildScan();
    this.buildCladding();

    this.stats.members = this.members.length;

    // camera rail
    this.camPos = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 58, 16),
        new THREE.Vector3(-34, 26, 34),
        new THREE.Vector3(32, 15, 30),
        new THREE.Vector3(26, 13, 37),
        new THREE.Vector3(-40, 13, 46),
        new THREE.Vector3(-38, 8, 54),
      ],
      false,
      "catmullrom",
      0.4
    );
    this.camLook = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 3, 0),
        new THREE.Vector3(0, 4, 0),
        new THREE.Vector3(0, 4.5, 0),
        new THREE.Vector3(0, 4.5, 0),
        new THREE.Vector3(0, 4.6, 0),
      ],
      false,
      "catmullrom",
      0.4
    );
    this._lp = new THREE.Vector3();
    this._ll = new THREE.Vector3();

    this.onMouse = (e) => {
      this.mouse.set((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", this.onMouse, { passive: true });

    this.resize();
    this.update(0, 0);
  }

  // ---------------------------------------------------------------- build --
  buildGround() {
    const g = new THREE.Group();
    // blueprint grid
    const pts = [];
    const ext = 100;
    for (let i = -ext; i <= ext; i += 2.5) {
      pts.push(i, 0, -ext, i, 0, ext, -ext, 0, i, ext, 0, i);
    }
    const gg = new THREE.BufferGeometry();
    gg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    this.gridMat = new THREE.LineBasicMaterial({ color: COLORS.teal, transparent: true, opacity: 0.18 });
    const grid = new THREE.LineSegments(gg, this.gridMat);
    grid.position.y = -0.02;
    g.add(grid);

    // major grid
    const pts2 = [];
    for (let i = -ext; i <= ext; i += 12.5) {
      pts2.push(i, 0, -ext, i, 0, ext, -ext, 0, i, ext, 0, i);
    }
    const g2 = new THREE.BufferGeometry();
    g2.setAttribute("position", new THREE.Float32BufferAttribute(pts2, 3));
    this.gridMajorMat = new THREE.LineBasicMaterial({ color: COLORS.tealSoft, transparent: true, opacity: 0.28 });
    const major = new THREE.LineSegments(g2, this.gridMajorMat);
    major.position.y = -0.01;
    g.add(major);

    // slab
    this.slabMat = new THREE.MeshStandardMaterial({
      color: 0x0b2234,
      roughness: 0.85,
      metalness: 0.1,
      transparent: true,
      opacity: 0,
    });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(SPAN + 5, 0.4, LEN + 5), this.slabMat);
    slab.position.y = -0.22;
    g.add(slab);

    // footprint outline
    const fp = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-HALF_X, 0.02, Z0),
      new THREE.Vector3(HALF_X, 0.02, Z0),
      new THREE.Vector3(HALF_X, 0.02, -Z0),
      new THREE.Vector3(-HALF_X, 0.02, -Z0),
      new THREE.Vector3(-HALF_X, 0.02, Z0),
    ]);
    this.footMat = new THREE.LineBasicMaterial({ color: COLORS.tealSoft, transparent: true, opacity: 0.9 });
    g.add(new THREE.Line(fp, this.footMat));

    this.root.add(g);
  }

  buildDimensions() {
    const mat = new THREE.LineBasicMaterial({ color: COLORS.tealSoft, transparent: true, opacity: 0 });
    this.dimMat = mat;
    const mk = (a, b, tick, axis) => {
      const pts = [a, b];
      const t = tick;
      if (axis === "x") {
        pts.push(a.clone().add(new THREE.Vector3(0, 0, -t)), a.clone().add(new THREE.Vector3(0, 0, t)));
        pts.push(b.clone().add(new THREE.Vector3(0, 0, -t)), b.clone().add(new THREE.Vector3(0, 0, t)));
      } else if (axis === "z") {
        pts.push(a.clone().add(new THREE.Vector3(-t, 0, 0)), a.clone().add(new THREE.Vector3(t, 0, 0)));
        pts.push(b.clone().add(new THREE.Vector3(-t, 0, 0)), b.clone().add(new THREE.Vector3(t, 0, 0)));
      } else {
        pts.push(a.clone().add(new THREE.Vector3(-t, 0, 0)), a.clone().add(new THREE.Vector3(t, 0, 0)));
        pts.push(b.clone().add(new THREE.Vector3(-t, 0, 0)), b.clone().add(new THREE.Vector3(t, 0, 0)));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      // draw pairs: (a,b) (a-t,a+t) (b-t,b+t)
      geo.setIndex([0, 1, 2, 3, 4, 5]);
      return new THREE.LineSegments(geo, mat);
    };
    const off = 3.2;
    const spanLine = mk(new THREE.Vector3(-HALF_X, 0.05, -Z0 + off), new THREE.Vector3(HALF_X, 0.05, -Z0 + off), 0.7, "x");
    const lenLine = mk(new THREE.Vector3(HALF_X + off, 0.05, Z0), new THREE.Vector3(HALF_X + off, 0.05, -Z0), 0.7, "z");
    const hLine = mk(new THREE.Vector3(-HALF_X - off, 0, Z0 - 0.0), new THREE.Vector3(-HALF_X - off, RIDGE, Z0), 0.7, "y");
    this.root.add(spanLine, lenLine, hLine);

    const l1 = labelSprite(`${SPAN.toFixed(2)} m`, "CLEAR SPAN");
    l1.position.set(0, 1.6, -Z0 + off + 1.4);
    const l2 = labelSprite(`${LEN.toFixed(2)} m`, "BUILDING LENGTH");
    l2.position.set(HALF_X + off + 2.2, 1.6, 0);
    const l3 = labelSprite(`${RIDGE.toFixed(2)} m`, "RIDGE HEIGHT");
    l3.position.set(-HALF_X - off - 2.2, RIDGE / 2, Z0);
    this.labels.push(l1, l2, l3);
    this.root.add(l1, l2, l3);
  }

  addMember({ a, b, geo, t0, dur, solidAt, solidDur = 0.07, steelColor = COLORS.steel, roll = false }) {
    const solidMat = new THREE.MeshStandardMaterial({
      color: steelColor,
      metalness: 0.85,
      roughness: 0.34,
      transparent: true,
      opacity: 0,
    });
    const mesh = new THREE.Mesh(geo, solidMat);
    mesh.position.copy(a);
    mesh.lookAt(b);
    if (roll) mesh.rotateZ(Math.PI / 2); // web in the frame plane for vertical members
    const len = a.distanceTo(b);
    mesh.visible = false;

    const edges = new THREE.EdgesGeometry(geo, 25);
    const wireMat = new THREE.LineBasicMaterial({ color: COLORS.tealSoft, transparent: true, opacity: 0 });
    const wire = new THREE.LineSegments(edges, wireMat);
    mesh.add(wire);
    this.root.add(mesh);

    this.members.push({ mesh, wire, wireMat, solidMat, len, t0, dur, solidAt, solidDur });
    return mesh;
  }

  buildFrames() {
    const col = iSection(0.42, 0.24, 0.03, 0.022);
    const raf = iSection(0.5, 0.22, 0.028, 0.02);
    for (let i = 0; i <= BAYS; i++) {
      const z = Z0 + i * BAY;
      const f = i / BAYS;
      const t0 = 0.02 + i * 0.038;
      const sAt = 0.36 + f * 0.17;
      [-HALF_X, HALF_X].forEach((x) => {
        this.addMember({
          a: new THREE.Vector3(x, 0, z),
          b: new THREE.Vector3(x, EAVE, z),
          geo: col,
          t0,
          dur: 0.07,
          solidAt: sAt,
          roll: true,
        });
        // base plate
        this.addMember({
          a: new THREE.Vector3(x, 0, z - 0.35),
          b: new THREE.Vector3(x, 0, z + 0.35),
          geo: unitBox(0.7, 0.06),
          t0,
          dur: 0.03,
          solidAt: sAt,
          steelColor: COLORS.steelDark,
        });
      });
      [-1, 1].forEach((s) => {
        this.addMember({
          a: new THREE.Vector3(s * HALF_X, EAVE, z),
          b: new THREE.Vector3(0, RIDGE, z),
          geo: raf,
          t0: t0 + 0.045,
          dur: 0.08,
          solidAt: sAt + 0.01,
        });
      });
    }
    // gable end posts (front + back)
    const post = iSection(0.3, 0.16, 0.022, 0.016);
    [Z0, -Z0].forEach((z, zi) => {
      [-5, 0, 5].forEach((x, k) => {
        this.addMember({
          a: new THREE.Vector3(x, 0, z),
          b: new THREE.Vector3(x, roofY(x) - 0.25, z),
          geo: post,
          t0: 0.28 + zi * 0.02 + k * 0.01,
          dur: 0.06,
          solidAt: 0.5 + zi * 0.03,
          steelColor: COLORS.steel,
          roll: true,
        });
      });
    });
  }

  buildSecondary() {
    const purlin = unitBox(0.09, 0.2);
    const girt = unitBox(0.07, 0.16);
    // roof purlins
    for (let k = 0; k < 8; k++) {
      const u = (k + 0.5) / 8;
      [-1, 1].forEach((s, si) => {
        const x = s * HALF_X * (1 - u);
        const y = roofY(x) + 0.34;
        this.addMember({
          a: new THREE.Vector3(x, y, Z0),
          b: new THREE.Vector3(x, y, -Z0),
          geo: purlin,
          t0: 0.3 + k * 0.012 + si * 0.004,
          dur: 0.1,
          solidAt: 0.52 + k * 0.004,
          steelColor: COLORS.steelDark,
        });
      });
    }
    // wall girts
    [-1, 1].forEach((s, si) => {
      [1.6, 3.2, 4.8, 6.4].forEach((y, k) => {
        this.addMember({
          a: new THREE.Vector3(s * (HALF_X + 0.26), y, Z0),
          b: new THREE.Vector3(s * (HALF_X + 0.26), y, -Z0),
          geo: girt,
          t0: 0.32 + k * 0.012 + si * 0.006,
          dur: 0.1,
          solidAt: 0.53 + k * 0.004,
          steelColor: COLORS.steelDark,
        });
      });
    });
    // X bracing — end bays of both side walls and first roof bay
    const rod = unitBox(0.05, 0.05);
    [-1, 1].forEach((s) => {
      const x = s * (HALF_X + 0.1);
      [
        [Z0, Z0 + BAY],
        [-Z0 - BAY, -Z0],
      ].forEach(([za, zb]) => {
        this.addMember({ a: new THREE.Vector3(x, 0.2, za), b: new THREE.Vector3(x, EAVE - 0.2, zb), geo: rod, t0: 0.4, dur: 0.06, solidAt: 0.55, steelColor: COLORS.tealSoft });
        this.addMember({ a: new THREE.Vector3(x, 0.2, zb), b: new THREE.Vector3(x, EAVE - 0.2, za), geo: rod, t0: 0.41, dur: 0.06, solidAt: 0.55, steelColor: COLORS.tealSoft });
      });
    });
    [-1, 1].forEach((s) => {
      const xa = s * HALF_X;
      this.addMember({ a: new THREE.Vector3(xa, EAVE + 0.2, Z0), b: new THREE.Vector3(0, RIDGE + 0.2, Z0 + BAY), geo: rod, t0: 0.43, dur: 0.05, solidAt: 0.56, steelColor: COLORS.tealSoft });
      this.addMember({ a: new THREE.Vector3(xa, EAVE + 0.2, Z0 + BAY), b: new THREE.Vector3(0, RIDGE + 0.2, Z0), geo: rod, t0: 0.44, dur: 0.05, solidAt: 0.56, steelColor: COLORS.tealSoft });
    });
  }

  buildNodes() {
    const geo = new THREE.SphereGeometry(0.28, 16, 16);
    for (let i = 0; i <= BAYS; i++) {
      const z = Z0 + i * BAY;
      [
        [-HALF_X, EAVE],
        [HALF_X, EAVE],
        [0, RIDGE],
      ].forEach(([x, y]) => {
        const mat = new THREE.MeshBasicMaterial({ color: COLORS.tealSoft, transparent: true, opacity: 0 });
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        m.visible = false;
        this.root.add(m);
        this.nodes.push({ mesh: m, mat, z });
      });
    }
  }

  buildScan() {
    const w = SPAN + 3;
    const h = RIDGE + 1.6;
    const geo = new THREE.PlaneGeometry(w, h);
    geo.translate(0, h / 2 - 0.4, 0);
    this.scanMat = new THREE.MeshBasicMaterial({
      color: COLORS.teal,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.scan = new THREE.Mesh(geo, this.scanMat);
    this.scan.visible = false;
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: COLORS.tealSoft, transparent: true, opacity: 0.95 })
    );
    this.scan.add(edge);
    this.scanEdge = edge;
    this.root.add(this.scan);
  }

  buildCladding() {
    const wallTex = ribTexture("#dfe6ea", "#b9c5cd", 7);
    const wallMat = (op) =>
      new THREE.MeshStandardMaterial({ map: wallTex, metalness: 0.35, roughness: 0.55, transparent: true, opacity: op });
    const roofTexA = ribTexture("#52758a", "#38586b", 8);
    const stripeMat = () => new THREE.MeshStandardMaterial({ color: COLORS.teal, metalness: 0.4, roughness: 0.4, transparent: true, opacity: 0 });

    const sheetH = EAVE / 2;
    // side walls: BAYS columns x 2 rows
    [-1, 1].forEach((s, si) => {
      for (let i = 0; i < BAYS; i++) {
        for (let r = 0; r < 2; r++) {
          const m = new THREE.Mesh(new THREE.BoxGeometry(0.06, sheetH - 0.04, BAY - 0.05), wallMat(0));
          const x = s * (HALF_X + 0.4);
          const y = sheetH * r + sheetH / 2;
          const z = Z0 + BAY * i + BAY / 2;
          m.position.set(x + s * 7, y, z);
          m.userData = { to: new THREE.Vector3(x, y, z), from: new THREE.Vector3(x + s * 7, y, z), a: 0.72 + i * 0.016 + r * 0.03 + si * 0.01, d: 0.07 };
          m.visible = false;
          this.root.add(m);
          this.sheets.push(m);
        }
      }
    });
    // gable walls: 6 columns each, front has a door gap
    [Z0, -Z0].forEach((z, zi) => {
      const sign = zi === 0 ? -1 : 1;
      for (let c = 0; c < 8; c++) {
        const cw = SPAN / 8;
        const x = -HALF_X + cw * c + cw / 2;
        const doorGap = zi === 1 && Math.abs(x) < 3.2; // front (+z) gets the door
        for (let r = 0; r < 2; r++) {
          const top = r === 1;
          const hTop = roofY(x) - 0.2;
          const hh = top ? hTop - sheetH : sheetH;
          if (doorGap && !top) continue;
          const hgt = Math.max(0.2, hh - 0.04);
          const y = top ? sheetH + hh / 2 : sheetH / 2;
          const m = new THREE.Mesh(new THREE.BoxGeometry(cw - 0.04, hgt, 0.06), wallMat(0));
          const zz = z + sign * 0.4;
          m.position.set(x, y, zz + sign * 6);
          m.userData = { to: new THREE.Vector3(x, y, zz), from: new THREE.Vector3(x, y, zz + sign * 6), a: 0.76 + c * 0.008 + r * 0.025, d: 0.07 };
          m.visible = false;
          this.root.add(m);
          this.sheets.push(m);
        }
      }
    });
    // door frame accent
    const doorStripe = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.25, 0.12), stripeMat());
    doorStripe.position.set(0, 4.6, -Z0 + 0.45);
    doorStripe.userData = { to: doorStripe.position.clone(), from: doorStripe.position.clone().add(new THREE.Vector3(0, 6, 0)), a: 0.86, d: 0.06 };
    doorStripe.visible = false;
    this.root.add(doorStripe);
    this.sheets.push(doorStripe);

    // base teal band on side walls
    [-1, 1].forEach((s) => {
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, LEN), stripeMat());
      band.position.set(s * (HALF_X + 0.43), 0.25, 0);
      band.userData = { to: band.position.clone(), from: band.position.clone().add(new THREE.Vector3(s * 6, 0, 0)), a: 0.84, d: 0.07 };
      band.visible = false;
      this.root.add(band);
      this.sheets.push(band);
    });

    // roof sheets: per bay per slope
    const slopeLen = Math.hypot(HALF_X, RIDGE - EAVE) + 0.8;
    const ang = Math.atan2(RIDGE - EAVE, HALF_X);
    [-1, 1].forEach((s, si) => {
      for (let i = 0; i < BAYS; i++) {
        const mat = new THREE.MeshStandardMaterial({ map: roofTexA, metalness: 0.5, roughness: 0.45, transparent: true, opacity: 0 });
        const m = new THREE.Mesh(new THREE.BoxGeometry(slopeLen, 0.07, BAY - 0.06), mat);
        const mx = s * (HALF_X / 2 - 0.1);
        const my = (EAVE + RIDGE) / 2 + 0.52;
        const z = Z0 + BAY * i + BAY / 2;
        m.rotation.z = s * -ang;
        m.position.set(mx, my + 9, z);
        m.userData = { to: new THREE.Vector3(mx, my, z), from: new THREE.Vector3(mx, my + 9, z), a: 0.82 + i * 0.015 + si * 0.01, d: 0.08 };
        m.visible = false;
        this.root.add(m);
        this.sheets.push(m);
      }
    });
    // ridge cap
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.16, LEN + 0.4), stripeMat());
    cap.position.set(0, RIDGE + 0.66, 0);
    cap.userData = { to: cap.position.clone(), from: cap.position.clone().add(new THREE.Vector3(0, 6, 0)), a: 0.9, d: 0.06 };
    cap.visible = false;
    this.root.add(cap);
    this.sheets.push(cap);
  }

  // --------------------------------------------------------------- loop ----
  resize() {
    const parent = this.canvas.parentElement;
    const w = parent ? parent.clientWidth : window.innerWidth;
    const h = parent ? parent.clientHeight : window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.lowPower ? 1.25 : 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // narrow screens: pull the camera back a touch via fov
    const aspect = w / h;
    this.camera.fov = aspect < 0.8 ? 52 : aspect < 1.2 ? 44 : 36;
    // camera distance per screen shape: close-up on wide desktops, a little further on laptops/tablets, furthest on phones
    this.pullback = aspect >= 1.6 ? 1.42 : aspect >= 1.2 ? 1.52 : aspect >= 0.8 ? 1.65 : 1.75;
    // keep the building clear of the caption column: right on desktop, upper on phones
    const sx = aspect >= 1.2 ? -0.24 : 0;
    const sy = aspect < 0.9 ? 0.2 : aspect < 1.2 ? 0.1 : 0;
    this.camera.setViewOffset(w, h, sx * w, sy * h, w, h);
    this.camera.updateProjectionMatrix();
    this.draw();
  }

  setProgress(p) {
    this.p = clamp(p);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.update(dt, now / 1000);
      this.draw();
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
  }

  update(dt, time) {
    // smooth progress for a cinematic feel
    const k = dt === 0 || !this.smoothing ? 1 : 1 - Math.pow(0.0015, dt);
    this.pS += (this.p - this.pS) * k;
    if (Math.abs(this.p - this.pS) < 0.00005) this.pS = this.p;
    const p = this.pS;
    if (this.smoothing && this.intro < 1) this.intro = Math.min(1, this.intro + dt / 3.2);
    else if (!this.smoothing) this.intro = 1;
    const pm = Math.max(p, seg(this.intro, 0, 1) * 0.085); // member-drawing progress
    this.mouseS.lerp(this.mouse, dt === 0 ? 1 : 0.05);

    // ---- members
    for (const m of this.members) {
      const t = seg(pm, m.t0, m.t0 + m.dur);
      const s = seg(p, m.solidAt, m.solidAt + m.solidDur);
      if (t <= 0.001) {
        m.mesh.visible = false;
        continue;
      }
      m.mesh.visible = true;
      m.mesh.scale.z = Math.max(0.0001, m.len * t);
      const op = s;
      m.solidMat.opacity = op;
      m.solidMat.transparent = op < 0.995;
      m.solidMat.depthWrite = op > 0.6;
      m.mesh.material.visible = op > 0.01;
      // wire fades from vivid to a faint engineering edge as steel solidifies
      m.wireMat.opacity = lerp(0.95, 0.16, s) * (t > 0.02 ? 1 : t / 0.02);
    }

    // ---- ground / blueprint
    const slab = seg(p, 0.55, 0.78);
    this.slabMat.opacity = slab;
    this.gridMat.opacity = lerp(0.18, 0.06, seg(p, 0.6, 0.95));
    this.gridMajorMat.opacity = lerp(0.28, 0.1, seg(p, 0.6, 0.95));
    this.footMat.opacity = lerp(0.9, 0.0, seg(p, 0.55, 0.8));

    // ---- dimension labels
    const dimIn = seg(Math.max(p, this.intro * 0.1), 0.04, 0.16) * (1 - seg(p, 0.5, 0.62));
    this.dimMat.opacity = dimIn;
    this.labels.forEach((l, i) => {
      l.material.opacity = clamp(dimIn * 1.1 - i * 0.03);
    });

    // ---- scan + nodes (process control)
    const scanT = seg(p, 0.58, 0.76);
    const scanVis = scanT > 0.001 && scanT < 0.999;
    this.scan.visible = scanVis;
    if (scanVis) {
      this.scan.position.z = lerp(Z0 - 1, -Z0 + 1, scanT);
      const fade = Math.min(seg(scanT, 0, 0.08), 1 - seg(scanT, 0.92, 1));
      this.scanMat.opacity = 0.16 * fade;
      this.scanEdge.material.opacity = 0.95 * fade;
    }
    const nodeIn = seg(p, 0.58, 0.62);
    const nodeOut = seg(p, 0.8, 0.9);
    for (const n of this.nodes) {
      const passed = this.scan.position.z > n.z || scanT >= 0.999;
      const on = nodeIn > 0 && passed && nodeOut < 1;
      n.mesh.visible = on;
      if (on) {
        const since = scanT >= 0.999 ? 1 : clamp((this.scan.position.z - n.z) / 3);
        const pulse = 1 + 0.55 * Math.sin(time * 5 + n.z) * (1 - nodeOut);
        n.mesh.scale.setScalar((0.6 + 0.6 * since) * pulse * (1 - nodeOut * 0.7));
        n.mat.opacity = (1 - nodeOut) * (0.55 + 0.45 * since);
      }
    }

    // ---- cladding
    for (const m of this.sheets) {
      const u = m.userData;
      const t = seg(p, u.a, u.a + u.d);
      if (t <= 0.001) {
        m.visible = false;
        continue;
      }
      m.visible = true;
      m.position.lerpVectors(u.from, u.to, t);
      m.material.opacity = t;
      m.material.transparent = t < 0.995;
    }

    // ---- environment mood: blueprint navy -> lifted steel dusk
    const mood = seg(p, 0.55, 0.95);
    this.bg.setHex(COLORS.navy).lerp(new THREE.Color(0x0a2f47), mood * 0.85);
    this.scene.fog.color.copy(this.bg);
    this.sun.intensity = lerp(0.35, 1.9, seg(p, 0.3, 0.7));
    this.rim.intensity = lerp(0.9, 2.2, seg(p, 0.7, 1));
    this.hemi.intensity = lerp(0.45, 0.8, mood);
    this.scene.environmentIntensity = lerp(0.2, 0.7, seg(p, 0.3, 0.7));

    // ---- camera rail
    const u = clamp(p);
    this.camPos.getPoint(u, this._lp);
    this.camLook.getPoint(u, this._ll);
    // pull the camera back so the building reads smaller and stays clear of the caption column
    this._lp.sub(this._ll).multiplyScalar(this.pullback || CAMERA_PULLBACK).add(this._ll);
    // gentle idle drift + pointer parallax
    const drift = this.smoothing ? Math.sin(time * 0.25) * 0.5 : 0;
    this.camera.position.set(this._lp.x + this.mouseS.x * 1.6 + drift, this._lp.y - this.mouseS.y * 0.8, this._lp.z);
    this.camera.lookAt(this._ll);
  }

  dispose() {
    this.stop();
    window.removeEventListener("pointermove", this.onMouse);
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const arr = Array.isArray(o.material) ? o.material : [o.material];
        arr.forEach((mt) => {
          if (mt.map) mt.map.dispose();
          mt.dispose();
        });
      }
    });
    this.renderer.dispose();
  }
}
