import { TbSettingsBolt, TbSettingsUp } from "react-icons/tb";
import { FaLayerGroup, FaLeaf, FaSortAmountUp } from "react-icons/fa";
import { GiCargoCrane, GiMineTruck } from "react-icons/gi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaHelmetSafety } from "react-icons/fa6";
import { MdEngineering, MdFactory } from "react-icons/md";
import { VscFileSubmodule } from "react-icons/vsc";
import { IoLogoElectron, IoSettingsOutline } from "react-icons/io5";
import ImagePath from "./assets/ImagePath";
import ROUTE_PATHS from "./routes/RoutePath";

export const navItems = [
  {
    title: "Home",
    link: "/",
    submenu: [
      {
        id: 9,
        title: "Introduction To DIY PreFab Solutions",
        link: "/introduction-to-diy-prefab-solutions",
      },
      { id: 10, title: "Featured Projects", link: "/featured-projects" },
      {
        id: 11,
        title: "Key Benefits Of Prefab Construction",
        link: "/key-benefits-of-prefab-construction",
      },
    ],
  },
  {
    title: "About Us",
    link: "/about-us",
    submenu: [
      { id: 12, title: "Company Overview", link: "/about-us/company-overview" },
      {
        id: 13,
        title: "Our Vision Mission",
        link: "/about-us/our-vision-mission",
      },
      {
        id: 14,
        title: "Sustainability Eco Friendly Initiatives",
        link: "/about-us/sustainability-eco-friendly-initiatives",
      },
      {
        id: 15,
        title: "Manufacturing Process",
        link: "/about-us/manufacturing-process",
      },
      {
        id: 50,
        title: "Production Plant",
        link: "/production-plant",
      },
    ],
  },
  {
    title: "Product & Services",
    link: "/product-services",
    submenu: [
      {
        id: 16,
        title: "DIY Prefab Kits",
        link: "/product-services/diy-prefab-kits",
        subsubmenu: [
          {
            id: 17,
            title: "Home Kit",
            link: "/product-services/diy-prefab-kits/home-kit",
          },
          {
            id: 22,
            title: "Office Workspaces",
            link: "/product-services/diy-prefab-kits/office-workspaces",
          },
          {
            id: 23,
            title: "Storage Warehousing",
            link: "/product-services/diy-prefab-kits/storage-warehousing",
          },
          {
            id: 24,
            title: "Farmhouses Cottages",
            link: "/product-services/diy-prefab-kits/farmhouses-cottages",
          },
        ],
      },
      {
        id: 18,
        title: "Wall Roofing Solutions",
        link: "/product-services/wall-roofing-solutions",
        subsubmenu: [
          {
            id: 19,
            title: "Fiber Cement Boards",
            link: "/product-services/wall-roofing-solutions/fiber-cement-boards",
          },
          {
            id: 25,
            title: "Sandwich Panels",
            link: "/product-services/wall-roofing-solutions/sandwich-panels",
          },
          {
            id: 26,
            title: "Steel Metal Roofing",
            link: "/product-services/wall-roofing-solutions/steel-metal-roofing",
          },
        ],
      },
      {
        id: 20,
        title: "Portable Structures",
        link: "/product-services/portable-structures",
        subsubmenu: [
          {
            id: 27,
            title: "Site Office",
            link: "/product-services/portable-structures/site-office",
          },
          {
            id: 28,
            title: "Security Cabins",
            link: "/product-services/portable-structures/security-cabins",
          },
          {
            id: 29,
            title: "Mobile Homes",
            link: "/product-services/portable-structures/mobile-homes",
          },
        ],
      },
      {
        id: 21,
        title: "Accessories Customization",
        link: "/product-services/accessories-customization",
        subsubmenu: [
          {
            id: 30,
            title: "Doors Windows",
            link: "/product-services/accessories-customization/doors-windows",
          },
          {
            id: 31,
            title: "Insulation Materials",
            link: "/product-services/accessories-customization/insulation-materials",
          },
          {
            id: 32,
            title: "Electrical Plumbing Add Ons",
            link: "/product-services/accessories-customization/electrical-plumbing-add-ons",
          },
        ],
      },
    ],
  },
  {
    title: "Applications",
    link: "/applications",
    submenu: [
      { id: 33, title: "Residential", link: "/applications/residential" },
      { id: 34, title: "Commercial", link: "/applications/commercial" },
      { id: 35, title: "Industrial", link: "/applications/industrial" },
      {
        id: 36,
        title: "Educational Institutions",
        link: "/applications/educational-institutions",
      },
      {
        id: 37,
        title: "Healthcare Facilities",
        link: "/applications/healthcare-facilities",
      },
    ],
  },
  {
    title: "Project & Case Studies",
    link: "/project-case-studies",
    submenu: [
      {
        id: 38,
        title: "Success Stories",
        link: "/project-case-studies/success-stories",
      },
      {
        id: 39,
        title: "Client Testimonials",
        link: "/project-case-studies/client-testimonials",
      },
      {
        id: 40,
        title: "Project Gallery",
        link: "/project-case-studies/project-gallery",
      },
      {
        id: 41,
        title: "Hall of Fame",
        link: "/project-case-studies/hall-of-fame",
      },
    ],
  },
  {
    title: "Blog & News",
    link: "/blog-news",
    submenu: [
      { id: 41, title: "Industry Trends", link: "/blog-news/industry-trends" },
      {
        id: 42,
        title: "Construction Tips Tricks",
        link: "/blog-news/construction-tips-tricks",
      },
      {
        id: 43,
        title: "Sustainability In Prefab",
        link: "/blog-news/sustainability-in-prefab",
      },
    ],
  },
  {
    title: "Careers",
    link: "/careers",
    submenu: [
      { id: 44, title: "Job Openings", link: "/careers/job-openings" },
      { id: 45, title: "Work Culture", link: "/careers/work-culture" },
    ],
  },
  {
    title: "Contact Us",
    link: "/contact-us",
    submenu: [
      { id: 46, title: "Inquiry Form", link: "/contact-us/inquiry-form" },
      // { id: 47, title: "Locate Our Dealers", link: "/contact-us/locate-our-dealers" },
      // { id: 48, title: "Customer Support", link: "/contact-us/customer-support" },
    ],
  },
];

// Dashbaord
export const chooseUs = [
  {
    id: 1,
    icon: <TbSettingsUp className="choose-us-icons" />,
    title: "Extended Equipment Lifespan",
    description:
      "Crafted with high-grade materials to ensure long-term durability and low maintenance in work environments.",
  },
  {
    id: 2,
    icon: <FaHelmetSafety className="choose-us-icons" />,
    title: "Enhanced Safety Compliance",
    description:
      "All structures are fabricated to meet stringent workplace safety standards and building codes.",
  },
  {
    id: 3,
    icon: <FaSortAmountUp className="choose-us-icons" />,
    title: "Client-Centric Approach",
    description:
      "Our workspace solutions are tailored for efficiency, comfort, and user satisfaction from design to delivery.",
  },
  {
    id: 4,
    icon: <FaLeaf className="choose-us-icons" />,
    title: "Eco-Friendly Fabrication",
    description:
      "We use sustainable materials and processes to reduce environmental impact while maximizing performance.",
  },
];

export const weOfferList = [
  {
    id: 1,
    icon: <MdFactory className="we-offer-icons" />,
    title: "Fabrication",
    description:
      "Our fabrication process ensures precision-built prefab office and workspace structures that are durable, efficient, and ready for rapid deployment.",
    linkTo: ROUTE_PATHS.WE_OFFER_CARD_DETAILS + "/fabrication",
    slug: "fabrication",
  },
  {
    id: 2,
    icon: <HiOutlineClipboardDocumentList className="we-offer-icons" />,
    title: "Procurement",
    description:
      "Our streamlined procurement process ensures timely sourcing of high-quality materials for prefab office and workspace construction.",
    linkTo: ROUTE_PATHS.WE_OFFER_CARD_DETAILS + "/procurement",
    slug: "procurement",
  },
  {
    id: 3,
    icon: <FaLayerGroup className="we-offer-icons" />,
    title: "Engineering & Design",
    description:
      "Our engineering and design process combines innovation with precision to create efficient, modern prefab office and workspace solutions.",
    linkTo: ROUTE_PATHS.WE_OFFER_CARD_DETAILS + "/engineering-design",
    slug: "engineering-design",
  },
  {
    id: 4,
    icon: <GiCargoCrane className="we-offer-icons" />,
    title: "Construction",
    description:
      "Our construction process for prefab office and workspace buildings ensures fast, efficient, and high-quality results.",
    linkTo: ROUTE_PATHS.WE_OFFER_CARD_DETAILS + "/construction",
    slug: "construction",
  },
  {
    id: 5,
    icon: <VscFileSubmodule className="we-offer-icons" />,
    title: "Technical Consulting",
    description:
      "Unlock smarter building outcomes with our expert technical consulting for prefab office and workspace projects.",
    linkTo: ROUTE_PATHS.WE_OFFER_CARD_DETAILS + "/technical-consulting",
    slug: "technical-consulting",
  },
  {
    id: 6,
    icon: <MdEngineering className="we-offer-icons" />,
    title: "Civil Engineering",
    description:
      "Our civil engineering expertise ensures that every prefab office and workspace is structurally sound, efficient, and built to last.",
    linkTo: ROUTE_PATHS.WE_OFFER_CARD_DETAILS + "/civil-engineering",
    slug: "civil-engineering",
  },
];

export const weDo = [
  {
    icon: <GiMineTruck className="we-do-icons" />,
    title: "Experience & dependability",
    desc: "Prefab buildings offer unmatched experience and dependability through consistent quality, faster delivery, and long-term structural reliability.",
  },
  {
    icon: <GiCargoCrane className="we-do-icons" />,
    title: "Licensing deals & scalability",
    desc: "Prefab buildings offer a fast, flexible, and scalable solution ideal for streamlined licensing deals and rapid business expansion.",
  },
  {
    icon: <FaHelmetSafety className="we-do-icons" />,
    title: "Holistic & custom approach",
    desc: "Prefab buildings offer a holistic and custom approach, blending tailored design with efficient construction to meet unique project needs seamlessly.",
  },
  {
    icon: <IoSettingsOutline className="we-do-icons" />,
    title: "Development & fabrication",
    desc: "Prefab building plays a vital role in modern development and fabrication by enabling faster construction, precision engineering, and cost-effective scalability.",
  },
];

export const weDoMore = [
  {
    icon: <GiMineTruck className="we-do-icons" />,
    title: "Experience & dependability",
    subTitle: "A Legacy of Delivery You Can Count On",
    desc: "With years of hands-on industry experience, our team has delivered critical infrastructure and industrial solutions across sectors. We combine technical expertise with process reliability, ensuring your project stays on course — on time, every time. Why it matters: - Proven track record in large-scale builds - Safety-first, audit-ready workflows - Industry partnerships that last",
    ctaBtn: "Let’s discuss your project timeline",
    linkTo: ROUTE_PATHS.CONTACT_US,
  },
  {
    icon: <GiCargoCrane className="we-do-icons" />,
    title: "Licensing Deals & Scalability",
    subTitle: "Unlock Scalable Growth with Flexible Licensing",
    desc: "Whether you’re scaling operations regionally or replicating a proven model nationwide, we offer licensing options that align with your vision — including white-labeling, tech transfer, or prefab configuration deployments.What you get: - Legally sound licensing agreements - Modular system scalability - Partner support & deployment playbooks",
    ctaBtn: "Explore our licensing packages today.",
    linkTo: ROUTE_PATHS.PRODUCT_SERVICES,
  },
  {
    icon: <FaHelmetSafety className="we-do-icons" />,
    title: "Holistic & custom approach",
    subTitle: "Customized Solutions, Aligned with Your Goals",
    desc: "We design, build, and deliver solutions tailored to your site, timeline, materials, and budget. From PEB shell to mechanical coordination — every detail is handled by specialists. What we solve: - Cross-functional engineering requirements - Hybrid structural systems - Cost-to-performance balancing",
    ctaBtn: "Request a design feasibility review.",
    linkTo: ROUTE_PATHS.APPLICATIONS,
  },
  {
    icon: <IoSettingsOutline className="we-do-icons" />,
    title: "Development & fabrication",
    subTitle: "From Design Concept to Factory-Floor Reality",
    desc: "We bridge the gap between your CAD files and physical steel — with precision fabrication that follows best-in-class industry standards.Our capabilities: - Tekla, STAAD, AutoCAD native workflows - CNC-based plate cutting, drilling, and welding - Fabrication tracking & QC for every lot",
    ctaBtn: "Schedule a plant walkthrough.",
    linkTo: ROUTE_PATHS.CONTACT_US,
  },
];

export const sliderImages = [
  { id: 1, image: ImagePath.MainSlider1 },
  { id: 2, image: ImagePath.Slider2 },
  // { id: 3, image: ImagePath.Slider3 },
  { id: 4, image: ImagePath.Slider4 },
  { id: 5, image: ImagePath.Slider5 },
];

export const sliderSettings = {
  infinite: true,
  speed: 500, // Increased from 100 for smoother animation
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000, // Slightly increased for better UX
  cssEase: "cubic-bezier(0.4, 0, 0.2, 1)", // More performant easing
  arrows: false, // Remove arrows for cleaner look and better performance
  dots: false,
  pauseOnHover: true,
  swipeToSlide: true,
  touchThreshold: 10,
  accessibility: true,
  beforeChange: (oldIndex, newIndex) => {
    // More efficient DOM manipulation
    const images = document.querySelectorAll(".slider-image");
    images.forEach((img, index) => {
      if (index === oldIndex) {
        img.classList.remove("zoom-in", "active");
      }
    });
  },
  afterChange: (currentSlide) => {
    // Add zoom effect to active slide
    const activeImage = document.querySelector(".slick-active .slider-image");
    if (activeImage) {
      activeImage.classList.add("zoom-in", "active");
    }
  },
};
export const performanceList = [
  {
    icon: <IoLogoElectron className="performance-icons" />,
    title: "Precision Performance",
    desc: "Precision Performance ensures every detail is executed with accuracy, delivering consistent quality and reliability.",
  },
  {
    icon: <TbSettingsBolt className="performance-icons" />,
    title: "Innovative Automation",
    desc: "Innovative automation streamlines processes through advanced technology, enhancing efficiency, accuracy, and productivity.",
  },
];

// IntoductionToDIY
export const infoBoxList = [
  {
    id: 1,
    title: "Experience & Dependability",
    description: `With years of hands-on expertise, "DIY PreFab" delivers reliable, high-quality prefab building solutions tailored to your needs.`,
  },
  {
    id: 2,
    title: "Licensing Deals & Scalability",
    description: `Unlock growth with "DIY PreFab" through strategic licensing deals and scalable building solutions tailored for every market.`,
  },
  {
    id: 3,
    title: "Holistic & Custom Approach",
    description: `Discover the future of construction with "DIY PreFab" advanced development and fabrication solutions. From concept to completion.`,
  },
  {
    id: 4,
    title: "Development & Fabrication",
    description: `DIY PreFab delivers high-end development and fabrication services, ensuring seamless execution of modern building concepts.`,
  },
];

export const slideVariants = {
  initial: { x: "100vw", opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 60, damping: 20, duration: 0.5 },
  },
  exit: {
    x: "-100vw",
    opacity: 0,
    transition: { type: "spring", stiffness: 60, damping: 20, duration: 0.5 },
  },
};

// Key banefits
export const benefitsList = [
  {
    id: 1,
    title: "Super Fast Project Timelines",
    description: `With prefab, 80% of the work is done in the factory. On-site assembly takes a fraction of the time compared to laying bricks, curing concrete, or managing dozens of laborers`,
  },
  {
    id: 2,
    title: "Budget-Friendly & Transparent",
    description: `Get clear costs up front. No hidden labor charges, no escalating bills. You save on both materials and time — two major budget drivers.`,
  },
  {
    id: 3,
    title: "Site Cabins",
    description: `Prefab buildings are essential for site cabins, offering quick setup and easy relocation. They provide durable, weather-resistant spaces ideal for on-site offices and worker accommodations. With efficient construction and cost savings, prefab cabins enhance project mobility and productivity.`,
  },
  {
    id: 4,
    title: "Development & fabrication",
    description: `Discover the future of construction with "DIY PreFab"advanced development and fabrication solutions.From concept to completion, our prefab solutions .`,
  },
  {
    id: 5,
    title: "Development & fabrication",
    description: `Discover the future of construction with "DIY PreFab"advanced development and fabrication solutions.From concept to completion, our prefab solutions .`,
  },
  {
    id: 6,
    title: "Development & fabrication",
    description: `Discover the future of construction with "DIY PreFab"advanced development and fabrication solutions.From concept to completion, our prefab solutions .`,
  },
  {
    id: 7,
    title: "Development & fabrication",
    description: `Discover the future of construction with "DIY PreFab"advanced development and fabrication solutions.From concept to completion, our prefab solutions .`,
  },
  {
    id: 8,
    title: "Development & fabrication",
    description: `Discover the future of construction with "DIY PreFab"advanced development and fabrication solutions.From concept to completion, our prefab solutions .`,
  },
];

export const casesBoxList = [
  {
    id: 1,
    title: "WareHouse",
    description: `Prefab buildings offer a fast, cost-effective solution for modern warehouse construction. Their modular design ensures quicker installation, reduced labor, and minimal site disruption. With durability and scalability, prefab structures are ideal for dynamic warehouse needs.`,
  },
  {
    id: 2,
    title: "Offices Shops",
    description: `Prefab buildings offer a fast, cost-effective solution for modern office and shop spaces. They reduce construction time, minimize waste, and ensure consistent quality. Ideal for businesses seeking flexibility and scalability, prefab structures meet today's dynamic needs.`,
  },
  {
    id: 3,
    title: "Site Cabins",
    description: `Prefab buildings are essential for site cabins, offering quick setup and easy relocation. They provide durable, weather-resistant spaces ideal for on-site offices and worker accommodations. With efficient construction and cost savings, prefab cabins enhance project mobility and productivity.`,
  },
  {
    id: 4,
    title: "Development & fabrication",
    description: `Discover the future of construction with "DIY PreFab"advanced development and fabrication solutions.From concept to completion, our prefab solutions .`,
  },
  {
    id: 5,
    title: "Development & fabrication",
    description: `Discover the future of construction with "DIY PreFab"advanced development and fabrication solutions.From concept to completion, our prefab solutions .`,
  },
  {
    id: 6,
    title: "Development & fabrication",
    description: `Discover the future of construction with "DIY PreFab"advanced development and fabrication solutions.From concept to completion, our prefab solutions .`,
  },
  {
    id: 7,
    title: "Development & fabrication",
    description: `Discover the future of construction with "DIY PreFab"advanced development and fabrication solutions.From concept to completion, our prefab solutions .`,
  },
  {
    id: 8,
    title: "Development & fabrication",
    description: `Discover the future of construction with "DIY PreFab"advanced development and fabrication solutions.From concept to completion, our prefab solutions .`,
  },
  {
    id: 9,
    title: "Development & fabrication",
    description: `Discover the future of construction with "DIY PreFab"advanced development and fabrication solutions.From concept to completion, our prefab solutions .`,
  },
];

export const comparisonList = [
  {
    id: 1,
    feature: "Speed of Construction",
    prefab: "30–60% faster – most structures ready in weeks",
    conventional: "Slower – often takes several months",
  },
  {
    id: 2,
    feature: "Speed of Construction",
    prefab: "30–60% faster – most structures ready in weeks",
    conventional: "Slower – often takes several months",
  },
];

// company overview
export const comparisonListAbout = [
  {
    id: 1,
    feature: "DIY-Friendly Systems",
    prefab: "Easy to assemble prefab kits — minimal tools needed",
  },
  {
    id: 2,
    feature: "Rapid Project Delivery",
    prefab: "Projects completed in as little as 10–30 days",
  },
  {
    id: 2,
    feature: "Transparent Pricing",
    prefab: "Fixed cost prefab kits — no surprises",
  },
  {
    id: 2,
    feature: "Sustainability Focus",
    prefab: "Uses recyclable steel and low-waste systems",
  },
  {
    id: 2,
    feature: "Pan-India Reach",
    prefab: "Serving clients across Rajasthan, MP, Gujarat",
  },
  {
    id: 2,
    feature: "Export Capability",
    prefab: "Successfully shipped and installed in Africa",
  },
];

// Sustainability
export const comparisonListSus = [
  {
    id: 1,
    feature: "Steel-Based Structures",
    prefab: "Steel is 100% recyclable and reusable",
  },
  {
    id: 2,
    feature: "Precision Prefabrication",
    prefab: "Reduces material waste by up to 60%",
  },
  {
    id: 2,
    feature: "Dry Construction Process",
    prefab: "Saves water and eliminates wet curing",
  },
  {
    id: 2,
    feature: "Fast Assembly",
    prefab: "Less energy consumption on-site",
  },
  {
    id: 2,
    feature: "Modular Design",
    prefab: "Enables disassembly, reuse, and future upgrades",
  },
  {
    id: 2,
    feature: "Smaller Carbon Footprint",
    prefab: "Optimized logistics and minimal transport cycles",
  },
  {
    id: 2,
    feature: "Solar-Ready Roof Designs",
    prefab: "Supports easy installation of solar panels",
  },
];

// DiyPreFabKits

export const comparisonListDiyPreFabKits = [
  {
    id: 1,
    feature: "Construction",
    prefab: "Site offices, worker dormitories",
  },
  {
    id: 2,
    feature: "Healthcare",
    prefab: "Clinics, COVID cabins, mobile health units",
  },
  {
    id: 2,
    feature: "Education",
    prefab: "Classrooms, staff rooms, labs",
  },
  {
    id: 2,
    feature: "Emergency Relief",
    prefab: "Disaster shelters, control rooms",
  },
  {
    id: 2,
    feature: "Government & NGOs",
    prefab: "Public health centers, mobile command posts",
  },
  {
    id: 2,
    feature: "Events & Retail",
    prefab: "Pop-up shops, exhibition booths, kiosks",
  },
  {
    id: 2,
    feature: "Industry",
    prefab: "Utility sheds, tool rooms, godowns",
  },
];

export const comparisonListHomeKit = [
  {
    id: 1,
    feature: "Urban Housing",
    prefab: "Duplexes, PG rooms, rooftop floors, micro-homes",
  },
  {
    id: 2,
    feature: "Institutional Buildings",
    prefab: "Classrooms, hostels, labs, wellness centers",
  },
  {
    id: 2,
    feature: "Healthcare Facilities",
    prefab: "Clinics, mobile health units, vaccination centers",
  },
  {
    id: 2,
    feature: "Emergency Shelters",
    prefab: "Disaster relief housing, quarantine centers",
  },
  {
    id: 2,
    feature: "Commercial Kiosks",
    prefab: "Fast food booths, salons, retail pods",
  },
  {
    id: 2,
    feature: "Rooftop Extensions",
    prefab: "Add-on floors for existing RCC buildings",
  },
  {
    id: 2,
    feature: "Resorts & Retreats",
    prefab: "Villas, cabins, guest houses, luxury tents ",
  },
];

// Fibre Cement Board

export const chooseUsSandwich = [
  {
    id: 1,
    icon: <TbSettingsUp className="choose-us-icons" />,
    title: "Outer & inner layers:",
    description: "Steel sheets with protective coatings.",
  },
  {
    id: 2,
    icon: <FaHelmetSafety className="choose-us-icons" />,
    title: "Core insulation:",
    description:
      "PUF / EPS / Rockwool (as per thermal, fire, or acoustic needs)",
  },
];

export const comparisonListSandwich = [
  {
    id: 1,
    feature: "PUF Panels",
    prefab: "Cold rooms, roofing, walling",
    exe: "Excellent thermal performance, lightweight",
  },
  {
    id: 2,
    feature: "EPS Panels",
    prefab: "Offices, cabins, homes",
    exe: "Cost-effective, fast to install",
  },
  {
    id: 3,
    feature: "Healthcare Facilities",
    prefab: "Clinics, mobile health units, vaccination centers",
    exe: "Cost-effective, fast to install",
  },
  {
    id: 4,
    feature: "Rockwool Panels",
    prefab: "Fire zones, auditoriums",
    exe: "Fire resistance + soundproofing",
  },
];

export const comparisonList2Sandwich = [
  {
    id: 1,
    feature: "PUF Panels",
    prefab: "Cold rooms, roofing, walling",
  },
  {
    id: 2,
    feature: "EPS Panels",
    prefab: "Offices, cabins, homes",
  },
  {
    id: 3,
    feature: "Healthcare Facilities",
    prefab: "Clinics, mobile health units, vaccination centers",
  },
  {
    id: 4,
    feature: "Rockwool Panels",
    prefab: "Fire zones, auditoriums",
  },
];

// Success

export const successStories = [
  { name: "Garvit Agrawal", role: "Founder", image: ImagePath.sucessImg1 },
  { name: "Arpit Agrawal", role: "Founder", image: ImagePath.sucessImg2 },
];

// Product

export const weOfferListProductandServices = [
  {
    id: 1,
    icon: <MdFactory className="we-offer-icons" />,
    title: "Keyword Focus",
    description:
      "pre engineered buildings in India, steel building manufacturer Rajasthan",
    listData: [
      "Ideal for factories, warehouses, production units",
      "Designed for high strength, quick assembly, and durability",
      "Engineered to meet specific load, wind, and seismic conditions",
    ],
  },
  {
    id: 2,
    icon: <HiOutlineClipboardDocumentList className="we-offer-icons" />,
    title: "What Makes Our PEBs Different?",
    description: "Rapid Construction",
    listData: [
      "Cut your build time by up to 50%",
      "Precision pre-fabricated components, zero delays",
    ],
  },
  {
    id: 3,
    icon: <FaLayerGroup className="we-offer-icons" />,
    title: "Engineered Strength",
    description: "",
    listData: [
      "High-tensile steel frames built for load, seismic and wind conditions",
      "Factory-certified welds and connections",
    ],
  },
  {
    id: 4,
    icon: <GiCargoCrane className="we-offer-icons" />,
    title: "DIY-Ready Kits",
    description: "",
    listData: [
      "Delivered with pre-drilled, pre-cut frames",
      "On-site assembly with minimum tools and no welding",
    ],
  },
  {
    id: 5,
    icon: <VscFileSubmodule className="we-offer-icons" />,
    title: "Eco-Conscious Build",
    description: "",
    listData: [
      "Minimal waste, recyclable materials, low-carbon manufacturing",
      "Dry construction = No water use or cement",
    ],
  },
  {
    id: 6,
    icon: <MdEngineering className="we-offer-icons" />,
    title: "Fully Customizable",
    description: "",
    listData: [
      "Design your own layout — span, bays, mezzanine, or crane beams",
      "Future-proof and expandable",
    ],
  },
];

export const comparisonListProductandServices = [
  {
    id: 1,
    feature: "Industrial Units",
    prefab: "Production floors, machine bays, control centers",
  },
  {
    id: 2,
    feature: "Warehousing",
    prefab: "Logistic hubs, storage facilities, cold rooms",
  },
  {
    id: 2,
    feature: "Agro Industries",
    prefab: "Fertilizer godowns, packhouses, grain sheds",
  },
  {
    id: 2,
    feature: "Manufacturing",
    prefab: "Assembly lines, mezzanine-based factory setups",
  },
  {
    id: 2,
    feature: "Commercial Use",
    prefab: "Vehicle showrooms, workshops, service bays",
  },
  {
    id: 2,
    feature: "Institutional Use",
    prefab: "Training centers, vocational schools, R&D labs",
  },
  {
    id: 2,
    feature: "EPC & Turnkey",
    prefab: "Custom-designed projects with end-to-end delivery",
  },
];
