import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import PsSections from "../components/ps3d/PsSections";

// New Products & Services page (3D scroll motion). This is the only version of the page now;
// Routes.jsx maps it to its route. SEO comes from the same CMS record as before ("product-services").
const ProductandServices = () => {
  const seo = useSeoHelmet("product-services");

  return (
    <div className="ps-page">
      {/* Fallback title until the CMS SEO record loads (or if it is missing) */}
      {!(seo?.meta_title || seo?.title) && (
        <Helmet>
          <title>Products &amp; Services | DIY PreFab</title>
          <meta
            name="description"
            content="Prefabricated construction & execution from DIY PREFAB: pre-engineered buildings, industrial sheds, warehouses, structural steel fabrication and site execution."
          />
        </Helmet>
      )}
      <SeoHelmet seo={seo} />

      <NavBar />
      <PsSections />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default React.memo(ProductandServices);
