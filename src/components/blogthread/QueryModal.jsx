import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import FormServices from "../../services/FormServices";
import { IconClose, IconCheck, IconQuery } from "./icons";

const EMPTY = { name: "", email: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Popup "Query?" form for the blog. It sends to the same /api/inquiry endpoint as the website's contact form,
// with the article title in interest_of_services so the team knows which post the question is about.
const QueryModal = ({ post, onClose }) => {
  const open = !!post;
  const panel = useRef(null);
  const lastFocus = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    setForm(EMPTY); setErrors({}); setSent(false); setServerError(""); setBusy(false);
    lastFocus.current = document.activeElement;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const t = setTimeout(() => panel.current?.querySelector("input")?.focus(), 80);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll("button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      html.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: "" }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = "Please enter your name";
    if (!EMAIL_RE.test(form.email.trim())) er.email = "Please enter a valid email address";
    if (form.message.trim().length < 10) er.message = "Please write at least 10 characters";
    setErrors(er);
    return !Object.keys(er).length;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy || !validate()) return;
    setBusy(true);
    setServerError("");
    try {
      await FormServices.inquiryForm({
        name: form.name.trim(),
        email: form.email.trim(),
        interest_of_services: `Blog query: ${post.title}`.slice(0, 200),
        message: form.message.trim(),
      });
      setSent(true);
    } catch (err) {
      const d = err.response?.data;
      setServerError(
        err.response?.status === 429
          ? `${d?.error || "Too many requests."} ${d?.retryAfter ? `Please wait ${d.retryAfter}.` : "Please try again shortly."}`
          : d?.message || d?.error || "We couldn't send your query. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

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
            className="bt-modal bt-qmodal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bt-q-title"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            <button type="button" className="bt-modal-x" onClick={onClose} aria-label="Close">
              <IconClose width={18} height={18} />
            </button>

            {sent ? (
              <div className="bt-q-done" role="status">
                <span className="bt-q-ok"><IconCheck width={28} height={28} /></span>
                <h2 id="bt-q-title">Query sent</h2>
                <p>Thank you. Our team will reply to <strong>{form.email.trim()}</strong> soon.</p>
                <button type="button" className="bt-btn bt-btn--solid" onClick={onClose}>Close</button>
              </div>
            ) : (
              <>
                <div className="bt-q-head">
                  <span className="bt-q-icon"><IconQuery width={22} height={22} /></span>
                  <h2 id="bt-q-title">Ask a question</h2>
                  <p className="bt-q-about"><span>Regarding</span>{post?.title}</p>
                </div>
                <form onSubmit={submit} noValidate className="bt-q-form">
                  <div className="bt-q-row">
                    <label className="bt-q-field">
                      <span>Your name</span>
                      <input type="text" value={form.name} onChange={set("name")} autoComplete="name" maxLength={100} placeholder="Full name" aria-invalid={!!errors.name} />
                      {errors.name && <em role="alert">{errors.name}</em>}
                    </label>
                    <label className="bt-q-field">
                      <span>Email</span>
                      <input type="email" value={form.email} onChange={set("email")} autoComplete="email" maxLength={150} placeholder="you@company.com" aria-invalid={!!errors.email} />
                      {errors.email && <em role="alert">{errors.email}</em>}
                    </label>
                  </div>
                  <label className="bt-q-field">
                    <span>Your question</span>
                    <textarea rows={3} value={form.message} onChange={set("message")} maxLength={2000} placeholder="What would you like to know about this article?" aria-invalid={!!errors.message} />
                    {errors.message && <em role="alert">{errors.message}</em>}
                  </label>

                  {serverError && <p className="bt-modal-error" role="alert">{serverError}</p>}

                  <button type="submit" className="bt-q-send" disabled={busy}>
                    {busy ? "Sending…" : "Send query"}
                  </button>
                  <p className="bt-q-fine">We usually reply within one working day.</p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default QueryModal;
