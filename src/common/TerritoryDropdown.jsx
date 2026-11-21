import React, { useEffect, useId, useRef, useState } from "react";
import "./territoryDropdown.css";

/**
 * Territory filter as a dropdown (listbox). options: [{ value, label, n }], value: the selected option's value.
 * variant "dark" for the Projects page, "light" for Blog & News.
 */
const Pin = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.4" />
  </svg>
);
const Chevron = () => (
  <svg className="td-chev" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
);
const Tick = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);

export default function TerritoryDropdown({ options, value, onChange, label = "Territory", variant = "dark" }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef(null);
  const btn = useRef(null);
  const uid = useId();
  const listId = `${uid}-list`;
  const selIdx = Math.max(0, options.findIndex((o) => o.value === value));
  const sel = options[selIdx];

  const openMenu = () => { setActive(selIdx); setOpen(true); };
  const close = (focus = true) => { setOpen(false); if (focus) btn.current?.focus(); };
  const choose = (i) => { onChange(options[i].value); close(); };

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${uid}-o${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, uid]);

  const onKey = (e) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); openMenu(); }
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % options.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + options.length) % options.length); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(active); }
    else if (e.key === "Tab") setOpen(false);
  };

  return (
    <div className={`td td--${variant}${open ? " is-open" : ""}`} ref={wrap}>
      <button
        ref={btn}
        type="button"
        className="td-btn"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${uid}-o${active}` : undefined}
        aria-label={`${label}: ${sel?.label}`}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onKey}
      >
        <Pin />
        <span className="td-k">{label}</span>
        <span className="td-v">{sel?.label}</span>
        <span className="td-n">{sel?.n}</span>
        <Chevron />
      </button>
      {open && (
        <ul className="td-menu" id={listId} role="listbox" aria-label={label}>
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${uid}-o${i}`}
              role="option"
              aria-selected={o.value === value}
              className={`td-opt${i === active ? " is-active" : ""}${o.value === value ? " is-sel" : ""}`}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
            >
              <span className="td-opt-l">{o.label}</span>
              <span className="td-n">{o.n}</span>
              <span className="td-tick">{o.value === value && <Tick />}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
