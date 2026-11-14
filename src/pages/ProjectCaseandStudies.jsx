import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import ProjectsSections from "../components/projects3d/ProjectsSections";

// Projects & Case Studies page (3D scroll motion). Featured projects, case studies, our approach, the project gallery
// and testimonials are all sections of this one page (the old Success Stories, Client Testimonials, Project Gallery and
// Hall of Fame sub-pages were removed and redirect here).
const ProjectCaseStudies = () => {
  const seo = useSeoHelmet("project-case-studies");

  return (
    <div className="pj-page">
      {/* Fallback title until the CMS SEO record loads (or if it is missing) */}
      {!(seo?.meta_title || seo?.title) && (
        <Helmet>
          <title>Projects & Case Studies | DIY PreFab</title>
          <meta
            name="description"
            content="Featured pre-engineered building and steel projects by DIY PreFab: Wonder Cement, Banswara Syntex, Assure Buildcon, Tyre Technocrats and RSWM, with case studies, a project gallery and client confirmations."
          />
        </Helmet>
      )}
      <SeoHelmet seo={seo} />

      <NavBar />
      <ProjectsSections />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default React.memo(ProjectCaseStudies);
