// About Us page content. Copy is taken from the existing About, Vision & Mission, Sustainability,
// Manufacturing and Production Plant pages. The founders' short journeys (FOUNDERS) are drafted from
// company facts on the site – edit them here if you want different wording.
export const RESPECT_REDUCED_MOTION = false; // same switch as the other 3D pages

const AB = (n) => `/images/ab/${n}.webp`;

export const NAV_SECTIONS = [
  { id: "overview", n: "01", label: "Company overview" },
  { id: "founders", n: "02", label: "Founders" },
  { id: "vision", n: "03", label: "Vision & mission" },
  { id: "green", n: "04", label: "Sustainability" },
  { id: "process", n: "05", label: "Manufacturing process" },
  { id: "plant", n: "06", label: "Production plant" },
];

export const HERO = {
  tag: "About Us",
  lines: [
    { text: "Crafting Engineering Excellence.", hl: [] },
    { text: "Built for Bharat.", hl: ["Built", "for", "Bharat."] },
  ],
  text:
    "Welcome to DIY PreFab — India’s emerging name in pre-engineered building solutions and modular prefab construction. From remote villages to fast-paced industrial hubs, we make high-quality prefab structures accessible, fast, and affordable for all.",
  // Eight real plant photos mounted on a rotating 3D ring (hero)
  ring: [
    { src: AB("r-ptw-a"), alt: "Automatic fabrication machine on the plant floor", t: "Automation" },
    { src: AB("r-drill"), alt: "Radial drilling machines with operators", t: "Drilling" },
    { src: AB("a-primo"), alt: "Automatic beam processing line", t: "Machine line" },
    { src: AB("r-blast"), alt: "Shot blasting machine, wide view", t: "Blasting" },
    { src: AB("r-weld-logo"), alt: "Welding and fabrication station", t: "Welding" },
    { src: AB("a-truss"), alt: "Steel truss structure", t: "Structure" },
  ],
  chips: [
    { b: "7+", t: "Years of experience", e: "Cutting-edge expertise" },
    { b: "10,000+", t: "Sq. m plant", e: "Banswara, Rajasthan" },
  ],
};

export const OVERVIEW = {
  tag: "01 · Company Overview",
  title: "Your Trusted and Visionary Partner in Engineering Excellence",
  hl: ["Visionary", "Partner", "in", "Engineering", "Excellence"],
  text: [
    "Prefab buildings empower professional experts with faster deployment, design flexibility, and cost-effective construction solutions.",
    "Whether you’re setting up a PEB warehouse in Rajasthan, a factory in Madhya Pradesh, or a modular shed in Gujarat, DIY PreFab delivers solutions tailored to your space, budget, and timeline.",
  ],
  stats: [
    { n: 7, suffix: "+", label: "Years of experience" },
    { n: 10000, suffix: "+", label: "Sq. m manufacturing facility", fmt: true },
    { n: 1000, suffix: "+", label: "Tons per year capacity", fmt: true },
    { n: 10, suffix: "–30", label: "Days for rapid project delivery" },
  ],
  whoTitle: "Backed by strong engineering, modern fabrication, and on-ground execution, we specialize in:",
  specialisms: [
    "Pre Engineered Buildings (PEBs)",
    "Customizable Prefab Kits for Warehouses, Sheds & Units",
    "Modular Buildings for Housing, Offices & Commercial Use",
    "Eco-Friendly & Low-Carbon Construction Systems",
    "Projects Across Rural, Urban & International Markets",
  ],
  where: {
    title: "Where we work",
    text:
      "Active operations in Udaipur, Jaipur, Ahmedabad and Indore, with growing export success in South Africa — redefining how India builds: faster, smarter, and greener.",
    places: ["Udaipur", "Jaipur", "Ahmedabad", "Indore", "Bhopal", "South Africa"],
  },
  different: [
    { t: "DIY-Friendly Systems", d: "Easy to assemble prefab kits — minimal tools needed" },
    { t: "Rapid Project Delivery", d: "Projects completed in as little as 10–30 days" },
    { t: "Transparent Pricing", d: "Fixed cost prefab kits — no surprises" },
    { t: "Pan-India Reach", d: "Serving clients across Rajasthan, MP, Gujarat" },
  ],
  photos: [
    { src: AB("a-laser"), alt: "Laser cutting steel plate" },
    { src: AB("a-cranes"), alt: "Port cranes at dusk" },
    { src: AB("a-robot"), alt: "Robotic arm on the assembly line" },
  ],
};

export const FOUNDERS = {
  tag: "02 · The Founders",
  title: "Two founders. One simple idea.",
  hl: ["One", "simple", "idea."],
  intro:
    "DIY PreFab began with a belief that strong, sustainable, customizable buildings should be within reach of everyone — no middlemen, no delays.",
  people: [
    {
      name: "Garvit Agrawal",
      role: "Founder",
      img: AB("garvit"),
      alt: "Garvit Agrawal, Founder of DIY PreFab",
      pos: "50% 22%",
      text:
        "Co-founded DIY PreFab to make high-quality prefab structures accessible, fast, and affordable — from remote villages to industrial hubs — and to take pre-engineered building kits to every kind of customer.",
    },
    {
      name: "Arpit Agrawal",
      role: "Founder",
      img: AB("arpit"),
      alt: "Arpit Agrawal, Founder of DIY PreFab",
      pos: "50% 18%",
      text:
        "Co-founded DIY PreFab and helped grow it from an idea into an in-house manufacturing operation, with projects across Rajasthan, Gujarat and Madhya Pradesh and an export installation in South Africa.",
    },
  ],
  journey: [
    { t: "The idea", d: "Make prefab and pre-engineered buildings simple, transparent and affordable." },
    { t: "The plant", d: "An in-house 10,000+ sq. m facility in Banswara, Rajasthan." },
    { t: "The reach", d: "Udaipur, Jaipur, Ahmedabad, Indore — one factory-to-site supply chain." },
    { t: "Beyond India", d: "Successfully shipped and installed in South Africa." },
  ],
};

export const VISION = {
  tag: "03 · Vision & Mission",
  title: "Designing Tomorrow’s Structures, Today.",
  hl: ["Tomorrow’s", "Structures,", "Today."],
  vision: {
    label: "Our Vision",
    lines: [
      "We envision a future where every person, regardless of income or location, has access to strong, sustainable, and customizable buildings.",
      "No middlemen. No delays. Just transparent pricing, modular design, and unmatched speed.",
    ],
    foot: "DIY PreFab is building the future — one kit at a time.",
  },
  mission: {
    label: "Our Mission",
    lines: [
      "To simplify and accelerate construction by offering high-quality, customizable, and affordable pre-engineered building kits that empower individuals, businesses, and communities to build with confidence.",
    ],
    foot: "Built for Bharat, engineered for the world.",
  },
  matters: {
    title: "Why it matters",
    text: "India needs faster, cleaner, and more scalable infrastructure.",
    points: [
      "Time-saving prefabricated systems",
      "Eco-conscious and low-carbon materials",
      "Minimal labor and zero machinery dependency",
      "Predictable, affordable costs for every project size",
    ],
  },
};

export const GREEN = {
  tag: "04 · Sustainability",
  title: "Leading the Green Building Revolution",
  hl: ["Green", "Building", "Revolution"],
  text: [
    "At DIY PreFab, sustainability is not just a feature — it’s a foundation. Every prefab building we deliver is designed to minimize environmental impact, reduce construction waste, and support India’s transition to a low-carbon future.",
  ],
  why: {
    title: "Why sustainability matters in construction",
    text:
      "Traditional brick-and-mortar methods rely heavily on concrete, water, and time — all of which carry environmental costs. Our pre-engineered building systems offer a cleaner, smarter alternative for industries, farms, NGOs, and institutions across India.",
  },
  practicesTitle: "Our core eco-friendly practices",
  practices: [
    { icon: "recycle", t: "Steel-Based Structures", d: "Steel is 100% recyclable and reusable" },
    { icon: "ruler", t: "Precision Prefabrication", d: "Reduces material waste by up to 60%" },
    { icon: "drop", t: "Dry Construction Process", d: "Saves water and eliminates wet curing" },
    { icon: "bolt", t: "Fast Assembly", d: "Less energy consumption on-site" },
    { icon: "cubes", t: "Modular Design", d: "Enables disassembly, reuse, and future upgrades" },
    { icon: "truck", t: "Smaller Carbon Footprint", d: "Optimized logistics and minimal transport cycles" },
    { icon: "sun", t: "Solar-Ready Roof Designs", d: "Supports easy installation of solar panels" },
  ],
  benefitsTitle: "Sustainable benefits for you",
  benefits: [
    "Lower lifecycle costs – less maintenance, more savings",
    "Faster occupancy – start operations quicker, lower carbon impact",
    "Minimal land disruption – smaller foundations, no heavy excavation",
    "Low embodied energy – reduced energy use in material manufacturing",
    "Long-term recyclability – no material is wasted after use",
  ],
  innovationsTitle: "Innovations we’re working on",
  innovations: [
    "Solar-integrated roofing solutions",
    "Use of fly ash bricks and green wall panels",
    "Low-emission logistics for remote installations",
  ],
  sdg: {
    title: "Global responsibility, local action",
    text: "We align with the UN Sustainable Development Goals (SDGs), especially:",
    goals: [
      { n: "9", t: "Industry, Innovation & Infrastructure" },
      { n: "11", t: "Sustainable Cities & Communities" },
    ],
  },
  photos: [
    { src: AB("bay"), alt: "Recyclable steel sections in the plant bay" },
    { src: AB("scaffold"), alt: "Steel structure frame" },
  ],
};

export const PROCESS = {
  tag: "05 · Manufacturing Process",
  title: "Speed, strength, and simplicity.",
  hl: ["Speed,", "strength,", "and", "simplicity."],
  text: "Our PEB manufacturing process ensures each structure is crafted to last and built to perform. Here’s how we bring your dream structure to life:",
  steps: [
    { t: "Project Planning & Design", d: "Requirements gathered on site, usage and load factors, then modelled in 2D/3D CAD and optimized for weight, cost, and environmental efficiency.", img: AB("cad"), alt: "Automated precision machinery" },
    { t: "Material Procurement", d: "High-grade steel from trusted partners, with quality-verified bolts, fasteners, cladding, panels and trims aligned to design specs.", img: AB("s-fit"), alt: "Steel members laid out ready for fabrication" },
    { t: "Cutting & Fabrication", d: "Plasma + oxyfuel cutting, CNC shearing, submerged arc welding and threading — every piece made to exact BIM specifications.", img: AB("s-cut"), alt: "CNC cutting table at work" },
    { t: "Surface Treatment", d: "8-wheel automatic shot blasting, hot-dip galvanizing (80–120 microns) and color-coated finishing for corrosion and weather resistance.", img: AB("s-blast"), alt: "Automatic shot blasting machine" },
    { t: "Fit-up & Quality Check", d: "Mock assembly under EOT crane supervision, then dimensional, ultrasonic weld and surface-finish inspection — on-site rework near zero.", img: AB("fittup"), alt: "Fit-up section with structural members" },
    { t: "Packing & Dispatch", d: "Protective wrapping, QR-coded packages linked to the BIM model, and just-in-time delivery coordinated with your site.", img: AB("s-pack"), alt: "Packed steel components ready for dispatch" },
  ],
};

export const PLANT = {
  tag: "06 · Production Plant",
  title: "Where precision engineering meets manufacturing excellence.",
  hl: ["precision", "engineering", "meets", "manufacturing", "excellence."],
  text:
    "Located in Banswara, Rajasthan, our 10,000+ sq. m production plant is the heart of DIYPREFAB’s manufacturing operations. Equipped with CNC machinery, automated welding stations, and advanced surface treatment facilities, we produce precision-engineered steel components for projects across India and beyond.",
  stats: [
    { n: 10000, suffix: "+", label: "Sq. meters facility", fmt: true },
    { n: 1000, suffix: "+", label: "Tons per year capacity", fmt: true },
    { n: 7, suffix: "+", label: "Years of experience" },
  ],
  badge: "ISO 9001 Certified",
  galleryTitle: "Inside the plant",
  gallery: [
    { src: AB("cutting"), alt: "Plasma and oxyfuel cutting", t: "Plasma + Oxyfuel Cutting", d: "CNC-controlled precision with minimal material waste." },
    { src: AB("shearing"), alt: "CNC shearing machine", t: "CNC Shearing", d: "Clean, accurate cuts in steel up to 10 mm." },
    { src: AB("welding"), alt: "Fully automatic beam welding machine", t: "Automatic Beam Welding", d: "Submerged arc welding for deep, consistent welds." },
    { src: AB("threading"), alt: "Threading and power press machine", t: "Threading & Power Press", d: "Connection-ready members, fabricated to spec." },
    { src: AB("drilling"), alt: "Radial drill machines", t: "Radial Drilling", d: "Precise bolt holes for perfect site assembly." },
    { src: AB("blasting"), alt: "Automatic shot blasting machine", t: "Shot Blasting", d: "8-wheel surface preparation before coating." },
    { src: AB("tacking"), alt: "Fit-up and quality check bay", t: "Fit-up & Quality Check", d: "Mock assembly and ultrasonic weld testing." },
    { src: AB("dispatch"), alt: "Packing and dispatch bay", t: "Packing & Dispatch", d: "QR-labelled packs, ready for just-in-time delivery." },
  ],
  capabilitiesTitle: "Facility capabilities",
  capabilities: [
    { t: "CNC Machinery", d: "Computer-controlled cutting and drilling for millimeter-level accuracy." },
    { t: "Automated Welding", d: "Robotic and semi-automatic stations for consistent weld quality." },
    { t: "Surface Treatment Line", d: "Shot blasting, galvanizing and finishing for corrosion-resistant results." },
    { t: "In-house Testing", d: "Tensile strength, chemical composition, coating thickness and dimensional checks." },
    { t: "BIM Integration", d: "Direct data transfer from BIM models to CNC machines." },
    { t: "Logistics Hub", d: "Dedicated loading bay and fleet coordination across Rajasthan, Gujarat and MP." },
  ],
};

export const CTA = {
  tag: "Visit us",
  title: "See Our Facility in Action",
  hl: ["Facility", "in", "Action"],
  text: "Schedule a site visit to our Banswara production plant and witness the precision behind every DIYPREFAB structure.",
  statement: "Want a custom PEB kit for your site?",
  button: "Book a Factory Tour",
  bg: AB("bg-dusk"),
};
