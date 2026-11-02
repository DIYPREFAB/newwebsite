// Device-aware e-mail links: phones and tablets open the native mail app (mailto:),
// desktops open a Gmail compose window in a new tab.
export const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (navigator.userAgentData?.mobile) return true;
  if (/Android|iPhone|iPad|iPod|Mobile|Silk|Opera Mini|IEMobile|BlackBerry/i.test(ua)) return true;
  // iPadOS 13+ reports itself as a Mac but has a touch screen
  return /Macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1;
};

const qs = (subject, body) => {
  const p = [];
  if (subject) p.push(`subject=${encodeURIComponent(subject)}`);
  if (body) p.push(`body=${encodeURIComponent(body)}`);
  return p.length ? `?${p.join("&")}` : "";
};

export const mailtoHref = (to, subject, body) => `mailto:${to}${qs(subject, body)}`;

export const gmailHref = (to, subject, body) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}` +
  (subject ? `&su=${encodeURIComponent(subject)}` : "") +
  (body ? `&body=${encodeURIComponent(body)}` : "");

// props to spread on an <a>: { href, target?, rel? }
export const mailAttrs = (to, subject, body) =>
  isMobileDevice()
    ? { href: mailtoHref(to, subject, body) }
    : { href: gmailHref(to, subject, body), target: "_blank", rel: "noopener noreferrer" };
