// Site-wide smoothness helpers. Nothing here changes how any page looks or moves:
//  1. CSS animations inside sections that are off screen are paused (the browser keeps animating/compositing them
//     otherwise, which is a lot of wasted work on a phone) and resume the moment the section comes back into view.
//  2. Images decode off the main thread, so a photo scrolling into view no longer stalls the frame.
export default function initPerfBoost() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
  const root = document.getElementById("root");
  if (!root) return;

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle("is-offscreen", !e.isIntersecting)),
    { rootMargin: "200px 0px" }
  );
  const seen = new WeakSet();

  const scan = () => {
    document.querySelectorAll("section, footer, .sh-h, [class*='-sec']").forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      io.observe(el);
    });
    document.querySelectorAll("img:not([decoding])").forEach((img) => { img.decoding = "async"; });
  };

  let t;
  const later = () => { clearTimeout(t); t = setTimeout(scan, 200); };
  new MutationObserver(later).observe(root, { childList: true, subtree: true });
  scan();
}
