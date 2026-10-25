import ROUTE_PATHS from "../routes/RoutePath";
import { navItems } from "../Constants";
import { NOINDEX_PATHS, STATIC_PATHS } from "./indexability";

// Route-level SEO defaults: every indexable route gets its own title, description, Open Graph tags and canonical URL.
// The backend CMS record (GET /api/seo/:slug) still overrides title/description/OG when it exists, but a route can never
// fall back to the homepage tags again. Keep wording factual: no unverified numbers (see the claims note in the README).
export const SITE_URL = "https://diyprefab.com";
export const SITE_NAME = "DIY PreFab";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.webp`;

const HOME = {
  title: "DIY PreFab | Pre-Engineered Steel Buildings & Prefab Construction in India",
  description:
    "DIY PreFab designs, fabricates and erects pre-engineered steel buildings, warehouses, factories and prefab structures across India. See how the process works and book a call with our team.",
};

// Hand-written entries for the main pages.
const EXPLICIT = {
  "/": HOME,
  [ROUTE_PATHS.KEY_BENEFITS_OF_PREFAB_CONSTRUCTION]: {
    title: "Key Benefits of Prefab Construction | DIY PreFab",
    description:
      "Faster delivery, fixed and transparent costs, factory-controlled quality and recyclable steel: the key benefits of prefab and pre-engineered steel construction with DIY PreFab.",
  },
  [ROUTE_PATHS.ABOUT_US]: {
    title: "About DIY PreFab | Company, Vision, Process and Production Plant",
    description:
      "About DIY PreFab: company overview, vision and mission, sustainability, manufacturing process and our production plant in Banswara, Rajasthan.",
  },
  [ROUTE_PATHS.PRODUCT_SERVICES]: {
    title: "Products & Services | Pre-Engineered Buildings and Prefab Kits | DIY PreFab",
    description:
      "Prefabricated construction and execution from DIY PreFab: pre-engineered buildings, industrial sheds, warehouses, structural steel fabrication, wall and roofing solutions and site execution.",
  },
  [ROUTE_PATHS.APPLICATIONS]: {
    title: "Applications | Prefab Steel Buildings for Every Sector | DIY PreFab",
    description:
      "Prefab and pre-engineered steel buildings for residential, commercial, industrial, educational and healthcare use. See how one build system adapts to each sector.",
  },
  [ROUTE_PATHS.PROJECT_CASE_STUDIES]: {
    title: "Projects & Case Studies | DIY PreFab",
    description: "Delivered prefab and pre-engineered steel projects, success stories, client testimonials and the project gallery from DIY PreFab.",
  },
  [ROUTE_PATHS.BLOG_NEWS]: {
    title: "Blog & News | Prefab and Steel Construction Insights | DIY PreFab",
    description:
      "Articles and news from DIY PreFab on prefab construction, pre-engineered steel buildings, industry trends, construction tips and sustainability.",
  },
  [ROUTE_PATHS.CAREERS]: {
    title: "Careers at DIY PreFab | Build Steel Structures With Us",
    description: "Careers at DIY PreFab: see how we work, what we value and the engineering, fabrication and project roles we are hiring for.",
  },
  [ROUTE_PATHS.JOB_OPENINGS]: {
    title: "Job Openings | Careers at DIY PreFab",
    description: "Current job openings at DIY PreFab. Filter by category and location and apply by email.",
  },
  [ROUTE_PATHS.WORK_CULTURE]: {
    title: "Work Culture | Careers at DIY PreFab",
    description: "How we work at DIY PreFab: our engineering-led, site-first culture and what it is like to build with our team.",
  },
  [ROUTE_PATHS.CONTACT_US]: {
    title: "Contact DIY PreFab | Udaipur, Rajasthan",
    description:
      "Contact DIY PreFab: reach our engineers in Udaipur, Rajasthan by phone, email or the contact form, or book a call, for prefab and pre-engineered steel structure solutions.",
  },
  [ROUTE_PATHS.INQUIRY_FORM]: {
    title: "Inquiry Form | DIY PreFab",
    description: "Send a project inquiry to DIY PreFab and our team will get back to you.",
    robots: "noindex, follow",
  },
  [ROUTE_PATHS.PRIVACY_POLICY]: {
    title: "Privacy Policy | DIY PreFab",
    description: "How DIY PreFab collects, uses and protects personal information shared through this website.",
  },
  [ROUTE_PATHS.TERMS_OF_SERVICE]: {
    title: "Terms of Service | DIY PreFab",
    description: "The terms that apply to using the DIY PreFab website and its services.",
  },
};

// Path -> title for every other route, taken from the navigation data.
const NAV_TITLES = {};
(function walk(list) {
  list.forEach((n) => {
    if (n.link && n.title) NAV_TITLES[n.link] = n.title;
    if (n.submenu) walk(n.submenu);
    if (n.subsubmenu) walk(n.subsubmenu);
  });
})(navItems);

export const normalizePath = (p = "/") => {
  const clean = String(p).split(/[?#]/)[0].replace(/\/{2,}/g, "/");
  return clean.length > 1 ? clean.replace(/\/+$/, "") : "/";
};

// Dynamic routes keep their own metadata (blog posts come from the API); they only get safe defaults here.
const DYNAMIC = [
  { pattern: /^\/blog\/[^/]+$/, meta: { title: "Blog | DIY PreFab", description: "Read this article from DIY PreFab on prefab and steel construction." } },
  { pattern: /^\/details\/[^/]+$/, meta: { title: "Details | DIY PreFab", description: "Details of this DIY PreFab offering.", robots: "noindex, follow" } },
];

export const ALL_STATIC_PATHS = STATIC_PATHS;

export function getRouteMeta(pathname) {
  const path = normalizePath(pathname);
  let meta = EXPLICIT[path];
  if (!meta) {
    const dyn = DYNAMIC.find((d) => d.pattern.test(path));
    if (dyn) meta = dyn.meta;
  }
  if (!meta && ALL_STATIC_PATHS.includes(path)) {
    const name = NAV_TITLES[path] || path.split("/").pop().replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    meta = {
      title: `${name} | ${SITE_NAME}`,
      description: `${name} from ${SITE_NAME}: pre-engineered steel buildings and prefab construction solutions in India.`,
    };
  }
  if (!meta) return null; // unknown route: nothing to claim, the 404 page sets noindex
  return {
    ...meta,
    robots: meta.robots || (NOINDEX_PATHS.includes(path) ? "noindex, follow" : "index, follow"),
    canonical: `${SITE_URL}${path === "/" ? "/" : path}`,
    image: DEFAULT_OG_IMAGE,
  };
}
