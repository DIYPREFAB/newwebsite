import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DEMO_AUTH, preloadGoogle } from "./authService";
import { GoogleG, IconClose, IconThread } from "./icons";

const COPY = {
  react: { title: "Sign in to react", body: "Let the author and other readers know what was useful." },
  comment: { title: "Sign in to join the discussion", body: "Ask a question or add your experience from site, design or procurement." },
  reply: { title: "Sign in to reply", body: "Replies keep each conversation attached to the comment it answers." },
  like: { title: "Sign in to mark helpful", body: "Mark the comments that helped you." },
  generic: { title: "Sign in to take part", body: "Reactions, comments and replies are tied to a Google account." },
};

const Spinner = () => <span className="bt-spin" aria-hidden="true" />;

const AuthModal = ({ state, onClose, onGoogle }) => {
  const { open, reason, busy, error } = state;
  const panel = useRef(null);
  const lastFocus = useRef(null);
  const copy = COPY[reason] || COPY.generic;

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    preloadGoogle().catch(() => {});
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const t = setTimeout(() => panel.current?.querySelector("[data-autofocus]")?.focus(), 60);
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll("button:not([disabled]), a[href]");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      html.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, busy, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="bt-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
        >
          <motion.div
            ref={panel}
            className="bt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bt-modal-title"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            <button type="button" className="bt-modal-x" onClick={onClose} disabled={busy} aria-label="Close">
              <IconClose width={18} height={18} />
            </button>
            <span className="bt-modal-glyph"><IconThread width={24} height={24} /></span>
            <h2 id="bt-modal-title">{copy.title}</h2>
            <p className="bt-modal-body">{copy.body}</p>

            <button type="button" className="bt-google" onClick={onGoogle} disabled={busy} data-autofocus>
              {busy ? <Spinner /> : <GoogleG />}
              <span>{busy ? "Connecting to Google…" : "Continue with Google"}</span>
            </button>

            <AnimatePresence initial={false}>
              {error && (
                <motion.p
                  className="bt-modal-error"
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <p className="bt-modal-fine">
              New here? Signing in with Google creates your commenter profile. We use your name and photo on your comments. By continuing you agree to our{" "}
              <Link to="/terms-of-service">Terms</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.
            </p>
            {DEMO_AUTH && <p className="bt-modal-preview">Preview mode: this signs you in as a demo reader on this device only.</p>}
            <button type="button" className="bt-modal-skip" onClick={onClose} disabled={busy}>Not now</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AuthModal;
