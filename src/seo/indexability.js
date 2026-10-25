import ROUTE_PATHS from "../routes/RoutePath.js";

// Pure data (no JSX / assets) so the build scripts and the Node server can import it too.
// Routes that exist but must not be indexed: campaign landing pages and thin utility pages.
export const NOINDEX_PATHS = [
  ROUTE_PATHS.LINKEDIN_FREE_ASSESSMENT,
  ROUTE_PATHS.LINKEDIN_CASE_STUDIES,
  ROUTE_PATHS.LINKEDIN_CONSULTATION,
  ROUTE_PATHS.CARD_DETAILS,
  ROUTE_PATHS.INQUIRY_FORM,
];

// Every concrete (parameter-free) route the router serves, plus "/".
export const STATIC_PATHS = [
  "/",
  ...Object.values(ROUTE_PATHS).filter((p) => !p.includes(":") && p !== ROUTE_PATHS.WE_OFFER_CARD_DETAILS),
];

// Parameterised routes, as regular expressions (same shapes as the <Route path> patterns).
export const PATTERN_PATHS = [/^\/blog\/[^/]+$/, /^\/details\/[^/]+$/];
