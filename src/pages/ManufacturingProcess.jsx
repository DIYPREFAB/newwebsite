import React, { lazy, Suspense } from "react";
import { FaWarehouse } from "react-icons/fa";
import { FaHelmetSafety } from "react-icons/fa6";
import { MdSupportAgent } from "react-icons/md";
import { Col, Container, Row } from "reactstrap";
import ImagePath from "../assets/ImagePath";
import useSeoHelmet from "../hooks/ReactHelmet";
import SeoHelmet from "../common/SeoHelmet";
import ScrollToTop from "../common/ScrollToTop";

// Lazy load components
const NavBar = lazy(() =>
  import("../common/NavBar").then((module) => ({
    default: module.default,
  }))
);

const Banner = lazy(() =>
  import("../common/Banner").then((module) => ({
    default: module.default,
  }))
);

const OurVision = lazy(() =>
  import("../common/OurVision").then((module) => ({
    default: module.default,
  }))
);

const CounterCard = lazy(() =>
  import("../common/CounterCard").then((module) => ({
    default: module.default,
  }))
);

const TrustSlider = lazy(() =>
  import("../common/TrustSlider").then((module) => ({
    default: module.default,
  }))
);

const TestimonialCard = lazy(() =>
  import("../common/TestimonialCard").then((module) => ({
    default: module.default,
  }))
);

const WaveWrapper = lazy(() =>
  import("../common/WaveWrapper").then((module) => ({
    default: module.default,
  }))
);

const Footer = lazy(() =>
  import("../common/Footer").then((module) => ({
    default: module.default,
  }))
);

// Custom loading spinner component
const LoadingSpinner = React.memo(() => (
  <div
    className="loading-spinner-container"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 0",
      minHeight: "100px",
    }}
    role="status"
    aria-label="Loading content"
  >
    <div
      className="spinner"
      style={{
        width: "24px",
        height: "24px",
        border: "3px solid #f3f3f3",
        borderTop: "3px solid #007bff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style jsx>{`
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
));

// Section loader component
const SectionLoader = React.memo(({ height = "150px" }) => (
  <div
    style={{
      minHeight: height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.7,
    }}
    role="status"
    aria-label="Loading section"
  >
    <LoadingSpinner />
  </div>
));

// Error boundary for lazy components
class LazyComponentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lazy component loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
          <p>Something went wrong loading this section.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background: "#f8f9fa",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
    
    </div>
  );
}

    return this.props.children;
  }
}

// Memoized InfoBox component
const InfoBox = React.memo(({ icon: Icon, title, children }) => (
  <div className="info-box">
    <div className="info-box-icons" />
    <h6>{title}</h6>
    {children}
  </div>
));

// Memoized ContentBox component
const ContentBox = React.memo(({ icon, title, description }) => (
  <div className="we-are-left-content-box">
    {icon}
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
));

const ManufacturingProcess = () => {
  const seo = useSeoHelmet("manufacturing-process");

  return (
    <div>
      <SeoHelmet seo={seo} />

      <Suspense fallback={<SectionLoader height="60px" />}>
        <LazyComponentErrorBoundary>
          <NavBar />
        </LazyComponentErrorBoundary>
      </Suspense>

      <Suspense fallback={<SectionLoader height="200px" />}>
        <LazyComponentErrorBoundary>
          <Banner
            title={"Manufacturing Process"}
            description={"Crafting Engineering Excellence"}
          />
        </LazyComponentErrorBoundary>
      </Suspense>

      <section className="we-are-section">
        <Container>
          <Row>
            <Col md={12} lg={6}>
              <div className="we-are-left">
                <h2>
                  Our Manufacturing Process Precision-Engineered for Speed,
                  Strength & Sustainability
                </h2>
                <p>
                  At “DIY PreFab”, every building we deliver starts with a
                  promise — <strong>speed, strength, and simplicity</strong>.
                  Behind that promise lies a well-oiled, quality-controlled{" "}
                  <strong>PEB manufacturing process</strong> that ensures each
                  structure is crafted to last and built to perform.
                </p>
                <p>
                  From sourcing raw steel to packaging ready-to-install kits, we
                  follow a streamlined process backed by technology,
                  engineering, and experience.
                </p>
                <div className="we-are-left-content-container">
                  <ContentBox
                    icon={<FaHelmetSafety className="performance-icons" />}
                    title="Professional Expert"
                    description="Prefab buildings empower professional experts with faster deployment, design flexibility, and cost-effective construction solutions."
                  />
                  <ContentBox
                    icon={<MdSupportAgent className="performance-icons" />}
                    title="24/7 Premium Support"
                    description="Experience uninterrupted service and peace of mind with 24/7 premium support tailored for your prefab building needs."
                  />
                </div>
              </div>
            </Col>
            <Col md={12} lg={6}>
              <div className="we-are-right">
                <div className="we-are-back-image-section">
                  <img
                    src={ImagePath.WRB}
                    alt="we-are-back"
                    className="img-fluid"
                  />
                  <div className="we-are-back-right-content-box">
                    <div className="we-are-back-right-content">
                      <h4>25 +</h4>
                      <p>Years of Experience</p>
                    </div>
                    <div className="divider"></div>
                    <div className="we-are-back-right-content jcs">
                      <p>Cutting-Edge Expertise</p>
                      <p>Holistic Solutions Approach</p>
                      <p>Client-Centric Collaboration</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="information-section manuf">
        <Container>
          <div className="information-container">
            <InfoBox
              icon={FaWarehouse}
              title="Step-by-Step Prefab Manufacturing Process"
            >
              <p>Here’s how we bring your dream structure to life:</p>
            </InfoBox>

            <InfoBox icon={FaWarehouse} title="Project Planning & Design">
              <ul>
                <li>Requirement gathering based on site, usage & load factors</li>
                <li>2D/3D CAD modeling using structural design software</li>
                <li>
                  Design optimization for weight, cost, and environmental
                  efficiency
                </li>
              </ul>
            </InfoBox>

            <InfoBox icon={FaWarehouse} title="Material Procurement">
              <ul>
                <li>High-grade steel sourced from trusted partners</li>
                <li>Quality-verified bolts, fasteners, and cladding materials</li>
                <li>Panels, trims, and components aligned to design specs</li>
              </ul>
            </InfoBox>

            <InfoBox
              icon={FaWarehouse}
              title="Supporting Sustainable Growth in India"
            >
              <p>Whether you're:</p>
              <p>
                A farmer looking to build a recyclable agro shed, A business
                aiming for green warehousing, A school or clinic expanding with
                low-impact buildings,
              </p>
              <p>
                Or a government agency seeking eco-compliant infrastructure...
                DIY PreFab delivers prefab solutions with sustainability at the
                core.
              </p>
              <p>
                Target Regions: Rajasthan, Gujarat, Madhya Pradesh, Udaipur,
                Indore, Ahmedabad
              </p>
            </InfoBox>

            <InfoBox icon={FaWarehouse} title="Innovations We're Working On">
              <ul>
                <li>Solar-integrated roofing solutions.</li>
                <li>Use of fly ash bricks and green wall panels.</li>
                <li>Low-emission logistics for remote installations.</li>
              </ul>
            </InfoBox>

            <InfoBox icon={FaWarehouse} title="Global Responsibility, Local Action">
              <p>We align with the UN Sustainable Development Goals (SDGs), especially:</p>
              <ul>
                <li>Goal 9: Industry, Innovation & Infrastructure</li>
                <li>Goal 11: Sustainable Cities & Communities</li>
                <li>
                  Goal 13: Climate Action Our project in South Africa demonstrates our ability to deliver low-carbon PEB buildings internationally — and we aim to bring these standards to every corner of India.
                </li>
              </ul>
            </InfoBox>
          </div>
        </Container>
      </section>

      <Suspense fallback={<SectionLoader height="200px" />}>
        <LazyComponentErrorBoundary>
          <OurVision />
        </LazyComponentErrorBoundary>
      </Suspense>

      <section className="common-section where-manuf-wrap">
        <Container>
          <div className="wm-box">
            <h3>Where We Manufacture</h3>
            <p>
              Our manufacturing operations are based in{" "}
              <strong>Rajasthan</strong>, with ongoing expansion across{" "}
              <strong>central India</strong>. All projects — from{" "}
              <strong>Udaipur to Indore, Ahmedabad to Jaipur</strong> — are
              powered by our factory-to-site supply chain.
            </p>
          </div>
          <div className="wm-box">
            <h3>Want a Custom PEB Kit for Your Site?</h3>
            <p>
              We’ll take your concept from drawing board to delivery — backed by
              solid engineering and rapid execution.
            </p>
          </div>
        </Container>
      </section>

      <Suspense fallback={<SectionLoader height="200px" />}>
        <LazyComponentErrorBoundary>
          <CounterCard />
        </LazyComponentErrorBoundary>
      </Suspense>

      <Suspense fallback={<SectionLoader height="200px" />}>
        <LazyComponentErrorBoundary>
          <TrustSlider />
        </LazyComponentErrorBoundary>
      </Suspense>

      <Suspense fallback={<SectionLoader height="200px" />}>
        <LazyComponentErrorBoundary>
          <TestimonialCard />
        </LazyComponentErrorBoundary>
      </Suspense>

      <Suspense fallback={<SectionLoader height="200px" />}>
        <LazyComponentErrorBoundary>
          <WaveWrapper />
        </LazyComponentErrorBoundary>
        <LazyComponentErrorBoundary>
          <Footer />
        </LazyComponentErrorBoundary>
      </Suspense>
        {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default React.memo(ManufacturingProcess);
