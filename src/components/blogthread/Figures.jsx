import React from "react";
import { motion, useInView } from "framer-motion";

const useReveal = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -15% 0px" });
  return [ref, inView];
};

/* A flow of numbered / named steps, replays each time it scrolls into view */
const Flow = ({ steps, label, numbered }) => {
  const [ref, inView] = useReveal();
  return (
    <ol className={`bt-flow${numbered ? " is-numbered" : ""}`} ref={ref} aria-label={label} style={{ "--n": steps.length }}>
      {steps.map((s, i) => (
        <motion.li
          key={s.title}
          className="bt-flow-step"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ delay: i * 0.14, duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {numbered && <span className="bt-flow-n">{i + 1}</span>}
          <strong>{s.title}</strong>
          <span>{s.text}</span>
          {i < steps.length - 1 && (
            <motion.i
              className="bt-flow-link"
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ delay: i * 0.14 + 0.25, duration: 0.4 }}
            />
          )}
        </motion.li>
      ))}
    </ol>
  );
};

export const EvidenceFlow = () => (
  <figure className="bt-fig">
    <Flow
      label="A proposed evidence link from a delivered steel item through a receiving record to its certificate reference and review status."
      steps={[
        { title: "Delivered item", text: "Description, grade, size, quantity" },
        { title: "Receiving record", text: "Identification observed, heat or batch reference" },
        { title: "Certificate reference", text: "File, issuer, entry checked" },
        { title: "Review status", text: "Reviewer, date, open discrepancy" },
      ]}
    />
    <figcaption>The evidence link a reviewer should be able to follow. Each step is a separate record, so an observation never silently becomes a conclusion.</figcaption>
  </figure>
);

export const DrainageMap = () => (
  <figure className="bt-fig">
    <Flow
      numbered
      label="A conceptual drainage coordination path from a roof zone through a gutter, downpipe and site-drain connection to an outfall."
      steps={[
        { title: "Roof zone", text: "Labelled on the roof plan" },
        { title: "Gutter and outlet", text: "Roof-drainage designer" },
        { title: "Downpipe", text: "Reference and location" },
        { title: "Site-drain connection", text: "Both designers confirm" },
        { title: "Outfall", text: "Civil designer confirms" },
      ]}
    />
    <div className="bt-fig-flag">
      <span>Overflow route</span> Ask the designers to identify it and review it as a separate question.
    </div>
    <figcaption>Coordination map only. Sizes, levels, capacity and overflow arrangements require project-specific design.</figcaption>
  </figure>
);

export const RetrofitRegister = () => (
  <figure className="bt-fig">
    <Flow
      numbered
      label="Example retrofit evidence register separating archived drawings, current observations and an unresolved equipment support question."
      steps={[
        { title: "Record information", text: "Archived drawing: no suspended services listed in this bay." },
        { title: "Current observation", text: "Dated site note: existing service supports recorded." },
        { title: "Unresolved question", text: "How do the existing alterations affect review of the new proposal?" },
      ]}
    />
    <figcaption>Illustrative evidence register for a hypothetical retrofit. These entries organise a review question; they do not establish structural capacity or permission to install.</figcaption>
  </figure>
);

export const StatusPanel = () => {
  const [ref, inView] = useReveal();
  const rows = [
    { tone: "amber", tag: "Announced", title: "MoUs", text: "12 MoUs covering approximately 300 acres, with proposed investment of around ₹4,200 crore. Proposals, not completed investment." },
    { tone: "teal", tag: "Reported underway", title: "Trunk infrastructure", text: "Construction has begun on roads, water, wastewater and power infrastructure." },
    { tone: "slate", tag: "Verify individually", title: "Plot readiness", text: "Not established by the release. Confirm connections and permissions plot by plot." },
  ];
  return (
    <figure className="bt-fig">
      <div className="bt-status" ref={ref}>
        {rows.map((r, i) => (
          <motion.div
            key={r.title}
            className={`bt-status-row is-${r.tone}`}
            initial={{ opacity: 0, x: -14 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
            transition={{ delay: i * 0.13, duration: 0.42 }}
          >
            <span className="bt-status-tag">{r.tag}</span>
            <div>
              <strong>{r.title}</strong>
              <p>{r.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <figcaption>Three separate facts in the 24 October release. Keep them separate in any programme.</figcaption>
    </figure>
  );
};

export const ForecastTable = () => (
  <figure className="bt-fig">
    <div className="bt-table-wrap">
      <table className="bt-table">
        <caption>Forecast steel demand growth, worldsteel Short Range Outlook, released 12 October 2026</caption>
        <thead>
          <tr><th scope="col">Region</th><th scope="col">2026 (forecast)</th><th scope="col">2027 (forecast)</th></tr>
        </thead>
        <tbody>
          <tr><th scope="row">India</th><td>7.9%</td><td>8.0%</td></tr>
          <tr><th scope="row">World</th><td>Broadly unchanged</td><td>1.7%</td></tr>
        </tbody>
      </table>
    </div>
    <figcaption>Association forecasts reflecting data available in early September 2026. Not outcomes, and not project prices.</figcaption>
  </figure>
);

export const OperatingCycleSheet = () => {
  const [ref, inView] = useReveal();
  const fields = ["Time or period", "Zone", "Activity", "Door and system routine", "Moisture-source evidence", "Designer question"];
  const states = [
    ["Dispatch", "Loading zone", "Goods movement", "Operator reports doors may remain open", "Confirm incoming-goods condition and any relevant available readings", "Does the assessment represent this door routine?"],
    ["Post-dispatch cleaning", "Storage floor", "Planned floor washing", "Door and system operation not yet stated", "Obtain the proposed cleaning and drying routine", "What cleaning and drying information is needed?"],
    ["Closed hours", "Packing zone", "No planned production activity", "Cooling shutdown proposed; confirm door routine", "No corresponding condition readings available", "Which unoccupied state and evidence need assessment?"],
  ];
  return (
    <figure className="bt-fig" aria-label="Illustrative PEB operating-cycle sheet linking dispatch, cleaning and closed hours to zone activities, door and system routines, moisture evidence and designer questions.">
      <div className="bt-ops" ref={ref}>
        {states.map((row, i) => (
          <motion.section
            key={row[0]}
            className="bt-ops-state"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ delay: i * 0.12, duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <p className="bt-ops-head">Operating state {i + 1}</p>
            <dl>
              {fields.map((f, j) => (
                <React.Fragment key={f}>
                  <dt>{f}</dt>
                  <dd>{row[j]}</dd>
                </React.Fragment>
              ))}
            </dl>
          </motion.section>
        ))}
      </div>
      <figcaption>Illustrative warehouse operating cycle. Each row frames a question for qualified project reviewers; it is not a diagnosis, moisture calculation or design solution.</figcaption>
    </figure>
  );
};

/* ---- Navsari to Vapi post ---------------------------------------------------------------------------- */

/* One approved, understated site photo from the 2025 Assure Buildcon project goes here.
   Leave as null to show a clearly labelled illustration instead. Only fill in `caption` after the location and year are verified.
   Example:
   { src: "/images/blog/navsari-assure-buildcon-2025.jpg",
     alt: "Descriptive alt text for the site photo",
     caption: "Kalvach, Gandevi, Navsari, 2025." } */
const NAVSARI_PHOTO = {
  src: "/images/assure/aerial-angle.webp",
  alt: "Aerial view of the steel frame of a pre-engineered building under construction at Kalvach, Gandevi, with cleared ground and trees around the site.",
  caption: "The Kalvach, Gandevi project in Navsari, 2025.",
};

export const NavsariSite = () => (
  <figure className="bt-fig bt-fig--photo">
    {NAVSARI_PHOTO ? (
      <img src={NAVSARI_PHOTO.src} alt={NAVSARI_PHOTO.alt} loading="lazy" />
    ) : (
      <svg
        className="bt-illus"
        viewBox="0 0 400 260"
        role="img"
        aria-label="Illustration of a steel portal frame with two columns, sloping rafters and diagonal bracing, representing a pre-engineered building. Not a photograph of the project."
      >
        <rect width="400" height="260" fill="#e9f2ef" />
        <path d="M20 215 H380" stroke="#5a7282" strokeWidth="2" />
        <path d="M70 215 V105 L200 50 L330 105 V215" fill="none" stroke="#1d3557" strokeWidth="8" strokeLinejoin="round" />
        <path d="M70 105 H330" stroke="#1d3557" strokeWidth="5" />
        <path d="M70 215 L200 80 L330 215" fill="none" stroke="#0e9f8f" strokeWidth="3" strokeDasharray="7 6" />
        <rect x="56" y="215" width="28" height="8" fill="#5a7282" />
        <rect x="316" y="215" width="28" height="8" fill="#5a7282" />
        <text x="200" y="246" textAnchor="middle" fontFamily="Lato, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#5a7282">ILLUSTRATION</text>
      </svg>
    )}
    <figcaption>
      {NAVSARI_PHOTO ? NAVSARI_PHOTO.caption : "Illustration of a pre-engineered steel frame. Not a photograph of the project."}
    </figcaption>
  </figure>
);

export const ProjectFlow = () => (
  <figure className="bt-fig">
    <Flow
      numbered
      label="The five stages of a PEB project in order: drawing, engineering, procurement, fabrication and erection, each feeding the next."
      steps={[
        { title: "Drawing", text: "Approved drawings" },
        { title: "Engineering", text: "Design and detailing" },
        { title: "Procurement", text: "Orders and lead times" },
        { title: "Fabrication", text: "Factory work and inspection" },
        { title: "Erection", text: "Dispatch, erection, handover" },
      ]}
    />
    <figcaption>How a PEB project flows from drawing to erection. A delay at any stage reaches site as a delay in erection, so each stage needs its own date and owner.</figcaption>
  </figure>
);

/* The approved Vapi meeting photo, cropped to a wide 3:2 rectangle. It sits under "Over tea in Vapi".
   Confirm permission before publishing identifiable photos and names, and do not imply an endorsement or partnership. */
const VAPI_MEETING_PHOTO = {
  src: "/images/blog/vapi-meeting-sarang-archibuild.webp",
  alt: "Two men seated at a table in front of an exposed red-brick wall, one in a green shirt and one in a dark blazer, both looking at the camera.",
  caption: "Morning tea in Vapi with Sarang ArchiBuild, 19 November 2026.",
  width: 1000,
  height: 667,
};

export const VapiMeeting = () => (
  <figure className="bt-fig bt-fig--photo bt-fig--wide">
    <img
      src={VAPI_MEETING_PHOTO.src}
      alt={VAPI_MEETING_PHOTO.alt}
      width={VAPI_MEETING_PHOTO.width}
      height={VAPI_MEETING_PHOTO.height}
      loading="lazy"
    />
    <figcaption>{VAPI_MEETING_PHOTO.caption}</figcaption>
  </figure>
);

export const FIGURES = {
  "evidence-flow": EvidenceFlow,
  "drainage-map": DrainageMap,
  "status-panel": StatusPanel,
  "retrofit-register": RetrofitRegister,
  "forecast-table": ForecastTable,
  "operating-cycle-sheet": OperatingCycleSheet,
  "navsari-site": NavsariSite,
  "project-flow": ProjectFlow,
  "vapi-meeting": VapiMeeting,
};
