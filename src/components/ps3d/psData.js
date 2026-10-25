// Products & Services page content. Copy comes straight from the brief; images live in /public/images/ps.
export const RESPECT_REDUCED_MOTION = false; // same switch as the other 3D pages: false = animate even if the device asks for less motion

// TEMPORARY: the EPC Consultancy block is switched off. Set to true to bring the whole block back (section, hero button and
// chip, "01/02" numbering, marquee words and the original hero / closing copy) - nothing else needs to change.
export const SHOW_EPC = false;

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
  title: "Plan Smarter. Build with Confidence.",
  hl: ["Build", "with", "Confidence."],
  text:
    "Our EPC consultancy service helps you make informed decisions at every stage of your construction project. From engineering and design coordination to procurement planning and execution strategy, we help you establish a clear path from concept to construction.",
  listTitle: "Our services include:",
  items: [
    { title: "Engineering & Design Coordination", text: "Technical planning and coordination to meet your project requirements.", img: IMG("plan"), alt: "Engineers coordinating design drawings" },
    { title: "Procurement Planning", text: "Support with material selection, quantity planning, and procurement coordination.", img: IMG("containers"), alt: "Engineers checking material consignments" },
    { title: "Cost & Scope Estimation", text: "Assistance in defining project requirements, quantities, and preliminary costs.", img: IMG("inspect"), alt: "Engineer inspecting a steel component" },
    { title: "Project Planning", text: "Scheduling, milestone planning, and execution strategy.", img: IMG("engineer"), alt: "Engineer planning a project schedule" },
    { title: "Technical Consultancy", text: "Guidance on prefabrication systems, structural requirements, and constructability.", img: IMG("review"), alt: "Two engineers discussing technical details" },
    { title: "Execution Coordination", text: "Support in coordinating project activities in line with the agreed scope.", img: IMG("meeting"), alt: "Project team meeting on a factory floor" },
  ],
  idealLabel: "Ideal for",
  ideal:
    "Businesses, developers, industrial facility owners, and project owners looking for professional guidance before or during construction.",
  cta: "Discuss Your Project",
  collage: [
    { src: IMG("engineer"), alt: "Engineer reviewing construction plans" },
    { src: IMG("meeting"), alt: "Project discussion in a steel fabrication facility" },
    { src: IMG("review"), alt: "Engineers in conversation at a workshop" },
  ],
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
  ["Procurement Planning", "Modular Construction", "Site Execution", "Metal Structures", "Project Planning"],
];
const EPC_WORDS = ["EPC Consultancy", "Procurement Planning"];
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
