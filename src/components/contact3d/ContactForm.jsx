import { useCallback, useState } from "react";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import FormServices from "../../services/FormServices";

const EMPTY = { name: "", company: "", phone: "", email: "", subject: "", message: "" };

// Same rules as the original contact form.
const validate = (f) => {
  const e = {};
  if (!f.name.trim()) e.name = "Name is required";
  else if (f.name.trim().length < 2) e.name = "Name must be at least 2 characters";
  if (!f.company.trim()) e.company = "Company is required";
  if (!f.phone.trim()) e.phone = "Phone is required";
  else if (!/^[+]?[\d\s\-()]{10,}$/.test(f.phone.replace(/\s/g, ""))) e.phone = "Please enter a valid phone number";
  if (!f.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Please enter a valid email address";
  if (!f.subject.trim()) e.subject = "Subject is required";
  else if (f.subject.trim().length < 3) e.subject = "Subject must be at least 3 characters";
  if (!f.message.trim()) e.message = "Message is required";
  else if (f.message.trim().length < 10) e.message = "Message must be at least 10 characters";
  return e;
};

// [name, label, type, autocomplete, full width]
const FIELDS = [
  ["name", "Name", "text", "name", false],
  ["company", "Company", "text", "organization", false],
  ["phone", "Phone", "tel", "tel", false],
  ["email", "Email", "email", "email", false],
  ["subject", "Subject", "text", "off", true],
];

export default function ContactForm() {
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: "error" | "warning", text } while the form is shown
  const [sent, setSent] = useState(false);

  const change = useCallback((e) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
    setErrors((p) => (p[name] ? { ...p, [name]: "" } : p));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus({ type: "error", text: "Please correct the highlighted fields." });
      document.getElementById(`ct-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setStatus(null);
    setLoading(true);
    try {
      await FormServices.contact(data);
      setData(EMPTY);
      setSent(true);
    } catch (err) {
      const d = err.response?.data;
      if (err.response?.status === 429 && (d?.code === "FORM_RATE_LIMIT_EXCEEDED" || d?.code === "CONTACT_RATE_LIMIT_EXCEEDED")) {
        setStatus({ type: "warning", text: `${d.error} Please wait ${d.retryAfter}.` });
      } else {
        setStatus({ type: "error", text: d?.message || d?.error || err.message || "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const field = ([name, label, type, ac, full]) => (
    <div className={`ct-field${full ? " full" : ""}${errors[name] ? " bad" : ""}`} key={name}>
      <input
        id={`ct-${name}`} name={name} type={type} autoComplete={ac} placeholder=" "
        value={data[name]} onChange={change} disabled={loading}
        aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `ct-${name}-e` : undefined}
        inputMode={type === "tel" ? "tel" : undefined}
      />
      <label htmlFor={`ct-${name}`}>{label}<b aria-hidden="true"> *</b></label>
      <i className="ct-line" aria-hidden="true" />
      {errors[name] && <small id={`ct-${name}-e`} role="alert">{errors[name]}</small>}
    </div>
  );

  if (sent) {
    return (
      <div className="ct-sent" role="status" aria-live="polite">
        <span className="ct-sent-ic"><FaCheck /></span>
        <h3>Message sent</h3>
        <p>Thank you for your message! We&apos;ll get back to you soon.</p>
        <button type="button" className="ct-btn ct-btn--ghost" onClick={() => setSent(false)}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="ct-form" onSubmit={submit} noValidate>
      <div className="ct-form-head">
        <h3>Send us a Message</h3>
        <span>All fields are required</span>
      </div>
      <div className="ct-grid">
        {FIELDS.map(field)}
        <div className={`ct-field full area${errors.message ? " bad" : ""}`}>
          <textarea
            id="ct-message" name="message" rows={5} placeholder=" " value={data.message} onChange={change} disabled={loading}
            aria-invalid={!!errors.message} aria-describedby={errors.message ? "ct-message-e" : undefined}
          />
          <label htmlFor="ct-message">Message<b aria-hidden="true"> *</b></label>
          <i className="ct-line" aria-hidden="true" />
          {errors.message && <small id="ct-message-e" role="alert">{errors.message}</small>}
        </div>
      </div>
      {status && <p className={`ct-status ${status.type}`} role="alert">{status.text}</p>}
      <button type="submit" className="ct-btn" disabled={loading}>
        {loading ? (<><span className="ct-spin" aria-hidden="true" />Sending...</>) : (<>Send Message<i><FaArrowRight /></i></>)}
      </button>
    </form>
  );
}
