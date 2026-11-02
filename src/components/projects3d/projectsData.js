// Projects & Case Studies page content (redesign: project cards that open into a parallax project sheet).
// Everything in PROJECTS comes from the project brief (dates, areas, scope, specifications, purchase orders).
// CASES are written from those same facts only (no invented numbers). TESTIMONIALS shows what the completion
// paperwork confirms; when a client gives a written quote, put it in the `words` field of that entry and the card
// switches to a proper quotation automatically. The photos (hero, project covers, project galleries) are the plant / fabrication
// photos already in /images/ab/; swap `src` for real site photos whenever you have them.
export const RESPECT_REDUCED_MOTION = false; // same switch as the other 3D pages

const AB = (n) => `/images/ab/${n}.webp`;

export const NAV_SECTIONS = [
  { id: "projects", n: "01", label: "Featured projects" },
  { id: "cases", n: "02", label: "Case studies" },
  { id: "approach", n: "03", label: "Our approach" },
  { id: "testimonials", n: "04", label: "Testimonials" },
];

export const HERO = {
  tag: "Projects & Case Studies",
  lines: [
    { text: "Engineering That Takes Shape.", hl: [] },
    { text: "Projects That Deliver.", hl: ["Projects", "That", "Deliver."] },
  ],
  text:
    "From prefabricated steel structures to large-scale industrial PEB facilities, our project experience reflects a commitment to engineering, quality and reliable execution.",
  sub: "Explore our work across industrial buildings, structural steel fabrication, supply and installation.",
  chips: [
    { b: "03", t: "Featured projects", e: "Rajasthan & Gujarat" },
    { b: "5,856+", t: "Sq. m documented", e: "Across delivered buildings" },
  ],
};

// Photos for the hero collage. All of these are the plant / fabrication photos already in /images/ab/.
// Swap `src` for real site photos whenever you have them (same shape: src + alt).
export const HERO_PHOTOS = {
  bg: { src: AB("a-truss"), alt: "Steel truss ready for erection" },
  a: { src: AB("welding"), alt: "Automatic beam welding machine" },
  b: { src: AB("a-laser"), alt: "Laser cutting of steel plate" },
};

export const PROJECTS_HEAD = {
  tag: "01 · Featured Projects",
  title: "Featured work, built in steel.",
  hl: ["built", "in", "steel."],
  text: "Selected projects from our recent work, each one engineered, fabricated and delivered by one team. Open any project for its scope, specifications and completion record.",
};

export const PROJECTS = [
  {
    id: "wonder",
    cover: { src: AB("scaffold"), alt: "Steel frame of a prefabricated shed" },
    kpi: { big: "291.60", unit: "Sq. Mtr.", label: "Covered area" },
    specMode: "plan",
    plan: { w: 18, l: 16.2 },
    gallery: [
      { src: AB("scaffold"), alt: "Primary steel frame standing", cap: "Primary frame" },
      { src: AB("fittup"), alt: "Fit-up section with structural members", cap: "Fit-up & check before dispatch" },
      { src: AB("cutting"), alt: "Plasma and oxyfuel cutting", cap: "CNC cutting of members" },
      { src: AB("dispatch"), alt: "Packing and dispatch bay", cap: "Packing & dispatch" },
    ],
    n: "01",
    client: "Wonder Cement Limited",
    title: "Prefabricated Steel Parking Shed",
    location: "R.K. Nagar, Nimbahera, Chittorgarh, Rajasthan",
    badge: "Completed 29 March 2026",
    area: "291.60 Sq. Mtr.",
    overview:
      "Design, engineering, fabrication, supply and installation of a prefabricated steel parking shed at Wonder Cement’s Nimbahera plant.",
    scope: [
      "Structural design and engineering.",
      "Steel fabrication and manufacturing.",
      "Supply of structural steel and sheeting.",
      "On-site erection and installation.",
      "Final project handover.",
    ],
    outcome:
      "The complete parking shed was successfully executed and handed over. Completion was confirmed through the Work Completion Certificate dated 29 March 2026.",
    specs: [
      ["Length", "16.2 m"],
      ["Width", "18 m"],
      ["Side Clear Height", "5 m"],
      ["Covered Area", "291.60 Sq. Mtr."],
    ],
    meta: [["Client", "Wonder Cement Limited"], ["Purchase Order", "27 January 2026"]],
  },
  {
    id: "banswara",
    cover: { src: AB("a-primo"), alt: "Automatic beam processing line" },
    kpi: { big: "5,565", unit: "Sq. Mtr.", label: "Across 3 facilities" },
    specMode: "bars",
    gallery: [
      { src: AB("a-primo"), alt: "Automatic beam processing line", cap: "Beam processing" },
      { src: AB("r-drill"), alt: "Radial drilling machines with operators", cap: "Bolt holes for site assembly" },
      { src: AB("welding"), alt: "Fully automatic beam welding machine", cap: "Submerged arc welding" },
      { src: AB("a-robot"), alt: "Robotic arm on the assembly line", cap: "Robotic assembly" },
    ],
    n: "02",
    client: "Banswara Syntex Limited",
    title: "Multi-Facility Pre-Engineered Building Project",
    location: "Banswara, Rajasthan",
    badge: "5,565 Sq. Mtr. in total",
    area: "5,565 Sq. Mtr.",
    overview:
      "A multi-facility PEB project involving the supply, fabrication and erection of industrial structures to support manufacturing, thermal utility and warehousing operations.",
    buildings: [
      { name: "Loom Shed", area: "2,380 Sq. Mtr." },
      { name: "Thermopack TFH6000", area: "735 Sq. Mtr." },
      { name: "Warehouse (Fiber & Yarn)", area: "2,450 Sq. Mtr." },
    ],
    scope: [
      "Primary and secondary structural fabrication.",
      "Procurement and erection of structural components.",
      "Roofing and wall cladding installation.",
      "Walkways, handrails and cage ladders.",
      "Turbo ventilators and insulation.",
      "False ceilings and drainage systems.",
      "Fasteners and associated structural accessories.",
    ],
    outcome:
      "The Work Completion Letter dated 19 February 2025 confirms the successful completion of the Spinning 4T and Waste Godown projects as per the engineering team’s instructions. The facilities are officially in use, with the pending work list confirmed as completed.",
    specs: [
      ["Loom Shed", "2,380 Sq. Mtr."],
      ["Thermopack TFH6000", "735 Sq. Mtr."],
      ["Warehouse (Fiber & Yarn)", "2,450 Sq. Mtr."],
      ["Total Project Area", "5,565 Sq. Mtr."],
    ],
    meta: [["Client", "Banswara Syntex Limited"], ["Purchase Order", "17 November 2023"]],
  },
  {
    id: "assure",
    cover: { src: AB("s-fit"), alt: "Steel members laid out ready for fabrication" },
    kpi: { big: "PEB", unit: "", label: "Supply & installation" },
    specMode: "rows",
    gallery: [
      { src: AB("s-fit"), alt: "Steel members laid out ready for fabrication", cap: "Members laid out" },
      { src: AB("a-laser"), alt: "Laser cutting steel plate", cap: "Plate profiled to drawings" },
      { src: AB("r-blast"), alt: "Shot blasting machine", cap: "Surface preparation" },
      { src: AB("a-truss"), alt: "Steel truss structure", cap: "Truss ready for erection" },
    ],
    n: "03",
    client: "Assure Buildcon Private Limited",
    title: "Pre-Engineered Building Supply & Installation",
    location: "Kalvach, Gandevi, Navsari, Gujarat",
    badge: "Completed 30 March 2026",
    area: "",
    overview:
      "A PEB project involving the supply and installation of pre-engineered building structures at Kalvach, Gandevi, Navsari.",
    scope: ["Supply of pre-engineered building components.", "Installation of PEB structures."],
    outcome: "The pre-engineered building structures were supplied and installed, and the project was completed on 30 March 2026.",
    specs: [
      ["Project / Company", "Assure Buildcon Private Limited"],
      ["Location", "Kalvach, Gandevi, Navsari"],
      ["Purchase Order", "17 April 2025"],
      ["Completion", "30 March 2026"],
      ["Nature of Work", "PEB Supply & Installation"],
    ],
    meta: [["Client", "Assure Buildcon Private Limited"], ["Purchase Order", "17 April 2025"]],
  },
];

export const CASES_HEAD = {
  tag: "02 · Case Studies",
  title: "How each project was delivered.",
  hl: ["delivered."],
  text: "The same coordinated path, a different brief each time. Here is how each project went from purchase order to a working building.",
};

export const CASES = [
  {
    n: "01",
    client: "Wonder Cement Limited",
    title: "A parking shed, delivered start to finish",
    place: "Nimbahera, Rajasthan",
    metric: { big: "61", unit: "days", cap: "From purchase order to the Work Completion Certificate" },
    timeline: ["Purchase Order · 27 Jan 2026", "Completed · 29 Mar 2026"],
    stages: [
      { k: "Brief", d: "A 291.60 Sq. Mtr. covered parking shed, 16.2 m by 18 m with a 5 m side clear height, inside Wonder Cement’s Nimbahera plant." },
      { k: "Engineering & fabrication", d: "Structural design, engineering and steel fabrication handled in-house as one scope, so the drawings and the steel stayed in step." },
      { k: "Supply & installation", d: "Structural steel and sheeting supplied by us, followed by on-site erection and installation." },
      { k: "Outcome", d: "Handed over complete. A Work Completion Certificate dated 29 March 2026 confirms it." },
    ],
  },
  {
    n: "02",
    client: "Banswara Syntex Limited",
    title: "Three facilities, one integrated PEB package",
    place: "Banswara, Rajasthan",
    metric: { big: "5,565", unit: "Sq. Mtr.", cap: "Loom shed, thermopack building and warehouse in one package" },
    timeline: ["Purchase Order · 17 Nov 2023", "Completion Letter · 19 Feb 2025"],
    stages: [
      { k: "Brief", d: "Industrial structures for manufacturing, thermal utility and warehousing operations, spread across three buildings." },
      { k: "Engineering & fabrication", d: "Primary and secondary structural fabrication, with procurement of structural components under one roof." },
      { k: "Supply & installation", d: "Erection, roofing and wall cladding, walkways, handrails, cage ladders, turbo ventilators, insulation, false ceilings and drainage." },
      { k: "Outcome", d: "The completion letter confirms the facilities are officially in use and the pending work list is completed." },
    ],
  },
  {
    n: "03",
    client: "Assure Buildcon Private Limited",
    title: "PEB supply and installation in Gujarat",
    place: "Kalvach, Gandevi, Navsari",
    metric: { big: "30 Mar", unit: "2026", cap: "Completion of the supply and installation scope" },
    timeline: ["Purchase Order · 17 Apr 2025", "Completed · 30 Mar 2026"],
    stages: [
      { k: "Brief", d: "Pre-engineered building structures to be supplied and installed at Kalvach, Gandevi, Navsari." },
      { k: "Engineering & fabrication", d: "Pre-engineered building components prepared to the project’s requirements." },
      { k: "Supply & installation", d: "Components supplied to site and the PEB structures installed." },
      { k: "Outcome", d: "Project completed on 30 March 2026." },
    ],
  },
];

export const APPROACH = {
  tag: "03 · Our Project Approach",
  title: "From Engineering to Execution",
  hl: ["Execution"],
  text: "Every project follows a coordinated approach focused on translating requirements into reliable built structures.",
  steps: [
    { n: "01", t: "Understand", d: "Evaluate project requirements, specifications and technical documentation." },
    { n: "02", t: "Engineer", d: "Develop structural designs and engineering solutions." },
    { n: "03", t: "Manufacture", d: "Fabricate structural components to project specifications." },
    { n: "04", t: "Supply", d: "Coordinate material supply and project requirements." },
    { n: "05", t: "Execute", d: "Carry out erection, installation and project completion activities." },
  ],
};

export const TESTIMONIALS_HEAD = {
  tag: "04 · Testimonials",
  title: "In our clients’ own paperwork.",
  hl: ["clients’", "own", "paperwork."],
  text: "Completion is confirmed in writing. Here is what each client’s completion record says about the work we delivered.",
};

// `words` (optional): a written quote from the client, e.g. words: "…", by: "Name, Designation".
export const TESTIMONIALS = [
  {
    client: "Wonder Cement Limited",
    project: "Prefabricated Steel Parking Shed",
    place: "Nimbahera, Rajasthan",
    confirm: "The complete parking shed was successfully executed and handed over.",
    doc: "Work Completion Certificate",
    date: "29 March 2026",
  },
  {
    client: "Banswara Syntex Limited",
    project: "Multi-Facility PEB Project",
    place: "Banswara, Rajasthan",
    confirm: "The facilities are officially in use, and the pending work list is confirmed as completed.",
    doc: "Work Completion Letter",
    date: "19 February 2025",
  },
  {
    client: "Assure Buildcon Private Limited",
    project: "PEB Supply & Installation",
    place: "Gandevi, Navsari, Gujarat",
    confirm: "Supply and installation of the pre-engineered building structures was completed.",
    doc: "Project completion",
    date: "30 March 2026",
  },
];

export const CTA = {
  tag: "Let’s build what’s next",
  title: "Let’s Build What’s Next",
  hl: ["What’s", "Next"],
  text: "Have an industrial building or infrastructure project in mind?",
  sub: "Connect with our team to discuss your requirements and explore the right engineering and execution approach.",
  btn: "Discuss Your Project",
};
