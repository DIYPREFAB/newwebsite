import React, { Suspense, lazy } from "react";
import { Navigate, Route } from "react-router-dom";
import ROUTE_PATHS from "../../routes/RoutePath";
import LEGACY_REDIRECTS from "../../routes/redirects";

// The 3D pages are the only version of these pages now (the old Key Benefits, About, Products & Services, Applications,
// Contact and Careers pages were removed). Their SEO still comes from the same CMS records.
import Dashboard from "../../pages/Dashboard";

const page = (loader) => lazy(loader);

const P = {
  KeyBenefits: page(() => import("../../pages/KeyBenefits")),
  AboutUs: page(() => import("../../pages/AboutUs")),
  VisionMission: page(() => import("../../pages/VisionMission")),
  CompanyOverview: page(() => import("../../pages/CompanyOverview")),
  Sustainability: page(() => import("../../pages/Sustainability")),
  ManufacturingProcess: page(() => import("../../pages/ManufacturingProcess")),
  ProductionPlant: page(() => import("../../pages/ProductionPlant")),

  ProductandServices: page(() => import("../../pages/ProductandServices")),
  DiyPreFabKits: page(() => import("../../pages/DiyPreFabKits")),
  HomeKit: page(() => import("../../pages/HomeKit")),
  OfficeWorkSpace: page(() => import("../../pages/OfficeWorkSpace")),
  StorageWarehousing: page(() => import("../../pages/StorageWarehousing")),
  FarmHouseCottage: page(() => import("../../pages/FarmHouseCottage")),
  WallRoofingSolutions: page(() => import("../../pages/WallRoofingSolutions")),
  FibreCementBoards: page(() => import("../../pages/FibreCementBoards")),
  SandwichPanels: page(() => import("../../pages/SandwichPanels")),
  SteelMetalRoofing: page(() => import("../../pages/SteelMetalRoofing")),
  PortableStructure: page(() => import("../../pages/PortableStructure")),
  SiteOffice: page(() => import("../../pages/SiteOffice")),
  SecurityCabins: page(() => import("../../pages/SecurityCabins")),
  MobileHomes: page(() => import("../../pages/MobileHomes")),
  AccessoriesandCustomization: page(() => import("../../pages/AccessoriesandCustomization")),
  DoorsandWindow: page(() => import("../../pages/DoorsandWindow")),
  InsulationMaterials: page(() => import("../../pages/InsulationMaterials")),
  ElectricalPlumbingAddOns: page(() => import("../../pages/ElectricalPlumbingAddOns")),

  Application: page(() => import("../../pages/Application")),
  Residential: page(() => import("../../pages/Residential")),
  Commercial: page(() => import("../../pages/Commercial")),
  Industrial: page(() => import("../../pages/Industrial")),
  EducationalInstitution: page(() => import("../../pages/EducationalInstitution")),
  HealthcareFacilities: page(() => import("../../pages/HealthcareFacilities")),

  ProjectCaseandStudies: page(() => import("../../pages/ProjectCaseandStudies")),
  SuccssStories: page(() => import("../../pages/SuccssStories")),
  HallOfFame: page(() => import("../../pages/HallOfFame")),
  ClientTestimonial: page(() => import("../../pages/ClientTestimonial")),
  ProjectGallery: page(() => import("../../pages/ProjectGallery")),

  BlogandNews: page(() => import("../../pages/BlogandNews")),
  BlogDetails: page(() => import("../../pages/BlogDetails")),
  IndustryTrends: page(() => import("../../pages/IndustryTrends")),
  ConstructionTipsandTricks: page(() => import("../../pages/ConstructionTipsandTricks")),
  SustainbilityInPreFab: page(() => import("../../pages/SustainbilityInPreFab")),

  Career: page(() => import("../../pages/Career")),
  JobOpening: page(() => import("../../pages/JobOpening")),
  WorkCulture: page(() => import("../../pages/WorkCulture")),

  ContactUs: page(() => import("../../pages/ContactUs")),
  EnquiryForm: page(() => import("../../pages/EnquiryForm")),
  PrivacyPolicy: page(() => import("../../pages/PrivacyPolicy")),
  TermsOfService: page(() => import("../../pages/TermsOfService")),

  CardDetails: page(() => import("../../pages/CardDetails")),
  WeOfferCardDetails: page(() => import("../../pages/WeOfferCardDetails")),

  LinkedInFreeAssessment: page(() => import("../../pages/LinkedInFreeAssessment")),
  LinkedInConsultation: page(() => import("../../pages/LinkedInConsultation")),
  LinkedInCaseStudies: page(() => import("../../pages/LinkedInCaseStudies")),
};

// No spinner or text while a 3D page's code loads: just the page's own dark background, so there is no white flash.
const BlankFallback = () => <div style={{ minHeight: "100vh", background: "#001524" }} aria-hidden="true" />;

const SPIN_CSS = "@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}";
const LoadingFallback = ({ message = "Loading..." }) => (
  <div
    className="loading-container"
    style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", fontSize: "16px", color: "#666" }}
    role="status"
    aria-label={message}
  >
    <div
      className="loading-spinner"
      style={{ width: "20px", height: "20px", border: "2px solid #f3f3f3", borderTop: "2px solid #3498db", borderRadius: "50%", animation: "spin 1s linear infinite", marginRight: "10px" }}
    />
    {message}
    <style>{SPIN_CSS}</style>
  </div>
);

// [path, component, fallback]: "blank" = dark 3D-page placeholder, otherwise the spinner.
const ROUTES = [
  [ROUTE_PATHS.KEY_BENEFITS_OF_PREFAB_CONSTRUCTION, P.KeyBenefits, "blank"],
  [ROUTE_PATHS.ABOUT_US, P.AboutUs, "blank"],
  [ROUTE_PATHS.OUR_VISION_MISSION, P.VisionMission],
  [ROUTE_PATHS.COMPANY_OVERVIEW, P.CompanyOverview],
  [ROUTE_PATHS.SUSTAINABILITY_ECO_FRIENDLY_INITIATIVES, P.Sustainability],
  [ROUTE_PATHS.MANUFACTURING_PROCESS, P.ManufacturingProcess],
  [ROUTE_PATHS.PRODUCTION_PLANT, P.ProductionPlant],

  [ROUTE_PATHS.PRODUCT_SERVICES, P.ProductandServices, "blank"],
  [ROUTE_PATHS.D_I_Y_PREFAB_KITS, P.DiyPreFabKits],
  [ROUTE_PATHS.HOME_KIT, P.HomeKit],
  [ROUTE_PATHS.OFFICE_WORKSPACES, P.OfficeWorkSpace],
  [ROUTE_PATHS.STORAGE_WAREHOUSING, P.StorageWarehousing],
  [ROUTE_PATHS.FARMHOUSES_COTTAGES, P.FarmHouseCottage],
  [ROUTE_PATHS.WALL_ROOFING_SOLUTIONS, P.WallRoofingSolutions],
  [ROUTE_PATHS.FIBER_CEMENT_BOARDS, P.FibreCementBoards],
  [ROUTE_PATHS.SANDWICH_PANELS, P.SandwichPanels],
  [ROUTE_PATHS.STEEL_METAL_ROOFING, P.SteelMetalRoofing],
  [ROUTE_PATHS.PORTABLE_STRUCTURES, P.PortableStructure],
  [ROUTE_PATHS.SITE_OFFICE, P.SiteOffice],
  [ROUTE_PATHS.SECURITY_CABINS, P.SecurityCabins],
  [ROUTE_PATHS.MOBILE_HOMES, P.MobileHomes],
  [ROUTE_PATHS.ACCESSORIES_CUSTOMIZATION, P.AccessoriesandCustomization],
  [ROUTE_PATHS.DOORS_WINDOWS, P.DoorsandWindow],
  [ROUTE_PATHS.INSULATION_MATERIALS, P.InsulationMaterials],
  [ROUTE_PATHS.ELECTRICAL_PLUMBING_ADD_ONS, P.ElectricalPlumbingAddOns],

  [ROUTE_PATHS.APPLICATIONS, P.Application],
  [ROUTE_PATHS.RESIDENTIAL, P.Residential],
  [ROUTE_PATHS.COMMERCIAL, P.Commercial],
  [ROUTE_PATHS.INDUSTRIAL, P.Industrial],
  [ROUTE_PATHS.EDUCATIONAL_INSTITUTIONS, P.EducationalInstitution],
  [ROUTE_PATHS.HEALTHCARE_FACILITIES, P.HealthcareFacilities],

  [ROUTE_PATHS.PROJECT_CASE_STUDIES, P.ProjectCaseandStudies],
  [ROUTE_PATHS.SUCCESS_STORIES, P.SuccssStories],
  [ROUTE_PATHS.HALL_OF_FAME, P.HallOfFame],
  [ROUTE_PATHS.CLIENT_TESTIMONIALS, P.ClientTestimonial],
  [ROUTE_PATHS.PROJECT_GALLERY, P.ProjectGallery],

  [ROUTE_PATHS.BLOG_NEWS, P.BlogandNews],
  [ROUTE_PATHS.BLOG_DETAILS, P.BlogDetails],
  [ROUTE_PATHS.INDUSTRY_TRENDS, P.IndustryTrends],
  [ROUTE_PATHS.CONSTRUCTION_TIPS_TRICKS, P.ConstructionTipsandTricks],
  [ROUTE_PATHS.SUSTAINABILITY_IN_PREFAB, P.SustainbilityInPreFab],

  [ROUTE_PATHS.CAREERS, P.Career],
  [ROUTE_PATHS.JOB_OPENINGS, P.JobOpening],
  [ROUTE_PATHS.WORK_CULTURE, P.WorkCulture],

  [ROUTE_PATHS.CONTACT_US, P.ContactUs, "blank"],
  [ROUTE_PATHS.INQUIRY_FORM, P.EnquiryForm],
  [ROUTE_PATHS.PRIVACY_POLICY, P.PrivacyPolicy],
  [ROUTE_PATHS.TERMS_OF_SERVICE, P.TermsOfService],

  [ROUTE_PATHS.CARD_DETAILS, P.CardDetails],
  [`${ROUTE_PATHS.WE_OFFER_CARD_DETAILS}/:name`, P.WeOfferCardDetails],

  [ROUTE_PATHS.LINKEDIN_FREE_ASSESSMENT, P.LinkedInFreeAssessment],
  [ROUTE_PATHS.LINKEDIN_CASE_STUDIES, P.LinkedInCaseStudies],
  [ROUTE_PATHS.LINKEDIN_CONSULTATION, P.LinkedInConsultation],
];

// Preload the main nav pages quietly in the background so clicking between them does not wait on a download.
const preloadCriticalRoutes = () => {

  import("../../pages/AboutUs");
  import("../../pages/KeyBenefits");
  import("../../pages/ProductandServices");
  import("../../pages/Application");
  import("../../pages/ContactUs");
  import("../../pages/Career");
  import("../../pages/ProjectCaseandStudies");
  import("../../pages/BlogandNews");
};

const useRoutePreloading = () => {
  React.useEffect(() => {
    const events = ["mousedown", "touchstart", "keydown"];
    const preloadOnce = () => {
      preloadCriticalRoutes();
      events.forEach((ev) => document.removeEventListener(ev, preloadOnce));
    };
    events.forEach((ev) => document.addEventListener(ev, preloadOnce, { passive: true }));
    const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(preloadCriticalRoutes) : setTimeout(preloadCriticalRoutes, 100));
    const timer = setTimeout(idle, 2000);
    return () => {
      clearTimeout(timer);
      events.forEach((ev) => document.removeEventListener(ev, preloadOnce));
    };
  }, []);
};

const RoutesPath = () => {
  useRoutePreloading();

  return (
    <>
      {/* Critical route: not lazy */}
      <Route path="/" element={<Dashboard />} />

      {ROUTES.map(([path, Component, fb]) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={fb === "blank" ? <BlankFallback /> : <LoadingFallback />}>
              <Component />
            </Suspense>
          }
        />
      ))}

      {/* Moved / removed URLs keep working (the server also answers them with a real 301) */}
      {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}
    </>
  );
};

export default RoutesPath;
