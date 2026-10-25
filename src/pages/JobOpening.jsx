import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import JobSections from "../components/careers3d/JobSections";

const JobOpening = () => {
  const seo = useSeoHelmet("job-openings");

  return (
    <div className="ct-page">
      {!(seo?.meta_title || seo?.title) && (
        <Helmet>
          <title>Job Openings | DIY PreFab</title>
        </Helmet>
      )}
      <SeoHelmet seo={seo} />
      <NavBar />
      <JobSections />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default React.memo(JobOpening);
