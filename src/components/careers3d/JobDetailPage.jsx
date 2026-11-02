import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import NavBar from "../../common/NavBar";
import Footer from "../../common/Footer";
import ScrollToTop from "../../common/ScrollToTop";
import JobDetailSections from "./JobDetailSections";
import { getJob } from "./careersData";

const JobDetailPage = () => {
  const { jobId } = useParams();
  const j = getJob(jobId);
  return (
    <div className="ct-page">
      <Helmet><title>{j ? `${j.title} | Careers | DIY PreFab` : "Job opening | DIY PreFab"}</title></Helmet>
      <NavBar />
      <JobDetailSections />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default React.memo(JobDetailPage);
