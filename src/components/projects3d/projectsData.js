// Projects & Case Studies page content (redesign: project cards that open into a parallax project sheet).
// Everything in PROJECTS comes from the project brief (dates, areas, scope, specifications, purchase orders).
// CASES are written from those same facts only (no invented numbers). TESTIMONIALS shows what the completion
// paperwork confirms; when a client gives a written quote, put it in the `words` field of that entry and the card
// switches to a proper quotation automatically. The photos (hero, project covers, project galleries) are the plant / fabrication
// photos already in /images/ab/; swap `src` for real site photos whenever you have them.
export const RESPECT_REDUCED_MOTION = false; // same switch as the other 3D pages

const AB = (n) => `/images/ab/${n}.webp`;
const ZM = (n) => `/images/zambia/${n}.webp`; // Zambia site photos
const BS = (n) => `/images/banswara/${n}.webp`; // Banswara Syntex site photos
const AS = (n) => `/images/assure/${n}.webp`; // Assure Buildcon site photos

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
    { b: "04", t: "Featured projects", e: "Rajasthan, Gujarat & Zambia" },
    { b: "11,456+", t: "Sq. m documented", e: "Across our featured buildings" },
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
    logo: "/images/clients/wonder-cement.png",
    logoBg: "#ffffff",
    cover: { src: AB("scaffold"), alt: "Steel frame of a prefabricated shed" },
    kpi: { big: "2,196", unit: "Sq. Mtr.", label: "Covered area" },
    specMode: "plan",
    plan: { w: 48.8, l: 45 },
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
    area: "2,196 Sq. Mtr.",
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
      ["Length", "45 m"],
      ["Width", "48.8 m"],
      ["Side Clear Height", "10 m"],
      ["Covered Area", "2,196 Sq. Mtr."],
    ],
    meta: [["Client", "Wonder Cement Limited"], ["Purchase Order", "27 January 2026"]],
  },
  {
    id: "banswara",
    logo: "/images/clients/banswara-syntex.png",
    logoBg: "#ffffff",
    cover: { src: BS("cover-structure"), alt: "Completed pre-engineered steel structure against a clear sky" },
    kpi: { big: "5,565", unit: "Sq. Mtr.", label: "Across 3 facilities" },
    specMode: "bars",
    galleryNote: "A look at the Banswara Syntex structures: roof framing, decking and the finished interior bays.",
    gallery: [
      { src: BS("roof-framing"), alt: "Steel roof framing with purlins and skylights seen from below", cap: "Roof framing and purlins" },
      { src: BS("deck-sheeting"), alt: "Steel frame with bracing and deck sheeting on the upper floor", cap: "Bracing and deck sheeting" },
      { src: BS("interior-bay"), alt: "Interior bay with steel columns, bracing and a mezzanine stair", cap: "Interior bay and mezzanine access" },
      { src: BS("clear-span"), alt: "Clear-span interior with portal frames and a polished floor", cap: "Finished clear-span interior" },
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
    logo: "/images/clients/assure-buildcon.svg",
    logoBg: "#16181b",
    cover: { src: AS("cover-aerial"), alt: "Aerial view of the pre-engineered steel frame on site" },
    kpi: { big: "PEB", unit: "", label: "Supply & installation" },
    specMode: "rows",
    galleryNote: "A look at the Assure Buildcon site: the steel frame under erection, from the air and from inside.",
    gallery: [
      { src: AS("aerial-angle"), alt: "Aerial view of the steel frame with materials laid out on site", cap: "Steel frame and site layout" },
      { src: AS("frames-equipment"), alt: "Steel frame bays with process equipment in place", cap: "Frame bays with equipment" },
      { src: AS("frames-sun"), alt: "Portal frames and roof purlins under erection with workers below", cap: "Portal frames under erection" },
      { src: AS("site-plan-view"), alt: "Top-down view of the building footprint and surrounding site", cap: "Building footprint from above" },
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
  {
    id: "zambia",
    logo: "/images/clients/tyre-technocrats.png",
    logoBg: "#ffffff",
    cover: { src: ZM("cover"), alt: "Pre-engineered steel building frame under erection in Zambia" },
    kpi: { big: "5,600", unit: "Sq. Mtr.", label: "Main building area" },
    specMode: "plan",
    plan: { w: 70, l: 80 },
    gallery: [
      { src: ZM("gallery-1"), alt: "Long column line of the Zambia PEB with foundation plinths and frames under erection", cap: "Frame line & foundations" },
      { src: ZM("gallery-2"), alt: "Primary steel column with rafters and roof purlins in place", cap: "Primary columns & purlins" },
      { src: ZM("gallery-3"), alt: "Telehandler lifting a crew to the roof framing during erection", cap: "Roof framing erection" },
      { src: ZM("gallery-4"), alt: "Interior bays of the steel frame under erection with site works below", cap: "Interior bays under erection" },
    ],
    galleryWide: true, // all four photos shown landscape (3:2)
    galleryNote: "A look at the building on site, from foundations to primary frames and roof framing.",
    n: "04",
    client: "Tyre Technocrats (India) Pvt. Ltd.",
    title: "PEB Supply & Erection, Zambia",
    location: "Zambia, Africa",
    badge: "Contract dated 4 December 2025",
    area: "5,600 Sq. Mtr.",
    overview:
      "Complete pre-engineered building package for Tyre Technocrats (India) Pvt. Ltd. in Zambia: a 70 m by 80 m rigid-frame building with one interior column line and an additional mezzanine, covering design, fabrication, supply and erection.",
    scope: [
      "Structural design and detailing.",
      "Fabrication and supply of primary structural steel.",
      "Secondary structural components, purlins, girts and bracing.",
      "Roof and wall sheeting, skylights and louvers.",
      "Gutters, downspouts, anchor bolts and connection systems.",
      "Engineering and technical supervision.",
      "Installation and commissioning.",
    ],
    outcome:
      "Material delivery is planned within 6 to 8 weeks, with erection and commissioning in 8 to 10 weeks after the material reaches site. Design follows AISC 360-2016 (ASD), AISI-12, IS 875 (Part 3), IS 1893 (Part 1):2016, AWS D1.1 and MBMA guidelines.",
    specs: [
      ["Length", "80 m"],
      ["Width", "70 m"],
      ["Eave Height", "8.25 m"],
      ["Main Building Area", "5,600 Sq. Mtr."],
      ["Mezzanine Area", "510 Sq. Mtr."],
      ["Total Building Weight", "2,72,047 kg"],
    ],
    meta: [["Client", "Tyre Technocrats (India) Pvt. Ltd."], ["Contract Date", "4 December 2025"]],
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
      { k: "Brief", d: "A 2,196 Sq. Mtr. covered parking shed, 45 m by 48.8 m with a 10 m side clear height, inside Wonder Cement’s Nimbahera plant." },
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
  {
    n: "04",
    client: "Tyre Technocrats (India) Pvt. Ltd.",
    title: "A 5,600 Sq. Mtr. PEB, supplied and erected in Zambia",
    place: "Zambia, Africa",
    metric: { big: "5,600", unit: "Sq. Mtr.", cap: "Main building, plus a 510 Sq. Mtr. mezzanine" },
    timeline: ["Contract · 4 Dec 2025", "Erection · 8–10 weeks after delivery"],
    stages: [
      { k: "Brief", d: "A 70 m by 80 m rigid-frame building with one interior column line and 8.25 m eave height, for Tyre Technocrats (India) Pvt. Ltd. in Zambia." },
      { k: "Engineering & fabrication", d: "Structural design and detailing to AISC 360-2016, AISI-12, IS 875 and IS 1893, with primary and secondary steel, purlins, girts and bracing fabricated in-house." },
      { k: "Supply & erection", d: "Roof and wall sheeting, skylights, louvers, gutters and anchor bolts supplied with the steel. Material delivery in 6 to 8 weeks, then erection and commissioning in 8 to 10 weeks." },
      { k: "Site supervision", d: "Engineering and technical supervision through installation and commissioning, about 2,72,047 kg of building in total." },
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
// `logo`   : client logo (falls back to a monogram tile if the file is missing).
// `photo`  : landscape project photo { src, alt } (falls back to the matching project cover).
// `tag`    : optional eyebrow text on the photo (default "Documented client confirmation").
// `carousel: false` hides an entry from the carousel (its project sheet still uses it).
// `letter` : URL of the scanned completion letter / certificate (PDF or image). Opens in a new tab; leave "" to show it as a plain, non-clickable row.
export const TESTIMONIALS = [
  {
    client: "Wonder Cement Limited",
    project: "Prefabricated Steel Parking Shed",
    place: "Nimbahera, Rajasthan",
    confirm: "The complete parking shed was successfully executed and handed over.",
    doc: "Work Completion Certificate",
    date: "29 March 2026",
    logo: "/images/clients/wonder-cement.png",
    // letter: "/docs/completion/wonder-cement-work-completion-certificate.pdf", // re-enable once the approved PDF is published in public/docs/completion/ (was a 404)
  },
  {
    client: "Tyre Technocrats (India) Pvt. Ltd.",
    project: "PEB Supply & Erection, Zambia",
    place: "Zambia, Africa",
    tag: "Documented client contract",
    confirm: "Awarded the complete package for a 70 m by 80 m pre-engineered building in Zambia: design, fabrication, supply and erection.",
    doc: "Contract",
    docLabel: "Contract record",
    date: "4 December 2025",
    logo: "/images/clients/tyre-technocrats.png",
    letter: "",
  },
  {
    client: "Banswara Syntex Limited",
    project: "Multi-Facility PEB Project",
    place: "Banswara, Rajasthan",
    carousel: false, // not shown in the testimonial carousel; still feeds its project sheet
    confirm: "The facilities are officially in use, and the pending work list is confirmed as completed.",
    doc: "Work Completion Letter",
    date: "19 February 2025",
    logo: "/images/clients/banswara-syntex.png",
    letter: "/docs/completion/banswara-syntex-work-completion-letter.pdf",
  },
  {
    client: "Assure Buildcon Private Limited",
    project: "PEB Supply & Installation",
    place: "Gandevi, Navsari, Gujarat",
    confirm: "Supply and installation of the pre-engineered building structures was completed.",
    doc: "Project completion",
    date: "30 March 2026",
    logo: "/images/clients/assure-buildcon.svg",
    logoBg: "#16181b",
    // letter: "/docs/completion/assure-buildcon-project-completion.pdf", // re-enable once the approved PDF is published in public/docs/completion/ (was a 404)
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
