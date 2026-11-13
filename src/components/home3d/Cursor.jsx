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
    dot.current.style.transform = `translate3d(${innerWidth / 2}px,${innerHeight / 2}px,0)`;

    const COL = ["47,212,192", "168,218,220", "244,197,66", "255,255,255"];
    const sparks = [], trail = [];
    let mx = W / 2, my = H / 2, x = mx, y = my, rot = 0, tsc = 1, hot = false, mag = null, magC = null, label = "", small = false, raf = 0;

    let running = true, cleared = false, drawn = false, last = performance.now();
    // "native" mode: the system cursor is shown instead of the designer cursor, while Cal's popup is open or the pointer
    // is over an iframe (cross-origin iframes never send us mouse events, so the designer cursor could not follow there).
    let native = false, modalOpen = false, overFrame = false, snap = false;
    const wake = () => { if (!running) { running = true; cleared = false; last = performance.now(); raf = requestAnimationFrame(loop); } };
    const applyNative = () => {
      const n = modalOpen || overFrame;
      if (n === native) return;
      native = n;
      document.body.classList.toggle("sh-native", n);
      if (fine) document.body.classList.toggle("sh-cursor", !n);
      if (n) {
        hot = false; label = ""; small = false;
        lab.current?.classList.remove("on", "sm"); ret.current?.classList.remove("press");
        if (mag) { mag.style.transform = ""; mag = null; }
        sparks.length = 0; trail.length = 0; g.clearRect(0, 0, W, H); drawn = false;
      } else { snap = true; wake(); } // jump straight to the real pointer position instead of sweeping across the screen
    };
    // While Cal's popup is open the whole screen shows the normal system cursor; the designer cursor returns on close.
    // "Open" = a <cal-modal-box> that is really visible. Self-healing: the popup covers the whole viewport, so if a mouse
    // event ever reaches our page from OUTSIDE the popup, that box is not covering anything any more and is ignored
    // until its state changes. This way the designer cursor can never get stuck hidden after the popup is closed.
    const stale = new WeakMap();
    const isOpen = (b) => {
      const st = b.getAttribute("state");
      if (st === "closed" || st === "failed" || st === "prerendering") return false;
      if (stale.has(b) && stale.get(b) === st) return false;
      const cs = getComputedStyle(b);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
      return b.getClientRects().length > 0;
    };
    const checkModal = () => { modalOpen = [...document.querySelectorAll("cal-modal-box")].some(isOpen); applyNative(); };
    const bodyObs = new MutationObserver(checkModal); // the popup is appended straight to <body>
    bodyObs.observe(document.body, { childList: true });
    const poll = setInterval(checkModal, 250); // also catches the popup hiding itself without a DOM change
    checkModal();
    const burst = (bx, by, n, sp) => {
      if (native) return;
      wake();
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283, v = (0.4 + Math.random()) * sp;
        sparks.push({ x: bx, y: by, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, l: 1, d: 0.016 + Math.random() * 0.02, c: COL[(Math.random() * COL.length) | 0], s: 1 + Math.random() * 1.8 });
      }
    };
    const outside = (e) => {
      if (!modalOpen) return;
      const path = e.composedPath?.() || [];
      if (path.some((n) => n.tagName === "CAL-MODAL-BOX")) return;
      document.querySelectorAll("cal-modal-box").forEach((b) => stale.set(b, b.getAttribute("state")));
      checkModal();
    };
    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      outside(e);
      if (native) return;
      if (snap) { snap = false; x = mx; y = my; trail.length = 0; }
      dot.current.style.transform = `translate3d(${mx}px,${my}px,0)`; // the dot follows the pointer instantly, no waiting for the next frame
      if (mag && magC) mag.style.transform = `translate(${(mx - magC.x) * 0.22}px,${(my - magC.y) * 0.3}px)`;
    };
    const over = (e) => {
      outside(e);
      overFrame = e.target?.tagName === "IFRAME";
      applyNative();
      if (native) return;
      const t = e.target.closest?.("a,button,[data-cursor]");
      hot = !!t;
      const l = t?.dataset?.cursor || "";
      small = t?.dataset?.cursorSize === "sm"; // data-cursor-size="sm" -> smaller labelled disc
      lab.current.classList.toggle("sm", small);
      if (l !== label) { label = l; lab.current.textContent = l; lab.current.classList.toggle("on", !!l); }
      const m = e.target.closest?.("[data-mag],.sh-btn,.hn-talk,.sh-pill") || null;
      if (m !== mag) {
        if (mag) mag.style.transform = "";
        mag = m;
        if (m) { const r = m.getBoundingClientRect(); magC = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
      }
    };
    const down = (e) => { burst(e.clientX, e.clientY, 24, 3.4); ret.current?.classList.add("press"); };
    const up = () => ret.current?.classList.remove("press");
    const tap = (e) => { const t = e.touches[0]; if (t) burst(t.clientX, t.clientY, 18, 3); };

    const loop = (t = performance.now()) => {
      if (!dot.current || !ret.current || !lab.current) return; // unmounted mid-frame
      if (native) { running = false; return; } // nothing to draw while the system cursor is in charge
      // touch screens have nothing to draw between taps: clear once, then stop the loop until the next tap
      if (!fine && !sparks.length) {
        if (!cleared) { g.clearRect(0, 0, W, H); cleared = true; }
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
      const dt = Math.min((t - last) / 16.667 || 1, 3); last = t; // frame-rate independent, so it does not drag on slow frames
      const px = x, py = y;
      if (fine) { const k = 1 - Math.pow(0.68, dt); x += (mx - x) * k; y += (my - y) * k; }
      const sp = Math.hypot(x - px, y - py) / dt;
      if (fine) {
        rot += (1.1 + sp * 0.9) * dt;
        tsc += ((hot ? (small ? 0.9 : 1.5) : 1) - tsc) * (1 - Math.pow(0.85, dt));
        ret.current.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${tsc})`;
        lab.current.style.transform = `translate3d(${x}px,${y}px,0)`;
        if (sp > 0.35) { trail.push({ x, y }); if (trail.length > 16) trail.shift(); }
        else if (trail.length) trail.shift(); // trail fades away when the pointer rests
        if (sp > 2.5) burst(x, y, Math.min(3, (sp / 5) | 0), 1.4);
      }
      // only touch the full-screen canvas when there is something on it to draw or erase
      const need = trail.length > 1 || sparks.length > 0;
      if (need || drawn) g.clearRect(0, 0, W, H);
      drawn = need;
      if (fine && trail.length > 1) {
        g.lineCap = "round";
        for (let i = 1; i < trail.length; i++) {
          const a = i / trail.length;
          g.strokeStyle = `rgba(47,212,192,${a * 0.55})`; g.lineWidth = a * 5;
          g.beginPath(); g.moveTo(trail[i - 1].x, trail[i - 1].y); g.lineTo(trail[i].x, trail[i].y); g.stroke();
        }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 0.07 * dt; p.vx *= 0.985; p.l -= p.d * dt;
        if (p.l <= 0) { sparks.splice(i, 1); continue; }
        g.fillStyle = `rgba(${p.c},${p.l})`;
        g.beginPath(); g.arc(p.x, p.y, p.s * p.l + 0.3, 0, 6.283); g.fill();
      }
    };
    raf = requestAnimationFrame(loop);

    addEventListener("resize", size);
    if (fine) {
      addEventListener("mousemove", move, { passive: true }); addEventListener("mouseover", over, { passive: true });
      addEventListener("mousedown", down); addEventListener("mouseup", up);
    } else addEventListener("touchstart", tap, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(poll); bodyObs.disconnect();
      document.body.classList.remove("sh-cursor", "sh-native");
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
