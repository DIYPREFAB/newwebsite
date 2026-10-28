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

export const FIGURES = {
  "evidence-flow": EvidenceFlow,
  "drainage-map": DrainageMap,
  "status-panel": StatusPanel,
  "retrofit-register": RetrofitRegister,
  "forecast-table": ForecastTable,
};
