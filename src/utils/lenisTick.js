// Scroll feel, in one place.
//
// Lenis' `lerp` smoothing moves a fixed fraction of the remaining distance PER FRAME, so on a 90/120/144 Hz screen the
// same setting feels 1.5-2.4x faster than on a 60 Hz one (and the page only "felt right" while it was slow enough to
// run near 60 fps). lenisTick() steps Lenis on a fixed 60 Hz clock whatever the display rate, so the scroll speed is
// the one the pages were designed with on every device. Animations driven by GSAP are time-based and are unaffected.
export const lenisOptions = {
  lerp: 0.1,
  // false = the phone's own touch scrolling (original behaviour). true = Lenis drives touch scrolling too (keeps pinned
  // sections in lock-step with the finger, but flicks glide further). Flip this one switch to compare.
  syncTouch: false,
};

const STEP = 1000 / 60;

export const lenisTick = (lenis) => {
  let last = 0;
  let acc = 0;
  let clock = 0;
  return (t) => {
    const now = t * 1000;
    if (!last) { last = now; clock = now; lenis.raf(clock); return; }
    acc += Math.min(100, now - last);
    last = now;
    const steps = Math.min(4, Math.round(acc / STEP));
    if (steps < 1) return;
    acc -= steps * STEP;
    for (let i = 0; i < steps; i++) { clock += STEP; lenis.raf(clock); }
  };
};
