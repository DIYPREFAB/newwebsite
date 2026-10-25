import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import ROUTE_PATHS from "../routes/RoutePath";

// Real "not found" page: noindex so crawlers never keep it, and the production server answers unknown URLs with HTTP 404
// (see server.js). The old page said "Coming Soon" with a 200 status, which search engines treat as a soft 404.
const PageNotFound = () => (
  <div className="nf-page" style={{ background: "#001524", minHeight: "100vh", color: "#fff" }}>
    <Helmet>
      <title>Page Not Found | DIY PreFab</title>
      <meta name="robots" content="noindex, follow" />
      <meta name="description" content="This page does not exist or has moved. Use the links to find what you were looking for." />
    </Helmet>
    <NavBar />
    <main
      style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 24px 80px", gap: 16 }}
    >
      <p style={{ margin: 0, letterSpacing: ".2em", textTransform: "uppercase", color: "#2fd4c0", fontSize: 13 }}>Error 404</p>
      <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 700 }}>Page not found</h1>
      <p style={{ margin: 0, maxWidth: 520, color: "#a8dadc", fontSize: 17, lineHeight: 1.6 }}>
        The page you are looking for does not exist or has moved. Head back to the homepage or tell us what you need.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
        <Link to="/" style={{ background: "#2fd4c0", color: "#001524", padding: "12px 26px", borderRadius: 999, fontWeight: 700, textDecoration: "none" }}>
          Go to homepage
        </Link>
        <Link to={ROUTE_PATHS.CONTACT_US} style={{ border: "1px solid #2fd4c0", color: "#fff", padding: "12px 26px", borderRadius: 999, fontWeight: 700, textDecoration: "none" }}>
          Contact us
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default PageNotFound;
