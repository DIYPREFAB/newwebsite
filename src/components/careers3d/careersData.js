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
export const LOCATIONS = ["Kolkata", "Surat", "Udaipur", "Jaipur", "Delhi", "Project Site"];
export const APPLY_EMAIL = "tech@diyprefab.com";
// Each job: card fields + detail (shown when the card is opened).
// detail: { type, experience, about, sections: [{ h, pts: [] }], note }.  "Apply Now" opens Gmail / the mail app addressed to APPLY_EMAIL.
export const JOBS = [
  {
    id: 1, title: "Backend Engineer", category: "Engineer", company: "DIY PreFab", location: "Udaipur, India", postedOn: "02/11/2026", vacancies: 3,
    detail: {
      role: "Backend & AI Integration Engineer",
      type: "Full-time, on-site (Udaipur)", experience: "2\u20135 years",
      about: "You will build the backend systems and AI pipelines that power DIYPREFAB \u2014 from structural engineering computation and standards-authority compliance to AI-driven drawing extraction, RAG retrieval and copilot tooling. This is a deeply technical role where your code directly drives engineering calculations, STAAD model generation, and procurement automation.",
      sections: [
        { h: "What you will work on", pts: [
          "Canonical building model APIs: schema versioning, revision graphs and dependency-based recomputation",
          "Standards Authority Engine: rule compilation, hybrid retrieval (structured + vector), code-compliance verification",
          "STAAD model generation pipeline: frame geometry, load combinations, member specs and OpenSTAAD integration",
          "AI drawing extraction: VLM-based classification, geometry extraction, coordinate system resolution",
          "Engineering copilot backend: tool routing, context-aware actions and audit trails",
          "Wind, seismic and structural compute modules (IS 875, IS 1893 and related Indian standards)",
          "Procurement backend: vendor matching, RFQ orchestration, bid lifecycle and payment settlement"] },
        { h: "Must have", pts: [
          "Strong Python or Node.js backend skills \u2014 you can design a service, write it, deploy it",
          "Experience with at least one of: LLM/VLM integration, RAG pipelines, vector databases, or ML model serving",
          "Solid understanding of relational databases, data modelling and API design",
          "Comfort reading and implementing domain-specific logic (engineering formulas, standards clauses, computation pipelines)",
          "Git, automated testing and basic DevOps (Docker, CI/CD)"] },
        { h: "Nice to have", pts: [
          "Structural engineering or civil engineering background (even a B.Tech with exposure)",
          "Experience with STAAD, OpenSTAAD, or any structural analysis software",
          "Exposure to Indian construction standards (IS 800, IS 875, IS 1893)",
          "Experience building multi-tenant SaaS platforms or marketplace backends",
          "Familiarity with Supabase, LangChain, or similar AI application frameworks"] },
        { h: "Why join DIYVA", pts: [
          "Early-stage product \u2014 your code ships to production, not a backlog",
          "AI-first construction platform solving a real industry problem in India\u2019s PEB sector",
          "Small, focused team in Udaipur \u2014 low cost of living, high ownership",
          "Direct exposure to structural engineering, procurement and AI \u2014 not a typical CRUD shop"] },
      ],
    },
  },
  {
    id: 2, title: "DevOps Engineer", category: "Engineer", company: "DIY PreFab", location: "Udaipur, India", postedOn: "02/11/2026", vacancies: 1,
    detail: {
      role: "DevOps Engineer",
      type: "Full-time", experience: "2\u20133 years",
      about: "We are looking for a DevOps Engineer to build and run the cloud infrastructure and delivery pipelines behind DIYPREFAB, working closely with developers to improve deployment speed, reliability and cost.",
      sections: [
        { h: "Experience & cloud", pts: [
          "2\u20133 years of hands-on DevOps or cloud infrastructure experience in a production environment",
          "Strong working knowledge of Terraform: writing reusable modules, managing remote state and provisioning infrastructure across environments",
          "Hands-on experience with AWS (EC2, VPC, IAM, S3, RDS, EKS, CloudWatch) and GCP (Compute Engine, GKE, Cloud SQL, IAM, Cloud Storage)"] },
        { h: "Containers & delivery", pts: [
          "Docker: optimized Dockerfiles, multi-stage builds and container registries (ECR, Artifact Registry)",
          "Kubernetes: deploying and running workloads, Helm charts, autoscaling, ingress, ConfigMaps and Secrets, and troubleshooting pods",
          "Builds and maintains CI/CD pipelines with GitHub Actions, GitLab CI or Jenkins for automated build, test and deploy"] },
        { h: "Reliability & security", pts: [
          "Sets up monitoring, logging and alerting with tools such as Prometheus, Grafana, ELK/Loki or CloudWatch, and joins incident response",
          "Follows security best practices: least-privilege IAM, secrets management (Vault, AWS Secrets Manager, GCP Secret Manager) and network security"] },
        { h: "Scripting & teamwork", pts: [
          "Scripts and automates with Bash or Python; comfortable with Linux administration and networking basics (DNS, load balancers, TCP/IP)",
          "Good communication and teamwork; works closely with developers to improve deployment speed, reliability and cost"] },
      ],
    },
  },
  {
    id: 3, title: "Quality Analysis and Control Engineer", category: "Engineer", company: "DIY PreFab", location: "Project Site, India", postedOn: "02/11/2026", vacancies: 1,
    detail: {
      role: "QA/QC PEB Engineer",
      type: "Full-time, immediate joining at project site", experience: "3\u20138 years in PEB / structural steel",
      about: "We are looking for a QA/QC PEB Engineer to own inspection and quality control of pre-engineered building structures at our project sites across India.",
      sections: [
        { h: "Requirements", pts: [
          "ASNT Level-2 certification (mandatory)",
          "Diploma / B.Tech in Mechanical or Civil Engineering",
          "3\u20138 years of experience in PEB / structural steel",
          "Immediate joining at project site in India"] },
        { h: "Key responsibilities", pts: [
          "NDT Inspection: perform UT, MT and PT; ensure weld integrity",
          "Weld Quality Control: monitor welding as per WPS / PQR",
          "PEB Structure Inspection: check alignment and dimensions as per IS codes",
          "Quality Documentation: prepare inspection reports and quality records",
          "Coordination: work with project engineers, fabrication teams and client inspectors; support audits"] },
      ],
    },
  },
];

export const getJob = (id) => JOBS.find((j) => String(j.id) === String(id));
