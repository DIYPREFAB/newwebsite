import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./signaturestory.css";

/**
 * The signature-question story. Opens from the hero's "Our answer" button as a full-screen light popup:
 *   DIY PREFAB  ->  Kyun? (Our answer | Let's talk)  ->  the stanza  ->  Kaise? (Our answer | Let's talk)  ->  Nazrana
 * "tap" steps advance on a click/tap/Enter anywhere, "ask" steps advance with "Our answer", "Let's talk" hands over to onTalk.
 */

const STEPS = [
  { id: "name", kind: "tap" },
  { id: "kyun", kind: "ask", word: "Kyun", q: "02" },
  { id: "stanza", kind: "tap" },
  { id: "kaise", kind: "ask", word: "Kaise", q: "03" },
  { id: "nazrana", kind: "end" },
];
const LAST = STEPS.length - 1;
const LINES = [
  ["Saath ", "design", " karte hain,"],
  ["saath ", "badhte", " hain,"],
  ["karke ", "dikhate", " hain."],
];
const RING_TEXT = "DIY PREFAB • SAATH DESIGN KARTE HAIN • SAATH BADHTE HAIN • KARKE DIKHATE HAIN • ";
const SPOKEN = {
  name: "DIY PREFAB. Click anywhere to continue.",
  kyun: "Kyun? Choose Our answer or Let's talk.",
  stanza: "Saath design karte hain, saath badhte hain, karke dikhate hain. Click anywhere to continue.",
  kaise: "Kaise? Choose Our answer or Let's talk.",
  nazrana: "Nazrana.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/** Letters that rise out of a mask one after another. */
function Word({ text, base = 0, step = 0.05 }) {
  return (
    <span className="ss-w" aria-hidden="true">
      {[...text].map((c, i) => (
        <span className="ss-ch" key={i} style={{ "--i": i, "--d": `${(base + i * step).toFixed(2)}s` }}>{c}</span>
      ))}
    </span>
  );
}

const Eyebrow = ({ children, base = 0.3 }) => (
  <p className="ss-eyebrow" style={{ "--b": `${base}s` }}>
    <i aria-hidden="true" /><span>{children}</span><i aria-hidden="true" />
  </p>
);

const Ornament = ({ base = 1.2 }) => (
  <span className="ss-orn" style={{ "--b": `${base}s` }} aria-hidden="true"><i /><b /><i /></span>
);

const Hint = () => (
  <p className="ss-hint">
    <span className="ss-hint-ico" aria-hidden="true">
      <i /><i /><i />
      <svg viewBox="0 0 24 24"><path d="M5 3l14 7.2-6.1 2L10.8 19z" /></svg>
    </span>
    <span className="ss-hint-mouse">Click anywhere to continue</span>
    <span className="ss-hint-touch">Tap anywhere to continue</span>
  </p>
);

/** Buttons lean a little toward the pointer. */
const magnet = {
  onPointerMove: (e) => {
    if (e.pointerType !== "mouse") return;
    const b = e.currentTarget, r = b.getBoundingClientRect();
    b.style.setProperty("--tx", `${((e.clientX - r.left - r.width / 2) * 0.16).toFixed(1)}px`);
    b.style.setProperty("--ty", `${((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1)}px`);
  },
  onPointerLeave: (e) => {
    e.currentTarget.style.setProperty("--tx", "0px");
    e.currentTarget.style.setProperty("--ty", "0px");
  },
};

function Actions({ delay, main, ghost }) {
  const ref = useRef(null);
  // bring the primary button into keyboard focus once the screen has settled
  useEffect(() => {
    const t = setTimeout(() => ref.current?.querySelector(".ss-btn-main")?.focus({ preventScroll: true }), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="ss-actions" ref={ref} style={{ "--ad": `${delay}s` }}>
      <button type="button" className="ss-btn ss-btn-main" onClick={main.onClick} {...magnet}>
        <span>{main.label}</span><i><Arrow /></i>
      </button>
      <button type="button" className="ss-btn ss-btn-ghost" onClick={ghost.onClick} {...magnet}>
        <span>{ghost.label}</span>
      </button>
    </div>
  );
}

export default function SignatureStory({ origin, onClose, onTalk, onExplore }) {
  const rootRef = useRef(null);
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  const [wipe, setWipe] = useState(0);
  const [closing, setClosing] = useState(false);
  const [ripples, setRipples] = useState([]);
  const curRef = useRef(0);
  const closingRef = useRef(false);
  const lockUntil = useRef(performance.now() + 1500); // ignores a double click straight after opening
  const rid = useRef(0);
  const outTimer = useRef(0);

  const R = useMemo(() => {
    const w = window.innerWidth, h = window.innerHeight;
    return Math.ceil(Math.hypot(Math.max(origin.x, w - origin.x), Math.max(origin.y, h - origin.y))) + 24;
  }, [origin]);

  const sparks = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({
      a: Math.round((i * 137.5) % 360),
      r: 22 + ((i * 53) % 34),
      s: 5 + ((i * 7) % 9),
      d: 0.55 + (i % 6) * 0.05,
      gold: i % 3 === 0,
    })),
    []
  );

  // lock the page behind the popup (Lenis ignores wheel/touch inside data-lenis-prevent), restore focus afterwards
  useEffect(() => {
    const html = document.documentElement, body = document.body;
    const old = [html.style.overflow, body.style.overflow];
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    const opener = document.activeElement;
    const el = rootRef.current;
    const stop = (e) => e.preventDefault();
    el.addEventListener("wheel", stop, { passive: false });
    el.addEventListener("touchmove", stop, { passive: false });
    el.focus({ preventScroll: true });
    return () => {
      html.style.overflow = old[0];
      body.style.overflow = old[1];
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchmove", stop);
      clearTimeout(outTimer.current);
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  // pointer parallax + soft spotlight (mouse only, off for reduced motion)
  useEffect(() => {
    const el = rootRef.current;
    if (!window.matchMedia("(hover: hover)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, nx = 0, ny = 0, px = 0, py = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", nx.toFixed(3));
      el.style.setProperty("--my", ny.toFixed(3));
      el.style.setProperty("--px", `${px}px`);
      el.style.setProperty("--py", `${py}px`);
    };
    const move = (e) => {
      px = e.clientX; py = e.clientY;
      nx = (px / window.innerWidth) * 2 - 1;
      ny = (py / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    el.addEventListener("pointermove", move);
    return () => { el.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  const burst = useCallback((x, y) => {
    const id = ++rid.current;
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((i) => i.id !== id)), 1500);
  }, []);

  const advance = useCallback((pt) => {
    const now = performance.now();
    const from = curRef.current;
    if (closingRef.current || now < lockUntil.current || from >= LAST) return;
    lockUntil.current = now + 1150;
    curRef.current = from + 1;
    setPrev(from);
    setCur(from + 1);
    setWipe((w) => w + 1);
    if (pt) burst(pt.x, pt.y);
    clearTimeout(outTimer.current);
    outTimer.current = setTimeout(() => setPrev(null), 1000);
  }, [burst]);

  const close = useCallback((after) => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    // with a follow-up (Let's talk / Explore) the follow-up navigates away and closes the popup with the page; otherwise just close
    setTimeout(() => { if (after) after(); else onClose(); }, 720);
  }, [onClose]);

  const answer = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    advance({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }, [advance]);
  const talk = useCallback(() => close(onTalk), [close, onTalk]);

  const onRootClick = (e) => {
    if (e.target.closest("button")) return;
    if (STEPS[curRef.current].kind === "tap") advance({ x: e.clientX, y: e.clientY });
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "Tab") {
      const f = [...rootRef.current.querySelectorAll("button:not([disabled])")].filter((b) => !b.closest(".is-out"));
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === rootRef.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      return;
    }
    if ((e.key === "Enter" || e.key === " " || e.key === "ArrowRight") && STEPS[curRef.current].kind === "tap" && !e.target.closest("button")) {
      e.preventDefault();
      advance();
    }
  };

  const renderView = (idx, phase) => {
    const s = STEPS[idx];
    const live = phase === "in";
    const base = idx === 0 ? 0.75 : 0.5; // the first screen waits for the circular reveal
    const common = { className: `ss-view ss-v-${s.id} is-${phase}`, "aria-hidden": live ? undefined : true };

    if (s.id === "name") {
      return (
        <section key={`v${idx}`} {...common}>
          <Eyebrow base={base - 0.2}>Our answer</Eyebrow>
          <h2 className="ss-brand" aria-label="DIY PREFAB">
            <Word text="DIY" base={base} step={0.08} />
            <Word text="PREFAB" base={base + 0.25} step={0.07} />
          </h2>
          <Ornament base={base + 1.1} />
          {live && <Hint />}
        </section>
      );
    }
    if (s.kind === "ask") {
      return (
        <section key={`v${idx}`} {...common}>
          <Eyebrow base={base - 0.2}>Question {s.q}</Eyebrow>
          <h2 className="ss-qword" aria-label={`${s.word}?`}>
            <Word text={s.word} base={base} step={0.09} />
            <span className="ss-qm" aria-hidden="true" style={{ "--d": `${(base + s.word.length * 0.09 + 0.12).toFixed(2)}s` }}>?</span>
          </h2>
          {live ? (
            <Actions delay={base + 0.9} main={{ label: "Our answer", onClick: answer }} ghost={{ label: "Let’s talk", onClick: talk }} />
          ) : (
            <div className="ss-actions" />
          )}
        </section>
      );
    }
    if (s.id === "stanza") {
      return (
        <section key={`v${idx}`} {...common}>
          <Eyebrow base={base - 0.2}>Our answer</Eyebrow>
          <p className="ss-lines" aria-label="Saath design karte hain, saath badhte hain, karke dikhate hain.">
            {LINES.map((l, i) => (
              <span className="ss-line" key={i} aria-hidden="true" style={{ "--d": `${(base + i * 0.3).toFixed(2)}s` }}>
                <span className="ss-line-in">{l[0]}<em>{l[1]}</em>{l[2]}</span>
              </span>
            ))}
          </p>
          {live && <Hint />}
        </section>
      );
    }
    // nazrana
    return (
      <section key={`v${idx}`} {...common}>
        <div className="ss-burst" aria-hidden="true">
          {sparks.map((p, i) => (
            <i key={i} className={p.gold ? "gold" : ""} style={{ "--a": `${p.a}deg`, "--r": `${p.r}vmin`, "--s": `${p.s}px`, "--bd": `${(base + p.d).toFixed(2)}s` }} />
          ))}
        </div>
        <Eyebrow base={base - 0.2}>Our answer</Eyebrow>
        <h2 className="ss-nz" aria-label="Nazrana">
          <Word text="Nazrana" base={base} step={0.075} />
        </h2>
        <Ornament base={base + 1.0} />
        <Actions delay={base + 1.3} main={{ label: "Let’s talk", onClick: talk }} ghost={{ label: "Explore the site with projects", onClick: () => close(onExplore) }} />
      </section>
    );
  };

  return createPortal(
    <div
      ref={rootRef}
      className={`ss-root${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="DIY PREFAB, our story"
      tabIndex={-1}
      data-step={STEPS[cur].id}
      data-lenis-prevent=""
      style={{ "--ox": `${origin.x}px`, "--oy": `${origin.y}px`, "--R": `${R}px`, "--s": cur }}
      onClick={onRootClick}
      onKeyDown={onKeyDown}
    >
      <div className="ss-bg" aria-hidden="true">
        <div className="ss-blob ss-blob-a" />
        <div className="ss-blob ss-blob-b" />
        <div className="ss-grid" />
        <div className="ss-ring">
          <svg viewBox="0 0 1000 1000">
            <defs><path id="ss-ring-path" d="M500,500 m-420,0 a420,420 0 1,1 840,0 a420,420 0 1,1 -840,0" /></defs>
            <text><textPath href="#ss-ring-path" textLength="2620" lengthAdjust="spacing">{RING_TEXT}</textPath></text>
          </svg>
          <span className="ss-ring2" />
          <span className="ss-ring3" />
        </div>
        <div className="ss-spot" />
        <div className="ss-grain" />
      </div>

      <i className="ss-corner tl" aria-hidden="true" />
      <i className="ss-corner tr" aria-hidden="true" />
      <i className="ss-corner bl" aria-hidden="true" />
      <i className="ss-corner br" aria-hidden="true" />

      <header className="ss-top">
        <div className="ss-brandmark" aria-hidden="true"><b>DIY PREFAB</b><span>Our story</span></div>
        <div className="ss-prog" role="progressbar" aria-label="Story progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={cur + 1}>
          {STEPS.map((s, i) => <i key={s.id} className={i <= cur ? "on" : ""} />)}
        </div>
        <button type="button" className="ss-x" aria-label="Close" onClick={() => close()}><span /><span /></button>
      </header>

      <div className="ss-stage">
        {prev !== null && renderView(prev, "out")}
        {renderView(cur, "in")}
      </div>

      {wipe > 0 && <div className="ss-wipe" key={wipe} aria-hidden="true" />}
      <div className="ss-rips" aria-hidden="true">
        {ripples.map((r) => <span className="ss-rip" key={r.id} style={{ left: r.x, top: r.y }} />)}
      </div>

      <div className="ss-sr" aria-live="polite">{SPOKEN[STEPS[cur].id]}</div>
    </div>,
    document.body
  );
}
