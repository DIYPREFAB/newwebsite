import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import AppSections from "../components/app3d/AppSections";

// New Applications page. This is the only version of the page now; Routes.jsx maps it to its route.
// Backend wiring is the same as the old page: the CMS SEO record "applications" (useSeoHelmet + SeoHelmet).
const Application = () => {
  const seo = useSeoHelmet("applications");

  return (
    <div className="cr-page">
      {/* Fallback title until the CMS SEO record loads (or if it is missing) */}
      {!(seo?.meta_title || seo?.title) && (
        <Helmet>
          <title>Applications | DIY PreFab</title>
          <meta
            name="description"
            content="Prefab and pre-engineered steel buildings for residential, commercial, industrial, educational and healthcare use. See how one build system adapts to every sector."
          />
        </Helmet>
      )}
      <SeoHelmet seo={seo} />

      <NavBar />
      <AppSections />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default React.memo(Application);
