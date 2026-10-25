import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import AboutSections from "../components/about3d/AboutSections";

// About Us page (3D scroll motion). The About sub-pages (company overview, vision, sustainability, process, plant) are separate routes.
const AboutUs = () => {
  const seo = useSeoHelmet("about-us");

  return (
    <div className="ab-page">
      {/* Fallback title until the CMS SEO record loads (or if it is missing) */}
      {!(seo?.meta_title || seo?.title) && (
        <Helmet>
          <title>About Us | DIY PreFab</title>
          <meta
            name="description"
            content="About DIY PreFab: company overview, our founders, vision and mission, sustainability, manufacturing process and our 10,000+ sq. m production plant in Banswara, Rajasthan."
          />
        </Helmet>
      )}
      <SeoHelmet seo={seo} />

      <NavBar />
      <AboutSections />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default React.memo(AboutUs);
