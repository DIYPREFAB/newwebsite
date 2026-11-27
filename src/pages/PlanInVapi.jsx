import React from "react";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import VapiSections from "../components/vapi3d/VapiSections";

// "Plan in Vapi?" page (3D scroll motion): Vapi GIDC factory sheds and warehouses, building type, three checks and an enquiry mockup.
// Title / description / canonical come from the route-level SEO defaults (src/seo/routeMeta.js).
const PlanInVapi = () => (
  <div className="vp-page">
    <NavBar />
    <VapiSections />
    <Footer />
    <ScrollToTop />
  </div>
);

export default React.memo(PlanInVapi);
