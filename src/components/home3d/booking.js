// Opens the Cal.com booking popup and guarantees the button is never a dead end.
//
// Result states (the Cal embed marks its <cal-modal-box> with a `state` attribute):
//   loaded            -> success, the helper stops watching
//   loading           -> popup is up and showing Cal's own spinner: wait, but not forever
//   failed / linkFailed event -> Cal could not load the booking page: remove the popup and run the fallback
//   no box at all after a few seconds (embed.js blocked, offline, ad-blocker) -> run the fallback
// A stale box left over from an earlier open ("closed", "failed") never counts as success, and a box that appears
// after the fallback already ran (slow network) is removed so it cannot pop over the page the visitor was sent to.
//
// index.html runs Cal("init", "45min") and defines window.Cal, so the "45min" namespace exists.
export const BOOKING = { namespace: "45min", calLink: "diyprefab/45min", minutes: 45 };
export const BOOKING_LABEL = `${BOOKING.minutes}-minute call`;

const NO_BOX_TIMEOUT_MS = 4000;   // nothing appeared at all: embed script missing or blocked
const LOADING_TIMEOUT_MS = 10000; // popup is visible but the booking page never became ready

const boxes = () => [...document.querySelectorAll("cal-modal-box")];
const boxState = () => {
  const list = boxes();
  if (!list.length) return null;
  const states = list.map((b) => b.getAttribute("state"));
  if (states.includes("loaded")) return "loaded";
  if (states.includes("failed")) return "failed";
  if (states.some((s) => s === "loading" || s === "reopening" || s === "prerendering")) return "loading";
  return "closed"; // only stale / closed boxes
};
const removeBoxes = () => boxes().forEach((b) => b.remove());

let busy = false; // ignore double clicks while a booking attempt is being verified
const failListeners = new Set();

export function bookCall(fallback, e, opts = {}) {
  const ns = opts.ns || BOOKING.namespace;
  const calLink = opts.calLink || BOOKING.calLink;
  if (busy) return;

  let settled = false;
  let timer = null;
  const finish = (ok) => {
    if (settled) return;
    settled = true;
    busy = false;
    failListeners.clear();
    clearInterval(timer);
    if (ok) return;
    removeBoxes();
    fallback?.(e);
    // slow embed: if Cal finishes loading after the fallback ran, do not let its popup appear over the fallback page
    const until = Date.now() + 15000;
    const sweep = setInterval(() => {
      boxes().forEach((b) => { if (b.getAttribute("state") !== "closed") b.remove(); });
      if (Date.now() > until) clearInterval(sweep);
    }, 400);
  };

  if (typeof window === "undefined" || typeof window.Cal !== "function") { finish(false); return; }
  const api = window.Cal.ns && window.Cal.ns[ns];
  if (typeof api !== "function") { finish(false); return; }

  busy = true;
  failListeners.add(() => finish(false));
  try {
    // linkFailed: Cal reports that the booking page itself could not be loaded
    if (!api.__bookingHooked) {
      api.__bookingHooked = true;
      api("on", { action: "linkFailed", callback: () => failListeners.forEach((fn) => fn()) });
      api("on", { action: "linkReady", callback: () => { failListeners.clear(); } });
    }
    removeBoxes(); // start from a clean state so a stale box cannot be mistaken for this attempt
    api("modal", { calLink, config: { layout: "month_view" } }); // queued by Cal until embed.js has loaded
  } catch (err) {
    finish(false);
    return;
  }

  const started = Date.now();
  timer = setInterval(() => {
    if (settled) return;
    const state = boxState();
    const waited = Date.now() - started;
    if (state === "loaded") { failListeners.clear(); finish(true); return; }
    if (state === "failed") { finish(false); return; }
    if ((state === null || state === "closed") && waited > NO_BOX_TIMEOUT_MS) { finish(false); return; }
    if (state === "loading" && waited > LOADING_TIMEOUT_MS) { finish(false); }
  }, 150);
}
