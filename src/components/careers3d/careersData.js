import { FaGraduationCap, FaHandshake, FaUsers } from "react-icons/fa";

// ---- Careers / Work Culture page (copy taken from the previous Careers and Work Culture pages) ----
export const TITLE = "Grow your career with DIY PreFab";
export const HERO_HL = new Set(["career", "PreFab"]);
export const HERO_TEXT = "Develop your career at a place that respects your time and personal wellbeing.";

export const CHIPS = [
  ["7+ Years", "of experience"],
  ["10,000+ sqm", "Banswara plant"],
  ["Mentorship", "from experienced professionals"],
];

export const MARQUEE = ["Learn", "Build", "Lead", "Grow"];

// [value, suffix, label]
export const STATS = [
  [7, "+", "Years of experience"],
  [10000, "+", "sqm manufacturing facility in Banswara"],
  [3, "", "States served from our plant"],
  [4, "", "Cities with active operations"],
];

export const STORY_TAG = "Our people";
export const STORY_LEAD =
  "Prefab buildings empower professional experts with faster deployment, design flexibility, and cost-effective construction solutions.";
export const STORY_STATEMENT =
  "Our people make us a great company. For any company, its obligation to its employees is as strong as it is to its clients. We stay true to our values and commitment to our employees in all aspects, which is reflected in the industry-leading services we provide.";
export const STORY_MORE =
  "Whether you\u2019re a junior, intermediate, or senior, if you have the right skills and knowledge, we want you!";

export const CULTURE_HEAD = "Work Culture";
export const CULTURE_TEXT =
  "At DIY PreFab, we believe that great work stems from a great work environment. Our culture is not just something we talk about \u2014 it's something we live every day.";

export const PILLARS = [
  { n: "01", t: "Core Values", lead: "We are guided by a strong set of values that shape every decision and action:", pts: ["We do the right thing, even when no one is watching.", "Our users and clients are at the heart of everything we build.", "We grow together by lifting each other up."] },
  { n: "02", t: "Team Environment", lead: "We foster a respectful, inclusive, and energetic team spirit where:", pts: ["Every voice is heard.", "Diversity of thought is encouraged.", "Feedback is frequent, constructive, and mutual."] },
  { n: "03", t: "Work & Growth", lead: "We invest in your potential with:", pts: ["Ongoing learning and upskilling programs.", "Internal mobility and leadership opportunities.", "Mentorship from experienced professionals."] },
  { n: "04", t: "Hybrid Flexibility & Work-Life Balance", lead: "We understand the importance of flexibility and trust:", pts: ["Hybrid/remote work options.", "Flexible hours tailored to productivity.", "Mental health days and wellness initiatives."] },
];

export const PROGRAMS_TITLE = "Creating a place for talent to grow.";
export const PROGRAMS = [
  { id: "int", Icon: FaGraduationCap, label: "Initiatives & internships", value: "Real projects, real experience", action: "For young professionals", text: "A variety of initiatives, internships, and programs for young professionals ready to gain experience with real projects." },
  { id: "campus", Icon: FaHandshake, label: "Campus partners", value: "Brainwave University & NAPS India", action: "IT / software opportunities", text: "We\u2019ve partnered with Brainwave University and NAPS India to bring students valuable work experience and opportunities in the IT/software industry." },
  { id: "all", Icon: FaUsers, label: "Every level", value: "Junior, intermediate or senior", action: "Right skills, right place", text: "If you have the right skills and knowledge, we want you. We respect your time and your personal wellbeing." },
];

export const BUILD_TAG = "Who we are";
export const BUILD_TITLE = "What you will help us build.";
export const BUILD_TEXT =
  "Backed by strong engineering, modern fabrication, and on-ground project execution experience. We run our own manufacturing facility in Banswara, Rajasthan, near the borders of Rajasthan, Gujarat and Madhya Pradesh, with active operations in Udaipur, Jaipur, Ahmedabad and Indore, and growing export success in South Africa.";
export const BUILD = [
  "Pre Engineered Buildings (PEBs)",
  "Customizable Prefab Kits for Warehouses, Sheds, & Units",
  "Modular Buildings for Housing, Offices & Commercial Use",
  "Eco-Friendly & Low-Carbon Construction Systems",
  "Projects Across Rural, Urban & International Markets",
];

export const CTA_TITLE = "Ready to build your career with us?";
export const CTA_TEXT = "See where we are hiring right now and take the next step.";

// ---- Job Openings page (same data and filter options as the previous page) ----
export const JOB_TITLE = "Open Job Positions";
export const JOB_HL = new Set(["Positions"]);
export const JOB_TEXT = "Crafting Engineering Excellence. Find the role that fits your skills and build with us.";
export const CATEGORIES = ["Accountant", "Engineer", "3D Designer", "HR", "Sales Officer"];
export const LOCATIONS = ["Kolkata", "Surat", "Udaipur", "Jaipur", "Delhi"];
export const APPLY_EMAIL = "tech@diyprefab.com";
// No openings right now. To add one, push an object like the example below; "Apply Now" opens Gmail to APPLY_EMAIL.
// { id: 1, title: "Accountant", category: "Accountant", company: "DIY PreFab", location: "Jaipur, India", postedOn: "01/01/2025", vacancies: 2 }
export const JOBS = [];
