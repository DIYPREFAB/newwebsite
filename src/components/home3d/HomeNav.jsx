import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { FaArrowRight, FaChevronDown, FaLinkedinIn } from "react-icons/fa";
import { navItems } from "../../Constants";
import ImagePath from "../../assets/ImagePath";
import { bookCall } from "./booking";
import "./home3d.css";
import "./homenav-menu.css";

const SIGNUP = "https://dashboard.diyprefab.com/auth/signup";
const KEY_BENEFITS = "/key-benefits-of-prefab-construction";
const LOGIN = "https://dashboard.diyprefab.com/auth/signin";
const LINKEDIN = "https://www.linkedin.com/company/diyprefab";

// One compact nav, fixed on every page (never hides). Hamburger only appears on small screens.
export default function HomeNav({ onCta }) {
  // "Home" opens the Key Benefits page with no dropdown; the logo goes to the 3D home ("/").
  // The "Inquiry Form" dropdown is removed: any submenu entry with that title is dropped, so Contact Us (and Careers) open their pages directly.
  const items = navItems.map((n) => {
    if (n.title === "Home") return { title: "Home", link: KEY_BENEFITS };
    // Careers opens its page directly (Work Culture and Job Openings are reached from inside it, no dropdown)
    if (n.title === "Careers") return { title: n.title, link: n.link, submenu: [] };
    // About Us also opens its page directly (no dropdown); the company, vision, sustainability, process and plant pages are sections inside it
    if (n.title?.trim().toLowerCase() === "about us") return { title: n.title, link: n.link, submenu: [] };
    // Products & Services also opens its page directly (no dropdown); the product pages are reached from inside it
    if (/^products?\s*(&|and)/i.test(n.title?.trim() || "")) return { title: n.title, link: n.link, submenu: [] };
    // Applications also opens its page directly; the sector pages are reached from inside it
    if (n.title?.trim().toLowerCase() === "applications") return { title: n.title, link: n.link, submenu: [] };
    const submenu = (n.submenu || []).filter((s) => s.title?.trim().toLowerCase() !== "inquiry form");
    return { ...n, submenu };
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const burgerRef = useRef(null);
  const closeRef = useRef(null);
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const [drop, setDrop] = useState(null); // title of the desktop submenu that is open (keyboard / tap)

  // desktop submenus. A dropdown is shown by exactly one thing: the `open` class from React state (click / Enter / Space on
  // the caret), or the mouse hovering it. `:focus-within` is NOT used, because Escape returns focus to the caret inside the
  // same item and that kept the menu visible. Escape closes it, returns focus to the caret and also silences hover until
  // the pointer moves again, so it really disappears even when the mouse is resting over it.
  const [hushed, setHushed] = useState(false);
  const closeDrop = useCallback((refocus) => {
    setDrop((cur) => {
      if (cur && refocus) navRef.current?.querySelector(`[data-drop="${CSS.escape(cur)}"] .hn-caret`)?.focus();
      return null;
    });
  }, []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape" || !navRef.current) return;
      const visible = navRef.current.querySelector(".hn-item.open") || navRef.current.querySelector(".hn-item:hover .hn-drop");
      if (!visible) return;
      closeDrop(true);
      setHushed(true);
    };
    const onDown = (e) => { if (!navRef.current?.contains(e.target)) setDrop(null); };
    // leaving the item with keyboard focus also closes it (Tab past the last link)
    const onFocusIn = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setDrop(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("focusin", onFocusIn);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); document.removeEventListener("focusin", onFocusIn); };
  }, [closeDrop]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    document.body.classList.add("has-hn");
    return () => document.body.classList.remove("has-hn");
  }, []);

  // menu panel: Esc closes, focus is trapped inside (Tab and Shift+Tab wrap), the rest of the page is inert,
  // focus moves in on open and back to the burger on close, and it shuts itself if the window grows past the burger breakpoint
  useEffect(() => {
    if (!open) return undefined;
    const menuEl = menuRef.current;
    const focusables = () => [...(menuEl?.querySelectorAll("a[href], button:not([disabled])") || [])].filter((el) => el.offsetParent !== null || el === document.activeElement);
    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (!menuEl.contains(active)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    const onResize = () => {
      if (burgerRef.current && getComputedStyle(burgerRef.current).display === "none") setOpen(false);
    };
    // background inertness: everything in <body> except the menu itself (page root, chatbot, widgets)
    const inerted = [];
    [...document.body.children].forEach((el) => {
      if (el === menuEl || /^(SCRIPT|STYLE|LINK|NOSCRIPT)$/.test(el.tagName) || el.inert) return;
      el.inert = true;
      inerted.push(el);
    });
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", onResize);
    const f = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 350);
    const burger = burgerRef.current;
    return () => {
      clearTimeout(f);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", onResize);
      inerted.forEach((el) => { el.inert = false; });
      burger?.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => setOpen(false);
  const contactLink = navItems.find((n) => n.title === "Contact Us")?.link || "/contact-us";
  const talk = (e) => {
    // the buttons are real links to the Contact Us page, so they still work if scripts or the Cal popup are unavailable
    e?.preventDefault?.();
    close();
    bookCall(
      onCta || (() => navigate(contactLink)),
      e
    );
  };

  const tab = open ? 0 : -1;
  const pad = (n) => String(n).padStart(2, "0");

  // Full-screen menu: top-level pages only, no sub options. Rendered in <body> so no parent style can clip or cover it.
  const menu = (
    <div ref={menuRef} className={`hnm${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} data-lenis-prevent>
      <i className="hnm-grid" aria-hidden="true" />
      <i className="hnm-glow" aria-hidden="true" />
      <div className="hnm-top">
        <NavLink to="/" className="hnm-logo" onClick={close} tabIndex={tab} aria-label="DIY Prefab home">
          <img src={ImagePath.Logo} alt="" />
        </NavLink>
        <button ref={closeRef} className="hnm-close" onClick={close} tabIndex={tab} aria-label="Close menu"><i /><i /></button>
      </div>
      <div className="hnm-body">
        <nav className="hnm-nav" aria-label="Main menu">
          <ul>
            {items.map((n, i) => (
              <li key={n.title} style={{ "--i": i }}>
                <NavLink to={n.link} end={n.link === "/"} onClick={close} tabIndex={tab}>
                  <em>{pad(i + 1)}</em>
                  <span>{n.title}</span>
                  <b aria-hidden="true"><FaArrowRight /></b>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <aside className="hnm-aside" style={{ "--i": items.length }}>
          <a className="hnm-cta" href={contactLink} onClick={talk} tabIndex={tab}>Let&apos;s talk<i><FaArrowRight /></i></a>
          <div className="hnm-auth">
            <a href={LOGIN} target="_blank" rel="noopener noreferrer" tabIndex={tab}>Login</a>
            <a href={SIGNUP} target="_blank" rel="noopener noreferrer" tabIndex={tab}>Sign up</a>
          </div>
          <div className="hnm-foot">
            <div className="hnm-contact">
              <a href="mailto:info@diyprefab.com" tabIndex={tab}>info@diyprefab.com</a>
              <a href="tel:+918619015622" tabIndex={tab}>(+91) 8619015622</a>
            </div>
            <div className="hnm-soc">
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="DIY Prefab on LinkedIn" tabIndex={tab}><FaLinkedinIn /></a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  return (
    <>
    <header className={`hn${open ? " open" : ""}`}>
      <div className="hn-bar">
        <NavLink to="/" className="hn-logo" onClick={close} aria-label="DIY Prefab home">
          <img src={ImagePath.Logo} alt="DIY Prefab" />
        </NavLink>
        <nav className={`hn-links${hushed ? " hushed" : ""}`} aria-label="Main" ref={navRef} onPointerMove={() => hushed && setHushed(false)}>
          {items.map((n) => {
            const has = n.submenu?.length > 0;
            const isOpen = drop === n.title;
            const id = `hn-drop-${String(n.title).replace(/\W+/g, "-").toLowerCase()}`;
            return (
              <div className={`hn-item${has ? " has-drop" : ""}${isOpen ? " open" : ""}`} key={n.title} data-drop={has ? n.title : undefined}>
                <NavLink to={n.link} end={n.link === "/"} onClick={() => setDrop(null)}>{n.title}</NavLink>
                {has && (
                  <>
                    <button
                      type="button"
                      className="hn-caret"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      aria-label={`${n.title} submenu`}
                      onClick={() => setDrop(isOpen ? null : n.title)}
                    >
                      <FaChevronDown aria-hidden="true" />
                    </button>
                    <div className="hn-drop" id={id}>
                      {n.submenu.slice(0, 8).map((s) => <NavLink key={s.id} to={s.link} onClick={() => setDrop(null)}>{s.title}</NavLink>)}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </nav>
        <div className="hn-right">
          <a className="hn-login" href={LOGIN} target="_blank" rel="noopener noreferrer">Login</a>
          <a className="hn-talk" href={contactLink} onClick={talk}>Let&apos;s talk</a>
          <a className="hn-signup" href={SIGNUP} target="_blank" rel="noopener noreferrer">Sign up</a>
          <button ref={burgerRef} className="hn-burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
            <i /><i />
          </button>
        </div>
      </div>

    </header>
    {createPortal(menu, document.body)}
    </>
  );
}