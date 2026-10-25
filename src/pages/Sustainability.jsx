import React, { lazy, Suspense, useState, useEffect, Component } from "react";
import ImagePath from "../assets/ImagePath";
import { FaWarehouse } from "react-icons/fa";
import { FaHelmetSafety } from "react-icons/fa6";
import { MdSupportAgent } from "react-icons/md";
import { Col, Container, Row, Table } from "reactstrap";
import { comparisonListSus } from "../Constants";
import useSeoHelmet from "../hooks/ReactHelmet";
import SeoHelmet from "../common/SeoHelmet";

// Lazy-loaded components
const NavBar = lazy(() => import("../common/NavBar"));
const Banner = lazy(() => import("../common/Banner"));
const OurVision = lazy(() => import("../common/OurVision"));
const CounterCard = lazy(() => import("../common/CounterCard"));
const TrustSlider = lazy(() => import("../common/TrustSlider"));
const TestimonialCard = lazy(() => import("../common/TestimonialCard"));
const WaveWrapper = lazy(() => import("../common/WaveWrapper"));
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";

// Loading Spinner Component
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
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
));

// Section Loader Component
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

// Robust Error Boundary Class Component
class LazyErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('LazyErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div style={{ 
          padding: "20px", 
          textAlign: "center", 
          color: "#666",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          margin: "10px 0",
          backgroundColor: "#f9f9f9"
        }}>
          <h5 style={{ color: "#d32f2f", marginBottom: "10px" }}>
            Oops! Something went wrong
          </h5>
          <p style={{ marginBottom: "15px" }}>
            We're having trouble loading this section. Please try again.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: "10px 20px",
              border: "1px solid #007bff",
              borderRadius: "4px",
              background: "#007bff",
              color: "white",
              cursor: "pointer",
              fontSize: "14px"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
          >
            Try Again
          </button>

    </div>
  );
}

    return this.props.children;
  }
}

// Functional wrapper with error handling - Alternative approach
const SafeComponent = ({ children, height = "150px", fallback }) => {
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = () => {
    setLoadError(false);
    setRetryKey(prev => prev + 1);
  };

  if (loadError) {
    return (
      <div style={{ 
        padding: "20px", 
        textAlign: "center", 
        color: "#666",
        minHeight: height 
      }}>
        <p>Failed to load content.</p>
        <button
          onClick={handleRetry}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: "#f8f9fa",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <LazyErrorBoundary key={retryKey}>
      <Suspense 
        fallback={fallback || <SectionLoader height={height} />}
      >
        {children}
      </Suspense>
    </LazyErrorBoundary>
  );
};

// Optimized InfoBox component
const InfoBox = React.memo(({ title, content, list }) => (
  <div className="info-box">
    <div className="info-box-icons" />
    <h6>{title}</h6>
    {content && <p>{content}</p>}
    {list && (
      <ul>
        {list.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    )}
  </div>
));

// Feature content boxes component
const FeatureBoxes = React.memo(() => (
  <div className="we-are-left-content-container">
    <div className="we-are-left-content-box">
      <FaHelmetSafety className="performance-icons" />
      <h4>Professional Expert</h4>
      <p>
        Prefab buildings empower professional experts with faster
        deployment, design flexibility, and cost-effective
        construction solutions.
      </p>
    </div>
    <div className="we-are-left-content-box">
      <MdSupportAgent className="performance-icons" />
      <h4>24/7 Premium Support</h4>
      <p>
        Experience uninterrupted service and peace of mind with
        24/7 premium support tailored for your prefab building
        needs.
      </p>
    </div>
  </div>
));

// Experience card component
const ExperienceCard = React.memo(() => (
  <div className="we-are-back-right-content-box">
    <div className="we-are-back-right-content">
      <h4>7+</h4>
      <p>Years of Experience</p>
    </div>
    <div className="divider" />
    <div className="we-are-back-right-content jcs">
      <p>Cutting-Edge Expertise</p>
      <p>Holistic Solutions Approach</p>
      <p>Client-Centric Collaboration</p>
    </div>
  </div>
));

// Comparison table component
const ComparisonTable = React.memo(() => (
  <Table responsive bordered hover>
    <thead className="common-table-thead">
      <tr>
        <th>Sustainable Feature</th>
        <th>How It Helps</th>
      </tr>
    </thead>
    <tbody className="common-table-tbody">
      {comparisonListSus.map((compare, index) => (
        <tr key={index}>
          <td>{compare.feature}</td>
          <td>{compare.prefab}</td>
        </tr>
      ))}
    </tbody>
  </Table>
));

const Sustainability = () => {
  const seo = useSeoHelmet("sustainability-eco-friendly-initiatives");

  return (
    <div>
      <SeoHelmet seo={seo} />

      {/* Navigation - Critical, load immediately */}
      <SafeComponent height="100px">
        <NavBar />
      </SafeComponent>

      {/* Banner */}
      <SafeComponent height="200px">
        <Banner
          title="Leading the Green Building Revolution"
          description="Building Begins with Smart Engineering"
        />
      </SafeComponent>

      {/* Main Content Section */}
      <section className="we-are-section">
        <Container>
          <Row>
            <Col md={12} lg={6}>
              <div className="we-are-left">
                <h6>Who We Are</h6>
                <h2>
                  Sustainability & Eco-Friendly Initiatives Building Greener,
                  Smarter, and More Responsible Infrastructure
                </h2>
                <p>
                  At "DIY PreFab", sustainability is not just a feature — it's a
                  foundation. Every prefab building we deliver is designed to
                  minimize environmental impact, reduce construction waste, and
                  support India's transition to a low-carbon future.
                </p>
                <p>
                  We're proud to be part of a new generation of eco-conscious
                  construction companies in India, offering scalable, efficient,
                  and sustainable solutions for a better tomorrow.
                </p>
                <FeatureBoxes />
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
                  <ExperienceCard />
                </div>
              </div>
            </Col>

            <Col md={12}>
              <div className="wsustain-box">
                <h2>Why Sustainability Matters in Construction</h2>
                <p>
                  The construction sector contributes significantly to carbon
                  emissions, energy use, and landfill waste. Traditional
                  brick-and-mortar methods rely heavily on concrete, water, and
                  time — all of which carry environmental costs.
                </p>
                <p>
                  Our <strong>pre engineered building systems</strong> offer a
                  cleaner, smarter alternative for industries, farms, NGOs, and
                  institutions across India.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section">
        <Container>
          <div className="comparison-container">
            <h2>Our Core Eco-Friendly Practices</h2>
            <div className="comparison-container-box">
              <ComparisonTable />
            </div>
          </div>
        </Container>
      </section>

      {/* Information Section */}
      <section className="information-section">
        <Container>
          <div className="information-container">
            <InfoBox
              title="Sustainable Benefits for You"
              list={[
                "Lower Lifecycle Costs – less maintenance, more savings",
                "Faster Occupancy – start operations quicker = lower carbon impact",
                "Minimal Land Disruption – smaller foundations, no heavy excavation",
                "Low Embodied Energy – reduced energy use in material manufacturing",
                "Long-Term Recyclability – no material is wasted after use"
              ]}
            />
            <InfoBox
              title="Carbon tracking metrics for future net-zero projects"
              content="We're not just eco-friendly — we're eco-determined."
            />
            <InfoBox
              title="Join Our Green Building Movement"
              content="When you build with DIY PreFab, you're not just saving time and money — you're contributing to a healthier planet. Build responsibly. Reduce construction waste. Lower your carbon footprint."
            />
            <InfoBox
              title="Supporting Sustainable Growth in India"
              content="Whether you're a farmer, a business, a school, or a government agency, DIY PreFab delivers prefab solutions with sustainability at the core. Target Regions: Rajasthan, Gujarat, Madhya Pradesh, Udaipur, Indore, Ahmedabad."
            />
            <InfoBox
              title="Innovations We're Working On"
              list={[
                "Solar-integrated roofing solutions.",
                "Use of fly ash bricks and green wall panels.",
                "Low-emission logistics for remote installations."
              ]}
            />
            <InfoBox
              title="Global Responsibility, Local Action"
              content="We align with the UN Sustainable Development Goals (SDGs), especially:"
              list={[
                "Goal 9: Industry, Innovation & Infrastructure",
                "Goal 11: Sustainable Cities & Communities",
                "Goal 13: Climate Action. Our project in South Africa demonstrates our ability to deliver low-carbon PEB buildings internationally — and we aim to bring these standards to every corner of India."
              ]}
            />
          </div>
        </Container>
      </section>

      {/* Lazy-loaded sections */}
      {/* <SafeComponent height="200px">
        <OurVision />
      </SafeComponent> */}

      <SafeComponent height="200px">
        <CounterCard />
      </SafeComponent>

      <SafeComponent height="200px">
        <TrustSlider />
      </SafeComponent>

      <SafeComponent height="200px">
        <TestimonialCard />
      </SafeComponent>

      {/* Footer components */}
      <SafeComponent height="300px">
        <WaveWrapper />
        <Footer />
      </SafeComponent>
            {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Sustainability;