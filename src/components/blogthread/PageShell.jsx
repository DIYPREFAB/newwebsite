import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

// Serif for article titles and body, Lato (already used site-wide) for interface text.
export const FontLinks = () => (
  <Helmet>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap" />
  </Helmet>
);

// Light page under the site's floating nav: removes the nav's reserved top padding, like the other 3D pages do.
export const useBlogBody = () => {
  useEffect(() => {
    document.body.classList.add("bt-3d");
    return () => document.body.classList.remove("bt-3d");
  }, []);
};
