import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import KeyBenefitsSections from "../components/keybenefits/KeyBenefitsSections";
import { TITLE } from "../components/keybenefits/keybenefitsData";

const KeyBenefits = () => {
  const seo = useSeoHelmet("key-benefits-of-prefab-construction");

  return (
    <div className="kb-page">
      {/* Fallback title until the CMS SEO record loads (or if it is missing) */}
      {!(seo?.meta_title || seo?.title) && (
        <Helmet>
          <title>{`${TITLE} | DIY PreFab`}</title>
          <meta
            name="description"
            content="Key benefits of prefab construction: faster delivery, fixed transparent costs, factory-controlled quality and sustainable, modular steel structures from DIY PreFab."
          />
        </Helmet>
      )}
      <SeoHelmet seo={seo} />

      <NavBar />
      <KeyBenefitsSections />

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default React.memo(KeyBenefits);
