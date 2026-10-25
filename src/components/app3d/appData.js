import ROUTE_PATHS from "../../routes/RoutePath";

// Same switch as the other 3D pages: false = animate even when the device asks for reduced motion.
export const RESPECT_REDUCED_MOTION = false;

export const HERO_TITLE = "One build system. Five sectors.";
export const HERO_HL = new Set(["Five", "sectors."]);
export const HERO_TEXT =
  "From the homes we live in to the hospitals that care for us, the same pre-engineered steel and panel system adapts to every space you need.";

// The five application sectors. `route` points at the existing sector pages, which stay untouched.
// `color` is the accent for that chapter. All five share one matte mint accent (hero) so the page stays calm and on-brand.
export const SECTORS = [
  {
    id: "residential",
    icon: "home",
    name: "Residential",
    short: "Homes",
    color: "#86cfc3",
    route: ROUTE_PATHS.RESIDENTIAL,
    tagline: "Comfortable homes, assembled with precision.",
    text: "From compact homes and farmhouses to staff quarters and holiday cabins, prefab gives families a durable, well-insulated place to live, with a build that stays predictable from first panel to final finish.",
    points: [
      "Factory-made frames and panels for consistent quality",
      "Layouts you can customize now and extend later",
      "Less site disruption, less waste, fewer surprises",
    ],
    uses: ["Homes", "Farmhouses", "Cabins", "Staff quarters"],
  },
  {
    id: "commercial",
    icon: "building",
    name: "Commercial",
    short: "Offices & retail",
    color: "#86cfc3",
    route: ROUTE_PATHS.COMMERCIAL,
    tagline: "Spaces that open when your business does.",
    text: "Offices, showrooms, cafés and retail units need to be ready on time and look sharp on day one. Steel-frame and modular construction shortens the wait and leaves room for your brand to show.",
    points: [
      "Open, flexible interiors that suit your layout",
      "Façades and finishes that carry your branding",
      "Easy to expand as the business grows",
    ],
    uses: ["Offices", "Showrooms", "Retail units", "Cafés"],
  },
  {
    id: "industrial",
    icon: "industry",
    name: "Industrial",
    short: "Factories & warehouses",
    color: "#86cfc3",
    route: ROUTE_PATHS.INDUSTRIAL,
    tagline: "Wide spans. Heavy duty. Built to keep running.",
    text: "Pre-engineered steel buildings give factories, warehouses and workshops large clear spans, strong frames and space to grow, without the long schedules of conventional construction.",
    points: [
      "Clear-span frames for machinery, racking and movement",
      "Engineered for load, wind and long service life",
      "Extend the building bay by bay as output grows",
    ],
    uses: ["Factories", "Warehouses", "Workshops", "Godowns"],
  },
  {
    id: "educational",
    icon: "school",
    name: "Educational Institutions",
    short: "Schools & campuses",
    color: "#86cfc3",
    route: ROUTE_PATHS.EDUCATIONAL_INSTITUTIONS,
    tagline: "Classrooms ready before the term starts.",
    text: "Schools, colleges and training centres can add classrooms, labs and hostels on a schedule that fits the academic calendar, with bright, well-ventilated rooms built to handle everyday campus life.",
    points: [
      "Add buildings in phases without long shutdowns",
      "Bright, ventilated rooms made for learning",
      "Durable, low-maintenance finishes",
    ],
    uses: ["Classrooms", "Labs", "Hostels", "Training centres"],
  },
  {
    id: "healthcare",
    icon: "hospital",
    name: "Healthcare Facilities",
    short: "Clinics & hospitals",
    color: "#86cfc3",
    route: ROUTE_PATHS.HEALTHCARE_FACILITIES,
    tagline: "Clean, dependable and quick to set up.",
    text: "Clinics, diagnostic centres and wards need hygienic, reliable buildings, sometimes at short notice. Controlled factory quality and easy-to-clean interiors make prefab a practical fit.",
    points: [
      "Hygienic surfaces that are easy to clean",
      "Quick set-up for clinics and extra wards",
      "Layouts that adapt as services grow",
    ],
    uses: ["Clinics", "Diagnostic centres", "Wards", "Isolation units"],
  },
];

// What every sector shares (from the brand copy: steel frames, precision-cut panels, simple assembly)
export const CORE = [
  { n: "01", title: "Pre-engineered steel frames", text: "Every structure starts from an engineered frame, so strength is designed in rather than added later." },
  { n: "02", title: "Precision-cut panels", text: "Walls and roofs are cut and finished in the factory, which keeps quality consistent from one building to the next." },
  { n: "03", title: "Simplified assembly", text: "Parts arrive ready to fit, so the work on site is faster, cleaner and easier to plan." },
  { n: "04", title: "Strength, safety and speed", text: "The same system carries a family home, a factory floor and a hospital ward." },
];

export const CTA_TITLE = "Have a space in mind?";
export const CTA_TEXT = "Tell us what you want to build and which sector it belongs to. We’ll take it from there.";