import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/* =============================================================================
   Hero piece: one dark gunmetal corrugated steel sheet, lit like a product shot.
   p = 0     the sheet drifts slowly on the right, only its ribs catching light
   p = 0..1  scroll curls it into a barrel vault (the shape of a PEB roof), then the camera
             glides inside it with a teal light waiting at the far end
   ========================================================================== */
const NX = 220, NZ = 120;
const A = 22, HW = 15;                           // half length (curls) / half width (tunnel length)
const KAPPA_MAX = (1.6 * Math.PI) / (2 * A);     // 288 degrees of arc
const BG = 0x001524;
const PITCH = 2.7;                               // rib frequency across the width

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

/* pure shape function (also used for tests): writes xyz of every vertex for curl k (0..1) at time t */
export function fillSheet(pos, sx, uz, k, t) {
  const kappa = Math.max(1e-4, lerp(0.0008, KAPPA_MAX, k));
  const R = Math.min(1 / kappa, 60);
  const offY = -R * k;
  for (let i = 0; i < sx.length; i++) {
    const x = sx[i] * A, z = uz[i] * HW;
    const ang = kappa * x;
    const bx = Math.sin(ang) / kappa, by = (1 - Math.cos(ang)) / kappa;
    const rib = Math.tanh(2.4 * Math.sin(z * PITCH)) * 0.3;
    const wave = (1 - k) * (1.7 * Math.sin(x * 0.2 + t * 0.55) * Math.cos(z * 0.16 + t * 0.35) + 0.6 * Math.sin(x * 0.42 - t * 0.45 + z * 0.25));
    const d = rib + wave;
    pos[i * 3] = bx - Math.sin(ang) * d;
    pos[i * 3 + 1] = by + Math.cos(ang) * d + offY;
    pos[i * 3 + 2] = z;
  }
}

export function createSteelScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(BG, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG, 30, 95);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  if ("environmentIntensity" in scene) scene.environmentIntensity = 0.3;
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 300);

  /* product-shot lighting: a narrow cool key from above-left, a teal rim from behind, nothing flat */
  const key = new THREE.SpotLight(0xdff4ff, 1500, 0, 0.45, 0.95, 1.6); key.position.set(-30, 34, 30); scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0x2fd4c0, 1.5); rim.position.set(26, -8, -28); scene.add(rim);
  const glow = new THREE.PointLight(0x2fd4c0, 0, 80, 1.6); scene.add(glow);

  /* the sheet */
  const geo = new THREE.PlaneGeometry(1, 1, NX, NZ);
  const src = geo.attributes.position, n = src.count;
  const sx = new Float32Array(n), uz = new Float32Array(n);
  for (let i = 0; i < n; i++) { sx[i] = src.getX(i) * 2; uz[i] = src.getY(i) * 2; }
  const colors = new Float32Array(n * 3);
  const base = new THREE.Color(0x4a6574), crest = new THREE.Color(0x2fd4c0), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const r = Math.tanh(2.4 * Math.sin(uz[i] * HW * PITCH));
    const edge = smooth(clamp((Math.abs(sx[i]) - 0.6) / 0.4));
    c.copy(base).lerp(crest, clamp(Math.max(0, r - 0.75) * 0.9 + edge * 0.55));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 1, roughness: 0.24, side: THREE.DoubleSide });
  const sheet = new THREE.Mesh(geo, mat);
  sheet.frustumCulled = false;
  scene.add(sheet);

  /* fine dust, very sparse */
  const M = 360, dp = new Float32Array(M * 3);
  for (let i = 0; i < M; i++) { dp[i * 3] = (Math.random() - 0.5) * 100; dp[i * 3 + 1] = (Math.random() - 0.5) * 50; dp[i * 3 + 2] = (Math.random() - 0.5) * 100; }
  const dgeo = new THREE.BufferGeometry(); dgeo.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const dmat = new THREE.PointsMaterial({ color: 0x9be9dd, size: 0.11, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending });
  const dust = new THREE.Points(dgeo, dmat);
  scene.add(dust);

  /* post: a restrained bloom so only the real glints glow */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.16, 0.35, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const st = { p: 0, px: 0, py: 0, tx: 0, ty: 0, t: 0 };
  const setProgress = (p) => { st.p = p; };
  const pointer = (x, y) => { st.tx = x; st.ty = y; };

  const resize = () => {
    const r = canvas.parentElement.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };

  const render = (dt = 0.016) => {
    st.t += dt;
    st.px += (st.tx - st.px) * 0.05; st.py += (st.ty - st.py) * 0.05;
    const p = st.p;
    const k = smooth(seg(p, 0, 0.62));
    const fly = smooth(seg(p, 0.5, 1));
    fillSheet(geo.attributes.position.array, sx, uz, k, st.t);
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();

    sheet.rotation.set(lerp(-1.12, 0, k) + st.py * 0.1, lerp(-0.42, 0, k) + st.px * 0.16, lerp(0.05, 0, k));
    sheet.position.set(0, lerp(0.5, 0, k), 0);

    const narrow = camera.aspect < 0.85;
    camera.position.set(st.px * 1.5, lerp(2, 0.3, fly) - st.py, lerp(narrow ? 90 : 72, 2.5, fly));
    camera.lookAt(lerp(narrow ? 0 : -13, 0, k), lerp(narrow ? -8 : 3.5, 0, k), lerp(0, -30, fly));
    key.target.position.set(0, 0, 0);
    glow.position.set(0, 0, camera.position.z - 30); glow.intensity = 90 * fly;
    key.intensity = lerp(1500, 120, fly); rim.intensity = lerp(1.5, 0.5, fly);
    bloom.strength = lerp(0.16, 0.12, fly);

    dust.rotation.y += dt * 0.015; dust.position.z = ((st.t * 0.9) % 20) - 10;
    composer.render();
  };

  const dispose = () => {
    geo.dispose(); mat.dispose(); dgeo.dispose(); dmat.dispose(); envRT.dispose(); pmrem.dispose();
    composer.dispose(); renderer.dispose();
  };

  resize();
  return { setProgress, pointer, resize, render, dispose };
}
