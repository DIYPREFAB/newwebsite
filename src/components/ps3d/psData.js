// Products & Services page content. Copy comes straight from the brief; images live in /public/images/ps.
export const RESPECT_REDUCED_MOTION = false; // same switch as the other 3D pages: false = animate even if the device asks for less motion

// EPC Consultancy block: switched ON (restored). Set to false to hide the whole block again (section, hero button and
// chip, "01/02" numbering, marquee words and the original hero / closing copy) - nothing else needs to change.
export const SHOW_EPC = true;

const IMG = (n) => `/images/ps/${n}.webp`;

export const HERO = {
  tag: "Products & Services",
  lines: [
    { text: "Engineering Expertise.", hl: [] },
    { text: "Construction Solutions.", hl: ["Construction", "Solutions."] },
  ],
  text:
    "At DIY PREFAB, we offer two core services to support your construction journey — EPC Consultancy and Prefabricated Construction & Execution. Whether you need expert guidance to plan your project or a partner to bring your building to life, we help turn your requirements into practical construction solutions.",
  textSolo:
    "At DIY PREFAB, we offer Prefabricated Construction & Execution. We are the partner that brings your building to life, turning your requirements into practical construction solutions.",
  images: {
    back: { src: IMG("hall"), alt: "Pre-engineered steel building hall with an engineer at work" },
    mid: { src: IMG("plan"), alt: "Two project engineers reviewing plans on site" },
    front: { src: IMG("site"), alt: "Site engineer holding project drawings" },
  },
};

export const EPC = {
  id: "epc",
  n: "01",
  name: "EPC Consultancy",
  title: "From Project Intent to Project Intelligence.",
  hl: ["Project", "Intelligence."],
  text:
    "Our EPC consultancy is powered by DIYVA, our project intelligence platform. It creates one digital thread across the industrial building lifecycle, from tender documents to site execution, so information created at one stage becomes intelligence for every stage that follows.",

  // ---- Act 1: the 3D platform console (illustrative UI, no figures)
  stage: {
    cta: "See how DIYVA helps",
    window: { project: "Industrial building · R0.1", status: "Engineered" },
    modules: [
      { label: "Documents", icon: "doc" },
      { label: "Model", icon: "cube" },
      { label: "Engineering", icon: "cogs" },
      { label: "BOQ & Cost", icon: "invoice" },
      { label: "Procurement", icon: "truck" },
      { label: "Execution", icon: "tasks" },
    ],
    chips: ["Design & Engineering", "Digital Building", "Cost & Commercial", "Procurement", "Execution"],
    impact: {
      title: "Change impact",
      rows: ["Members", "Connections", "Quantities", "BOQ & cost", "Procurement", "Schedule"],
      note: "Logged: who changed what, and why",
    },
  },

  // ---- Act 2: how DIYVA supports your project
  listTitle: "How DIYVA supports your project:",
  items: [
    { icon: "doc", title: "Understand Your Documents", text: "Tender documents, PDF drawings, QRF, Excel sheets and specifications become a structured project that engineers verify, with every input linked to its source.", img: IMG("plan"), alt: "Engineers reviewing project drawings" },
    { icon: "cube", title: "Visualize & Engineer", text: "See the building take shape, from grid and footprint to an engineered model. AI proposes, engineering rules and standards validate, and engineers approve.", img: IMG("engineer"), alt: "Engineer working through a structural design" },
    { icon: "compass", title: "Explore Design Alternatives", text: "Compare only the concepts that pass structural requirements, so you can weigh engineering and business priorities before committing to a revision.", img: IMG("review"), alt: "Two engineers comparing design options" },
    { icon: "swap", title: "Know What Every Change Means", text: "Change one thing and see what it affects: members, connections, quantities, BOQ, cost, procurement and schedule, with a record of who changed what and why.", img: IMG("meeting"), alt: "Project team reviewing the impact of a change" },
    { icon: "invoice", title: "BOQ, Cost & Procurement", text: "Approved engineering turns into a detailed BOQ/BOM, cost estimates and supplier-ready packages, and bids can be compared with the technical context intact.", img: IMG("containers"), alt: "Engineers checking material consignments" },
    { icon: "tasks", title: "Execution Control", text: "Follow cost, schedule, supply and quality as one project story, and spot a potential delay before it becomes a surprise on site.", img: IMG("inspect"), alt: "Engineer inspecting a steel component on site" },
  ],

  // ---- Act 3: lifecycle chevrons
  flow: {
    tag: "The project lifecycle",
    title: "One digital thread from tender to site.",
    hl: ["digital", "thread"],
    text: "Information created at one stage becomes intelligence for every stage that follows.",
    bg: IMG("hall"),
    steps: [
      { icon: "doc", title: "Tender & documents", text: "Drawings, QRF and specifications become one structured project." },
      { icon: "cogs", title: "Engineering", text: "AI proposes. Standards validate. Engineers approve." },
      { icon: "invoice", title: "Commercial", text: "BOQ/BOM and cost estimates follow approved engineering." },
      { icon: "truck", title: "Procurement", text: "Supplier-ready packages and bids with technical context." },
      { icon: "tasks", title: "Execution", text: "Cost, schedule, supply and quality as one project story." },
    ],
  },

  // ---- Act 4: why a connected view
  why: {
    tag: "Why DIYVA",
    title: "More than separate services. One connected view.",
    hl: ["connected", "view."],
    text: "DIYVA keeps engineering, cost, procurement and execution on the same record, so every decision is traceable and every change is understood.",
    items: [
      { icon: "link", title: "Connected information", text: "Every input stays linked to its source, from tender to site." },
      { icon: "shield", title: "Engineering-led decisions", text: "AI proposes, engineering rules and standards validate, and engineers approve." },
      { icon: "history", title: "Traceable revisions", text: "A record of who changed what and why." },
      { icon: "database", title: "Commercial clarity", text: "BOQ, cost and procurement follow approved engineering." },
      { icon: "eye", title: "Integrated visibility", text: "Cost, schedule, supply and quality read as one project story." },
      { icon: "brain", title: "Continuous intelligence", text: "What one stage creates becomes insight for the next." },
    ],
  },

  idealLabel: "Ideal for",
  ideal:
    "Industrial project owners, developers and facility owners who want one connected view from tender to site, before or during construction.",
  cta: "Discuss Your Project",
};

export const BUILD = {
  id: "build",
  n: "02",
  name: "Prefabricated Construction & Execution",
  title: "From Design to Reality.",
  hl: ["Reality."],
  text:
    "DIY PREFAB provides physical construction and execution services for prefabricated steel and metal structures. We bring together engineering coordination, fabrication, and on-site construction to deliver structures tailored to your project requirements.",
  listTitle: "Our construction services include:",
  items: [
    { title: "Pre-Engineered Buildings (PEB)", text: "Steel building solutions for industrial, commercial, and storage applications.", img: IMG("hall"), alt: "Pre-engineered steel building interior" },
    { title: "Industrial Sheds & Warehouses", text: "Functional structures designed around your space and operational needs.", img: IMG("warehouse"), alt: "Warehouse floor with packed steel components" },
    { title: "Structural Steel Fabrication", text: "Fabrication of steel components based on approved drawings and specifications.", img: IMG("fabrication"), alt: "Steel sections being fabricated" },
    { title: "Prefabricated Metal Structures", text: "Engineered building systems designed for coordinated fabrication and assembly.", img: IMG("steel"), alt: "Stacks of fabricated steel members" },
    { title: "Modular Construction", text: "Prefabricated structural solutions for suitable modular building applications.", img: IMG("robotic"), alt: "Robotic assembly of structural components" },
    { title: "Installation & Site Execution", text: "On-site erection, assembly, and construction as defined by the project scope.", img: IMG("site"), alt: "Engineer supervising on-site erection" },
  ],
  idealLabel: "Ideal for",
  ideal:
    "Businesses and organisations looking to construct industrial sheds, warehouses, steel buildings, and other suitable prefabricated structures.",
  cta: "Get a Construction Quote",
  float: [
    { src: IMG("robotic"), alt: "Robotic arm assembling steel components" },
    { src: IMG("fabrication"), alt: "Fabricated steel beams in the workshop" },
  ],
};

export const PROCESS = {
  tag: "How we build",
  title: "One coordinated construction process.",
  hl: ["coordinated", "construction", "process."],
  text:
    "From planning and material coordination to fabrication and installation, we focus on practical solutions and a coordinated construction process.",
  steps: [
    { title: "Planning", text: "Engineering coordination shaped around your project requirements.", img: IMG("plan"), alt: "Engineers planning a project" },
    { title: "Material coordination", text: "Materials and quantities lined up ahead of fabrication.", img: IMG("steel"), alt: "Steel members ready for coordination" },
    { title: "Fabrication", text: "Steel components made from approved drawings and specifications.", img: IMG("sparks"), alt: "Steel being cut with sparks flying" },
    { title: "Installation", text: "On-site erection, assembly and construction as defined by the project scope.", img: IMG("site"), alt: "Engineer on a construction site" },
  ],
};

const MARQUEE_ALL = [
  ["EPC Consultancy", "Pre-Engineered Buildings", "Industrial Sheds", "Warehouses", "Structural Steel"],
  ["Project Intelligence", "Modular Construction", "Site Execution", "Metal Structures", "Project Planning"],
];
const EPC_WORDS = ["EPC Consultancy", "Project Intelligence"];
export const MARQUEE = SHOW_EPC ? MARQUEE_ALL : MARQUEE_ALL.map((row) => row.filter((w) => !EPC_WORDS.includes(w)));

export const CTA = {
  tag: "Your next step",
  title: "Your Project. Our Expertise.",
  hl: ["Expertise."],
  text:
    "Whether you need EPC consultancy, actual construction, or both, DIY PREFAB helps you take the next step with a solution suited to your project.",
  textSolo:
    "Whether you need construction, site execution, or both, DIY PREFAB helps you take the next step with a solution suited to your project.",
  statement: "Let's build something better, together.",
  button: "Get in Touch",
  bg: IMG("cta-sparks"),
};