import React, { useState, lazy, Suspense } from "react";
import { Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import NavBar from "../common/NavBar";
import ImagePath from "../assets/ImagePath";
import WhyChooseUs from "../components/productandservices/diyprefabkits/WhyChooseUs";
import useSeoHelmet from "../hooks/ReactHelmet";
import SeoHelmet from "../common/SeoHelmet";

// Lazy-loaded components
const TrustSlider = lazy(() => import("../common/TrustSlider"));
const CounterCard = lazy(() => import("../common/CounterCard"));
const WaveWrapper = lazy(() => import("../common/WaveWrapper"));
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
const VideoModal = lazy(() => import("../common/VideoModal"));

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

// Error Boundary Component

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
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

const ProjectGallery = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const handleOpenVideo = () => setOpenVideo(!openVideo);
  const seo = useSeoHelmet("project-gallery");

  return (
    <div>
      <SeoHelmet seo={seo} />
      <NavBar />

      <section className="project-banner-wrap">
        <div className="project-bnr-bg">
          <img src={ImagePath.projectBnrBg} alt="Project Banner" />
        </div>
        <Container>
          <Row>
            <Col md={6} lg={6} className="project-box">
              <h3>Industrial IoT Deployment</h3>
              <p>
                Smart steel building solutions with integrated IoT sensors for real-time monitoring.
                Our projects combine structural excellence with modern technology to deliver
                warehouses and factories that are ready for Industry 4.0.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="common-section project-top">
        <Container>
          <Row>
            <Col md={6} lg={4}>
              <div className="project-gallery-left">
                <div className="project-gallery-list">
                  <h3>Another Project</h3>
                  <ul>
                    <li>
                      <Link to="" className="project-gallery-link">
                        Renewable Energy Integration
                      </Link>
                    </li>
                    <li>
                      <Link to="" className="project-gallery-link">
                        Robotics Integration
                      </Link>
                    </li>
                    <li>
                      <Link to="" className="project-gallery-link">
                        Industrial IoT Deployment
                      </Link>
                    </li>
                    <li>
                      <Link to="" className="project-gallery-link">
                        Water Management System
                      </Link>
                    </li>
                    <li>
                      <Link to="" className="project-gallery-link">
                        Advanced Materials Research
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col md={6} lg={8}>
              <div className="project-gallery-right">
                <div className="project-main-img">
                  <img src={ImagePath.projectgGalleryMainImg} alt="Main Project" />
                </div>
                <div className="project-main-content">
                  <h3>Resulted in a 30% increase in production efficiency</h3>
                  <p>
                    At “DIY PreFab”, our innovative modular building solutions
                    have resulted in a remarkable 30% increase in production
                    efficiency. By streamlining the construction process and
                    integrating smart design with precision engineering, we help
                    our clients save time, reduce labor costs, and achieve
                    faster project completion—without compromising on quality.
                  </p>
                </div>
                <h3 className="overview-head">Overview</h3>
                <Row>
                  <Col md={6}>
                    <div className="project-left">
                      <p>
                        Welcome to the “DIY PreFab” Project Gallery – a showcase
                        of innovation, craftsmanship, and real-world
                        applications of our modular building solutions. Explore
                        a diverse range of completed projects, from modern
                        backyard studios and compact living spaces to functional
                        commercial units. Each build highlights the versatility,
                        durability, and aesthetic appeal of our prefab kits, all
                        customized to fit unique lifestyles and business needs.
                        Get inspired by what’s possible when smart design meets
                        DIY convenience.
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="project-right">
                      <img src={ImagePath.projectsmallimg} alt="Project Detail" />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="project-empower-wrap">
        <div className="project-empower-bg">
          <img src={ImagePath.featureproject} alt="Empower Background" />
        </div>
        <Container>
          <Row>
            <Col>
              <div className="project-empower-box">
                <h3>
                  Empower Your Future with Industrial Excellence, Seize the
                  Opportunity to Engineer Innovation
                </h3>
                <p>
                  Empower your future with industrial excellence, driving
                  progress through cutting-edge technology and smart solutions.
                  Seize the opportunity to engineer innovation and shape a
                  smarter, more efficient tomorrow.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <CounterCard />
        </Suspense>
      </ErrorBoundary>

      <WhyChooseUs
        desc={"World-class quality is our top priority, driving excellence in every detail we deliver."}
        title={"World class quality is our priority"}
        handleOpenVideo={handleOpenVideo}
      />

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <WaveWrapper />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoader height="200px" />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>

      {openVideo && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <VideoModal open={openVideo} onClose={handleOpenVideo} />
          </Suspense>
        </ErrorBoundary>
      )}
            {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default ProjectGallery;
