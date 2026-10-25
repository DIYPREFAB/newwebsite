import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Scroll progress (0..1) written by the Industries timeline. Drives assembly + rotation.
export const glassState = { p: 0 };

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (t) => t * t * (3 - 2 * t);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const seeded = (i, k) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// "Industry orbit": a kinetic gyroscope. A faceted metal core with a pulsing teal heart sits inside three
// tilted, counter-rotating metal rings; five glowing nodes (one per industry) travel along the rings,
// surrounded by a slow shell of dust. On scroll the rings open out from the core and spin up.
export default function GlassCore() {
  const mount = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = mount.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, innerWidth < 768 ? 1.25 : 2));
    const dom = renderer.domElement;
    dom.style.cssText = "width:100%;height:100%;display:block";
    el.appendChild(dom);

    const scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(renderer);
    const envRT = pm.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pm.dispose();

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
    camera.position.set(0, 0, 9);

    const key = new THREE.PointLight(0x6fe3d4, 34, 24);
    key.position.set(3.5, 3, 4);
    const fill = new THREE.PointLight(0x6cb6ff, 20, 24);
    fill.position.set(-4, -1.5, 3);
    scene.add(key, fill);

    const root = new THREE.Group();
    scene.add(root);

    // ---------- core ----------
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x16324a, metalness: 1, roughness: 0.22, envMapIntensity: 1.4, flatShading: true,
    });
    const coreGeo = new THREE.IcosahedronGeometry(0.62, 1);
    const core = new THREE.Mesh(coreGeo, coreMat);
    const coreWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(coreGeo),
      new THREE.LineBasicMaterial({ color: 0x8fe0d4, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    core.add(coreWire);
    const heart = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshBasicMaterial({ color: 0x6fe3d4 }));
    const heartGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.52, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x2fd4c0, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    root.add(core, heart, heartGlow);

    // ---------- rings ----------
    const metal = new THREE.MeshStandardMaterial({
      color: 0xc3d8dc, metalness: 1, roughness: 0.24, envMapIntensity: 1.3, emissive: 0x1fb6a6, emissiveIntensity: 0.25,
    });
    const RINGS = [
      { r: 1.05, tube: 0.022, tilt: [1.15, 0.2], spin: [0.22, 0.1] },
      { r: 1.45, tube: 0.018, tilt: [0.35, 0.9], spin: [-0.16, 0.2] },
      { r: 1.85, tube: 0.014, tilt: [0.8, -0.7], spin: [0.12, -0.17] },
    ];
    const rings = RINGS.map((d, k) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.TorusGeometry(d.r, d.tube, 16, 220), metal));
      // fine dashed outer guide for depth
      const pts = [];
      for (let i = 0; i <= 160; i++) pts.push(new THREE.Vector3(Math.cos((i / 160) * 6.2832) * (d.r + 0.12), Math.sin((i / 160) * 6.2832) * (d.r + 0.12), 0));
      const guide = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineDashedMaterial({ color: 0x8fe0d4, transparent: true, opacity: 0.35, dashSize: 0.05, gapSize: 0.09 })
      );
      guide.computeLineDistances();
      g.add(guide);
      root.add(g);
      return { g, d, k };
    });

    // ---------- nodes: one per industry, riding the rings ----------
    const nodeCore = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const nodeHalo = new THREE.MeshBasicMaterial({ color: 0x6fe3d4, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false });
    const nodeGeo = new THREE.SphereGeometry(0.07, 20, 20);
    const haloGeo = new THREE.SphereGeometry(0.17, 20, 20);
    const nodes = [0, 1, 2, 0, 1].map((ringIdx, i) => {
      const n = new THREE.Group();
      n.add(new THREE.Mesh(nodeGeo, nodeCore), new THREE.Mesh(haloGeo, nodeHalo));
      rings[ringIdx].g.add(n);
      return { n, ring: rings[ringIdx].d, phase: (i / 5) * 6.2832 + i, speed: (0.5 + seeded(i, 3) * 0.5) * (i % 2 ? -1 : 1) };
    });

    // ---------- dust shell ----------
    const N = 260;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const u = seeded(i, 1) * 2 - 1, th = seeded(i, 2) * 6.2832, rr = 1.2 + seeded(i, 3) * 1.25;
      const s = Math.sqrt(1 - u * u);
      pos.set([Math.cos(th) * s * rr, u * rr, Math.sin(th) * s * rr], i * 3);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      color: 0x8fe0d4, size: 0.028, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    }));
    root.add(dust);

    // ---------- sizing / input ----------
    const size = () => {
      const w = el.clientWidth || 300, h = el.clientHeight || 300;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);

    let tx = 0, ty = 0, mx = 0, my = 0;
    const onMove = (e) => { tx = (e.clientX / innerWidth - 0.5) * 2; ty = (e.clientY / innerHeight - 0.5) * 2; };
    window.addEventListener("pointermove", onMove, { passive: true });

    // ---------- loop ----------
    let raf;
    const t0 = performance.now();
    let aSm = 0;
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.bottom < 0 || r.top > innerHeight) return;
      const t = reduce ? 0 : (now - t0) / 1000;
      const p = glassState.p;
      const aTarget = reduce ? 1 : clamp((p - 0.4) / 0.4);
      aSm += (aTarget - aSm) * 0.12;
      const a = aSm;

      // rings open out from the core, scroll spins everything up
      rings.forEach(({ g, d, k }) => {
        const open = easeOut(clamp((a - k * 0.12) / 0.6));
        g.scale.setScalar(0.25 + open * 0.75);
        g.visible = open > 0.01;
        g.rotation.set(d.tilt[0] + t * d.spin[0] + p * (k % 2 ? -1.6 : 1.6), d.tilt[1] + t * d.spin[1] + p * 1.1, 0);
      });
      nodes.forEach(({ n, ring, phase, speed }) => {
        const ang = phase + t * speed + p * 4 * Math.sign(speed);
        n.position.set(Math.cos(ang) * ring.r, Math.sin(ang) * ring.r, 0);
        n.scale.setScalar(ease(clamp((a - 0.35) / 0.5)));
      });

      const coreOn = easeOut(clamp(a / 0.5));
      const pulse = 1 + Math.sin(t * 2.2) * 0.08;
      core.scale.setScalar(0.3 + coreOn * 0.7);
      core.rotation.set(t * 0.25 + p * 2, t * 0.35 + p * 3, 0);
      heart.scale.setScalar((0.2 + coreOn * 0.8) * pulse);
      heartGlow.scale.setScalar((0.2 + coreOn * 0.8) * (1 + Math.sin(t * 2.2 + 1) * 0.12));
      dust.rotation.y = t * 0.05 + p * 1.2;
      dust.rotation.x = Math.sin(t * 0.1) * 0.2;
      dust.material.opacity = 0.7 * ease(clamp((a - 0.2) / 0.5));

      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      root.rotation.y = mx * 0.45 + p * 0.6;
      root.rotation.x = my * 0.3;
      root.position.y = Math.sin(t * 0.9) * 0.05;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    const onLost = (e) => { e.preventDefault(); setFailed(true); };
    dom.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      dom.removeEventListener("webglcontextlost", onLost);
      ro.disconnect();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
      envRT.dispose();
      renderer.dispose();
      dom.remove();
    };
  }, []);

  return <div className="sh-gc" ref={mount}>{failed && <span className="sh-split-orb" />}</div>;
}
