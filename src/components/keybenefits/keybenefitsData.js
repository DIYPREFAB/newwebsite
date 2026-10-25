import {
  FaBolt, FaCoins, FaIndustry, FaLeaf, FaCubes, FaDrawPolygon, FaHeadset, FaShieldAlt,
  FaWarehouse, FaBuilding, FaHardHat, FaHospital, FaHome,
} from "react-icons/fa";

export const TITLE = "Your Trusted and Visionary Partner in Engineering Excellence";

export const HERO_STATS = [
  ["80%", "Built in the factory"],
  ["30–60%", "Faster delivery"],
  ["7+", "Years of experience"],
];

export const RIBBON = ["Faster", "Smarter", "Cleaner", "Stronger", "Predictable", "Reusable"];

export const REVEAL = "80% of the work happens in the factory. That is why prefab is faster, cleaner and predictable.";
export const REVEAL_HL = new Set(["80%", "faster,", "predictable."]);
export const PILLARS = [
  ["01", "Weeks, not months", "Factory fabrication and on-site assembly run in parallel, so most structures are ready in weeks."],
  ["02", "Fixed before the first bolt", "Clear costs up front: no hidden labour charges and no escalating bills."],
  ["03", "Built to last, built to reuse", "Recyclable steel and modular design mean a structure can be extended, relocated or reused."],
];

// accent pairs reused from the home page palette
export const ACCENTS = [
  ["#2fd4c0", "#a8dadc"], ["#6cb6ff", "#bfe0ff"], ["#f4c542", "#ffe39a"], ["#5fe0a0", "#b8f2d4"],
  ["#9b8cff", "#d3ccff"], ["#ff8a7a", "#ffc4bb"], ["#2fd4c0", "#a8dadc"], ["#6cb6ff", "#bfe0ff"],
];

export const BENEFITS = [
  { span: "s7", Icon: FaBolt, title: "Super-fast project timelines",
    text: "80% of the work is done in the factory, so on-site assembly takes a fraction of the time of conventional building." },
  { span: "s5", Icon: FaCoins, title: "Budget-friendly and transparent",
    text: "Clear costs up front. No hidden labour charges or escalating bills, and you save on both materials and time." },
  { span: "s4", Icon: FaIndustry, title: "Factory-controlled quality",
    text: "Every member is cut, welded and blasted on automated lines, so what reaches your site is precise and ready to assemble." },
  { span: "s4", Icon: FaLeaf, title: "Sustainable by design",
    text: "Steel is 100% recyclable, precision fabrication cuts waste, and dry construction avoids wet curing." },
  { span: "s4", Icon: FaCubes, title: "Modular and scalable",
    text: "Expand, relocate or upgrade as your needs change. Modular structures can be reused instead of demolished." },
  { span: "s5", Icon: FaHardHat, title: "Minimal site disruption",
    text: "A small crew and a dry process mean less congestion, less rework and less disturbance on site." },
  { span: "s7", Icon: FaDrawPolygon, title: "Design freedom, visualised in 3D",
    text: "Visualise and refine your structure in 3D with our Smart Building Planner before execution." },
  { span: "s12", Icon: FaShieldAlt, title: "One accountable team",
    text: "Free design and estimate, a free quality check and 24/7 premium support through one point of responsibility.", cta: true, Icon2: FaHeadset },
];

export const SPEED = [
  { key: "p", label: "Prefab / PEB", w: "55%", note: "Weeks" },
  { key: "c", label: "Conventional", w: "100%", note: "Months" },
];

export const COMPARE = [
  ["Speed of construction", "30–60% faster – most structures ready in weeks", "Slower – often takes several months"],
  ["Cost certainty", "Clear, fixed costs up front with no surprises", "Costs drift with labour, delays and rework"],
  ["Quality control", "Factory-controlled, repeatable precision", "Varies with site conditions and workmanship"],
  ["Labour on site", "A small assembly crew", "A large workforce for a long duration"],
  ["Sustainability", "Recyclable steel and a smaller carbon footprint", "Heavier material use and longer on-site energy demand"],
];

// Same figures as the site's existing counter block.
export const STATS = [
  { end: 96, suffix: "%", label: "Cases solved", ring: 0.96 },
  { end: 20, suffix: "", label: "Projects done", ring: 1 },
  { end: 100, suffix: "%", label: "Happy clients", ring: 1 },
  { end: 100, suffix: "%", label: "Timeline delivery", ring: 1 },
];

export const USE_CASES = [
  { Icon: FaWarehouse, a: "#2fd4c0", title: "Warehouses",
    text: "A fast, cost-effective route to modern warehouses. Modular design means quicker installation, less labour and minimal site disruption, with room to scale." },
  { Icon: FaBuilding, a: "#6cb6ff", title: "Offices and shops",
    text: "Shorter build times, less waste and consistent quality for businesses that need flexible, scalable commercial space." },
  { Icon: FaHardHat, a: "#f4c542", title: "Site cabins",
    text: "Quick setup and easy relocation. Durable, weather-resistant space for on-site offices and worker accommodation." },
  { Icon: FaIndustry, a: "#5fe0a0", title: "Industrial sheds",
    text: "Utility sheds, tool rooms and godowns that go up quickly and can be extended as operations grow." },
  { Icon: FaHospital, a: "#ff8a7a", title: "Healthcare and education",
    text: "Clinics, classrooms, staff rooms and labs delivered quickly, so the space is in use sooner." },
  { Icon: FaHome, a: "#9b8cff", title: "Homes and farmhouses",
    text: "Duplexes, cottages and farmhouses from easy-to-assemble kits with transparent, fixed pricing." },
];

// false = every motion plays on every device, even when the phone/OS asks for reduced motion
// (Android "Remove animations", iOS "Reduce Motion", battery saver). Set true to honour that setting.
export const RESPECT_REDUCED_MOTION = false;