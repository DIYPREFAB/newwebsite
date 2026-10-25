import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "../../common/NavBar";
import Footer from "../../common/Footer";
import ScrollToTop from "../../common/ScrollToTop";
import SeoHelmet from "../../common/SeoHelmet";
import useSeoHelmet from "../../hooks/ReactHelmet";
import CareersSections from "./CareersSections";

// Careers and Work Culture share one redesigned page. Each route keeps its own CMS SEO record (slug).
const CareersPage = ({ slug, fallbackTitle }) => {
  const seo = useSeoHelmet(slug);
  return (
    <div className="ct-page">
      {!(seo?.meta_title || seo?.title) && (
        <Helmet>
          <title>{fallbackTitle}</title>
        </Helmet>
      )}
      <SeoHelmet seo={seo} />
      <NavBar />
      <CareersSections />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default React.memo(CareersPage);
