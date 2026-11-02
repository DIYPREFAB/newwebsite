import { Link, useParams } from "react-router-dom";
import { FaArrowRight, FaArrowLeft, FaMapMarkerAlt, FaBriefcase, FaClock } from "react-icons/fa";
import { mailAttrs } from "../../utils/mailLink";
import ROUTE_PATHS from "../../routes/RoutePath";
import { getJob, APPLY_EMAIL } from "./careersData";
import "../home3d/home3d.css";
import "../home3d/home3d-v4.css";
import "../home3d/home3d-v5.css";
import "../contact3d/contact3d.css";
import "./careers3d.css";

// Full job description page: /job-openings/:jobId
export default function JobDetailSections() {
  const { jobId } = useParams();
  const j = getJob(jobId);

  if (!j) {
    return (
      <div className="ct-root cr-root jd-root">
        <div className="jd-wrap">
          <div className="cr-empty">
            <h3>This position is no longer open</h3>
            <p>It may have been filled or removed. Please see our current openings.</p>
            <Link to={ROUTE_PATHS.JOB_OPENINGS} className="ct-btn">All job openings<i><FaArrowRight /></i></Link>
          </div>
        </div>
      </div>
    );
  }

  const d = j.detail;
  const mail = mailAttrs(APPLY_EMAIL, `Application for ${j.title} - ${j.location}`);

  return (
    <div className="ct-root cr-root jd-root">
      <div className="jd-wrap">
        <Link to={ROUTE_PATHS.JOB_OPENINGS} className="jd-back"><FaArrowLeft aria-hidden="true" />All job openings</Link>

        <header className="jd-head">
          <span className="ct-tag">Job description</span>
          <h1>{j.title}</h1>
          {d.role && d.role !== j.title && <p className="jd-role">{d.role}</p>}
          <ul className="jd-facts">
            <li><FaBriefcase aria-hidden="true" />{j.company}</li>
            <li><FaMapMarkerAlt aria-hidden="true" />{j.location}</li>
            {d.type && <li><FaClock aria-hidden="true" />{d.type}</li>}
          </ul>
          <p className="jd-sub">
            {d.experience && <span><b>Experience:</b> {d.experience}</span>}
            <span><b>Vacancies:</b> {j.vacancies}</span>
            <span><b>Posted on:</b> {j.postedOn}</span>
          </p>
          <a className="ct-btn" {...mail}>Apply Now<i><FaArrowRight /></i></a>
        </header>

        <article className="jd-body cr-detail-pad">
          {d.about && (<section><h2>About the role</h2><p>{d.about}</p></section>)}
          {d.sections.map((s) => (
            <section key={s.h}><h2>{s.h}</h2><ul className="cr-pts">{s.pts.map((t) => <li key={t}>{t}</li>)}</ul></section>
          ))}
          {d.note && <p className="cr-note">{d.note}</p>}
          <div className="jd-apply">
            <p>Send your CV to <b>{APPLY_EMAIL}</b></p>
            <a className="ct-btn" {...mail}>Apply Now<i><FaArrowRight /></i></a>
          </div>
        </article>
      </div>
    </div>
  );
}
