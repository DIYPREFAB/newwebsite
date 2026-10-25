// Legacy / mistyped URLs that must permanently redirect (301 on the server, <Navigate replace> in the browser).
// Keep this list in sync with what search engines already know about: the old sitemap listed /about, /services, /projects
// and /contact, and the removed "Home" dropdown pages were indexed too. Single source of truth for the router,
// the Node server (server.js) and the sitemap script.
const LEGACY_REDIRECTS = {
  "/about": "/about-us",
  "/services": "/product-services",
  "/projects": "/project-case-studies",
  "/contact": "/contact-us",
  "/home": "/",
  "/introduction-to-diy-prefab-solutions": "/key-benefits-of-prefab-construction",
  "/featured-projects": "/project-case-studies",
  "/generate-sitemap": "/",
};

export default LEGACY_REDIRECTS;
