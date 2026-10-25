import { useEffect, useRef } from "react";

// Reticle + welding-spark cursor. Sparks trail the pointer, burst on click/tap, buttons pull toward the pointer,
// and elements with data-cursor="Label" turn the cursor into a labelled disc.
export default function Cursor() {
  const cvs = useRef(null), ret = useRef(null), dot = useRef(null), lab = useRef(null);

  useEffect(() => {
    const fine = matchMedia("(pointer: fine)").matches;
    const c = cvs.current, g = c.getContext("2d");
    let W, H;
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      c.width = W * dpr; c.height = H * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    if (fine) document.body.classList.add("sh-cursor");

    const COL = ["47,212,192", "168,218,220", "244,197,66", "255,255,255"];
    const sparks = [], trail = [];
    let mx = W / 2, my = H / 2, x = mx, y = my, rot = 0, tsc = 1, hot = false, mag = null, magC = null, label = "", raf;

    const burst = (bx, by, n, sp) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283, v = (0.4 + Math.random()) * sp;
        sparks.push({ x: bx, y: by, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, l: 1, d: 0.016 + Math.random() * 0.02, c: COL[(Math.random() * COL.length) | 0], s: 1 + Math.random() * 1.8 });
      }
    };
    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      if (mag && magC) mag.style.transform = `translate(${(mx - magC.x) * 0.22}px,${(my - magC.y) * 0.3}px)`;
    };
    const over = (e) => {
      const t = e.target.closest?.("a,button,[data-cursor]");
      hot = !!t;
      const l = t?.dataset?.cursor || "";
      if (l !== label) { label = l; lab.current.textContent = l; lab.current.classList.toggle("on", !!l); }
      const m = e.target.closest?.("[data-mag],.sh-btn,.hn-talk,.hn-signup,.sh-pill") || null;
      if (m !== mag) {
        if (mag) mag.style.transform = "";
        mag = m;
        if (m) { const r = m.getBoundingClientRect(); magC = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
      }
    };
    const down = (e) => { burst(e.clientX, e.clientY, 24, 3.4); ret.current?.classList.add("press"); };
    const up = () => ret.current?.classList.remove("press");
    const tap = (e) => { const t = e.touches[0]; if (t) burst(t.clientX, t.clientY, 18, 3); };

    const loop = () => {
      if (!dot.current || !ret.current || !lab.current) return; // unmounted mid-frame
      raf = requestAnimationFrame(loop);
      const px = x, py = y;
      x += (mx - x) * 0.2; y += (my - y) * 0.2;
      const sp = Math.hypot(x - px, y - py);
      if (fine) {
        rot += 1.1 + sp * 0.9;
        tsc += ((hot ? 1.5 : 1) - tsc) * 0.15;
        dot.current.style.transform = `translate3d(${mx}px,${my}px,0)`;
        ret.current.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${tsc})`;
        lab.current.style.transform = `translate3d(${x}px,${y}px,0)`;
        trail.push({ x, y }); if (trail.length > 16) trail.shift();
        if (sp > 2.5) burst(x, y, Math.min(3, (sp / 5) | 0), 1.4);
      }
      g.clearRect(0, 0, W, H);
      if (fine) {
        g.lineCap = "round";
        for (let i = 1; i < trail.length; i++) {
          const a = i / trail.length;
          g.strokeStyle = `rgba(47,212,192,${a * 0.55})`; g.lineWidth = a * 5;
          g.beginPath(); g.moveTo(trail[i - 1].x, trail[i - 1].y); g.lineTo(trail[i].x, trail[i].y); g.stroke();
        }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.vx *= 0.985; p.l -= p.d;
        if (p.l <= 0) { sparks.splice(i, 1); continue; }
        g.fillStyle = `rgba(${p.c},${p.l})`;
        g.beginPath(); g.arc(p.x, p.y, p.s * p.l + 0.3, 0, 6.283); g.fill();
      }
    };
    loop();

    addEventListener("resize", size);
    if (fine) {
      addEventListener("mousemove", move); addEventListener("mouseover", over);
      addEventListener("mousedown", down); addEventListener("mouseup", up);
    } else addEventListener("touchstart", tap, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("sh-cursor");
      removeEventListener("resize", size);
      removeEventListener("mousemove", move); removeEventListener("mouseover", over);
      removeEventListener("mousedown", down); removeEventListener("mouseup", up);
      removeEventListener("touchstart", tap);
    };
  }, []);

  return (
    <>
      <canvas ref={cvs} className="sh-cspark" aria-hidden="true" />
      <div className="sh-ret" ref={ret} aria-hidden="true">
        <svg viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="24" className="r1" />
          <circle cx="30" cy="30" r="24" className="r2" />
          <path d="M30 2v8M30 50v8M2 30h8M50 30h8" className="r3" />
        </svg>
      </div>
      <div className="sh-clab" ref={lab} aria-hidden="true" />
      <div className="sh-cdot" ref={dot} aria-hidden="true" />
    </>
  );
}
