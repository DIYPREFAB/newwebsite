import React from "react";
import { Helmet } from "react-helmet-async";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import SeoHelmet from "../common/SeoHelmet";
import useSeoHelmet from "../hooks/ReactHelmet";
import ContactSections from "../components/contact3d/ContactSections";

const ContactUs = () => {
  const seo = useSeoHelmet("contact-us");

  return (
    <div className="ct-page">
      {/* Fallback title until the CMS SEO record loads (or if it is missing) */}
      {!(seo?.meta_title || seo?.title) && (
        <Helmet>
          <title>Contact Us | DIY PreFab</title>
          <meta
            name="description"
            content="Contact DIY PreFab: reach our engineers in Udaipur by phone, email or the contact form, or book a call, for prefab and industrial structure solutions."
          />
        </Helmet>
      )}
      <SeoHelmet seo={seo} />

      <NavBar />
      <ContactSections />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default React.memo(ContactUs);
